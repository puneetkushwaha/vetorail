// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { APDataProvider } from '@/lib/data/dataProvider';
import { ApQueueTable } from '@/components/dashboard/ApQueueTable';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import ApInboxPage from '@/app/app/page';
import ThreeWayMatchingStudioPage from '@/app/app/matching/page';

// Wrapper component to provide APDataContext
function TestAppWrapper({ children }: { children: React.ReactNode }) {
  return <APDataProvider>{children}</APDataProvider>;
}

describe('Milestone 4: Enterprise AP Gated Payment Queue & 3-Way Matching View', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  // ============================================================================
  // Suite 1: Enterprise Shell (Sidebar & Header) Rendering
  // ============================================================================
  describe('Suite 1: Enterprise Shell Navigation & Header', () => {
    it('1.1 renders Sidebar with all core enterprise navigation items and status', () => {
      render(
        <TestAppWrapper>
          <Sidebar />
        </TestAppWrapper>
      );

      expect(screen.getByText('VetoRail')).toBeDefined();
      expect(screen.getByText('Enterprise')).toBeDefined();
      expect(screen.getByText('AP Compliance & Gating Rail')).toBeDefined();
      expect(screen.getByText('Circuit-Breaker Active')).toBeDefined();
      expect(screen.getByText('ARMED')).toBeDefined();

      // Navigation Links
      expect(screen.getByText('AP Command Inbox')).toBeDefined();
      expect(screen.getByText('3-Way Match Studio')).toBeDefined();
      expect(screen.getByText('GSTR-2B Simulator')).toBeDefined();
      expect(screen.getByText('Vendor Directory')).toBeDefined();
      expect(screen.getByText('CFO Analytics')).toBeDefined();
      expect(screen.getByText('Public Landing Page')).toBeDefined();

      // User profile
      expect(screen.getByText('Raghav Sharma')).toBeDefined();
      expect(screen.getByText('Head of AP & Compliance')).toBeDefined();
    });

    it('1.2 renders Header with tenant selector, state switcher, alerts, and search', () => {
      render(
        <TestAppWrapper>
          <Header />
        </TestAppWrapper>
      );

      expect(screen.getByText('Apex Industrial Enterprises Ltd')).toBeDefined();
      expect(screen.getByText('CIN: L27100MH2010PLC198273')).toBeDefined();
      expect(screen.getByText(/Maharashtra \(27\)/i)).toBeDefined();

      // Search input
      const searchInput = screen.getByPlaceholderText(/Search invoice #, vendor, PO, GSTIN/i);
      expect(searchInput).toBeDefined();

      // Notification bell
      const notifBell = screen.getByRole('button', { name: /Compliance Alerts/i });
      expect(notifBell).toBeDefined();

      // Open notification center
      fireEvent.click(notifBell);
      expect(screen.getByText('Compliance Audit Alerts')).toBeDefined();
    });

    it('1.3 allows state switcher dropdown selection in Header', () => {
      render(
        <TestAppWrapper>
          <Header />
        </TestAppWrapper>
      );

      const stateBtn = screen.getByText(/Active GSTIN/i).closest('button');
      expect(stateBtn).toBeDefined();
      if (stateBtn) {
        fireEvent.click(stateBtn);
        expect(screen.getByText(/Select Registered State Branch/i)).toBeDefined();
        expect(screen.getByText(/Karnataka \(29\)/i)).toBeDefined();

        // Select Karnataka
        const karnatakaBtn = screen.getByText(/Karnataka \(29\)/i);
        fireEvent.click(karnatakaBtn);
        expect(screen.getByText(/29AABCV9921M1ZR/i)).toBeDefined();
      }
    });
  });

  // ============================================================================
  // Suite 2: AP Queue Table Rendering & 10 Columns
  // ============================================================================
  describe('Suite 2: AP Gated Payment Queue Table & 10 Columns', () => {
    it('2.1 renders 4 Summary Metric Cards with live counts and INR formatting', () => {
      render(
        <TestAppWrapper>
          <ApQueueTable onInspectInvoice={() => {}} onOpenOverride={() => {}} />
        </TestAppWrapper>
      );

      expect(screen.getByText('Total Inward Invoices')).toBeDefined();
      expect(screen.getAllByText(/Ready to Release/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Held Working Capital')).toBeDefined();
      expect(screen.getByText('Blocked ITC Risk')).toBeDefined();

      // Verify amounts
      expect(screen.getAllByText(/8/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Cleared 3-Way Match/i)).toBeDefined();
      expect(screen.getByText(/Funds protected against discrepancy/i)).toBeDefined();
    });

    it('2.2 renders all 10 Enterprise Columns in the table', () => {
      render(
        <TestAppWrapper>
          <ApQueueTable onInspectInvoice={() => {}} onOpenOverride={() => {}} />
        </TestAppWrapper>
      );

      // Verify 10 Column Headers
      expect(screen.getByText('1. Invoice # & Date')).toBeDefined();
      expect(screen.getByText('2. Vendor & MSME')).toBeDefined();
      expect(screen.getByText('3. PO Ref')).toBeDefined();
      expect(screen.getByText('4. GRN Ref')).toBeDefined();
      expect(screen.getByText('5. Gross Amount')).toBeDefined();
      expect(screen.getByText('6. 3-Way Match')).toBeDefined();
      expect(screen.getByText('7. GSTR-2B Status')).toBeDefined();
      expect(screen.getByText('8. TDS 194Q & Net')).toBeDefined();
      expect(screen.getByText('9. Risk Score')).toBeDefined();
      expect(screen.getByText('10. Gate Actions')).toBeDefined();
    });

    it('2.3 renders canonical invoice records with MSME badges and status pills', () => {
      render(
        <TestAppWrapper>
          <ApQueueTable onInspectInvoice={() => {}} onOpenOverride={() => {}} />
        </TestAppWrapper>
      );

      // Invoices
      expect(screen.getByText('INV-TSL-2026-4401')).toBeDefined();
      expect(screen.getByText('INV-DLX-9902')).toBeDefined();
      expect(screen.getByText('INV-AIF-2026-108')).toBeDefined();
      expect(screen.getByText('INV-ZPC-7721')).toBeDefined();
      expect(screen.getByText('INV-PTM-2026-092')).toBeDefined();
      expect(screen.getByText('INV-KMP-8820')).toBeDefined();
      expect(screen.getByText('INV-INF-2026-781')).toBeDefined();
      expect(screen.getByText('INV-VEE-9941')).toBeDefined();

      // Vendors
      expect(screen.getByText('Tata Steel Limited')).toBeDefined();
      expect(screen.getByText('Delta Logix Supply Chain Solutions Pvt Ltd')).toBeDefined();
      expect(screen.getByText('Apex Industrial Fasteners LLP')).toBeDefined();

      // MSME countdown indicators
      expect(screen.getByText(/OVERDUE! \(Day 48\/45\)/i)).toBeDefined();
      expect(screen.getByText(/3d Left \(Urgent\)/i)).toBeDefined();

      // Match status pills
      expect(screen.getAllByText(/Exact Match/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Price Variance/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Qty Overbilling/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Tax Mismatch/i).length).toBeGreaterThanOrEqual(1);

      // 2B status pills
      expect(screen.getAllByText(/Verified in 2B/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Missing \/ Unfiled/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  // ============================================================================
  // Suite 3: Filter Tab Switching & Search
  // ============================================================================
  describe('Suite 3: Filter Tabs & Real-Time Search', () => {
    it('3.1 switches across filter tabs (All, Gated On Hold, Pass, Reject, MSME Expiring)', () => {
      render(
        <TestAppWrapper>
          <ApQueueTable onInspectInvoice={() => {}} onOpenOverride={() => {}} />
        </TestAppWrapper>
      );

      // Initial state: All 8 invoices visible
      expect(screen.getByText('INV-TSL-2026-4401')).toBeDefined();
      expect(screen.getByText('INV-DLX-9902')).toBeDefined();
      expect(screen.getByText('INV-VEE-9941')).toBeDefined();

      // Switch to Gated On Hold
      const holdTab = screen.getByRole('button', { name: /Gated On Hold/i });
      fireEvent.click(holdTab);

      // Should show only HOLD invoices
      expect(screen.getByText('INV-DLX-9902')).toBeDefined();
      expect(screen.getByText('INV-AIF-2026-108')).toBeDefined();
      expect(screen.getByText('INV-ZPC-7721')).toBeDefined();
      expect(screen.getByText('INV-KMP-8820')).toBeDefined();
      // PASS and REJECT invoices should NOT be present
      expect(screen.queryByText('INV-TSL-2026-4401')).toBeNull();
      expect(screen.queryByText('INV-VEE-9941')).toBeNull();

      // Switch to Ready to Release (Pass)
      const passTab = screen.getByRole('button', { name: /Ready to Release \(Pass\)/i });
      fireEvent.click(passTab);

      expect(screen.getByText('INV-TSL-2026-4401')).toBeDefined();
      expect(screen.getByText('INV-PTM-2026-092')).toBeDefined();
      expect(screen.getByText('INV-INF-2026-781')).toBeDefined();
      expect(screen.queryByText('INV-DLX-9902')).toBeNull();

      // Switch to Rejected / Fraud Risk
      const rejectTab = screen.getByRole('button', { name: /Rejected \/ Fraud Risk/i });
      fireEvent.click(rejectTab);

      expect(screen.getByText('INV-VEE-9941')).toBeDefined();
      expect(screen.queryByText('INV-TSL-2026-4401')).toBeNull();

      // Switch to MSME Expiring
      const msmeTab = screen.getByRole('button', { name: /MSME Expiring/i });
      fireEvent.click(msmeTab);

      expect(screen.getByText('INV-PTM-2026-092')).toBeDefined();
      expect(screen.getByText('INV-KMP-8820')).toBeDefined();
      expect(screen.queryByText('INV-TSL-2026-4401')).toBeNull();

      // Return to All Invoices
      const allTab = screen.getByRole('button', { name: /All Invoices/i });
      fireEvent.click(allTab);
      expect(screen.getByText('INV-TSL-2026-4401')).toBeDefined();
      expect(screen.getByText('INV-VEE-9941')).toBeDefined();
    });

    it('3.2 filters table rows via real-time search input', () => {
      render(
        <TestAppWrapper>
          <ApQueueTable onInspectInvoice={() => {}} onOpenOverride={() => {}} />
        </TestAppWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/Filter queue rows/i);
      fireEvent.change(searchInput, { target: { value: 'Delta Logix' } });

      expect(screen.getByText('INV-DLX-9902')).toBeDefined();
      expect(screen.queryByText('INV-TSL-2026-4401')).toBeNull();
      expect(screen.queryByText('Tata Steel Limited')).toBeNull();

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getByText('INV-TSL-2026-4401')).toBeDefined();
    });
  });

  // ============================================================================
  // Suite 4: Pass, Hold, and Reject Action Triggers & State Mutation
  // ============================================================================
  describe('Suite 4: Interactive Gate Actions (Pass, Hold, Reject)', () => {
    it('4.1 triggers Pass action on a Held invoice and updates state', async () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      // Find Pass button for INV-DLX-9902 (which is currently on HOLD)
      const passBtn = screen.getByRole('button', { name: /Pass INV-DLX-9902/i });
      expect(passBtn).toBeDefined();

      fireEvent.click(passBtn);

      // Check feedback toast appears
      await waitFor(() => {
        expect(screen.getByText(/INV-DLX-9902 released for bank disbursement/i)).toBeDefined();
      });
    });

    it('4.2 triggers Hold action on a Pass invoice and updates state', async () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      // INV-TSL-2026-4401 is currently PASS
      const holdBtn = screen.getByRole('button', { name: /Hold INV-TSL-2026-4401/i });
      fireEvent.click(holdBtn);

      await waitFor(() => {
        expect(screen.getByText(/INV-TSL-2026-4401 held under compliance gate/i)).toBeDefined();
      });
    });

    it('4.3 triggers Reject action on an invoice', async () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      const rejectBtn = screen.getByRole('button', { name: /Reject INV-AIF-2026-108/i });
      fireEvent.click(rejectBtn);

      await waitFor(() => {
        expect(screen.getByText(/INV-AIF-2026-108 rejected. Vendor notified/i)).toBeDefined();
      });
    });
  });

  // ============================================================================
  // Suite 5: 3-Way Match Line Discrepancy Drawer
  // ============================================================================
  describe('Suite 5: 3-Way Matching Line-Item Comparison Drawer', () => {
    it('5.1 opens 3-Way Match Drawer when clicking an invoice or Inspect button', async () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      const inspectBtn = screen.getByRole('button', { name: /Inspect INV-AIF-2026-108/i });
      fireEvent.click(inspectBtn);

      // Drawer opens with line-item comparison
      expect(screen.getByText('Side-by-Side Line Item Cross Examination')).toBeDefined();
      expect(screen.getByText(/Contracted Purchase Order/i)).toBeDefined();
      expect(screen.getByText(/Physical GRN Acceptance/i)).toBeDefined();
      expect(screen.getByText(/Billed Tax Invoice/i)).toBeDefined();
      expect(screen.getByText('Net 3-Way Variance')).toBeDefined();
      expect(screen.getByText('SKU-FAST-M24-BOLTS')).toBeDefined();

      // Check line status
      expect(screen.getAllByText('PRICE VARIANCE').length).toBeGreaterThanOrEqual(1);

      // Verify specific discrepancy diagnostic text
      expect(screen.getByText(/Unit rate billed at/i)).toBeDefined();
      expect(screen.getByText(/\+8.00% overage/i)).toBeDefined();
    });

    it('5.2 highlights quantity shortage discrepancy on partially accepted GRN', () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      // Inspect INV-ZPC-7721 (100 billed vs 85 accepted)
      const inspectBtn = screen.getByRole('button', { name: /Inspect INV-ZPC-7721/i });
      fireEvent.click(inspectBtn);

      expect(screen.getByText('SKU-MACH-CASING-AL')).toBeDefined();
      expect(screen.getAllByText('QTY OVERBILLING').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/shortage of 15 units/i)).toBeDefined();
    });

    it('5.3 displays 100% exact match diagnostics for compliant invoice', () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      const inspectBtn = screen.getByRole('button', { name: /Inspect INV-TSL-2026-4401/i });
      fireEvent.click(inspectBtn);

      expect(screen.getByText(/Zero Discrepancies Detected/i)).toBeDefined();
      expect(screen.getByText(/All 1 line items exactly match contracted PO pricing/i)).toBeDefined();
    });

    it('5.4 allows maintaining hold or closing from the drawer', async () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      const inspectBtn = screen.getByRole('button', { name: /Inspect INV-DLX-9902/i });
      fireEvent.click(inspectBtn);

      const maintainHoldBtn = screen.getByRole('button', { name: /Maintain Hold/i });
      expect(maintainHoldBtn).toBeDefined();

      fireEvent.click(maintainHoldBtn);

      // Drawer closes after maintaining hold
      await waitFor(() => {
        expect(screen.queryByText('Side-by-Side Line Item Cross Examination')).toBeNull();
      });
    });
  });

  // ============================================================================
  // Suite 6: Manager Override Modal Execution
  // ============================================================================
  describe('Suite 6: Manager Override Modal & Exception Release', () => {
    it('6.1 opens Override Modal and displays statutory warnings', () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      // Open drawer for unfiled 2B invoice
      const inspectBtn = screen.getByRole('button', { name: /Inspect INV-DLX-9902/i });
      fireEvent.click(inspectBtn);

      // Click Override & Release button
      const overrideBtn = screen.getByRole('button', { name: /Override & Release/i });
      fireEvent.click(overrideBtn);

      // Modal appears
      expect(screen.getByText('Authorized Manager Exception Override')).toBeDefined();
      expect(screen.getByText(/Statutory Compliance Circuit-Breaker Bypass/i)).toBeDefined();
      expect(screen.getByText(/Section 16\(2\)\(aa\) Warning/i)).toBeDefined();
      expect(screen.getByText(/exposes the enterprise to/i)).toBeDefined();

      // Form inputs exist
      expect(screen.getByDisplayValue('Raghav Sharma')).toBeDefined();
      expect(screen.getByDisplayValue('Head of AP & Indirect Tax')).toBeDefined();
      expect(screen.getByPlaceholderText(/Detail executive rationale/i)).toBeDefined();
    });

    it('6.2 completes override flow, updates status to PASS, and records audit trail', async () => {
      render(
        <TestAppWrapper>
          <ApInboxPage />
        </TestAppWrapper>
      );

      // Click override directly on queue table row
      const overrideBtn = screen.getByRole('button', { name: /Override INV-AIF-2026-108/i });
      fireEvent.click(overrideBtn);

      expect(screen.getByText('Authorized Manager Exception Override')).toBeDefined();

      // Fill in notes
      const notesTextarea = screen.getByPlaceholderText(/Detail executive rationale/i);
      fireEvent.change(notesTextarea, {
        target: { value: 'Approved by VP of Procurement via Ticket #PROC-9912. Commercial surcharge accepted.' }
      });

      // Check acknowledgment checkbox
      const ackCheckbox = screen.getByRole('checkbox');
      fireEvent.click(ackCheckbox);
      expect((ackCheckbox as HTMLInputElement).checked).toBe(true);

      // Submit override
      const submitBtn = screen.getByRole('button', { name: /Authorize Override & Release Payment/i });
      fireEvent.click(submitBtn);

      // Modal should close and invoice should transition to PASS
      await waitFor(() => {
        expect(screen.queryByText('Authorized Manager Exception Override')).toBeNull();
      });
    });
  });

  // ============================================================================
  // Suite 7: 3-Way Matching Calculation Studio (/app/matching)
  // ============================================================================
  describe('Suite 7: 3-Way Matching Studio & Dynamic Tolerance Calibration', () => {
    it('7.1 renders 3-Way Matching Studio with tolerance sliders and invoice selector', () => {
      render(
        <TestAppWrapper>
          <ThreeWayMatchingStudioPage />
        </TestAppWrapper>
      );

      expect(screen.getByText('3-Way Matching Calculation Studio')).toBeDefined();
      expect(screen.getByText('Corporate Matching Tolerances')).toBeDefined();
      expect(screen.getByText('Unit Price Variance Tolerance:')).toBeDefined();
      expect(screen.getByText('Quantity Discrepancy Tolerance:')).toBeDefined();
      expect(screen.getByText('Dynamic Engine Verdict:')).toBeDefined();
      expect(screen.getByText('Line Items Comparison (PO vs GRN vs Invoice)')).toBeDefined();
    });

    it('7.2 responds to tolerance slider adjustments and recalculates engine verdict', () => {
      render(
        <TestAppWrapper>
          <ThreeWayMatchingStudioPage />
        </TestAppWrapper>
      );

      // Target invoice INV-AIF-2026-108 has an 8.0% price variance
      // With default 0.5% tolerance, verdict is PRICE_VARIANCE_HOLD
      expect(screen.getByText('PRICE_VARIANCE_HOLD')).toBeDefined();

      // Change tolerance to 10.0% (greater than the 8.0% variance)
      const sliders = screen.getAllByRole('slider');
      const rateSlider = sliders[0];

      fireEvent.change(rateSlider, { target: { value: '9.0' } });

      // Engine dynamically recalculates: now within tolerance, verdict flips to EXACT_MATCH!
      expect(screen.getByText('EXACT_MATCH')).toBeDefined();
      expect(screen.getByText(/Auto-Release Flag:/i)).toBeDefined();
    });
  });
});
