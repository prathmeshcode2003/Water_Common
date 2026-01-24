import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/common/Water.Citizen/Select';

describe('Select Component', () => {
  it('renders select trigger', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
          <SelectItem value="2">Two</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows options when trigger is clicked', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
          <SelectItem value="2">Two</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole('combobox'));

    const portal = within(document.body);

    expect(await portal.findByText('One')).toBeInTheDocument();
    expect(await portal.findByText('Two')).toBeInTheDocument();
  });

  it('handles change events', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const handleChange = vi.fn();

    render(
      <Select onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
          <SelectItem value="2">Two</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole('combobox'));

    const option = await within(document.body).findByText('One');
    await user.click(option);

    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('can be disabled', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(
      <Select>
        <SelectTrigger className="custom-class">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });
});
