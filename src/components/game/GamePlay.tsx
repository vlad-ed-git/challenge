"use client";
import { useState } from "react";
import { GameOnboarding } from "./OnBoarding";
import { GamePhase, PolicySelections } from "./types";
import { GamePhaseOneInterface } from "./GamePhaseOneInterface";

export default function GamePlay() {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.ONBOARDING);
  const [phaseOneSelections, setPhaseOneSelections] =
    useState<Required<PolicySelections> | null>(null);

  const handleOnboardingComplete = () => {
    console.log("Onboarding complete!");
    setGamePhase(GamePhase.PHASE_1_DECISION);
  };

  const handlePhaseOneComplete = (selections: Required<PolicySelections>) => {
    console.log("Phase 1 complete!");
    setPhaseOneSelections(selections);
    setGamePhase(GamePhase.PHASE_2_DIALOGUE); // Move to next phase
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
        return <p>TODO</p>;
      case GamePhase.PHASE_3_REFLECTION:
        return <p>TODO</p>;
      default:
        return <div>Error: Unknown game phase</div>;
    }
  };

  return (
    <>
      {renderGameContent()}
    </>
  );
}
