import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * BEGINNER EXAMPLE 1: Basic Query
 *
 * This demonstrates the most fundamental use of TanStack Query:
 * - Fetching data with useQuery
 * - Handling loading states
 * - Handling errors
 * - Automatic caching
 */

export default function BasicQuery() {
  // useQuery takes an object with:
  // - queryKey: unique identifier for this query (used for caching)
  // - queryFn: function that returns a promise
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading users...</div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error.message}</div>
      </div>
    );
  }

  // Render data
  return (
    <div style={styles.container}>
      <h2>Basic Query Example</h2>
      <p style={styles.description}>
        This is the simplest useQuery example. Try navigating away and back -
        the data is cached!
      </p>
      <div style={styles.userList}>
        {data.map(user => (
          <div key={user.id} style={styles.userCard}>
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
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
    fontSize: '18px',
    color: '#666',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #fcc',
  },
  userList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
  },
  userCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};
