import { PolicyAreaId, PolicyOptionId } from "@/lib/types/policy_types";

// Using Partial allows the object to be initially empty or incomplete.
export type PolicySelections = Partial<Record<PolicyAreaId, PolicyOptionId>>;

export enum GamePhase {
  ONBOARDING,
  PHASE_1_DECISION,
  PHASE_2_DIALOGUE,
  PHASE_3_REFLECTION,
}

export enum OnboardingStep {
  CHOOSE_MODE,
  WHO_YOU_ARE,
  WHO_AI_ARE,
  THE_GOAL,
  COMPLETE,
}
