import React from 'react';
import {
  ShieldCheck,
  Clock,
  TrendingDown,
  Building2,
  Lock,
  CheckCircle2,
  FileCheck2,
  FileKey
} from 'lucide-react';

export function StatutoryBadges() {
  const badges = [
    {
      code: 'Section 16(2)(aa)',
      authority: 'CGST Act 2017 & Rule 36(4)',
      title: '100% GSTR-2B Gating',
      description:
        'Zero inward tax credit is claimed without reflection in the auto-drafted GSTR-2B statement. Complete protection against Section 50 18% p.a. penal interest.',
      icon: ShieldCheck,
      color: 'emerald'
    },
    {
      code: 'Section 43B(h)',
      authority: 'Income Tax Act 1961 & MSMED Act',
      title: 'MSME 15/45-Day Payment SLA',
      description:
        'Guaranteed compliance with statutory payment windows for Micro and Small enterprises, permanently shielding against 30% corporate income tax disallowances.',
      icon: Clock,
      color: 'orange'
    },
    {
      code: 'Section 194Q',
      authority: 'Income Tax Act 1961',
      title: 'Automated 0.1% TDS Deduction',
      description:
        'Real-time cumulative FY purchase tracking. Automatically deducts 0.1% TDS on aggregate spend exceeding ₹50 Lakhs (or 5.0% for Section 206AA non-compliant PANs).',
      icon: TrendingDown,
      color: 'indigo'
    },
    {
      code: 'Rule 36(4)',
      authority: 'Central Goods & Services Tax Rules',
      title: 'Discrepancy Defense Rail',
      description:
        'Eliminates provisional or un-matched ITC claims, preventing costly departmental scrutiny notices (Form GST ASMT-10) and tax officer summons.',
      icon: FileCheck2,
      color: 'blue'
    },
    {
      code: 'GSTN API Ready',
      authority: 'Goods & Services Tax Network',
      title: 'Direct GSP / ASP Pipe Sync',
      description:
        'High-security, encrypted integration with GSTN data pipelines for automated periodic polling of vendor return filings, B2B invoices, and credit notes.',
      icon: Building2,
      color: 'sky'
    },
    {
      code: 'SOC2 & ISO 27001',
      authority: 'Enterprise Security Posture',
      title: 'Cryptographic Audit Trail',
      description:
        'Every payment gating event, manager override, and vendor notification is cryptographically signed and SHA-256 hashed for statutory auditor verification.',
      icon: FileKey,
      color: 'purple'
    }
  ];

  return (
    <section id="trust" className="py-20 lg:py-28 bg-canvas border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1 text-xs font-semibold text-indigo-900 mb-4 shadow-subtle backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5 text-brand-600" />
            <span>Statutory Architecture & Regulatory Shields</span>
            <span className="text-slate-300">|</span>
            <span className="text-brand-700 font-mono text-[11px]">ICAI & GSTN Aligned</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Engineered for Indian Tax Jurisprudence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            VetoRail is purpose-built to navigate India&apos;s most demanding corporate finance laws, providing automated compliance shields that protect CFOs and Tax Directors.
          </p>
        </div>

        {/* 6-Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:border-brand-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-brand-600 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                    {badge.code}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {badge.authority}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {badge.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Statutory Coverage Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assurance Banner */}
        <div className="mt-12 rounded-2xl border border-indigo-200/80 bg-indigo-50/70 p-5 text-center text-xs sm:text-sm text-indigo-950 flex flex-col sm:flex-row items-center justify-center gap-3 shadow-xs">
          <ShieldCheck className="h-5 w-5 text-brand-600 shrink-0" />
          <span>
            <strong className="font-bold">Auditor-Ready Assurance:</strong> All VetoRail verification algorithms are cross-validated against standard Indian ICAI technical guidance and GST Law Committee advisories.
          </span>
        </div>

      </div>
    </section>
  );
}
