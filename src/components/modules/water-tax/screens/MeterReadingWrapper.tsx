"use client";

import { useRouter } from "next/navigation";
import { MeterReadingScreen } from "./MeterReadingScreen";
import CivicRibbon from "./CivicRibbon";

export function MeterReadingWrapper() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    const screenRoutes: Record<string, string> = {
      dashboard: "dashboard",
      passbook: "passbook",
      submitReading: "submit-reading",
      grievances: "grievances",
      calculator: "calculator",
    };

    const viewParam = screenRoutes[screen] || screen;
    router.push(`/water-tax/citizen?view=${viewParam}`);
  };

  return (
    <>
      <CivicRibbon currentScreen="submitReading" onNavigate={handleNavigate} />
      <MeterReadingScreen onNavigate={handleNavigate} />
    </>
  );
}
