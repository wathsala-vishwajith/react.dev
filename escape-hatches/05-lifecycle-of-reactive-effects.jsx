/**
 * =============================================================================
 * ESCAPE HATCH #5: LIFECYCLE OF REACTIVE EFFECTS
 * =============================================================================
 *
 * Welcome back, junior dev! 🔄 Let's dive deep into how effects actually work.
 *
 * WHAT IS A "REACTIVE VALUE"?
 * ---------------------------
 * A reactive value is anything that can change over time:
 * - Props
 * - State
 * - Variables derived from props or state
 *
 * WHY "LIFECYCLE"?
 * ----------------
 * Effects don't think in terms of "mount/update/unmount" like class components.
 * Instead, they think in terms of "synchronization":
 * - Start synchronizing (setup)
 * - Stop synchronizing (cleanup)
 * - Re-synchronize when dependencies change (cleanup + setup)
 *
 * THE GOLDEN RULE:
 * ----------------
 * If your effect reads a reactive value, it MUST be in the dependencies!
 * The React ESLint plugin will help you get this right.
 *
 * =============================================================================
 */

import { useEffect, useState, useRef } from 'react';

/**
 * EXAMPLE 1: Understanding Effect Lifecycle
 * ------------------------------------------
 * Let's visualize exactly when setup and cleanup run.
 *
 * KEY LEARNING POINTS:
 * - Setup runs after render
 * - Cleanup runs before re-running setup
 * - Cleanup also runs on unmount
 */
function EffectLifecycleVisualization() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  useEffect(() => {
    // SETUP runs after render
    addLog(`🚀 Effect SETUP (count is ${count})`, 'setup');

    // CLEANUP runs before next setup or unmount
    return () => {
      addLog(`🧹 Effect CLEANUP (count was ${count})`, 'cleanup');
    };
  }, [count]); // Re-run when count changes

  const handleIncrement = () => {
    setCount(c => c + 1);
  };

  const handleReset = () => {
    setLogs([]);
    setCount(0);
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🔄 Effect Lifecycle Visualization</h3>

      <div style={{ marginBottom: '20px', fontSize: '24px' }}>
        Count: <strong>{count}</strong>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={handleIncrement} style={{ padding: '10px 20px' }}>
          Increment (Triggers Effect)
        </button>
        <button onClick={handleReset} style={{ padding: '10px 20px' }}>
          Reset Logs
        </button>
      </div>

      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        <strong>📜 Effect Lifecycle Log:</strong>
        {logs.length === 0 ? (
          <div style={{ color: '#666', marginTop: '10px' }}>Click increment to see the lifecycle...</div>
        ) : (
          <div style={{ marginTop: '10px' }}>
            {logs.map((log, index) => (
              <div
                key={index}
                style={{
                  padding: '8px',
                  marginBottom: '5px',
                  background: log.type === 'setup' ? '#d4edda' : '#fff3cd',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${log.type === 'setup' ? '#28a745' : '#ffc107'}`
                }}
              >
                [{log.timestamp}] {log.message}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 Notice the pattern:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>First increment: SETUP runs</li>
          <li>Second increment: CLEANUP runs (for old count) → then SETUP runs (for new count)</li>
          <li>This pattern repeats for each change</li>
        </ol>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 2: Reactive Dependencies
 * ---------------------------------
 * Let's see how different reactive values affect effect re-runs.
 *
 * KEY LEARNING POINTS:
 * - Multiple dependencies: effect re-runs if ANY change
 * - Objects/arrays create new references each render
 * - Primitive values are compared by value
 */
function ReactiveDependenciesDemo() {
  const [name, setName] = useState('Alice');
  const [age, setAge] = useState(25);
  const [city, setCity] = useState('NYC');
  const effectRunCount = useRef(0);

  // Effect depends on name and age, but NOT city
  useEffect(() => {
    effectRunCount.current += 1;
    console.log(`👤 Effect ran (${effectRunCount.current} times)`);
    console.log(`   Name: ${name}, Age: ${age}`);
    console.log(`   City: ${city} (not in dependencies, so changes don't trigger effect)`);
  }, [name, age]); // Only re-run when name or age changes

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎯 Reactive Dependencies Demo</h3>

      <div style={{
        background: '#fff3cd',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        Effect has run {effectRunCount.current} times
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Name (in dependencies):
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '2px solid #28a745' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Age (in dependencies):
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '2px solid #28a745' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            City (NOT in dependencies):
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '2px solid #dc3545' }}
          />
        </div>
      </div>

      <div style={{
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>🧪 Try this:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Change the name → Effect re-runs ✅</li>
          <li>Change the age → Effect re-runs ✅</li>
          <li>Change the city → Effect does NOT re-run ❌</li>
        </ol>
        <p style={{ margin: '10px 0' }}>
          💡 Only values in the dependency array trigger re-runs!
        </p>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 3: Object Dependencies - The Gotcha!
 * ---------------------------------------------
 * Objects and arrays are tricky because they create new references each render.
 *
 * KEY LEARNING POINTS:
 * - Objects/arrays create new references each render
 * - This causes effects to re-run unnecessarily
 * - Solution: destructure or use specific properties as dependencies
 */
function ObjectDependenciesWrong() {
  const [firstName, setFirstName] = useState('Alice');
  const [lastName, setLastName] = useState('Smith');
  const effectRunCount = useRef(0);

  // ❌ PROBLEM: This object is created fresh each render!
  const user = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`
  };

  // ❌ This effect re-runs on EVERY render because 'user' is always a new object
  useEffect(() => {
    effectRunCount.current += 1;
    console.log(`❌ Effect ran ${effectRunCount.current} times`);
    console.log('   User:', user.fullName);
  }, [user]); // ❌ 'user' is a new object every render!

  return (
    <div style={{ padding: '20px', border: '3px solid #dc3545', borderRadius: '8px', background: '#fff5f5' }}>
      <h3>❌ WRONG: Object as Dependency</h3>

      <div style={{
        background: '#f8d7da',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        Effect has run {effectRunCount.current} times (Too many! 🔥)
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        />
      </div>

      <div style={{
        padding: '15px',
        background: '#f8d7da',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        ⚠️ The 'user' object is recreated on every render, so the effect runs every time!
      </div>
    </div>
  );
}

function ObjectDependenciesRight() {
  const [firstName, setFirstName] = useState('Alice');
  const [lastName, setLastName] = useState('Smith');
  const effectRunCount = useRef(0);

  const user = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`
  };

  // ✅ SOLUTION: Depend on specific primitive values, not the whole object
  useEffect(() => {
    effectRunCount.current += 1;
    console.log(`✅ Effect ran ${effectRunCount.current} times`);
    console.log('   Name:', `${firstName} ${lastName}`);
  }, [firstName, lastName]); // ✅ Primitive values, not object!

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ RIGHT: Primitive Dependencies</h3>

      <div style={{
        background: '#d4edda',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        Effect has run {effectRunCount.current} times (Optimal! ✨)
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        />
      </div>

      <div style={{
        padding: '15px',
        background: '#d4edda',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        ✅ Depending on firstName and lastName (primitives) instead of the user object!
      </div>
    </div>
  );
}

/**
 * EXAMPLE 4: Chat Room with Changing Server URL
 * ----------------------------------------------
 * A realistic example showing how effects resynchronize.
 *
 * KEY LEARNING POINTS:
 * - Effect should include ALL reactive values it uses
 * - When dependencies change, cleanup runs then setup runs
 * - This creates a "resynchronization" pattern
 */
function ChatRoomWithServer() {
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionLog, setConnectionLog] = useState([]);

  const addToLog = (message) => {
    setConnectionLog(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`
    ]);
  };

  useEffect(() => {
    // SETUP: Connect to chat room
    addToLog(`🔌 Connecting to "${roomId}" on ${serverUrl}...`);

    const connection = {
      connect() {
        setTimeout(() => {
          setIsConnected(true);
          addToLog(`✅ Connected to "${roomId}"!`);
        }, 500);
      },
      disconnect() {
        setIsConnected(false);
        addToLog(`👋 Disconnected from "${roomId}"`);
      }
    };

    connection.connect();

    // CLEANUP: Disconnect when roomId or serverUrl changes
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // ✅ Both reactive values in dependencies!

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>💬 Chat Room with Server Configuration</h3>

      <div style={{
        padding: '12px',
        background: isConnected ? '#d4edda' : '#f8d7da',
        borderRadius: '5px',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Server URL:
        </label>
        <select
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #333' }}
        >
          <option value="https://localhost:1234">🏠 Localhost (1234)</option>
          <option value="https://production.com">🌐 Production</option>
          <option value="https://staging.com">🧪 Staging</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Room:
        </label>
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #333' }}
        >
          <option value="general">🌐 #general</option>
          <option value="react">⚛️ #react</option>
          <option value="javascript">💛 #javascript</option>
        </select>
      </div>

      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        maxHeight: '250px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '13px'
      }}>
        <strong>📜 Connection Log:</strong>
        <div style={{ marginTop: '10px' }}>
          {connectionLog.map((log, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 Watch what happens:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Change the room → disconnect from old room, connect to new room</li>
          <li>Change the server → disconnect, reconnect to new server</li>
          <li>Both trigger cleanup + setup because they're dependencies!</li>
        </ol>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 5: Missing Dependency Bug
 * ----------------------------------
 * A cautionary tale about what happens when you ignore the linter.
 *
 * KEY LEARNING POINTS:
 * - Missing dependencies cause stale closures
 * - Always listen to the ESLint warnings!
 * - The linter is there to help you
 */
function MissingDependencyDemo() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);

  // ❌ BUG: 'multiplier' is used but not in dependencies!
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`Count: ${count}, Multiplier: ${multiplier}, Result: ${count * multiplier}`);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]); // ❌ Missing 'multiplier'! The interval will use stale value!

  return (
    <div style={{ padding: '20px', border: '3px solid #ffc107', borderRadius: '8px', background: '#fffaf0' }}>
      <h3>⚠️ Missing Dependency Demo</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>
          Count: <strong>{count}</strong>
        </div>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>
          Multiplier: <strong>{multiplier}</strong>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
          Result: {count * multiplier}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setCount(c => c + 1)} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Increment Count
        </button>
        <button onClick={() => setMultiplier(m => m + 1)} style={{ padding: '10px 20px' }}>
          Increment Multiplier
        </button>
      </div>

      <div style={{
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>🐛 Bug Alert!</strong>
        <p style={{ margin: '10px 0' }}>
          This effect logs every second, but the multiplier in the console will be STALE!
          Open your console and increment the multiplier - the logged value won't update.
        </p>
        <p style={{ margin: '10px 0', fontWeight: 'bold', color: '#dc3545' }}>
          Always include ALL reactive values in dependencies!
        </p>
      </div>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 */
export default function LifecycleOfReactiveEffects() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔄 Escape Hatch #5: Lifecycle of Reactive Effects</h1>

      <div style={{
        background: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>📚 Quick Reference</h2>
        <p><strong>Reactive values:</strong> Props, state, and anything derived from them</p>
        <p><strong>Dependency rule:</strong> Every reactive value used in the effect MUST be in dependencies</p>
        <p><strong>Effect lifecycle:</strong> Setup → (state change) → Cleanup → Setup → ...</p>
        <p><strong>Trust the linter:</strong> react-hooks/exhaustive-deps will save you from bugs!</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <EffectLifecycleVisualization />
        <ReactiveDependenciesDemo />

        <h2 style={{ marginTop: '20px' }}>Object Dependencies Problem</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <ObjectDependenciesWrong />
          <ObjectDependenciesRight />
        </div>

        <ChatRoomWithServer />
        <MissingDependencyDemo />
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2>🎓 Key Takeaways</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Effects don't "mount/update/unmount"</strong> - they "start/stop synchronizing"</li>
          <li><strong>Dependencies control when effects re-run</strong> - include ALL reactive values</li>
          <li><strong>Objects/arrays as dependencies</strong> - use specific properties instead</li>
          <li><strong>Cleanup runs before re-setup</strong> - this prevents stale connections</li>
          <li><strong>Trust the ESLint linter!</strong> - It catches dependency bugs</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#fff3cd',
        borderRadius: '8px'
      }}>
        <h3>⚠️ Common Mistakes</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>DON'T</strong> ignore ESLint warnings about dependencies</li>
          <li><strong>DON'T</strong> use objects/arrays as dependencies (use their properties)</li>
          <li><strong>DON'T</strong> forget cleanup for subscriptions and listeners</li>
          <li><strong>DO</strong> include all reactive values in dependencies</li>
          <li><strong>DO</strong> think of effects as synchronization, not lifecycle</li>
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
 * Practice understanding effect lifecycle:
 *
 * 1. Dependency Experiment: Create an effect with 3 dependencies (a, b, c).
 *    Try changing each one and observe when the effect re-runs.
 *
 * 2. Object Dependency Fix: Find any effects in your code that depend on objects.
 *    Refactor to depend on specific properties instead.
 *
 * 3. Cleanup Challenge: Build a component that subscribes to window resize events.
 *    Make sure to properly clean up the listener!
 *
 * 4. Stale Closure Bug: Intentionally create a stale closure bug by omitting
 *    a dependency, then fix it and observe the difference.
 *
 * Remember: Every reactive value used in an effect must be in its dependencies! 🎯
 * =============================================================================
 */
