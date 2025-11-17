import React, { useState, useCallback, memo, useEffect, useRef } from 'react';

// ==============================================================================
// EXAMPLE 1: Without useCallback (Child Re-renders)
// ==============================================================================
const ChildWithoutCallback = memo(function ChildWithoutCallback({ onClick }) {
  console.log('ChildWithoutCallback rendering');
  return (
    <div style={{ padding: '10px', background: '#ffe0e0', margin: '10px 0' }}>
      <button onClick={onClick}>Child Button</button>
    </div>
  );
});

export function WithoutCallback() {
  const [count, setCount] = useState(0);

  // New function every render!
  const handleClick = () => {
    console.log('Clicked!');
  };

  return (
    <div>
      <h3>❌ Without useCallback</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildWithoutCallback onClick={handleClick} />
      <p style={{ color: 'red' }}>Check console - child re-renders every time!</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 2: With useCallback (Child Optimized)
// ==============================================================================
const ChildWithCallback = memo(function ChildWithCallback({ onClick }) {
  console.log('ChildWithCallback rendering');
  return (
    <div style={{ padding: '10px', background: '#e0ffe0', margin: '10px 0' }}>
      <button onClick={onClick}>Child Button</button>
    </div>
  );
});

export function WithCallback() {
  const [count, setCount] = useState(0);

  // Same function reference every render
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []);

  return (
    <div>
      <h3>✅ With useCallback</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildWithCallback onClick={handleClick} />
      <p style={{ color: 'green' }}>Check console - child doesn't re-render!</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 3: useCallback with Dependencies
// ==============================================================================
const SearchResults = memo(function SearchResults({ onSearch }) {
  console.log('SearchResults rendering');
  return (
    <div style={{ padding: '10px', background: '#e0e0ff', margin: '10px 0' }}>
      <button onClick={onSearch}>Perform Search</button>
    </div>
  );
});

export function CallbackWithDeps() {
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(0);

  const handleSearch = useCallback(() => {
    console.log('Searching for:', query);
    alert(`Searching for: ${query}`);
  }, [query]); // Re-created when query changes

  return (
    <div>
      <h3>useCallback with Dependencies</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search query..."
      />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <SearchResults onSearch={handleSearch} />
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        SearchResults only re-renders when query changes, not when count changes
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 4: useCallback in useEffect Dependencies
// ==============================================================================
export function CallbackInEffect() {
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);

  const fetchUser = useCallback(async () => {
    console.log('Fetching user:', userId);
    setFetchCount(c => c + 1);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const userData = await response.json();
      setData(userData);
    } catch (err) {
      console.error('Error:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // Safe - fetchUser is stable unless userId changes

  return (
    <div>
      <h3>useCallback in useEffect Dependencies</h3>
      <div>
        <button onClick={() => setUserId(1)}>User 1</button>
        <button onClick={() => setUserId(2)}>User 2</button>
        <button onClick={() => setUserId(3)}>User 3</button>
      </div>
      <p>Fetch count: {fetchCount}</p>
      {data && (
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// EXAMPLE 5: Todo List with useCallback
// ==============================================================================
const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }) {
  console.log('TodoItem rendering:', todo.text);

  return (
    <li style={{ margin: '5px 0' }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', margin: '0 10px' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});

export function TodoListWithCallback() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Master Hooks', completed: false }
  ]);
  const [input, setInput] = useState('');
  const [count, setCount] = useState(0);

  const handleToggle = useCallback((id) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDelete = useCallback((id) => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  }, []);

  const handleAdd = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  return (
    <div>
      <h3>Todo List with useCallback</h3>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add todo..."
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <p>Unrelated counter: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Check console - TodoItems don't re-render when counter increments
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 6: Stale Closure Problem
// ==============================================================================
export function StaleClosureProblem() {
  const [count, setCount] = useState(0);

  // ❌ BAD: Stale closure
  const logCount = useCallback(() => {
    console.log('Count (stale):', count);
  }, []); // Empty deps - captures initial count!

  return (
    <div>
      <h3>❌ Stale Closure Problem</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={logCount}>Log Count (shows stale value)</button>
      <p style={{ color: 'red' }}>
        Check console - always logs 0 because of stale closure!
      </p>
    </div>
  );
}

export function StaleClosureSolution() {
  const [count, setCount] = useState(0);

  // ✅ SOLUTION 1: Include dependency
  const logCount1 = useCallback(() => {
    console.log('Count (with dep):', count);
  }, [count]);

  // ✅ SOLUTION 2: Use ref
  const countRef = useRef(count);
  countRef.current = count;

  const logCount2 = useCallback(() => {
    console.log('Count (with ref):', countRef.current);
  }, []);

  return (
    <div>
      <h3>✅ Stale Closure Solutions</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={logCount1}>Log (with dependency)</button>
      <button onClick={logCount2}>Log (with ref)</button>
      <p style={{ color: 'green' }}>
        Check console - both show current value correctly!
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 7: Anti-Pattern - Premature Optimization
// ==============================================================================
function UnmemoizedChild({ onClick }) {
  console.log('UnmemoizedChild rendering (every time)');
  return <button onClick={onClick}>Click Me</button>;
}

export function PrematureOptimization() {
  const [count, setCount] = useState(0);

  // ❌ BAD: useCallback without memo child doesn't help
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []);

  return (
    <div>
      <h3>❌ Anti-Pattern: Premature Optimization</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <UnmemoizedChild onClick={handleClick} />
      <p style={{ color: 'red' }}>
        Check console - child re-renders anyway because it's not memoized!
        useCallback doesn't help here.
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 8: Custom Hook with useCallback
// ==============================================================================
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export function DebouncedInput() {
  const [value, setValue] = useState('');
  const [searches, setSearches] = useState([]);

  const performSearch = useCallback((query) => {
    console.log('Searching for:', query);
    setSearches(prev => [...prev, { query, time: new Date().toLocaleTimeString() }]);
  }, []);

  const debouncedSearch = useDebounce(performSearch, 500);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <div>
      <h3>Debounced Search with useCallback</h3>
      <input
        value={value}
        onChange={handleChange}
        placeholder="Type to search..."
      />
      <div style={{ marginTop: '10px' }}>
        <h4>Searches performed:</h4>
        <ul>
          {searches.map((search, i) => (
            <li key={i}>{search.time}: "{search.query}"</li>
          ))}
        </ul>
      </div>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Search only fires 500ms after you stop typing
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 9: Event Handler Factory
// ==============================================================================
const ListItem = memo(function ListItem({ item, onSelect }) {
  console.log('ListItem rendering:', item.name);

  return (
    <div
      style={{
        padding: '10px',
        margin: '5px 0',
        background: item.selected ? '#e0ffe0' : '#f0f0f0',
        cursor: 'pointer'
      }}
      onClick={() => onSelect(item.id)}
    >
      {item.name} {item.selected && '✓'}
    </div>
  );
});

export function EventHandlerFactory() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', selected: false },
    { id: 2, name: 'Item 2', selected: false },
    { id: 3, name: 'Item 3', selected: false }
  ]);
  const [count, setCount] = useState(0);

  const handleSelect = useCallback((id) => {
    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  return (
    <div>
      <h3>Event Handler Factory</h3>
      <p>Unrelated counter: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <div>
        {items.map(item => (
          <ListItem key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </div>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Check console - items don't re-render when counter increments
      </p>
    </div>
  );
}

// ==============================================================================
// DEMO APP
// ==============================================================================
export function UseCallbackDemo() {
  const [activeExample, setActiveExample] = useState('without');

  const examples = {
    without: <WithoutCallback />,
    with: <WithCallback />,
    deps: <CallbackWithDeps />,
    effect: <CallbackInEffect />,
    todos: <TodoListWithCallback />,
    staleProblem: <StaleClosureProblem />,
    staleSolution: <StaleClosureSolution />,
    premature: <PrematureOptimization />,
    debounce: <DebouncedInput />,
    factory: <EventHandlerFactory />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>useCallback Hook Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select value={activeExample} onChange={(e) => setActiveExample(e.target.value)}>
          <option value="without">❌ Without useCallback</option>
          <option value="with">✅ With useCallback</option>
          <option value="deps">useCallback with Dependencies</option>
          <option value="effect">useCallback in useEffect</option>
          <option value="todos">Todo List</option>
          <option value="staleProblem">❌ Stale Closure Problem</option>
          <option value="staleSolution">✅ Stale Closure Solution</option>
          <option value="premature">❌ Premature Optimization</option>
          <option value="debounce">Debounced Input</option>
          <option value="factory">Event Handler Factory</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {examples[activeExample]}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>💡 Tip:</strong> Open your browser console to see component render patterns
      </div>
    </div>
  );
}
