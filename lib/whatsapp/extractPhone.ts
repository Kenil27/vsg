/**
 * Pulls the last plausible Indian mobile (10 digits, starts 6–9) from strings like
 * "kehul bhai 9820241010" or "Keyul9594121207".
 */
export function extractIndianMobileDigits(raw: string): string | null {
  const digitsOnly = raw.replace(/\D/g, "");
  if (digitsOnly.length < 10) return null;
  const last10 = digitsOnly.slice(-10);
  if (!/^[6-9]\d{9}$/.test(last10)) return null;
  return last10;
}

/** `91` + 10 digits for wa.me */
export function toWhatsAppE164(raw: string): string | null {
  const ten = extractIndianMobileDigits(raw);
  return ten;
}
