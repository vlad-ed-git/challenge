"use client";;
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Coins } from "lucide-react";

import { PolicyArea, PolicyOption } from "@/lib/types/policy_types";
import { cn } from "@/lib/utils";
import { getColorForPolicyArea } from "@/components/game/widgets/policy_colors";
import { useTranslations } from "next-intl";

export const PolicyAreaTitle: React.FC<{
  activeArea: PolicyArea;
}> = React.memo(({ activeArea }) => {
  const t = useTranslations("");

  const accentColorClasses = getColorForPolicyArea(activeArea.id);
  const [textColor] = accentColorClasses.split(" ");
  

  return (
    <h3
      className={`text-xl font-semibold font-heading text-center mt-3 ${textColor}`}
    >
      {t(activeArea.nameKey)}
    </h3>
  );
});

export const FocusedPolicyOption: React.FC<{
  area: PolicyArea;
  option: PolicyOption;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}> = React.memo(({ option, area, isSelected, isDisabled, onSelect }) => {
  const t = useTranslations("");
  const selectionClass = isSelected
    ? "border-primary bg-green-50 border-2 shadow-inner"
    : "border-white bg-white hover:border-slate-400 hover:shadow-sm";
  const disabledClass = isDisabled
    ? "opacity-60 cursor-not-allowed"
    : "cursor-pointer";

  const accentColorClasses = getColorForPolicyArea(area.id);
  const [textColor, borderColor, ringColor, bgColor] =
    accentColorClasses.split(" ");

  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        `relative p-4 rounded-lg border transition-all flex flex-col`,
        selectionClass,
        disabledClass,
        isDisabled ? "" : "hover:shadow-md"
      )}
      onClick={!isDisabled ? onSelect : undefined}
    >
      <Badge
        variant="outline"
        className="absolute top-2 right-2 text-xs px-1.5 py-0.5 border-slate-300 text-black"
      >
        <Coins className="h-3 w-3 mr-1" /> {t("phase1_costLabel")}:{" "}
        <span className="font-bold">{option.cost}</span>
      </Badge>

      <p className={`text-base font-semibold mb-2 ${textColor} pr-16`}>
        {t(option.titleKey)}
      </p>
      <p className="text-sm text-black font-semibold mb-3 flex-grow">
        {t(option.descriptionKey)}
      </p>
      <div className="text-sm space-y-2 mt-auto border-t border-slate-100 pt-3">
        <p className="flex items-start text-green-800">
          <ThumbsUp className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
          <span>
            <strong className="font-medium">
              {t("phase1_advantageLabel")}:
            </strong>{" "}
            {t(option.advantageKey)}
          </span>
        </p>
        <p className="flex items-start text-red-800">
          <ThumbsDown className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-red-600" />
          <span>
            <strong className="font-medium">
              {t("phase1_disadvantageLabel")}:
            </strong>{" "}
            {t(option.disadvantageKey)}
          </span>
        </p>
      </div>
    </motion.div>
  );
});
FocusedPolicyOption.displayName = "FocusedPolicyOption";
