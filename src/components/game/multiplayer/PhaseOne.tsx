"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";

import { gamePolicyData } from "@/lib/types/policy_types";
import { PolicySelections } from "../types";
import { PolicyAreaBarItem } from "../widgets/PolicyAreaBarItem";
import {
  FocusedPolicyOption,
  PolicyAreaTitle,
} from "../widgets/FocusedPolicyOption";
import { ChatDisplay, ChatInput } from "../widgets/AiHelperChat";
import { BUDGET_LIMIT, useGameState } from "../widgets/UseGameState";
import { useAiHelper } from "../widgets/UseAiHelper";
import { BudgetDisplay } from "../widgets/BudgetDisplay";
import { GameSession } from "@/lib/firebase/multiplayer/fire_functions";

interface GamePhaseOneProps {
  sessionData: GameSession | null;
  onPhaseComplete: (selections: Required<PolicySelections>) => void;
}

export function PhaseOne({ onPhaseComplete }: GamePhaseOneProps) {
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
    initialSelections: {},
  });

  const { chatMessages, isAiHelperResponding, handleSendMessage } = useAiHelper(
    {
      selections,
      activeAreaId,
      currentCost,
      budgetExceeded,
      allAreasSelected,
      allAreasSelectedWithSameOption,
      canSubmit,
    }
  );

  const handleSubmit = () => {
    if (canSubmit) {
      const finalSelections = selections as Required<PolicySelections>;
      onPhaseComplete(finalSelections);
    } else {
      console.warn("Submit attempt failed: Conditions not met.", {
        allAreasSelected,
        budgetExceeded,
        allAreasSelectedWithSameOption: allAreasSelectedWithSameOption(),
      });
    }
  };

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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900 p-4 m-0">
      <div className="flex justify-between items-start mb-4 px-2">
        <div>
          <h2 className="text-lg font-bold font-heading text-primary-light">
            {t("phase1_instructionsTitle")}
          </h2>
        </div>

        <BudgetDisplay
          currentCost={currentCost}
          remainingBudget={remainingBudget}
          budgetExceeded={budgetExceeded}
          budgetLimit={BUDGET_LIMIT}
        />
      </div>

      <div className="flex-grow h-[550px] flex gap-4 overflow-hidden rounded-lg shadow-xl">
        <div className="flex-grow flex flex-col items-center relative w-2/3 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border border-slate-600">
          <div className="flex  w-full p-3 flex-row justify-between gap-2 ">
            <p className="text-sm text-white font-medium">
              {t("phase1_instructionsText")}
            </p>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center relative w-full overflow-y-hidden px-4 py-2">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 !h-[380px] overflow-y-auto custom-scrollbar">
                    {activeAreaData.options.map((option) => {
                      const isSelected =
                        selections[activeAreaData.id] === option.id;
                      const currentSelectionCost = selections[activeAreaData.id]
                        ? (activeAreaData.options.find(
                            (o) => o.id === selections[activeAreaData.id]
                          )?.cost ?? 0)
                        : 0;
                      const costIfSelected =
                        currentCost - currentSelectionCost + option.cost;
                      const isDisabled = !isSelected && costIfSelected > 14;

                      return (
                        <FocusedPolicyOption
                          key={option.id}
                          option={option}
                          isSelected={isSelected}
                          isDisabled={isDisabled}
                          area={activeAreaData}
                          onSelect={() =>
                            handleSelectOption(activeAreaData.id, option.id)
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
                    {t("phase1_selectAreaPrompt")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-1/3 flex flex-col border border-slate-300 rounded-lg bg-white shadow-lg flex-shrink-0 overflow-hidden">
          <div className="flex-grow overflow-hidden">
            <ChatDisplay messages={chatMessages} />
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            isSending={isAiHelperResponding}
          />
        </div>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="mt-1 flex items-center justify-between gap-4 px-3 rounded-lg bg-white border border-slate-300 w-full shadow-lg"
      >
        <div className="mb-1">
          {!canSubmit && !allAreasSelected && (
            <p className="text-xs text-orange-700 mt-1 text-center w-[180px]">
              {t("phase1_allAreasSelectedPrompt")}
            </p>
          )}
          {!canSubmit && allAreasSelected && budgetExceeded && (
            <p className="text-xs text-red-700 mt-1 text-center w-[180px] flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
              {t("phase1_budgetExceededWarning")}
            </p>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 flex-grow">
          {gamePolicyData.map((area) => (
            <motion.div key={area.id} variants={itemFadeUp}>
              <PolicyAreaBarItem
                area={area}
                isOptionSet={!!selections[area.id]}
                isActive={activeAreaId === area.id}
                onClick={() => handleAreaFocus(area.id)}
              />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-stone-300 disabled:text-black disabled:cursor-not-allowed px-6 py-3.5 h-full shadow-md hover:shadow-lg transition-all"
            size="lg"
            title={!canSubmit ? t("phase1_allAreasSelectedPrompt") : ""}
          >
            {t("phase1_confirmSelectionsButton")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
