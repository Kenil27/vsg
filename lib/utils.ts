// ─── Phone / WhatsApp Utilities ──────────────────────────────────────────────

/**
 * Strips all non-digit characters and returns the last 10 digits if they form
 * a plausible Indian mobile number (starts with 6–9).
 *
 * @example
 * extractIndianMobile("kehul bhai 9820241010") // "9820241010"
 * extractIndianMobile("+91-98202 41010")       // "9820241010"
 * extractIndianMobile("12345")                 // null
 */
export function extractIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const last10 = digits.slice(-10);
  return /^[6-9]\d{9}$/.test(last10) ? last10 : null;
}

/**
 * Returns the E.164-style number used by WhatsApp deep-links (`wa.me/<number>`).
 * Prepends the Indian country code `91` to the extracted 10-digit number.
 *
 * @example
 * toWhatsAppNumber("9820241010")  // "919820241010"
 * toWhatsAppNumber("invalid")     // null
 */
export function toWhatsAppNumber(raw: string): string | null {
  const ten = extractIndianMobile(raw);
  return ten ? `91${ten}` : null;
}

/**
 * Builds a `wa.me` deep-link URL, optionally pre-filling a message.
 *
 * @example
 * buildWhatsAppLink("9820241010", "Hello!")
 * // "https://wa.me/919820241010?text=Hello%21"
 */
export function buildWhatsAppLink(raw: string, message?: string): string | null {
  const number = toWhatsAppNumber(raw);
  if (!number) return null;
  const base = `https://wa.me/${number}`;
  return message
    ? `${base}?text=${encodeURIComponent(message)}`
    : base;
}

/**
 * Returns `true` if `raw` contains a valid Indian mobile number.
 *
 * @example
 * isValidIndianMobile("9820241010") // true
 * isValidIndianMobile("1234567890") // false  (doesn't start with 6–9)
 */
export function isValidIndianMobile(raw: string): boolean {
  return extractIndianMobile(raw) !== null;
}

// ─── Date / Time Utilities ────────────────────────────────────────────────────

/**
 * Formats a `Date` (or timestamp in ms) as a human-readable string.
 * Defaults to `"en-IN"` locale with IST timezone.
 *
 * @example
 * formatDate(new Date("2024-01-15"))
 * // "15 January 2024"
 */
export function formatDate(
  date: Date | number,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
  locale = "en-IN"
): string {
  return new Intl.DateTimeFormat(locale, options).format(
    typeof date === "number" ? new Date(date) : date
  );
}

/**
 * Formats a `Date` as a short time string (e.g. "3:45 PM").
 *
 * @example
 * formatTime(new Date("2024-01-15T15:45:00"))
 * // "3:45 PM"
 */
export function formatTime(date: Date | number, locale = "en-IN"): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(typeof date === "number" ? new Date(date) : date);
}

/**
 * Returns a relative time string (e.g. "2 hours ago", "in 3 days").
 * Falls back to `formatDate` for dates older than `fallbackDays` days.
 *
 * @example
 * timeAgo(Date.now() - 2 * 60 * 60 * 1000) // "2 hours ago"
 * timeAgo(Date.now() - 1000)                // "just now"
 */
export function timeAgo(
  date: Date | number,
  fallbackDays = 7,
  locale = "en-IN"
): string {
  const ms = typeof date === "number" ? date : date.getTime();
  const diffMs = Date.now() - ms;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (Math.abs(diffSec) < 5) return "just now";

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
  if (Math.abs(diffHr) < 24) return rtf.format(-diffHr, "hour");
  if (Math.abs(diffDay) <= fallbackDays) return rtf.format(-diffDay, "day");

  return formatDate(ms, undefined, locale);
}

/**
 * Returns `true` if two dates fall on the same calendar day.
 *
 * @example
 * isSameDay(new Date("2024-01-15"), new Date("2024-01-15T23:59")) // true
 * isSameDay(new Date("2024-01-15"), new Date("2024-01-16"))       // false
 */
export function isSameDay(a: Date | number, b: Date | number): boolean {
  const da = typeof a === "number" ? new Date(a) : a;
  const db = typeof b === "number" ? new Date(b) : b;
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

// ─── String Utilities ────────────────────────────────────────────────────────

/**
 * Truncates a string to a specified maximum length and appends a suffix.
 *
 * @example
 * truncate("Hello World", 8) // "Hello..."
 * truncate("Hi", 5)          // "Hi"
 */
export function truncate(str: string, maxLength: number, suffix = "..."): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + suffix;
}

