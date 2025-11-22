import { lazy, Suspense, useState } from 'react';

// Lazy load heavy components - they're only downloaded when needed
const HeavyChart = lazy(() => import('./LazyLoadedComponent.jsx').then(m => ({ default: m.HeavyChart })));
const HeavyImageGallery = lazy(() => import('./LazyLoadedComponent.jsx').then(m => ({ default: m.HeavyImageGallery })));
const HeavyDataTable = lazy(() => import('./LazyLoadedComponent.jsx').then(m => ({ default: m.HeavyDataTable })));

export function CodeSplittingDemo() {
  const [activeTab, setActiveTab] = useState(null);
  const [loadTimes, setLoadTimes] = useState({});

  const handleTabClick = (tab) => {
    const startTime = performance.now();
    setActiveTab(tab);

    // Track loading time
    setTimeout(() => {
      const endTime = performance.now();
      setLoadTimes(prev => ({
        ...prev,
        [tab]: endTime - startTime,
      }));
    }, 0);
  };

  return (
    <div className="demo-section">
      <h2>Code Splitting & Lazy Loading Demo</h2>

      <div className="info-box">
        <p><strong>Code Splitting</strong> breaks your bundle into smaller chunks that load on-demand.</p>
        <p><strong>Lazy Loading</strong> defers loading of components until they're needed.</p>
        <p>✨ Benefits: Faster initial load, smaller bundle size, better performance</p>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'chart' ? 'tab active' : 'tab'}
          onClick={() => handleTabClick('chart')}
        >
          📊 Chart {loadTimes.chart && `(${loadTimes.chart.toFixed(0)}ms)`}
        </button>
        <button
          className={activeTab === 'gallery' ? 'tab active' : 'tab'}
          onClick={() => handleTabClick('gallery')}
        >
          🖼️ Gallery {loadTimes.gallery && `(${loadTimes.gallery.toFixed(0)}ms)`}
        </button>
        <button
          className={activeTab === 'table' ? 'tab active' : 'tab'}
          onClick={() => handleTabClick('table')}
        >
          📋 Table {loadTimes.table && `(${loadTimes.table.toFixed(0)}ms)`}
        </button>
      </div>

      <div className="tab-content">
        <Suspense fallback={<LoadingSpinner />}>
          {activeTab === 'chart' && <HeavyChart />}
          {activeTab === 'gallery' && <HeavyImageGallery />}
          {activeTab === 'table' && <HeavyDataTable />}
          {!activeTab && (
            <div className="placeholder">
              <p>👆 Click a tab above to load a component dynamically</p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Notice: Components are only downloaded when you click their tab!
              </p>
            </div>
          )}
        </Suspense>
      </div>

      <div className="metrics-info">
        <h4>Code Splitting Impact:</h4>
        <ul>
          <li><strong>Without code splitting:</strong> All components loaded upfront = Large initial bundle</li>
          <li><strong>With code splitting:</strong> Components loaded on-demand = Smaller initial bundle</li>
          <li><strong>Bundle size savings:</strong> ~40-60% reduction in initial load</li>
          <li><strong>Load time improvement:</strong> ~2-3x faster initial page load</li>
        </ul>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading component...</p>
    </div>
  );
}
