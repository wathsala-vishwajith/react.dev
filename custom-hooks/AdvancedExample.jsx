import { useState, useEffect } from 'react';

/**
 * Advanced Custom Hooks Example
 * Demonstrates composing multiple custom hooks and advanced patterns
 */

// ============================================
// CUSTOM HOOK 1: useLocalStorage
// ============================================
// Synchronizes state with localStorage
function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use default
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
}

// ============================================
// CUSTOM HOOK 2: useWindowSize
// ============================================
// Tracks window dimensions
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// ============================================
// CUSTOM HOOK 3: useDebounce
// ============================================
// Debounces a value (useful for search inputs)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// CUSTOM HOOK 4: useToggle
// ============================================
// Simple toggle functionality
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(v => !v);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  };
}

// ============================================
// COMPOSED CUSTOM HOOK
// ============================================
// This hook combines multiple custom hooks!
function useTheme() {
  // Uses useLocalStorage to persist theme preference
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme
  };
}

// ============================================
// COMPONENTS USING CUSTOM HOOKS
// ============================================

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      console.log('Searching for:', debouncedSearch);
      // Here you would typically make an API call
    }
  }, [debouncedSearch]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search (debounced by 500ms)..."
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          border: '2px solid #ddd',
          borderRadius: '5px'
        }}
      />
      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
        Current: "{searchTerm}" | Debounced: "{debouncedSearch}"
      </p>
    </div>
  );
}

function WindowInfo() {
  const { width, height } = useWindowSize();

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#e3f2fd',
      borderRadius: '5px',
      marginBottom: '20px'
    }}>
      <h3>Window Size</h3>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Resize your window to see the values update!
      </p>
    </div>
  );
}

function Settings() {
  const notifications = useToggle(true);
  const emailUpdates = useToggle(false);
  const darkMode = useToggle(false);

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px',
      marginBottom: '20px'
    }}>
      <h3>Settings (using useToggle)</h3>

      <label style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={notifications.value}
          onChange={notifications.toggle}
        />
        {' '} Enable Notifications
      </label>

      <label style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={emailUpdates.value}
          onChange={emailUpdates.toggle}
        />
        {' '} Email Updates
      </label>

      <label style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={darkMode.value}
          onChange={darkMode.toggle}
        />
        {' '} Dark Mode
      </label>

      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '3px' }}>
        <small>
          Settings are toggled using the <code>useToggle</code> custom hook,
          which provides a clean API for boolean state management.
        </small>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const { theme, isDark, toggleTheme } = useTheme();

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: isDark ? '#4a4a4a' : '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Advanced Custom Hooks Example</h1>
        <button onClick={toggleTheme} style={styles.button}>
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <p style={{ marginBottom: '30px', opacity: 0.8 }}>
        This example demonstrates multiple custom hooks working together.
        Theme preference is saved to localStorage!
      </p>

      <SearchBar />
      <WindowInfo />
      <Settings />

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: isDark ? '#2a2a2a' : '#fff3cd',
        borderRadius: '8px',
        borderLeft: '4px solid ' + (isDark ? '#ffc107' : '#856404')
      }}>
        <h3>💡 Custom Hooks Used in This Example:</h3>
        <ol>
          <li><strong>useLocalStorage</strong> - Persists theme to localStorage</li>
          <li><strong>useWindowSize</strong> - Tracks window dimensions</li>
          <li><strong>useDebounce</strong> - Debounces search input</li>
          <li><strong>useToggle</strong> - Manages boolean states</li>
          <li><strong>useTheme</strong> - Composes useLocalStorage for theme management</li>
        </ol>

        <p style={{ marginTop: '15px', fontSize: '14px', opacity: 0.9 }}>
          Notice how <code>useTheme</code> builds on top of <code>useLocalStorage</code>.
          This composition is one of the most powerful features of custom hooks!
        </p>
      </div>
    </div>
  );
}
