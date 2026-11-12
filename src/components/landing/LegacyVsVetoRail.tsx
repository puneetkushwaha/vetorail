'use client';

import React from 'react';
import { Check, X, Zap } from 'lucide-react';

export function LegacyVsVetoRail() {
  const comparisons = [
    {
      feature: 'GSTR-2B Compliance Gating',
      legacy: 'Post-payment manual reconciliation. Unfiled invoices discovered during month-end or tax audit.',
      vetorail: 'Real-time pre-disbursement circuit-breaker. Payment release physically gated until supplier return reflects in 2B.',
      legacyRisk: '₹7.35 Lakhs avg leaked ITC per ₹10 Cr AP spend + 18% p.a. Sec 50 penal interest.',
      vetorailBenefit: '100% Inward ITC Protection. Zero scrutiny notices (ASMT-10).'
    },
    {
      feature: '3-Way Line Matching (PO vs GRN vs Inv)',
      legacy: 'Invoice header verification or spot checks. Sub-line rate creep and damaged unit billings slip through.',
      vetorail: 'Autonomous line-item cross-examination down to unit price and warehouse accepted quantity.',
      legacyRisk: '0.35% average spend leakage to invoice overbilling.',
      vetorailBenefit: '0.0% tolerance enforced with cryptographic override logs.'
    },
    {
      feature: 'MSME Section 43B(h) Countdown',
      legacy: 'Manual tracking in spreadsheets. Payments delayed beyond 15/45 days trigger massive income tax hits.',
      vetorail: 'Dynamic 15-day and 45-day statutory clocks with 4-tier urgency escalation.',
      legacyRisk: '30% corporate income tax disallowance on total delayed MSME spend.',
      vetorailBenefit: 'Permanently shields balance sheet from statutory tax disallowance.'
    },
    {
      feature: 'Section 194Q TDS Withholding',
      legacy: 'AP accountants manually track whether supplier FY purchases have breached ₹50 Lakhs.',
      vetorail: 'Automated cumulative purchase spend accumulator with automatic 0.1% or 5% (Sec 206AA) deduction.',
      legacyRisk: 'Short-deduction defaults and interest under Section 201.',
      vetorailBenefit: 'Instantaneous withholding calculated at sub-invoice accuracy.'
    },
    {
      feature: 'Bank Disbursement Rail',
      legacy: 'Manual upload of payment batch files to internet banking portals; prone to OTP delays and errors.',
      vetorail: 'Direct Host-to-Host & RazorpayX connected API disbursement with instant UTR reconciliation.',
      legacyRisk: 'Disconnected banking workflows and maker-checker bottlenecks.',
      vetorailBenefit: 'Instantaneous, touchless settlement with SHA-256 cryptographic trail.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-canvas border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1 text-xs font-semibold text-indigo-900 mb-4 shadow-subtle backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-brand-600" />
            <span>Architecture Comparison</span>
            <span className="text-slate-300">|</span>
            <span className="text-brand-700 font-mono text-[11px]">The Pre-Payment Advantage</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Legacy AP Workflows vs VetoRail Autonomous Rail
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Why traditional ERP invoice processing leaves mid-market finance teams exposed to multi-crore tax disallowances and ITC clawbacks.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-premium overflow-hidden ring-1 ring-slate-900/5">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 py-3.5 px-6">
            <div className="md:col-span-3">Statutory Capability</div>
            <div className="md:col-span-4 text-rose-800">Legacy AP (Manual / Traditional ERP)</div>
            <div className="md:col-span-5 text-emerald-800">VetoRail Autonomous Compliance Rail</div>
          </div>

          <div className="divide-y divide-slate-100">
            {comparisons.map((c, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 p-6 gap-4 items-start hover:bg-slate-50/60 transition-colors">
                {/* Feature Name */}
                <div className="md:col-span-3">
                  <h4 className="text-sm font-bold text-slate-900">{c.feature}</h4>
                </div>

                {/* Legacy AP */}
                <div className="md:col-span-4 p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{c.legacy}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-rose-700 bg-rose-100/60 px-2.5 py-1 rounded-lg">
                    Risk: {c.legacyRisk}
                  </div>
                </div>

                {/* VetoRail */}
                <div className="md:col-span-5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c.vetorail}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                    Outcome: {c.vetorailBenefit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default LegacyVsVetoRail;
