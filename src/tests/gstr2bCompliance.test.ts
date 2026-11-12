import { describe, it, expect } from 'vitest';
import {
  normalizeInvoiceNumber,
  isSection17_5Blocked,
  calculateSec50Interest,
  verifyGstr2bCompliance
} from '../lib/engines/gstr2bEngine';
import { mockInvoices, mockGstr2bRecords, mockVendors } from '../lib/data/mockData';

describe('Engine F6: GSTR-2B Section 16(2)(aa) Statutory Engine Verification', () => {

  describe('Suite 1: Invoice Number Normalization', () => {
    it('1.1 strips slashes, hyphens, and spaces to match disparate ERP conventions', () => {
      expect(normalizeInvoiceNumber('INV/2026-27/0042')).toBe('INV20262742');
      expect(normalizeInvoiceNumber('inv-aif-2026-108')).toBe('INVAIF2026108');
      expect(normalizeInvoiceNumber('  INV 9902 _ B  ')).toBe('INV9902B');
    });

    it('1.2 strips leading zeros to match buyer ERP vs supplier GSTN numbers', () => {
      // Both supplier filing '00045/26' and buyer entering '45-26' resolve to '4526'
      expect(normalizeInvoiceNumber('00045/26')).toBe('4526');
      expect(normalizeInvoiceNumber('45-26')).toBe('4526');
      expect(normalizeInvoiceNumber('00045/26')).toBe(normalizeInvoiceNumber('45-26'));
    });

    it('1.3 handles empty or edge strings gracefully', () => {
      expect(normalizeInvoiceNumber('')).toBe('');
      expect(normalizeInvoiceNumber('000')).toBe('0');
    });
  });

  describe('Suite 2: Section 16(2)(aa) 6-Point Reconciliation Engine', () => {
    it('2.1 Scenario 1 (Tata Steel): Exactly matched in GSTR-2B returns PASS_2B with 0 Sec 50 risk', () => {
      const invoice = mockInvoices[0]; // INV-TSL-2026-4401
      const vendor = mockVendors.find((v) => v.id === invoice.vendor_id)!;

      const result = verifyGstr2bCompliance({
        invoice,
        vendorGstin: vendor.gstin,
        gstr2bRecords: mockGstr2bRecords
      });

      expect(result.isFoundIn2B).toBe(true);
      expect(result.gateVerdict).toBe('PASS_2B');
      expect(result.valueMismatchAmount).toBe(0);
      expect(result.taxSplitValid).toBe(true);
      expect(result.potentialSec50InterestRisk).toBe(0);
    });

    it('2.2 Scenario 2 (Delta Logix): Missing GSTR-2B reflection triggers HOLD_UNFILED and 18% p.a. Sec 50 interest risk', () => {
      const invoice = mockInvoices[1]; // INV-DLX-9902 (deliberately absent from 2B)
      const vendor = mockVendors.find((v) => v.id === invoice.vendor_id)!;

      const result = verifyGstr2bCompliance({
        invoice,
        vendorGstin: vendor.gstin,
        gstr2bRecords: mockGstr2bRecords
      });

      expect(result.isFoundIn2B).toBe(false);
      expect(result.gateVerdict).toBe('HOLD_UNFILED');
      // Tax at risk is ₹1,80,000. Interest risk at 18% p.a.: 180,000 * 0.18 = 32,400
      expect(result.potentialSec50InterestRisk).toBe(32400);
    });

    it('2.3 allows taxable value difference within statutory tolerance (<= ₹10.00)', () => {
      const invoice = {
        id: 'inv-test-tol',
        invoice_number: 'INV-TOL-001',
        subtotal: 100004.50, // ₹4.50 rounding diff
        tax_amount: 18000,
        is_rcm: false
      };

      const gstr2bRecords = [
        {
          id: 'g2b-tol-01',
          vendor_gstin: '29AABCT1332L1ZS',
          invoice_number: 'INV-TOL-001',
          invoice_date: '2026-04-10',
          invoice_type: 'B2B' as const,
          taxable_value: 100000.00, // Diff is 4.50 (<= 10.00)
          igst: 18000,
          cgst: 0,
          sgst: 0,
          filing_date: '2026-05-11',
          gstr2b_period: '2026-04',
          itc_eligibility: 'ELIGIBLE' as const,
          is_rcm: false,
          created_at: '2026-05-14T00:00:00Z'
        }
      ];

      const result = verifyGstr2bCompliance({
        invoice,
        vendorGstin: '29AABCT1332L1ZS',
        gstr2bRecords,
        valueToleranceINR: 10.0
      });

      expect(result.isFoundIn2B).toBe(true);
      expect(result.gateVerdict).toBe('PASS_2B');
      expect(result.valueMismatchAmount).toBe(4.50);
      expect(result.potentialSec50InterestRisk).toBe(0);
    });

    it('2.4 triggers HOLD_VALUE_MISMATCH when taxable value exceeds tolerance (> ₹10.00)', () => {
      const invoice = {
        id: 'inv-test-val-err',
        invoice_number: 'INV-VAL-002',
        subtotal: 500000.00,
        tax_amount: 90000,
        is_rcm: false
      };

      const gstr2bRecords = [
        {
          id: 'g2b-val-02',
          vendor_gstin: '29AABCT1332L1ZS',
          invoice_number: 'INV-VAL-002',
          invoice_date: '2026-04-10',
          invoice_type: 'B2B' as const,
          taxable_value: 480000.00, // Diff is ₹20,000 (> ₹10.00)
          igst: 86400,
          cgst: 0,
          sgst: 0,
          filing_date: '2026-05-11',
          gstr2b_period: '2026-04',
          itc_eligibility: 'ELIGIBLE' as const,
          is_rcm: false,
          created_at: '2026-05-14T00:00:00Z'
        }
      ];

      const result = verifyGstr2bCompliance({
        invoice,
        vendorGstin: '29AABCT1332L1ZS',
        gstr2bRecords,
        valueToleranceINR: 10.0
      });

      expect(result.isFoundIn2B).toBe(true);
      expect(result.gateVerdict).toBe('HOLD_VALUE_MISMATCH');
      expect(result.valueMismatchAmount).toBe(20000.00);
      // Section 50 interest risk is applied on tax amount
      expect(result.potentialSec50InterestRisk).toBe(Math.round(90000 * 0.18));
    });

    it('2.5 triggers HOLD_RCM_MISMATCH when Reverse Charge flag is inconsistent', () => {
      const invoice = {
        id: 'inv-test-rcm',
        invoice_number: 'INV-RCM-003',
        subtotal: 100000.00,
        tax_amount: 18000,
        is_rcm: true // Invoice indicates RCM
      };

      const gstr2bRecords = [
        {
          id: 'g2b-rcm-03',
          vendor_gstin: '29AABCT1332L1ZS',
          invoice_number: 'INV-RCM-003',
          invoice_date: '2026-04-10',
          invoice_type: 'B2B' as const,
          taxable_value: 100000.00,
          igst: 18000,
          cgst: 0,
          sgst: 0,
          filing_date: '2026-05-11',
          gstr2b_period: '2026-04',
          itc_eligibility: 'ELIGIBLE' as const,
          is_rcm: false, // 2B indicates NOT RCM
          created_at: '2026-05-14T00:00:00Z'
        }
      ];

      const result = verifyGstr2bCompliance({
        invoice,
        vendorGstin: '29AABCT1332L1ZS',
        gstr2bRecords,
        isRcmApplicable: true
      });

      expect(result.isRcmValid).toBe(false);
      expect(result.gateVerdict).toBe('HOLD_RCM_MISMATCH');
    });
  });

  describe('Suite 3: Section 17(5) Blocked Credit Classifier', () => {
    it('3.1 identifies motor vehicle passenger transportation HSN (8703) as blocked', () => {
      expect(isSection17_5Blocked('87032190', 'Sedan car purchase')).toBe(true);
      expect(isSection17_5Blocked('87042100', 'Commercial cargo truck')).toBe(false);
    });

    it('3.2 identifies outdoor catering and food service (SAC 9963) as blocked', () => {
      expect(isSection17_5Blocked('996331', 'Executive dining catering service')).toBe(true);
      expect(isSection17_5Blocked(undefined, 'Annual company banquet outdoor catering')).toBe(true);
    });

    it('3.3 recognizes explicit INELIGIBLE_17_5 GSTR-2B eligibility status', () => {
      const invoice = {
        id: 'inv-17-5',
        invoice_number: 'INV-CAR-01',
        subtotal: 1500000.00,
        tax_amount: 420000,
        is_rcm: false
      };

      const gstr2bRecords = [
        {
          id: 'g2b-17-5',
          vendor_gstin: '29AABCT1332L1ZS',
          invoice_number: 'INV-CAR-01',
          invoice_date: '2026-04-10',
          invoice_type: 'B2B' as const,
          taxable_value: 1500000.00,
          igst: 420000,
          cgst: 0,
          sgst: 0,
          filing_date: '2026-05-11',
          gstr2b_period: '2026-04',
          itc_eligibility: 'INELIGIBLE_17_5' as const, // Marked in 2B
          is_rcm: false,
          created_at: '2026-05-14T00:00:00Z'
        }
      ];

      const result = verifyGstr2bCompliance({
        invoice,
        vendorGstin: '29AABCT1332L1ZS',
        gstr2bRecords
      });

      expect(result.is17_5_Blocked).toBe(true);
      expect(result.gateVerdict).toBe('INELIGIBLE_17_5');
    });
  });

  describe('Suite 4: Section 50(3) Exposure Math', () => {
    it('4.1 computes 18% annual interest accurately for full year and partial periods', () => {
      // ₹1,00,000 tax for 365 days @ 18% = ₹18,000
      expect(calculateSec50Interest(100000, 365, 0.18)).toBe(18000);
      // ₹1,00,000 tax for 182.5 days @ 18% = ₹9,000
      expect(calculateSec50Interest(100000, 182.5, 0.18)).toBe(9000);
      // 0 tax yields 0
      expect(calculateSec50Interest(0, 365, 0.18)).toBe(0);
    });
  });
});
