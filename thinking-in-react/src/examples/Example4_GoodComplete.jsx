import { useState } from 'react';
import { PRODUCTS } from '../data/products';

/**
 * ✅ GOOD EXAMPLE: Complete with Proper State Management
 *
 * This demonstrates the complete "Thinking in React" approach:
 * 1. ✅ Component hierarchy (Step 2)
 * 2. ✅ Static version built first (Step 2)
 * 3. ✅ Identified minimal state (Step 3)
 * 4. ✅ State lives in the right place (Step 4)
 * 5. ✅ Inverse data flow implemented (Step 5)
 *
 * State Design Decisions:
 * - filterText: ✅ State (user input, changes over time, can't be computed)
 * - inStockOnly: ✅ State (user input, changes over time, can't be computed)
 * - products: ❌ Not state (passed as props, doesn't change)
 * - filteredProducts: ❌ Not state (can be computed from products + filters)
 *
 * Where State Lives:
 * - State lives in FilterableProductTable (common parent)
 * - SearchBar receives state and callbacks via props
 * - ProductTable receives filtered results via props
 * - Data flows down, events flow up
 */

/**
 * ProductCategoryRow - Pure presentational component
 */
function ProductCategoryRow({ category }) {
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
        {category}
      </th>
    </tr>
  );
}

/**
 * ProductRow - Pure presentational component
 */
function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: 'red' }}>
      {product.name}
    </span>
  );

  return (
    <tr>
      <td style={{
        padding: '12px',
        borderBottom: '1px solid #ddd'
      }}>
        {name}
      </td>
      <td style={{
        padding: '12px',
        borderBottom: '1px solid #ddd'
      }}>
        {product.price}
      </td>
    </tr>
  );
}

/**
 * ProductTable - Filters and displays products
 * ✅ Receives filtered data as props (no state here)
 * ✅ Filtering logic is done by parent
 */
function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    // ✅ Filter products based on props
    // Note: This could also be done in the parent, both approaches work
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }

    // Add category row when category changes
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
      lastCategory = product.category;
    }

    // Add product row
    rows.push(
      <ProductRow
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
          }}>
            Name
          </th>
          <th style={{
            textAlign: 'left',
            padding: '12px',
            borderBottom: '2px solid #ddd'
          }}>
            Price
          </th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

/**
 * SearchBar - Controlled component
 * ✅ Receives state values via props (controlled)
 * ✅ Notifies parent of changes via callbacks (inverse data flow)
 * ✅ No local state - parent controls the values
 */
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
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
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
          style={{ marginRight: '5px' }}
        />
        Only show products in stock
      </label>
    </form>
  );
}

/**
 * FilterableProductTable - Container component with state
 * ✅ Owns the state (minimal state principle)
 * ✅ State lives at the common parent level
 * ✅ Passes state down via props
 * ✅ Passes callbacks down for inverse data flow
 */
function FilterableProductTable({ products }) {
  // ✅ Minimal state - only what can't be computed
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>✅ Good Example: Complete with State Management</h2>
      <div style={{
        backgroundColor: '#d1ecf1',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '1px solid #bee5eb'
      }}>
        <strong>🎯 Perfect state management:</strong>
        <ul>
          <li><strong>Minimal state:</strong> Only filterText and inStockOnly</li>
          <li><strong>Right location:</strong> State lives in common parent</li>
          <li><strong>Controlled components:</strong> SearchBar is controlled by parent</li>
          <li><strong>Derived data:</strong> Filtered list is computed, not stored</li>
          <li><strong>Single source of truth:</strong> No duplicate state</li>
          <li><strong>One-way data flow:</strong> Props down, events up</li>
        </ul>
      </div>

      {/* ✅ SearchBar is a controlled component */}
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />

      {/* ✅ ProductTable receives everything via props */}
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#d4edda',
        borderRadius: '5px',
        border: '1px solid #c3e6cb'
      }}>
        <strong>🎓 Key Principles Applied:</strong>
        <ol>
          <li>
            <strong>Identify minimal state:</strong>
            <ul>
              <li>✅ <code>filterText</code> - user input, changes, can't compute</li>
              <li>✅ <code>inStockOnly</code> - user input, changes, can't compute</li>
              <li>❌ <code>filteredProducts</code> - can be computed, so not state!</li>
            </ul>
          </li>
          <li>
            <strong>State location:</strong> In the lowest common parent that needs it
            (FilterableProductTable)
          </li>
          <li>
            <strong>Data flow:</strong>
            <ul>
              <li>📥 Props flow down (parent → children)</li>
              <li>📤 Events flow up (children → parent via callbacks)</li>
            </ul>
          </li>
          <li>
            <strong>Controlled components:</strong> SearchBar doesn't own its state,
            parent controls it
          </li>
        </ol>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '5px',
        border: '1px solid #ffc107'
      }}>
        <strong>🔄 How data flows:</strong>
        <pre style={{
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
{`1. User types in SearchBar input
   ↓
2. onChange fires → onFilterTextChange callback
   ↓
3. Parent's setFilterText updates state
   ↓
4. React re-renders with new state
   ↓
5. New filterText flows down to:
   - SearchBar (displays new value)
   - ProductTable (filters products)
   ↓
6. Filtered products appear!`}
        </pre>
      </div>
    </div>
  );
}

// Export with data
export default function Example4() {
  return <FilterableProductTable products={PRODUCTS} />;
}
