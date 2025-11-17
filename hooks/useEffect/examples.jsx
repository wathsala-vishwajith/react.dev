import React, { useState, useEffect, useRef } from 'react';

// ==============================================================================
// EXAMPLE 1: Basic Effect - Document Title
// ==============================================================================
export function DocumentTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
    console.log('Title updated to:', count);
  }, [count]);

  return (
    <div>
      <h3>Document Title Effect</h3>
      <p>Count: {count}</p>
      <p>Check your browser tab title!</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 2: Effect with Cleanup - Timer
// ==============================================================================
export function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    console.log('Effect running, isRunning:', isRunning);

    if (!isRunning) return;

    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // Cleanup function
    return () => {
      console.log('Cleaning up interval');
      clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div>
      <h3>Timer with Cleanup</h3>
      <p>Time: {count}s</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 3: Event Listener with Cleanup
// ==============================================================================
export function MousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!isTracking) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    console.log('Adding mouse listener');
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      console.log('Removing mouse listener');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTracking]);

  return (
    <div>
      <h3>Mouse Position Tracker</h3>
      <button onClick={() => setIsTracking(!isTracking)}>
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </button>
      {isTracking && (
        <p>Mouse position: ({position.x}, {position.y})</p>
      )}
    </div>
  );
}

// ==============================================================================
// EXAMPLE 4: Data Fetching with Cleanup (Race Condition Prevention)
// ==============================================================================
export function UserProfile() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    console.log('Fetching user:', userId);

    // Simulate API call
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          console.log('Setting user data for:', userId);
          setUser(data);
          setLoading(false);
        } else {
          console.log('Request cancelled for:', userId);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Error:', err);
          setLoading(false);
        }
      });

    return () => {
      console.log('Cleanup: Cancelling request for', userId);
      cancelled = true;
    };
  }, [userId]);

  return (
    <div>
      <h3>User Profile (Race Condition Prevention)</h3>
      <div>
        <button onClick={() => setUserId(1)}>User 1</button>
        <button onClick={() => setUserId(2)}>User 2</button>
        <button onClick={() => setUserId(3)}>User 3</button>
        <button onClick={() => setUserId(Math.floor(Math.random() * 10) + 1)}>
          Random User
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>City:</strong> {user.address?.city}</p>
        </div>
      ) : null}
    </div>
  );
}

// ==============================================================================
// EXAMPLE 5: Anti-Pattern - Missing Dependencies
// ==============================================================================
export function MissingDependencies() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);

  // ❌ BAD: Missing 'multiplier' dependency
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Updating with multiplier:', multiplier);
      setCount(c => c + multiplier); // Uses stale multiplier!
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Should include [multiplier]

  return (
    <div>
      <h3>❌ Anti-Pattern: Missing Dependencies</h3>
      <p>Count: {count}</p>
      <p>Multiplier: {multiplier}</p>
      <p>⚠️ Changing multiplier won't work correctly!</p>
      <button onClick={() => setMultiplier(m => m + 1)}>Increase Multiplier</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Fixed version
export function FixedDependencies() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);

  // ✅ GOOD: All dependencies included
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Updating with multiplier:', multiplier);
      setCount(c => c + multiplier);
    }, 1000);

    return () => clearInterval(interval);
  }, [multiplier]); // Correctly includes multiplier

  return (
    <div>
      <h3>✅ Fixed: Correct Dependencies</h3>
      <p>Count: {count}</p>
      <p>Multiplier: {multiplier}</p>
      <p>✓ Changing multiplier works correctly!</p>
      <button onClick={() => setMultiplier(m => m + 1)}>Increase Multiplier</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 6: Anti-Pattern - Derived State
// ==============================================================================
export function BadDerivedState() {
  const [items] = useState(['Apple', 'Banana', 'Cherry', 'Date']);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  // ❌ BAD: Using effect for derived state
  useEffect(() => {
    console.log('Effect running - filtering items');
    setFilteredItems(
      items.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm]);

  return (
    <div>
      <h3>❌ Anti-Pattern: Derived State in Effect</h3>
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

export function GoodDerivedState() {
  const [items] = useState(['Apple', 'Banana', 'Cherry', 'Date']);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ GOOD: Calculate during render
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>✅ Fixed: Calculate During Render</h3>
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
// EXAMPLE 7: Infinite Loop Examples
// ==============================================================================
export function InfiniteLoopExample() {
  const [count, setCount] = useState(0);

  // ❌ WARNING: This would cause infinite loop - commented out
  /*
  useEffect(() => {
    setCount(count + 1); // Causes re-render -> effect runs -> re-render...
  }); // No dependency array!
  */

  // ✅ Safe version with condition
  useEffect(() => {
    if (count < 5) {
      setCount(count + 1);
    }
  }, [count]); // Stops at 5

  return (
    <div>
      <h3>Conditional Effect (Stops at 5)</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 8: Object Dependency Problem
// ==============================================================================
export function ObjectDependencyProblem() {
  const [data, setData] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);

  // ❌ BAD: New object every render
  const options = { method: 'GET', limit: 10 };

  useEffect(() => {
    console.log('Fetching with options (runs every render!)');
    setFetchCount(c => c + 1);
    // Simulate fetch
    setData({ result: 'data' });
  }, [options]); // New object reference every render!

  return (
    <div>
      <h3>❌ Object Dependency Problem</h3>
      <p>Fetch count: {fetchCount} (should be 1, but keeps growing!)</p>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}

export function ObjectDependencyFixed() {
  const [data, setData] = useState(null);
  const [fetchCount, setFetchCount] = useState(0);

  // ✅ GOOD: Define inside effect or use useMemo
  useEffect(() => {
    const options = { method: 'GET', limit: 10 };
    console.log('Fetching with options (runs once!)');
    setFetchCount(c => c + 1);
    // Simulate fetch
    setData({ result: 'data' });
  }, []); // Empty deps - only runs once

  return (
    <div>
      <h3>✅ Fixed Object Dependency</h3>
      <p>Fetch count: {fetchCount} (correctly stays at 1)</p>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 9: Custom Hook - useDebounce
// ==============================================================================
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function DebouncedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('Searching for:', debouncedSearchTerm);
      setSearchCount(c => c + 1);
      // Perform search here
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <h3>Debounced Search</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Search term: {searchTerm}</p>
      <p>Debounced term: {debouncedSearchTerm}</p>
      <p>API calls made: {searchCount}</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 10: Custom Hook - useInterval
// ==============================================================================
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function IntervalClock() {
  const [time, setTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(true);

  useInterval(() => {
    setTime(new Date());
  }, isRunning ? 1000 : null);

  return (
    <div>
      <h3>Clock with useInterval Hook</h3>
      <p>{time.toLocaleTimeString()}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 11: Effect Runs After Every Render
// ==============================================================================
export function EffectTiming() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  renderCount.current += 1;

  // No dependency array - runs after EVERY render
  useEffect(() => {
    console.log('Effect ran after render #', renderCount.current);
  });

  return (
    <div>
      <h3>Effect Timing (Check Console)</h3>
      <p>Render count: {renderCount.current}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 12: Multiple Effects - Separation of Concerns
// ==============================================================================
export function MultipleEffects() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Guest');

  // Effect 1: Update document title with count
  useEffect(() => {
    console.log('Effect 1: Updating title');
    document.title = `Count: ${count}`;
  }, [count]);

  // Effect 2: Log name changes
  useEffect(() => {
    console.log('Effect 2: Name changed to', name);
  }, [name]);

  // Effect 3: Run only on mount
  useEffect(() => {
    console.log('Effect 3: Component mounted');
    return () => console.log('Effect 3: Component unmounted');
  }, []);

  return (
    <div>
      <h3>Multiple Separate Effects</h3>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
      </div>
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(c => c + 1)}>Increment</button>
      </div>
      <p>Check console to see which effects run</p>
    </div>
  );
}

// ==============================================================================
// DEMO APP: Combines all examples
// ==============================================================================
export function UseEffectDemo() {
  const [activeExample, setActiveExample] = useState('title');
  const [showExample, setShowExample] = useState(true);

  const examples = {
    title: <DocumentTitle />,
    timer: <Timer />,
    mouse: <MousePosition />,
    fetch: <UserProfile />,
    badDeps: <MissingDependencies />,
    goodDeps: <FixedDependencies />,
    badDerived: <BadDerivedState />,
    goodDerived: <GoodDerivedState />,
    loop: <InfiniteLoopExample />,
    badObj: <ObjectDependencyProblem />,
    goodObj: <ObjectDependencyFixed />,
    debounce: <DebouncedSearch />,
    interval: <IntervalClock />,
    timing: <EffectTiming />,
    multiple: <MultipleEffects />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>useEffect Hook Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select
          value={activeExample}
          onChange={(e) => {
            setShowExample(false);
            setActiveExample(e.target.value);
            setTimeout(() => setShowExample(true), 10);
          }}
        >
          <option value="title">Document Title</option>
          <option value="timer">Timer with Cleanup</option>
          <option value="mouse">Mouse Position</option>
          <option value="fetch">Data Fetching (Race Condition)</option>
          <option value="badDeps">❌ Missing Dependencies</option>
          <option value="goodDeps">✅ Correct Dependencies</option>
          <option value="badDerived">❌ Derived State in Effect</option>
          <option value="goodDerived">✅ Calculate During Render</option>
          <option value="loop">Conditional Effect</option>
          <option value="badObj">❌ Object Dependency Problem</option>
          <option value="goodObj">✅ Object Dependency Fixed</option>
          <option value="debounce">Debounced Search</option>
          <option value="interval">useInterval Hook</option>
          <option value="timing">Effect Timing</option>
          <option value="multiple">Multiple Effects</option>
        </select>
        <button onClick={() => {
          setShowExample(false);
          setTimeout(() => setShowExample(true), 10);
        }}>
          Remount Component
        </button>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {showExample && examples[activeExample]}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>💡 Tip:</strong> Open your browser console to see effect lifecycle logs
      </div>
    </div>
  );
}
