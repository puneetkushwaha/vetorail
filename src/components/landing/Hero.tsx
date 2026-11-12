'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Ban,
  Layers,
  RefreshCw,
  Sparkles,
  Smartphone,
  Check
} from 'lucide-react';
import { GsapFadeIn } from '@/components/animations/GsapAnimations';

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
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 bg-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 h-[600px] w-[800px] rounded-full bg-blue-50/80 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 -left-40 -z-10 h-[500px] w-[600px] rounded-full bg-indigo-50/60 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: High-Converting Headline & CTAs (RazorpayX Style) */}
          <div className="lg:col-span-6 space-y-6">
            
            <GsapFadeIn delay={0.1} yOffset={20}>
              {/* Category Pill with Green Arrow Indicator (RazorpayX Style) */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                <span className="text-brand-600 font-bold">|</span>
                <span>Current Account &amp; AP Rail</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                  ↗
                </span>
              </div>
            </GsapFadeIn>

            <GsapFadeIn delay={0.2} yOffset={25}>
              {/* High-Converting Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Stop Leaking GST Input Tax Credit.{' '}
                <span className="block mt-2 text-brand-600">
                  Compliance-Gate Every Vendor Payment.
                </span>
              </h1>
            </GsapFadeIn>

            <GsapFadeIn delay={0.3} yOffset={20}>
              {/* Subheadline (RazorpayX "The command centre" language) */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                The command centre for your enterprise finance. VetoRail synchronizes your ERP, GSTN GSTR-2B portal data, and bank disbursement rails to catch line-item discrepancies, auto-deduct Section 194Q TDS, enforce Section 43B(h) MSME clocks, and veto payment release until suppliers file their returns.
              </p>
            </GsapFadeIn>

            <GsapFadeIn delay={0.4} yOffset={20}>
              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-premium transition-all hover:bg-brand-700 hover:shadow-glow-brand hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  <span>Launch AP Command Rail</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#roi-calculator"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm sm:text-base font-bold text-slate-700 shadow-card transition-all hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5 focus:outline-none"
                >
                  <Calculator className="h-4 w-4 text-slate-500" />
                  <span>Calculate ROI</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('circuit-breaker-demo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  <span>View Live Demo</span>
                </button>
              </div>
            </GsapFadeIn>

            <GsapFadeIn delay={0.5} yOffset={15}>
              {/* Partner Banks Strip (Screenshot 1 Authentic RazorpayX Feature) */}
              <div className="pt-6 border-t border-slate-200/80">
                <div className="text-2xs uppercase font-bold tracking-wider text-slate-400 mb-2.5">
                  Current Account &amp; AP Rails powered by:
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono font-bold text-slate-700">
                  <span className="hover:text-brand-600 transition-colors">IDFC FIRST Bank</span>
                  <span>•</span>
                  <span className="hover:text-brand-600 transition-colors">ICICI Bank</span>
                  <span>•</span>
                  <span className="hover:text-brand-600 transition-colors">RBL Bank</span>
                  <span>•</span>
                  <span className="hover:text-brand-600 transition-colors">YES BANK</span>
                  <span>•</span>
                  <span className="hover:text-brand-600 transition-colors">Axis Bank</span>
                  <span>•</span>
                  <span className="text-brand-600 font-extrabold">RazorpayX Rail</span>
                </div>
              </div>
            </GsapFadeIn>

          </div>

          {/* RIGHT COLUMN: RazorpayX Authentic Desktop Dashboard + Floating Mobile Approval Card */}
          <div className="lg:col-span-6 relative" id="circuit-breaker-demo">
            
            {/* Background Desktop Mockup Screen */}
            <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 shadow-elevated">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-brand-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    VR
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">Business Banking+</span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  b RBL Bank Connected
                </span>
              </div>

              {/* Working Capital Balance */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-4">
                <div className="text-3xs uppercase font-bold text-slate-400">Available Working Capital</div>
                <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
                  ₹4,82,00,000<span className="text-slate-400 text-lg">.00</span>
                </div>
                {/* SVG Sparkline Graph */}
                <div className="mt-3 h-10 w-full">
                  <svg viewBox="0 0 300 40" className="w-full h-full stroke-emerald-500 fill-none" strokeWidth="2">
                    <path d="M0,35 Q40,30 80,15 T160,22 T240,10 T300,5" />
                  </svg>
                </div>
              </div>

              {/* Quick Nav Pills */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-600">
                <div className="p-2 rounded-xl bg-white border border-slate-200 font-bold text-brand-700">Smart Payouts</div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">API Payouts</div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">Contacts</div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">Reports</div>
              </div>
            </div>

            {/* FOREGROUND: Floating Mobile Device Phone Frame (RazorpayX Style) */}
            <div className="mt-6 sm:-mt-12 sm:ml-12 relative z-20">
              <div className="rounded-3xl border-2 border-slate-900 bg-white shadow-2xl p-4 sm:p-5 max-w-md mx-auto ring-4 ring-slate-900/5">
                
                {/* Mobile Phone Top Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-black tracking-tight text-slate-900">VetoRail Mobile AP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-700">Live Webhook</span>
                  </div>
                </div>

                {/* Workflow Hierarchy Avatars (Screenshot 1: Manager Design -> IT Department -> Anuj Verma) */}
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">Manager Design</span>
                  </div>
                  <span className="text-slate-300">→</span>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">IT Department</span>
                  </div>
                </div>

                {/* Approval Request Banner */}
                <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3.5 text-center mb-3">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-brand-700">Approval Request</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Anuj Verma <span className="font-normal text-slate-500">(Finance Manager)</span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                    ₹17,200
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    Tata Steel Stevedoring Pvt Ltd ({invoiceData.invoiceNumber})
                  </div>
                </div>

                {/* Interactive Circuit Breaker Simulator Control */}
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2 mb-3 border border-slate-200">
                  <span className="text-2xs font-semibold text-slate-600 pl-1">
                    Simulate GSTR-2B:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIs2bFiled(!is2bFiled)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all shadow-xs ${
                      is2bFiled
                        ? 'bg-emerald-600 text-white shadow-glow-pass'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 ${is2bFiled ? '' : 'animate-spin'}`} style={{ animationDuration: '4s' }} />
                    {is2bFiled ? 'Vendor Return Filed (PASS)' : 'Vendor Unfiled (HOLD)'}
                  </button>
                </div>

                {/* Statutory Verdict Status Box */}
                <div
                  className={`p-3 rounded-xl border text-xs mb-3 transition-colors ${
                    is2bFiled
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {is2bFiled
                        ? 'Circuit-Breaker Verdict: PASS'
                        : 'Circuit-Breaker Verdict: COMPLIANCE VETO ACTIVE'}
                    </span>
                    <span className={is2bFiled ? 'badge-pass text-[10px] py-0 px-2' : 'badge-veto text-[10px] py-0 px-2'}>
                      {is2bFiled ? 'APPROVED' : 'BLOCKED'}
                    </span>
                  </div>
                  <div className="text-[11px] mt-1 opacity-90">
                    {is2bFiled
                      ? 'All 3 statutory gates validated. Section 16(2)(aa) verified, Section 194Q deducted.'
                      : 'Supplier return missing in GSTR-2B. Releasing payment risks ₹7,35,254 unclaimable ITC + 18% interest.'}
                  </div>
                </div>

                {/* Statutory Triad Indicators */}
                <div className="flex items-center justify-between gap-1 text-[10px] font-semibold mb-3">
                  <span className="badge-pass py-0.5 px-2">3-Way: 100% Match</span>
                  <span className="badge-msme py-0.5 px-2">MSME: 3 Days Left</span>
                </div>

                {/* Line Item Toggle */}
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => setShowLineItems(!showLineItems)}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3" />
                    <span>{showLineItems ? 'Hide Line-Item Matching Breakdown' : 'Inspect Line-Item Matching Breakdown'}</span>
                  </button>

                  {showLineItems && (
                    <div className="mt-2 text-3xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Heavy Port Logistics Handling</span>
                        <span className="text-emerald-700">800/800 Exact</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Intermodal Barge Drayage</span>
                        <span className="text-emerald-700">200/200 Exact</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Action Buttons (RazorpayX Approve/Decline layout) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {is2bFiled ? (
                    <Link
                      href="/app"
                      className="col-span-2 text-center rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Release Payment via AP Rail (Pass)</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled
                        className="rounded-xl bg-slate-200 text-slate-400 font-bold py-2 text-xs cursor-not-allowed"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 text-xs shadow-sm transition-all flex items-center justify-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}
                </div>

              </div>

              {/* Caption text from Screenshot 1 */}
              <div className="text-center mt-3 text-xs font-bold text-emerald-700">
                Built to scale for businesses of all sizes
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
