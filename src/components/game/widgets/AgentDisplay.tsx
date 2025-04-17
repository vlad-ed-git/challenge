import { useTranslations } from "next-intl";
import { AgentMeter } from "./AgentMeter";
import { Building, Users, HeartHandshake } from "lucide-react";

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
    <div className="flex flex-col items-start space-y-1">
      <span className="text-xs font-bold text-white uppercase tracking-wider ml-1 mb-0.5">
        {t("phase1_agentHappiness")}
      </span>

      <div className="flex justify-start items-stretch space-x-2 p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-300 shadow-md">
        {agents.map((agent, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 px-3 py-1 rounded ${agent.colorClass}`}
          >
            <agent.icon
              className={`h-4 w-4 flex-shrink-0 ${
                agent.colorClass.split(" ")[0]
              }`}
              aria-hidden="true"
            />
            <AgentMeter name={t(agent.nameKey)} happiness={agent.happiness} />
          </div>
        ))}
      </div>
    </div>
  );
}
