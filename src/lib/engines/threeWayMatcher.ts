/**
 * VetoRail Autonomous 3-Way Matching Engine
 * File: src/lib/engines/threeWayMatcher.ts
 *
 * Implements line-level atomic comparison between Purchase Orders (PO),
 * Goods Receipt Notes (GRN), and Vendor Tax Invoices.
 *
 * Statutory References & Enterprise Controls:
 * - Commercial intent enforcement (PO contracted unit rates vs billed rates)
 * - Physical receipt & QA acceptance enforcement (GRN accepted qty vs billed qty)
 * - Tax rate and arithmetic consistency verification (CGST + SGST + IGST calculation)
 */

import {
  Invoice,
  InvoiceItem,
  PurchaseOrder,
  PurchaseOrderItem,
  GoodsReceiptNote,
  GoodsReceiptNoteItem,
  ThreeWayMatchStatus,
  LineItemMatchStatus,
  LineItemMatchResult,
  ThreeWayMatchSummary
} from '../types';

export interface ThreeWayMatchParams {
  invoice: Invoice | { id: string; invoice_number?: string; po_id?: string | null; grn_id?: string | null; total_amount?: number; subtotal?: number; tax_amount?: number; [key: string]: unknown };
  invoiceItems: (InvoiceItem | { id?: string; invoice_id?: string; po_item_id?: string | null; item_sku: string; billed_qty: number; unit_rate: number; tax_rate?: number; cgst_amount?: number; sgst_amount?: number; igst_amount?: number; total_amount?: number; [key: string]: unknown })[];
  purchaseOrder?: (PurchaseOrder | { id: string; po_number?: string; total_amount?: number; [key: string]: unknown }) | null;
  poItems?: (PurchaseOrderItem | { id: string; po_id?: string; item_sku: string; quantity: number; unit_price: number; tax_rate?: number; total_amount?: number; [key: string]: unknown })[];
  grn?: (GoodsReceiptNote | { id: string; grn_number?: string; status?: string; [key: string]: unknown }) | null;
  grnItems?: (GoodsReceiptNoteItem | { id?: string; grn_id?: string; po_item_id?: string | null; item_sku: string; quantity_accepted: number; quantity_received?: number; quantity_rejected?: number; [key: string]: unknown })[];
  rateTolerancePct?: number; // Corporate rate tolerance percentage, default 0.5% (0.5)
  qtyTolerancePct?: number;  // Corporate quantity tolerance percentage, default 0.0% (0.0)
}

export interface LineMatchComputation {
  lineResult: LineItemMatchResult;
  lineVarianceAmount: number;
}

/**
 * Matches a single invoice line against corresponding PO and GRN lines.
 */
export function matchSingleLineItem(
  item: InvoiceItem | { id?: string; invoice_id?: string; po_item_id?: string | null; item_sku: string; billed_qty: number; unit_rate: number; tax_rate?: number; cgst_amount?: number; sgst_amount?: number; igst_amount?: number; total_amount?: number; [key: string]: unknown },
  poItems: (PurchaseOrderItem | { id: string; po_id?: string; item_sku: string; quantity: number; unit_price: number; tax_rate?: number; total_amount?: number; [key: string]: unknown })[] = [],
  grnItems: (GoodsReceiptNoteItem | { id?: string; grn_id?: string; po_item_id?: string | null; item_sku: string; quantity_accepted: number; quantity_received?: number; quantity_rejected?: number; [key: string]: unknown })[] = [],
  rateTolerancePct = 0.5,
  qtyTolerancePct = 0.0
): LineMatchComputation {
  // Resolve matching PO item by ID or SKU
  const poItem = poItems.find(
    (p) => (item.po_item_id && p.id === item.po_item_id) || p.item_sku === item.item_sku
  );

  // Resolve matching GRN item by po_item_id or SKU
  const grnItem = grnItems.find(
    (g) => (poItem && g.po_item_id === poItem.id) || g.item_sku === item.item_sku
  );

  const poItemId = poItem ? poItem.id : (item.po_item_id || 'UNKNOWN_PO_ITEM');
  const itemSku = item.item_sku;

  const orderedQty = poItem ? Number(poItem.quantity) : 0;
  const acceptedQty = grnItem ? Number(grnItem.quantity_accepted) : 0;
  const billedQty = Number(item.billed_qty);

  const poUnitRate = poItem ? Number(poItem.unit_price) : 0;
  const billedUnitRate = Number(item.unit_rate);

  const qtyDiscrepancy = billedQty - acceptedQty;
  const rateDiscrepancy = billedUnitRate - poUnitRate;
  const rateDiscrepancyPct =
    poUnitRate > 0 ? Number((((billedUnitRate - poUnitRate) / poUnitRate) * 100).toFixed(4)) : 0;

  // Tax calculations
  const billedCgst = Number(item.cgst_amount) || 0;
  const billedSgst = Number(item.sgst_amount) || 0;
  const billedIgst = Number(item.igst_amount) || 0;
  const totalBilledTax = billedCgst + billedSgst + billedIgst;

  const poTaxRate = poItem && poItem.tax_rate !== undefined ? Number(poItem.tax_rate) : undefined;
  const invTaxRate = item.tax_rate !== undefined ? Number(item.tax_rate) : undefined;

  // Check 1: Tax rate discrepancy against PO contracted rate
  let taxRateMismatch = false;
  let taxRateDiscrepancyAmount = 0;
  if (poTaxRate !== undefined && invTaxRate !== undefined) {
    if (Math.abs(invTaxRate - poTaxRate) > 0.01) {
      taxRateMismatch = true;
      const expectedTax = (billedQty * billedUnitRate * poTaxRate) / 100;
      taxRateDiscrepancyAmount = totalBilledTax - expectedTax;
    }
  }

  // Check 2: Tax arithmetic internal consistency (billed taxes vs rate * taxable)
  let taxMathDiscrepancyAmount = 0;
  if (invTaxRate !== undefined && invTaxRate > 0) {
    const expectedFromRate = (billedQty * billedUnitRate * invTaxRate) / 100;
    if (Math.abs(totalBilledTax - expectedFromRate) > 1.0) {
      taxMathDiscrepancyAmount = totalBilledTax - expectedFromRate;
    }
  }

  const taxDiscrepancy = taxRateMismatch
    ? taxRateDiscrepancyAmount
    : taxMathDiscrepancyAmount;

  // Determine line status based on tolerances
  const maxAllowedQty = acceptedQty * (1 + qtyTolerancePct / 100);
  let status: LineItemMatchStatus = 'MATCH';
  let lineVarianceAmount = 0;

  if (taxRateMismatch || Math.abs(taxMathDiscrepancyAmount) > 1.0) {
    status = 'TAX_MISMATCH';
    lineVarianceAmount = Math.abs(taxDiscrepancy);
  } else if (billedQty > maxAllowedQty) {
    status = 'QTY_OVERBILLING';
    const effectiveRate = poUnitRate > 0 ? poUnitRate : billedUnitRate;
    lineVarianceAmount = qtyDiscrepancy * effectiveRate;
  } else if (rateDiscrepancyPct > rateTolerancePct) {
    status = 'PRICE_VARIANCE';
    lineVarianceAmount = rateDiscrepancy * billedQty;
  } else {
    status = 'MATCH';
    lineVarianceAmount = 0;
  }

  const lineResult: LineItemMatchResult = {
    poItemId,
    itemSku,
    orderedQty,
    acceptedQty,
    billedQty,
    poUnitRate,
    billedUnitRate,
    qtyDiscrepancy,
    rateDiscrepancy,
    rateDiscrepancyPct,
    taxDiscrepancy,
    status
  };

  return {
    lineResult,
    lineVarianceAmount
  };
}

/**
 * Executes full 3-Way Matching across an Invoice, PO, and GRN.
 * Returns a complete ThreeWayMatchSummary with line-level details and overall status.
 */
export function matchThreeWay(params: ThreeWayMatchParams): ThreeWayMatchSummary {
  const {
    invoice,
    invoiceItems = [],
    poItems = [],
    grn,
    grnItems = [],
    rateTolerancePct = 0.5,
    qtyTolerancePct = 0.0
  } = params;

  const invoiceId = invoice.id;

  // Condition 1: Missing GRN
  // If no GRN exists or no GRN items are available, flag MISSING_GRN_HOLD
  if (!grn || !grnItems || grnItems.length === 0) {
    const totalAmount =
      Number(invoice.total_amount) ||
      invoiceItems.reduce((sum, item) => sum + (Number(item.total_amount) || Number(item.billed_qty) * Number(item.unit_rate)), 0);

    // Build placeholder line results reflecting missing goods receipt
    const lineResults: LineItemMatchResult[] = invoiceItems.map((item) => {
      const poItem = poItems.find(
        (p) => (item.po_item_id && p.id === item.po_item_id) || p.item_sku === item.item_sku
      );
      const poUnitRate = poItem ? Number(poItem.unit_price) : 0;
      const billedUnitRate = Number(item.unit_rate);

      return {
        poItemId: poItem ? poItem.id : (item.po_item_id || 'UNKNOWN'),
        itemSku: item.item_sku,
        orderedQty: poItem ? Number(poItem.quantity) : 0,
        acceptedQty: 0,
        billedQty: Number(item.billed_qty),
        poUnitRate,
        billedUnitRate,
        qtyDiscrepancy: Number(item.billed_qty),
        rateDiscrepancy: billedUnitRate - poUnitRate,
        rateDiscrepancyPct: poUnitRate > 0 ? ((billedUnitRate - poUnitRate) / poUnitRate) * 100 : 0,
        taxDiscrepancy: 0,
        status: 'QTY_OVERBILLING'
      };
    });

    return {
      invoiceId,
      overallStatus: 'MISSING_GRN_HOLD',
      lineResults,
      totalVarianceAmount: totalAmount,
      canAutoRelease: false
    };
  }

  // Condition 2: Evaluate each line item
  const lineComputations = invoiceItems.map((item) =>
    matchSingleLineItem(item, poItems, grnItems, rateTolerancePct, qtyTolerancePct)
  );

  const lineResults = lineComputations.map((c) => c.lineResult);
  const totalVarianceAmount = lineComputations.reduce((sum, c) => sum + c.lineVarianceAmount, 0);

  // Determine overall status based on highest severity discrepancy
  let overallStatus: ThreeWayMatchStatus = 'EXACT_MATCH';

  const hasTaxMismatch = lineResults.some((l) => l.status === 'TAX_MISMATCH');
  const hasQtyOverbilling = lineResults.some((l) => l.status === 'QTY_OVERBILLING');
  const hasPriceVariance = lineResults.some((l) => l.status === 'PRICE_VARIANCE');

  if (hasTaxMismatch) {
    overallStatus = 'TAX_ARITHMETIC_REJECT';
  } else if (hasQtyOverbilling) {
    overallStatus = 'QUANTITY_OVERBILLING_HOLD';
  } else if (hasPriceVariance) {
    overallStatus = 'PRICE_VARIANCE_HOLD';
  } else {
    overallStatus = 'EXACT_MATCH';
  }

  const canAutoRelease = overallStatus === 'EXACT_MATCH';

  return {
    invoiceId,
    overallStatus,
    lineResults,
    totalVarianceAmount,
    canAutoRelease
  };
}
