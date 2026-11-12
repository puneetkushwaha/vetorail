'use client';

import React from 'react';
import { Check, X, Building2 } from 'lucide-react';
import { GsapFadeIn } from '@/components/animations/GsapAnimations';

export function RazorpayComparison() {
  const rows = [
    {
      category: 'Beneficiary addition & superior payouts',
      vetorail: {
        title: 'Instant addition',
        points: ['No cooling-off period', 'No transfer limits']
      },
      traditional: {
        points: ['24 to 48 hours cooling-off period', 'Arbitrary daily transfer limits']
      }
    },
    {
      category: 'Multi-user experience',
      vetorail: {
        title: 'Granular control',
        points: ['Unlimited users', 'Easy multi-level approvals']
      },
      traditional: {
        points: ['Limited users', 'Complicated maker-checker tokens']
      }
    },
    {
      category: 'Banking on the go',
      vetorail: {
        points: ['Send, approve, track payments on the go']
      },
      traditional: {
        points: ['A non-intuitive mobile experience']
      }
    },
    {
      category: 'Smart bulk payouts',
      vetorail: {
        points: ['50,000 payouts in one OTP', 'Smart & simple Excel / ERP templates']
      },
      traditional: {
        points: ['Complex templates prone to errors']
      }
    },
    {
      category: 'Integrations',
      vetorail: {
        title: 'Accounting integrations',
        points: ['(SAP, Oracle, ZohoBooks, Tally, ERP software)', 'Popular business tools (Slack, Webhooks)']
      },
      traditional: {
        points: ['Zero integrations with your business and finance tools']
      }
    },
    {
      category: 'Insights & Statutory Gating',
      vetorail: {
        title: 'Smart Gating Dashboard',
        points: ['Real-time GSTR-2B Sec 16(2)(aa) veto', 'Sec 43B(h) MSME 15/45-day clock defense']
      },
      traditional: {
        points: ['Read bank statements and Excel sheets', 'Post-payment discovery of unfiled returns & 18% interest']
      }
    },
    {
      category: 'Premium support',
      vetorail: {
        title: 'Priority support',
        points: ['Prompt issue resolution', 'Dedicated relationship manager']
      },
      traditional: {
        points: ['Broken support experience', 'No dedicated channel of support']
      }
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header from Screenshot 3 */}
        <GsapFadeIn direction="up">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="text-xs uppercase font-extrabold tracking-wider text-brand-600 mb-2">
              VetoRail powered Current Accounts &amp; AP Rails
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Do more than just banking
            </h2>
          </div>
        </GsapFadeIn>

        {/* 2 Comparison Cards (Screenshot 3 & 4 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Row Labels (3 cols on md) */}
          <div className="hidden md:block md:col-span-3 space-y-16 pt-24 text-xs font-bold text-slate-500">
            {rows.map((r, i) => (
              <div key={i} className="h-16 flex items-center">
                {r.category}
              </div>
            ))}
          </div>

          {/* VetoRail Business Banking+ Card (Screenshot 3 Left Card - 5 cols) */}
          <div className="md:col-span-5 rounded-3xl border-2 border-emerald-500/80 bg-white p-6 sm:p-8 shadow-premium relative">
            {/* Header Icon */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div>
                <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mb-2">
                  <Check className="w-5 h-5 text-white stroke-[3]" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Business Banking+</h3>
                <p className="text-xs text-slate-500 font-medium">(VetoRail powered AP Rail)</p>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="divide-y divide-slate-100 space-y-8 pt-6">
              {rows.map((r, i) => (
                <div key={i} className="pt-6 first:pt-0">
                  <div className="md:hidden text-2xs font-bold uppercase text-slate-400 mb-2">
                    {r.category}
                  </div>
                  {r.vetorail.title && (
                    <div className="text-xs font-bold text-slate-900 mb-1">
                      {r.vetorail.title}
                    </div>
                  )}
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {r.vetorail.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Traditional Current Account Card (Screenshot 3 Right Card - 4 cols) */}
          <div className="md:col-span-4 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
            {/* Header Icon */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
              <div>
                <div className="h-8 w-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mb-2">
                  <Building2 className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Traditional Current Account</h3>
                <p className="text-xs text-slate-400 font-medium">&amp; Manual AP Process</p>
              </div>
            </div>

            {/* Crosslist Items */}
            <div className="divide-y divide-slate-200/80 space-y-8 pt-6">
              {rows.map((r, i) => (
                <div key={i} className="pt-6 first:pt-0">
                  <div className="md:hidden text-2xs font-bold uppercase text-slate-400 mb-2">
                    {r.category}
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-500">
                    {r.traditional.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default RazorpayComparison;
