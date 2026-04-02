/**
 * Formats a number as a percentage string.
 *
 * @param value - The numeric value (0–100 scale).
 * @param decimals - Number of decimal places to display (default: 0).
 * @returns The formatted percentage string, e.g. "75%" or "33.3%".
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}
