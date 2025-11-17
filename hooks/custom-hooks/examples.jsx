import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ==============================================================================
// CUSTOM HOOK 1: useLocalStorage
// ==============================================================================
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export function LocalStorageExample() {
  const [name, setName] = useLocalStorage('user-name', '');
  const [age, setAge] = useLocalStorage('user-age', 0);

  return (
    <div>
      <h3>useLocalStorage Hook</h3>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
      </div>
      <div>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          placeholder="Age"
        />
      </div>
      <p>Values persisted in localStorage!</p>
      <button onClick={() => { setName(''); setAge(0); }}>
        Clear
      </button>
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 2: useDebounce
// ==============================================================================
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function DebounceExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searches, setSearches] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('Searching for:', debouncedSearchTerm);
      setSearches(prev => [...prev, {
        term: debouncedSearchTerm,
        time: new Date().toLocaleTimeString()
      }]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <h3>useDebounce Hook</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search (debounced 500ms)..."
      />
      <p>Current: "{searchTerm}"</p>
      <p>Debounced: "{debouncedSearchTerm}"</p>
      <div>
        <h4>Search History:</h4>
        <ul>
          {searches.map((search, i) => (
            <li key={i}>{search.time}: "{search.term}"</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 3: useToggle
// ==============================================================================
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle, setValue];
}

export function ToggleExample() {
  const [isOn, toggle, setIsOn] = useToggle(false);

  return (
    <div>
      <h3>useToggle Hook</h3>
      <div
        style={{
          width: '100px',
          height: '50px',
          background: isOn ? '#4CAF50' : '#ccc',
          borderRadius: '25px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
        onClick={toggle}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            background: 'white',
            borderRadius: '50%',
            position: 'absolute',
            top: '5px',
            left: isOn ? '55px' : '5px',
            transition: 'left 0.3s'
          }}
        />
      </div>
      <p>Status: {isOn ? 'ON' : 'OFF'}</p>
      <button onClick={() => setIsOn(true)}>Turn On</button>
      <button onClick={() => setIsOn(false)}>Turn Off</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 4: usePrevious
// ==============================================================================
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function PreviousExample() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <h3>usePrevious Hook</h3>
      <p>Current count: {count}</p>
      <p>Previous count: {previousCount}</p>
      <p>Change: {count - (previousCount || 0)}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count + 5)}>+5</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 5: useWindowSize
// ==============================================================================
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function WindowSizeExample() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <h3>useWindowSize Hook</h3>
      <p>Window width: {width}px</p>
      <p>Window height: {height}px</p>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Try resizing the browser window!
      </p>
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 6: useOnClickOutside
// ==============================================================================
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export function ClickOutsideExample() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => {
    console.log('Clicked outside');
    setIsOpen(false);
  });

  return (
    <div>
      <h3>useOnClickOutside Hook</h3>
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open'} Dropdown
        </button>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'white',
              border: '1px solid #ccc',
              padding: '10px',
              marginTop: '5px',
              minWidth: '150px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}
          >
            <div style={{ padding: '5px', cursor: 'pointer' }}>Option 1</div>
            <div style={{ padding: '5px', cursor: 'pointer' }}>Option 2</div>
            <div style={{ padding: '5px', cursor: 'pointer' }}>Option 3</div>
          </div>
        )}
      </div>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Click outside the dropdown to close it
      </p>
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 7: useInterval
// ==============================================================================
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function IntervalExample() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(() => {
    setCount(c => c + 1);
  }, isRunning ? delay : null);

  return (
    <div>
      <h3>useInterval Hook</h3>
      <p style={{ fontSize: '2em' }}>{count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Resume'}
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
      <div>
        <label>Delay: {delay}ms</label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 8: useFetch
// ==============================================================================
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

export function FetchExample() {
  const [userId, setUserId] = useState(1);
  const { data, loading, error } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  return (
    <div>
      <h3>useFetch Hook</h3>
      <div>
        <button onClick={() => setUserId(1)}>User 1</button>
        <button onClick={() => setUserId(2)}>User 2</button>
        <button onClick={() => setUserId(3)}>User 3</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>City:</strong> {data.address?.city}</p>
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 9: useMediaQuery
// ==============================================================================
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    // Older browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

export function MediaQueryExample() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div>
      <h3>useMediaQuery Hook</h3>
      <p>Device type: {isMobile ? '📱 Mobile' : isTablet ? '📱 Tablet' : isDesktop ? '💻 Desktop' : 'Unknown'}</p>
      <p>Color scheme: {isDark ? '🌙 Dark' : '☀️ Light'}</p>
      <p>Window width: {window.innerWidth}px</p>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Try resizing the browser window!
      </p>
    </div>
  );
}

// ==============================================================================
// CUSTOM HOOK 10: useAsync
// ==============================================================================
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error.message);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

export function AsyncExample() {
  const fetchUser = useCallback(async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }, []);

  const { execute, status, data, error } = useAsync(fetchUser, false);

  return (
    <div>
      <h3>useAsync Hook</h3>
      <button onClick={execute} disabled={status === 'pending'}>
        {status === 'pending' ? 'Loading...' : 'Fetch User'}
      </button>

      <p>Status: {status}</p>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

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
// DEMO APP
// ==============================================================================
export function CustomHooksDemo() {
  const [activeExample, setActiveExample] = useState('localStorage');

  const examples = {
    localStorage: <LocalStorageExample />,
    debounce: <DebounceExample />,
    toggle: <ToggleExample />,
    previous: <PreviousExample />,
    windowSize: <WindowSizeExample />,
    clickOutside: <ClickOutsideExample />,
    interval: <IntervalExample />,
    fetch: <FetchExample />,
    mediaQuery: <MediaQueryExample />,
    async: <AsyncExample />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Custom Hooks Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select value={activeExample} onChange={(e) => setActiveExample(e.target.value)}>
          <option value="localStorage">useLocalStorage</option>
          <option value="debounce">useDebounce</option>
          <option value="toggle">useToggle</option>
          <option value="previous">usePrevious</option>
          <option value="windowSize">useWindowSize</option>
          <option value="clickOutside">useOnClickOutside</option>
          <option value="interval">useInterval</option>
          <option value="fetch">useFetch</option>
          <option value="mediaQuery">useMediaQuery</option>
          <option value="async">useAsync</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {examples[activeExample]}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>💡 Tip:</strong> These custom hooks can be copied and used in your own projects!
      </div>
    </div>
  );
}
