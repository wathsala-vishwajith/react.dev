import React, { useReducer, useState, useContext, createContext, useCallback } from 'react';

// ==============================================================================
// EXAMPLE 1: Basic Counter
// ==============================================================================
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function BasicCounter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <h3>Basic Counter with useReducer</h3>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 2: Counter with Payload
// ==============================================================================
function advancedCounterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + (action.payload || 1) };
    case 'DECREMENT':
      return { count: state.count - (action.payload || 1) };
    case 'SET':
      return { count: action.payload };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

export function AdvancedCounter() {
  const [state, dispatch] = useReducer(advancedCounterReducer, { count: 0 });

  return (
    <div>
      <h3>Counter with Payload</h3>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'INCREMENT', payload: 5 })}>+5</button>
      <button onClick={() => dispatch({ type: 'INCREMENT', payload: 10 })}>+10</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>Set to 100</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 3: Todo List
// ==============================================================================
const ACTIONS = {
  ADD: 'ADD',
  TOGGLE: 'TOGGLE',
  DELETE: 'DELETE',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED'
};

function todosReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    case ACTIONS.TOGGLE:
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case ACTIONS.DELETE:
      return state.filter(todo => todo.id !== action.payload);
    case ACTIONS.CLEAR_COMPLETED:
      return state.filter(todo => !todo.completed);
    default:
      return state;
  }
}

export function TodoList() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({ type: ACTIONS.ADD, payload: input });
      setInput('');
    }
  };

  return (
    <div>
      <h3>Todo List with useReducer</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ margin: '5px 0' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: ACTIONS.TOGGLE, payload: todo.id })}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', margin: '0 10px' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE, payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <button onClick={() => dispatch({ type: ACTIONS.CLEAR_COMPLETED })}>
          Clear Completed
        </button>
      )}
      <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 4: Form Management
// ==============================================================================
const FORM_ACTIONS = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  RESET: 'RESET',
  SUBMIT: 'SUBMIT'
};

function formReducer(state, action) {
  switch (action.type) {
    case FORM_ACTIONS.UPDATE_FIELD:
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value }
      };
    case FORM_ACTIONS.SUBMIT:
      return { ...state, submitted: true };
    case FORM_ACTIONS.RESET:
      return { values: { name: '', email: '', message: '' }, submitted: false };
    default:
      return state;
  }
}

export function FormExample() {
  const [state, dispatch] = useReducer(formReducer, {
    values: { name: '', email: '', message: '' },
    submitted: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: FORM_ACTIONS.SUBMIT });
    console.log('Submitted:', state.values);
  };

  return (
    <div>
      <h3>Form with useReducer</h3>
      {state.submitted ? (
        <div>
          <p>Form submitted successfully!</p>
          <button onClick={() => dispatch({ type: FORM_ACTIONS.RESET })}>
            Submit Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <input
              placeholder="Name"
              value={state.values.name}
              onChange={(e) => dispatch({
                type: FORM_ACTIONS.UPDATE_FIELD,
                field: 'name',
                value: e.target.value
              })}
            />
          </div>
          <div>
            <input
              placeholder="Email"
              type="email"
              value={state.values.email}
              onChange={(e) => dispatch({
                type: FORM_ACTIONS.UPDATE_FIELD,
                field: 'email',
                value: e.target.value
              })}
            />
          </div>
          <div>
            <textarea
              placeholder="Message"
              value={state.values.message}
              onChange={(e) => dispatch({
                type: FORM_ACTIONS.UPDATE_FIELD,
                field: 'message',
                value: e.target.value
              })}
            />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => dispatch({ type: FORM_ACTIONS.RESET })}>
            Reset
          </button>
        </form>
      )}
    </div>
  );
}

// ==============================================================================
// EXAMPLE 5: useReducer with Context
// ==============================================================================
const CountContext = createContext();
const CountDispatchContext = createContext();

function countContextReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function CountProvider({ children }) {
  const [state, dispatch] = useReducer(countContextReducer, { count: 0 });

  return (
    <CountContext.Provider value={state}>
      <CountDispatchContext.Provider value={dispatch}>
        {children}
      </CountDispatchContext.Provider>
    </CountContext.Provider>
  );
}

function useCount() {
  return useContext(CountContext);
}

function useCountDispatch() {
  return useContext(CountDispatchContext);
}

function CountDisplay() {
  const state = useCount();
  console.log('CountDisplay rendering');
  return <p>Count: {state.count}</p>;
}

function CountButtons() {
  const dispatch = useCountDispatch();
  console.log('CountButtons rendering');
  return (
    <div>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}

export function ContextWithReducer() {
  return (
    <CountProvider>
      <div>
        <h3>useReducer with Context</h3>
        <p>Check console - components only re-render when needed!</p>
        <CountDisplay />
        <CountButtons />
      </div>
    </CountProvider>
  );
}

// ==============================================================================
// EXAMPLE 6: Async Actions Pattern
// ==============================================================================
const FETCH_ACTIONS = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

function fetchReducer(state, action) {
  switch (action.type) {
    case FETCH_ACTIONS.LOADING:
      return { ...state, loading: true, error: null };
    case FETCH_ACTIONS.SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };
    case FETCH_ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function AsyncExample() {
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: false,
    error: null
  });

  const fetchUser = async (id) => {
    dispatch({ type: FETCH_ACTIONS.LOADING });
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
      const data = await response.json();
      dispatch({ type: FETCH_ACTIONS.SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_ACTIONS.ERROR, payload: error.message });
    }
  };

  return (
    <div>
      <h3>Async Actions with useReducer</h3>
      <div>
        <button onClick={() => fetchUser(1)}>Fetch User 1</button>
        <button onClick={() => fetchUser(2)}>Fetch User 2</button>
        <button onClick={() => fetchUser(3)}>Fetch User 3</button>
      </div>

      {state.loading && <p>Loading...</p>}
      {state.error && <p style={{ color: 'red' }}>Error: {state.error}</p>}
      {state.data && (
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
          <p><strong>Name:</strong> {state.data.name}</p>
          <p><strong>Email:</strong> {state.data.email}</p>
          <p><strong>City:</strong> {state.data.address?.city}</p>
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// EXAMPLE 7: Complex State - Shopping Cart
// ==============================================================================
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART'
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const products = [
    { id: 1, name: 'Apple', price: 1.99 },
    { id: 2, name: 'Banana', price: 0.99 },
    { id: 3, name: 'Orange', price: 2.49 }
  ];

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <h3>Shopping Cart</h3>
      <div>
        <h4>Products</h4>
        {products.map(product => (
          <div key={product.id} style={{ margin: '5px 0' }}>
            <span>{product.name} - ${product.price}</span>
            <button onClick={() => dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product })}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Cart</h4>
        {state.items.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <>
            {state.items.map(item => (
              <div key={item.id} style={{ margin: '5px 0' }}>
                <span>{item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => dispatch({
                  type: CART_ACTIONS.UPDATE_QUANTITY,
                  payload: { id: item.id, quantity: item.quantity + 1 }
                })}>+</button>
                <button onClick={() => dispatch({
                  type: CART_ACTIONS.UPDATE_QUANTITY,
                  payload: { id: item.id, quantity: item.quantity - 1 }
                })}>-</button>
                <button onClick={() => dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: item.id })}>
                  Remove
                </button>
              </div>
            ))}
            <p><strong>Total: ${total.toFixed(2)}</strong></p>
            <button onClick={() => dispatch({ type: CART_ACTIONS.CLEAR_CART })}>
              Clear Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ==============================================================================
// DEMO APP
// ==============================================================================
export function UseReducerDemo() {
  const [activeExample, setActiveExample] = useState('basic');

  const examples = {
    basic: <BasicCounter />,
    advanced: <AdvancedCounter />,
    todos: <TodoList />,
    form: <FormExample />,
    context: <ContextWithReducer />,
    async: <AsyncExample />,
    cart: <ShoppingCart />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>useReducer Hook Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select value={activeExample} onChange={(e) => setActiveExample(e.target.value)}>
          <option value="basic">Basic Counter</option>
          <option value="advanced">Counter with Payload</option>
          <option value="todos">Todo List</option>
          <option value="form">Form Management</option>
          <option value="context">useReducer + Context</option>
          <option value="async">Async Actions</option>
          <option value="cart">Shopping Cart</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {examples[activeExample]}
      </div>
    </div>
  );
}
