# Custom Hooks - Comprehensive Guide

## Overview
Custom Hooks allow you to extract component logic into reusable functions. They follow the same rules as built-in hooks and can use other hooks inside them.

## Naming Convention
- Custom hooks **must** start with "use" (e.g., `useFetch`, `useLocalStorage`)
- This tells React to check for Hook rules

## Table of Contents
1. [Common Custom Hooks](#common-custom-hooks)
2. [Best Practices](#best-practices)
3. [Anti-Patterns](#anti-patterns)
4. [Advanced Patterns](#advanced-patterns)

## Common Custom Hooks

### 1. useLocalStorage
```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

### 2. useFetch
```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setData(data);
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
  }, [url]);

  return { data, loading, error };
}
```

### 3. useDebounce
```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### 4. useToggle
```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle, setValue];
}
```

### 5. usePrevious
```javascript
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

### 6. useWindowSize
```javascript
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
```

### 7. useOnClickOutside
```javascript
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

### 8. useInterval
```javascript
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

### 9. useAsync
```javascript
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}
```

### 10. useMediaQuery
```javascript
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
}
```

## Best Practices

### ✅ 1. Extract Reusable Logic
```javascript
// GOOD: Reusable custom hook
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  }, []);

  const logout = useCallback(async () => {
    return auth.signOut();
  }, []);

  return { user, loading, login, logout };
}
```

### ✅ 2. Return Stable References
```javascript
// GOOD: Memoized return values
function useData(id) {
  const [data, setData] = useState(null);

  const refresh = useCallback(() => {
    fetchData(id).then(setData);
  }, [id]);

  return useMemo(() => ({
    data,
    refresh
  }), [data, refresh]);
}
```

### ✅ 3. Document Your Hooks
```javascript
/**
 * useForm - Manage form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Form state and handlers
 */
function useForm(initialValues, onSubmit, validationRules) {
  // Implementation
}
```

### ✅ 4. Cleanup Side Effects
```javascript
// GOOD: Proper cleanup
function useWebSocket(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => {
      ws.close(); // Cleanup!
    };
  }, [url]);

  return data;
}
```

### ✅ 5. Compose Hooks
```javascript
// GOOD: Compose multiple hooks
function useUser(userId) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`);
  const previous = usePrevious(data);

  return {
    user: data,
    loading,
    error,
    hasChanged: data !== previous
  };
}
```

## Anti-Patterns

### ❌ 1. Not Starting with "use"
```javascript
// BAD: Doesn't follow naming convention
function getWindowSize() {
  const [size, setSize] = useState(window.innerWidth);
  // React won't check hook rules!
}

// GOOD: Starts with "use"
function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth);
}
```

### ❌ 2. Conditional Hook Calls
```javascript
// BAD: Conditional hooks
function useConditional(shouldUse) {
  if (shouldUse) {
    const [value, setValue] = useState(0); // WRONG!
  }
}

// GOOD: Always call hooks
function useConditional(shouldUse) {
  const [value, setValue] = useState(0);
  return shouldUse ? value : null;
}
```

### ❌ 3. Unstable Return Values
```javascript
// BAD: New object every render
function useData() {
  const [data, setData] = useState(null);

  return {
    data,
    refresh: () => fetchData().then(setData) // New function!
  };
}

// GOOD: Memoized values
function useData() {
  const [data, setData] = useState(null);

  const refresh = useCallback(() => {
    fetchData().then(setData);
  }, []);

  return useMemo(() => ({ data, refresh }), [data, refresh]);
}
```

### ❌ 4. Not Handling Cleanup
```javascript
// BAD: No cleanup
function useTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => setCount(c => c + 1), 1000);
    // Memory leak!
  }, []);
}

// GOOD: Proper cleanup
function useTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(id);
  }, []);
}
```

### ❌ 5. Too Generic
```javascript
// BAD: Too generic, hard to understand
function useData(config) {
  // Handles 20 different cases
  // Hard to maintain and use
}

// GOOD: Specific, focused hooks
function useUserData(userId) { /* ... */ }
function useProductData(productId) { /* ... */ }
```

## Advanced Patterns

### Pattern 1: Hook Factory
```javascript
function createFetchHook(baseUrl) {
  return function useFetch(endpoint) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch(`${baseUrl}${endpoint}`)
        .then(res => res.json())
        .then(setData)
        .finally(() => setLoading(false));
    }, [endpoint]);

    return { data, loading };
  };
}

const useAPI = createFetchHook('https://api.example.com');
```

### Pattern 2: State Machine Hook
```javascript
function useStateMachine(initialState, transitions) {
  const [state, setState] = useState(initialState);

  const transition = useCallback((action) => {
    const nextState = transitions[state]?.[action];
    if (nextState) {
      setState(nextState);
    }
  }, [state, transitions]);

  return [state, transition];
}

// Usage
const [state, transition] = useStateMachine('idle', {
  idle: { START: 'loading' },
  loading: { SUCCESS: 'success', ERROR: 'error' },
  success: { RESET: 'idle' },
  error: { RESET: 'idle' }
});
```

### Pattern 3: Subscription Hook
```javascript
function useSubscription(subscribe, getSnapshot) {
  const [snapshot, setSnapshot] = useState(getSnapshot);

  useEffect(() => {
    setSnapshot(getSnapshot());

    const unsubscribe = subscribe(() => {
      setSnapshot(getSnapshot());
    });

    return unsubscribe;
  }, [subscribe, getSnapshot]);

  return snapshot;
}
```

### Pattern 4: Reducer + Context Hook
```javascript
function createContextHook(reducer, initialState) {
  const StateContext = createContext();
  const DispatchContext = createContext();

  function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  }

  function useState() {
    return useContext(StateContext);
  }

  function useDispatch() {
    return useContext(DispatchContext);
  }

  return { Provider, useState, useDispatch };
}
```

### Pattern 5: Async State Hook
```javascript
function useAsyncState(initialState) {
  const [state, setState] = useState(initialState);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setAsyncState = useCallback((newState) => {
    if (isMountedRef.current) {
      setState(newState);
    }
  }, []);

  return [state, setAsyncState];
}
```

## Testing Custom Hooks

### Using @testing-library/react-hooks
```javascript
import { renderHook, act } from '@testing-library/react-hooks';

test('useCounter', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Summary

**Do:**
- ✅ Start with "use" prefix
- ✅ Extract reusable logic
- ✅ Return stable references
- ✅ Clean up side effects
- ✅ Compose hooks together
- ✅ Document complex hooks

**Don't:**
- ❌ Call hooks conditionally
- ❌ Return unstable values
- ❌ Make hooks too generic
- ❌ Forget cleanup
- ❌ Skip the "use" prefix

**Remember:**
- Custom hooks share logic, not state
- Each call gets independent state
- Follow all Hook rules
- Test hooks in isolation
- Keep hooks focused and simple
