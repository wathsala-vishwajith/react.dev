import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * BEGINNER EXAMPLE 3: Refetching Data
 *
 * Learn about:
 * - Manual refetching with the refetch function
 * - Automatic refetching on window focus
 * - Automatic refetching on intervals
 * - Query status indicators (isFetching vs isLoading)
 */

export default function RefetchingData() {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
    // Automatic refetching options:
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
    refetchInterval: 30000, // Refetch every 30 seconds (disabled in this example)
    staleTime: 5000, // Data is fresh for 5 seconds
  });

  if (isLoading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  if (isError) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Refetching Data Example</h2>
      <p style={styles.description}>
        This example shows different ways to refetch data:
        <br />• Click the "Refetch" button to manually refetch
        <br />• Switch to another tab and back (refetchOnWindowFocus)
        <br />• Notice the difference between isLoading and isFetching
      </p>

      <div style={styles.controls}>
        <button
          onClick={() => refetch()}
          style={styles.button}
          disabled={isFetching}
        >
          {isFetching ? 'Refetching...' : 'Refetch Users'}
        </button>

        <div style={styles.status}>
          <div>
            <strong>Status:</strong>{' '}
            {isLoading && 'Loading (first time)'}
            {isFetching && !isLoading && 'Refetching (background)'}
            {!isFetching && 'Idle'}
          </div>
          <div>
            <strong>Last updated:</strong>{' '}
            {new Date(dataUpdatedAt).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div style={styles.userList}>
        {data.map(user => (
          <div key={user.id} style={styles.userCard}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span style={styles.badge}>{user.role}</span>
          </div>
        ))}
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li>
            <strong>isLoading:</strong> true only on the first fetch (no cached data)
          </li>
          <li>
            <strong>isFetching:</strong> true whenever data is being fetched (including refetches)
          </li>
          <li>
            <strong>refetch():</strong> manually trigger a new fetch
          </li>
          <li>
            <strong>staleTime:</strong> how long data is considered fresh (5 seconds here)
          </li>
          <li>
            <strong>refetchOnWindowFocus:</strong> auto-refetch when tab regains focus
          </li>
        </ul>
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
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  status: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '20px',
    borderRadius: '8px',
  },
  userList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  userCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },
};
