/**
 * VetoRail Autonomous ROI & Statutory Financial Protection Model
 * File: src/lib/engines/roiModel.ts
 *
 * Implements closed-form financial equations for enterprise CFOs and AP Controllers,
 * quantifying the monetary value of statutory compliance gating across:
 *
 * 1. Annual ITC Protected: Prevention of Section 16(2)(aa) credit forfeiture from unfiled vendor returns.
 * 2. Section 50 CGST Penal Interest Avoided: 18% p.a. interest penalty during audit discovery latency.
 * 3. 3-Way Line Leakage / Overbilling Prevented: Line rate creep and quantity discrepancy recovery.
 * 4. Section 43B(h) Corporate Tax Cashflow Shield: 30% tax deduction loss prevention on MSME overdue spend.
 * 5. Section 16 MSMED Penal Interest Avoided: 20.25% p.a. compound penal interest.
 */

import { RoiCalculationInput, RoiCalculationResult } from '../types';

export interface ExtendedRoiCalculationInput extends RoiCalculationInput {
  leakageMarginPct?: number;         // Average line discrepancy margin (default: 4.5%)
  priceQtyLeakageRatePct?: number;   // Percentage of invoices with line variances (default: 1.8%)
  msmeDelayedRatePct?: number;       // Percentage of MSME invoices delayed past 45-day SLA (default: 8.0%)
  corporateTaxRatePct?: number;      // Effective corporate tax rate (default: 30.0%)
  gstRatePct?: number;               // Average applicable GST rate (default: 18.0%)
  auditLatencyYears?: number;        // Average GST audit / SMT-10 detection latency (default: 0.5 years / 6 months)
  annualSoftwareCostINR?: number;    // SaaS investment for ROI multiple calculation (default: benchmark ₹15 Lakhs)
}

// Empirical enterprise benchmarks
export const BENCHMARK_UNFILED_2B_RATE = 3.5;       // 3.5%
export const BENCHMARK_LEAKAGE_RATE = 1.8;          // 1.8%
export const BENCHMARK_LEAKAGE_MARGIN = 4.5;        // 4.5%
export const BENCHMARK_MSME_DELAYED_RATE = 8.0;     // 8.0%
export const BENCHMARK_CORP_TAX_RATE = 30.0;        // 30.0%
export const BENCHMARK_GST_RATE = 18.0;             // 18.0%
export const BENCHMARK_SEC50_INTEREST_RATE = 0.18;  // 18.0% p.a.
export const BENCHMARK_MSMED_INTEREST_RATE = 0.2025;// 20.25% p.a.
export const BENCHMARK_AUDIT_LATENCY_YEARS = 0.5;   // 6 months
export const BENCHMARK_ANNUAL_SOFTWARE_COST = 1500000; // ₹15 Lakhs

/**
 * Calculates total annual financial ROI and statutory protection delivered by VetoRail.
 */
export function calculateEnterpriseRoi(
  input: ExtendedRoiCalculationInput
): RoiCalculationResult {
  const {
    monthlySpendINR,
    msmeSupplierPct = 35,
    unfiledSupplierRatePct = BENCHMARK_UNFILED_2B_RATE,
    leakageMarginPct = BENCHMARK_LEAKAGE_MARGIN,
    priceQtyLeakageRatePct = BENCHMARK_LEAKAGE_RATE,
    msmeDelayedRatePct = BENCHMARK_MSME_DELAYED_RATE,
    corporateTaxRatePct = BENCHMARK_CORP_TAX_RATE,
    gstRatePct = BENCHMARK_GST_RATE,
    auditLatencyYears = BENCHMARK_AUDIT_LATENCY_YEARS,
    annualSoftwareCostINR = BENCHMARK_ANNUAL_SOFTWARE_COST
  } = input;

  const validMonthlySpend = Math.max(0, monthlySpendINR);
  const annualSpendINR = validMonthlySpend * 12;

  // 1. Input Tax Credit (ITC) Protection under Section 16(2)(aa)
  const gstRate = (gstRatePct || 18.0) / 100;
  const monthlyTotalItc = validMonthlySpend * (gstRate / (1 + gstRate));
  const unfiledRate = (unfiledSupplierRatePct || BENCHMARK_UNFILED_2B_RATE) / 100;
  const monthlyItcAtRisk = monthlyTotalItc * unfiledRate;
  const itcSavedAnnualINR = Math.round(monthlyItcAtRisk * 12);

  // 2. Section 50 Penal Interest Avoided (18% p.a. over audit latency window)
  const sec50InterestAvoidedINR = Math.round(
    itcSavedAnnualINR * BENCHMARK_SEC50_INTEREST_RATE * auditLatencyYears
  );

  // 3. 3-Way Line Matching Leakage Prevented
  const leakageRate = (priceQtyLeakageRatePct || BENCHMARK_LEAKAGE_RATE) / 100;
  const leakageMargin = (leakageMarginPct || BENCHMARK_LEAKAGE_MARGIN) / 100;
  const annualLeakagePrevented = Math.round(annualSpendINR * leakageRate * leakageMargin);

  // Working Capital Protected: Sum of unfiled ITC held + line overbilling prevented
  const workingCapitalProtectedINR = itcSavedAnnualINR + annualLeakagePrevented;

  // 4. Section 43B(h) Corporate Tax Cashflow Shield & Section 16 MSMED Interest Avoided
  const msmeRatio = Math.max(0, Math.min(100, msmeSupplierPct)) / 100;
  const annualMsmeSpend = annualSpendINR * msmeRatio;
  const msmeDelayedRate = (msmeDelayedRatePct || BENCHMARK_MSME_DELAYED_RATE) / 100;
  const annualDelayedMsmeSpend = annualMsmeSpend * msmeDelayedRate;

  const corpTaxRate = (corporateTaxRatePct || BENCHMARK_CORP_TAX_RATE) / 100;
  const corporateTaxShield = annualDelayedMsmeSpend * corpTaxRate;

  // 30 days average delay past the 45-day statutory deadline
  const msmedInterestAvoided = annualDelayedMsmeSpend * BENCHMARK_MSMED_INTEREST_RATE * (30 / 365);
  const msmePenaltiesShieldedINR = Math.round(corporateTaxShield + msmedInterestAvoided);

  // 5. Total Economic Value & ROI Multiplier
  const totalAnnualBenefitINR =
    itcSavedAnnualINR +
    sec50InterestAvoidedINR +
    annualLeakagePrevented +
    msmePenaltiesShieldedINR;

  const softwareCost = annualSoftwareCostINR > 0 ? annualSoftwareCostINR : BENCHMARK_ANNUAL_SOFTWARE_COST;
  const roiMultiplier =
    softwareCost > 0
      ? Number((totalAnnualBenefitINR / softwareCost).toFixed(1))
      : 0;

  const paybackMonths =
    totalAnnualBenefitINR > 0
      ? Number(((softwareCost / totalAnnualBenefitINR) * 12).toFixed(1))
      : 0;

  return {
    annualSpendINR,
    itcSavedAnnualINR,
    workingCapitalProtectedINR,
    sec50InterestAvoidedINR,
    msmePenaltiesShieldedINR,
    totalAnnualBenefitINR,
    roiMultiplier,
    paybackMonths
  };
}
