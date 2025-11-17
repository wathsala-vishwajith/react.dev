import React, { createContext, useContext, useState, useMemo, useReducer } from 'react';

// ==============================================================================
// EXAMPLE 1: Basic Theme Context
// ==============================================================================
const ThemeContext = createContext('light');

function BasicThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
        border: '2px solid',
        borderColor: theme === 'dark' ? '#fff' : '#333',
        padding: '10px 20px',
        cursor: 'pointer'
      }}
      onClick={toggleTheme}
    >
      Current theme: {theme}
    </button>
  );
}

function ThemedPanel() {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{
      padding: '20px',
      background: theme === 'dark' ? '#222' : '#f0f0f0',
      color: theme === 'dark' ? '#fff' : '#000',
      borderRadius: '8px'
    }}>
      <h4>Themed Panel</h4>
      <p>This panel adapts to the current theme!</p>
      <ThemedButton />
    </div>
  );
}

export function BasicThemeExample() {
  return (
    <BasicThemeProvider>
      <div>
        <h3>Basic Theme Context</h3>
        <ThemedPanel />
      </div>
    </BasicThemeProvider>
  );
}

// ==============================================================================
// EXAMPLE 2: Custom Hook Pattern (BEST PRACTICE)
// ==============================================================================
const SafeThemeContext = createContext(null);

function SafeThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
    }),
    [theme]
  );

  return (
    <SafeThemeContext.Provider value={value}>
      {children}
    </SafeThemeContext.Provider>
  );
}

// ✅ BEST PRACTICE: Custom hook with error checking
function useSafeTheme() {
  const context = useContext(SafeThemeContext);
  if (!context) {
    throw new Error('useSafeTheme must be used within SafeThemeProvider');
  }
  return context;
}

function SafeThemedComponent() {
  const { theme, toggleTheme } = useSafeTheme();

  return (
    <div>
      <p>Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

export function CustomHookExample() {
  return (
    <SafeThemeProvider>
      <div>
        <h3>✅ Custom Hook Pattern</h3>
        <SafeThemedComponent />
      </div>
    </SafeThemeProvider>
  );
}

// ==============================================================================
// EXAMPLE 3: Auth Context with Multiple Values
// ==============================================================================
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ username, id: Date.now() });
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

function LoginForm() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, 'password');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export function AuthExample() {
  return (
    <AuthProvider>
      <div>
        <h3>Auth Context Example</h3>
        <UserProfile />
      </div>
    </AuthProvider>
  );
}

// ==============================================================================
// EXAMPLE 4: Anti-Pattern - Not Memoizing Value
// ==============================================================================
const UnmemoizedContext = createContext();

// ❌ BAD: Creates new object every render
function BadProvider({ children }) {
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(0);

  // Force re-render for demo
  const forceRender = () => setRenderCount(c => c + 1);

  console.log('BadProvider rendering');

  // New object every render!
  return (
    <UnmemoizedContext.Provider value={{ count, setCount }}>
      <div>
        <button onClick={forceRender}>Force Parent Re-render</button>
        <p>Parent render count: {renderCount}</p>
        {children}
      </div>
    </UnmemoizedContext.Provider>
  );
}

function BadConsumer() {
  const { count, setCount } = useContext(UnmemoizedContext);
  console.log('❌ BadConsumer re-rendering (unnecessary!)');

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

export function BadMemoizationExample() {
  return (
    <BadProvider>
      <div>
        <h3>❌ Anti-Pattern: Not Memoizing</h3>
        <p>Check console - consumer re-renders on parent re-render!</p>
        <BadConsumer />
      </div>
    </BadProvider>
  );
}

// ✅ FIXED VERSION
const MemoizedContext = createContext();

function GoodProvider({ children }) {
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(0);

  const forceRender = () => setRenderCount(c => c + 1);

  console.log('GoodProvider rendering');

  // ✅ Memoized value
  const value = useMemo(
    () => ({ count, setCount }),
    [count]
  );

  return (
    <MemoizedContext.Provider value={value}>
      <div>
        <button onClick={forceRender}>Force Parent Re-render</button>
        <p>Parent render count: {renderCount}</p>
        {children}
      </div>
    </MemoizedContext.Provider>
  );
}

function GoodConsumer() {
  const { count, setCount } = useContext(MemoizedContext);
  console.log('✅ GoodConsumer rendering (only when count changes)');

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

export function GoodMemoizationExample() {
  return (
    <GoodProvider>
      <div>
        <h3>✅ Fixed: Memoized Value</h3>
        <p>Check console - consumer only re-renders when count changes!</p>
        <GoodConsumer />
      </div>
    </GoodProvider>
  );
}

// ==============================================================================
// EXAMPLE 5: Split Contexts (State and Dispatch)
// ==============================================================================
const StateContext = createContext();
const DispatchContext = createContext();

function todosReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'DELETE':
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
}

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todosReducer, []);

  return (
    <StateContext.Provider value={todos}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useTodos() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}

function useTodosDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useTodosDispatch must be used within TodoProvider');
  }
  return context;
}

function TodoList() {
  const todos = useTodos();
  console.log('TodoList rendering');

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function TodoItem({ todo }) {
  const dispatch = useTodosDispatch();
  console.log('TodoItem rendering:', todo.text);

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
      />
      <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>
        Delete
      </button>
    </li>
  );
}

function AddTodoForm() {
  const dispatch = useTodosDispatch();
  const [text, setText] = useState('');
  console.log('AddTodoForm rendering');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch({ type: 'ADD', text });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

export function SplitContextExample() {
  return (
    <TodoProvider>
      <div>
        <h3>Split Contexts (State + Dispatch)</h3>
        <p>Check console - components only re-render when needed!</p>
        <AddTodoForm />
        <TodoList />
      </div>
    </TodoProvider>
  );
}

// ==============================================================================
// EXAMPLE 6: Multiple Contexts
// ==============================================================================
const UserContext = createContext();
const SettingsContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en'
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

function UserDisplay() {
  const { user } = useContext(UserContext);
  console.log('UserDisplay rendering');

  return (
    <div>
      <p>User: {user.name} ({user.role})</p>
    </div>
  );
}

function SettingsDisplay() {
  const { settings, setSettings } = useContext(SettingsContext);
  console.log('SettingsDisplay rendering');

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={(e) => setSettings({
            ...settings,
            notifications: e.target.checked
          })}
        />
        Notifications: {settings.notifications ? 'On' : 'Off'}
      </label>
    </div>
  );
}

export function MultipleContextsExample() {
  return (
    <UserProvider>
      <SettingsProvider>
        <div>
          <h3>Multiple Contexts</h3>
          <p>Check console - each component only re-renders for its context!</p>
          <UserDisplay />
          <SettingsDisplay />
        </div>
      </SettingsProvider>
    </UserProvider>
  );
}

// ==============================================================================
// EXAMPLE 7: Context Factory Pattern
// ==============================================================================
function createSafeContext(displayName) {
  const Context = createContext(null);
  Context.displayName = displayName;

  function Provider({ children, value }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContextHook() {
    const context = useContext(Context);
    if (context === null) {
      throw new Error(
        `use${displayName} must be used within ${displayName}Provider`
      );
    }
    return context;
  }

  return [Provider, useContextHook];
}

// Usage
const [CountProvider, useCount] = createSafeContext('Count');

function CounterDisplay() {
  const { count, increment, decrement } = useCount();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

export function ContextFactoryExample() {
  const [count, setCount] = useState(0);

  const value = useMemo(
    () => ({
      count,
      increment: () => setCount(c => c + 1),
      decrement: () => setCount(c => c - 1)
    }),
    [count]
  );

  return (
    <CountProvider value={value}>
      <div>
        <h3>Context Factory Pattern</h3>
        <CounterDisplay />
      </div>
    </CountProvider>
  );
}

// ==============================================================================
// EXAMPLE 8: Avoiding Prop Drilling
// ==============================================================================
const MessageContext = createContext();

function MessageProvider({ children }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', from: 'Alice' },
    { id: 2, text: 'Hi there!', from: 'Bob' }
  ]);

  const addMessage = (text, from) => {
    setMessages(m => [...m, { id: Date.now(), text, from }]);
  };

  const value = useMemo(
    () => ({ messages, addMessage }),
    [messages]
  );

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

function useMessages() {
  return useContext(MessageContext);
}

function MessageList() {
  const { messages } = useMessages();

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} style={{ margin: '5px', padding: '5px', background: '#f0f0f0' }}>
          <strong>{msg.from}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
}

function MessageInput() {
  const { addMessage } = useMessages();
  const [text, setText] = useState('');
  const [from, setFrom] = useState('User');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addMessage(text, from);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="Your name"
        style={{ width: '100px', marginRight: '5px' }}
      />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message"
        style={{ width: '200px', marginRight: '5px' }}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export function AvoidPropDrillingExample() {
  return (
    <MessageProvider>
      <div>
        <h3>Avoiding Prop Drilling</h3>
        <p>No need to pass props through intermediate components!</p>
        <MessageInput />
        <MessageList />
      </div>
    </MessageProvider>
  );
}

// ==============================================================================
// DEMO APP: Combines all examples
// ==============================================================================
export function UseContextDemo() {
  const [activeExample, setActiveExample] = useState('basic');

  const examples = {
    basic: <BasicThemeExample />,
    custom: <CustomHookExample />,
    auth: <AuthExample />,
    badMemo: <BadMemoizationExample />,
    goodMemo: <GoodMemoizationExample />,
    split: <SplitContextExample />,
    multiple: <MultipleContextsExample />,
    factory: <ContextFactoryExample />,
    drilling: <AvoidPropDrillingExample />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>useContext Hook Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select value={activeExample} onChange={(e) => setActiveExample(e.target.value)}>
          <option value="basic">Basic Theme Context</option>
          <option value="custom">Custom Hook Pattern</option>
          <option value="auth">Auth Context</option>
          <option value="badMemo">❌ Bad Memoization</option>
          <option value="goodMemo">✅ Good Memoization</option>
          <option value="split">Split Context (State + Dispatch)</option>
          <option value="multiple">Multiple Contexts</option>
          <option value="factory">Context Factory</option>
          <option value="drilling">Avoid Prop Drilling</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {examples[activeExample]}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>💡 Tip:</strong> Open your browser console to see render patterns and optimization effects
      </div>
    </div>
  );
}
