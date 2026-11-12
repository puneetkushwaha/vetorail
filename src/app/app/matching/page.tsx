'use client';

import React, { useState, useMemo } from 'react';
import {
  Split,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Ban,
  Check
} from 'lucide-react';
import { useAPData } from '@/lib/data/dataProvider';
import { matchThreeWay } from '@/lib/engines/threeWayMatcher';
import { formatINR } from '@/lib/utils/formatters';
import { OverrideModal } from '@/components/dashboard/OverrideModal';

export default function ThreeWayMatchingStudioPage() {
  const { invoices, updateInvoiceStatus } = useAPData();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(invoices[2]?.id || invoices[0]?.id || '');
  const [rateTolerancePct, setRateTolerancePct] = useState<number>(0.5);
  const [qtyTolerancePct, setQtyTolerancePct] = useState<number>(0.0);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Active Invoice
  const selectedInvoice = useMemo(() => {
    return invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0] || null;
  }, [invoices, selectedInvoiceId]);

  // Execute 3-way match calculation dynamically with interactive tolerances
  const matchSummary = useMemo(() => {
    if (!selectedInvoice) return null;
    return matchThreeWay({
      invoice: selectedInvoice,
      invoiceItems: selectedInvoice.items || [],
      purchaseOrder: selectedInvoice.po,
      poItems: selectedInvoice.poItems || [],
      grn: selectedInvoice.grn,
      grnItems: selectedInvoice.grnItems || [],
      rateTolerancePct,
      qtyTolerancePct
    });
  }, [selectedInvoice, rateTolerancePct, qtyTolerancePct]);

  const handlePass = async () => {
    if (!selectedInvoice) return;
    await updateInvoiceStatus(
      selectedInvoice.id,
      'PASS',
      `Payment release cleared via 3-Way Matching Studio (Tolerances: Rate ${rateTolerancePct}%, Qty ${qtyTolerancePct}%)`
    );
    setFeedback(`Invoice ${selectedInvoice.invoice_number} successfully released (PASS).`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleHold = async () => {
    if (!selectedInvoice) return;
    await updateInvoiceStatus(
      selectedInvoice.id,
      'HOLD',
      `Invoice held in 3-Way Matching Studio (Tolerances: Rate ${rateTolerancePct}%, Qty ${qtyTolerancePct}%)`
    );
    setFeedback(`Invoice ${selectedInvoice.invoice_number} placed on HOLD.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReject = async () => {
    if (!selectedInvoice) return;
    await updateInvoiceStatus(
      selectedInvoice.id,
      'REJECT',
      `Invoice rejected in 3-Way Matching Studio due to line discrepancies`
    );
    setFeedback(`Invoice ${selectedInvoice.invoice_number} REJECTED.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleConfirmOverride = async (
    invoiceId: string,
    reason: string,
    approverName: string
  ) => {
    await updateInvoiceStatus(invoiceId, 'PASS', reason, approverName);
    setIsOverrideModalOpen(false);
    setFeedback(`Manager override authorized for ${selectedInvoice?.invoice_number}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  if (!selectedInvoice || !matchSummary) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No invoice records available for 3-way match evaluation.
      </div>
    );
  }

  const lineResults = matchSummary.lineResults;
  const isExact = matchSummary.overallStatus === 'EXACT_MATCH';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Split className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              3-Way Matching Calculation Studio
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Atomic line-level cross-examination across PO contracted terms, GRN warehouse receipts, and Tax Invoices with dynamic tolerance calibration.
          </p>
        </div>

        {/* Invoice Selector */}
        <div className="flex items-center gap-2">
          <label className="text-2xs font-bold uppercase text-slate-400">Target Invoice:</label>
          <select
            value={selectedInvoiceId}
            onChange={(e) => setSelectedInvoiceId(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          >
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.invoice_number} ({inv.vendor?.name} • {inv.compliance_gate_status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
          <span className="text-3xs font-mono text-slate-400">Audit Stream Appended</span>
        </div>
      )}

      {/* Tolerance Calibration Panel */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Corporate Matching Tolerances
            </h3>
          </div>
          <span className="text-2xs text-slate-500">
            Real-time recalculation powered by <code className="font-mono text-brand-600 font-semibold">threeWayMatcher.ts</code>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rate Tolerance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Unit Price Variance Tolerance:</label>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                ±{rateTolerancePct.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="10.0"
              step="0.1"
              value={rateTolerancePct}
              onChange={(e) => setRateTolerancePct(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-3xs text-slate-400">
              Contracted unit rate differences within ±{rateTolerancePct.toFixed(1)}% will pass without pricing hold.
            </p>
          </div>

          {/* Quantity Tolerance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Quantity Discrepancy Tolerance:</label>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                +{qtyTolerancePct.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.1"
              value={qtyTolerancePct}
              onChange={(e) => setQtyTolerancePct(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-3xs text-slate-400">
              Permits supplier quantity delivery overage up to +{qtyTolerancePct.toFixed(1)}% without quantity hold.
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Verdict Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isExact
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isExact ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isExact ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">Dynamic Engine Verdict:</span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isExact
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {matchSummary.overallStatus}
              </span>
            </div>
            <p className="text-2xs opacity-80 mt-0.5">
              Total Variance Amount: <span className="font-mono font-bold">{formatINR(matchSummary.totalVarianceAmount)}</span> • Auto-Release Flag: <span className="font-mono font-bold">{matchSummary.canAutoRelease ? 'TRUE' : 'FALSE'}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePass}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Pass (Release)</span>
          </button>
          <button
            type="button"
            onClick={handleHold}
            className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Hold</span>
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="px-3.5 py-2 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
          <button
            type="button"
            onClick={() => setIsOverrideModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Override</span>
          </button>
        </div>
      </div>

      {/* Side-by-side Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Line Items Comparison (PO vs GRN vs Invoice)
          </span>
          <span className="text-2xs text-slate-500 font-mono">
            Invoice: {selectedInvoice.invoice_number} • Vendor: {selectedInvoice.vendor?.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-3xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3">SKU & Description</th>
                <th className="py-2.5 px-3 text-right">PO Ordered</th>
                <th className="py-2.5 px-3 text-right">GRN Accepted</th>
                <th className="py-2.5 px-3 text-right">Invoice Billed</th>
                <th className="py-2.5 px-3 text-right">Rate Variance</th>
                <th className="py-2.5 px-3 text-right">Qty Variance</th>
                <th className="py-2.5 px-3 text-center">Line Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lineResults.map((line, idx) => {
                const item = selectedInvoice.items[idx];
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">{line.itemSku}</div>
                      <div className="text-2xs text-slate-500">{item?.description || 'Component'}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <div>{line.orderedQty} units</div>
                      <div className="text-2xs text-slate-400">@ {formatINR(line.poUnitRate)}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <div className="text-emerald-700 font-semibold">{line.acceptedQty} units</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <div className="font-bold text-slate-900">{line.billedQty} units</div>
                      <div className="text-2xs text-slate-400">@ {formatINR(line.billedUnitRate)}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-2xs">
                      {line.rateDiscrepancy !== 0 ? (
                        <span className="text-amber-700 font-bold">
                          +{formatINR(line.rateDiscrepancy)} ({line.rateDiscrepancyPct.toFixed(1)}%)
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">0.00%</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-2xs">
                      {line.qtyDiscrepancy !== 0 ? (
                        <span className="text-rose-700 font-bold">+{line.qtyDiscrepancy} units</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-3xs font-semibold border ${
                          line.status === 'MATCH'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
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

      {/* Override Modal */}
      <OverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        invoice={selectedInvoice}
        onConfirmOverride={handleConfirmOverride}
      />
    </div>
  );
}
