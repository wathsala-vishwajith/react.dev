import { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * EVENT BUBBLING WITH PORTALS
 *
 * This example demonstrates one of the most important and often misunderstood
 * aspects of portals: EVENT BUBBLING.
 *
 * Key Concept:
 * - In the DOM tree: Portal content is in a completely different location
 * - In the React tree: Portal content is still a child of its parent component
 * - Events bubble through the REACT tree, not the DOM tree!
 *
 * This is a crucial feature that makes portals "just work" with React's
 * event system.
 */

// ============================================
// MODAL WITH EVENT DEMO
// ============================================

/**
 * Modal Component
 * This modal is rendered via portal but still participates
 * in React's event bubbling system
 */
function EventDemoModal({ isOpen, onClose, onModalClick, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevent backdrop click
          onModalClick(); // Call the handler passed from parent
        }}
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '500px',
          width: '90%',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

// ============================================
// DEMONSTRATION COMPONENTS
// ============================================

/**
 * Demo 1: Event Bubbling Through Portals
 *
 * This demonstrates that clicks inside a portal bubble up to
 * React parent components, even though the DOM structure is different
 */
function BubblingDemo() {
  const [clickLog, setClickLog] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addLog = (message, color) => {
    const timestamp = new Date().toLocaleTimeString();
    setClickLog(prev => [...prev, { message, color, timestamp }]);
  };

  /**
   * This click handler is on the parent component
   * It will be triggered even when clicking inside the portal modal!
   */
  const handleParentClick = () => {
    addLog('🔵 Parent component clicked (event bubbled from portal!)', '#2196f3');
  };

  const handleModalClick = () => {
    addLog('🟢 Modal clicked (inside portal)', '#4caf50');
    // Event will bubble to parent after this
  };

  const handleButtonClick = () => {
    addLog('🟡 Button clicked (normal event)', '#ff9800');
  };

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px'
    }}>
      <h3>Demo 1: Event Bubbling Through Portals</h3>

      <div style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '2px dashed #2196f3'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>The Experiment:</strong> This blue box has an onClick handler.
          Click the button below to open a modal. Then click inside the modal
          and watch what happens!
        </p>

        {/* Parent with click handler */}
        <div
          onClick={handleParentClick}
          style={{
            backgroundColor: '#e3f2fd',
            padding: '20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
            📦 Parent Component (click me or click inside the modal)
          </p>

          <button
            onClick={handleButtonClick}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Click Me (normal button)
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Open Modal (portal)
          </button>

          {/* Modal rendered via portal */}
          <EventDemoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onModalClick={handleModalClick}
          >
            <h3 style={{ color: '#4caf50' }}>Portal Modal</h3>
            <p>
              This modal is rendered to <code>#modal-root</code> via portal,
              which is OUTSIDE the parent component in the DOM.
            </p>
            <p>
              But when you click this text or anywhere inside the modal,
              the event bubbles up through the <strong>React tree</strong>
              to the parent component!
            </p>
            <button
              onClick={() => addLog('🟣 Inner button clicked', '#9c27b0')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Click Me Too!
            </button>
          </EventDemoModal>
        </div>
      </div>

      {/* Event Log */}
      <div style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '4px',
        maxHeight: '200px',
        overflow: 'auto',
        border: '1px solid #ddd'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <strong>Event Log:</strong>
          <button
            onClick={() => setClickLog([])}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Clear Log
          </button>
        </div>
        {clickLog.length === 0 ? (
          <p style={{ color: '#999', margin: 0 }}>
            Click the buttons to see events logged here...
          </p>
        ) : (
          clickLog.map((log, index) => (
            <div
              key={index}
              style={{
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: '#f9f9f9',
                borderLeft: `3px solid ${log.color}`,
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
            >
              <span style={{ color: '#999', marginRight: '10px' }}>
                {log.timestamp}
              </span>
              {log.message}
            </div>
          ))
        )}
      </div>

      <div style={{
        backgroundColor: '#e7f3ff',
        padding: '15px',
        borderRadius: '4px',
        marginTop: '20px'
      }}>
        <strong>💡 What's Happening:</strong>
        <ul style={{ marginBottom: 0, marginTop: '10px' }}>
          <li>
            When you click inside the modal, the event handler inside the modal fires first
          </li>
          <li>
            Then the event bubbles up through the <strong>React component tree</strong>
          </li>
          <li>
            The parent component's onClick handler receives the event, even though
            the modal is in a different part of the DOM
          </li>
          <li>
            This is why <code>e.stopPropagation()</code> works with portals!
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Demo 2: Comparing DOM vs React Trees
 *
 * Visual representation showing the difference between DOM structure
 * and React component tree
 */
function TreeComparisonDemo() {
  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px'
    }}>
      <h3>Demo 2: DOM Tree vs React Tree</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* DOM Tree */}
        <div style={{
          backgroundColor: '#ffebee',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h4 style={{ marginTop: 0, color: '#d32f2f' }}>❌ DOM Tree (Physical)</h4>
          <pre style={{
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '13px',
            overflow: 'auto'
          }}>
{`<body>
  <div id="root">
    <div class="app">
      <div class="parent">
        <button>Open Modal</button>
      </div>
    </div>
  </div>

  <div id="modal-root">
    <div class="modal">
      <p>Modal Content</p>
    </div>
  </div>
</body>`}
          </pre>
          <p style={{ fontSize: '14px', color: '#666' }}>
            In the DOM, the modal is a sibling of the app root,
            completely separate from the parent component.
          </p>
        </div>

        {/* React Tree */}
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h4 style={{ marginTop: 0, color: '#2e7d32' }}>✅ React Tree (Logical)</h4>
          <pre style={{
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '13px',
            overflow: 'auto'
          }}>
{`<App>
  <Parent onClick={handleClick}>
    <button>Open Modal</button>

    <Portal target="#modal-root">
      <Modal>
        <p>Modal Content</p>
      </Modal>
    </Portal>
  </Parent>
</App>`}
          </pre>
          <p style={{ fontSize: '14px', color: '#666' }}>
            In React's component tree, the Modal is still a child
            of Parent, so events bubble normally!
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '4px',
        marginTop: '20px',
        borderLeft: '4px solid #ffc107'
      }}>
        <strong>🎯 Key Insight:</strong> Portals let you break out of the DOM hierarchy
        while preserving the React component hierarchy. This is the best of both worlds:
        <ul style={{ marginBottom: 0, marginTop: '10px' }}>
          <li><strong>DOM-wise:</strong> Escape parent constraints (overflow, z-index, etc.)</li>
          <li><strong>React-wise:</strong> Props, context, and events work normally</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function EventBubblingExample() {
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Event Bubbling with Portals</h2>

      <div style={{
        backgroundColor: '#9c27b0',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>🎭 The Magic of Portal Event Bubbling</h3>
        <p>
          One of the most powerful features of portals is that events bubble through
          the <strong>React component tree</strong>, not the DOM tree. This means:
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li>A parent can catch events from a portal child with onClick, onSubmit, etc.</li>
          <li>Event propagation works exactly as if the portal wasn't there</li>
          <li>You can use e.stopPropagation() to control bubbling as usual</li>
          <li>Context providers work across portal boundaries</li>
        </ul>
      </div>

      <BubblingDemo />
      <TreeComparisonDemo />

      {/* Best Practices */}
      <div style={{
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>✅ Best Practices for Portal Events</h3>
        <ol style={{ marginBottom: 0 }}>
          <li>
            <strong>Use e.stopPropagation() intentionally:</strong> Click on the
            modal content should stop propagation to prevent closing the modal
          </li>
          <li>
            <strong>Leverage event bubbling:</strong> Let parent components handle
            events from portals when it makes sense
          </li>
          <li>
            <strong>Be aware of the boundary:</strong> Events bubble through React
            tree, not DOM tree - this is usually what you want!
          </li>
          <li>
            <strong>Test your event handlers:</strong> Make sure clicks bubble
            (or don't bubble) as intended
          </li>
          <li>
            <strong>Use refs when needed:</strong> For direct DOM manipulation,
            refs still work across portals
          </li>
        </ol>
      </div>
    </div>
  );
}
