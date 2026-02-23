import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CivicRibbon from '@/components/modules/water-tax/screens/CivicRibbon';

const mockOnNavigate = vi.fn();

describe('CivicRibbon Component', () => {
  beforeEach(() => {
    mockOnNavigate.mockClear();
  });

  it('renders all hubs in desktop view', () => {
    render(<CivicRibbon currentScreen="dashboard" onNavigate={mockOnNavigate} />);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Passbook').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Meter Reading').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Grievances').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bill Calculator').length).toBeGreaterThan(0);
  });

  it('calls onNavigate when a hub is clicked', () => {
    render(<CivicRibbon currentScreen="dashboard" onNavigate={mockOnNavigate} />);
    // Click the first visible Passbook button
    const passbookButtons = screen.getAllByText('Passbook');
    fireEvent.click(passbookButtons[0].closest('button'));
    expect(mockOnNavigate).toHaveBeenCalledWith('passbook');
  });

  it('shows badge for grievances hub', () => {
    render(<CivicRibbon currentScreen="grievances" onNavigate={mockOnNavigate} />);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('shows active state for currentScreen', () => {
    render(<CivicRibbon currentScreen="calculator" onNavigate={mockOnNavigate} />);
    const calculator = screen.getByText('Bill Calculator');
    expect(calculator.closest('button')).toHaveClass('bg-gradient-to-r');
  });

  it('mobile menu does not crash and all hubs are present', () => {
    // Simulate mobile by hiding md:block
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    window.dispatchEvent(new Event('resize'));
    render(<CivicRibbon currentScreen="dashboard" onNavigate={mockOnNavigate} />);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Passbook').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Meter/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Grievances').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bill/i).length).toBeGreaterThan(0);
  });
});
