import React from 'react';
import { Quote, Star, CheckCircle2 } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Rajesh Singhania',
      role: 'Chief Financial Officer',
      company: 'Jindal Precision Infra Limited',
      industry: 'Heavy Infrastructure & Steel',
      spendMetric: '₹850 Cr Annual AP Spend',
      savings: '₹3.4 Cr ITC Protected in Q1-Q2',
      quote:
        'VetoRail eliminated ₹3.4 Crores in leaked ITC within our first two quarters. Our treasury now enforces a strict, automated rule: no green GSTR-2B gate, no payment release. It paid for itself within the first 45 days.',
      avatarInitials: 'RS'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Head of Indirect Tax & Compliance',
      company: 'Omnilogix Supply Chain Solutions',
      industry: 'Logistics & Intermodal Freight',
      spendMetric: '₹420 Cr Annual AP Spend',
      savings: 'Zero Sec 43B(h) Tax Penalties',
      quote:
        'The Section 43B(h) MSME countdown clock completely removed our year-end corporate tax disallowance panic. The autonomous 3-way line matching catches rate creep that our ERP had missed for years. It is an absolute must-have for Indian tax teams.',
      avatarInitials: 'AD'
    },
    {
      name: 'Vikramaditya Roy',
      role: 'VP of Procurement & AP Operations',
      company: 'Zenon FMCG India Limited',
      industry: 'Consumer Goods & Retail AP',
      spendMetric: '₹1,200 Cr Annual AP Spend',
      savings: '82% Drop in Vendor Disputes',
      quote:
        'When an invoice is gated, the vendor automatically receives an exact breakdown of why their GSTR-1 return was missing. It flipped vendor disputes from adversarial arguments into collaborative, touchless compliance within hours.',
      avatarInitials: 'VR'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-800 mb-4 shadow-subtle">
            <Star className="h-3.5 w-3.5 fill-indigo-600 text-brand-600" />
            <span>Proven Enterprise Outcomes</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by Leaders in Corporate Finance & Indirect Tax
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Discover how enterprise CFOs, Tax Heads, and AP Controllers protect bottom-line margins with VetoRail&apos;s autonomous compliance gating.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-canvas p-6 sm:p-8 shadow-subtle transition-all duration-200 hover:shadow-card hover:border-slate-300"
            >
              <div>
                {/* Metrics Pill */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-4 mb-5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {t.savings}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {t.spendMetric}
                  </span>
                </div>

                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-brand-200 mb-3" />

                {/* Body Quote */}
                <p className="text-sm text-slate-700 leading-relaxed font-normal italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Profile */}
              <div className="mt-8 pt-5 border-t border-slate-200/70 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-sm shadow-sm">
                  {t.avatarInitials}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-brand-700 font-medium">{t.role}</div>
                  <div className="text-[11px] text-slate-500">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
