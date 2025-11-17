import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { GET_USER } from '../graphql/queries';
import { UPDATE_USER } from '../graphql/mutations';

export default function ErrorHandling() {
  // Query with error handling
  const { loading, error, data, refetch } = useQuery(GET_USER, {
    variables: { id: '999' }, // Non-existent user to trigger error
    errorPolicy: 'all', // Return both data and errors
    onError: (error) => {
      console.error('Query error:', error);
    },
  });

  // Mutation with error handling
  const [updateUser, { error: mutationError, reset }] = useMutation(UPDATE_USER, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });

  const handleUpdate = () => {
    updateUser({
      variables: {
        id: '999',
        name: 'Test User',
      },
    });
  };

  return (
    <div style={styles.container}>
      <h2>Error Handling Example</h2>
      <p style={styles.description}>
        Comprehensive error handling in Apollo Client including network errors,
        GraphQL errors, and custom error policies.
      </p>

      <div style={styles.section}>
        <h3>Query Error Example</h3>
        <p>Trying to fetch user with ID 999 (doesn't exist):</p>

        {loading && <div style={styles.loading}>Loading...</div>}

        {error && (
          <div style={styles.errorBox}>
            <h4>Error Details:</h4>
            <div><strong>Message:</strong> {error.message}</div>
            <div><strong>Network Error:</strong> {error.networkError ? 'Yes' : 'No'}</div>
            {error.graphQLErrors.map((err, i) => (
              <div key={i}>
                <strong>GraphQL Error {i + 1}:</strong> {err.message}
              </div>
            ))}
            <button onClick={() => refetch()} style={styles.button}>
              Retry
            </button>
          </div>
        )}

        {data && <div style={styles.success}>Unexpected success: {JSON.stringify(data)}</div>}
      </div>

      <div style={styles.section}>
        <h3>Mutation Error Example</h3>
        <p>Try updating a non-existent user:</p>
        <button onClick={handleUpdate} style={styles.button}>
          Update User 999
        </button>
        {mutationError && (
          <div style={styles.errorBox}>
            <h4>Mutation Error:</h4>
            <div>{mutationError.message}</div>
            <button onClick={reset} style={styles.button}>
              Clear Error
            </button>
          </div>
        )}
      </div>

      <div style={styles.info}>
        <h3>Error Policies:</h3>
        <ul>
          <li><code>none</code> (default): Throw error, don't return data</li>
          <li><code>ignore</code>: Ignore errors, return data</li>
          <li><code>all</code>: Return both data and errors</li>
        </ul>

        <h3>Error Types:</h3>
        <ul>
          <li><strong>GraphQL Errors:</strong> Server-side validation/logic errors</li>
          <li><strong>Network Errors:</strong> Connection issues</li>
          <li><strong>Client Errors:</strong> Invalid queries, cache issues</li>
        </ul>

        <h3>Best Practices:</h3>
        <ul>
          <li>Use onError callback for logging</li>
          <li>Implement error boundaries for UI crashes</li>
          <li>Provide retry mechanisms</li>
          <li>Show user-friendly error messages</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '900px', margin: '0 auto' },
  description: { backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  section: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  loading: { padding: '20px', textAlign: 'center', color: '#666' },
  errorBox: { backgroundColor: '#fee', color: '#c33', padding: '20px', borderRadius: '8px', marginTop: '15px', border: '1px solid #fcc' },
  success: { backgroundColor: '#d4edda', color: '#155724', padding: '20px', borderRadius: '8px', marginTop: '15px' },
  button: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' },
  info: { backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px' },
};
