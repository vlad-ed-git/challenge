import { PolicyAreaId, PolicyOptionId } from "@/lib/types/policy_types";
import { PolicySelections } from "../types";


export interface ChatMessageProps {
  sender: "user" | "ai_helper";
  text: string;
  context: string;
}

export interface GameStateHookReturn {
  selections: PolicySelections;
  activeAreaId: PolicyAreaId | null;
  activeAreaData: ReturnType<
    typeof import("@/lib/types/policy_types").gamePolicyData.find
  > | null;
  currentCost: number;
  remainingBudget: number;
  budgetExceeded: boolean;
  allAreasSelected: boolean;
  allAreasSelectedWithSameOption: () => boolean;
  canSubmit: boolean;
  handleSelectOption: (areaId: PolicyAreaId, optionId: PolicyOptionId) => void;
  handleAreaFocus: (areaId: PolicyAreaId) => void;
}

export interface AiHelperState {
  selections: PolicySelections;
  activeAreaId: PolicyAreaId | null;
  currentCost: number;
  budgetExceeded: boolean;
  allAreasSelected: boolean;
  allAreasSelectedWithSameOption: () => boolean;
  canSubmit: boolean;
}

export interface AiHelperHookReturn {
  chatMessages: ChatMessageProps[];
  isAiHelperResponding: boolean;
  handleSendMessage: (messageText: string) => Promise<void>;
}
