import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries';
import { LIKE_POST, CREATE_POST, DELETE_POST } from '../graphql/mutations';

export default function OptimisticUI() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const { loading, data } = useQuery(GET_POSTS, {
    variables: { page: 1, limit: 10 },
  });

  const [likePost] = useMutation(LIKE_POST, {
    optimisticResponse: ({ id }) => ({
      __typename: 'Mutation',
      likePost: {
        __typename: 'Post',
        id,
        title: 'Loading...',
        likes: -1, // Temporary value
      },
    }),
    update: (cache, { data: { likePost } }) => {
      cache.modify({
        id: cache.identify(likePost),
        fields: {
          likes: () => likePost.likes,
        },
      });
    },
  });

  const [createPost] = useMutation(CREATE_POST, {
    optimisticResponse: {
      __typename: 'Mutation',
      createPost: {
        __typename: 'Post',
        id: 'temp-' + Date.now(),
        title,
        body,
        likes: 0,
        author: {
          __typename: 'User',
          id: '1',
          name: 'You (pending...)',
        },
      },
    },
    update: (cache, { data: { createPost } }) => {
      const existingPosts = cache.readQuery({
        query: GET_POSTS,
        variables: { page: 1, limit: 10 },
      });

      cache.writeQuery({
        query: GET_POSTS,
        variables: { page: 1, limit: 10 },
        data: {
          posts: {
            ...existingPosts.posts,
            posts: [createPost, ...existingPosts.posts.posts],
          },
        },
      });
    },
    onCompleted: () => {
      setTitle('');
      setBody('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && body) {
      createPost({ variables: { title, body, authorId: '1' } });
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>Optimistic UI Example</h2>
      <p style={styles.description}>
        Optimistic UI updates the cache immediately before the server responds.
        Try liking a post or creating one - the UI updates instantly!
      </p>

      <div style={styles.formSection}>
        <h3>Create Post (with Optimistic Response)</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={styles.textarea}
            rows={3}
          />
          <button type="submit" style={styles.button}>Create Post</button>
        </form>
      </div>

      <div style={styles.postsList}>
        {data.posts.posts.map(post => (
          <div key={post.id} style={styles.postCard}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div style={styles.postFooter}>
              <button
                onClick={() => likePost({ variables: { id: post.id } })}
                style={styles.likeButton}
              >
                ❤️ {post.likes}
              </button>
              <span>{post.author.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>optimisticResponse:</strong> Immediate UI update before server response</li>
          <li><strong>update function:</strong> Manually update the cache</li>
          <li><strong>cache.modify():</strong> Modify specific fields in the cache</li>
          <li><strong>Auto-rollback:</strong> Changes revert if mutation fails</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '900px', margin: '0 auto' },
  description: { backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  formSection: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px' },
  textarea: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical' },
  button: { padding: '12px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  loading: { textAlign: 'center', padding: '40px' },
  postsList: { marginBottom: '30px' },
  postCard: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '15px' },
  postFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' },
  likeButton: { padding: '8px 16px', backgroundColor: '#fff', border: '2px solid #dc3545', borderRadius: '20px', cursor: 'pointer' },
  info: { backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px' },
};
