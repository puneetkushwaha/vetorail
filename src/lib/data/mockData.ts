import {
  Vendor,
  PurchaseOrder,
  PurchaseOrderItem,
  GoodsReceiptNote,
  GoodsReceiptNoteItem,
  Invoice,
  InvoiceItem,
  Gstr2bRecord,
  ComplianceAuditLog
} from '../types';

// ==========================================
// 1. MOCK VENDORS (8 Canonical Entities)
// ==========================================
export const mockVendors: Vendor[] = [
  {
    id: 'ven-001',
    name: 'Tata Steel Limited',
    gstin: '27AAACT2727Q1ZW',
    pan: 'AAACT2727Q',
    msme_category: 'NOT_MSME',
    msme_reg_number: null,
    agreement_days: 60,
    compliance_score: 99,
    fy_spend: 10500000, // ₹75L prior + ₹30L current
    bank_account: '918237461928',
    ifsc_code: 'HDFC0000060',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ven-002',
    name: 'Delta Logix Supply Chain Solutions Pvt Ltd',
    gstin: '29AADCD8832L1ZS',
    pan: 'AADCD8832L',
    msme_category: 'MEDIUM',
    msme_reg_number: 'UDYAM-KR-03-0018274',
    agreement_days: 45,
    compliance_score: 68,
    fy_spend: 3200000,
    bank_account: '002918273645',
    ifsc_code: 'ICIC0000104',
    created_at: '2026-01-15T00:00:00Z'
  },
  {
    id: 'ven-003',
    name: 'Apex Industrial Fasteners LLP',
    gstin: '27AAQFA4412K1Z9',
    pan: 'AAQFA4412K',
    msme_category: 'SMALL',
    msme_reg_number: 'UDYAM-MH-02-0049182',
    agreement_days: 45,
    compliance_score: 74,
    fy_spend: 6600000,
    bank_account: '50200019283746',
    ifsc_code: 'HDFC0000240',
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'ven-004',
    name: 'Zenith Precision Components Pvt Ltd',
    gstin: '27AABCZ1904P1Z2',
    pan: 'AABCZ1904P',
    msme_category: 'SMALL',
    msme_reg_number: 'UDYAM-MH-01-0072134',
    agreement_days: 45,
    compliance_score: 81,
    fy_spend: 3050000,
    bank_account: '31829384756',
    ifsc_code: 'SBIN0001423',
    created_at: '2026-02-10T00:00:00Z'
  },
  {
    id: 'ven-005',
    name: 'Precision Toolings Micro Ltd',
    gstin: '27AABCP5501B1ZM',
    pan: 'AABCP5501B',
    msme_category: 'MICRO',
    msme_reg_number: 'UDYAM-MH-01-0088192',
    agreement_days: 45,
    compliance_score: 96,
    fy_spend: 1290000,
    bank_account: '109283746501',
    ifsc_code: 'KKBK0000651',
    created_at: '2026-02-20T00:00:00Z'
  },
  {
    id: 'ven-006',
    name: 'Kaveri Micro Polymers LLP',
    gstin: '33AABCK3311E1Z6',
    pan: 'AABCK3311E',
    msme_category: 'MICRO',
    msme_reg_number: 'UDYAM-TN-03-0044910',
    agreement_days: 45,
    compliance_score: 92,
    fy_spend: 2920000,
    bank_account: '293847561029',
    ifsc_code: 'IOBA0001920',
    created_at: '2026-03-01T00:00:00Z'
  },
  {
    id: 'ven-007',
    name: 'Infosys BPM Limited',
    gstin: '29AAACI4322H1ZN',
    pan: 'AAACI4322H',
    msme_category: 'NOT_MSME',
    msme_reg_number: null,
    agreement_days: 45,
    compliance_score: 99,
    fy_spend: 7200000, // ₹42L prior + ₹30L current = ₹72L (> ₹50L)
    bank_account: '000205001928',
    ifsc_code: 'ICIC0000002',
    created_at: '2026-01-05T00:00:00Z'
  },
  {
    id: 'ven-008',
    name: 'Vanguard Electricals & Engineering Pvt Ltd',
    gstin: '27AAECV7710R1ZA',
    pan: 'AAECV7710R',
    msme_category: 'MEDIUM',
    msme_reg_number: 'UDYAM-MH-03-0029104',
    agreement_days: 45,
    compliance_score: 52,
    fy_spend: 5300000,
    bank_account: '992817263541',
    ifsc_code: 'BARB0NARIMA',
    created_at: '2026-02-15T00:00:00Z'
  }
];

// ==========================================
// 2. MOCK PURCHASE ORDERS & ITEMS
// ==========================================
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    po_number: 'PO-2026-001',
    vendor_id: 'ven-001',
    po_date: '2026-04-02',
    total_amount: 3540000,
    currency: 'INR',
    status: 'FULFILLED',
    created_at: '2026-04-02T09:00:00Z'
  },
  {
    id: 'po-002',
    po_number: 'PO-2026-002',
    vendor_id: 'ven-002',
    po_date: '2026-04-10',
    total_amount: 1180000,
    currency: 'INR',
    status: 'FULFILLED',
    created_at: '2026-04-10T11:00:00Z'
  },
  {
    id: 'po-003',
    po_number: 'PO-2026-003',
    vendor_id: 'ven-003',
    po_date: '2026-04-12',
    total_amount: 5900000,
    currency: 'INR',
    status: 'FULFILLED',
    created_at: '2026-04-12T10:30:00Z'
  },
  {
    id: 'po-004',
    po_number: 'PO-2026-004',
    vendor_id: 'ven-004',
    po_date: '2026-04-15',
    total_amount: 1416000,
    currency: 'INR',
    status: 'PARTIALLY_FULFILLED',
    created_at: '2026-04-15T14:00:00Z'
  },
  {
    id: 'po-005',
    po_number: 'PO-2026-005',
    vendor_id: 'ven-005',
    po_date: '2026-03-28',
    total_amount: 519200,
    currency: 'INR',
    status: 'FULFILLED',
    created_at: '2026-03-28T09:15:00Z'
  },
  {
    id: 'po-006',
    po_number: 'PO-2026-006',
    vendor_id: 'ven-006',
    po_date: '2026-03-20',
    total_amount: 1770000,
    currency: 'INR',
    status: 'FULFILLED',
    created_at: '2026-03-20T10:00:00Z'
  },
  {
    id: 'po-007',
    po_number: 'PO-2026-007',
    vendor_id: 'ven-007',
    po_date: '2026-04-25',
    total_amount: 3540000,
    currency: 'INR',
    status: 'FULFILLED',
    created_at: '2026-04-25T15:00:00Z'
  },
  {
    id: 'po-008',
    po_number: 'PO-2026-008',
    vendor_id: 'ven-008',
    po_date: '2026-04-18',
    total_amount: 2124000,
    currency: 'INR',
    status: 'FULFILLED',
    created_at: '2026-04-18T16:30:00Z'
  }
];

export const mockPurchaseOrderItems: PurchaseOrderItem[] = [
  {
    id: 'poi-001',
    po_id: 'po-001',
    line_number: 1,
    item_sku: 'SKU-STEEL-HR-2062',
    description: 'Hot Rolled Steel Coils Grade IS 2062 (50 MT)',
    hsn_sac: '7208',
    quantity: 50,
    unit_price: 60000,
    tax_rate: 18.0,
    total_amount: 3540000,
    created_at: '2026-04-02T09:00:00Z'
  },
  {
    id: 'poi-002',
    po_id: 'po-002',
    line_number: 1,
    item_sku: 'SKU-LOG-CONTAINER-40',
    description: 'Inter-State Multi-Modal Freight Logistics (40 Containers)',
    hsn_sac: '996511',
    quantity: 40,
    unit_price: 25000,
    tax_rate: 18.0,
    total_amount: 1180000,
    created_at: '2026-04-10T11:00:00Z'
  },
  {
    id: 'poi-003',
    po_id: 'po-003',
    line_number: 1,
    item_sku: 'SKU-FAST-M24-BOLTS',
    description: 'High-Tensile Anchor Bolts & Flanges M24 (5,000 Units)',
    hsn_sac: '7318',
    quantity: 5000,
    unit_price: 1000,
    tax_rate: 18.0,
    total_amount: 5900000,
    created_at: '2026-04-12T10:30:00Z'
  },
  {
    id: 'poi-004',
    po_id: 'po-004',
    line_number: 1,
    item_sku: 'SKU-MACH-CASING-AL',
    description: 'CNC Milled Aerospace Aluminum Casings (100 Units)',
    hsn_sac: '8487',
    quantity: 100,
    unit_price: 12000,
    tax_rate: 18.0,
    total_amount: 1416000,
    created_at: '2026-04-15T14:00:00Z'
  },
  {
    id: 'poi-005',
    po_id: 'po-005',
    line_number: 1,
    item_sku: 'SKU-TOOL-CARBIDE-JIG',
    description: 'Custom Carbide Cutting Inserts & Tooling Jigs (200 Sets)',
    hsn_sac: '8207',
    quantity: 200,
    unit_price: 2200,
    tax_rate: 18.0,
    total_amount: 519200,
    created_at: '2026-03-28T09:15:00Z'
  },
  {
    id: 'poi-006',
    po_id: 'po-006',
    line_number: 1,
    item_sku: 'SKU-POLY-CONTAINER-HDPE',
    description: 'HDPE Molded Industrial Chemical Drums (10,000 Units)',
    hsn_sac: '3923',
    quantity: 10000,
    unit_price: 150,
    tax_rate: 18.0,
    total_amount: 1770000,
    created_at: '2026-03-20T10:00:00Z'
  },
  {
    id: 'poi-007',
    po_id: 'po-007',
    line_number: 1,
    item_sku: 'SKU-SRV-BLADE-NVME',
    description: 'Enterprise Rackmount Blade Units & High-Throughput NVMe Storage (10 Units)',
    hsn_sac: '8471',
    quantity: 10,
    unit_price: 300000,
    tax_rate: 18.0,
    total_amount: 3540000,
    created_at: '2026-04-25T15:00:00Z'
  },
  {
    id: 'poi-008',
    po_id: 'po-008',
    line_number: 1,
    item_sku: 'SKU-ELEC-TRANS-500KVA',
    description: '500kVA Heavy-Duty Step-Down Electrical Transformers (4 Units)',
    hsn_sac: '8504',
    quantity: 4,
    unit_price: 450000,
    tax_rate: 18.0,
    total_amount: 2124000,
    created_at: '2026-04-18T16:30:00Z'
  }
];

// ==========================================
// 3. MOCK GOODS RECEIPT NOTES & ITEMS
// ==========================================
export const mockGoodsReceiptNotes: GoodsReceiptNote[] = [
  {
    id: 'grn-001',
    grn_number: 'GRN-2026-001',
    po_id: 'po-001',
    grn_date: '2026-04-08',
    received_by: 'Rajesh Sharma (Warehouse Manager)',
    remarks: 'Weighbridge slip verified. 50 MT accepted in prime condition.',
    status: 'ACCEPTED',
    created_at: '2026-04-08T14:30:00Z'
  },
  {
    id: 'grn-002',
    grn_number: 'GRN-2026-002',
    po_id: 'po-002',
    grn_date: '2026-04-14',
    received_by: 'Vikram Sethi (Logistics Head)',
    remarks: 'Service Entry Sheet confirmed for 40 containers delivery at Nhava Sheva.',
    status: 'ACCEPTED',
    created_at: '2026-04-14T17:00:00Z'
  },
  {
    id: 'grn-003',
    grn_number: 'GRN-2026-003',
    po_id: 'po-003',
    grn_date: '2026-04-18',
    received_by: 'Mahesh Kulkarni (QA Lead)',
    remarks: 'Batch sampling complete. 5,000 units passed hardness tests.',
    status: 'ACCEPTED',
    created_at: '2026-04-18T12:00:00Z'
  },
  {
    id: 'grn-004',
    grn_number: 'GRN-2026-004',
    po_id: 'po-004',
    grn_date: '2026-04-22',
    received_by: 'Anand Shinde (Receiving Bay 3)',
    remarks: '15 units damaged during transit with visible hairline cracks. 85 accepted, 15 rejected.',
    status: 'PARTIALLY_ACCEPTED',
    created_at: '2026-04-22T11:45:00Z'
  },
  {
    id: 'grn-005',
    grn_number: 'GRN-2026-005',
    po_id: 'po-005',
    grn_date: '2026-03-31', // 42 days elapsed as of May 12
    received_by: 'Suresh Patil (Tool Room Supervisor)',
    remarks: 'Micro-tooling inspection passed. High precision tolerance verified.',
    status: 'ACCEPTED',
    created_at: '2026-03-31T16:00:00Z'
  },
  {
    id: 'grn-006',
    grn_number: 'GRN-2026-006',
    po_id: 'po-006',
    grn_date: '2026-03-25', // 48 days elapsed as of May 12 (Overdue)
    received_by: 'Dinesh Nair (Packaging Inward)',
    remarks: 'All 10,000 HDPE drums received intact.',
    status: 'ACCEPTED',
    created_at: '2026-03-25T13:20:00Z'
  },
  {
    id: 'grn-007',
    grn_number: 'GRN-2026-007',
    po_id: 'po-007',
    grn_date: '2026-04-29',
    received_by: 'Karthik Rao (Data Center Ops)',
    remarks: 'Server racks inspected, serial numbers verified against delivery challan.',
    status: 'ACCEPTED',
    created_at: '2026-04-29T18:00:00Z'
  },
  {
    id: 'grn-008',
    grn_number: 'GRN-2026-008',
    po_id: 'po-008',
    grn_date: '2026-04-25',
    received_by: 'Gaurav Joshi (Electrical Substation)',
    remarks: '4 transformers installed on test pads.',
    status: 'ACCEPTED',
    created_at: '2026-04-25T15:30:00Z'
  }
];

export const mockGoodsReceiptNoteItems: GoodsReceiptNoteItem[] = [
  {
    id: 'grni-001',
    grn_id: 'grn-001',
    po_item_id: 'poi-001',
    item_sku: 'SKU-STEEL-HR-2062',
    quantity_received: 50,
    quantity_accepted: 50,
    quantity_rejected: 0,
    remarks: 'Full quantity in good order',
    created_at: '2026-04-08T14:30:00Z'
  },
  {
    id: 'grni-002',
    grn_id: 'grn-002',
    po_item_id: 'poi-002',
    item_sku: 'SKU-LOG-CONTAINER-40',
    quantity_received: 40,
    quantity_accepted: 40,
    quantity_rejected: 0,
    remarks: 'SES verified',
    created_at: '2026-04-14T17:00:00Z'
  },
  {
    id: 'grni-003',
    grn_id: 'grn-003',
    po_item_id: 'poi-003',
    item_sku: 'SKU-FAST-M24-BOLTS',
    quantity_received: 5000,
    quantity_accepted: 5000,
    quantity_rejected: 0,
    remarks: 'Full batch accepted',
    created_at: '2026-04-18T12:00:00Z'
  },
  {
    id: 'grni-004',
    grn_id: 'grn-004',
    po_item_id: 'poi-004',
    item_sku: 'SKU-MACH-CASING-AL',
    quantity_received: 100,
    quantity_accepted: 85,
    quantity_rejected: 15,
    remarks: '15 units damaged in transit with cracked casting',
    created_at: '2026-04-22T11:45:00Z'
  },
  {
    id: 'grni-005',
    grn_id: 'grn-005',
    po_item_id: 'poi-005',
    item_sku: 'SKU-TOOL-CARBIDE-JIG',
    quantity_received: 200,
    quantity_accepted: 200,
    quantity_rejected: 0,
    remarks: 'Acceptance signed 42 days ago',
    created_at: '2026-03-31T16:00:00Z'
  },
  {
    id: 'grni-006',
    grn_id: 'grn-006',
    po_item_id: 'poi-006',
    item_sku: 'SKU-POLY-CONTAINER-HDPE',
    quantity_received: 10000,
    quantity_accepted: 10000,
    quantity_rejected: 0,
    remarks: 'Acceptance signed 48 days ago',
    created_at: '2026-03-25T13:20:00Z'
  },
  {
    id: 'grni-007',
    grn_id: 'grn-007',
    po_item_id: 'poi-007',
    item_sku: 'SKU-SRV-BLADE-NVME',
    quantity_received: 10,
    quantity_accepted: 10,
    quantity_rejected: 0,
    remarks: 'Hardware diagnostic test passed',
    created_at: '2026-04-29T18:00:00Z'
  },
  {
    id: 'grni-008',
    grn_id: 'grn-008',
    po_item_id: 'poi-008',
    item_sku: 'SKU-ELEC-TRANS-500KVA',
    quantity_received: 4,
    quantity_accepted: 4,
    quantity_rejected: 0,
    remarks: 'Physical units received; invoice pending arithmetic audit',
    created_at: '2026-04-25T15:30:00Z'
  }
];

// ==========================================
// 4. MOCK INVOICES & LINE ITEMS
// ==========================================
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoice_number: 'INV-TSL-2026-4401',
    vendor_id: 'ven-001',
    po_id: 'po-001',
    grn_id: 'grn-001',
    invoice_date: '2026-04-09',
    due_date: '2026-06-08',
    subtotal: 3000000,
    tax_amount: 540000, // CGST ₹2.7L + SGST ₹2.7L
    total_amount: 3540000,
    tds_194q_amount: 3000, // 0.1% on ₹30,00,000
    net_payable: 3537000,
    match_status: 'EXACT_MATCH',
    gstr2b_status: 'PASS_2B',
    compliance_gate_status: 'PASS',
    risk_score: 2,
    created_at: '2026-04-09T10:00:00Z'
  },
  {
    id: 'inv-002',
    invoice_number: 'INV-DLX-9902',
    vendor_id: 'ven-002',
    po_id: 'po-002',
    grn_id: 'grn-002',
    invoice_date: '2026-04-15',
    due_date: '2026-05-30',
    subtotal: 1000000,
    tax_amount: 180000, // IGST ₹1.8L
    total_amount: 1180000,
    tds_194q_amount: 0,
    net_payable: 1180000,
    match_status: 'EXACT_MATCH',
    gstr2b_status: 'HOLD_UNFILED',
    compliance_gate_status: 'HOLD',
    risk_score: 85,
    created_at: '2026-04-15T11:30:00Z'
  },
  {
    id: 'inv-003',
    invoice_number: 'INV-AIF-2026-108',
    vendor_id: 'ven-003',
    po_id: 'po-003',
    grn_id: 'grn-003',
    invoice_date: '2026-04-20',
    due_date: '2026-06-02',
    subtotal: 5400000, // Billed ₹1,080 vs PO ₹1,000 (+8%)
    tax_amount: 972000,
    total_amount: 6372000,
    tds_194q_amount: 14000, // FY spend crosses ₹50L
    net_payable: 6358000,
    match_status: 'PRICE_VARIANCE_HOLD',
    gstr2b_status: 'PASS_2B',
    compliance_gate_status: 'HOLD',
    risk_score: 72,
    created_at: '2026-04-20T14:15:00Z'
  },
  {
    id: 'inv-004',
    invoice_number: 'INV-ZPC-7721',
    vendor_id: 'ven-004',
    po_id: 'po-004',
    grn_id: 'grn-004',
    invoice_date: '2026-04-22',
    due_date: '2026-06-06',
    subtotal: 1200000, // Billed 100 units vs 85 accepted
    tax_amount: 216000,
    total_amount: 1416000,
    tds_194q_amount: 0,
    net_payable: 1416000,
    match_status: 'QUANTITY_OVERBILLING_HOLD',
    gstr2b_status: 'HOLD_VALUE_MISMATCH',
    compliance_gate_status: 'HOLD',
    risk_score: 78,
    created_at: '2026-04-22T16:00:00Z'
  },
  {
    id: 'inv-005',
    invoice_number: 'INV-PTM-2026-092',
    vendor_id: 'ven-005',
    po_id: 'po-005',
    grn_id: 'grn-005',
    invoice_date: '2026-03-31',
    due_date: '2026-05-15', // Day 42 of 45
    subtotal: 440000,
    tax_amount: 79200,
    total_amount: 519200,
    tds_194q_amount: 0,
    net_payable: 519200,
    match_status: 'EXACT_MATCH',
    gstr2b_status: 'PASS_2B',
    compliance_gate_status: 'PASS',
    risk_score: 45,
    created_at: '2026-03-31T17:30:00Z'
  },
  {
    id: 'inv-006',
    invoice_number: 'INV-KMP-8820',
    vendor_id: 'ven-006',
    po_id: 'po-006',
    grn_id: 'grn-006',
    invoice_date: '2026-03-26',
    due_date: '2026-05-09', // Day 48 of 45 (Overdue)
    subtotal: 1500000,
    tax_amount: 270000,
    total_amount: 1770000,
    tds_194q_amount: 0,
    net_payable: 1770000,
    match_status: 'EXACT_MATCH',
    gstr2b_status: 'PASS_2B',
    compliance_gate_status: 'HOLD',
    risk_score: 90,
    created_at: '2026-03-26T12:00:00Z'
  },
  {
    id: 'inv-007',
    invoice_number: 'INV-INF-2026-781',
    vendor_id: 'ven-007',
    po_id: 'po-007',
    grn_id: 'grn-007',
    invoice_date: '2026-05-02',
    due_date: '2026-06-16',
    subtotal: 3000000,
    tax_amount: 540000,
    total_amount: 3540000,
    tds_194q_amount: 2200, // 0.1% on excess ₹22,00,000
    net_payable: 3537800,
    match_status: 'EXACT_MATCH',
    gstr2b_status: 'PASS_2B',
    compliance_gate_status: 'PASS',
    risk_score: 5,
    created_at: '2026-05-02T11:00:00Z'
  },
  {
    id: 'inv-008',
    invoice_number: 'INV-VEE-9941',
    vendor_id: 'ven-008',
    po_id: 'po-008',
    grn_id: 'grn-008',
    invoice_date: '2026-04-26',
    due_date: '2026-06-10',
    subtotal: 1800000,
    tax_amount: 504000, // Billed 28% tax instead of 18% (Discrepancy +₹1,80,000)
    total_amount: 2304000,
    tds_194q_amount: 0,
    net_payable: 2304000,
    match_status: 'TAX_ARITHMETIC_REJECT',
    gstr2b_status: 'HOLD_VALUE_MISMATCH',
    compliance_gate_status: 'REJECT',
    risk_score: 98,
    created_at: '2026-04-26T15:20:00Z'
  }
];

export const mockInvoiceItems: InvoiceItem[] = [
  {
    id: 'ii-001',
    invoice_id: 'inv-001',
    po_item_id: 'poi-001',
    item_sku: 'SKU-STEEL-HR-2062',
    description: 'Hot Rolled Steel Coils Grade IS 2062',
    hsn_sac: '7208',
    billed_qty: 50,
    unit_rate: 60000,
    tax_rate: 18.0,
    cgst_amount: 270000,
    sgst_amount: 270000,
    igst_amount: 0,
    total_amount: 3540000,
    created_at: '2026-04-09T10:00:00Z'
  },
  {
    id: 'ii-002',
    invoice_id: 'inv-002',
    po_item_id: 'poi-002',
    item_sku: 'SKU-LOG-CONTAINER-40',
    description: 'Inter-State Freight Logistics 40 Containers',
    hsn_sac: '996511',
    billed_qty: 40,
    unit_rate: 25000,
    tax_rate: 18.0,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 180000,
    total_amount: 1180000,
    created_at: '2026-04-15T11:30:00Z'
  },
  {
    id: 'ii-003',
    invoice_id: 'inv-003',
    po_item_id: 'poi-003',
    item_sku: 'SKU-FAST-M24-BOLTS',
    description: 'High-Tensile Anchor Bolts & Flanges M24 (Price Creep +8%)',
    hsn_sac: '7318',
    billed_qty: 5000,
    unit_rate: 1080, // PO was 1,000
    tax_rate: 18.0,
    cgst_amount: 486000,
    sgst_amount: 486000,
    igst_amount: 0,
    total_amount: 6372000,
    created_at: '2026-04-20T14:15:00Z'
  },
  {
    id: 'ii-004',
    invoice_id: 'inv-004',
    po_item_id: 'poi-004',
    item_sku: 'SKU-MACH-CASING-AL',
    description: 'CNC Milled Aluminum Casings (Overbilled: 100 vs 85 accepted)',
    hsn_sac: '8487',
    billed_qty: 100, // GRN accepted only 85
    unit_rate: 12000,
    tax_rate: 18.0,
    cgst_amount: 108000,
    sgst_amount: 108000,
    igst_amount: 0,
    total_amount: 1416000,
    created_at: '2026-04-22T16:00:00Z'
  },
  {
    id: 'ii-005',
    invoice_id: 'inv-005',
    po_item_id: 'poi-005',
    item_sku: 'SKU-TOOL-CARBIDE-JIG',
    description: 'Custom Carbide Cutting Inserts & Tooling Jigs',
    hsn_sac: '8207',
    billed_qty: 200,
    unit_rate: 2200,
    tax_rate: 18.0,
    cgst_amount: 39600,
    sgst_amount: 39600,
    igst_amount: 0,
    total_amount: 519200,
    created_at: '2026-03-31T17:30:00Z'
  },
  {
    id: 'ii-006',
    invoice_id: 'inv-006',
    po_item_id: 'poi-006',
    item_sku: 'SKU-POLY-CONTAINER-HDPE',
    description: 'HDPE Molded Industrial Chemical Drums (Overdue 48/45)',
    hsn_sac: '3923',
    billed_qty: 10000,
    unit_rate: 150,
    tax_rate: 18.0,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 270000,
    total_amount: 1770000,
    created_at: '2026-03-26T12:00:00Z'
  },
  {
    id: 'ii-007',
    invoice_id: 'inv-007',
    po_item_id: 'poi-007',
    item_sku: 'SKU-SRV-BLADE-NVME',
    description: 'Enterprise Rackmount Blade Units & High-Throughput NVMe Storage',
    hsn_sac: '8471',
    billed_qty: 10,
    unit_rate: 300000,
    tax_rate: 18.0,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 540000,
    total_amount: 3540000,
    created_at: '2026-05-02T11:00:00Z'
  },
  {
    id: 'ii-008',
    invoice_id: 'inv-008',
    po_item_id: 'poi-008',
    item_sku: 'SKU-ELEC-TRANS-500KVA',
    description: '500kVA Heavy-Duty Transformers (Billed 28% Fraudulent Tax Rate)',
    hsn_sac: '8504',
    billed_qty: 4,
    unit_rate: 450000,
    tax_rate: 28.0, // Fraud / mismatch rate!
    cgst_amount: 252000,
    sgst_amount: 252000,
    igst_amount: 0,
    total_amount: 2304000,
    created_at: '2026-04-26T15:20:00Z'
  }
];

// ==========================================
// 5. MOCK GSTR-2B RECORDS
// ==========================================
export const mockGstr2bRecords: Gstr2bRecord[] = [
  {
    id: 'g2b-001',
    vendor_gstin: '27AAACT2727Q1ZW', // Tata Steel
    invoice_number: 'INV-TSL-2026-4401',
    invoice_date: '2026-04-09',
    invoice_type: 'B2B',
    taxable_value: 3000000,
    igst: 0,
    cgst: 270000,
    sgst: 270000,
    filing_date: '2026-04-10',
    gstr2b_period: '042026',
    itc_eligibility: 'ELIGIBLE',
    is_rcm: false,
    created_at: '2026-04-10T12:00:00Z'
  },
  // Note: Delta Logix (inv-002) is DELIBERATELY ABSENT here to model Section 16(2)(aa) Unfiled
  {
    id: 'g2b-003',
    vendor_gstin: '27AAQFA4412K1Z9', // Apex Fasteners
    invoice_number: 'INV-AIF-2026-108',
    invoice_date: '2026-04-20',
    invoice_type: 'B2B',
    taxable_value: 5400000,
    igst: 0,
    cgst: 486000,
    sgst: 486000,
    filing_date: '2026-05-02',
    gstr2b_period: '042026',
    itc_eligibility: 'ELIGIBLE',
    is_rcm: false,
    created_at: '2026-05-02T14:00:00Z'
  },
  {
    id: 'g2b-004',
    vendor_gstin: '27AABCZ1904P1Z2', // Zenith Precision
    invoice_number: 'INV-ZPC-7721',
    invoice_date: '2026-04-22',
    invoice_type: 'B2B',
    taxable_value: 1200000,
    igst: 0,
    cgst: 108000,
    sgst: 108000,
    filing_date: '2026-05-04',
    gstr2b_period: '042026',
    itc_eligibility: 'ELIGIBLE',
    is_rcm: false,
    created_at: '2026-05-04T16:00:00Z'
  },
  {
    id: 'g2b-005',
    vendor_gstin: '27AABCP5501B1ZM', // Precision Toolings
    invoice_number: 'INV-PTM-2026-092',
    invoice_date: '2026-03-31',
    invoice_type: 'B2B',
    taxable_value: 440000,
    igst: 0,
    cgst: 39600,
    sgst: 39600,
    filing_date: '2026-04-08',
    gstr2b_period: '042026',
    itc_eligibility: 'ELIGIBLE',
    is_rcm: false,
    created_at: '2026-04-08T11:00:00Z'
  },
  {
    id: 'g2b-006',
    vendor_gstin: '33AABCK3311E1Z6', // Kaveri Polymers
    invoice_number: 'INV-KMP-8820',
    invoice_date: '2026-03-26',
    invoice_type: 'B2B',
    taxable_value: 1500000,
    igst: 270000,
    cgst: 0,
    sgst: 0,
    filing_date: '2026-04-05',
    gstr2b_period: '042026',
    itc_eligibility: 'ELIGIBLE',
    is_rcm: false,
    created_at: '2026-04-05T10:00:00Z'
  },
  {
    id: 'g2b-007',
    vendor_gstin: '29AAACI4322H1ZN', // Infosys BPM
    invoice_number: 'INV-INF-2026-781',
    invoice_date: '2026-05-02',
    invoice_type: 'B2B',
    taxable_value: 3000000,
    igst: 540000,
    cgst: 0,
    sgst: 0,
    filing_date: '2026-05-08',
    gstr2b_period: '042026',
    itc_eligibility: 'ELIGIBLE',
    is_rcm: false,
    created_at: '2026-05-08T15:00:00Z'
  },
  {
    id: 'g2b-008',
    vendor_gstin: '27AAECV7710R1ZA', // Vanguard Electricals
    invoice_number: 'INV-VEE-9941',
    invoice_date: '2026-04-26',
    invoice_type: 'B2B',
    taxable_value: 1800000,
    igst: 0,
    cgst: 252000,
    sgst: 252000,
    filing_date: '2026-05-05',
    gstr2b_period: '042026',
    itc_eligibility: 'ELIGIBLE',
    is_rcm: false,
    created_at: '2026-05-05T17:00:00Z'
  }
];

// ==========================================
// 6. MOCK AUDIT LOGS
// ==========================================
export const mockComplianceAuditLogs: ComplianceAuditLog[] = [
  {
    id: 'log-001',
    invoice_id: 'inv-001',
    event_type: 'GATE_EVALUATION',
    actor: 'SYSTEM_AUTOPILOT',
    previous_status: 'PENDING',
    new_status: 'PASS',
    reason: 'Autonomous Pass: 3-Way Match verified (0.0% variance), verified in GSTR-2B, Section 194Q TDS ₹3,000 deducted.',
    metadata: {
      matched_lines: 1,
      variance_amount: 0,
      gstr2b_ref: '2B-APR26-0921',
      tds_deducted: 3000
    },
    created_at: '2026-04-09T10:05:00Z'
  },
  {
    id: 'log-002',
    invoice_id: 'inv-002',
    event_type: 'COMPLIANCE_HOLD',
    actor: 'SYSTEM_AUTOPILOT',
    previous_status: 'PENDING',
    new_status: 'HOLD',
    reason: 'VETO HOLD: Invoice INV-DLX-9902 not reflected in GSTR-2B. Section 16(2)(aa) blocks ₹1,80,000 ITC.',
    metadata: {
      itc_at_risk: 180000,
      sec50_interest_risk_pa: 32400
    },
    created_at: '2026-04-15T11:35:00Z'
  },
  {
    id: 'log-003',
    invoice_id: 'inv-003',
    event_type: 'PRICE_VARIANCE_HOLD',
    actor: 'SYSTEM_AUTOPILOT',
    previous_status: 'PENDING',
    new_status: 'HOLD',
    reason: '3-Way Match Exception: Unit price on Line 1 exceeds PO contracted rate by +8.00% (Billed ₹1,080.00 vs PO ₹1,000.00). Unapproved variance of ₹4,00,000.',
    metadata: {
      billed_rate: 1080,
      po_rate: 1000,
      variance_pct: 8.0,
      variance_amount: 400000
    },
    created_at: '2026-04-20T14:20:00Z'
  },
  {
    id: 'log-004',
    invoice_id: 'inv-004',
    event_type: 'QTY_OVERBILLING_HOLD',
    actor: 'SYSTEM_AUTOPILOT',
    previous_status: 'PENDING',
    new_status: 'HOLD',
    reason: '3-Way Match Exception: Billed quantity (100) exceeds GRN accepted quantity (85). 15 units damaged in transit. Overbilled value ₹1,80,000 + GST.',
    metadata: {
      billed_qty: 100,
      accepted_qty: 85,
      rejected_qty: 15,
      overbilled_taxable: 180000
    },
    created_at: '2026-04-22T16:05:00Z'
  },
  {
    id: 'log-005',
    invoice_id: 'inv-005',
    event_type: 'MSME_SLA_FAST_TRACK',
    actor: 'SYSTEM_AUTOPILOT',
    previous_status: 'PENDING',
    new_status: 'PASS',
    reason: 'MSME Section 43B(h) Fast-Track: Day 42 of 45 reached for Micro Enterprise. Payment prioritized to shield ₹1,32,000 corporate tax disallowance.',
    metadata: {
      msme_category: 'MICRO',
      days_elapsed: 42,
      days_remaining: 3,
      tax_shield_amount: 132000
    },
    created_at: '2026-05-12T08:00:00Z'
  },
  {
    id: 'log-006',
    invoice_id: 'inv-006',
    event_type: 'MSME_STATUTORY_BREACH',
    actor: 'SYSTEM_AUTOPILOT',
    previous_status: 'PENDING',
    new_status: 'HOLD',
    reason: 'STATUTORY BREACH: Micro Enterprise invoice overdue by 3 days (Day 48/45). ₹4,50,000 corporate tax disallowance active. Penal interest accruing at 20.25% p.a.',
    metadata: {
      msme_category: 'MICRO',
      days_elapsed: 48,
      statutory_limit: 45,
      tax_disallowance: 450000,
      penal_interest_accrued: 2945.96
    },
    created_at: '2026-05-12T08:15:00Z'
  },
  {
    id: 'log-007',
    invoice_id: 'inv-007',
    event_type: 'TDS_194Q_DEDUCTION',
    actor: 'SYSTEM_AUTOPILOT',
    previous_status: 'PENDING',
    new_status: 'PASS',
    reason: 'Section 194Q statutory threshold crossed. FY cumulative spend reached ₹72.00L. TDS of ₹2,200 (0.1% on excess ₹22.00L) auto-deducted. Net disbursement: ₹35,37,800.',
    metadata: {
      prior_spend: 4200000,
      current_taxable: 3000000,
      new_spend: 7200000,
      excess_subject_to_tds: 2200000,
      tds_amount: 2200,
      net_payable: 3537800
    },
    created_at: '2026-05-02T11:10:00Z'
  },
  {
    id: 'log-008',
    invoice_id: 'inv-008',
    event_type: 'GATE_REJECTION',
    actor: 'SYSTEM_AUTOPILOT',
    previous_status: 'PENDING',
    new_status: 'REJECT',
    reason: 'REJECTED: Statutory tax rate arithmetic error on HSN 8504. Supplier billed at 28% (₹5,04,000 tax) instead of contracted 18% (₹3,24,000 tax). Discrepancy of ₹1,80,000. Invoice returned to supplier for credit note.',
    metadata: {
      billed_tax: 504000,
      calculated_tax: 324000,
      tax_discrepancy: 180000,
      fraud_risk_score: 98
    },
    created_at: '2026-04-26T15:25:00Z'
  }
];
