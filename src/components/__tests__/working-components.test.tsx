import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple working component tests
describe('Component Tests (Working)', () => {
  test('renders basic React elements', () => {
    const TestComponent = () => <div data-testid="test">Test Component</div>;
    render(<TestComponent />);
    
    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  test('handles props correctly', () => {
    interface Props {
      message: string;
      count: number;
    }
    
    const TestComponent = ({ message, count }: Props) => (
      <div>
        <span data-testid="message">{message}</span>
        <span data-testid="count">{count}</span>
      </div>
    );
    
    render(<TestComponent message="Hello" count={42} />);
    
    expect(screen.getByTestId('message')).toHaveTextContent('Hello');
    expect(screen.getByTestId('count')).toHaveTextContent('42');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    
    const Button = ({ onClick }: { onClick: () => void }) => (
      <button onClick={onClick}>Click me</button>
    );
    
    render(<Button onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('handles input changes', () => {
    const handleChange = jest.fn();
    
    const Input = ({ onChange }: { onChange: (value: string) => void }) => (
      <input 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Test input"
      />
    );
    
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Test input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledWith('test value');
  });

  test('renders conditional content', () => {
    const ConditionalComponent = ({ show }: { show: boolean }) => (
      <div>
        {show && <span data-testid="conditional">Shown</span>}
        {!show && <span data-testid="conditional">Hidden</span>}
      </div>
    );
    
    const { rerender } = render(<ConditionalComponent show={true} />);
    expect(screen.getByTestId('conditional')).toHaveTextContent('Shown');
    
    rerender(<ConditionalComponent show={false} />);
    expect(screen.getByTestId('conditional')).toHaveTextContent('Hidden');
  });

  test('renders lists correctly', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    
    const List = ({ items }: { items: string[] }) => (
      <ul>
        {items.map((item, index) => (
          <li key={index} data-testid={`item-${index}`}>
            {item}
          </li>
        ))}
      </ul>
    );
    
    render(<List items={items} />);
    
    items.forEach((item, index) => {
      expect(screen.getByTestId(`item-${index}`)).toHaveTextContent(item);
    });
  });

  test('handles form submission', () => {
    const handleSubmit = jest.fn();
    
    const Form = ({ onSubmit }: { onSubmit: (data: { name: string }) => void }) => {
      const [name, setName] = React.useState('');
      
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ name });
        }}>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
          <button type="submit">Submit</button>
        </form>
      );
    };
    
    render(<Form onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText('Enter name');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledWith({ name: 'John' });
  });
});