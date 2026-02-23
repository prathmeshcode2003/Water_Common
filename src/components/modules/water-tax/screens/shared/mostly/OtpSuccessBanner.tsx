'use client';

import { motion } from 'framer-motion';

interface OtpSuccessBannerProps {
    otpTargetMasked: string;
}

/**
 * OtpSuccessBanner - Client Component
 * 
 * Displays animated success message after OTP is sent.
 */
export function OtpSuccessBanner({ otpTargetMasked }: OtpSuccessBannerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 sm:p-4 mb-2"
        >
            <p className="text-green-100 text-xs sm:text-sm text-center">
                ✅ OTP sent successfully to {otpTargetMasked}
            </p>
        </motion.div>
    );
}
