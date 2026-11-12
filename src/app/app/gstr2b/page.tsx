'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  ShieldCheck,
  Database
} from 'lucide-react';
import { useAPData } from '@/lib/data/dataProvider';
import { formatINR } from '@/lib/utils/formatters';

export default function Gstr2bSimulatorPage() {
  const { invoices, simulateGstr2bSync } = useAPData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PASS_2B' | 'HOLD_UNFILED'>('ALL');
  const [syncingInvoice, setSyncingInvoice] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.vendor?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.vendor?.gstin || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    return inv.gstr2b_status === filterStatus;
  });

  // Calculate high-level GSTR-2B compliance metrics
  const totalInwardTax = invoices.reduce((sum, inv) => sum + inv.tax_amount, 0);
  const verifiedItc = invoices
    .filter((inv) => inv.gstr2b_status === 'PASS_2B')
    .reduce((sum, inv) => sum + inv.tax_amount, 0);
  const atRiskItc = invoices
    .filter((inv) => inv.gstr2b_status === 'HOLD_UNFILED')
    .reduce((sum, inv) => sum + inv.tax_amount, 0);
  const penalInterestExposure = atRiskItc * 0.18 * 0.5; // 18% p.a. for 6 months latency

  const handleSimulateSync = async (vendorGstin: string, invoiceNumber: string) => {
    try {
      setSyncingInvoice(invoiceNumber);
      setSyncSuccessMsg(null);
      const success = await simulateGstr2bSync(vendorGstin, invoiceNumber);
      if (success) {
        setSyncSuccessMsg(`Invoice ${invoiceNumber} successfully synced with GSTN GSTR-2B! Payment gate unlocked.`);
        setTimeout(() => setSyncSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error('Error syncing GSTR-2B:', err);
    } finally {
      setSyncingInvoice(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              GSTR-2B Real-Time Reconciliation Simulator
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Database className="w-3.5 h-3.5" />
              GSTN Sandbox Ready
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Autonomous Section 16(2)(aa) & Rule 36(4) verification rail. Inward ITC is auto-gated until supplier files GSTR-1.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-3xs uppercase tracking-wider text-slate-400 font-bold block">
              Auto-Draft Cycle
            </span>
            <span className="text-xs font-mono font-semibold text-slate-700">
              14th of Every Month
            </span>
          </div>
        </div>
      </div>

      {/* Statutory Alert Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">MANDATORY RULE 36(4) ENFORCEMENT:</strong>
          <span className="ml-1 text-amber-800">
            Effective January 1, 2022, 0% provisional ITC is permitted. Claiming input tax credit on unfiled invoices incurs 18% p.a. mandatory penal interest under Section 50(1) CGST Act. VetoRail automatically blocks payments to non-filing vendors to insulate enterprise cashflow.
          </span>
        </div>
      </div>

      {/* Sync Success Feedback Notification */}
      {syncSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{syncSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSyncSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inward Tax */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Total Inward GST Tax
            </span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {formatINR(totalInwardTax)}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-600">
              {invoices.length} Invoices
            </span>
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            Across CGST, SGST & IGST line items
          </p>
        </div>

        {/* Reconciled & Eligible ITC */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-card">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800">
              Reconciled & Eligible ITC
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-950 tracking-tight">
              {formatINR(verifiedItc)}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
              {invoices.filter((i) => i.gstr2b_status === 'PASS_2B').length} Invoices
            </span>
          </div>
          <p className="mt-1 text-3xs text-emerald-700">
            100% matched with GSTR-2B inward statements
          </p>
        </div>

        {/* At-Risk Unfiled ITC */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 shadow-card">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-2xs font-bold uppercase tracking-wider text-rose-900">
              At-Risk Unfiled ITC (Locked)
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-950 tracking-tight">
              {formatINR(atRiskItc)}
            </span>
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
              {invoices.filter((i) => i.gstr2b_status === 'HOLD_UNFILED').length} Blocked
            </span>
          </div>
          <p className="mt-1 text-3xs text-rose-700">
            Auto-gated on AP payment rail
          </p>
        </div>

        {/* Penal Interest Avoided */}
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 shadow-card">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-2xs font-bold uppercase tracking-wider text-indigo-800">
              Sec 50 Interest Shield
            </span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-indigo-950 tracking-tight">
              {formatINR(penalInterestExposure)}
            </span>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200">
              18% p.a.
            </span>
          </div>
          <p className="mt-1 text-3xs text-indigo-700">
            Shielded from DRC-01 audit recovery notices
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice, vendor or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setFilterStatus('PASS_2B')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterStatus === 'PASS_2B'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Verified in 2B ({invoices.filter((i) => i.gstr2b_status === 'PASS_2B').length})
          </button>
          <button
            onClick={() => setFilterStatus('HOLD_UNFILED')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterStatus === 'HOLD_UNFILED'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Unfiled / Blocked ({invoices.filter((i) => i.gstr2b_status === 'HOLD_UNFILED').length})
          </button>
        </div>
      </div>

      {/* GSTR-2B Inward Matching Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600 text-2xs uppercase tracking-wider">
                <th className="py-3 px-3.5">Invoice # & Date</th>
                <th className="py-3 px-3.5">Vendor & Supplier GSTIN</th>
                <th className="py-3 px-3.5 text-right">Taxable Amount</th>
                <th className="py-3 px-3.5 text-right">GST Tax Amount</th>
                <th className="py-3 px-3.5 text-right">Total Invoice Value</th>
                <th className="py-3 px-3.5 text-center">GSTR-2B Status</th>
                <th className="py-3 px-3.5 text-center">Payment Gate</th>
                <th className="py-3 px-3.5 text-right">Simulation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInvoices.map((inv) => {
                const isVerified = inv.gstr2b_status === 'PASS_2B';
                const isSyncing = syncingInvoice === inv.invoice_number;

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Invoice # & Date */}
                    <td className="py-3 px-3.5">
                      <div className="font-mono font-bold text-slate-900">{inv.invoice_number}</div>
                      <div className="text-3xs text-slate-400 font-mono">{inv.invoice_date}</div>
                    </td>

                    {/* Vendor & GSTIN */}
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-800">{inv.vendor?.name || 'Vendor'}</div>
                      <div className="text-3xs font-mono text-slate-500">{inv.vendor?.gstin}</div>
                    </td>

                    {/* Taxable Amount */}
                    <td className="py-3 px-3.5 text-right font-mono font-medium text-slate-700">
                      {formatINR(inv.subtotal)}
                    </td>

                    {/* GST Tax Amount */}
                    <td className="py-3 px-3.5 text-right font-mono font-semibold text-slate-900">
                      {formatINR(inv.tax_amount)}
                    </td>

                    {/* Total Invoice Value */}
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">
                      {formatINR(inv.total_amount)}
                    </td>

                    {/* GSTR-2B Status */}
                    <td className="py-3 px-3.5 text-center">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-3xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified in 2B
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-3xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Unfiled on GSTN
                        </span>
                      )}
                    </td>

                    {/* Payment Gate */}
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-flex items-center justify-center font-bold text-3xs px-2.5 py-0.5 rounded-full border ${
                          inv.compliance_gate_status === 'PASS'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : inv.compliance_gate_status === 'HOLD'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {inv.compliance_gate_status}
                      </span>
                    </td>

                    {/* Simulation Action */}
                    <td className="py-3 px-3.5 text-right">
                      {isVerified ? (
                        <span className="text-3xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          ITC Claim Legitimate
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSimulateSync(inv.vendor?.gstin || '', inv.invoice_number)}
                          disabled={isSyncing}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-2xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing ? 'Syncing...' : 'Simulate Vendor Filing'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching invoices found in GSTR-2B reconciliation queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
