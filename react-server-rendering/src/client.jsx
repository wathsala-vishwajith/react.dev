import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

/**
 * Client-side entry point
 *
 * This file runs in the browser and "hydrates" the server-rendered HTML.
 * Hydration means React attaches event listeners and makes the static HTML interactive.
 *
 * The key difference from render():
 * - render() creates new DOM nodes
 * - hydrateRoot() attaches to existing server-rendered DOM
 */

// Get the initial data passed from the server
const serverMessage = window.__SERVER_DATA__.message;

// Hydrate the server-rendered HTML
hydrateRoot(
  document.getElementById('root'),
  <App serverMessage={serverMessage} />
);

console.log('✅ React hydration complete - app is now interactive!');
