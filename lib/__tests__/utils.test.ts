import { describe, it, expect } from 'vitest';
import { truncate } from '../utils.js';

describe('truncate', () => {
  it('should return the original string if its length is less than or equal to maxLength', () => {
    expect(truncate('Hi', 5)).toBe('Hi');
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('should truncate the string and append "..." if its length is greater than maxLength', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
    expect(truncate('This is a test', 7)).toBe('This is...');
  });

  it('should handle empty strings correctly', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('should handle maxLength of zero', () => {
    expect(truncate('Hello', 0)).toBe('...');
  });
});