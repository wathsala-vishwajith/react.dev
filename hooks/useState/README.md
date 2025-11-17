# useState Hook - Comprehensive Guide

## Overview
`useState` is the most fundamental React Hook that lets you add state to functional components. It returns a stateful value and a function to update it.

## Basic Syntax
```javascript
const [state, setState] = useState(initialValue);
```

## Table of Contents
1. [Basic Examples](#basic-examples)
2. [Best Practices](#best-practices)
3. [Anti-Patterns](#anti-patterns)
4. [Caveats and Common Mistakes](#caveats-and-common-mistakes)
5. [Advanced Patterns](#advanced-patterns)

## Basic Examples

### Simple Counter
```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Multiple State Variables
```javascript
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
    </form>
  );
}
```

## Best Practices

### ✅ 1. Use Functional Updates for State Based on Previous State
```javascript
// GOOD: Functional update guarantees correct value
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  // Safe even when called multiple times rapidly
  const incrementBy5 = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  return <button onClick={incrementBy5}>+5</button>;
}
```

### ✅ 2. Use Lazy Initialization for Expensive Computations
```javascript
// GOOD: Function is only called once on mount
function ExpensiveComponent() {
  const [data, setData] = useState(() => {
    const result = expensiveComputation();
    return result;
  });

  return <div>{data}</div>;
}

// BAD: Function runs on every render
function ExpensiveComponent() {
  const [data, setData] = useState(expensiveComputation());
  return <div>{data}</div>;
}
```

### ✅ 3. Group Related State Together
```javascript
// GOOD: Related state in one object
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: {
      street: '',
      city: ''
    }
  });

  const updateName = (name) => {
    setUser(prev => ({ ...prev, name }));
  };

  return <div>{user.name}</div>;
}
```

### ✅ 4. Initialize State with Meaningful Defaults
```javascript
// GOOD: Clear default values
const [todos, setTodos] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [user, setUser] = useState(null);

// GOOD: Type-safe defaults
const [count, setCount] = useState(0); // Number
const [text, setText] = useState(''); // String
```

## Anti-Patterns

### ❌ 1. Mutating State Directly
```javascript
// BAD: Direct mutation
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    todos.push(todo); // WRONG! Mutates state
    setTodos(todos);
  };
}

// GOOD: Create new array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    setTodos(prev => [...prev, todo]);
  };
}
```

### ❌ 2. Not Using Functional Updates
```javascript
// BAD: May use stale state
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1); // Uses closure value
    setCount(count + 1); // Still uses same closure value!
    // Result: count only increments by 1
  };
}

// GOOD: Functional update
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // Result: count increments by 2
  };
}
```

### ❌ 3. Storing Derived State
```javascript
// BAD: Redundant state
function ProductList({ products }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredProducts(
      products.filter(p => p.name.includes(searchTerm))
    );
  }, [products, searchTerm]);
}

// GOOD: Calculate during render
function ProductList({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = products.filter(p =>
    p.name.includes(searchTerm)
  );
}
```

### ❌ 4. Too Many useState Calls
```javascript
// BAD: Too granular
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  // ... 20 more fields
}

// GOOD: Group related state (or use useReducer)
function Form() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
}
```

## Caveats and Common Mistakes

### ⚠️ 1. State Updates are Asynchronous
```javascript
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log(count); // Still 0! Update hasn't happened yet
  };

  // CORRECT: Use the new value directly or useEffect
  const handleClickCorrect = () => {
    const newCount = count + 1;
    setCount(newCount);
    console.log(newCount); // Logs the new value
  };
}
```

### ⚠️ 2. Object/Array Updates Require New References
```javascript
// WRONG: Same reference, won't trigger re-render
function TodoList() {
  const [todos, setTodos] = useState([]);

  const markComplete = (id) => {
    const todo = todos.find(t => t.id === id);
    todo.completed = true;
    setTodos(todos); // Won't re-render!
  };
}

// CORRECT: New array with new object
function TodoList() {
  const [todos, setTodos] = useState([]);

  const markComplete = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: true }
        : todo
    ));
  };
}
```

### ⚠️ 3. State Initialization Only Runs Once
```javascript
// MISTAKE: Expecting state to update when prop changes
function UserProfile({ userId }) {
  const [user, setUser] = useState(fetchUser(userId));
  // When userId changes, state doesn't automatically update!
}

// CORRECT: Use useEffect to sync with props
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(fetchUser(userId));
  }, [userId]);
}
```

### ⚠️ 4. Setting State in Render
```javascript
// WRONG: Causes infinite loop
function Component() {
  const [count, setCount] = useState(0);

  setCount(count + 1); // INFINITE LOOP!

  return <div>{count}</div>;
}

// CORRECT: Set state in event handlers or effects
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(1);
  }, []); // Runs once on mount

  return <div>{count}</div>;
}
```

## Advanced Patterns

### Pattern 1: Resetting State with Key
```javascript
function UserProfile({ userId }) {
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Reset form when user changes by using key
  return <ProfileForm key={userId} data={formData} onChange={setFormData} />;
}
```

### Pattern 2: State Reducer Pattern (with useState)
```javascript
function useStateWithHistory(initialValue) {
  const [state, setState] = useState(initialValue);
  const [history, setHistory] = useState([initialValue]);

  const setStateWithHistory = (newState) => {
    setState(newState);
    setHistory(prev => [...prev, newState]);
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setState(newHistory[newHistory.length - 1]);
    }
  };

  return [state, setStateWithHistory, undo];
}
```

### Pattern 3: Controlled vs Uncontrolled State
```javascript
// Controlled: State lives in parent
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

// Uncontrolled: State lives in component
function UncontrolledInput({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

## Performance Considerations

### Batching Updates (React 18+)
```javascript
// React automatically batches these updates
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  setName('John');
  // Only one re-render!
}
```

### When to Split State
Split state when:
- Different pieces of state update independently
- State has different update frequencies
- You want to optimize re-renders with React.memo

Keep state together when:
- Values are always updated together
- They represent a single concept
- You need to maintain consistency between them

## Summary

**Do:**
- ✅ Use functional updates when new state depends on old state
- ✅ Use lazy initialization for expensive calculations
- ✅ Group related state together
- ✅ Create new objects/arrays when updating
- ✅ Initialize with meaningful defaults

**Don't:**
- ❌ Mutate state directly
- ❌ Store derived values in state
- ❌ Call setState during render
- ❌ Rely on state being updated immediately
- ❌ Use too many useState calls for related data (consider useReducer)
