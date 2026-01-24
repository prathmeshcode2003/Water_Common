"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Droplets, Waves, ArrowLeft, Loader2 } from "lucide-react";
import { WaterWaves, FloatingBubbles, WaterParticles } from "./WaterTheme";
import { clearCitizenSession } from "@/app/[locale]/water-tax/actions";
import { Card } from "@/components/common/Water.Citizen";
import { OtpInputBoxes } from "../OtpInputBoxes";
import { OtpTimerAndResend } from "../OtpTimerAndResend";
import type { WaterConnectionSummary } from "@/types/water-tax.types";
import { searchConsumer } from "@/services/waterConsumerService";

// NOTE: This is a client component with comprehensive error handling,
// loading states, and API integration for OTP verification.

interface OtpScreenProps {
  otpTargetMasked: string;
  lookupQuery: string; // The original search query (mobile/consumer/property)
}

export function OtpScreen({ otpTargetMasked, lookupQuery }: OtpScreenProps) {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if no query is found
  useEffect(() => {
    const query = lookupQuery || sessionStorage.getItem('waterTaxOtpQuery');
    if (!query) {
      router.replace('/water-tax/citizen');
    }
  }, [lookupQuery, router]);

  // This is now a simple click handler, not a form submit
  const handleVerifyAndLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const query = lookupQuery || sessionStorage.getItem('waterTaxOtpQuery');
      if (!query) {
        throw new Error("No search query provided");
      }

      if (otpValue !== "123456") {
        throw new Error("Invalid OTP. Please enter the correct OTP.");
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
        timestamp: Date.now()
      }));

      router.push('/water-tax/citizen?view=dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeQuery = async () => {
    await clearCitizenSession();
    router.replace('/water-tax/citizen');
  };

  return (
    <section className="relative w-full h-full min-h-0 flex flex-col justify-center items-center overflow-hidden"> {/* h-full, min-h-0, flex, center */}
      {/* Layered background to match Login visuals */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700" />
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_10%_20%,rgba(255,255,255,.06),transparent_20%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.04),transparent_30%)]" />

      {/* Water theme animated layers (client-only) */}
      <WaterParticles count={18} />
      <FloatingBubbles count={10} />
      <WaterWaves />

      {/* Decorative large orbs */}
      <div className="absolute -left-40 -top-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-40 top-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/8 to-pink-400/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 flex-1 flex flex-col justify-center items-center">
       <div className="absolute top-6 left-2 lg:left-8">
         <Link
          href="/water-tax/citizen"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        </div>
        <div className="flex-1 flex items-center justify-center mt-8">
          {/* Glass card: visually consistent with LoginScreen */}
          <Card className="p-8 shadow-2xl bg-white/10 backdrop-blur-2xl border border-white/20 relative overflow-hidden w-full max-w-md">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            <div className="text-center mb-8 relative">
              {/* Droplet logo & title */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block relative mb-6"
              >
                <div className="relative w-24 h-24">
                  <motion.div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-xl" animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
                  <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                    <Droplets className="w-12 h-12 text-white" />
                  </div>
                </div>
              </motion.div>

              <h1 className="text-2xl font-semibold text-white mb-1">Water Tax Management</h1>
              <p className="text-sm text-white/80">Municipal Corporation Portal</p>
            </div>

            {/* OTP success + inputs */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-2">
                <p className="text-green-100 text-sm text-center">✅ OTP sent successfully to {otpTargetMasked}</p>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-400/30 rounded-lg p-4"
                >
                  <p className="text-red-100 text-sm text-center">⚠️ {error}</p>
                </motion.div>
              )}

              {/* No form, just a div */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm mb-3 text-cyan-100 font-medium text-center">Enter OTP</label>
                  <OtpInputBoxes onComplete={setOtpValue} />
                  <div className="mt-3 flex items-center justify-center">
                    <OtpTimerAndResend initialSeconds={30} />
                  </div>
                  <p className="text-xs text-white/60 text-center mt-2">💡 Demo OTP: 123456</p>
                </div>

                <button
                  type="button"
                  disabled={otpValue.length !== 6 || isLoading}
                  onClick={handleVerifyAndLogin}
                  className="w-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-white py-2.5 rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <Waves className="w-4 h-4 inline-block mr-2" /> Verify &amp; Login
                    </>
                  )}
                </button>

                <button type="button" onClick={handleChangeQuery} className="w-full text-white/70 hover:text-white hover:bg-white/10 py-2 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Change Search Query
                </button>
              </div>
            </motion.div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex justify-between text-xs text-cyan-100">
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1"><Droplets className="w-3 h-3" /> Need Help?</a>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-1"><Waves className="w-3 h-3" /> Register New</a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
