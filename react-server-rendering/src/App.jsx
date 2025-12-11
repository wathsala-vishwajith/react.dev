import { useState } from 'react';

/**
 * Main App Component
 *
 * This component demonstrates how React components work identically
 * on both server and client. The initial HTML is rendered on the server,
 * then React "hydrates" it on the client, making it interactive.
 */
export default function App({ serverMessage }) {
  // State for the interactive counter
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState(['Learn React', 'Learn SSR', 'Build amazing apps']);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  const handleRemoveTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>⚛️ React Server-Side Rendering Demo</h1>
        <p className="subtitle">Using react-dom/server APIs</p>
      </header>

      <div className="container">
        {/* Server-rendered message */}
        <section className="section">
          <h2>🖥️ Server Information</h2>
          <div className="info-box">
            <p><strong>Server Message:</strong> {serverMessage}</p>
            <p><strong>Rendered at:</strong> {new Date().toLocaleString()}</p>
          </div>
          <p className="explanation">
            This content was rendered on the server using <code>renderToPipeableStream()</code>.
            View the page source to see the fully-rendered HTML!
          </p>
        </section>

        {/* Interactive counter */}
        <section className="section">
          <h2>🔄 Client Hydration Demo</h2>
          <div className="counter">
            <h3>Counter: <span className="count-display">{count}</span></h3>
            <div className="button-group">
              <button onClick={() => setCount(count - 1)} className="btn btn-secondary">
                ➖ Decrement
              </button>
              <button onClick={() => setCount(0)} className="btn btn-outline">
                🔄 Reset
              </button>
              <button onClick={() => setCount(count + 1)} className="btn btn-primary">
                ➕ Increment
              </button>
            </div>
          </div>
          <p className="explanation">
            After the server-rendered HTML loads, React <strong>hydrates</strong> it on the client,
            making these buttons interactive. Try clicking them!
          </p>
        </section>

        {/* Todo list */}
        <section className="section">
          <h2>📝 Interactive Todo List</h2>
          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="todo-input"
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
          <ul className="todo-list">
            {todos.map((todo, index) => (
              <li key={index} className="todo-item">
                <span>{todo}</span>
                <button
                  onClick={() => handleRemoveTodo(index)}
                  className="btn-remove"
                  aria-label="Remove todo"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          {todos.length === 0 && (
            <p className="empty-state">No todos yet. Add one above!</p>
          )}
        </section>

        {/* Benefits section */}
        <section className="section">
          <h2>✨ Why Server-Side Rendering?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>⚡ Faster Initial Load</h3>
              <p>Users see content immediately, no waiting for JS to download and execute</p>
            </div>
            <div className="benefit-card">
              <h3>🔍 Better SEO</h3>
              <p>Search engines can crawl fully-rendered HTML content</p>
            </div>
            <div className="benefit-card">
              <h3>📱 Improved Performance</h3>
              <p>Works even before JavaScript loads on slow connections</p>
            </div>
            <div className="benefit-card">
              <h3>♿ Accessibility</h3>
              <p>Content is available to screen readers and assistive technologies immediately</p>
            </div>
          </div>
        </section>

        {/* Technical info */}
        <section className="section">
          <h2>🔧 How It Works</h2>
          <ol className="steps-list">
            <li>
              <strong>Server:</strong> Express server receives request
            </li>
            <li>
              <strong>Render:</strong> React component is rendered to HTML using <code>renderToPipeableStream()</code>
            </li>
            <li>
              <strong>Stream:</strong> HTML is streamed to the browser as it's generated
            </li>
            <li>
              <strong>Load:</strong> Browser displays the server-rendered HTML
            </li>
            <li>
              <strong>Download:</strong> Client-side React bundle downloads
            </li>
            <li>
              <strong>Hydrate:</strong> React attaches event listeners with <code>hydrateRoot()</code>
            </li>
            <li>
              <strong>Interactive:</strong> App is now fully interactive!
            </li>
          </ol>
        </section>
      </div>

      <footer className="footer">
        <p>
          Built with React {React.version} | Learn more at{' '}
          <a href="https://react.dev/reference/react-dom/server" target="_blank" rel="noopener noreferrer">
            react.dev/reference/react-dom/server
          </a>
        </p>
      </footer>
    </div>
  );
}
