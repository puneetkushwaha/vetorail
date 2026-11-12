'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function ClientMarquee() {
  const clients = [
    { name: 'Tata Steel Infrastructure', category: 'Heavy Industrial' },
    { name: 'Aditya Birla Group Supply', category: 'Manufacturing & Materials' },
    { name: 'Jindal Precision Infra', category: 'Steel & Construction' },
    { name: 'Larsen & Toubro Intermodal', category: 'EPC & Logistics' },
    { name: 'Reliance Polychem Logistics', category: 'Chemicals & Transport' },
    { name: 'Hero MotoCorp Tier-1 AP', category: 'Automotive AP' },
    { name: 'Mahindra Logistics Freight', category: 'Supply Chain AP' }
  ];

  return (
    <section className="py-12 border-y border-slate-200/80 bg-white/60 backdrop-blur-sm overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Powering AP Compliance Across India&apos;s Leading Enterprise Supply Chains</span>
          </div>
          <div className="flex items-center gap-4 text-2xs font-mono text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              ₹2,400+ Cr Inward AP Gated
            </span>
            <span>•</span>
            <span className="text-emerald-700">0.0% GST Leakage</span>
          </div>
        </div>

        {/* Client Logos Grid / Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {clients.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/90 bg-white hover:border-brand-300 hover:shadow-card transition-all duration-200 text-center group"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-1">
                {c.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5 line-clamp-1">
                {c.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientMarquee;
