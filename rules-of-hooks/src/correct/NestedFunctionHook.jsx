import { useState, useEffect } from 'react';

/**
 * ✅ CORRECT: Call hooks at the top level, not inside event handlers
 *
 * Define your state at the component's top level,
 * then update it from event handlers.
 */
function NestedFunctionHookCorrect() {
  // ✅ CORRECT: Hooks called at the top level
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  // ✅ CORRECT: Effect at the top level
  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // Event handlers just update state, don't call hooks
  function handleClick() {
    // ✅ CORRECT: Just updating state, not calling hooks
    setCount(prevCount => prevCount + 1);
  }

  return (
    <div>
      <h3>Nested Function Hook Example (CORRECT)</h3>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment Count</button>
      <p>Data: {data ? JSON.stringify(data) : 'Loading...'}</p>
    </div>
  );
}

/**
 * ✅ CORRECT: Use state and effects at the top level
 */
function CallbackHookCorrect() {
  // ✅ CORRECT: All hooks at the top level
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Event handler that updates state
  const loadItems = async () => {
    // ✅ CORRECT: Just updating state, not calling hooks
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Callback Hook Example (CORRECT)</h3>
      <button onClick={loadItems} disabled={loading}>
        {loading ? 'Loading...' : 'Load Items'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * ✅ CORRECT: Separate data fetching logic into a custom hook
 */
function useFetchData(url) {
  // ✅ CORRECT: Custom hooks can call other hooks
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();

        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

function CustomHookExample() {
  // ✅ CORRECT: Using a custom hook in a component
  const { data, loading, error } = useFetchData('/api/data');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Custom Hook Example (CORRECT)</h3>
      <p>Data: {data ? JSON.stringify(data) : 'No data'}</p>
    </div>
  );
}

export { NestedFunctionHookCorrect, CallbackHookCorrect, CustomHookExample, useFetchData };
