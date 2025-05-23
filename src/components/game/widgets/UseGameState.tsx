import { useState, useMemo, useCallback } from "react";
import {
  PolicyAreaId,
  PolicyOptionId,
  gamePolicyData,
  policyAreaIdToString,
} from "@/lib/types/policy_types";
import {  GameStateHookReturn } from "./types";
import { PolicySelections } from "../types";

export const BUDGET_LIMIT = 14;

export function useGameState({
  initialSelections = {},
}: {
  initialSelections?: PolicySelections;
  }): GameStateHookReturn {
  
  const [selections, setSelections] = useState<PolicySelections>(
    initialSelections
  );
  const [activeAreaId, setActiveAreaId] = useState<PolicyAreaId | null>(
    gamePolicyData.length > 0 ? gamePolicyData[0].id : null
  );

  const activeAreaData = useMemo(() => {
    if (!activeAreaId) return null;
    return gamePolicyData.find((a) => a.id === activeAreaId);
  }, [activeAreaId]);

  const userIsCurrentlyViewingPolicy =
    useMemo(() => {
      if (!activeAreaId) return  "";
      return policyAreaIdToString(activeAreaId);
    }, [activeAreaId]);

  const currentCost = useMemo(() => {
    return Object.entries(selections).reduce((total, [areaId, optionId]) => {
      if (!optionId) return total;
      const area = gamePolicyData.find((a) => a.id === areaId);
      const option = area?.options.find((o) => o.id === optionId);
      return total + (option?.cost ?? 0);
    }, 0);
  }, [selections]);

  const remainingBudget = BUDGET_LIMIT - currentCost;

  const budgetExceeded = currentCost > BUDGET_LIMIT;

  const allAreasSelected = useMemo(
    () => gamePolicyData.every((area) => !!selections[area.id]),
    [selections]
  );

  const allAreasSelectedWithSameOption = useCallback(() => {
    const selectedOptions = Object.values(selections);
    if (selectedOptions.length <= 1) return false;

    const firstSelection = selectedOptions[0];
    return selectedOptions.every((optionId) => optionId === firstSelection);
  }, [selections]);

  const canSubmit = useMemo(
    () =>
      allAreasSelected && !allAreasSelectedWithSameOption() && !budgetExceeded,
    [allAreasSelected, allAreasSelectedWithSameOption, budgetExceeded]
  );

  const handleSelectOption = useCallback(
    (areaId: PolicyAreaId, optionId: PolicyOptionId) => {
      setSelections((prev) => ({
        ...prev,
        [areaId]: optionId,
      }));
    },
    []
  );

  const handleAreaFocus = useCallback((areaId: PolicyAreaId) => {
    setActiveAreaId(areaId);
  }, []);

  return {
    userIsCurrentlyViewingPolicy,
    selections,
    activeAreaId,
    activeAreaData,
    currentCost,
    remainingBudget,
    budgetExceeded,
    allAreasSelected,
    allAreasSelectedWithSameOption,
    canSubmit,
    handleSelectOption,
    handleAreaFocus,
  };
}
