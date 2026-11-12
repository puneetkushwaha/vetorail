// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Import components and engine
import {
  Hero,
  RoiCalculator,
  FeaturePillars,
  StatutoryBadges,
  Testimonials,
  Footer,
  formatINR,
  formatCompactINR,
  formatNumberIN
} from '@/components/landing';
import { calculateEnterpriseRoi } from '@/lib/engines/roiModel';

describe('Milestone 3: High-Converting SaaS Landing Page & ROI Calculator', () => {

  // ============================================================================
  // Suite 1: ROI Calculation Engine & Interactive Slider Math Verification
  // ============================================================================
  describe('Suite 1: ROI Engine Calculation & Slider Range Verification', () => {
    it('1.1 should correctly calculate the default slider state (₹10 Cr Spend, 35% MSME, 3.5% unfiled)', () => {
      const defaultSpendINR = 10 * 10000000; // ₹10 Cr
      const result = calculateEnterpriseRoi({
        monthlySpendINR: defaultSpendINR,
        msmeSupplierPct: 35,
        unfiledSupplierRatePct: 3.5
      });

      // Annualized spend = ₹120 Cr
      expect(result.annualSpendINR).toBe(1200000000);
      // ITC Saved = 10 Cr * (0.18/1.18) * 3.5% * 12 = ₹64,06,780
      expect(result.itcSavedAnnualINR).toBe(6406780);
      // Section 50 interest avoided (18% p.a. for 0.5 yrs) = ₹5,76,610
      expect(result.sec50InterestAvoidedINR).toBe(576610);
      // Working capital protected = ITC Saved + Line Leakage (120 Cr * 1.8% * 4.5% = 9.72L)
      expect(result.workingCapitalProtectedINR).toBe(6406780 + 972000);
      // MSME Penalties shielded (30% corporate tax + MSMED interest)
      expect(result.msmePenaltiesShieldedINR).toBe(10639233);
      // Total annual economic benefit
      expect(result.totalAnnualBenefitINR).toBe(18594623);
      // Positive ROI multiplier
      expect(result.roiMultiplier).toBeGreaterThan(10);
      expect(result.paybackMonths).toBeLessThanOrEqual(1.5);
    });

    it('1.2 should scale correctly across spend range from ₹1 Cr to ₹100 Cr', () => {
      const spendLevels = [1, 5, 10, 25, 50, 100]; // in Crores

      let previousBenefit = 0;
      for (const cr of spendLevels) {
        const spendINR = cr * 10000000;
        const res = calculateEnterpriseRoi({
          monthlySpendINR: spendINR,
          msmeSupplierPct: 35
        });

        expect(res.annualSpendINR).toBe(spendINR * 12);
        expect(res.totalAnnualBenefitINR).toBeGreaterThan(previousBenefit);
        expect(res.itcSavedAnnualINR).toBeGreaterThan(0);
        expect(res.workingCapitalProtectedINR).toBeGreaterThan(res.itcSavedAnnualINR);
        previousBenefit = res.totalAnnualBenefitINR;
      }
    });

    it('1.3 should correctly respond to MSME percentage variations (5% to 80%)', () => {
      const monthlySpend = 10 * 10000000; // ₹10 Cr

      const lowMsme = calculateEnterpriseRoi({
        monthlySpendINR: monthlySpend,
        msmeSupplierPct: 5
      });

      const avgMsme = calculateEnterpriseRoi({
        monthlySpendINR: monthlySpend,
        msmeSupplierPct: 35
      });

      const highMsme = calculateEnterpriseRoi({
        monthlySpendINR: monthlySpend,
        msmeSupplierPct: 80
      });

      expect(lowMsme.msmePenaltiesShieldedINR).toBeLessThan(avgMsme.msmePenaltiesShieldedINR);
      expect(avgMsme.msmePenaltiesShieldedINR).toBeLessThan(highMsme.msmePenaltiesShieldedINR);

      // Verify linear scaling with MSME ratio
      const ratioLowToAvg = avgMsme.msmePenaltiesShieldedINR / lowMsme.msmePenaltiesShieldedINR;
      expect(ratioLowToAvg).toBeCloseTo(35 / 5, 1);
    });

    it('1.4 should correctly respond to unfiled 2B rate adjustments (1.0% to 10.0%)', () => {
      const monthlySpend = 10 * 10000000;

      const rate1 = calculateEnterpriseRoi({
        monthlySpendINR: monthlySpend,
        unfiledSupplierRatePct: 1.0
      });

      const rate10 = calculateEnterpriseRoi({
        monthlySpendINR: monthlySpend,
        unfiledSupplierRatePct: 10.0
      });

      expect(rate10.itcSavedAnnualINR).toBeGreaterThan(rate1.itcSavedAnnualINR);
      expect(rate10.sec50InterestAvoidedINR).toBeGreaterThan(rate1.sec50InterestAvoidedINR);
      expect(rate10.itcSavedAnnualINR / rate1.itcSavedAnnualINR).toBeCloseTo(10, 1);
    });
  });

  // ============================================================================
  // Suite 2: Indian Rupee Formatter Utilities Verification
  // ============================================================================
  describe('Suite 2: Indian Rupee Formatter Verification', () => {
    it('2.1 formats currency into standard INR with rupee symbol', () => {
      const formatted = formatINR(4820000);
      expect(formatted).toContain('48,20,000');
      expect(formatted).toContain('₹');
    });

    it('2.2 formats numbers into compact Lakhs and Crores', () => {
      expect(formatCompactINR(10000000)).toBe('₹1.00 Cr');
      expect(formatCompactINR(250000000)).toBe('₹25.00 Cr');
      expect(formatCompactINR(14820000)).toBe('₹1.48 Cr');
      expect(formatCompactINR(735254)).toBe('₹7.35 Lakh');
      expect(formatCompactINR(4820)).toBe('₹4.8K');
      expect(formatCompactINR(500)).toBe('₹500');
    });

    it('2.3 formats numbers with Indian grouping commas', () => {
      expect(formatNumberIN(1000)).toBe('1,000');
      expect(formatNumberIN(100000)).toBe('1,00,000');
      expect(formatNumberIN(10000000)).toBe('1,00,00,000');
    });

    it('2.4 handles zero, negative, and edge inputs safely', () => {
      expect(formatINR(0)).toBe('₹0');
      expect(formatCompactINR(0)).toBe('₹0');
      expect(formatCompactINR(-10000000)).toBe('-₹1.00 Cr');
      expect(formatCompactINR(NaN)).toBe('₹0');
    });
  });

  // ============================================================================
  // Suite 3: Component Render & Interactivity Verification
  // ============================================================================
  describe('Suite 3: UI Component Rendering & Interactivity', () => {

    it('3.1 renders Hero component with high-converting headline and CTAs', () => {
      render(<Hero />);

      // Headline and subheadline assertions
      expect(screen.getByText(/Stop Leaking GST Input Tax Credit/i)).toBeDefined();
      expect(screen.getByText(/Compliance-Gate Every Vendor Payment/i)).toBeDefined();

      // CTA buttons
      expect(screen.getByText(/Launch AP Command Rail/i)).toBeDefined();
      expect(screen.getByText(/Calculate ROI/i)).toBeDefined();
      expect(screen.getByText(/View Live Demo/i)).toBeDefined();

      // Statutory status preview
      expect(screen.getByText(/Tata Steel Stevedoring Pvt Ltd/i)).toBeDefined();
      expect(screen.getByText(/3-Way: 100% Match/i)).toBeDefined();
      expect(screen.getByText(/MSME: 3 Days Left/i)).toBeDefined();
    });

    it('3.2 simulates GSTR-2B filing toggle inside Hero circuit breaker', () => {
      render(<Hero />);

      // Initially unfiled (HOLD / VETO)
      expect(screen.getByText(/Circuit-Breaker Verdict: COMPLIANCE VETO ACTIVE/i)).toBeDefined();
      expect(screen.getByText(/Vendor Unfiled \(HOLD\)/i)).toBeDefined();

      // Click the toggle button to simulate vendor filing
      const toggleBtn = screen.getByRole('button', { name: /Vendor Unfiled \(HOLD\)/i });
      fireEvent.click(toggleBtn);

      // Now should switch to PASS / Release authorized
      expect(screen.getByText(/Circuit-Breaker Verdict: PASS/i)).toBeDefined();
      expect(screen.getByText(/Vendor Return Filed \(PASS\)/i)).toBeDefined();
      expect(screen.getByText(/Release Payment via AP Rail \(Pass\)/i)).toBeDefined();
    });

    it('3.3 toggles line item breakdown in Hero component', () => {
      render(<Hero />);

      const lineInspectBtn = screen.getByText(/Inspect Line-Item Matching Breakdown/i);
      fireEvent.click(lineInspectBtn);

      expect(screen.getByText(/Heavy Port Logistics Handling/i)).toBeDefined();
      expect(screen.getByText(/Intermodal Barge Drayage/i)).toBeDefined();
    });

    it('3.4 renders RoiCalculator and updates dynamically when slider changes', () => {
      render(<RoiCalculator />);

      expect(screen.getByText(/Calculate Your Enterprise Statutory Protection & ROI/i)).toBeDefined();
      expect(screen.getByText(/Monthly Invoice Spend/i)).toBeDefined();

      // Check default ₹10 Cr display
      expect(screen.getAllByText(/₹10 Cr/i).length).toBeGreaterThanOrEqual(1);

      // Check quick presets exist
      expect(screen.getByRole('button', { name: '₹5 Cr' })).toBeDefined();
      expect(screen.getByRole('button', { name: '₹25 Cr' })).toBeDefined();
      expect(screen.getByRole('button', { name: '₹50 Cr' })).toBeDefined();

      // Click ₹50 Cr preset
      const preset50Btn = screen.getByRole('button', { name: '₹50 Cr' });
      fireEvent.click(preset50Btn);

      // Slider state updates to ₹50 Cr
      expect(screen.getAllByText(/₹50 Cr/i).length).toBeGreaterThanOrEqual(1);
    });

    it('3.5 renders FeaturePillars and supports tab switching across the 3 pillars', () => {
      render(<FeaturePillars />);

      expect(screen.getByText(/The 3 Pillars of Statutory AP Defense/i)).toBeDefined();

      // Pillar 0: Autonomous 3-Way Matching
      expect(screen.getByRole('button', { name: /Autonomous 3-Way Matching/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Real-Time GSTR-2B Compliance Gating/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /MSME Section 43B\(h\) & Section 194Q TDS Rail/i })).toBeDefined();

      // Switch to Pillar 1
      const pillar1Btn = screen.getByRole('button', { name: /Real-Time GSTR-2B Compliance Gating/i });
      fireEvent.click(pillar1Btn);

      expect(screen.getByText(/Section 16\(2\)\(aa\) Statutory Circuit-Breaker/i)).toBeDefined();
      expect(screen.getByText(/GSTN GSTR-2B Statement Verification/i)).toBeDefined();

      // Switch to Pillar 2
      const pillar2Btn = screen.getByRole('button', { name: /MSME Section 43B\(h\) & Section 194Q TDS Rail/i });
      fireEvent.click(pillar2Btn);

      expect(screen.getByText(/15\/45-Day Statutory Countdown & Automatic Tax Withholding/i)).toBeDefined();
      expect(screen.getByText(/Section 43B\(h\) SLA Urgency Tracker/i)).toBeDefined();
    });

    it('3.6 renders StatutoryBadges grid with all 6 compliance shields', () => {
      render(<StatutoryBadges />);

      expect(screen.getByText(/Engineered for Indian Tax Jurisprudence/i)).toBeDefined();
      expect(screen.getByText('Section 16(2)(aa)')).toBeDefined();
      expect(screen.getByText('Section 43B(h)')).toBeDefined();
      expect(screen.getByText('Section 194Q')).toBeDefined();
      expect(screen.getByText('Rule 36(4)')).toBeDefined();
      expect(screen.getByText('GSTN API Ready')).toBeDefined();
      expect(screen.getByText('SOC2 & ISO 27001')).toBeDefined();
    });

    it('3.7 renders Testimonials with all 3 enterprise personas and savings metrics', () => {
      render(<Testimonials />);

      expect(screen.getByText(/Trusted by Leaders in Corporate Finance & Indirect Tax/i)).toBeDefined();

      // Enterprise CFO
      expect(screen.getByText(/Rajesh Singhania/i)).toBeDefined();
      expect(screen.getByText(/Chief Financial Officer/i)).toBeDefined();
      expect(screen.getByText(/₹3.4 Cr ITC Protected in Q1-Q2/i)).toBeDefined();

      // Head of Indirect Tax
      expect(screen.getByText(/Ananya Deshmukh/i)).toBeDefined();
      expect(screen.getByText(/Head of Indirect Tax & Compliance/i)).toBeDefined();
      expect(screen.getByText(/Zero Sec 43B\(h\) Tax Penalties/i)).toBeDefined();

      // VP AP Operations
      expect(screen.getByText(/Vikramaditya Roy/i)).toBeDefined();
      expect(screen.getByText(/VP of Procurement & AP Operations/i)).toBeDefined();
      expect(screen.getByText(/82% Drop in Vendor Disputes/i)).toBeDefined();
    });

    it('3.8 renders Footer with statutory and enterprise navigation links', () => {
      render(<Footer />);

      expect(screen.getByText(/Autonomous Accounts Payable \(AP\) Automation/i)).toBeDefined();
      expect(screen.getByRole('link', { name: /AP Command Rail/i })).toBeDefined();
      expect(screen.getByRole('link', { name: /3-Way Match Engine/i })).toBeDefined();
      expect(screen.getByRole('link', { name: /GSTR-2B Simulator/i })).toBeDefined();
      expect(screen.getByRole('link', { name: /Vendor Directory & MSME/i })).toBeDefined();
      expect(screen.getByRole('link', { name: /CFO Executive Analytics/i })).toBeDefined();
    });

  });

  // ============================================================================
  // Suite 4: Statutory Tax Law Assertions
  // ============================================================================
  describe('Suite 4: Indian Statutory Law Coverage Integrity', () => {
    it('4.1 verifies Section 50 interest avoidance matches 18% p.a. standard', () => {
      const result = calculateEnterpriseRoi({
        monthlySpendINR: 10000000,
        unfiledSupplierRatePct: 3.5,
        auditLatencyYears: 0.5 // 6 months standard latency
      });

      // Section 50 interest = ITC saved * 18% * latency
      const expectedInterest = Math.round(result.itcSavedAnnualINR * 0.18 * 0.5);
      expect(result.sec50InterestAvoidedINR).toBe(expectedInterest);
    });

    it('4.2 verifies Section 43B(h) disallowance calculation applies 30% corporate income tax', () => {
      const spend = 100000000; // ₹10 Cr
      const result = calculateEnterpriseRoi({
        monthlySpendINR: spend,
        msmeSupplierPct: 50, // 50% MSME
        corporateTaxRatePct: 30.0
      });

      // Annual MSME spend = 120 Cr * 50% = 60 Cr
      // Delayed at 8% = 4.8 Cr
      // 30% tax shield = 4.8 Cr * 30% = 1.44 Cr
      expect(result.msmePenaltiesShieldedINR).toBeGreaterThan(14000000);
    });
  });
});
