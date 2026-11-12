'use client';

import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { GsapFadeIn, GsapTiltCard } from '../animations/GsapAnimations';

export function RazorpayPricing() {
  const plans = [
    {
      name: 'Core Plan',
      tagline: 'Essential statutory protection for growing enterprises',
      spendTier: 'Up to ₹5 Cr / month spend',
      price: '₹14,999',
      period: 'per month, billed annually',
      isPopular: false,
      features: [
        'Autonomous 3-Way Matching Engine',
        'Section 16(2)(aa) GSTR-2B Circuit-Breaker',
        'Section 43B(h) MSME SLA Deadline Alerts',
        'Direct UPI & NEFT vendor disbursements',
        'Up to 5 Maker & Checker Finance Seats',
        'Standard Email & In-App CA Support'
      ],
      ctaText: 'Start with Core',
      ctaHref: '/app'
    },
    {
      name: 'Pro Plan',
      tagline: 'Complete automated banking & AP rail for scaling teams',
      spendTier: '₹5 Cr to ₹50 Cr / month spend',
      price: '₹34,999',
      period: 'per month, billed annually',
      isPopular: true,
      features: [
        'Everything in Core Plan, plus:',
        'Unlimited 50,000 Bulk Payouts per batch',
        'NPCI Penny-Drop Bank Account Verification',
        'Granular Multi-Tier Maker-Checker Hierarchy',
        'Direct 2-Way ERP Sync (SAP, Tally, Zoho)',
        'Section 194Q TDS Auto-Withholding & Challans',
        'Dedicated Enterprise Relationship Manager'
      ],
      ctaText: 'Deploy Pro Rail',
      ctaHref: '/app'
    },
    {
      name: 'Advanced Enterprise',
      tagline: 'Custom infrastructure & compliance rails for conglomerates',
      spendTier: '₹50 Cr+ monthly spend',
      price: 'Custom',
      period: 'tailored corporate agreement',
      isPopular: false,
      features: [
        'Everything in Pro Plan, plus:',
        'Multi-Entity & Multi-GSTIN Group Consolidation',
        'Private Cloud or Dedicated VPC Deployment',
        'Sub-second Custom Bank API Gateway',
        'Custom Statutory Risk Rules & Approval Logic',
        'Unlimited Users, Entities & ERP Connectors',
        '24/7 Dedicated Legal, Tax & Engineering Pod'
      ],
      ctaText: 'Talk to Enterprise Rail Team',
      ctaHref: '/app'
    }
  ];

  return (
    <section id="pricing" className="bg-white py-20 lg:py-28 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <GsapFadeIn direction="up">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Transparent Enterprise Tiers
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
              Predictable Pricing for Autonomous Compliance
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Eliminate GST ITC loss and MSME penalties. Most enterprise clients recoup their annual investment in their first month.
            </p>
          </div>
        </GsapFadeIn>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8 items-stretch">
          {plans.map((plan) => (
            <GsapTiltCard key={plan.name} className="h-full">
              <div
                className={`relative flex h-full flex-col justify-between rounded-3xl p-8 transition-all ${
                  plan.isPopular
                    ? 'border-2 border-brand-600 bg-white shadow-elevated ring-4 ring-brand-50'
                    : 'border border-slate-200/80 bg-slate-50/50 shadow-card hover:shadow-elevated'
                }`}
              >
                {/* Popular Pill */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Most Popular for Enterprises</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {plan.spendTier}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600">{plan.tagline}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-medium">/{plan.period}</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-8 space-y-3.5 border-t border-slate-200/70 pt-6">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-3">
                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 leading-tight">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <a
                    href={plan.ctaHref}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold transition-all shadow-sm active:scale-[0.98] ${
                      plan.isPopular
                        ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-glow-brand'
                        : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </GsapTiltCard>
          ))}
        </div>

        {/* RBI Partner Bank Assurance Strip */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600 border border-slate-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Banking rails powered in partnership with RBI-scheduled commercial banks. Funds held in compliant escrow.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
