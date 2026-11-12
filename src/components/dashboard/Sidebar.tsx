'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Inbox,
  Split,
  FileSpreadsheet,
  Building2,
  BarChart3,
  Home,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { useAPData } from '@/lib/data/dataProvider';

export function Sidebar() {
  const pathname = usePathname();
  const { metrics, invoices } = useAPData();

  const navigationItems = [
    {
      name: 'AP Command Inbox',
      href: '/app',
      icon: Inbox,
      badge: metrics?.heldCount ? `${metrics.heldCount} Held` : undefined,
      badgeColor: 'bg-amber-100/80 text-amber-900 border-amber-200'
    },
    {
      name: '3-Way Match Studio',
      href: '/app/matching',
      icon: Split,
      badge: 'Engine',
      badgeColor: 'bg-indigo-100/80 text-indigo-800 border-indigo-200'
    },
    {
      name: 'GSTR-2B Simulator',
      href: '/app/gstr2b',
      icon: FileSpreadsheet,
      badge: 'Sec 16(2)',
      badgeColor: 'bg-emerald-100/80 text-emerald-900 border-emerald-200'
    },
    {
      name: 'Vendor Directory',
      href: '/app/vendors',
      icon: Building2,
      badge: 'MSME',
      badgeColor: 'bg-orange-100/80 text-orange-900 border-orange-200'
    },
    {
      name: 'CFO Analytics',
      href: '/app/analytics',
      icon: BarChart3,
      badge: undefined
    }
  ];

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/90 flex flex-col h-screen sticky top-0 shrink-0 select-none z-20 shadow-subtle">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200/80 gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/25">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 text-base tracking-tight">VetoRail</span>
            <span className="px-1.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
              Enterprise
            </span>
          </div>
          <span className="text-2xs text-slate-500 font-medium">AP Compliance & Gating Rail</span>
        </div>
      </div>

      {/* Statutory Circuit-Breaker Status Pill */}
      <div className="p-3 mx-3 my-3 rounded-xl bg-slate-50/90 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-800">Circuit-Breaker Active</span>
          </div>
          <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
            ARMED
          </span>
        </div>
        <div className="mt-1.5 text-2xs text-slate-500 flex items-center justify-between font-medium">
          <span>Rule 36(4) · 194Q · 43B(h)</span>
          <span className="font-mono text-slate-700 font-semibold">{invoices.length} Invoices</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1 text-3xs font-bold uppercase tracking-wider text-slate-400">
          AP Operations Rail
        </div>

        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/80'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-3xs font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-5 px-3 pb-1 text-3xs font-bold uppercase tracking-wider text-slate-400">
          Public Portal
        </div>
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent group"
        >
          <div className="flex items-center gap-2.5">
            <Home className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            <span>Public Landing Page</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
        </Link>
      </div>

      {/* User / Tenant Footnote */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            RS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Raghav Sharma</p>
            <p className="text-2xs text-slate-500 font-medium truncate">Head of AP & Compliance</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
