import { describe, it, expect } from 'vitest';
import { extractIndianMobileDigits, toWhatsAppE164 } from '../extractPhone.js';

describe('extractIndianMobileDigits', () => {
  it('should return the last 10 digits if they form a valid Indian mobile number', () => {
    const result = extractIndianMobileDigits('kehul bhai 9820241010');
    expect(result).toBe('9820241010');
  });

  it('should return null if the string does not contain a valid Indian mobile number', () => {
    const result = extractIndianMobileDigits('random text 1234567890');
    expect(result).toBeNull();
  });

  it('should return null if the string contains less than 10 digits', () => {
    const result = extractIndianMobileDigits('short 12345');
    expect(result).toBeNull();
  });

  it('should return null if the last 10 digits do not start with 6-9', () => {
    const result = extractIndianMobileDigits('prefix 5123456789');
    expect(result).toBeNull();
  });
});

describe('toWhatsAppE164', () => {
  it('should return the E.164 format number if valid Indian mobile number is present', () => {
    const result = toWhatsAppE164('kehul bhai 9820241010');
    expect(result).toBe('9820241010');
  });

  it('should return null if no valid Indian mobile number is present', () => {
    const result = toWhatsAppE164('random text 1234567890');
    expect(result).toBeNull();
  });
});