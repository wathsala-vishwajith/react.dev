# useLayoutEffect Hook - Comprehensive Guide

## Overview
`useLayoutEffect` is identical to `useEffect`, but fires synchronously after all DOM mutations and before the browser paints. Use it when you need to read layout from the DOM and synchronously re-render.

## Basic Syntax
```javascript
useLayoutEffect(() => {
  // Code runs synchronously after DOM mutations, before paint
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

## ⚠️ Warning
`useLayoutEffect` can hurt performance. Prefer `useEffect` when possible.

## Table of Contents
1. [Basic Examples](#basic-examples)
2. [Best Practices](#best-practices)
3. [Anti-Patterns](#anti-patterns)
4. [Caveats and Common Mistakes](#caveats-and-common-mistakes)
5. [Advanced Patterns](#advanced-patterns)

## Basic Examples

### Measuring DOM Elements
```javascript
function Tooltip({ children, tooltipContent }) {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    const { height } = tooltipRef.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, [tooltipContent]);

  return (
    <div>
      {children}
      <div ref={tooltipRef} style={{ position: 'absolute', top: -tooltipHeight }}>
        {tooltipContent}
      </div>
    </div>
  );
}
```

### Preventing Visual Flicker
```javascript
function Component() {
  const ref = useRef(null);

  // BAD: useEffect - user sees flicker
  useEffect(() => {
    ref.current.scrollTop = 0;
  }, []);

  // GOOD: useLayoutEffect - runs before paint
  useLayoutEffect(() => {
    ref.current.scrollTop = 0;
  }, []);

  return <div ref={ref}>{/* content */}</div>;
}
```

## useEffect vs useLayoutEffect

### Execution Timing

```
Component Render
      ↓
DOM Mutations
      ↓
useLayoutEffect fires (synchronously) ← Blocks painting
      ↓
Browser Paint (visual update)
      ↓
useEffect fires (asynchronously) ← After paint
```

### Visual Comparison

```javascript
function EffectComparison() {
  const [count, setCount] = useState(0);

  // useEffect - may see flicker
  useEffect(() => {
    if (count === 5) {
      setCount(0); // User might see "5" briefly
    }
  }, [count]);

  // useLayoutEffect - no flicker
  useLayoutEffect(() => {
    if (count === 5) {
      setCount(0); // User never sees "5"
    }
  }, [count]);

  return <div>{count}</div>;
}
```

## Best Practices

### ✅ 1. Use for DOM Measurements
```javascript
// GOOD: Measure before paint
function AutosizeTextarea({ value }) {
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return <textarea ref={textareaRef} value={value} />;
}
```

### ✅ 2. Use for Scroll Position Restoration
```javascript
// GOOD: Set scroll before paint
function ScrollableList({ items, scrollPosition }) {
  const listRef = useRef(null);

  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div ref={listRef}>
      {items.map(item => <Item key={item.id} {...item} />)}
    </div>
  );
}
```

### ✅ 3. Use for Preventing Flicker
```javascript
// GOOD: Update DOM before user sees it
function AnimatedValue({ value }) {
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    element.style.transform = `translateX(${value}px)`;
  }, [value]);

  return <div ref={elementRef}>Animated</div>;
}
```

### ✅ 4. Use for Tooltip Positioning
```javascript
// GOOD: Calculate position before paint
function Tooltip({ targetRef, content }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      setPosition({
        top: targetRect.bottom + 10,
        left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
      });
    }
  }, [targetRef, content]);

  return (
    <div ref={tooltipRef} style={{ position: 'fixed', ...position }}>
      {content}
    </div>
  );
}
```

## Anti-Patterns

### ❌ 1. Using for Data Fetching
```javascript
// BAD: Don't use useLayoutEffect for async operations
function Component({ userId }) {
  useLayoutEffect(() => {
    fetchUser(userId).then(setUser); // Blocks painting!
  }, [userId]);
}

// GOOD: Use useEffect for async operations
function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
}
```

### ❌ 2. Using When useEffect Would Work
```javascript
// BAD: Unnecessary blocking
function Component({ onMount }) {
  useLayoutEffect(() => {
    onMount(); // Doesn't need to block paint
  }, []);
}

// GOOD: Use useEffect
function Component({ onMount }) {
  useEffect(() => {
    onMount();
  }, []);
}
```

### ❌ 3. Heavy Computations
```javascript
// BAD: Blocks painting for too long
function Component({ data }) {
  useLayoutEffect(() => {
    const processed = data.map(expensiveOperation); // Blocks!
    setProcessed(processed);
  }, [data]);
}

// GOOD: Use useEffect or useMemo
function Component({ data }) {
  const processed = useMemo(() =>
    data.map(expensiveOperation)
  , [data]);
}
```

### ❌ 4. Side Effects That Don't Affect Layout
```javascript
// BAD: Analytics don't need to block paint
function Component() {
  useLayoutEffect(() => {
    analytics.track('page_view'); // Wrong hook!
  }, []);
}

// GOOD: Use useEffect
function Component() {
  useEffect(() => {
    analytics.track('page_view');
  }, []);
}
```

### ❌ 5. Server-Side Rendering
```javascript
// BAD: Breaks SSR
function Component() {
  useLayoutEffect(() => {
    // Runs in browser, not on server
    // Can cause hydration mismatches
  }, []);
}

// GOOD: Check for browser environment
function Component() {
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      // Safe for SSR
    }
  }, []);
}

// BETTER: Use useEffect if possible
function Component() {
  useEffect(() => {
    // Works in SSR
  }, []);
}
```

## Caveats and Common Mistakes

### ⚠️ 1. Blocks Browser Painting
```javascript
// This delays the visual update!
useLayoutEffect(() => {
  // Heavy synchronous work
  for (let i = 0; i < 1000000; i++) {
    // User sees nothing until this completes
  }
}, []);
```

### ⚠️ 2. SSR Warning
```javascript
// Warning in server-side rendering:
// "useLayoutEffect does nothing on the server"

// Solution: Conditional hook or use useEffect
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Component() {
  useIsomorphicLayoutEffect(() => {
    // Works in both environments
  }, []);
}
```

### ⚠️ 3. Can Cause Infinite Loops
```javascript
// BAD: Infinite loop
function Component() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef(null);

  useLayoutEffect(() => {
    const { width, height } = ref.current.getBoundingClientRect();
    setSize({ width, height }); // Causes re-render → runs again!
  }); // No dependency array!
}

// GOOD: Conditional update
function Component() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef(null);

  useLayoutEffect(() => {
    const { width, height } = ref.current.getBoundingClientRect();
    setSize(prev => {
      if (prev.width !== width || prev.height !== height) {
        return { width, height };
      }
      return prev; // Prevents infinite loop
    });
  }, []);
}
```

### ⚠️ 4. Runs Before Paint, Not Before Render
```javascript
// useLayoutEffect still runs AFTER render, just before paint
function Component() {
  console.log('1. Render');

  useLayoutEffect(() => {
    console.log('3. useLayoutEffect');
  });

  console.log('2. Still rendering');

  // Output:
  // 1. Render
  // 2. Still rendering
  // 3. useLayoutEffect
}
```

### ⚠️ 5. Performance Impact
```javascript
// Measuring performance impact
function Component() {
  useLayoutEffect(() => {
    const start = performance.now();
    // Your code here
    const end = performance.now();
    console.log(`useLayoutEffect took ${end - start}ms`);
    // Anything over ~16ms (60fps) can cause jank
  });
}
```

## Advanced Patterns

### Pattern 1: Resize Observer with useLayoutEffect
```javascript
function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
```

### Pattern 2: Sync External State
```javascript
function useSyncExternalStore(subscribe, getSnapshot) {
  const [state, setState] = useState(getSnapshot);

  useLayoutEffect(() => {
    setState(getSnapshot());

    const unsubscribe = subscribe(() => {
      setState(getSnapshot());
    });

    return unsubscribe;
  }, [subscribe, getSnapshot]);

  return state;
}
```

### Pattern 3: Portal Positioning
```javascript
function usePortalPosition(triggerRef, portalRef) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!triggerRef.current || !portalRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const portalRect = portalRef.current.getBoundingClientRect();

      let top = triggerRect.bottom + window.scrollY;
      let left = triggerRect.left + window.scrollX;

      // Adjust if off-screen
      if (left + portalRect.width > window.innerWidth) {
        left = window.innerWidth - portalRect.width - 10;
      }

      if (top + portalRect.height > window.innerHeight + window.scrollY) {
        top = triggerRect.top + window.scrollY - portalRect.height;
      }

      setPosition({ top, left });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [triggerRef, portalRef]);

  return position;
}
```

### Pattern 4: Animate on Mount
```javascript
function useAnimateOnMount(ref, animation) {
  useLayoutEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const { from, to } = animation;

    // Set initial state (before paint)
    Object.assign(element.style, from);

    // Trigger animation (after paint)
    requestAnimationFrame(() => {
      Object.assign(element.style, to);
    });
  }, [ref, animation]);
}
```

### Pattern 5: Focus Management
```javascript
function useFocusOnMount(ref, shouldFocus = true) {
  useLayoutEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [ref, shouldFocus]);
}

// Usage
function Modal({ isOpen }) {
  const inputRef = useRef(null);
  useFocusOnMount(inputRef, isOpen);

  return <input ref={inputRef} />;
}
```

## When to Use useLayoutEffect

### Use useLayoutEffect when:
- ✅ Measuring DOM elements before paint
- ✅ Preventing visual flicker
- ✅ Synchronizing scroll position
- ✅ Positioning tooltips/popovers
- ✅ Reading layout and immediately updating

### Use useEffect when:
- ✅ Data fetching
- ✅ Setting up subscriptions
- ✅ Analytics
- ✅ Side effects that don't affect layout
- ✅ Anything that doesn't need to block paint

## Rule of Thumb

**Start with `useEffect`. Only use `useLayoutEffect` if you:**
1. See visual flicker
2. Need to measure DOM before paint
3. Need to update DOM synchronously

## Summary

**Do:**
- ✅ Use for DOM measurements
- ✅ Use to prevent visual flicker
- ✅ Use for scroll restoration
- ✅ Keep synchronous and fast
- ✅ Prefer useEffect when possible

**Don't:**
- ❌ Use for data fetching
- ❌ Use for heavy computations
- ❌ Use when useEffect works
- ❌ Block painting unnecessarily
- ❌ Ignore SSR warnings

**Remember:**
- Runs synchronously after DOM updates
- Blocks browser painting
- Can hurt performance if slow
- Same API as useEffect
- Prefer useEffect in most cases
- SSR requires special handling
