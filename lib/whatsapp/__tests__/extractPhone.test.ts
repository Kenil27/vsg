import { describe, it, expect } from 'vitest';
import { extractIndianMobileDigits, toWhatsAppE164 } from '../extractPhone.js';

describe('extractIndianMobileDigits', () => {
  it('should return the last valid Indian mobile number from a string', () => {
    const input = 'Contact me at 9820241010 or 9594121207';
    const result = extractIndianMobileDigits(input);
    expect(result).toBe('9594121207');
  });

  it('should return null if no valid Indian mobile number is found', () => {
    const input = 'Call me at 1234567890';
    const result = extractIndianMobileDigits(input);
    expect(result).toBeNull();
  });

  it('should handle strings with country code and separators', () => {
    const input = 'Reach me at +91-9820241010 or 91 9594121207';
    const result = extractIndianMobileDigits(input);
    expect(result).toBe('9594121207');
  });

  it('should return null for strings without digits', () => {
    const input = 'Hello World!';
    const result = extractIndianMobileDigits(input);
    expect(result).toBeNull();
  });
});

describe('toWhatsAppE164', () => {
  it('should return the E.164 format for a valid Indian mobile number', () => {
    const input = 'Contact: 9820241010';
    const result = toWhatsAppE164(input);
    expect(result).toBe('9820241010');
  });

  it('should return null if no valid Indian mobile number is found', () => {
    const input = 'No valid number here';
    const result = toWhatsAppE164(input);
    expect(result).toBeNull();
  });
});