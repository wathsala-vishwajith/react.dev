import { useState, useEffect } from 'react';

/**
 * Example WITHOUT Custom Hooks
 * Problem: Logic is duplicated across multiple components
 * Each component must implement the same online/offline logic
 */

// Component 1: Status Indicator
function StatusIndicator() {
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
  const [isOnline, setIsOnline] = useState(true);

  // DUPLICATE LOGIC - Same as StatusIndicator
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
  const [isOnline, setIsOnline] = useState(true);

  // DUPLICATE LOGIC AGAIN - Same as above components
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
      <h1>Example WITHOUT Custom Hooks</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Try disconnecting your internet to see the status change.
      </p>

      <h2>Problems with this approach:</h2>
      <ul style={{ color: '#d9534f', marginBottom: '30px' }}>
        <li>❌ Online/offline logic is duplicated in 3 components</li>
        <li>❌ If we need to fix a bug, we must update all 3 places</li>
        <li>❌ Adding new online-aware components requires copying the logic again</li>
        <li>❌ Hard to test the online/offline behavior</li>
        <li>❌ Violates the DRY (Don't Repeat Yourself) principle</li>
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
    </div>
  );
}
