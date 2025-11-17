# useReducer Hook - Comprehensive Guide

## Overview
`useReducer` is an alternative to `useState` for managing complex state logic. It's similar to Redux reducers and is ideal when state updates involve multiple sub-values or complex update logic.

## Basic Syntax
```javascript
const [state, dispatch] = useReducer(reducer, initialState, init);
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
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

### Todo List
```javascript
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

function TodoList() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  return (
    // Component JSX
  );
}
```

## Best Practices

### ✅ 1. Use Action Types as Constants
```javascript
// GOOD: Constants prevent typos
const ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO'
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [...state, action.payload];
    case ACTIONS.TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
}

// BAD: String literals prone to typos
function reducer(state, action) {
  switch (action.type) {
    case 'add_todo': // typo!
      return [...state, action.payload];
    case 'ADD_TODO': // inconsistent!
      return [...state, action.payload];
  }
}
```

### ✅ 2. Use Action Creators
```javascript
// GOOD: Action creators for consistency
const actions = {
  addTodo: (text) => ({ type: 'ADD_TODO', payload: { text, id: Date.now() } }),
  toggleTodo: (id) => ({ type: 'TOGGLE_TODO', payload: id }),
  deleteTodo: (id) => ({ type: 'DELETE_TODO', payload: id })
};

function TodoList() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  const handleAdd = (text) => {
    dispatch(actions.addTodo(text));
  };
}
```

### ✅ 3. Keep Reducer Pure
```javascript
// GOOD: Pure function, no side effects
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.item]; // Returns new array
    case 'REMOVE':
      return state.filter(item => item.id !== action.id);
    default:
      return state;
  }
}

// BAD: Mutates state, has side effects
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      state.push(action.item); // Mutates!
      console.log('Added item'); // Side effect!
      return state;
  }
}
```

### ✅ 4. Handle Default Case
```javascript
// GOOD: Throw error for unknown actions (development)
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Also good: Return current state (production-safe)
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown action type: ${action.type}`);
      }
      return state;
  }
}
```

### ✅ 5. Use Lazy Initialization for Expensive Initial State
```javascript
// GOOD: Lazy initialization
function init(initialCount) {
  return { count: expensiveComputation(initialCount) };
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // init only called once
}

// BAD: Runs on every render
function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(
    reducer,
    { count: expensiveComputation(initialCount) }
  );
}
```

## Anti-Patterns

### ❌ 1. Using useReducer for Simple State
```javascript
// BAD: Overkill for simple boolean
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return { isOpen: !state.isOpen };
    default:
      return state;
  }
}

function Modal() {
  const [state, dispatch] = useReducer(reducer, { isOpen: false });
}

// GOOD: Use useState for simple state
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
}
```

### ❌ 2. Mutating State in Reducer
```javascript
// BAD: Direct mutation
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      state.items.push(action.item); // Mutates state!
      return state;
    case 'UPDATE':
      state.items[action.index] = action.item; // Mutates!
      return state;
  }
}

// GOOD: Return new objects/arrays
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        items: [...state.items, action.item]
      };
    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((item, i) =>
          i === action.index ? action.item : item
        )
      };
  }
}
```

### ❌ 3. Dispatching Actions During Render
```javascript
// BAD: Dispatching during render
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);

  if (state.needsUpdate) {
    dispatch({ type: 'UPDATE' }); // WRONG! During render
  }

  return <div>{state.value}</div>;
}

// GOOD: Dispatch in effect or event handler
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.needsUpdate) {
      dispatch({ type: 'UPDATE' });
    }
  }, [state.needsUpdate]);

  return <div>{state.value}</div>;
}
```

### ❌ 4. Too Many Action Types
```javascript
// BAD: Too granular
const ACTIONS = {
  SET_FIRST_NAME: 'SET_FIRST_NAME',
  SET_LAST_NAME: 'SET_LAST_NAME',
  SET_EMAIL: 'SET_EMAIL',
  SET_PHONE: 'SET_PHONE',
  // ... 20 more fields
};

// GOOD: Generic update action
const ACTIONS = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  RESET_FORM: 'RESET_FORM',
  SUBMIT_FORM: 'SUBMIT_FORM'
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_FIELD:
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}
```

### ❌ 5. Not Using Payload
```javascript
// BAD: Multiple action types for similar actions
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT_BY_1':
      return { count: state.count + 1 };
    case 'INCREMENT_BY_5':
      return { count: state.count + 5 };
    case 'INCREMENT_BY_10':
      return { count: state.count + 10 };
  }
}

// GOOD: Use payload for data
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + (action.payload || 1) };
    default:
      return state;
  }
}

// Usage
dispatch({ type: 'INCREMENT', payload: 5 });
```

## Caveats and Common Mistakes

### ⚠️ 1. Reducer Must Be Pure
```javascript
// WRONG: Side effects in reducer
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      localStorage.setItem('items', JSON.stringify(state)); // Side effect!
      return { ...state, items: [...state.items, action.item] };
  }
}

// CORRECT: Side effects in useEffect
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(state.items));
  }, [state.items]);
}
```

### ⚠️ 2. State Updates Are Async
```javascript
function Component() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  const handleClick = () => {
    dispatch({ type: 'INCREMENT' });
    console.log(state.count); // Still old value!
  };
}
```

### ⚠️ 3. Dispatch Identity Is Stable
```javascript
// dispatch never changes, safe to omit from dependencies
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'INIT' });
  }, []); // No need to include dispatch
}
```

### ⚠️ 4. Initial State Runs Every Render (Without Lazy Init)
```javascript
// BAD: Expensive computation runs every render
function Component() {
  const [state, dispatch] = useReducer(
    reducer,
    expensiveComputation() // Runs every render!
  );
}

// GOOD: Use lazy initialization
function init() {
  return expensiveComputation();
}

function Component() {
  const [state, dispatch] = useReducer(reducer, null, init);
  // Computation runs only once
}
```

### ⚠️ 5. Bail Out of Re-renders
```javascript
// React bails out if you return the same state reference
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE':
      if (state.value === action.value) {
        return state; // No re-render!
      }
      return { ...state, value: action.value };
    default:
      return state;
  }
}
```

## Advanced Patterns

### Pattern 1: Reducer with Context
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

// Custom hooks
export function useAppState() {
  return useContext(StateContext);
}

export function useAppDispatch() {
  return useContext(DispatchContext);
}
```

### Pattern 2: Immer for Immutable Updates
```javascript
import produce from 'immer';

function reducer(state, action) {
  return produce(state, draft => {
    switch (action.type) {
      case 'ADD_TODO':
        draft.todos.push(action.todo);
        break;
      case 'TOGGLE_TODO':
        const todo = draft.todos.find(t => t.id === action.id);
        if (todo) todo.done = !todo.done;
        break;
    }
  });
}
```

### Pattern 3: Combining Multiple Reducers
```javascript
function combineReducers(reducers) {
  return (state, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}

const rootReducer = combineReducers({
  todos: todosReducer,
  user: userReducer,
  settings: settingsReducer
});

function App() {
  const [state, dispatch] = useReducer(rootReducer, initialState);
}
```

### Pattern 4: Async Actions with Thunks
```javascript
function useThunkReducer(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = useCallback(
    (action) => {
      if (typeof action === 'function') {
        return action(dispatch);
      }
      return dispatch(action);
    },
    [dispatch]
  );

  return [state, enhancedDispatch];
}

// Usage
const [state, dispatch] = useThunkReducer(reducer, initialState);

// Async action
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'LOADING' });
  const user = await fetch(`/api/users/${id}`).then(r => r.json());
  dispatch({ type: 'SUCCESS', user });
};

dispatch(fetchUser(123));
```

### Pattern 5: Undo/Redo
```javascript
function undoableReducer(reducer) {
  const initialState = {
    past: [],
    present: undefined,
    future: []
  };

  return (state = initialState, action) => {
    const { past, present, future } = state;

    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        };
      case 'REDO':
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture
        };
      default:
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state;
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        };
    }
  };
}
```

## useReducer vs useState

### Use useReducer when:
- ✅ State logic is complex (multiple sub-values)
- ✅ Next state depends on previous state
- ✅ Multiple actions update state in different ways
- ✅ Want to optimize performance (pass dispatch down)
- ✅ State updates follow predictable patterns
- ✅ Need to test state logic separately

### Use useState when:
- ✅ State is simple (primitives, single values)
- ✅ State updates are independent
- ✅ No complex update logic
- ✅ State is local to component

## Summary

**Do:**
- ✅ Use action constants to prevent typos
- ✅ Keep reducers pure (no side effects)
- ✅ Use action creators for consistency
- ✅ Handle default case in reducer
- ✅ Use lazy initialization for expensive state

**Don't:**
- ❌ Use useReducer for simple state
- ❌ Mutate state in reducer
- ❌ Dispatch during render
- ❌ Put side effects in reducer
- ❌ Create too many granular action types

**Remember:**
- Reducer must be pure function
- Dispatch identity is stable
- State updates are async (like useState)
- Return same reference to bail out of re-render
- Great for complex state logic and state machines
