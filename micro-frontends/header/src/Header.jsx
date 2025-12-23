import React from 'react';
import './Header.css';

function Header({ cartCount = 0, onViewCart }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>🛍️ MicroStore</h1>
          <span className="badge">Micro-Frontend</span>
        </div>
        <nav className="nav">
          <button className="nav-link">Home</button>
          <button className="nav-link">Products</button>
          <button className="cart-button" onClick={onViewCart}>
            🛒 Cart
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
