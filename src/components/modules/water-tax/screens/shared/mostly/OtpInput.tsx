'use client';

import { useRef, useEffect } from 'react';
import { Input } from '@/components/common/Input';

interface OtpInputProps {
    otp: string[];
    setOtp: (otp: string[]) => void;
    onComplete?: (otp: string) => void;
}

/**
 * OtpInput - Client Component
 * 
 * Interactive OTP input with auto-focus and paste support.
 * Used in OtpScreen for entering one-time passwords.
 */
export function OtpInput({ otp, setOtp, onComplete }: OtpInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Auto-focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        // Check if OTP is complete
        if (otp.every((digit) => digit !== '') && onComplete) {
            onComplete(otp.join(''));
        }
    }, [otp, onComplete]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pastedData = value.slice(0, 6);
            const newOtp = [...otp];
            pastedData.split('').forEach((char, i) => {
                if (index + i < 6 && /^\d$/.test(char)) {
                    newOtp[index + i] = char;
                }
            });
            setOtp(newOtp);

            // Focus last filled input or last input
            const lastFilledIndex = Math.min(index + pastedData.length, 5);
            inputRefs.current[lastFilledIndex]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-2 sm:gap-3 justify-center">
            {otp.map((digit, index) => (
                <Input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-blue-300 focus:border-blue-600 rounded-xl transition-all"
                    autoComplete="off"
                />
            ))}
        </div>
    );
}
