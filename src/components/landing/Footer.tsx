import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-base shadow-sm">
                VR
              </div>
              <div className="text-lg font-bold text-white tracking-tight">
                VetoRail
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Autonomous Accounts Payable (AP) Automation, 3-Way Line Matching, and Statutory Tax Compliance Rail for Indian Enterprises.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>GSTN GSP / ASP Pipeline Operational</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Enterprise AP Rail
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/app" className="hover:text-white transition flex items-center gap-1">
                  AP Command Rail
                  <ArrowUpRight className="h-3 w-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/app/matching" className="hover:text-white transition flex items-center gap-1">
                  3-Way Match Engine
                </Link>
              </li>
              <li>
                <Link href="/app/gstr2b" className="hover:text-white transition flex items-center gap-1">
                  GSTR-2B Simulator
                </Link>
              </li>
              <li>
                <Link href="/app/vendors" className="hover:text-white transition flex items-center gap-1">
                  Vendor Directory & MSME
                </Link>
              </li>
              <li>
                <Link href="/app/analytics" className="hover:text-white transition flex items-center gap-1">
                  CFO Executive Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Statutory Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Statutory Tax Frameworks
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-slate-300 font-medium">CGST Section 16(2)(aa)</span>
                <p className="text-[11px] text-slate-500">100% GSTR-2B reflection rule</p>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Income Tax Section 43B(h)</span>
                <p className="text-[11px] text-slate-500">15/45-day MSME disallowance defense</p>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Income Tax Section 194Q</span>
                <p className="text-[11px] text-slate-500">0.1% TDS on spend &gt; ₹50 Lakhs</p>
              </li>
              <li>
                <span className="text-slate-300 font-medium">CGST Section 50</span>
                <p className="text-[11px] text-slate-500">18% p.a. penal interest shield</p>
              </li>
            </ul>
          </div>

          {/* Security & Posture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Institutional Posture
            </h4>
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
                  <Lock className="h-3.5 w-3.5 text-brand-400" />
                  Bank & ERP Agnostic
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Integrates alongside SAP S/4HANA, Oracle ERP Cloud, TallyPrime, and direct H2H / RazorpayX disbursement rails.
                </p>
              </div>

              <div className="text-[11px] text-slate-500">
                Engineered for Indian CFOs, Corporate Controllers, and Heads of Indirect Tax.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 VetoRail Technologies Private Limited. All rights reserved.</p>
          <p className="text-center sm:text-right max-w-xl">
            Disclaimer: VetoRail is an enterprise compliance automation platform. Statutory guidance provided aligns with Central Goods and Services Tax Act 2017 & Income Tax Act 1961.
          </p>
        </div>
      </div>
    </footer>
  );
}
