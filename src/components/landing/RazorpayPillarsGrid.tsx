'use client';

import React from 'react';
import { Maximize2, Settings2, Monitor, GitFork } from 'lucide-react';
import { GsapFadeIn } from '@/components/animations/GsapAnimations';

export function RazorpayPillarsGrid() {
  const pillars = [
    {
      icon: Maximize2,
      title: 'Built for Scale',
      description: '50,000 payouts in a single OTP with high payouts success rates and sub-second statutory verification.'
    },
    {
      icon: Settings2,
      title: 'Powerful Automation',
      description: 'Automate vendor payments, taxes (TDS 194Q), and GSTN GSTR-2B compliance with a new-age autonomous rail.'
    },
    {
      icon: Monitor,
      title: 'Smart Dashboard',
      description: 'Next-gen command centre to manage AP inflows, held working capital, and blocked ITC easily via desktop.'
    },
    {
      icon: GitFork,
      title: 'Delegate with Control',
      description: 'Collaborate with granular access controls, multi-level maker-checker, and cryptographic manager overrides.'
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Trusted By Strip (Screenshot 2 Authentic Feature) */}
        <div className="text-center mb-16">
          <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-8">
            Trusted by <strong className="text-slate-800">10,000+ businesses</strong> across Indian Enterprise Supply Chains
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-sm font-black font-sans text-slate-400 tracking-tight">
            <span className="hover:text-slate-900 transition-colors uppercase">HOUSING.COM</span>
            <span className="hover:text-slate-900 transition-colors uppercase">CRED</span>
            <span className="hover:text-slate-900 transition-colors uppercase">Flipkart</span>
            <span className="hover:text-slate-900 transition-colors uppercase">MATRIX PARTNERS</span>
            <span className="hover:text-slate-900 transition-colors uppercase">CREDIT SAISON</span>
            <span className="hover:text-slate-900 transition-colors uppercase">POONAWALLA FINANCE</span>
            <span className="hover:text-slate-900 transition-colors uppercase">JSW ONE MSME</span>
            <span className="hover:text-slate-900 transition-colors uppercase">GAMESKRAFT</span>
          </div>
        </div>

        {/* 4 Pillars Grid (Screenshot 2 Authentic Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <GsapFadeIn key={idx} delay={idx * 0.1} yOffset={20}>
                <div className="space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>
              </GsapFadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default RazorpayPillarsGrid;
