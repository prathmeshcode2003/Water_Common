import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '@/components/common/StatusBadge';

describe('StatusBadge', () => {
  it('renders with status text', () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });
});
