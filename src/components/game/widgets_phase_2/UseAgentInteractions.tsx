"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AgentChatMessageProps } from "./AgentChat";
import { formatSelectionsForPrompt, PolicySelections } from "../types";
import { PolicyAreaId, PolicyOptionId } from "@/lib/types/policy_types";
import { debounce } from "@/lib/debouce";

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

const callAgentApi = debounce(
  async (
    agentRole: AgentRole,
    selections: PolicySelections,
    agentSelections: string | null,
    userMessage: string | null,
    userIsCurrentlyViewingPolicy: string
  ): Promise<AgentApiResponse | null> => {
    try {
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
    } catch (error) {
      console.error("Network error calling agent API:", error);
      return null;
    }
  },
  1500 // 1.5 seconds debounce
);

// cache response for given selections so we don't call the api again
const agentResponseCache: Record<string, AgentResponse> = {};
const getCachedAgentResponse = (
  selections: PolicySelections,
  userIsCurrentlyViewingPolicy: string
): AgentResponse | null => {
  const cacheKey = `${JSON.stringify(selections)}-${userIsCurrentlyViewingPolicy}`;
  return agentResponseCache[cacheKey] || null;
};
const setCachedAgentResponse = (
  selections: PolicySelections,
  response: AgentResponse,
  userIsCurrentlyViewingPolicy: string
): void => {
  const cacheKey = `${JSON.stringify(selections)}-${userIsCurrentlyViewingPolicy}`;
  agentResponseCache[cacheKey] = response;
};

const onPolicyChangeResponses = async (
  selections: PolicySelections,
  agent1Selections: string | null,
  agent2Selections: string | null,
  agent3Selections: string | null,
  userIsCurrentlyViewingPolicy: string
): Promise<AgentResponse | null> => {
  // Check cache first
  const cachedResponse = getCachedAgentResponse(
    selections,
    userIsCurrentlyViewingPolicy
  );
  if (cachedResponse) {
    return cachedResponse;
  }
  // call all agents
  const agent1Response = await callAgentApi(
    AgentRole.STATE,
    selections,
    agent1Selections,
    null,
    userIsCurrentlyViewingPolicy
  );
  const agent2Response = await callAgentApi(
    AgentRole.CITIZEN,
    selections,
    agent2Selections,
    null,
    userIsCurrentlyViewingPolicy
  );
  const agent3Response = await callAgentApi(
    AgentRole.HUMAN_RIGHTS,
    selections,
    agent3Selections,
    null,
    userIsCurrentlyViewingPolicy
  );
  if (!agent1Response || !agent2Response || !agent3Response) {
    return null;
  }

  const response = {
    agent1: agent1Response,
    agent2: agent2Response,
    agent3: agent3Response,
  };

  // Cache the response
  setCachedAgentResponse(selections, response, userIsCurrentlyViewingPolicy);
  return response;
};

// cache agent response for given message so we don't call the api again
const agentMessageResponseCache: Record<string, AgentApiResponse> = {};
const getCachedAgentMessageResponse = (
  message: string,
  targetAgent: AgentRole,
  userIsCurrentlyViewingPolicy: string
): AgentApiResponse | null => {
  const cacheKey = `${targetAgent}-${message}-${userIsCurrentlyViewingPolicy}`;
  return agentMessageResponseCache[cacheKey] || null;
};
const setCachedAgentMessageResponse = (
  message: string,
  targetAgent: AgentRole,
  response: AgentApiResponse,
  userIsCurrentlyViewingPolicy: string
): void => {
  const cacheKey = `${targetAgent}-${message}-${userIsCurrentlyViewingPolicy}`;
  agentMessageResponseCache[cacheKey] = response;
};

const onAgentMessageResponse = async (
  message: string,
  targetAgent: AgentRole,
  selections: PolicySelections,
  agent1Selections: string | null,
  agent2Selections: string | null,
  agent3Selections: string | null,
  userIsCurrentlyViewingPolicy: string
): Promise<AgentApiResponse | null> => {
  // Check cache first
  const cachedResponse = getCachedAgentMessageResponse(
    message,
    targetAgent,
    userIsCurrentlyViewingPolicy
  );
  if (cachedResponse) {
    return cachedResponse;
  }
  // call specific agent
  const agentResponse = await callAgentApi(
    targetAgent,
    selections,
    targetAgent === AgentRole.STATE
      ? agent1Selections
      : targetAgent === AgentRole.CITIZEN
        ? agent2Selections
        : agent3Selections,
    message,
    userIsCurrentlyViewingPolicy
  );
  if (!agentResponse) {
    return null;
  }
  // Cache the response
  setCachedAgentMessageResponse(
    message,
    targetAgent,
    agentResponse,
    userIsCurrentlyViewingPolicy
  );
  return agentResponse;
};

interface UseAgentInteractionsProps {
  selections: PolicySelections;
  userIsCurrentlyViewingPolicy: string;
}

interface UseAgentInteractionsReturn {
  agentMessages: AgentChatMessageProps[];
  agentHappinessScores: number[];
  isResponding: boolean;
  sendMessageToAgent: (message: string) => void;
  canEndDeliberations: boolean;
  alertAgentsOfSelectionsChange: (
    selections: Partial<Record<PolicyAreaId, PolicyOptionId>>,
    userIsCurrentlyViewingPolicy: string
  ) => void;
}

export function useAgentInteractions({
  selections,
  userIsCurrentlyViewingPolicy,
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
    async (
      newSelections: PolicySelections,
      userIsCurrentlyViewingPolicy: string
    ) => {
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
            agent3Selections,
            userIsCurrentlyViewingPolicy
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
              agentHappinessScore: responses.agent1.happiness,
            },
            {
              sender: "agent2",
              text: responses.agent2.specificResponse,
              timestamp: new Date(Date.now() + 100),
              agentHappinessScore: responses.agent2.happiness,
            },
            {
              sender: "agent3",
              text: responses.agent3.specificResponse,
              timestamp: new Date(Date.now() + 200),
              agentHappinessScore: responses.agent3.happiness,
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
      respondToSelectionChanges(selections, userIsCurrentlyViewingPolicy);
    }
  }, [selections, respondToSelectionChanges, isInitialized]);

  // Manual notification function with proper change detection
  const alertAgentsOfSelectionChange = useCallback(
    (
      newSelections: Partial<Record<PolicyAreaId, PolicyOptionId>>,

      userIsCurrentlyViewingPolicy: string
    ) => {
      // Merge the new selections with existing ones
      const updatedSelections = {
        ...prevSelectionsRef.current,
        ...newSelections,
      };
      respondToSelectionChanges(
        updatedSelections,
        userIsCurrentlyViewingPolicy
      );
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
          agentHappinessScore: 0,
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
          agent3Selections,
          userIsCurrentlyViewingPolicy
        );

        if (!agentResponse) {
          console.error("Failed to get agent response");
          setIsResponding(false);
          return;
        }

        // Update agent selections if they were null
        if ( targetAgent === AgentRole.STATE) {
          setAgent1Selections(agentResponse.yourPackageSelections);
        }
        if (targetAgent === AgentRole.CITIZEN) {
          setAgent2Selections(agentResponse.yourPackageSelections);
        }
        if (
         
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
          agentHappinessScore: agentResponse.happiness,
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
        }, 200);
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
