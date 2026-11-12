'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Clock,
  Layers,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock
} from 'lucide-react';
import { formatINR } from './formatters';

export function Hero() {
  // Interactive state for the live invoice circuit-breaker demo
  const [is2bFiled, setIs2bFiled] = useState(false);
  const [showLineItems, setShowLineItems] = useState(false);

  // Invoice parameters
  const invoiceData = {
    invoiceNumber: 'INV-2024-9182',
    invoiceDate: '12 Nov 2024',
    dueDate: '27 Nov 2024',
    vendorName: 'Tata Steel Stevedoring Pvt Ltd',
    gstin: '27AABCT9981F1Z3',
    msmeCategory: 'SMALL (MSMED 45-Day Rule)',
    msmeDaysRemaining: 3,
    poRef: 'PO-2024-8841',
    grnRef: 'GRN-2024-6102',
    taxableAmount: 4084746,
    itcAmount: 735254, // 18% GST
    grossAmount: 4820000,
    tdsRate: '0.1%',
    tdsAmount: 4820,
    netPayable: 4815180,
    lines: [
      {
        item: 'Heavy Port Logistics Handling',
        hsn: '9965',
        poQty: 800,
        grnQty: 800,
        invQty: 800,
        rate: 4500,
        status: 'EXACT_MATCH'
      },
      {
        item: 'Intermodal Barge Drayage (200 hrs)',
        hsn: '9965',
        poQty: 200,
        grnQty: 200,
        invQty: 200,
        rate: 6100,
        status: 'EXACT_MATCH'
      }
    ]
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-400 to-indigo-200 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/90 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-800 shadow-subtle mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            <span>Autonomous AP Payment Circuit-Breaker for Indian Enterprises</span>
          </div>

          {/* High-Converting Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
            Stop Leaking GST Input Tax Credit.{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800 bg-clip-text text-transparent">
              Compliance-Gate Every Vendor Payment.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed font-normal">
            VetoRail synchronizes your ERP, GSTN GSTR-2B portal data, and bank disbursement rails to catch line-item discrepancies,
            auto-deduct Section 194Q TDS, enforce Section 43B(h) MSME clocks, and veto payment release until suppliers file their returns.
          </p>

          {/* Primary Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-2.5 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-elevated transition hover:bg-brand-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Launch AP Command Rail
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#roi-calculator"
              className="inline-flex items-center gap-2.5 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <Calculator className="h-5 w-5 text-slate-500" />
              Calculate ROI
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('circuit-breaker-demo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              <Sparkles className="h-4 w-4 text-brand-600" />
              View Live Demo
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Section 16(2)(aa) 100% Gated
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Section 43B(h) MSME SLA Defense
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Section 194Q Automated TDS
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Zero Integration Overhead
            </span>
          </div>
        </div>

        {/* Interactive Invoice Circuit-Breaker Preview Card */}
        <div id="circuit-breaker-demo" className="mx-auto mt-14 max-w-4xl">
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-elevated overflow-hidden transition-all duration-300">
            {/* Top Interactive Toolbar */}
            <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-100 text-brand-700 font-mono text-xs font-bold">
                  AP
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    Autonomous Circuit-Breaker Gate Preview
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {invoiceData.vendorName}
                    <span className="font-mono text-xs text-slate-500 font-normal">
                      ({invoiceData.gstin})
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Simulation Switcher */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between bg-white rounded-lg border border-slate-200 p-1.5 shadow-subtle">
                <span className="text-xs font-medium text-slate-600 pl-2">
                  Simulate GSTR-2B:
                </span>
                <button
                  type="button"
                  onClick={() => setIs2bFiled(!is2bFiled)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                    is2bFiled
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  <RefreshCw className="h-3 w-3" />
                  {is2bFiled ? 'Vendor Return Filed (PASS)' : 'Vendor Unfiled (HOLD)'}
                </button>
              </div>
            </div>

            {/* Circuit-Breaker Active Verdict Banner */}
            <div
              className={`px-4 py-3 sm:px-6 border-b transition-colors duration-300 ${
                is2bFiled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {is2bFiled ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-glow-pass">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-glow-veto">
                      <Ban className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {is2bFiled ? 'Circuit-Breaker Verdict: PASS (Ready for Bank Release)' : 'Circuit-Breaker Verdict: COMPLIANCE VETO ACTIVE'}
                    </div>
                    <div className="text-xs text-slate-700">
                      {is2bFiled
                        ? 'All 3 statutory gates validated. Section 16(2)(aa) verified, Section 194Q deducted. Disbursement safe.'
                        : 'Supplier return not reflected in GSTR-2B. Releasing payment risks ₹7,35,254 unclaimable ITC + 18% p.a. penal interest under Section 50.'}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <span
                    className={
                      is2bFiled
                        ? 'badge-pass'
                        : 'badge-veto'
                    }
                  >
                    {is2bFiled ? 'DISBURSEMENT APPROVED' : 'PAYMENT BLOCKED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Statutory Triad Badges & Metadata */}
            <div className="p-4 sm:p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Invoice: <strong className="text-slate-900">{invoiceData.invoiceNumber}</strong></span>
                  <span>•</span>
                  <span>PO: <strong className="text-slate-900">{invoiceData.poRef}</strong></span>
                  <span>•</span>
                  <span>GRN: <strong className="text-slate-900">{invoiceData.grnRef}</strong></span>
                </div>

                {/* Statutory Triad Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Gate 1: 3-Way Match */}
                  <span className="badge-pass" title="Line items match PO and GRN within 0% tolerance">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    3-Way: 100% Match
                  </span>

                  {/* Gate 2: GSTR-2B Status */}
                  {is2bFiled ? (
                    <span className="badge-pass" title="Found in auto-drafted GSTR-2B snapshot">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      GSTR-2B: Reflected (Pass)
                    </span>
                  ) : (
                    <span className="badge-hold" title="Missing in auto-drafted GSTR-2B snapshot">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      GSTR-2B: Unfiled (Hold)
                    </span>
                  )}

                  {/* Gate 3: MSME 43B(h) */}
                  <span className="badge-msme" title="MSME Small enterprise 45-day payment statutory countdown">
                    <Clock className="h-3.5 w-3.5 text-orange-600" />
                    MSME: {invoiceData.msmeDaysRemaining} Days Left
                  </span>
                </div>
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Gross Invoice
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900">
                    {formatINR(invoiceData.grossAmount)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Taxable: {formatINR(invoiceData.taxableAmount)}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                    Inward ITC at Risk
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold tabular-nums text-amber-700">
                    {formatINR(invoiceData.itcAmount)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-amber-700/80">
                    18% IGST under Sec 16(2)(aa)
                  </div>
                </div>

                <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/40 p-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-800">
                    Sec 194Q TDS (0.1%)
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold tabular-nums text-indigo-700">
                    -{formatINR(invoiceData.tdsAmount)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-indigo-700/80">
                    FY Spend &gt; ₹50 Lakhs
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Net Disbursement
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900">
                    {formatINR(invoiceData.netPayable)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    After statutory withholding
                  </div>
                </div>
              </div>

              {/* Line Items Drawer Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowLineItems(!showLineItems)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
                >
                  <Layers className="h-3.5 w-3.5" />
                  {showLineItems ? 'Hide Line-Item Matching Breakdown' : 'Inspect Line-Item Matching Breakdown (2 lines)'}
                  {showLineItems ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showLineItems && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 bg-slate-100 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Description / HSN</th>
                          <th className="px-3 py-2 font-semibold font-mono">PO Qty</th>
                          <th className="px-3 py-2 font-semibold font-mono">GRN Qty</th>
                          <th className="px-3 py-2 font-semibold font-mono">Inv Qty</th>
                          <th className="px-3 py-2 font-semibold font-mono">Rate (INR)</th>
                          <th className="px-3 py-2 font-semibold">Match Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {invoiceData.lines.map((line, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 font-medium text-slate-900">
                              {line.item} <span className="text-[10px] text-slate-400 font-mono">(HSN {line.hsn})</span>
                            </td>
                            <td className="px-3 py-2 font-mono text-slate-700">{line.poQty}</td>
                            <td className="px-3 py-2 font-mono text-slate-700">{line.grnQty}</td>
                            <td className="px-3 py-2 font-mono text-slate-700">{line.invQty}</td>
                            <td className="px-3 py-2 font-mono text-slate-700">{formatINR(line.rate)}</td>
                            <td className="px-3 py-2">
                              <span className="badge-pass text-[10px] py-0 px-2">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                Exact
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Action Button Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  Bank Disbursement API: <strong>RazorpayX / Host-to-Host Connected</strong>
                </div>

                <div className="flex items-center gap-3">
                  {is2bFiled ? (
                    <Link
                      href="/app"
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-glow-pass transition hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Release Payment via AP Rail (Pass)
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900 border border-amber-300">
                      <Ban className="h-4 w-4 text-rose-600" />
                      Disbursement Vetoed · Vendor Auto-Notified
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
