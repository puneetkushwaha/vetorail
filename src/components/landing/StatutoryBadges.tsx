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
    <section id="trust" className="py-20 lg:py-28 bg-canvas border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-800 mb-4 shadow-subtle">
            <Lock className="h-3.5 w-3.5 text-brand-600" />
            <span>Statutory Architecture & Regulatory Shields</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Engineered for Indian Tax Jurisprudence
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
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
                className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-subtle transition-all duration-200 hover:shadow-card hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                    {badge.code}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    {badge.authority}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {badge.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Statutory Coverage Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assurance Banner */}
        <div className="mt-12 rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 text-center text-xs text-indigo-900 flex flex-col sm:flex-row items-center justify-center gap-3">
          <ShieldCheck className="h-5 w-5 text-brand-600 shrink-0" />
          <span>
            <strong>Auditor-Ready Assurance:</strong> All VetoRail verification algorithms are cross-validated against standard Indian ICAI technical guidance and GST Law Committee advisories.
          </span>
        </div>

      </div>
    </section>
  );
}
