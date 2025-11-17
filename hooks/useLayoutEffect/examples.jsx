import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

// ==============================================================================
// EXAMPLE 1: useEffect vs useLayoutEffect (Visual Flicker)
// ==============================================================================
export function FlickerComparison() {
  const [value, setValue] = useState(0);
  const [showWithEffect, setShowWithEffect] = useState(true);

  return (
    <div>
      <h3>Visual Flicker Comparison</h3>
      <button onClick={() => setShowWithEffect(!showWithEffect)}>
        Toggle: {showWithEffect ? 'useEffect' : 'useLayoutEffect'}
      </button>
      <button onClick={() => setValue(v => v + 1)}>Increment</button>

      {showWithEffect ? (
        <WithUseEffect value={value} />
      ) : (
        <WithUseLayoutEffect value={value} />
      )}

      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Try rapidly clicking increment. useEffect may flicker, useLayoutEffect won't.
      </p>
    </div>
  );
}

function WithUseEffect({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  // useEffect - runs AFTER paint
  useEffect(() => {
    if (value >= 5) {
      setDisplayValue(0); // User might see "5" briefly
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div style={{ padding: '20px', background: '#ffe0e0', margin: '10px 0' }}>
      <h4>❌ With useEffect (may flicker)</h4>
      <p style={{ fontSize: '3em' }}>{displayValue}</p>
    </div>
  );
}

function WithUseLayoutEffect({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  // useLayoutEffect - runs BEFORE paint
  useLayoutEffect(() => {
    if (value >= 5) {
      setDisplayValue(0); // User never sees "5"
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div style={{ padding: '20px', background: '#e0ffe0', margin: '10px 0' }}>
      <h4>✅ With useLayoutEffect (no flicker)</h4>
      <p style={{ fontSize: '3em' }}>{displayValue}</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 2: Measuring DOM Elements
// ==============================================================================
export function MeasureBeforePaint() {
  const [text, setText] = useState('Short');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect();
      setDimensions({ width: Math.round(width), height: Math.round(height) });
      console.log('Measured BEFORE paint:', { width, height });
    }
  }, [text]);

  return (
    <div>
      <h3>Measure DOM Before Paint</h3>
      <div
        ref={elementRef}
        style={{
          padding: '20px',
          border: '2px solid blue',
          display: 'inline-block',
          maxWidth: '300px'
        }}
      >
        {text}
      </div>
      <p>Width: {dimensions.width}px, Height: {dimensions.height}px</p>
      <button onClick={() => setText('Short')}>Short Text</button>
      <button onClick={() => setText('This is much longer text that will change dimensions!')}>
        Long Text
      </button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 3: Scroll Position Restoration
// ==============================================================================
export function ScrollRestoration() {
  const [items] = useState(Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`));
  const [scrollPos, setScrollPos] = useState(0);
  const listRef = useRef(null);

  const saveScroll = () => {
    if (listRef.current) {
      setScrollPos(listRef.current.scrollTop);
    }
  };

  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollPos;
      console.log('Scroll restored BEFORE paint:', scrollPos);
    }
  }, [scrollPos]);

  return (
    <div>
      <h3>Scroll Position Restoration</h3>
      <button onClick={saveScroll}>Save Scroll Position</button>
      <button onClick={() => setScrollPos(0)}>Restore to Top</button>
      <button onClick={() => setScrollPos(500)}>Restore to Middle</button>

      <div
        ref={listRef}
        style={{
          height: '200px',
          overflow: 'auto',
          border: '1px solid #ccc',
          marginTop: '10px'
        }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 4: Tooltip Positioning
// ==============================================================================
export function TooltipPositioning() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    if (showTooltip && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Position tooltip above button, centered
      const top = buttonRect.top - tooltipRect.height - 10;
      const left = buttonRect.left + (buttonRect.width - tooltipRect.width) / 2;

      setTooltipPosition({ top, left });
      console.log('Tooltip positioned BEFORE paint:', { top, left });
    }
  }, [showTooltip]);

  return (
    <div style={{ padding: '100px' }}>
      <h3>Tooltip Positioning</h3>
      <button
        ref={buttonRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        Hover for Tooltip
      </button>

      {showTooltip && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            background: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 1000
          }}
        >
          This is a tooltip!
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// EXAMPLE 5: Auto-resize Textarea
// ==============================================================================
export function AutoResizeTextarea() {
  const [value, setValue] = useState('Type here...');
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      console.log('Textarea resized BEFORE paint');
    }
  }, [value]);

  return (
    <div>
      <h3>Auto-resize Textarea</h3>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '100%',
          minHeight: '50px',
          resize: 'none',
          overflow: 'hidden',
          fontFamily: 'inherit',
          fontSize: '14px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Textarea grows automatically without flicker
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 6: Anti-Pattern - Data Fetching (WRONG)
// ==============================================================================
export function AntiPatternDataFetching() {
  const [user, setUser] = useState(null);
  const [renderTime, setRenderTime] = useState(0);

  // ❌ BAD: This blocks painting!
  useLayoutEffect(() => {
    const start = performance.now();

    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(res => res.json())
      .then(data => {
        // Simulate slow operation
        const end = performance.now();
        setRenderTime(end - start);
        setUser(data);
      });
  }, []);

  return (
    <div>
      <h3>❌ Anti-Pattern: Data Fetching in useLayoutEffect</h3>
      <p style={{ color: 'red' }}>
        This blocks painting! Time: {renderTime.toFixed(2)}ms
      </p>
      {user ? (
        <div>
          <p>User: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Use useEffect for async operations instead!
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 7: Focus Management
// ==============================================================================
export function FocusManagement() {
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
      console.log('Input focused BEFORE paint');
    }
  }, [showModal]);

  return (
    <div>
      <h3>Focus Management</h3>
      <button onClick={() => setShowModal(true)}>Open Modal</button>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            borderRadius: '8px',
            zIndex: 1000
          }}
        >
          <h4>Modal</h4>
          <input
            ref={inputRef}
            placeholder="Auto-focused"
            style={{ padding: '8px', width: '200px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
          onClick={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ==============================================================================
// EXAMPLE 8: Animation on Mount
// ==============================================================================
export function AnimateOnMount() {
  const [show, setShow] = useState(false);
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    if (show && boxRef.current) {
      const element = boxRef.current;

      // Set initial state BEFORE paint
      element.style.opacity = '0';
      element.style.transform = 'translateY(-20px)';

      // Trigger animation AFTER paint
      requestAnimationFrame(() => {
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });

      console.log('Animation prepared BEFORE paint');
    }
  }, [show]);

  return (
    <div>
      <h3>Animate on Mount</h3>
      <button onClick={() => setShow(!show)}>Toggle Box</button>

      {show && (
        <div
          ref={boxRef}
          style={{
            marginTop: '20px',
            padding: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          Animated Box
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// EXAMPLE 9: Custom Hook - useElementSize
// ==============================================================================
function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;

    const updateSize = () => {
      const { width, height } = ref.current.getBoundingClientRect();
      setSize({ width: Math.round(width), height: Math.round(height) });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export function ElementSizeHook() {
  const [content, setContent] = useState('Resize me!');
  const elementRef = useRef(null);
  const size = useElementSize(elementRef);

  return (
    <div>
      <h3>Custom Hook: useElementSize</h3>
      <textarea
        ref={elementRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '10px',
          fontSize: '14px'
        }}
      />
      <p>Size: {size.width}px × {size.height}px</p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 10: SSR-Safe useLayoutEffect
// ==============================================================================
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function SSRSafeExample() {
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    console.log('SSR-safe effect ran');
  }, []);

  return (
    <div>
      <h3>SSR-Safe useLayoutEffect</h3>
      <p>Component mounted: {mounted ? 'Yes' : 'No'}</p>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Uses useLayoutEffect in browser, useEffect in SSR
      </p>
    </div>
  );
}

// ==============================================================================
// DEMO APP
// ==============================================================================
export function UseLayoutEffectDemo() {
  const [activeExample, setActiveExample] = useState('flicker');

  const examples = {
    flicker: <FlickerComparison />,
    measure: <MeasureBeforePaint />,
    scroll: <ScrollRestoration />,
    tooltip: <TooltipPositioning />,
    textarea: <AutoResizeTextarea />,
    antiPattern: <AntiPatternDataFetching />,
    focus: <FocusManagement />,
    animate: <AnimateOnMount />,
    customHook: <ElementSizeHook />,
    ssr: <SSRSafeExample />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>useLayoutEffect Hook Examples</h1>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#fff3cd', borderRadius: '4px' }}>
        <strong>⚠️ Warning:</strong> useLayoutEffect blocks painting. Use sparingly and prefer useEffect when possible.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select value={activeExample} onChange={(e) => setActiveExample(e.target.value)}>
          <option value="flicker">Flicker Comparison</option>
          <option value="measure">Measure DOM</option>
          <option value="scroll">Scroll Restoration</option>
          <option value="tooltip">Tooltip Positioning</option>
          <option value="textarea">Auto-resize Textarea</option>
          <option value="antiPattern">❌ Anti-Pattern: Data Fetching</option>
          <option value="focus">Focus Management</option>
          <option value="animate">Animate on Mount</option>
          <option value="customHook">Custom Hook: useElementSize</option>
          <option value="ssr">SSR-Safe</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {examples[activeExample]}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>💡 Tip:</strong> Open your browser console to see timing information
      </div>
    </div>
  );
}
