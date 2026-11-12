'use client';

import React, { useState } from 'react';
import { Check, Shield, Users, Zap, CheckCircle2, Send, Clock } from 'lucide-react';
import { GsapFadeIn, GsapFloatingItem } from '../animations/GsapAnimations';

export function RazorpayWorkflowShowcase() {
  const [payoutDispatched, setPayoutDispatched] = useState(false);
  const [approvalApproved, setApprovalApproved] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Background Accent Gradients */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-50/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-50/50 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Centered Section Header (Screenshot 5) */}
        <GsapFadeIn direction="up">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              Running an enterprise AP operation is hard.{' '}
              <span className="text-brand-600 block sm:inline">
                Make the compliance movement easy.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Replace manual bank token logins, unverified vendor bank accounts, and risky GST ITC leakage with a unified autonomous payout and compliance infrastructure.
            </p>
          </div>
        </GsapFadeIn>

        {/* Feature 1: Spending hours on payments? Now it takes seconds (Screenshot 6) */}
        <div className="mt-20 lg:mt-28 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Visual Interactive Canvas */}
          <GsapFadeIn direction="right">
            <div className="relative mx-auto w-full max-w-lg rounded-3xl bg-gradient-to-br from-brand-50/70 via-sky-50/50 to-indigo-50/40 p-6 sm:p-8 border border-brand-100 shadow-xl">
              
              {/* Floating Contact Card (Simran Murty) */}
              <GsapFloatingItem delay={0} floatOffset={6} duration={4}>
                <div className="relative z-10 rounded-2xl bg-white p-5 shadow-lg border border-slate-200/80 transition-all hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 text-sm">
                      SM
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">Simran Murty</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-600" />
                        sim.murty@steelcraft.in
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-600" />
                        +91 90829 00000 · Verified Bank
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Penny-Drop Status:</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Name Match 100%
                    </span>
                  </div>

                  <button
                    onClick={() => setPayoutDispatched(true)}
                    className="mt-3 w-full rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] py-2 px-3 text-xs font-bold text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {payoutDispatched ? 'Payout Dispatched via RTGS' : 'Create Payout Link'}
                  </button>
                </div>
              </GsapFloatingItem>

              {/* Connecting Pathway Line */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="h-10 w-0.5 bg-gradient-to-b from-brand-300 to-emerald-400" />
              </div>

              {/* Bulk Payout Floating Status Pill */}
              <GsapFloatingItem delay={0.3} floatOffset={-8} duration={4.5}>
                <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                      Autonomous Bulk AP
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <Clock className="h-3 w-3 text-slate-400" />
                      Scheduled 10:00 PM
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">50,000 Payouts</div>
                      <div className="text-xs text-slate-500 mt-0.5">Automated GSTR-2B compliance batch</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold shadow-inner">
                      <Zap className="h-5 w-5 fill-emerald-600" />
                    </div>
                  </div>

                  {payoutDispatched && (
                    <div className="mt-3 rounded-lg bg-emerald-50 p-2 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-in fade-in slide-in-from-top-1 duration-300">
                      ✓ Instant NEFT/RTGS batch initiated · 0 OTP required for pre-approved makers
                    </div>
                  )}
                </div>
              </GsapFloatingItem>

            </div>
          </GsapFadeIn>

          {/* Right Copy & Bullet Points (Screenshot 6) */}
          <GsapFadeIn direction="left">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 border border-brand-200">
                <Zap className="h-3.5 w-3.5" />
                <span>Zero Latency AP Rail</span>
              </div>
              
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
                Spending hours on payments?<br />
                <span className="text-brand-600">Now it takes seconds.</span>
              </h3>

              <div className="mt-8 space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Lightning-fast smart payouts</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Make up to 50,000 vendor and partner payouts in a single batch with 99.9% bank success rates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">No bank detail? Zero friction</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Instant money transfers with just a vendor contact, phone, or UPI ID with automated penny-drop verification.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Be on time, always (MSME 45-Day SLA)</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Schedule payments automatically aligned with Section 43B(h) deadlines so you never incur corporate tax penalties.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">APIs powered payout & ERP webhooks</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      100% secure payments with 99.9% uptime, auto-syncing with SAP, Tally, Zoho Books, and Oracle Netsuite.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </GsapFadeIn>

        </div>

        {/* Feature 2: Working with a team? Get more control (Screenshot 7) */}
        <div className="mt-24 lg:mt-36 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Copy & Bullet Points (Screenshot 7) */}
          <GsapFadeIn direction="right">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                <Users className="h-3.5 w-3.5" />
                <span>Multi-Tier Governance</span>
              </div>
              
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
                Working with a team?<br />
                <span className="text-indigo-600">Get more control.</span>
              </h3>

              <div className="mt-8 space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Multiple users & custom granular access</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Assign custom user roles (AP Executive, Tax Manager, CFO, Auditor) with strictly segmented approval thresholds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Stay OTP-free with maker-checker rails</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Eliminate constant director OTP ping-pong. Set easy workflow approval chains that authorize releases inside corporate policy limits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Approve on the go via Mobile & Slack</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Review statutory GSTR-2B compliance status and authorize vendor releases directly from mobile or desktop in one tap.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Delegate with confidence! Immutable audit trail</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Every single action, statutory veto override, and payment execution is cryptographically logged with timestamps and user identities.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </GsapFadeIn>

          {/* Right Visual Multi-Level Approval Card (Screenshot 7) */}
          <GsapFadeIn direction="left">
            <div className="order-1 lg:order-2 relative mx-auto w-full max-w-lg rounded-3xl bg-gradient-to-br from-indigo-50/70 via-slate-50/60 to-brand-50/50 p-6 sm:p-8 border border-indigo-100 shadow-xl">
              
              {/* Approval Hierarchy Chain */}
              <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-200/80">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Approval Request</div>
                    <div className="text-sm font-bold text-slate-900">By Arun Kumar (AP Specialist)</div>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    2/3 Signed
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Step 1: Ankita */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                        AD
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Ankita Deshmukh</div>
                        <div className="text-[10px] text-slate-500">Tax &amp; GSTR-2B Compliance Lead</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check className="h-3 w-3" /> Approved
                    </span>
                  </div>

                  {/* Step 2: Suresh */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                        SK
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Suresh Kulkarni</div>
                        <div className="text-[10px] text-slate-500">Procurement &amp; 3-Way Matching</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Connecting Dropdown line */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="h-8 w-0.5 bg-gradient-to-b from-indigo-300 to-brand-500" />
              </div>

              {/* Final CFO Mobile Approval Modal Card */}
              <GsapFloatingItem delay={0.2} floatOffset={-6} duration={4}>
                <div className="rounded-2xl bg-white p-5 shadow-2xl border-2 border-brand-500/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                      Final CFO Sign-Off
                    </span>
                    <span className="text-xs font-bold text-slate-500">ID: #AP-2026-9810</span>
                  </div>

                  <div className="mt-3 text-center">
                    <div className="text-xs text-slate-500">Approving as Finance Director</div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight mt-1">₹17,20,000</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center justify-center gap-1">
                      <Shield className="h-3.5 w-3.5" /> GSTR-2B ITC Claimable: ₹2,62,372 (100% Match)
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setApprovalApproved(false)}
                      className="rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => setApprovalApproved(true)}
                      className={`rounded-xl py-2 text-xs font-bold text-white transition-all active:scale-95 shadow-sm ${
                        approvalApproved ? 'bg-emerald-600' : 'bg-brand-600 hover:bg-brand-700'
                      }`}
                    >
                      {approvalApproved ? '✓ Dispatched' : 'Approve & Release'}
                    </button>
                  </div>
                </div>
              </GsapFloatingItem>

            </div>
          </GsapFadeIn>

        </div>

      </div>
    </section>
  );
}
