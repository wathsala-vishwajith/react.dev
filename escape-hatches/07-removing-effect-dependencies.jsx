/**
 * =============================================================================
 * ESCAPE HATCH #7: REMOVING EFFECT DEPENDENCIES
 * =============================================================================
 *
 * Hey junior dev! 🧹 Let's learn how to optimize effects by removing
 * unnecessary dependencies.
 *
 * WHY REMOVE DEPENDENCIES?
 * ------------------------
 * - Fewer dependencies = effect runs less often = better performance
 * - Cleaner code that's easier to understand
 * - Avoid infinite loops and unnecessary re-synchronization
 *
 * IMPORTANT RULE:
 * ---------------
 * ⚠️ You should NEVER lie about dependencies!
 * ❌ Don't remove dependencies that the effect actually uses!
 * ✅ DO restructure code so the effect doesn't need them!
 *
 * TECHNIQUES TO REMOVE DEPENDENCIES:
 * -----------------------------------
 * 1. Move code outside the effect (if it doesn't need reactive values)
 * 2. Move code inside event handlers (if it responds to user actions)
 * 3. Use functional updates for setState
 * 4. Use refs for non-reactive values
 * 5. Extract static logic outside component
 * 6. Use useCallback/useMemo for functions/objects
 *
 * =============================================================================
 */

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';

/**
 * TECHNIQUE #1: Use Functional Updates for setState
 * --------------------------------------------------
 * ❌ WRONG: Depending on state to update state
 * ✅ RIGHT: Use functional update to remove dependency
 */
function FunctionalUpdateExample() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // ❌ WRONG: count is in dependencies
  // This works, but unnecessarily re-creates the interval every time count changes
  /*
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCount(count + 1); // ❌ Using count directly
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, count]); // ❌ count dependency causes unnecessary re-runs!
  */

  // ✅ RIGHT: Use functional update
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCount(c => c + 1); // ✅ Functional update - no need to depend on count!
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]); // ✅ Only depends on isRunning!

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ Technique #1: Functional Updates</h3>

      <div style={{ marginBottom: '20px', fontSize: '32px', fontWeight: 'bold', textAlign: 'center' }}>
        {count}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: isRunning ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button
          onClick={() => setCount(0)}
          style={{ padding: '12px 24px', fontSize: '16px' }}
        >
          🔄 Reset
        </button>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#d4edda',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>✅ Why this works:</strong>
        <p style={{ margin: '10px 0' }}>
          Using <code>setCount(c =&gt; c + 1)</code> instead of <code>setCount(count + 1)</code>
          means we don't need 'count' in the dependencies!
        </p>
        <p style={{ margin: '10px 0' }}>
          The interval only re-creates when isRunning changes, not every second.
        </p>
      </div>
    </div>
  );
}

/**
 * TECHNIQUE #2: Move Code Outside the Effect
 * -------------------------------------------
 * If code doesn't use reactive values, move it outside!
 */

// ✅ Move static logic outside component entirely
function createGreeting(name, timeOfDay) {
  return `Good ${timeOfDay}, ${name}!`;
}

function MoveCodeOutsideExample() {
  const [name, setName] = useState('Alice');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Get current time of day
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    // ✅ Use the external function - keeps effect clean
    const greetingText = createGreeting(name, timeOfDay);
    setGreeting(greetingText);
  }, [name]); // Only depends on name

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ Technique #2: Move Code Outside</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Your Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #333' }}
        />
      </div>

      <div style={{
        padding: '20px',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        {greeting}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#d4edda',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>✅ Benefits:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>createGreeting is outside component - doesn't recreate on every render</li>
          <li>Can be tested independently</li>
          <li>Can be reused in other components</li>
          <li>Effect remains simple and focused</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * TECHNIQUE #3: Use Refs for Values That Don't Trigger Re-sync
 * ------------------------------------------------------------
 * If changing a value shouldn't re-run the effect, use a ref!
 */
function UseRefForConfigExample() {
  const [isConnected, setIsConnected] = useState(false);
  const [serverUrl, setServerUrl] = useState('https://api.example.com');
  const [logLevel, setLogLevel] = useState('info');
  const [logs, setLogs] = useState([]);

  // ✅ Store config that shouldn't trigger reconnection in a ref
  const logLevelRef = useRef(logLevel);
  useEffect(() => {
    logLevelRef.current = logLevel;
  }, [logLevel]);

  const addLog = (message) => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message
    }]);
  };

  // Effect only depends on isConnected and serverUrl
  // logLevel changes don't cause reconnection!
  useEffect(() => {
    if (!isConnected) return;

    addLog(`🔌 Connecting to ${serverUrl}...`);

    const connection = {
      connect() {
        setTimeout(() => {
          // ✅ Use ref to get current log level without depending on it
          const level = logLevelRef.current;
          addLog(`✅ Connected! (log level: ${level})`);
        }, 500);
      },
      disconnect() {
        addLog('👋 Disconnected');
      }
    };

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [isConnected, serverUrl]); // ✅ logLevel NOT in dependencies!

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ Technique #3: Use Refs for Config</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={isConnected}
              onChange={(e) => setIsConnected(e.target.checked)}
            />
            <strong>Connected (triggers reconnection)</strong>
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Server URL (triggers reconnection):
          </label>
          <select
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #2196f3' }}
          >
            <option value="https://api.example.com">Production</option>
            <option value="https://staging.example.com">Staging</option>
            <option value="https://localhost:3000">Local</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Log Level (doesn't trigger reconnection):
          </label>
          <select
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #666' }}
          >
            <option value="debug">🐛 Debug</option>
            <option value="info">ℹ️ Info</option>
            <option value="warn">⚠️ Warn</option>
            <option value="error">❌ Error</option>
          </select>
        </div>
      </div>

      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        maxHeight: '150px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '13px'
      }}>
        <strong>📜 Connection Log:</strong>
        {logs.map((log, index) => (
          <div key={index} style={{ marginTop: '5px' }}>
            [{log.time}] {log.message}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#d4edda',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>✅ Notice:</strong> Changing log level doesn't cause reconnection!
        The ref gives us the latest value without making the effect reactive to it.
      </div>
    </div>
  );
}

/**
 * TECHNIQUE #4: Use useCallback for Function Dependencies
 * --------------------------------------------------------
 * Functions recreate on every render, causing unnecessary effect runs.
 */
function UseCallbackExample() {
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry']);
  const [filterText, setFilterText] = useState('');
  const [effectRunCount, setEffectRunCount] = useState(0);

  // ❌ WRONG: This function recreates every render
  // const filterItems = (items, filter) => {
  //   return items.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
  // };

  // ✅ RIGHT: Wrap in useCallback to keep same reference
  const filterItems = useCallback((items, filter) => {
    console.log('🔍 Filtering items...');
    return items.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
  }, []); // Empty deps - function logic doesn't use reactive values

  // Effect that uses the function
  useEffect(() => {
    setEffectRunCount(c => c + 1);
    console.log('⚡ Effect ran because filterItems changed');

    // Simulate using the function for some external sync
    const filtered = filterItems(items, filterText);
    console.log('Filtered items:', filtered);
  }, [filterItems, items, filterText]);

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ Technique #4: useCallback for Functions</h3>

      <div style={{
        background: '#fff3cd',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>
        Effect has run {effectRunCount} times
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Filter:
        </label>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Type to filter..."
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>

      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px'
      }}>
        <strong>Items:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          {filterItems(items, filterText).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#d4edda',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>✅ useCallback prevents:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Function recreating on every render</li>
          <li>Effect re-running unnecessarily</li>
          <li>Performance issues in large apps</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * TECHNIQUE #5: Use useMemo for Object/Array Dependencies
 * --------------------------------------------------------
 * Objects and arrays recreate every render. Use useMemo to keep same reference.
 */
function UseMemoExample() {
  const [firstName, setFirstName] = useState('Alice');
  const [lastName, setLastName] = useState('Smith');
  const [age, setAge] = useState(25);
  const [effectRunCount, setEffectRunCount] = useState(0);

  // ❌ WRONG: Object recreates every render
  // const user = {
  //   name: `${firstName} ${lastName}`,
  //   age
  // };

  // ✅ RIGHT: Memoize the object
  const user = useMemo(() => ({
    name: `${firstName} ${lastName}`,
    age
  }), [firstName, lastName, age]);

  // Effect that depends on user object
  useEffect(() => {
    setEffectRunCount(c => c + 1);
    console.log('👤 User changed:', user);

    // Simulate syncing user profile to server
    console.log('Syncing to server...');
  }, [user]); // ✅ Won't cause infinite loop because user is memoized

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ Technique #5: useMemo for Objects</h3>

      <div style={{
        background: '#fff3cd',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>
        Effect has run {effectRunCount} times
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>
      </div>

      <div style={{
        background: '#e3f2fd',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '18px'
      }}>
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Age:</strong> {user.age}</div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#d4edda',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>✅ useMemo ensures:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Same object reference if dependencies haven't changed</li>
          <li>Effect only runs when actual values change</li>
          <li>No infinite loops!</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * ANTI-PATTERN: The Infinite Loop
 * --------------------------------
 * What happens when you get dependencies wrong.
 */
function InfiniteLoopWarning() {
  const [count, setCount] = useState(0);

  // ⚠️ This would create an infinite loop - DON'T DO THIS!
  // useEffect(() => {
  //   setCount(count + 1); // Sets count...
  // }, [count]); // ...which triggers the effect again... forever!

  return (
    <div style={{ padding: '20px', border: '3px solid #dc3545', borderRadius: '8px', background: '#fff5f5' }}>
      <h3>⚠️ Warning: Infinite Loop Example</h3>

      <div style={{
        background: '#f8d7da',
        padding: '20px',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <strong style={{ fontSize: '18px', color: '#dc3545' }}>
          ⛔ DANGEROUS CODE (Commented Out):
        </strong>
        <pre style={{
          background: '#fff',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '15px',
          overflow: 'auto'
        }}>{`// ❌ INFINITE LOOP - Don't do this!
useEffect(() => {
  setCount(count + 1);
}, [count]);

// Why it's infinite:
// 1. Effect runs, updates count
// 2. Count changes, effect runs again
// 3. Effect updates count again
// 4. Repeat forever! 🔥`}</pre>
      </div>

      <div style={{
        background: '#d4edda',
        padding: '20px',
        borderRadius: '5px'
      }}>
        <strong style={{ fontSize: '18px', color: '#28a745' }}>
          ✅ CORRECT VERSION:
        </strong>
        <pre style={{
          background: '#fff',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '15px',
          overflow: 'auto'
        }}>{`// ✅ Use functional update
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []); // Empty dependencies!`}</pre>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '5px'
      }}>
        <strong>🎓 Lesson:</strong> If your effect updates state that it depends on,
        you're probably doing it wrong! Use functional updates instead.
      </div>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 */
export default function RemovingEffectDependencies() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧹 Escape Hatch #7: Removing Effect Dependencies</h1>

      <div style={{
        background: '#fff3cd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '3px solid #ffc107'
      }}>
        <h2>⚠️ Golden Rule</h2>
        <p style={{ fontSize: '18px', margin: '10px 0', fontWeight: 'bold' }}>
          NEVER lie about dependencies!
        </p>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          Don't remove dependencies the effect actually uses.
          Instead, restructure your code so it doesn't need them!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <FunctionalUpdateExample />
        <MoveCodeOutsideExample />
        <UseRefForConfigExample />
        <UseCallbackExample />
        <UseMemoExample />
        <InfiniteLoopWarning />
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2>🎓 Key Takeaways</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Technique #1:</strong> Use functional updates (setCount(c =&gt; c + 1))</li>
          <li><strong>Technique #2:</strong> Move static code outside component/effect</li>
          <li><strong>Technique #3:</strong> Use refs for non-reactive values</li>
          <li><strong>Technique #4:</strong> Wrap functions with useCallback</li>
          <li><strong>Technique #5:</strong> Wrap objects/arrays with useMemo</li>
          <li><strong>Remember:</strong> Never lie about dependencies - restructure instead!</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#e3f2fd',
        borderRadius: '8px'
      }}>
        <h3>📋 Dependency Checklist</h3>
        <div style={{ lineHeight: '2' }}>
          <div>❓ <strong>Does the effect update state it depends on?</strong></div>
          <div style={{ paddingLeft: '20px' }}>→ Use functional update (setState(prev =&gt; ...))</div>
          <br />
          <div>❓ <strong>Is some code static (no reactive values)?</strong></div>
          <div style={{ paddingLeft: '20px' }}>→ Move it outside the component</div>
          <br />
          <div>❓ <strong>Does a value not need to trigger re-sync?</strong></div>
          <div style={{ paddingLeft: '20px' }}>→ Use a ref instead</div>
          <br />
          <div>❓ <strong>Is a function recreating every render?</strong></div>
          <div style={{ paddingLeft: '20px' }}>→ Wrap with useCallback</div>
          <br />
          <div>❓ <strong>Is an object/array recreating every render?</strong></div>
          <div style={{ paddingLeft: '20px' }}>→ Wrap with useMemo or depend on primitives</div>
        </div>
      </div>
    </div>
  );
}

/**
 * =============================================================================
 * HOMEWORK FOR JUNIOR DEVS 📝
 * =============================================================================
 *
 * Practice removing dependencies:
 *
 * 1. Find effects with setState that depends on that state
 *    → Convert to functional updates
 *
 * 2. Find functions defined inside components used in effects
 *    → Move outside component or wrap with useCallback
 *
 * 3. Find object/array literals in dependency arrays
 *    → Use useMemo or depend on primitives instead
 *
 * 4. Challenge: Build a timer that:
 *    - Counts up every second
 *    - Has configurable speed (1x, 2x, 5x)
 *    - Speed changes don't reset the timer
 *    - Use refs and functional updates!
 *
 * Remember: Fewer dependencies = simpler, more performant code! 🚀
 * =============================================================================
 */
