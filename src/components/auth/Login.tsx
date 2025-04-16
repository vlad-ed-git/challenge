"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/firebase/auth";
import { mapAuthErrorToEnum } from "@/lib/firebase/auth_errors";
import { LoginFormValues, LoginSchema } from "@/lib/form_models/login_schema";

export function LoginForm() {
  const t = useTranslations();

  const auth = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.loadingUserProfile && auth.currentUserProfile) {
      console.log("User already logged in, redirecting...");
      router.replace("/game");
    }
  }, [auth.currentUserProfile, auth.loadingUserProfile, router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await auth.login(values.email, values.password);
    } catch (error: any) {
      const errorKey = mapAuthErrorToEnum(error.message || error.code);
      setServerError(t(errorKey) || t("errors.unknownError"));
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto py-12 md:py-20"
    >
      <Card className="border border-gray-200 bg-white shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold font-heading text-primary">
            {t("login_title")}
          </CardTitle>

          <CardDescription className="text-gray-600">
            {t("login_subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("emailLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        {...field}
                        className="bg-white border-gray-300 focus-visible:ring-primary focus-visible:border-primary text-gray-900 placeholder:text-gray-400"
                        disabled={isSubmitting}
                      />
                    </FormControl>

                    <FormMessage className="text-red-500">
                      {fieldState.error?.message && t(fieldState.error.message)}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-800">
                        {t("passwordLabel")}
                      </FormLabel>
                      <Link
                        href="/reset_password"
                        className="text-xs text-gray-600 hover:text-primary underline underline-offset-2"
                      >
                        {t("forgotPasswordLink")}
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("passwordPlaceholder")}
                        {...field}
                        className="bg-white border-gray-300 focus-visible:ring-primary focus-visible:border-primary text-gray-900 placeholder:text-gray-400"
                        disabled={isSubmitting}
                      />
                    </FormControl>

                    <FormMessage className="text-red-500">
                      {fieldState.error?.message && t(fieldState.error.message)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {serverError && (
                <p className="text-sm font-medium text-red-700 text-center bg-red-100 border border-red-300 p-3 rounded-md">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full text-lg py-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("loadingButton") : t("loginButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-4 border-t border-gray-200">
          {" "}
          <p className="text-sm text-gray-600">
            {t("noAccountPrompt")}{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2"
            >
              {t("signUpLink")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
