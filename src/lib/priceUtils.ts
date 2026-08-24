/**
 * Utility helper for calculating and formatting service prices with automatic Member Discount (5%).
 */

export interface DiscountedPriceInfo {
  originalPriceStr: string;
  originalPriceNum: number;
  discountedPriceStr: string;
  discountedPriceNum: number;
  discountAmountStr: string;
  discountAmountNum: number;
  isDiscounted: boolean;
  unitSuffix: string;
  isChatAdmin: boolean;
}

/**
 * Format a number into Indonesian Rupiah format, e.g., 47500 -> "Rp 47.500"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount <= 0) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Parses a price string into its numeric value, unit suffix, and chat-admin status.
 * Example inputs:
 * - "Rp 50.000" -> num: 50000, suffix: ""
 * - "Rp 25.000/hal" -> num: 25000, suffix: "/hal"
 * - "Rp 15.000 / akun" -> num: 15000, suffix: " / akun"
 * - "Chat Admin" -> isChatAdmin: true
 */
export function parsePriceString(priceStr: string): {
  num: number;
  suffix: string;
  isChatAdmin: boolean;
} {
  if (!priceStr || typeof priceStr !== 'string') {
    return { num: 0, suffix: '', isChatAdmin: false };
  }

  const cleanLower = priceStr.toLowerCase().trim();
  if (
    cleanLower.includes('chat') ||
    cleanLower.includes('hubungi') ||
    cleanLower.includes('tanya') ||
    cleanLower.includes('gratis')
  ) {
    return { num: 0, suffix: '', isChatAdmin: true };
  }

  // Extract unit suffix like /hal, /slide, /bulan, /file, /akun
  let suffix = '';
  const slashIdx = priceStr.indexOf('/');
  if (slashIdx !== -1) {
    suffix = priceStr.slice(slashIdx).trim();
  }

  // Extract digits only before the slash
  const partBeforeSlash = slashIdx !== -1 ? priceStr.slice(0, slashIdx) : priceStr;
  const digitsOnly = partBeforeSlash.replace(/[^0-9]/g, '');
  const num = parseInt(digitsOnly, 10) || 0;

  return { num, suffix, isChatAdmin: false };
}

/**
 * Calculates 5% discount for members on any service price.
 * If user is member (isMember === true) and price is numeric, applies a 5% discount.
 */
export function getPriceWithMemberDiscount(
  priceStr: string,
  isMember: boolean
): DiscountedPriceInfo {
  const { num, suffix, isChatAdmin } = parsePriceString(priceStr);

  if (isChatAdmin || num <= 0) {
    return {
      originalPriceStr: priceStr,
      originalPriceNum: 0,
      discountedPriceStr: priceStr,
      discountedPriceNum: 0,
      discountAmountStr: 'Rp 0',
      discountAmountNum: 0,
      isDiscounted: false,
      unitSuffix: '',
      isChatAdmin: true,
    };
  }

  if (!isMember) {
    return {
      originalPriceStr: priceStr,
      originalPriceNum: num,
      discountedPriceStr: priceStr,
      discountedPriceNum: num,
      discountAmountStr: 'Rp 0',
      discountAmountNum: 0,
      isDiscounted: false,
      unitSuffix: suffix,
      isChatAdmin: false,
    };
  }

  // 5% discount for registered members
  const discountAmountNum = Math.round(num * 0.05);
  const discountedPriceNum = Math.max(0, num - discountAmountNum);
  const discountedPriceStr = formatRupiah(discountedPriceNum) + (suffix ? suffix : '');
  const discountAmountStr = formatRupiah(discountAmountNum);

  return {
    originalPriceStr: priceStr,
    originalPriceNum: num,
    discountedPriceStr,
    discountedPriceNum,
    discountAmountStr,
    discountAmountNum,
    isDiscounted: true,
    unitSuffix: suffix,
    isChatAdmin: false,
  };
}
