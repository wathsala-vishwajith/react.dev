import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * INTERMEDIATE EXAMPLE 2: Pagination
 *
 * Learn how to:
 * - Implement pagination with TanStack Query
 * - Keep previous data while fetching new page
 * - Calculate total pages
 * - Handle page navigation
 */

export default function Pagination() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => api.getPosts({ page, limit }),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });

  // Calculate total pages
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  if (isLoading) {
    return <div style={styles.loading}>Loading posts...</div>;
  }

  if (isError) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Pagination Example</h2>
      <p style={styles.description}>
        This example shows how to implement pagination with TanStack Query.
        Notice how we keep the previous data visible while loading the next page
        using placeholderData.
      </p>

      <div style={styles.stats}>
        <div>
          <strong>Total Posts:</strong> {data.total}
        </div>
        <div>
          <strong>Current Page:</strong> {page} of {totalPages}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          {isFetching ? 'Fetching...' : 'Idle'}
        </div>
      </div>

      {/* Posts List */}
      <div
        style={{
          ...styles.postList,
          opacity: isPlaceholderData ? 0.5 : 1,
        }}
      >
        {data.data.map(post => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <h3>Post #{post.id}</h3>
              <div style={styles.likes}>❤️ {post.likes}</div>
            </div>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div style={styles.postFooter}>
              <small>By User {post.userId}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={styles.pagination}>
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1 || isFetching}
          style={{
            ...styles.pageButton,
            ...(page === 1 ? styles.disabledButton : {}),
          }}
        >
          ← Previous
        </button>

        <div style={styles.pageNumbers}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              disabled={isFetching}
              style={{
                ...styles.pageNumberButton,
                ...(pageNum === page ? styles.activePageButton : {}),
              }}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(prev => (data.hasMore ? prev + 1 : prev))}
          disabled={!data.hasMore || isFetching}
          style={{
            ...styles.pageButton,
            ...(!data.hasMore ? styles.disabledButton : {}),
          }}
        >
          Next →
        </button>
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li>
            <strong>placeholderData:</strong> Keeps previous data visible while fetching
          </li>
          <li>
            <strong>queryKey with page:</strong> Each page is cached separately
          </li>
          <li>
            <strong>isPlaceholderData:</strong> True when showing stale data while fetching
          </li>
          <li>
            <strong>Page state:</strong> Managed with useState, triggers new queries
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
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    padding: '20px',
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
    padding: '20px',
    borderRadius: '8px',
  },
  postList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
    transition: 'opacity 0.2s',
  },
  postCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  likes: {
    fontSize: '14px',
    color: '#666',
  },
  postFooter: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
    color: '#666',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  pageButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  pageNumbers: {
    display: 'flex',
    gap: '5px',
  },
  pageNumberButton: {
    padding: '10px 15px',
    backgroundColor: '#fff',
    color: '#007bff',
    border: '1px solid #007bff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  activePageButton: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
    cursor: 'not-allowed',
    border: '1px solid #dee2e6',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },
};
