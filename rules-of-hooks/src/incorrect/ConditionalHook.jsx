import { useState } from 'react';

/**
 * ❌ INCORRECT: Calling hooks inside conditions
 *
 * This violates the Rules of Hooks because hooks must be called
 * in the same order every time a component renders.
 */
function ConditionalHookIncorrect({ isLoggedIn }) {
  // ❌ WRONG: Hook called conditionally
  if (isLoggedIn) {
    const [user, setUser] = useState(null);
  }

  // This will cause React to throw an error because the number
  // of hooks called changes between renders
  return <div>Conditional Hook Example (INCORRECT)</div>;
}

/**
 * ❌ INCORRECT: Another conditional hook example
 */
function EarlyReturnIncorrect({ shouldRender }) {
  // ❌ WRONG: Early return before all hooks are called
  if (!shouldRender) {
    return null;
  }

  // This hook won't be called on every render
  const [count, setCount] = useState(0);

  return <div>Count: {count}</div>;
}

export { ConditionalHookIncorrect, EarlyReturnIncorrect };
