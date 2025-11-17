/**
 * =============================================================================
 * ESCAPE HATCH #3: SYNCHRONIZING WITH EFFECTS
 * =============================================================================
 *
 * Hey junior dev! 👋 Ready to learn about useEffect? This is one of React's
 * most powerful (and most misunderstood) hooks!
 *
 * WHAT IS useEffect?
 * ------------------
 * Effects let you run code AFTER rendering to synchronize your component
 * with systems outside of React (APIs, browser APIs, third-party libraries).
 *
 * WHY "SYNCHRONIZING"?
 * --------------------
 * Effects keep your component in sync with external systems:
 * - Fetching data from an API
 * - Subscribing to events (websockets, DOM events)
 * - Starting/stopping timers
 * - Logging analytics
 * - Updating the browser title
 *
 * THE ANATOMY OF useEffect:
 * -------------------------
 * useEffect(() => {
 *   // 1. Setup code runs after render
 *   const subscription = subscribe();
 *
 *   return () => {
 *     // 2. Cleanup runs before re-running effect or unmounting
 *     subscription.unsubscribe();
 *   };
 * }, [dependencies]); // 3. Re-run when dependencies change
 *
 * =============================================================================
 */

import { useEffect, useState, useRef } from 'react';

/**
 * EXAMPLE 1: Basic Effect - No Dependencies
 * ------------------------------------------
 * An effect with NO dependency array runs after EVERY render.
 *
 * KEY LEARNING POINTS:
 * - Effect runs after the component renders
 * - Without dependencies [], it runs after EVERY render
 * - This is usually NOT what you want!
 */
function BasicEffectExample() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  // This runs after EVERY render (no dependency array)
  useEffect(() => {
    renderCount.current += 1;
    console.log(`🔄 Effect ran! Render #${renderCount.current}`);
  });

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎯 Basic Effect (No Dependencies)</h3>

      <div style={{ marginBottom: '20px', fontSize: '18px' }}>
        <div>Button clicks: <strong>{count}</strong></div>
        <div>Component renders: <strong>{renderCount.current}</strong></div>
      </div>

      <button onClick={() => setCount(c => c + 1)} style={{ padding: '10px 20px' }}>
        Click Me (Triggers Re-render)
      </button>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '5px'
      }}>
        ⚠️ <strong>Notice:</strong> The effect runs after every render!
        Check your console to see it running repeatedly.
        <br /><br />
        💡 <strong>Usually you want to add a dependency array!</strong>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 2: Effect with Empty Dependencies - Runs Once
 * ------------------------------------------------------
 * An effect with [] runs ONLY ONCE after the first render.
 *
 * KEY LEARNING POINTS:
 * - Empty dependency array [] = run once on mount
 * - Perfect for initialization code
 * - Common for fetching data, setting up subscriptions
 */
function RunOnceEffect() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // This runs ONLY ONCE after the first render
  useEffect(() => {
    console.log('🚀 Effect running! (only once)');

    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      console.log('📡 Fetching data...');

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const fakeData = {
        title: 'React Development',
        description: 'Learn React hooks and effects',
        timestamp: new Date().toISOString()
      };

      setData(fakeData);
      setLoading(false);
      console.log('✅ Data loaded!', fakeData);
    };

    fetchData();

    // Cleanup function (runs when component unmounts)
    return () => {
      console.log('🧹 Component unmounting - cleanup!');
    };
  }, []); // 👈 Empty array = run once!

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎯 Run Once Effect (Empty Dependencies [])</h3>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>
          ⏳ Loading data...
        </div>
      ) : data ? (
        <div style={{
          background: '#e3f2fd',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h4>{data.title}</h4>
          <p>{data.description}</p>
          <small style={{ color: '#666' }}>Loaded at: {new Date(data.timestamp).toLocaleTimeString()}</small>
        </div>
      ) : null}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#d4edda',
        borderRadius: '5px'
      }}>
        ✅ <strong>This effect runs only once!</strong>
        <br />
        💡 Perfect for initial data fetching or setup that should happen once.
      </div>
    </div>
  );
}

/**
 * EXAMPLE 3: Effect with Dependencies - Runs When Dependencies Change
 * --------------------------------------------------------------------
 * An effect with [dep1, dep2] runs when those dependencies change.
 *
 * KEY LEARNING POINTS:
 * - Effect re-runs when ANY dependency changes
 * - This is the most common pattern
 * - Make sure to include ALL values used inside the effect
 */
function DependencyEffect() {
  const [query, setQuery] = useState('react');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // This runs whenever 'query' changes
  useEffect(() => {
    console.log('🔍 Searching for:', query);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Simulate search API call
    const searchTimeout = setTimeout(() => {
      const fakeResults = [
        `${query} - Official Documentation`,
        `${query} - Tutorial for Beginners`,
        `${query} - Advanced Patterns`,
        `${query} - Best Practices`,
        `Learn ${query} in 2024`
      ];

      setResults(fakeResults);
      setLoading(false);
      console.log('✅ Search complete!');
    }, 800);

    // Cleanup: cancel the search if query changes before it completes
    return () => {
      console.log('🧹 Cleaning up previous search');
      clearTimeout(searchTimeout);
    };
  }, [query]); // 👈 Re-run when 'query' changes!

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🔍 Dependency Effect (Runs When [query] Changes)</h3>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for something..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #333',
            borderRadius: '5px'
          }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#666' }}>
          ⏳ Searching...
        </div>
      ) : (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {results.map((result, index) => (
            <li
              key={index}
              style={{
                padding: '12px',
                background: '#f5f5f5',
                marginBottom: '8px',
                borderRadius: '5px',
                borderLeft: '4px solid #667eea'
              }}
            >
              {result}
            </li>
          ))}
        </ul>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px'
      }}>
        💡 <strong>This effect re-runs every time you change the search query!</strong>
        <br />
        Check the console to see it running and cleaning up.
      </div>
    </div>
  );
}

/**
 * EXAMPLE 4: Cleanup Function - Preventing Memory Leaks
 * ------------------------------------------------------
 * Cleanup functions are CRITICAL for preventing memory leaks!
 *
 * KEY LEARNING POINTS:
 * - Return a cleanup function to unsubscribe/cancel/cleanup
 * - Cleanup runs BEFORE the effect re-runs
 * - Cleanup also runs when component unmounts
 * - Always cleanup: timers, subscriptions, event listeners
 */
function CleanupExample() {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (!isActive) return;

    addLog('🎯 Effect started - adding mouse listener');

    // Event handler
    function handleMouseMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // CLEANUP FUNCTION - super important!
    return () => {
      addLog('🧹 Cleanup - removing mouse listener');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isActive]); // Re-run when isActive changes

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🧹 Cleanup Function Example</h3>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setIsActive(!isActive)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: isActive ? '#f8d7da' : '#d4edda',
            border: '2px solid #333',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isActive ? '🛑 Stop Tracking' : '▶️ Start Tracking'} Mouse
        </button>
      </div>

      {isActive && (
        <div style={{
          padding: '20px',
          background: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '18px',
          fontFamily: 'monospace'
        }}>
          🖱️ Mouse Position: X: {position.x}, Y: {position.y}
          <br />
          <small style={{ fontSize: '14px', color: '#666' }}>
            Move your mouse to see the position update!
          </small>
        </div>
      )}

      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        <strong>📜 Event Log:</strong>
        {logs.length === 0 ? (
          <div style={{ color: '#666', marginTop: '10px' }}>
            Click the button to start tracking...
          </div>
        ) : (
          <ul style={{ margin: '10px 0', padding: '0 0 0 20px', fontSize: '14px' }}>
            {logs.map((log, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{log}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '5px'
      }}>
        ⚠️ <strong>Without cleanup, event listeners would stack up!</strong>
        <br />
        💡 Always cleanup: event listeners, timers, subscriptions, connections.
      </div>
    </div>
  );
}

/**
 * EXAMPLE 5: Connecting to External Systems - Chat Room
 * ------------------------------------------------------
 * This demonstrates the primary use case for effects: syncing with external systems.
 *
 * KEY LEARNING POINTS:
 * - Effects are for connecting to things outside React
 * - Connect in the effect, disconnect in cleanup
 * - This pattern works for: WebSockets, APIs, third-party libraries
 */
function ChatRoomExample() {
  const [roomId, setRoomId] = useState('general');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log(`🔌 Connecting to room: ${roomId}`);

    // Simulate connecting to a chat server
    const connection = {
      connect() {
        console.log(`✅ Connected to ${roomId}!`);
        setIsConnected(true);
        setMessages([`📢 Welcome to #${roomId}!`]);
      },
      disconnect() {
        console.log(`👋 Disconnected from ${roomId}`);
        setIsConnected(false);
      },
      sendMessage(text) {
        const newMessage = `You: ${text}`;
        setMessages(msgs => [...msgs, newMessage]);

        // Simulate receiving a response
        setTimeout(() => {
          setMessages(msgs => [...msgs, `Bot: Echo - ${text}`]);
        }, 1000);
      }
    };

    // Connect
    connection.connect();

    // Cleanup: disconnect when component unmounts or roomId changes
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // 👈 Reconnect when room changes!

  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (!messageInput.trim()) return;

    // In a real app, this would send through the connection
    setMessages(msgs => [...msgs, `You: ${messageInput}`]);
    setTimeout(() => {
      setMessages(msgs => [...msgs, `Bot: Echo - ${messageInput}`]);
    }, 1000);

    setMessageInput('');
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>💬 Chat Room Connection Example</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Select Room:
        </label>
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #333',
            borderRadius: '5px',
            width: '100%'
          }}
        >
          <option value="general">🌐 #general</option>
          <option value="react">⚛️ #react</option>
          <option value="javascript">💛 #javascript</option>
          <option value="random">🎲 #random</option>
        </select>
      </div>

      <div style={{
        padding: '10px',
        background: isConnected ? '#d4edda' : '#f8d7da',
        borderRadius: '5px',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        minHeight: '200px',
        maxHeight: '200px',
        overflowY: 'auto',
        marginBottom: '15px',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            {msg}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #333',
            borderRadius: '5px'
          }}
          disabled={!isConnected}
        />
        <button
          onClick={handleSend}
          disabled={!isConnected}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: isConnected ? 'pointer' : 'not-allowed'
          }}
        >
          Send
        </button>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px'
      }}>
        💡 <strong>When you change rooms:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Cleanup runs → disconnect from old room</li>
          <li>Effect runs → connect to new room</li>
        </ol>
        This is perfect for managing connections!
      </div>
    </div>
  );
}

/**
 * EXAMPLE 6: Document Title Synchronization
 * ------------------------------------------
 * A simple but practical example: keeping the browser title in sync with state.
 *
 * KEY LEARNING POINTS:
 * - Effects can sync with browser APIs
 * - No cleanup needed if there's nothing to clean up
 * - Perfect for side effects that don't need cleanup
 */
function DocumentTitleExample() {
  const [count, setCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Sync document title with count
  useEffect(() => {
    document.title = `Count: ${count}`;
    console.log(`📄 Updated document title to: Count: ${count}`);

    // No cleanup needed - just updating a value
  }, [count]);

  // Flash notification effect
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleIncrement = () => {
    setCount(c => c + 1);
    setShowNotification(true);
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>📄 Document Title Synchronization</h3>

      <div style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        Count: {count}
      </div>

      <button onClick={handleIncrement} style={{ padding: '12px 24px', fontSize: '16px' }}>
        Increment Counter
      </button>

      {showNotification && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#d4edda',
          border: '2px solid #28a745',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          ✅ Counter updated!
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px'
      }}>
        💡 <strong>Look at your browser tab!</strong>
        <br />
        The title updates to show the current count.
        This is a simple but practical use of effects!
      </div>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 * ------------------
 * Combines all examples to demonstrate different useEffect patterns
 */
export default function SynchronizingWithEffects() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>⚡ Escape Hatch #3: Synchronizing with Effects</h1>

      <div style={{
        background: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>📚 Quick Reference</h2>
        <p><strong>Basic syntax:</strong></p>
        <pre style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          overflow: 'auto'
        }}>{`useEffect(() => {
  // Setup code
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);`}</pre>
        <p><strong>Three patterns:</strong></p>
        <ul>
          <li><code>useEffect(fn)</code> - runs after every render</li>
          <li><code>useEffect(fn, [])</code> - runs once on mount</li>
          <li><code>useEffect(fn, [dep1, dep2])</code> - runs when dependencies change</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <BasicEffectExample />
        <RunOnceEffect />
        <DependencyEffect />
        <CleanupExample />
        <ChatRoomExample />
        <DocumentTitleExample />
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2>🎓 Key Takeaways</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Effects run AFTER rendering</strong> - they don't block the browser</li>
          <li><strong>Use effects to synchronize with external systems</strong> (APIs, browser APIs, third-party code)</li>
          <li><strong>Always cleanup!</strong> Return a cleanup function for timers, subscriptions, listeners</li>
          <li><strong>Dependencies matter!</strong> Include all values used in the effect</li>
          <li><strong>Empty [] = run once</strong>, no array = run every render</li>
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
          <li><strong>DON'T</strong> forget to add dependencies (React will warn you!)</li>
          <li><strong>DON'T</strong> forget cleanup for subscriptions/timers/listeners</li>
          <li><strong>DON'T</strong> use effects for transforming data (use regular variables instead)</li>
          <li><strong>DON'T</strong> use effects to handle user events (use event handlers instead)</li>
          <li><strong>DO</strong> use effects for synchronization with external systems</li>
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
 * Practice these to master useEffect:
 *
 * 1. Online Status Detector: Create a component that shows online/offline status
 *    using window.addEventListener('online'/'offline')
 *
 * 2. Auto-save Form: Build a form that auto-saves to localStorage every 2 seconds
 *    while the user is typing (use both interval and cleanup)
 *
 * 3. Geolocation Tracker: Use navigator.geolocation.watchPosition to track
 *    user location and clean up the watcher on unmount
 *
 * 4. Real-time Clock: Display current time that updates every second
 *    (hint: setInterval + cleanup)
 *
 * 5. API Polling: Fetch fresh data from an API every 5 seconds while
 *    the component is mounted
 *
 * Remember: Effects = Synchronize with external systems! 🚀
 * =============================================================================
 */
