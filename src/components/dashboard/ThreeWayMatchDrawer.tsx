'use client';

import React, { useMemo } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Split,
  Lock,
  ShieldAlert,
  Percent,
  Check,
  Ban
} from 'lucide-react';
import { InvoiceWithDetails } from '@/lib/types';
import { matchThreeWay } from '@/lib/engines/threeWayMatcher';
import { formatINR } from '@/lib/utils/formatters';

export interface ThreeWayMatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceWithDetails | null;
  onOpenOverride: () => void;
  onHoldInvoice: (invoiceId: string) => Promise<void>;
  onRejectInvoice: (invoiceId: string) => Promise<void>;
  onPassInvoice?: (invoiceId: string) => Promise<void>;
}

export function ThreeWayMatchDrawer({
  isOpen,
  onClose,
  invoice,
  onOpenOverride,
  onHoldInvoice,
  onRejectInvoice,
  onPassInvoice
}: ThreeWayMatchDrawerProps) {
  // Execute 3-way match calculation dynamically
  const matchSummary = useMemo(() => {
    if (!invoice) return null;
    return matchThreeWay({
      invoice,
      invoiceItems: invoice.items || [],
      purchaseOrder: invoice.po,
      poItems: invoice.poItems || [],
      grn: invoice.grn,
      grnItems: invoice.grnItems || [],
      rateTolerancePct: 0.5,
      qtyTolerancePct: 0.0
    });
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const po = invoice.po;
  const grn = invoice.grn;
  const vendor = invoice.vendor;
  const lineResults = matchSummary?.lineResults || [];

  // Compute PO Total and GRN accepted total
  const poTotalAmount = po?.total_amount || 0;
  const grnAcceptedValue = (invoice.grnItems || []).reduce((sum, item) => {
    const matchedPoItem = invoice.poItems?.find((p) => p.id === item.po_item_id || p.item_sku === item.item_sku);
    const unitPrice = matchedPoItem ? matchedPoItem.unit_price : 0;
    return sum + (item.quantity_accepted * unitPrice);
  }, 0);

  const varianceAmount = matchSummary?.totalVarianceAmount || 0;
  const isExactMatch = matchSummary?.overallStatus === 'EXACT_MATCH';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in-50 duration-150">
      <div
        className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-96 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-mono">{invoice.invoice_number}</h2>
                {/* Gate Status Pill */}
                <span
                  className={`text-2xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                    invoice.compliance_gate_status === 'PASS'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-glow-pass'
                      : invoice.compliance_gate_status === 'HOLD'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-glow-hold'
                      : 'bg-rose-50 text-rose-800 border-rose-200 shadow-glow-veto'
                  }`}
                >
                  {invoice.compliance_gate_status}
                </span>

                {/* Match Status Pill */}
                <span
                  className={`text-3xs font-semibold px-2 py-0.5 rounded-full border ${
                    isExactMatch
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {matchSummary?.overallStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Vendor: <span className="font-semibold text-slate-700">{vendor?.name}</span> • GSTIN:{' '}
                <span className="font-mono">{vendor?.gstin}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Statutory 3-Way Triad Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                1. Contracted Purchase Order
              </span>
              <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {formatINR(poTotalAmount)}
              </p>
              <div className="text-2xs text-slate-500 font-mono mt-1 flex items-center justify-between">
                <span>{po?.po_number || 'NO PO'}</span>
                <span>{po?.status}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                2. Physical GRN Acceptance
              </span>
              <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {formatINR(grnAcceptedValue)}
              </p>
              <div className="text-2xs text-slate-500 font-mono mt-1 flex items-center justify-between">
                <span>{grn?.grn_number || 'NO GRN'}</span>
                <span className="text-emerald-700 font-semibold">{grn?.status}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                3. Billed Tax Invoice
              </span>
              <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {formatINR(invoice.total_amount)}
              </p>
              <div className="text-2xs text-slate-500 font-mono mt-1 flex items-center justify-between">
                <span>Tax: {formatINR(invoice.tax_amount)}</span>
                <span>Sub: {formatINR(invoice.subtotal)}</span>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border ${
                varianceAmount > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <span className="text-3xs font-bold uppercase tracking-wider opacity-75 block mb-1">
                Net 3-Way Variance
              </span>
              <p className="text-sm font-bold font-mono tabular-nums">
                {varianceAmount > 0 ? `+${formatINR(varianceAmount)}` : '₹0 (0.00%)'}
              </p>
              <div className="text-2xs font-semibold mt-1">
                {varianceAmount > 0 ? 'Discrepancy Gated' : '100% Exact Match'}
              </div>
            </div>
          </div>

          {/* Statutory Shield Badges Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
            {/* GSTR-2B */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  invoice.gstr2b_status === 'PASS_2B'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {invoice.gstr2b_status === 'PASS_2B' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <ShieldAlert className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide block">
                  Sec 16(2)(aa) GSTR-2B
                </span>
                <span className="text-2xs font-semibold text-slate-800 truncate block">
                  {invoice.gstr2b_status === 'PASS_2B' ? 'Verified in 2B' : 'Unfiled / Missing on GSTN'}
                </span>
              </div>
            </div>

            {/* TDS 194Q */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide block">
                  Sec 194Q TDS
                </span>
                <span className="text-2xs font-semibold text-slate-800 truncate block font-mono">
                  {invoice.tds_194q_amount > 0
                    ? `-${formatINR(invoice.tds_194q_amount)} (0.1%)`
                    : '₹0 (Under ₹50L)'}
                </span>
              </div>
            </div>

            {/* MSME 43B(h) */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  invoice.msmeUrgency === 'RED_OVERDUE'
                    ? 'bg-rose-100 text-rose-700'
                    : invoice.msmeUrgency === 'ORANGE'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide block">
                  Sec 43B(h) MSME
                </span>
                <span className="text-2xs font-semibold text-slate-800 truncate block font-mono">
                  {invoice.daysRemaining !== undefined
                    ? `${invoice.daysRemaining}d Left (${vendor?.msme_category})`
                    : 'Exempt / Not MSME'}
                </span>
              </div>
            </div>
          </div>

          {/* Line Item Side-by-Side Comparison Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Side-by-Side Line Item Cross Examination</span>
                <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {lineResults.length} Lines Evaluated
                </span>
              </h3>
              <span className="text-2xs text-slate-500 font-mono">Rate Tolerance: 0.5% • Qty Tolerance: 0.0%</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-3xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-3">Item SKU & HSN</th>
                      <th className="py-2.5 px-3 text-right">PO Contracted</th>
                      <th className="py-2.5 px-3 text-right">GRN Accepted</th>
                      <th className="py-2.5 px-3 text-right">Invoice Billed</th>
                      <th className="py-2.5 px-3 text-right">Variance</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lineResults.map((line, idx) => {
                      const invoiceLineItem = invoice.items[idx];
                      const poLineItem = invoice.poItems?.find(
                        (p) => p.id === line.poItemId || p.item_sku === line.itemSku
                      );

                      const hasPriceVar = line.status === 'PRICE_VARIANCE';
                      const hasQtyVar = line.status === 'QTY_OVERBILLING';
                      const hasTaxVar = line.status === 'TAX_MISMATCH';
                      const isLineMatch = line.status === 'MATCH';

                      return (
                        <tr
                          key={line.itemSku + idx}
                          className={`hover:bg-slate-50/60 transition-colors ${
                            !isLineMatch ? 'bg-amber-50/20' : ''
                          }`}
                        >
                          {/* Item SKU & HSN */}
                          <td className="py-3 px-3">
                            <div className="font-mono font-semibold text-slate-900 text-xs">
                              {line.itemSku}
                            </div>
                            <div className="text-2xs text-slate-500 line-clamp-1">
                              {invoiceLineItem?.description || poLineItem?.description || 'Standard Component'}
                            </div>
                            <div className="text-3xs text-slate-400 font-mono">
                              HSN: {invoiceLineItem?.hsn_sac || poLineItem?.hsn_sac || '8481'}
                            </div>
                          </td>

                          {/* PO Contracted */}
                          <td className="py-3 px-3 text-right font-mono">
                            <div className="text-slate-800 font-medium">
                              {line.orderedQty} units @ {formatINR(line.poUnitRate)}
                            </div>
                            <div className="text-2xs text-slate-400">
                              {formatINR(line.orderedQty * line.poUnitRate)}
                            </div>
                          </td>

                          {/* GRN Accepted */}
                          <td className="py-3 px-3 text-right font-mono">
                            <div className="text-slate-800 font-medium">
                              {line.acceptedQty} units
                            </div>
                            <div className="text-2xs text-emerald-600 font-medium">
                              {line.acceptedQty < line.billedQty
                                ? `${line.billedQty - line.acceptedQty} rejected`
                                : '100% accepted'}
                            </div>
                          </td>

                          {/* Invoice Billed */}
                          <td className="py-3 px-3 text-right font-mono">
                            <div
                              className={`font-semibold ${
                                hasPriceVar ? 'text-amber-800 bg-amber-50 px-1 py-0.5 rounded' : 'text-slate-900'
                              }`}
                            >
                              {line.billedQty} units @ {formatINR(line.billedUnitRate)}
                            </div>
                            <div className="text-2xs text-slate-400">
                              Total: {formatINR(line.billedQty * line.billedUnitRate)}
                            </div>
                          </td>

                          {/* Variance */}
                          <td className="py-3 px-3 text-right font-mono text-2xs">
                            {hasPriceVar && (
                              <div className="text-amber-700 font-bold">
                                Rate: +{formatINR(line.rateDiscrepancy)} ({line.rateDiscrepancyPct.toFixed(1)}%)
                              </div>
                            )}
                            {hasQtyVar && (
                              <div className="text-rose-700 font-bold">
                                Qty: +{line.qtyDiscrepancy} units
                              </div>
                            )}
                            {hasTaxVar && (
                              <div className="text-rose-700 font-bold">
                                Tax: {formatINR(line.taxDiscrepancy)}
                              </div>
                            )}
                            {isLineMatch && (
                              <span className="text-emerald-600 font-semibold flex items-center justify-end gap-1">
                                <Check className="w-3.5 h-3.5" /> 0.00%
                              </span>
                            )}
                          </td>

                          {/* Status Pill */}
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-3xs font-semibold border ${
                                isLineMatch
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : hasPriceVar
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : hasQtyVar
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              {line.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Diagnostic Discrepancy Findings Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-brand-600" />
              <span>Automated Audit Findings & Compliance Verdict</span>
            </h4>

            {isExactMatch && invoice.gstr2b_status === 'PASS_2B' ? (
              <div className="text-xs text-emerald-800 bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 leading-relaxed">
                ✅ <strong>Zero Discrepancies Detected:</strong> All {lineResults.length} line items exactly match contracted PO pricing and physical GRN warehouse receipts. Section 16(2)(aa) GSTR-2B filing is verified on GSTN. Eligible for automated payment release.
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {lineResults
                  .filter((l) => l.status !== 'MATCH')
                  .map((l, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 leading-relaxed font-sans"
                    >
                      <strong>{l.itemSku}:</strong>{' '}
                      {l.status === 'PRICE_VARIANCE' && (
                        <span>
                          Unit rate billed at <span className="font-mono font-bold">{formatINR(l.billedUnitRate)}</span> vs contracted{' '}
                          <span className="font-mono font-bold">{formatINR(l.poUnitRate)}</span> (+{formatINR(l.rateDiscrepancy)} / +
                          {l.rateDiscrepancyPct.toFixed(2)}% overage).
                        </span>
                      )}
                      {l.status === 'QTY_OVERBILLING' && (
                        <span>
                          Invoice billed for <span className="font-mono font-bold">{l.billedQty} units</span>, but warehouse GRN accepted only{' '}
                          <span className="font-mono font-bold">{l.acceptedQty} units</span> (shortage of {l.qtyDiscrepancy} units).
                        </span>
                      )}
                      {l.status === 'TAX_MISMATCH' && (
                        <span>
                          Statutory tax rate calculation mismatch detected against HSN rate table. Variance: {formatINR(l.taxDiscrepancy)}.
                        </span>
                      )}
                    </div>
                  ))}

                {invoice.gstr2b_status === 'HOLD_UNFILED' && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 leading-relaxed">
                    <strong>Section 16(2)(aa) Statutory Hold:</strong> Supplier {vendor?.name} has not filed GSTR-1 return for this period. Enterprise ITC of {formatINR(invoice.tax_amount)} is unconfirmed. Disbursement gated.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono">Audit Event Stream Connected</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onHoldInvoice(invoice.id)}
              className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Maintain Hold</span>
            </button>

            <button
              type="button"
              onClick={() => onRejectInvoice(invoice.id)}
              className="px-3.5 py-2 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Reject Invoice</span>
            </button>

            {isExactMatch && invoice.gstr2b_status === 'PASS_2B' && onPassInvoice && (
              <button
                type="button"
                onClick={() => onPassInvoice(invoice.id)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Release Payment (Pass)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenOverride}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Override & Release</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreeWayMatchDrawer;
