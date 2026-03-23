/**
 * Formats a Date object as a `YYYY-MM-DD` string using UTC date fields.
 *
 * @param date - The Date to format.
 * @returns A zero-padded `YYYY-MM-DD` string, e.g. `"2026-03-05"`.
 */
export function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
