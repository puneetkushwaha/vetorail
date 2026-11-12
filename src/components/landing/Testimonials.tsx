import React from 'react';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';

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
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1 text-xs font-semibold text-indigo-900 mb-4 shadow-subtle backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-brand-600 text-brand-600" />
            <span>Proven Enterprise Outcomes</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-mono text-[11px]">Zero Dispute Rate</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Trusted by Leaders in Corporate Finance & Indirect Tax
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Discover how enterprise CFOs, Tax Heads, and AP Controllers protect bottom-line margins with VetoRail&apos;s autonomous compliance gating.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-canvas/70 backdrop-blur-sm p-6 sm:p-8 shadow-card transition-all duration-300 hover:shadow-elevated hover:border-slate-300 hover:-translate-y-1 ring-1 ring-slate-900/5"
            >
              <div>
                {/* Metrics Pill */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-4 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {t.savings}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {t.spendMetric}
                  </span>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Body Quote */}
                <p className="text-sm text-slate-700 leading-relaxed font-normal italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Profile */}
              <div className="mt-8 pt-5 border-t border-slate-200/80 flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-700 text-white font-bold text-sm shadow-sm">
                  {t.avatarInitials}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {t.name}
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                  </div>
                  <div className="text-xs text-brand-700 font-semibold">{t.role}</div>
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
