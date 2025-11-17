/**
 * =============================================================================
 * ESCAPE HATCH #8: REUSING LOGIC WITH CUSTOM HOOKS
 * =============================================================================
 *
 * Hey junior dev! 🎣 This is where React truly shines - custom hooks let you
 * extract and reuse stateful logic across your entire application!
 *
 * WHAT ARE CUSTOM HOOKS?
 * ----------------------
 * Custom hooks are JavaScript functions that:
 * - Start with "use" (e.g., useFormInput, useLocalStorage)
 * - Can call other hooks (useState, useEffect, other custom hooks)
 * - Let you share stateful logic between components
 *
 * WHY CUSTOM HOOKS?
 * -----------------
 * Before hooks, sharing stateful logic was hard:
 * - Render props → nested JSX hell
 * - Higher-order components → wrapper hell
 * - Copy-paste code → maintenance nightmare
 *
 * Custom hooks solve this elegantly! 🎯
 *
 * WHEN TO CREATE A CUSTOM HOOK:
 * ------------------------------
 * ✅ When you copy-paste the same hooks logic
 * ✅ When logic is complex and needs organization
 * ✅ When you want to hide implementation details
 * ✅ When building reusable libraries
 *
 * NAMING CONVENTION:
 * ------------------
 * ⚠️ MUST start with "use" - this is how React knows it's a hook!
 * ✅ useFormInput, useLocalStorage, useDebounce
 * ❌ formInput, localStorage, debounce
 *
 * =============================================================================
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * CUSTOM HOOK #1: useLocalStorage
 * --------------------------------
 * Persist state to localStorage automatically.
 *
 * KEY LEARNING POINTS:
 * - Custom hooks can use other hooks
 * - They encapsulate complex logic
 * - Return values just like built-in hooks
 */
function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('userName', '');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🗄️ useLocalStorage Hook</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Your Name (persisted):
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Theme (persisted):
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="auto">🔄 Auto</option>
          </select>
        </div>
      </div>

      <div style={{
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>✨ Try this:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Enter your name and select a theme</li>
          <li>Refresh the page</li>
          <li>Your settings persist! 🎉</li>
        </ol>
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          This hook automatically syncs with localStorage - no manual save/load needed!
        </p>
      </div>
    </div>
  );
}

/**
 * CUSTOM HOOK #2: useDebounce
 * ----------------------------
 * Delay updating a value until user stops typing.
 *
 * KEY LEARNING POINTS:
 * - Perfect for search inputs
 * - Reduces API calls
 * - Uses useEffect internally
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function DebounceDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState([]);

  // This effect only runs when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Simulate API call
      console.log('🔍 Searching for:', debouncedSearchTerm);
      const results = [
        `Result 1 for "${debouncedSearchTerm}"`,
        `Result 2 for "${debouncedSearchTerm}"`,
        `Result 3 for "${debouncedSearchTerm}"`
      ];
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]); // Only re-run when debounced value changes!

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>⏱️ useDebounce Hook</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Search (debounced 500ms):
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
          style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #333' }}
        />
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Immediate value: <code>{searchTerm}</code>
          <br />
          Debounced value: <code>{debouncedSearchTerm}</code>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          <strong>🔍 Search Results:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 Notice:</strong> As you type, the "Immediate value" updates instantly,
        but "Debounced value" waits 500ms after you stop typing. This prevents
        making API calls on every keystroke!
      </div>
    </div>
  );
}

/**
 * CUSTOM HOOK #3: useOnlineStatus
 * --------------------------------
 * Track whether the user is online or offline.
 *
 * KEY LEARNING POINTS:
 * - Hooks can subscribe to browser events
 * - Clean up subscriptions properly
 * - Reusable across any component
 */
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    // Subscribe to online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

function OnlineStatusDemo() {
  const isOnline = useOnlineStatus();

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🌐 useOnlineStatus Hook</h3>

      <div style={{
        padding: '20px',
        background: isOnline ? '#d4edda' : '#f8d7da',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        {isOnline ? '🟢 You are ONLINE' : '🔴 You are OFFLINE'}
      </div>

      <div style={{
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>🧪 Try this:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Open your browser's DevTools (F12)</li>
          <li>Go to Network tab</li>
          <li>Toggle "Offline" mode</li>
          <li>Watch the status change automatically!</li>
        </ol>
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          This hook can be used in any component to show connection status!
        </p>
      </div>
    </div>
  );
}

/**
 * CUSTOM HOOK #4: useToggle
 * --------------------------
 * Simple hook for boolean toggles.
 *
 * KEY LEARNING POINTS:
 * - Even simple patterns benefit from extraction
 * - Makes component code cleaner
 * - Can return functions and values
 */
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, setTrue, setFalse }];
}

function ToggleDemo() {
  const [isMenuOpen, menuActions] = useToggle(false);
  const [isDarkMode, themeActions] = useToggle(false);
  const [isLiked, likeActions] = useToggle(false);

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🔘 useToggle Hook</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          padding: '15px',
          background: isMenuOpen ? '#d4edda' : '#f8d7da',
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          <strong>Menu:</strong> {isMenuOpen ? '📖 Open' : '📕 Closed'}
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={menuActions.toggle}>Toggle</button>
            <button onClick={menuActions.setTrue}>Open</button>
            <button onClick={menuActions.setFalse}>Close</button>
          </div>
        </div>

        <div style={{
          padding: '15px',
          background: isDarkMode ? '#343a40' : '#f8f9fa',
          color: isDarkMode ? 'white' : 'black',
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          <strong>Theme:</strong> {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          <div style={{ marginTop: '10px' }}>
            <button onClick={themeActions.toggle}>Toggle Theme</button>
          </div>
        </div>

        <div style={{
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '5px'
        }}>
          <strong>Like Button:</strong>
          <button
            onClick={likeActions.toggle}
            style={{
              marginLeft: '10px',
              fontSize: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <div style={{
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>✨ Benefits:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Clean, reusable API for toggles</li>
          <li>No need to write toggle logic repeatedly</li>
          <li>Provides both toggle and explicit set functions</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * CUSTOM HOOK #5: useWindowSize
 * ------------------------------
 * Track window dimensions for responsive behavior.
 *
 * KEY LEARNING POINTS:
 * - Useful for responsive components
 * - Event listener cleanup is crucial
 * - Can be used anywhere window size matters
 */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

function WindowSizeDemo() {
  const { width, height } = useWindowSize();

  const getDeviceType = () => {
    if (width < 768) return '📱 Mobile';
    if (width < 1024) return '📱 Tablet';
    return '💻 Desktop';
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>📐 useWindowSize Hook</h3>

      <div style={{
        padding: '20px',
        background: '#e3f2fd',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          {width} × {height}
        </div>
        <div style={{ fontSize: '24px' }}>
          {getDeviceType()}
        </div>
      </div>

      <div style={{
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>🧪 Try this:</strong>
        <p style={{ margin: '10px 0' }}>
          Resize your browser window and watch the dimensions update in real-time!
        </p>
        <p style={{ margin: '10px 0', fontStyle: 'italic' }}>
          This hook is perfect for building responsive components that adapt
          to screen size without CSS media queries.
        </p>
      </div>
    </div>
  );
}

/**
 * CUSTOM HOOK #6: usePrevious
 * ----------------------------
 * Remember the previous value of a prop or state.
 *
 * KEY LEARNING POINTS:
 * - Refs are perfect for storing previous values
 * - Update ref AFTER render using useEffect
 * - Useful for animations, comparisons, etc.
 */
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function PreviousValueDemo() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>⏮️ usePrevious Hook</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>
            Current: <strong style={{ color: '#2196f3' }}>{count}</strong>
          </div>
          <div style={{ fontSize: '24px' }}>
            Previous: <strong style={{ color: '#666' }}>{prevCount ?? 'N/A'}</strong>
          </div>
          {prevCount !== undefined && (
            <div style={{
              marginTop: '15px',
              fontSize: '18px',
              color: count > prevCount ? 'green' : count < prevCount ? 'red' : 'gray'
            }}>
              {count > prevCount ? '📈 Increased' : count < prevCount ? '📉 Decreased' : '➡️ No change'}
              {count !== prevCount && ` by ${Math.abs(count - prevCount)}`}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => setCount(c => c - 1)} style={{ padding: '10px 20px' }}>
            −1
          </button>
          <button onClick={() => setCount(c => c + 1)} style={{ padding: '10px 20px' }}>
            +1
          </button>
          <button onClick={() => setCount(c => c + 10)} style={{ padding: '10px 20px' }}>
            +10
          </button>
          <button onClick={() => setCount(0)} style={{ padding: '10px 20px' }}>
            Reset
          </button>
        </div>
      </div>

      <div style={{
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 Use cases:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Comparing current vs previous values</li>
          <li>Animating value changes</li>
          <li>Undoing changes</li>
          <li>Tracking state history</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * COMPOSING HOOKS: Building Complex Hooks from Simple Ones
 * ---------------------------------------------------------
 * You can combine multiple custom hooks to create more powerful ones!
 */
function useFormField(initialValue = '', storageKey = null) {
  // Compose useLocalStorage and useDebounce!
  const [value, setValue] = storageKey
    ? useLocalStorage(storageKey, initialValue)
    : useState(initialValue);

  const debouncedValue = useDebounce(value, 300);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value,
    debouncedValue,
    onChange: handleChange,
    reset
  };
}

function ComposedHooksDemo() {
  const email = useFormField('', 'userEmail');
  const username = useFormField('', 'username');

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎼 Composing Custom Hooks</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email (persisted + debounced):
          </label>
          <input
            type="email"
            {...email}
            placeholder="Enter email..."
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
          <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Debounced: {email.debouncedValue}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Username (persisted + debounced):
          </label>
          <input
            type="text"
            {...username}
            placeholder="Enter username..."
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
          <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
            Debounced: {username.debouncedValue}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={email.reset} style={{ padding: '8px 16px' }}>
            Reset Email
          </button>
          <button onClick={username.reset} style={{ padding: '8px 16px' }}>
            Reset Username
          </button>
        </div>
      </div>

      <div style={{
        padding: '15px',
        background: '#d4edda',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>✨ This custom hook combines:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>useLocalStorage (persistence)</li>
          <li>useDebounce (delayed updates)</li>
          <li>useState (local state management)</li>
        </ul>
        <p style={{ margin: '10px 0' }}>
          You can build complex hooks by composing simpler ones! 🎼
        </p>
      </div>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 */
export default function ReusingLogicWithCustomHooks() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🎣 Escape Hatch #8: Reusing Logic with Custom Hooks</h1>

      <div style={{
        background: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>📚 Quick Reference</h2>
        <p><strong>What:</strong> JavaScript functions that use hooks and start with "use"</p>
        <p><strong>Why:</strong> Share stateful logic between components</p>
        <p><strong>How:</strong> Extract repeated hook patterns into reusable functions</p>
        <p><strong>Rules:</strong></p>
        <ul>
          <li>Must start with "use" (required!)</li>
          <li>Can call other hooks</li>
          <li>Follow the same rules as built-in hooks</li>
          <li>Can return anything (values, functions, objects)</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <LocalStorageDemo />
        <DebounceDemo />
        <OnlineStatusDemo />
        <ToggleDemo />
        <WindowSizeDemo />
        <PreviousValueDemo />
        <ComposedHooksDemo />
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2>🎓 Key Takeaways</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Custom hooks = reusable stateful logic</strong></li>
          <li><strong>Must start with "use"</strong> - this is not optional!</li>
          <li><strong>Can use any hooks inside</strong> - useState, useEffect, other custom hooks</li>
          <li><strong>Share logic, not state</strong> - each usage gets its own state</li>
          <li><strong>Compose hooks</strong> - build complex hooks from simple ones</li>
          <li><strong>Extract when you see repetition</strong> - DRY principle applies!</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#d4edda',
        borderRadius: '8px'
      }}>
        <h3>✅ When to Create a Custom Hook</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>You're copy-pasting the same hooks logic</li>
          <li>You want to hide complex implementation details</li>
          <li>You're building a reusable library</li>
          <li>You want to organize complex component logic</li>
          <li>You want to share logic across multiple components</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#fff3cd',
        borderRadius: '8px'
      }}>
        <h3>📋 Custom Hook Checklist</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ Name starts with "use"</li>
          <li>✅ Uses at least one React hook internally</li>
          <li>✅ Follows hook rules (only call at top level, only in React functions)</li>
          <li>✅ Returns something useful (value, object, array)</li>
          <li>✅ Has a clear, single purpose</li>
          <li>✅ Handles cleanup properly (if using effects)</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * =============================================================================
 * HOMEWORK FOR JUNIOR DEVS 📝
 * =============================================================================
 *
 * Build these custom hooks to master the pattern:
 *
 * 1. useHover - Returns true when mouse is over an element
 *    Hint: Use refs and mouseover/mouseout events
 *
 * 2. useKeyPress - Returns true when a specific key is pressed
 *    Hint: Listen to keydown/keyup events
 *
 * 3. useFetch - Handles API calls with loading, error, and data states
 *    Hint: Combine useState and useEffect
 *
 * 4. useInterval - Easier interval management than raw useEffect
 *    Hint: Wrap setInterval with proper cleanup
 *
 * 5. useMediaQuery - Check if a CSS media query matches
 *    Hint: Use window.matchMedia() and listen to changes
 *
 * 6. useForm - Complete form management with validation
 *    Hint: Combine multiple custom hooks!
 *
 * Remember: Custom hooks are about sharing LOGIC, not STATE! Each component
 * that uses your hook gets its own independent state. 🎯
 *
 * Happy hooking! 🎣
 * =============================================================================
 */
