/**
 * VetoRail Enterprise Accounts Payable (AP) & Statutory Compliance Rail
 * Unified TypeScript Domain Model & Interface Definitions
 * File: src/lib/types/index.ts
 */

// ==============================================================================
// 1. Core Statutory & AP Enums / String Literals
// ==============================================================================

/**
 * MSME Enterprise Classification under MSMED Act 2006.
 * Section 43B(h) applies strictly to MICRO and SMALL enterprises.
 * MEDIUM enterprises and TRADERS are exempt from the 45-day disallowance rule.
 */
export type MsmeCategory = 'MICRO' | 'SMALL' | 'MEDIUM' | 'NOT_MSME' | 'TRADER';

/**
 * Purchase Order Lifecycle Status
 */
export type PoStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'CANCELLED';

/**
 * Goods Receipt Note Inspection Status
 */
export type GrnStatus = 'PENDING_INSPECTION' | 'ACCEPTED' | 'PARTIALLY_ACCEPTED' | 'REJECTED';

/**
 * VetoRail Autonomous Gate Payment Decision
 */
export type ComplianceGateStatus = 'PASS' | 'HOLD' | 'REJECT';
export type GateStatus = ComplianceGateStatus;

/**
 * Overall 3-Way Matching Engine Verdict across PO vs GRN vs Invoice
 */
export type ThreeWayMatchStatus =
  | 'EXACT_MATCH'
  | 'PRICE_VARIANCE_HOLD'
  | 'QUANTITY_OVERBILLING_HOLD'
  | 'MISSING_GRN_HOLD'
  | 'TAX_ARITHMETIC_REJECT';

/**
 * Line-Item Granular Match Status
 */
export type LineItemMatchStatus =
  | 'MATCH'
  | 'PRICE_VARIANCE'
  | 'QTY_OVERBILLING'
  | 'TAX_MISMATCH';

/**
 * GSTR-2B Statutory Compliance Gate Status (Section 16(2)(aa) & Rule 36(4))
 */
export type Gstr2bStatus =
  | 'PASS_2B'
  | 'HOLD_UNFILED'
  | 'HOLD_VALUE_MISMATCH'
  | 'HOLD_RCM_MISMATCH'
  | 'INELIGIBLE_17_5';

/**
 * Input Tax Credit (ITC) Statutory Eligibility Flag in GSTR-2B
 */
export type ItcEligibility = 'ELIGIBLE' | 'INELIGIBLE_17_5' | 'PENDING_GSTR1';

/**
 * GST Return Document Type
 */
export type Gstr2bInvoiceType = 'B2B' | 'B2BA' | 'CDNR' | 'CDNRA' | 'ISD';

/**
 * Cryptographic & Auditable Event Types for Compliance Log
 */
export type AuditEventType =
  | 'INVOICE_INGESTED'
  | '3_WAY_MATCH_COMPLETED'
  | 'GSTR2B_VERIFICATION'
  | 'TDS_194Q_CALCULATED'
  | 'MSME_43BH_EVALUATED'
  | 'GATE_STATUS_CHANGED'
  | 'GATE_EVALUATION'
  | 'COMPLIANCE_HOLD'
  | 'PRICE_VARIANCE_HOLD'
  | 'QTY_OVERBILLING_HOLD'
  | 'MSME_SLA_FAST_TRACK'
  | 'MSME_STATUTORY_BREACH'
  | 'TDS_194Q_DEDUCTION'
  | 'GATE_REJECTION'
  | 'GATE_MANUAL_PASS'
  | 'GATE_MANUAL_HOLD'
  | 'GATE_MANUAL_REJECT'
  | 'GSTR2B_SIMULATED_SYNC'
  | 'MANUAL_OVERRIDE'
  | 'VENDOR_NOTIFIED'
  | 'PAYMENT_RELEASED'
  | 'PAYMENT_GATED_HOLD'
  | 'PAYMENT_REJECTED';

/**
 * Section 43B(h) SLA Urgency Tiers
 */
export type UrgencyTier = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED_OVERDUE' | 'NOT_APPLICABLE';

/**
 * AP Queue Tab Filter
 */
export type ApQueueFilterTab = 'ALL' | 'PASS' | 'HOLD' | 'REJECT';

/**
 * Risk Assessment Tier
 */
export type RiskTier = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';


// ==============================================================================
// 2. Database Entity Interfaces (1:1 with Supabase PostgreSQL Schema)
// ==============================================================================

/**
 * Supplier / Vendor Profile
 */
export interface Vendor {
  id: string;
  name: string;
  gstin: string;
  pan: string;
  msme_category: MsmeCategory;
  msme_reg_number?: string | null;
  agreement_days: number;
  compliance_score: number; // 0.00 to 100.00
  fy_spend: number;         // Cumulative FY spend for Section 194Q
  bank_account?: string | null;
  ifsc_code?: string | null;
  created_at: string;
  updated_at?: string;
}

/**
 * Purchase Order Entity
 */
export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  po_date: string;
  total_amount: number;
  currency: string;
  status: PoStatus;
  created_at: string;
  updated_at?: string;
}

/**
 * Purchase Order Line Item
 */
export interface PurchaseOrderItem {
  id: string;
  po_id: string;
  line_number: number;
  item_sku: string;
  description: string;
  hsn_sac: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total_amount: number;
  created_at: string;
}

/**
 * Goods Receipt Note (GRN)
 */
export interface GoodsReceiptNote {
  id: string;
  grn_number: string;
  po_id: string;
  grn_date: string;
  received_by: string;
  remarks?: string | null;
  status: GrnStatus;
  created_at: string;
  updated_at?: string;
}

/**
 * Goods Receipt Note Line Item
 */
export interface GoodsReceiptNoteItem {
  id: string;
  grn_id: string;
  po_item_id?: string | null;
  item_sku: string;
  quantity_received: number;
  quantity_accepted: number;
  quantity_rejected: number;
  remarks?: string | null;
  created_at: string;
}

/**
 * Tax Invoice Ingested into AP Rail
 */
export interface Invoice {
  id: string;
  invoice_number: string;
  vendor_id: string;
  po_id?: string | null;
  grn_id?: string | null;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  tds_194q_amount: number;
  net_payable: number;
  match_status: ThreeWayMatchStatus;
  gstr2b_status: Gstr2bStatus;
  compliance_gate_status: ComplianceGateStatus;
  risk_score: number; // 0 to 100
  created_at: string;
  updated_at?: string;
}

/**
 * Tax Invoice Line Item
 */
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  po_item_id?: string | null;
  item_sku: string;
  description: string;
  hsn_sac: string;
  billed_qty: number;
  unit_rate: number;
  tax_rate: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_amount: number;
  created_at: string;
}

/**
 * GSTR-2B Statement Record (Simulated or Live GSTN GSP API)
 */
export interface Gstr2bRecord {
  id: string;
  vendor_gstin: string;
  invoice_number: string;
  invoice_date: string;
  invoice_type: Gstr2bInvoiceType;
  taxable_value: number;
  igst: number;
  cgst: number;
  sgst: number;
  filing_date?: string | null;
  gstr2b_period: string; // e.g. "042026" or "2024-04"
  itc_eligibility: ItcEligibility;
  is_rcm: boolean;
  created_at?: string;
}

/**
 * Compliance Audit Trail Log
 */
export interface ComplianceAuditLog {
  id: string;
  invoice_id: string;
  event_type: AuditEventType | string;
  actor: string;
  previous_status?: string | null;
  new_status: string;
  reason: string;
  metadata: Record<string, unknown>;
  created_at: string;
}


// ==============================================================================
// 3. Statutory Engine Computation Contracts (F5, F6, F7, F8, F9)
// ==============================================================================

/**
 * F5: Line Item Discrepancy Matching Output
 */
export interface LineItemMatchResult {
  poItemId: string;
  itemSku: string;
  orderedQty: number;
  acceptedQty: number;
  billedQty: number;
  poUnitRate: number;
  billedUnitRate: number;
  qtyDiscrepancy: number;   // billedQty - acceptedQty
  rateDiscrepancy: number;  // billedUnitRate - poUnitRate
  rateDiscrepancyPct: number;
  taxDiscrepancy: number;
  status: LineItemMatchStatus;
}

/**
 * F5: 3-Way Match Summary Result
 */
export interface ThreeWayMatchSummary {
  invoiceId: string;
  overallStatus: ThreeWayMatchStatus;
  lineResults: LineItemMatchResult[];
  totalVarianceAmount: number;
  canAutoRelease: boolean;
}

/**
 * F6: GSTR-2B Section 16(2)(aa) Verification Output
 */
export interface Gstr2bMatchResult {
  invoiceId: string;
  vendorGstin: string;
  invoiceNumber: string;
  isFoundIn2B: boolean;
  isFilingPeriodValid: boolean;
  valueMismatchAmount: number;
  taxSplitValid: boolean;
  isRcmValid: boolean;
  is17_5_Blocked: boolean;
  gateVerdict: Gstr2bStatus;
  potentialSec50InterestRisk: number; // 18% p.a.
}

/**
 * F7: Section 194Q TDS Deduction Engine Output
 */
export interface Tds194qResult {
  vendorId: string;
  priorFySpend: number;
  currentInvoiceTaxable: number;
  newCumulativeSpend: number;
  thresholdExceeded: boolean;
  taxableSubjectToTds: number;
  tdsRate: number; // 0.001 (0.1%) or 0.05 (5.0% under Sec 206AA)
  tdsAmount: number;
  grossInvoiceAmount: number;
  netPayableAmount: number;
}

/**
 * F8: Section 43B(h) MSME Countdown & Disallowance Output
 */
export interface Msme43bhStatus {
  vendorId: string;
  msmeCategory: MsmeCategory;
  isApplicable: boolean; // false for MEDIUM and TRADER
  maxDaysAllowed: number; // 15 or 45
  daysElapsed: number;
  daysRemaining: number;
  urgencyTier: UrgencyTier;
  disallowanceRiskAmount: number; // 30% of taxable invoice amount
  penalInterestRate: number;       // 20.25% p.a. (3x RBI repo/bank rate)
}

/**
 * F9: ROI Financial Calculator Input & Output
 */
export interface RoiCalculationInput {
  monthlySpendINR: number;
  monthlyInvoiceCount: number;
  msmeSupplierPct: number; // percentage (0 - 100)
  unfiledSupplierRatePct?: number; // default ~4.5%
}

export interface RoiCalculationResult {
  annualSpendINR: number;
  itcSavedAnnualINR: number;
  workingCapitalProtectedINR: number;
  sec50InterestAvoidedINR: number;
  msmePenaltiesShieldedINR: number;
  totalAnnualBenefitINR: number;
  roiMultiplier: number;
  paybackMonths: number;
}


// ==============================================================================
// 4. Joined & Enriched View Types for Enterprise UI
// ==============================================================================

/**
 * Complete Invoices View with all relational joins and statutory computations
 */
export interface InvoiceWithDetails extends Invoice {
  vendor?: Vendor;
  po?: PurchaseOrder;
  grn?: GoodsReceiptNote;
  items: InvoiceItem[];
  poItems?: PurchaseOrderItem[];
  grnItems?: GoodsReceiptNoteItem[];
  gstr2bRecord?: Gstr2bRecord;
  msmeUrgency?: UrgencyTier;
  daysElapsed?: number;
  daysRemaining?: number;
  matchSummary?: ThreeWayMatchSummary;
  gstr2bMatch?: Gstr2bMatchResult;
  tds194q?: Tds194qResult;
  msmeStatus?: Msme43bhStatus;
  auditLogs?: ComplianceAuditLog[];
}

export type InvoiceWithRelations = InvoiceWithDetails;

/**
 * Dashboard & CFO Executive Metrics
 */
export interface DashboardMetrics {
  totalSpend: number;
  totalPassedAmount: number;
  totalHeldAmount: number;
  totalRejectedAmount: number;
  itcProtected: number;
  msmeOverdueRisk: number;
  leakagePrevented: number;
  totalInvoicesCount: number;
  passedCount: number;
  heldCount: number;
  rejectedCount: number;
}

/**
 * Vendor with AP metrics and active compliance standings
 */
export interface VendorWithMetrics extends Vendor {
  totalInvoicesCount: number;
  openInvoicesCount: number;
  heldInvoicesCount: number;
  totalSpendValue: number;
  msmeDaysRemaining?: number;
  msmeUrgencyTier?: UrgencyTier;
}

/**
 * Purchase Order with line items and vendor information
 */
export interface PurchaseOrderWithItems extends PurchaseOrder {
  items: PurchaseOrderItem[];
  vendor?: Vendor;
}

/**
 * Goods Receipt Note with inspected line items and parent PO
 */
export interface GoodsReceiptNoteWithItems extends GoodsReceiptNote {
  items: GoodsReceiptNoteItem[];
  purchaseOrder?: PurchaseOrder;
}


// ==============================================================================
// 5. AP Queue Filter & Action Payloads
// ==============================================================================

export interface ApQueueFilters {
  tab: ApQueueFilterTab;
  searchQuery: string;
  vendorId?: string;
  riskTier?: RiskTier;
  msmeUrgency?: UrgencyTier | 'ALL';
  sortBy?: 'due_date' | 'total_amount' | 'risk_score' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface GateActionPayload {
  invoiceId: string;
  newStatus: ComplianceGateStatus;
  actor: string;
  reason: string;
  metadata?: Record<string, unknown>;
}

export interface ManualOverridePayload {
  invoiceId: string;
  action: ComplianceGateStatus;
  overrideReason: string;
  authorizedBy: string;
  notes?: string;
  waiveTaxLossConfirmed: boolean;
}


// ==============================================================================
// 6. Dual-Mode AP Data Provider Context Contract
// ==============================================================================

export interface APDataContextType {
  isSupabaseConnected: boolean;
  isLoading: boolean;
  invoices: InvoiceWithDetails[];
  vendors: Vendor[];
  gstr2bRecords: Gstr2bRecord[];
  auditLogs: ComplianceAuditLog[];
  metrics: DashboardMetrics;

  // Actions
  getInvoices: () => InvoiceWithDetails[];
  getInvoiceById: (id: string) => InvoiceWithDetails | undefined;
  updateInvoiceStatus: (
    id: string,
    newStatus: ComplianceGateStatus,
    reason: string,
    actor?: string
  ) => Promise<boolean>;
  getVendors: () => Vendor[];
  getVendorById: (id: string) => Vendor | undefined;
  getAuditLogs: (invoiceId?: string) => ComplianceAuditLog[];
  getGstr2bRecords: () => Gstr2bRecord[];
  simulateGstr2bSync: (vendorGstin: string, invoiceNumber: string) => Promise<boolean>;
  resetToDefault: () => void;
}


// ==============================================================================
// 7. Supabase Database Client Generic Type Definitions
// ==============================================================================

export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: Vendor;
        Insert: Omit<Vendor, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Vendor, 'id'>>;
      };
      purchase_orders: {
        Row: PurchaseOrder;
        Insert: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<PurchaseOrder, 'id'>>;
      };
      purchase_order_items: {
        Row: PurchaseOrderItem;
        Insert: Omit<PurchaseOrderItem, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<PurchaseOrderItem, 'id'>>;
      };
      goods_receipt_notes: {
        Row: GoodsReceiptNote;
        Insert: Omit<GoodsReceiptNote, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<GoodsReceiptNote, 'id'>>;
      };
      goods_receipt_note_items: {
        Row: GoodsReceiptNoteItem;
        Insert: Omit<GoodsReceiptNoteItem, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GoodsReceiptNoteItem, 'id'>>;
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Invoice, 'id'>>;
      };
      invoice_items: {
        Row: InvoiceItem;
        Insert: Omit<InvoiceItem, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<InvoiceItem, 'id'>>;
      };
      gstr2b_records: {
        Row: Gstr2bRecord;
        Insert: Omit<Gstr2bRecord, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Gstr2bRecord, 'id'>>;
      };
      compliance_audit_logs: {
        Row: ComplianceAuditLog;
        Insert: Omit<ComplianceAuditLog, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ComplianceAuditLog, 'id'>>;
      };
    };
  };
}
