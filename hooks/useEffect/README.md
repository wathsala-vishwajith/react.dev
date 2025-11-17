# useEffect Hook - Comprehensive Guide

## Overview
`useEffect` lets you synchronize a component with an external system (APIs, browser APIs, third-party libraries). It runs side effects after render and can optionally clean them up.

## Basic Syntax
```javascript
useEffect(() => {
  // Effect code
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);
```

## Table of Contents
1. [Basic Examples](#basic-examples)
2. [Best Practices](#best-practices)
3. [Anti-Patterns](#anti-patterns)
4. [Caveats and Common Mistakes](#caveats-and-common-mistakes)
5. [Advanced Patterns](#advanced-patterns)

## Basic Examples

### Simple Effect
```javascript
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <h1>{title}</h1>;
}
```

### Effect with Cleanup
```javascript
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, []);

  return <div>Count: {count}</div>;
}
```

## Best Practices

### ✅ 1. Always Specify Dependencies
```javascript
// GOOD: All dependencies listed
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // userId is listed

  return <div>{user?.name}</div>;
}

// BAD: Missing dependency
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // userId missing! Stale closure bug
}
```

### ✅ 2. Clean Up Side Effects
```javascript
// GOOD: Cleanup prevents memory leaks
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect(); // Cleanup!
    };
  }, [roomId]);
}

// GOOD: Cleanup for event listeners
function WindowSize() {
  const [size, setSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}
```

### ✅ 3. Separate Unrelated Effects
```javascript
// GOOD: Each effect handles one concern
function UserDashboard({ userId }) {
  // Effect 1: Fetch user data
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // Effect 2: Track analytics
  useEffect(() => {
    analytics.pageView('dashboard');
  }, []);

  // Effect 3: Set page title
  useEffect(() => {
    document.title = `Dashboard - ${user?.name}`;
  }, [user]);
}

// BAD: Mixing unrelated concerns
function UserDashboard({ userId }) {
  useEffect(() => {
    fetchUser(userId).then(setUser);
    analytics.pageView('dashboard');
    document.title = 'Dashboard';
    // Hard to understand and maintain!
  }, [userId]);
}
```

### ✅ 4. Use Functional Updates in Effects
```javascript
// GOOD: No need to include state in dependencies
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1); // Functional update
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty deps - effect never re-runs

  return <div>{count}</div>;
}

// BAD: Including state in dependencies causes effect to re-run
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // Uses closure
    }, 1000);

    return () => clearInterval(interval);
  }, [count]); // Effect re-runs every second!
}
```

## Anti-Patterns

### ❌ 1. Using useEffect for Derived State
```javascript
// BAD: Using effect to sync state
function ProductList({ products, category }) {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setFilteredProducts(
      products.filter(p => p.category === category)
    );
  }, [products, category]);
}

// GOOD: Calculate during render
function ProductList({ products, category }) {
  const filteredProducts = products.filter(p => p.category === category);
  // No useEffect needed!
}
```

### ❌ 2. Fetching in useEffect Without Cleanup
```javascript
// BAD: Race condition, no cleanup
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(user => {
      setUser(user); // May set state for wrong user!
    });
  }, [userId]);
}

// GOOD: Proper cleanup prevents race conditions
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchUser(userId).then(user => {
      if (!cancelled) {
        setUser(user);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);
}

// BETTER: Using AbortController
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(setUser)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => controller.abort();
  }, [userId]);
}
```

### ❌ 3. Missing Dependencies
```javascript
// BAD: ESLint will warn about this
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    search(query).then(setResults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Missing query dependency!
}

// GOOD: Include all dependencies
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    search(query).then(setResults);
  }, [query]); // Correct!
}
```

### ❌ 4. Updating State in Effect Without Cleanup
```javascript
// BAD: Can cause infinite loops
function Component({ value }) {
  const [state, setState] = useState(value);

  useEffect(() => {
    setState(value); // Re-render -> effect runs -> re-render -> ...
  }); // No dependency array!

  return <div>{state}</div>;
}

// GOOD: Proper dependencies
function Component({ value }) {
  const [state, setState] = useState(value);

  useEffect(() => {
    setState(value);
  }, [value]); // Only runs when value changes
}

// BETTER: Just use the prop directly
function Component({ value }) {
  return <div>{value}</div>;
}
```

### ❌ 5. Not Handling Async Properly
```javascript
// BAD: useEffect callback cannot be async
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);

// GOOD: Async function inside effect
useEffect(() => {
  async function loadData() {
    const data = await fetchData();
    setData(data);
  }
  loadData();
}, []);

// GOOD: Using .then()
useEffect(() => {
  fetchData().then(setData);
}, []);
```

## Caveats and Common Mistakes

### ⚠️ 1. Effect Runs After Paint
```javascript
// Effect runs AFTER browser paints
useEffect(() => {
  // This runs after the DOM is updated
  console.log('After paint');
});

// Use useLayoutEffect for synchronous updates
useLayoutEffect(() => {
  // This runs BEFORE browser paints
  // Use sparingly - can block visual updates
  console.log('Before paint');
});
```

### ⚠️ 2. Development Double Invocation (React 18+ Strict Mode)
```javascript
// In development, React calls effects twice to help find bugs
function Component() {
  useEffect(() => {
    console.log('Mount'); // Logs twice in dev!

    return () => {
      console.log('Cleanup'); // Logs twice in dev!
    };
  }, []);
}

// This is intentional to help you find cleanup bugs
// In production, it only runs once
```

### ⚠️ 3. Empty Dependency Array vs No Array
```javascript
// Runs once on mount
useEffect(() => {
  console.log('Runs once');
}, []);

// Runs after EVERY render
useEffect(() => {
  console.log('Runs after every render');
}); // No dependency array!

// Runs when dependencies change
useEffect(() => {
  console.log('Runs when count changes');
}, [count]);
```

### ⚠️ 4. Object/Array Dependencies
```javascript
// BAD: New object on every render
function Component() {
  const options = { limit: 10 }; // New reference each render

  useEffect(() => {
    fetchData(options);
  }, [options]); // Runs on every render!
}

// GOOD: Stable reference
function Component() {
  useEffect(() => {
    const options = { limit: 10 };
    fetchData(options);
  }, []); // Only runs once

  // Or use useMemo for the options
  const options = useMemo(() => ({ limit: 10 }), []);
}
```

### ⚠️ 5. setState in Effect Can Cause Loops
```javascript
// BAD: Infinite loop
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // Causes re-render -> effect runs -> ...
  }); // No deps - runs after every render!
}

// GOOD: Conditional update
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 10) {
      setCount(count + 1);
    }
  }, [count]); // Stops at 10
}
```

## Advanced Patterns

### Pattern 1: Custom Hook for Data Fetching
```javascript
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchUser(userId)
      .then(data => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { user, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
}
```

### Pattern 2: Debounced Effect
```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery).then(setResults);
    }
  }, [debouncedQuery]);
}
```

### Pattern 3: Event Listener Hook
```javascript
function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    return () => element.removeEventListener(eventName, eventListener);
  }, [eventName, element]);
}

// Usage
function Component() {
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}
```

### Pattern 4: Interval Hook
```javascript
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Usage
function Timer() {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(c => c + 1);
  }, 1000);

  return <div>{count}</div>;
}
```

## When NOT to Use useEffect

### 1. Transforming Data for Rendering
```javascript
// ❌ Don't use effect
function Component({ items }) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(items.filter(item => item.active));
  }, [items]);
}

// ✅ Just calculate it
function Component({ items }) {
  const filtered = items.filter(item => item.active);
}
```

### 2. Handling User Events
```javascript
// ❌ Don't use effect
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      sendToAPI(formData);
    }
  }, [submitted]);
}

// ✅ Use event handler
function Form() {
  const handleSubmit = () => {
    sendToAPI(formData);
  };
}
```

### 3. Resetting State on Prop Change
```javascript
// ❌ Don't use effect
function Form({ userId }) {
  const [data, setData] = useState({});

  useEffect(() => {
    setData({});
  }, [userId]);
}

// ✅ Use key to reset
function Parent() {
  return <Form key={userId} />;
}

// ✅ Or calculate from props
function Form({ userId }) {
  const [data, setData] = useState({});
  const [prevUserId, setPrevUserId] = useState(userId);

  if (userId !== prevUserId) {
    setData({});
    setPrevUserId(userId);
  }
}
```

## Summary

**Do:**
- ✅ Always specify dependencies correctly
- ✅ Clean up side effects (intervals, subscriptions, listeners)
- ✅ Separate unrelated effects
- ✅ Use functional updates to avoid stale closures
- ✅ Handle async operations with cleanup

**Don't:**
- ❌ Use effects for calculations (do it during render)
- ❌ Forget to clean up subscriptions
- ❌ Ignore the linter warnings about dependencies
- ❌ Make effect callback async
- ❌ Update state without proper dependencies (infinite loops)

**Remember:**
- Effects run AFTER render
- Cleanup runs before next effect and on unmount
- In Strict Mode (dev), effects run twice
- Empty deps `[]` = run once on mount
- No deps = run after every render
- Deps array = run when dependencies change
