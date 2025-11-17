import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * BEGINNER EXAMPLE 2: Query with Parameters
 *
 * Learn how to:
 * - Pass parameters to queries
 * - Include params in the queryKey for proper caching
 * - Conditionally enable/disable queries
 */

export default function QueryWithParams() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  // First query: Get all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  // Second query: Get a specific user
  // Note: queryKey includes the userId for proper caching
  // enabled: only run this query when we have a selectedUserId
  const userQuery = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => api.getUser(selectedUserId),
    enabled: !!selectedUserId, // Only fetch when userId is truthy
  });

  if (usersQuery.isLoading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Query with Parameters Example</h2>
      <p style={styles.description}>
        Click on a user to see how we fetch individual user data.
        The queryKey includes the user ID, so each user is cached separately.
      </p>

      <div style={styles.columns}>
        {/* User List */}
        <div style={styles.column}>
          <h3>Users List</h3>
          <div style={styles.userList}>
            {usersQuery.data.map(user => (
              <button
                key={user.id}
                style={{
                  ...styles.userButton,
                  ...(selectedUserId === user.id ? styles.selectedButton : {}),
                }}
                onClick={() => setSelectedUserId(user.id)}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>

        {/* User Details */}
        <div style={styles.column}>
          <h3>User Details</h3>
          {!selectedUserId && (
            <p style={styles.placeholder}>Select a user to view details</p>
          )}

          {selectedUserId && userQuery.isLoading && (
            <div style={styles.loading}>Loading user details...</div>
          )}

          {selectedUserId && userQuery.isError && (
            <div style={styles.error}>Error: {userQuery.error.message}</div>
          )}

          {selectedUserId && userQuery.data && (
            <div style={styles.detailsCard}>
              <h4>{userQuery.data.name}</h4>
              <p><strong>ID:</strong> {userQuery.data.id}</p>
              <p><strong>Email:</strong> {userQuery.data.email}</p>
              <p><strong>Role:</strong> {userQuery.data.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  description: {
    backgroundColor: '#f0f0f0',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
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
    borderRadius: '8px',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  column: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userButton: {
    padding: '12px',
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
  placeholder: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  },
  detailsCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
  },
};
