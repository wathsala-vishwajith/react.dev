import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * INTERMEDIATE EXAMPLE 3: Dependent Queries
 *
 * Learn how to:
 * - Chain queries that depend on each other
 * - Use the enabled option to control query execution
 * - Handle loading states for dependent queries
 * - Fetch related data based on initial query results
 */

export default function DependentQueries() {
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Step 1: Fetch posts (first page)
  const postsQuery = useQuery({
    queryKey: ['posts', 1],
    queryFn: () => api.getPosts({ page: 1, limit: 10 }),
  });

  // Step 2: Fetch selected post details (depends on user selection)
  const postQuery = useQuery({
    queryKey: ['post', selectedPostId],
    queryFn: () => api.getPost(selectedPostId),
    enabled: !!selectedPostId, // Only run when a post is selected
  });

  // Step 3: Fetch post author (depends on post data)
  const authorQuery = useQuery({
    queryKey: ['user', postQuery.data?.userId],
    queryFn: () => api.getUser(postQuery.data.userId),
    enabled: !!postQuery.data?.userId, // Only run when we have userId from post
  });

  // Step 4: Fetch comments for the post (depends on post selection)
  const commentsQuery = useQuery({
    queryKey: ['comments', selectedPostId],
    queryFn: () => api.getComments(selectedPostId),
    enabled: !!selectedPostId, // Only run when a post is selected
  });

  if (postsQuery.isLoading) {
    return <div style={styles.loading}>Loading posts...</div>;
  }

  if (postsQuery.isError) {
    return <div style={styles.error}>Error: {postsQuery.error.message}</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Dependent Queries Example</h2>
      <p style={styles.description}>
        This example demonstrates query dependencies:
        <br />1. First, we fetch a list of posts
        <br />2. When you select a post, we fetch its details
        <br />3. Based on the post data, we fetch the author
        <br />4. And simultaneously fetch the post's comments
      </p>

      <div style={styles.layout}>
        {/* Posts List */}
        <div style={styles.sidebar}>
          <h3>Posts</h3>
          <div style={styles.postsList}>
            {postsQuery.data.data.map(post => (
              <button
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                style={{
                  ...styles.postButton,
                  ...(selectedPostId === post.id ? styles.selectedPost : {}),
                }}
              >
                <div style={styles.postButtonTitle}>{post.title}</div>
                <div style={styles.postButtonMeta}>
                  Post #{post.id} • ❤️ {post.likes}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Post Details */}
        <div style={styles.mainContent}>
          {!selectedPostId ? (
            <div style={styles.placeholder}>
              <h3>Select a post to view details</h3>
              <p>Click on any post from the list to see its details, author, and comments.</p>
            </div>
          ) : (
            <>
              {/* Post Details Section */}
              {postQuery.isLoading ? (
                <div style={styles.loading}>Loading post...</div>
              ) : postQuery.isError ? (
                <div style={styles.error}>Error loading post</div>
              ) : (
                <div style={styles.postDetails}>
                  <h3>{postQuery.data.title}</h3>
                  <p>{postQuery.data.body}</p>
                  <div style={styles.postMeta}>
                    <span>Post ID: {postQuery.data.id}</span>
                    <span>❤️ {postQuery.data.likes} likes</span>
                  </div>
                </div>
              )}

              {/* Author Section */}
              <div style={styles.authorSection}>
                <h4>Author</h4>
                {authorQuery.isLoading ? (
                  <div style={styles.miniLoading}>Loading author...</div>
                ) : authorQuery.isError ? (
                  <div style={styles.error}>Error loading author</div>
                ) : authorQuery.data ? (
                  <div style={styles.authorCard}>
                    <div>
                      <strong>{authorQuery.data.name}</strong>
                      <p>{authorQuery.data.email}</p>
                    </div>
                    <span style={styles.badge}>{authorQuery.data.role}</span>
                  </div>
                ) : null}
              </div>

              {/* Comments Section */}
              <div style={styles.commentsSection}>
                <h4>
                  Comments
                  {commentsQuery.data && ` (${commentsQuery.data.length})`}
                </h4>
                {commentsQuery.isLoading ? (
                  <div style={styles.miniLoading}>Loading comments...</div>
                ) : commentsQuery.isError ? (
                  <div style={styles.error}>Error loading comments</div>
                ) : commentsQuery.data ? (
                  <div style={styles.commentsList}>
                    {commentsQuery.data.slice(0, 5).map(comment => (
                      <div key={comment.id} style={styles.commentCard}>
                        <strong>{comment.author}</strong>
                        <p>{comment.text}</p>
                      </div>
                    ))}
                    {commentsQuery.data.length > 5 && (
                      <p style={styles.moreComments}>
                        And {commentsQuery.data.length - 5} more comments...
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li>
            <strong>enabled option:</strong> Controls when a query should execute
          </li>
          <li>
            <strong>Query dependencies:</strong> Queries wait for required data before executing
          </li>
          <li>
            <strong>Parallel dependent queries:</strong> Comments and author load simultaneously
          </li>
          <li>
            <strong>queryKey with dynamic values:</strong> Dependencies in queryKey ensure proper caching
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
    lineHeight: '1.6',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '20px',
    marginBottom: '30px',
  },
  sidebar: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    height: 'fit-content',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  postButton: {
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  selectedPost: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
  },
  postButtonTitle: {
    fontWeight: '500',
    marginBottom: '5px',
  },
  postButtonMeta: {
    fontSize: '12px',
    opacity: 0.8,
  },
  mainContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  placeholder: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  miniLoading: {
    padding: '20px',
    color: '#666',
    fontStyle: 'italic',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '6px',
  },
  postDetails: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eee',
  },
  postMeta: {
    display: 'flex',
    gap: '20px',
    marginTop: '15px',
    color: '#666',
    fontSize: '14px',
  },
  authorSection: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
  },
  authorCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '6px',
  },
  badge: {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: '20px',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  commentCard: {
    backgroundColor: '#f9f9f9',
    padding: '12px',
    borderRadius: '6px',
    borderLeft: '3px solid #007bff',
  },
  moreComments: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },
};
