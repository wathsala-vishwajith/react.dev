import { Suspense, lazy, useState } from 'react';

/**
 * ✅ GOOD EXAMPLE: Using Suspense with React.lazy for code splitting
 *
 * This is the MOST COMMON and recommended use case for Suspense!
 *
 * Why this works:
 * - React.lazy() creates a component that throws a promise during render
 * - Suspense catches this promise and shows the fallback
 * - When the component loads, Suspense renders it
 * - Perfect for code splitting and lazy loading components
 *
 * Benefits:
 * - Reduces initial bundle size
 * - Loads components only when needed
 * - Provides smooth loading experience
 * - Built-in React feature (no extra libraries needed)
 */

// These components are lazy loaded - they're in separate chunks
// In a real app, these would be in separate files
const HeavyChart = lazy(() => {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: function Chart() {
          return (
            <div className="user-card" style={{ minHeight: '300px' }}>
              <h3>📊 Heavy Chart Component</h3>
              <p>This component would typically include a large charting library like Chart.js or D3.</p>
              <div style={{
                background: 'linear-gradient(45deg, #61dafb 0%, #646cff 100%)',
                height: '200px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                📈 Chart Data Visualization
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                ✅ This component was loaded on-demand using React.lazy()
              </p>
            </div>
          );
        }
      });
    }, 1000); // Simulate 1 second load time
  });
});

const HeavyImageGallery = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: function ImageGallery() {
          return (
            <div className="user-card">
              <h3>🖼️ Heavy Image Gallery</h3>
              <p>This component would typically load many images and use an image library.</p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    style={{
                      background: `linear-gradient(${i * 60}deg, #61dafb, #646cff)`,
                      height: '100px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem'
                    }}
                  >
                    🖼️
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                ✅ This component was loaded on-demand using React.lazy()
              </p>
            </div>
          );
        }
      });
    }, 1500); // Simulate 1.5 second load time
  });
});

const HeavyVideoPlayer = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: function VideoPlayer() {
          return (
            <div className="user-card">
              <h3>🎥 Heavy Video Player</h3>
              <p>This component would typically include a video player library like Video.js.</p>
              <div style={{
                background: '#000',
                height: '300px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                position: 'relative'
              }}>
                ▶️
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  height: '4px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '2px'
                }}>
                  <div style={{
                    width: '40%',
                    height: '100%',
                    background: '#61dafb',
                    borderRadius: '2px'
                  }}></div>
                </div>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                ✅ This component was loaded on-demand using React.lazy()
              </p>
            </div>
          );
        }
      });
    }, 800); // Simulate 0.8 second load time
  });
});

// eslint-disable-next-line react-refresh/only-export-components
function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="spinner"></div>
      <p>Loading component...</p>
    </div>
  );
}

export default function Example2_GoodLazy() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className="example-container">
      <div className="example-header">
        <h2>
          <span className="badge good">✅ GOOD</span>
          Suspense with React.lazy (Code Splitting)
        </h2>
        <p>This example shows the CORRECT way to use Suspense with lazy-loaded components</p>
      </div>

      <div className="explanation success">
        <h3>✅ Why This Works:</h3>
        <ul>
          <li><strong>React.lazy throws a promise</strong> - Suspense can catch it</li>
          <li><strong>Built-in React feature</strong> - No extra libraries needed</li>
          <li><strong>Automatic code splitting</strong> - Each lazy component is a separate bundle</li>
          <li><strong>The Suspense fallback shows</strong> - While the component loads</li>
        </ul>
        <p>
          <strong>The Solution:</strong> React.lazy() is designed to work with Suspense.
          When a lazy component is rendered, it throws a promise that Suspense catches,
          showing the fallback until the component code is loaded.
        </p>
      </div>

      <div>
        <h3>Load Components On-Demand:</h3>
        <div>
          <button
            className="button"
            onClick={() => setActiveComponent('chart')}
            disabled={activeComponent === 'chart'}
          >
            Load Chart Component
          </button>
          <button
            className="button"
            onClick={() => setActiveComponent('gallery')}
            disabled={activeComponent === 'gallery'}
          >
            Load Image Gallery
          </button>
          <button
            className="button"
            onClick={() => setActiveComponent('video')}
            disabled={activeComponent === 'video'}
          >
            Load Video Player
          </button>
          <button
            className="button"
            onClick={() => setActiveComponent(null)}
            disabled={activeComponent === null}
          >
            Unload All
          </button>
        </div>
      </div>

      <div className="example-content">
        {/* This Suspense boundary WILL work! */}
        <Suspense fallback={<LoadingFallback />}>
          {activeComponent === 'chart' && <HeavyChart />}
          {activeComponent === 'gallery' && <HeavyImageGallery />}
          {activeComponent === 'video' && <HeavyVideoPlayer />}
          {activeComponent === null && (
            <div className="user-card">
              <h3>👆 Click a button above to load a component</h3>
              <p>Watch the Suspense fallback appear while the component loads!</p>
            </div>
          )}
        </Suspense>
      </div>

      <div className="explanation success">
        <h3>🔍 What You Should See:</h3>
        <p>
          When you click a button, you'll see:
        </p>
        <ol>
          <li>The Suspense fallback appears (spinner and "Loading component...")</li>
          <li>After a delay (simulating network), the component appears</li>
          <li>The transition is smooth and handled by React</li>
        </ol>
      </div>

      <div className="explanation">
        <h3>📝 The Correct Pattern:</h3>
        <pre className="code-block">
{`// ✅ This pattern works perfectly with Suspense:
import { Suspense, lazy } from 'react';

// Split code into separate chunks
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}

// Benefits:
// - Smaller initial bundle
// - Loads only when needed
// - Smooth loading experience
// - No extra code required`}
        </pre>
      </div>

      <div className="explanation success">
        <h3>💡 Real-World Use Cases:</h3>
        <ul>
          <li><strong>Route-based splitting:</strong> Load page components only when navigating</li>
          <li><strong>Modal dialogs:</strong> Load modal content only when opened</li>
          <li><strong>Heavy libraries:</strong> Load charts, editors, or rich text components on-demand</li>
          <li><strong>Admin panels:</strong> Load admin features only for admin users</li>
          <li><strong>Feature flags:</strong> Load features only when enabled</li>
        </ul>
      </div>
    </div>
  );
}
