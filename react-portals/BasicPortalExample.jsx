import { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * BASIC PORTAL EXAMPLE: Modal Dialog
 *
 * This example demonstrates the most common use case for portals: creating modals.
 * Portals allow you to render content outside the parent component's DOM hierarchy
 * while maintaining the React component tree relationship.
 */

// ============================================
// MODAL COMPONENT (Using Portal)
// ============================================

/**
 * Modal Component
 *
 * This modal uses createPortal to render its content in a different part of the DOM.
 * Even though it's rendered outside the parent component in the DOM, it still:
 * - Receives props from the parent
 * - Can call parent functions (like onClose)
 * - Participates in React's event bubbling
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback to close the modal
 * @param {React.ReactNode} props.children - Modal content
 */
function Modal({ isOpen, onClose, children }) {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  /**
   * createPortal takes two arguments:
   * 1. The JSX you want to render (the modal content)
   * 2. The DOM node where you want to render it
   *
   * Here we're rendering to #modal-root which is defined in index.html
   * This is OUTSIDE the #root div where the rest of our app lives
   */
  return createPortal(
    <>
      {/* BACKDROP: Semi-transparent overlay that covers the entire screen */}
      <div
        onClick={onClose} // Clicking backdrop closes the modal
        style={{
          position: 'fixed',     // Fixed positioning to cover viewport
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
          display: 'flex',       // Flexbox for centering
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000          // High z-index to appear above other content
        }}
      >
        {/* MODAL CONTENT: The actual modal box */}
        <div
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px 10px'
            }}
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Modal content passed as children */}
          {children}
        </div>
      </div>
    </>,
    // This is the key part! We're rendering to a different DOM node
    document.getElementById('modal-root')
  );
}

// ============================================
// EXAMPLE APP COMPONENT
// ============================================

/**
 * Main App Component
 * Demonstrates how to use the Modal component
 */
export default function BasicPortalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [formName, setFormName] = useState('');

  /**
   * Handle form submission
   * In a real app, this might send data to a server
   */
  const handleSubmit = () => {
    setSubmittedName(formName);
    setFormName(''); // Clear the form
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Basic Portal Example: Modal Dialog</h2>

      {/* EDUCATIONAL CONTENT */}
      <div style={{
        backgroundColor: '#e7f3ff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        borderLeft: '4px solid #2196F3'
      }}>
        <h3>What's Happening Here?</h3>
        <p>
          When you click the button below, a modal opens. This modal is rendered using{' '}
          <code>createPortal</code>, which means:
        </p>
        <ul>
          <li>
            <strong>DOM Location:</strong> The modal is rendered in{' '}
            <code>#modal-root</code>, which is OUTSIDE the main{' '}
            <code>#root</code> div in the HTML
          </li>
          <li>
            <strong>React Tree:</strong> Despite being in a different DOM location,
            it's still part of the React component tree and receives props normally
          </li>
          <li>
            <strong>Styling Benefits:</strong> Being at the root level means it's
            not affected by parent container styles (overflow, z-index, etc.)
          </li>
        </ul>
      </div>

      {/* DEMO SECTION */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Try It Out:</h3>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Open Modal
        </button>

        {submittedName && (
          <div style={{
            padding: '15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '5px',
            marginTop: '20px'
          }}>
            <strong>Success!</strong> You submitted: {submittedName}
          </div>
        )}
      </div>

      {/* INSPECTION TIP */}
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '8px',
        borderLeft: '4px solid #ffc107'
      }}>
        <strong>🔍 Developer Tip:</strong> Open your browser's DevTools and inspect
        the modal when it's open. You'll see it's rendered inside{' '}
        <code>&lt;div id="modal-root"&gt;</code>, not inside the{' '}
        <code>&lt;div id="root"&gt;</code> where this component lives!
      </div>

      {/* MODAL COMPONENT USAGE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 style={{ marginTop: '0', color: '#2196F3' }}>
          Welcome to Portals!
        </h2>

        <p style={{ color: '#666', lineHeight: '1.6' }}>
          This modal is rendered using <code>createPortal</code>. Even though
          it appears to be a child of the button that opened it in the React
          component tree, in the actual DOM it's rendered at the document root level.
        </p>

        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Enter your name:
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Your name"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && formName.trim()) {
                handleSubmit();
              }
            }}
          />
        </div>

        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f5f5f5',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formName.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: formName.trim() ? '#2196F3' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: formName.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}
