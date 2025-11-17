/**
 * =============================================================================
 * ESCAPE HATCH #1: REFERENCING VALUES WITH REFS
 * =============================================================================
 *
 * Hey there, junior dev! 👋 Let's talk about useRef - one of React's most
 * misunderstood but powerful hooks.
 *
 * WHAT IS useRef?
 * ---------------
 * useRef gives you a "box" where you can store a value that:
 * 1. Persists between renders (doesn't reset like regular variables)
 * 2. DOESN'T trigger a re-render when it changes (unlike useState)
 * 3. Always returns the same object reference
 *
 * WHEN TO USE REFS vs STATE?
 * ---------------------------
 * Use STATE when:
 *   ✅ You want changes to trigger a re-render
 *   ✅ You want to display the value in your UI
 *
 * Use REFS when:
 *   ✅ You need to store data that doesn't affect rendering
 *   ✅ You're working with external systems (timers, subscriptions)
 *   ✅ You need to remember previous values
 *
 * =============================================================================
 */

import { useRef, useState } from 'react';

/**
 * EXAMPLE 1: Stopwatch - The Classic useRef Example
 * --------------------------------------------------
 * This demonstrates the most common use case: storing timer IDs.
 *
 * KEY LEARNING POINTS:
 * - intervalRef.current stores the interval ID
 * - We can clear the interval later using this ID
 * - Changing intervalRef doesn't cause a re-render
 * - We use state for the time because we WANT to display it (needs re-renders)
 */
function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // This ref stores the interval ID so we can clear it later
  // Think of it as a "sticky note" that persists between renders
  const intervalRef = useRef(null);

  function handleStart() {
    if (isRunning) return; // Prevent multiple intervals

    setIsRunning(true);

    // Store the interval ID in our ref "box"
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 10);

    console.log('🏁 Started! Interval ID:', intervalRef.current);
  }

  function handleStop() {
    setIsRunning(false);

    // Use the stored interval ID to clear the interval
    clearInterval(intervalRef.current);
    console.log('🛑 Stopped! Cleared interval:', intervalRef.current);
  }

  function handleReset() {
    handleStop();
    setTime(0);
    console.log('🔄 Reset!');
  }

  // Format time as seconds.milliseconds
  const seconds = Math.floor(time / 100);
  const milliseconds = time % 100;

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>⏱️ Stopwatch Example</h3>
      <div style={{ fontSize: '48px', fontFamily: 'monospace', margin: '20px 0' }}>
        {seconds}.{milliseconds.toString().padStart(2, '0')}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleStart}
          disabled={isRunning}
          style={{ padding: '10px 20px', cursor: isRunning ? 'not-allowed' : 'pointer' }}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          style={{ padding: '10px 20px', cursor: !isRunning ? 'not-allowed' : 'pointer' }}
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 The interval ID is stored in a ref because we don't need to display it,
        and changing it shouldn't trigger a re-render.
      </p>
    </div>
  );
}

/**
 * EXAMPLE 2: Click Counter - Understanding the Difference Between Ref and State
 * ------------------------------------------------------------------------------
 * This example shows you EXACTLY why refs don't trigger re-renders.
 *
 * KEY LEARNING POINTS:
 * - Clicking "Increment Ref" changes the value but doesn't update the UI
 * - Clicking "Increment State" changes the value AND updates the UI
 * - The ref value IS changing (check the console), you just don't see it until re-render
 */
function RefVsStateDemo() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);

  function incrementRef() {
    refCount.current = refCount.current + 1;
    console.log('📦 Ref count is now:', refCount.current, '(but UI did not update!)');
  }

  function incrementState() {
    setStateCount(c => c + 1);
    console.log('🎨 State count is now:', stateCount + 1, '(UI will update!)');
  }

  // Just to prove the ref is actually changing, we show it in the render
  console.log('🔄 Component rendered. Ref count:', refCount.current, 'State count:', stateCount);

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🤔 Ref vs State: What's the Difference?</h3>

      <div style={{ margin: '20px 0', fontSize: '24px' }}>
        <div>📦 Ref Count: <strong>{refCount.current}</strong></div>
        <div>🎨 State Count: <strong>{stateCount}</strong></div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={incrementRef} style={{ padding: '10px 20px' }}>
          Increment Ref (No Re-render)
        </button>
        <button onClick={incrementState} style={{ padding: '10px 20px' }}>
          Increment State (Triggers Re-render)
        </button>
      </div>

      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px' }}>
        <strong>🧪 Experiment:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Click "Increment Ref" a few times - notice the UI doesn't update</li>
          <li>Open your console - you'll see the ref value IS changing</li>
          <li>Click "Increment State" once - NOW the ref count appears!</li>
        </ol>
        <p style={{ margin: '10px 0', fontSize: '14px' }}>
          💡 The ref was changing all along, but React doesn't re-render when refs change.
          When state changes trigger a re-render, we see the updated ref value.
        </p>
      </div>
    </div>
  );
}

/**
 * EXAMPLE 3: Previous Value Tracker
 * ----------------------------------
 * A super practical pattern: remembering the previous value of a state variable.
 *
 * KEY LEARNING POINTS:
 * - Refs are perfect for storing "previous" values
 * - We update the ref in an effect AFTER the render
 * - This creates a "one render delay" which is exactly what we want
 *
 * WHY THIS WORKS:
 * 1. Component renders with new count
 * 2. Effect runs AFTER render, updating prevCountRef to the OLD value
 * 3. Next render, prevCountRef contains the previous value!
 */
function PreviousValueTracker() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(count);

  // Update the ref AFTER each render to store the previous value
  // This effect runs after render, so prevCountRef still has the OLD value during render
  useState(() => {
    prevCountRef.current = count;
  });

  const difference = count - prevCountRef.current;

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>📊 Previous Value Tracker</h3>

      <div style={{ margin: '20px 0', fontSize: '20px' }}>
        <div>Current Count: <strong>{count}</strong></div>
        <div>Previous Count: <strong>{prevCountRef.current}</strong></div>
        <div style={{ color: difference > 0 ? 'green' : difference < 0 ? 'red' : 'gray' }}>
          Change: <strong>{difference > 0 ? '+' : ''}{difference}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setCount(c => c + 1)} style={{ padding: '10px 20px' }}>
          +1
        </button>
        <button onClick={() => setCount(c => c + 5)} style={{ padding: '10px 20px' }}>
          +5
        </button>
        <button onClick={() => setCount(c => c - 3)} style={{ padding: '10px 20px' }}>
          -3
        </button>
        <button onClick={() => setCount(0)} style={{ padding: '10px 20px' }}>
          Reset
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 Notice how "Previous Count" is always one step behind "Current Count".
        This is a common pattern for comparing current vs previous values!
      </p>
    </div>
  );
}

/**
 * EXAMPLE 4: Render Counter - Debugging How Often Components Re-render
 * ---------------------------------------------------------------------
 * A super useful debugging technique: counting renders without causing more renders!
 *
 * KEY LEARNING POINTS:
 * - Perfect example of when NOT to use state (would cause infinite re-renders!)
 * - Refs let us track metadata about the component without affecting its behavior
 * - The ref increments during render, which is usually not recommended, but safe here
 */
function RenderCounter() {
  const [text, setText] = useState('');
  const renderCount = useRef(0);

  // Increment render count during render
  // Normally modifying a ref during render is not recommended, but for counting
  // renders it's okay because we're not affecting the render output
  renderCount.current = renderCount.current + 1;

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🔢 Render Counter</h3>

      <div style={{
        background: '#fff3cd',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        This component has rendered {renderCount.current} times
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Type something to trigger re-renders:
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #333',
            borderRadius: '5px'
          }}
          placeholder="Type here..."
        />
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 Watch the render count increase as you type. Using state for this
        would cause an infinite loop! Refs are perfect for tracking metadata.
      </p>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 * ------------------
 * Combines all examples to demonstrate different useRef patterns
 */
export default function ReferencingValuesWithRefs() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🎯 Escape Hatch #1: Referencing Values with Refs</h1>

      <div style={{
        background: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>📚 Quick Reference</h2>
        <p><strong>Syntax:</strong> <code>const myRef = useRef(initialValue)</code></p>
        <p><strong>Access value:</strong> <code>myRef.current</code></p>
        <p><strong>Update value:</strong> <code>myRef.current = newValue</code></p>
        <p><strong>Key difference:</strong> Changing a ref does NOT trigger a re-render!</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <Stopwatch />
        <RefVsStateDemo />
        <PreviousValueTracker />
        <RenderCounter />
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2>🎓 Key Takeaways</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Refs are mutable containers</strong> that persist between renders</li>
          <li><strong>Changing a ref doesn't trigger re-renders</strong> - this is the key difference from state</li>
          <li><strong>Common use cases:</strong> storing timer IDs, tracking previous values, counting renders</li>
          <li><strong>Don't read or write refs during rendering</strong> (except for initialization or render counting)</li>
          <li><strong>Think of refs as "escape hatches"</strong> - use them when state doesn't fit</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#fff3cd',
        borderRadius: '8px'
      }}>
        <h3>⚠️ Common Mistakes to Avoid</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>DON'T</strong> use refs for data that should be displayed (use state instead)</li>
          <li><strong>DON'T</strong> read/write refs during rendering (except initialization)</li>
          <li><strong>DON'T</strong> forget that refs are mutable - multiple places can modify them</li>
          <li><strong>DO</strong> use refs for external system integration (timers, subscriptions, etc.)</li>
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
 * Try building these exercises to practice useRef:
 *
 * 1. Debounced Input: Create an input that only updates state 500ms after
 *    the user stops typing (store the timeout ID in a ref)
 *
 * 2. Click Tracker: Track how many times a button was clicked, but only
 *    show the count when another button is pressed (hint: use both ref and state)
 *
 * 3. Component Mount Time: Display how long ago the component was first mounted
 *    (store the mount timestamp in a ref)
 *
 * 4. Previous Props: Create a custom hook `usePrevious(value)` that returns
 *    the previous value of any prop or state
 *
 * Good luck! Remember: Refs are for data that doesn't need to trigger re-renders! 🚀
 * =============================================================================
 */
