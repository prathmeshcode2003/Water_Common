import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Landing, { LandingScreen } from '@/components/modules/water-tax/screens/LandingScreen';

describe('Landing Screen', () => {
  it('renders landing screen', () => {
    render(<LandingScreen />);
    // Adjust the text below to something unique in your Landing screen
    expect(screen.getByText(/landing|welcome|water tax/i)).toBeInTheDocument();
  });
});
