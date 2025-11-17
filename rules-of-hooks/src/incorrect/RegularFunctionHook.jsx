import { useState, useEffect } from 'react';

/**
 * ❌ INCORRECT: Calling hooks from regular JavaScript functions
 *
 * Hooks can only be called from:
 * 1. React function components
 * 2. Custom hooks (functions that start with "use")
 */

// ❌ WRONG: This is a regular JavaScript function, not a React component
function regularFunction() {
  // This will cause an error - hooks can't be called from regular functions
  const [count, setCount] = useState(0);
  return count;
}

/**
 * ❌ INCORRECT: Calling hooks from a class method
 */
class ClassComponentIncorrect extends React.Component {
  handleClick() {
    // ❌ WRONG: Hooks cannot be used in class components
    const [count, setCount] = useState(0);
    setCount(count + 1);
  }

  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}

/**
 * ❌ INCORRECT: Regular utility function trying to use hooks
 */
function calculateTotal(items) {
  // ❌ WRONG: This is a utility function, not a React component or custom hook
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + item.price, 0);
    setTotal(sum);
  }, [items]);

  return total;
}

export { regularFunction, ClassComponentIncorrect, calculateTotal };
