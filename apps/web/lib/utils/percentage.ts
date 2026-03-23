/**
 * Formats a number as a percentage string.
 *
 * @param value    The numeric value to format.
 * @param options.decimals  Number of decimal places to include (default: 0).
 * @param options.isRatio   When true, multiplies `value` by 100 before formatting,
 *                          so that 0.3 → "30%" (default: false).
 *
 * @example
 * formatPercentage(30)                    // "30%"
 * formatPercentage(0.3, { isRatio: true }) // "30%"
 * formatPercentage(0.567, { isRatio: true, decimals: 1 }) // "56.7%"
 */
export function formatPercentage(
  value: number,
  options: { decimals?: number; isRatio?: boolean } = {}
): string {
  const { decimals = 0, isRatio = false } = options;
  const pct = isRatio ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}
