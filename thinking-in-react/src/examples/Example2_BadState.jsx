import { useState } from 'react';
import { PRODUCTS } from '../data/products';

/**
 * ❌ BAD EXAMPLE: Improper State Management
 *
 * Problems with this approach:
 * 1. State is scattered across multiple components
 * 2. Redundant/duplicate state (filteredProducts is derived, shouldn't be state)
 * 3. State synchronization issues
 * 4. Excessive prop drilling
 * 5. State in the wrong component (child has state that parent needs)
 * 6. Unnecessary re-renders
 */

// Child component with its own state - BAD!
function BadSearchBar({ onFilterChange, onStockChange }) {
  // ❌ State lives here but is needed by siblings - causes prop drilling
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterText(value);
    // Have to call parent callback - awkward data flow
    onFilterChange(value);
  };

  const handleStockChange = (e) => {
    const checked = e.target.checked;
    setInStockOnly(checked);
    // Have to call parent callback - awkward data flow
    onStockChange(checked);
  };

  return (
    <form style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={handleFilterChange}
        style={{
          padding: '8px',
          marginRight: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      <label style={{ display: 'block', marginTop: '10px' }}>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={handleStockChange}
          style={{ marginRight: '5px' }}
        />
        Only show products in stock
      </label>
    </form>
  );
}

function BadProductCategoryRow({ category }) {
  // ❌ Unnecessary state for something that never changes
  const [categoryName] = useState(category);

  return (
    <tr>
      <th
        colSpan="2"
        style={{
          textAlign: 'left',
          padding: '12px',
          backgroundColor: '#e9ecef',
          fontWeight: 'bold'
        }}
      >
        {categoryName}
      </th>
    </tr>
  );
}

function BadProductRow({ product }) {
  // ❌ Each row maintains its own hover state - inefficient
  const [isHovered, setIsHovered] = useState(false);
  // ❌ Storing product in state when it's already a prop
  const [productData] = useState(product);

  return (
    <tr
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? '#f8f9fa' : 'transparent'
      }}
    >
      <td style={{
        padding: '12px',
        color: productData.stocked ? 'black' : 'red',
        borderBottom: '1px solid #ddd'
      }}>
        {productData.name}
      </td>
      <td style={{
        padding: '12px',
        borderBottom: '1px solid #ddd'
      }}>
        {productData.price}
      </td>
    </tr>
  );
}

function BadProductTable({ products }) {
  // ❌ More unnecessary state - storing props as state
  const [tableData, setTableData] = useState(products);

  const rows = [];
  let lastCategory = null;

  // ❌ Using state instead of the prop directly
  tableData.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <BadProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
      lastCategory = product.category;
    }
    rows.push(
      <BadProductRow
        product={product}
        key={product.name}
      />
    );
  });

  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      border: '1px solid #ddd'
    }}>
      <thead>
        <tr style={{ backgroundColor: '#f8f9fa' }}>
          <th style={{
            textAlign: 'left',
            padding: '12px',
            borderBottom: '2px solid #ddd'
          }}>Name</th>
          <th style={{
            textAlign: 'left',
            padding: '12px',
            borderBottom: '2px solid #ddd'
          }}>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function BadStateProductTable() {
  // ❌ State duplicated from SearchBar
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  // ❌ Filtered products stored in state - this is DERIVED data, not state!
  // This creates synchronization problems
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

  // ❌ Have to manually keep filtered products in sync
  const handleFilterChange = (text) => {
    setFilterText(text);
    updateFilteredProducts(text, inStockOnly);
  };

  const handleStockChange = (checked) => {
    setInStockOnly(checked);
    updateFilteredProducts(filterText, checked);
  };

  // ❌ Complex synchronization logic needed because of bad state design
  const updateFilteredProducts = (text, stockOnly) => {
    const filtered = PRODUCTS.filter(product => {
      if (product.name.toLowerCase().indexOf(text.toLowerCase()) === -1) {
        return false;
      }
      if (stockOnly && !product.stocked) {
        return false;
      }
      return true;
    });
    setFilteredProducts(filtered);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>❌ Bad Example: Improper State Management</h2>
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '1px solid #ffc107'
      }}>
        <strong>⚠️ State management anti-patterns:</strong>
        <ul>
          <li>State duplicated in parent and child (filterText, inStockOnly)</li>
          <li>Derived data stored as state (filteredProducts)</li>
          <li>Props unnecessarily stored as state (in table and rows)</li>
          <li>Synchronization bugs waiting to happen</li>
          <li>Excessive prop drilling</li>
        </ul>
      </div>

      <BadSearchBar
        onFilterChange={handleFilterChange}
        onStockChange={handleStockChange}
      />
      <BadProductTable products={filteredProducts} />

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8d7da',
        borderRadius: '5px',
        border: '1px solid #f5c2c7'
      }}>
        <strong>🐛 Bugs in this code:</strong>
        <ul>
          <li><code>filteredProducts</code> can get out of sync with <code>filterText</code></li>
          <li>State is duplicated - violates single source of truth</li>
          <li>Props copied to state can become stale</li>
          <li>Every product row has unnecessary state</li>
        </ul>
        <p><strong>The fix:</strong> Lift state up and compute derived values!</p>
      </div>
    </div>
  );
}

export default BadStateProductTable;
