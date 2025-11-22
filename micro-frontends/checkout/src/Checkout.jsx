import React, { useState } from 'react';
import './Checkout.css';

function Checkout({ cart = [], onRemoveItem, onClearCart, onBack }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      setTimeout(() => {
        onClearCart();
        setOrderComplete(false);
      }, 3000);
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="checkout-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase</p>
          <p className="order-number">Order #MF-{Math.floor(Math.random() * 10000)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Products
        </button>
        <h2>Shopping Cart</h2>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
          <button className="continue-shopping" onClick={onBack}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="checkout-content">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <div className="item-image">{item.image}</div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <button
                  className="remove-button"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                'Complete Purchase'
              )}
            </button>

            <button
              className="clear-cart-button"
              onClick={onClearCart}
              disabled={isProcessing}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
