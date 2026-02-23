'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/common/Card';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
    onClick?: () => void;
}

function StatsCard({ title, value, change, icon: Icon, color, trend = 'neutral', onClick }: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onClick}
            className={onClick ? 'cursor-pointer' : ''}
        >
            <Card className="p-3 sm:p-4 lg:p-5 bg-white border-2 border-gray-100 shadow-md hover:shadow-xl transition-shadow relative overflow-hidden">
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />

                <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">{title}</p>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                            {value}
                        </h3>
                        <div className="flex items-center gap-1.5">
                            {trend === 'up' && (
                                <span className="text-green-600 text-xs sm:text-sm">↑</span>
                            )}
                            {trend === 'down' && (
                                <span className="text-red-600 text-xs sm:text-sm">↓</span>
                            )}
                            <p className="text-xs sm:text-sm text-gray-500">{change}</p>
                        </div>
                    </div>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                </div>

                {/* Animated shine effect on hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                />
            </Card>
        </motion.div>
    );
}

interface DashboardStatsProps {
    activeConnections: number;
    totalDue: number;
    totalConsumption: number;
    pendingBillsCount: number;
    openGrievances: number;
    onCalculatorClick?: () => void;
    onGrievancesClick?: () => void;
}

/**
 * DashboardStats - Client Component
 * 
 * Displays 4 animated stat cards showing key metrics.
 * Mobile: 2 columns, Desktop: 4 columns
 */
export function DashboardStats({
    activeConnections,
    totalDue,
    totalConsumption,
    pendingBillsCount,
    openGrievances,
    onCalculatorClick,
    onGrievancesClick,
}: DashboardStatsProps) {
    const stats = [
        {
            title: 'Active Connections',
            value: activeConnections.toString(),
            change: activeConnections > 1 ? 'Multiple properties' : 'Single property',
            icon: require('lucide-react').Droplets,
            color: 'from-blue-500 to-cyan-500',
            trend: 'up' as const,
        },
        {
            title: 'Total Due',
            value: `₹${totalDue.toLocaleString()}`,
            change: `${pendingBillsCount} pending ${pendingBillsCount === 1 ? 'bill' : 'bills'}`,
            icon: require('lucide-react').IndianRupee,
            color: 'from-orange-500 to-red-500',
            trend: 'neutral' as const,
        },
        {
            title: 'Water Consumed',
            value: `${totalConsumption} KL`,
            change: 'Current month total',
            icon: require('lucide-react').Activity,
            color: 'from-teal-500 to-emerald-500',
            trend: 'neutral' as const,
            onClick: onCalculatorClick,
        },
        {
            title: 'Open Grievances',
            value: openGrievances.toString(),
            change: 'Response pending',
            icon: require('lucide-react').MessageSquare,
            color: 'from-purple-500 to-pink-500',
            trend: 'neutral' as const,
            onClick: onGrievancesClick,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                    <StatsCard {...stat} />
                </motion.div>
            ))}
        </div>
    );
}
