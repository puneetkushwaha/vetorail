/**
 * Indian Rupee (INR) and Number Formatting Utilities
 * File: src/components/landing/formatters.ts
 */

/**
 * Format number into standard Indian numbering system (Lakhs & Crores)
 * e.g. 1234567 -> "₹12,34,567"
 */
export function formatINR(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  const rounded = Math.round(val);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rounded);
}

/**
 * Format number into compact Indian financial units:
 * >= 1 Crore (10,000,000) -> "₹X.XX Cr"
 * >= 1 Lakh (100,000) -> "₹X.XX L"
 * >= 1 Thousand (1,000) -> "₹X.X K"
 * else -> "₹XXX"
 */
export function formatCompactINR(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  const absVal = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (absVal >= 10000000) {
    const cr = absVal / 10000000;
    return `${sign}₹${cr.toFixed(2)} Cr`;
  } else if (absVal >= 100000) {
    const lakh = absVal / 100000;
    return `${sign}₹${lakh.toFixed(2)} Lakh`;
  } else if (absVal >= 1000) {
    const k = absVal / 1000;
    return `${sign}₹${k.toFixed(1)}K`;
  }
  return `${sign}₹${Math.round(absVal).toLocaleString('en-IN')}`;
}

/**
 * Formats a raw number with Indian comma grouping
 */
export function formatNumberIN(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return Math.round(val).toLocaleString('en-IN');
}
