import React, { useState } from 'react';
import ExampleCard from './components/ExampleCard';

// Import correct examples (incorrect examples are shown as code, not executed)
import {
  ConditionalHookCorrect,
  EarlyReturnCorrect,
  ConditionalRenderCorrect
} from './correct/ConditionalHook';
import {
  LoopHookCorrect,
  ArrayStateCorrect,
  ComponentPerItemCorrect
} from './correct/LoopHook';
import {
  NestedFunctionHookCorrect,
  CallbackHookCorrect,
  CustomHookExample
} from './correct/NestedFunctionHook';
import {
  CounterComponent,
  CounterWithCustomHook,
  ShoppingCart,
  ShoppingCartWithHook
} from './correct/RegularFunctionHook';

function App() {
  const [activeTab, setActiveTab] = useState('conditional');

  const sampleItems = ['Apple', 'Banana', 'Cherry'];
  const sampleColors = ['red', 'blue', 'green', 'yellow'];
  const cartItems = [
    { name: 'Item 1', price: 29.99 },
    { name: 'Item 2', price: 49.99 },
    { name: 'Item 3', price: 19.99 }
  ];

  const tabs = [
    { id: 'conditional', label: 'Conditional Hooks' },
    { id: 'loops', label: 'Loops & Arrays' },
    { id: 'nested', label: 'Nested Functions' },
    { id: 'regular', label: 'Function Types' }
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Rules of Hooks: Interactive Guide</h1>
        <p style={{ fontSize: '18px', color: '#555' }}>
          Learn the correct way to use React Hooks
        </p>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e6f3ff', borderRadius: '8px' }}>
          <h3>The Two Rules of Hooks:</h3>
          <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            <li><strong>Only Call Hooks at the Top Level</strong> - Don't call hooks inside loops, conditions, or nested functions</li>
            <li><strong>Only Call Hooks from React Functions</strong> - Only call hooks from React function components or custom hooks</li>
          </ol>
        </div>
      </header>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #e0e0e0' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#4299e1' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conditional Hooks Tab */}
      {activeTab === 'conditional' && (
        <section>
          <h2>Rule 1: Don't Call Hooks Conditionally</h2>

          <ExampleCard
            title="INCORRECT: Hook Inside Condition"
            type="incorrect"
            description="This code will break because the number of hooks changes between renders"
          >
            <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`function ConditionalHookIncorrect({ isLoggedIn }) {
  // ❌ WRONG: Hook called conditionally
  if (isLoggedIn) {
    const [user, setUser] = useState(null);
  }
  return <div>Conditional Hook Example</div>;
}`}
            </pre>
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Hook at Top Level"
            type="correct"
            description="Always call hooks first, then handle conditional logic"
          >
            <ConditionalHookCorrect isLoggedIn={true} />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Early Return After Hooks"
            type="correct"
            description="All hooks must be called before any early returns"
          >
            <EarlyReturnCorrect shouldRender={true} />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Conditional Rendering"
            type="correct"
            description="Use conditional rendering in JSX instead of conditional hooks"
          >
            <ConditionalRenderCorrect isLoading={false} />
          </ExampleCard>
        </section>
      )}

      {/* Loops Tab */}
      {activeTab === 'loops' && (
        <section>
          <h2>Rule 1: Don't Call Hooks in Loops</h2>

          <ExampleCard
            title="INCORRECT: Hook Inside Loop"
            type="incorrect"
            description="The number of hooks must be consistent across renders"
          >
            <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`function LoopHookIncorrect({ items }) {
  const states = [];

  // ❌ WRONG: Hook called inside a loop
  for (let i = 0; i < items.length; i++) {
    const [value, setValue] = useState(items[i]);
    states.push([value, setValue]);
  }

  return <div>Loop Hook Example</div>;
}`}
            </pre>
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Single State Object"
            type="correct"
            description="Use one state to hold all values instead of multiple useState calls"
          >
            <LoopHookCorrect items={sampleItems} />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Array State"
            type="correct"
            description="Use an array in state to manage multiple selections"
          >
            <ArrayStateCorrect initialColors={sampleColors} />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Component Per Item"
            type="correct"
            description="Create separate components - each instance gets its own hooks"
          >
            <ComponentPerItemCorrect colors={sampleColors} />
          </ExampleCard>
        </section>
      )}

      {/* Nested Functions Tab */}
      {activeTab === 'nested' && (
        <section>
          <h2>Rule 1: Don't Call Hooks in Nested Functions</h2>

          <ExampleCard
            title="INCORRECT: Hook in Event Handler"
            type="incorrect"
            description="Hooks cannot be called inside event handlers or callbacks"
          >
            <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`function NestedFunctionHookIncorrect() {
  function handleClick() {
    // ❌ WRONG: Hook called inside an event handler
    const [count, setCount] = useState(0);
    setCount(count + 1);
  }

  return <button onClick={handleClick}>Click Me</button>;
}`}
            </pre>
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Hooks at Top Level"
            type="correct"
            description="Define state at the top level, update it from event handlers"
          >
            <NestedFunctionHookCorrect />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: State Updates in Callbacks"
            type="correct"
            description="Callbacks should only update state, not create new state"
          >
            <CallbackHookCorrect />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Custom Hook"
            type="correct"
            description="Extract complex logic into custom hooks"
          >
            <CustomHookExample />
          </ExampleCard>
        </section>
      )}

      {/* Function Types Tab */}
      {activeTab === 'regular' && (
        <section>
          <h2>Rule 2: Only Call Hooks from React Functions</h2>

          <ExampleCard
            title="INCORRECT: Hook in Regular Function"
            type="incorrect"
            description="Hooks can only be called from React components or custom hooks"
          >
            <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// ❌ WRONG: This is a regular function, not a React component
function regularFunction() {
  const [count, setCount] = useState(0);
  return count;
}

// ❌ WRONG: Utility function trying to use hooks
function calculateTotal(items) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + item.price, 0);
    setTotal(sum);
  }, [items]);
  return total;
}`}
            </pre>
          </ExampleCard>

          <ExampleCard
            title="CORRECT: React Function Component"
            type="correct"
            description="React components (capitalized) can use hooks"
          >
            <CounterComponent />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Custom Hook"
            type="correct"
            description="Custom hooks (starting with 'use') can call other hooks"
          >
            <CounterWithCustomHook />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Component with Utility Function"
            type="correct"
            description="Use regular functions for calculations, hooks for state"
          >
            <ShoppingCart items={cartItems} />
          </ExampleCard>

          <ExampleCard
            title="CORRECT: Custom Hook with Logic"
            type="correct"
            description="Combine custom hooks with utility functions"
          >
            <ShoppingCartWithHook items={cartItems} />
          </ExampleCard>
        </section>
      )}

      <footer style={{ marginTop: '60px', padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px', textAlign: 'center' }}>
        <h3>Key Takeaways</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
          <li>✅ Always call hooks at the top level of your component</li>
          <li>✅ Call all hooks before any conditional returns</li>
          <li>✅ Never call hooks inside loops, conditions, or nested functions</li>
          <li>✅ Only call hooks from React function components or custom hooks</li>
          <li>✅ Custom hooks must start with "use"</li>
          <li>✅ Use regular functions for calculations, hooks for state and effects</li>
        </ul>
        <p style={{ marginTop: '20px' }}>
          <a href="https://react.dev/reference/rules/rules-of-hooks" target="_blank" rel="noopener noreferrer">
            📚 Read the official documentation
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
