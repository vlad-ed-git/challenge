"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, MessageSquare, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  gamePolicyData,
  PolicyAreaId,
  PolicyOptionId,
} from "@/lib/types/policy_types";
import { PolicySelections } from "../types";
import { PolicyAreaBarItem } from "../widgets/PolicyAreaBarItem";
import {
  FocusedPolicyOption,
  PolicyAreaTitle,
} from "../widgets/FocusedPolicyOption";
import { BUDGET_LIMIT, useGameState } from "../widgets/UseGameState";
import { UserProfile } from "@/lib/firebase/users/profile";
import {
  GameSession,
  ChatMessage,
  submitPlayerSelections,
} from "@/lib/firebase/multiplayer/fire_functions";
import { BudgetDisplay } from "../widgets/BudgetDisplay";
import { db } from "@/lib/firebase/config";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

interface PhaseDeliberatingProps {
  sessionData: GameSession | null;
  currentUserProfile: UserProfile;
}

export function PhaseDeliberating({
  sessionData,
  currentUserProfile,
}: PhaseDeliberatingProps) {
  const t = useTranslations();

  // Get opponent's data
  const currentUserParticipant = useMemo(() => {
    return sessionData?.participants.find(
      (p) => p.uid === currentUserProfile.uid
    );
  }, [sessionData, currentUserProfile]);

  const opponentParticipant = useMemo(() => {
    return sessionData?.participants.find(
      (p) => p.uid !== currentUserProfile.uid
    );
  }, [sessionData, currentUserProfile]);

  // Get initial selections from current user's Phase 1 submissions
  const initialSelections = useMemo(() => {
    return currentUserParticipant?.latestSelections || {};
  }, [currentUserParticipant]);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Game state using the existing hook
  const {
    selections,
    userIsCurrentlyViewingPolicy,
    activeAreaId,
    activeAreaData,
    currentCost,
    remainingBudget,
    budgetExceeded,
    allAreasSelected,
    allAreasSelectedWithSameOption,
    canSubmit,
    handleSelectOption,
    handleAreaFocus,
  } = useGameState({
    initialSelections: initialSelections,
  });

  // Track if we've reached consensus with opponent
  const [consensusReached, setConsensusReached] = useState(false);

  // Effect to listen for chat messages in sessionData
  useEffect(() => {
    if (sessionData?.chatMessages) {
      setChatMessages(sessionData.chatMessages);
    }
  }, [sessionData]);

  // Check for consensus by comparing selections with opponent
  useEffect(() => {
    if (!opponentParticipant?.latestSelections || !allAreasSelected) {
      setConsensusReached(false);
      return;
    }

    // Check if all selections match opponent's selections
    const allMatch = Object.entries(selections).every(([areaId, optionId]) => {
      return (
        opponentParticipant.latestSelections?.[areaId as PolicyAreaId] ===
        optionId
      );
    });

    setConsensusReached(allMatch);
  }, [selections, opponentParticipant, allAreasSelected]);

  const hasSameOptionForAllAreas = useMemo(() => {
    return allAreasSelected ? allAreasSelectedWithSameOption() : false;
  }, [allAreasSelected, allAreasSelectedWithSameOption]);

  const handleAreaFocusWithTracking = useCallback(
    (areaId: PolicyAreaId) => {
      handleAreaFocus(areaId);
    },
    [handleAreaFocus]
  );

  const handleOptionSelection = useCallback(
    (areaId: PolicyAreaId, optionId: PolicyOptionId) => {
      handleSelectOption(areaId, optionId);

      // Send update to opponent via chat
      const areaName =
        gamePolicyData.find((area) => area.id === areaId)?.nameKey || areaId;
      const optionNumber =
        optionId === PolicyOptionId.OPTION_1
          ? 1
          : optionId === PolicyOptionId.OPTION_2
            ? 2
            : 3;

      sendSystemMessage(
        `${t("multiplayer_selectedOption", { areaName: t(areaName), optionNumber })}`
      );
    },
    [handleSelectOption, t]
  );

  const canFinalSubmit = useMemo(() => {
    return canSubmit && !hasSameOptionForAllAreas && consensusReached;
  }, [canSubmit, hasSameOptionForAllAreas, consensusReached]);

  // Send a message to chat
  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionData?.sessionId) return;

    setIsSendingMessage(true);
    try {
      const message: ChatMessage = {
        uid: currentUserProfile.uid,
        displayName:
          currentUserProfile.email.split("@")[0],
        message: newMessage.trim(),
        timestamp: Date.now(),
      };

      // Update Firebase with new message
      const sessionRef = doc(db, "multiplayer_sessions", sessionData.sessionId);
      await updateDoc(sessionRef, {
        chatMessages: arrayUnion(message),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: t("multiplayer_error_messageSendFailed"),
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Send a system message
  const sendSystemMessage = async (messageText: string) => {
    if (!sessionData?.sessionId) return;

    try {
      const message: ChatMessage = {
        uid: "system",
        displayName: "System",
        message: messageText,
        timestamp: Date.now(),
      };

      // Update Firebase with new message
      const sessionRef = doc(db, "multiplayer_sessions", sessionData.sessionId);
      await updateDoc(sessionRef, {
        chatMessages: arrayUnion(message),
      });
    } catch (error) {
      console.error("Error sending system message:", error);
    }
  };

  // Submit final decisions
  const handleSubmit = async () => {
    if (allAreasSelected && canFinalSubmit && sessionData?.sessionId) {
      try {
        const finalSelections = selections as Required<PolicySelections>;

        // Update the user's selections in Firebase
        const result = await submitPlayerSelections(
          sessionData.sessionId,
          currentUserProfile.uid,
          finalSelections
        );

        if (!result.success) {
          toast({
            variant: "destructive",
            title: t("multiplayer_error_submitFailed"),
            description: t(result.message) || "",
          });
          return;
        }

        // If user is host and consensus is reached, update the session status
        if (currentUserProfile.uid === sessionData.hostUid) {
          const sessionRef = doc(
            db,
            "multiplayer_sessions",
            sessionData.sessionId
          );
          await updateDoc(sessionRef, {
            status: "phase3_reflection",
          });
        }

        toast({
          title: t("multiplayer_toast_finalSubmitted"),
          description: t("multiplayer_toast_waitingForNextPhase"),
        });
      } catch (error) {
        console.error("Error submitting final decisions:", error);
        toast({
          variant: "destructive",
          title: t("multiplayer_error_submitFailed"),
        });
      }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900 p-4 m-0">
      <div className="flex justify-between items-start mb-4 px-2">
        <div className="flex items-center space-x-4">
          <div className="bg-slate-700 rounded-lg p-2 shadow-md">
            <Users className="h-5 w-5 text-blue-300 mr-2 inline" />
            <span className="text-white text-sm font-medium">
              {t("multiplayer_deliberationWith", {
                name:
                  opponentParticipant?.displayName || t("multiplayer_unknown"),
              })}
            </span>
          </div>

          {consensusReached && (
            <div className="bg-green-700 rounded-lg p-2 shadow-md">
              <span className="text-white text-sm font-medium">
                {t("multiplayer_consensusReached")}
              </span>
            </div>
          )}
        </div>

        <BudgetDisplay
          currentCost={currentCost}
          remainingBudget={remainingBudget}
          budgetExceeded={budgetExceeded}
          budgetLimit={BUDGET_LIMIT}
        />
      </div>

      <div className="flex-grow h-[550px] flex gap-4 overflow-hidden rounded-lg shadow-xl">
        <div className="flex-grow flex flex-col items-center relative w-2/3 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg border border-slate-600">
          <div className="flex  w-full p-3 flex-row justify-between gap-2">
            <h2 className="text-lg font-semibold font-heading text-primary-light">
              {t("multiplayer_deliberationTitle")}
            </h2>
            <p className="text-sm text-white font-medium">
              {t("multiplayer_deliberationInstructions")}
            </p>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center relative w-full overflow-y-hidden px-4 py-2">
            <AnimatePresence mode="wait">
              {activeAreaData ? (
                <motion.div
                  key={activeAreaData.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl px-2"
                >
                  <PolicyAreaTitle activeArea={activeAreaData} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 !h-[380px] overflow-y-auto custom-scrollbar">
                    {activeAreaData.options.map((option) => {
                      const isSelected =
                        selections[activeAreaData.id] === option.id;
                      const currentSelectionCost = selections[activeAreaData.id]
                        ? (activeAreaData.options.find(
                            (o) => o.id === selections[activeAreaData.id]
                          )?.cost ?? 0)
                        : 0;
                      const costIfSelected =
                        currentCost - currentSelectionCost + option.cost;
                      const isDisabled =
                        !isSelected && costIfSelected > BUDGET_LIMIT;

                      // Show what opponent selected for this area
                      const opponentSelected =
                        opponentParticipant?.latestSelections?.[
                          activeAreaData.id
                        ] === option.id;

                      return (
                        <FocusedPolicyOption
                          key={option.id}
                          option={option}
                          isSelected={isSelected}
                          isDisabled={isDisabled}
                          area={activeAreaData}
                          onSelect={() =>
                            handleOptionSelection(activeAreaData.id, option.id)
                          }
                          opponentSelected={opponentSelected}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center text-white flex flex-col items-center"
                >
                  <Info className="h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-lg font-medium">
                    {t("multiplayer_selectAreaPrompt")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-1/3 flex flex-col border border-slate-300 rounded-lg bg-white shadow-lg flex-shrink-0 overflow-hidden">
          <div className="flex-grow overflow-hidden flex flex-col">
            <div className="p-2 bg-slate-100 border-b border-slate-200">
              <h3 className="font-medium text-slate-700">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                {t("multiplayer_chatTitle")}
              </h3>
            </div>

            <div className="flex-grow overflow-y-auto p-3 space-y-2">
              {chatMessages.length === 0 ? (
                <div className="text-center text-slate-400 mt-4">
                  {t("multiplayer_noChatMessages")}
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg max-w-[85%] ${
                      msg.uid === currentUserProfile.uid
                        ? "ml-auto bg-blue-100 text-blue-800"
                        : msg.uid === "system"
                          ? "mx-auto bg-slate-100 text-slate-600 text-xs italic"
                          : "mr-auto bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.uid !== "system" && (
                      <div className="text-xs font-medium mb-1">
                        {msg.uid === currentUserProfile.uid
                          ? t("multiplayer_chatYou")
                          : msg.displayName}
                      </div>
                    )}
                    <div>{msg.message}</div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 border-t border-slate-200 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSendingMessage) {
                    sendMessage();
                  }
                }}
                placeholder={t("multiplayer_chatPlaceholder")}
                className="flex-grow px-3 py-2 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSendingMessage}
              />
              <Button
                onClick={sendMessage}
                disabled={isSendingMessage || !newMessage.trim()}
                className="rounded-l-none"
              >
                {t("multiplayer_sendButton")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="mt-1 flex items-center justify-between gap-4 px-3 rounded-lg bg-white border border-slate-300 w-full shadow-lg"
      >
        <div className="mb-1">
          {!allAreasSelected && (
            <p className="text-xs text-orange-700 mt-1 text-center w-[180px]">
              {t("multiplayer_allAreasSelectedPrompt")}
            </p>
          )}
          {allAreasSelected && budgetExceeded && (
            <p className="text-xs text-red-700 mt-1 text-center w-[180px] flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
              {t("multiplayer_budgetExceededWarning")}
            </p>
          )}
          {allAreasSelected && !budgetExceeded && hasSameOptionForAllAreas && (
            <p className="text-xs text-red-700 mt-1 text-center w-[180px] flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
              {t("multiplayer_allSameOptionsWarning")}
            </p>
          )}
          {allAreasSelected &&
            !budgetExceeded &&
            !hasSameOptionForAllAreas &&
            !consensusReached && (
              <p className="text-xs text-red-700 mt-1 text-center w-[180px] flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />{" "}
                {t("multiplayer_noConsensusWarning")}
              </p>
            )}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 flex-grow">
          {gamePolicyData.map((area) => (
            <motion.div key={area.id} variants={itemFadeUp}>
              <PolicyAreaBarItem
                area={area}
                isOptionSet={!!selections[area.id]}
                isActive={activeAreaId === area.id}
                onClick={() => handleAreaFocusWithTracking(area.id)}
                opponentSelection={
                  opponentParticipant?.latestSelections?.[area.id]
                }
              />
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <Button
            onClick={handleSubmit}
            disabled={!allAreasSelected || !canFinalSubmit || isSendingMessage}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-stone-300 disabled:text-black disabled:cursor-not-allowed px-6 py-3.5 h-full shadow-md hover:shadow-lg transition-all"
            size="lg"
            title={
              !canFinalSubmit || !allAreasSelected
                ? t("multiplayer_cannotSubmitPrompt")
                : ""
            }
          >
            {t("multiplayer_submitFinalButton")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
