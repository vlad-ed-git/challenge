

import { AlertTriangle, Coins, Landmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BudgetDisplayProps {
  currentCost: number;
  remainingBudget: number;
  budgetExceeded: boolean;
  budgetLimit: number;
}

export function BudgetDisplay({
  currentCost,
  remainingBudget,
  budgetExceeded,
  budgetLimit,
}: BudgetDisplayProps) {
  const t = useTranslations(""); 

  
  const remainingBudgetTextColor = budgetExceeded
    ? "text-red-600"
    : remainingBudget < budgetLimit * 0.25
    ? "text-orange-600" 
    : "text-green-600"; 

  return (
    <div className="flex flex-col items-end space-y-1">
      
      <span className="text-xs font-bold text-white uppercase tracking-wider mr-1 mb-0.5">
        {t("phase1_budgetStatusTitle")}
      </span>
      
      <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm min-w-[180px]">
        
        <div className="flex items-center justify-center w-full mb-1 text-xs font-medium text-slate-500">
          <Landmark className="h-3 w-3 mr-1.5 text-slate-400" />
          
          {t("phase1_totalBudgetLabel")}: {budgetLimit}{" "}
          {t("phase1_unitsSuffix")}
        </div>

        <div className="flex justify-between w-full items-baseline">
          
          <div className="flex items-baseline space-x-1">
            <Coins className="h-4 w-4 text-amber-500 self-center" />
            
            <span className="text-sm font-medium text-slate-700">
              {t("phase1_totalSpent")}
            </span>
            <span
              className={`font-bold text-xl ${
                budgetExceeded ? "text-red-600" : "text-slate-900"
              }`}
            >
              {currentCost}
            </span>
          </div>

          
          <div className="flex items-baseline space-x-1">
            
            <span className="text-sm font-medium text-slate-700">
              {t("phase1_remaining")}
            </span>
            
            <span className={cn("font-bold text-xl", remainingBudgetTextColor)}>
              {remainingBudget}
            </span>
            
            <span className="text-xs text-slate-500 self-end">
              {t("phase1_unitsSuffix")}
            </span>
          </div>
        </div>

        
        {budgetExceeded && (
          
          <p className="text-xs font-semibold text-red-600 flex items-center justify-center w-full pt-1 mt-1 border-t border-red-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            {t("phase1_budgetExceededWarning")}
          </p>
        )}
      </div>
    </div>
  );
}
