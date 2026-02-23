import { LandingBackground, ChatBot } from '@/components/modules/water-tax/screens/shared/mostly';
import { LandingHero } from './LandingHero';

/**
 * LandingScreenSSR - Server Component
 * 
 * Server-side rendered landing page for water-tax citizen portal.
 * This is the SSR version that replaces the client-heavy LandingScreen.tsx.
 * 
 * Design: 100% preserved from original
 * Performance: Improved with SSR
 * Animations: Maintained via client islands
 */
export function LandingScreenSSR() {
    // Server-side data (in production, fetch from database/API)
    // Icons are defined as strings and mapped to components in client
    const stats = [
        {
            label: 'Active Citizens',
            value: 5000,
            suffix: '+',
            iconName: 'Users',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Bills Paid',
            value: 2000,
            suffix: '+',
            iconName: 'CheckCircle',
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            label: 'Avg. Processing',
            value: 2,
            suffix: ' Days',
            iconName: 'TrendingDown',
            gradient: 'from-orange-500 to-amber-500',
        },
        {
            label: 'Satisfaction',
            value: 4.8,
            suffix: '/5',
            iconName: 'Award',
            gradient: 'from-purple-500 to-pink-500',
        },
    ];

    const quickServices = [
        {
            iconName: 'FileText',
            title: 'Apply for Connection',
            description: 'New water connection request',
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
            iconColor: 'text-blue-600',
            glowColor: 'shadow-blue-500/20',
        },
        {
            iconName: 'Plus',
            title: 'First Connection',
            description: 'Apply without login',
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
            iconColor: 'text-green-600',
            glowColor: 'shadow-green-500/20',
            badge: 'New',
        },
        {
            iconName: 'CreditCard',
            title: 'Pay Bills',
            description: 'Quick bill payment',
            gradient: 'from-orange-500 to-amber-500',
            bgGradient: 'from-orange-50 to-amber-50',
            iconColor: 'text-orange-600',
            glowColor: 'shadow-orange-500/20',
        },
        {
            iconName: 'MessageSquare',
            title: 'Raise Grievance',
            description: 'Report an issue',
            gradient: 'from-rose-500 to-pink-500',
            bgGradient: 'from-rose-50 to-pink-50',
            iconColor: 'text-rose-600',
            glowColor: 'shadow-rose-500/20',
        },
        {
            iconName: 'Search',
            title: 'Track Application',
            description: 'Check application status',
            gradient: 'from-purple-500 to-violet-500',
            bgGradient: 'from-purple-50 to-violet-50',
            iconColor: 'text-purple-600',
            glowColor: 'shadow-purple-500/20',
        },
        {
            iconName: 'Activity',
            title: 'Submit Reading',
            description: 'Meter reading submission',
            gradient: 'from-teal-500 to-cyan-500',
            bgGradient: 'from-teal-50 to-cyan-50',
            iconColor: 'text-teal-600',
            glowColor: 'shadow-teal-500/20',
        },
    ];

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 h-full">
            {/* Client Island: Animated Background (orbs and particles) */}
            <LandingBackground />

            {/* Client Island: Hero Section (with animations) */}
            <LandingHero
                stats={stats}
                quickServices={quickServices}
            />

            {/* Client Island: ChatBot */}
            <ChatBot />
        </div>
    );
}

export default LandingScreenSSR;
