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
    <div className="flex flex-row space-x-3  items-center justify-end">
      <span className="text-xs font-bold text-white uppercase tracking-wider mb-1 drop-shadow-sm">
        {t("phase1_budgetStatusTitle")}
      </span>

      <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-indigo-100 border border-indigo-300 shadow-md">
        <div className="flex items-center text-xs font-medium text-indigo-700">
          <Landmark className="h-4 w-4 mr-1 text-indigo-600" />
          <span className="font-bold">{budgetLimit}</span>
          <span className="ml-0.5">{t("phase1_unitsSuffix")}</span>
        </div>

        <div className="h-6 border-r border-indigo-300"></div>

        <div className="flex items-center">
          <Coins className="h-4 w-4 mr-1 text-yellow-400" />
          <span className="text-xs mr-1 font-bold text-indigo-900">
            {t("phase1_totalSpent")}
          </span>
          <span
            className={`font-bold ${budgetExceeded ? "text-red-600" : "text-slate-900"}`}
          >
            {currentCost}
          </span>
        </div>

        <div className="h-6 border-r border-indigo-300"></div>

        <div className="flex items-center">
          <span className="text-xs mr-1 font-bold text-indigo-900">
            {t("phase1_remaining")}
          </span>
          <span className={cn("font-bold", remainingBudgetTextColor)}>
            {remainingBudget}
          </span>
          <span className="text-xs  text-indigo-900 ml-0.5">
            {t("phase1_unitsSuffix")}
          </span>
        </div>

        {budgetExceeded && (
          <>
            <div className="h-6 border-r border-red-300"></div>
            <div className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-xs font-semibold ">
                {t("phase1_budgetExceededWarning")}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
