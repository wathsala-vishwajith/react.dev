import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS, GET_USER } from '../graphql/queries';

/**
 * BEGINNER EXAMPLE 2: Query with Variables
 *
 * Learn how to:
 * - Pass variables to GraphQL queries
 * - Use the skip option to conditionally execute queries
 * - Handle multiple queries in one component
 */

export default function QueryWithVariables() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  // First query: Get all users (no variables)
  const { loading: usersLoading, data: usersData } = useQuery(GET_USERS);

  // Second query: Get a specific user with variables
  // skip: true prevents the query from executing when no user is selected
  const { loading: userLoading, error: userError, data: userData } = useQuery(
    GET_USER,
    {
      variables: { id: selectedUserId },
      skip: !selectedUserId, // Only execute when we have a user ID
    }
  );

  if (usersLoading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Query with Variables Example</h2>
      <p style={styles.description}>
        This example shows how to pass variables to GraphQL queries.
        Click on a user to fetch their detailed information using a
        query variable.
      </p>

      <div style={styles.queryBox}>
        <h4>GraphQL Query with Variable:</h4>
        <pre style={styles.code}>{`query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    role
  }
}`}</pre>
        <p style={styles.variableNote}>
          <strong>Variable:</strong> {selectedUserId ? `{ id: "${selectedUserId}" }` : 'None selected'}
        </p>
      </div>

      <div style={styles.columns}>
        {/* Users List */}
        <div style={styles.column}>
          <h3>Users List</h3>
          <div style={styles.usersList}>
            {usersData.users.map(user => (
              <button
                key={user.id}
                style={{
                  ...styles.userButton,
                  ...(selectedUserId === user.id ? styles.selectedButton : {}),
                }}
                onClick={() => setSelectedUserId(user.id)}
              >
                <div style={styles.userName}>{user.name}</div>
                <div style={styles.userEmail}>{user.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* User Details */}
        <div style={styles.column}>
          <h3>User Details</h3>
          {!selectedUserId && (
            <div style={styles.placeholder}>
              <p>👈 Select a user to view details</p>
            </div>
          )}

          {selectedUserId && userLoading && (
            <div style={styles.loading}>Loading user details...</div>
          )}

          {selectedUserId && userError && (
            <div style={styles.error}>Error: {userError.message}</div>
          )}

          {selectedUserId && userData && (
            <div style={styles.detailsCard}>
              <h4>{userData.user.name}</h4>
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <strong>ID:</strong> {userData.user.id}
                </div>
                <div style={styles.detailItem}>
                  <strong>Email:</strong> {userData.user.email}
                </div>
                <div style={styles.detailItem}>
                  <strong>Role:</strong>{' '}
                  <span style={styles.badge}>{userData.user.role}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li>
            <strong>Variables:</strong> Pass dynamic values to queries using the variables option
          </li>
          <li>
            <strong>skip:</strong> Conditionally prevent query execution
          </li>
          <li>
            <strong>Type safety:</strong> GraphQL validates variable types (ID!, String, etc.)
          </li>
          <li>
            <strong>Caching:</strong> Each query with different variables is cached separately
          </li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  description: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  queryBox: {
    backgroundColor: '#282c34',
    color: '#61dafb',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  code: {
    margin: '10px 0',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#abb2bf',
    overflow: 'auto',
  },
  variableNote: {
    margin: '10px 0 0 0',
    color: '#98c379',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '6px',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '30px',
  },
  column: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
  },
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userButton: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  selectedButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
  },
  userName: {
    fontWeight: '600',
    marginBottom: '5px',
  },
  userEmail: {
    fontSize: '14px',
    opacity: 0.8,
  },
  placeholder: {
    textAlign: 'center',
    color: '#999',
    padding: '60px 20px',
    fontSize: '18px',
  },
  detailsCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
  },
  detailsGrid: {
    display: 'grid',
    gap: '15px',
    marginTop: '15px',
  },
  detailItem: {
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '6px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '12px',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },
};
