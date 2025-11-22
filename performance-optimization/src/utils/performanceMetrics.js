// Performance metrics tracking utility
export class PerformanceMetrics {
  constructor() {
    this.metrics = {};
  }

  start(name) {
    this.metrics[name] = {
      startTime: performance.now(),
      startMemory: performance.memory ? performance.memory.usedJSHeapSize : null,
    };
  }

  end(name) {
    if (!this.metrics[name]) {
      console.warn(`No start metric found for: ${name}`);
      return null;
    }

    const endTime = performance.now();
    const endMemory = performance.memory ? performance.memory.usedJSHeapSize : null;

    const result = {
      name,
      duration: endTime - this.metrics[name].startTime,
      memoryDelta: endMemory && this.metrics[name].startMemory
        ? endMemory - this.metrics[name].startMemory
        : null,
    };

    delete this.metrics[name];
    return result;
  }

  measureRender(componentName, callback) {
    this.start(componentName);
    const result = callback();
    const metrics = this.end(componentName);
    console.log(`[Performance] ${componentName}:`, metrics);
    return result;
  }
}

export const metrics = new PerformanceMetrics();

// Custom hook for measuring component render time
export function useRenderMetrics(componentName) {
  const renderCount = React.useRef(0);

  React.useEffect(() => {
    renderCount.current += 1;
    console.log(`[Render] ${componentName} rendered ${renderCount.current} times`);
  });
}
