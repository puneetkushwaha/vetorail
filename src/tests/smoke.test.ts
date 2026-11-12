import { describe, it, expect } from 'vitest';
import { mockVendors, mockInvoices, mockGstr2bRecords } from '@/lib/data/mockData';

describe('Milestone 1 Foundation Smoke Tests', () => {
  it('loads 8 canonical Indian vendors with valid tax credentials', () => {
    expect(mockVendors).toHaveLength(8);
    mockVendors.forEach((vendor) => {
      expect(vendor.gstin).toMatch(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);
      expect(vendor.pan).toMatch(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
      expect(['MICRO', 'SMALL', 'MEDIUM', 'NOT_MSME', 'TRADER']).toContain(vendor.msme_category);
    });
  });

  it('loads 8 canonical invoices with statutory compliance states', () => {
    expect(mockInvoices).toHaveLength(8);
    const passInvoices = mockInvoices.filter((i) => i.compliance_gate_status === 'PASS');
    const holdInvoices = mockInvoices.filter((i) => i.compliance_gate_status === 'HOLD');
    const rejectInvoices = mockInvoices.filter((i) => i.compliance_gate_status === 'REJECT');

    expect(passInvoices.length).toBeGreaterThanOrEqual(1);
    expect(holdInvoices.length).toBeGreaterThanOrEqual(1);
    expect(rejectInvoices.length).toBeGreaterThanOrEqual(1);
  });

  it('verifies Section 16(2)(aa) GSTR-2B hold on unfiled supplier return', () => {
    const unfiledInv = mockInvoices.find((i) => i.invoice_number === 'INV-DLX-9902');
    expect(unfiledInv).toBeDefined();
    expect(unfiledInv?.compliance_gate_status).toBe('HOLD');
    expect(unfiledInv?.gstr2b_status).toBe('HOLD_UNFILED');

    // Delta Logix must not be in 2B records
    const in2B = mockGstr2bRecords.find((r) => r.invoice_number === 'INV-DLX-9902');
    expect(in2B).toBeUndefined();
  });

  it('verifies Section 194Q TDS arithmetic on high spend', () => {
    // Scenario 1: Tata Steel: ₹30,00,000 * 0.1% = ₹3,000 TDS
    const sc1 = mockInvoices.find((i) => i.invoice_number === 'INV-TSL-2026-4401');
    expect(sc1).toBeDefined();
    expect(sc1?.tds_194q_amount).toBe(3000);
    expect(sc1?.total_amount - (sc1?.tds_194q_amount || 0)).toBe(sc1?.net_payable);
  });
});
