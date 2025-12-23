import React, { useState } from 'react';
import './ProductList.css';

const PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation',
    image: '🎧',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    category: 'Electronics',
    description: 'Feature-rich smartwatch with health tracking',
    image: '⌚',
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 49.99,
    category: 'Accessories',
    description: 'Ergonomic aluminum laptop stand',
    image: '💻',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 129.99,
    category: 'Electronics',
    description: 'RGB mechanical keyboard with premium switches',
    image: '⌨️',
  },
  {
    id: 5,
    name: 'Wireless Mouse',
    price: 39.99,
    category: 'Electronics',
    description: 'Precision wireless mouse with ergonomic design',
    image: '🖱️',
  },
  {
    id: 6,
    name: 'USB-C Hub',
    price: 59.99,
    category: 'Accessories',
    description: 'Multi-port USB-C hub with 4K HDMI output',
    image: '🔌',
  },
];

function ProductList({ onAddToCart }) {
  const [filter, setFilter] = useState('All');
  const [addedProducts, setAddedProducts] = useState(new Set());

  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];

  const filteredProducts = filter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    setAddedProducts(new Set([...addedProducts, product.id]));

    // Remove the "added" state after animation
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="product-list-container">
      <div className="product-header">
        <h2>Our Products</h2>
        <div className="filter-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="description">{product.description}</p>
              <div className="product-footer">
                <span className="price">${product.price}</span>
                <button
                  className={`add-to-cart-btn ${addedProducts.has(product.id) ? 'added' : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={addedProducts.has(product.id)}
                >
                  {addedProducts.has(product.id) ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
