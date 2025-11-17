import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

// ==============================================================================
// EXAMPLE 1: Basic DOM Access - Focus Input
// ==============================================================================
export function FocusInput() {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  const handleFocus = () => {
    inputRef.current.focus();
  };

  const handleClear = () => {
    setValue('');
    inputRef.current.focus();
  };

  return (
    <div>
      <h3>Focus Input Example</h3>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here..."
      />
      <button onClick={handleFocus}>Focus Input</button>
      <button onClick={handleClear}>Clear & Focus</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 2: Video Player Controls
// ==============================================================================
export function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    videoRef.current.pause();
    setIsPlaying(false);
  };

  const restart = () => {
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div>
      <h3>Video Player with Refs</h3>
      <video
        ref={videoRef}
        width="320"
        height="240"
        onEnded={() => setIsPlaying(false)}
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div>
        <button onClick={play} disabled={isPlaying}>Play</button>
        <button onClick={pause} disabled={!isPlaying}>Pause</button>
        <button onClick={restart}>Restart</button>
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 3: Timer with Interval ID
// ==============================================================================
export function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current !== null) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current === null) return;

    setIsRunning(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const reset = () => {
    pause();
    setCount(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h3>Timer (Storing Interval ID)</h3>
      <p style={{ fontSize: '2em' }}>{count}s</p>
      <button onClick={start} disabled={isRunning}>Start</button>
      <button onClick={pause} disabled={!isRunning}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 4: Tracking Previous Value
// ==============================================================================
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <h3>Track Previous Value</h3>
      <p>Current count: {count}</p>
      <p>Previous count: {prevCount}</p>
      <p>Change: {count - (prevCount || 0)}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 5: Render Counter
// ==============================================================================
export function RenderCounter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const renderCount = useRef(0);

  // This is OK - tracking renders for debugging
  renderCount.current += 1;

  return (
    <div>
      <h3>Render Counter</h3>
      <p>This component has rendered {renderCount.current} times</p>
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment Count</button>
      </div>
      <div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type to cause re-render..."
        />
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 6: Anti-Pattern - Using Ref for State
// ==============================================================================
export function BadRefUsage() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    console.log('Count:', countRef.current);
    // Component doesn't re-render - UI shows stale value!
  };

  return (
    <div>
      <h3>❌ Anti-Pattern: Using Ref for UI State</h3>
      <p>Count: {countRef.current} (This won't update!)</p>
      <button onClick={increment}>Increment (Check Console)</button>
      <p style={{ color: 'red' }}>⚠️ The count above doesn't update because refs don't trigger re-renders</p>
    </div>
  );
}

export function GoodStateUsage() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    console.log('Count:', count + 1);
  };

  return (
    <div>
      <h3>✅ Correct: Using State for UI Updates</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 7: Avoiding Stale Closures
// ==============================================================================
export function StaleClosureExample() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const handleDelayedLog = () => {
    setTimeout(() => {
      console.log('State value (stale):', count);
      console.log('Ref value (current):', countRef.current);
    }, 3000);
  };

  return (
    <div>
      <h3>Avoiding Stale Closures</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleDelayedLog}>Log After 3 Seconds</button>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Click "Log After 3 Seconds", then quickly increment the count.
        Check console to see the difference between state and ref values.
      </p>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 8: Scroll to Element
// ==============================================================================
export function ScrollToElement() {
  const topRef = useRef(null);
  const middleRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div>
      <h3>Scroll to Element</h3>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => scrollTo(topRef)}>Scroll to Top</button>
        <button onClick={() => scrollTo(middleRef)}>Scroll to Middle</button>
        <button onClick={() => scrollTo(bottomRef)}>Scroll to Bottom</button>
      </div>

      <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        <div ref={topRef} style={{ padding: '20px', background: '#e0f7fa' }}>
          Top Section
        </div>
        <div style={{ height: '150px', background: '#f0f0f0' }}>
          Spacer
        </div>
        <div ref={middleRef} style={{ padding: '20px', background: '#fff9c4' }}>
          Middle Section
        </div>
        <div style={{ height: '150px', background: '#f0f0f0' }}>
          Spacer
        </div>
        <div ref={bottomRef} style={{ padding: '20px', background: '#ffccbc' }}>
          Bottom Section
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 9: Click Outside Detection
// ==============================================================================
function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
}

export function ClickOutsideExample() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
      console.log('Clicked outside - closing');
    }
  });

  return (
    <div>
      <h3>Click Outside Detection</h3>
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button onClick={() => setIsOpen(!isOpen)}>
          Toggle Dropdown
        </button>
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            marginTop: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}>
            <p>Click outside to close</p>
            <button onClick={() => alert('Item clicked')}>Item 1</button>
            <button onClick={() => alert('Item clicked')}>Item 2</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 10: Measuring DOM Elements
// ==============================================================================
export function MeasureElement() {
  const elementRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [content, setContent] = useState('Short text');

  const measure = () => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect();
      setDimensions({ width: Math.round(width), height: Math.round(height) });
    }
  };

  useEffect(() => {
    measure();
  }, [content]);

  return (
    <div>
      <h3>Measure DOM Elements</h3>
      <div
        ref={elementRef}
        style={{
          padding: '20px',
          border: '2px solid blue',
          display: 'inline-block',
          maxWidth: '300px'
        }}
      >
        {content}
      </div>
      <p>Width: {dimensions.width}px, Height: {dimensions.height}px</p>
      <button onClick={() => setContent('Short text')}>Short Text</button>
      <button onClick={() => setContent('This is a much longer text that will change the dimensions of the element!')}>
        Long Text
      </button>
      <button onClick={measure}>Measure Now</button>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 11: Custom Hook - useTimeout
// ==============================================================================
function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

export function TimeoutExample() {
  const [message, setMessage] = useState('');
  const [delay, setDelay] = useState(2000);

  useTimeout(() => {
    setMessage(`Message shown after ${delay}ms!`);
  }, message ? null : delay);

  return (
    <div>
      <h3>useTimeout Custom Hook</h3>
      <p>{message || 'Waiting...'}</p>
      <button onClick={() => setMessage('')}>Reset</button>
      <div>
        <label>Delay: {delay}ms</label>
        <input
          type="range"
          min="1000"
          max="5000"
          step="500"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 12: forwardRef and useImperativeHandle
// ==============================================================================
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    },
    setValue: (value) => {
      inputRef.current.value = value;
    }
  }));

  return <input ref={inputRef} {...props} />;
});

export function ForwardRefExample() {
  const fancyInputRef = useRef();

  return (
    <div>
      <h3>forwardRef & useImperativeHandle</h3>
      <FancyInput ref={fancyInputRef} placeholder="Fancy input" />
      <div>
        <button onClick={() => fancyInputRef.current.focus()}>Focus</button>
        <button onClick={() => fancyInputRef.current.clear()}>Clear</button>
        <button onClick={() => fancyInputRef.current.setValue('Hello!')}>
          Set "Hello!"
        </button>
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 13: Ref Callback Pattern
// ==============================================================================
export function RefCallbackExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = (node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  };

  return (
    <div>
      <h3>Ref Callback Pattern</h3>
      <div ref={measuredRef} style={{ padding: '20px', background: '#e0e0e0' }}>
        <p>This element's height is measured on mount</p>
        <p>Height: {Math.round(height)}px</p>
      </div>
    </div>
  );
}

// ==============================================================================
// EXAMPLE 14: Multiple Refs
// ==============================================================================
export function MultipleRefs() {
  const [items] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  const itemRefs = useRef([]);

  const scrollToItem = (index) => {
    itemRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  };

  return (
    <div>
      <h3>Multiple Refs (Array of Refs)</h3>
      <div style={{ marginBottom: '10px' }}>
        {items.map((_, index) => (
          <button key={index} onClick={() => scrollToItem(index)}>
            Scroll to {index + 1}
          </button>
        ))}
      </div>
      <div style={{ height: '150px', overflow: 'auto', border: '1px solid #ccc' }}>
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => itemRefs.current[index] = el}
            style={{
              padding: '20px',
              margin: '10px',
              background: '#f0f0f0',
              border: '1px solid #ccc'
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// DEMO APP: Combines all examples
// ==============================================================================
export function UseRefDemo() {
  const [activeExample, setActiveExample] = useState('focus');

  const examples = {
    focus: <FocusInput />,
    video: <VideoPlayer />,
    timer: <Timer />,
    previous: <PreviousValue />,
    renderCount: <RenderCounter />,
    badRef: <BadRefUsage />,
    goodState: <GoodStateUsage />,
    stale: <StaleClosureExample />,
    scroll: <ScrollToElement />,
    clickOutside: <ClickOutsideExample />,
    measure: <MeasureElement />,
    timeout: <TimeoutExample />,
    forwardRef: <ForwardRefExample />,
    refCallback: <RefCallbackExample />,
    multipleRefs: <MultipleRefs />
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>useRef Hook Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Example: </label>
        <select value={activeExample} onChange={(e) => setActiveExample(e.target.value)}>
          <option value="focus">Focus Input</option>
          <option value="video">Video Player</option>
          <option value="timer">Timer (Interval ID)</option>
          <option value="previous">Track Previous Value</option>
          <option value="renderCount">Render Counter</option>
          <option value="badRef">❌ Bad Ref Usage</option>
          <option value="goodState">✅ Good State Usage</option>
          <option value="stale">Avoiding Stale Closures</option>
          <option value="scroll">Scroll to Element</option>
          <option value="clickOutside">Click Outside Detection</option>
          <option value="measure">Measure Element</option>
          <option value="timeout">useTimeout Hook</option>
          <option value="forwardRef">forwardRef Example</option>
          <option value="refCallback">Ref Callback</option>
          <option value="multipleRefs">Multiple Refs</option>
        </select>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        {examples[activeExample]}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>💡 Tip:</strong> Open your browser console to see additional logging and behavior
      </div>
    </div>
  );
}
