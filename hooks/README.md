# React Hooks - Comprehensive Learning Guide

Welcome to the comprehensive React Hooks learning guide! This repository contains detailed examples, best practices, anti-patterns, and caveats for all essential React hooks.

## 📚 Table of Contents

### Core Hooks
1. [useState](#usestate) - Managing component state
2. [useEffect](#useeffect) - Side effects and lifecycle
3. [useContext](#usecontext) - Accessing context values

### Additional Hooks
4. [useRef](#useref) - DOM access and mutable references
5. [useReducer](#usereducer) - Complex state logic
6. [useMemo](#usememo) - Performance optimization (values)
7. [useCallback](#usecallback) - Performance optimization (functions)

## 🎯 Hook Overview

### useState
**Purpose:** Add state to functional components

**When to use:**
- Simple local component state
- Independent state values
- UI state (open/closed, loading, etc.)

**[View Documentation →](./useState/README.md)** | **[View Examples →](./useState/examples.jsx)**

---

### useEffect
**Purpose:** Synchronize components with external systems

**When to use:**
- Data fetching
- Subscriptions
- DOM manipulation
- Timer setup
- External API integration

**[View Documentation →](./useEffect/README.md)** | **[View Examples →](./useEffect/examples.jsx)**

---

### useContext
**Purpose:** Access context without prop drilling

**When to use:**
- Global state (theme, auth, language)
- Avoiding prop drilling
- Shared configuration
- Plugin systems

**[View Documentation →](./useContext/README.md)** | **[View Examples →](./useContext/examples.jsx)**

---

### useRef
**Purpose:** Access DOM elements and persist mutable values

**When to use:**
- DOM element access
- Storing timer IDs
- Tracking previous values
- Avoiding stale closures
- Mutable values that don't trigger re-renders

**[View Documentation →](./useRef/README.md)** | **[View Examples →](./useRef/examples.jsx)**

---

### useReducer
**Purpose:** Manage complex state logic

**When to use:**
- Complex state with multiple sub-values
- State transitions follow patterns
- Next state depends on previous
- State logic needs testing separately
- Multiple actions update state

**[View Documentation →](./useReducer/README.md)** | **[View Examples →](./useReducer/examples.jsx)**

---

### useMemo
**Purpose:** Cache expensive calculations

**When to use:**
- Expensive computations
- Maintaining reference equality
- Derived state from large datasets
- Context values
- Props for memoized children

**[View Documentation →](./useMemo/README.md)** | **[View Examples →](./useMemo/examples.jsx)**

---

### useCallback
**Purpose:** Cache callback functions

**When to use:**
- Passing callbacks to memoized children
- Callbacks in useEffect dependencies
- Event handler factories
- Custom hooks
- Preventing unnecessary child re-renders

**[View Documentation →](./useCallback/README.md)** | **[View Examples →](./useCallback/examples.jsx)**

---

## 🎓 Learning Path

### Beginner
Start with these essential hooks:
1. **useState** - Master state management first
2. **useEffect** - Understand side effects and lifecycle
3. **useContext** - Learn about context and global state

### Intermediate
Once comfortable with basics, learn:
4. **useRef** - DOM manipulation and mutable values
5. **useReducer** - Complex state management patterns

### Advanced
Finally, master performance optimization:
6. **useMemo** - Optimize expensive calculations
7. **useCallback** - Optimize callback functions

## 📋 Quick Reference

### State Management
```javascript
// Simple state
const [value, setValue] = useState(initial);

// Complex state
const [state, dispatch] = useReducer(reducer, initialState);

// Global state
const value = useContext(MyContext);
```

### Side Effects
```javascript
// Run effect
useEffect(() => {
  // Effect code
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

### Refs & DOM
```javascript
// DOM reference
const ref = useRef(null);
<div ref={ref}>

// Mutable value
const countRef = useRef(0);
countRef.current = 10;
```

### Performance
```javascript
// Memoize value
const value = useMemo(() => compute(a, b), [a, b]);

// Memoize callback
const callback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

## ⚠️ Common Pitfalls

### useState
- ❌ Mutating state directly
- ❌ Not using functional updates
- ❌ Storing derived state
- ❌ Too many useState calls

### useEffect
- ❌ Missing dependencies
- ❌ Not cleaning up side effects
- ❌ Using for derived state
- ❌ Infinite loops

### useContext
- ❌ Not memoizing context values
- ❌ Using for high-frequency updates
- ❌ Creating context inside component
- ❌ Too many nested providers

### useRef
- ❌ Using refs for render-triggering data
- ❌ Reading/writing during render
- ❌ Not checking if ref is mounted
- ❌ Overusing refs

### useReducer
- ❌ Mutating state in reducer
- ❌ Side effects in reducer
- ❌ Using for simple state
- ❌ Dispatching during render

### useMemo
- ❌ Premature optimization
- ❌ Memoizing simple operations
- ❌ Using for side effects
- ❌ Missing dependencies

### useCallback
- ❌ Using without React.memo
- ❌ Wrapping every function
- ❌ Missing dependencies
- ❌ Premature optimization

## 💡 Best Practices

### General Rules
1. ✅ Always follow the Rules of Hooks
2. ✅ Use ESLint plugin for hooks
3. ✅ Profile before optimizing
4. ✅ Keep components small and focused
5. ✅ Extract custom hooks for reusability

### State Management
1. ✅ Use useState for simple, independent state
2. ✅ Use useReducer for complex state logic
3. ✅ Lift state up when needed
4. ✅ Keep state as local as possible
5. ✅ Use functional updates when depending on previous state

### Side Effects
1. ✅ Always specify dependencies
2. ✅ Clean up subscriptions and timers
3. ✅ Separate unrelated effects
4. ✅ Use custom hooks for complex effects
5. ✅ Handle async operations properly

### Performance
1. ✅ Measure before optimizing
2. ✅ Use React DevTools Profiler
3. ✅ Memoize expensive computations only
4. ✅ Combine useMemo/useCallback with React.memo
5. ✅ Split contexts by update frequency

## 🛠️ Tools & Resources

### Development Tools
- **React DevTools** - Component inspector and profiler
- **ESLint Plugin** - `eslint-plugin-react-hooks`
- **TypeScript** - Type safety for hooks

### Additional Learning
- [Official React Documentation](https://react.dev)
- [React Hooks FAQ](https://react.dev/reference/react)
- [Common Hooks Pitfalls](https://react.dev/learn)

## 📁 Repository Structure

```
hooks/
├── README.md (this file)
├── useState/
│   ├── README.md
│   └── examples.jsx
├── useEffect/
│   ├── README.md
│   └── examples.jsx
├── useContext/
│   ├── README.md
│   └── examples.jsx
├── useRef/
│   ├── README.md
│   └── examples.jsx
├── useReducer/
│   ├── README.md
│   └── examples.jsx
├── useMemo/
│   ├── README.md
│   └── examples.jsx
└── useCallback/
    ├── README.md
    └── examples.jsx
```

## 🎯 How to Use This Guide

### For Learning
1. Start with the README.md in each hook folder
2. Read through best practices and anti-patterns
3. Study the example code
4. Try modifying examples
5. Build your own projects

### For Reference
- Use this as a quick lookup when you forget syntax
- Check anti-patterns when debugging
- Review caveats before implementing complex features
- Reference examples for common patterns

### For Teaching
- Use examples in workshops
- Reference anti-patterns in code reviews
- Share specific sections with team members
- Build upon examples for demonstrations

## 🤝 Contributing

This is a learning resource. Feel free to:
- Add more examples
- Improve documentation
- Fix errors or typos
- Suggest additional patterns

## 📝 License

These examples are provided as educational material for learning React Hooks.

---

**Happy Learning! 🚀**

Remember: The best way to learn hooks is to use them in real projects. Start small, experiment, and gradually build more complex applications.
