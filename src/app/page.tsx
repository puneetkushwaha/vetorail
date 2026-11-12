import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Clock, 
  Calculator, 
  TrendingUp, 
  Layers, 
  FileCheck2 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Top Regulatory Header Banner */}
      <div className="border-b border-indigo-100 bg-indigo-50/70 px-4 py-2 text-center text-xs font-medium text-indigo-900">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          <strong className="font-semibold">STATUTORY ALERT:</strong> Section 43B(h) MSME 45-day payment enforcement & Section 16(2)(aa) 100% GSTR-2B gating active.
        </span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm font-bold text-lg">
              VR
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900">VetoRail</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Autonomous AP Compliance Rail</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">Statutory Rails</a>
            <a href="#matching" className="transition hover:text-slate-900">3-Way Matching</a>
            <a href="#roi" className="transition hover:text-slate-900">ROI Calculator</a>
            <a href="#trust" className="transition hover:text-slate-900">Trust & GSTN</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Launch AP Command Rail
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-6">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              Autonomous Payment Circuit-Breaker for Indian Enterprises
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Stop Leaking GST Tax Credit. <br className="hidden sm:inline" />
              <span className="text-brand-600">Compliance-Gate Every Payment.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 leading-relaxed">
              VetoRail acts as an autonomous statutory circuit-breaker between your ERP and banking disbursement rails. 
              Eliminate tax loss by matching PO vs GRN vs Tax Invoice, auto-deducting Section 194Q TDS, and vetoing payment releases 
              until suppliers reflect in your live GSTR-2B.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-brand-700"
              >
                Open AP Command Rail
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#roi"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Calculator className="h-5 w-5 text-slate-500" />
                Calculate Saved ITC
              </a>
            </div>

            {/* Status Triad Preview Card */}
            <div className="mx-auto mt-14 max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-elevated">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
                <div className="text-left">
                  <div className="text-xs font-semibold uppercase text-slate-400">Live Statutory Gate Preview</div>
                  <div className="text-sm font-bold text-slate-900">Tata Steel Stevedoring Pvt Ltd · INV-2024-9182</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge-pass">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    3-Way: Exact Match
                  </span>
                  <span className="badge-hold">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    GSTR-2B: Unfiled (Hold)
                  </span>
                  <span className="badge-msme">
                    <Clock className="h-3.5 w-3.5 text-orange-600" />
                    MSME: 3 Days Left
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-left">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs text-slate-500 font-medium">Invoice Value</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-900">₹48,20,000</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs text-slate-500 font-medium">Inward ITC at Risk</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-amber-600">₹7,35,254</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs text-slate-500 font-medium">Sec 194Q TDS (0.1%)</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-indigo-600">₹4,820</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs text-slate-500 font-medium">Circuit Breaker Verdict</div>
                  <div className="text-sm font-bold text-rose-600 flex items-center gap-1">
                    <Ban className="h-4 w-4" /> VETO PAYMENT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pillars Section */}
        <section id="features" className="border-t border-slate-200 bg-white py-16 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                The 4 Autonomous Compliance Rails
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Engineered for the stringent regulatory landscape of Indian corporate finance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-lg border border-slate-200 p-5 hover:border-brand-300 transition">
                <div className="h-10 w-10 rounded-md bg-indigo-50 text-brand-600 flex items-center justify-center mb-4">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">3-Way Line Matching</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Deep line-item reconciliation of PO rate, GRN accepted quantity, and Tax Invoice billing with automated variance tolerances.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-5 hover:border-brand-300 transition">
                <div className="h-10 w-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">GSTR-2B Sec 16(2)(aa)</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Real-time synchronization against auto-drafted GSTR-2B records. Holds payments on missing returns to avert 18% interest penalties.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-5 hover:border-brand-300 transition">
                <div className="h-10 w-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">Section 194Q TDS</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Automated cumulative FY purchase tracking. Automatically withholds 0.1% TDS on aggregate spend exceeding ₹50 Lakhs.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-5 hover:border-brand-300 transition">
                <div className="h-10 w-10 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">Section 43B(h) MSME Clock</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  15/45-day statutory payment countdown shielding your enterprise against acute 30% corporate tax disallowance penalties.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 VetoRail. Autonomous B2B Accounts Payable & Statutory Tax Compliance Rail for Indian Enterprises.</p>
      </footer>
    </div>
  );
}
