/**
 * Clamps a number between a specified minimum and maximum value.
 * 
 * @param value - The value to clamp.
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linearly interpolates between two values.
 * 
 * @param start - The starting value.
 * @param end - The ending value.
 * @param amount - The interpolation amount (usually between 0 and 1).
 * @returns The interpolated value.
 */
export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

/**
 * Rounds a number to a specified number of decimal places.
 * 
 * @param value - The value to round.
 * @param decimals - The number of decimal places (defaults to 0).
 * @returns The rounded number.
 */
export function round(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
