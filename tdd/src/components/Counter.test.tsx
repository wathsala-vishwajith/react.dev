import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('should render with initial count of 0', () => {
    render(<Counter />);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');
  });

  it('should render with custom initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 5');
  });

  it('should increment count when increment button is clicked', () => {
    render(<Counter />);
    const incrementBtn = screen.getByTestId('increment-btn');

    fireEvent.click(incrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 1');

    fireEvent.click(incrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 2');
  });

  it('should decrement count when decrement button is clicked', () => {
    render(<Counter initialCount={5} />);
    const decrementBtn = screen.getByTestId('decrement-btn');

    fireEvent.click(decrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 4');

    fireEvent.click(decrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 3');
  });

  it('should allow negative counts', () => {
    render(<Counter />);
    const decrementBtn = screen.getByTestId('decrement-btn');

    fireEvent.click(decrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: -1');
  });

  it('should reset to initial count when reset button is clicked', () => {
    render(<Counter initialCount={10} />);
    const incrementBtn = screen.getByTestId('increment-btn');
    const resetBtn = screen.getByTestId('reset-btn');

    // Change the count
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 12');

    // Reset
    fireEvent.click(resetBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 10');
  });

  it('should render all buttons', () => {
    render(<Counter />);

    expect(screen.getByTestId('increment-btn')).toBeInTheDocument();
    expect(screen.getByTestId('decrement-btn')).toBeInTheDocument();
    expect(screen.getByTestId('reset-btn')).toBeInTheDocument();
  });

  it('should have correct button labels', () => {
    render(<Counter />);

    expect(screen.getByTestId('increment-btn')).toHaveTextContent('+');
    expect(screen.getByTestId('decrement-btn')).toHaveTextContent('-');
    expect(screen.getByTestId('reset-btn')).toHaveTextContent('Reset');
  });
});
