import { useState } from 'react';
import Example1_BadMonolithic from './examples/Example1_BadMonolithic';
import Example2_BadState from './examples/Example2_BadState';
import Example3_GoodStatic from './examples/Example3_GoodStatic';
import Example4_GoodComplete from './examples/Example4_GoodComplete';
import './App.css';

/**
 * Main App - Navigate between different examples
 */
function App() {
  const [currentExample, setCurrentExample] = useState('example4');

  const examples = [
    {
      id: 'example1',
      title: '❌ Bad: Monolithic Component',
      description: 'Everything in one component - hard to maintain',
      component: Example1_BadMonolithic,
      type: 'bad'
    },
    {
      id: 'example2',
      title: '❌ Bad: Improper State Management',
      description: 'State scattered everywhere, duplicated data',
      component: Example2_BadState,
      type: 'bad'
    },
    {
      id: 'example3',
      title: '✅ Good: Static Version',
      description: 'Proper component hierarchy, no state yet',
      component: Example3_GoodStatic,
      type: 'good'
    },
    {
      id: 'example4',
      title: '✅ Good: Complete Implementation',
      description: 'Perfect state management and data flow',
      component: Example4_GoodComplete,
      type: 'good'
    }
  ];

  const CurrentComponent = examples.find(ex => ex.id === currentExample)?.component;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#282c34',
        padding: '20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>
          Thinking in React - Interactive Examples
        </h1>
        <p style={{ margin: '0', opacity: 0.8 }}>
          Learn React best practices by comparing bad and good approaches
        </p>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setCurrentExample(example.id)}
              style={{
                padding: '15px',
                border: currentExample === example.id
                  ? '2px solid #61dafb'
                  : '2px solid #ddd',
                borderRadius: '8px',
                backgroundColor: currentExample === example.id
                  ? '#f0f9ff'
                  : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (currentExample !== example.id) {
                  e.target.style.borderColor = '#61dafb';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentExample !== example.id) {
                  e.target.style.borderColor = '#ddd';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{
                fontWeight: 'bold',
                marginBottom: '5px',
                fontSize: '14px'
              }}>
                {example.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666'
              }}>
                {example.description}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {CurrentComponent && <CurrentComponent />}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#282c34',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p style={{ margin: '0', opacity: 0.8 }}>
          Based on the official{' '}
          <a
            href="https://react.dev/learn/thinking-in-react"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#61dafb', textDecoration: 'none' }}
          >
            Thinking in React
          </a>
          {' '}tutorial
        </p>
      </footer>
    </div>
  );
}

export default App;
