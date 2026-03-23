/**
 * Options for formatPercentage.
 */
export interface FormatPercentageOptions {
  /**
   * Input mode:
   * - "direct": value is already expressed as a percentage (e.g. 42 → "42%")
   * - "ratio": value is expressed as a fraction (e.g. 0.42 → "42%")
   * @default "direct"
   */
  mode?: "direct" | "ratio";
  /**
   * Number of decimal places to display.
   * @default 0
   */
  precision?: number;
  /**
   * String to return when the input is null, undefined, or non-finite.
   * @default "—"
   */
  fallback?: string;
}

/**
 * Formats a number as a percentage string.
 *
 * @example
 * formatPercentage(42)               // "42%"
 * formatPercentage(0.42, { mode: "ratio" }) // "42%"
 * formatPercentage(0.1234, { mode: "ratio", precision: 1 }) // "12.3%"
 * formatPercentage(null)             // "—"
 */
export function formatPercentage(
  input: number | null | undefined,
  options: FormatPercentageOptions = {}
): string {
  const { mode = "direct", precision = 0, fallback = "—" } = options;

  if (input === null || input === undefined || !isFinite(input)) {
    return fallback;
  }

  const value = mode === "ratio" ? input * 100 : input;
  return `${value.toFixed(precision)}%`;
}
