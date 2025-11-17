# useContext Hook - Comprehensive Guide

## Overview
`useContext` lets you read and subscribe to context from your component, avoiding prop drilling. It's commonly used for themes, authentication, language preferences, and other global state.

## Basic Syntax
```javascript
const value = useContext(SomeContext);
```

## Table of Contents
1. [Basic Examples](#basic-examples)
2. [Best Practices](#best-practices)
3. [Anti-Patterns](#anti-patterns)
4. [Caveats and Common Mistakes](#caveats-and-common-mistakes)
5. [Advanced Patterns](#advanced-patterns)

## Basic Examples

### Simple Theme Context
```javascript
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000'
      }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </button>
  );
}
```

### Basic Usage Pattern
```javascript
// 1. Create context
const MyContext = createContext(defaultValue);

// 2. Provide context
function App() {
  return (
    <MyContext.Provider value={someValue}>
      <ChildComponents />
    </MyContext.Provider>
  );
}

// 3. Consume context
function ChildComponent() {
  const value = useContext(MyContext);
  return <div>{value}</div>;
}
```

## Best Practices

### ✅ 1. Create Custom Hook for Context
```javascript
// GOOD: Custom hook encapsulates context logic
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook with error checking
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function Component() {
  const { theme, setTheme } = useTheme(); // Clean and safe!
}
```

### ✅ 2. Split Contexts by Concern
```javascript
// GOOD: Separate contexts for different concerns
const AuthContext = createContext();
const ThemeContext = createContext();
const LanguageContext = createContext();

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// BAD: One giant context for everything
const AppContext = createContext();

function App() {
  return (
    <AppContext.Provider value={{
      auth, theme, language, user, settings, ...
    }}>
      <AppContent />
    </AppContext.Provider>
  );
}
```

### ✅ 3. Memoize Context Value
```javascript
// GOOD: Memoized value prevents unnecessary re-renders
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

// BAD: New object every render
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### ✅ 4. Provide Default Values
```javascript
// GOOD: Meaningful default value
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {
    console.warn('setTheme called outside provider');
  }
});

// Also good: null with runtime check
const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### ✅ 5. Co-locate Provider with State Logic
```javascript
// GOOD: Provider manages its own state
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = async (credentials) => {
    const user = await loginAPI(credentials);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

## Anti-Patterns

### ❌ 1. Using Context for Frequent Updates
```javascript
// BAD: Causes all consumers to re-render on every mouse move
function MouseProvider({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <MouseContext.Provider value={position}>
      {children}
    </MouseContext.Provider>
  );
}

// GOOD: Use a state management library or ref for high-frequency updates
// Or split into multiple contexts
```

### ❌ 2. Overusing Context
```javascript
// BAD: Using context for everything
function ComponentA() {
  const { dataA } = useContext(AppContext);
  return <ComponentB />;
}

function ComponentB() {
  const { dataB } = useContext(AppContext);
  return <ComponentC />;
}

// GOOD: Pass props when components are closely related
function ComponentA() {
  const { dataA } = useContext(AppContext);
  return <ComponentB data={dataA} />;
}

function ComponentB({ data }) {
  return <ComponentC data={data} />;
}
```

### ❌ 3. Not Memoizing Context Value
```javascript
// BAD: New object every render -> all consumers re-render
function BadProvider({ children }) {
  const [state, setState] = useState(initial);

  return (
    <Context.Provider value={{ state, setState }}>
      {children}
    </Context.Provider>
  );
}

// GOOD: Memoized value
function GoodProvider({ children }) {
  const [state, setState] = useState(initial);

  const value = useMemo(
    () => ({ state, setState }),
    [state]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
```

### ❌ 4. Creating Context Inside Component
```javascript
// BAD: New context every render
function BadComponent() {
  const MyContext = createContext(); // Don't do this!

  return (
    <MyContext.Provider value={value}>
      <Child />
    </MyContext.Provider>
  );
}

// GOOD: Create context outside component
const MyContext = createContext();

function GoodComponent() {
  return (
    <MyContext.Provider value={value}>
      <Child />
    </MyContext.Provider>
  );
}
```

### ❌ 5. Too Many Nested Providers
```javascript
// BAD: Provider hell
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <SettingsProvider>
              <NotificationProvider>
                <ModalProvider>
                  <ToastProvider>
                    <AppContent />
                  </ToastProvider>
                </ModalProvider>
              </NotificationProvider>
            </SettingsProvider>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// GOOD: Compose providers
const AppProviders = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  </AuthProvider>
);

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
```

## Caveats and Common Mistakes

### ⚠️ 1. Context Causes Re-renders
```javascript
// Every component using useContext re-renders when context value changes
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [count, setCount] = useState(0); // Unrelated state

  return (
    <ThemeContext.Provider value={{ theme, setTheme, count }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme } = useContext(ThemeContext);
  // Re-renders when count changes, even though we don't use it!
  return <button>{theme}</button>;
}

// Solution: Split contexts or use React.memo with careful props
```

### ⚠️ 2. Can't Bail Out of Re-renders
```javascript
// React.memo doesn't prevent re-renders from context changes
const ExpensiveComponent = React.memo(function ExpensiveComponent() {
  const { theme } = useContext(ThemeContext);
  // Still re-renders when context changes!
  return <div>{theme}</div>;
});

// Solution: Split context or use composition
function ExpensiveComponent() {
  return <ExpensiveComponentInner theme={theme} />;
}

const ExpensiveComponentInner = React.memo(
  function ExpensiveComponentInner({ theme }) {
    // Now memo works!
    return <div>{theme}</div>;
  }
);
```

### ⚠️ 3. Default Value Only Used Without Provider
```javascript
const ThemeContext = createContext('light');

// Without Provider: uses default 'light'
function App() {
  return <ThemedButton />; // Gets 'light'
}

// With Provider: uses provided value
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton /> {/* Gets 'dark' */}
    </ThemeContext.Provider>
  );
}
```

### ⚠️ 4. Context Updates Aren't Batched Across Providers
```javascript
// Multiple provider updates cause multiple re-renders
function handleClick() {
  setTheme('dark');      // Re-render 1
  setLanguage('es');     // Re-render 2
  setUser(newUser);      // Re-render 3
}

// Solution: Use state management library or single context
```

### ⚠️ 5. Reading Context During Render
```javascript
// Context is read during render, not in effects
function Component() {
  const value = useContext(MyContext); // Subscribes to context

  useEffect(() => {
    // This effect runs when context changes
    console.log(value);
  }, [value]);

  return <div>{value}</div>;
}
```

## Advanced Patterns

### Pattern 1: Context with Reducer
```javascript
const StateContext = createContext();
const DispatchContext = createContext();

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Separate hooks for state and dispatch
export function useAppState() {
  return useContext(StateContext);
}

export function useAppDispatch() {
  return useContext(DispatchContext);
}
```

### Pattern 2: Computed Values in Context
```javascript
function DataProvider({ children }) {
  const [data, setData] = useState([]);

  const value = useMemo(() => ({
    data,
    setData,
    // Computed values
    count: data.length,
    isEmpty: data.length === 0,
    first: data[0],
    last: data[data.length - 1]
  }), [data]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
```

### Pattern 3: Lazy Context (Render Props Pattern)
```javascript
const DataContext = createContext();

function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  return (
    <DataContext.Provider value={{ data, loading }}>
      {typeof children === 'function'
        ? children({ data, loading })
        : children
      }
    </DataContext.Provider>
  );
}

// Usage
<DataProvider>
  {({ data, loading }) =>
    loading ? <Loading /> : <DataDisplay data={data} />
  }
</DataProvider>
```

### Pattern 4: Context Selectors (Manual)
```javascript
// Manually optimize re-renders by splitting contexts
const DataContext = createContext();
const ActionsContext = createContext();

function Provider({ children }) {
  const [state, setState] = useState(initial);

  const actions = useMemo(() => ({
    updateA: (value) => setState(s => ({ ...s, a: value })),
    updateB: (value) => setState(s => ({ ...s, b: value }))
  }), []);

  return (
    <ActionsContext.Provider value={actions}>
      <DataContext.Provider value={state}>
        {children}
      </DataContext.Provider>
    </ActionsContext.Provider>
  );
}

// Components only re-render when needed
function ComponentA() {
  const { a } = useContext(DataContext); // Only re-renders when 'a' changes
  return <div>{a}</div>;
}
```

### Pattern 5: Context Factory
```javascript
function createSafeContext() {
  const Context = createContext(null);

  function Provider({ children, value }) {
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  }

  function useContextHook() {
    const context = useContext(Context);
    if (context === null) {
      throw new Error(
        `useContext must be used within Provider`
      );
    }
    return context;
  }

  return [Provider, useContextHook];
}

// Usage
const [ThemeProvider, useTheme] = createSafeContext();
```

## Performance Optimization

### Split Context by Update Frequency
```javascript
// Fast-changing data
const FastContext = createContext();

// Slow-changing data
const SlowContext = createContext();

function Provider({ children }) {
  const [fast, setFast] = useState(0);
  const [slow, setSlow] = useState('initial');

  return (
    <SlowContext.Provider value={{ slow, setSlow }}>
      <FastContext.Provider value={{ fast, setFast }}>
        {children}
      </FastContext.Provider>
    </SlowContext.Provider>
  );
}
```

### Use Composition to Prevent Re-renders
```javascript
function App() {
  return (
    <ThemeProvider>
      {/* This doesn't re-render when theme changes */}
      <ExpensiveTree>
        {/* Only this re-renders */}
        <ThemedComponent />
      </ExpensiveTree>
    </ThemeProvider>
  );
}
```

### Combine with React.memo
```javascript
const MemoizedComponent = React.memo(function Component({ value }) {
  const theme = useContext(ThemeContext);
  // Re-renders only when theme or value changes
  return <div style={{ color: theme.color }}>{value}</div>;
});
```

## When to Use Context vs Props

### Use Context when:
- ✅ Data needed by many components at different nesting levels
- ✅ Data is truly global (theme, language, auth)
- ✅ Avoiding prop drilling through many layers
- ✅ Plugin/extension system

### Use Props when:
- ✅ Parent and child are closely related
- ✅ Only 1-2 levels of nesting
- ✅ Data is specific to component tree branch
- ✅ Want explicit data flow

## Summary

**Do:**
- ✅ Create custom hooks for contexts
- ✅ Split contexts by concern
- ✅ Memoize context values
- ✅ Provide meaningful defaults
- ✅ Use error checking in custom hooks

**Don't:**
- ❌ Use context for high-frequency updates
- ❌ Overuse context (prefer props when appropriate)
- ❌ Create new context values every render
- ❌ Create context inside components
- ❌ Use one giant context for everything

**Remember:**
- Context causes all consumers to re-render
- Default value only used without Provider
- Context + useReducer is powerful pattern
- Split contexts for better performance
- Context is not state management (it's state distribution)
