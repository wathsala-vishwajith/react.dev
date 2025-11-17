import { PRODUCTS } from '../data/products';

/**
 * ✅ GOOD EXAMPLE: Proper Component Hierarchy (Static Version)
 *
 * This demonstrates Step 2 of "Thinking in React":
 * Build a static version with proper component hierarchy
 *
 * Benefits:
 * 1. Clear component hierarchy - easy to understand
 * 2. Single Responsibility - each component does one thing
 * 3. Reusable components
 * 4. Easy to test each component independently
 * 5. Props flow down in one direction
 * 6. No state yet - start simple, add interactivity later
 *
 * Component Hierarchy:
 * FilterableProductTable
 *   ├── SearchBar
 *   └── ProductTable
 *       ├── ProductCategoryRow
 *       └── ProductRow
 */

/**
 * ProductCategoryRow - Displays a category header
 * Responsibility: Render a single category header
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
 * ProductRow - Displays a single product
 * Responsibility: Render a single product with appropriate styling
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
 * ProductTable - Displays the table of products with categories
 * Responsibility: Organize products by category and render them
 */
function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    // Add category header when category changes
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
 * SearchBar - Displays the search and filter controls
 * Responsibility: Render the search input and checkbox
 * Note: Static version - no event handlers yet
 */
function SearchBar() {
  return (
    <form style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search..."
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
          style={{ marginRight: '5px' }}
        />
        Only show products in stock
      </label>
    </form>
  );
}

/**
 * FilterableProductTable - Top-level component
 * Responsibility: Compose the search bar and product table
 * Note: In this static version, data flows down via props
 */
function FilterableProductTable({ products }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>✅ Good Example: Proper Component Hierarchy (Static)</h2>
      <div style={{
        backgroundColor: '#d1ecf1',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '1px solid #bee5eb'
      }}>
        <strong>✨ What makes this good:</strong>
        <ul>
          <li><strong>Clear hierarchy:</strong> Each component has a single, well-defined purpose</li>
          <li><strong>Reusable:</strong> Can use ProductTable or SearchBar independently</li>
          <li><strong>Maintainable:</strong> Easy to find and fix issues</li>
          <li><strong>Testable:</strong> Each component can be tested in isolation</li>
          <li><strong>Props down:</strong> Data flows in one direction</li>
        </ul>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        border: '1px solid #ffc107'
      }}>
        <strong>📝 Note:</strong> This is a <em>static</em> version - no interactivity yet!
        <br />
        Search and checkbox don't work. That's intentional for learning.
        <br />
        <strong>Next step:</strong> Add state for interactivity (see Example 4)
      </div>

      <SearchBar />
      <ProductTable products={products} />

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#d4edda',
        borderRadius: '5px',
        border: '1px solid #c3e6cb'
      }}>
        <strong>🏗️ Component Breakdown:</strong>
        <pre style={{
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`FilterableProductTable
  ├── SearchBar
  └── ProductTable
      ├── ProductCategoryRow
      └── ProductRow`}
        </pre>
        <p>
          Each component is focused and has a single responsibility.
          This makes the codebase easy to understand and maintain.
        </p>
      </div>
    </div>
  );
}

// Export the main component with data
export default function Example3() {
  return <FilterableProductTable products={PRODUCTS} />;
}
