import React, { useState, useMemo, memo } from 'react';

// ==============================================================================
// EXAMPLE 1: Expensive Calculation
// ==============================================================================
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function ExpensiveCalculation() {
  const [number, setNumber] = useState(35);
  const [counter, setCounter] = useState(0);

  // WITH useMemo
  const fibResult = useMemo(() => {
    console.log('Calculating fibonacci...');
    return fibonacci(number);
  }, [number]);

  return (
    <div>
      <h3>Expensive Calculation</h3>
      <p>Fibonacci({number}) = {fibResult}</p>
      <button onClick={() => setNumber(n => Math.max(30, n - 1))}>Decrease Number</button>
      <button onClick={() => setNumber(n => Math.min(40, n + 1))}>Increase Number</button>
      <hr />
      <p>Counter: {counter}</p>
      <button onClick={() => setCounter(c => c + 1)}>
        Increment Counter (doesn't recalculate fib!)
      </button>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Notice: Fibonacci only recalculates when number changes, not when counter changes
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 2: Without useMemo vs With useMemo
// ==============================================================================
function filterAndSort(items, query) {
  console.log('Filtering and sorting...');
  return items
    .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function WithoutMemo() {
  const [query, setQuery] = useState('');
  const [counter, setCounter] = useState(0);

  const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date' },
    { id: 5, name: 'Elderberry' }
  ];

  // WITHOUT useMemo - runs on every render
  const filtered = filterAndSort(items, query);

  return (
    <div>
      <h3>❌ Without useMemo</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>Counter: {counter}</p>
      <button onClick={() => setCounter(c => c + 1)}>Increment (triggers filter!)</button>
      <ul>
        {filtered.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
      <p style={{ color: 'red' }}>Check console - filters on every render</p>
    </div>
  );
}

export function WithMemo() {
  const [query, setQuery] = useState('');
  const [counter, setCounter] = useState(0);

  const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date' },
    { id: 5, name: 'Elderberry' }
  ];

  // WITH useMemo - only runs when dependencies change
  const filtered = useMemo(() => {
    return filterAndSort(items, query);
  }, [query]);

  return (
    <div>
      <h3>✅ With useMemo</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>Counter: {counter}</p>
      <button onClick={() => setCounter(c => c + 1)}>Increment (no filter!)</button>
      <ul>
        {filtered.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
      <p style={{ color: 'green' }}>Check console - only filters when query changes</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 3: Reference Equality for React.memo
// ==============================================================================
const ChildWithoutMemo = memo(function ChildWithoutMemo({ data, onAction }) {
  console.log('ChildWithoutMemo rendering');
  return (
    <div style={{ padding: '10px', background: '#ffe0e0', margin: '10px 0' }}>
      <p>Child Component</p>
      <p>Data: {JSON.stringify(data)}</p>
      <button onClick={onAction}>Action</button>
    </div>
  );
});

export function ParentWithoutMemo() {
  const [count, setCount] = useState(0);

  // New object every render!
  const data = { value: 42 };

  const handleAction = () => alert('Action!');

  return (
    <div>
      <h3>❌ Without useMemo (Child re-renders unnecessarily)</h3>
      <p>Parent count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment Parent</button>
      <ChildWithoutMemo data={data} onAction={handleAction} />
      <p style={{ color: 'red' }}>Check console - child re-renders even though data didn't change</p>
    </div>
  );
}

const ChildWithMemo = memo(function ChildWithMemo({ data, onAction }) {
  console.log('ChildWithMemo rendering');
  return (
    <div style={{ padding: '10px', background: '#e0ffe0', margin: '10px 0' }}>
      <p>Child Component</p>
      <p>Data: {JSON.stringify(data)}</p>
      <button onClick={onAction}>Action</button>
    </div>
  );
});

export function ParentWithMemo() {
  const [count, setCount] = useState(0);

  // Stable reference
  const data = useMemo(() => ({ value: 42 }), []);

  const handleAction = useMemo(() => () => alert('Action!'), []);

  return (
    <div>
      <h3>✅ With useMemo (Child only re-renders when needed)</h3>
      <p>Parent count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment Parent</button>
      <ChildWithMemo data={data} onAction={handleAction} />
      <p style={{ color: 'green' }}>Check console - child doesn't re-render unnecessarily</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 4: Derived State
// ==============================================================================
export function DerivedState() {
  const [items] = useState([
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
    { id: 2, name: 'Phone', price: 699, category: 'Electronics' },
    { id: 3, name: 'Desk', price: 299, category: 'Furniture' },
    { id: 4, name: 'Chair', price: 199, category: 'Furniture' },
    { id: 5, name: 'Monitor', price: 399, category: 'Electronics' }
  ]);
  const [category, setCategory] = useState('All');
  const [counter, setCounter] = useState(0);

  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return category === 'All'
      ? items
      : items.filter(item => item.category === category);
  }, [items, category]);

  const totalPrice = useMemo(() => {
    console.log('Calculating total...');
    return filteredItems.reduce((sum, item) => sum + item.price, 0);
  }, [filteredItems]);

  const categories = useMemo(() => {
    console.log('Extracting categories...');
    return ['All', ...new Set(items.map(item => item.category))];
  }, [items]);

  return (
    <div>
      <h3>Derived State with useMemo</h3>
      <div>
        <label>Category: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <p>Counter: {counter}</p>
      <button onClick={() => setCounter(c => c + 1)}>Increment (no recalc!)</button>
      <div>
        <h4>Items</h4>
        {filteredItems.map(item => (
          <div key={item.id}>
            {item.name} - ${item.price}
          </div>
        ))}
        <p><strong>Total: ${totalPrice}</strong></p>
      </div>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Check console - calculations only run when dependencies change
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 5: Anti-Pattern - Premature Optimization
// ==============================================================================
export function PrematureOptimization() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(10);

  // ❌ BAD: useMemo for simple calculation
  const sum = useMemo(() => a + b, [a, b]);
  const product = useMemo(() => a * b, [a, b]);
  const difference = useMemo(() => Math.abs(a - b), [a, b]);

  // These are too simple to benefit from memoization!

  return (
    <div>
      <h3>❌ Anti-Pattern: Premature Optimization</h3>
      <p>A: {a}, B: {b}</p>
      <button onClick={() => setA(a => a + 1)}>Increase A</button>
      <button onClick={() => setB(b => b + 1)}>Increase B</button>
      <div>
        <p>Sum: {sum}</p>
        <p>Product: {product}</p>
        <p>Difference: {difference}</p>
      </div>
      <p style={{ color: 'red' }}>
        These calculations are too simple to benefit from useMemo!
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 6: Complex Data Processing
// ==============================================================================
export function ComplexDataProcessing() {
  const [data] = useState(() =>
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
    }))
  );
  const [filter, setFilter] = useState('All');
  const [counter, setCounter] = useState(0);

  const processedData = useMemo(() => {
    console.log('Processing data...');
    const start = performance.now();

    let result = filter === 'All'
      ? data
      : data.filter(item => item.category === filter);

    result = result.map(item => ({
      ...item,
      normalized: item.value / 100,
      doubled: item.value * 2,
      squared: item.value ** 2
    }));

    const end = performance.now();
    console.log(`Processing took ${(end - start).toFixed(2)}ms`);

    return result;
  }, [data, filter]);

  const stats = useMemo(() => {
    console.log('Calculating stats...');
    return {
      count: processedData.length,
      sum: processedData.reduce((acc, item) => acc + item.value, 0),
      avg: processedData.reduce((acc, item) => acc + item.value, 0) / processedData.length
    };
  }, [processedData]);

  return (
    <div>
      <h3>Complex Data Processing</h3>
      <div>
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="A">Category A</option>
          <option value="B">Category B</option>
          <option value="C">Category C</option>
        </select>
      </div>
      <p>Counter: {counter}</p>
      <button onClick={() => setCounter(c => c + 1)}>Increment (no reprocessing!)</button>
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <p>Count: {stats.count}</p>
        <p>Sum: {stats.sum.toFixed(2)}</p>
        <p>Average: {stats.avg.toFixed(2)}</p>
      </div>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Check console for processing time - only runs when filter changes
      </p>
    </div>
  );
}

// ==============================================================================
// DEMO APP
// ==============================================================================
export function UseMemoDemo() {
  const [activeExample, setActiveExample] = useState('expensive');

  const examples = {
    expensive: <ExpensiveCalculation />,
    without: <WithoutMemo />,
    with: <WithMemo />,
    badRef: <ParentWithoutMemo />,
    goodRef: <ParentWithMemo />,
    derived: <DerivedState />,
    premature: <PrematureOptimization />,
    complex: <ComplexDataProcessing />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>useMemo Hook Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select value={activeExample} onChange={(e) => setActiveExample(e.target.value)}>
          <option value="expensive">Expensive Calculation</option>
          <option value="without">❌ Without useMemo</option>
          <option value="with">✅ With useMemo</option>
          <option value="badRef">❌ Without Reference Equality</option>
          <option value="goodRef">✅ With Reference Equality</option>
          <option value="derived">Derived State</option>
          <option value="premature">❌ Premature Optimization</option>
          <option value="complex">Complex Data Processing</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {examples[activeExample]}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>💡 Tip:</strong> Open your browser console to see when calculations run
      </div>
    </div>
  );
}
