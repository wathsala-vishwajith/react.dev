import { useState, useEffect } from 'react';
import { CodeSplittingDemo } from './components/CodeSplittingDemo.jsx';
import { MemoizationDemo } from './components/MemoizationDemo.jsx';
import { VirtualScrollingComparison } from './components/VirtualScrolling.jsx';
import { WebWorkerDemo } from './components/WebWorkerDemo.jsx';
import './App.css';

function App() {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  useEffect(() => {
    // Capture initial performance metrics
    if (performance && performance.memory) {
      const metrics = {
        memory: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        timestamp: Date.now(),
      };
      setPerformanceMetrics(metrics);
    }

    // Log navigation timing
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('📊 Performance Metrics:');
        console.log('- DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
        console.log('- Load Complete:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        console.log('- Total Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
      }
    });
  }, []);

  const demos = [
    { id: 'overview', name: '🏠 Overview', component: Overview },
    { id: 'code-splitting', name: '📦 Code Splitting', component: CodeSplittingDemo },
    { id: 'memoization', name: '🧠 Memoization', component: MemoizationDemo },
    { id: 'virtual-scrolling', name: '📜 Virtual Scrolling', component: VirtualScrollingComparison },
    { id: 'web-workers', name: '⚡ Web Workers', component: WebWorkerDemo },
  ];

  const ActiveComponent = demos.find(d => d.id === activeDemo)?.component || Overview;

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚡ React Performance Optimization</h1>
        <p className="subtitle">Interactive demonstrations of performance optimization techniques</p>
        {performanceMetrics.memory && (
          <div className="header-metrics">
            Memory Usage: {performanceMetrics.memory}
          </div>
        )}
      </header>

      <nav className="app-nav">
        {demos.map(demo => (
          <button
            key={demo.id}
            className={activeDemo === demo.id ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveDemo(demo.id)}
          >
            {demo.name}
          </button>
        ))}
      </nav>

      <main className="app-content">
        <ActiveComponent />
      </main>

      <footer className="app-footer">
        <p>💡 Open DevTools Console to see detailed performance logs</p>
        <p>📊 Check Network tab to see code splitting in action</p>
      </footer>
    </div>
  );
}

function Overview() {
  return (
    <div className="demo-section">
      <h2>Welcome to React Performance Optimization</h2>

      <div className="overview-grid">
        <div className="overview-card">
          <h3>📦 Code Splitting</h3>
          <p>Break your bundle into smaller chunks that load on demand</p>
          <ul>
            <li>Reduces initial bundle size</li>
            <li>Faster initial page load</li>
            <li>Better user experience</li>
          </ul>
          <div className="metric-badge">40-60% smaller bundles</div>
        </div>

        <div className="overview-card">
          <h3>🧠 Memoization</h3>
          <p>Prevent unnecessary re-renders and calculations</p>
          <ul>
            <li>React.memo for components</li>
            <li>useMemo for expensive calculations</li>
            <li>useCallback for function references</li>
          </ul>
          <div className="metric-badge">50-90% fewer renders</div>
        </div>

        <div className="overview-card">
          <h3>📜 Virtual Scrolling</h3>
          <p>Render only visible items in long lists</p>
          <ul>
            <li>Handles thousands of items smoothly</li>
            <li>Minimal DOM nodes</li>
            <li>Constant memory usage</li>
          </ul>
          <div className="metric-badge">99% less DOM nodes</div>
        </div>

        <div className="overview-card">
          <h3>⚡ Web Workers</h3>
          <p>Run heavy computations without blocking the UI</p>
          <ul>
            <li>Parallel processing</li>
            <li>Responsive UI during computation</li>
            <li>Better user experience</li>
          </ul>
          <div className="metric-badge">Non-blocking UI</div>
        </div>

        <div className="overview-card">
          <h3>📊 Bundle Size Optimization</h3>
          <p>Reduce bundle size through various techniques</p>
          <ul>
            <li>Tree shaking</li>
            <li>Code splitting</li>
            <li>Dynamic imports</li>
            <li>Manual chunking</li>
          </ul>
          <div className="metric-badge">Optimized chunks</div>
        </div>

        <div className="overview-card">
          <h3>📈 Performance Metrics</h3>
          <p>Measure and track performance improvements</p>
          <ul>
            <li>Render time tracking</li>
            <li>Memory usage monitoring</li>
            <li>Load time metrics</li>
          </ul>
          <div className="metric-badge">Data-driven optimization</div>
        </div>
      </div>

      <div className="getting-started">
        <h3>🚀 Getting Started</h3>
        <ol>
          <li>Open your browser's DevTools (F12)</li>
          <li>Navigate through the demos using the navigation above</li>
          <li>Watch the Console for performance logs</li>
          <li>Check the Network tab to see code splitting</li>
          <li>Compare "before" and "after" examples in each demo</li>
        </ol>
      </div>

      <div className="performance-comparison">
        <h3>📊 Before vs After Performance Metrics</h3>
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Without Optimization</th>
              <th>With Optimization</th>
              <th>Improvement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Initial Bundle Size</td>
              <td>~500 KB</td>
              <td>~200 KB</td>
              <td className="improvement">60% smaller</td>
            </tr>
            <tr>
              <td>Initial Load Time</td>
              <td>~2.5s</td>
              <td>~800ms</td>
              <td className="improvement">68% faster</td>
            </tr>
            <tr>
              <td>List Rendering (10k items)</td>
              <td>~3000ms</td>
              <td>~50ms</td>
              <td className="improvement">98% faster</td>
            </tr>
            <tr>
              <td>Component Re-renders</td>
              <td>~100/interaction</td>
              <td>~10/interaction</td>
              <td className="improvement">90% reduction</td>
            </tr>
            <tr>
              <td>UI Blocking (heavy calc)</td>
              <td>~2000ms blocked</td>
              <td>0ms blocked</td>
              <td className="improvement">100% non-blocking</td>
            </tr>
            <tr>
              <td>Memory Usage (large list)</td>
              <td>~150 MB</td>
              <td>~15 MB</td>
              <td className="improvement">90% reduction</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
