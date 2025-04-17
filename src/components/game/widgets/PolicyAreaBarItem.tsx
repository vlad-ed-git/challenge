"use client";;
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

import { PolicyArea } from "@/lib/types/policy_types";
import { cn } from "@/lib/utils";
import { getColorForPolicyArea } from "@/components/game/widgets/policy_colors";
import { useTranslations } from "next-intl";

export const PolicyAreaBarItem: React.FC<{
  area: PolicyArea;
  isSelected: boolean;
  isActive: boolean;
  onClick: () => void;
}> = React.memo(({ area, isSelected, isActive, onClick, }) => {
  const t = useTranslations("");
  const accentColorClasses = getColorForPolicyArea(area.id);
  const [textColor, borderColor, ringColor, bgColor] =
    accentColorClasses.split(" ");

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "relative text-left px-3 py-2 rounded-md border transition-all w-full h-full flex flex-col justify-center items-center text-center",
        isActive
          ? `${bgColor} ${borderColor} ring-2 ${ringColor}`
          : "bg-white border-slate-200 hover:bg-slate-50",
        isSelected && !isActive
          ? `${bgColor} border-green-400`
          : isActive
          ? ""
          : `border-slate-200 ${borderColor}`
      )}
      title={t(area.nameKey)}
    >
      <span className={cn("text-xs font-semibold truncate w-full", textColor)}>
        {t(area.nameKey)}
      </span>
      {isSelected && (
        <CheckCircle className="absolute top-1 right-1 h-3 w-3 text-green-500" />
      )}
    </motion.button>
  );
});
PolicyAreaBarItem.displayName = "PolicyAreaBarItem";
