import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '@/components/common/Water.Citizen/Checkbox';

describe('Checkbox Component', () => {
  it('renders checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be checked', () => {
    render(<Checkbox checked />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('can be disabled', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Checkbox className="custom-class" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
  });
});
