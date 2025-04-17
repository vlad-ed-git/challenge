import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChatMessageProps, AiHelperState, AiHelperHookReturn } from "./types";
import { gamePolicyData } from "@/lib/types/policy_types";
import { BUDGET_LIMIT } from "./UseGameState";

export function useAiHelper({
  selections,
  activeAreaId,
  currentCost,
  budgetExceeded,
  allAreasSelected,
  allAreasSelectedWithSameOption,
  canSubmit,
}: AiHelperState): AiHelperHookReturn {
  const t = useTranslations("");
  const [chatMessages, setChatMessages] = useState<ChatMessageProps[]>([]);
  const [isAiHelperResponding, setIsAiHelperResponding] = useState(false);

  const generateAiHelperContext = useCallback(() => {
    let context = "Current Game State Context:\n\n";

    context += `Budget: ${currentCost} / ${BUDGET_LIMIT} units spent. Remaining: ${
      BUDGET_LIMIT - currentCost
    }.\n`;
    if (budgetExceeded) {
      context += "WARNING: Current selections exceed budget limit!\n";
    }
    context += "\n";

    context += "Current Policy Selections:\n";
    let selectionCount = 0;
    gamePolicyData.forEach((area) => {
      const selectedOptionId = selections[area.id];
      if (selectedOptionId) {
        const option = area.options.find((opt) => opt.id === selectedOptionId);
        context += `- ${area.id} (${t(area.nameKey)}): ${option?.id} (${t(
          option?.titleKey || "N/A"
        )}) - Cost: ${option?.cost}\n`;
        selectionCount++;
      } else {
        context += `- ${area.id} (${t(area.nameKey)}): Not Selected Yet\n`;
      }
    });
    context += `Total Areas Selected: ${selectionCount} / ${gamePolicyData.length}.\n\n`;

    if (activeAreaId) {
      const activeArea = gamePolicyData.find((a) => a.id === activeAreaId);
      if (activeArea) {
        context += `User is currently viewing options for Policy Area: ${activeAreaId} (${t(
          activeArea.nameKey
        )}).\n`;

        context += "Available options for this area:\n";
        activeArea.options.forEach((option) => {
          context += `- ${option.id} (${t(option.titleKey)}): Cost ${
            option.cost
          } - ${t(option.descriptionKey)}\n`;
        });
      } else {
        context += "User is viewing an area, but data is missing for it.\n";
      }
    } else {
      context +=
        "User is not currently focused on a specific policy area's options.\n";
    }

    context += "\nGame Progress Status:\n";
    context += `- Areas Selected: ${selectionCount}/${gamePolicyData.length}\n`;
    context += `- Budget Status: ${currentCost}/${BUDGET_LIMIT} (${
      budgetExceeded ? "EXCEEDED" : "Within limit"
    })\n`;
    context += `- Can Submit: ${canSubmit ? "Yes" : "No"}\n`;

    if (!canSubmit) {
      context += "Reasons for inability to submit:\n";
      if (!allAreasSelected)
        context += "- Not all policy areas have been selected yet\n";
      if (budgetExceeded) context += "- Budget limit has been exceeded\n";
      if (allAreasSelectedWithSameOption())
        context += "- All areas have the same option selected (need variety)\n";
    }

    return context;
  }, [
    selections,
    activeAreaId,
    currentCost,
    budgetExceeded,
    allAreasSelected,
    canSubmit,
    allAreasSelectedWithSameOption,
    t,
  ]);

  const callAiHelperApi = async (
    messageText: string,
    contextString: string
  ) => {
    const response = await fetch("/api/ai-helper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageText: messageText,
        context: contextString,
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
      return "";
    }

    const data = await response.json();
    const aiResponseText = data.response;
    if (!aiResponseText) {
      return "";
    }
    console.log("AI Response:", aiResponseText);
    return aiResponseText;
  };

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) return;

      const context = generateAiHelperContext();

      const newUserMessage: ChatMessageProps = {
        sender: "user",
        text: messageText,
        context: context,
      };
      setChatMessages((prev) => [...prev, newUserMessage]);
      setIsAiHelperResponding(true);

      let aiResponseText = await callAiHelperApi(messageText, context);

      const aiResponse: ChatMessageProps = {
        sender: "ai_helper",
        text: aiResponseText,
        context: "",
      };

      setChatMessages((prev) => [...prev, aiResponse]);
      setIsAiHelperResponding(false);
    },
    [
      selections,
      activeAreaId,
      currentCost,
      budgetExceeded,
      allAreasSelected,
      allAreasSelectedWithSameOption,
      generateAiHelperContext,
      t,
    ]
  );

  return {
    chatMessages,
    isAiHelperResponding,
    handleSendMessage,
  };
}
