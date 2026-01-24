import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OtpScreen } from '@/components/modules/water-tax/screens/OtpScreen';

// Mock next/navigation useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('Otp Screen', () => {
  it('renders otp screen', () => {
    render(<OtpScreen />);
    // Use a more specific text, or check that at least one match exists
    expect(screen.getAllByText(/otp|verification|code/i).length).toBeGreaterThan(0);
    // Or, for more specificity (uncomment if "Enter OTP" is unique):
    // expect(screen.getByText(/enter otp/i)).toBeInTheDocument();
  });
});
