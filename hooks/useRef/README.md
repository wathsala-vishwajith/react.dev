# useRef Hook - Comprehensive Guide

## Overview
`useRef` returns a mutable ref object whose `.current` property persists across renders. It's commonly used for accessing DOM elements and storing mutable values that don't trigger re-renders.

## Basic Syntax
```javascript
const ref = useRef(initialValue);
```

## Table of Contents
1. [Basic Examples](#basic-examples)
2. [Best Practices](#best-practices)
3. [Anti-Patterns](#anti-patterns)
4. [Caveats and Common Mistakes](#caveats-and-common-mistakes)
5. [Advanced Patterns](#advanced-patterns)

## Basic Examples

### Accessing DOM Elements
```javascript
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```

### Storing Previous Value
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Best Practices

### ✅ 1. Use for DOM Access
```javascript
// GOOD: Direct DOM manipulation when necessary
function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  const play = () => {
    videoRef.current.play();
  };

  const pause = () => {
    videoRef.current.pause();
  };

  return (
    <>
      <video ref={videoRef} src={src} />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </>
  );
}
```

### ✅ 2. Store Mutable Values That Don't Affect Rendering
```javascript
// GOOD: Store interval ID without causing re-renders
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCount(c => c + 1);
      }, 1000);
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### ✅ 3. Track Previous Props/State
```javascript
// GOOD: Custom hook for previous value
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
function Component({ value }) {
  const prevValue = usePrevious(value);

  useEffect(() => {
    if (value !== prevValue) {
      console.log(`Changed from ${prevValue} to ${value}`);
    }
  }, [value, prevValue]);
}
```

### ✅ 4. Store Callback References
```javascript
// GOOD: Store latest callback without including in dependencies
function Component({ onChange }) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const interval = setInterval(() => {
      onChangeRef.current(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty deps - no effect re-runs
}
```

### ✅ 5. Measure DOM Elements
```javascript
// GOOD: Get element dimensions
function MeasuredComponent() {
  const elementRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  return (
    <div ref={elementRef}>
      Size: {dimensions.width}x{dimensions.height}
    </div>
  );
}
```

## Anti-Patterns

### ❌ 1. Using Ref for State That Affects Rendering
```javascript
// BAD: Using ref for data that should trigger re-render
function BadCounter() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    // Component doesn't re-render!
  };

  return (
    <div>
      <p>Count: {countRef.current}</p> {/* Shows stale value */}
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// GOOD: Use useState for data that affects rendering
function GoodCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### ❌ 2. Reading/Writing Ref During Render
```javascript
// BAD: Don't read/write refs during render
function BadComponent() {
  const renderCount = useRef(0);
  renderCount.current += 1; // WRONG! Side effect during render

  return <div>Renders: {renderCount.current}</div>;
}

// GOOD: Use useEffect for side effects
function GoodComponent() {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return <div>Renders: {renderCount.current}</div>;
}

// BETTER: Use a separate variable if you need it during render
function BetterComponent() {
  const renderCount = useRef(0);
  renderCount.current += 1; // OK for tracking, but be careful

  // Don't use renderCount.current in conditional logic
  return <div>Renders: {renderCount.current}</div>;
}
```

### ❌ 3. Forgetting to Check if Ref is Mounted
```javascript
// BAD: Accessing ref.current without null check
function BadComponent() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // Might be null!
  }, []);

  return <input ref={inputRef} />;
}

// GOOD: Always check if ref is mounted
function GoodComponent() {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return <input ref={inputRef} />;
}
```

### ❌ 4. Using Ref for Derived Values
```javascript
// BAD: Using ref to store calculated values
function BadComponent({ items }) {
  const countRef = useRef(0);
  countRef.current = items.length; // Unnecessary!

  return <div>Count: {countRef.current}</div>;
}

// GOOD: Just calculate it
function GoodComponent({ items }) {
  const count = items.length;
  return <div>Count: {count}</div>;
}
```

### ❌ 5. Overusing Refs
```javascript
// BAD: Using refs for everything
function BadForm() {
  const nameRef = useRef('');
  const emailRef = useRef('');
  const phoneRef = useRef('');

  const handleSubmit = () => {
    console.log(nameRef.current, emailRef.current, phoneRef.current);
  };

  return (
    <form>
      <input onChange={(e) => nameRef.current = e.target.value} />
      {/* Component doesn't re-render, can't show validation */}
    </form>
  );
}

// GOOD: Use state for form data
function GoodForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {/* Can show validation, conditional rendering, etc. */}
    </form>
  );
}
```

## Caveats and Common Mistakes

### ⚠️ 1. Ref Changes Don't Trigger Re-renders
```javascript
function Component() {
  const ref = useRef(0);

  const increment = () => {
    ref.current += 1;
    console.log(ref.current); // Logs new value
    // But component doesn't re-render!
  };

  return (
    <div>
      <p>{ref.current}</p> {/* Shows stale value */}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### ⚠️ 2. Ref is Not Available on First Render
```javascript
function Component() {
  const divRef = useRef(null);

  // First render: divRef.current is null
  console.log(divRef.current); // null

  useEffect(() => {
    // After mount: divRef.current is the DOM element
    console.log(divRef.current); // <div>...</div>
  }, []);

  return <div ref={divRef}>Hello</div>;
}
```

### ⚠️ 3. Ref Callback vs useRef
```javascript
// Using ref callback
function Component() {
  const [node, setNode] = useState(null);

  const refCallback = (element) => {
    if (element) {
      console.log('Element mounted:', element);
      setNode(element);
    }
  };

  return <div ref={refCallback}>Hello</div>;
}

// Using useRef
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log('Element mounted:', ref.current);
    }
  }, []);

  return <div ref={ref}>Hello</div>;
}
```

### ⚠️ 4. Refs Don't Work with Function Components (Without forwardRef)
```javascript
// BAD: Can't attach ref to function component
function BadParent() {
  const childRef = useRef(null);
  return <FunctionChild ref={childRef} />; // Error!
}

// GOOD: Use forwardRef
const FunctionChild = forwardRef((props, ref) => {
  return <input ref={ref} />;
});

function GoodParent() {
  const childRef = useRef(null);
  return <FunctionChild ref={childRef} />;
}
```

### ⚠️ 5. Closure Issues with Refs
```javascript
// Be careful with closures
function Component() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const handleClick = () => {
    setTimeout(() => {
      // Uses stale count from closure
      console.log('State:', count);
      // Uses current count from ref
      console.log('Ref:', countRef.current);
    }, 3000);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>Log After 3s</button>
    </div>
  );
}
```

## Advanced Patterns

### Pattern 1: useTimeout Hook
```javascript
function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

// Usage
function Component() {
  useTimeout(() => {
    console.log('Executed after 1 second');
  }, 1000);
}
```

### Pattern 2: useInterval Hook
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

### Pattern 3: Instance Variables
```javascript
function useInstanceVariable(initialValue) {
  const ref = useRef(initialValue);
  return ref;
}

function Component() {
  const requestCount = useInstanceVariable(0);

  const makeRequest = async () => {
    requestCount.current += 1;
    const currentRequest = requestCount.current;

    const data = await fetch('/api/data');

    // Ignore if newer request was made
    if (currentRequest !== requestCount.current) {
      return;
    }

    setData(data);
  };
}
```

### Pattern 4: Focus Management
```javascript
function useFocusTrap(ref) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTab);
    return () => element.removeEventListener('keydown', handleTab);
  }, [ref]);
}
```

### Pattern 5: Measuring and Observing
```javascript
function useResizeObserver(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

// Usage
function Component() {
  const divRef = useRef(null);
  const size = useResizeObserver(divRef);

  return (
    <div ref={divRef}>
      Size: {size.width}x{size.height}
    </div>
  );
}
```

## useRef vs useState

### When to Use useRef
- ✅ Storing DOM references
- ✅ Storing timer IDs (setTimeout, setInterval)
- ✅ Tracking previous values
- ✅ Storing mutable values that don't affect rendering
- ✅ Avoiding stale closures

### When to Use useState
- ✅ Data that affects rendering
- ✅ Form input values
- ✅ UI state (open/closed, loading, etc.)
- ✅ Anything user should see updated

## Summary

**Do:**
- ✅ Use refs for DOM manipulation
- ✅ Store mutable values that don't trigger re-renders
- ✅ Track previous values
- ✅ Store timer/subscription IDs
- ✅ Always check if ref.current exists before using

**Don't:**
- ❌ Use refs for data that affects rendering
- ❌ Read/write refs during render (use useEffect)
- ❌ Use refs for derived values
- ❌ Forget null checks when accessing DOM refs
- ❌ Overuse refs (prefer state for most cases)

**Remember:**
- Ref changes don't trigger re-renders
- Ref.current is mutable
- Refs are available after initial render
- Use forwardRef to pass refs to function components
- Refs persist across re-renders
