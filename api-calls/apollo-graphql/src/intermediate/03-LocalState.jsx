import { useState } from 'react';
import { useQuery, gql, useReactiveVar, makeVar } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';

// Create a reactive variable for local state
export const selectedUserIdVar = makeVar(null);
export const themeVar = makeVar('light');

// Local-only field query
const GET_USERS_WITH_LOCAL = gql`
  query GetUsersWithLocal {
    users {
      id
      name
      email
      role
      isSelected @client
    }
  }
`;

export default function LocalState() {
  const selectedUserId = useReactiveVar(selectedUserIdVar);
  const theme = useReactiveVar(themeVar);

  const { loading, data } = useQuery(GET_USERS);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={{ ...styles.container, backgroundColor: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
      <h2>Local State Management</h2>
      <p style={styles.description}>
        Apollo Client can manage local state alongside remote data using reactive variables.
        This example shows theme switching and selection state.
      </p>

      <div style={styles.controls}>
        <button
          onClick={() => themeVar(theme === 'light' ? 'dark' : 'light')}
          style={styles.button}
        >
          Toggle Theme (Current: {theme})
        </button>
        <button
          onClick={() => selectedUserIdVar(null)}
          style={styles.button}
          disabled={!selectedUserId}
        >
          Clear Selection
        </button>
      </div>

      <div style={styles.userList}>
        {data.users.map(user => (
          <div
            key={user.id}
            style={{
              ...styles.userCard,
              ...(selectedUserId === user.id ? styles.selected : {}),
              backgroundColor: theme === 'dark' ? '#444' : '#fff',
            }}
            onClick={() => selectedUserIdVar(user.id)}
          >
            <h4>{user.name}</h4>
            <p>{user.email}</p>
            {selectedUserId === user.id && <span style={styles.checkmark}>✓ Selected</span>}
          </div>
        ))}
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>Reactive Variables:</strong> Local state that triggers re-renders</li>
          <li><strong>makeVar():</strong> Create a reactive variable</li>
          <li><strong>useReactiveVar():</strong> Subscribe to reactive variable changes</li>
          <li><strong>@client directive:</strong> Query local-only fields</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '900px', margin: '0 auto', minHeight: '100vh', transition: 'all 0.3s' },
  description: { backgroundColor: 'rgba(227, 242, 253, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  controls: { display: 'flex', gap: '10px', marginBottom: '20px' },
  button: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '40px' },
  userList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' },
  userCard: { border: '2px solid #ddd', borderRadius: '8px', padding: '15px', cursor: 'pointer', transition: 'all 0.2s' },
  selected: { borderColor: '#007bff', backgroundColor: '#e7f3ff' },
  checkmark: { color: '#007bff', fontWeight: 'bold', display: 'block', marginTop: '10px' },
  info: { backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px' },
};
