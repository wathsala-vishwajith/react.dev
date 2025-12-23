import { FixedSizeList as List } from 'react-window';
import { useState, useMemo } from 'react';

// Generate large dataset
const generateItems = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Item ${index + 1}`,
    description: `Description for item ${index + 1}`,
    value: Math.random() * 1000,
  }));
};

// WITHOUT Virtual Scrolling - renders all items
export function RegularList({ itemCount = 10000 }) {
  const items = useMemo(() => generateItems(itemCount), [itemCount]);

  console.log(`🔴 RegularList: Rendering ${itemCount} items in DOM`);

  return (
    <div className="component-box">
      <h3>❌ Without Virtual Scrolling</h3>
      <p className="info">Rendering {itemCount} DOM nodes (slow!)</p>
      <div className="list-container" style={{ height: '400px', overflow: 'auto', border: '1px solid #ccc' }}>
        {items.slice(0, 100).map(item => ( // Limiting to 100 for demo purposes
          <div key={item.id} className="list-item" style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{item.name}</strong>
            <p>{item.description}</p>
            <small>Value: {item.value.toFixed(2)}</small>
          </div>
        ))}
        <p style={{ padding: '10px', color: '#666' }}>
          (Showing only 100 items to prevent browser freeze)
        </p>
      </div>
    </div>
  );
}

// WITH Virtual Scrolling - only renders visible items
export function VirtualizedList({ itemCount = 10000 }) {
  const items = useMemo(() => generateItems(itemCount), [itemCount]);

  console.log(`🟢 VirtualizedList: Managing ${itemCount} items (only rendering ~10 visible)`);

  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div style={style} className="list-item">
        <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
          <strong>{item.name}</strong>
          <p style={{ margin: '5px 0' }}>{item.description}</p>
          <small>Value: {item.value.toFixed(2)}</small>
        </div>
      </div>
    );
  };

  return (
    <div className="component-box">
      <h3>✅ With Virtual Scrolling (react-window)</h3>
      <p className="info">Managing {itemCount} items, rendering only visible ones (~10 DOM nodes)</p>
      <List
        height={400}
        itemCount={itemCount}
        itemSize={80}
        width="100%"
        style={{ border: '1px solid #ccc' }}
      >
        {Row}
      </List>
    </div>
  );
}

// Comparison Component
export function VirtualScrollingComparison() {
  const [itemCount, setItemCount] = useState(10000);
  const [showRegular, setShowRegular] = useState(false);

  return (
    <div className="demo-section">
      <h2>Virtual Scrolling Demo</h2>

      <div className="controls">
        <label>
          Item Count: {itemCount}
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="comparison-grid">
        <div>
          <label>
            <input
              type="checkbox"
              checked={showRegular}
              onChange={(e) => setShowRegular(e.target.checked)}
            />
            Show Regular List (Warning: May be slow!)
          </label>
          {showRegular && <RegularList itemCount={Math.min(itemCount, 100)} />}
        </div>
        <VirtualizedList itemCount={itemCount} />
      </div>

      <div className="metrics-info">
        <h4>Performance Impact:</h4>
        <ul>
          <li><strong>Regular List:</strong> {itemCount} DOM nodes = High memory + slow scrolling</li>
          <li><strong>Virtualized List:</strong> ~10-15 DOM nodes = Low memory + smooth scrolling</li>
          <li><strong>Memory Savings:</strong> ~{((1 - 15/itemCount) * 100).toFixed(1)}%</li>
        </ul>
      </div>
    </div>
  );
}
