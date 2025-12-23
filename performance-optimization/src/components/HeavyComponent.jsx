import { memo, useMemo, useCallback, useState } from 'react';

// Example 1: WITHOUT optimization - renders every time parent updates
export function UnoptimizedExpensiveList({ items, onItemClick }) {
  console.log('🔴 UnoptimizedExpensiveList rendered');

  return (
    <div className="component-box">
      <h3>❌ Without Optimization</h3>
      <p className="info">Re-renders on every parent update</p>
      <ul>
        {items.map(item => (
          <li key={item.id} onClick={() => onItemClick(item.id)}>
            {item.name} - {expensiveCalculation(item.value)}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 2: WITH React.memo - only re-renders when props change
export const OptimizedExpensiveList = memo(function OptimizedExpensiveList({ items, onItemClick }) {
  console.log('🟢 OptimizedExpensiveList rendered');

  return (
    <div className="component-box">
      <h3>✅ With React.memo</h3>
      <p className="info">Only re-renders when props change</p>
      <ul>
        {items.map(item => (
          <li key={item.id} onClick={() => onItemClick(item.id)}>
            {item.name} - {expensiveCalculation(item.value)}
          </li>
        ))}
      </ul>
    </div>
  );
});

// Example 3: Demonstrating useMemo for expensive calculations
export function MemoizedCalculationDemo({ numbers }) {
  console.log('🔄 MemoizedCalculationDemo rendered');

  // WITHOUT useMemo - recalculates every render
  const sumWithoutMemo = numbers.reduce((acc, num) => {
    // Simulate expensive operation
    for (let i = 0; i < 100000; i++) { }
    return acc + num;
  }, 0);

  // WITH useMemo - only recalculates when numbers change
  const sumWithMemo = useMemo(() => {
    console.log('💡 useMemo: Recalculating sum');
    return numbers.reduce((acc, num) => {
      // Simulate expensive operation
      for (let i = 0; i < 100000; i++) { }
      return acc + num;
    }, 0);
  }, [numbers]);

  return (
    <div className="component-box">
      <h3>useMemo Example</h3>
      <p>Sum (recalculated every render): {sumWithoutMemo}</p>
      <p>Sum (memoized): {sumWithMemo}</p>
    </div>
  );
}

// Example 4: useCallback demo
export function CallbackDemo() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  // WITHOUT useCallback - new function every render
  const handleClickWithoutCallback = () => {
    console.log('Clicked:', count);
  };

  // WITH useCallback - same function reference unless dependencies change
  const handleClickWithCallback = useCallback(() => {
    console.log('Clicked:', count);
  }, [count]);

  return (
    <div className="component-box">
      <h3>useCallback Example</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment Count</button>
      <button onClick={() => setOtherState(s => s + 1)}>Update Other State</button>
      <MemoizedChild onClick={handleClickWithCallback} label="Memoized Child" />
      <UnmemoizedChild onClick={handleClickWithoutCallback} label="Unmemoized Child" />
    </div>
  );
}

const MemoizedChild = memo(({ onClick, label }) => {
  console.log(`🟢 ${label} rendered`);
  return <button onClick={onClick}>{label}</button>;
});

function UnmemoizedChild({ onClick, label }) {
  console.log(`🔴 ${label} rendered`);
  return <button onClick={onClick}>{label}</button>;
}

// Helper function for expensive calculation
function expensiveCalculation(num) {
  let result = num;
  for (let i = 0; i < 1000; i++) {
    result = Math.sqrt(result * result + 1);
  }
  return result.toFixed(2);
}
