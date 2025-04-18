import { useTranslations } from "next-intl";
import { AgentMeter } from "./AgentMeter";
import { Building, Users, HeartHandshake } from "lucide-react";
import { AgentIsThinking } from "./AgentIsThinking";

interface AgentDisplayProps {
  agent1StateHappiness: number;
  agent2CitizensHappiness: number;
  agent3HumanRightsHappiness: number;
  isDeliberating: boolean;
}

export function AgentDisplay({
  agent1StateHappiness,
  agent2CitizensHappiness,
  agent3HumanRightsHappiness,
  isDeliberating,
}: AgentDisplayProps) {
  const t = useTranslations("");

  const agents = [
    {
      nameKey: "step3_agent1_name",
      happiness: agent1StateHappiness,
      icon: Building,
      colorClass: "text-blue-700 border-blue-300 bg-blue-50",
    },
    {
      nameKey: "step3_agent2_name",
      happiness: agent2CitizensHappiness,
      icon: Users,
      colorClass: "text-orange-700 border-orange-300 bg-orange-50",
    },
    {
      nameKey: "step3_agent3_name",
      happiness: agent3HumanRightsHappiness,
      icon: HeartHandshake,
      colorClass: "text-emerald-700 border-emerald-300 bg-emerald-50",
    },
  ];

  return (
    <div className="flex items-start justify-center space-x-4">
      <span className="text-xs font-bold text-white uppercase tracking-wider ml-1 mb-0.5 drop-shadow-sm">
        {t("phase1_agentHappiness")}
      </span>

      {agents.map((agent, index) => (
        <div
          key={index}
          className={`flex items-center space-x-4 px-6 py-2 rounded-md transition-all duration-300 ${agent.colorClass} hover:scale-105`}
        >
          <agent.icon
            className={`h-5 w-5 flex-shrink-0 ${
              agent.colorClass.split(" ")[0]
            }`}
            aria-hidden="true"
          />
          {isDeliberating && <AgentIsThinking />}
          {!isDeliberating && (
            <AgentMeter name={t(agent.nameKey)} happiness={agent.happiness} />
          )}
        </div>
      ))}
    </div>
  );
}
