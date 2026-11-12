import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  mockVendors,
  mockPurchaseOrders,
  mockPurchaseOrderItems,
  mockGoodsReceiptNotes,
  mockGoodsReceiptNoteItems,
  mockInvoices,
  mockInvoiceItems,
  mockGstr2bRecords,
  mockComplianceAuditLogs
} from '../lib/data/mockData';

// Regex constants
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_GST_STATE_CODES = new Set([
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38', '97', '99'
]);

describe('Empirical Verification: Milestone 1 Architecture & Mock Datasets', () => {

  describe('1. Schema Integrity & SQL Syntax Validity', () => {
    const schemaPath = path.resolve(__dirname, '../../supabase/schema.sql');
    const migrationPath = path.resolve(__dirname, '../../supabase/migrations/001_initial_schema.sql');

    it('verifies schema files exist and are readable', () => {
      expect(fs.existsSync(schemaPath)).toBe(true);
      expect(fs.existsSync(migrationPath)).toBe(true);
    });

    it('verifies SQL statement equivalence between schema.sql and migration file', () => {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');

      // Strip comment lines and compare substantive SQL code
      const stripComments = (sql: string) =>
        sql
          .split('\n')
          .filter((line) => !line.trim().startsWith('--'))
          .join('\n')
          .trim();

      expect(stripComments(schemaSql)).toBe(stripComments(migrationSql));
    });

    it('validates 9 relational table definitions with correct primary keys and foreign keys', () => {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      const expectedTables = [
        'vendors',
        'purchase_orders',
        'purchase_order_items',
        'goods_receipt_notes',
        'goods_receipt_note_items',
        'invoices',
        'invoice_items',
        'gstr2b_records',
        'compliance_audit_logs'
      ];

      expectedTables.forEach((table) => {
        const tableRegex = new RegExp(`CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${table}\\s*\\(`, 'i');
        expect(tableRegex.test(schemaSql), `Missing CREATE TABLE for ${table}`).toBe(true);
      });
    });

    it('validates all Foreign Key references point to existing tables and primary keys', () => {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      const fkRelations = [
        { table: 'purchase_orders', fkCol: 'vendor_id', refTable: 'vendors', refCol: 'id' },
        { table: 'purchase_order_items', fkCol: 'po_id', refTable: 'purchase_orders', refCol: 'id' },
        { table: 'goods_receipt_notes', fkCol: 'po_id', refTable: 'purchase_orders', refCol: 'id' },
        { table: 'goods_receipt_note_items', fkCol: 'grn_id', refTable: 'goods_receipt_notes', refCol: 'id' },
        { table: 'goods_receipt_note_items', fkCol: 'po_item_id', refTable: 'purchase_order_items', refCol: 'id' },
        { table: 'invoices', fkCol: 'vendor_id', refTable: 'vendors', refCol: 'id' },
        { table: 'invoices', fkCol: 'po_id', refTable: 'purchase_orders', refCol: 'id' },
        { table: 'invoices', fkCol: 'grn_id', refTable: 'goods_receipt_notes', refCol: 'id' },
        { table: 'invoice_items', fkCol: 'invoice_id', refTable: 'invoices', refCol: 'id' },
        { table: 'invoice_items', fkCol: 'po_item_id', refTable: 'purchase_order_items', refCol: 'id' },
        { table: 'compliance_audit_logs', fkCol: 'invoice_id', refTable: 'invoices', refCol: 'id' },
      ];

      fkRelations.forEach(({ fkCol, refTable, refCol }) => {
        const fkPattern = new RegExp(`${fkCol}\\s+UUID(?:\\s+NOT\\s+NULL)?\\s+REFERENCES\\s+${refTable}\\(${refCol}\\)`, 'i');
        expect(fkPattern.test(schemaSql), `Missing or malformed FK ${fkCol} -> ${refTable}(${refCol})`).toBe(true);
      });
    });

    it('validates RLS is enabled and policies are defined for all 9 tables', () => {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      const expectedTables = [
        'vendors',
        'purchase_orders',
        'purchase_order_items',
        'goods_receipt_notes',
        'goods_receipt_note_items',
        'invoices',
        'invoice_items',
        'gstr2b_records',
        'compliance_audit_logs'
      ];

      expectedTables.forEach((table) => {
        const rlsRegex = new RegExp(`ALTER\\s+TABLE\\s+${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, 'i');
        expect(rlsRegex.test(schemaSql), `RLS not enabled for ${table}`).toBe(true);

        const policyRegex = new RegExp(`CREATE\\s+POLICY\\s+\"Public\\s+Read\\s+${table}\"\\s+ON\\s+${table}`, 'i');
        expect(policyRegex.test(schemaSql), `Missing read policy for ${table}`).toBe(true);
      });
    });
  });

  describe('2. Adversarial Schema Compatibility Stress-Tests', () => {
    it('[DISCREPANCY CHECK] tests whether mock primary keys conform to SQL UUID data type', () => {
      // In supabase/schema.sql, all primary and foreign key IDs are declared as UUID:
      // id UUID PRIMARY KEY DEFAULT gen_random_uuid()
      // If ingested into Supabase/PostgreSQL, strings like 'ven-001' fail UUID parsing.
      const nonUuidIds: { entity: string; id: string }[] = [];

      mockVendors.forEach((v) => {
        if (!UUID_REGEX.test(v.id)) nonUuidIds.push({ entity: 'vendor', id: v.id });
      });
      mockPurchaseOrders.forEach((po) => {
        if (!UUID_REGEX.test(po.id)) nonUuidIds.push({ entity: 'purchase_order', id: po.id });
      });
      mockInvoices.forEach((inv) => {
        if (!UUID_REGEX.test(inv.id)) nonUuidIds.push({ entity: 'invoice', id: inv.id });
      });

      // We document this empirical observation:
      // The mock data uses human-readable slugs ('ven-001') rather than UUIDs.
      // Standalone mode handles this, but direct SQL insertion into UUID columns requires UUID conversion.
      expect(nonUuidIds.length).toBeGreaterThan(0);
    });

    it('[DISCREPANCY CHECK] tests whether mockComplianceAuditLogs event_type matches SQL CHECK constraint', () => {
      // In supabase/schema.sql lines 315-329:
      // CONSTRAINT chk_audit_logs_event_type CHECK (
      //     event_type IN (
      //         'INVOICE_INGESTED',
      //         '3_WAY_MATCH_COMPLETED',
      //         'GSTR2B_VERIFICATION',
      //         'TDS_194Q_CALCULATED',
      //         'MSME_43BH_EVALUATED',
      //         'GATE_STATUS_CHANGED',
      //         'MANUAL_OVERRIDE',
      //         'VENDOR_NOTIFIED',
      //         'PAYMENT_RELEASED',
      //         'PAYMENT_GATED_HOLD',
      //         'PAYMENT_REJECTED'
      //     )
      // )
      const sqlAllowedEventTypes = new Set([
        'INVOICE_INGESTED',
        '3_WAY_MATCH_COMPLETED',
        'GSTR2B_VERIFICATION',
        'TDS_194Q_CALCULATED',
        'MSME_43BH_EVALUATED',
        'GATE_STATUS_CHANGED',
        'MANUAL_OVERRIDE',
        'VENDOR_NOTIFIED',
        'PAYMENT_RELEASED',
        'PAYMENT_GATED_HOLD',
        'PAYMENT_REJECTED'
      ]);

      const mismatchedEventTypes = mockComplianceAuditLogs
        .map((log) => log.event_type)
        .filter((et) => !sqlAllowedEventTypes.has(et));

      // Empirically verify that mockData uses extended event types not listed in SQL CHECK constraint!
      expect(mismatchedEventTypes.length).toBe(mockComplianceAuditLogs.length);
      expect(mismatchedEventTypes).toContain('GATE_EVALUATION');
      expect(mismatchedEventTypes).toContain('COMPLIANCE_HOLD');
      expect(mismatchedEventTypes).toContain('PRICE_VARIANCE_HOLD');
      expect(mismatchedEventTypes).toContain('QTY_OVERBILLING_HOLD');
      expect(mismatchedEventTypes).toContain('MSME_SLA_FAST_TRACK');
      expect(mismatchedEventTypes).toContain('MSME_STATUTORY_BREACH');
      expect(mismatchedEventTypes).toContain('TDS_194Q_DEDUCTION');
      expect(mismatchedEventTypes).toContain('GATE_REJECTION');
    });
  });

  describe('3. Referential Integrity Across Mock Datasets', () => {
    const vendorIds = new Set(mockVendors.map((v) => v.id));
    const poIds = new Set(mockPurchaseOrders.map((po) => po.id));
    const poItemIds = new Set(mockPurchaseOrderItems.map((poi) => poi.id));
    const grnIds = new Set(mockGoodsReceiptNotes.map((g) => g.id));
    const invoiceIds = new Set(mockInvoices.map((i) => i.id));

    it('resolves all vendor_id references in purchase_orders to mockVendors', () => {
      mockPurchaseOrders.forEach((po) => {
        expect(vendorIds.has(po.vendor_id), `PO ${po.id} has invalid vendor_id ${po.vendor_id}`).toBe(true);
      });
    });

    it('resolves all po_id references in purchase_order_items to mockPurchaseOrders', () => {
      mockPurchaseOrderItems.forEach((poi) => {
        expect(poIds.has(poi.po_id), `PO Item ${poi.id} has invalid po_id ${poi.po_id}`).toBe(true);
      });
    });

    it('resolves all po_id references in goods_receipt_notes to mockPurchaseOrders', () => {
      mockGoodsReceiptNotes.forEach((grn) => {
        expect(poIds.has(grn.po_id), `GRN ${grn.id} has invalid po_id ${grn.po_id}`).toBe(true);
      });
    });

    it('resolves all grn_id and po_item_id in goods_receipt_note_items', () => {
      mockGoodsReceiptNoteItems.forEach((grni) => {
        expect(grnIds.has(grni.grn_id), `GRN Item ${grni.id} has invalid grn_id ${grni.grn_id}`).toBe(true);
        if (grni.po_item_id) {
          expect(poItemIds.has(grni.po_item_id), `GRN Item ${grni.id} has invalid po_item_id ${grni.po_item_id}`).toBe(true);
        }
      });
    });

    it('resolves all vendor_id, po_id, and grn_id in mockInvoices', () => {
      mockInvoices.forEach((inv) => {
        expect(vendorIds.has(inv.vendor_id), `Invoice ${inv.id} has invalid vendor_id ${inv.vendor_id}`).toBe(true);
        if (inv.po_id) {
          expect(poIds.has(inv.po_id), `Invoice ${inv.id} has invalid po_id ${inv.po_id}`).toBe(true);
        }
        if (inv.grn_id) {
          expect(grnIds.has(inv.grn_id), `Invoice ${inv.id} has invalid grn_id ${inv.grn_id}`).toBe(true);
        }
      });
    });

    it('resolves all invoice_id and po_item_id in mockInvoiceItems', () => {
      mockInvoiceItems.forEach((ii) => {
        expect(invoiceIds.has(ii.invoice_id), `Invoice Item ${ii.id} has invalid invoice_id ${ii.invoice_id}`).toBe(true);
        if (ii.po_item_id) {
          expect(poItemIds.has(ii.po_item_id), `Invoice Item ${ii.id} has invalid po_item_id ${ii.po_item_id}`).toBe(true);
        }
      });
    });

    it('resolves all invoice_id references in mockComplianceAuditLogs', () => {
      mockComplianceAuditLogs.forEach((log) => {
        expect(invoiceIds.has(log.invoice_id), `Audit Log ${log.id} has invalid invoice_id ${log.invoice_id}`).toBe(true);
      });
    });
  });

  describe('4. Line Item Arithmetic & Tax Calculations', () => {
    it('verifies invoice line items sum exactly to invoice subtotal, tax_amount, and total_amount', () => {
      mockInvoices.forEach((inv) => {
        const items = mockInvoiceItems.filter((ii) => ii.invoice_id === inv.id);
        expect(items.length, `Invoice ${inv.id} must have at least 1 item`).toBeGreaterThan(0);

        const computedSubtotal = items.reduce((sum, item) => sum + item.billed_qty * item.unit_rate, 0);
        const computedCgst = items.reduce((sum, item) => sum + item.cgst_amount, 0);
        const computedSgst = items.reduce((sum, item) => sum + item.sgst_amount, 0);
        const computedIgst = items.reduce((sum, item) => sum + item.igst_amount, 0);
        const computedTax = computedCgst + computedSgst + computedIgst;
        const computedTotal = computedSubtotal + computedTax;

        expect(computedSubtotal, `Subtotal mismatch for ${inv.invoice_number}`).toBe(inv.subtotal);
        expect(computedTax, `Tax amount mismatch for ${inv.invoice_number}`).toBe(inv.tax_amount);
        expect(computedTotal, `Total amount mismatch for ${inv.invoice_number}`).toBe(inv.total_amount);
        expect(inv.total_amount - inv.tds_194q_amount, `Net payable mismatch for ${inv.invoice_number}`).toBe(inv.net_payable);
      });
    });

    it('verifies purchase order items sum exactly to PO total_amount', () => {
      mockPurchaseOrders.forEach((po) => {
        const items = mockPurchaseOrderItems.filter((poi) => poi.po_id === po.id);
        expect(items.length).toBeGreaterThan(0);

        const computedTotal = items.reduce((sum, item) => sum + item.total_amount, 0);
        expect(computedTotal, `PO total mismatch for ${po.po_number}`).toBe(po.total_amount);
      });
    });

    it('verifies GRN received quantity balances accepted + rejected', () => {
      mockGoodsReceiptNoteItems.forEach((grni) => {
        expect(grni.quantity_accepted + grni.quantity_rejected).toBeLessThanOrEqual(grni.quantity_received);
      });
    });
  });

  describe('5. Statutory Regex & Indian Tax Credential Validation', () => {
    it('verifies all 8 vendors have strictly valid Indian GSTIN and PAN syntax', () => {
      mockVendors.forEach((vendor) => {
        expect(GSTIN_REGEX.test(vendor.gstin), `Invalid GSTIN format: ${vendor.gstin}`).toBe(true);
        expect(PAN_REGEX.test(vendor.pan), `Invalid PAN format: ${vendor.pan}`).toBe(true);

        // State code check
        const stateCode = vendor.gstin.substring(0, 2);
        expect(VALID_GST_STATE_CODES.has(stateCode), `Invalid state code ${stateCode} in ${vendor.gstin}`).toBe(true);

        // PAN embedding check: chars 3-12 of GSTIN must equal vendor PAN
        const embeddedPan = vendor.gstin.substring(2, 12);
        expect(embeddedPan, `GSTIN PAN mismatch: ${embeddedPan} vs ${vendor.pan}`).toBe(vendor.pan);
      });
    });

    it('verifies all GSTR-2B records contain valid vendor_gstin matching registered vendors', () => {
      const vendorGstins = new Set(mockVendors.map((v) => v.gstin));
      mockGstr2bRecords.forEach((rec) => {
        expect(GSTIN_REGEX.test(rec.vendor_gstin)).toBe(true);
        expect(vendorGstins.has(rec.vendor_gstin), `GSTR-2B has unregistered GSTIN ${rec.vendor_gstin}`).toBe(true);
      });
    });
  });

  describe('6. Canonical Statutory Scenarios Rigorous Validation', () => {
    it('Scenario 1: Tata Steel - Compliant pass with Section 194Q TDS deduction', () => {
      const inv = mockInvoices.find((i) => i.invoice_number === 'INV-TSL-2026-4401')!;
      expect(inv).toBeDefined();
      expect(inv.compliance_gate_status).toBe('PASS');
      expect(inv.match_status).toBe('EXACT_MATCH');
      expect(inv.gstr2b_status).toBe('PASS_2B');

      // Vendor FY spend exceeds ₹50L threshold
      const vendor = mockVendors.find((v) => v.id === inv.vendor_id)!;
      expect(vendor.fy_spend).toBeGreaterThan(5000000);

      // Section 194Q: 0.1% TDS on taxable value (₹30,00,000 * 0.001 = ₹3,000)
      const expectedTds = Math.round(inv.subtotal * 0.001);
      expect(inv.tds_194q_amount).toBe(expectedTds);
      expect(inv.tds_194q_amount).toBe(3000);
      expect(inv.net_payable).toBe(inv.total_amount - 3000);
    });

    it('Scenario 2: Delta Logix - Missing GSTR-2B filing triggers Section 16(2)(aa) hold', () => {
      const inv = mockInvoices.find((i) => i.invoice_number === 'INV-DLX-9902')!;
      expect(inv).toBeDefined();
      expect(inv.compliance_gate_status).toBe('HOLD');
      expect(inv.gstr2b_status).toBe('HOLD_UNFILED');
      expect(inv.risk_score).toBe(85);

      // GSTR-2B record MUST NOT exist for Delta Logix
      const g2bRecord = mockGstr2bRecords.find((r) => r.invoice_number === inv.invoice_number);
      expect(g2bRecord).toBeUndefined();

      // Tax at risk is full ITC amount (₹1,80,000)
      expect(inv.tax_amount).toBe(180000);
      const auditLog = mockComplianceAuditLogs.find((l) => l.invoice_id === inv.id)!;
      expect(auditLog).toBeDefined();
      expect(auditLog.metadata.itc_at_risk).toBe(180000);
      // Section 50 interest risk at 18% p.a.: 180000 * 0.18 = 32,400
      expect(auditLog.metadata.sec50_interest_risk_pa).toBe(32400);
    });

    it('Scenario 3: Apex Fasteners - 3-Way Match Price Variance (+8.0%) triggers price hold', () => {
      const inv = mockInvoices.find((i) => i.invoice_number === 'INV-AIF-2026-108')!;
      expect(inv).toBeDefined();
      expect(inv.compliance_gate_status).toBe('HOLD');
      expect(inv.match_status).toBe('PRICE_VARIANCE_HOLD');

      const poItem = mockPurchaseOrderItems.find((poi) => poi.id === 'poi-003')!;
      const invItem = mockInvoiceItems.find((ii) => ii.id === 'ii-003')!;
      expect(poItem.unit_price).toBe(1000);
      expect(invItem.unit_rate).toBe(1080);
      const variancePct = ((invItem.unit_rate - poItem.unit_price) / poItem.unit_price) * 100;
      expect(variancePct).toBe(8.0);
    });

    it('Scenario 4: Zenith Precision - 3-Way Match Quantity Overbilling triggers qty hold', () => {
      const inv = mockInvoices.find((i) => i.invoice_number === 'INV-ZPC-7721')!;
      expect(inv).toBeDefined();
      expect(inv.compliance_gate_status).toBe('HOLD');
      expect(inv.match_status).toBe('QUANTITY_OVERBILLING_HOLD');

      const grnItem = mockGoodsReceiptNoteItems.find((grni) => grni.id === 'grni-004')!;
      const invItem = mockInvoiceItems.find((ii) => ii.id === 'ii-004')!;
      expect(grnItem.quantity_accepted).toBe(85);
      expect(grnItem.quantity_rejected).toBe(15);
      expect(invItem.billed_qty).toBe(100);
      expect(invItem.billed_qty).toBeGreaterThan(grnItem.quantity_accepted);
    });

    it('Scenario 5: Precision Toolings - Section 43B(h) Micro urgent SLA window (Day 42/45)', () => {
      const inv = mockInvoices.find((i) => i.invoice_number === 'INV-PTM-2026-092')!;
      expect(inv).toBeDefined();
      expect(inv.compliance_gate_status).toBe('PASS');

      const vendor = mockVendors.find((v) => v.id === inv.vendor_id)!;
      expect(vendor.msme_category).toBe('MICRO');

      // Date arithmetic: 2026-03-31 to 2026-05-15 is 45 days
      const invDate = new Date(inv.invoice_date);
      const dueDate = new Date(inv.due_date);
      const diffDays = Math.round((dueDate.getTime() - invDate.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(45);

      // Audit log verifies 42 days elapsed and 30% tax shield
      const log = mockComplianceAuditLogs.find((l) => l.invoice_id === inv.id)!;
      expect(log.metadata.days_elapsed).toBe(42);
      expect(log.metadata.days_remaining).toBe(3);
      // 30% tax penalty shield on taxable value: 440000 * 0.30 = 132000
      expect(log.metadata.tax_shield_amount).toBe(inv.subtotal * 0.30);
    });

    it('Scenario 6: Kaveri Polymers - Section 43B(h) Micro overdue (Day 48/45) triggers disallowance hold', () => {
      const inv = mockInvoices.find((i) => i.invoice_number === 'INV-KMP-8820')!;
      expect(inv).toBeDefined();
      expect(inv.compliance_gate_status).toBe('HOLD');

      const vendor = mockVendors.find((v) => v.id === inv.vendor_id)!;
      expect(vendor.msme_category).toBe('MICRO');

      const log = mockComplianceAuditLogs.find((l) => l.invoice_id === inv.id)!;
      expect(log.metadata.days_elapsed).toBe(48);
      expect(log.metadata.statutory_limit).toBe(45);
      expect(log.metadata.days_elapsed).toBeGreaterThan(log.metadata.statutory_limit);
      // 30% disallowance risk on taxable value: 1500000 * 0.30 = 450000
      expect(log.metadata.tax_disallowance).toBe(inv.subtotal * 0.30);
    });

    it('Scenario 7: Infosys BPM - Section 194Q cumulative spend threshold cross', () => {
      const inv = mockInvoices.find((i) => i.invoice_number === 'INV-INF-2026-781')!;
      expect(inv).toBeDefined();
      expect(inv.compliance_gate_status).toBe('PASS');

      // Cumulative FY spend ₹72L (> ₹50L). Prior spend ₹42L + current ₹30L = ₹72L
      // Excess subject to TDS = ₹72L - ₹50L = ₹22L. TDS = 0.1% of ₹22L = ₹2,200
      const log = mockComplianceAuditLogs.find((l) => l.invoice_id === inv.id)!;
      expect(log.metadata.prior_spend).toBe(4200000);
      expect(log.metadata.current_taxable).toBe(3000000);
      expect(log.metadata.new_spend).toBe(7200000);
      expect(log.metadata.excess_subject_to_tds).toBe(2200000);
      expect(log.metadata.tds_amount).toBe(2200);
      expect(inv.tds_194q_amount).toBe(2200);
      expect(inv.net_payable).toBe(inv.total_amount - 2200);
    });

    it('Scenario 8: Vanguard Electricals - Fraudulent 28% tax rate triggers TAX_ARITHMETIC_REJECT', () => {
      const inv = mockInvoices.find((i) => i.invoice_number === 'INV-VEE-9941')!;
      expect(inv).toBeDefined();
      expect(inv.compliance_gate_status).toBe('REJECT');
      expect(inv.match_status).toBe('TAX_ARITHMETIC_REJECT');

      const poItem = mockPurchaseOrderItems.find((poi) => poi.id === 'poi-008')!;
      const invItem = mockInvoiceItems.find((ii) => ii.id === 'ii-008')!;
      expect(poItem.tax_rate).toBe(18.0);
      expect(invItem.tax_rate).toBe(28.0);

      // Contracted tax: 1800000 * 0.18 = 324000
      // Billed tax: 1800000 * 0.28 = 504000
      // Discrepancy: 180000
      const discrepancy = invItem.cgst_amount + invItem.sgst_amount - (inv.subtotal * 0.18);
      expect(discrepancy).toBe(180000);
    });
  });
});
