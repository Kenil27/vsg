/**
 * Truncates a string to a specified maximum length and appends a suffix (defaulting to "...").
 *
 * @example
 * truncate("Hello World", 8) // "Hello..."
 * truncate("Hi", 5)          // "Hi"
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
