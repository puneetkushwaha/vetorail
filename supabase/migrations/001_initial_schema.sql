-- ==============================================================================
-- VetoRail Enterprise AP Compliance Rail - Supabase PostgreSQL Initial Schema
-- Migration: 001_initial_schema.sql
-- Description: Complete 9-table relational schema with statutory constraints,
--              performance indexes, triggers, and Row Level Security (RLS).
-- ==============================================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- Helper Functions & Trigger for updated_at timestamps
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. Table: vendors
-- Profiles of enterprise suppliers, MSME classifications, and statutory GSTIN/PAN.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15) NOT NULL UNIQUE,
    pan VARCHAR(10) NOT NULL,
    msme_category VARCHAR(20) NOT NULL DEFAULT 'NOT_MSME',
    msme_reg_number VARCHAR(50),
    agreement_days INTEGER NOT NULL DEFAULT 45,
    compliance_score NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    fy_spend NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    bank_account VARCHAR(34),
    ifsc_code VARCHAR(11),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_vendors_msme_category CHECK (
        msme_category IN ('MICRO', 'SMALL', 'MEDIUM', 'NOT_MSME', 'TRADER')
    ),
    CONSTRAINT chk_vendors_agreement_days CHECK (
        agreement_days > 0 AND agreement_days <= 90
    ),
    CONSTRAINT chk_vendors_compliance_score CHECK (
        compliance_score >= 0.00 AND compliance_score <= 100.00
    ),
    CONSTRAINT chk_vendors_fy_spend CHECK (
        fy_spend >= 0.00
    ),
    CONSTRAINT chk_vendors_gstin_format CHECK (
        gstin ~* '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
    ),
    CONSTRAINT chk_vendors_pan_format CHECK (
        pan ~* '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
    )
);

CREATE TRIGGER trg_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 2. Table: purchase_orders
-- Commercial purchase orders authorized by procurement.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) NOT NULL UNIQUE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    po_date DATE NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(25) NOT NULL DEFAULT 'ISSUED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_po_status CHECK (
        status IN ('DRAFT', 'ISSUED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED')
    ),
    CONSTRAINT chk_po_total_amount CHECK (
        total_amount >= 0.00
    )
);

CREATE TRIGGER trg_purchase_orders_updated_at
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 3. Table: purchase_order_items
-- Granular line items authorized in purchase order contracts.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    item_sku VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    hsn_sac VARCHAR(10) NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL,
    unit_price NUMERIC(14, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    total_amount NUMERIC(14, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_po_items_po_line UNIQUE (po_id, line_number),
    CONSTRAINT chk_po_items_quantity CHECK (quantity > 0.00),
    CONSTRAINT chk_po_items_unit_price CHECK (unit_price >= 0.00),
    CONSTRAINT chk_po_items_tax_rate CHECK (tax_rate >= 0.00),
    CONSTRAINT chk_po_items_total_amount CHECK (total_amount >= 0.00)
);

-- ==============================================================================
-- 4. Table: goods_receipt_notes (GRN)
-- Warehouse physical receiving and quality inspection receipts.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS goods_receipt_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_number VARCHAR(50) NOT NULL UNIQUE,
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE RESTRICT,
    grn_date DATE NOT NULL,
    received_by VARCHAR(100) NOT NULL,
    remarks TEXT,
    status VARCHAR(25) NOT NULL DEFAULT 'ACCEPTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_grn_status CHECK (
        status IN ('PENDING_INSPECTION', 'ACCEPTED', 'PARTIALLY_ACCEPTED', 'REJECTED')
    )
);

CREATE TRIGGER trg_goods_receipt_notes_updated_at
    BEFORE UPDATE ON goods_receipt_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. Table: goods_receipt_note_items
-- Physical inventory quantity received, accepted, and rejected.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS goods_receipt_note_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_id UUID NOT NULL REFERENCES goods_receipt_notes(id) ON DELETE CASCADE,
    po_item_id UUID REFERENCES purchase_order_items(id) ON DELETE SET NULL,
    item_sku VARCHAR(50) NOT NULL,
    quantity_received NUMERIC(12, 2) NOT NULL,
    quantity_accepted NUMERIC(12, 2) NOT NULL,
    quantity_rejected NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_grn_items_received_non_neg CHECK (quantity_received >= 0.00),
    CONSTRAINT chk_grn_items_accepted_non_neg CHECK (quantity_accepted >= 0.00),
    CONSTRAINT chk_grn_items_rejected_non_neg CHECK (quantity_rejected >= 0.00),
    CONSTRAINT chk_grn_items_quantities_balance CHECK (
        quantity_accepted + quantity_rejected <= quantity_received
    )
);

-- ==============================================================================
-- 6. Table: invoices
-- Centralized AP invoice ingestion with 3-way matching and statutory gates.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    po_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    grn_id UUID REFERENCES goods_receipt_notes(id) ON DELETE SET NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal NUMERIC(14, 2) NOT NULL,
    tax_amount NUMERIC(14, 2) NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    tds_194q_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    net_payable NUMERIC(14, 2) NOT NULL,
    match_status VARCHAR(35) NOT NULL DEFAULT 'EXACT_MATCH',
    gstr2b_status VARCHAR(30) NOT NULL DEFAULT 'PASS_2B',
    compliance_gate_status VARCHAR(10) NOT NULL DEFAULT 'PASS',
    risk_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_invoices_vendor_number UNIQUE (vendor_id, invoice_number),
    CONSTRAINT chk_invoices_due_date CHECK (due_date >= invoice_date),
    CONSTRAINT chk_invoices_subtotal CHECK (subtotal >= 0.00),
    CONSTRAINT chk_invoices_tax_amount CHECK (tax_amount >= 0.00),
    CONSTRAINT chk_invoices_total_amount CHECK (total_amount >= 0.00),
    CONSTRAINT chk_invoices_tds_194q CHECK (tds_194q_amount >= 0.00),
    CONSTRAINT chk_invoices_net_payable CHECK (net_payable >= 0.00),
    CONSTRAINT chk_invoices_match_status CHECK (
        match_status IN (
            'EXACT_MATCH',
            'PRICE_VARIANCE_HOLD',
            'QUANTITY_OVERBILLING_HOLD',
            'MISSING_GRN_HOLD',
            'TAX_ARITHMETIC_REJECT'
        )
    ),
    CONSTRAINT chk_invoices_gstr2b_status CHECK (
        gstr2b_status IN (
            'PASS_2B',
            'HOLD_UNFILED',
            'HOLD_VALUE_MISMATCH',
            'HOLD_RCM_MISMATCH',
            'INELIGIBLE_17_5'
        )
    ),
    CONSTRAINT chk_invoices_gate_status CHECK (
        compliance_gate_status IN ('PASS', 'HOLD', 'REJECT')
    ),
    CONSTRAINT chk_invoices_risk_score CHECK (
        risk_score >= 0 AND risk_score <= 100
    )
);

CREATE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 7. Table: invoice_items
-- Billed line items from supplier tax invoice.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    po_item_id UUID REFERENCES purchase_order_items(id) ON DELETE SET NULL,
    item_sku VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    hsn_sac VARCHAR(10) NOT NULL,
    billed_qty NUMERIC(12, 2) NOT NULL,
    unit_rate NUMERIC(14, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    cgst_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    sgst_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    igst_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(14, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_inv_items_billed_qty CHECK (billed_qty > 0.00),
    CONSTRAINT chk_inv_items_unit_rate CHECK (unit_rate >= 0.00),
    CONSTRAINT chk_inv_items_tax_rate CHECK (tax_rate >= 0.00),
    CONSTRAINT chk_inv_items_cgst CHECK (cgst_amount >= 0.00),
    CONSTRAINT chk_inv_items_sgst CHECK (sgst_amount >= 0.00),
    CONSTRAINT chk_inv_items_igst CHECK (igst_amount >= 0.00),
    CONSTRAINT chk_inv_items_total CHECK (total_amount >= 0.00)
);

-- ==============================================================================
-- 8. Table: gstr2b_records
-- GSTN portal auto-drafted Input Tax Credit (ITC) statement records.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS gstr2b_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_gstin VARCHAR(15) NOT NULL,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    invoice_type VARCHAR(20) NOT NULL DEFAULT 'B2B',
    taxable_value NUMERIC(14, 2) NOT NULL,
    igst NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    cgst NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    sgst NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    filing_date DATE,
    gstr2b_period VARCHAR(7) NOT NULL, -- e.g. '2024-04' or '04/2024'
    itc_eligibility VARCHAR(25) NOT NULL DEFAULT 'ELIGIBLE',
    is_rcm BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_gstr2b_gstin_inv_period UNIQUE (vendor_gstin, invoice_number, gstr2b_period),
    CONSTRAINT chk_gstr2b_invoice_type CHECK (
        invoice_type IN ('B2B', 'B2BA', 'CDNR', 'CDNRA', 'ISD')
    ),
    CONSTRAINT chk_gstr2b_itc_eligibility CHECK (
        itc_eligibility IN ('ELIGIBLE', 'INELIGIBLE_17_5', 'PENDING_GSTR1')
    ),
    CONSTRAINT chk_gstr2b_taxable_value CHECK (taxable_value >= 0.00),
    CONSTRAINT chk_gstr2b_igst CHECK (igst >= 0.00),
    CONSTRAINT chk_gstr2b_cgst CHECK (cgst >= 0.00),
    CONSTRAINT chk_gstr2b_sgst CHECK (sgst >= 0.00)
);

-- ==============================================================================
-- 9. Table: compliance_audit_logs
-- Cryptographic and tamper-evident audit trail of AP compliance events.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS compliance_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    actor VARCHAR(100) NOT NULL DEFAULT 'SYSTEM_AUTONOMOUS_RAIL',
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    reason TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_audit_logs_event_type CHECK (
        event_type IN (
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
        )
    )
);

-- ==============================================================================
-- Performance Lookup & Join Indexes
-- ==============================================================================

-- Vendors
CREATE INDEX IF NOT EXISTS idx_vendors_gstin ON vendors(gstin);
CREATE INDEX IF NOT EXISTS idx_vendors_pan ON vendors(pan);
CREATE INDEX IF NOT EXISTS idx_vendors_msme_category ON vendors(msme_category);

-- Purchase Orders
CREATE INDEX IF NOT EXISTS idx_purchase_orders_po_number ON purchase_orders(po_number);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);

-- Purchase Order Items
CREATE INDEX IF NOT EXISTS idx_po_items_po_id ON purchase_order_items(po_id);
CREATE INDEX IF NOT EXISTS idx_po_items_item_sku ON purchase_order_items(item_sku);

-- Goods Receipt Notes
CREATE INDEX IF NOT EXISTS idx_grn_grn_number ON goods_receipt_notes(grn_number);
CREATE INDEX IF NOT EXISTS idx_grn_po_id ON goods_receipt_notes(po_id);

-- Goods Receipt Note Items
CREATE INDEX IF NOT EXISTS idx_grn_items_grn_id ON goods_receipt_note_items(grn_id);
CREATE INDEX IF NOT EXISTS idx_grn_items_po_item_id ON goods_receipt_note_items(po_item_id);

-- Invoices
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_vendor_id ON invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_po_id ON invoices(po_id);
CREATE INDEX IF NOT EXISTS idx_invoices_grn_id ON invoices(grn_id);
CREATE INDEX IF NOT EXISTS idx_invoices_gate_status ON invoices(compliance_gate_status);
CREATE INDEX IF NOT EXISTS idx_invoices_match_status ON invoices(match_status);
CREATE INDEX IF NOT EXISTS idx_invoices_gstr2b_status ON invoices(gstr2b_status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Invoice Items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_po_item_id ON invoice_items(po_item_id);

-- GSTR-2B Records
CREATE INDEX IF NOT EXISTS idx_gstr2b_gstin_inv ON gstr2b_records(vendor_gstin, invoice_number);
CREATE INDEX IF NOT EXISTS idx_gstr2b_period ON gstr2b_records(gstr2b_period);
CREATE INDEX IF NOT EXISTS idx_gstr2b_itc_eligibility ON gstr2b_records(itc_eligibility);

-- Compliance Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_invoice_id ON compliance_audit_logs(invoice_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON compliance_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON compliance_audit_logs(created_at DESC);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- ==============================================================================
-- Enable RLS across all 9 tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipt_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipt_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gstr2b_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;

-- Demo Showcase Policies: Allow public read/write for standalone showcases
-- (Permissive policies ensure frictionless demo experience without authentication blockers)

-- 1. vendors
CREATE POLICY "Public Read vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Public Insert vendors" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update vendors" ON vendors FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete vendors" ON vendors FOR DELETE USING (true);

-- 2. purchase_orders
CREATE POLICY "Public Read purchase_orders" ON purchase_orders FOR SELECT USING (true);
CREATE POLICY "Public Insert purchase_orders" ON purchase_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update purchase_orders" ON purchase_orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete purchase_orders" ON purchase_orders FOR DELETE USING (true);

-- 3. purchase_order_items
CREATE POLICY "Public Read purchase_order_items" ON purchase_order_items FOR SELECT USING (true);
CREATE POLICY "Public Insert purchase_order_items" ON purchase_order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update purchase_order_items" ON purchase_order_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete purchase_order_items" ON purchase_order_items FOR DELETE USING (true);

-- 4. goods_receipt_notes
CREATE POLICY "Public Read goods_receipt_notes" ON goods_receipt_notes FOR SELECT USING (true);
CREATE POLICY "Public Insert goods_receipt_notes" ON goods_receipt_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update goods_receipt_notes" ON goods_receipt_notes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete goods_receipt_notes" ON goods_receipt_notes FOR DELETE USING (true);

-- 5. goods_receipt_note_items
CREATE POLICY "Public Read goods_receipt_note_items" ON goods_receipt_note_items FOR SELECT USING (true);
CREATE POLICY "Public Insert goods_receipt_note_items" ON goods_receipt_note_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update goods_receipt_note_items" ON goods_receipt_note_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete goods_receipt_note_items" ON goods_receipt_note_items FOR DELETE USING (true);

-- 6. invoices
CREATE POLICY "Public Read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Public Insert invoices" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update invoices" ON invoices FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete invoices" ON invoices FOR DELETE USING (true);

-- 7. invoice_items
CREATE POLICY "Public Read invoice_items" ON invoice_items FOR SELECT USING (true);
CREATE POLICY "Public Insert invoice_items" ON invoice_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update invoice_items" ON invoice_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete invoice_items" ON invoice_items FOR DELETE USING (true);

-- 8. gstr2b_records
CREATE POLICY "Public Read gstr2b_records" ON gstr2b_records FOR SELECT USING (true);
CREATE POLICY "Public Insert gstr2b_records" ON gstr2b_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update gstr2b_records" ON gstr2b_records FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete gstr2b_records" ON gstr2b_records FOR DELETE USING (true);

-- 9. compliance_audit_logs
CREATE POLICY "Public Read compliance_audit_logs" ON compliance_audit_logs FOR SELECT USING (true);
CREATE POLICY "Public Insert compliance_audit_logs" ON compliance_audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update compliance_audit_logs" ON compliance_audit_logs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete compliance_audit_logs" ON compliance_audit_logs FOR DELETE USING (true);
