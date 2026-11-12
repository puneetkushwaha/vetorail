import { describe, it, expect } from 'vitest';
import {
  matchThreeWay,
  matchSingleLineItem
} from '../lib/engines/threeWayMatcher';
import {
  mockInvoices,
  mockInvoiceItems,
  mockPurchaseOrders,
  mockPurchaseOrderItems,
  mockGoodsReceiptNotes,
  mockGoodsReceiptNoteItems
} from '../lib/data/mockData';

describe('Engine F5: 3-Way Matching Engine Verification', () => {

  describe('Suite 1: Line-Level Matching & Tolerances', () => {
    it('1.1 should produce MATCH for exact rate and accepted quantity alignment', () => {
      const invItem = {
        po_item_id: 'poi-test-01',
        item_sku: 'SKU-BOLT-100',
        billed_qty: 100,
        unit_rate: 50.0,
        tax_rate: 18.0,
        cgst_amount: 450,
        sgst_amount: 450,
        igst_amount: 0,
        total_amount: 5900
      };

      const poItems = [
        {
          id: 'poi-test-01',
          item_sku: 'SKU-BOLT-100',
          quantity: 100,
          unit_price: 50.0,
          tax_rate: 18.0,
          total_amount: 5900
        }
      ];

      const grnItems = [
        {
          po_item_id: 'poi-test-01',
          item_sku: 'SKU-BOLT-100',
          quantity_received: 100,
          quantity_accepted: 100,
          quantity_rejected: 0
        }
      ];

      const { lineResult, lineVarianceAmount } = matchSingleLineItem(
        invItem,
        poItems,
        grnItems,
        0.5,
        0.0
      );

      expect(lineResult.status).toBe('MATCH');
      expect(lineResult.qtyDiscrepancy).toBe(0);
      expect(lineResult.rateDiscrepancy).toBe(0);
      expect(lineResult.rateDiscrepancyPct).toBe(0);
      expect(lineResult.taxDiscrepancy).toBe(0);
      expect(lineVarianceAmount).toBe(0);
    });

    it('1.2 should pass price variance within corporate tolerance (0.4% <= 0.5%)', () => {
      const invItem = {
        po_item_id: 'poi-test-02',
        item_sku: 'SKU-STEEL-PLATE',
        billed_qty: 10,
        unit_rate: 1004.0, // +0.4% over 1,000
        tax_rate: 18.0,
        cgst_amount: 903.6,
        sgst_amount: 903.6,
        igst_amount: 0
      };

      const poItems = [
        {
          id: 'poi-test-02',
          item_sku: 'SKU-STEEL-PLATE',
          quantity: 10,
          unit_price: 1000.0,
          tax_rate: 18.0,
          total_amount: 11800
        }
      ];

      const grnItems = [
        {
          po_item_id: 'poi-test-02',
          item_sku: 'SKU-STEEL-PLATE',
          quantity_accepted: 10
        }
      ];

      const { lineResult, lineVarianceAmount } = matchSingleLineItem(
        invItem,
        poItems,
        grnItems,
        0.5 // 0.5% tolerance
      );

      expect(lineResult.status).toBe('MATCH');
      expect(lineResult.rateDiscrepancyPct).toBe(0.4);
      expect(lineVarianceAmount).toBe(0);
    });

    it('1.3 should flag PRICE_VARIANCE when rate variance exceeds corporate tolerance (+8.0% > 0.5%)', () => {
      const invItem = {
        po_item_id: 'poi-003',
        item_sku: 'SKU-FAST-HD-01',
        billed_qty: 5000,
        unit_rate: 1080.0, // PO is 1,000 -> +8%
        tax_rate: 18.0,
        cgst_amount: 486000,
        sgst_amount: 486000,
        igst_amount: 0
      };

      const poItems = [
        {
          id: 'poi-003',
          item_sku: 'SKU-FAST-HD-01',
          quantity: 5000,
          unit_price: 1000.0,
          tax_rate: 18.0,
          total_amount: 5900000
        }
      ];

      const grnItems = [
        {
          po_item_id: 'poi-003',
          item_sku: 'SKU-FAST-HD-01',
          quantity_accepted: 5000
        }
      ];

      const { lineResult, lineVarianceAmount } = matchSingleLineItem(
        invItem,
        poItems,
        grnItems,
        0.5
      );

      expect(lineResult.status).toBe('PRICE_VARIANCE');
      expect(lineResult.rateDiscrepancy).toBe(80.0);
      expect(lineResult.rateDiscrepancyPct).toBe(8.0);
      // Variance amount: 80 * 5,000 = 400,000
      expect(lineVarianceAmount).toBe(400000);
    });

    it('1.4 should flag QTY_OVERBILLING when billed quantity exceeds accepted quantity', () => {
      const invItem = {
        po_item_id: 'poi-004',
        item_sku: 'SKU-ZNC-DIE-200',
        billed_qty: 100, // GRN accepted only 85
        unit_rate: 12000.0,
        tax_rate: 18.0,
        cgst_amount: 108000,
        sgst_amount: 108000,
        igst_amount: 0
      };

      const poItems = [
        {
          id: 'poi-004',
          item_sku: 'SKU-ZNC-DIE-200',
          quantity: 100,
          unit_price: 12000.0,
          tax_rate: 18.0,
          total_amount: 1416000
        }
      ];

      const grnItems = [
        {
          po_item_id: 'poi-004',
          item_sku: 'SKU-ZNC-DIE-200',
          quantity_received: 100,
          quantity_accepted: 85,
          quantity_rejected: 15
        }
      ];

      const { lineResult, lineVarianceAmount } = matchSingleLineItem(
        invItem,
        poItems,
        grnItems,
        0.5,
        0.0 // 0% qty tolerance
      );

      expect(lineResult.status).toBe('QTY_OVERBILLING');
      expect(lineResult.qtyDiscrepancy).toBe(15);
      // Overbilled taxable amount: 15 * 12,000 = 180,000
      expect(lineVarianceAmount).toBe(180000);
    });

    it('1.5 should flag TAX_MISMATCH when billed tax rate exceeds PO contracted rate', () => {
      const invItem = {
        po_item_id: 'poi-008',
        item_sku: 'SKU-SWG-HT-99',
        billed_qty: 100,
        unit_rate: 18000.0,
        tax_rate: 28.0, // Fraudulent 28% vs PO 18%
        cgst_amount: 252000,
        sgst_amount: 252000,
        igst_amount: 0
      };

      const poItems = [
        {
          id: 'poi-008',
          item_sku: 'SKU-SWG-HT-99',
          quantity: 100,
          unit_price: 18000.0,
          tax_rate: 18.0, // Agreed 18%
          total_amount: 2124000
        }
      ];

      const grnItems = [
        {
          po_item_id: 'poi-008',
          item_sku: 'SKU-SWG-HT-99',
          quantity_accepted: 100
        }
      ];

      const { lineResult, lineVarianceAmount } = matchSingleLineItem(
        invItem,
        poItems,
        grnItems
      );

      expect(lineResult.status).toBe('TAX_MISMATCH');
      // Contracted tax: 1,800,000 * 0.18 = 324,000
      // Billed tax: 504,000
      // Discrepancy: 180,000
      expect(lineResult.taxDiscrepancy).toBe(180000);
      expect(lineVarianceAmount).toBe(180000);
    });
  });

  describe('Suite 2: Summary Gating & Canonical Scenarios Verification', () => {
    it('2.1 Scenario 1 (Tata Steel): Compliant 3-way match yields EXACT_MATCH and canAutoRelease: true', () => {
      const invoice = mockInvoices[0]; // inv-001
      const invItems = mockInvoiceItems.filter((ii) => ii.invoice_id === invoice.id);
      const po = mockPurchaseOrders.find((p) => p.id === invoice.po_id);
      const poItems = mockPurchaseOrderItems.filter((poi) => poi.po_id === po?.id);
      const grn = mockGoodsReceiptNotes.find((g) => g.id === invoice.grn_id);
      const grnItems = mockGoodsReceiptNoteItems.filter((gi) => gi.grn_id === grn?.id);

      const summary = matchThreeWay({
        invoice,
        invoiceItems: invItems,
        purchaseOrder: po,
        poItems,
        grn,
        grnItems
      });

      expect(summary.invoiceId).toBe(invoice.id);
      expect(summary.overallStatus).toBe('EXACT_MATCH');
      expect(summary.canAutoRelease).toBe(true);
      expect(summary.totalVarianceAmount).toBe(0);
      expect(summary.lineResults.every((l) => l.status === 'MATCH')).toBe(true);
    });

    it('2.2 Scenario 3 (Apex Fasteners): Price variance triggers PRICE_VARIANCE_HOLD with ₹4,00,000 variance', () => {
      const invoice = mockInvoices[2]; // inv-003
      const invItems = mockInvoiceItems.filter((ii) => ii.invoice_id === invoice.id);
      const po = mockPurchaseOrders.find((p) => p.id === invoice.po_id);
      const poItems = mockPurchaseOrderItems.filter((poi) => poi.po_id === po?.id);
      const grn = mockGoodsReceiptNotes.find((g) => g.id === invoice.grn_id);
      const grnItems = mockGoodsReceiptNoteItems.filter((gi) => gi.grn_id === grn?.id);

      const summary = matchThreeWay({
        invoice,
        invoiceItems: invItems,
        purchaseOrder: po,
        poItems,
        grn,
        grnItems
      });

      expect(summary.overallStatus).toBe('PRICE_VARIANCE_HOLD');
      expect(summary.canAutoRelease).toBe(false);
      expect(summary.totalVarianceAmount).toBe(400000);
      expect(summary.lineResults[0].status).toBe('PRICE_VARIANCE');
    });

    it('2.3 Scenario 4 (Zenith Precision): Quantity overbilling triggers QUANTITY_OVERBILLING_HOLD with ₹1,80,000 variance', () => {
      const invoice = mockInvoices[3]; // inv-004
      const invItems = mockInvoiceItems.filter((ii) => ii.invoice_id === invoice.id);
      const po = mockPurchaseOrders.find((p) => p.id === invoice.po_id);
      const poItems = mockPurchaseOrderItems.filter((poi) => poi.po_id === po?.id);
      const grn = mockGoodsReceiptNotes.find((g) => g.id === invoice.grn_id);
      const grnItems = mockGoodsReceiptNoteItems.filter((gi) => gi.grn_id === grn?.id);

      const summary = matchThreeWay({
        invoice,
        invoiceItems: invItems,
        purchaseOrder: po,
        poItems,
        grn,
        grnItems
      });

      expect(summary.overallStatus).toBe('QUANTITY_OVERBILLING_HOLD');
      expect(summary.canAutoRelease).toBe(false);
      expect(summary.totalVarianceAmount).toBe(180000);
      expect(summary.lineResults[0].status).toBe('QTY_OVERBILLING');
    });

    it('2.4 Scenario 8 (Vanguard Electricals): Tax rate fraud triggers TAX_ARITHMETIC_REJECT', () => {
      const invoice = mockInvoices[7]; // inv-008
      const invItems = mockInvoiceItems.filter((ii) => ii.invoice_id === invoice.id);
      const po = mockPurchaseOrders.find((p) => p.id === invoice.po_id);
      const poItems = mockPurchaseOrderItems.filter((poi) => poi.po_id === po?.id);
      const grn = mockGoodsReceiptNotes.find((g) => g.id === invoice.grn_id);
      const grnItems = mockGoodsReceiptNoteItems.filter((gi) => gi.grn_id === grn?.id);

      const summary = matchThreeWay({
        invoice,
        invoiceItems: invItems,
        purchaseOrder: po,
        poItems,
        grn,
        grnItems
      });

      expect(summary.overallStatus).toBe('TAX_ARITHMETIC_REJECT');
      expect(summary.canAutoRelease).toBe(false);
      expect(summary.totalVarianceAmount).toBe(180000);
      expect(summary.lineResults[0].status).toBe('TAX_MISMATCH');
    });

    it('2.5 Missing GRN triggers MISSING_GRN_HOLD with full invoice amount held', () => {
      const invoice = mockInvoices[0];
      const invItems = mockInvoiceItems.filter((ii) => ii.invoice_id === invoice.id);
      const po = mockPurchaseOrders.find((p) => p.id === invoice.po_id);
      const poItems = mockPurchaseOrderItems.filter((poi) => poi.po_id === po?.id);

      const summary = matchThreeWay({
        invoice,
        invoiceItems: invItems,
        purchaseOrder: po,
        poItems,
        grn: null, // No GRN inwarded yet
        grnItems: []
      });

      expect(summary.overallStatus).toBe('MISSING_GRN_HOLD');
      expect(summary.canAutoRelease).toBe(false);
      expect(summary.totalVarianceAmount).toBe(invoice.total_amount);
    });
  });
});
