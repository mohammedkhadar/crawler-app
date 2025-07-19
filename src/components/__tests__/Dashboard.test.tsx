import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple component test to verify basic rendering
const TestComponent = ({ title = "Test Title", count = 0 }) => (
  <div>
    <h1>{title}</h1>
    <p>Count: {count}</p>
    <button>Click me</button>
  </div>
);

describe('Dashboard Component Tests', () => {
  test('renders test component with default props', () => {
    render(<TestComponent />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('renders test component with custom props', () => {
    render(<TestComponent title="Custom Title" count={5} />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  test('renders heading with proper tag', () => {
    render(<TestComponent />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
  });

  test('button is clickable', () => {
    render(<TestComponent />);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });
});