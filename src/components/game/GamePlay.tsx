"use client";

import { useState  } from "react";
import { GameOnboarding } from "./OnBoarding";
import { GamePhase, PolicySelections } from "./types";
import { GamePhaseOneInterface } from "./GamePhaseOneInterface";
import { GamePhaseTwoInterface } from "./GamePhaseTwoInterface";

export default function GamePlay() {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.ONBOARDING);
  const [phaseOneSelections, setPhaseOneSelections] =
    useState<Required<PolicySelections> | null>(null);
  const [phaseTwoSelections, setPhaseTwoSelections] =
    useState<Required<PolicySelections> | null>(null);

  const handleOnboardingComplete = () => {
    setGamePhase(GamePhase.PHASE_1_DECISION);
  };

  const handlePhaseOneComplete = (selections: Required<PolicySelections>) => {
    setPhaseOneSelections(selections);
    setPhaseTwoSelections(null);
    setGamePhase(GamePhase.PHASE_2_DIALOGUE);
  };

  const handlePhaseTwoComplete = (selections: Required<PolicySelections>) => {
    setPhaseTwoSelections(selections);
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
          <GamePhaseTwoInterface onPhaseComplete={handlePhaseTwoComplete}
            phaseOneSelections={phaseOneSelections}
          />
        );
      case GamePhase.PHASE_3_REFLECTION:
        return <p>TODO</p>;
      default:
        return <div>Error: Unknown game phase</div>;
    }
  };

  return <>{renderGameContent()}</>;
}
