import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginScreen } from '@/components/modules/water-tax/screens/LoginScreen';

describe('Login Screen', () => {
  it('renders login screen', () => {
    render(<LoginScreen />);
    // Use a more specific text if possible, or check that at least one match exists
    expect(screen.getAllByText(/login|sign in|mobile/i).length).toBeGreaterThan(0);
  });
});
