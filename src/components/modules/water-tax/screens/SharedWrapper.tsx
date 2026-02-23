"use client";

import { useRouter } from "next/navigation";
import { DashboardScreen } from "@/components/modules/water-tax/screens/dashboard/DashboardScreenNew";
import { GrievancesScreen } from "@/components/modules/water-tax/screens/grievances/GrievancesScreen";
import { PassbookScreen } from "@/components/modules/water-tax/screens/passbook/PassbookScreen";
import { MeterReadingScreen } from "@/components/modules/water-tax/screens/meter-reading/MeterReadingScreen";
import { BillCalculatorScreen } from "@/components/modules/water-tax/screens/bill-calculator/BillCalculatorScreen";
import CivicRibbon from "@/components/modules/water-tax/screens/shared/CivicRibbon";
import { clearCitizenSession } from "@/app/[locale]/water-tax/actions";

export interface SharedWrapperProps {
  screen: "dashboard" | "grievances" | "passbook" | "submitReading" | "calculator";
  user?: any;
}

/**
 * SharedWrapper Component
 * 
 * The SINGLE client wrapper for ALL water-tax post-login screens.
 * Provides shared navigation, logout, and CivicRibbon for every screen.
 * 
 * Each screen receives the appropriate props based on its type.
 */
export function SharedWrapper({ screen, user }: SharedWrapperProps) {
  const router = useRouter();

  // ---- Comprehensive logout handler ----
  const handleLogout = async () => {
    try {
      // 1. Clear ALL sessionStorage keys related to water tax
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("waterTaxConsumers");
        window.sessionStorage.removeItem("waterTaxSelectedConsumer");
        window.sessionStorage.removeItem("waterTaxSession");
        window.sessionStorage.removeItem("waterTaxOtpQuery");
      }

      // 2. Clear the session cookie from the browser
      if (typeof document !== "undefined") {
        document.cookie = "wt_citizen_session_id=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "waterTaxOtp=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "waterTaxOtpQuery=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      // 3. Call the server action to destroy the server-side session
      try {
        await clearCitizenSession();
      } catch {
        // clearCitizenSession does a redirect itself, but if it fails
        // we fall through to the manual redirect below
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    // 4. Hard redirect to login page (full page reload to clear any cached state)
    if (typeof window !== "undefined") {
      window.location.href = "/water-tax/citizen?view=login";
    }
  };

  // ---- Shared navigation handler ----
  const handleNavigate = (targetScreen: string) => {
    const screenRoutes: Record<string, string> = {
      dashboard: "dashboard",
      passbook: "passbook",
      submitReading: "submitReading",
      grievances: "grievances",
      calculator: "calculator",
    };

    const viewParam = screenRoutes[targetScreen] || targetScreen;
    router.push(`/water-tax/citizen?view=${viewParam}`);
  };

  // ---- Render the appropriate screen ----
  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        if (!user) return <NoDataFallback screenName="Dashboard" />;
        return (
          <DashboardScreen
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "grievances":
        return <GrievancesScreen onNavigate={handleNavigate} />;

      case "passbook":
        if (!user) return <NoDataFallback screenName="Passbook" />;
        return <PassbookScreen user={user} onNavigate={handleNavigate} />;

      case "submitReading":
        return <MeterReadingScreen onNavigate={handleNavigate} />;

      case "calculator":
        return <BillCalculatorScreen onNavigate={handleNavigate} />;

      default:
        return <NoDataFallback screenName={screen} />;
    }
  };

  return (
    <>
      <CivicRibbon currentScreen={screen} onNavigate={handleNavigate} />
      {renderScreen()}
    </>
  );
}

/**
 * Fallback component shown when required data (like user) is missing.
 * Prevents blank screens by displaying a friendly message.
 */
function NoDataFallback({ screenName }: { screenName: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.27 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {screenName} Unavailable
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Your session may have expired. Please log in again to access this screen.
        </p>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/water-tax/citizen?view=login";
            }
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
