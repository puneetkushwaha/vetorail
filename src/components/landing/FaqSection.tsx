'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does VetoRail replace our existing ERP (SAP, Oracle, TallyPrime)?',
      a: 'No. VetoRail is engineered as a zero-disruption, drop-in compliance rail that sits directly between your existing ERP and your corporate banking disbursement pipes. You continue creating Purchase Orders and booking Invoices in SAP/Oracle; VetoRail ingests the data, verifies GSTR-2B and MSME clocks, and only releases the disbursement webhook to your bank when all statutory gates pass.'
    },
    {
      q: 'How does VetoRail connect with GSTN GSTR-2B without manual OTP logins?',
      a: 'VetoRail operates over high-security, encrypted GST Suvidha Provider (GSP) enterprise APIs. Once your organization authenticates its GSTIN branches, VetoRail automatically queries and ingests your monthly auto-drafted GSTR-2B statements directly from the GST portal, matching B2B invoices in near real-time.'
    },
    {
      q: 'How is Section 43B(h) MSME 15/45-day SLA calculated and monitored?',
      a: 'The engine cross-references each vendor&apos;s verified UDYAM registration status (categorizing Micro vs Small vs Medium vs Trader exemptions). For Micro and Small enterprises, it tracks the invoice acceptance date against your written contract agreement (15 days if no agreement, 45 days if written) and assigns a 4-tier urgency SLA (Safe, Attention, Critical, Overdue) with automatic AP inbox escalation.'
    },
    {
      q: 'How does Section 194Q automated TDS withholding calculate FY spend?',
      a: 'VetoRail maintains an aggregate FY purchase spend ledger grouped by vendor Permanent Account Number (PAN). As soon as the cumulative inward purchases from a supplier cross ₹50 Lakhs in the fiscal year, VetoRail automatically slices 0.1% TDS on the incremental value (or 5.0% under Section 206AA if the PAN is invalid/non-compliant).'
    },
    {
      q: 'Can a Finance Controller or CFO override a compliance hold in an emergency?',
      a: 'Yes. For high-priority production-critical suppliers, authorized users can execute a Manager Exception Override. This requires a mandatory business justification, records the approver identity, appends an immutable audit entry to Supabase, and logs a SHA-256 cryptographic hash ready for statutory tax auditors.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1 text-xs font-semibold text-indigo-900 mb-4 shadow-subtle backdrop-blur-sm">
            <HelpCircle className="h-3.5 w-3.5 text-brand-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need to Know About VetoRail
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Clear answers on how VetoRail integrates with your ERP, GSP pipes, and treasury disbursement rails.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-canvas/60 overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <div className={`p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-brand-600' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FaqSection;
