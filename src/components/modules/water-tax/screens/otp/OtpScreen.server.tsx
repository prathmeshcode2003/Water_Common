import Link from 'next/link';
import { Droplets, Waves, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { WaterWaves, FloatingBubbles, WaterParticles } from '@/components/modules/water-tax/screens/shared/WaterTheme';
import { AnimatedLogo, OtpSuccessBanner, OtpVerificationServer } from '@/components/modules/water-tax/screens/shared/mostly';

/**
 * OtpScreenSSR - Server Component
 * 
 * Server-side rendered OTP verification screen for water-tax portal.
 * Uses client islands for animations, OTP input, and verification logic.
 * Now uses server action for verification to maintain server-side session.
 * 
 * Design: 100% preserved from original
 * Mobile: Fully responsive (375px - 1920px)
 * Performance: Improved with SSR
 */

interface OtpScreenSSRProps {
    otpTargetMasked: string;
    lookupQuery?: string; // The original search query (mobile/consumer/property)
}

export function OtpScreenSSR({ otpTargetMasked, lookupQuery }: OtpScreenSSRProps) {
    return (
        <section className="relative w-full h-full min-h-0 flex flex-col justify-center items-center overflow-hidden">
            {/* Layered background - Aqua theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700" />
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_10%_20%,rgba(255,255,255,.06),transparent_20%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.04),transparent_30%)]" />

            {/* Client Island: Water theme animated layers */}
            <WaterParticles count={18} />
            <FloatingBubbles count={10} />
            <WaterWaves />

            {/* Decorative large orbs */}
            <div className="absolute -left-40 -top-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-40 top-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/8 to-pink-400/8 blur-3xl pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center">
                {/* Back to Home link */}
                <div className="absolute top-4 sm:top-6 left-2 sm:left-4 lg:left-8">
                    <Link
                        href="/water-tax/citizen"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center mt-12 sm:mt-8 w-full py-6 sm:py-0">
                    {/* Glass card: visually consistent with LoginScreen */}
                    <Card className="p-5 sm:p-6 md:p-8 shadow-2xl bg-white/10 backdrop-blur-2xl border border-white/20 relative overflow-hidden w-full max-w-[90%] sm:max-w-md rounded-2xl sm:rounded-3xl">
                        {/* Animated shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-[shimmer_3s_ease-in-out_2s_infinite] pointer-events-none" />

                        {/* Header Section */}
                        <div className="text-center mb-5 sm:mb-6 md:mb-8 relative">
                            {/* Client Island: Animated Droplet logo */}
                            <AnimatedLogo />

                            <h1 className="text-xl sm:text-2xl font-semibold text-white mb-1">
                                Water Tax Management
                            </h1>
                            <p className="text-xs sm:text-sm text-white/80">
                                Municipal Corporation Portal
                            </p>
                        </div>
                        {/* OTP Success Banner */}
                        <OtpSuccessBanner otpTargetMasked={otpTargetMasked} />

                        {/* Client Island: OTP Verification Form - Now uses server action */}
                        <OtpVerificationServer lookupQuery={lookupQuery} />

                        {/* Footer Links */}
                        <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/20">
                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 text-xs text-cyan-100">
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-1"
                                >
                                    <Droplets className="w-3 h-3" />
                                    Need Help?
                                </a>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-1"
                                >
                                    <Waves className="w-3 h-3" />
                                    Register New
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

export default OtpScreenSSR;
