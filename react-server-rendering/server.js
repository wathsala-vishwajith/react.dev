import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import React from 'react';
import App from './src/App.jsx';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, client JS)
app.use(express.static(join(__dirname, 'public')));

/**
 * Main route handler
 *
 * Demonstrates Server-Side Rendering using renderToPipeableStream()
 * This is the recommended API for Node.js environments (React 18+)
 */
app.get('/', (req, res) => {
  // Data that will be passed to the React component
  const serverData = {
    message: 'Hello from the server! 🚀',
    timestamp: new Date().toISOString()
  };

  // Set proper headers for HTML streaming
  res.setHeader('Content-Type', 'text/html');

  // Track if we've sent the shell
  let didError = false;

  // Render the React component to a stream
  const stream = renderToPipeableStream(
    <App serverMessage={serverData.message} />,
    {
      // Called when the shell is ready (above Suspense boundaries)
      onShellReady() {
        // Start streaming the response
        res.statusCode = didError ? 500 : 200;

        // Send the HTML shell
        res.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Server-Side Rendering Demo</title>
  <link rel="stylesheet" href="/styles.css">
  <meta name="description" content="Learn React Server-Side Rendering with react-dom/server APIs">
</head>
<body>
  <div id="root">`);

        // Pipe the React HTML
        stream.pipe(res, { end: false });
      },

      // Called when all content is ready (including Suspense content)
      onAllReady() {
        // Close the root div and add the client-side script
        res.write(`</div>

  <!-- Pass server data to the client -->
  <script>
    window.__SERVER_DATA__ = ${JSON.stringify(serverData)};
  </script>

  <!-- Load the client-side React bundle -->
  <script type="module" src="/client.js"></script>

  <noscript>
    <div style="padding: 20px; background: #fff3cd; border: 2px solid #ffc107; margin: 20px; border-radius: 8px;">
      <strong>⚠️ JavaScript is disabled</strong>
      <p>This app works without JavaScript thanks to Server-Side Rendering! However, interactive features require JavaScript to be enabled.</p>
    </div>
  </noscript>
</body>
</html>`);
        res.end();
      },

      // Error handling
      onShellError(error) {
        didError = true;
        console.error('Shell error:', error);
        res.statusCode = 500;
        res.send('<!DOCTYPE html><html><body><h1>Something went wrong</h1></body></html>');
      },

      onError(error) {
        didError = true;
        console.error('Stream error:', error);
      }
    }
  );
});

/**
 * Alternative endpoint using renderToString (legacy API)
 *
 * This demonstrates the older synchronous API.
 * Note: renderToString blocks until complete, while renderToPipeableStream streams.
 */
app.get('/legacy', async (req, res) => {
  try {
    const { renderToString } = await import('react-dom/server');
    const serverData = {
      message: 'Hello from the legacy renderToString API! 📜'
    };

    const html = renderToString(<App serverMessage={serverData.message} />);

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React SSR - Legacy API</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="root">${html}</div>
  <script>
    window.__SERVER_DATA__ = ${JSON.stringify(serverData)};
  </script>
  <script type="module" src="/client.js"></script>
</body>
</html>`);
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).send('Error rendering page');
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🚀 React Server-Side Rendering Demo                  ║
║                                                        ║
║  Server running at:                                    ║
║  → http://localhost:${PORT}                              ║
║                                                        ║
║  Endpoints:                                            ║
║  → /         - Main demo (renderToPipeableStream)      ║
║  → /legacy   - Legacy demo (renderToString)            ║
║  → /health   - Health check                            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});
