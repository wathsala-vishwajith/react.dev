# useMemo Hook - Comprehensive Guide

## Overview
`useMemo` caches the result of a calculation between re-renders. Use it to optimize expensive computations or maintain referential equality.

## Basic Syntax
```javascript
const cachedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## Table of Contents
1. [Basic Examples](#basic-examples)
2. [Best Practices](#best-practices)
3. [Anti-Patterns](#anti-patterns)
4. [Caveats and Common Mistakes](#caveats-and-common-mistakes)
5. [Advanced Patterns](#advanced-patterns)

## Basic Examples

### Expensive Calculation
```javascript
function ProductList({ products, filter }) {
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(p => p.category === filter);
  }, [products, filter]);

  return <div>{filteredProducts.map(p => <Product key={p.id} {...p} />)}</div>;
}
```

### Preserving Reference Equality
```javascript
function Parent() {
  const [count, setCount] = useState(0);

  const options = useMemo(() => ({
    color: 'blue',
    size: 'large'
  }), []); // Same object reference every render

  return <Child options={options} />;
}
```

## Best Practices

### ✅ 1. Use for Expensive Computations
```javascript
// GOOD: Expensive operation
function DataVisualization({ data }) {
  const processedData = useMemo(() => {
    console.log('Processing data...');
    return data.map(item => ({
      ...item,
      calculated: complexCalculation(item),
      normalized: normalizeValues(item),
      aggregated: aggregateMetrics(item)
    }));
  }, [data]);

  return <Chart data={processedData} />;
}
```

### ✅ 2. Preserve Reference Equality for Dependencies
```javascript
// GOOD: Stable reference prevents child re-renders
function Parent() {
  const [count, setCount] = useState(0);

  const config = useMemo(() => ({
    threshold: 100,
    timeout: 3000
  }), []); // Never changes

  return <ExpensiveChild config={config} />;
}

const ExpensiveChild = React.memo(function ExpensiveChild({ config }) {
  // Only re-renders when config reference changes
  return <div>Threshold: {config.threshold}</div>;
});
```

### ✅ 3. Include All Dependencies
```javascript
// GOOD: All dependencies listed
function SearchResults({ items, query, filters }) {
  const results = useMemo(() => {
    return items
      .filter(item => item.name.includes(query))
      .filter(item => filters.every(f => f(item)));
  }, [items, query, filters]); // All used values

  return results.map(r => <Result key={r.id} {...r} />);
}
```

### ✅ 4. Combine with React.memo
```javascript
// GOOD: useMemo + React.memo for optimization
const ExpensiveChild = React.memo(function ExpensiveChild({ data, options }) {
  return <div>{/* Expensive rendering */}</div>;
});

function Parent({ items }) {
  const [count, setCount] = useState(0);

  const processedData = useMemo(() => {
    return items.map(item => transform(item));
  }, [items]);

  const options = useMemo(() => ({
    showLabels: true,
    animate: false
  }), []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild data={processedData} options={options} />
    </>
  );
}
```

## Anti-Patterns

### ❌ 1. Premature Optimization
```javascript
// BAD: useMemo for simple operations
function Component({ a, b }) {
  const sum = useMemo(() => a + b, [a, b]); // Overkill!
  return <div>{sum}</div>;
}

// GOOD: Just calculate it
function Component({ a, b }) {
  const sum = a + b;
  return <div>{sum}</div>;
}
```

### ❌ 2. Missing Dependencies
```javascript
// BAD: Missing 'multiplier' dependency
function Component({ items, multiplier }) {
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * multiplier, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]); // multiplier missing!

  return <div>Total: {total}</div>;
}

// GOOD: All dependencies included
function Component({ items, multiplier }) {
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * multiplier, 0);
  }, [items, multiplier]);
}
```

### ❌ 3. Using useMemo for Side Effects
```javascript
// BAD: Side effects in useMemo
function Component({ userId }) {
  const user = useMemo(() => {
    fetchUser(userId).then(setUser); // Side effect!
    return null;
  }, [userId]);
}

// GOOD: Use useEffect for side effects
function Component({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
}
```

### ❌ 4. Memoizing Everything
```javascript
// BAD: Unnecessary memoization
function Component({ name, age, email }) {
  const formattedName = useMemo(() => name.toUpperCase(), [name]);
  const isAdult = useMemo(() => age >= 18, [age]);
  const emailDomain = useMemo(() => email.split('@')[1], [email]);
  // Too much memoization for simple operations!
}

// GOOD: Only memoize expensive operations
function Component({ name, age, email }) {
  const formattedName = name.toUpperCase();
  const isAdult = age >= 18;
  const emailDomain = email.split('@')[1];
}
```

### ❌ 5. Wrong Use Case - Should Use useCallback
```javascript
// BAD: useMemo for functions
function Component() {
  const handleClick = useMemo(() => {
    return () => console.log('clicked');
  }, []);
}

// GOOD: Use useCallback for functions
function Component() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
}
```

## Caveats and Common Mistakes

### ⚠️ 1. useMemo Doesn't Guarantee Caching
```javascript
// React may discard memoized values to free memory
function Component({ data }) {
  const processed = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);
  // React might re-run this even if deps haven't changed
  // Don't rely on useMemo for correctness, only performance
}
```

### ⚠️ 2. Computation Runs on First Render
```javascript
function Component() {
  const value = useMemo(() => {
    console.log('Computing...'); // Runs on first render!
    return expensiveComputation();
  }, []);
}
```

### ⚠️ 3. Dependencies Must Be Primitives or Stable References
```javascript
// PROBLEM: New object every render
function Component({ items }) {
  const options = { sort: 'asc', limit: 10 }; // New object!

  const sorted = useMemo(() => {
    return sortItems(items, options);
  }, [items, options]); // useMemo runs every render!
}

// SOLUTION: Move outside or memoize options too
const options = { sort: 'asc', limit: 10 }; // Outside component

function Component({ items }) {
  const sorted = useMemo(() => {
    return sortItems(items, options);
  }, [items]); // Now stable
}
```

### ⚠️ 4. Don't Mutate Memoized Value
```javascript
// BAD: Mutating memoized value
function Component({ items }) {
  const sorted = useMemo(() => {
    return items.slice().sort();
  }, [items]);

  sorted.push({ id: 999 }); // WRONG! Don't mutate
  return <List items={sorted} />;
}

// GOOD: Treat as immutable
function Component({ items }) {
  const sorted = useMemo(() => {
    return items.slice().sort();
  }, [items]);

  const withExtra = [...sorted, { id: 999 }]; // New array
  return <List items={withExtra} />;
}
```

### ⚠️ 5. Measure Before Optimizing
```javascript
// Always profile first!
// React DevTools Profiler can show you where time is spent

// Bad: Guessing what's slow
const value = useMemo(() => calculate(), []);

// Good: Measure, then optimize
// 1. Use React DevTools Profiler
// 2. Identify actual bottlenecks
// 3. Apply useMemo where it helps
```

## Advanced Patterns

### Pattern 1: Memoizing Context Values
```javascript
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Pattern 2: Derived State
```javascript
function ProductList({ products, filters }) {
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      return filters.every(filter => filter(product));
    });
  }, [products, filters]);

  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + p.price, 0);
  }, [filteredProducts]);

  const categories = useMemo(() => {
    return [...new Set(filteredProducts.map(p => p.category))];
  }, [filteredProducts]);

  return (
    <div>
      <p>Total: ${totalPrice}</p>
      <p>Categories: {categories.join(', ')}</p>
      {filteredProducts.map(p => <Product key={p.id} {...p} />)}
    </div>
  );
}
```

### Pattern 3: Stable Object References for Custom Hooks
```javascript
function useApiConfig(apiKey) {
  return useMemo(
    () => ({
      baseURL: 'https://api.example.com',
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 5000
    }),
    [apiKey]
  );
}

function Component({ apiKey }) {
  const config = useApiConfig(apiKey);

  useEffect(() => {
    // Only runs when config actually changes
    setupAPI(config);
  }, [config]);
}
```

### Pattern 4: Memoizing Expensive Transformations
```javascript
function DataGrid({ data, sortBy, filterBy }) {
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (filterBy) {
      result = result.filter(filterBy);
    }

    // Sort
    if (sortBy) {
      result = result.sort(sortBy);
    }

    // Transform
    result = result.map(item => ({
      ...item,
      displayName: formatName(item),
      calculatedField: complexCalculation(item)
    }));

    return result;
  }, [data, sortBy, filterBy]);

  return <Grid data={processedData} />;
}
```

### Pattern 5: Conditional Memoization
```javascript
function Component({ data, shouldOptimize }) {
  const processed = shouldOptimize
    ? useMemo(() => expensiveOperation(data), [data])
    : expensiveOperation(data);

  // Or use a custom hook
  return <div>{processed}</div>;
}

function useMemoIf(factory, deps, condition) {
  const value = useMemo(factory, deps);
  return condition ? value : factory();
}
```

## When to Use useMemo

### Use useMemo when:
- ✅ Calculation is expensive (profiled and confirmed)
- ✅ Need stable reference for dependency arrays
- ✅ Passing objects/arrays to memoized children
- ✅ Computing derived values from large datasets
- ✅ Creating context values

### Don't use useMemo when:
- ❌ Calculation is cheap (primitives, simple operations)
- ❌ Optimizing prematurely without profiling
- ❌ For side effects (use useEffect instead)
- ❌ For every single computation (overhead exists)

## Performance Impact

```javascript
// useMemo has overhead:
// 1. Function call overhead
// 2. Dependency comparison
// 3. Memory to store cached value

// Only worth it if:
// Cost of computation > Cost of useMemo overhead
```

## Summary

**Do:**
- ✅ Profile before optimizing
- ✅ Use for expensive calculations
- ✅ Include all dependencies
- ✅ Combine with React.memo
- ✅ Memoize context values

**Don't:**
- ❌ Premature optimization
- ❌ Memoize simple operations
- ❌ Use for side effects
- ❌ Memoize everything
- ❌ Rely on it for correctness

**Remember:**
- useMemo is a performance optimization
- React may discard cached values
- Measure before and after
- Dependencies must be stable
- Computation runs on first render
