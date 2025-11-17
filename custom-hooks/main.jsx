import React from 'react';
import ReactDOM from 'react-dom/client';

// Import all examples
import WithoutCustomHooks from './WithoutCustomHooks.jsx';
import WithCustomHooks from './WithCustomHooks.jsx';
import AdvancedExample from './AdvancedExample.jsx';

// Example selector component
function ExampleSelector() {
  const [selectedExample, setSelectedExample] = React.useState('with');

  const examples = {
    without: { component: WithoutCustomHooks, label: '❌ Without Custom Hooks' },
    with: { component: WithCustomHooks, label: '✅ With Custom Hooks' },
    advanced: { component: AdvancedExample, label: '🚀 Advanced Examples' }
  };

  const SelectedComponent = examples[selectedExample].component;

  return (
    <div>
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#282c34',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ color: 'white', fontWeight: 'bold', marginRight: '10px' }}>
            Select Example:
          </span>
          {Object.entries(examples).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setSelectedExample(key)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedExample === key ? '#61dafb' : '#4a4a4a',
                color: selectedExample === key ? '#282c34' : 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedExample === key ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <SelectedComponent />
    </div>
  );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExampleSelector />
  </React.StrictMode>
);
