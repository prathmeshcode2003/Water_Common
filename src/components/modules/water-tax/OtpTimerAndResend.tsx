"use client";

import { useState, useEffect } from "react";
import { clearCitizenSession } from "@/app/[locale]/water-tax/actions";

interface OtpTimerAndResendProps {
    initialSeconds?: number;
}

export function OtpTimerAndResend({ initialSeconds = 30 }: OtpTimerAndResendProps) {
    const [timer, setTimer] = useState(initialSeconds);

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleResendOtp = async () => {
        // Clear session to go back to login screen
        await clearCitizenSession();
    };

    if (timer > 0) {
        return (
            <p className="text-xs text-cyan-200/70 mt-2 text-center">
                ⏱️ Resend OTP in {timer}s
            </p>
        );
    }

    return (
        <button
            onClick={handleResendOtp}
            className="text-xs text-cyan-200 mt-2 hover:text-white transition-colors w-full text-center underline"
        >
            Resend OTP
        </button>
    );
}
