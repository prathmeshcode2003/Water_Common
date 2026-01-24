"use client";

import { useRouter } from "next/navigation";
import { GrievancesScreen } from "./GrievancesScreen";
import CivicRibbon from "./CivicRibbon";

export function GrievancesWrapper() {
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
      <CivicRibbon currentScreen="grievances" onNavigate={handleNavigate} />
      <GrievancesScreen onNavigate={handleNavigate} />
    </>
  );
}
