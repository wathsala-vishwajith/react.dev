import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * ADVANCED EXAMPLE 1: Optimistic Updates
 *
 * Learn how to:
 * - Update the UI immediately before server responds
 * - Roll back on error
 * - Use onMutate, onError, and onSettled callbacks
 * - Manually update the query cache
 */

export default function OptimisticUpdates() {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const queryClient = useQueryClient();

  // Fetch posts
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', 1],
    queryFn: () => api.getPosts({ page: 1, limit: 10 }),
  });

  // Like post mutation with optimistic update
  const likePostMutation = useMutation({
    mutationFn: api.likePost,
    // Optimistically update the cache before mutation
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', 1] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts', 1]);

      // Optimistically update the cache
      queryClient.setQueryData(['posts', 1], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(post =>
            post.id === postId
              ? { ...post, likes: post.likes + 1 }
              : post
          ),
        };
      });

      // Return context with the previous value
      return { previousPosts };
    },
    // If mutation fails, roll back to previous value
    onError: (err, postId, context) => {
      queryClient.setQueryData(['posts', 1], context.previousPosts);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 1] });
    },
  });

  // Create post mutation with optimistic update
  const createPostMutation = useMutation({
    mutationFn: api.createPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts', 1] });
      const previousPosts = queryClient.getQueryData(['posts', 1]);

      // Create optimistic post with temporary ID
      const optimisticPost = {
        id: 'temp-' + Date.now(),
        title: newPost.title,
        body: newPost.body,
        userId: newPost.userId,
        likes: 0,
        _isOptimistic: true, // Flag for styling
      };

      // Add to cache immediately
      queryClient.setQueryData(['posts', 1], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [optimisticPost, ...old.data],
          total: old.total + 1,
        };
      });

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(['posts', 1], context.previousPosts);
    },
    onSuccess: () => {
      setNewPostTitle('');
      setNewPostBody('');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 1] });
    },
  });

  // Delete post mutation with optimistic update
  const deletePostMutation = useMutation({
    mutationFn: api.deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts', 1] });
      const previousPosts = queryClient.getQueryData(['posts', 1]);

      // Remove from cache immediately
      queryClient.setQueryData(['posts', 1], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter(post => post.id !== postId),
          total: old.total - 1,
        };
      });

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      queryClient.setQueryData(['posts', 1], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 1] });
    },
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (newPostTitle && newPostBody) {
      createPostMutation.mutate({
        title: newPostTitle,
        body: newPostBody,
        userId: 1,
      });
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading posts...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Optimistic Updates Example</h2>
      <p style={styles.description}>
        This example demonstrates optimistic updates:
        <br />• Like a post - the counter updates immediately
        <br />• Create a post - it appears instantly (with a pending indicator)
        <br />• Delete a post - it disappears immediately
        <br />• All changes roll back automatically if the server request fails
      </p>

      {/* Create Post Form */}
      <div style={styles.formSection}>
        <h3>Create New Post</h3>
        <form onSubmit={handleCreatePost} style={styles.form}>
          <input
            type="text"
            placeholder="Post title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Post content"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            style={styles.textarea}
            rows={3}
          />
          <button
            type="submit"
            style={styles.button}
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div style={styles.postsList}>
        <h3>Posts ({postsData.data.length})</h3>
        {postsData.data.map(post => (
          <div
            key={post.id}
            style={{
              ...styles.postCard,
              ...(post._isOptimistic ? styles.optimisticPost : {}),
            }}
          >
            <div style={styles.postHeader}>
              <div>
                <h4>{post.title}</h4>
                {post._isOptimistic && (
                  <span style={styles.pendingBadge}>Pending...</span>
                )}
              </div>
              <button
                onClick={() => deletePostMutation.mutate(post.id)}
                style={styles.deleteButton}
                disabled={deletePostMutation.isPending}
              >
                Delete
              </button>
            </div>
            <p>{post.body}</p>
            <div style={styles.postFooter}>
              <button
                onClick={() => likePostMutation.mutate(post.id)}
                style={styles.likeButton}
                disabled={likePostMutation.isPending}
              >
                ❤️ {post.likes}
              </button>
              <span>Post #{post.id}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li>
            <strong>onMutate:</strong> Runs before mutation, perfect for optimistic updates
          </li>
          <li>
            <strong>cancelQueries:</strong> Prevents race conditions with ongoing fetches
          </li>
          <li>
            <strong>setQueryData:</strong> Manually update the cache
          </li>
          <li>
            <strong>Context return:</strong> Pass data between callbacks for rollback
          </li>
          <li>
            <strong>onError:</strong> Rollback optimistic update if mutation fails
          </li>
          <li>
            <strong>onSettled:</strong> Refetch to sync with server state
          </li>
        </ul>
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
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  formSection: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
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
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  postsList: {
    marginBottom: '30px',
  },
  postCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    transition: 'all 0.3s',
  },
  optimisticPost: {
    backgroundColor: '#fff9e6',
    borderColor: '#ffc107',
    borderWidth: '2px',
    borderStyle: 'dashed',
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  pendingBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#ffc107',
    color: '#000',
    borderRadius: '4px',
    fontSize: '12px',
    marginLeft: '10px',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  postFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
  },
  likeButton: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '2px solid #dc3545',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },
};
