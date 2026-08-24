/**
 * Utility helper for calculating and formatting service prices with automatic Member Discount (5%).
 * Accurately parses:
 * - Simple Rupiah: "Rp 8.000", "Rp 24.000"
 * - Unit Suffixes: "Rp 2.000/Hal", "Rp 1.000/Sumber", "Rp 25.000/Review"
 * - Start Prefixes: "Start Rp 40.000", "Start 150k"
 * - 'k' Notation Ranges: "10k–50k", "15k–75k", "25k–100k", "200k–1.000k"
 * - Rupiah Ranges: "Rp 200.000–500.000", "Rp 25.000–75.000", "Rp 300.000–1.000.000"
 * - Range with Unit Suffixes: "5k–25k/produk", "50k–250k/artikel"
 * - Non-numeric: "Chat Admin"
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
 * Converts a single string token into a numeric amount (IDR).
 * Examples:
 * - "10k" -> 10000
 * - "1.000k" -> 1000000
 * - "1.500k" -> 1500000
 * - "200.000" -> 200000
 * - "Rp 8.000" -> 8000
 * - "50000" -> 50000
 */
export function parseTokenToNumber(raw: string): number {
  if (!raw || typeof raw !== 'string') return 0;
  let str = raw.trim().toLowerCase();
  str = str.replace(/^(rp\.?|start|mulai)\s*/i, '').trim();

  if (str.includes('k')) {
    const kMatch = str.match(/([0-9.,]+)\s*k/);
    if (kMatch) {
      let numPart = kMatch[1];
      // Check if dot is thousands separator like 1.000 or decimal like 1.5
      if (numPart.includes('.') && numPart.split('.')[1].length === 3) {
        numPart = numPart.replace(/\./g, '');
      } else {
        numPart = numPart.replace(/,/g, '.');
      }
      const val = parseFloat(numPart);
      return isNaN(val) ? 0 : Math.round(val * 1000);
    }
  }

  const clean = str.replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

/**
 * Calculates 5% discount for members on any service price.
 * Supports single values, ranges, 'k' notations, prefixes, and suffixes.
 */
export function getPriceWithMemberDiscount(
  priceStr: string,
  isMember: boolean
): DiscountedPriceInfo {
  if (!priceStr || typeof priceStr !== 'string') {
    return {
      originalPriceStr: priceStr || '',
      originalPriceNum: 0,
      discountedPriceStr: priceStr || '',
      discountedPriceNum: 0,
      discountAmountStr: 'Rp 0',
      discountAmountNum: 0,
      isDiscounted: false,
      unitSuffix: '',
      isChatAdmin: false,
    };
  }

  const cleanLower = priceStr.toLowerCase().trim();
  if (
    cleanLower.includes('chat') ||
    cleanLower.includes('hubungi') ||
    cleanLower.includes('tanya') ||
    cleanLower.includes('gratis')
  ) {
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

  // Extract Start/Mulai prefix
  let prefix = '';
  let mainPart = priceStr.trim();
  const startMatch = mainPart.match(/^(start|mulai)\s*(rp\.?\s*)?/i);
  if (startMatch) {
    prefix = 'Start ';
    mainPart = mainPart.slice(startMatch[0].length).trim();
  }

  // Extract unit suffix like /hal, /slide, /bulan, /file, /produk, /artikel
  let suffix = '';
  const slashIdx = mainPart.indexOf('/');
  if (slashIdx !== -1) {
    suffix = mainPart.slice(slashIdx).trim();
    mainPart = mainPart.slice(0, slashIdx).trim();
  }

  // Check for range patterns (en-dash, em-dash, hyphen, s/d, sampai)
  const rangeRegex = /\s*(?:–|—|-|\bs\/?d\b|\bsampai\b)\s*/i;
  const parts = mainPart.split(rangeRegex);

  if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
    const num1 = parseTokenToNumber(parts[0]);
    let num2 = parseTokenToNumber(parts[1]);

    // Handle shorthands like "Rp 200.000–500.000" where second part is "500.000"
    if (num1 > 0 && num2 > 0 && num2 < 1000 && num1 >= 1000 && !parts[1].toLowerCase().includes('k')) {
      num2 = num2 * 1000;
    }

    if (num1 > 0 && num2 > 0) {
      if (!isMember) {
        return {
          originalPriceStr: priceStr,
          originalPriceNum: num1,
          discountedPriceStr: priceStr,
          discountedPriceNum: num1,
          discountAmountStr: 'Rp 0',
          discountAmountNum: 0,
          isDiscounted: false,
          unitSuffix: suffix,
          isChatAdmin: false,
        };
      }

      const disc1 = Math.round(num1 * 0.95);
      const disc2 = Math.round(num2 * 0.95);
      const diff1 = num1 - disc1;
      const diff2 = num2 - disc2;
      const discountedPriceStr =
        prefix + formatRupiah(disc1) + ' – ' + formatRupiah(disc2) + (suffix ? suffix : '');

      return {
        originalPriceStr: priceStr,
        originalPriceNum: num1,
        discountedPriceStr,
        discountedPriceNum: disc1,
        discountAmountStr: formatRupiah(diff1) + ' – ' + formatRupiah(diff2),
        discountAmountNum: diff1,
        isDiscounted: true,
        unitSuffix: suffix,
        isChatAdmin: false,
      };
    }
  }

  // Single price parsing
  const num = parseTokenToNumber(mainPart);
  if (num > 0) {
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

    const discountAmountNum = Math.round(num * 0.05);
    const discountedPriceNum = Math.max(0, num - discountAmountNum);
    const discountedPriceStr = prefix + formatRupiah(discountedPriceNum) + (suffix ? suffix : '');
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

  return {
    originalPriceStr: priceStr,
    originalPriceNum: 0,
    discountedPriceStr: priceStr,
    discountedPriceNum: 0,
    discountAmountStr: 'Rp 0',
    discountAmountNum: 0,
    isDiscounted: false,
    unitSuffix: suffix,
    isChatAdmin: false,
  };
}
