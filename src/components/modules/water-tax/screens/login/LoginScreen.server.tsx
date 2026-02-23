import Link from 'next/link';
import { sendOtpAction } from '@/app/[locale]/water-tax/actions';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Droplets, Rocket } from 'lucide-react';
import { WaterWaves, FloatingBubbles, WaterParticles } from '@/components/modules/water-tax/screens/shared/WaterTheme';
import { SaveQueryToSession } from '@/components/modules/water-tax/screens/shared/mostly';

/**
 * LoginScreenSSR - Server Component
 * 
 * Server-side rendered login screen for water-tax portal.
 * Uses server actions for form submission and client islands for animations.
 * 
 * Design: 100% preserved from original
 * Mobile: Fully responsive (375px - 1920px)
 * Performance: Improved with SSR
 */

interface LoginScreenSSRProps {
    error?: string;
}

export function LoginScreenSSR({ error }: LoginScreenSSRProps) {
    const errorMessages: Record<string, string> = {
        missing: 'Please enter a search query',
        not_found: 'No consumer found with the provided details. Please check and try again.',
        session: 'Session expired. Please login again.',
    };

    const errorMessage = error ? errorMessages[error] || 'An error occurred' : null;

    return (
        <section className="relative w-full h-full min-h-0 flex flex-col justify-center items-center overflow-hidden">
            {/* Layered background - Aqua theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700" />
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_10%_20%,rgba(255,255,255,.06),transparent_20%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.04),transparent_30%)]" />

            {/* Client Island: Water theme animated layers */}
            <WaterParticles count={22} />
            <FloatingBubbles count={12} />
            <WaterWaves />

            {/* Decorative faint large shapes */}
            <div className="absolute -left-40 -top-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-40 top-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/8 to-pink-400/8 blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center">
                <div className="flex flex-col w-full h-full justify-center items-center py-6 sm:py-0">
                    {/* Back to Home link */}
                    <div className="absolute top-4 sm:top-6 left-2 sm:left-4 lg:left-8">
                        <Link
                            href="/water-tax/citizen"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition text-sm sm:text-base"
                        >
                            ← Back to Home
                        </Link>
                    </div>

                    <div className="mt-12 sm:mt-8 lg:mt-0 flex-1 flex items-center justify-center w-full">
                        {/* Central glass card */}
                        <Card className="w-full max-w-[90%] sm:max-w-md rounded-2xl sm:rounded-3xl bg-white/8 backdrop-blur-md border border-white/12 shadow-2xl p-5 sm:p-6 md:p-8 text-white relative overflow-hidden">
                            {/* Subtle shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent opacity-30 -z-10" />

                            {/* Branding block */}
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-3 sm:mb-4">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-xl opacity-70" />
                                    <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                                        <Droplets className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                                        <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
                                    </div>
                                </div>

                                <h1 className="text-xl sm:text-2xl font-semibold mb-1">Water Tax Management</h1>
                                <p className="text-xs sm:text-sm text-white/80 mb-3">Municipal Corporation Portal</p>
                            </div>

                            {/* Login form section */}
                            <div className="mt-4 sm:mt-6">
                                {/* Client Island: Save query to sessionStorage */}
                                <SaveQueryToSession />

                                {/* Login header pill */}
                                <div className="w-full rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/12 border border-white/8 py-2 text-center font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                                    <span className="flex items-center justify-center gap-2">
                                        <PhoneIconFallback />
                                        Citizen Login
                                    </span>
                                </div>

                                <div className="text-xs sm:text-sm font-medium text-white/90 mb-2">
                                    Search by Name / Mobile / Consumer / Property
                                </div>

                                {/* Error message */}
                                {errorMessage && (
                                    <div className="mb-3 p-2 sm:p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-100 text-xs sm:text-sm">
                                        ⚠️ {errorMessage}
                                    </div>
                                )}

                                {/* Server action form */}
                                <form action={sendOtpAction} className="space-y-3">
                                    <Input
                                        name="query"
                                        placeholder="Enter search query"
                                        required
                                        className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 text-sm sm:text-base"
                                    />
                                    <div className="text-xs text-white/70">🔍 Enter your registered details</div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 text-white py-2.5 sm:py-3 font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform touch-manipulation text-sm sm:text-base"
                                    >
                                        <Rocket className="w-4 h-4 inline-block mr-2" />
                                        Send OTP
                                    </button>

                                    <div className="text-xs text-white/60 text-center mt-1">
                                        🔐 Secure OTP-based authentication
                                    </div>
                                </form>

                                {/* Footer links */}
                                <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-xs text-white/80">
                                    <a href="#" className="hover:text-white transition">
                                        Need Help?
                                    </a>
                                    <a href="#" className="hover:text-white transition">
                                        Register New
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}

/**
 * PhoneIconFallback - Server Component
 * 
 * Small inline SVG phone icon to avoid additional dependencies.
 */
function PhoneIconFallback() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block"
        >
            <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.75 3.03a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.37 1.98.63 3.03.75A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default LoginScreenSSR;
