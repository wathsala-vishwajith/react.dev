import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';

/**
 * BEGINNER EXAMPLE 1: Basic Query
 *
 * This demonstrates the most fundamental use of Apollo Client:
 * - Fetching data with useQuery
 * - Handling loading states
 * - Handling errors
 * - Automatic caching
 */

export default function BasicQuery() {
  // useQuery automatically executes the query when the component mounts
  // It returns loading state, error, and data
  const { loading, error, data } = useQuery(GET_USERS);

  // Handle loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading users...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
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
        This is the simplest Apollo Client example using useQuery.
        The query is executed automatically when the component mounts,
        and the data is cached for future use.
      </p>

      <div style={styles.queryBox}>
        <h4>GraphQL Query:</h4>
        <pre style={styles.code}>{`query GetUsers {
  users {
    id
    name
    email
    role
  }
}`}</pre>
      </div>

      <div style={styles.userList}>
        {data.users.map(user => (
          <div key={user.id} style={styles.userCard}>
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> <span style={styles.badge}>{user.role}</span></p>
            <p style={styles.userId}>ID: {user.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  description: {
    backgroundColor: '#f0f0f0',
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
    margin: '10px 0 0 0',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#abb2bf',
    overflow: 'auto',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px',
  },
  userCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
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
  userId: {
    fontSize: '12px',
    color: '#999',
    marginTop: '10px',
  },
};
