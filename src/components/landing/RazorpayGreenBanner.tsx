'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  FileText, 
  Layers, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck
} from 'lucide-react';
import { GsapFadeIn } from '../animations/GsapAnimations';

export function RazorpayGreenBanner() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const cards = [
    {
      title: 'Smart Payouts',
      tagline: 'Instant payouts, anytime, anywhere',
      description: 'Execute single or batch disbursements across NEFT, RTGS, and IMPS 24x7 with automated beneficiary validation and zero bank branch visits.',
      icon: Zap,
      cta: 'Explore Smart Payouts'
    },
    {
      title: 'Bulk Payouts',
      tagline: 'Bulk payouts that are 10x smarter',
      description: 'Upload 50,000 line items via CSV, Excel, or direct ERP webhook. Pre-payment compliance gates ensure zero payments are made to delinquent GST suppliers.',
      icon: FileText,
      cta: 'Explore Bulk Payouts'
    },
    {
      title: 'Accounting Integrations',
      tagline: 'Easy integrations with your accounting software',
      description: 'Seamless two-way integration with TallyPrime, Zoho Books, SAP S/4HANA, and Oracle NetSuite. Auto-sync vendor bills, payment challans, and TDS returns.',
      icon: Layers,
      cta: 'Explore Integrations'
    }
  ];

  const handlePrev = () => {
    setActiveCardIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveCardIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative overflow-hidden bg-[#082E2B] py-20 lg:py-28 text-white">
      {/* Subtle Glowing Background Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner Header */}
        <GsapFadeIn direction="up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              Autonomous AP Rail that integrates all your finances
            </h2>
            <p className="mt-4 text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto">
              Replace multiple disconnected financial tools and spreadsheets with a unified digital compliance and banking rail built for modern Indian CFOs.
            </p>
          </div>
        </GsapFadeIn>

        {/* 3 Dark Green Feature Cards (Screenshot 10) */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isHighlight = idx === activeCardIndex;
            return (
              <GsapFadeIn key={card.title} delay={idx * 0.1} direction="up">
                <div 
                  onClick={() => setActiveCardIndex(idx)}
                  className={`h-full cursor-pointer rounded-3xl p-8 transition-all duration-300 border flex flex-col justify-between ${
                    isHighlight
                      ? 'bg-[#0E3D39] border-emerald-400/60 shadow-2xl scale-[1.02] ring-2 ring-emerald-400/30'
                      : 'bg-[#0A3430] border-emerald-900/60 hover:bg-[#0E3D39] hover:border-emerald-600/50'
                  }`}
                >
                  <div>
                    {/* Header Row: Title & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold tracking-wider text-emerald-300 uppercase">
                        {card.title}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Bold Tagline */}
                    <h3 className="mt-6 text-2xl font-extrabold text-white leading-snug">
                      {card.tagline}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-sm text-emerald-100/70 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Footer Link */}
                  <div className="mt-8 pt-6 border-t border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-300 group">
                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                      {card.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <ShieldCheck className="h-4 w-4 text-emerald-400/60" />
                  </div>
                </div>
              </GsapFadeIn>
            );
          })}
        </div>

        {/* Carousel Prev/Next Buttons (Screenshot 10) */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            aria-label="Previous Feature"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-700/60 transition-all active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCardIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === activeCardIndex ? 'w-6 bg-emerald-400' : 'w-2 bg-emerald-800'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            aria-label="Next Feature"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-700/60 transition-all active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
