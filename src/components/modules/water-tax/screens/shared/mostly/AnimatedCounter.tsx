'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
}

/**
 * AnimatedCounter - Client Component
 * 
 * Animates a number counting up from 0 to the target value.
 * Used in stats cards on the landing page.
 */
export function AnimatedCounter({ value, suffix = '' }: AnimatedCounterProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const animation = animate(count, value, {
            duration: 2,
            ease: 'easeOut',
        });

        const unsubscribe = rounded.on('change', (latest) => {
            setDisplayValue(latest);
        });

        return () => {
            animation.stop();
            unsubscribe();
        };
    }, [value, count, rounded]);

    return (
        <>
            {displayValue}
            {suffix}
        </>
    );
}
