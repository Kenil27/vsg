/**
 * Pulls the last plausible Indian mobile (10 digits, starts 6–9) from strings like
 * "kehul bhai 9820241010" or "Keyul9594121207".
 */
export function extractIndianMobileDigits(raw: string): string | null {
  const regex = /(?:\+91[\s-]?|91[\s-]?)?([6-9]\d{9})(?!\d)/g;

  let match: RegExpExecArray | null;
  let last: string | null = null;

  while ((match = regex.exec(raw)) !== null) {
    last = match[1];
  }

  return last ? last : null;
}

/** `91` + 10 digits for wa.me */
export function toWhatsAppE164(raw: string): string | null {
  const ten = extractIndianMobileDigits(raw);
  return ten ? `91${ten}` : null;
}
