import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import BasicPortalExample from './BasicPortalExample';
import WithoutPortal from './WithoutPortal';
import AdvancedPortalExample from './AdvancedPortalExample';
import EventBubblingExample from './EventBubblingExample';

/**
 * Main App Component
 * Allows switching between different portal examples
 */
function App() {
  const [activeExample, setActiveExample] = useState('basic');

  const examples = {
    basic: { component: BasicPortalExample, title: 'Basic Portal (Modal)' },
    without: { component: WithoutPortal, title: 'Without Portal (Problem)' },
    advanced: { component: AdvancedPortalExample, title: 'Advanced Portals' },
    events: { component: EventBubblingExample, title: 'Event Bubbling' }
  };

  const ActiveComponent = examples[activeExample].component;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Navigation */}
      <div style={{
        backgroundColor: '#282c34',
        padding: '20px',
        color: 'white',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 20px 0' }}>React Portals Examples</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.entries(examples).map(([key, { title }]) => (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeExample === key ? '#61dafb' : '#4a4e57',
                color: activeExample === key ? '#282c34' : 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: activeExample === key ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Example */}
      <ActiveComponent />
    </div>
  );
}

// Mount the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
