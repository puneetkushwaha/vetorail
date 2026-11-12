'use client';

import React, { useState } from 'react';
import {
  FileText,
  Split,
  FileCheck2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  RefreshCw
} from 'lucide-react';
import { formatINR } from './formatters';

export function InteractiveWorkflowTour() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simulatedFiling, setSimulatedFiling] = useState<boolean>(false);

  const steps = [
    {
      id: 0,
      title: '1. Intelligent AP Ingestion',
      subtitle: 'ERP, Email & WhatsApp Connectors',
      icon: FileText,
      description: 'Auto-ingest PDF tax invoices, e-invoices, and POs directly from SAP, Oracle, Tally, or vendor emails. AI OCR extracts line items, HSN codes, and GSTINs with 99.8% precision.',
      badge: 'Zero Manual Data Entry'
    },
    {
      id: 1,
      title: '2. Sub-Line 3-Way Matching',
      subtitle: 'PO vs GRN vs Tax Invoice Verification',
      icon: Split,
      description: 'Cross-examine unit rates and warehouse goods receipt notes (GRN). Flags overbilling, quantity shortages, and rate escalations with 0.0% variance tolerance.',
      badge: '0.0% Variance Gate'
    },
    {
      id: 2,
      title: '3. GSTN GSTR-2B Statutory Gate',
      subtitle: 'Section 16(2)(aa) Circuit-Breaker',
      icon: FileCheck2,
      description: 'Real-time query via GSTN GSP pipes. If the vendor hasn&apos;t reflected the invoice in auto-drafted GSTR-2B, disbursement is held autonomously to protect Input Tax Credit.',
      badge: '100% ITC Shield'
    },
    {
      id: 3,
      title: '4. Autonomous Bank Disbursement',
      subtitle: 'Section 194Q TDS & Direct RazorpayX Rail',
      icon: Lock,
      description: 'Once all compliance checks pass, VetoRail auto-deducts 0.1% Section 194Q TDS, updates the ERP ledger, and triggers instant host-to-host bank payout via RazorpayX / H2H rails.',
      badge: 'Instant Bank Release'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 px-4 py-1 text-xs font-semibold text-brand-800 mb-4 shadow-subtle backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-brand-600" />
            <span>Interactive Product Tour</span>
            <span className="text-slate-300">|</span>
            <span className="text-brand-700 font-mono text-[11px]">RazorpayX &amp; ERP Rail Compatible</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            See the Autonomous AP Rail in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Click through each phase of VetoRail&apos;s intelligent payment lifecycle from invoice ingestion to final bank disbursement.
          </p>
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'border-brand-500 bg-brand-50/40 shadow-card ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isActive ? 'bg-brand-600 text-white shadow-2xs' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-brand-100 text-brand-800 border border-brand-200'
                          : 'bg-white text-slate-500 border border-slate-200'
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{step.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Simulated Product Window */}
        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-canvas to-white p-6 sm:p-10 shadow-premium ring-1 ring-slate-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                <Sparkles className="w-3.5 h-3.5" />
                Phase {activeStep + 1} of 4
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {steps[activeStep].title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {steps[activeStep].description}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev + 1) % 4)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors"
                >
                  <span>Explore next phase &rarr;</span>
                </button>
              </div>
            </div>

            {/* Right Interactive Mock Sandbox Screen (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-elevated ring-1 ring-slate-900/5">
                
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
                    <span className="ml-2 font-mono text-xs text-slate-400">vetorail.internal/ap-rail</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Live Interactive Simulation
                  </span>
                </div>

                {/* Step 0 Content: Ingestion */}
                {activeStep === 0 && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
                          PDF
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Tata_Steel_INV_9182.pdf</div>
                          <div className="text-[11px] text-slate-500 font-mono">Size: 420 KB · Source: SAP ERP Connect</div>
                        </div>
                      </div>
                      <span className="badge-pass text-[10px] py-0.5 px-2">
                        OCR Extracted (99.8%)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Extracted GSTIN</span>
                        <span className="font-bold text-slate-800">27AABCT9981F1Z3</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Total Invoiced Amount</span>
                        <span className="font-bold text-slate-800">{formatINR(4820000)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1 Content: 3-Way Match */}
                {activeStep === 1 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">1. PO Contract</span>
                        <span className="font-mono font-bold text-slate-800 text-sm mt-1 block">800 units</span>
                        <span className="text-[10px] text-slate-500 font-mono">@ ₹4,500/u</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">2. GRN Accepted</span>
                        <span className="font-mono font-bold text-emerald-700 text-sm mt-1 block">800 units</span>
                        <span className="text-[10px] text-emerald-600 font-mono">0 rejected</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">3. 3-Way Verdict</span>
                        <span className="font-mono font-bold text-sm mt-1 block">EXACT MATCH</span>
                        <span className="text-[10px] font-mono">0.0% Variance</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Line item rates and physical warehouse goods receipt confirmed without discrepancies.</span>
                    </div>
                  </div>
                )}

                {/* Step 2 Content: GSTR-2B Gate */}
                {activeStep === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="text-xs font-bold text-slate-900">GSTN GSP Auto-Drafted Query</div>
                        <div className="text-[11px] text-slate-500">Period: Nov 2024 · Form: GSTR-2B</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSimulatedFiling(!simulatedFiling)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                          simulatedFiling
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        {simulatedFiling ? 'Simulated: Filed' : 'Simulated: Unfiled'}
                      </button>
                    </div>

                    <div
                      className={`p-3.5 rounded-xl border text-xs ${
                        simulatedFiling
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-2">
                        {simulatedFiling ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Section 16(2)(aa) Verification: PASSED</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Statutory Circuit-Breaker: COMPLIANCE VETO ACTIVE</span>
                          </>
                        )}
                      </div>
                      <div className="mt-1 text-[11px]">
                        {simulatedFiling
                          ? 'Invoice found in GSTR-2B inward statement. ₹7,35,254 ITC is 100% claimable. Bank payout authorized.'
                          : 'Missing in GSTR-2B statement. Bank release vetoed to protect against ₹7.35L ITC loss and Sec 50 penal interest.'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 Content: Bank Release */}
                {activeStep === 3 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Gross Billed Invoice</span>
                        <span className="font-mono font-bold text-slate-900">{formatINR(4820000)}</span>
                      </div>
                      <div className="flex items-center justify-between text-indigo-700">
                        <span className="font-medium">Section 194Q TDS Auto-Withheld (0.1%)</span>
                        <span className="font-mono font-bold">-{formatINR(4820)}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm font-bold text-slate-900">
                        <span>Net Bank Disbursement</span>
                        <span className="font-mono text-emerald-700">{formatINR(4815180)}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-xs">Dispatched via RazorpayX H2H Rail</span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        UTR #RZPX9982410
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default InteractiveWorkflowTour;
