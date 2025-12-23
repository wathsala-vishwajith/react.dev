import { useState } from 'react';

// This component will be lazy loaded
export function HeavyChart() {
  const [data] = useState(() => {
    // Simulate loading heavy chart library
    console.log('🎨 HeavyChart component loaded and initialized');
    return Array.from({ length: 50 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 5) * 100 + Math.random() * 20,
    }));
  });

  return (
    <div className="component-box">
      <h3>Heavy Chart Component</h3>
      <p className="info">This component was lazy loaded - only downloaded when needed!</p>
      <div className="chart-container">
        <svg width="100%" height="200" style={{ border: '1px solid #ccc' }}>
          {data.map((point, i) => (
            <circle
              key={i}
              cx={`${(i / data.length) * 100}%`}
              cy={`${50 + point.y / 2}%`}
              r="3"
              fill="#4CAF50"
            />
          ))}
          <polyline
            points={data.map((p, i) => `${(i / data.length) * 100}%,${50 + p.y / 2}%`).join(' ')}
            fill="none"
            stroke="#2196F3"
            strokeWidth="2"
          />
        </svg>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          📊 Sample Data Visualization
        </p>
      </div>
    </div>
  );
}

export function HeavyImageGallery() {
  const images = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Image ${i + 1}`,
    url: `https://picsum.photos/200/150?random=${i}`,
  }));

  console.log('🖼️ HeavyImageGallery component loaded');

  return (
    <div className="component-box">
      <h3>Heavy Image Gallery</h3>
      <p className="info">This gallery was lazy loaded - saving initial bundle size!</p>
      <div className="image-grid">
        {images.slice(0, 6).map(img => (
          <div key={img.id} className="image-item">
            <div style={{
              width: '100%',
              height: '150px',
              background: `linear-gradient(${img.id * 20}deg, #667eea 0%, #764ba2 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {img.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeavyDataTable() {
  const [data] = useState(() => {
    console.log('📊 HeavyDataTable component loaded');
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Admin', 'User', 'Manager'][i % 3],
      status: ['Active', 'Inactive'][i % 2],
    }));
  });

  return (
    <div className="component-box">
      <h3>Heavy Data Table</h3>
      <p className="info">This data table was lazy loaded!</p>
      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', position: 'sticky', top: 0 }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 20).map(row => (
              <tr key={row.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.id}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.email}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{row.role}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '3px',
                    background: row.status === 'Active' ? '#4CAF50' : '#999',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
