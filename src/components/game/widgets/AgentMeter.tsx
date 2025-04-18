"use client";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const AgentMeter = React.memo(
  ({ name, happiness }: { name: string; happiness: number }) => (
    <div className="flex flex-col items-center space-y-0.5 w-24 text-center">
      <span
        className="text-xs font-bold text-slate-800 truncate tracking-tight"
        title={name}
      >
        {name}
      </span>
      <Progress
        value={happiness}
        className={cn(
          "w-full h-2 rounded-full overflow-hidden",
          happiness > 66
            ? "[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500"
            : happiness > 33
              ? "[&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-yellow-500"
              : "[&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-500"
        )}
      />
    </div>
  )
);
AgentMeter.displayName = "AgentMeter";
