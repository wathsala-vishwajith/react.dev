import { useState, useEffect } from 'react';

/**
 * Example WITH Custom Hooks
 * Solution: Extract repetitive logic into a reusable custom hook
 * All components share the same logic through the custom hook
 */

// ============================================
// CUSTOM HOOK: useOnlineStatus
// ============================================
// Custom hooks must start with "use" prefix
// This hook encapsulates the online/offline logic
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// ============================================
// COMPONENTS USING THE CUSTOM HOOK
// ============================================

// Component 1: Status Indicator
function StatusIndicator() {
  const isOnline = useOnlineStatus(); // ✓ Clean and simple!

  return (
    <div style={{
      padding: '10px',
      backgroundColor: isOnline ? '#d4edda' : '#f8d7da',
      color: isOnline ? '#155724' : '#721c24',
      borderRadius: '5px',
      marginBottom: '10px'
    }}>
      {isOnline ? '✓ Online' : '✗ Offline'}
    </div>
  );
}

// Component 2: Save Button
function SaveButton() {
  const isOnline = useOnlineStatus(); // ✓ Same hook, no duplication!

  function handleClick() {
    console.log('Saving data...');
  }

  return (
    <button
      onClick={handleClick}
      disabled={!isOnline}
      style={{
        padding: '10px 20px',
        backgroundColor: isOnline ? '#007bff' : '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: isOnline ? 'pointer' : 'not-allowed',
        marginBottom: '10px'
      }}
    >
      {isOnline ? 'Save Progress' : 'Reconnecting...'}
    </button>
  );
}

// Component 3: Chat Status
function ChatStatus({ contact }) {
  const isOnline = useOnlineStatus(); // ✓ Reusing the same logic!

  return (
    <div style={{ padding: '10px', marginBottom: '10px' }}>
      <span style={{ fontWeight: 'bold' }}>{contact.name}</span>
      {' '}
      <span style={{ color: isOnline ? 'green' : 'red' }}>
        {isOnline ? '(online)' : '(offline - messages will be sent when reconnected)'}
      </span>
    </div>
  );
}

// Main App Component
export default function App() {
  const contacts = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Example WITH Custom Hooks</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Try disconnecting your internet to see the status change.
      </p>

      <h2>Benefits of this approach:</h2>
      <ul style={{ color: '#5cb85c', marginBottom: '30px' }}>
        <li>✅ Logic is written once and reused everywhere</li>
        <li>✅ Bug fixes only need to be made in one place</li>
        <li>✅ Easy to add new components that need online status</li>
        <li>✅ Custom hook can be easily tested in isolation</li>
        <li>✅ Components are more readable and focused on their purpose</li>
        <li>✅ Follows the DRY (Don't Repeat Yourself) principle</li>
      </ul>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <StatusIndicator />
        <SaveButton />

        <h3>Chat Contacts:</h3>
        {contacts.map(contact => (
          <ChatStatus key={contact.id} contact={contact} />
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        borderLeft: '4px solid #007bff',
        borderRadius: '5px'
      }}>
        <h3>💡 Key Takeaway:</h3>
        <p>
          The <code>useOnlineStatus</code> custom hook extracts the repetitive logic
          into a single reusable function. All three components now use the same hook,
          making the code more maintainable and easier to understand.
        </p>
      </div>
    </div>
  );
}
