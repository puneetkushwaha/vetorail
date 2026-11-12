/**
 * VetoRail Autonomous Section 43B(h) MSME SLA & Tax Disallowance Engine
 * File: src/lib/engines/msme43bhEngine.ts
 *
 * Implements Section 43B(h) of the Income Tax Act, 1961 and Section 15 of the MSMED Act, 2006.
 *
 * Statutory Mandates:
 * - Applicable strictly to Micro and Small enterprises (manufacturers and service providers).
 * - Statutory Exclusions: Medium enterprises and Wholesale/Retail Traders (NIC 45-47, per OM 02.07.2021).
 * - Statutory Payment Ceilings:
 *   - With written agreement: agreed days capped at strictly 45 DAYS (any agreement > 45 days is legally void).
 *   - Without written agreement: strictly 15 DAYS from the date of acceptance (delivery / GRN).
 * - Urgency SLA Tiers:
 *   - GREEN: > 15 days remaining
 *   - YELLOW: 6 to 15 days remaining
 *   - ORANGE: 1 to 5 days remaining (urgent priority fast-track)
 *   - RED_OVERDUE: <= 0 days remaining (statutory breach triggered)
 * - Dual Financial Penalties:
 *   - Corporate tax cashflow disallowance risk: 30% of taxable invoice amount
 *   - Section 16 MSMED penal compound interest: 3x RBI Bank Rate (3 * 6.75% = 20.25% p.a., non-deductible u/s 23)
 */

import { MsmeCategory, UrgencyTier, Msme43bhStatus } from '../types';

export interface Msme43bhInput {
  vendorId: string;
  msmeCategory: MsmeCategory;
  hasWrittenAgreement?: boolean;
  agreementDays?: number;           // Contractual payment terms (e.g. 30, 45, 60, 90)
  grnDate: string | Date;           // Day of Acceptance (physical delivery or deemed acceptance)
  invoiceTaxableAmount: number;     // Taxable invoice subtotal
  referenceDate?: string | Date;    // Evaluation date (default: today)
  corporateTaxRate?: number;        // Effective tax rate (default: 30.0% / 0.30)
  rbiBankRate?: number;             // RBI Bank rate (default: 6.75% / 0.0675)
}

export const STATUTORY_MAX_MSME_DAYS_WITH_AGREEMENT = 45;
export const STATUTORY_MAX_MSME_DAYS_WITHOUT_AGREEMENT = 15;
export const DEFAULT_CORPORATE_TAX_RATE = 0.30;
export const DEFAULT_RBI_BANK_RATE = 0.0675;
export const DEFAULT_MSMED_PENAL_RATE = 0.2025; // 3x RBI Bank rate (20.25% p.a.)

/**
 * Calculates Section 16 MSMED Act penal compound interest for overdue payments.
 * Per Section 16 MSMED Act, interest is computed at 3x the RBI Bank rate.
 */
export function calculateMsmedPenalInterest(
  overdueAmount: number,
  overdueDays: number,
  annualRate = DEFAULT_MSMED_PENAL_RATE
): number {
  if (overdueAmount <= 0 || overdueDays <= 0) return 0;
  return Math.round(overdueAmount * annualRate * (overdueDays / 365));
}

/**
 * Evaluates Section 43B(h) and MSMED Act SLA status, countdown timer, and penalty risks.
 */
export function calculateMsme43bhStatus(input: Msme43bhInput): Msme43bhStatus {
  const {
    vendorId,
    msmeCategory,
    hasWrittenAgreement = true,
    agreementDays = STATUTORY_MAX_MSME_DAYS_WITH_AGREEMENT,
    grnDate,
    invoiceTaxableAmount,
    referenceDate,
    corporateTaxRate = DEFAULT_CORPORATE_TAX_RATE,
    rbiBankRate = DEFAULT_RBI_BANK_RATE
  } = input;

  // Rule 1: Section 43B(h) applies strictly to MICRO and SMALL enterprises.
  // MEDIUM enterprises, TRADERS, and NOT_MSME are exempt.
  const isApplicable = msmeCategory === 'MICRO' || msmeCategory === 'SMALL';

  // Rule 2: Determine statutory window ceiling
  // With agreement: min(contractual days, 45 days)
  // Without agreement: strictly 15 days
  const maxDaysAllowed = hasWrittenAgreement
    ? Math.min(agreementDays, STATUTORY_MAX_MSME_DAYS_WITH_AGREEMENT)
    : STATUTORY_MAX_MSME_DAYS_WITHOUT_AGREEMENT;

  // Rule 3: Date calculations
  const parsedGrnDate = typeof grnDate === 'string' ? new Date(grnDate) : grnDate;
  const parsedRefDate = referenceDate
    ? (typeof referenceDate === 'string' ? new Date(referenceDate) : referenceDate)
    : new Date();

  // Reset time portions for exact calendar-day calculations
  const startUtc = Date.UTC(parsedGrnDate.getFullYear(), parsedGrnDate.getMonth(), parsedGrnDate.getDate());
  const refUtc = Date.UTC(parsedRefDate.getFullYear(), parsedRefDate.getMonth(), parsedRefDate.getDate());
  const diffDays = Math.floor((refUtc - startUtc) / (1000 * 60 * 60 * 24));

  const daysElapsed = Math.max(0, diffDays);
  const daysRemaining = maxDaysAllowed - daysElapsed;

  const penalInterestRate = Number((rbiBankRate * 3).toFixed(4)); // 20.25% p.a.

  // If not applicable (Medium, Trader, Large), return safe GREEN status
  if (!isApplicable) {
    return {
      vendorId,
      msmeCategory,
      isApplicable: false,
      maxDaysAllowed,
      daysElapsed,
      daysRemaining,
      urgencyTier: 'GREEN',
      disallowanceRiskAmount: 0,
      penalInterestRate: 0
    };
  }

  // Rule 4: Urgency SLA Classification
  let urgencyTier: UrgencyTier = 'GREEN';
  let disallowanceRiskAmount = 0;

  if (daysRemaining <= 0) {
    urgencyTier = 'RED_OVERDUE';
    // Statutory disallowance triggered: 30% of taxable invoice amount
    disallowanceRiskAmount = Math.round(invoiceTaxableAmount * corporateTaxRate);
  } else if (daysRemaining <= 5) {
    urgencyTier = 'ORANGE';
    // Potential risk shield for near-overdue invoices
    disallowanceRiskAmount = Math.round(invoiceTaxableAmount * corporateTaxRate);
  } else if (daysRemaining <= 15) {
    urgencyTier = 'YELLOW';
    disallowanceRiskAmount = Math.round(invoiceTaxableAmount * corporateTaxRate);
  } else {
    urgencyTier = 'GREEN';
    disallowanceRiskAmount = 0;
  }

  return {
    vendorId,
    msmeCategory,
    isApplicable: true,
    maxDaysAllowed,
    daysElapsed,
    daysRemaining,
    urgencyTier,
    disallowanceRiskAmount,
    penalInterestRate
  };
}
