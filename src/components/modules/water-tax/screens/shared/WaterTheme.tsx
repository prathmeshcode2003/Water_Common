"use client";

import React from "react";
import { motion } from "framer-motion";

// Animated water waves background
export function WaterWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute bottom-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <motion.path
          fill="url(#wave-gradient-1)"
          fillOpacity="0.3"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,117.3C672,107,768,117,864,133.3C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          fill="url(#wave-gradient-2)"
          fillOpacity="0.3"
          d="M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,181.3C672,160,768,128,864,133.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,181.3C672,160,768,128,864,133.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,181.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,181.3C672,160,768,128,864,133.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Floating bubbles animation
export function FloatingBubbles({ count = 15 }: { count?: number }) {
  // Use fixed dimensions to avoid hydration mismatch
  const height = 1000;

  // Generate stable values
  const bubbles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      size: 20 + ((i * 13) % 60),
      left: (i * 7) % 100,
      delay: (i * 0.3) % 5,
      duration: 12 + (i % 10),
      endY: -(height + 200),
    }));
  }, [count, height]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: -100,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(6, 182, 212, 0.3))`,
            boxShadow: `inset 0 0 20px rgba(255,255,255,0.5), 0 0 20px rgba(6,182,212,0.3)`,
          }}
          animate={{
            y: [-100, bubble.endY],
            x: [0, (i % 2 === 0 ? 50 : -50), 0],
            opacity: [0, 0.6, 0.8, 0.6, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Water ripple effect (triggered)
export function WaterRipple({ trigger }: { trigger: boolean }) {
  return trigger ? (
    <motion.div
      className="absolute inset-0 rounded-lg pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0] }}
      transition={{ duration: 1.5 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-lg border-2 border-cyan-400"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, delay: i * 0.3 }}
        />
      ))}
    </motion.div>
  ) : null;
}

// Flowing water particles
export function WaterParticles({ count = 20 }: { count?: number }) {
  // Use fixed width to avoid hydration mismatch
  const width = 1440;

  // Generate stable random values (same on server and client)
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      yStart: (i * 37) % 100, // Pseudo-random but stable
      duration: 2 + (i % 3),
      delay: (i * 0.1) % 2,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{ top: `${particle.yStart}%`, left: -10 }}
          animate={{ x: [0, width + 20], opacity: [0, 1, 1, 0] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// Animated water droplet
export function WaterDroplet({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="relative w-8 h-8"
      animate={{ y: [0, 10, 0], scale: [1, 0.95, 1] }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full transform -translate-x-2 -translate-y-2" />
        <motion.div className="absolute inset-0 bg-white/20 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, delay, repeat: Infinity }} />
      </div>
    </motion.div>
  );
}

// Glass water effect card wrapper
export function GlassWaterCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-teal-500/20 rounded-lg backdrop-blur-xl" />
      <div className="absolute inset-0 bg-white/30 rounded-lg backdrop-blur-xl" />
      <div className="relative">{children}</div>

      {/* Water shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
      />
    </div>
  );
}
