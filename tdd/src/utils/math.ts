/**
 * Adds two numbers together
 */
export const add = (a: number, b: number): number => {
  return a + b;
};

/**
 * Subtracts b from a
 */
export const subtract = (a: number, b: number): number => {
  return a - b;
};

/**
 * Multiplies two numbers
 */
export const multiply = (a: number, b: number): number => {
  return a * b;
};

/**
 * Divides a by b
 * @throws {Error} if b is zero
 */
export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
};

/**
 * Calculates the factorial of a number
 * @throws {Error} if n is negative
 */
export const factorial = (n: number): number => {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
};
