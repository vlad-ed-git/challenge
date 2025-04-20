"use client";;
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { UserProfile } from "@/lib/firebase/users/profile";
import { JoinOrCreateSession } from "./JoinOrCreateSession";
import { Lobby } from "./Lobby";
import { PhaseOne } from "./PhaseOne";
import {
  createGameSession,
  joinGameSession,
  startGameSession,
  submitPlayerSelections,
  observeGameSession,
  GameSession,
} from "@/lib/firebase/multiplayer/fire_functions";
import { PolicySelections } from "../types";
import { Unsubscribe } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { PhaseDeliberating } from "./PhaseDeliberating";

interface MultiplayerModeInterfaceProps {
  currentUserProfile: UserProfile;
}

enum MultiplayerPhaseOneStep {
  JOIN_OR_CREATE,
  LOBBY,
  SELECTING_POLICIES,
  DELIBERATING,
  REFLECTING,
  COMPLETED,
}

export function MultiplayerModeInterface({
  currentUserProfile,
}: MultiplayerModeInterfaceProps) {
  const t = useTranslations();

  const [mpStep, setMpStep] = useState<MultiplayerPhaseOneStep>(
    MultiplayerPhaseOneStep.JOIN_OR_CREATE
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<GameSession | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // Cleanup Firebase listener on component unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        console.log("Cleaning up Multiplayer Firestore listener.");
        unsubscribeRef.current();
      }
    };
  }, []);

  // Set up Firebase listener when sessionId changes
  useEffect(() => {
    if (!sessionId) {
      // Clean up existing listener if sessionId is cleared
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    // Don't set up a new listener if one already exists
    if (unsubscribeRef.current) return;

    console.log(`Setting up Firestore listener for session: ${sessionId}`);
    try {
      const unsubscribe = observeGameSession(sessionId, (data) => {
        console.log("Received session update:", data);
        setSessionData(data);

        // Automatically transition from lobby to selection when host starts the game
        if (
          data.status === "phase1_selection" &&
          mpStep === MultiplayerPhaseOneStep.LOBBY
        ) {
          console.log(
            "Session status changed to phase1_selection, moving to policy selection UI."
          );
          setMpStep(MultiplayerPhaseOneStep.SELECTING_POLICIES);
        }
      });
      unsubscribeRef.current = unsubscribe;
    } catch (error) {
      console.error("Error setting up session listener:", error);
      toast({
        variant: "destructive",
        title: t("multiplayer_error_sessionListener"),
      });

      setSessionId(null);
      setSessionData(null);
      setMpStep(MultiplayerPhaseOneStep.JOIN_OR_CREATE);
    }
  }, [sessionId, mpStep, t]);

  // Create a new game session
  const handleCreateSession = async () => {
    if (isLoadingAction) return;
    setIsLoadingAction(true);
    setJoinError(null);
    try {
      const newSessionId = await createGameSession(
        currentUserProfile.uid,
        currentUserProfile.email.split("@")[0]
      );
      if (newSessionId) {
        setSessionId(newSessionId);
        setMpStep(MultiplayerPhaseOneStep.LOBBY);
      } else {
        throw new Error("Session ID was null.");
      }
    } catch (error: any) {
      console.error("Failed to create session:", error);
      setJoinError(
        t("multiplayer_error_createFailed", { message: error.message })
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Join an existing game session
  const handleJoinSession = async (code: string): Promise<boolean> => {
    if (isLoadingAction) return false;
    setIsLoadingAction(true);
    setJoinError(null);
    try {
      const result = await joinGameSession(
        code,
        currentUserProfile.uid,
        currentUserProfile.email.split("@")[0]
      );
      if (result.success && result.sessionId) {
        setSessionId(result.sessionId);
        setMpStep(MultiplayerPhaseOneStep.LOBBY);
        return true;
      } else {
        setJoinError(
          t(result.message) || t("multiplayer_error_joinFailed_unknown")
        );
        return false;
      }
    } catch (error: any) {
      console.error("Failed to join session:", error);
      setJoinError(
        t("multiplayer_error_joinFailed", { message: error.message })
      );
      return false;
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Start the game session (host only)
  const handleStartGame = async () => {
    if (
      !sessionId ||
      isLoadingAction ||
      currentUserProfile.uid !== sessionData?.hostUid
    )
      return;
    setIsLoadingAction(true);
    try {
      const result = await startGameSession(sessionId, currentUserProfile.uid);
      if (!result.success) {
        toast({
          variant: "destructive",
          title: t("multiplayer_error_startFailed"),
          description: t(result.message) || "",
        });
      }
      // Game start success is handled by the Firebase listener
    } catch (error: any) {
      console.error("Failed to start game:", error);
      toast({
        variant: "destructive",
        title: t("multiplayer_error_startFailed"),
        description: error.message,
      });
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Leave the current session/lobby
  const handleLeaveLobby = async () => {
    if (!sessionId || isLoadingAction) return;
    setIsLoadingAction(true);
    try {
      // For now, we just clean up the local state
      // In a complete implementation, you'd update the Firebase document to remove this player
      console.log("Leaving lobby/session:", sessionId);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      setSessionId(null);
      setSessionData(null);
      setMpStep(MultiplayerPhaseOneStep.JOIN_OR_CREATE);
    } catch (error: any) {
      console.error("Error leaving lobby:", error);
      toast({
        variant: "destructive",
        title: t("multiplayer_error_leaveFailed"),
        description: error.message,
      });
      // Force cleanup even on error
      setSessionId(null);
      setSessionData(null);
      setMpStep(MultiplayerPhaseOneStep.JOIN_OR_CREATE);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Handle the player submitting their policy selections
  const handleThisPlayerSubmitsPhaseOne = async (
    submittedSelections: Required<PolicySelections>
  ) => {
    if (!sessionId || !currentUserProfile) {
      toast({
        variant: "destructive",
        title: t("multiplayer_error_submitFailed"),
        description: "Session or User ID missing.",
      });
      return;
    }

    try {
      const result = await submitPlayerSelections(
        sessionId,
        currentUserProfile.uid,
        submittedSelections
      );
      if (!result.success) {
        toast({
          variant: "destructive",
          title: t("multiplayer_error_submitFailed"),
          description: t(result.message) || "",
        });
      } else {
        toast({ title: t("multiplayer_toast_youSubmitted") });
        setMpStep(MultiplayerPhaseOneStep.DELIBERATING);
      }
    } catch (error: any) {
      console.error("Failed to submit selections:", error);
      toast({
        variant: "destructive",
        title: t("multiplayer_error_submitFailed"),
        description: error.message,
      });
    }
  };

  // Render the appropriate UI based on the current step
  const renderContent = () => {
    switch (mpStep) {
      case MultiplayerPhaseOneStep.JOIN_OR_CREATE:
        return (
          <JoinOrCreateSession
            onCreateSession={handleCreateSession}
            onJoinSession={handleJoinSession}
            isCreating={isLoadingAction}
            isJoining={isLoadingAction}
            joinError={joinError}
          />
        );
      case MultiplayerPhaseOneStep.LOBBY:
        return (
          <Lobby
            sessionData={sessionData}
            onStartGame={handleStartGame}
            onLeaveLobby={handleLeaveLobby}
            isLoadingAction={isLoadingAction}
          />
        );
      case MultiplayerPhaseOneStep.SELECTING_POLICIES:
        return (
          <PhaseOne
            onPhaseComplete={handleThisPlayerSubmitsPhaseOne}
            sessionData={sessionData}
          />
        );
      case MultiplayerPhaseOneStep.DELIBERATING:
        return (
          <PhaseDeliberating
            sessionData={sessionData}
            currentUserProfile={currentUserProfile}
          />
        );
      default:
        return (
          <div className="text-center text-red-500">
            Error: Invalid multiplayer step.
          </div>
        );
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center w-full h-full">
      {/* Render based on current step */}
      {renderContent()}
    </div>
  );
}
