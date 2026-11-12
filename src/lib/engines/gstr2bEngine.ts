/**
 * VetoRail Autonomous GSTR-2B Statutory Compliance Engine
 * File: src/lib/engines/gstr2bEngine.ts
 *
 * Implements Section 16(2)(aa) CGST Act and Rule 36(4) verification against
 * Goods and Services Tax Network (GSTN) GSTR-2B auto-drafted statements.
 *
 * Statutory Frameworks:
 * - Section 16(2)(aa) CGST Act: Hard requirement for 100% GSTR-2B reflection before ITC claim
 * - Section 17(5) CGST Act: Blocked credits (motor vehicles, food/catering, club memberships)
 * - Section 50(3) CGST Act: 18% p.a. penal interest liability on wrongful or premature ITC claim
 */

import { Invoice, InvoiceItem, Gstr2bRecord, Gstr2bStatus } from '../types';

export interface Gstr2bMatchResult {
  invoiceId: string;
  vendorGstin: string;
  invoiceNumber: string;
  isFoundIn2B: boolean;
  isFilingPeriodValid: boolean;
  valueMismatchAmount: number;
  taxSplitValid: boolean;
  isRcmValid: boolean;
  is17_5_Blocked: boolean;
  gateVerdict: Gstr2bStatus;
  potentialSec50InterestRisk: number; // 18% p.a.
}

export interface Gstr2bVerifyParams {
  invoice: Invoice | {
    id: string;
    invoice_number: string;
    subtotal: number;
    tax_amount: number;
    total_amount?: number;
    is_rcm?: boolean;
    created_at?: string;
    invoice_date?: string;
    [key: string]: unknown;
  };
  vendorGstin: string;
  gstr2bRecords: Gstr2bRecord[];
  invoiceItems?: (InvoiceItem | { hsn_sac?: string; description?: string; [key: string]: unknown })[];
  valueToleranceINR?: number; // default ₹10.00
  taxToleranceINR?: number;   // default ₹1.00
  annualInterestRate?: number; // default 0.18 (18% p.a.)
  isRcmApplicable?: boolean;
}

/**
 * Normalizes an invoice number by removing whitespace, special characters,
 * and stripping leading zeros for robust cross-system comparison.
 * Example: 'INV/2026-27/0042' -> 'INV20262742'
 * Example: '00045/26' -> '4526'
 */
export function normalizeInvoiceNumber(invNum: string): string {
  if (!invNum) return '';
  // Split on non-alphanumeric delimiters (/ - _ spaces)
  const segments = invNum.toUpperCase().split(/[^A-Z0-9]+/);
  // Strip leading zeros on each segment
  const normalizedSegments = segments
    .filter((seg) => seg.length > 0)
    .map((seg) => {
      const stripped = seg.replace(/^0+/, '');
      return stripped || '0';
    });
  return normalizedSegments.join('');
}

/**
 * Known Section 17(5) blocked credit HSN/SAC prefixes:
 * - 8703: Motor cars and other motor vehicles (< 13 seating capacity)
 * - 8802: Aircraft
 * - 8901: Vessels
 * - 9963: Accommodation, food and beverage services (catering/restaurants)
 * - 9997: Other services (beauty treatment, health services, club membership)
 */
const BLOCKED_HSN_PREFIXES = ['8703', '8802', '8901', '9963', '9997'];

/**
 * Evaluates whether an item or transaction falls under Section 17(5) blocked credit rules.
 */
export function isSection17_5Blocked(
  hsnSac?: string,
  description?: string,
  itcEligibilityFlag?: string
): boolean {
  if (itcEligibilityFlag === 'INELIGIBLE_17_5') {
    return true;
  }

  if (hsnSac) {
    const cleanHsn = hsnSac.replace(/[^0-9]/g, '');
    if (BLOCKED_HSN_PREFIXES.some((prefix) => cleanHsn.startsWith(prefix))) {
      return true;
    }
  }

  if (description) {
    const descLower = description.toLowerCase();
    const blockedKeywords = [
      'motor vehicle',
      'passenger vehicle',
      'catering',
      'food and beverage',
      'outdoor catering',
      'club membership',
      'health club',
      'beauty treatment',
      'life insurance employee personal',
      'health insurance personal'
    ];
    if (blockedKeywords.some((kw) => descLower.includes(kw))) {
      return true;
    }
  }

  return false;
}

/**
 * Calculates Section 50(3) interest exposure at 18% p.a.
 * Default period is 1 year (or 365 days) if not specified.
 */
export function calculateSec50Interest(
  taxAmount: number,
  days = 365,
  annualRate = 0.18
): number {
  if (taxAmount <= 0) return 0;
  return Math.round(taxAmount * annualRate * (days / 365));
}

/**
 * Performs full 6-point Section 16(2)(aa) reconciliation against GSTR-2B data.
 */
export function verifyGstr2bCompliance(params: Gstr2bVerifyParams): Gstr2bMatchResult {
  const {
    invoice,
    vendorGstin,
    gstr2bRecords = [],
    invoiceItems = [],
    valueToleranceINR = 10.0,
    taxToleranceINR = 1.0,
    annualInterestRate = 0.18,
    isRcmApplicable = false
  } = params;

  const invoiceId = invoice.id;
  const invoiceNumber = invoice.invoice_number;
  const normalizedInvoiceNumber = normalizeInvoiceNumber(invoiceNumber);
  const cleanVendorGstin = (vendorGstin || '').trim().toUpperCase();

  // Point 1 & 2: Match Vendor GSTIN and Normalized Invoice Number
  const matchedRecord = gstr2bRecords.find((rec) => {
    const recGstin = (rec.vendor_gstin || '').trim().toUpperCase();
    const recNormInv = normalizeInvoiceNumber(rec.invoice_number);
    return recGstin === cleanVendorGstin && recNormInv === normalizedInvoiceNumber;
  });

  // Check if invoice reflection exists in GSTR-2B
  if (!matchedRecord) {
    const sec50Risk = calculateSec50Interest(invoice.tax_amount, 365, annualInterestRate);

    return {
      invoiceId,
      vendorGstin: cleanVendorGstin,
      invoiceNumber,
      isFoundIn2B: false,
      isFilingPeriodValid: false,
      valueMismatchAmount: 0,
      taxSplitValid: false,
      isRcmValid: true,
      is17_5_Blocked: false,
      gateVerdict: 'HOLD_UNFILED',
      potentialSec50InterestRisk: sec50Risk
    };
  }

  // Point 3: Filing period check
  const isFilingPeriodValid = Boolean(matchedRecord.gstr2b_period && matchedRecord.gstr2b_period.length > 0);

  // Point 4: Taxable Value Check (± ₹10.00 tolerance)
  const taxableDiff = Math.abs(Number(invoice.subtotal) - Number(matchedRecord.taxable_value));
  const isValueWithinTolerance = taxableDiff <= valueToleranceINR;

  // Point 5: Tax Split Check (IGST vs CGST + SGST)
  // Ensure the reported tax components in 2B are within tax tolerance of the invoice tax amount
  const recordTotalTax =
    Number(matchedRecord.igst || 0) +
    Number(matchedRecord.cgst || 0) +
    Number(matchedRecord.sgst || 0);

  const taxDiff = Math.abs(Number(invoice.tax_amount) - recordTotalTax);
  const taxSplitValid = taxDiff <= taxToleranceINR;

  // Point 6: Reverse Charge (RCM) Check
  const invoiceRcm = Boolean(invoice.is_rcm || isRcmApplicable);
  const recordRcm = Boolean(matchedRecord.is_rcm);
  const isRcmValid = invoiceRcm === recordRcm;

  // Section 17(5) Blocked Credit Check
  const hasBlockedItem = invoiceItems.some((item) =>
    isSection17_5Blocked(item.hsn_sac, item.description)
  );
  const is17_5_Blocked =
    matchedRecord.itc_eligibility === 'INELIGIBLE_17_5' || hasBlockedItem;

  // Determine Gate Verdict
  let gateVerdict: Gstr2bStatus = 'PASS_2B';
  let potentialSec50InterestRisk = 0;

  if (is17_5_Blocked) {
    gateVerdict = 'INELIGIBLE_17_5';
    // 17(5) blocked credit does not carry Sec 50 risk if not claimed, but flags ineligibility
    potentialSec50InterestRisk = 0;
  } else if (!isRcmValid) {
    gateVerdict = 'HOLD_RCM_MISMATCH';
    potentialSec50InterestRisk = calculateSec50Interest(invoice.tax_amount, 365, annualInterestRate);
  } else if (!isValueWithinTolerance) {
    gateVerdict = 'HOLD_VALUE_MISMATCH';
    potentialSec50InterestRisk = calculateSec50Interest(invoice.tax_amount, 365, annualInterestRate);
  } else {
    gateVerdict = 'PASS_2B';
    potentialSec50InterestRisk = 0;
  }

  return {
    invoiceId,
    vendorGstin: cleanVendorGstin,
    invoiceNumber,
    isFoundIn2B: true,
    isFilingPeriodValid,
    valueMismatchAmount: Number(taxableDiff.toFixed(2)),
    taxSplitValid,
    isRcmValid,
    is17_5_Blocked,
    gateVerdict,
    potentialSec50InterestRisk
  };
}
