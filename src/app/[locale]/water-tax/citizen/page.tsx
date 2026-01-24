"use client";

import React from "react";
import {
  LandingScreen,
  LoginScreen,
  OtpScreen,
  PropertySelectScreen,
  DashboardWrapper,
  PassbookWrapper,
  BillCalculatorWrapper,
  GrievancesWrapper,
  MeterReadingWrapper,
  DashboardScreen,
} from "@/components/modules/water-tax";

import { CitizenPortalLayout } from "@/components/modules/water-tax";
import { useSearchParams } from "next/navigation";

/* ============================================================
   Screen Registry
============================================================ */

const screens = {
  landing: LandingScreen,
  login: LoginScreen,
  otp: OtpScreen,
  "select-property": PropertySelectScreen,
  dashboard: DashboardWrapper,
  passbook: PassbookWrapper,
  calculator: BillCalculatorWrapper,
  grievances: GrievancesWrapper,
  "submit-reading": MeterReadingWrapper,
  dashboardScreen: DashboardScreen,
};

/* ============================================================
   Page Component
============================================================ */

export default function WaterCitizenPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "landing";

  const ScreenComponent =
    screens[view as keyof typeof screens] || LandingScreen;

  // Show header buttons only on landing screen
  const showHeaderBtns = view === "landing";

  return (
    <CitizenPortalLayout branding={{}} showPortalButtons={showHeaderBtns}>
      {view === "landing" ? (
        <LandingScreen
          onNavigateToLogin={() => {
            window.location.href = "/water-tax/citizen?view=login";
          }}
          onNavigateToFirstConnection={() => {
            window.location.href = "/water-tax/citizen?view=new-connection";
          }}
        />
      ) : (
        <ScreenComponent />
      )}
    </CitizenPortalLayout>
  );
}
