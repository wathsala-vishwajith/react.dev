import { Suspense, useState, useEffect } from 'react';

/**
 * ❌ BAD EXAMPLE: Using Suspense with useEffect data fetching
 *
 * This is a common mistake! Suspense does NOT work with traditional useEffect data fetching.
 *
 * Why this doesn't work:
 * - Suspense requires components to "throw" a promise during render
 * - useEffect runs AFTER render, so Suspense can't detect it
 * - The loading state is managed manually with useState
 * - Suspense boundary never triggers because no promise is thrown
 *
 * Result: The Suspense fallback will never show, and you'll see the component's
 * own loading state instead. This defeats the purpose of using Suspense.
 */

// eslint-disable-next-line react-refresh/only-export-components
function UserProfileBad({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // Simulating an API call
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  // This is the problem: we're handling loading state ourselves
  // Suspense can't help us here!
  if (loading) {
    return <div className="loading-fallback">Loading user profile... (from component state, NOT Suspense)</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Website:</strong> {user.website}</p>
      <p><strong>Company:</strong> {user.company?.name}</p>
    </div>
  );
}

export default function Example1_BadUseEffect() {
  const [userId, setUserId] = useState(1);

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>
          <span className="badge bad">❌ BAD</span>
          Suspense with useEffect Data Fetching
        </h2>
        <p>This example shows the WRONG way to use Suspense</p>
      </div>

      <div className="explanation warning">
        <h3>⚠️ Why This Doesn't Work:</h3>
        <ul>
          <li><strong>useEffect runs after render</strong> - Suspense can't detect it</li>
          <li><strong>No promise is thrown</strong> - Suspense boundary never activates</li>
          <li><strong>Manual loading state</strong> - Defeats the purpose of Suspense</li>
          <li><strong>The Suspense fallback never shows</strong> - Component shows its own loading state</li>
        </ul>
        <p>
          <strong>The Problem:</strong> Wrapping this component in Suspense does nothing because
          useEffect-based data fetching doesn't integrate with Suspense. You'll see the component's
          loading state, not the Suspense fallback.
        </p>
      </div>

      <div>
        <h3>Select User:</h3>
        <div>
          {[1, 2, 3, 4, 5].map(id => (
            <button
              key={id}
              className="button"
              onClick={() => setUserId(id)}
              disabled={userId === id}
            >
              User {id}
            </button>
          ))}
        </div>
      </div>

      <div className="example-content">
        {/* Notice: The Suspense boundary here is useless! */}
        <Suspense fallback={
          <div className="loading-fallback">
            <div className="spinner"></div>
            <p>Loading from Suspense... (you'll never see this!)</p>
          </div>
        }>
          <UserProfileBad userId={userId} />
        </Suspense>
      </div>

      <div className="explanation warning">
        <h3>🔍 What You Should See:</h3>
        <p>
          When you click different user buttons, you'll see the component's own loading message:
          <em>"Loading user profile... (from component state, NOT Suspense)"</em>
        </p>
        <p>
          The Suspense fallback <em>"Loading from Suspense..."</em> will NEVER appear because
          the component never throws a promise for Suspense to catch.
        </p>
      </div>

      <div className="explanation">
        <h3>📝 The Code Problem:</h3>
        <pre className="code-block">
{`// ❌ This pattern doesn't work with Suspense:
function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (loading) return <Loading />; // Suspense can't help here!
  return <div>{data}</div>;
}`}
        </pre>
      </div>
    </div>
  );
}
