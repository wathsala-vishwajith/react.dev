import React, { useState, useEffect } from 'react';

// ==============================================================================
// EXAMPLE 1: Basic Counter
// ==============================================================================
export function BasicCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h3>Basic Counter</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 2: Functional Updates - CORRECT WAY
// ==============================================================================
export function FunctionalUpdateCounter() {
  const [count, setCount] = useState(0);

  // ✅ CORRECT: Using functional update
  const incrementCorrect = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // Result: count increases by 3
  };

  // ❌ WRONG: Using current value
  const incrementWrong = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Result: count only increases by 1 (uses stale closure)
  };

  return (
    <div>
      <h3>Functional Updates</h3>
      <p>Count: {count}</p>
      <button onClick={incrementCorrect}>Correct: +3</button>
      <button onClick={incrementWrong}>Wrong: Should be +3, but only +1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 3: Lazy Initialization
// ==============================================================================

// Expensive computation (simulated)
function expensiveCalculation() {
  console.log('Running expensive calculation...');
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
}

// ❌ BAD: Runs on every render
export function BadLazyInit() {
  const [value, setValue] = useState(expensiveCalculation());
  // expensiveCalculation() runs on EVERY render!

  return (
    <div>
      <h3>Bad Lazy Init (check console)</h3>
      <p>Value: {value}</p>
      <button onClick={() => setValue(v => v + 1)}>Increment</button>
    </div>
  );
}

// ✅ GOOD: Runs only once on mount
export function GoodLazyInit() {
  const [value, setValue] = useState(() => expensiveCalculation());
  // Function only called once!

  return (
    <div>
      <h3>Good Lazy Init (check console)</h3>
      <p>Value: {value}</p>
      <button onClick={() => setValue(v => v + 1)}>Increment</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 4: Array State Management
// ==============================================================================
export function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Master Hooks', completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  // ✅ CORRECT: Adding item (creates new array)
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };

  // ✅ CORRECT: Toggling item (creates new array with new object)
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  // ✅ CORRECT: Removing item (creates new array)
  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h3>Todo List (Array State)</h3>
      <div>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 5: Object State Management
// ==============================================================================
export function UserForm() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: {
      street: '',
      city: '',
      zipCode: ''
    }
  });

  // ✅ CORRECT: Updating nested object
  const updateField = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  // ✅ CORRECT: Updating nested address
  const updateAddress = (field, value) => {
    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <div>
      <h3>User Form (Object State)</h3>
      <div>
        <input
          placeholder="First Name"
          value={user.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
        />
        <input
          placeholder="Last Name"
          value={user.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
        />
        <input
          placeholder="Email"
          value={user.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </div>
      <div>
        <h4>Address</h4>
        <input
          placeholder="Street"
          value={user.address.street}
          onChange={(e) => updateAddress('street', e.target.value)}
        />
        <input
          placeholder="City"
          value={user.address.city}
          onChange={(e) => updateAddress('city', e.target.value)}
        />
        <input
          placeholder="Zip Code"
          value={user.address.zipCode}
          onChange={(e) => updateAddress('zipCode', e.target.value)}
        />
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 6: Anti-Pattern - Derived State
// ==============================================================================

// ❌ BAD: Storing derived state
export function BadDerivedState({ items }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  // This is redundant and error-prone!
  useEffect(() => {
    setFilteredItems(
      items.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm]);

  return (
    <div>
      <h3>Bad: Derived State</h3>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {filteredItems.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

// ✅ GOOD: Calculate during render
export function GoodDerivedState({ items }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Just calculate it! No extra state needed
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>Good: Calculated Value</h3>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {filteredItems.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 7: Async Updates Caveat
// ==============================================================================
export function AsyncUpdateExample() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState([]);

  // ❌ Common mistake: trying to use state immediately after setting
  const incrementWrong = () => {
    setCount(count + 1);
    console.log('Count after update:', count); // Still old value!
    setLog(prev => [...prev, `Wrong: ${count}`]); // Logs old value
  };

  // ✅ CORRECT: Use the new value directly
  const incrementCorrect = () => {
    const newCount = count + 1;
    setCount(newCount);
    console.log('Count after update:', newCount); // Correct!
    setLog(prev => [...prev, `Correct: ${newCount}`]);
  };

  // ✅ Or use functional update
  const incrementFunctional = () => {
    setCount(prev => {
      const newCount = prev + 1;
      setLog(prevLog => [...prevLog, `Functional: ${newCount}`]);
      return newCount;
    });
  };

  return (
    <div>
      <h3>Async Updates (Check Console)</h3>
      <p>Count: {count}</p>
      <button onClick={incrementWrong}>Wrong Way</button>
      <button onClick={incrementCorrect}>Correct Way</button>
      <button onClick={incrementFunctional}>Functional Way</button>
      <button onClick={() => setLog([])}>Clear Log</button>
      <div>
        <h4>Log:</h4>
        <ul>
          {log.map((entry, i) => <li key={i}>{entry}</li>)}
        </ul>
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 8: State with Previous Value Pattern
// ==============================================================================
export function PreviousValueExample() {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);

  const increment = () => {
    setPrevCount(count);
    setCount(count + 1);
  };

  return (
    <div>
      <h3>Tracking Previous Value</h3>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <p>Change: {count - prevCount}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 9: Form with Multiple State Variables
// ==============================================================================
export function MultipleStateForm() {
  // Sometimes it's okay to have multiple useState calls
  // if they update independently
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log({ username, password, rememberMe });
    setIsSubmitting(false);
  };

  return (
    <div>
      <h3>Login Form</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

// ==============================================================================
// DEMO APP: Combines all examples
// ==============================================================================
export function UseStateDemo() {
  const [activeExample, setActiveExample] = useState('basic');

  const examples = {
    basic: <BasicCounter />,
    functional: <FunctionalUpdateCounter />,
    badLazy: <BadLazyInit />,
    goodLazy: <GoodLazyInit />,
    todo: <TodoList />,
    userForm: <UserForm />,
    badDerived: <BadDerivedState items={['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']} />,
    goodDerived: <GoodDerivedState items={['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']} />,
    async: <AsyncUpdateExample />,
    previous: <PreviousValueExample />,
    multiForm: <MultipleStateForm />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>useState Hook Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select value={activeExample} onChange={(e) => setActiveExample(e.target.value)}>
          <option value="basic">Basic Counter</option>
          <option value="functional">Functional Updates</option>
          <option value="badLazy">Bad Lazy Init</option>
          <option value="goodLazy">Good Lazy Init</option>
          <option value="todo">Todo List</option>
          <option value="userForm">User Form</option>
          <option value="badDerived">Bad Derived State</option>
          <option value="goodDerived">Good Derived State</option>
          <option value="async">Async Updates</option>
          <option value="previous">Previous Value</option>
          <option value="multiForm">Multi-State Form</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {examples[activeExample]}
      </div>
    </div>
  );
}
