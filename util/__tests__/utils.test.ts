import { describe, it, expect } from 'vitest';
import { truncate, capitalize, slugify } from '../utils.js';

describe('truncate', () => {
  it('should return the original string if its length is less than or equal to maxLength', () => {
    const result = truncate('Hello', 5);
    expect(result).toBe('Hello');
  });

  it('should truncate the string and append the suffix if its length is greater than maxLength', () => {
    const result = truncate('Hello World', 5);
    expect(result).toBe('Hello...');
  });

  it('should use the provided suffix when truncating', () => {
    const result = truncate('Hello World', 5, '***');
    expect(result).toBe('Hello***');
  });
});

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    const result = capitalize('hello');
    expect(result).toBe('Hello');
  });

  it('should return an empty string if the input is an empty string', () => {
    const result = capitalize('');
    expect(result).toBe('');
  });
});

describe('slugify', () => {
  it('should convert a string into a URL-friendly slug', () => {
    const result = slugify('Hello World!');
    expect(result).toBe('hello-world');
  });

  it('should handle strings with special characters and spaces', () => {
    const result = slugify('  Hello, World!  ');
    expect(result).toBe('hello-world');
  });

  it('should handle strings with multiple spaces and hyphens', () => {
    const result = slugify('Hello   World---Test');
    expect(result).toBe('hello-world-test');
  });
});