import { Suspense, useState } from 'react';

/**
 * ✅ GOOD EXAMPLE: Using Suspense with proper data fetching
 *
 * This demonstrates how to integrate data fetching with Suspense correctly.
 *
 * Key Principles:
 * - Create a "resource" that throws promises during render
 * - Cache results to avoid refetching
 * - Component reads from the resource synchronously
 * - Suspense catches thrown promises and shows fallback
 *
 * In production, you'd use libraries like:
 * - React Router (with built-in Suspense support)
 * - TanStack Query / React Query
 * - SWR
 * - Relay
 * - Apollo Client (with Suspense mode)
 */

// Simple cache to store fetched data
const cache = new Map();

// Create a Suspense-compatible resource
function createResource(fetcher, key) {
  // Check if we have cached data
  if (cache.has(key)) {
    const cached = cache.get(key);
    if (cached.status === 'success') {
      return cached;
    }
    if (cached.status === 'error') {
      throw cached.error;
    }
    // If status is 'pending', throw the promise
    throw cached.promise;
  }

  // Create a new promise and cache it
  const promise = fetcher()
    .then(data => {
      cache.set(key, {
        status: 'success',
        data,
      });
      return data;
    })
    .catch(error => {
      cache.set(key, {
        status: 'error',
        error,
      });
      throw error;
    });

  // Cache the pending promise
  cache.set(key, {
    status: 'pending',
    promise,
  });

  // Throw the promise - this is what Suspense catches!
  throw promise;
}

// Resource factory for user data
function fetchUser(userId) {
  return createResource(
    () => fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json()),
    `user-${userId}`
  );
}

// Resource factory for user posts
function fetchUserPosts(userId) {
  return createResource(
    () => fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then(res => res.json()),
    `posts-${userId}`
  );
}

// Component that reads from a Suspense-enabled resource
// eslint-disable-next-line react-refresh/only-export-components
function UserProfile({ userId }) {
  // This will throw a promise on first render (triggering Suspense)
  // On subsequent renders after data loads, it returns the data
  const resource = fetchUser(userId);
  const user = resource.data;

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p><strong>Username:</strong> @{user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Website:</strong> {user.website}</p>
      <p><strong>Company:</strong> {user.company?.name}</p>
      <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
        ✅ This data was loaded using Suspense-enabled fetching
      </p>
    </div>
  );
}

// Component that reads user posts
// eslint-disable-next-line react-refresh/only-export-components
function UserPosts({ userId }) {
  const resource = fetchUserPosts(userId);
  const posts = resource.data;

  return (
    <div className="user-card">
      <h3>Posts by this user ({posts.length})</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {posts.slice(0, 5).map(post => (
          <div
            key={post.id}
            style={{
              padding: '1rem',
              margin: '0.5rem 0',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '4px',
              borderLeft: '3px solid #61dafb'
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#61dafb' }}>
              {post.title}
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{post.body}</p>
          </div>
        ))}
        {posts.length > 5 && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            ... and {posts.length - 5} more posts
          </p>
        )}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
        ✅ Posts loaded using Suspense-enabled fetching
      </p>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
function LoadingFallback({ message = "Loading..." }) {
  return (
    <div className="loading-fallback">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default function Example3_GoodDataFetching() {
  const [userId, setUserId] = useState(1);
  const [showPosts, setShowPosts] = useState(false);

  const handleUserChange = (newUserId) => {
    setUserId(newUserId);
    setShowPosts(false); // Reset posts view when changing users
  };

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>
          <span className="badge good">✅ GOOD</span>
          Suspense with Proper Data Fetching
        </h2>
        <p>This example shows how to integrate data fetching with Suspense correctly</p>
      </div>

      <div className="explanation success">
        <h3>✅ How This Works:</h3>
        <ul>
          <li><strong>Resource throws promise</strong> - Component reads synchronously, throws promise on first render</li>
          <li><strong>Suspense catches promise</strong> - Shows fallback while waiting</li>
          <li><strong>Promise resolves</strong> - Component re-renders with data</li>
          <li><strong>Data is cached</strong> - Subsequent renders use cached data</li>
        </ul>
        <p>
          <strong>The Key Difference:</strong> Unlike useEffect (which runs AFTER render),
          this pattern throws the promise DURING render, which is what Suspense needs.
        </p>
      </div>

      <div>
        <h3>Select User:</h3>
        <div>
          {[1, 2, 3, 4, 5].map(id => (
            <button
              key={id}
              className="button"
              onClick={() => handleUserChange(id)}
              disabled={userId === id}
            >
              User {id}
            </button>
          ))}
        </div>
      </div>

      <div className="example-content">
        {/* Suspense boundary for user profile */}
        <Suspense fallback={<LoadingFallback message="Loading user profile..." />}>
          <UserProfile userId={userId} />
        </Suspense>

        {/* Button to load posts */}
        <div style={{ margin: '1rem 0' }}>
          <button
            className="button"
            onClick={() => setShowPosts(!showPosts)}
          >
            {showPosts ? 'Hide' : 'Show'} Posts
          </button>
        </div>

        {/* Separate Suspense boundary for posts */}
        {showPosts && (
          <Suspense fallback={<LoadingFallback message="Loading posts..." />}>
            <UserPosts userId={userId} />
          </Suspense>
        )}
      </div>

      <div className="explanation success">
        <h3>🔍 What You Should See:</h3>
        <ol>
          <li>Click a user button - Suspense fallback shows while loading</li>
          <li>User profile appears when data is ready</li>
          <li>Click "Show Posts" - Separate fallback for posts</li>
          <li>Posts load independently from profile</li>
          <li>Switch users - Cached users load instantly!</li>
        </ol>
      </div>

      <div className="explanation">
        <h3>📝 The Pattern:</h3>
        <pre className="code-block">
{`// Create a resource that throws promises
function createResource(fetcher, key) {
  // Check cache first
  if (cache.has(key)) {
    return cache.get(key).data;
  }

  // Create and cache promise
  const promise = fetcher().then(data => {
    cache.set(key, { data });
    return data;
  });

  cache.set(key, { promise });
  throw promise; // Suspense catches this!
}

// Component reads synchronously
function Component() {
  const resource = createResource(() =>
    fetch('/api/data').then(r => r.json()),
    'my-data'
  );

  return <div>{resource.data}</div>;
}`}
        </pre>
      </div>

      <div className="explanation success">
        <h3>💡 Real-World Solutions:</h3>
        <p>Instead of building this yourself, use production-ready libraries:</p>
        <ul>
          <li><strong>TanStack Query (React Query)</strong> - Full-featured data fetching with Suspense support</li>
          <li><strong>SWR</strong> - Lightweight data fetching library by Vercel</li>
          <li><strong>React Router</strong> - Built-in Suspense-enabled data loading</li>
          <li><strong>Relay</strong> - GraphQL client with Suspense integration</li>
          <li><strong>Apollo Client</strong> - GraphQL client with Suspense mode</li>
        </ul>
      </div>

      <div className="explanation">
        <h3>⚡ Advanced Benefits:</h3>
        <ul>
          <li><strong>Nested Suspense:</strong> Different parts of UI can load independently</li>
          <li><strong>Waterfall Prevention:</strong> Start fetching before rendering</li>
          <li><strong>Coordination:</strong> Wait for multiple resources with one boundary</li>
          <li><strong>Error Boundaries:</strong> Combine with Error Boundaries for complete error handling</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(100, 108, 255, 0.1)', borderRadius: '4px' }}>
        <p><strong>💡 Tip:</strong> Try clicking different users to see caching in action.
        Users you've already loaded will appear instantly!</p>
      </div>
    </div>
  );
}
