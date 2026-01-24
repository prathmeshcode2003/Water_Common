"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/common/Water.Citizen";

interface OtpInputBoxesProps {
    onComplete: (otp: string) => void;
}

export function OtpInputBoxes({ onComplete }: OtpInputBoxesProps) {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits
        const digit = value.replace(/\D/g, "");
        if (digit.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        // Auto-focus next input
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Notify parent when complete
        if (newOtp.every((d) => d !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
        const digits = pastedData.slice(0, 6).split("");
        const newOtp = [...otp];

        digits.forEach((digit, i) => {
            if (i < 6) newOtp[i] = digit;
        });

        setOtp(newOtp);

        // Focus next empty input or last input
        const nextEmptyIndex = newOtp.findIndex((d) => d === "");
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();

        // Notify parent if complete
        if (newOtp.every((d) => d !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    return (
        <div className="flex gap-3 justify-center mb-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Input
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        onFocus={(e) => e.target.select()}
                        className="w-12 h-14 text-center text-2xl bg-white/15 border-2 border-white/30 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-cyan-400 backdrop-blur-sm transition-all rounded-lg font-semibold focus:ring-2 focus:ring-cyan-400/50 focus:scale-110"
                        placeholder="•"
                        aria-label={`OTP digit ${index + 1}`}
                    />
                </motion.div>
            ))}
        </div>
    );
}
