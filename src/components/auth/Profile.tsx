"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  ProfileFormValues,
  ProfileSchema,
} from "@/lib/form_models/register_schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/firebase/auth";
import {
  EducationalLevel,
  getEducationLevelStringKey,
  UserProfile,
} from "@/lib/firebase/users/profile";
import { editProfile } from "@/lib/firebase/users/create_user";
import { useRouter } from "next/navigation";
import { Progress } from "../ui/progress";

export function ProfileForm() {
  const { currentUserProfile, loadingUserProfile } = useAuth();
  const route = useRouter();
  useEffect(() => {
    if (loadingUserProfile) return;
    if (!currentUserProfile) {
      route.push("/login");
      return;
    }
  }, [currentUserProfile, loadingUserProfile, route]);

  return !currentUserProfile ? (
    <div className="w-full flex flex-row items-center justify-center">
      <div className="w-[100px]">
        <Progress value={80} />
      </div>
    </div>
  ) : (
    <ProfileEditForm profile={currentUserProfile} />
  );
}

const ProfileEditForm = ({ profile }: { profile: UserProfile }) => {
  const t = useTranslations();
  const { refreshAuthProfile } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      age: profile.age ?? 18,
      nationality: profile.nationality ?? "",
      occupation: profile.occupation ?? "",
      educationalLevel: profile.educationalLevel ?? EducationalLevel.BACHELORS_DEGREE,
      hasDisplacementExperience: profile.displacementStatus.hasExperience ?? false,
      displacementNarrative: profile.displacementStatus.narrative || "",
      currentCity: profile.currentCity || "",
      currentCountry: profile.currentCountry || "",
      email: profile.email ?? "",
    },
  });

  const { isSubmitting } = form.formState;
  const watchHasDisplacementExperience = form.watch(
    "hasDisplacementExperience"
  );

  const onSubmit = async (values: ProfileFormValues) => {
    if (isSubmitting) return;
    setServerError(null);
    setUpdateSuccess(false);

    console.log("Updating profile with values:", values);
    try {
      const updateData = {
        age: values.age,
        nationality: values.nationality,
        occupation: values.occupation,
        educationalLevel: values.educationalLevel,
        hasDisplacementExperience: values.hasDisplacementExperience,
        narrative: values.hasDisplacementExperience
          ? values.displacementNarrative
          : null,
        currentCity: values.currentCity,
        currentCountry: values.currentCountry,
        email: values.email,
      };

      await editProfile(profile.uid, updateData);
      setUpdateSuccess(true);

      await refreshAuthProfile();
    } catch (error: any) {
      console.error("Profile update failed:", error);

      setServerError(
        t("profile_updateError") ||
          "Failed to update profile. Please try again."
      );
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
            {t("profile_title")}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t("profile_subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Display (Read-Only) - Fixed Structure */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      {t("emailLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        value={profile.email || "N/A"}
                        readOnly
                        className="bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      {t("profile_emailCannotChange")}
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* Age */}
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

              {/* Nationality */}
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

              {/* Occupation */}
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

              {/* Education Level */}
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
                            {t(getEducationLevelStringKey(levelKey))}
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

              {/* Displacement Experience */}
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
                        value={
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

              {/* Displacement Narrative (Conditional) */}
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

              {/* Current City */}
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

              {/* Current Country */}
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

              {/* Server Error Display */}
              {serverError && (
                <p className="text-sm font-medium text-red-700 text-center bg-red-100 border border-red-300 p-3 rounded-md">
                  {serverError}
                </p>
              )}

              {/* Success Message Display */}
              {updateSuccess && (
                <p className="text-sm font-medium text-green-700 text-center bg-green-100 border border-green-300 p-3 rounded-md">
                  {t("profile_updateSuccess")}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-lg py-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("profile_loadingButton")
                  : t("profile_updateButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
