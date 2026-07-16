import { describe, it, expect } from 'vitest';
import { extractIndianMobileDigits, toWhatsAppE164 } from '../extractPhone.js';

describe('extractIndianMobileDigits', () => {
  it('should return the last valid Indian mobile number from a string', () => {
    const input = "Contact me at 9820241010 or 9594121207";
    const result = extractIndianMobileDigits(input);
    expect(result).toBe("9594121207");
  });

  it('should return null if no valid Indian mobile number is found', () => {
    const input = "No valid number here";
    const result = extractIndianMobileDigits(input);
    expect(result).toBeNull();
  });

  it('should handle strings with country code and spaces', () => {
    const input = "Call +91 9820241010 now";
    const result = extractIndianMobileDigits(input);
    expect(result).toBe("9820241010");
  });

  it('should handle strings with country code and dashes', () => {
    const input = "Reach me at +91-9820241010";
    const result = extractIndianMobileDigits(input);
    expect(result).toBe("9820241010");
  });
});

describe('toWhatsAppE164', () => {
  it('should return the E164 format for a valid Indian mobile number', () => {
    const input = "Contact me at 9820241010";
    const result = toWhatsAppE164(input);
    expect(result).toBe("9820241010");
  });

  it('should return null if no valid Indian mobile number is found', () => {
    const input = "No valid number here";
    const result = toWhatsAppE164(input);
    expect(result).toBeNull();
  });
});