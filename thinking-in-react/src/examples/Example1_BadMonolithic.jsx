import { useState } from 'react';
import { PRODUCTS } from '../data/products';

/**
 * ❌ BAD EXAMPLE: Monolithic Component
 *
 * Problems with this approach:
 * 1. Everything is in one massive component - violates Single Responsibility Principle
 * 2. No component hierarchy - hard to understand and maintain
 * 3. HTML structure is cluttered with logic
 * 4. Difficult to reuse parts of the UI
 * 5. Hard to test individual pieces
 * 6. Mixing presentation and business logic
 * 7. Poor separation of concerns
 */
function BadMonolithicProductTable() {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  // All the rendering logic is jumbled together in one return statement
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>❌ Bad Example: Monolithic Component</h2>
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '1px solid #ffc107'
      }}>
        <strong>⚠️ Anti-patterns in this example:</strong>
        <ul>
          <li>Everything in one component (1000+ lines in real apps)</li>
          <li>No reusability - can't use table or search separately</li>
          <li>Hard to maintain and debug</li>
          <li>Difficult to test</li>
        </ul>
      </div>

      {/* Search UI mixed with everything else */}
      <form style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
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
            onChange={(e) => setInStockOnly(e.target.checked)}
            style={{ marginRight: '5px' }}
          />
          Only show products in stock
        </label>
      </form>

      {/* Table structure directly in the main component */}
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
        <tbody>
          {/* Complex filtering logic mixed with rendering */}
          {(() => {
            let lastCategory = null;
            const rows = [];

            PRODUCTS.forEach((product) => {
              // Inline filtering logic - hard to test or reuse
              if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
                return;
              }
              if (inStockOnly && !product.stocked) {
                return;
              }

              // Category row logic mixed in
              if (product.category !== lastCategory) {
                rows.push(
                  <tr key={product.category}>
                    <th
                      colSpan="2"
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        backgroundColor: '#e9ecef',
                        fontWeight: 'bold'
                      }}
                    >
                      {product.category}
                    </th>
                  </tr>
                );
                lastCategory = product.category;
              }

              // Product row rendering mixed with everything
              rows.push(
                <tr key={product.name}>
                  <td style={{
                    padding: '12px',
                    color: product.stocked ? 'black' : 'red',
                    borderBottom: '1px solid #ddd'
                  }}>
                    {product.name}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #ddd'
                  }}>
                    {product.price}
                  </td>
                </tr>
              );
            });

            return rows;
          })()}
        </tbody>
      </table>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8d7da',
        borderRadius: '5px',
        border: '1px solid #f5c2c7'
      }}>
        <strong>🤔 Why is this bad?</strong>
        <p>Imagine adding features like:</p>
        <ul>
          <li>Sorting by price or name</li>
          <li>Adding to cart functionality</li>
          <li>Different table views</li>
          <li>Export functionality</li>
        </ul>
        <p>This component would become thousands of lines long and impossible to maintain!</p>
      </div>
    </div>
  );
}

export default BadMonolithicProductTable;
