import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';

/**
 * BEGINNER EXAMPLE 3: Refetching Data
 *
 * Learn about:
 * - Manual refetching with the refetch function
 * - Network status tracking
 * - Fetch policies
 * - Apollo Client automatic caching
 */

export default function RefetchingData() {
  const {
    loading,
    error,
    data,
    refetch,
    networkStatus,
  } = useQuery(GET_USERS, {
    notifyOnNetworkStatusChange: true, // Get updates when refetching
    fetchPolicy: 'cache-and-network', // Always check network while showing cache
  });

  // Network status values:
  // 1: loading, 2: setVariables, 3: fetchMore, 4: refetch, 6: poll, 7: ready, 8: error
  const isRefetching = networkStatus === 4;

  if (loading && !isRefetching) {
    return <div style={styles.loading}>Initial loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Refetching Data Example</h2>
      <p style={styles.description}>
        This example demonstrates how to refetch data in Apollo Client.
        Click the "Refetch Users" button to manually trigger a new network request.
        Notice how the UI shows different states for initial loading vs refetching.
      </p>

      <div style={styles.queryBox}>
        <h4>Fetch Policy:</h4>
        <pre style={styles.code}>fetchPolicy: 'cache-and-network'</pre>
        <p style={styles.note}>
          This policy returns cached data immediately while fetching from the network.
        </p>
      </div>

      <div style={styles.controls}>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          style={styles.button}
        >
          {isRefetching ? 'Refetching...' : 'Refetch Users'}
        </button>

        <div style={styles.status}>
          <div>
            <strong>Network Status:</strong>{' '}
            {isRefetching ? 'Refetching (4)' : `Ready (${networkStatus})`}
          </div>
          <div>
            <strong>Data Source:</strong>{' '}
            {isRefetching ? 'Network' : 'Cache'}
          </div>
        </div>
      </div>

      <div style={styles.userList}>
        {data.users.map(user => (
          <div
            key={user.id}
            style={{
              ...styles.userCard,
              opacity: isRefetching ? 0.6 : 1,
            }}
          >
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
            <strong>refetch():</strong> Manually trigger a new network request
          </li>
          <li>
            <strong>networkStatus:</strong> Track the current state of the query
          </li>
          <li>
            <strong>notifyOnNetworkStatusChange:</strong> Get updates during refetch
          </li>
          <li>
            <strong>fetchPolicy:</strong> Control how Apollo uses the cache
          </li>
        </ul>

        <h4>Common Fetch Policies:</h4>
        <ul style={styles.policyList}>
          <li>
            <code>cache-first</code>: Return cache, only fetch if no cache (default)
          </li>
          <li>
            <code>cache-and-network</code>: Return cache immediately, then fetch
          </li>
          <li>
            <code>network-only</code>: Always fetch, skip cache
          </li>
          <li>
            <code>no-cache</code>: Fetch and don't store in cache
          </li>
          <li>
            <code>cache-only</code>: Only use cache, never fetch
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
  },
  note: {
    margin: '10px 0 0 0',
    color: '#98c379',
    fontSize: '14px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
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
    transition: 'opacity 0.3s',
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
  policyList: {
    marginTop: '10px',
  },
};
