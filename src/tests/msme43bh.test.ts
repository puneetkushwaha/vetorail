import { describe, it, expect } from 'vitest';
import {
  calculateMsme43bhStatus,
  calculateMsmedPenalInterest,
  STATUTORY_MAX_MSME_DAYS_WITH_AGREEMENT,
  STATUTORY_MAX_MSME_DAYS_WITHOUT_AGREEMENT,
  DEFAULT_MSMED_PENAL_RATE
} from '../lib/engines/msme43bhEngine';
import { mockInvoices, mockVendors, mockGoodsReceiptNotes } from '../lib/data/mockData';

describe('Engine F8: Section 43B(h) MSME SLA & Penalty Engine Verification', () => {

  describe('Suite 1: Statutory Applicability & Enterprise Classification', () => {
    it('1.1 should enforce Section 43B(h) strictly on MICRO and SMALL enterprises', () => {
      const microResult = calculateMsme43bhStatus({
        vendorId: 'ven-micro-01',
        msmeCategory: 'MICRO',
        grnDate: '2026-04-01',
        referenceDate: '2026-04-10',
        invoiceTaxableAmount: 500000
      });
      expect(microResult.isApplicable).toBe(true);

      const smallResult = calculateMsme43bhStatus({
        vendorId: 'ven-small-01',
        msmeCategory: 'SMALL',
        grnDate: '2026-04-01',
        referenceDate: '2026-04-10',
        invoiceTaxableAmount: 1000000
      });
      expect(smallResult.isApplicable).toBe(true);
    });

    it('1.2 should EXEMPT MEDIUM enterprises from Section 43B(h) SLA gating', () => {
      const mediumResult = calculateMsme43bhStatus({
        vendorId: 'ven-medium-01',
        msmeCategory: 'MEDIUM',
        grnDate: '2026-04-01',
        referenceDate: '2026-05-25', // 54 days later
        invoiceTaxableAmount: 5000000
      });

      expect(mediumResult.isApplicable).toBe(false);
      expect(mediumResult.urgencyTier).toBe('GREEN');
      expect(mediumResult.disallowanceRiskAmount).toBe(0);
      expect(mediumResult.penalInterestRate).toBe(0);
    });

    it('1.3 should EXEMPT wholesale and retail TRADERS per MSME Office Memorandum 02.07.2021', () => {
      const traderResult = calculateMsme43bhStatus({
        vendorId: 'ven-trader-01',
        msmeCategory: 'TRADER',
        grnDate: '2026-04-01',
        referenceDate: '2026-05-25', // 54 days later
        invoiceTaxableAmount: 800000
      });

      expect(traderResult.isApplicable).toBe(false);
      expect(traderResult.urgencyTier).toBe('GREEN');
      expect(traderResult.disallowanceRiskAmount).toBe(0);
    });

    it('1.4 should EXEMPT large non-MSME enterprises', () => {
      const largeResult = calculateMsme43bhStatus({
        vendorId: 'ven-large-01',
        msmeCategory: 'NOT_MSME',
        grnDate: '2026-04-01',
        referenceDate: '2026-05-20',
        invoiceTaxableAmount: 20000000
      });

      expect(largeResult.isApplicable).toBe(false);
      expect(largeResult.urgencyTier).toBe('GREEN');
    });
  });

  describe('Suite 2: Statutory 15/45-Day Payment Ceilings (Section 15 MSMED Act)', () => {
    it('2.1 respects agreed terms under 45 days (e.g. 30 days)', () => {
      const result = calculateMsme43bhStatus({
        vendorId: 'ven-test',
        msmeCategory: 'MICRO',
        hasWrittenAgreement: true,
        agreementDays: 30,
        grnDate: '2026-04-01',
        referenceDate: '2026-04-10',
        invoiceTaxableAmount: 200000
      });

      expect(result.maxDaysAllowed).toBe(30);
      expect(result.daysElapsed).toBe(9);
      expect(result.daysRemaining).toBe(21);
      expect(result.urgencyTier).toBe('GREEN');
    });

    it('2.2 overrides contractual terms exceeding 45 days to the legal ceiling of 45 days', () => {
      // Contractual 90-day term is legally void under Section 15 MSMED Act
      const result = calculateMsme43bhStatus({
        vendorId: 'ven-test',
        msmeCategory: 'SMALL',
        hasWrittenAgreement: true,
        agreementDays: 90, // Illegal contract term
        grnDate: '2026-04-01',
        referenceDate: '2026-04-01',
        invoiceTaxableAmount: 500000
      });

      expect(result.maxDaysAllowed).toBe(STATUTORY_MAX_MSME_DAYS_WITH_AGREEMENT);
      expect(result.maxDaysAllowed).toBe(45);
    });

    it('2.3 enforces strictly 15 days in the absence of a written agreement', () => {
      const result = calculateMsme43bhStatus({
        vendorId: 'ven-test-no-agreement',
        msmeCategory: 'MICRO',
        hasWrittenAgreement: false,
        grnDate: '2026-04-01',
        referenceDate: '2026-04-05',
        invoiceTaxableAmount: 300000
      });

      expect(result.maxDaysAllowed).toBe(STATUTORY_MAX_MSME_DAYS_WITHOUT_AGREEMENT);
      expect(result.maxDaysAllowed).toBe(15);
      expect(result.daysElapsed).toBe(4);
      expect(result.daysRemaining).toBe(11);
      expect(result.urgencyTier).toBe('YELLOW'); // 11 days remaining
    });
  });

  describe('Suite 3: Urgency Tiers & Canonical Scenarios Verification', () => {
    it('3.1 Scenario 5 (Precision Toolings): Day 42/45 triggers ORANGE fast-track priority (3 days left)', () => {
      const invoice = mockInvoices[4]; // inv-005
      const vendor = mockVendors.find((v) => v.id === invoice.vendor_id)!;
      const grn = mockGoodsReceiptNotes.find((g) => g.id === invoice.grn_id)!;

      expect(vendor.msme_category).toBe('MICRO');

      const result = calculateMsme43bhStatus({
        vendorId: vendor.id,
        msmeCategory: vendor.msme_category,
        agreementDays: vendor.agreement_days, // 45
        grnDate: grn.grn_date,                 // 2026-03-31
        referenceDate: '2026-05-12',          // Reference audit date (42 days elapsed)
        invoiceTaxableAmount: invoice.subtotal // 440,000
      });

      expect(result.isApplicable).toBe(true);
      expect(result.maxDaysAllowed).toBe(45);
      expect(result.daysElapsed).toBe(42);
      expect(result.daysRemaining).toBe(3);
      expect(result.urgencyTier).toBe('ORANGE');
      // 30% tax penalty shield: 440,000 * 0.30 = 132,000
      expect(result.disallowanceRiskAmount).toBe(132000);
    });

    it('3.2 Scenario 6 (Kaveri Polymers): Day 48/45 triggers RED_OVERDUE and 30% tax disallowance liability', () => {
      const invoice = mockInvoices[5]; // inv-006
      const vendor = mockVendors.find((v) => v.id === invoice.vendor_id)!;
      const grn = mockGoodsReceiptNotes.find((g) => g.id === invoice.grn_id)!;

      expect(vendor.msme_category).toBe('MICRO');

      const result = calculateMsme43bhStatus({
        vendorId: vendor.id,
        msmeCategory: vendor.msme_category,
        agreementDays: vendor.agreement_days, // 45
        grnDate: grn.grn_date,                 // 2026-03-25
        referenceDate: '2026-05-12',          // Reference audit date (48 days elapsed)
        invoiceTaxableAmount: invoice.subtotal // 1,500,000
      });

      expect(result.isApplicable).toBe(true);
      expect(result.daysElapsed).toBe(48);
      expect(result.daysRemaining).toBe(-3);
      expect(result.urgencyTier).toBe('RED_OVERDUE');
      // 30% corporate tax disallowance: 1,500,000 * 0.30 = 450,000
      expect(result.disallowanceRiskAmount).toBe(450000);
      expect(result.penalInterestRate).toBe(DEFAULT_MSMED_PENAL_RATE);
    });

    it('3.3 correctly transitions across GREEN, YELLOW, ORANGE, and RED tiers', () => {
      const baseInput = {
        vendorId: 'ven-flow',
        msmeCategory: 'MICRO' as const,
        agreementDays: 45,
        grnDate: '2026-05-01',
        invoiceTaxableAmount: 100000
      };

      // Day 10 elapsed -> 35 days remaining -> GREEN (> 15)
      expect(calculateMsme43bhStatus({ ...baseInput, referenceDate: '2026-05-11' }).urgencyTier).toBe('GREEN');

      // Day 35 elapsed -> 10 days remaining -> YELLOW (6 to 15)
      expect(calculateMsme43bhStatus({ ...baseInput, referenceDate: '2026-06-05' }).urgencyTier).toBe('YELLOW');

      // Day 42 elapsed -> 3 days remaining -> ORANGE (1 to 5)
      expect(calculateMsme43bhStatus({ ...baseInput, referenceDate: '2026-06-12' }).urgencyTier).toBe('ORANGE');

      // Day 46 elapsed -> -1 days remaining -> RED_OVERDUE (<= 0)
      expect(calculateMsme43bhStatus({ ...baseInput, referenceDate: '2026-06-16' }).urgencyTier).toBe('RED_OVERDUE');
    });
  });

  describe('Suite 4: Section 16 MSMED Penal Compound Interest Math', () => {
    it('4.1 computes 3x RBI Bank rate (20.25% p.a.) penal interest for overdue delays', () => {
      // Overdue amount ₹1,00,000 delayed by 365 days @ 20.25% = ₹20,250
      expect(calculateMsmedPenalInterest(100000, 365)).toBe(20250);

      // Overdue amount ₹10,00,000 delayed by 30 days @ 20.25% = Math.round(1,000,000 * 0.2025 * (30/365)) = 16,644
      expect(calculateMsmedPenalInterest(1000000, 30)).toBe(16644);

      // 0 overdue days yields 0 interest
      expect(calculateMsmedPenalInterest(1000000, 0)).toBe(0);
    });
  });
});
