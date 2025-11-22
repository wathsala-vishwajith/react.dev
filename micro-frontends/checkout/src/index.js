import React from 'react';
import ReactDOM from 'react-dom/client';
import Checkout from './Checkout';

const sampleCart = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, image: '🎧' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: '⌚' },
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Checkout
      cart={sampleCart}
      onRemoveItem={(id) => console.log('Remove item:', id)}
      onClearCart={() => console.log('Clear cart')}
      onBack={() => console.log('Go back')}
    />
  </React.StrictMode>
);
