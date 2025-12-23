import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * ADVANCED EXAMPLE 2: Infinite Queries
 *
 * Learn how to:
 * - Implement infinite scrolling with useInfiniteQuery
 * - Handle pagination cursors
 * - Load more data on demand
 * - Handle hasNextPage and isFetchingNextPage states
 */

export default function InfiniteQueries() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['infinitePosts'],
    queryFn: ({ pageParam }) => api.getInfinitePosts({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isLoading) {
    return <div style={styles.loading}>Loading posts...</div>;
  }

  if (isError) {
    return <div style={styles.error}>Error: {error.message}</div>;
  }

  // Flatten all pages into a single array
  const allPosts = data.pages.flatMap(page => page.posts);

  return (
    <div style={styles.container}>
      <h2>Infinite Queries Example</h2>
      <p style={styles.description}>
        This example demonstrates infinite scrolling using useInfiniteQuery.
        Click "Load More" to fetch the next page of results. All pages are
        cached and maintained automatically.
      </p>

      <div style={styles.stats}>
        <div>
          <strong>Loaded Posts:</strong> {allPosts.length}
        </div>
        <div>
          <strong>Pages Loaded:</strong> {data.pages.length}
        </div>
        <div>
          <strong>Has More:</strong> {hasNextPage ? 'Yes' : 'No'}
        </div>
      </div>

      {/* Posts Grid */}
      <div style={styles.postsGrid}>
        {allPosts.map((post, index) => (
          <div
            key={post.id}
            style={{
              ...styles.postCard,
              animationDelay: `${(index % 10) * 0.05}s`,
            }}
          >
            <div style={styles.postNumber}>#{post.id}</div>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div style={styles.postFooter}>
              <span>❤️ {post.likes}</span>
              <span>User {post.userId}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div style={styles.loadMoreSection}>
        {hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={styles.loadMoreButton}
          >
            {isFetchingNextPage ? (
              <span>
                <span style={styles.spinner}>⟳</span> Loading more...
              </span>
            ) : (
              'Load More Posts'
            )}
          </button>
        ) : (
          <div style={styles.endMessage}>
            <p>🎉 You've reached the end!</p>
            <p>All posts have been loaded.</p>
          </div>
        )}
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li>
            <strong>useInfiniteQuery:</strong> Specialized hook for infinite/paginated data
          </li>
          <li>
            <strong>pageParam:</strong> Tracks the current page cursor
          </li>
          <li>
            <strong>getNextPageParam:</strong> Determines the next page cursor from response
          </li>
          <li>
            <strong>fetchNextPage():</strong> Function to load the next page
          </li>
          <li>
            <strong>hasNextPage:</strong> Boolean indicating if more data is available
          </li>
          <li>
            <strong>data.pages:</strong> Array of all loaded pages
          </li>
          <li>
            <strong>initialPageParam:</strong> The starting cursor value
          </li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
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
    marginBottom: '30px',
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
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  postCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    animation: 'fadeInUp 0.4s ease-out',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  postNumber: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  postFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
    fontSize: '14px',
    color: '#666',
  },
  loadMoreSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  loadMoreButton: {
    padding: '15px 40px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    minWidth: '200px',
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
  },
  endMessage: {
    padding: '40px',
    backgroundColor: '#d4edda',
    borderRadius: '8px',
    color: '#155724',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}
