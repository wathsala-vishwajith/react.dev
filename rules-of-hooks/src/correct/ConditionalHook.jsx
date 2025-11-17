import { useState } from 'react';

/**
 * ✅ CORRECT: Call hooks at the top level, use conditional logic inside
 *
 * Always call hooks at the top level of your component.
 * Handle conditional logic AFTER calling the hooks.
 */
function ConditionalHookCorrect({ isLoggedIn }) {
  // ✅ CORRECT: Hook called at the top level
  const [user, setUser] = useState(null);

  // Conditional logic comes AFTER the hook
  if (!isLoggedIn) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h3>Conditional Hook Example (CORRECT)</h3>
      <p>Welcome, {user || 'Guest'}!</p>
      <button onClick={() => setUser('John Doe')}>Set User</button>
    </div>
  );
}

/**
 * ✅ CORRECT: All hooks called before any returns
 */
function EarlyReturnCorrect({ shouldRender }) {
  // ✅ CORRECT: All hooks called at the top, before any conditional returns
  const [count, setCount] = useState(0);

  // Conditional rendering comes AFTER all hooks
  if (!shouldRender) {
    return null;
  }

  return (
    <div>
      <h3>Early Return Example (CORRECT)</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

/**
 * ✅ CORRECT: Use hooks at top level, conditionally render JSX
 */
function ConditionalRenderCorrect({ isLoading }) {
  // ✅ CORRECT: Hooks always called
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Conditional rendering in JSX
  return (
    <div>
      <h3>Conditional Render Example (CORRECT)</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Data: {data || 'No data yet'}</p>
      )}
      <button onClick={() => setData('Sample Data')}>Load Data</button>
    </div>
  );
}

export { ConditionalHookCorrect, EarlyReturnCorrect, ConditionalRenderCorrect };
