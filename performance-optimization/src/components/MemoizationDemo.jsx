import { useState } from 'react';
import {
  UnoptimizedExpensiveList,
  OptimizedExpensiveList,
  MemoizedCalculationDemo,
  CallbackDemo,
} from './HeavyComponent.jsx';

export function MemoizationDemo() {
  const [count, setCount] = useState(0);
  const [items] = useState([
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
    { id: 3, name: 'Item 3', value: 300 },
  ]);

  const [numbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const handleItemClick = (id) => {
    console.log('Item clicked:', id);
  };

  return (
    <div className="demo-section">
      <h2>Memoization Demo</h2>

      <div className="info-box">
        <p><strong>Memoization</strong> prevents unnecessary re-renders and recalculations.</p>
        <p>Open DevTools Console to see render logs!</p>
      </div>

      <div className="controls">
        <button onClick={() => setCount(c => c + 1)} className="btn-primary">
          Trigger Re-render (Count: {count})
        </button>
        <p className="info">
          Click this button and watch the console - OptimizedExpensiveList won't re-render!
        </p>
      </div>

      <div className="comparison-grid">
        <UnoptimizedExpensiveList items={items} onItemClick={handleItemClick} />
        <OptimizedExpensiveList items={items} onItemClick={handleItemClick} />
      </div>

      <MemoizedCalculationDemo numbers={numbers} />

      <CallbackDemo />

      <div className="metrics-info">
        <h4>Memoization Techniques:</h4>
        <ul>
          <li><strong>React.memo:</strong> Prevents component re-renders when props haven't changed</li>
          <li><strong>useMemo:</strong> Memoizes expensive calculations</li>
          <li><strong>useCallback:</strong> Memoizes function references to prevent child re-renders</li>
          <li><strong>Performance gain:</strong> 50-90% reduction in unnecessary renders</li>
        </ul>
      </div>
    </div>
  );
}
