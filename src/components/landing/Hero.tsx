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
  Lock,
  Zap,
  Building2,
  ArrowUpRight,
  Shield
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
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
      {/* Background ambient lighting & radial mesh glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-brand-300/35 via-indigo-200/25 to-emerald-200/25 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[450px] w-[550px] rounded-full bg-blue-200/20 blur-[110px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-200/90 bg-white/95 px-4 py-1.5 text-xs font-semibold text-indigo-900 shadow-card backdrop-blur-md mb-8 hover:border-indigo-300 transition-all hover:-translate-y-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600" />
            </span>
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            <span>Autonomous AP Payment Circuit-Breaker for Indian Enterprises</span>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              GSTN GSP Ready
            </span>
          </div>

          {/* High-Converting Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.14]">
            Stop Leaking GST Input Tax Credit.{' '}
            <span className="block mt-1.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              Compliance-Gate Every Vendor Payment.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            VetoRail synchronizes your ERP, GSTN GSTR-2B portal data, and bank disbursement rails to catch line-item discrepancies,
            auto-deduct Section 194Q TDS, enforce Section 43B(h) MSME clocks, and veto payment release until suppliers file their returns.
          </p>

          {/* Primary Action CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-2.5 rounded-xl bg-brand-600 px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-premium transition-all hover:bg-brand-700 hover:shadow-glow-brand hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Launch AP Command Rail
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>

            <a
              href="#roi-calculator"
              className="inline-flex items-center gap-2.5 rounded-xl border border-slate-300 bg-white/90 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 shadow-card transition-all hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
              Calculate ROI
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('circuit-breaker-demo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
            >
              <Sparkles className="h-4 w-4 text-brand-600" />
              View Live Demo
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Section 16(2)(aa) 100% Gated
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Section 43B(h) MSME SLA Defense
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Section 194Q Automated TDS
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Zero Integration Overhead
            </span>
          </div>
        </div>

        {/* 3-Node Architecture Pipeline Visualizer */}
        <div className="mx-auto mt-14 max-w-5xl">
          <div className="hidden md:grid grid-cols-3 gap-4 mb-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-card">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>1. Inward AP Data (SAP / Tally ERP)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50/90 border border-indigo-200/90 text-indigo-900 shadow-card">
              <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>2. VetoRail Autonomous Gating Hub</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-card">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>3. Bank Rail (RazorpayX / Host-to-Host)</span>
            </div>
          </div>
        </div>

        {/* Interactive Invoice Circuit-Breaker Preview Card with Floating Badges */}
        <div id="circuit-breaker-demo" className="mx-auto max-w-5xl relative">
          
          {/* Floating FinTech Badge 1 (Left) */}
          <div className="hidden xl:flex absolute -left-12 top-24 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-elevated px-3.5 py-2 rounded-2xl animate-float">
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">At-Risk Inward ITC</div>
              <div className="text-xs font-mono font-bold text-amber-800">₹7,35,254 Shielded</div>
            </div>
          </div>

          {/* Floating FinTech Badge 2 (Right) */}
          <div className="hidden xl:flex absolute -right-12 bottom-20 z-20 items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-elevated px-3.5 py-2 rounded-2xl animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">RazorpayX Connected</div>
              <div className="text-xs font-mono font-bold text-emerald-800">RTGS / NEFT Ready</div>
            </div>
          </div>

          {/* Main Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-premium overflow-hidden transition-all duration-300 ring-1 ring-slate-900/5">
            
            {/* Top Interactive Toolbar */}
            <div className="border-b border-slate-200 bg-slate-50/90 px-4 py-3.5 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white font-mono text-xs font-bold shadow-sm">
                  AP
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    Autonomous Circuit-Breaker Gate Preview
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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
              <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between bg-white rounded-2xl border border-slate-200 p-1.5 shadow-subtle">
                <span className="text-xs font-medium text-slate-600 pl-2">
                  Simulate GSTR-2B:
                </span>
                <button
                  type="button"
                  onClick={() => setIs2bFiled(!is2bFiled)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shadow-xs ${
                    is2bFiled
                      ? 'bg-emerald-600 text-white shadow-glow-pass hover:bg-emerald-700'
                      : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  }`}
                >
                  <RefreshCw className={`h-3 w-3 ${is2bFiled ? '' : 'animate-spin'}`} style={{ animationDuration: '4s' }} />
                  {is2bFiled ? 'Vendor Return Filed (PASS)' : 'Vendor Unfiled (HOLD)'}
                </button>
              </div>
            </div>

            {/* Circuit-Breaker Active Verdict Banner */}
            <div
              className={`px-4 py-4 sm:px-6 border-b transition-colors duration-300 ${
                is2bFiled
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/90 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  {is2bFiled ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-glow-pass">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-glow-veto">
                      <Ban className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {is2bFiled ? 'Circuit-Breaker Verdict: PASS (Ready for Bank Release)' : 'Circuit-Breaker Verdict: COMPLIANCE VETO ACTIVE'}
                    </div>
                    <div className="text-xs text-slate-700 mt-0.5">
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
                  <span>Invoice: <strong className="text-slate-900 font-semibold">{invoiceData.invoiceNumber}</strong></span>
                  <span>•</span>
                  <span>PO: <strong className="text-slate-900 font-semibold">{invoiceData.poRef}</strong></span>
                  <span>•</span>
                  <span>GRN: <strong className="text-slate-900 font-semibold">{invoiceData.grnRef}</strong></span>
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
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Gross Invoice
                  </div>
                  <div className="mt-1.5 font-mono text-xl font-bold tabular-nums text-slate-900">
                    {formatINR(invoiceData.grossAmount)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Taxable: {formatINR(invoiceData.taxableAmount)}
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-900">
                    Inward ITC at Risk
                  </div>
                  <div className="mt-1.5 font-mono text-xl font-bold tabular-nums text-amber-800">
                    {formatINR(invoiceData.itcAmount)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-amber-700">
                    18% IGST under Sec 16(2)(aa)
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-4 shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-900">
                    Sec 194Q TDS (0.1%)
                  </div>
                  <div className="mt-1.5 font-mono text-xl font-bold tabular-nums text-indigo-700">
                    -{formatINR(invoiceData.tdsAmount)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-indigo-700">
                    FY Spend &gt; ₹50 Lakhs
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Net Disbursement
                  </div>
                  <div className="mt-1.5 font-mono text-xl font-bold tabular-nums text-slate-900">
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
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
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
                          <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-3 py-2.5 font-medium text-slate-900">
                              {line.item} <span className="text-[10px] text-slate-400 font-mono">(HSN {line.hsn})</span>
                            </td>
                            <td className="px-3 py-2.5 font-mono text-slate-700">{line.poQty}</td>
                            <td className="px-3 py-2.5 font-mono text-slate-700">{line.grnQty}</td>
                            <td className="px-3 py-2.5 font-mono text-slate-700">{line.invQty}</td>
                            <td className="px-3 py-2.5 font-mono text-slate-700">{formatINR(line.rate)}</td>
                            <td className="px-3 py-2.5">
                              <span className="badge-pass text-[10px] py-0.5 px-2">
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
                  Bank Disbursement API: <strong className="text-slate-700">RazorpayX / Host-to-Host Connected</strong>
                </div>

                <div className="flex items-center gap-3">
                  {is2bFiled ? (
                    <Link
                      href="/app"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-glow-pass transition-all hover:bg-emerald-700 hover:shadow-lg"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Release Payment via AP Rail (Pass)
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 border border-amber-300 shadow-xs">
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

export default Hero;
