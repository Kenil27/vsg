import { describe, it, expect } from 'vitest';
import { truncate, capitalize } from '../utils.js';

describe('truncate', () => {
  it('should return the original string if its length is less than or equal to maxLength', () => {
    const result = truncate('hello', 5);
    expect(result).toBe('hello');
  });

  it('should truncate the string and append the suffix if its length is greater than maxLength', () => {
    const result = truncate('hello world', 5);
    expect(result).toBe('hello...');
  });

  it('should use the provided suffix when truncating', () => {
    const result = truncate('hello world', 5, '***');
    expect(result).toBe('hello***');
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

  it('should return an empty string if the input is undefined', () => {
    const result = capitalize(undefined);
    expect(result).toBe('');
  });
});