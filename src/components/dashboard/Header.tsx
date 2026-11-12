'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
import { useAPData } from '@/lib/data/dataProvider';

export interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearchChange, searchQuery = '' }: HeaderProps) {
  const { metrics, auditLogs, invoices } = useAPData();
  const [selectedState, setSelectedState] = useState('Maharashtra (27)');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);

  const gstEntities = [
    { state: 'Maharashtra (27)', gstin: '27AABCV9921M1ZT', location: 'HQ / Mumbai Plant' },
    { state: 'Karnataka (29)', gstin: '29AABCV9921M1ZR', location: 'Bengaluru Tech & DC' },
    { state: 'Gujarat (24)', gstin: '24AABCV9921M1ZQ', location: 'Sanand Automotive Bay' },
    { state: 'Tamil Nadu (33)', gstin: '33AABCV9921M1ZP', location: 'Chennai Logistics Hub' },
    { state: 'Delhi NCR (07)', gstin: '07AABCV9921M1ZN', location: 'Regional Distribution Hub' }
  ];

  const currentEntity = gstEntities.find((e) => e.state === selectedState) || gstEntities[0];

  // Count active urgent items
  const msmeUrgentCount = invoices.filter(
    (inv) => inv.msmeUrgency === 'RED_OVERDUE' || inv.msmeUrgency === 'ORANGE'
  ).length;

  const activeHoldsCount = metrics?.heldCount || 0;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Left: Tenant Selector & State GSTIN Picker */}
      <div className="flex items-center gap-4">
        {/* Tenant Details */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700 shadow-2xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs tracking-tight">
                Apex Industrial Enterprises Ltd
              </span>
              <span className="px-2 py-0.5 rounded-full text-3xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                CIN: L27100MH2010PLC198273
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-2xs text-slate-500 mt-0.5">
              <span>Primary Operating Tenant</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-600 font-medium">Multi-GSTIN Rail</span>
            </div>
          </div>
        </div>

        {/* State Switcher Dropdown */}
        <div className="relative" ref={stateRef}>
          <button
            type="button"
            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-xs transition-all shadow-2xs"
          >
            <div className="flex flex-col text-left">
              <span className="text-3xs uppercase font-bold text-slate-400">Active GSTIN</span>
              <span className="font-mono font-bold text-slate-800 text-2xs">
                {currentEntity.gstin} ({currentEntity.state})
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isStateDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in-50 duration-100 ring-1 ring-slate-900/5">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
                  Select Registered State Branch
                </span>
              </div>
              {gstEntities.map((entity) => (
                <button
                  key={entity.gstin}
                  type="button"
                  onClick={() => {
                    setSelectedState(entity.state);
                    setIsStateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 flex flex-col hover:bg-slate-50 transition-colors ${
                    selectedState === entity.state ? 'bg-indigo-50/70' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">{entity.state}</span>
                    <span className="text-3xs font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-200">
                      State Code {entity.gstin.substring(0, 2)}
                    </span>
                  </div>
                  <span className="font-mono text-2xs text-slate-600 mt-0.5">{entity.gstin}</span>
                  <span className="text-3xs text-slate-400">{entity.location}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Compliance Alert Badge */}
        {(activeHoldsCount > 0 || msmeUrgentCount > 0) && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs font-medium shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold">{activeHoldsCount} Active Holds</span>
              <span className="text-amber-300">•</span>
              <span className="text-amber-800 font-mono text-2xs font-semibold">
                {msmeUrgentCount > 0 ? `${msmeUrgentCount} MSME Urgency` : 'Sec 16(2)(aa) Gated'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Search, Notifications, User Status */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search invoice #, vendor, PO, GSTIN..."
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <kbd className="text-3xs font-mono font-semibold bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Notifications Center */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Compliance Alerts"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
          >
            <Bell className="w-4 h-4" />
            {(activeHoldsCount > 0 || msmeUrgentCount > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 duration-150 ring-1 ring-slate-900/5">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Compliance Audit Alerts</span>
                </div>
                <span className="text-3xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {auditLogs.length} Events
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {auditLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="p-3 hover:bg-slate-50/80 transition-colors text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-3xs font-mono font-bold text-slate-500 uppercase tracking-wide">
                        {log.event_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-3xs text-slate-400 font-mono">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 mt-1 line-clamp-2">{log.reason}</p>
                    <div className="mt-1.5 flex items-center justify-between text-3xs text-slate-500">
                      <span>Actor: {log.actor}</span>
                      <span className="font-mono text-brand-600 font-semibold">{log.new_status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-slate-100 text-center">
                <span className="text-3xs text-slate-500 font-mono">
                  Full cryptographic trail logged to Supabase
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            RS
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-2xs font-bold text-slate-800">Raghav S.</span>
            <span className="text-3xs text-slate-500">AP Approver</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
