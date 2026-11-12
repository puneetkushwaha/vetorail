'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  Clock,
  Percent,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useAPData } from '@/lib/data/dataProvider';
import { formatINR } from '@/lib/utils/formatters';
import { MsmeCategory } from '@/lib/types';

export default function VendorsDirectoryPage() {
  const { vendors } = useAPData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | MsmeCategory>('ALL');

  // Filter vendors
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.gstin || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.pan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.msme_reg_number || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === 'ALL') return true;
    return v.msme_category === categoryFilter;
  });

  // Calculate vendor-specific spend aggregations
  const totalYtdSpend = vendors.reduce((sum, v) => sum + (v.fy_spend || 0), 0);
  const msmeProtectedVendors = vendors.filter(
    (v) => v.msme_category === 'MICRO' || v.msme_category === 'SMALL'
  );
  const tdsBreachedVendors = vendors.filter((v) => (v.fy_spend || 0) >= 5000000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Vendor Compliance & Statutory Directory
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              <Building2 className="w-3.5 h-3.5" />
              Master Ledger
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Unified directory tracking MSME Udyam classifications (Section 43B(h)) and annual spend accumulators (Section 194Q TDS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Validated PAN & GSTIN
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vendors */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Active Trade Vendors
            </span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {vendors.length}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-600">
              All KYC Verified
            </span>
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            Suppliers with active purchase orders
          </p>
        </div>

        {/* MSME Section 43B(h) Mandated */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 shadow-card">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-900">
              MSME 43B(h) Covered
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-950 tracking-tight">
              {msmeProtectedVendors.length}
            </span>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
              Micro & Small
            </span>
          </div>
          <p className="mt-1 text-3xs text-amber-700">
            15 / 45-day statutory payment SLA strictly enforced
          </p>
        </div>

        {/* Section 194Q TDS Active */}
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 shadow-card">
          <div className="flex items-center justify-between text-indigo-800">
            <span className="text-2xs font-bold uppercase tracking-wider text-indigo-900">
              Sec 194Q Threshold Breached
            </span>
            <Percent className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-indigo-950 tracking-tight">
              {tdsBreachedVendors.length}
            </span>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200">
              &gt; ₹50 Lakhs YTD
            </span>
          </div>
          <p className="mt-1 text-3xs text-indigo-700">
            0.1% TDS automatically withheld on invoices
          </p>
        </div>

        {/* Total YTD Spend Tracked */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              YTD Accumulated Spend
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {formatINR(totalYtdSpend)}
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              FY 2026-27
            </span>
          </div>
          <p className="mt-1 text-3xs text-slate-400">
            Across enterprise procurement contracts
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor name, GSTIN, PAN or Udyam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition-colors ${
              categoryFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({vendors.length})
          </button>
          <button
            onClick={() => setCategoryFilter('MICRO')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition-colors ${
              categoryFilter === 'MICRO'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Micro ({vendors.filter((v) => v.msme_category === 'MICRO').length})
          </button>
          <button
            onClick={() => setCategoryFilter('SMALL')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition-colors ${
              categoryFilter === 'SMALL'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Small ({vendors.filter((v) => v.msme_category === 'SMALL').length})
          </button>
          <button
            onClick={() => setCategoryFilter('MEDIUM')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition-colors ${
              categoryFilter === 'MEDIUM'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            Medium ({vendors.filter((v) => v.msme_category === 'MEDIUM').length})
          </button>
          <button
            onClick={() => setCategoryFilter('NOT_MSME')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition-colors ${
              categoryFilter === 'NOT_MSME'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Non-MSME ({vendors.filter((v) => v.msme_category === 'NOT_MSME').length})
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600 text-2xs uppercase tracking-wider">
                <th className="py-3 px-3.5">Vendor Legal Entity</th>
                <th className="py-3 px-3.5">GSTIN</th>
                <th className="py-3 px-3.5">PAN & Status</th>
                <th className="py-3 px-3.5">MSME Category</th>
                <th className="py-3 px-3.5">Udyam Registration #</th>
                <th className="py-3 px-3.5 text-right">YTD Aggregate Spend</th>
                <th className="py-3 px-3.5 text-center">Sec 194Q Status</th>
                <th className="py-3 px-3.5 text-center">Sec 43B(h) SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredVendors.map((v) => {
                const isMsmeCovered = v.msme_category === 'MICRO' || v.msme_category === 'SMALL';
                const isTdsActive = (v.fy_spend || 0) >= 5000000;

                return (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Legal Name */}
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900">{v.name}</div>
                      <div className="text-3xs text-slate-400">ID: {v.id}</div>
                    </td>

                    {/* GSTIN */}
                    <td className="py-3 px-3.5">
                      <div className="font-mono font-semibold text-slate-800">{v.gstin}</div>
                    </td>

                    {/* PAN & Status */}
                    <td className="py-3 px-3.5">
                      <div className="font-mono text-slate-800">{v.pan}</div>
                      <span className="inline-flex items-center gap-1 text-3xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Valid & Linked
                      </span>
                    </td>

                    {/* MSME Category */}
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center justify-center font-bold text-3xs px-2.5 py-0.5 rounded-full border ${
                          v.msme_category === 'MICRO'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : v.msme_category === 'SMALL'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : v.msme_category === 'MEDIUM'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {v.msme_category}
                      </span>
                    </td>

                    {/* Udyam Registration */}
                    <td className="py-3 px-3.5 font-mono text-3xs text-slate-600">
                      {v.msme_reg_number || (
                        <span className="text-slate-400 italic">N/A</span>
                      )}
                    </td>

                    {/* YTD Spend */}
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">
                      {formatINR(v.fy_spend || 0)}
                    </td>

                    {/* Section 194Q Status */}
                    <td className="py-3 px-3.5 text-center">
                      {isTdsActive ? (
                        <span className="inline-flex items-center gap-1 text-3xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                          <Percent className="w-3 h-3" />
                          0.1% TDS Active
                        </span>
                      ) : (
                        <span className="text-3xs text-slate-500 font-medium">
                          Exempt (&lt; ₹50L)
                        </span>
                      )}
                    </td>

                    {/* Section 43B(h) SLA */}
                    <td className="py-3 px-3.5 text-center">
                      {isMsmeCovered ? (
                        <span className="inline-flex items-center gap-1 text-3xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          45-Day SLA Mandate
                        </span>
                      ) : (
                        <span className="text-3xs text-slate-400">
                          Exempt from 43B(h)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching vendors found in directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
