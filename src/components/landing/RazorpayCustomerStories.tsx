'use client';

import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Building, CheckCircle } from 'lucide-react';
import { GsapFadeIn } from '../animations/GsapAnimations';

export function RazorpayCustomerStories() {
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      company: 'Tata Steel Logistics & Intermodal',
      logoText: 'TATA STEEL LOGISTICS',
      quote: 'VetoRail saved our finance team over 40 hours per month on manual GSTR-2B reconciliations. More importantly, we caught ₹1.82 Crores in unfiled GST credits before the funds ever left our bank account.',
      author: 'Rajiv Sengupta',
      designation: 'Head of Treasury & Taxation',
      impact: '₹1.82 Cr ITC Protected',
      metrics: '100% GSTR-2B Gated'
    },
    {
      company: 'Jindal Infrastructure & Power',
      logoText: 'JINDAL INFRA',
      quote: 'With Section 43B(h) enforcement, missing MSME 45-day payment cycles would have created massive disallowances. VetoRail automated our countdown and maker-checker approvals directly into our bank rail without director OTP friction.',
      author: 'Meenakshi Iyer',
      designation: 'VP Finance & Accounts',
      impact: '0 MSME Penalties',
      metrics: '45-Day SLA 100%'
    },
    {
      company: 'Zepto Hyperlocal Logistics',
      logoText: 'ZEPTO LOGISTICS',
      quote: 'Handling thousands of transport vendor payments weekly was impossible with standard bank portals. VetoRail gives us 50,000 bulk payouts in seconds with penny-drop safety and real-time SAP synchronization.',
      author: 'Abhinav Sharma',
      designation: 'Director of AP Operations',
      impact: '50K Bulk Payouts',
      metrics: '99.9% Uptime'
    }
  ];

  const current = stories[activeStory];

  return (
    <section className="bg-[#031B33] py-20 lg:py-28 text-white relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <GsapFadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-blue-900/60 pb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800">
                Customer Testimonials
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Trusted by Enterprise Finance Leaders
              </h2>
            </div>
            
            {/* Carousel Nav Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveStory((prev) => (prev === 0 ? stories.length - 1 : prev - 1))}
                aria-label="Previous customer story"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-900/50 text-blue-200 hover:bg-blue-800 border border-blue-700/60 transition-all active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveStory((prev) => (prev === stories.length - 1 ? 0 : prev + 1))}
                aria-label="Next customer story"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-900/50 text-blue-200 hover:bg-blue-800 border border-blue-700/60 transition-all active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </GsapFadeIn>

        {/* Active Customer Story Card (Screenshot 13) */}
        <div className="mt-12 rounded-3xl bg-[#072445] p-8 sm:p-12 lg:p-16 border border-blue-800/60 shadow-2xl relative">
          <Quote className="absolute top-8 right-8 h-16 w-16 text-blue-700/30 -scale-x-100" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8">
              {/* Company Eyebrow */}
              <div className="flex items-center gap-2 text-sky-400 text-xs font-extrabold tracking-wider uppercase">
                <Building className="h-4 w-4" />
                <span>{current.logoText}</span>
              </div>

              {/* Big Quote */}
              <p className="mt-6 text-xl sm:text-2xl font-medium leading-relaxed text-slate-100">
                &ldquo;{current.quote}&rdquo;
              </p>

              {/* Author Info */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 font-bold text-base border border-sky-400/30">
                  {current.author.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-base font-bold text-white">{current.author}</div>
                  <div className="text-xs text-sky-300/80">{current.designation} · {current.company}</div>
                </div>
              </div>
            </div>

            {/* Impact Metric Pillar */}
            <div className="lg:col-span-4 rounded-2xl bg-[#0B2E56] p-6 border border-blue-700/50 flex flex-col justify-center space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-300">Verified Impact</div>
                <div className="mt-2 text-3xl font-black text-white">{current.impact}</div>
              </div>

              <div className="pt-4 border-t border-blue-800">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-300">Compliance Benchmark</div>
                <div className="mt-1 text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>{current.metrics}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
