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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  SignupFormValues,
  SignupSchema,
} from "@/lib/form_models/register_schema";
import { EducationalLevel } from "@/lib/firebase/users/profile";

export function RegisterForm() {
  const t = useTranslations();
  const auth = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.loadingUserProfile && auth.currentUserProfile) {
      router.replace("/game");
    }
  }, [auth.currentUserProfile, auth.loadingUserProfile, router]);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      age: 18,
      nationality: "",
      occupation: "Student",
      educationalLevel: EducationalLevel.BACHELORS_DEGREE,
      hasDisplacementExperience: false,
      displacementNarrative: "",
      currentCity: "Tempe",
      currentCountry: "United States",
    },
  });

  const { isSubmitting } = form.formState;

  const watchHasDisplacementExperience = form.watch(
    "hasDisplacementExperience"
  );

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    console.log("Signup form submitted with values:", values);
    try {
      await auth.signup(values.email, values.password);
    } catch (error: any) {
      console.error("Signup failed:", error);
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
      className="w-full max-w-lg mx-auto py-10 md:py-16"
    >
      <Card className="border border-gray-200 bg-white shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold font-heading text-primary">
            {t("register_title")}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t("register_subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    <FormLabel className="text-gray-800">
                      {t("passwordLabel")}
                    </FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("confirmPasswordLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("confirmPasswordPlaceholder")}
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
                name="age"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("ageLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
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
                name="nationality"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("nationalityLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                name="occupation"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("occupationLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                name="educationalLevel"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("educationLabel")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 data-[placeholder]:text-gray-400 focus:ring-primary focus:border-primary">
                          <SelectValue
                            placeholder={t("selectEducationPlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(EducationalLevel).map((levelKey) => (
                          <SelectItem key={levelKey} value={levelKey}>
                            {t(levelKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage className="text-red-500">
                      {fieldState.error?.message && t(fieldState.error.message)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasDisplacementExperience"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-gray-800">
                      {t("displacementLabel")}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value: string) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={
                          field.value === undefined
                            ? undefined
                            : String(field.value)
                        }
                        className="flex flex-col space-y-1"
                        disabled={isSubmitting}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-800">
                            {t("displacementYes")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-800">
                            {t("displacementNo")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-red-500">
                      {fieldState.error?.message && t(fieldState.error.message)}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {watchHasDisplacementExperience === true && (
                <FormField
                  control={form.control}
                  name="displacementNarrative"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        {t("narrativeLabel")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("narrativePlaceholder")}
                          className="resize-none bg-white border-gray-300 focus-visible:ring-primary focus-visible:border-primary text-gray-900 placeholder:text-gray-400"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500">
                        {fieldState.error?.message &&
                          t(fieldState.error.message)}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="currentCity"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("cityLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                name="currentCountry"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("countryLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                {isSubmitting ? t("loadingButton") : t("signUpButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {t("hasAccountPrompt")}{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2"
            >
              {t("loginLink")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
