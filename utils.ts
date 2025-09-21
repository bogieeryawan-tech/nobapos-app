/**
 * Formats a number into Indonesian Rupiah currency format.
 * @param amount - The number to format.
 * @returns A string representing the amount in Rupiah (e.g., "Rp 15.000").
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number into Indonesian Rupiah currency parts.
 * @param amount - The number to format.
 * @returns An object with symbol and value (e.g., { symbol: 'Rp', value: '15.000' }).
 */
export const formatRupiahParts = (amount: number): { symbol: string; value: string } => {
  const parts = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).formatToParts(amount);

  const symbol = parts.find(p => p.type === 'currency')?.value || 'Rp';
  // Combine all other parts to form the value, preserving signs and separators.
  const value = parts.filter(p => p.type !== 'currency').map(p => p.value).join('').trim();
  
  return { symbol, value };
};