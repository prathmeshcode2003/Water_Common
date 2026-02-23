'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
    label: string;
    value: number;
    suffix: string;
    icon: LucideIcon;
    gradient: string;
    index: number;
}

/**
 * AnimatedStatsCard - Client Component
 * 
 * Animated stats card with hover effects and counter animation.
 * Used to display statistics on the landing page.
 */
export function AnimatedStatsCard({ label, value, suffix, icon: Icon, gradient, index }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className="relative group"
        >
            <div
                className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}
            ></div>
            <div className="relative bg-white rounded-2xl p-4 border-2 border-blue-100 group-hover:border-blue-300 transition-all shadow-lg text-center">
                <Icon
                    className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-r ${gradient} p-1.5 rounded-lg text-white`}
                />
                <motion.p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                    <AnimatedCounter value={value} suffix={suffix} />
                </motion.p>
                <p className="text-xs text-gray-600 font-medium mt-1">{label}</p>
            </div>
        </motion.div>
    );
}
