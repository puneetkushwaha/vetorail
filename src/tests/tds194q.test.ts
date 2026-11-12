import { describe, it, expect } from 'vitest';
import {
  calculateTds194q,
  isValidPan,
  STANDARD_TDS_194Q_RATE,
  ELEVATED_TDS_206AA_RATE
} from '../lib/engines/tds194qCalculator';
import { mockInvoices, mockVendors } from '../lib/data/mockData';

describe('Engine F7: Section 194Q TDS Deduction Engine Verification', () => {

  describe('Suite 1: Statutory Threshold & Cumulative Spend Logic', () => {
    it('1.1 should deduct ₹0 TDS when cumulative FY spend remains below ₹50 Lakhs', () => {
      const result = calculateTds194q({
        vendorId: 'ven-small-01',
        priorFySpend: 2500000,          // ₹25 Lakhs
        currentInvoiceTaxable: 1500000,  // ₹15 Lakhs -> Cumulative ₹40 Lakhs (< ₹50L)
        grossInvoiceAmount: 1770000      // ₹15L + 18% GST
      });

      expect(result.priorFySpend).toBe(2500000);
      expect(result.currentInvoiceTaxable).toBe(1500000);
      expect(result.newCumulativeSpend).toBe(4000000);
      expect(result.thresholdExceeded).toBe(false);
      expect(result.taxableSubjectToTds).toBe(0);
      expect(result.tdsAmount).toBe(0);
      expect(result.netPayableAmount).toBe(1770000);
    });

    it('1.2 Scenario 7 (Infosys BPM): Invoice crossing ₹50L deducts 0.1% strictly on excess amount', () => {
      // Prior spend: ₹42 Lakhs. Current invoice: ₹30 Lakhs. Cumulative: ₹72 Lakhs.
      // Excess subject to TDS = ₹72L - ₹50L = ₹22 Lakhs.
      // TDS = ₹22,00,000 * 0.1% = ₹2,200.
      const invoice = mockInvoices[6]; // inv-007
      const vendor = mockVendors.find((v) => v.id === invoice.vendor_id)!;

      const result = calculateTds194q({
        vendorId: vendor.id,
        priorFySpend: 4200000,
        currentInvoiceTaxable: invoice.subtotal, // 3,000,000
        grossInvoiceAmount: invoice.total_amount   // 3,540,000
      });

      expect(result.newCumulativeSpend).toBe(7200000);
      expect(result.thresholdExceeded).toBe(true);
      expect(result.taxableSubjectToTds).toBe(2200000);
      expect(result.tdsRate).toBe(STANDARD_TDS_194Q_RATE);
      expect(result.tdsAmount).toBe(2200);
      expect(result.netPayableAmount).toBe(invoice.total_amount - 2200);
      expect(result.netPayableAmount).toBe(invoice.net_payable);
    });

    it('1.3 Scenario 1 (Tata Steel): When vendor prior spend already exceeded ₹50L, full current taxable is subject to 0.1% TDS', () => {
      const invoice = mockInvoices[0]; // inv-001
      const vendor = mockVendors.find((v) => v.id === invoice.vendor_id)!;

      const result = calculateTds194q({
        vendorId: vendor.id,
        priorFySpend: 12000000, // ₹1.2 Cr (> ₹50L)
        currentInvoiceTaxable: invoice.subtotal, // 3,000,000
        grossInvoiceAmount: invoice.total_amount   // 3,540,000
      });

      expect(result.thresholdExceeded).toBe(true);
      expect(result.taxableSubjectToTds).toBe(3000000);
      expect(result.tdsRate).toBe(0.001);
      expect(result.tdsAmount).toBe(3000);
      expect(result.netPayableAmount).toBe(3537000);
      expect(result.netPayableAmount).toBe(invoice.net_payable);
    });

    it('1.4 Recalibrated Scenario 3 (Apex Fasteners): 0.1% on ₹16L excess yields ₹1,600 TDS', () => {
      // Prior spend: ₹50 Lakhs (or cumulative ₹66 Lakhs). Excess over ₹50L = ₹16 Lakhs.
      // 0.1% on ₹16 Lakhs = ₹1,600.
      const invoice = mockInvoices[2]; // inv-003
      expect(invoice.tds_194q_amount).toBe(1600);
      expect(invoice.net_payable).toBe(6370400);

      const result = calculateTds194q({
        vendorId: invoice.vendor_id,
        priorFySpend: 5000000,
        currentInvoiceTaxable: 1600000,
        grossInvoiceAmount: 6372000
      });

      expect(result.taxableSubjectToTds).toBe(1600000);
      expect(result.tdsAmount).toBe(1600);
      expect(result.netPayableAmount).toBe(6370400);
    });
  });

  describe('Suite 2: Section 206AA & 206AB Penalty Multiplier (5.0%)', () => {
    it('2.1 should elevate TDS rate to 5.0% when vendor PAN is invalid', () => {
      const result = calculateTds194q({
        vendorId: 'ven-invalid-pan',
        priorFySpend: 6000000, // > ₹50L
        currentInvoiceTaxable: 1000000,
        grossInvoiceAmount: 1180000,
        isPanValid: false // Invalid PAN
      });

      expect(result.tdsRate).toBe(ELEVATED_TDS_206AA_RATE);
      // 5.0% of ₹10,00,000 = ₹50,000 (vs ₹1,000 at standard rate)
      expect(result.tdsAmount).toBe(50000);
      expect(result.netPayableAmount).toBe(1180000 - 50000);
    });

    it('2.2 should elevate TDS rate to 5.0% when PAN is inoperative (not linked with Aadhaar)', () => {
      const result = calculateTds194q({
        vendorId: 'ven-unlinked-aadhaar',
        priorFySpend: 6000000,
        currentInvoiceTaxable: 2000000,
        grossInvoiceAmount: 2360000,
        isPanValid: true,
        isPanOperative: false // Inoperative PAN u/s 206AA
      });

      expect(result.tdsRate).toBe(0.05);
      // 5.0% of ₹20,00,000 = ₹1,00,000
      expect(result.tdsAmount).toBe(100000);
      expect(result.netPayableAmount).toBe(2260000);
    });

    it('2.3 should elevate TDS rate to 5.0% for specified non-filer of ITR u/s 206AB', () => {
      const result = calculateTds194q({
        vendorId: 'ven-non-filer',
        priorFySpend: 5500000,
        currentInvoiceTaxable: 500000,
        grossInvoiceAmount: 590000,
        isSpecifiedNonFiler: true
      });

      expect(result.tdsRate).toBe(0.05);
      expect(result.tdsAmount).toBe(25000); // 5% of 500,000
    });
  });

  describe('Suite 3: Statutory Preconditions & Pan Regex', () => {
    it('3.1 should not deduct TDS if buyer annual turnover does not exceed ₹10 Crore', () => {
      const result = calculateTds194q({
        vendorId: 'ven-turnover-test',
        priorFySpend: 10000000,
        currentInvoiceTaxable: 5000000,
        grossInvoiceAmount: 5900000,
        buyerTurnoverExceeds10Cr: false // Turnover <= 10 Cr
      });

      expect(result.tdsRate).toBe(0);
      expect(result.tdsAmount).toBe(0);
      expect(result.netPayableAmount).toBe(5900000);
    });

    it('3.2 validates PAN regex syntax strictly', () => {
      expect(isValidPan('AAACT1234F')).toBe(true);
      expect(isValidPan('BBBPZ9999K')).toBe(true);
      expect(isValidPan('12345ABCDE')).toBe(false);
      expect(isValidPan('AAACT1234')).toBe(false);
      expect(isValidPan('')).toBe(false);
    });
  });
});
