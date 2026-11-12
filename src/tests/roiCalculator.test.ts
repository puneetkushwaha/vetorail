import { describe, it, expect } from 'vitest';
import { calculateEnterpriseRoi } from '../lib/engines/roiModel';

describe('Engine F9: ROI & Statutory Protection Financial Model Verification', () => {

  describe('Suite 1: Canonical Enterprise Benchmark Verification (₹10 Cr Monthly Spend)', () => {
    it('1.1 should match closed-form benchmark values for ₹10 Cr Monthly Spend & 35% MSME vendors', () => {
      // Monthly Spend: ₹10,00,00,000 (₹10 Cr). MSME: 35%.
      const result = calculateEnterpriseRoi({
        monthlySpendINR: 100000000,
        msmeSupplierPct: 35,
        annualSoftwareCostINR: 1500000 // Benchmark ₹15 Lakhs
      });

      // 1. Annual Spend = 10 Cr * 12 = 120 Cr
      expect(result.annualSpendINR).toBe(1200000000);

      // 2. Annual ITC Protected:
      // Monthly ITC = 10 Cr * (0.18 / 1.18) = 1,52,54,237.29
      // Unfiled @ 3.5% = 5,33,898.30 * 12 = 64,06,780
      expect(result.itcSavedAnnualINR).toBe(6406780);

      // 3. Section 50 CGST Penal Interest Avoided (18% p.a. over 6 months latency):
      // 64,06,780 * 18% * 0.5 = 5,76,610
      expect(result.sec50InterestAvoidedINR).toBe(576610);

      // 4. Line Matching Leakage Prevented:
      // 120 Cr * 1.8% * 4.5% = 9,72,000
      // Working Capital Protected = ITC Saved (64,06,780) + Leakage (9,72,000) = 73,78,780
      expect(result.workingCapitalProtectedINR).toBe(6406780 + 972000);

      // 5. Section 43B(h) Corporate Tax Shield & MSMED Penal Interest:
      // Annual MSME spend = 120 Cr * 35% = 42 Cr
      // Delayed @ 8% = 3.36 Cr
      // 30% Tax Shield = 3.36 Cr * 30% = 1,00,80,000
      // MSMED Interest (30 days @ 20.25%) = 3.36 Cr * 20.25% * (30 / 365) = 5,59,233
      // Total MSME shielded = 1,00,80,000 + 5,59,233 = 1,06,39,233
      expect(result.msmePenaltiesShieldedINR).toBe(10639233);

      // 6. Total Annual Economic Benefit Delivered:
      // 64,06,780 + 5,76,610 + 9,72,000 + 1,06,39,233 = 1,85,94,623 (~₹1.86 Cr)
      expect(result.totalAnnualBenefitINR).toBe(18594623);

      // 7. ROI Multiplier and Payback:
      // Software cost = 15,00,000. Benefit = 1,85,94,623 -> 12.4x ROI
      expect(result.roiMultiplier).toBe(12.4);
      // Payback = (15L / 185.95L) * 12 = 1.0 month
      expect(result.paybackMonths).toBe(1.0);
    });
  });

  describe('Suite 2: Dynamic Sliders & Parameter Sensitivity', () => {
    it('2.1 should reduce MSME benefits to ₹0 when msmeSupplierPct is set to 0%', () => {
      const result = calculateEnterpriseRoi({
        monthlySpendINR: 50000000, // ₹5 Cr
        msmeSupplierPct: 0
      });

      expect(result.msmePenaltiesShieldedINR).toBe(0);
      expect(result.itcSavedAnnualINR).toBeGreaterThan(0);
      expect(result.totalAnnualBenefitINR).toBe(
        result.itcSavedAnnualINR +
        result.sec50InterestAvoidedINR +
        (result.workingCapitalProtectedINR - result.itcSavedAnnualINR)
      );
    });

    it('2.2 scales ITC savings proportionally with higher unfiled supplier return rate (5.0%)', () => {
      const standardRate = calculateEnterpriseRoi({
        monthlySpendINR: 10000000,
        unfiledSupplierRatePct: 3.5
      });

      const higherRate = calculateEnterpriseRoi({
        monthlySpendINR: 10000000,
        unfiledSupplierRatePct: 5.0
      });

      expect(higherRate.itcSavedAnnualINR).toBeGreaterThan(standardRate.itcSavedAnnualINR);
      // Proportion check: 5.0 / 3.5 ratio
      const ratio = higherRate.itcSavedAnnualINR / standardRate.itcSavedAnnualINR;
      expect(ratio).toBeCloseTo(5.0 / 3.5, 2);
    });

    it('2.3 calculates correctly with custom GST rates (e.g. 28% luxury/automotive)', () => {
      const result28 = calculateEnterpriseRoi({
        monthlySpendINR: 100000000,
        gstRatePct: 28.0
      });

      // Monthly ITC = 10 Cr * (0.28 / 1.28)
      const expectedMonthlyItc = 100000000 * (0.28 / 1.28);
      const expectedAnnualSaved = Math.round(expectedMonthlyItc * 0.035 * 12);
      expect(result28.itcSavedAnnualINR).toBe(expectedAnnualSaved);
    });
  });

  describe('Suite 3: Edge Case Resiliency', () => {
    it('3.1 handles ₹0 monthly spend cleanly without throwing or producing NaN/Infinity', () => {
      const result = calculateEnterpriseRoi({
        monthlySpendINR: 0,
        msmeSupplierPct: 35
      });

      expect(result.annualSpendINR).toBe(0);
      expect(result.itcSavedAnnualINR).toBe(0);
      expect(result.sec50InterestAvoidedINR).toBe(0);
      expect(result.workingCapitalProtectedINR).toBe(0);
      expect(result.msmePenaltiesShieldedINR).toBe(0);
      expect(result.totalAnnualBenefitINR).toBe(0);
      expect(result.roiMultiplier).toBe(0);
      expect(result.paybackMonths).toBe(0);
    });

    it('3.2 clamps negative or out-of-range inputs safely', () => {
      const resultNegative = calculateEnterpriseRoi({
        monthlySpendINR: -50000,
        msmeSupplierPct: -10
      });

      expect(resultNegative.annualSpendINR).toBe(0);
      expect(resultNegative.totalAnnualBenefitINR).toBe(0);

      const resultOver100 = calculateEnterpriseRoi({
        monthlySpendINR: 1000000,
        msmeSupplierPct: 150 // Out of range, should clamp to 100%
      });

      expect(resultOver100.annualSpendINR).toBe(12000000);
      expect(resultOver100.totalAnnualBenefitINR).toBeGreaterThan(0);
    });
  });
});
