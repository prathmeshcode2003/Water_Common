'use client';

import { useEffect } from 'react';

/**
 * SaveQueryToSession - Client Component
 * 
 * Saves the login query to sessionStorage on form submission.
 * This allows the OTP screen to retrieve the query value.
 */
export function SaveQueryToSession() {
    useEffect(() => {
        const form = document.querySelector('form[action]');
        if (!form) return;

        const handler = () => {
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
