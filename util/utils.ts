export function truncate(str: string, maxLength: number, suffix = "..."): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + suffix;
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @example
 * capitalize("hello") // "Hello"
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}