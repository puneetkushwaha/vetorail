'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  FileSignature,
  Lock
} from 'lucide-react';
import { InvoiceWithDetails } from '@/lib/types';
import { formatINR } from '@/lib/utils/formatters';

export interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceWithDetails | null;
  onConfirmOverride: (invoiceId: string, reason: string, approverName: string, notes: string) => Promise<void>;
}

export function OverrideModal({
  isOpen,
  onClose,
  invoice,
  onConfirmOverride
}: OverrideModalProps) {
  const [approverName, setApproverName] = useState('Raghav Sharma');
  const [approverRole, setApproverRole] = useState('Head of AP & Indirect Tax');
  const [reason, setReason] = useState('Commercial Settlement');
  const [notes, setNotes] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !invoice) return null;

  const isUnfiled2B = invoice.gstr2b_status === 'HOLD_UNFILED';
  const hasLineDiscrepancy = invoice.match_status !== 'EXACT_MATCH';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledged) {
      setErrorMessage('You must confirm statutory and operational acknowledgment before proceeding.');
      return;
    }
    if (!notes.trim()) {
      setErrorMessage('Please provide audit notes justifying this management override.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const fullAuditReason = `MANAGER_OVERRIDE [${reason}]: ${notes} (Authorized by ${approverName}, ${approverRole})`;
      await onConfirmOverride(invoice.id, fullAuditReason, approverName, notes);
      onClose();
    } catch (err) {
      setErrorMessage('Failed to apply override. Please retry.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
              <FileSignature className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal-headline" className="text-sm font-bold text-slate-900">
                Authorized Manager Exception Override
              </h3>
              <p className="text-2xs text-slate-500 font-mono">
                {invoice.invoice_number} • {invoice.vendor?.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-4 mx-6 mt-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Statutory Compliance Circuit-Breaker Bypass</span>
          </div>
          {isUnfiled2B && (
            <p className="text-2xs text-amber-800 leading-relaxed">
              <strong>Section 16(2)(aa) Warning:</strong> This supplier return is unfiled on GSTN. Overriding release exposes the enterprise to{' '}
              <span className="font-mono font-bold text-amber-950">{formatINR(invoice.tax_amount)}</span> in unclaimable Input Tax Credit plus 18% p.a. interest liability under Section 50.
            </p>
          )}
          {hasLineDiscrepancy && (
            <p className="text-2xs text-amber-800 leading-relaxed">
              <strong>Commercial Discrepancy:</strong> 3-Way matching flagged{' '}
              <span className="font-semibold text-amber-950">{invoice.match_status.replace(/_/g, ' ')}</span>. Overriding accepts the invoice without credit note settlement.
            </p>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Authorized Approver Name
              </label>
              <input
                type="text"
                required
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Designation / Role
              </label>
              <input
                type="text"
                required
                value={approverRole}
                onChange={(e) => setApproverRole(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Statutory / Commercial Exception Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
            >
              <option value="Authorized Surcharge">Authorized Surcharge (Freight / Fuel Escalation)</option>
              <option value="Volume Adjustment">Volume Adjustment (Bulk Scale Discount Adjustment)</option>
              <option value="Commercial Settlement">Commercial Settlement (Executive Sign-off)</option>
              <option value="Commercial Price Revision Approved by Procurement">
                Commercial Price Revision Approved by Head of Procurement
              </option>
              <option value="Urgent MSME Settlement Pending Vendor Credit Note">
                Urgent MSME Settlement Pending Vendor Credit Note
              </option>
              <option value="Emergency Operational Part Release">Emergency Operational Part Release</option>
            </select>
          </div>

          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Audit Notes & Justification (Required)
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail executive rationale, procurement approval ticket #, or vendor indemnity..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="ack-check"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="ack-check" className="text-2xs text-slate-600 leading-tight">
              I certify that I am an authorized finance signatory for Apex Industrial Enterprises Ltd. I acknowledge the statutory tax credit and audit implications and authorize immediate release of this payment.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !acknowledged}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Authorizing...' : 'Authorize Override & Release Payment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OverrideModal;
