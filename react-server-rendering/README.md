# React Server-Side Rendering (SSR) Example

A comprehensive example demonstrating React Server-Side Rendering using `react-dom/server` APIs. Learn how to build performant, SEO-friendly React applications with server-side rendering and client-side hydration.

## What You'll Learn

This example demonstrates:

- ✅ Server-Side Rendering with `renderToPipeableStream()` (React 18+)
- ✅ Client-Side Hydration with `hydrateRoot()`
- ✅ Setting up an Express server for SSR
- ✅ Building client bundles with esbuild
- ✅ Passing data from server to client
- ✅ Legacy API comparison (`renderToString()`)
- ✅ Best practices for production SSR

## What is Server-Side Rendering?

Server-Side Rendering (SSR) means generating HTML for your React components on the server instead of in the browser. The server sends fully-rendered HTML to the client, which can be displayed immediately even before JavaScript loads.

### Benefits

- **⚡ Faster Initial Load**: Users see content immediately without waiting for JavaScript
- **🔍 Better SEO**: Search engines can crawl fully-rendered HTML
- **📱 Improved Performance**: Works on slow connections before JS loads
- **♿ Better Accessibility**: Content available to screen readers immediately

## Getting Started

### Prerequisites

- Node.js 16 or higher
- Basic understanding of React and Express
- Familiarity with npm/package management

### Installation

1. Navigate to the project directory:
   ```bash
   cd react-server-rendering
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the client bundle:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser to `http://localhost:3000`

### Development Mode

For development with auto-restart on file changes:

```bash
npm run dev
```

Note: You'll need to rebuild the client bundle (`npm run build`) when you change React components.

## Project Structure

```
react-server-rendering/
├── src/
│   ├── App.jsx          # Main React component (used on both server & client)
│   └── client.jsx       # Client-side entry point (hydration)
├── public/
│   ├── styles.css       # Application styles
│   └── client.js        # Built client bundle (generated)
├── server.js            # Express server with SSR logic
├── build.js             # esbuild configuration for client bundle
├── package.json         # Project dependencies and scripts
└── README.md           # This file
```

## How It Works

### The SSR Flow

1. **Request**: User requests a page from the server
2. **Render**: Server renders React component to HTML string
3. **Send**: Server sends complete HTML to browser
4. **Display**: Browser displays the server-rendered content immediately
5. **Download**: Browser downloads the React JavaScript bundle
6. **Hydrate**: React "hydrates" the HTML, making it interactive

### Server-Side (server.js)

```javascript
import { renderToPipeableStream } from 'react-dom/server';
import App from './src/App.jsx';

app.get('/', (req, res) => {
  const stream = renderToPipeableStream(
    <App serverMessage="Hello from server!" />,
    {
      onShellReady() {
        res.setHeader('Content-Type', 'text/html');
        stream.pipe(res);
      }
    }
  );
});
```

**Key Points:**
- `renderToPipeableStream()` is the recommended API for Node.js (React 18+)
- Streams HTML as it's generated (faster time-to-first-byte)
- Supports React features like Suspense
- More efficient than `renderToString()` for large apps

### Client-Side (client.jsx)

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

hydrateRoot(
  document.getElementById('root'),
  <App serverMessage={window.__SERVER_DATA__.message} />
);
```

**Key Points:**
- `hydrateRoot()` attaches React to existing server-rendered HTML
- Must match the exact component structure from the server
- Adds event listeners and makes the app interactive
- More efficient than `createRoot()` because it reuses existing DOM

## API Reference

### react-dom/server APIs

#### renderToPipeableStream() (Recommended)

```javascript
renderToPipeableStream(reactNode, options)
```

**Use for:** Node.js environments (React 18+)

**Features:**
- Streaming rendering
- Suspense support
- Better performance for large apps

**Options:**
- `onShellReady()`: Called when above-the-fold content is ready
- `onAllReady()`: Called when all content (including Suspense) is ready
- `onError()`: Called on rendering errors

#### renderToString() (Legacy)

```javascript
import { renderToString } from 'react-dom/server';
const html = renderToString(<App />);
```

**Use for:** Simple use cases, legacy codebases

**Limitations:**
- Synchronous (blocks until complete)
- No streaming
- No Suspense support
- Less efficient for large apps

**See it in action:** Visit `/legacy` endpoint in this demo

#### renderToStaticMarkup()

```javascript
import { renderToStaticMarkup } from 'react-dom/server';
const html = renderToStaticMarkup(<App />);
```

**Use for:** Static HTML generation (no hydration needed)

**Features:**
- No React-specific attributes (data-reactroot, etc.)
- Smaller HTML output
- Cannot be hydrated on the client

#### renderToReadableStream()

```javascript
import { renderToReadableStream } from 'react-dom/server';
const stream = await renderToReadableStream(<App />);
```

**Use for:** Modern runtimes (Deno, Cloudflare Workers, etc.)

**Features:**
- Uses Web Streams API
- Works in non-Node environments
- Streaming rendering

### react-dom/client APIs

#### hydrateRoot()

```javascript
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(domNode, reactNode, options);
```

**Use for:** Hydrating server-rendered HTML

**Parameters:**
- `domNode`: The DOM element containing server-rendered HTML
- `reactNode`: The same React component rendered on the server

**Important:** The React tree must match exactly what was rendered on the server

#### createRoot() (For comparison)

```javascript
import { createRoot } from 'react-dom/client';
createRoot(domNode).render(reactNode);
```

**Use for:** Client-only rendering (no SSR)

**Difference:** Creates new DOM instead of attaching to existing

## Key Concepts

### 1. Isomorphic/Universal Components

Components must work on both server and client:

```javascript
// ✅ Good - Works everywhere
function App({ message }) {
  return <h1>{message}</h1>;
}

// ❌ Bad - Uses browser-only API
function App() {
  const width = window.innerWidth; // Error on server!
  return <h1>Width: {width}</h1>;
}

// ✅ Fixed - Check for browser environment
function App() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth); // Only runs on client
  }, []);

  return <h1>Width: {width || 'Unknown'}</h1>;
}
```

### 2. Hydration Mismatches

React expects server and client output to match exactly:

```javascript
// ❌ Causes hydration warning
function App() {
  return <div>{new Date().toISOString()}</div>;
  // Server renders one timestamp, client hydrates with different timestamp!
}

// ✅ Fixed - Pass timestamp from server
function App({ timestamp }) {
  return <div>{timestamp}</div>;
}
```

### 3. Passing Data from Server to Client

```javascript
// Server: Inject data into HTML
res.send(`
  <div id="root">${html}</div>
  <script>
    window.__SERVER_DATA__ = ${JSON.stringify(data)};
  </script>
  <script src="/client.js"></script>
`);

// Client: Read injected data
const data = window.__SERVER_DATA__;
hydrateRoot(document.getElementById('root'), <App data={data} />);
```

### 4. Code Splitting with SSR

Server-side rendering works with React.lazy and Suspense:

```javascript
const LazyComponent = React.lazy(() => import('./Heavy'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## Common Patterns

### Pattern 1: Data Fetching

```javascript
// Server
app.get('/', async (req, res) => {
  const data = await fetchData();
  const html = renderToString(<App data={data} />);
  res.send(createHTML(html, data));
});

// Client
const initialData = window.__SERVER_DATA__;
hydrateRoot(root, <App data={initialData} />);
```

### Pattern 2: Routing with React Router

```javascript
// Server
import { StaticRouter } from 'react-router-dom/server';

const html = renderToString(
  <StaticRouter location={req.url}>
    <App />
  </StaticRouter>
);

// Client
import { BrowserRouter } from 'react-router-dom';

hydrateRoot(
  root,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### Pattern 3: CSS-in-JS (styled-components)

```javascript
// Server
import { ServerStyleSheet } from 'styled-components';

const sheet = new ServerStyleSheet();
const html = renderToString(sheet.collectStyles(<App />));
const styles = sheet.getStyleTags();

res.send(`
  <!DOCTYPE html>
  <html>
    <head>${styles}</head>
    <body><div id="root">${html}</div></body>
  </html>
`);
```

## Testing Your SSR Setup

### 1. View Page Source

Right-click → "View Page Source" in your browser. You should see fully-rendered HTML, not just an empty `<div id="root"></div>`.

### 2. Disable JavaScript

In Chrome DevTools:
1. Open DevTools (F12)
2. Press `Ctrl/Cmd + Shift + P`
3. Type "Disable JavaScript"
4. Refresh the page

The content should still be visible (though not interactive).

### 3. Check Network Tab

Look for:
- HTML response contains your content
- Client bundle loads after HTML
- No hydration errors in console

### 4. Lighthouse Audit

Run a Lighthouse audit to check:
- First Contentful Paint (should be fast)
- Time to Interactive
- SEO score

## Production Considerations

### 1. Error Handling

```javascript
const stream = renderToPipeableStream(<App />, {
  onError(error) {
    console.error('SSR Error:', error);
    // Log to error tracking service
  }
});
```

### 2. Caching

```javascript
// Cache rendered pages
const cache = new Map();

app.get('/', (req, res) => {
  const cacheKey = req.url;

  if (cache.has(cacheKey)) {
    return res.send(cache.get(cacheKey));
  }

  const html = renderToString(<App />);
  cache.set(cacheKey, html);
  res.send(html);
});
```

### 3. Build Optimization

```javascript
// build.js
await esbuild.build({
  entryPoints: ['src/client.jsx'],
  bundle: true,
  minify: true,              // Minify for production
  sourcemap: false,          // Disable sourcemaps
  splitting: true,           // Enable code splitting
  format: 'esm',
  target: ['es2020'],
});
```

### 4. Security

```javascript
// Sanitize user data before injecting
const safeData = JSON.stringify(data)
  .replace(/</g, '\\u003c')
  .replace(/>/g, '\\u003e');

res.send(`<script>window.__DATA__ = ${safeData}</script>`);
```

## Troubleshooting

### Hydration Mismatch Warning

**Problem:** React warning about server/client mismatch

**Solutions:**
- Ensure identical props on server and client
- Don't use `Date.now()` or `Math.random()` in render
- Check for browser-only APIs running on server
- Verify `useEffect` for browser-specific code

### Module Not Found

**Problem:** `Error: Cannot find module 'react'`

**Solution:** Install dependencies: `npm install`

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000
# Kill it
kill -9 <PID>
# Or use a different port
PORT=3001 npm start
```

### Client Bundle Not Loading

**Problem:** Browser console shows 404 for `/client.js`

**Solution:** Run `npm run build` to generate the client bundle

## Performance Tips

1. **Use `renderToPipeableStream()`** instead of `renderToString()` for better performance
2. **Implement caching** for static pages
3. **Code split** large components with React.lazy()
4. **Minimize client bundle** size with tree-shaking
5. **Use streaming** to send HTML as it's generated
6. **Preload critical resources** in HTML head
7. **Implement proper error boundaries** to prevent server crashes

## Alternatives to Custom SSR

While this example shows how to build SSR from scratch, consider these frameworks for production:

- **Next.js**: Full-featured React framework with built-in SSR
- **Remix**: Modern React framework with focus on web standards
- **Gatsby**: Static site generator with SSR capabilities
- **Razzle**: Create SSR React apps with zero configuration

These frameworks handle the complexity of SSR for you!

## Further Reading

- [react-dom/server API Reference](https://react.dev/reference/react-dom/server)
- [react-dom/client API Reference](https://react.dev/reference/react-dom/client)
- [Server Components vs SSR](https://react.dev/reference/react/use-server)
- [React 18 New Features](https://react.dev/blog/2022/03/29/react-v18)

## Examples in This Project

### Interactive Features

Visit `http://localhost:3000` to see:

1. **Counter**: Demonstrates client-side state after hydration
2. **Todo List**: Shows form handling and list updates
3. **Server Info**: Displays data passed from server to client
4. **Benefits Section**: Static content rendered on server

### API Endpoints

- `/` - Main demo using `renderToPipeableStream()`
- `/legacy` - Legacy demo using `renderToString()`
- `/health` - Health check endpoint

## Common Questions

### When should I use SSR?

Use SSR when you need:
- Fast initial page loads
- Good SEO for public pages
- Content visible without JavaScript
- Progressive enhancement

### When should I NOT use SSR?

Skip SSR for:
- Admin dashboards (no SEO needed)
- Apps behind login (not indexed)
- Highly interactive apps (little static content)
- When you need edge caching (consider SSG instead)

### SSR vs SSG vs CSR?

- **SSR** (Server-Side Rendering): Render on each request
- **SSG** (Static Site Generation): Render at build time
- **CSR** (Client-Side Rendering): Render in browser only

**Use SSR** for dynamic, personalized content.
**Use SSG** for static content that rarely changes.
**Use CSR** for single-page apps without SEO needs.

### What about React Server Components?

React Server Components (RSC) are different from SSR:
- **SSR**: Renders components to HTML on server, hydrates on client
- **RSC**: Runs components only on server, never ships to client

RSC is complementary to SSR. Both can be used together!

## License

This is an educational example project. Feel free to use it for learning purposes.

---

**Ready to learn more?** Explore the source code, experiment with the examples, and check out the additional resources linked above!
