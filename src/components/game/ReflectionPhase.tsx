"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { PolicySelections } from "./types";
import { ReflectionFormValues, reflectionQuestionKeys, ReflectionReportData, ReflectionSchema } from "@/lib/form_models/reflection_schema";
import { CheckCircle } from "lucide-react";
import { createReflection } from "@/lib/firebase/reflections/create_reflection";

interface ReflectionPhaseProps {
  phaseOneSelections: Required<PolicySelections> | null;
  phaseTwoSelections: Required<PolicySelections> | null;
  
  agent1StateHappiness: number;
  agent2CitizensHappiness: number;
  agent3HumanRightsHappiness: number;
  
  
}

export function ReflectionPhase({
  phaseOneSelections,
  phaseTwoSelections,
  agent1StateHappiness,
  agent2CitizensHappiness,
  agent3HumanRightsHappiness,
}: 
ReflectionPhaseProps) {
  const t = useTranslations(""); 
  const { currentUserProfile } = useAuth(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const form = useForm<ReflectionFormValues>({
    resolver: zodResolver(ReflectionSchema),
    
    defaultValues: reflectionQuestionKeys.reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as ReflectionFormValues),
  });

  const onSubmit = async (values: ReflectionFormValues) => {
    if (!currentUserProfile || !phaseOneSelections || !phaseTwoSelections) {
      setSubmitError("Missing required game data to submit reflection.");
      console.error("Missing data for report:", {
        currentUserProfile,
        phaseOneSelections,
        phaseTwoSelections,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const reportData: ReflectionReportData = {
      userId: currentUserProfile.uid,
      userProfileSnapshot: { ...currentUserProfile }, 
      phaseOneSelections: phaseOneSelections,
      phaseTwoSelections: phaseTwoSelections,
      agentHappiness: {
        state: agent1StateHappiness,
        citizen: agent2CitizensHappiness,
        humanRights: agent3HumanRightsHappiness,
      },
      reflectionAnswers: values,
      optional_feedback: values.optional_feedback || null,
      submittedAt: new Date(),
    };

    try {
      console.log("Submitting Report Data:", reportData);
      
      
        await createReflection(
            currentUserProfile.uid,
            reportData
      ); 

      await _sendReportEmail(reportData);
      

      setSubmitSuccess(true);
      console.log("Reflection submitted successfully!");
      
      
    } catch (error) {
      console.error("Failed to submit reflection:", error);
      setSubmitError(
        t("error_submitReflection") ||
          "Failed to submit reflection. Please try again."
      ); 
      setIsSubmitting(false);
    }
    
    
  };

  
  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto py-10 md:py-16"
    >
      <Card className="border border-gray-200 bg-white shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold font-heading text-primary">
            {t("reflection_title")}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t("reflection_subtitle")}
          </CardDescription>
        </CardHeader>

        {submitSuccess ? (
          <CardContent className="py-10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-black">
              Reflection Submitted!
            </p>
            <p className="text-gray-600 mt-2">
              Thank you for participating in the CHALLENGE.
            </p>
            {/* Add button to go home or next step if applicable */}
          </CardContent>
        ) : (
          <>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {reflectionQuestionKeys.map((key, index) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          {/* Use the key itself for translation */}
                          <FormLabel className="text-black font-semibold block">
                            {index + 1}. {t(key)}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                t("reflection_answerPlaceholder") ||
                                "Your thoughts..."
                              }
                              className="resize-none bg-white border-gray-300 focus-visible:ring-primary focus-visible:border-primary text-black placeholder:text-gray-700 min-h-[100px]"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500">
                            {/* Translate validation message */}
                            {fieldState.error?.message &&
                              t(fieldState.error.message)}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  ))}

                  {/* Optional feedback field */}
                  <FormField
                    control={form.control}
                    name="optional_feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black font-semibold block">
                          {t("optional_feedback")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              t("optional_feedback_placeholder")
                            }
                            className="resize-none bg-white border-gray-300 focus-visible:ring-primary focus-visible:border-primary text-black placeholder:text-gray-700 min-h-[100px]"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <p className="text-sm font-medium text-red-700 text-center bg-red-100 border border-red-300 p-3 rounded-md">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full text-lg py-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("reflection_loadingButton")
                      : t("reflection_submitButton")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}
      </Card>
    </motion.div>
  );
}

async function _sendReportEmail(report: ReflectionReportData) {
  try {
    const response = await fetch("/api/mail/mail-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send report email:", error);
  }
}