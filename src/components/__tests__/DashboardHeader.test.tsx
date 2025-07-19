import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardHeader } from '../DashboardHeader';

describe('DashboardHeader Component', () => {
  test('renders dashboard title', () => {
    render(<DashboardHeader />);
    
    expect(screen.getByText(/web crawler dashboard/i)).toBeInTheDocument();
  });

  test('displays header with proper styling', () => {
    render(<DashboardHeader />);
    
    const header = screen.getByText(/web crawler dashboard/i);
    expect(header.tagName).toBe('H1');
  });

  test('renders without any props', () => {
    render(<DashboardHeader />);
    
    // Should render without errors
    expect(screen.getByText(/web crawler dashboard/i)).toBeInTheDocument();
  });

  test('has proper semantic structure', () => {
    render(<DashboardHeader />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/web crawler dashboard/i);
  });

  test('component renders consistently', () => {
    const { rerender } = render(<DashboardHeader />);
    
    expect(screen.getByText(/web crawler dashboard/i)).toBeInTheDocument();
    
    // Re-render should show same content
    rerender(<DashboardHeader />);
    expect(screen.getByText(/web crawler dashboard/i)).toBeInTheDocument();
  });
});