"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, UserCheck } from "lucide-react";
import { PolicyArea, PolicyOptionId } from "@/lib/types/policy_types";
import { cn } from "@/lib/utils";
import { getColorForPolicyArea } from "@/components/game/widgets/policy_colors";
import { useTranslations } from "next-intl";

export const PolicyAreaBarItem: React.FC<{
  area: PolicyArea;
  isOptionSet: boolean;
  isActive: boolean;
  onClick: () => void;
  opponentSelection?: PolicyOptionId;
}> = React.memo(
  ({ area, isOptionSet, isActive, onClick, opponentSelection }) => {
    const t = useTranslations("");
    const accentColorClasses = getColorForPolicyArea(area.id);
    // Extract the color parts
    const [textColor, borderColor, ringColor] = accentColorClasses.split(" ");

    const hasOpponentSelection = !!opponentSelection;

    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={cn(
          "relative px-3 py-2 bg-white-force rounded-md border transition-all w-full h-full flex flex-col justify-center items-center text-center",
          isActive ? borderColor : "",
          isActive ? `ring-2 ${ringColor}` : "",
          isOptionSet && !isActive ? "border-green-400" : ""
        )}
        title={t(area.nameKey)}
      >
        <span
          className={cn("text-xs font-semibold truncate w-full", textColor)}
        >
          {t(area.nameKey)}
        </span>
        {isOptionSet && (
          <CheckCircle className="absolute top-1 right-1 h-3 w-3 text-green-500" />
        )}
        {hasOpponentSelection && (
          <UserCheck className="absolute top-1 left-1 h-3 w-3 text-blue-500" />
        )}
      </motion.button>
    );
  }
);
PolicyAreaBarItem.displayName = "PolicyAreaBarItem";
