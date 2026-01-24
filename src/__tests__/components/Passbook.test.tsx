import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PassbookScreen } from '@/components/modules/water-tax/screens/PassbookScreen';

describe('Passbook Screen', () => {
  it('renders passbook screen', () => {
    render(<PassbookScreen />);
    // Use a more specific text if possible, or check that at least one match exists
    expect(screen.getAllByText(/passbook|transactions|history/i).length).toBeGreaterThan(0);
  });
});
