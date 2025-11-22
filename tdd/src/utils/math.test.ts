import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide, factorial } from './math';

describe('Math Utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should add positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(subtract(3, 5)).toBe(-2);
    });

    it('should handle negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(multiply(-3, 4)).toBe(-12);
      expect(multiply(-3, -4)).toBe(12);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(divide(5, 2)).toBe(2.5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Division by zero');
    });

    it('should handle negative numbers', () => {
      expect(divide(-10, 2)).toBe(-5);
      expect(divide(10, -2)).toBe(-5);
      expect(divide(-10, -2)).toBe(5);
    });
  });

  describe('factorial', () => {
    it('should calculate factorial of 0', () => {
      expect(factorial(0)).toBe(1);
    });

    it('should calculate factorial of 1', () => {
      expect(factorial(1)).toBe(1);
    });

    it('should calculate factorial of positive numbers', () => {
      expect(factorial(5)).toBe(120);
      expect(factorial(3)).toBe(6);
      expect(factorial(4)).toBe(24);
    });

    it('should throw error for negative numbers', () => {
      expect(() => factorial(-1)).toThrow(
        'Factorial is not defined for negative numbers'
      );
    });
  });
});
