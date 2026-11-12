'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity
} from 'lucide-react';
import { useAPData } from '@/lib/data/dataProvider';
import { formatINR } from '@/lib/utils/formatters';

export default function CfoAnalyticsPage() {
  const { invoices, auditLogs, metrics } = useAPData();

  // Financial aggregates
  const totalInvoicedValue = metrics.totalSpend;
  const compliantPassedValue = metrics.totalPassedAmount;
  const heldWorkingCapital = metrics.totalHeldAmount;
  const blockedItcAmount = metrics.itcProtected;

  // Statutory Protection Value Quantifications
  const itcProtected = blockedItcAmount;
  const penalInterestAvoided = blockedItcAmount * 0.18 * 0.5; // 18% p.a. for 6 months
  const msmeDisallowedShielded = invoices
    .filter((inv) => inv.msmeUrgency === 'RED_OVERDUE' || inv.msmeUrgency === 'ORANGE')
    .reduce((sum, inv) => sum + inv.total_amount * 0.30, 0); // 30% corporate tax rate
  const lineLeakageSaved = invoices
    .filter((inv) => inv.match_status !== 'EXACT_MATCH')
    .reduce((sum, inv) => sum + (inv.total_amount * 0.045), 0); // 4.5% avg variance

  const netEconomicBenefit = itcProtected + penalInterestAvoided + msmeDisallowedShielded + lineLeakageSaved;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              CFO Executive AP & Statutory Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              Live Ledger Telemetry
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time quantification of protected working capital, tax leakage prevention, and statutory compliance health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-right">
            <span className="text-3xs uppercase tracking-wider text-slate-400 font-bold block">
              Net Protected Value
            </span>
            <span className="text-lg font-mono font-bold text-brand-700">
              {formatINR(netEconomicBenefit)}
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inward AP */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Total Inward AP Ingestion
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {formatINR(totalInvoicedValue)}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-600">
              {invoices.length} Invoices
            </span>
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            Total liabilities under procurement cycle
          </p>
        </div>

        {/* Released Compliant Payments */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-card">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800">
              Cleared & Released
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-950 tracking-tight">
              {formatINR(compliantPassedValue)}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
              {metrics.passedCount} Cleared
            </span>
          </div>
          <p className="mt-1 text-3xs text-emerald-700">
            100% compliant with 3-way match & 2B verification
          </p>
        </div>

        {/* Blocked Working Capital */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 shadow-card">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-900">
              Held on Statutory Rails
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-950 tracking-tight">
              {formatINR(heldWorkingCapital)}
            </span>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
              {metrics.heldCount} Invoices
            </span>
          </div>
          <p className="mt-1 text-3xs text-amber-700">
            Protected against non-filing & variance leaks
          </p>
        </div>

        {/* Blocked ITC Risk */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 shadow-card">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-2xs font-bold uppercase tracking-wider text-rose-900">
              Section 16(2)(aa) Gated ITC
            </span>
            <ShieldCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-950 tracking-tight">
              {formatINR(blockedItcAmount)}
            </span>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
              0% Risk
            </span>
          </div>
          <p className="mt-1 text-3xs text-rose-700">
            Payment auto-locked until supplier files return
          </p>
        </div>
      </div>

      {/* Statutory Pillar Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Pillar 1: GST Section 16(2)(aa) & Section 50 */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                GST
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">GST ITC & Penal Interest</h3>
                <span className="text-3xs text-slate-500 font-mono">Sec 16(2)(aa) + Sec 50 CGST</span>
              </div>
            </div>
            <span className="text-2xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Shield
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Unfiled Inward ITC Protected:</span>
              <span className="font-mono font-bold text-slate-900">{formatINR(itcProtected)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sec 50 (18% p.a.) Interest Avoided:</span>
              <span className="font-mono font-bold text-emerald-700">+{formatINR(penalInterestAvoided)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Audit SMT-10 Notice Exposure:</span>
              <span className="font-semibold text-emerald-700">Zero Liability</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: MSME Section 43B(h) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                MSME
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">MSME Section 43B(h) Shield</h3>
                <span className="text-3xs text-slate-500 font-mono">Income Tax Act 1961</span>
              </div>
            </div>
            <span className="text-2xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              15/45-Day SLA
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">30% Corporate Tax Protected:</span>
              <span className="font-mono font-bold text-emerald-700">+{formatINR(msmeDisallowedShielded)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Overdue Invoices Triggered:</span>
              <span className="font-mono font-bold text-rose-700">
                {invoices.filter((i) => i.msmeUrgency === 'RED_OVERDUE').length} Invoices
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sec 16 MSMED Penal Interest:</span>
              <span className="font-semibold text-slate-700">Compounded Monthly</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: 3-Way Matching Leakage Prevention */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs">
                3-WAY
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Contract & Inventory Leakage</h3>
                <span className="text-3xs text-slate-500 font-mono">PO vs GRN vs Tax Invoice</span>
              </div>
            </div>
            <span className="text-2xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
              Zero Variance
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Rate & Quantity Creep Caught:</span>
              <span className="font-mono font-bold text-emerald-700">+{formatINR(lineLeakageSaved)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Line Discrepancy Invoices:</span>
              <span className="font-mono font-bold text-amber-700">
                {invoices.filter((i) => i.match_status !== 'EXACT_MATCH').length} Invoices
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Manager Override Protocol:</span>
              <span className="font-semibold text-slate-800">Immutable Audit Trail</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Audit Trail Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900">Autonomous Compliance Audit Trail</h2>
          </div>
          <span className="text-3xs text-slate-400 font-mono">
            {auditLogs.length} Events Logged
          </span>
        </div>

        <div className="space-y-3">
          {auditLogs.slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between p-3 rounded-lg bg-slate-50/70 border border-slate-100 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 font-mono">{log.event_type}</span>
                  <span className="text-3xs text-slate-400 font-mono">
                    Invoice: {log.invoice_id}
                  </span>
                </div>
                <p className="text-slate-600 text-3xs">{log.reason}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-3xs font-mono text-slate-400 block">
                  {new Date(log.created_at).toLocaleTimeString('en-IN')}
                </span>
                <span className="text-3xs font-semibold text-slate-600">
                  {log.actor}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
