import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  Hero,
  RoiCalculator,
  FeaturePillars,
  StatutoryBadges,
  Testimonials,
  Footer
} from '@/components/landing';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas selection:bg-brand-100 selection:text-brand-900">
      
      {/* 1. Regulatory Statutory Alert Banner */}
      <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-brand-50/70 to-indigo-50/90 px-4 py-2 text-center text-xs font-medium text-indigo-950 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-brand-700 bg-white px-2 py-0.5 rounded border border-indigo-200/80 shadow-subtle">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
            Statutory Notice
          </span>
          <span>
            Section 43B(h) MSME 45-day payment enforcement & Section 16(2)(aa) 100% GSTR-2B gating active across Indian AP rails.
          </span>
          <a
            href="#roi-calculator"
            className="text-brand-700 font-bold underline hover:text-brand-900 transition ml-1"
          >
            Calculate Risk Exposure &rarr;
          </a>
        </div>
      </div>

      {/* 2. Sticky Enterprise Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-extrabold text-base shadow-sm group-hover:bg-brand-700 transition">
              VR
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                VetoRail
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">
                Autonomous AP Compliance Rail
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">
              Statutory Rails
            </a>
            <a href="#circuit-breaker-demo" className="transition hover:text-slate-900">
              3-Way Matching
            </a>
            <a href="#roi-calculator" className="transition hover:text-slate-900">
              ROI Calculator
            </a>
            <a href="#trust" className="transition hover:text-slate-900">
              Trust &amp; GSTN
            </a>
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <span>Launch AP Command Rail</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Main Landing Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* 3 Deep-Dive Feature Pillars */}
        <FeaturePillars />

        {/* Interactive ROI Calculator */}
        <RoiCalculator />

        {/* Statutory Compliance Shields */}
        <StatutoryBadges />

        {/* Enterprise Testimonials */}
        <Testimonials />

        {/* Pre-Footer Enterprise CTA Banner */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-canvas border-t border-slate-200">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-3xl border border-indigo-200/90 bg-gradient-to-r from-indigo-50/80 via-white to-brand-50/80 p-8 sm:p-14 shadow-card">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1 text-xs font-semibold text-brand-700 mb-4 shadow-subtle">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                <span>Zero Risk Demonstration Mode Available</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Ready to Automate Your Statutory AP Defense?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 leading-relaxed">
                Deploy VetoRail alongside your existing ERP to prevent unclaimable GST Input Tax Credit leakage, auto-gate supplier payments, and protect against Section 43B(h) corporate tax penalties.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-elevated transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  Enter AP Command Rail
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#roi-calculator"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  Re-Calculate ROI
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Enterprise Footer */}
      <Footer />
      
    </div>
  );
}
