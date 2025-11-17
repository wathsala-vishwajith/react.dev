import { useState, useEffect } from 'react';

/**
 * ❌ INCORRECT: Calling hooks inside nested functions
 *
 * Hooks must be called at the top level of your component,
 * not inside nested functions, event handlers, or callbacks.
 */
function NestedFunctionHookIncorrect() {
  const [data, setData] = useState(null);

  function handleClick() {
    // ❌ WRONG: Hook called inside an event handler
    const [count, setCount] = useState(0);
    setCount(count + 1);
  }

  function fetchData() {
    // ❌ WRONG: Hook called inside a nested function
    useEffect(() => {
      fetch('/api/data')
        .then(res => res.json())
        .then(setData);
    }, []);
  }

  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
      <p>Nested Function Hook Example (INCORRECT)</p>
    </div>
  );
}

/**
 * ❌ INCORRECT: Calling hooks inside callbacks
 */
function CallbackHookIncorrect() {
  const [items, setItems] = useState([]);

  const loadItems = () => {
    // ❌ WRONG: Hook called inside a callback
    const [loading, setLoading] = useState(false);
    setLoading(true);
    // ... fetch logic
  };

  return <button onClick={loadItems}>Load Items</button>;
}

export { NestedFunctionHookIncorrect, CallbackHookIncorrect };
