// Web Worker for heavy computations
self.onmessage = function(e) {
  const { type, data } = e.data;

  switch (type) {
    case 'PROCESS_DATA':
      const result = processLargeDataset(data);
      self.postMessage({ type: 'RESULT', data: result });
      break;

    case 'CALCULATE_FIBONACCI':
      const fib = calculateFibonacci(data);
      self.postMessage({ type: 'FIBONACCI_RESULT', data: fib });
      break;

    case 'SORT_LARGE_ARRAY':
      const sorted = data.sort((a, b) => a - b);
      self.postMessage({ type: 'SORTED_RESULT', data: sorted });
      break;

    default:
      self.postMessage({ type: 'ERROR', data: 'Unknown operation' });
  }
};

function processLargeDataset(data) {
  // Simulate heavy computation
  const processed = data.map(item => {
    let result = item;
    for (let i = 0; i < 10000; i++) {
      result = Math.sqrt(result * result + 1);
    }
    return result;
  });
  return processed;
}

function calculateFibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}
