import { cn } from "@/lib/utils";
import { Crown, Users, Scale } from "lucide-react";

interface AgentDisplayProps {
  agent1StateHappiness: number;
  agent2CitizensHappiness: number;
  agent3HumanRightsHappiness: number;
}

export function AgentDisplay({
  agent1StateHappiness,
  agent2CitizensHappiness,
  agent3HumanRightsHappiness,
}: AgentDisplayProps) {
  const getHappinessColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getHappinessText = (score: number) => {
    if (score >= 70) return "Happy";
    if (score >= 40) return "Neutral";
    return "Unhappy";
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-row items-center gap-1 bg-white bg-opacity-10 backdrop-blur-sm p-2 rounded-lg">
        <div className="rounded-full bg-blue-600 p-2">
          <Crown className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white opacity-90">State</span>
          <span
            className={cn(
              "text-sm font-semibold",
              getHappinessColor(agent1StateHappiness)
            )}
          >
            {getHappinessText(agent1StateHappiness)}
          </span>
        </div>
      </div>

      <div className="flex flex-row items-center gap-1 bg-white bg-opacity-10 backdrop-blur-sm p-2 rounded-lg">
        <div className="rounded-full bg-green-600 p-2">
          <Users className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white opacity-90">Citizens</span>
          <span
            className={cn(
              "text-sm font-semibold",
              getHappinessColor(agent2CitizensHappiness)
            )}
          >
            {getHappinessText(agent2CitizensHappiness)}
          </span>
        </div>
      </div>

      <div className="flex flex-row items-center gap-1 bg-white bg-opacity-10 backdrop-blur-sm p-2 rounded-lg">
        <div className="rounded-full bg-purple-600 p-2">
          <Scale className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-white opacity-90">Human Rights</span>
          <span
            className={cn(
              "text-sm font-semibold",
              getHappinessColor(agent3HumanRightsHappiness)
            )}
          >
            {getHappinessText(agent3HumanRightsHappiness)}
          </span>
        </div>
      </div>
    </div>
  );
}
