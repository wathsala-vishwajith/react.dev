import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductList from './ProductList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProductList onAddToCart={(product) => console.log('Added to cart:', product)} />
  </React.StrictMode>
);
