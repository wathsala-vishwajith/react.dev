import { describe, it, expect } from 'vitest';
import { capitalize, reverse, isPalindrome, truncate } from './string';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should not modify the rest of the string', () => {
      expect(capitalize('hELLO')).toBe('HELLO');
    });
  });

  describe('reverse', () => {
    it('should reverse a string', () => {
      expect(reverse('hello')).toBe('olleh');
    });

    it('should handle single character', () => {
      expect(reverse('a')).toBe('a');
    });

    it('should handle empty string', () => {
      expect(reverse('')).toBe('');
    });

    it('should handle strings with spaces', () => {
      expect(reverse('hello world')).toBe('dlrow olleh');
    });
  });

  describe('isPalindrome', () => {
    it('should return true for palindromes', () => {
      expect(isPalindrome('racecar')).toBe(true);
      expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
    });

    it('should return false for non-palindromes', () => {
      expect(isPalindrome('hello')).toBe(false);
      expect(isPalindrome('world')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isPalindrome('RaceCar')).toBe(true);
    });

    it('should ignore non-alphanumeric characters', () => {
      expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    });

    it('should handle single character', () => {
      expect(isPalindrome('a')).toBe(true);
    });

    it('should handle empty string', () => {
      expect(isPalindrome('')).toBe(true);
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(truncate('', 5)).toBe('');
    });

    it('should add ellipsis when truncating', () => {
      const result = truncate('This is a long string', 10);
      expect(result).toBe('This is a ...');
      expect(result.length).toBe(13); // 10 + 3 for '...'
    });
  });
});
