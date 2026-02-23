export { CitizenPortalLayout } from "@/components/layout/citizen/CitizenPortalLayout";

// Active screens used in the application
export { default as LandingScreen } from "./screens/landing/LandingScreen";
export { default as LoginScreen } from "./screens/login/LoginScreen";
export { default as OtpScreen } from "./screens/otp/OtpScreen";
export { PropertySelectScreen } from "./screens/shared/PropertySelectScreen";

// Single wrapper for all post-login screens
export { SharedWrapper } from "./screens/SharedWrapper";

// Main dashboard component (used via SharedWrapper)
export { DashboardScreen } from "./screens/dashboard/DashboardScreenNew";
