import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log initial performance metrics
if (performance && performance.memory) {
  console.log('📊 Initial Performance Metrics:');
  console.log('- Memory Used:', (performance.memory.usedJSHeapSize / 1048576).toFixed(2), 'MB');
  console.log('- Memory Limit:', (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2), 'MB');
}

// Performance observer for tracking long tasks
if ('PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('⚠️ Long task detected:', entry.duration.toFixed(2), 'ms');
        }
      }
    });
    observer.observe({ entryTypes: ['longtask', 'measure'] });
  } catch (e) {
    // PerformanceObserver may not support all entry types
  }
}
