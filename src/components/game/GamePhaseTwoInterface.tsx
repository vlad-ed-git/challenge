"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";

import {
  gamePolicyData,
  PolicyAreaId,
  PolicyOptionId,
} from "@/lib/types/policy_types";
import { PolicySelections } from "./types";
import { PolicyAreaBarItem } from "./widgets/PolicyAreaBarItem";
import {
  FocusedPolicyOption,
  PolicyAreaTitle,
} from "./widgets/FocusedPolicyOption";
import { AgentDisplay } from "./widgets/AgentDisplay";
import { BudgetDisplay } from "./widgets/BudgetDisplay";
import { BUDGET_LIMIT, useGameState } from "./widgets/UseGameState";
import { useAgentInteractions } from "./widgets_phase_2/UseAgentInteractions";
import { AgentChatDisplay, AgentChatInput } from "./widgets_phase_2/AgentChat";

interface GamePhaseTwoProps {
  onPhaseComplete: (selections: Required<PolicySelections>, 
    agent1StateHappiness: number,
    agent2CitizensHappiness: number,
    agent3HumanRightsHappiness: number

  ) => void;
  phaseOneSelections: Required<PolicySelections> | null;
}

export function GamePhaseTwoInterface({
  onPhaseComplete,
  phaseOneSelections,
}: GamePhaseTwoProps) {
  const t = useTranslations();

  const {
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
  } = useGameState({
    initialSelections: phaseOneSelections || {},
  });

  const {
    agentMessages,
    agentHappinessScores,
    isResponding,
    sendMessageToAgent,
    canEndDeliberations,
    alertAgentsOfSelectionsChange,
  } = useAgentInteractions({
    selections,
  });

  // Only notify agents when the component mounts with initial selections
  useEffect(() => {
    if (Object.keys(selections).length > 0) {
      alertAgentsOfSelectionsChange(selections);
    }
    // This effect should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-calculate if all areas have the same option selected
  const hasSameOptionForAllAreas = useMemo(() => {
    return allAreasSelected ? allAreasSelectedWithSameOption() : false;
  }, [allAreasSelected, allAreasSelectedWithSameOption]);

  // Memoize the handler to prevent recreating it on every render
  const handleAreaFocusWithTracking = useCallback(
    (areaId: PolicyAreaId) => {
      handleAreaFocus(areaId);
    },
    [handleAreaFocus]
  );

  // Memoize the option selection handler
  const handleOptionSelection = useCallback(
    (areaId: PolicyAreaId, optionId: PolicyOptionId) => {
      handleSelectOption(areaId, optionId);
      // After selection changes, notify agents of the change (with debounce logic in useAgentInteractions)
      alertAgentsOfSelectionsChange({ [areaId]: optionId });
    },
    [handleSelectOption, alertAgentsOfSelectionsChange]
  );

  // Compute final submission eligibility with all relevant dependencies
  const canFinalSubmit = useMemo(() => {
    return canSubmit && !hasSameOptionForAllAreas && canEndDeliberations;
  }, [canSubmit, hasSameOptionForAllAreas, canEndDeliberations]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (allAreasSelected && canFinalSubmit) {
      const finalSelections = selections as Required<PolicySelections>;
      onPhaseComplete(finalSelections,
        agentHappinessScores[0],
        agentHappinessScores[1],
        agentHappinessScores[2]

      );
    } else {
      console.warn("Submit attempt failed: Cannot end deliberations yet.", {
        allAreasSelected,
        budgetExceeded,
        sameOptionUsedForAll: hasSameOptionForAllAreas,
        canEndDeliberations,
        canSubmit,
      });
    }
  }, [
    allAreasSelected,
    canFinalSubmit,
    selections,
    onPhaseComplete,
    budgetExceeded,
    hasSameOptionForAllAreas,
    canEndDeliberations,
    canSubmit,
  ]);

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-3 px-2">
        <AgentDisplay
          agent1StateHappiness={agentHappinessScores[0] * 100}
          agent2CitizensHappiness={agentHappinessScores[1] * 100}
          agent3HumanRightsHappiness={agentHappinessScores[2] * 100}
        />

        <BudgetDisplay
          currentCost={currentCost}
          remainingBudget={remainingBudget}
          budgetExceeded={budgetExceeded}
          budgetLimit={BUDGET_LIMIT}
        />
      </div>

      <div className="flex-grow flex gap-3 overflow-hidden max-h-[calc(100vh-300px)]">
        <div className="flex-grow flex flex-col items-center relative w-2/3 overflow-hidden">
          <div className="flex justify-center items-center">
            <div className="text-center max-w-xl px-4">
              <h2 className="text-lg font-semibold font-heading text-primary">
                {t("phase2_instructionsTitle")}
              </h2>
              <p className="text-sm text-white font-semibold">
                {t("phase2_instructionsText")}
              </p>
            </div>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center relative w-full overflow-y-auto custom-scrollbar px-2">
            <AnimatePresence mode="wait">
              {activeAreaData ? (
                <motion.div
                  key={activeAreaData.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl px-2"
                >
                  <PolicyAreaTitle activeArea={activeAreaData} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
                    {activeAreaData.options.map((option) => {
                      const isSelected =
                        selections[activeAreaData.id] === option.id;
                      const currentSelectionCost = selections[activeAreaData.id]
                        ? activeAreaData.options.find(
                            (o) => o.id === selections[activeAreaData.id]
                          )?.cost ?? 0
                        : 0;
                      const costIfSelected =
                        currentCost - currentSelectionCost + option.cost;
                      const isDisabled =
                        !isSelected && costIfSelected > BUDGET_LIMIT;

                      return (
                        <FocusedPolicyOption
                          key={option.id}
                          option={option}
                          isSelected={isSelected}
                          isDisabled={isDisabled}
                          area={activeAreaData}
                          onSelect={() =>
                            handleOptionSelection(activeAreaData.id, option.id)
                          }
                        />
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center text-white flex flex-col items-center"
                >
                  <Info className="h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-lg font-medium">
                    {t("phase2_selectAreaPrompt")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-1/3 flex flex-col border border-slate-200 rounded-lg bg-white shadow-sm flex-shrink-0 overflow-hidden">
          <div className="flex-grow overflow-hidden">
            <AgentChatDisplay
              messages={agentMessages}
              agentHappinessScores={agentHappinessScores}
            />
          </div>

          <AgentChatInput
            onSendMessage={sendMessageToAgent}
            isSending={isResponding}
          />
        </div>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="mt-2 flex items-center justify-between gap-3 md:gap-4 p-2 rounded-lg bg-slate-50 border border-slate-200 w-full"
      >
        <div className="grid grid-cols-7 gap-1 md:gap-2 flex-grow">
          {gamePolicyData.map((area) => (
            <motion.div key={area.id} variants={itemFadeUp}>
              <PolicyAreaBarItem
                area={area}
                isSelected={!!selections[area.id]}
                isActive={activeAreaId === area.id}
                onClick={() => handleAreaFocusWithTracking(area.id)}
              />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <Button
            onClick={handleSubmit}
            disabled={!allAreasSelected || !canFinalSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-slate-300 disabled:text-white disabled:cursor-not-allowed px-6 py-3 h-full"
            size="lg"
            title={
              !canFinalSubmit || !allAreasSelected
                ? t("phase2_cannotEndDeliberationsPrompt")
                : ""
            }
          >
            {t("phase2_endDeliberationsButton")}
          </Button>

          {!allAreasSelected && (
            <p className="text-xs text-orange-700 mt-1 text-center w-[180px]">
              {t("phase2_allAreasSelectedPrompt")}
            </p>
          )}
          {allAreasSelected && budgetExceeded && (
            <p className="text-xs text-red-700 mt-1 text-center w-[180px] flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
              {t("phase2_budgetExceededWarning")}
            </p>
          )}
          {allAreasSelected && !budgetExceeded && hasSameOptionForAllAreas && (
            <p className="text-xs text-red-700 mt-1 text-center w-[180px] flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
              {t("phase2_allSameOptionsWarning")}
            </p>
          )}
          {allAreasSelected &&
            !budgetExceeded &&
            !hasSameOptionForAllAreas &&
            !canEndDeliberations && (
              <p className="text-xs text-red-700 mt-1 text-center w-[180px] flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
                {t("phase2_allAgentsUnhappyWarning")}
              </p>
            )}
        </div>
      </motion.div>
    </div>
  );
}
