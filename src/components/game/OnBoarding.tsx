// src/components/game/GameOnboarding.tsx

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Building,
  Users,
  HeartHandshake,
  MapPin,
  DollarSign,
  Languages,
  BookOpen,
  Handshake,
  AlertTriangle,
  UsersRound,
  Anchor,
  Flag,
  Rocket,
  Computer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GameOnboardingProps {
  onOnboardingComplete: () => void;
}

const onboardingSteps = [
  { id: "mode_choice", titleKey: "onboarding_mode_title" },
  { id: "setting", titleKey: "onboarding_setting_title" },
  { id: "role", titleKey: "onboarding_role_title" },
  { id: "agents", titleKey: "onboarding_agents_title" },
];

interface IconDisplayProps {
  icon: React.ElementType;
  className?: string;
}
const IconDisplay: React.FC<IconDisplayProps> = ({ icon: Icon, className }) => (
  <div className={cn("p-2 rounded-full bg-primary/10", className)}>
    <Icon className="h-5 w-5 text-primary" />
  </div>
);

export function GameOnboarding({ onOnboardingComplete }: GameOnboardingProps) {
  const t = useTranslations();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      setDirection(1);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onOnboardingComplete();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const currentStep = onboardingSteps[currentStepIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%", // Start off-screen
      opacity: 0,
      position: "absolute", // Keep absolute during transition
      width: "100%", // Ensure it takes width during transition
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      position: "relative", // Be relative when centered
      width: "100%",
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%", // Exit off-screen
      opacity: 0,
      position: "absolute", // Keep absolute during transition
      width: "100%", // Ensure it takes width during transition
      scale: 0.98,
      transition: { duration: 0.3, ease: [0.5, 0, 0.75, 0] },
    }),
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case "mode_choice":
        return (
          <ModeChoiceStep
            key="mode_choice"
            onNext={nextStep}
            t={t}
            direction={direction}
            variants={variants}
            itemVariants={listItemVariants}
          />
        );
      case "setting":
        return (
          <SettingStep
            key="setting"
            onNext={nextStep}
            onPrev={prevStep}
            t={t}
            direction={direction}
            variants={variants}
            itemVariants={listItemVariants}
          />
        );
      case "role":
        return (
          <RoleStep
            key="role"
            onNext={nextStep}
            onPrev={prevStep}
            t={t}
            direction={direction}
            variants={variants}
            itemVariants={listItemVariants}
          />
        );
      case "agents":
        return (
          <AgentsStep
            key="agents"
            onStart={nextStep}
            onPrev={prevStep}
            t={t}
            direction={direction}
            variants={variants}
            itemVariants={listItemVariants}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center w-full h-full overflow-hidden relative  text-white p-4">
      <motion.div
        className="absolute inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(to right, #4682B4 1px, transparent 1px), linear-gradient(to bottom, #4682B4 1px, transparent 1px)`,
          backgroundSize: `60px 60px`,
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{
          duration: 220,
          ease: "linear",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      <div className="relative w-full flex-grow flex flex-col overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}

// StepContainer updated to work with all step components
const StepContainer: React.FC<{
  children: React.ReactNode;
  stepKey: string;
  direction: number;
  variants: any;
}> = ({ children, stepKey, direction, variants }) => (
  <motion.div
    key={stepKey}
    custom={direction}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    className="w-full h-full flex flex-col items-center justify-between p-6 md:p-10 text-center"
  >
    <div className="w-full max-w-4xl flex flex-col items-center flex-grow justify-center">
      {children}
    </div>
  </motion.div>
);

// Mode Choice Step
const ModeChoiceStep: React.FC<{
  onNext: () => void;
  t: ReturnType<typeof useTranslations>;
  direction: number;
  variants: any;
  itemVariants: any;
}> = ({ onNext, t, direction, variants, itemVariants }) => (
  <StepContainer
    stepKey="mode_choice"
    direction={direction}
    variants={variants}
  >
    <div className="flex flex-col items-center justify-center flex-grow">
      <motion.h2
        className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {t("onboarding_mode_title")}
      </motion.h2>
      <p className="text-md text-slate-300 mb-8">
        {t("onboarding_mode_subtitle")}
      </p>
      <motion.div
        className="flex flex-col md:flex-row gap-6 max-w-2xl w-full"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <motion.div
          variants={itemVariants}
          className="flex-1 p-6 bg-slate-800/70 border border-primary rounded-lg text-center backdrop-blur-sm cursor-pointer transition-all hover:border-primary hover:ring-2 hover:ring-primary hover:shadow-lg"
          onClick={onNext}
        >
          <div className="mx-auto mb-4 rounded-full p-3 bg-primary/20 inline-block">
            <Computer className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">
            {t("onboarding_mode_single")}
          </h3>
          <p className="text-sm text-slate-300">
            {t("onboarding_mode_single_desc")}
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex-1 p-6 bg-slate-900/50 border border-slate-700 rounded-lg text-center backdrop-blur-sm opacity-50 cursor-not-allowed relative"
        >
          <div className="absolute top-2 right-2 bg-amber-500 text-amber-900 text-xs font-bold px-2 py-0.5 rounded">
            {t("coming_soon")}
          </div>
          <div className="mx-auto mb-4 rounded-full p-3 bg-slate-700/50 inline-block">
            <Users className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-400 mb-2">
            {t("onboarding_mode_multi")}
          </h3>
          <p className="text-sm text-slate-500">
            {t("onboarding_mode_multi_desc")}
          </p>
        </motion.div>
      </motion.div>
    </div>
    <div className="h-[56px]"></div>
  </StepContainer>
);

// Setting Step
const SettingStep: React.FC<{
  onNext: () => void;
  onPrev: () => void;
  t: ReturnType<typeof useTranslations>;
  direction: number;
  variants: any;
  itemVariants: any;
}> = ({ onNext, onPrev, t, direction, variants, itemVariants }) => {
  const settingItems = [
    { key: "onboarding_setting_context_overview", icon: MapPin },
    { key: "onboarding_setting_context_exclusion", icon: BookOpen },
    { key: "onboarding_setting_context_language", icon: Languages },
    { key: "onboarding_setting_context_instability", icon: Anchor },
    { key: "onboarding_setting_context_minority", icon: Users },
    { key: "onboarding_setting_context_refugee", icon: Flag },
    { key: "onboarding_setting_context_resources", icon: DollarSign },
    { key: "onboarding_setting_context_polarization", icon: AlertTriangle },
    { key: "onboarding_setting_context_reform", icon: Handshake },
  ];

  return (
    <StepContainer stepKey="setting" direction={direction} variants={variants}>
      <div className="w-full flex-grow overflow-y-auto custom-scrollbar pt-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t("onboarding_setting_title")}
        </motion.h2>
        <p className="text-md text-slate-300 mb-6">
          {t("onboarding_setting_intro")}
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {settingItems.map((item) => (
            <motion.div
              key={item.key}
              className="flex items-start p-3 bg-slate-800/70 border border-slate-700 rounded-lg space-x-3 text-left backdrop-blur-sm"
              variants={itemVariants}
            >
              <IconDisplay icon={item.icon} className="mt-0.5" />
              <span className="text-sm text-slate-200">{t(item.key)}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <StepNavigation
        onNext={onNext}
        onPrev={onPrev}
        t={t}
        nextLabel={t("onboarding_setting_cta")}
      />
    </StepContainer>
  );
};

// Role Step
const RoleStep: React.FC<{
  onNext: () => void;
  onPrev: () => void;
  t: ReturnType<typeof useTranslations>;
  direction: number;
  variants: any;
  itemVariants: any;
}> = ({ onNext, onPrev, t, direction, variants, itemVariants }) => (
  <StepContainer stepKey="role" direction={direction} variants={variants}>
    <div className="flex flex-col items-center justify-center flex-grow">
      <motion.h2
        className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {t("onboarding_role_title")}
      </motion.h2>
      <p className="text-md text-slate-300 mb-6">
        {t("onboarding_role_intro")}
      </p>
      <motion.div
        className="p-6 bg-slate-800/70 border border-slate-700 backdrop-blur-sm rounded-lg mb-8 max-w-2xl text-left space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p variants={itemVariants} className="text-lg text-slate-100">
          {t("onboarding_role_task")}
        </motion.p>
        <motion.ul
          className="list-none text-slate-300 space-y-2 pl-0"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.li variants={itemVariants} className="flex items-start">
            <span className="font-bold text-primary mr-2 mt-0.5">1.</span>
            {t("onboarding_role_phase1")}
          </motion.li>
          <motion.li variants={itemVariants} className="flex items-start">
            <span className="font-bold text-primary mr-2 mt-0.5">2.</span>
            {t("onboarding_role_phase2")}
          </motion.li>
          <motion.li variants={itemVariants} className="flex items-start">
            <span className="font-bold text-primary mr-2 mt-0.5">3.</span>
            {t("onboarding_role_phase3")}
          </motion.li>
        </motion.ul>
      </motion.div>
    </div>
    <StepNavigation
      onNext={onNext}
      onPrev={onPrev}
      t={t}
      nextLabel={t("onboarding_role_cta")}
    />
  </StepContainer>
);

// Agents Step
const AgentsStep: React.FC<{
  onStart: () => void;
  onPrev: () => void;
  t: ReturnType<typeof useTranslations>;
  direction: number;
  variants: any;
  itemVariants: any;
}> = ({ onStart, onPrev, t, direction, variants, itemVariants }) => {
  const agents = [
    {
      nameKey: "onboarding_agents_state_name",
      descKey: "onboarding_agents_state_desc",
      icon: Building,
      color: "blue",
    },
    {
      nameKey: "onboarding_agents_citizen_name",
      descKey: "onboarding_agents_citizen_desc",
      icon: UsersRound,
      color: "green",
    },
    {
      nameKey: "onboarding_agents_human_rights_name",
      descKey: "onboarding_agents_human_rights_desc",
      icon: HeartHandshake,
      color: "purple",
    },
  ];
  return (
    <StepContainer stepKey="agents" direction={direction} variants={variants}>
      <div className="flex flex-col items-center justify-center flex-grow">
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-heading text-primary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t("onboarding_agents_title")}
        </motion.h2>
        <p className="text-md text-slate-300 mb-8">
          {t("onboarding_agents_intro")}
        </p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {agents.map((agent) => (
            <motion.div
              key={agent.nameKey}
              className={`p-4 bg-${agent.color}-900/40 border border-${agent.color}-700 rounded-lg text-center backdrop-blur-sm`}
              variants={itemVariants}
            >
              <div
                className={`mx-auto mb-3 rounded-full p-2 bg-${agent.color}-600 inline-block`}
              >
                <agent.icon className="h-6 w-6 text-white" />
              </div>
              <h3
                className={`text-lg font-semibold text-${agent.color}-300 mb-1`}
              >
                {t(agent.nameKey)}
              </h3>
              <p className="text-sm text-slate-300">{t(agent.descKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <StepNavigation
        onNext={onStart}
        onPrev={onPrev}
        t={t}
        nextLabel={t("onboarding_agents_cta")}
        isFinalStep={true}
      />
    </StepContainer>
  );
};

// Navigation Component
const StepNavigation: React.FC<{
  onNext: () => void;
  onPrev?: () => void;
  t: ReturnType<typeof useTranslations>;
  nextLabel: string;
  isFinalStep?: boolean;
}> = ({ onNext, onPrev, t, nextLabel, isFinalStep = false }) => (
  <motion.div
    className="w-full max-w-4xl flex justify-between items-center mt-auto pt-6 flex-shrink-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <Button
      variant="outline"
      onClick={onPrev}
      className="bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
      aria-label={t("onboarding_general_back")}
      disabled={!onPrev}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      {t("onboarding_general_back")}
    </Button>
    <Button
      onClick={onNext}
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
      aria-label={nextLabel}
    >
      {nextLabel}
      {isFinalStep ? (
        <Rocket className="ml-2 h-4 w-4" />
      ) : (
        <ChevronRight className="ml-2 h-4 w-4" />
      )}
    </Button>
  </motion.div>
);
