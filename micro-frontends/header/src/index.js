import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './Header';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header cartCount={3} onViewCart={() => alert('Cart clicked!')} />
  </React.StrictMode>
);
