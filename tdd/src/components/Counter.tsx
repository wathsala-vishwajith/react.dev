import { useState } from 'react';

interface CounterProps {
  initialCount?: number;
}

export const Counter = ({ initialCount = 0 }: CounterProps) => {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialCount);

  return (
    <div className="counter">
      <h2>Counter</h2>
      <p data-testid="count-display">Count: {count}</p>
      <div className="button-group">
        <button onClick={decrement} data-testid="decrement-btn">
          -
        </button>
        <button onClick={reset} data-testid="reset-btn">
          Reset
        </button>
        <button onClick={increment} data-testid="increment-btn">
          +
        </button>
      </div>
    </div>
  );
};
