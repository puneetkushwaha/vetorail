'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VetoRailLogo } from '../common/VetoRailLogo';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowUpRight, 
  Send
} from 'lucide-react';

export function RazorpayMegaFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  const partnerBanks = [
    'IDFC FIRST Bank',
    'ICICI Bank',
    'RBL Bank',
    'YES BANK',
    'Axis Bank',
    'RazorpayX Rail'
  ];

  const securityBadges = [
    { title: 'ISO 27001:2022', desc: 'Information Security' },
    { title: 'SOC-2 Type II', desc: 'Enterprise Compliance' },
    { title: 'GSTN GSP Direct', desc: 'GSTR-2B SLA 100%' },
    { title: 'NPCI Certified', desc: '256-Bit TLS Bank Grade' },
    { title: 'MSMED Act 2006', desc: 'Section 43B(h) Ready' }
  ];

  return (
    <footer className="bg-[#0B132B] text-slate-400 text-xs border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. Clean Partner Bank Strip (RazorpayX Screenshot 15 Authentic Style) */}
        <div className="py-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="h-4 w-4 text-slate-400" />
            <span>Banking Services Powered by RBI-Regulated Commercial Partners:</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-300">
            {partnerBanks.map((bank, index) => (
              <React.Fragment key={bank}>
                <span className="hover:text-white transition-colors">{bank}</span>
                {index < partnerBanks.length - 1 && <span className="text-slate-600">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 2. Clean Newsletter Box (Simple, Understated Razorpay Style) */}
        <div className="py-8 border-b border-slate-800/80">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Subscribe to Statutory AP Updates
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Receive important circular updates on Section 43B(h), GSTR-2B API releases, and Section 194Q TDS rules directly in your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex-1 max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 p-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Subscribed to VetoRail Statutory Bulletins.</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cfo@enterprise.in"
                    required
                    className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-600 hover:bg-brand-700 px-4 py-2 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Subscribe</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 3. Main 5-Column Navigation (Clean, Professional Razorpay/Stripe Grid) */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="inline-block">
              <VetoRailLogo size="sm" textColor="text-white" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous Accounts Payable (AP) Automation, 3-Way Line Matching, and Statutory Tax Compliance Rail for Indian Enterprises.
            </p>
            <div className="text-[11px] text-slate-400 font-mono pt-1">
              GSTN GSP Pipeline Operational
            </div>
          </div>

          {/* Col 2: Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              AP Command Rail
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/app" className="hover:text-white transition flex items-center justify-between group">
                  <span>AP Command Rail</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-600 group-hover:text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/app/matching" className="hover:text-white transition flex items-center justify-between group">
                  <span>3-Way Match Engine</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-600 group-hover:text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/app/gstr2b" className="hover:text-white transition flex items-center justify-between group">
                  <span>GSTR-2B Simulator</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-600 group-hover:text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/app/vendors" className="hover:text-white transition flex items-center justify-between group">
                  <span>Vendor Directory &amp; MSME</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-600 group-hover:text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/app/analytics" className="hover:text-white transition flex items-center justify-between group">
                  <span>CFO Executive Analytics</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-600 group-hover:text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-white transition">
                  Bulk Payouts Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Rails */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Statutory Rails
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  CGST Sec 16(2)(aa)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  Income Tax Sec 43B(h)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  MSMED Act 2006 (Sec 15)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  TDS Sec 194Q Withholding
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  CGST Sec 50 Interest Rules
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors block">
                  Rule 36(4) Reconciliation
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: ERP Connectors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              ERP Integrations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-white transition-colors block cursor-default">
                  SAP S/4HANA &amp; ECC
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block cursor-default">
                  TallyPrime &amp; ERP9
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block cursor-default">
                  Zoho Books
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block cursor-default">
                  Oracle NetSuite
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block cursor-default">
                  GSTN Direct GSP API
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block cursor-default">
                  NPCI Penny-Drop Validator
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Enterprise Hub */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Enterprise Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#roi-calculator" className="hover:text-white transition-colors block">
                  ROI Simulator
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors block">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-white transition-colors block">
                  SOC-2 Type II Report
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-white transition-colors block">
                  ISO 27001 Certification
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors block cursor-default">
                  Security Whitepaper
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors block cursor-default">
                  Contact Sales
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* 4. Clean Monochrome Security & Certification Badges */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {securityBadges.map((badge) => (
              <div 
                key={badge.title}
                className="rounded-lg bg-slate-900/60 p-3 border border-slate-800 flex items-center gap-2.5"
              >
                <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">{badge.title}</div>
                  <div className="text-[10px] text-slate-500">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Clean Regulatory Legal Notice (Authentic Razorpay Disclaimer) */}
        <div className="py-6 text-[11px] leading-relaxed text-slate-500 space-y-2">
          <p>
            Disclaimer: VetoRail is a financial technology software platform, not a bank. Current accounts, escrow mechanisms, and payment processing are powered by RBI-regulated scheduled commercial banking partners including IDFC FIRST Bank, ICICI Bank, RBL Bank, YES BANK, and Axis Bank. All trademarks, logos, and brand names are the property of their respective owners.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 border-t border-slate-800/60">
            <div>
              © 2026 VetoRail Technologies Private Limited. All rights reserved. Registered under Indian Companies Act, 2013.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
              <span>·</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">RBI Guidelines</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
