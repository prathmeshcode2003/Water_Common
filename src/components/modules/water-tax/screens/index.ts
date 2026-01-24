/**
 * Water Tax Citizen Portal - Screen Components
 * 
 * This file exports all active screen components used in the citizen portal.
 * Each component is designed to be API-ready and production-grade.
 * 
 * Component Organization:
 * - Authentication Flow: LandingScreen → LoginScreen → OtpScreen → PropertySelectScreen
 * - Main Application: DashboardWrapper (wraps DashboardScreenNew)
 * 
 * Unused/Legacy components should be removed to maintain clean codebase.
 */

// Authentication & Onboarding Screens
export { LandingScreen } from './LandingScreen';
export { LoginScreen } from './LoginScreen';
export { OtpScreen } from './OtpScreen';
export { PropertySelectScreen } from './PropertySelectScreen';

// Dashboard (Client-side wrapper for server components)
export { DashboardWrapper } from './DashboardWrapper';

// Additional Portal Screens with Wrappers
export { PassbookWrapper } from './PassbookWrapper';
export { MeterReadingWrapper } from './MeterReadingWrapper';
export { GrievancesWrapper } from './GrievancesWrapper';
export { BillCalculatorWrapper } from './BillCalculatorWrapper';

// Navigation Components
export { default as CivicRibbon } from './CivicRibbon';

// Core Dashboard Component (used internally by DashboardWrapper)
export { DashboardScreen } from './DashboardScreenNew';
