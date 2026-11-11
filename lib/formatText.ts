const group = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** "5000000" -> "5.000.000đ". Anything that is not a bare number comes back as null. */
export function bareAmount(value: string): number | null {
  const text = value.trim();
  return /^[1-9]\d*$/.test(text) ? Number(text) : null;
}

export const formatVnd = (value: number) => `${group(String(Math.round(value)))}đ`;

/**
 * Free text from the admin: a bare number becomes money, and long digit runs inside a sentence get thousand
 * separators. Runs shorter than 5 digits, starting with 0 (phone numbers) or glued to letters (codes) are left alone.
 */
export function formatNumbersInText(value: string): string {
  const amount = bareAmount(value);
  if (amount !== null) return formatVnd(amount);
  return value.replace(/(?<![\d.,\p{L}])([1-9]\d{4,})(?![.,]\d)/gu, (match) => group(match));
}
