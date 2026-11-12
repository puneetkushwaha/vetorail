'use client';

import React from 'react';
import { 
  FileSpreadsheet, 
  Briefcase, 
  BarChart3, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';
import { GsapFadeIn, GsapTiltCard } from '../animations/GsapAnimations';

export function RazorpayFeatureMatrix() {
  const threeCards = [
    {
      icon: FileSpreadsheet,
      title: 'Go spreadsheet free',
      description: 'Streamline workflows and eliminate manual errors with autonomous bank-account and ERP accounting-software integration.',
      tag: 'Zero Manual Recon'
    },
    {
      icon: Briefcase,
      title: 'Spend less time with your accountant',
      description: 'Give one-click access to everything your Tax CA and Statutory Auditor needs including invoices, 2B matching, challans, and GSTR-3B packs.',
      tag: 'Auditor-Ready'
    },
    {
      icon: BarChart3,
      title: 'Real-time insights',
      description: "Know what's happening with your working capital cash flow anytime, anywhere with an intuitive real-time CFO dashboard.",
      tag: 'Live Treasury'
    }
  ];

  const featureChecklist = [
    {
      name: 'Autonomous 3-Way Matching Engine',
      desc: 'Line-by-line reconciliation across PO, GRN, and Inward Tax Invoices.'
    },
    {
      name: 'Section 16(2)(aa) GSTR-2B Gating',
      desc: 'Immediate hold on supplier payments if GSTR-1 is not filed on GSTN portal.'
    },
    {
      name: 'Section 43B(h) MSME SLA Countdown',
      desc: 'Automated 15/45-day payment tracking to prevent corporate tax disallowances.'
    },
    {
      name: 'Penny-Drop Bank Verification',
      desc: 'Instant beneficiary account validation with NPCI to prevent erroneous payouts.'
    },
    {
      name: 'Instant Bulk Payouts via RTGS/NEFT',
      desc: 'Execute 50,000 vendor disbursements in seconds with 99.9% bank uptime.'
    },
    {
      name: 'Multi-User Granular Maker-Checker',
      desc: 'Tiered approval matrices with custom threshold limits and zero OTP ping-pong.'
    },
    {
      name: 'Section 194Q TDS Auto-Withholding',
      desc: 'Automatic 0.1% TDS deduction and auto-generation of Form 26Q return files.'
    },
    {
      name: 'Direct ERP Integrations (SAP, Tally, Zoho)',
      desc: 'Two-way synchronous journal entries without manual CSV upload delays.'
    },
    {
      name: 'Dedicated Enterprise Relationship Manager',
      desc: 'Priority 24/7 dedicated support and direct phone line for enterprise accounts.'
    },
    {
      name: 'Cryptographic Immutable Audit Trails',
      desc: 'Bank-grade compliance logs tracking every approval, veto, and fund release.'
    },
    {
      name: 'Auto-Sweep Working Capital Liquidity',
      desc: 'Maximize idle cash yields while ensuring sufficient liquidity for AP runs.'
    },
    {
      name: 'Forex, Multi-Currency & Import Bills',
      desc: 'FEMA-compliant cross-border vendor disbursements with automated inward BRCs.'
    }
  ];

  return (
    <section className="bg-slate-50/80 py-20 lg:py-28 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 3 Top Cards (Screenshot 8) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {threeCards.map((card) => {
            const Icon = card.icon;
            return (
              <GsapTiltCard key={card.title} className="h-full">
                <div className="h-full rounded-3xl bg-white p-8 shadow-card hover:shadow-elevated transition-all border border-slate-200/80 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore autonomous capability</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </div>
                </div>
              </GsapTiltCard>
            );
          })}
        </div>

        {/* Features Checklist Section Header (Screenshot 9) */}
        <GsapFadeIn direction="up">
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
              Features of VetoRail AP Rail
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Engineered with partner banks and GST Suvidha Providers to make enterprise compliance and money movement better than ever before.
            </p>
          </div>
        </GsapFadeIn>

        {/* 12-Item Checklist Grid in 3 Columns (Screenshot 9) */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureChecklist.map((item, index) => (
            <GsapFadeIn key={item.name} delay={index * 0.04} direction="up">
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm border border-slate-200/70 hover:border-brand-300 hover:shadow-card transition-all flex items-start gap-4">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </GsapFadeIn>
          ))}
        </div>

        {/* Centered CTA */}
        <div className="mt-12 text-center">
          <a
            href="#roi-calculator"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 hover:shadow-glow-brand transition-all"
          >
            <span>Learn More &amp; Calculate Savings</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
