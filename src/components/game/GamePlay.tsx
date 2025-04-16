"use client";
import React, { useState } from "react";
import { GameOnboarding } from "./OnBoarding";

export default function GamePlay() {
  const [completedOnBoarding, setcompletedOnBoarding] = useState(false);

  return completedOnBoarding ? (
    <></>
  ) : (
    <GameOnboarding
      onOnboardingComplete={() => {
        setcompletedOnBoarding(true);
      }}
    />
  );
}
