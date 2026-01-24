"use client";

import { useRouter } from "next/navigation";
import { BillCalculatorScreen } from "./BillCalculatorScreen";
import CivicRibbon from "./CivicRibbon";

export function BillCalculatorWrapper() {
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
      <CivicRibbon currentScreen="calculator" onNavigate={handleNavigate} />
      <BillCalculatorScreen onNavigate={handleNavigate} />
    </>
  );
}
