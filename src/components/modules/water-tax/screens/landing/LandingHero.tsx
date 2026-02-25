'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import {
    Sparkles,
    Users,
    CheckCircle,
    TrendingDown,
    Award,
    FileText,
    Plus,
    CreditCard,
    MessageSquare,
    Search,
    Activity,
    type LucideIcon,
} from 'lucide-react';
import { AnimatedStatsCard } from '@/components/modules/water-tax/screens/shared/mostly/AnimatedStatsCard';
import { AnimatedServiceCard } from '@/components/modules/water-tax/screens/shared/mostly/AnimatedServiceCard';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Users,
    CheckCircle,
    TrendingDown,
    Award,
    FileText,
    Plus,
    CreditCard,
    MessageSquare,
    Search,
    Activity,
};

interface StatData {
    label: string;
    value: number;
    suffix: string;
    iconName: string; // Changed from icon to iconName
    gradient: string;
}

interface ServiceData {
    iconName: string; // Changed from icon to iconName
    title: string;
    description: string;
    gradient: string;
    bgGradient: string;
    iconColor: string;
    glowColor: string;
    badge?: string;
}

interface LandingHeroProps {
    stats: StatData[];
    quickServices: ServiceData[];
}

/**
 * LandingHero - Client Component
 * 
 * Hero section with animations for the landing page.
 * Contains the main CTA, stats, and quick services.
 * Now handles navigation internally without requiring props.
 */
export function LandingHero({ stats, quickServices }: LandingHeroProps) {
    const handleLoginRedirect = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/water-tax/citizen?view=login';
        }
    };

    const handleFirstConnection = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/water-tax/citizen?view=new-connection';
        }
    };

    // Map icon names to components
    const statsWithIcons = stats.map((stat) => ({
        ...stat,
        icon: iconMap[stat.iconName] || Users,
    }));

    const servicesWithIcons = quickServices.map((service) => ({
        ...service,
        icon: iconMap[service.iconName] || FileText,
    }));

    return (
        <section className="pt-4 sm:pt-8 pb-0 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center h-full"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full mb-3 sm:mb-4 border-2 border-blue-200 shadow-lg text-xs sm:text-sm"
                        >
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-semibold">Next-Gen Water Management System</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.9,
                                ease: 'easeOut',
                            }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-3 sm:mb-4 leading-tight font-bold"
                        >
                            Transform Your
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.8,
                                    ease: 'easeOut',
                                }}
                                className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent"
                            >
                                Water Services
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: 0.6,
                                    duration: 0.6,
                                }}
                                className="block"
                            >
                                Experience
                            </motion.span>
                        </motion.h1>

                        <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                            Seamlessly manage water connections, pay bills instantly, and track everything in
                            real-time. Join 50,000+ citizens enjoying hassle-free water management.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="lg"
                                    onClick={handleLoginRedirect}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl shadow-blue-500/30 text-base sm:text-lg px-4 sm:px-6 h-11 sm:h-12 w-full sm:w-auto"
                                >
                                    Get Started Now
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={handleLoginRedirect}
                                    className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 text-base sm:text-lg px-4 sm:px-6 h-11 sm:h-12 w-full sm:w-auto"
                                >
                                    Track Application
                                </Button>
                            </motion.div>
                        </div>

                        {/* Animated Running Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-6 sm:mt-8">
                            {statsWithIcons.map((stat, index) => (
                                <AnimatedStatsCard key={stat.label} {...stat} index={index} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Right - 3D Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mt-8 lg:mt-0"
                    >
                        <div className="relative">
                            {/* Glowing background */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-3xl blur-3xl"
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                }}
                            ></motion.div>

                            {/* Main card */}
                            <motion.div
                                className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-blue-100"
                                whileHover={{ y: -10 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                }}
                            >
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Header */}
                                    <div className="sticky top-0 z-50 bg-white text-white border-b-4 border-white/20 backdrop-blur-xl">
                                        <div className="bg-white">
                                            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-900 font-bold">
                                                Welcome Citizen,
                                                <br />
                                                <span>पनवेल महानगरपालिकेमध्ये आपले स्वागत आहे!</span>
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Quick actions */}
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        {servicesWithIcons.slice(0, 4).map((service, index) => (
                                            <AnimatedServiceCard
                                                key={service.title}
                                                {...service}
                                                index={index}
                                                onClick={() => {
                                                    if (service.title === 'First Connection') {
                                                        handleFirstConnection();
                                                    } else if (service.title === 'Track Application') {
                                                        console.log('Track application');
                                                    } else {
                                                        handleLoginRedirect();
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating elements */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute w-24 h-24 bg-gradient-to-br ${i === 0
                                        ? 'from-blue-300/40 to-cyan-300/40 -top-12 -right-12'
                                        : i === 1
                                            ? 'from-purple-300/40 to-pink-300/40 -bottom-12 -left-12'
                                            : 'from-green-300/40 to-emerald-300/40 top-1/2 -right-16'
                                        } rounded-full blur-2xl`}
                                    animate={{
                                        y: [0, -20, 0],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 3 + i,
                                        repeat: Infinity,
                                        delay: i * 0.5,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
