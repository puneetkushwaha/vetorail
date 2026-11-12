'use client';

import React from 'react';
import Link from 'next/link';
import { VetoRailLogo } from '../common/VetoRailLogo';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export function RazorpayMegaFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      
      {/* Top Banking Partner Rail */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Banking Services Provided By RBI-Regulated Commercial Partners:</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-300">
            <span className="hover:text-white transition-colors">IDFC FIRST Bank</span>
            <span className="text-slate-600">·</span>
            <span className="hover:text-white transition-colors">ICICI Bank</span>
            <span className="text-slate-600">·</span>
            <span className="hover:text-white transition-colors">RBL Bank</span>
            <span className="text-slate-600">·</span>
            <span className="hover:text-white transition-colors">YES BANK</span>
            <span className="text-slate-600">·</span>
            <span className="hover:text-white transition-colors">Axis Bank</span>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          
          {/* Brand & Overview */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <VetoRailLogo size="md" textColor="text-white" />
            </Link>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Autonomous B2B Accounts Payable compliance circuit breaker and banking rail. Protecting Indian enterprises against GST ITC loss and Section 43B(h) penalties.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md">
                <Lock className="h-3 w-3" />
                SOC-2 Type II
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-950/60 border border-sky-800/80 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="h-3 w-3" />
                ISO 27001
              </span>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AP Command Rails
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/app" className="hover:text-white transition-colors">
                  Autonomous 3-Way Match
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-white transition-colors">
                  GSTR-2B Compliance Gate
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-white transition-colors">
                  MSME 45-Day Countdown
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-white transition-colors">
                  Section 194Q TDS Auto-Rail
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-white transition-colors">
                  Bulk Payouts Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Statutory Jurisprudence */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Statutory Acts
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <span className="hover:text-white transition-colors">
                  CGST Sec 16(2)(aa)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  Income Tax Sec 43B(h)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  MSMED Act 2006 (Sec 15)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  TDS Sec 194Q Withholding
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  CGST Sec 50 Interest Rules
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: ERP Connectors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Integrations
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <span className="hover:text-white transition-colors">
                  SAP S/4HANA &amp; ECC
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  TallyPrime &amp; Tally ERP9
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  Zoho Books
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  Oracle NetSuite
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  GSTN Direct GSP API
                </span>
              </li>
            </ul>
          </div>

          {/* Column 5: Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Enterprise
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/app" className="hover:text-white transition-colors">
                  AP Command Dashboard
                </Link>
              </li>
              <li>
                <a href="#roi-calculator" className="hover:text-white transition-colors">
                  ROI Simulator
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Enterprise Pricing
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  Security Whitepaper
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  Contact Compliance Pod
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimer (Screenshot 15) */}
        <div className="mt-12 border-t border-slate-800 pt-8 text-[11px] leading-relaxed text-slate-500">
          <p>
            Disclaimer: VetoRail is a financial technology software platform, not a bank. Current accounts, escrow mechanisms, and payment processing are powered by RBI-regulated scheduled commercial banking partners including IDFC FIRST Bank, ICICI Bank, RBL Bank, YES BANK, and Axis Bank. All trademarks, logos, and brand names are the property of their respective owners.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © 2026 VetoRail Technologies Private Limited. All rights reserved. Registered under Indian Companies Act, 2013.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-300 transition-colors">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-slate-300 transition-colors">Terms of Service</span>
              <span>·</span>
              <span className="hover:text-slate-300 transition-colors">RBI Guidelines</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
