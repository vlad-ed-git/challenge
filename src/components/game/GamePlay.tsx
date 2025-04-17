"use client";

import { useEffect, useState } from "react";
import { GameOnboarding } from "./OnBoarding";
import { GamePhase, PolicySelections } from "./types";
import { GamePhaseOneInterface } from "./GamePhaseOneInterface";
import { GamePhaseTwoInterface } from "./GamePhaseTwoInterface";
import { ReflectionPhase } from "./ReflectionPhase";
import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export default function GamePlay() {
  const { currentUserProfile, loadingUserProfile } = useAuth();

  const route = useRouter();
  useEffect(() => {
    if (loadingUserProfile) return;
    if (!currentUserProfile) {
      // Redirect to login or show an error message
      route.push("/login");
      return;
    }
  }, [currentUserProfile, loadingUserProfile])
  
  

  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.ONBOARDING);
  const [phaseOneSelections, setPhaseOneSelections] =
    useState<Required<PolicySelections> | null>(null);
  const [phaseTwoSelections, setPhaseTwoSelections] =
    useState<Required<PolicySelections> | null>(null);
  const [agent1StateHappiness, setAgent1StateHappiness] = useState<number>(0);
  const [agent2CitizensHappiness, setAgent2CitizensHappiness] =
    useState<number>(0);
  const [agent3HumanRightsHappiness, setAgent3HumanRightsHappiness] =
    useState<number>(0);

  const handleOnboardingComplete = () => {
    setGamePhase(GamePhase.PHASE_1_DECISION);
  };

  const handlePhaseOneComplete = (selections: Required<PolicySelections>) => {
    setPhaseOneSelections(selections);
    setPhaseTwoSelections(null);
    setGamePhase(GamePhase.PHASE_2_DIALOGUE);
  };

  const handlePhaseTwoComplete = (
    selections: Required<PolicySelections>,
    agent1StateHappiness: number,
    agent2CitizensHappiness: number,
    agent3HumanRightsHappiness: number
  ) => {
    setPhaseTwoSelections(selections);
    setAgent1StateHappiness(agent1StateHappiness);
    setAgent2CitizensHappiness(agent2CitizensHappiness);
    setAgent3HumanRightsHappiness(agent3HumanRightsHappiness);
    setGamePhase(GamePhase.PHASE_3_REFLECTION);
  };

  const renderGameContent = () => {
    switch (gamePhase) {
      case GamePhase.ONBOARDING:
        return (
          <GameOnboarding
            onOnboardingComplete={() => {
              handleOnboardingComplete();
            }}
          />
        );
      case GamePhase.PHASE_1_DECISION:
        return (
          <GamePhaseOneInterface onPhaseComplete={handlePhaseOneComplete} />
        );
      case GamePhase.PHASE_2_DIALOGUE:
        return (
          <GamePhaseTwoInterface
            onPhaseComplete={handlePhaseTwoComplete}
            phaseOneSelections={phaseOneSelections}
          />
        );
      case GamePhase.PHASE_3_REFLECTION:
        return <ReflectionPhase
          phaseOneSelections={phaseOneSelections}
          phaseTwoSelections={phaseTwoSelections}
          agent1StateHappiness={agent1StateHappiness}
          agent2CitizensHappiness={agent2CitizensHappiness}
          agent3HumanRightsHappiness={agent3HumanRightsHappiness}
        />;
      default:
        return <div>Error: Unknown game phase</div>;
    }
  };

  return  loadingUserProfile || !currentUserProfile ? (
      <div>Loading...</div>
    ) : <>{renderGameContent()}</>;
}
