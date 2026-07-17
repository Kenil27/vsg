import { describe, it, expect } from 'vitest';
import { extractIndianMobileDigits, toWhatsAppE164 } from '../extractPhone.js';

describe('extractIndianMobileDigits', () => {
  it('should extract the last valid Indian mobile number from a string', () => {
    const input = 'Contact me at 9820241010 or 9594121207';
    const result = extractIndianMobileDigits(input);
    expect(result).toBe('9594121207');
  });

  it('should return null if no valid mobile number is found', () => {
    const input = 'No valid number here 123456789';
    const result = extractIndianMobileDigits(input);
    expect(result).toBeNull();
  });

  it('should handle strings with country code', () => {
    const input = 'Call +91-9820241010 now';
    const result = extractIndianMobileDigits(input);
    expect(result).toBe('9820241010');
  });

  it('should return null for strings with invalid numbers', () => {
    const input = 'Invalid number 1234567890';
    const result = extractIndianMobileDigits(input);
    expect(result).toBeNull();
  });
});

describe('toWhatsAppE164', () => {
  it('should convert a valid mobile number to WhatsApp E164 format', () => {
    const input = 'Contact 9820241010';
    const result = toWhatsAppE164(input);
    expect(result).toBe('9820241010');
  });

  it('should return null if no valid mobile number is found', () => {
    const input = 'No valid number here';
    const result = toWhatsAppE164(input);
    expect(result).toBeNull();
  });
});