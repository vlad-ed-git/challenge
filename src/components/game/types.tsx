import { PolicyAreaId, PolicyOptionId } from "@/lib/types/policy_types";

export type PolicySelections = Partial<Record<PolicyAreaId, PolicyOptionId>>;

export const formatSelectionsForPrompt = (
  selections: PolicySelections | null | undefined
): string => {
  if(!selections) return "";
  return Object.entries(selections)
    .map(([areaId, optionId]) => `- ${areaId}: ${optionId}`)
    .join("\n");
};

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
