"use client";;
import React from "react";
import { Progress } from "@/components/ui/progress";

import { PolicyAreaId, PolicyOptionId } from "@/lib/types/policy_types";
export type PolicySelections = Partial<Record<PolicyAreaId, PolicyOptionId>>;


export const AgentMeter = React.memo(
  ({ name, happiness }: { name: string; happiness: number }) => (
    <div className="flex flex-col items-center space-y-1 w-28 text-center">
      <span className="text-xs font-bold text-black truncate" title={name}>
        {name}
      </span>
      <Progress
        value={happiness}
        className={`${
          happiness > 70
            ? "w-full h-2 [&>div]:bg-green-500"
            : "w-full h-2 [&>div]:bg-red-500"
        }`}
      />
    </div>
  )
);
AgentMeter.displayName = "AgentMeter";
