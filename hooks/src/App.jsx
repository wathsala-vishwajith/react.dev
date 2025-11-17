import React, { useState } from 'react';

// Import all demo components
import { UseStateDemo } from '../useState/examples';
import { UseEffectDemo } from '../useEffect/examples';
import { UseContextDemo } from '../useContext/examples';
import { UseRefDemo } from '../useRef/examples';
import { UseReducerDemo } from '../useReducer/examples';
import { UseMemoDemo } from '../useMemo/examples';
import { UseCallbackDemo } from '../useCallback/examples';
import { UseLayoutEffectDemo } from '../useLayoutEffect/examples';
import { CustomHooksDemo } from '../custom-hooks/examples';

function App() {
  const [selectedHook, setSelectedHook] = useState('useState');

  const hooks = {
    useState: {
      title: 'useState',
      component: <UseStateDemo />,
      description: 'Manage component state'
    },
    useEffect: {
      title: 'useEffect',
      component: <UseEffectDemo />,
      description: 'Side effects and lifecycle'
    },
    useContext: {
      title: 'useContext',
      component: <UseContextDemo />,
      description: 'Access context values'
    },
    useRef: {
      title: 'useRef',
      component: <UseRefDemo />,
      description: 'DOM access and mutable refs'
    },
    useReducer: {
      title: 'useReducer',
      component: <UseReducerDemo />,
      description: 'Complex state management'
    },
    useMemo: {
      title: 'useMemo',
      component: <UseMemoDemo />,
      description: 'Memoize expensive calculations'
    },
    useCallback: {
      title: 'useCallback',
      component: <UseCallbackDemo />,
      description: 'Memoize callback functions'
    },
    useLayoutEffect: {
      title: 'useLayoutEffect',
      component: <UseLayoutEffectDemo />,
      description: 'Synchronous layout effects'
    },
    customHooks: {
      title: 'Custom Hooks',
      component: <CustomHooksDemo />,
      description: 'Reusable custom hooks'
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>
            ⚛️ React Hooks - Comprehensive Guide
          </h1>
          <p style={{ fontSize: '1.1em', opacity: 0.9 }}>
            Interactive examples, best practices, and anti-patterns
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '10px 0'
        }}>
          {Object.entries(hooks).map(([key, { title, description }]) => (
            <button
              key={key}
              onClick={() => setSelectedHook(key)}
              style={{
                background: selectedHook === key ? '#667eea' : 'transparent',
                color: selectedHook === key ? 'white' : '#333',
                padding: '10px 20px',
                border: selectedHook === key ? 'none' : '1px solid #e0e0e0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedHook === key ? 'bold' : 'normal',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
              title={description}
            >
              {title}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Info Panel */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '10px', color: '#667eea' }}>
            {hooks[selectedHook].title}
          </h2>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            {hooks[selectedHook].description}
          </p>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            fontSize: '14px',
            color: '#666'
          }}>
            <span>📚 <a
              href={`./${selectedHook}/README.md`}
              style={{ color: '#667eea', textDecoration: 'none' }}
            >
              Documentation
            </a></span>
            <span>💻 <a
              href={`./${selectedHook}/examples.jsx`}
              style={{ color: '#667eea', textDecoration: 'none' }}
            >
              Source Code
            </a></span>
          </div>
        </div>

        {/* Demo Component */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {hooks[selectedHook].component}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid #e0e0e0',
        padding: '30px 20px',
        marginTop: '40px',
        textAlign: 'center',
        color: '#666'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>React Hooks Learning Resource</strong>
          </p>
          <p style={{ fontSize: '14px' }}>
            Comprehensive examples with best practices and anti-patterns
          </p>
          <p style={{ fontSize: '12px', marginTop: '20px', opacity: 0.7 }}>
            Open your browser console to see additional logging and behavior
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
