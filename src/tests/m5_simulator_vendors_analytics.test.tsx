// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { APDataProvider } from '@/lib/data/dataProvider';
import Gstr2bSimulatorPage from '@/app/app/gstr2b/page';
import VendorsDirectoryPage from '@/app/app/vendors/page';
import CfoAnalyticsPage from '@/app/app/analytics/page';

// Test wrapper
function TestAppWrapper({ children }: { children: React.ReactNode }) {
  return <APDataProvider>{children}</APDataProvider>;
}

describe('Milestone 5: GSTR-2B Simulator, Vendor Portal & CFO Analytics', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  // ============================================================================
  // Suite 1: GSTR-2B Simulator Page
  // ============================================================================
  describe('Suite 1: GSTR-2B Inward Verification Simulator', () => {
    it('1.1 renders statutory alert banner, metric cards, and invoices table', () => {
      render(
        <TestAppWrapper>
          <Gstr2bSimulatorPage />
        </TestAppWrapper>
      );

      // Verify header and banner
      expect(screen.getByText('GSTR-2B Real-Time Reconciliation Simulator')).toBeDefined();
      expect(screen.getByText(/MANDATORY RULE 36\(4\) ENFORCEMENT/i)).toBeDefined();

      // Metric cards
      expect(screen.getByText('Total Inward GST Tax')).toBeDefined();
      expect(screen.getByText('Reconciled & Eligible ITC')).toBeDefined();
      expect(screen.getByText('At-Risk Unfiled ITC (Locked)')).toBeDefined();
      expect(screen.getByText('Sec 50 Interest Shield')).toBeDefined();

      // Table headers
      expect(screen.getByText('Vendor & Supplier GSTIN')).toBeDefined();
      expect(screen.getByText('Simulation Action')).toBeDefined();
    });

    it('1.2 filters invoices by status (ALL, Verified in 2B, Unfiled/Blocked)', () => {
      render(
        <TestAppWrapper>
          <Gstr2bSimulatorPage />
        </TestAppWrapper>
      );

      // Filter by Unfiled
      const unfiledBtn = screen.getByRole('button', { name: /Unfiled \/ Blocked/i });
      fireEvent.click(unfiledBtn);

      // Unfiled invoices present
      expect(screen.getByText('INV-DLX-9902')).toBeDefined();
    });

    it('1.3 triggers simulate vendor filing and updates state reactively', async () => {
      render(
        <TestAppWrapper>
          <Gstr2bSimulatorPage />
        </TestAppWrapper>
      );

      // Find simulation button for unfiled invoice
      const syncButtons = screen.getAllByRole('button', { name: /Simulate Vendor Filing/i });
      expect(syncButtons.length).toBeGreaterThanOrEqual(1);

      fireEvent.click(syncButtons[0]);

      // Expect success notification
      await waitFor(() => {
        expect(screen.getByText(/successfully synced with GSTN GSTR-2B/i)).toBeDefined();
      });
    });
  });

  // ============================================================================
  // Suite 2: Vendor Directory Page
  // ============================================================================
  describe('Suite 2: Vendor Compliance & Statutory Directory', () => {
    it('2.1 renders active vendors, MSME Udyam categories, and TDS accumulators', () => {
      render(
        <TestAppWrapper>
          <VendorsDirectoryPage />
        </TestAppWrapper>
      );

      expect(screen.getByText('Vendor Compliance & Statutory Directory')).toBeDefined();
      expect(screen.getByText('Active Trade Vendors')).toBeDefined();
      expect(screen.getByText('MSME 43B(h) Covered')).toBeDefined();
      expect(screen.getByText('Sec 194Q Threshold Breached')).toBeDefined();

      // Vendors
      expect(screen.getByText('Tata Steel Limited')).toBeDefined();
      expect(screen.getByText('Apex Industrial Fasteners LLP')).toBeDefined();
      expect(screen.getByText('Delta Logix Supply Chain Solutions Pvt Ltd')).toBeDefined();

      // Udyam numbers
      expect(screen.getByText('UDYAM-MH-02-0049182')).toBeDefined();
    });

    it('2.2 filters vendors by MSME category tabs', () => {
      render(
        <TestAppWrapper>
          <VendorsDirectoryPage />
        </TestAppWrapper>
      );

      const microBtn = screen.getByRole('button', { name: /^Micro/i });
      fireEvent.click(microBtn);

      // Precision Toolings Micro Ltd is MICRO
      expect(screen.getByText('Precision Toolings Micro Ltd')).toBeDefined();
    });
  });

  // ============================================================================
  // Suite 3: CFO Executive Analytics Page
  // ============================================================================
  describe('Suite 3: CFO Executive AP & Statutory Intelligence', () => {
    it('3.1 renders executive KPI metrics and statutory protection cards', () => {
      render(
        <TestAppWrapper>
          <CfoAnalyticsPage />
        </TestAppWrapper>
      );

      expect(screen.getByText('CFO Executive AP & Statutory Intelligence')).toBeDefined();
      expect(screen.getByText('Total Inward AP Ingestion')).toBeDefined();
      expect(screen.getByText('Cleared & Released')).toBeDefined();
      expect(screen.getByText('Held on Statutory Rails')).toBeDefined();
      expect(screen.getByText('Section 16(2)(aa) Gated ITC')).toBeDefined();

      // Statutory pillar cards
      expect(screen.getByText('GST ITC & Penal Interest')).toBeDefined();
      expect(screen.getByText('MSME Section 43B(h) Shield')).toBeDefined();
      expect(screen.getByText('Contract & Inventory Leakage')).toBeDefined();

      // Audit trail
      expect(screen.getByText('Autonomous Compliance Audit Trail')).toBeDefined();
    });
  });
});
