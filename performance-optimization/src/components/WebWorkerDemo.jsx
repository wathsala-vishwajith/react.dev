import { useState, useEffect, useRef } from 'react';

export function WebWorkerDemo() {
  const [mainThreadResult, setMainThreadResult] = useState(null);
  const [workerResult, setWorkerResult] = useState(null);
  const [mainThreadTime, setMainThreadTime] = useState(0);
  const [workerTime, setWorkerTime] = useState(0);
  const [isMainThreadBlocked, setIsMainThreadBlocked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const workerRef = useRef(null);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(
      new URL('../workers/dataProcessor.worker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const endTime = performance.now();
      const { type, data } = e.data;

      if (type === 'RESULT') {
        setWorkerTime(endTime - workerRef.current.startTime);
        setWorkerResult(data[0]?.toFixed(2));
      } else if (type === 'FIBONACCI_RESULT') {
        setWorkerTime(endTime - workerRef.current.startTime);
        setWorkerResult(data);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processInMainThread = () => {
    setIsMainThreadBlocked(true);
    const startTime = performance.now();

    // Simulate heavy computation
    const data = Array.from({ length: 1000 }, (_, i) => i);
    const result = data.map(item => {
      let res = item;
      for (let i = 0; i < 10000; i++) {
        res = Math.sqrt(res * res + 1);
      }
      return res;
    });

    const endTime = performance.now();
    setMainThreadTime(endTime - startTime);
    setMainThreadResult(result[0].toFixed(2));
    setIsMainThreadBlocked(false);
  };

  const processInWorker = () => {
    const data = Array.from({ length: 1000 }, (_, i) => i);
    workerRef.current.startTime = performance.now();
    workerRef.current.postMessage({ type: 'PROCESS_DATA', data });
  };

  const calculateFibonacci = (useWorker) => {
    const n = 40;

    if (useWorker) {
      workerRef.current.startTime = performance.now();
      workerRef.current.postMessage({ type: 'CALCULATE_FIBONACCI', data: n });
    } else {
      setIsMainThreadBlocked(true);
      const startTime = performance.now();

      const fib = (num) => {
        if (num <= 1) return num;
        let a = 0, b = 1;
        for (let i = 2; i <= num; i++) {
          [a, b] = [b, a + b];
        }
        return b;
      };

      const result = fib(n);
      const endTime = performance.now();
      setMainThreadTime(endTime - startTime);
      setMainThreadResult(result);
      setIsMainThreadBlocked(false);
    }
  };

  return (
    <div className="demo-section">
      <h2>Web Worker Demo</h2>

      <div className="info-box">
        <p>Web Workers run JavaScript in background threads, preventing UI blocking during heavy computations.</p>
        <p>Try typing in the input below while running computations:</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type here to test UI responsiveness..."
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />
        {isMainThreadBlocked && (
          <p className="warning">⚠️ Main thread blocked! Try typing above - it will be laggy.</p>
        )}
      </div>

      <div className="comparison-grid">
        <div className="component-box">
          <h3>❌ Main Thread Computation</h3>
          <p className="info">Blocks UI during processing</p>
          <button
            onClick={processInMainThread}
            disabled={isMainThreadBlocked}
            className="btn-primary"
          >
            Process in Main Thread
          </button>
          <button
            onClick={() => calculateFibonacci(false)}
            disabled={isMainThreadBlocked}
            className="btn-primary"
          >
            Calculate Fibonacci
          </button>
          {mainThreadResult && (
            <div className="result">
              <p><strong>Result:</strong> {mainThreadResult}</p>
              <p><strong>Time:</strong> {mainThreadTime.toFixed(2)}ms</p>
            </div>
          )}
        </div>

        <div className="component-box">
          <h3>✅ Web Worker Computation</h3>
          <p className="info">UI remains responsive</p>
          <button
            onClick={processInWorker}
            className="btn-primary"
          >
            Process in Worker
          </button>
          <button
            onClick={() => calculateFibonacci(true)}
            className="btn-primary"
          >
            Calculate Fibonacci
          </button>
          {workerResult && (
            <div className="result">
              <p><strong>Result:</strong> {workerResult}</p>
              <p><strong>Time:</strong> {workerTime.toFixed(2)}ms</p>
            </div>
          )}
        </div>
      </div>

      <div className="metrics-info">
        <h4>Performance Impact:</h4>
        <ul>
          <li><strong>Main Thread:</strong> Blocks UI, user experience suffers during computation</li>
          <li><strong>Web Worker:</strong> UI remains responsive, computation runs in parallel</li>
          <li><strong>Best for:</strong> Image processing, data parsing, complex calculations</li>
        </ul>
      </div>
    </div>
  );
}
