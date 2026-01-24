"use client";
import { useEffect } from "react";
import Link from "next/link";
import { sendOtpAction } from "@/app/[locale]/water-tax/actions";
import { Card, Input } from "@/components/common/Water.Citizen";
import { Droplets, Rocket } from "lucide-react";
import { WaterWaves, FloatingBubbles, WaterParticles } from "./WaterTheme";

/**
 * LoginScreen (Server Component)
 * - This component is intentionally server-rendered to keep the same
 *   structure and form-action flow as the Dashboard-style pages.
 * - Interactivity (OTP entry, timers) is handled on subsequent views
 *   (see `otp` view) or via small client components when needed.
 * - Keep visuals high-fidelity (glass card, branding, badges) while
 *   preserving server-side form actions (`sendOtpAction`).
 */
function SaveQueryToSession() {
  useEffect(() => {
    const form = document.querySelector('form[action]');
    if (!form) return;
    const handler = (e: any) => {
      const input = form.querySelector('input[name="query"]') as HTMLInputElement;
      if (input && input.value) {
        sessionStorage.setItem('waterTaxOtpQuery', input.value);
      }
    };
    form.addEventListener('submit', handler);
    return () => {
      form.removeEventListener('submit', handler);
    };
  }, []);
  return null;
}

export function LoginScreen({ error }: { error?: string }) {
  const errorMessages: Record<string, string> = {
    missing: "Please enter a search query",
    not_found: "No consumer found with the provided details. Please check and try again.",
    session: "Session expired. Please login again.",
  };

  const errorMessage = error ? errorMessages[error] || "An error occurred" : null;

  return (
    <section className="relative w-full h-full min-h-0 flex flex-col justify-center items-center overflow-hidden"> {/* h-full, min-h-0, flex, center */}
      {/* Layered background to match the Aqua theme in the design */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700" />
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_10%_20%,rgba(255,255,255,.06),transparent_20%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,.04),transparent_30%)]" />

      {/* Water theme animated layers (client-only) */}
      <WaterParticles count={22} />
      <FloatingBubbles count={12} />
      <WaterWaves />

      {/* Decorative faint large shapes (non-interactive) */}
      <div className="absolute -left-40 -top-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-40 top-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/8 to-pink-400/8 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col w-full h-full justify-center items-center">
          <div className="absolute top-6 left-2 lg:left-8">
            <Link
              href="/water-tax/citizen"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition "
            >
              ← Back to Home
            </Link>
          </div>

          <div className="mt-8 lg:mt-0 flex-1 flex items-center justify-center">
            {/* Central glass card */}
            <Card className="w-full max-w-[28rem] rounded-3xl bg-white/8 backdrop-blur-md border border-white/12 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              {/* subtle shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent opacity-30 -z-10" />

              {/* Branding block */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-28 h-28 mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-xl opacity-70" />
                  <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl">
                    <Droplets className="w-14 h-14 text-white" />
                    <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
                  </div>
                </div>

                <h1 className="text-2xl font-semibold mb-1">Water Tax Management</h1>
                <p className="text-sm text-white/80 mb-3">Municipal Corporation Portal</p>
                {/* <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-200/12 text-xs">System Online</span>
                  <span className="px-3 py-1 rounded-full bg-white/6 border border-white/12 text-xs">v2.0 Aqua</span>
                </div> */}
              </div>

              {/* Login pill / form */}
              <div className="mt-6">
                <SaveQueryToSession />
                <div className="w-full rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/12 border border-white/8 py-2 text-center font-medium mb-4">
                  <span className="flex items-center justify-center gap-2">
                    <PhoneIconFallback />
                    Citizen Login
                  </span>
                </div>

                <div className="text-sm font-medium text-white/90 mb-2">Search by Name / Mobile / Consumer / Property</div>

                {/* Show error message if present */}
                {errorMessage && (
                  <div className="mb-3 p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-100 text-sm">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* Server action: sending OTP will create a session and redirect to OTP view */}
                <form action={sendOtpAction} className="space-y-3">
                  <Input name="query" placeholder="Enter search query" variant="dark" required />
                  <div className="text-xs text-white/70">🔍 Enter your registered details</div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 text-white py-2.5 font-semibold shadow-lg hover:scale-[1.02] transition-transform"
                  >
                    <Rocket className="w-4 h-4 inline-block mr-2" />
                    Send OTP
                  </button>
                  <div className="text-xs text-white/60 text-center mt-1">🔐 Secure OTP-based authentication</div>
                </form>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
                  <a href="#" className="hover:text-white">Need Help?</a>
                  <a href="#" className="hover:text-white">Register New</a>
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
 * Small inline fallback icon to avoid adding a new dependency import
 * (keeps the component fully server-renderable and dependency-light).
 */
function PhoneIconFallback() {
  // Simple SVG phone icon similar to lucide-react's Phone
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.07.75 3.03a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.96.37 1.98.63 3.03.75A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
