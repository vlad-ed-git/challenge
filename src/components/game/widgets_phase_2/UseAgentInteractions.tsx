import { useState, useEffect, useCallback, useRef } from "react";
import { AgentChatMessageProps } from "./AgentChat";
import { PolicySelections } from "../types";
import { PolicyAreaId, PolicyOptionId } from "@/lib/types/policy_types";

// Mock API responses
const mockInitialAgentResponses = (selections: PolicySelections) => {
  // In a real implementation, this would be an API call
  return {
    agent1: {
      happiness: 0.6,
      message:
        "I see your initial policy choices. As a representative of the State, I have some concerns about the economic impact of these decisions.",
    },
    agent2: {
      happiness: 0.7,
      message:
        "These policies could work for many citizens, but there are some groups who might be left behind.",
    },
    agent3: {
      happiness: 0.5,
      message:
        "From a human rights perspective, I'd like to see stronger protections in several areas of your policy selections.",
    },
  };
};

// Mock API for policy changes
const mockPolicyChangeResponses = (
  selections: PolicySelections
) => {
  // In a real implementation, this would be an API call
  // Here we're simulating different responses based on changes
  return {
    agent1: {
      happiness: Math.random() * 0.5 + 0.5, // Random happiness between 0.5-1.0
      message: "I'm evaluating your current policy framework from the State's perspective.",
    },
    agent2: {
      happiness: Math.random() * 0.5 + 0.4, // Random happiness between 0.4-0.9
      message:  "I'm analyzing how these policies might impact different citizen groups.",
    },
    agent3: {
      happiness: Math.random() * 0.6 + 0.3, // Random happiness between 0.3-0.9
      message: "I'm considering whether these policies adequately protect fundamental human rights.",
    },
  };
};

// Mock API for agent messages
const mockAgentMessageResponse = (
  message: string,
  targetAgent: "agent1" | "agent2" | "agent3" | null
) => {
  // In a real implementation, this would be an API call
  if (targetAgent) {
    const responses = {
      agent1:
        "I appreciate your thoughts on state matters. Our primary concern is maintaining efficient governance while balancing the budget.",
      agent2:
        "Thank you for considering the citizens' perspective. People have diverse needs that must be addressed by these policies.",
      agent3:
        "Human rights must remain central to all policy decisions. I value your engagement on these important matters.",
    };

    return {
      [targetAgent]: {
        message: responses[targetAgent],
        happiness: Math.min(Math.random() * 0.3 + 0.7, 1.0), // Slight happiness boost
      },
    };
  }

  // Generic response if no specific agent targeted
  return {
    agent1: {
      message:
        "As the State agent, I should note that we need to consider budgetary constraints in this discussion.",
      happiness: 0.6,
    },
    agent2: {
      message:
        "Citizens have diverse needs. Your message raises important points about public impact.",
      happiness: 0.7,
    },
    agent3: {
      message:
        "Human rights considerations should be at the forefront. Let's ensure we don't overlook them.",
      happiness: 0.5,
    },
  };
};

interface UseAgentInteractionsProps {
  selections: PolicySelections;
  activeAreaId: PolicyAreaId | null;
  currentCost: number;
  budgetExceeded: boolean;
}

interface UseAgentInteractionsReturn {
  agentMessages: AgentChatMessageProps[];
  agentHappinessScores: number[];
  isResponding: boolean;
  sendMessageToAgent: (message: string) => void;
  canEndDeliberations: boolean;
  notifyAgentsOfAreaChange: (
    selections: Partial<Record<PolicyAreaId, PolicyOptionId>>
  ) => void;
}

export function useAgentInteractions({
  selections,
  activeAreaId,
  currentCost,
  budgetExceeded,
}: UseAgentInteractionsProps): UseAgentInteractionsReturn {
  const [agentMessages, setAgentMessages] = useState<AgentChatMessageProps[]>(
    []
  );
  const [agentHappinessScores, setAgentHappinessScores] = useState<number[]>([
    0.5, 0.5, 0.5,
  ]);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isProcessingChange, setIsProcessingChange] = useState<boolean>(false);
  const prevSelectionsRef = useRef<PolicySelections>({});

  // Initialize agent responses when component mounts
  useEffect(() => {
    const initializeAgents = async () => {
      if (isInitialized) return;

      setIsResponding(true);
      const responses = mockInitialAgentResponses(selections);

      const initialMessages: AgentChatMessageProps[] = [
        {
          sender: "agent1",
          text: responses.agent1.message,
          timestamp: new Date(),
        },
        {
          sender: "agent2",
          text: responses.agent2.message,
          timestamp: new Date(Date.now() + 100),
        },
        {
          sender: "agent3",
          text: responses.agent3.message,
          timestamp: new Date(Date.now() + 200),
        },
      ];

      setAgentMessages(initialMessages);
      setAgentHappinessScores([
        responses.agent1.happiness,
        responses.agent2.happiness,
        responses.agent3.happiness,
      ]);

      setIsResponding(false);
      setIsInitialized(true);
      prevSelectionsRef.current = { ...selections };
    };

    initializeAgents();
  }, [selections, isInitialized]);

  // Monitor for policy selection changes
  useEffect(() => {
    // Skip if not yet initialized or already processing a change
    if (!isInitialized || isProcessingChange) return;

    // Check if selections have actually changed
    const selectionsChanged = Object.keys({
      ...selections,
      ...prevSelectionsRef.current,
    }).some(
      (key) =>
        selections[key as PolicyAreaId] !==
        prevSelectionsRef.current[key as PolicyAreaId]
    );

    if (!selectionsChanged) return;

    // Find the changed area
    let changedAreaId: PolicyAreaId | null = null;
    for (const key of Object.keys({
      ...selections,
      ...prevSelectionsRef.current,
    })) {
      const areaId = key as PolicyAreaId;
      if (selections[areaId] !== prevSelectionsRef.current[areaId]) {
        changedAreaId = areaId;
        break;
      }
    }

    // Process the policy change
    setIsProcessingChange(true);
    setIsResponding(true);

    const responses = mockPolicyChangeResponses(selections);

    const newMessages: AgentChatMessageProps[] = [
      {
        sender: "agent1",
        text: responses.agent1.message,
        timestamp: new Date(),
      },
      {
        sender: "agent2",
        text: responses.agent2.message,
        timestamp: new Date(Date.now() + 100),
      },
      {
        sender: "agent3",
        text: responses.agent3.message,
        timestamp: new Date(Date.now() + 200),
      },
    ];

    setAgentMessages((prev) => [...prev, ...newMessages]);
    setAgentHappinessScores([
      responses.agent1.happiness,
      responses.agent2.happiness,
      responses.agent3.happiness,
    ]);

    // Update our reference to current selections
    prevSelectionsRef.current = { ...selections };

    setIsResponding(false);
    setIsProcessingChange(false);
  }, [selections, isInitialized, isProcessingChange]);

  // Manual notification function for policy area changes (needed for initial notification)
  const notifyAgentsOfAreaChange = useCallback(
    (selections: Partial<Record<PolicyAreaId, PolicyOptionId>>) => {
      setIsProcessingChange(true);
      setIsResponding(true);

      const responses = mockPolicyChangeResponses(selections);

      const newMessages: AgentChatMessageProps[] = [
        {
          sender: "agent1",
          text: responses.agent1.message,
          timestamp: new Date(),
        },
        {
          sender: "agent2",
          text: responses.agent2.message,
          timestamp: new Date(Date.now() + 100),
        },
        {
          sender: "agent3",
          text: responses.agent3.message,
          timestamp: new Date(Date.now() + 200),
        },
      ];

      setAgentMessages((prev) => [...prev, ...newMessages]);
      setAgentHappinessScores([
        responses.agent1.happiness,
        responses.agent2.happiness,
        responses.agent3.happiness,
      ]);

      setIsResponding(false);
      setIsProcessingChange(false);
    },
    [selections]
  );

  const sendMessageToAgent = useCallback(
    async (message: string) => {
      setIsResponding(true);

      // Add user message to chat
      setAgentMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: message,
          timestamp: new Date(),
        },
      ]);

      // Parse message to see if it's directed at a specific agent
      let targetAgent: "agent1" | "agent2" | "agent3" | null = null;

      if (message.toLowerCase().includes("@state")) {
        targetAgent = "agent1";
      } else if (message.toLowerCase().includes("@citizens")) {
        targetAgent = "agent2";
      } else if (
        message.toLowerCase().includes("@rights") ||
        message.toLowerCase().includes("@human")
      ) {
        targetAgent = "agent3";
      }

      const responses = mockAgentMessageResponse(message, targetAgent);

      // Build new messages based on which agents are responding
      const newAgentMessages: AgentChatMessageProps[] = [];
      const newHappinessScores = [...agentHappinessScores];

      // Only add messages from agents that responded
      Object.entries(responses).forEach(([agent, response], index) => {
        if (response) {
          newAgentMessages.push({
            sender: agent as "agent1" | "agent2" | "agent3",
            text: response.message,
            timestamp: new Date(Date.now() + index * 100),
          });

          // Update happiness for this agent
          const agentIndex =
            agent === "agent1" ? 0 : agent === "agent2" ? 1 : 2;
          newHappinessScores[agentIndex] = response.happiness;
        }
      });

      // Slight delay for more natural-feeling conversation
      setTimeout(() => {
        setAgentMessages((prev) => [...prev, ...newAgentMessages]);
        setAgentHappinessScores(newHappinessScores);
        setIsResponding(false);
      }, 1000);
    },
    [agentHappinessScores]
  );

  // Determine if deliberations can end
  const calculateCanEndDeliberations = useCallback(() => {
    // Check if all agents are unhappy
    const allAgentsUnhappy = agentHappinessScores.every((score) => score < 0.4);

    // Cannot end if all agents are unhappy
    if (allAgentsUnhappy) {
      return false;
    }

    // Cannot end if budget is exceeded
    if (budgetExceeded) {
      return false;
    }

    // Check if all policy areas have selections
    const hasAllSelections = Object.keys(selections).length >= 7; // All 7 policies must be selected

    return hasAllSelections;
  }, [agentHappinessScores, budgetExceeded, selections]);

  return {
    agentMessages,
    agentHappinessScores,
    isResponding,
    sendMessageToAgent,
    canEndDeliberations: calculateCanEndDeliberations(),
    notifyAgentsOfAreaChange,
  };
}
