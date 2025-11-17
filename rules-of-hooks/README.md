# Rules of Hooks - Interactive Guide

This project demonstrates the correct and incorrect ways to use React Hooks, following the official [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) from React documentation.

## 📚 What You'll Learn

This interactive guide covers the two fundamental rules of React Hooks:

### Rule 1: Only Call Hooks at the Top Level
Don't call Hooks inside loops, conditions, or nested functions. This ensures that Hooks are called in the same order each time a component renders.

### Rule 2: Only Call Hooks from React Functions
Only call Hooks from React function components or custom Hooks. Don't call Hooks from regular JavaScript functions.

## 🎯 Project Structure

```
rules-of-hooks/
├── src/
│   ├── incorrect/          # Examples of INCORRECT hook usage (for reference only)
│   │   ├── ConditionalHook.jsx
│   │   ├── LoopHook.jsx
│   │   ├── NestedFunctionHook.jsx
│   │   └── RegularFunctionHook.jsx
│   ├── correct/            # Examples of CORRECT hook usage
│   │   ├── ConditionalHook.jsx
│   │   ├── LoopHook.jsx
│   │   ├── NestedFunctionHook.jsx
│   │   └── RegularFunctionHook.jsx
│   ├── components/         # UI components
│   │   └── ExampleCard.jsx
│   ├── App.jsx            # Main application with interactive tabs
│   └── main.jsx           # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd rules-of-hooks
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

## 💡 Examples Covered

### 1. Conditional Hooks
- ❌ **Incorrect**: Calling `useState` inside an `if` statement
- ✅ **Correct**: Calling hooks at the top level and handling conditions in JSX

### 2. Loops & Arrays
- ❌ **Incorrect**: Calling hooks inside `for` loops or `.forEach()`
- ✅ **Correct**: Using a single state object or creating separate components

### 3. Nested Functions
- ❌ **Incorrect**: Calling hooks inside event handlers or callbacks
- ✅ **Correct**: Defining hooks at the top level and updating state from handlers

### 4. Function Types
- ❌ **Incorrect**: Calling hooks from regular JavaScript functions
- ✅ **Correct**: Using hooks in React components and custom hooks

## 🎓 Key Takeaways

1. ✅ Always call hooks at the top level of your component
2. ✅ Call all hooks before any conditional returns
3. ✅ Never call hooks inside loops, conditions, or nested functions
4. ✅ Only call hooks from React function components or custom hooks
5. ✅ Custom hooks must start with "use"
6. ✅ Use regular functions for calculations, hooks for state and effects

## 🔍 Common Mistakes to Avoid

### Mistake 1: Conditional Hooks
```jsx
// ❌ WRONG
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(null); // Error!
  }
}

// ✅ CORRECT
function Component({ condition }) {
  const [state, setState] = useState(null);
  if (!condition) return null;
}
```

### Mistake 2: Hooks in Loops
```jsx
// ❌ WRONG
function Component({ items }) {
  items.forEach(item => {
    const [value, setValue] = useState(item); // Error!
  });
}

// ✅ CORRECT
function Component({ items }) {
  const [values, setValues] = useState(items);
}
```

### Mistake 3: Hooks in Event Handlers
```jsx
// ❌ WRONG
function Component() {
  const handleClick = () => {
    const [count, setCount] = useState(0); // Error!
  };
}

// ✅ CORRECT
function Component() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };
}
```

### Mistake 4: Hooks in Regular Functions
```jsx
// ❌ WRONG
function calculateTotal(items) {
  const [total, setTotal] = useState(0); // Error!
  return total;
}

// ✅ CORRECT (Option 1: Regular function)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ CORRECT (Option 2: Custom hook)
function useCalculateTotal(items) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items]);
  return total;
}
```

## 🛠️ Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 Additional Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [useState Hook](https://react.dev/reference/react/useState)
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [Building Your Own Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

## 🤝 Contributing

This is an educational project. Feel free to explore the code, learn from it, and suggest improvements!

## 📝 License

This project is open source and available for educational purposes.

---

**Happy Learning! 🎉**

Remember: The Rules of Hooks exist to make your React code predictable and bug-free. Always follow them!
