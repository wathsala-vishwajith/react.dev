import React, { Suspense, lazy, useState } from 'react';
import './App.css';

// Lazy load remote components from other micro-frontends
const Header = lazy(() => import('header/Header'));
const ProductList = lazy(() => import('products/ProductList'));
const Checkout = lazy(() => import('checkout/Checkout'));

function App() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setShowCheckout(false);
  };

  return (
    <div className="app">
      <Suspense fallback={<div className="loading">Loading Header...</div>}>
        <Header
          cartCount={cart.length}
          onViewCart={() => setShowCheckout(!showCheckout)}
        />
      </Suspense>

      <main className="main-content">
        {!showCheckout ? (
          <Suspense fallback={<div className="loading">Loading Products...</div>}>
            <ProductList onAddToCart={addToCart} />
          </Suspense>
        ) : (
          <Suspense fallback={<div className="loading">Loading Checkout...</div>}>
            <Checkout
              cart={cart}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onBack={() => setShowCheckout(false)}
            />
          </Suspense>
        )}
      </main>

      <footer className="footer">
        <p>Micro-Frontend Architecture Demo with Module Federation</p>
        <p className="tech-info">
          Host App (Port 3000) | Header (Port 3001) | Products (Port 3002) | Checkout (Port 3003)
        </p>
      </footer>
    </div>
  );
}

export default App;
