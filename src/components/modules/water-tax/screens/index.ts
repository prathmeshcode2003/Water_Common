/**
 * Water Tax Screens - Server Components Index
 * 
 * All post-login screens use SharedWrapper as the single client wrapper.
 * Organized by screen folders for better maintainability.
 */

// Landing Screen
export { LandingScreenSSR } from './landing/LandingScreen.server';

// Login Screen
export { LoginScreenSSR } from './login/LoginScreen.server';

// OTP Screen
export { OtpScreenSSR } from './otp/OtpScreen.server';

// Dashboard Screen (server-side data preparation → SharedWrapper)
export { DashboardScreenSSR } from './dashboard/DashboardScreen.server';

// Passbook Screen (server-side user pass-through → SharedWrapper)
export { PassbookScreenSSR } from './passbook/PassbookScreen.server';

// Grievances Screen (→ SharedWrapper)
export { GrievancesScreenSSR } from './grievances/GrievancesScreen.server';

// Calculator Screen (→ SharedWrapper)
export { BillCalculatorScreenSSR } from './bill-calculator/CalculatorScreen.server';

// Landing Hero (used by LandingScreen)
export { LandingHero } from './landing/LandingHero';

// Re-export existing screens (for backward compatibility)
export { LandingScreen } from './landing/LandingScreen';
export { LoginScreen } from './login/LoginScreen';
export { OtpScreen } from './otp/OtpScreen';

// SharedWrapper export for direct usage
export { SharedWrapper } from './SharedWrapper';
