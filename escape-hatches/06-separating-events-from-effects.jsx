/**
 * =============================================================================
 * ESCAPE HATCH #6: SEPARATING EVENTS FROM EFFECTS
 * =============================================================================
 *
 * Hey junior dev! 🎭 This is one of the trickiest concepts in React.
 * Let's learn when to use effects vs event handlers.
 *
 * THE FUNDAMENTAL DIFFERENCE:
 * ---------------------------
 * Event Handlers:
 *   - Run in response to specific user interactions
 *   - Are NOT reactive (don't re-run when props/state change)
 *   - Example: onClick, onChange, onSubmit
 *
 * Effects:
 *   - Run to synchronize with external systems
 *   - ARE reactive (re-run when dependencies change)
 *   - Example: connecting to a server, updating document title
 *
 * THE PROBLEM:
 * ------------
 * Sometimes you need BOTH:
 * - An effect that synchronizes (reactive)
 * - But uses some values that shouldn't be reactive
 *
 * THE SOLUTION:
 * -------------
 * Extract non-reactive logic out of effects using:
 * - Event handlers (when possible)
 * - useEffectEvent (experimental, but coming to React)
 * - Refs for non-reactive values
 *
 * =============================================================================
 */

import { useEffect, useState, useRef } from 'react';

/**
 * EXAMPLE 1: Events vs Effects - The Basic Difference
 * ----------------------------------------------------
 * Let's see the fundamental difference in behavior.
 *
 * KEY LEARNING POINTS:
 * - Event handlers run once per interaction
 * - Effects can run multiple times (on every relevant render)
 * - Choose based on WHEN you want code to run
 */
function EventsVsEffectsBasic() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type) => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  // Event handler: runs ONLY when button is clicked
  const handleClick = () => {
    addLog(`🖱️ Event Handler: Button clicked (count: ${count})`, 'event');
    setCount(c => c + 1);
  };

  // Effect: runs after EVERY render where count changed
  useEffect(() => {
    addLog(`⚡ Effect: Count changed to ${count}`, 'effect');
  }, [count]);

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎭 Events vs Effects: Basic Difference</h3>

      <div style={{ marginBottom: '20px', fontSize: '24px' }}>
        Count: <strong>{count}</strong>
      </div>

      <button onClick={handleClick} style={{ padding: '12px 24px', fontSize: '16px', marginBottom: '20px' }}>
        Click Me!
      </button>

      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        maxHeight: '200px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '13px'
      }}>
        <strong>📜 Log:</strong>
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              marginTop: '8px',
              padding: '8px',
              background: log.type === 'event' ? '#e3f2fd' : '#fff3cd',
              borderRadius: '4px',
              borderLeft: `4px solid ${log.type === 'event' ? '#2196f3' : '#ffc107'}`
            }}
          >
            [{log.time}] {log.message}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 Notice:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Event handler runs once per click</li>
          <li>Effect runs after the render (when count changes)</li>
          <li>Both happen, but for different reasons!</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 2: The Problem - Unwanted Reactive Dependencies
 * --------------------------------------------------------
 * Sometimes an effect needs a value but shouldn't re-run when it changes.
 *
 * KEY LEARNING POINTS:
 * - Problem: value is used in effect but shouldn't trigger re-runs
 * - If you add it to deps: effect runs too often
 * - If you omit it from deps: linter warns + stale closure bug
 */
function UnwantedReactiveDependency() {
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [connectionLog, setConnectionLog] = useState([]);

  const addLog = (text) => {
    setConnectionLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      text
    }]);
  };

  // ❌ PROBLEM: We want to connect when 'message' changes,
  // but we also want to use 'theme' for styling the notification.
  // If we include 'theme' in dependencies, we'll reconnect unnecessarily!
  useEffect(() => {
    if (!message) return;

    addLog(`📡 Sending message: "${message}"`);

    // Simulate sending message
    setTimeout(() => {
      // We want to use 'theme' here for the notification style
      addLog(`✅ Message sent! (theme: ${theme})`);
    }, 1000);

    // Should we include 'theme' in dependencies? 🤔
    // If YES: effect re-runs when theme changes (unnecessary connection)
    // If NO: linter warns us + 'theme' might be stale
  }, [message, theme]); // Including theme causes unnecessary re-runs!

  return (
    <div style={{ padding: '20px', border: '3px solid #ffc107', borderRadius: '8px', background: '#fffaf0' }}>
      <h3>⚠️ Problem: Unwanted Reactive Dependency</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Message (triggers effect):
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #ffc107' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Theme (shouldn't trigger effect, but does):
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #dc3545' }}
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="auto">🔄 Auto</option>
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
        {connectionLog.map((log, index) => (
          <div key={index} style={{ marginTop: '5px' }}>
            [{log.time}] {log.text}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>🐛 The Problem:</strong>
        <p style={{ margin: '10px 0' }}>
          We included 'theme' in dependencies to avoid stale closures.
          But now the effect re-runs when theme changes, even though
          we only wanted to send messages!
        </p>
        <p style={{ margin: '10px 0', fontWeight: 'bold' }}>
          Try changing the theme - it triggers the effect unnecessarily! 😓
        </p>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 3: Solution #1 - Move Logic to Event Handler
 * -----------------------------------------------------
 * Often the best solution is to use an event handler instead.
 *
 * KEY LEARNING POINTS:
 * - Ask: "Does this code need to be reactive?"
 * - If it responds to a specific interaction → event handler
 * - If it synchronizes with external system → effect
 */
function SolutionEventHandler() {
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [sendLog, setSendLog] = useState([]);

  const addLog = (text) => {
    setSendLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      text
    }]);
  };

  // ✅ SOLUTION: Use event handler instead of effect!
  const handleSend = () => {
    if (!message.trim()) return;

    addLog(`📤 Sending: "${message}"`);

    // Simulate sending
    setTimeout(() => {
      // ✅ We can use 'theme' here without making anything reactive!
      addLog(`✅ Sent! (theme: ${theme})`);
    }, 1000);

    setMessage('');
  };

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ Solution #1: Use Event Handler</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Message:
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message and press Enter..."
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #28a745' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Theme:
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

        <button onClick={handleSend} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Send Message
        </button>
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
        <strong>📜 Send Log:</strong>
        {sendLog.map((log, index) => (
          <div key={index} style={{ marginTop: '5px' }}>
            [{log.time}] {log.text}
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
        <strong>✅ Why This Works:</strong>
        <p style={{ margin: '10px 0' }}>
          Event handler runs only when the button is clicked. We can use
          both 'message' and 'theme' without making anything reactive!
        </p>
        <p style={{ margin: '10px 0', fontWeight: 'bold' }}>
          Try changing theme - nothing happens (perfect!✨)
        </p>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 4: Solution #2 - Use Ref for Non-Reactive Values
 * ---------------------------------------------------------
 * When you need an effect but with non-reactive values, use refs.
 *
 * KEY LEARNING POINTS:
 * - Refs don't trigger re-runs when changed
 * - Perfect for "latest value" without reactivity
 * - Common pattern for non-reactive config/options
 */
function SolutionUseRef() {
  const [isOnline, setIsOnline] = useState(true);
  const [notificationSound, setNotificationSound] = useState('beep');
  const [connectionLog, setConnectionLog] = useState([]);

  // ✅ Store non-reactive value in a ref
  const notificationSoundRef = useRef(notificationSound);

  // Keep ref in sync with state (but don't add state to effect deps)
  useEffect(() => {
    notificationSoundRef.current = notificationSound;
  }, [notificationSound]);

  const addLog = (text) => {
    setConnectionLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      text
    }]);
  };

  // Effect only depends on 'isOnline', not 'notificationSound'
  useEffect(() => {
    addLog(isOnline ? '🟢 Connected' : '🔴 Disconnected');

    if (isOnline) {
      // ✅ Use the ref to get the latest value without making it reactive
      const sound = notificationSoundRef.current;
      setTimeout(() => {
        addLog(`🔔 Playing sound: ${sound}`);
      }, 500);
    }
  }, [isOnline]); // ✅ Only 'isOnline' in dependencies!

  return (
    <div style={{ padding: '20px', border: '3px solid #28a745', borderRadius: '8px', background: '#f0fff4' }}>
      <h3>✅ Solution #2: Use Ref for Non-Reactive Values</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
            />
            <strong>Connected (triggers effect)</strong>
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Notification Sound (doesn't trigger effect):
          </label>
          <select
            value={notificationSound}
            onChange={(e) => setNotificationSound(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="beep">🔊 Beep</option>
            <option value="chime">🎵 Chime</option>
            <option value="ding">🔔 Ding</option>
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
        {connectionLog.map((log, index) => (
          <div key={index} style={{ marginTop: '5px' }}>
            [{log.time}] {log.text}
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
        <strong>✅ Why This Works:</strong>
        <p style={{ margin: '10px 0' }}>
          The ref stores the latest notification sound, but changing it
          doesn't trigger the effect. The effect only runs when 'isOnline' changes!
        </p>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 5: When You Actually Need Both
 * ---------------------------------------
 * Real-world example: analytics that tracks user properties.
 *
 * KEY LEARNING POINTS:
 * - Some effects genuinely need reactive AND non-reactive values
 * - Use refs to separate the two concerns
 * - Pattern: effect depends on what triggers it, ref holds config
 */
function AnalyticsExample() {
  const [page, setPage] = useState('home');
  const [userId, setUserId] = useState('user123');
  const [eventLog, setEventLog] = useState([]);

  // Non-reactive user properties (for analytics context)
  const userIdRef = useRef(userId);
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const addLog = (text) => {
    setEventLog(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      text
    }]);
  };

  // Effect tracks page views (reactive to 'page', but uses userId from ref)
  useEffect(() => {
    // Track page view
    const currentUserId = userIdRef.current;
    addLog(`📊 Analytics: Page viewed - "${page}" by ${currentUserId}`);

    // Simulate sending to analytics service
    console.log('Sending to analytics:', {
      event: 'page_view',
      page,
      userId: currentUserId,
      timestamp: new Date().toISOString()
    });
  }, [page]); // ✅ Only re-run when page changes!

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>📊 Real-World: Analytics Tracking</h3>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Current Page (triggers analytics):
          </label>
          <select
            value={page}
            onChange={(e) => setPage(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid #2196f3' }}
          >
            <option value="home">🏠 Home</option>
            <option value="products">🛍️ Products</option>
            <option value="about">ℹ️ About</option>
            <option value="contact">📧 Contact</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            User ID (doesn't re-track page):
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
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
        <strong>📜 Analytics Events:</strong>
        {eventLog.map((log, index) => (
          <div key={index} style={{ marginTop: '5px' }}>
            [{log.time}] {log.text}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 Notice:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Changing page → tracks new page view (with latest userId) ✅</li>
          <li>Changing userId → doesn't re-track current page ✅</li>
          <li>Best of both worlds using refs!</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 */
export default function SeparatingEventsFromEffects() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🎭 Escape Hatch #6: Separating Events from Effects</h1>

      <div style={{
        background: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>📚 Quick Reference</h2>
        <p><strong>Event Handlers:</strong> Run in response to specific interactions (non-reactive)</p>
        <p><strong>Effects:</strong> Run to synchronize with external systems (reactive)</p>
        <p><strong>The Challenge:</strong> Sometimes you need both reactive and non-reactive logic</p>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Use event handlers when possible (best)</li>
          <li>Use refs for non-reactive values in effects</li>
          <li>useEffectEvent (experimental, not yet in stable React)</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <EventsVsEffectsBasic />
        <UnwantedReactiveDependency />

        <h2 style={{ marginTop: '20px' }}>Solutions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <SolutionEventHandler />
          <SolutionUseRef />
        </div>

        <AnalyticsExample />
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2>🎓 Key Takeaways</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Event handlers are NOT reactive</strong> - they run once per interaction</li>
          <li><strong>Effects ARE reactive</strong> - they re-run when dependencies change</li>
          <li><strong>Ask yourself:</strong> "Should this re-run when X changes?"</li>
          <li><strong>Use event handlers</strong> when code responds to specific user action</li>
          <li><strong>Use refs</strong> when effects need non-reactive values</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#fff3cd',
        borderRadius: '8px'
      }}>
        <h3>🤔 Decision Tree</h3>
        <div style={{ lineHeight: '2' }}>
          <strong>Q: Does this code respond to a specific user interaction?</strong>
          <div style={{ paddingLeft: '20px' }}>
            ✅ Yes → Use event handler
            <br />
            ❌ No → Continue...
          </div>
          <br />
          <strong>Q: Does this code need to synchronize with an external system?</strong>
          <div style={{ paddingLeft: '20px' }}>
            ✅ Yes → Use effect
            <br />
            ❌ No → You probably don't need an effect!
          </div>
          <br />
          <strong>Q: Does the effect need a value but shouldn't re-run when it changes?</strong>
          <div style={{ paddingLeft: '20px' }}>
            ✅ Yes → Use ref for that value
            <br />
            ❌ No → Include it in dependencies
          </div>
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
 * Practice separating events from effects:
 *
 * 1. Review your code: Find effects that should be event handlers.
 *    If the code responds to a button click, it should probably be in onClick!
 *
 * 2. Identify non-reactive values: Find effects with dependencies that
 *    don't actually need to trigger re-runs. Convert them to use refs.
 *
 * 3. Build a theme switcher that:
 *    - Saves theme to localStorage when changed (event handler)
 *    - Loads theme from localStorage on mount (effect runs once)
 *    - Doesn't re-save when other state changes
 *
 * 4. Build a form that:
 *    - Auto-saves every 2 seconds while typing (effect with interval)
 *    - Uses current form values but doesn't reset interval when they change
 *    - Hint: Use refs!
 *
 * Remember: Event handlers for interactions, effects for synchronization! 🎯
 * =============================================================================
 */
