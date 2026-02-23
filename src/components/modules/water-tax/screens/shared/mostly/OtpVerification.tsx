'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Waves, ArrowLeft, Loader2 } from 'lucide-react';
import { clearCitizenSession } from '@/app/[locale]/water-tax/actions';
import { searchConsumer } from '@/services/waterConsumerService';
import { OtpInputBoxes } from '../../../OtpInputBoxes';
import { OtpTimerAndResend } from '../../../OtpTimerAndResend';

interface OtpVerificationProps {
    lookupQuery?: string;
}

/**
 * OtpVerification - Client Component
 * 
 * Handles OTP input, verification, and navigation logic.
 * Uses searchConsumer service to fetch user data after OTP verification.
 */
export function OtpVerification({ lookupQuery }: OtpVerificationProps) {
    const router = useRouter();
    const [otpValue, setOtpValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect to login if no query is found
    useEffect(() => {
        const query = lookupQuery || sessionStorage.getItem('waterTaxOtpQuery');
        if (!query) {
            router.replace('/water-tax/citizen');
        }
    }, [lookupQuery, router]);

    const handleVerifyAndLogin = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const query = lookupQuery || sessionStorage.getItem('waterTaxOtpQuery');
            if (!query) {
                throw new Error('No search query provided');
            }

            if (otpValue !== '123456') {
                throw new Error('Invalid OTP. Please enter the correct OTP.');
            }

            // Fetch consumer data using the searchConsumer service
            const result = await searchConsumer({ query });
            const consumers = result?.items || result || [];
            const consumerList = Array.isArray(consumers) ? consumers : [consumers];

            if (!consumerList.length) {
                throw new Error('No consumer data found for your query.');
            }

            sessionStorage.setItem('waterTaxConsumers', JSON.stringify(consumerList));
            sessionStorage.setItem('waterTaxSelectedConsumer', JSON.stringify(consumerList[0]));
            sessionStorage.setItem('waterTaxSession', JSON.stringify({
                query,
                authenticated: true,
                timestamp: Date.now(),
            }));

            router.push('/water-tax/citizen?view=dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeQuery = async () => {
        await clearCitizenSession();
        router.replace('/water-tax/citizen');
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
                    onClick={handleVerifyAndLogin}
                    className="w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-white py-2.5 sm:py-3 rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl active:scale-[0.98] transition-all touch-manipulation"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        <>
                            <Waves className="w-4 h-4 inline-block mr-2" />
                            Verify &amp; Login
                        </>
                    )}
                </button>

                {/* Change Query Button */}
                <button
                    type="button"
                    onClick={handleChangeQuery}
                    className="w-full text-white/70 hover:text-white hover:bg-white/10 py-2 sm:py-2.5 rounded-lg transition-colors touch-manipulation"
                >
                    <ArrowLeft className="w-4 h-4 inline-block mr-2" />
                    Change Search Query
                </button>
            </div>
        </motion.div>
    );
}
