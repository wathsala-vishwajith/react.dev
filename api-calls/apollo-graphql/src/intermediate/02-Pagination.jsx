import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries';

export default function Pagination() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { loading, error, data, previousData } = useQuery(GET_POSTS, {
    variables: { page, limit },
  });

  // Use previous data while loading new page
  const displayData = data || previousData;

  if (loading && !previousData) {
    return <div style={styles.loading}>Loading posts...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }

  const totalPages = displayData ? Math.ceil(displayData.posts.total / limit) : 0;

  return (
    <div style={styles.container}>
      <h2>Pagination Example</h2>
      <p style={styles.description}>
        Implementing pagination with Apollo Client using query variables.
        Previous data is shown while loading the next page.
      </p>

      <div style={styles.stats}>
        <div><strong>Total Posts:</strong> {displayData.posts.total}</div>
        <div><strong>Current Page:</strong> {page} of {totalPages}</div>
        <div><strong>Status:</strong> {loading ? 'Loading...' : 'Ready'}</div>
      </div>

      <div style={{ ...styles.postList, opacity: loading ? 0.5 : 1 }}>
        {displayData.posts.posts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div style={styles.postFooter}>
              <span>❤️ {post.likes}</span>
              <span>By {post.author.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.pagination}>
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1 || loading}
          style={styles.pageButton}
        >
          ← Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!displayData.posts.hasMore || loading}
          style={styles.pageButton}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '900px', margin: '0 auto' },
  description: { backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  stats: { display: 'flex', justifyContent: 'space-around', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  loading: { textAlign: 'center', padding: '40px', color: '#666' },
  error: { backgroundColor: '#fee', color: '#c33', padding: '20px', borderRadius: '8px' },
  postList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '15px', marginBottom: '30px', transition: 'opacity 0.2s' },
  postCard: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '15px' },
  postFooter: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', color: '#666', fontSize: '14px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  pageButton: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};
