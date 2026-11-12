'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ScanLine, 
  Play, 
  Check, 
  Sparkles, 
  Send, 
  Sliders
} from 'lucide-react';
import { GsapFadeIn, GsapTiltCard } from '../animations/GsapAnimations';

export function InteractiveBentoPlayground() {
  // Slider State (Demo 1)
  const [spendCr, setSpendCr] = useState<number>(15);
  const [payoutDone, setPayoutDone] = useState<boolean>(false);

  // OCR Scan State (Demo 2)
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);

  // Maker-Checker State (Demo 3)
  const [cfoSigned, setCfoSigned] = useState<boolean>(false);

  // Safe Confetti trigger helper
  const fireConfetti = () => {
    if (typeof window === 'undefined') return;
    try {
      const testCanvas = document.createElement('canvas');
      if (!testCanvas.getContext || !testCanvas.getContext('2d')) {
        return;
      }
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#4F46E5', '#10B981', '#38BDF8', '#F59E0B']
      });
    } catch {
      // fallback
    }
  };

  const handleSimulatePayout = () => {
    setPayoutDone(true);
    fireConfetti();
  };

  const handleRunOcrScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      fireConfetti();
    }, 1500);
  };

  const handleCfoSign = () => {
    setCfoSigned(true);
    fireConfetti();
  };

  // Calculations based on spend slider
  const annualSpend = spendCr * 10000000 * 12;
  const itcSaved = Math.round(annualSpend * 0.18 * 0.035);
  const msmeShielded = Math.round(annualSpend * 0.35 * 0.045);
  const batchCount = spendCr * 1200;

  return (
    <section className="bg-slate-900 text-white py-24 lg:py-32 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Background Neon Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-brand-500/20 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-emerald-500/20 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <GsapFadeIn direction="up">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3.5 py-1 text-xs font-bold text-brand-300 border border-brand-500/30">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              <span>Interactive AP Sandbox</span>
            </div>
            
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
              Try It Yourself.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-brand-400 to-emerald-400">
                Experience Autonomous Gating.
              </span>
            </h2>
            
            <p className="mt-4 text-base sm:text-lg text-slate-400">
              Interact with our live simulations below. Test working capital scaling, run real-time AI line matching, and authorize a multi-tier payment.
            </p>
          </div>
        </GsapFadeIn>

        {/* 3 Interactive Bento Cards Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Interactive Working Capital & Payout Speed Slider (7 cols) */}
          <div className="lg:col-span-7">
            <GsapTiltCard className="h-full">
              <div className="h-full rounded-3xl bg-slate-800/80 p-8 border border-slate-700/80 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
                        <Sliders className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Working Capital Protection Engine</h3>
                        <p className="text-xs text-slate-400">Drag spend slider to calculate real-time savings</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                      Live Math Model
                    </span>
                  </div>

                  {/* Interactive Slider Input */}
                  <div className="mt-8">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300">Monthly Inward AP Spend:</span>
                      <span className="text-2xl font-black font-mono text-brand-400">
                        ₹{spendCr} Crores <span className="text-xs text-slate-400">/ mo</span>
                      </span>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={spendCr}
                      onChange={(e) => {
                        setSpendCr(Number(e.target.value));
                        setPayoutDone(false);
                      }}
                      className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />

                    <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                      <span>₹1 Cr</span>
                      <span>₹25 Cr</span>
                      <span>₹50 Cr</span>
                      <span>₹100 Cr</span>
                    </div>
                  </div>

                  {/* Dynamic Output Cards */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-700/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Annual ITC Protected
                      </div>
                      <div className="mt-1 text-2xl font-black font-mono text-emerald-400 tabular-nums">
                        ₹{(itcSaved / 100000).toFixed(1)} Lakhs
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">100% GSTR-2B gated</div>
                    </div>

                    <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-700/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        MSME 43B(h) Penalties Shielded
                      </div>
                      <div className="mt-1 text-2xl font-black font-mono text-sky-400 tabular-nums">
                        ₹{(msmeShielded / 100000).toFixed(1)} Lakhs
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">0% corporate tax penalty</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Simulation Action */}
                <div className="mt-8 pt-6 border-t border-slate-700/60 flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-white">{batchCount.toLocaleString()} Payouts</span> scheduled for release
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatePayout}
                    className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
                      payoutDone
                        ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/30'
                    }`}
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{payoutDone ? '✓ ₹' + spendCr + ' Cr Batch Released via RTGS' : 'Simulate 1-Click Payout'}</span>
                  </button>
                </div>
              </div>
            </GsapTiltCard>
          </div>

          {/* Card 2: AI OCR Line Item Scanner Demo (5 cols) */}
          <div className="lg:col-span-5">
            <GsapTiltCard className="h-full">
              <div className="h-full rounded-3xl bg-slate-800/80 p-8 border border-slate-700/80 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        <ScanLine className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">AI OCR Line-Item Engine</h3>
                        <p className="text-xs text-slate-400">99.8% precision extraction</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 border border-sky-800/80 px-2.5 py-1 rounded-full">
                      PO vs GRN
                    </span>
                  </div>

                  {/* Simulated Invoice Card */}
                  <div className="mt-6 rounded-2xl bg-slate-900 p-4 border border-slate-700/80 relative overflow-hidden">
                    {/* Animated Scanning Laser Beam */}
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce z-20" />
                    )}

                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs">
                      <span className="font-mono text-slate-400">INV-2024-TATA-8812</span>
                      <span className="font-bold text-slate-200">Tata Steel Stevedoring</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className={`p-2 rounded-lg border transition-all ${
                        scanComplete
                          ? 'bg-emerald-950/40 border-emerald-700/70 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        <div className="flex justify-between font-bold">
                          <span>Heavy Port Logistics</span>
                          <span>800/800 Qty</span>
                        </div>
                        <div className="flex justify-between text-[10px] opacity-80 mt-0.5">
                          <span>Rate: ₹4,500</span>
                          <span>{scanComplete ? '✓ Exact PO Match' : 'Awaiting Scan'}</span>
                        </div>
                      </div>

                      <div className={`p-2 rounded-lg border transition-all ${
                        scanComplete
                          ? 'bg-emerald-950/40 border-emerald-700/70 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        <div className="flex justify-between font-bold">
                          <span>Intermodal Drayage</span>
                          <span>200/200 Qty</span>
                        </div>
                        <div className="flex justify-between text-[10px] opacity-80 mt-0.5">
                          <span>Rate: ₹6,100</span>
                          <span>{scanComplete ? '✓ Exact GRN Match' : 'Awaiting Scan'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan Button Action */}
                <div className="mt-6 pt-4 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={handleRunOcrScan}
                    disabled={isScanning}
                    className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-2.5 text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Play className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? 'Scanning PDF & Matching 3-Way...' : scanComplete ? 'Scan Verified! Run Again' : 'Run AI OCR 3-Way Match'}</span>
                  </button>
                </div>
              </div>
            </GsapTiltCard>
          </div>

          {/* Card 3: Maker-Checker Multi-Tier Governance Sandbox (12 cols) */}
          <div className="lg:col-span-12">
            <GsapTiltCard>
              <div className="rounded-3xl bg-slate-800/80 p-8 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Multi-Tier Governance
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      Live Maker-Checker Approval Sandbox
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Invoice:</span>
                    <span className="font-mono text-xs font-bold text-white bg-slate-700 px-2 py-0.5 rounded-md">
                      #AP-2026-9810 · ₹17,20,000
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Step 1: AP Specialist */}
                  <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-700/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                        AK
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Arun Kumar</div>
                        <div className="text-[10px] text-slate-400">AP Specialist (Maker)</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                      <Check className="h-3 w-3" /> Signed
                    </span>
                  </div>

                  {/* Step 2: Tax Compliance Lead */}
                  <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-700/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                        AD
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Ankita Deshmukh</div>
                        <div className="text-[10px] text-slate-400">Tax Head (GSTR-2B Gate)</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                      <Check className="h-3 w-3" /> Gated Pass
                    </span>
                  </div>

                  {/* Step 3: Finance Director / CFO (Interactive) */}
                  <div className="rounded-2xl bg-slate-900/90 p-4 border border-brand-500/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-500/30">
                        CFO
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">You (Finance Director)</div>
                        <div className="text-[10px] text-slate-400">Final Release Authorization</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCfoSign}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                        cfoSigned
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-600 hover:bg-brand-500 text-white'
                      }`}
                    >
                      {cfoSigned ? '✓ Dispatched' : 'Authorize Release'}
                    </button>
                  </div>

                </div>
              </div>
            </GsapTiltCard>
          </div>

        </div>

      </div>
    </section>
  );
}
