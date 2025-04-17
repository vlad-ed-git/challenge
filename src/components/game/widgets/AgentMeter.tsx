"use client";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const AgentMeter = React.memo(
  ({ name, happiness }: { name: string; happiness: number }) => (
    <div className="flex flex-col items-center space-y-0.5 w-24 text-center">
      <span
        className="text-[11px] font-semibold text-slate-800 truncate"
        title={name}
      >
        {name}
      </span>
      <Progress
        value={happiness}
        className={cn(
          "w-full h-1.5", 
          happiness > 66
            ? "[&>div]:bg-green-500"
            : happiness > 33
            ? "[&>div]:bg-yellow-500"
            : "[&>div]:bg-red-500"
        )}
      />
    </div>
  )
);
AgentMeter.displayName = "AgentMeter";
