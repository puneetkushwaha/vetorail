'use client';

import React, { useState } from 'react';
import {
  Layers,
  FileCheck2,
  Clock,
  CheckCircle2,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

export function FeaturePillars() {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      id: 0,
      title: 'Autonomous 3-Way Matching',
      subtitle: 'PO vs GRN vs Tax Invoice at Sub-Line Item Precision',
      icon: Layers,
      color: 'indigo',
      badge: '0.0% Tolerance Enforced',
      description:
        'Eliminate manual AP line-by-line verification. VetoRail cross-references Purchase Orders, Warehouse Goods Receipt Notes (GRN), and vendor Tax Invoices down to the exact SKU, unit rate, and accepted quantity.',
      stat: '0.35% Avg AP Leakage Recovered',
      bullets: [
        'Sub-line rate discrepancy detection (flags vendor unit price inflation)',
        'GRN accepted quantity matching (blocks payments for rejected/damaged units)',
        'HSN/SAC code tax rate verification (stops incorrect 18% vs 28% GST split)',
        'Automatic tolerance thresholds with cryptographic manager override logs'
      ],
      preview: {
        title: 'Line Item Variance Resolution',
        items: [
          {
            sku: 'SKU-IND-4091',
            desc: 'Industrial Grade Hydraulic Valves',
            po: '100 units @ ₹4,500/u',
            grn: '85 units accepted (15 rejected)',
            inv: '100 units @ ₹4,850/u',
            variance: '+₹350/u (+7.8%) rate variance & +15 units overbilled',
            status: 'HOLD_VARIANCE'
          }
        ]
      }
    },
    {
      id: 1,
      title: 'Real-Time GSTR-2B Compliance Gating',
      subtitle: 'Section 16(2)(aa) Statutory Circuit-Breaker',
      icon: FileCheck2,
      color: 'amber',
      badge: 'Section 16(2)(aa) & Rule 36(4)',
      description:
        'Never lose GST Input Tax Credit to unfiled vendor returns. VetoRail queries your auto-drafted GSTR-2B statement directly via GSTN GSP pipes, placing an automated compliance hold on disbursements until the supplier files.',
      stat: '100% Inward ITC Protection',
      bullets: [
        'Autonomous 6-point reconciliation: GSTIN, Doc #, Date, Value, Tax Split, RCM',
        'Section 50 CGST 18% p.a. penal interest liability completely prevented',
        'Section 17(5) blocked credit categorization (motor vehicles, club memberships)',
        '1-Click automated vendor escalation via WhatsApp and statutory email notices'
      ],
      preview: {
        title: 'GSTN GSTR-2B Statement Verification',
        items: [
          {
            gstin: '29AABCR8819Q1Z2',
            vendor: 'Reliance Polychem Logistics',
            invoice: 'INV-2024-8842 (₹18,40,000)',
            gstnStatus: 'NOT_FOUND_IN_GSTR2B',
            itcRisk: '₹2,80,678 (18% GST at risk)',
            action: 'COMPLIANCE_HOLD_DISBURSEMENT'
          }
        ]
      }
    },
    {
      id: 2,
      title: 'MSME Section 43B(h) & Section 194Q TDS Rail',
      subtitle: '15/45-Day Statutory Countdown & Automatic Tax Withholding',
      icon: Clock,
      color: 'orange',
      badge: 'MSMED Act & IT Act 1961',
      description:
        'Comply autonomously with India’s strictest tax provisions. Protect your business against acute 30% corporate income tax disallowances on delayed MSME payments, and automatically deduct 0.1% Section 194Q TDS once FY spend exceeds ₹50 Lakhs.',
      stat: '30% Corporate Tax Loss Shielded',
      bullets: [
        'Dynamic 15-day (no agreement) and 45-day (written agreement) MSMED countdown clocks',
        '4-Tier Urgency SLA: Green (Safe), Yellow (Attention), Orange (Critical), Red (Disallowed)',
        'Automatic UDYAM verification (Micro vs Small vs Medium vs Trader exemption handling)',
        'Cumulative FY purchase spend accumulator with automatic 0.1% / 5% (Sec 206AA) TDS deduction'
      ],
      preview: {
        title: 'Section 43B(h) SLA Urgency Tracker',
        items: [
          {
            udyam: 'UDYAM-MH-03-0019284',
            vendor: 'Precision Toolcraft (Micro Enterprise)',
            agreement: 'Written Agreement (45-Day Limit)',
            elapsed: 'Day 42 of 45 (3 Days Remaining)',
            risk: '30% Corporate Tax Disallowance Risk if unpaid',
            urgency: 'CRITICAL_ORANGE'
          }
        ]
      }
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-800 mb-4 shadow-subtle">
            <Shield className="h-3.5 w-3.5 text-brand-600" />
            <span>Autonomous Compliance Architecture</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            The 3 Pillars of Statutory AP Defense
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Engineered specifically to solve the statutory, mathematical, and operational bottlenecks of Indian enterprise finance.
          </p>
        </div>

        {/* Pillar Selection Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex rounded-xl bg-slate-100 p-1.5 shadow-inner">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isActive = activePillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillar(pillar.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-brand-600' : 'text-slate-500'}`} />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Pillar Deep-Dive Display */}
        {pillars.map((pillar) => {
          if (pillar.id !== activePillar) return null;
          const Icon = pillar.icon;

          return (
            <div
              key={pillar.id}
              className="rounded-2xl border border-slate-200 bg-canvas p-6 sm:p-10 shadow-card animate-fadeIn"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Detail Description (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-pass bg-brand-50 text-brand-700 border-brand-200">
                      <Icon className="h-3.5 w-3.5 text-brand-600" />
                      {pillar.badge}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                      {pillar.stat}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-brand-600">
                      {pillar.subtitle}
                    </p>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-3 pt-2">
                    {pillar.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Interactive Micro-Detail / Preview Frame (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-elevated">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <FileSpreadsheet className="h-4 w-4 text-brand-600" />
                        {pillar.preview.title}
                      </div>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        Live AP Rail View
                      </span>
                    </div>

                    {/* Content inside Preview depending on Pillar */}
                    {pillar.id === 0 && (
                      <div className="space-y-3 text-xs">
                        <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-900">Line #1 Discrepancy Detected</span>
                            <span className="badge-hold py-0 px-2 text-[10px]">Price Variance</span>
                          </div>
                          <div className="mt-2 text-slate-700">
                            <strong>PO Rate:</strong> ₹4,500/u · <strong>Invoice Rate:</strong> <span className="text-rose-600 font-bold font-mono">₹4,850/u (+₹350)</span>
                          </div>
                          <div className="mt-1 text-slate-700">
                            <strong>GRN Accepted Qty:</strong> 85 · <strong>Invoice Billed Qty:</strong> <span className="text-rose-600 font-bold font-mono">100 (+15)</span>
                          </div>
                          <div className="mt-2 text-[11px] text-amber-800 font-medium">
                            Auto-Hold Activated: ₹65,250 overbilling leakage prevented.
                          </div>
                        </div>

                        <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-900">Line #2 Exact Reconciliation</span>
                            <span className="badge-pass py-0 px-2 text-[10px]">Exact Match</span>
                          </div>
                          <div className="mt-1 text-slate-700">
                            200 Units @ ₹6,100/u matched across PO, GRN, and Invoice.
                          </div>
                        </div>
                      </div>
                    )}

                    {pillar.id === 1 && (
                      <div className="space-y-3 text-xs">
                        <div className="rounded-lg bg-rose-50/70 border border-rose-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-900">GSTN 2B Mismatch Flag</span>
                            <span className="badge-veto py-0 px-2 text-[10px]">Not in GSTR-2B</span>
                          </div>
                          <div className="mt-2 text-slate-700">
                            <strong>Vendor GSTIN:</strong> <span className="font-mono">29AABCR8819Q1Z2</span>
                          </div>
                          <div className="mt-1 text-slate-700">
                            <strong>Statutory Verdict:</strong> Section 16(2)(aa) non-compliant.
                          </div>
                          <div className="mt-2 text-[11px] text-rose-800 font-medium">
                            Disbursement held: ₹2,80,678 ITC protected + 18% p.a. interest liability shielded.
                          </div>
                        </div>

                        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                          <div className="text-[11px] font-semibold text-slate-700">Automated Remediation:</div>
                          <div className="mt-1 text-[11px] text-slate-600">
                            1-Click Statutory Demand sent to supplier with filing deadline: <strong>11th Nov (GSTR-1)</strong>.
                          </div>
                        </div>
                      </div>
                    )}

                    {pillar.id === 2 && (
                      <div className="space-y-3 text-xs">
                        <div className="rounded-lg bg-orange-50/70 border border-orange-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-orange-950">Section 43B(h) Countdown Clock</span>
                            <span className="badge-msme py-0 px-2 text-[10px]">3 Days Left</span>
                          </div>
                          <div className="mt-2 text-slate-700">
                            <strong>Supplier:</strong> Precision Toolcraft (Micro Enterprise)
                          </div>
                          <div className="mt-1 text-slate-700">
                            <strong>Statutory Window:</strong> 45-Day Written Contract SLA
                          </div>
                          <div className="mt-2 text-[11px] text-orange-900 font-medium">
                            Fast-Track AP queue auto-escalation triggered to prevent 30% corporate income tax disallowance.
                          </div>
                        </div>

                        <div className="rounded-lg bg-indigo-50/70 border border-indigo-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-900">Section 194Q TDS Deductor</span>
                            <span className="badge-neutral py-0 px-2 text-[10px]">₹50L Breached</span>
                          </div>
                          <div className="mt-1 text-slate-700">
                            Cumulative FY Spend: <strong className="font-mono">₹64,20,000</strong>. Auto-withheld 0.1% TDS on ₹14.2 Lakhs excess.
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Audit Hash: <strong className="font-mono">SHA-256 #8f4b..</strong></span>
                      <span className="text-brand-600 font-semibold">100% Cryptographic Trail</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {/* 3 Overview Cards at bottom */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isCurrent = activePillar === pillar.id;

            return (
              <div
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`cursor-pointer rounded-xl border p-5 transition-all ${
                  isCurrent
                    ? 'border-brand-500 bg-brand-50/30 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isCurrent ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{pillar.title}</h4>
                    <span className="text-xs text-brand-600 font-medium">{pillar.badge}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
