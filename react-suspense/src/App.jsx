import { useState } from 'react';
import './App.css';
import Example1_BadUseEffect from './examples/Example1_BadUseEffect';
import Example2_GoodLazy from './examples/Example2_GoodLazy';
import Example3_GoodDataFetching from './examples/Example3_GoodDataFetching';

/**
 * Main App Component
 *
 * This app demonstrates when and how to use React Suspense:
 *
 * 1. Bad Example: useEffect data fetching (doesn't work with Suspense)
 * 2. Good Example: React.lazy for code splitting (perfect use case)
 * 3. Good Example: Suspense-enabled data fetching (advanced pattern)
 */

function App() {
  const [activeExample, setActiveExample] = useState('intro');

  return (
    <div className="app-container">
      <div className="header">
        <h1>React Suspense Examples</h1>
        <p>Learn when and how to use Suspense correctly</p>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          Based on <a href="https://react.dev/reference/react/Suspense" target="_blank" rel="noopener noreferrer">
            React.dev Suspense Documentation
          </a>
        </p>
      </div>

      <nav className="navigation">
        <button
          className={`nav-button ${activeExample === 'intro' ? 'active' : ''}`}
          onClick={() => setActiveExample('intro')}
        >
          📚 Introduction
        </button>
        <button
          className={`nav-button bad ${activeExample === 'bad-useeffect' ? 'active' : ''}`}
          onClick={() => setActiveExample('bad-useeffect')}
        >
          ❌ Bad: useEffect
        </button>
        <button
          className={`nav-button good ${activeExample === 'good-lazy' ? 'active' : ''}`}
          onClick={() => setActiveExample('good-lazy')}
        >
          ✅ Good: Lazy Loading
        </button>
        <button
          className={`nav-button good ${activeExample === 'good-data' ? 'active' : ''}`}
          onClick={() => setActiveExample('good-data')}
        >
          ✅ Good: Data Fetching
        </button>
      </nav>

      <main>
        {activeExample === 'intro' && <IntroSection />}
        {activeExample === 'bad-useeffect' && <Example1_BadUseEffect />}
        {activeExample === 'good-lazy' && <Example2_GoodLazy />}
        {activeExample === 'good-data' && <Example3_GoodDataFetching />}
      </main>

      <footer style={{
        marginTop: '3rem',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#888'
      }}>
        <p>
          Learn more at{' '}
          <a href="https://react.dev/reference/react/Suspense" target="_blank" rel="noopener noreferrer">
            React.dev
          </a>
        </p>
      </footer>
    </div>
  );
}

function IntroSection() {
  return (
    <div className="example-container">
      <div className="example-header">
        <h2>What is React Suspense?</h2>
      </div>

      <div className="explanation">
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
          <strong>Suspense</strong> is a React component that lets you display a fallback
          while its children are loading. It provides a declarative way to handle loading
          states in your application.
        </p>
      </div>

      <div className="user-card">
        <h3>✅ When to Use Suspense:</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>
            <strong>Lazy loading components</strong> with <code>React.lazy()</code>
            <br />
            <span style={{ fontSize: '0.9rem', color: '#888' }}>
              Perfect for code splitting and loading components on-demand
            </span>
          </li>
          <li>
            <strong>Data fetching with Suspense-enabled libraries</strong>
            <br />
            <span style={{ fontSize: '0.9rem', color: '#888' }}>
              Use with React Router, TanStack Query, SWR, Relay, or Apollo Client
            </span>
          </li>
          <li>
            <strong>Server Components</strong> (React Server Components)
            <br />
            <span style={{ fontSize: '0.9rem', color: '#888' }}>
              Built-in support in frameworks like Next.js
            </span>
          </li>
        </ul>
      </div>

      <div className="user-card">
        <h3>❌ When NOT to Use Suspense:</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>
            <strong>useEffect data fetching</strong>
            <br />
            <span style={{ fontSize: '0.9rem', color: '#888' }}>
              Suspense can't detect useEffect - it runs after render
            </span>
          </li>
          <li>
            <strong>Event handlers</strong> (onClick, onSubmit, etc.)
            <br />
            <span style={{ fontSize: '0.9rem', color: '#888' }}>
              Use loading states for user-triggered actions
            </span>
          </li>
          <li>
            <strong>Effects that modify DOM</strong>
            <br />
            <span style={{ fontSize: '0.9rem', color: '#888' }}>
              Suspense is for loading data/code, not side effects
            </span>
          </li>
        </ul>
      </div>

      <div className="explanation success">
        <h3>🎯 Key Principles:</h3>
        <ol style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>
            <strong>Suspense catches thrown promises</strong>
            <br />
            Components must throw promises during render for Suspense to work
          </li>
          <li>
            <strong>Declarative loading states</strong>
            <br />
            Move loading UI up to Suspense boundaries instead of component-level state
          </li>
          <li>
            <strong>Nested boundaries</strong>
            <br />
            Use multiple Suspense boundaries to load different parts independently
          </li>
          <li>
            <strong>Combine with Error Boundaries</strong>
            <br />
            Handle both loading and error states declaratively
          </li>
        </ol>
      </div>

      <div className="user-card" style={{ background: 'rgba(100, 108, 255, 0.1)' }}>
        <h3>📚 Learning Path:</h3>
        <p style={{ lineHeight: '1.8' }}>
          <strong>1. Start with "❌ Bad: useEffect"</strong>
          <br />
          Understand why traditional data fetching doesn't work with Suspense
        </p>
        <p style={{ lineHeight: '1.8' }}>
          <strong>2. Learn "✅ Good: Lazy Loading"</strong>
          <br />
          Master the most common use case - code splitting with React.lazy()
        </p>
        <p style={{ lineHeight: '1.8' }}>
          <strong>3. Explore "✅ Good: Data Fetching"</strong>
          <br />
          See how to properly integrate data fetching with Suspense
        </p>
      </div>

      <div className="explanation">
        <h3>📖 Additional Resources:</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>
            <a href="https://react.dev/reference/react/Suspense" target="_blank" rel="noopener noreferrer">
              Official Suspense Documentation
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/lazy" target="_blank" rel="noopener noreferrer">
              React.lazy() Documentation
            </a>
          </li>
          <li>
            <a href="https://tanstack.com/query/latest" target="_blank" rel="noopener noreferrer">
              TanStack Query (React Query)
            </a>
          </li>
          <li>
            <a href="https://swr.vercel.app/" target="_blank" rel="noopener noreferrer">
              SWR by Vercel
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
