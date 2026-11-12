/**
 * VetoRail Autonomous Section 194Q TDS Deduction Engine
 * File: src/lib/engines/tds194qCalculator.ts
 *
 * Implements Section 194Q of the Income Tax Act, 1961 (TDS on Purchase of Goods).
 *
 * Statutory Mandate & Thresholds:
 * - Applicable to buyers with turnover > ₹10 Crore in the preceding financial year.
 * - Enforces the ₹50 Lakhs (₹5,000,000) cumulative FY aggregate purchase threshold per resident vendor.
 * - Standard statutory deduction rate: 0.1% (0.001) on the amount credited in excess of ₹50 Lakhs.
 * - Penalty rate under Section 206AA / 206AB: 5.0% (0.05) if vendor PAN is missing, invalid, inoperative (unlinked with Aadhaar), or vendor is a non-filer.
 * - Per CBDT Circular No. 13 of 2021: TDS is deducted on purchase value excluding GST when GST is indicated separately.
 */

import { Tds194qResult } from '../types';

export interface Tds194qInput {
  vendorId: string;
  priorFySpend: number;            // Cumulative taxable purchases from vendor prior to this invoice
  currentInvoiceTaxable: number;    // Taxable subtotal of current invoice (excluding GST)
  grossInvoiceAmount: number;       // Gross total invoice value (taxable + GST)
  isPanValid?: boolean;             // Whether PAN conforms to statutory regex
  isPanOperative?: boolean;         // Section 206AA: Aadhaar-PAN linkage verified
  isSpecifiedNonFiler?: boolean;    // Section 206AB: ITR filing compliance
  buyerTurnoverExceeds10Cr?: boolean; // Section 194Q applicability precondition
  thresholdINR?: number;            // Statutory threshold (default ₹50,00,000)
}

export const STATUTORY_TDS_194Q_THRESHOLD = 5000000; // ₹50 Lakhs
export const STANDARD_TDS_194Q_RATE = 0.001;          // 0.1%
export const ELEVATED_TDS_206AA_RATE = 0.05;          // 5.0%

/**
 * Validates whether a PAN string matches the Indian Income Tax format.
 * Format: 5 uppercase letters, 4 digits, 1 uppercase letter.
 */
export function isValidPan(pan: string): boolean {
  if (!pan) return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
}

/**
 * Calculates Section 194Q TDS deduction and net payable amount.
 */
export function calculateTds194q(input: Tds194qInput): Tds194qResult {
  const {
    vendorId,
    priorFySpend,
    currentInvoiceTaxable,
    grossInvoiceAmount,
    isPanValid = true,
    isPanOperative = true,
    isSpecifiedNonFiler = false,
    buyerTurnoverExceeds10Cr = true,
    thresholdINR = STATUTORY_TDS_194Q_THRESHOLD
  } = input;

  // If buyer turnover does not exceed ₹10 Cr, Section 194Q is not applicable
  if (!buyerTurnoverExceeds10Cr) {
    return {
      vendorId,
      priorFySpend,
      currentInvoiceTaxable,
      newCumulativeSpend: priorFySpend + currentInvoiceTaxable,
      thresholdExceeded: false,
      taxableSubjectToTds: 0,
      tdsRate: 0,
      tdsAmount: 0,
      grossInvoiceAmount,
      netPayableAmount: grossInvoiceAmount
    };
  }

  const prevSpend = Math.max(0, priorFySpend);
  const currentTaxable = Math.max(0, currentInvoiceTaxable);
  const newCumulativeSpend = prevSpend + currentTaxable;
  const threshold = thresholdINR;

  let taxableSubjectToTds = 0;
  let thresholdExceeded = false;

  if (newCumulativeSpend <= threshold) {
    // Under threshold, no TDS deduction
    taxableSubjectToTds = 0;
    thresholdExceeded = false;
  } else if (prevSpend < threshold && newCumulativeSpend > threshold) {
    // Current invoice crosses the threshold: deduct on excess portion only
    taxableSubjectToTds = newCumulativeSpend - threshold;
    thresholdExceeded = true;
  } else {
    // Prior spend was already at or above threshold: deduct on full current invoice
    taxableSubjectToTds = currentTaxable;
    thresholdExceeded = true;
  }

  // Rate determination: Section 206AA / 206AB check
  const requiresElevatedRate = !isPanValid || !isPanOperative || isSpecifiedNonFiler;
  const tdsRate = requiresElevatedRate ? ELEVATED_TDS_206AA_RATE : STANDARD_TDS_194Q_RATE;

  // Calculate TDS amount (rounded to nearest rupee)
  const tdsAmount = Math.round(taxableSubjectToTds * tdsRate);
  const netPayableAmount = Math.max(0, grossInvoiceAmount - tdsAmount);

  return {
    vendorId,
    priorFySpend: prevSpend,
    currentInvoiceTaxable: currentTaxable,
    newCumulativeSpend,
    thresholdExceeded,
    taxableSubjectToTds,
    tdsRate,
    tdsAmount,
    grossInvoiceAmount,
    netPayableAmount
  };
}
