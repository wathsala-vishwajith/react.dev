import React from 'react';

/**
 * Card component to display code examples
 */
function ExampleCard({ title, type, children, description }) {
  const bgColor = type === 'incorrect' ? '#fff5f5' : '#f0fff4';
  const borderColor = type === 'incorrect' ? '#fc8181' : '#68d391';
  const iconColor = type === 'incorrect' ? '#e53e3e' : '#38a169';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}
    >
      <h3 style={{ color: iconColor, marginTop: 0 }}>
        {type === 'incorrect' ? '❌' : '✅'} {title}
      </h3>
      {description && (
        <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
          {description}
        </p>
      )}
      <div style={{ marginTop: '15px' }}>{children}</div>
    </div>
  );
}

export default ExampleCard;
