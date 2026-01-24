import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardScreen } from '@/components/modules/water-tax/screens/DashboardScreenNew';

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

describe('Dashboard Screen', () => {
  it('renders dashboard screen', () => {
    // Provide minimal required props for DashboardScreen
    render(
      <DashboardScreen
        user={{
          allProperties: [],
          connections: [],
        }}
        onLogout={() => {}}
        onNavigate={() => {}}
      />
    );
    // Adjust the text below to something unique in your Dashboard screen
    // If you have a heading like "My Connections", use that:
    expect(screen.getByText(/my connections/i)).toBeInTheDocument();
  });
});
