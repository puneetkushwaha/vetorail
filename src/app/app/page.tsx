'use client';

import React, { useState } from 'react';
import { ApQueueTable } from '@/components/dashboard/ApQueueTable';
import { ThreeWayMatchDrawer } from '@/components/dashboard/ThreeWayMatchDrawer';
import { OverrideModal } from '@/components/dashboard/OverrideModal';
import { useAPData } from '@/lib/data/dataProvider';
import { InvoiceWithDetails } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

export default function ApInboxPage() {
  const { invoices, updateInvoiceStatus, resetToDefault } = useAPData();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  // Sync selected invoice with latest reactive state
  const currentSelectedInvoice = selectedInvoice
    ? invoices.find((inv) => inv.id === selectedInvoice.id) || selectedInvoice
    : null;

  const handleInspect = (inv: InvoiceWithDetails) => {
    setSelectedInvoice(inv);
    setIsDrawerOpen(true);
  };

  const handleOpenOverride = (inv?: InvoiceWithDetails) => {
    if (inv) setSelectedInvoice(inv);
    setIsOverrideModalOpen(true);
  };

  const handleHoldInvoice = async (invoiceId: string) => {
    await updateInvoiceStatus(
      invoiceId,
      'HOLD',
      'Compliance hold maintained from 3-Way Match Drawer inspection'
    );
    setIsDrawerOpen(false);
  };

  const handleRejectInvoice = async (invoiceId: string) => {
    await updateInvoiceStatus(
      invoiceId,
      'REJECT',
      'Invoice rejected from 3-Way Match Drawer inspection'
    );
    setIsDrawerOpen(false);
  };

  const handlePassInvoice = async (invoiceId: string) => {
    await updateInvoiceStatus(
      invoiceId,
      'PASS',
      'Direct payment release authorized from 3-Way Match Drawer'
    );
    setIsDrawerOpen(false);
  };

  const handleConfirmOverride = async (
    invoiceId: string,
    reason: string,
    approverName: string
  ) => {
    await updateInvoiceStatus(invoiceId, 'PASS', reason, approverName);
    setIsOverrideModalOpen(false);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AP Command Rail & Gated Payment Queue
            </h1>
            <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Autonomous Rail
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforcing 3-Way Matching, GSTR-2B Section 16(2)(aa) verification, Section 194Q TDS withholding, and Section 43B(h) MSME payment clocks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={resetToDefault}
            title="Reset to default mock dataset"
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Main AP Queue Table */}
      <ApQueueTable
        onInspectInvoice={handleInspect}
        onOpenOverride={(inv) => handleOpenOverride(inv)}
      />

      {/* Slide-over 3-Way Match Drawer */}
      <ThreeWayMatchDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        invoice={currentSelectedInvoice}
        onOpenOverride={() => setIsOverrideModalOpen(true)}
        onHoldInvoice={handleHoldInvoice}
        onRejectInvoice={handleRejectInvoice}
        onPassInvoice={handlePassInvoice}
      />

      {/* Manager Override Modal */}
      <OverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        invoice={currentSelectedInvoice}
        onConfirmOverride={handleConfirmOverride}
      />
    </div>
  );
}
