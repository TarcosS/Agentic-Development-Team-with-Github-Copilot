/** Integer number of cents (e.g. 135030 represents $1,350.30). */
export type Cents = number;

/**
 * Formats an amount in cents to a human-readable string in de-DE style with a CAD suffix.
 *
 * @param money - The monetary value expressed as an integer number of cents.
 * @returns A formatted string such as `"1.350,30 CAD"`.
 *
 * @example
 * formatMoney(135030); // "1.350,30 CAD"
 */
export function formatMoney(money: Cents): string {
  const amount = money / 100;
  const formatted = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} CAD`;
}
