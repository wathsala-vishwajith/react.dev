# useCallback Hook - Comprehensive Guide

## Overview
`useCallback` returns a memoized callback function. Use it to prevent unnecessary re-renders when passing callbacks to optimized child components.

## Basic Syntax
```javascript
const cachedFn = useCallback(fn, [dependencies]);
```

## Relationship to useMemo
```javascript
// These are equivalent:
const cachedFn = useCallback(fn, deps);
const cachedFn = useMemo(() => fn, deps);
```

## Table of Contents
1. [Basic Examples](#basic-examples)
2. [Best Practices](#best-practices)
3. [Anti-Patterns](#anti-patterns)
4. [Caveats and Common Mistakes](#caveats-and-common-mistakes)
5. [Advanced Patterns](#advanced-patterns)

## Basic Examples

### Preventing Child Re-renders
```javascript
const MemoizedChild = React.memo(function Child({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []); // Same function reference every render

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoizedChild onClick={handleClick} />
    </>
  );
}
```

### Event Handler with Dependencies
```javascript
function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(() => {
    onSearch(query);
  }, [query, onSearch]); // Re-created when dependencies change

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </>
  );
}
```

## Best Practices

### ✅ 1. Use with React.memo
```javascript
// GOOD: useCallback + React.memo prevents unnecessary re-renders
const ExpensiveChild = React.memo(function ExpensiveChild({ onAction }) {
  console.log('Child rendering');
  return <button onClick={onAction}>Action</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleAction = useCallback(() => {
    console.log('Action performed');
  }, []);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveChild onAction={handleAction} />
    </>
  );
}
```

### ✅ 2. Include All Dependencies
```javascript
// GOOD: All dependencies listed
function Component({ userId, onUpdate }) {
  const [data, setData] = useState(null);

  const handleUpdate = useCallback(() => {
    const updated = processData(data, userId);
    onUpdate(updated);
  }, [data, userId, onUpdate]); // All used values

  return <button onClick={handleUpdate}>Update</button>;
}
```

### ✅ 3. Use for Effect Dependencies
```javascript
// GOOD: Stable function reference for useEffect
function Component({ id }) {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    const result = await fetch(`/api/data/${id}`);
    setData(await result.json());
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Won't cause infinite loop

  return <div>{data?.name}</div>;
}
```

### ✅ 4. Memoize Custom Hook Callbacks
```javascript
// GOOD: Return stable callback from custom hook
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

// Usage
function SearchBox() {
  const [query, setQuery] = useState('');

  const search = useCallback((q) => {
    console.log('Searching for:', q);
  }, []);

  const debouncedSearch = useDebounce(search, 500);

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

## Anti-Patterns

### ❌ 1. Using useCallback Without React.memo
```javascript
// BAD: useCallback without React.memo doesn't help
function Child({ onClick }) {
  console.log('Child rendering'); // Still renders every time!
  return <button onClick={onClick}>Click</button>;
}

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Doesn't prevent Child re-renders!

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleClick} />
    </>
  );
}

// GOOD: Use React.memo
const Child = React.memo(function Child({ onClick }) {
  console.log('Child rendering');
  return <button onClick={onClick}>Click</button>;
});
```

### ❌ 2. Missing Dependencies
```javascript
// BAD: Missing 'multiplier' dependency
function Component({ multiplier }) {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(count + multiplier); // Uses stale values!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Missing dependencies!

  return <button onClick={increment}>Increment</button>;
}

// GOOD: Include all dependencies or use functional update
function Component({ multiplier }) {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(c => c + multiplier);
  }, [multiplier]);

  return <button onClick={increment}>Increment</button>;
}
```

### ❌ 3. Premature Optimization
```javascript
// BAD: useCallback for everything
function Component() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  const handleDouble = useCallback(() => {
    setCount(c => c * 2);
  }, []);

  // No optimized children - this doesn't help!

  return (
    <>
      <p>{count}</p>
      <button onClick={handleClick}>+1</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleDouble}>×2</button>
    </>
  );
}

// GOOD: Only use when needed
function Component() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(c => c * 2)}>×2</button>
    </>
  );
}
```

### ❌ 4. Overusing with Inline Components
```javascript
// BAD: Inline child component negates optimization
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {/* Inline component - always new! */}
      {React.createElement(() => (
        <button onClick={handleClick}>Action</button>
      ))}
    </>
  );
}
```

### ❌ 5. Wrong Use Case - Should Use Regular Function
```javascript
// BAD: useCallback for one-time setup
function Component() {
  const initialize = useCallback(() => {
    // Complex initialization
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);
}

// GOOD: Define inside useEffect
function Component() {
  useEffect(() => {
    function initialize() {
      // Complex initialization
    }
    initialize();
  }, []);
}
```

## Caveats and Common Mistakes

### ⚠️ 1. useCallback Only Memoizes Function Reference
```javascript
// useCallback doesn't prevent the function from being created
// It just returns the same reference

function Component() {
  const [count, setCount] = useState(0);

  // Function is still CREATED on every render
  // useCallback just returns previous reference
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  // The performance gain comes from preventing child re-renders,
  // not from avoiding function creation
}
```

### ⚠️ 2. Inline Functions in JSX Are Usually Fine
```javascript
// This is usually fine - don't optimize prematurely
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

// Only optimize if:
// 1. Child is memoized
// 2. Child is expensive to render
// 3. Profiler shows it's a problem
```

### ⚠️ 3. Doesn't Prevent Function Execution
```javascript
// Common misconception
function Component() {
  const expensiveOperation = useCallback(() => {
    // This still runs every time it's called!
    return complexCalculation();
  }, []);

  // useCallback doesn't cache the RESULT
  // Use useMemo for caching results
  const result = useMemo(() => complexCalculation(), []);
}
```

### ⚠️ 4. Stale Closures with Empty Deps
```javascript
function Component() {
  const [count, setCount] = useState(0);

  const logCount = useCallback(() => {
    console.log(count); // Stale closure!
  }, []); // Empty deps

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={logCount}>Log Count (shows stale value)</button>
    </>
  );
}

// Solution: Include dependency or use ref
function Component() {
  const [count, setCount] = useState(0);

  const logCount = useCallback(() => {
    console.log(count);
  }, [count]); // Include dependency
}
```

### ⚠️ 5. Dependencies Must Be Stable
```javascript
// PROBLEM: Object dependency
function Component({ config }) {
  const handleAction = useCallback(() => {
    doSomething(config);
  }, [config]); // If config is new object each render, useCallback doesn't help

  // Solution: Memoize config or destructure specific values
}
```

## Advanced Patterns

### Pattern 1: Event Handler Factory
```javascript
function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

const TodoItem = React.memo(function TodoItem({ todo, onToggle, onDelete }) {
  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [todo.id, onDelete]);

  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={handleToggle} />
      {todo.text}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
});
```

### Pattern 2: Combining useCallback with useRef
```javascript
function Component({ onChange }) {
  const [value, setValue] = useState('');
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChangeRef.current(newValue);
  }, []); // Stable reference!

  return <input value={value} onChange={handleChange} />;
}
```

### Pattern 3: Throttled Callback
```javascript
function useThrottle(callback, delay) {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
}

// Usage
function Component() {
  const handleScroll = useCallback(() => {
    console.log('Scrolled!');
  }, []);

  const throttledScroll = useThrottle(handleScroll, 200);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);
}
```

### Pattern 4: Callback with Abort
```javascript
function useAbortableCallback(callback, deps) {
  const abortControllerRef = useRef(null);

  const abortableCallback = useCallback(async (...args) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      return await callback(...args, signal);
    } catch (err) {
      if (err.name !== 'AbortError') {
        throw err;
      }
    }
  }, deps);

  return abortableCallback;
}
```

### Pattern 5: Callback Composition
```javascript
function useComposedCallback(...callbacks) {
  return useCallback((...args) => {
    callbacks.forEach(callback => {
      if (callback) callback(...args);
    });
  }, callbacks);
}

// Usage
function Component({ onAction, onLog }) {
  const handleClick = useComposedCallback(
    onAction,
    onLog,
    () => console.log('Clicked')
  );

  return <button onClick={handleClick}>Action</button>;
}
```

## When to Use useCallback

### Use useCallback when:
- ✅ Passing callbacks to memoized children
- ✅ Callback is a dependency of useEffect
- ✅ Callback is used in custom hooks
- ✅ Creating event handler factories
- ✅ Optimizing expensive child components

### Don't use useCallback when:
- ❌ Child is not memoized
- ❌ Optimizing prematurely without profiling
- ❌ Simple inline event handlers
- ❌ No performance issue exists
- ❌ Function doesn't prevent re-renders

## useCallback vs useMemo

```javascript
// For functions: use useCallback
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// For values: use useMemo
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// They're related:
useCallback(fn, deps) === useMemo(() => fn, deps)
```

## Summary

**Do:**
- ✅ Use with React.memo children
- ✅ Include all dependencies
- ✅ Profile before optimizing
- ✅ Use for effect dependencies
- ✅ Combine with refs for stable callbacks

**Don't:**
- ❌ Use without React.memo
- ❌ Premature optimization
- ❌ Wrap every function
- ❌ Forget dependencies
- ❌ Use for caching results (use useMemo)

**Remember:**
- useCallback is for functions
- useMemo is for values
- Only helps with memoized children
- Measure performance impact
- Inline functions are usually fine
