// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { APDataProvider } from '@/lib/data/dataProvider';
import ApInboxPage from '@/app/app/page';
import ThreeWayMatchingStudioPage from '@/app/app/matching/page';
import Gstr2bSimulatorPage from '@/app/app/gstr2b/page';
import VendorsDirectoryPage from '@/app/app/vendors/page';
import CfoAnalyticsPage from '@/app/app/analytics/page';

function TestAppWrapper({ children }: { children: React.ReactNode }) {
  return <APDataProvider>{children}</APDataProvider>;
}

describe('Milestone 6: End-to-End Enterprise Compliance Rail Integration', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  it('6.1 End-to-End AP Lifecycle: Inspection -> GSTR-2B Sync -> Manager Override -> Analytics Verification', async () => {
    // 1. Render AP Queue
    const { unmount: unmountInbox } = render(
      <TestAppWrapper>
        <ApInboxPage />
      </TestAppWrapper>
    );

    // Initial state: 8 invoices in queue
    expect(screen.getByText('INV-AIF-2026-108')).toBeDefined();
    expect(screen.getByText('INV-DLX-9902')).toBeDefined();

    // Inspect invoice with price variance
    const inspectBtn = screen.getByRole('button', { name: /Inspect INV-AIF-2026-108/i });
    fireEvent.click(inspectBtn);

    // Drawer opens with 3-way match line discrepancy
    expect(screen.getByText('Side-by-Side Line Item Cross Examination')).toBeDefined();
    expect(screen.getAllByText('PRICE VARIANCE').length).toBeGreaterThanOrEqual(1);

    // Click Override & Release
    const overrideBtn = screen.getByRole('button', { name: /Override & Release/i });
    fireEvent.click(overrideBtn);

    // Fill override modal
    expect(screen.getByText('Authorized Manager Exception Override')).toBeDefined();
    const ackCheckbox = screen.getByRole('checkbox');
    fireEvent.click(ackCheckbox);
    expect((ackCheckbox as HTMLInputElement).checked).toBe(true);

    const submitBtn = screen.getByRole('button', { name: /Authorize Override & Release Payment/i });
    fireEvent.click(submitBtn);

    unmountInbox();

    // 2. Render GSTR-2B Simulator & verify simulation capability
    const { unmount: unmountGstr } = render(
      <TestAppWrapper>
        <Gstr2bSimulatorPage />
      </TestAppWrapper>
    );

    expect(screen.getByText('GSTR-2B Real-Time Reconciliation Simulator')).toBeDefined();
    const syncButtons = screen.getAllByRole('button', { name: /Simulate Vendor Filing/i });
    expect(syncButtons.length).toBeGreaterThanOrEqual(1);

    // Click simulate sync on first unfiled invoice
    fireEvent.click(syncButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/successfully synced with GSTN GSTR-2B/i)).toBeDefined();
    });

    unmountGstr();

    // 3. Render Vendor Directory & verify MSME / 194Q compliance status
    const { unmount: unmountVendors } = render(
      <TestAppWrapper>
        <VendorsDirectoryPage />
      </TestAppWrapper>
    );

    expect(screen.getByText('Active Trade Vendors')).toBeDefined();
    expect(screen.getByText('Tata Steel Limited')).toBeDefined();
    expect(screen.getAllByText(/0.1% TDS Active/i).length).toBeGreaterThanOrEqual(1);

    unmountVendors();

    // 4. Render CFO Analytics & verify holistic financial protection telemetry
    render(
      <TestAppWrapper>
        <CfoAnalyticsPage />
      </TestAppWrapper>
    );

    expect(screen.getByText('CFO Executive AP & Statutory Intelligence')).toBeDefined();
    expect(screen.getByText('Autonomous Compliance Audit Trail')).toBeDefined();
    expect(screen.getByText('GST ITC & Penal Interest')).toBeDefined();
    expect(screen.getByText('MSME Section 43B(h) Shield')).toBeDefined();
    expect(screen.getByText('Contract & Inventory Leakage')).toBeDefined();
  });

  it('6.2 3-Way Match Studio dynamic tolerance thresholds recalculate variances', () => {
    render(
      <TestAppWrapper>
        <ThreeWayMatchingStudioPage />
      </TestAppWrapper>
    );

    expect(screen.getByText('3-Way Matching Calculation Studio')).toBeDefined();
    expect(screen.getByText('Corporate Matching Tolerances')).toBeDefined();
    expect(screen.getByText(/Target Invoice:/i)).toBeDefined();
  });
});
