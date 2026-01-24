"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/common/Water.Citizen";
import { Button } from "@/components/common/Water.Citizen";
import { Input } from "@/components/common/Water.Citizen";
import { Droplets, Rocket, Search, ArrowRight } from "lucide-react";

/**
 * FinalLanding
 * A client component that reproduces the finalized landing-page design
 * - Full-screen gradient background with animated orbs and particles
 * - Centered glass morphism card with droplet logo, badges and CTA
 * - Pixel-close animations using Framer Motion
 *
 * Props are kept minimal (navigation callbacks). Visual-only component —
 * wire data/actions from the parent page when needed.
 */
export function FinalLanding({
  onNavigateToLogin,
  onTrack,
}: {
  onNavigateToLogin: () => void;
  onTrack?: (query?: string) => void;
}) {
  useEffect(() => {
    // nothing special for now — placeholder for future theme side-effects
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B4C72]">
      {/* Background gradient and large orbs (absolute, decorative) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#092F4A] via-[#005476] to-[#0DA3B8]" />

        <motion.div
          className="absolute -top-36 -left-36 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -right-36 top-20 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-purple-500/18 to-pink-400/12 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute left-1/3 bottom-0 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-green-400/18 to-emerald-400/12 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Small drifting particles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{ width: 6 + (i % 4) * 4, height: 6 + (i % 4) * 4 }}
            animate={{
              y: [0, -30 - (i % 6) * 6, 0],
              opacity: [0.25, 0.75, 0.25],
            }}
            transition={{ duration: 5 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
            // randomized positions but deterministic for SSR friendliness
            // positions chosen to be visually similar to the design
        
          />
        ))}
      </div>

      {/* Centered glass card */}
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xl"
        >
          <Card className="relative overflow-hidden rounded-3xl p-8 shadow-2xl border border-white/10 bg-white/6 backdrop-blur-md">
            {/* Subtle shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent opacity-30 pointer-events-none"
              animate={{ x: ["-120%", "120%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Droplet Logo */}
            <div className="text-center mb-6 relative">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="inline-block relative mb-4"
              >
                <div className="relative w-28 h-28">
                  <motion.div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-xl" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                    <Droplets className="w-14 h-14 text-white" />
                  </div>
                </div>
              </motion.div>

              <h2 className="text-2xl text-white/95 font-semibold">Water Tax Management</h2>
              <p className="text-sm text-cyan-100 mt-1">Municipal Corporation Portal</p>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-400/20 border border-emerald-300/20 text-emerald-100">🌊 System Online</span>
                <span className="px-3 py-1 text-xs rounded-full bg-white/8 border border-white/10 text-white/90">v2.0 Aqua</span>
              </div>
            </div>

            {/* Action area */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <Button
                  onClick={onNavigateToLogin}
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 text-white shadow-lg px-8 py-3 font-semibold"
                >
                  <Rocket className="w-4 h-4 mr-2 inline-block" />
                  Citizen Login
                </Button>

                <Button
                  variant="outline"
                  onClick={() => onTrack && onTrack()}
                  className="w-full sm:w-auto border-2 border-white/12 text-white/90 px-6 py-3"
                >
                  <Search className="w-4 h-4 mr-2 inline-block" />
                  Track Application
                </Button>
              </div>

              <div className="mt-2">
                <div className="text-sm text-white/80 text-center mb-3">Search by Name / Mobile / Consumer No / Property No</div>
                <div className="flex items-center gap-3">
                  <Input placeholder="Enter search query" className="flex-1 bg-white/8 text-white placeholder:text-white/60 border border-white/10" />
                  <Button onClick={() => onTrack && onTrack()} className="bg-green-500 text-white px-4 py-2 rounded-md">Send OTP</Button>
                </div>
                <p className="text-xs text-white/60 mt-2 text-center">🔐 Secure OTP-based authentication</p>
              </div>

              {/* OTP / status area mockup to match final design */}
              <div className="mt-4">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-center text-green-100 text-sm">✅ OTP sent successfully to 13123</div>

                <div className="flex gap-3 justify-center mt-4">
                  {["1", "3", "1", "2", "3", "2"].map((d, i) => (
                    <div key={i} className="w-12 h-12 flex items-center justify-center rounded-md bg-white/10 border border-white/20 text-white font-semibold">{d}</div>
                  ))}
                </div>

                <div className="text-xs text-white/60 text-center mt-3">⏱️ Resend OTP in 15s</div>

                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-md">Verify &amp; Login</Button>
                </div>

                <div className="mt-3 text-center text-white/70">
                  <button className="underline" onClick={onNavigateToLogin}>← Change Search Query</button>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 text-center text-white/70 text-sm">© {new Date().getFullYear()} Municipal Corporation. All rights reserved.</div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
