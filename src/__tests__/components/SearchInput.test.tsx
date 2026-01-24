import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchInput } from '@/components/common/SearchInput';

describe('SearchInput', () => {
  it('renders with placeholder', () => {
    render(<SearchInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const handleChange = vi.fn();
    render(<SearchInput onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
