'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface AnimatedServiceCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
    bgGradient: string;
    iconColor: string;
    glowColor: string;
    badge?: string;
    index: number;
    onClick: () => void;
}

/**
 * AnimatedServiceCard - Client Component
 * 
 * Animated service card with hover effects for quick actions.
 * Used in the hero section and services grid.
 */
export function AnimatedServiceCard({
    icon: Icon,
    title,
    bgGradient,
    iconColor,
    badge,
    onClick,
}: AnimatedServiceCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={onClick}
            className={`p-4 bg-gradient-to-br ${bgGradient} rounded-xl cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all shadow-md hover:shadow-xl relative`}
        >
            {badge && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {badge}
                </div>
            )}
            <div className={`bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <p className="text-sm text-gray-900 font-semibold">{title}</p>
        </motion.div>
    );
}
