import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bot, AlertCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const AGENT_COLORS = {
  agent1: "bg-blue-600",
  agent2: "bg-green-600",
  agent3: "bg-purple-600",
};

const AGENT_NAMES = {
  agent1: "State",
  agent2: "Citizens",
  agent3: "Human Rights",
};

export interface AgentChatMessageProps {
  sender: "user" | "agent1" | "agent2" | "agent3";
  text: string;
  timestamp: Date;
  agentHappinessScore: number;
}

export const AgentChatMessage: React.FC<AgentChatMessageProps> = ({
  sender,
  text,
  agentHappinessScore,
}) => {
  const isUser = sender === "user";
  const agentColor = isUser ? "" : AGENT_COLORS[sender];
  const agentName = isUser ? "You" : AGENT_NAMES[sender];
  const isAgentAndIsUnHappy = !isUser && agentHappinessScore < 0.5;
  
    return (
      <div
        className={cn(
          "flex mb-2 w-full",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        {!isUser && (
          <Avatar
            className={cn(
              "h-8 w-8 mr-2 flex items-center justify-center",
              agentColor
            )}
          >
            <Bot className="h-4 w-4 text-white" />
          </Avatar>
        )}
        <div className="flex flex-col max-w-[80%]">
          <span
            className={`text-xs ${isAgentAndIsUnHappy ? "text-red-500 font-semibold" : "text-slate-500"} mb-1`}
          >
            {agentName}
          </span>
          <div
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm break-words",
              isUser
                ? "bg-primary text-primary-foreground"
                : `font-semibold border ${isAgentAndIsUnHappy ? "border-red-500 bg-red-200 text-black " : "border-slate-200 bg-white text-black "}`
            )}
          >
            {text}
          </div>
        </div>
        {isUser && (
          <Avatar className="h-8 w-8 ml-2 bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </Avatar>
        )}
      </div>
    );
};

export interface AgentChatDisplayProps {
  messages: AgentChatMessageProps[];
  agentHappinessScores: number[];
}

enum StatusHappiness {
  Unhappy = "Unhappy",
  Neutral = "Neutral",
  Happy = "Happy",
}

const renderAgentHappiness = (
  agentHappinessScores: number[],
  agentIndex: number,
) =>{
  const happiness = agentHappinessScores[agentIndex];
    let statusColor = "bg-red-500";
    let statusHappiness: StatusHappiness = StatusHappiness.Unhappy;

    if (happiness >= 0.7) {
      statusColor = "bg-green-500";
      statusHappiness = StatusHappiness.Happy;
    } else if (happiness >= 0.4) {
      statusColor = "bg-yellow-500";
      statusHappiness = StatusHappiness.Neutral;
    }
  return {
    statusColor,
    statusHappiness,
  }
}
export const AgentChatDisplay: React.FC<AgentChatDisplayProps> = ({
  messages,
  agentHappinessScores,
}) => {
  const t = useTranslations();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderAgentStatus = (agentIndex: number) => {
    const{ statusColor } = renderAgentHappiness(agentHappinessScores, agentIndex);

    return (
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full ${statusColor} mr-1`}></div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-100 p-2 border-b border-slate-200">
        <h3 className="font-semibold text-sm text-black">Agent Discussion</h3>
        <div className="flex justify-between mt-1">
          <div className="flex items-center">
            <Avatar
              className={`h-6 w-6 mr-1 flex items-center justify-center ${AGENT_COLORS.agent1}`}
            >
              <Bot className="h-3 w-3 text-white" />
            </Avatar>
            <span className="text-xs mr-2 text-black">State</span>
            {renderAgentStatus(0)}
          </div>
          <div className="flex items-center">
            <Avatar
              className={`h-6 w-6 mr-1 flex items-center justify-center ${AGENT_COLORS.agent2}`}
            >
              <Bot className="h-3 w-3 text-white" />
            </Avatar>
            <span className="text-xs mr-2 text-black">Citizens</span>
            {renderAgentStatus(1)}
          </div>
          <div className="flex items-center">
            <Avatar
              className={`h-6 w-6 mr-1 flex items-center justify-center ${AGENT_COLORS.agent3}`}
            >
              <Bot className="h-3 w-3 text-white" />
            </Avatar>
            <span className="text-xs mr-2 text-black">Human Rights</span>
            {renderAgentStatus(2)}
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-2 bg-white custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <AlertCircle className="text-slate-400 h-8 w-8 mb-2" />
            <p className="text-center text-sm text-slate-400 italic">
              {t("phase2_waitingForAgentResponse")}
            </p>
            <p className="text-center text-xs text-slate-400 mt-2">
              {t("address_agent_hint")}
            </p>
          </div>
        )}
        {messages.map((msg, index) => (
          <AgentChatMessage
            key={index}
            sender={msg.sender}
            text={msg.text}
            timestamp={msg.timestamp}
            agentHappinessScore={msg.agentHappinessScore}
              
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export interface AgentChatInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

export const AgentChatInput: React.FC<AgentChatInputProps> = ({
  onSendMessage,
  isSending,
}) => {
  const [input, setInput] = useState("");
  const t = useTranslations();

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isSending) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-2 p-2 bg-slate-50 border-t border-slate-200 flex-shrink-0"
    >
      <Input
        type="text"
        placeholder="@state, @citizens, or @rights to address specific agents..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isSending}
        className="flex-grow bg-white border-slate-300 focus-visible:ring-primary focus-visible:border-primary text-slate-900 placeholder:text-slate-400"
      />
      <Button type="submit" disabled={isSending || !input.trim()} size="sm">
        {isSending ? t("phase2_chatSending") : t("phase2_chatSend")}
      </Button>
    </form>
  );
};
