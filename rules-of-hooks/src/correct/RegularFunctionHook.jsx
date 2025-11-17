import { useState, useEffect } from 'react';

/**
 * ✅ CORRECT: React function component can use hooks
 *
 * Hooks can be called from:
 * 1. React function components (must be capitalized)
 * 2. Custom hooks (must start with "use")
 */

// ✅ CORRECT: This is a React function component
function CounterComponent() {
  // ✅ CORRECT: Hooks can be called from React components
  const [count, setCount] = useState(0);

  return (
    <div>
      <h3>Counter Component (CORRECT)</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

/**
 * ✅ CORRECT: Custom hook for shared logic
 *
 * Custom hooks must start with "use" and can call other hooks
 */
function useCounter(initialValue = 0) {
  // ✅ CORRECT: Custom hooks can call other hooks
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

/**
 * ✅ CORRECT: Component using a custom hook
 */
function CounterWithCustomHook() {
  // ✅ CORRECT: Using custom hook in a component
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <h3>Custom Hook Counter (CORRECT)</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

/**
 * ✅ CORRECT: Regular utility function that doesn't use hooks
 */
function calculateTotal(items) {
  // ✅ CORRECT: Regular function doing regular calculations
  return items.reduce((acc, item) => acc + item.price, 0);
}

/**
 * ✅ CORRECT: Component that uses the utility function
 */
function ShoppingCart({ items }) {
  // ✅ CORRECT: Hooks in the component
  const [discount, setDiscount] = useState(0);

  // ✅ CORRECT: Using regular function for calculations
  const subtotal = calculateTotal(items);
  const total = subtotal - discount;

  return (
    <div>
      <h3>Shopping Cart (CORRECT)</h3>
      <p>Subtotal: ${subtotal}</p>
      <p>Discount: ${discount}</p>
      <p>Total: ${total}</p>
      <button onClick={() => setDiscount(10)}>Apply $10 Discount</button>
    </div>
  );
}

/**
 * ✅ CORRECT: Custom hook for calculated values
 */
function useShoppingCart(items) {
  // ✅ CORRECT: Custom hook can use other hooks
  const [discount, setDiscount] = useState(0);

  const subtotal = calculateTotal(items);
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    setDiscount
  };
}

/**
 * ✅ CORRECT: Component using custom shopping cart hook
 */
function ShoppingCartWithHook({ items }) {
  // ✅ CORRECT: Using custom hook
  const { subtotal, discount, total, setDiscount } = useShoppingCart(items);

  return (
    <div>
      <h3>Shopping Cart with Custom Hook (CORRECT)</h3>
      <p>Subtotal: ${subtotal}</p>
      <p>Discount: ${discount}</p>
      <p>Total: ${total}</p>
      <button onClick={() => setDiscount(10)}>Apply $10 Discount</button>
    </div>
  );
}

export {
  CounterComponent,
  useCounter,
  CounterWithCustomHook,
  calculateTotal,
  ShoppingCart,
  useShoppingCart,
  ShoppingCartWithHook
};
