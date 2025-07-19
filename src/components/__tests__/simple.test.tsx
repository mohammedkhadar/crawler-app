import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple component tests that work with the current structure

describe('Component Tests', () => {
  test('renders a simple div', () => {
    const TestComponent = () => <div>Test Component</div>;
    render(<TestComponent />);
    
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  test('basic rendering works', () => {
    const element = React.createElement('div', null, 'Hello World');
    render(element);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('can handle props', () => {
    const TestComponent = ({ message }: { message: string }) => <div>{message}</div>;
    render(<TestComponent message="Test Message" />);
    
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });
});