/**
 * =============================================================================
 * ESCAPE HATCH #2: MANIPULATING THE DOM WITH REFS
 * =============================================================================
 *
 * Welcome back, junior dev! 🎨 Now let's learn how to directly access and
 * manipulate DOM elements using refs.
 *
 * WHAT ARE DOM REFS?
 * ------------------
 * While value refs (useRef) store any JavaScript value, DOM refs specifically
 * store references to actual HTML elements in the DOM.
 *
 * WHY DO WE NEED THIS?
 * --------------------
 * React usually handles the DOM for you, but sometimes you need to directly:
 * - Focus an input
 * - Scroll to an element
 * - Measure an element's size or position
 * - Integrate with non-React libraries (videos, maps, etc.)
 *
 * WHEN TO USE DOM REFS?
 * ---------------------
 * ✅ DO use refs for:
 *    - Focus, text selection, media playback
 *    - Triggering animations
 *    - Integrating with third-party DOM libraries
 *
 * ❌ DON'T use refs for:
 *    - Anything that can be done declaratively with React
 *    - Changing the DOM structure (use state instead)
 *
 * =============================================================================
 */

import { useRef, useState, forwardRef, useImperativeHandle } from 'react';

/**
 * EXAMPLE 1: Focus Management - The Most Common Use Case
 * -------------------------------------------------------
 * Managing focus is the #1 reason you'll use DOM refs in real applications.
 *
 * KEY LEARNING POINTS:
 * - Create a ref with useRef(null)
 * - Attach it to a DOM element with the `ref` attribute
 * - Access the DOM node with inputRef.current
 * - Call DOM methods like .focus(), .blur(), etc.
 */
function FocusExample() {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleFocusInput() {
    // Access the actual DOM node and call its focus() method
    inputRef.current.focus();
    console.log('🎯 Focused the input!', inputRef.current);
  }

  function handleSelectAll() {
    // You can call any DOM method!
    inputRef.current.focus();
    inputRef.current.select();
    console.log('✨ Selected all text!');
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎯 Focus Management Example</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Password Input:
        </label>
        <input
          ref={inputRef} // 👈 This connects the ref to the DOM element!
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #333',
            borderRadius: '5px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={handleFocusInput} style={{ padding: '10px 20px' }}>
          Focus Input
        </button>
        <button onClick={handleSelectAll} style={{ padding: '10px 20px' }}>
          Select All Text
        </button>
        <button
          onClick={() => setShowPassword(!showPassword)}
          style={{ padding: '10px 20px' }}
        >
          {showPassword ? 'Hide' : 'Show'} Password
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 Notice how we can directly call DOM methods like focus() and select().
        This is impossible with just React state!
      </p>
    </div>
  );
}

/**
 * EXAMPLE 2: Scroll Management
 * -----------------------------
 * Scrolling is another common use case for DOM refs.
 *
 * KEY LEARNING POINTS:
 * - Use scrollIntoView() to scroll elements into view
 * - You can have multiple refs (one for each element)
 * - Use arrays or objects to store multiple refs
 */
function ScrollExample() {
  const topRef = useRef(null);
  const middleRef = useRef(null);
  const bottomRef = useRef(null);

  function scrollToTop() {
    topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scrollToMiddle() {
    middleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function scrollToBottom() {
    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>📜 Scroll Management Example</h3>

      {/* Sticky navigation */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'white',
        padding: '15px',
        borderBottom: '2px solid #333',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        <button onClick={scrollToTop} style={{ padding: '8px 16px' }}>
          ⬆️ Top
        </button>
        <button onClick={scrollToMiddle} style={{ padding: '8px 16px' }}>
          ➡️ Middle
        </button>
        <button onClick={scrollToBottom} style={{ padding: '8px 16px' }}>
          ⬇️ Bottom
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{
        height: '400px',
        overflowY: 'scroll',
        border: '2px solid #ddd',
        borderRadius: '5px',
        padding: '20px'
      }}>
        <div ref={topRef} style={{
          padding: '40px',
          background: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '300px'
        }}>
          <h4>📍 Top Section</h4>
          <p>This is the top of the scrollable area.</p>
        </div>

        <div ref={middleRef} style={{
          padding: '40px',
          background: '#fff3cd',
          borderRadius: '8px',
          marginBottom: '300px'
        }}>
          <h4>📍 Middle Section</h4>
          <p>This is the middle of the scrollable area.</p>
        </div>

        <div ref={bottomRef} style={{
          padding: '40px',
          background: '#f8d7da',
          borderRadius: '8px'
        }}>
          <h4>📍 Bottom Section</h4>
          <p>This is the bottom of the scrollable area.</p>
        </div>
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 scrollIntoView() is perfect for "jump to section" navigation,
        chat applications, or any smooth scrolling feature!
      </p>
    </div>
  );
}

/**
 * EXAMPLE 3: Measuring DOM Elements
 * ----------------------------------
 * Sometimes you need to know the size or position of an element.
 *
 * KEY LEARNING POINTS:
 * - Use getBoundingClientRect() to get element dimensions
 * - Use offsetWidth/offsetHeight for size
 * - Measurements should typically happen in an effect or event handler
 */
function MeasurementExample() {
  const boxRef = useRef(null);
  const [measurements, setMeasurements] = useState(null);

  function measureBox() {
    if (!boxRef.current) return;

    const rect = boxRef.current.getBoundingClientRect();
    const styles = window.getComputedStyle(boxRef.current);

    setMeasurements({
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      backgroundColor: styles.backgroundColor,
      padding: styles.padding
    });

    console.log('📏 Measured the box:', rect);
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>📏 Measuring DOM Elements</h3>

      <div
        ref={boxRef}
        style={{
          width: '300px',
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          padding: '20px',
          margin: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
      >
        Measure Me! 📦
      </div>

      <button onClick={measureBox} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        📏 Measure Box
      </button>

      {measurements && (
        <div style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <div><strong>Width:</strong> {measurements.width.toFixed(2)}px</div>
          <div><strong>Height:</strong> {measurements.height.toFixed(2)}px</div>
          <div><strong>Distance from top:</strong> {measurements.top.toFixed(2)}px</div>
          <div><strong>Distance from left:</strong> {measurements.left.toFixed(2)}px</div>
          <div><strong>Background Color:</strong> {measurements.backgroundColor}</div>
          <div><strong>Padding:</strong> {measurements.padding}</div>
        </div>
      )}

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 getBoundingClientRect() gives you precise measurements. Useful for
        tooltips, popovers, and responsive layouts!
      </p>
    </div>
  );
}

/**
 * EXAMPLE 4: Video Player Control
 * --------------------------------
 * Controlling media elements is a perfect use case for refs.
 *
 * KEY LEARNING POINTS:
 * - Media elements (video, audio) have special methods like play(), pause()
 * - You MUST use refs to control playback imperatively
 * - State tracks the playing status for UI updates
 */
function VideoPlayerExample() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  function handlePlayPause() {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleRestart() {
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    videoRef.current.play();
    setIsPlaying(true);
  }

  function handleTimeUpdate() {
    setCurrentTime(videoRef.current.currentTime);
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎬 Video Player Control Example</h3>

      <video
        ref={videoRef}
        width="100%"
        style={{ borderRadius: '8px', marginBottom: '20px' }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      >
        <source
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          type="video/mp4"
        />
        Your browser doesn't support video.
      </video>

      <div style={{
        background: '#f5f5f5',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        fontFamily: 'monospace'
      }}>
        ⏱️ Current Time: {currentTime.toFixed(2)}s
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handlePlayPause} style={{ padding: '10px 20px' }}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={handleRestart} style={{ padding: '10px 20px' }}>
          🔄 Restart
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 Video/audio elements require imperative control via refs.
        You can't declaratively control playback with just props!
      </p>
    </div>
  );
}

/**
 * EXAMPLE 5: Ref Forwarding - Advanced Pattern
 * ---------------------------------------------
 * Sometimes you need to pass a ref through a custom component to a DOM element inside.
 *
 * KEY LEARNING POINTS:
 * - Regular components can't receive refs (they're not props)
 * - Use forwardRef() to forward a ref to a child element
 * - This is essential when building reusable component libraries
 */

// This component forwards the ref to the input element inside
const FancyInput = forwardRef((props, ref) => {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block'
    }}>
      <input
        ref={ref} // 👈 Forward the ref to the actual input
        {...props}
        style={{
          padding: '12px 40px 12px 12px',
          fontSize: '16px',
          border: '2px solid #667eea',
          borderRadius: '25px',
          outline: 'none',
          ...props.style
        }}
      />
      <span style={{
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '20px'
      }}>
        ✨
      </span>
    </div>
  );
});

FancyInput.displayName = 'FancyInput'; // For debugging

function RefForwardingExample() {
  const inputRef = useRef(null);

  function handleFocus() {
    // Thanks to forwardRef, we can focus the input inside FancyInput!
    inputRef.current.focus();
  }

  function handleShake() {
    const input = inputRef.current;
    input.style.animation = 'shake 0.5s';
    setTimeout(() => {
      input.style.animation = '';
    }, 500);
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎁 Ref Forwarding Example</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Fancy Input Component:
        </label>
        <FancyInput
          ref={inputRef} // 👈 Pass ref to custom component!
          placeholder="This is a fancy input..."
        />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleFocus} style={{ padding: '10px 20px' }}>
          Focus Fancy Input
        </button>
        <button onClick={handleShake} style={{ padding: '10px 20px' }}>
          Shake It! 📳
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 forwardRef() is crucial when building component libraries.
        It lets parent components access child DOM elements!
      </p>
    </div>
  );
}

/**
 * EXAMPLE 6: useImperativeHandle - Exposing Custom Methods
 * ---------------------------------------------------------
 * Sometimes you want to expose only specific methods, not the whole DOM element.
 *
 * KEY LEARNING POINTS:
 * - useImperativeHandle customizes what parent components can access
 * - You control exactly what methods/properties to expose
 * - This is useful for encapsulation and clean APIs
 */

const CustomTextArea = forwardRef((props, ref) => {
  const textAreaRef = useRef(null);

  // Expose ONLY these methods to parent, not the entire DOM element
  useImperativeHandle(ref, () => ({
    // Custom method: focus and scroll to bottom
    focusAndScrollToBottom() {
      textAreaRef.current.focus();
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    },

    // Custom method: insert text at cursor position
    insertText(text) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const currentValue = textAreaRef.current.value;
      const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
      textAreaRef.current.value = newValue;
      textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + text.length;
      textAreaRef.current.focus();
    },

    // Custom method: get statistics
    getStats() {
      const text = textAreaRef.current.value;
      return {
        characters: text.length,
        words: text.trim().split(/\s+/).filter(Boolean).length,
        lines: text.split('\n').length
      };
    }
  }));

  return (
    <textarea
      ref={textAreaRef}
      {...props}
      style={{
        width: '100%',
        minHeight: '150px',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #333',
        borderRadius: '8px',
        fontFamily: 'monospace',
        resize: 'vertical',
        ...props.style
      }}
    />
  );
});

CustomTextArea.displayName = 'CustomTextArea';

function ImperativeHandleExample() {
  const textAreaRef = useRef(null);
  const [stats, setStats] = useState(null);

  function handleFocusBottom() {
    textAreaRef.current.focusAndScrollToBottom();
  }

  function handleInsertEmoji() {
    textAreaRef.current.insertText(' 🎉 ');
  }

  function handleShowStats() {
    const newStats = textAreaRef.current.getStats();
    setStats(newStats);
    console.log('📊 Text statistics:', newStats);
  }

  return (
    <div style={{ padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
      <h3>🎛️ useImperativeHandle Example</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Custom Text Area with Special Methods:
        </label>
        <CustomTextArea
          ref={textAreaRef}
          placeholder="Try the buttons below to see custom methods in action..."
          defaultValue="Welcome to the custom text area!\nTry clicking the buttons below."
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button onClick={handleFocusBottom} style={{ padding: '10px 20px' }}>
          Focus & Scroll to Bottom
        </button>
        <button onClick={handleInsertEmoji} style={{ padding: '10px 20px' }}>
          Insert Emoji 🎉
        </button>
        <button onClick={handleShowStats} style={{ padding: '10px 20px' }}>
          Show Statistics 📊
        </button>
      </div>

      {stats && (
        <div style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          fontFamily: 'monospace'
        }}>
          <div>📝 Characters: {stats.characters}</div>
          <div>📖 Words: {stats.words}</div>
          <div>📄 Lines: {stats.lines}</div>
        </div>
      )}

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        💡 useImperativeHandle lets you expose a clean, custom API instead of
        the raw DOM element. Perfect for component libraries!
      </p>
    </div>
  );
}

/**
 * MAIN APP COMPONENT
 * ------------------
 * Combines all examples to demonstrate different DOM ref patterns
 */
export default function ManipulatingDOMWithRefs() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🎨 Escape Hatch #2: Manipulating the DOM with Refs</h1>

      <div style={{
        background: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>📚 Quick Reference</h2>
        <p><strong>Create a DOM ref:</strong> <code>const myRef = useRef(null)</code></p>
        <p><strong>Attach to element:</strong> <code>&lt;div ref={`{myRef}`}&gt;</code></p>
        <p><strong>Access DOM node:</strong> <code>myRef.current</code></p>
        <p><strong>Forward ref:</strong> <code>forwardRef((props, ref) =&gt; ...)</code></p>
        <p><strong>Custom ref API:</strong> <code>useImperativeHandle(ref, () =&gt; ({`{ ... }`}))</code></p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <FocusExample />
        <ScrollExample />
        <MeasurementExample />
        <VideoPlayerExample />
        <RefForwardingExample />
        <ImperativeHandleExample />
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h2>🎓 Key Takeaways</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>DOM refs give you access to actual DOM elements</strong> in your React components</li>
          <li><strong>Common uses:</strong> focus management, scrolling, measuring, media control</li>
          <li><strong>forwardRef</strong> lets custom components receive refs</li>
          <li><strong>useImperativeHandle</strong> customizes what's exposed to parent components</li>
          <li><strong>Only manipulate DOM when necessary</strong> - prefer React's declarative approach when possible</li>
        </ul>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#fff3cd',
        borderRadius: '8px'
      }}>
        <h3>⚠️ Best Practices</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>DO</strong> use refs for focus, scrolling, and measuring</li>
          <li><strong>DO</strong> use refs for third-party integrations (maps, charts, etc.)</li>
          <li><strong>DON'T</strong> modify the DOM structure (adding/removing elements)</li>
          <li><strong>DON'T</strong> change anything React manages (use state instead)</li>
          <li><strong>REMEMBER:</strong> Refs are an escape hatch - use React's declarative approach first!</li>
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
 * Build these to master DOM refs:
 *
 * 1. Image Gallery: Create a gallery with "scroll to next image" buttons
 *    using refs and scrollIntoView()
 *
 * 2. Form Validation: Build a form that focuses the first invalid field
 *    when submit fails (use refs to manage focus)
 *
 * 3. Auto-resize Textarea: Create a textarea that auto-expands as you type
 *    (measure scrollHeight with refs)
 *
 * 4. Custom Video Player: Build a full video player with play/pause,
 *    seek bar, and volume control using video ref
 *
 * 5. Tooltip Positioning: Create tooltips that position themselves based on
 *    the target element's measurements (getBoundingClientRect)
 *
 * Remember: Use refs for imperative actions, state for declarative UI! 🚀
 * =============================================================================
 */
