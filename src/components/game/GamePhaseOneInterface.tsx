"use client";;
import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Coins, Info } from "lucide-react";

import { PolicyAreaId, PolicyOptionId } from "@/lib/types/policy_types";
export type PolicySelections = Partial<Record<PolicyAreaId, PolicyOptionId>>;

import { gamePolicyData } from "@/lib/types/policy_types";
import { AgentMeter } from "./AgentMeter";
import { PolicyAreaBarItem } from "./PolicyAreaBarItem";
import { FocusedPolicyOption } from "./FocusedPolicyOption";

interface GamePhaseOneProps {
  onPhaseComplete: (selections: Required<PolicySelections>) => void;
}


export function GamePhaseOneInterface({ onPhaseComplete }: GamePhaseOneProps) {
  const t = useTranslations();
  const [selections, setSelections] = useState<PolicySelections>({});

  const [activeAreaId, setActiveAreaId] = useState<PolicyAreaId | null>(
    gamePolicyData.length > 0 ? gamePolicyData[0].id : null
  );
  const budgetLimit = 14;

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

  const activeAreaData = useMemo(() => {
    if (!activeAreaId) return null;
    return gamePolicyData.find((a) => a.id === activeAreaId);
  }, [activeAreaId]);

  const currentCost = useMemo(() => {
    return Object.entries(selections).reduce((total, [areaId, optionId]) => {
      if (!optionId) return total;
      const area = gamePolicyData.find((a) => a.id === areaId);
      const option = area?.options.find((o) => o.id === optionId);
      return total + (option?.cost ?? 0);
    }, 0);
  }, [selections]);

  const remainingBudget = budgetLimit - currentCost;
  const allAreasSelected = gamePolicyData.every(
    (area) => !!selections[area.id]
  );
    
   
    const allAreasSelectedWithSameOption = () => {
        // checks if all the selections have the exact same option set
        const firstSelection = Object.values(selections)[0];
        return Object.values(selections).every(
          (optionId) => optionId === firstSelection
        );
  };  
  const budgetExceeded = currentCost > budgetLimit;
  const canSubmit = allAreasSelected && !allAreasSelectedWithSameOption() && !budgetExceeded;

  const handleSubmit = () => {
    if (canSubmit) {
      const finalSelections = selections as Required<PolicySelections>;
      onPhaseComplete(finalSelections);
    } else {
      console.warn("Submit attempt failed: Conditions not met.", {
        allAreasSelected,
        budgetExceeded,
        allAreasSelectedWithSameOption,
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
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-3 md:mb-4 px-1 md:px-2">
        <div className="flex flex-col items-start space-y-1">
          <span className="text-xs font-semibold text-white uppercase tracking-wider ml-1">
            {t("phase1_agentHappiness")}
          </span>
          <div className="flex justify-start items-center space-x-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
            <AgentMeter name={t("step3_agent1_name")} happiness={100} />
            <AgentMeter name={t("step3_agent2_name")} happiness={100} />
            <AgentMeter name={t("step3_agent3_name")} happiness={100} />
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <span className="text-xs font-semibold text-white uppercase tracking-wider mr-1">
            {t("phase1_budgetStatusTitle")}
          </span>
          <div className="flex flex-col items-end p-2 rounded-lg bg-slate-50 border border-slate-200 min-w-[180px]">
            <div className="flex items-center space-x-1 text-black">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">{t("phase1_totalSpent")}</span>
              <span
                className={`font-semibold text-base ${
                  budgetExceeded ? "text-red-600" : "text-slate-800"
                }`}
              >
                {currentCost}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-black">
              <Coins className="h-4 w-4 text-green-500" />
              <span className="text-sm">{t("phase1_remaining")}</span>
              <span
                className={`font-semibold text-base ${
                  remainingBudget < 0 ? "text-red-600" : "text-green-700"
                }`}
              >
                {remainingBudget}
              </span>
            </div>
            {budgetExceeded && (
              <p className="text-xs text-red-600 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />{" "}
                {t("phase1_budgetExceededWarning")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mb-3 md:mb-4">
        <div className="text-center max-w-xl px-4">
          <h2 className="text-lg font-semibold font-heading text-primary">
            {t("phase1_instructionsTitle")}
          </h2>
          <p className="text-sm text-white font-semibold">
            {t("phase1_instructionsText")}
          </p>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative mb-3 md:mb-4">
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
              <h3 className="text-xl font-semibold font-heading text-primary text-center mb-3">
                {t(activeAreaData.nameKey)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
                    !isSelected && costIfSelected > budgetLimit;

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
                      t={t}
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

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="mt-auto flex items-center justify-between gap-3 md:gap-4 p-2 rounded-lg bg-slate-50 border border-slate-200"
      >
        <div className="grid grid-cols-7 gap-1 md:gap-2 flex-grow">
          {gamePolicyData.map((area, index) => (
            <motion.div key={area.id} variants={itemFadeUp}>
              <PolicyAreaBarItem
                area={area}
                isSelected={!!selections[area.id]}
                isActive={activeAreaId === area.id}
                onClick={() => handleAreaFocus(area.id)}
                t={t}
              />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-slate-300 disabled:text-white disabled:cursor-not-allowed px-6 py-3 h-full"
            size="lg"
            title={!canSubmit ? t("phase1_allAreasSelectedPrompt") : ""}
          >
            {t("phase1_confirmSelectionsButton")}
          </Button>

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
      </motion.div>
    </div>
  );
}