'use client';

import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

/**
 * AnimatedLogo - Client Component
 * 
 * Animated water droplet logo with pulsing glow effect.
 * Used in login and OTP screens.
 */
export function AnimatedLogo() {
    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block relative mb-6"
        >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                    <Droplets className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
            </div>
        </motion.div>
    );
}
