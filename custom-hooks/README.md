# Custom Hooks Examples

This folder contains examples demonstrating the difference between using and not using custom hooks in React.

## 📚 What Are Custom Hooks?

Custom hooks are JavaScript functions that start with `use` and can call other hooks. They let you extract component logic into reusable functions, following the DRY (Don't Repeat Yourself) principle.

## 📂 Files in This Directory

1. **WithoutCustomHooks.jsx** - Shows the problem of duplicated logic across components
2. **WithCustomHooks.jsx** - Shows the solution using a custom hook to share logic

## 🎯 The Example: Online Status Tracking

Both examples implement the same functionality: tracking whether the user is online or offline and displaying this status in multiple components.

### Without Custom Hooks (❌ Problem)

In `WithoutCustomHooks.jsx`, you'll see:

- **StatusIndicator** component
- **SaveButton** component
- **ChatStatus** component

All three components need to know if the user is online. Without custom hooks, each component must:
1. Create its own `isOnline` state
2. Set up event listeners for `online` and `offline` events
3. Clean up event listeners on unmount

**Result**: The same logic is copy-pasted in all three components!

```jsx
// Repeated in EVERY component that needs online status
const [isOnline, setIsOnline] = useState(true);

useEffect(() => {
  function handleOnline() {
    setIsOnline(true);
  }
  function handleOffline() {
    setIsOnline(false);
  }

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

### With Custom Hooks (✅ Solution)

In `WithCustomHooks.jsx`, the logic is extracted into a `useOnlineStatus` custom hook:

```jsx
// Written ONCE in the custom hook
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Used in ANY component that needs it
function SaveButton() {
  const isOnline = useOnlineStatus(); // Just one line!
  // ... rest of component
}
```

## 🔍 Key Differences

| Aspect | Without Custom Hooks | With Custom Hooks |
|--------|---------------------|-------------------|
| **Code Duplication** | Logic repeated in every component | Logic written once |
| **Maintainability** | Changes must be made in multiple places | Changes made in one place |
| **Bug Fixes** | Must fix in all components | Fix once in the custom hook |
| **Testing** | Must test logic in each component | Test the custom hook once |
| **Readability** | Components cluttered with logic | Components are clean and focused |
| **Reusability** | Copy-paste to reuse | Import and use anywhere |

## ✨ Benefits of Custom Hooks

1. **Reusability**: Write logic once, use it anywhere
2. **Maintainability**: Update logic in one place
3. **Testability**: Test hooks independently from components
4. **Readability**: Components stay focused on rendering
5. **Composition**: Custom hooks can use other custom hooks
6. **Sharing**: Share hooks across different projects

## 📖 When to Create a Custom Hook

Create a custom hook when you find yourself:

- ✅ Copying the same `useEffect` or `useState` logic between components
- ✅ Components have complex logic that could be extracted
- ✅ Multiple components need the same data or behavior
- ✅ You want to hide complex implementation details
- ✅ You want to test logic independently from components

**Don't create a custom hook if:**

- ❌ The logic is only used once
- ❌ The logic is very simple (e.g., just one line)
- ❌ The logic is highly specific to one component

## 🎓 Custom Hook Best Practices

### 1. Name Must Start with "use"

```jsx
✅ useOnlineStatus()
✅ useFormInput()
✅ useLocalStorage()

❌ onlineStatus()      // Won't follow React's rules of hooks
❌ getOnlineStatus()   // Not recognized as a hook
```

### 2. Only Call Hooks at the Top Level

```jsx
✅ CORRECT
function MyComponent() {
  const isOnline = useOnlineStatus();
  // ...
}

❌ WRONG - Don't call hooks conditionally
function MyComponent() {
  if (condition) {
    const isOnline = useOnlineStatus(); // ❌ Breaks rules of hooks
  }
}
```

### 3. Custom Hooks Can Call Other Hooks

```jsx
function useUserData(userId) {
  const isOnline = useOnlineStatus();        // ✅ Call other custom hooks
  const [user, setUser] = useState(null);    // ✅ Call React hooks
  const isMounted = useIsMounted();          // ✅ Call more custom hooks

  // ... rest of logic
  return { user, isOnline };
}
```

### 4. Return Values Thoughtfully

```jsx
// Return single value for simple hooks
function useOnlineStatus() {
  return isOnline;
}

// Return object for multiple values
function useFormInput(initialValue) {
  return {
    value,
    onChange,
    reset
  };
}

// Return array when order matters (like useState)
function useToggle(initialValue) {
  return [isToggled, toggle];
}
```

## 🚀 How to Run These Examples

To run these examples in your React application:

1. Copy the file content into your React project
2. Import and render the component:

```jsx
import App from './custom-hooks/WithCustomHooks';
// or
import App from './custom-hooks/WithoutCustomHooks';

function Root() {
  return <App />;
}
```

3. Open your browser's DevTools
4. Go to Network tab and set "Throttling" to "Offline" to test the online/offline behavior

## 📚 More Custom Hook Examples

Here are other common use cases for custom hooks:

### useLocalStorage
```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

### useWindowSize
```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

### useFetch
```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
```

## 🔗 Learn More

- [Official React Documentation: Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

## 💡 Summary

Custom hooks are one of React's most powerful features for code reuse. They allow you to:

- Extract component logic into reusable functions
- Share stateful logic between components
- Keep components clean and focused
- Make your code more testable and maintainable

The examples in this folder demonstrate these benefits by showing the same functionality implemented both with and without custom hooks. The difference is clear: custom hooks make your code cleaner, more reusable, and easier to maintain!
