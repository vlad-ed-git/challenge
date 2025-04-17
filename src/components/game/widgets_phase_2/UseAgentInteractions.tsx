import { useState, useEffect, useCallback, useRef } from "react";
import { AgentChatMessageProps } from "./AgentChat";
import { formatSelectionsForPrompt, PolicySelections } from "../types";
import { PolicyAreaId, PolicyOptionId } from "@/lib/types/policy_types";

// Api route for agent interactions
enum AgentRole {
  STATE = "state",
  CITIZEN = "citizen",
  HUMAN_RIGHTS = "human_rights",
}

export interface AgentApiResponse {
  happiness: number;
  overallPovStatement: string;
  specificResponse: string;
  yourPackageSelections: string;
}

export interface AgentResponse {
  agent1: AgentApiResponse;
  agent2: AgentApiResponse;
  agent3: AgentApiResponse;
}

const callAgentApi = async (
  agentRole: AgentRole,
  selections: PolicySelections,
  agentSelections: string | null,
  userMessage: string | null
): Promise<AgentApiResponse | null> => {
  const response = await fetch(`/api/agents/${agentRole}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentUserSelections: formatSelectionsForPrompt(selections),
      agentPreferredSelections: agentSelections,
      userMessage: userMessage ?? "",
    }),
  });

  if (!response.ok) {
    let errorMsg = `API Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (parseError) {
      console.error("Failed to parse error response:", parseError);
    }
    console.error("API Error:", errorMsg);
    return null;
  }

  return (await response.json()) as AgentApiResponse;
};

const onPolicyChangeResponses = async (
  selections: PolicySelections,
  agent1Selections: string | null,
  agent2Selections: string | null,
  agent3Selections: string | null
): Promise<AgentResponse | null> => {
  // call all agents
  const agent1Response = await callAgentApi(
    AgentRole.STATE,
    selections,
    agent1Selections,
    null
  );
  const agent2Response = await callAgentApi(
    AgentRole.CITIZEN,
    selections,
    agent2Selections,
    null
  );
  const agent3Response = await callAgentApi(
    AgentRole.HUMAN_RIGHTS,
    selections,
    agent3Selections,
    null
  );
  if (!agent1Response || !agent2Response || !agent3Response) {
    return null;
  }

  return {
    agent1: agent1Response,
    agent2: agent2Response,
    agent3: agent3Response,
  };
};

const onAgentMessageResponse = async (
  message: string,
  targetAgent: AgentRole,
  selections: PolicySelections,
  agent1Selections: string | null,
  agent2Selections: string | null,
  agent3Selections: string | null
): Promise<AgentApiResponse | null> => {
  // call specific agent
  const agentResponse = await callAgentApi(
    targetAgent,
    selections,
    targetAgent === AgentRole.STATE
      ? agent1Selections
      : targetAgent === AgentRole.CITIZEN
      ? agent2Selections
      : agent3Selections,
    message
  );
  if (!agentResponse) {
    return null;
  }
  return agentResponse;
};

interface UseAgentInteractionsProps {
  selections: PolicySelections;
}

interface UseAgentInteractionsReturn {
  agentMessages: AgentChatMessageProps[];
  agentHappinessScores: number[];
  isResponding: boolean;
  sendMessageToAgent: (message: string) => void;
  canEndDeliberations: boolean;
  alertAgentsOfSelectionsChange: (
    selections: Partial<Record<PolicyAreaId, PolicyOptionId>>
  ) => void;
}

export function useAgentInteractions({
  selections,
}: UseAgentInteractionsProps): UseAgentInteractionsReturn {
  const [agent1Selections, setAgent1Selections] = useState<string | null>(null);
  const [agent2Selections, setAgent2Selections] = useState<string | null>(null);
  const [agent3Selections, setAgent3Selections] = useState<string | null>(null);
  const [agentMessages, setAgentMessages] = useState<AgentChatMessageProps[]>(
    []
  );
  const [agentHappinessScores, setAgentHappinessScores] = useState<number[]>([
    0.4, 0.4, 0.4,
  ]);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const prevSelectionsRef = useRef<PolicySelections>({});

  // Helper function to check if selections have actually changed
  const haveSelectionsChanged = (
    oldSelections: PolicySelections,
    newSelections: PolicySelections
  ): boolean => {
    const oldKeys = Object.keys(oldSelections);
    const newKeys = Object.keys(newSelections);

    if (oldKeys.length !== newKeys.length) return true;

    for (const key of newKeys) {
      if (
        oldSelections[key as PolicyAreaId] !==
        newSelections[key as PolicyAreaId]
      ) {
        return true;
      }
    }

    return false;
  };

  const respondToSelectionChanges = useCallback(
    async (newSelections: PolicySelections) => {
      try {
        // Return if already responding to avoid duplicate calls
        if (isResponding) return;

        // Only make API calls if selections have actually changed or this is initial call
        if (
          !isInitialized ||
          haveSelectionsChanged(prevSelectionsRef.current, newSelections)
        ) {
          setIsResponding(true);

          const responses = await onPolicyChangeResponses(
            newSelections,
            agent1Selections,
            agent2Selections,
            agent3Selections
          );

          if (!responses) {
            console.error("Failed to get agent responses");
            setIsResponding(false);
            return;
          }

          // Set agent selections
          setAgent1Selections(responses.agent1.yourPackageSelections);
          setAgent2Selections(responses.agent2.yourPackageSelections);
          setAgent3Selections(responses.agent3.yourPackageSelections);

          const initialMessages: AgentChatMessageProps[] = [
            {
              sender: "agent1",
              text: responses.agent1.specificResponse,
              timestamp: new Date(),
            },
            {
              sender: "agent2",
              text: responses.agent2.specificResponse,
              timestamp: new Date(Date.now() + 100),
            },
            {
              sender: "agent3",
              text: responses.agent3.specificResponse,
              timestamp: new Date(Date.now() + 200),
            },
          ];

          setAgentMessages(initialMessages);
          setAgentHappinessScores([
            responses.agent1.happiness,
            responses.agent2.happiness,
            responses.agent3.happiness,
          ]);

          // Update the stored previous selections
          prevSelectionsRef.current = { ...newSelections };
          setIsInitialized(true);
        }

        setIsResponding(false);
      } catch (error) {
        console.error("Error with agent responses:", error);
        setIsResponding(false);
      }
    },
    [
      isResponding,
      agent1Selections,
      agent2Selections,
      agent3Selections,
      isInitialized,
    ]
  );

  // Initialize agents on mount only once
  useEffect(() => {
    if (!isInitialized && Object.keys(selections).length > 0) {
      respondToSelectionChanges(selections);
    }
  }, [selections, respondToSelectionChanges, isInitialized]);

  // Manual notification function with proper change detection
  const alertAgentsOfSelectionChange = useCallback(
    (newSelections: Partial<Record<PolicyAreaId, PolicyOptionId>>) => {
      // Merge the new selections with existing ones
      const updatedSelections = {
        ...prevSelectionsRef.current,
        ...newSelections,
      };
      respondToSelectionChanges(updatedSelections);
    },
    [respondToSelectionChanges]
  );

  const sendMessageToSpecificAgent = useCallback(
    async (message: string) => {
      if (isResponding) return;

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
      let targetAgent: AgentRole | null = null;

      if (message.toLowerCase().includes("@state")) {
        targetAgent = AgentRole.STATE;
      } else if (message.toLowerCase().includes("@citizens")) {
        targetAgent = AgentRole.CITIZEN;
      } else if (
        message.toLowerCase().includes("@rights") ||
        message.toLowerCase().includes("@human")
      ) {
        targetAgent = AgentRole.HUMAN_RIGHTS;
      }

      if (!targetAgent) {
        setIsResponding(false);
        return;
      }

      try {
        const agentResponse = await onAgentMessageResponse(
          message,
          targetAgent,
          prevSelectionsRef.current, // Use the stored selections
          agent1Selections,
          agent2Selections,
          agent3Selections
        );

        if (!agentResponse) {
          console.error("Failed to get agent response");
          setIsResponding(false);
          return;
        }

        // Update agent selections if they were null
        if (agent1Selections === null && targetAgent === AgentRole.STATE) {
          setAgent1Selections(agentResponse.yourPackageSelections);
        }
        if (agent2Selections === null && targetAgent === AgentRole.CITIZEN) {
          setAgent2Selections(agentResponse.yourPackageSelections);
        }
        if (
          agent3Selections === null &&
          targetAgent === AgentRole.HUMAN_RIGHTS
        ) {
          setAgent3Selections(agentResponse.yourPackageSelections);
        }

        const newAgentMessage: AgentChatMessageProps = {
          sender:
            targetAgent === AgentRole.STATE
              ? "agent1"
              : targetAgent === AgentRole.CITIZEN
              ? "agent2"
              : "agent3",
          text: agentResponse.specificResponse,
          timestamp: new Date(),
        };

        // Update happiness score for the target agent
        const newHappinessScores = [...agentHappinessScores];
        const agentIndex =
          targetAgent === AgentRole.STATE
            ? 0
            : targetAgent === AgentRole.CITIZEN
            ? 1
            : 2;
        newHappinessScores[agentIndex] = agentResponse.happiness;

        // Slight delay for more natural-feeling conversation
        setTimeout(() => {
          setAgentMessages((prev) => [...prev, newAgentMessage]);
          setAgentHappinessScores(newHappinessScores);
          setIsResponding(false);
        }, 500);
      } catch (error) {
        console.error("Error sending message to agent:", error);
        setIsResponding(false);
      }
    },
    [
      isResponding,
      agentHappinessScores,
      agent1Selections,
      agent2Selections,
      agent3Selections,
    ]
  );

  // Determine if deliberations can end
  const canEndDeliberations = useCallback(() => {
    // Check if at least two agents are happy (score >= 0.5)
    return agentHappinessScores.filter((score) => score >= 0.5).length >= 2;
  }, [agentHappinessScores]);

  return {
    agentMessages,
    agentHappinessScores,
    isResponding,
    sendMessageToAgent: sendMessageToSpecificAgent,
    canEndDeliberations: canEndDeliberations(),
    alertAgentsOfSelectionsChange: alertAgentsOfSelectionChange,
  };
}
