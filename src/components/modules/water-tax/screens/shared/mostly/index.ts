/**
 * Client Components for Water-Tax Module
 * 
 * These components use 'use client' directive and contain:
 * - Animations (framer-motion)
 * - Interactive features (chat, dialogs)
 * - Client-side state management
 * 
 * They are imported by server components to create
 * "client islands" in an otherwise server-rendered page.
 */

// Client Components (use client)
export { LandingBackground } from './LandingBackground';
export { AnimatedCounter } from './AnimatedCounter';
export { AnimatedStatsCard } from './AnimatedStatsCard';
export { AnimatedServiceCard } from './AnimatedServiceCard';
export { ChatBot } from './ChatBot';
export { OtpInput } from './OtpInput';
export { SaveQueryToSession } from './SaveQueryToSession';
export { OtpVerification } from './OtpVerification';
export { OtpVerificationServer } from './OtpVerificationServer';
export { OtpSuccessBanner } from './OtpSuccessBanner';
export { AnimatedLogo } from './AnimatedLogo';

// Dashboard Client Components
export { PropertySelector } from './PropertySelector';
export { DashboardStats } from './DashboardStats';
export { QuickActions } from './QuickActions';
export { NewsMarquee } from './NewsMarquee';
export { ConnectionCard } from './ConnectionCard';
export { ConnectionsList } from './ConnectionsList';

// Dashboard Wrappers (with default handlers)
export { PropertySelectorWrapper, ConnectionsListWrapper } from './DashboardWrappers';
