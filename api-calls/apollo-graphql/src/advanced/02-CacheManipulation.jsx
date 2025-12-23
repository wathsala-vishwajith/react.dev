import { useQuery, useApolloClient } from '@apollo/client';
import { GET_USERS, GET_USER } from '../graphql/queries';

export default function CacheManipulation() {
  const client = useApolloClient();
  const { loading, data } = useQuery(GET_USERS);

  const readFromCache = (userId) => {
    try {
      const cachedUser = client.readQuery({
        query: GET_USER,
        variables: { id: userId },
      });
      alert(`Cached data: ${JSON.stringify(cachedUser, null, 2)}`);
    } catch (e) {
      alert('User not in cache. Fetch it first!');
    }
  };

  const writeToCache = (userId) => {
    client.writeQuery({
      query: GET_USER,
      variables: { id: userId },
      data: {
        user: {
          __typename: 'User',
          id: userId,
          name: 'Manually Written User',
          email: 'manual@example.com',
          role: 'Admin',
        },
      },
    });
    alert('User written to cache! Now try reading it.');
  };

  const modifyCache = (userId) => {
    client.cache.modify({
      id: client.cache.identify({ __typename: 'User', id: userId }),
      fields: {
        role: () => 'SuperAdmin',
        name: (existing) => `${existing} (Modified)`,
      },
    });
    alert('User modified in cache! Refetch users to see changes.');
  };

  const evictFromCache = (userId) => {
    client.cache.evict({
      id: client.cache.identify({ __typename: 'User', id: userId }),
    });
    client.cache.gc();
    alert('User evicted from cache!');
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>Cache Manipulation Example</h2>
      <p style={styles.description}>
        Direct cache manipulation using Apollo Client's cache methods.
        This is powerful for advanced use cases like optimistic UI and offline support.
      </p>

      <div style={styles.methods}>
        <div style={styles.method}>
          <h4>readQuery()</h4>
          <p>Read data from the cache without triggering a network request</p>
        </div>
        <div style={styles.method}>
          <h4>writeQuery()</h4>
          <p>Write data directly to the cache</p>
        </div>
        <div style={styles.method}>
          <h4>cache.modify()</h4>
          <p>Modify specific fields of cached objects</p>
        </div>
        <div style={styles.method}>
          <h4>cache.evict()</h4>
          <p>Remove objects from the cache</p>
        </div>
      </div>

      <div style={styles.userList}>
        {data.users.map(user => (
          <div key={user.id} style={styles.userCard}>
            <h4>{user.name}</h4>
            <p>{user.email} - {user.role}</p>
            <div style={styles.actions}>
              <button onClick={() => readFromCache(user.id)} style={styles.btn}>Read</button>
              <button onClick={() => writeToCache(user.id)} style={styles.btn}>Write</button>
              <button onClick={() => modifyCache(user.id)} style={styles.btn}>Modify</button>
              <button onClick={() => evictFromCache(user.id)} style={{...styles.btn, ...styles.btnDanger}}>Evict</button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>client.readQuery():</strong> Read from cache without network request</li>
          <li><strong>client.writeQuery():</strong> Write data to cache</li>
          <li><strong>cache.modify():</strong> Update specific fields</li>
          <li><strong>cache.evict():</strong> Remove from cache</li>
          <li><strong>cache.gc():</strong> Garbage collect unreachable objects</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  description: { backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  loading: { textAlign: 'center', padding: '40px' },
  methods: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' },
  method: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' },
  userList: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
  userCard: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '15px' },
  actions: { display: 'flex', gap: '8px', marginTop: '10px' },
  btn: { padding: '6px 12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  btnDanger: { backgroundColor: '#dc3545' },
  info: { backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px' },
};
