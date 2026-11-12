'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ShieldAlert,
  FileText,
  Search,
  Eye,
  Ban,
  Lock,
  Check
} from 'lucide-react';
import { useAPData } from '@/lib/data/dataProvider';
import { InvoiceWithDetails } from '@/lib/types';
import { formatINR, formatCompactINR } from '@/lib/utils/formatters';

export type QueueTab = 'ALL' | 'HOLD' | 'PASS' | 'REJECT' | 'MSME_EXPIRING';

export interface ApQueueTableProps {
  onInspectInvoice: (invoice: InvoiceWithDetails) => void;
  onOpenOverride: (invoice: InvoiceWithDetails) => void;
  searchFilter?: string;
}

export function ApQueueTable({
  onInspectInvoice,
  onOpenOverride,
  searchFilter = ''
}: ApQueueTableProps) {
  const { invoices, metrics, updateInvoiceStatus } = useAPData();
  const [activeTab, setActiveTab] = useState<QueueTab>('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{
    id: string;
    action: string;
    message: string;
  } | null>(null);

  const effectiveSearch = (searchFilter || localSearch).toLowerCase().trim();

  // Tab Counts
  const counts = useMemo(() => {
    return {
      all: invoices.length,
      hold: invoices.filter((i) => i.compliance_gate_status === 'HOLD').length,
      pass: invoices.filter((i) => i.compliance_gate_status === 'PASS').length,
      reject: invoices.filter((i) => i.compliance_gate_status === 'REJECT').length,
      msme: invoices.filter(
        (i) => i.msmeUrgency === 'RED_OVERDUE' || i.msmeUrgency === 'ORANGE'
      ).length
    };
  }, [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Tab Filter
      if (activeTab === 'HOLD' && inv.compliance_gate_status !== 'HOLD') return false;
      if (activeTab === 'PASS' && inv.compliance_gate_status !== 'PASS') return false;
      if (activeTab === 'REJECT' && inv.compliance_gate_status !== 'REJECT') return false;
      if (
        activeTab === 'MSME_EXPIRING' &&
        inv.msmeUrgency !== 'RED_OVERDUE' &&
        inv.msmeUrgency !== 'ORANGE'
      ) {
        return false;
      }

      // Search Filter
      if (effectiveSearch) {
        const invNum = inv.invoice_number?.toLowerCase() || '';
        const venName = inv.vendor?.name?.toLowerCase() || '';
        const gstin = inv.vendor?.gstin?.toLowerCase() || '';
        const poNum = inv.po?.po_number?.toLowerCase() || '';
        const grnNum = inv.grn?.grn_number?.toLowerCase() || '';

        const matches =
          invNum.includes(effectiveSearch) ||
          venName.includes(effectiveSearch) ||
          gstin.includes(effectiveSearch) ||
          poNum.includes(effectiveSearch) ||
          grnNum.includes(effectiveSearch);

        if (!matches) return false;
      }

      return true;
    });
  }, [invoices, activeTab, effectiveSearch]);

  // Action Handlers
  const handlePass = async (e: React.MouseEvent, inv: InvoiceWithDetails) => {
    e.stopPropagation();
    await updateInvoiceStatus(
      inv.id,
      'PASS',
      `Payment release authorized by AP Specialist (Invoice ${inv.invoice_number})`
    );
    setActionFeedback({
      id: inv.id,
      action: 'PASS',
      message: `${inv.invoice_number} released for bank disbursement.`
    });
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleHold = async (e: React.MouseEvent, inv: InvoiceWithDetails) => {
    e.stopPropagation();
    await updateInvoiceStatus(
      inv.id,
      'HOLD',
      `Invoice gated on compliance hold by AP Specialist (Invoice ${inv.invoice_number})`
    );
    setActionFeedback({
      id: inv.id,
      action: 'HOLD',
      message: `${inv.invoice_number} held under compliance gate.`
    });
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleReject = async (e: React.MouseEvent, inv: InvoiceWithDetails) => {
    e.stopPropagation();
    await updateInvoiceStatus(
      inv.id,
      'REJECT',
      `Invoice rejected due to statutory non-compliance or fraud risk (Invoice ${inv.invoice_number})`
    );
    setActionFeedback({
      id: inv.id,
      action: 'REJECT',
      message: `${inv.invoice_number} rejected. Vendor notified.`
    });
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Invoices */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Total Inward Invoices
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {metrics.totalInvoicesCount}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-600">
              {formatCompactINR(metrics.totalSpend)}
            </span>
          </div>
          <p className="mt-1 text-3xs text-slate-400">Ingested via ERP & GSP connectors</p>
        </div>

        {/* Card 2: Ready to Release (Pass) */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-card">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800">
              Ready to Release (Pass)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-950 tracking-tight">
              {formatCompactINR(metrics.totalPassedAmount)}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
              {metrics.passedCount} Invoices
            </span>
          </div>
          <p className="mt-1 text-3xs text-emerald-700">
            Cleared 3-Way Match & GSTR-2B Section 16(2)(aa)
          </p>
        </div>

        {/* Card 3: Held Working Capital */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 shadow-card">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-900">
              Held Working Capital
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-950 tracking-tight">
              {formatCompactINR(metrics.totalHeldAmount)}
            </span>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
              {metrics.heldCount} Gated
            </span>
          </div>
          <p className="mt-1 text-3xs text-amber-800">Funds protected against discrepancy & non-filing</p>
        </div>

        {/* Card 4: Blocked ITC Risk */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 shadow-card">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-2xs font-bold uppercase tracking-wider text-rose-900">
              Blocked ITC Risk
            </span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-950 tracking-tight">
              {formatCompactINR(metrics.itcProtected)}
            </span>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
              +18% p.a. Sec 50
            </span>
          </div>
          <p className="mt-1 text-3xs text-rose-800">Protected from unfiled supplier GSTR-1 returns</p>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionFeedback && (
        <div className="p-3 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-between shadow-lg animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">{actionFeedback.message}</span>
          </div>
          <span className="text-3xs font-mono text-slate-400 uppercase">Audit Appended</span>
        </div>
      )}

      {/* 2. Filter Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>All Invoices</span>
            <span className="text-3xs font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HOLD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'HOLD'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            <span>Gated On Hold</span>
            <span className="text-3xs font-mono px-1.5 py-0.2 rounded bg-amber-700/80 text-amber-100">
              {counts.hold}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PASS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PASS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <span>Ready to Release (Pass)</span>
            <span className="text-3xs font-mono px-1.5 py-0.2 rounded bg-emerald-700/80 text-emerald-100">
              {counts.pass}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REJECT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'REJECT'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-800 hover:bg-rose-50'
            }`}
          >
            <span>Rejected / Fraud Risk</span>
            <span className="text-3xs font-mono px-1.5 py-0.2 rounded bg-rose-700/80 text-rose-100">
              {counts.reject}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MSME_EXPIRING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'MSME_EXPIRING'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-orange-800 hover:bg-orange-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>MSME Expiring</span>
            <span className="text-3xs font-mono px-1.5 py-0.2 rounded bg-orange-700/80 text-orange-100">
              {counts.msme}
            </span>
          </button>
        </div>

        {/* Local Search input if not using header search */}
        {!searchFilter && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter queue rows..."
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
            />
          </div>
        )}
      </div>

      {/* 3. 10-Column Enterprise Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-3xs font-bold uppercase tracking-wider text-slate-500 select-none">
                <th className="py-3 px-3">1. Invoice # & Date</th>
                <th className="py-3 px-3">2. Vendor & MSME</th>
                <th className="py-3 px-3">3. PO Ref</th>
                <th className="py-3 px-3">4. GRN Ref</th>
                <th className="py-3 px-3 text-right">5. Gross Amount</th>
                <th className="py-3 px-3">6. 3-Way Match</th>
                <th className="py-3 px-3">7. GSTR-2B Status</th>
                <th className="py-3 px-3 text-right">8. TDS 194Q & Net</th>
                <th className="py-3 px-3 text-center">9. Risk Score</th>
                <th className="py-3 px-3 text-center">10. Gate Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    No invoices matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const vendor = inv.vendor;
                  const isRedOverdue = inv.msmeUrgency === 'RED_OVERDUE';
                  const isOrangeUrgent = inv.msmeUrgency === 'ORANGE';
                  const isYellow = inv.msmeUrgency === 'YELLOW';

                  // 3-Way status mapping
                  const isMatchExact = inv.match_status === 'EXACT_MATCH';
                  const isPriceVar = inv.match_status === 'PRICE_VARIANCE_HOLD';
                  const isQtyOver = inv.match_status === 'QUANTITY_OVERBILLING_HOLD';
                  const isTaxReject = inv.match_status === 'TAX_ARITHMETIC_REJECT';

                  // GSTR-2B status mapping
                  const is2bPass = inv.gstr2b_status === 'PASS_2B';
                  const is2bUnfiled = inv.gstr2b_status === 'HOLD_UNFILED';
                  const is2bMismatch = inv.gstr2b_status === 'HOLD_VALUE_MISMATCH';

                  return (
                    <tr
                      key={inv.id}
                      onClick={() => onInspectInvoice(inv)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* 1. Invoice # & Date */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {inv.invoice_number}
                        </div>
                        <div className="text-3xs text-slate-400 font-mono mt-0.5">
                          {inv.invoice_date}
                        </div>
                      </td>

                      {/* 2. Vendor & MSME */}
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="font-medium text-slate-900 truncate" title={vendor?.name}>
                          {vendor?.name || 'Unknown Vendor'}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {/* MSME Category Pill */}
                          <span className="text-3xs font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {vendor?.msme_category || 'NOT_MSME'}
                          </span>

                          {/* Section 43B(h) Countdown */}
                          {isRedOverdue && (
                            <span className="text-3xs font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                              OVERDUE! (Day {inv.daysElapsed}/45)
                            </span>
                          )}
                          {isOrangeUrgent && (
                            <span className="text-3xs font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-200">
                              {inv.daysRemaining}d Left (Urgent)
                            </span>
                          )}
                          {isYellow && (
                            <span className="text-3xs font-medium px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              {inv.daysRemaining}d Left
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. PO Ref */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-xs text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          {inv.po?.po_number || 'NO_PO'}
                        </span>
                      </td>

                      {/* 4. GRN Ref & Acceptance */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-2xs text-slate-700">
                          {inv.grn?.grn_number || 'NO_GRN'}
                        </div>
                        <span
                          className={`text-3xs font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                            inv.grn?.status === 'ACCEPTED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : inv.grn?.status === 'PARTIALLY_ACCEPTED'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {inv.grn?.status || 'PENDING'}
                        </span>
                      </td>

                      {/* 5. Gross Invoice Amount */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-mono font-bold tabular-nums text-slate-900">
                          {formatINR(inv.total_amount)}
                        </div>
                        <div className="text-3xs text-slate-400 font-mono">
                          Tax: {formatINR(inv.tax_amount)}
                        </div>
                      </td>

                      {/* 6. 3-Way Match Status */}
                      <td className="py-3.5 px-3">
                        {isMatchExact && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> Exact Match
                          </span>
                        )}
                        {isPriceVar && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Price Variance
                          </span>
                        )}
                        {isQtyOver && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <AlertOctagon className="w-3 h-3 text-rose-600" /> Qty Overbilling
                          </span>
                        )}
                        {isTaxReject && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <AlertOctagon className="w-3 h-3 text-rose-600" /> Tax Mismatch
                          </span>
                        )}
                      </td>

                      {/* 7. GSTR-2B Filing Status */}
                      <td className="py-3.5 px-3">
                        {is2bPass && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified in 2B
                          </span>
                        )}
                        {is2bUnfiled && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
                            <ShieldAlert className="w-3 h-3 text-rose-600" /> Missing / Unfiled
                          </span>
                        )}
                        {is2bMismatch && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Value Mismatch
                          </span>
                        )}
                      </td>

                      {/* 8. TDS 194Q & Net Payable */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-mono font-bold tabular-nums text-slate-900">
                          {formatINR(inv.net_payable)}
                        </div>
                        <div className="text-3xs font-mono">
                          {inv.tds_194q_amount > 0 ? (
                            <span className="text-indigo-600 font-semibold">
                              TDS: -{formatINR(inv.tds_194q_amount)} (0.1%)
                            </span>
                          ) : (
                            <span className="text-slate-400">TDS: ₹0 (Under ₹50L)</span>
                          )}
                        </div>
                      </td>

                      {/* 9. Risk Score */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center font-mono font-bold text-xs px-2 py-0.5 rounded-full border ${
                            inv.risk_score <= 25
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-glow-pass'
                              : inv.risk_score <= 65
                              ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-glow-hold'
                              : 'bg-rose-50 text-rose-800 border-rose-200 shadow-glow-veto'
                          }`}
                        >
                          {inv.risk_score}
                        </span>
                      </td>

                      {/* 10. Actions */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Pass Button */}
                          <button
                            type="button"
                            title="Release Payment (Pass)"
                            aria-label={`Pass ${inv.invoice_number}`}
                            onClick={(e) => handlePass(e, inv)}
                            className={`p-1.5 rounded-md text-xs font-semibold transition-colors ${
                              inv.compliance_gate_status === 'PASS'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          {/* Hold Button */}
                          <button
                            type="button"
                            title="Gate on Compliance Hold"
                            aria-label={`Hold ${inv.invoice_number}`}
                            onClick={(e) => handleHold(e, inv)}
                            className={`p-1.5 rounded-md text-xs font-semibold transition-colors ${
                              inv.compliance_gate_status === 'HOLD'
                                ? 'bg-amber-600 text-white'
                                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>

                          {/* Reject Button */}
                          <button
                            type="button"
                            title="Reject Invoice (Veto)"
                            aria-label={`Reject ${inv.invoice_number}`}
                            onClick={(e) => handleReject(e, inv)}
                            className={`p-1.5 rounded-md text-xs font-semibold transition-colors ${
                              inv.compliance_gate_status === 'REJECT'
                                ? 'bg-rose-600 text-white'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            }`}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {/* Inspect Drawer Trigger */}
                          <button
                            type="button"
                            title="Inspect 3-Way Match Line Items"
                            aria-label={`Inspect ${inv.invoice_number}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onInspectInvoice(inv);
                            }}
                            className="p-1.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Override Modal Trigger */}
                          <button
                            type="button"
                            title="Manager Override Release"
                            aria-label={`Override ${inv.invoice_number}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenOverride(inv);
                            }}
                            className="p-1.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ApQueueTable;
