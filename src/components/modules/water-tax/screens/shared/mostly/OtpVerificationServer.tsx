'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, ArrowLeft, Loader2 } from 'lucide-react';
import { verifyOtpAction } from '@/app/[locale]/water-tax/actions';
import { OtpInputBoxes } from '../../../OtpInputBoxes';
import { OtpTimerAndResend } from '../../../OtpTimerAndResend';

interface OtpVerificationServerProps {
    lookupQuery?: string;
}

/**
 * OtpVerificationServer - Client Component
 * 
 * Handles OTP input and uses server action for verification.
 * This ensures the server-side session is properly updated.
 */
export function OtpVerificationServer({ lookupQuery }: OtpVerificationServerProps) {
    const [otpValue, setOtpValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        setError(null);
        setIsLoading(true);

        try {
            if (otpValue.length !== 6) {
                throw new Error('Please enter a 6-digit OTP');
            }

            // Create FormData for server action
            const formData = new FormData();
            formData.append('otp', otpValue);

            // Call server action - it will handle redirect on success
            await verifyOtpAction(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
            console.error('OTP verification error:', err);
            setIsLoading(false);
        }
    };

    const handleChangeQuery = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/water-tax/citizen?view=login';
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 sm:p-4"
                >
                    <p className="text-red-100 text-xs sm:text-sm text-center">⚠️ {error}</p>
                </motion.div>
            )}

            {/* OTP Input Form */}
            <div className="space-y-4">
                <div className="relative">
                    <label className="block text-sm mb-3 text-cyan-100 font-medium text-center">
                        Enter OTP
                    </label>
                    <OtpInputBoxes onComplete={setOtpValue} />
                    <div className="mt-3 flex items-center justify-center">
                        <OtpTimerAndResend initialSeconds={30} />
                    </div>
                    <p className="text-xs text-white/60 text-center mt-2">💡 Demo OTP: 123456</p>
                </div>

                {/* Verify Button */}
                <button
                    type="button"
                    disabled={otpValue.length !== 6 || isLoading}
                    onClick={handleVerify}
                    className="w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-white py-2.5 sm:py-3 rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl active:scale-[0.98] transition-all touch-manipulation"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            <Waves className="w-4 h-4 inline-block mr-2" />
                            Verify & Login
                        </>
                    )}
                </button>

                {/* Change Query Button */}
                <button
                    type="button"
                    onClick={handleChangeQuery}
                    disabled={isLoading}
                    className="w-full text-white/70 hover:text-white hover:bg-white/10 py-2 sm:py-2.5 rounded-lg transition-colors touch-manipulation disabled:opacity-50"
                >
                    <ArrowLeft className="w-4 h-4 inline-block mr-2" />
                    Change Search Query
                </button>
            </div>
        </motion.div>
    );
}
