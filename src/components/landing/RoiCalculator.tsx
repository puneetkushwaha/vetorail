'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Coins
} from 'lucide-react';
import { calculateEnterpriseRoi } from '@/lib/engines/roiModel';
import { formatCompactINR, formatINR, formatNumberIN } from './formatters';

export function RoiCalculator() {
  // 1. Monthly Invoice Spend (₹1 Cr to ₹100 Cr+, default ₹10 Cr)
  // 1 Crore = 10,000,000 INR
  const [monthlySpendCrores, setMonthlySpendCrores] = useState<number>(10);

  // 2. Vendor Count (25 to 2,500, default 250)
  const [vendorCount, setVendorCount] = useState<number>(250);

  // 3. MSME Vendor Percentage (5% to 80%, default 35%)
  const [msmePercentage, setMsmePercentage] = useState<number>(35);

  // Advanced parameter: Unfiled 2B rate % (default 3.5%)
  const [unfiledRate, setUnfiledRate] = useState<number>(3.5);

  // Convert Crores to INR
  const monthlySpendINR = monthlySpendCrores * 10000000;

  // Compute live ROI using the authoritative calculation engine
  const roiResult = useMemo(() => {
    return calculateEnterpriseRoi({
      monthlySpendINR,
      monthlyInvoiceCount: Math.round(vendorCount * 4.5), // average 4.5 invoices per vendor/mo
      msmeSupplierPct: msmePercentage,
      unfiledSupplierRatePct: unfiledRate
    });
  }, [monthlySpendINR, vendorCount, msmePercentage, unfiledRate]);

  // Quick Presets
  const presets = [
    { label: '₹5 Cr', value: 5 },
    { label: '₹10 Cr', value: 10 },
    { label: '₹25 Cr', value: 25 },
    { label: '₹50 Cr', value: 50 },
    { label: '₹100 Cr', value: 100 }
  ];

  return (
    <section id="roi-calculator" className="py-20 lg:py-28 bg-canvas border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 mb-4 shadow-subtle">
            <Coins className="h-3.5 w-3.5 text-emerald-600" />
            <span>Quantitative CFO ROI Framework</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Calculate Your Enterprise Statutory Protection & ROI
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            See how much unclaimable GST Input Tax Credit, Section 50 interest liabilities, and Section 43B(h) tax disallowances VetoRail saves your business every year.
          </p>
        </div>

        {/* Calculator Card Container */}
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white shadow-elevated overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Interactive Inputs (7 cols on lg) */}
            <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enterprise Parameters</h3>
                  <p className="text-xs text-slate-500">Adjust the sliders to match your AP operation</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  <span>Live Model:</span>
                  <strong className="text-emerald-700">Sec 16(2)(aa) + 43B(h)</strong>
                </div>
              </div>

              {/* Slider 1: Monthly AP Spend */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="spend-slider" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    Monthly Invoice Spend
                    <span className="text-xs text-slate-400 font-normal">(Inward AP)</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-base font-bold text-brand-600 tabular-nums">
                      ₹{monthlySpendCrores} Cr
                    </span>
                    <span className="text-xs text-slate-400">/ mo</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  id="spend-slider"
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={monthlySpendCrores}
                  onChange={(e) => setMonthlySpendCrores(Number(e.target.value))}
                  className="mt-3 w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none"
                />

                {/* Quick Preset Buttons */}
                <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-[11px] text-slate-500 font-mono">₹1 Cr</div>
                  <div className="flex items-center gap-1.5">
                    {presets.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setMonthlySpendCrores(p.value)}
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border transition ${
                          monthlySpendCrores === p.value
                            ? 'bg-brand-50 text-brand-700 border-brand-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">₹100 Cr</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Annualized Spend: <strong className="font-mono text-slate-700">{formatCompactINR(monthlySpendINR * 12)}</strong>
                </div>
              </div>

              {/* Slider 2: Active Vendor Count */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label htmlFor="vendor-slider" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    Active Supplier / Vendor Count
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {formatNumberIN(vendorCount)}
                    </span>
                    <span className="text-xs text-slate-400">vendors</span>
                  </div>
                </div>

                <input
                  id="vendor-slider"
                  type="range"
                  min="25"
                  max="2500"
                  step="25"
                  value={vendorCount}
                  onChange={(e) => setVendorCount(Number(e.target.value))}
                  className="mt-3 w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none"
                />

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>25 vendors</span>
                  <span>500</span>
                  <span>1,000</span>
                  <span>2,500 vendors</span>
                </div>
              </div>

              {/* Slider 3: MSME Vendor Percentage */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label htmlFor="msme-slider" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    MSME Supplier Share
                    <span className="text-[11px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded font-mono font-medium">
                      Sec 43B(h) Scope
                    </span>
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-base font-bold text-orange-600 tabular-nums">
                      {msmePercentage}%
                    </span>
                    <span className="text-xs text-slate-400">of spend</span>
                  </div>
                </div>

                <input
                  id="msme-slider"
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={msmePercentage}
                  onChange={(e) => setMsmePercentage(Number(e.target.value))}
                  className="mt-3 w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
                />

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>5% (Low MSME exposure)</span>
                  <span>35% (Avg Enterprise)</span>
                  <span>80% (High MSME exposure)</span>
                </div>
              </div>

              {/* Slider 4: Unfiled GSTR-2B Rate */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label htmlFor="unfiled-slider" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    Estimated Supplier Unfiled / Mismatch Rate
                  </label>
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {unfiledRate}% unfiled
                  </span>
                </div>

                <input
                  id="unfiled-slider"
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.5"
                  value={unfiledRate}
                  onChange={(e) => setUnfiledRate(Number(e.target.value))}
                  className="mt-2 w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Indian enterprise average: 3.5% of vendor invoices encounter GSTR-2B delays or discrepancies before payment.
                </p>
              </div>
            </div>

            {/* Right Column: Dynamic Real-Time Financial Cards (5 cols on lg) */}
            <div className="p-6 sm:p-8 lg:p-10 lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                    Calculated Annual Economic Value
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                    <Sparkles className="h-3 w-3" />
                    {roiResult.roiMultiplier}x Net ROI
                  </div>
                </div>

                {/* Main Big Number */}
                <div className="mt-6">
                  <div className="text-xs font-medium text-slate-400">Total Net Estimated Annual Benefit</div>
                  <div className="mt-1 font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {formatCompactINR(roiResult.totalAnnualBenefitINR)}
                  </div>
                  <div className="mt-1 text-xs text-emerald-400 font-mono">
                    ≈ {formatINR(roiResult.totalAnnualBenefitINR)} / year protected
                  </div>
                </div>

                {/* Financial Breakdown Cards */}
                <div className="mt-6 space-y-3">
                  
                  {/* Metric 1: Annual ITC Protected */}
                  <div className="rounded-lg bg-slate-800/80 border border-slate-700/60 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Annual ITC Protected
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Section 16(2)(aa) unfiled return defense
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-emerald-400">
                        {formatCompactINR(roiResult.itcSavedAnnualINR)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatINR(roiResult.itcSavedAnnualINR)}
                      </div>
                    </div>
                  </div>

                  {/* Metric 2: Working Capital Retained */}
                  <div className="rounded-lg bg-slate-800/80 border border-slate-700/60 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        Working Capital Retained
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Funds held on non-compliant invoices
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-indigo-300">
                        {formatCompactINR(roiResult.workingCapitalProtectedINR)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatINR(roiResult.workingCapitalProtectedINR)}
                      </div>
                    </div>
                  </div>

                  {/* Metric 3: Section 50 Penal Interest Avoided */}
                  <div className="rounded-lg bg-slate-800/80 border border-slate-700/60 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        Sec 50 18% Penal Interest Avoided
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Saved over audit discovery window
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-amber-400">
                        {formatCompactINR(roiResult.sec50InterestAvoidedINR)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatINR(roiResult.sec50InterestAvoidedINR)}
                      </div>
                    </div>
                  </div>

                  {/* Metric 4: Section 43B(h) Corporate Tax Shielded */}
                  <div className="rounded-lg bg-slate-800/80 border border-slate-700/60 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-orange-400" />
                        Sec 43B(h) MSME Tax Shielded
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        30% corporate tax penalty avoided
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-orange-400">
                        {formatCompactINR(roiResult.msmePenaltiesShieldedINR)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatINR(roiResult.msmePenaltiesShieldedINR)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payback period notice */}
                <div className="mt-4 rounded-md bg-slate-800/40 p-2 text-center text-xs text-slate-400">
                  Estimated Payback Period: <strong className="text-white">{roiResult.paybackMonths} Months</strong> to 100% breakeven.
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <Link
                  href="/app"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-elevated transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  Deploy AP Command Rail
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="text-center text-[11px] text-slate-500 mt-2">
                  No credit card required · Instant mock sandbox available
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
