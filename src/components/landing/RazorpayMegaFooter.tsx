'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { VetoRailLogo } from '../common/VetoRailLogo';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowUpRight, 
  Send, 
  Sparkles, 
  Activity, 
  Globe, 
  Building2
} from 'lucide-react';

export function RazorpayMegaFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    
    // Confetti trigger
    if (typeof window !== 'undefined') {
      try {
        const testCanvas = document.createElement('canvas');
        if (testCanvas.getContext && testCanvas.getContext('2d')) {
          confetti({
            particleCount: 65,
            spread: 55,
            origin: { y: 0.85 },
            colors: ['#0284C7', '#10B981', '#6366F1', '#F59E0B']
          });
        }
      } catch {
        // fallback
      }
    }
  };

  const partnerBanks = [
    { name: 'IDFC FIRST Bank', role: 'Core CMS & Escrow Rail', status: 'Active' },
    { name: 'ICICI Bank', role: 'Corporate Treasury API', status: 'Active' },
    { name: 'RBL Bank', role: 'Current Account Engine', status: 'Active' },
    { name: 'YES BANK', role: '24x7 IMPS/RTGS Rail', status: 'Active' },
    { name: 'Axis Bank', role: 'Forex & Working Capital', status: 'Active' },
    { name: 'RazorpayX', role: 'Smart Bulk Payouts Rail', status: 'Active' },
  ];

  const securitySeals = [
    { title: 'ISO 27001:2022', subtitle: 'Information Security Certified', color: 'text-sky-400' },
    { title: 'SOC-2 Type II', subtitle: 'Continuous Enterprise Audit', color: 'text-emerald-400' },
    { title: 'GSTN GSP Direct', subtitle: '100% GSTR-2B Statement SLA', color: 'text-indigo-400' },
    { title: 'NPCI Certified', subtitle: '256-Bit TLS Bank Encryption', color: 'text-teal-400' },
    { title: 'MSMED Act 2006', subtitle: 'Automated 45-Day Countdown', color: 'text-amber-400' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-400 border-t border-slate-800/80 overflow-hidden selection:bg-brand-500 selection:text-white">
      
      {/* Background Decorative Ambient Radial Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-brand-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. TOP INTERACTIVE REGULATORY NEWSLETTER / CFO DISPATCH BAR */}
        <div className="pt-12 pb-10 border-b border-slate-800/80">
          <div className="rounded-3xl bg-gradient-to-r from-slate-800/90 via-slate-900/90 to-slate-800/90 p-6 sm:p-8 border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-300 border border-brand-500/30 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                <span>Statutory Compliance Dispatch</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Stay ahead of Indian Tax Jurisprudence
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Get real-time statutory circular alerts (Section 43B(h) amendments, GSTN GSTR-2B API releases, and Section 194Q TDS rules) delivered directly to your CFO inbox.
              </p>
            </div>

            {/* Newsletter Input Form */}
            <form onSubmit={handleSubscribe} className="flex-1 max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 p-3.5 text-xs font-bold text-emerald-300 animate-in fade-in duration-300">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>✓ You are subscribed to the VetoRail Enterprise Statutory Dispatch!</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cfo@enterprise.in"
                    required
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Subscribe</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 2. AUTHENTIC BANKING PARTNERS STRIP WITH LIVE CONNECTION STATUS */}
        <div className="py-8 border-b border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Banking Rails Powered by RBI-Scheduled Commercial Banking Partners:</span>
            </div>
            <div className="flex items-center gap-2 text-2xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Direct Host-to-Host Connected</span>
            </div>
          </div>

          {/* 6 Bank Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {partnerBanks.map((bank) => (
              <div 
                key={bank.name}
                className="rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 p-3.5 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <Building2 className="h-4 w-4 text-slate-400 group-hover:text-brand-400 transition-colors" />
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-extrabold text-white group-hover:text-brand-300 transition-colors">
                    {bank.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    {bank.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. MAIN 5-COLUMN NAVIGATION GRID */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Autonomous Gating Statement */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <VetoRailLogo size="md" textColor="text-white" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Autonomous Accounts Payable (AP) Automation, 3-Way Line Matching, and Statutory Tax Compliance Rail for Indian Enterprises. Eliminating GST ITC leakage and Section 43B(h) penalties before disbursement.
            </p>
            
            {/* Live GSP Pipeline Indicator */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/60 text-xs">
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">GSTN Portal Pipeline</div>
                <div className="text-[11px] font-semibold text-emerald-400">GSTR-2B Sync: 100% Operational</div>
              </div>
            </div>
          </div>

          {/* Column 2: Enterprise AP Command Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
              <span>AP Command Rail</span>
              <span className="text-[9px] font-mono font-bold bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30">RAIL</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/app" className="hover:text-white transition flex items-center justify-between group">
                  <span>AP Command Rail</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover:text-brand-400 transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/app/matching" className="hover:text-white transition flex items-center justify-between group">
                  <span>3-Way Match Engine</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover:text-brand-400 transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/app/gstr2b" className="hover:text-white transition flex items-center justify-between group">
                  <span>GSTR-2B Simulator</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover:text-brand-400 transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/app/vendors" className="hover:text-white transition flex items-center justify-between group">
                  <span>Vendor Directory &amp; MSME</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover:text-brand-400 transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/app/analytics" className="hover:text-white transition flex items-center justify-between group">
                  <span>CFO Executive Analytics</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover:text-brand-400 transition-colors" />
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-white transition flex items-center justify-between group">
                  <span>50,000 Bulk Payouts</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded">FAST</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Statutory Acts & Tax Jurisprudence */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
              <span>Statutory Rails</span>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">ACTS</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  CGST Sec 16(2)(aa) Gating
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  Income Tax Sec 43B(h) SLA
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  MSMED Act 2006 (Sec 15)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  TDS Sec 194Q Auto-Deduction
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  CGST Sec 50 Interest Rules
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  Rule 36(4) 100% 2B Verification
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: ERP Connectors & Developer APIs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
              <span>ERP &amp; Tech</span>
              <span className="text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30">SYNC</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-white transition-colors block">
                  SAP S/4HANA &amp; ECC Sync
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block">
                  TallyPrime &amp; ERP9 Connector
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block">
                  Zoho Books Two-Way Webhooks
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block">
                  Oracle NetSuite ERP Adapter
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block">
                  GSTN Direct GSP API Pipe
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block">
                  NPCI Penny-Drop Validator
                </span>
              </li>
            </ul>
          </div>

          {/* Column 5: Enterprise Solutions & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
              <span>Enterprise Hub</span>
              <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">TRUST</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#roi-calculator" className="hover:text-white transition-colors block">
                  CFO ROI Exposure Model
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors block">
                  Transparent Pricing Tiers
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-white transition-colors block">
                  SOC-2 Type II Audit Report
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-white transition-colors block">
                  ISO 27001 Security Whitepaper
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors block">
                  24/7 Dedicated Legal Pod
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block">
                  System Status &amp; Incident Log
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* 4. ENTERPRISE COMPLIANCE & SECURITY BADGES STRIP */}
        <div className="py-8 border-b border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
            Audited &amp; Certified Bank-Grade Enterprise Defense
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {securitySeals.map((seal) => (
              <div 
                key={seal.title}
                className="rounded-2xl bg-slate-900/90 p-3.5 border border-slate-800 flex items-center gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-white font-bold flex-shrink-0">
                  <Lock className={`h-4 w-4 ${seal.color}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{seal.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{seal.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. SYSTEM OPERATIONAL STATUS & GLOBAL CONTROLS BAR */}
        <div className="py-6 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-semibold">All Systems Operational</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-emerald-400">99.99% Uptime</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>India Region (IN-MUM-1)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-white transition-colors cursor-pointer">Security Whitepaper</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">RBI Guidelines</span>
          </div>
        </div>

        {/* 6. REGULATORY STATUTORY DISCLAIMER (EXACT RAZORPAYX LEGAL STANDARD) */}
        <div className="py-8 text-[11px] leading-relaxed text-slate-500 space-y-3">
          <p>
            Regulatory Disclosure: VetoRail is a financial technology software infrastructure platform developed and operated by VetoRail Technologies Private Limited. VetoRail is not a banking institution and does not hold a banking license. Digital current accounts, escrow arrangements, and direct fund settlement are powered exclusively by our Reserve Bank of India (RBI) regulated scheduled commercial banking partners: IDFC FIRST Bank, ICICI Bank, RBL Bank, YES BANK, and Axis Bank.
          </p>
          <p>
            All banking services, account opening verifications, KYC authentications, and fund settlements are subject to partner bank credit and risk approvals in full adherence to RBI Master Directions. Automated GST Input Tax Credit (ITC) reconciliation and Section 43B(h) MSME alerts are calculated via direct integration with GSTN-licensed GST Suvidha Providers (GSPs) and the MSME Udyam verification portal. All product names, logos, and brands are property of their respective owners.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900 text-slate-600">
            <div>
              © 2026 VetoRail Technologies Private Limited. CIN: U72900KA2026PTC189021. Registered under Indian Companies Act, 2013.
            </div>
            <div className="font-mono text-[10px]">
              Engineered with ⚡ for Indian CFOs &amp; Tax Directors
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
