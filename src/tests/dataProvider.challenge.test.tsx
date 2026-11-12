// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { APDataProvider, useAPData } from '@/lib/data/dataProvider';
import {
  mockVendors,
  mockInvoices,
  mockGstr2bRecords,
  mockComplianceAuditLogs
} from '@/lib/data/mockData';

const LOCAL_STORAGE_KEY = 'vetorail_ap_data_v1';

describe('Empirical Challenge: APDataProvider Implementation Verification', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    localStorage.clear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const renderAPData = () => {
    return renderHook(() => useAPData(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <APDataProvider>{children}</APDataProvider>
      ),
    });
  };

  // ============================================================================
  // Suite 1: Dual-Mode Behavior (Supabase Present vs Absent)
  // ============================================================================
  describe('Suite 1: Dual-Mode Behavior', () => {
    it('1.1 should fall back to local demo mode when Supabase env vars are absent', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      expect(result.current.isSupabaseConnected).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.invoices).toHaveLength(mockInvoices.length);
      expect(result.current.vendors).toHaveLength(mockVendors.length);
      expect(result.current.gstr2bRecords).toHaveLength(mockGstr2bRecords.length);
    });

    it('1.2 should fall back to local demo mode when Supabase URL contains placeholder', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder-anon-key';

      const { result } = renderAPData();

      expect(result.current.isSupabaseConnected).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('1.3 should hydrate state from localStorage if local cached bundle exists', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const cachedCustomInvoices = [
        {
          ...mockInvoices[0],
          id: 'custom-inv-999',
          invoice_number: 'INV-CUSTOM-001',
          total_amount: 999999
        }
      ];

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          invoices: cachedCustomInvoices,
          vendors: mockVendors,
          purchaseOrders: [],
          purchaseOrderItems: [],
          goodsReceiptNotes: [],
          goodsReceiptNoteItems: [],
          invoiceItems: [],
          gstr2bRecords: mockGstr2bRecords,
          auditLogs: mockComplianceAuditLogs
        })
      );

      const { result } = renderAPData();

      expect(result.current.isSupabaseConnected).toBe(false);
      expect(result.current.invoices).toHaveLength(1);
      expect(result.current.invoices[0].invoice_number).toBe('INV-CUSTOM-001');
    });

    it('1.4 should attempt Supabase client initialization when valid URL and Anon key are present', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://tcwtpyxszlczvbjqboer.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

      const { result } = renderAPData();

      expect(result.current.isSupabaseConnected).toBe(true);
    });
  });

  // ============================================================================
  // Suite 2: Reactive State Transitions (updateInvoiceStatus)
  // ============================================================================
  describe('Suite 2: Reactive State Transitions (updateInvoiceStatus)', () => {
    it('2.1 should transition an invoice status to PASS and update reactive state immediately', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      const holdInvoice = result.current.invoices.find((i) => i.compliance_gate_status === 'HOLD');
      expect(holdInvoice).toBeDefined();
      const invoiceId = holdInvoice!.id;

      let success = false;
      await act(async () => {
        success = await result.current.updateInvoiceStatus(
          invoiceId,
          'PASS',
          'Manual approval test for PASS',
          'TEST_CFO'
        );
      });

      expect(success).toBe(true);
      const updatedInvoice = result.current.getInvoiceById(invoiceId);
      expect(updatedInvoice?.compliance_gate_status).toBe('PASS');
    });

    it('2.2 should transition an invoice status to HOLD and update reactive state immediately', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      const passInvoice = result.current.invoices.find((i) => i.compliance_gate_status === 'PASS');
      expect(passInvoice).toBeDefined();
      const invoiceId = passInvoice!.id;

      let success = false;
      await act(async () => {
        success = await result.current.updateInvoiceStatus(
          invoiceId,
          'HOLD',
          'Auditor flag for secondary verification',
          'TEST_AUDITOR'
        );
      });

      expect(success).toBe(true);
      const updatedInvoice = result.current.getInvoiceById(invoiceId);
      expect(updatedInvoice?.compliance_gate_status).toBe('HOLD');
    });

    it('2.3 should transition an invoice status to REJECT and update reactive state immediately', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      const passInvoice = result.current.invoices.find((i) => i.compliance_gate_status === 'PASS');
      expect(passInvoice).toBeDefined();
      const invoiceId = passInvoice!.id;

      let success = false;
      await act(async () => {
        success = await result.current.updateInvoiceStatus(
          invoiceId,
          'REJECT',
          'Permanent veto due to fraudulent vendor account',
          'TEST_RISK_OFFICER'
        );
      });

      expect(success).toBe(true);
      const updatedInvoice = result.current.getInvoiceById(invoiceId);
      expect(updatedInvoice?.compliance_gate_status).toBe('REJECT');
    });

    it('2.4 should return false and leave state intact when updating non-existent invoice ID', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();
      const prevInvoiceCount = result.current.invoices.length;
      const prevAuditCount = result.current.auditLogs.length;

      let success = false;
      await act(async () => {
        success = await result.current.updateInvoiceStatus(
          'non-existent-id-0000',
          'PASS',
          'Invalid test',
          'TEST_ACTOR'
        );
      });

      expect(success).toBe(false);
      expect(result.current.invoices.length).toBe(prevInvoiceCount);
      expect(result.current.auditLogs.length).toBe(prevAuditCount);
    });
  });

  // ============================================================================
  // Suite 3: Audit Log Appending & Conformance
  // ============================================================================
  describe('Suite 3: Audit Log Appending & Conformance', () => {
    it('3.1 should append a valid entry to auditLogs with timestamp, event_type, actor, and state changes', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      const targetInvoice = result.current.invoices[0];
      const initialStatus = targetInvoice.compliance_gate_status;
      const targetNewStatus = initialStatus === 'PASS' ? 'HOLD' : 'PASS';
      const initialLogCount = result.current.auditLogs.length;

      await act(async () => {
        await result.current.updateInvoiceStatus(
          targetInvoice.id,
          targetNewStatus,
          'Detailed compliance audit justification reason',
          'SENIOR_AUDITOR_42'
        );
      });

      expect(result.current.auditLogs.length).toBe(initialLogCount + 1);

      const latestLog = result.current.auditLogs[0];
      expect(latestLog).toBeDefined();
      expect(latestLog.id).toMatch(/^log-\d+$/);
      expect(latestLog.invoice_id).toBe(targetInvoice.id);
      expect(latestLog.event_type).toBe(`GATE_MANUAL_${targetNewStatus}`);
      expect(latestLog.actor).toBe('SENIOR_AUDITOR_42');
      expect(latestLog.previous_status).toBe(initialStatus);
      expect(latestLog.new_status).toBe(targetNewStatus);
      expect(latestLog.reason).toBe('Detailed compliance audit justification reason');
      expect(latestLog.metadata).toBeDefined();
      expect((latestLog.metadata as Record<string, unknown>).manual_action).toBe(true);

      // Verify ISO timestamp validity
      expect(new Date(latestLog.created_at).getTime()).not.toBeNaN();
      expect(new Date((latestLog.metadata as Record<string, unknown>).updated_at as string).getTime()).not.toBeNaN();
    });

    it('3.2 getAuditLogs with invoiceId filters logs strictly for that invoice', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();
      const targetInvoice = result.current.invoices[0];

      await act(async () => {
        await result.current.updateInvoiceStatus(
          targetInvoice.id,
          'HOLD',
          'Audit filter test 1',
          'ACTOR_A'
        );
      });

      const invoiceLogs = result.current.getAuditLogs(targetInvoice.id);
      expect(invoiceLogs.length).toBeGreaterThanOrEqual(1);
      invoiceLogs.forEach((log) => {
        expect(log.invoice_id).toBe(targetInvoice.id);
      });

      const allLogs = result.current.getAuditLogs();
      expect(allLogs.length).toBeGreaterThan(invoiceLogs.length);
    });
  });

  // ============================================================================
  // Suite 4: simulateGstr2bSync & resetToDefault
  // ============================================================================
  describe('Suite 4: simulateGstr2bSync & resetToDefault', () => {
    it('4.1 should simulate GSTR-2B GSTN sync and unlock unfiled invoice', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      // Find unfiled Delta Logix invoice (INV-DLX-9902)
      const unfiledInvoice = result.current.invoices.find(
        (i) => i.invoice_number === 'INV-DLX-9902'
      );
      expect(unfiledInvoice).toBeDefined();
      expect(unfiledInvoice?.compliance_gate_status).toBe('HOLD');
      expect(unfiledInvoice?.gstr2b_status).toBe('HOLD_UNFILED');

      const initial2bCount = result.current.gstr2bRecords.length;
      const initialLogsCount = result.current.auditLogs.length;

      let success = false;
      await act(async () => {
        success = await result.current.simulateGstr2bSync(
          '27AABCD1234E1Z5',
          'INV-DLX-9902'
        );
      });

      expect(success).toBe(true);

      // Verify invoice state updated
      const updatedInvoice = result.current.getInvoiceById(unfiledInvoice!.id);
      expect(updatedInvoice?.compliance_gate_status).toBe('PASS');
      expect(updatedInvoice?.gstr2b_status).toBe('PASS_2B');
      expect(updatedInvoice?.risk_score).toBe(10);

      // Verify 2B record added
      expect(result.current.gstr2bRecords.length).toBe(initial2bCount + 1);
      const new2B = result.current.gstr2bRecords.find(
        (r) => r.invoice_number === 'INV-DLX-9902'
      );
      expect(new2B).toBeDefined();
      expect(new2B?.vendor_gstin).toBe('27AABCD1234E1Z5');
      expect(new2B?.itc_eligibility).toBe('ELIGIBLE');

      // Verify audit log added
      expect(result.current.auditLogs.length).toBe(initialLogsCount + 1);
      const syncLog = result.current.auditLogs[0];
      expect(syncLog.event_type).toBe('GSTR2B_SIMULATED_SYNC');
      expect(syncLog.actor).toBe('GSTN_SYNC_SIMULATOR');
      expect(syncLog.new_status).toBe('PASS');
    });

    it('4.2 should return false when simulateGstr2bSync is called for non-existent invoice', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      let success = false;
      await act(async () => {
        success = await result.current.simulateGstr2bSync(
          '27AABCD1234E1Z5',
          'INV-DOES-NOT-EXIST'
        );
      });

      expect(success).toBe(false);
    });

    it('4.3 resetToDefault should wipe local storage and reset all entities to original seed data', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      // Mutate state first
      const targetInvoice = result.current.invoices[0];
      await act(async () => {
        await result.current.updateInvoiceStatus(
          targetInvoice.id,
          'REJECT',
          'Pre-reset mutation',
          'MUTATOR'
        );
      });

      expect(result.current.getInvoiceById(targetInvoice.id)?.compliance_gate_status).toBe('REJECT');

      // Call resetToDefault
      act(() => {
        result.current.resetToDefault();
      });

      // Verify reset to defaults
      expect(result.current.invoices).toHaveLength(mockInvoices.length);
      const restoredInvoice = result.current.getInvoiceById(targetInvoice.id);
      expect(restoredInvoice?.compliance_gate_status).toBe(targetInvoice.compliance_gate_status);
      expect(result.current.auditLogs).toHaveLength(mockComplianceAuditLogs.length);
      expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
    });
  });

  // ============================================================================
  // Suite 5: CFO Metrics Calculation & Discrepancy Auditing
  // ============================================================================
  describe('Suite 5: CFO Metrics Calculation & Discrepancy Auditing', () => {
    it('5.1 verifies mathematical correctness of implemented metrics in DashboardMetrics', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();
      const m = result.current.metrics;

      const totalCalculatedSpend = mockInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      expect(m.totalSpend).toBe(totalCalculatedSpend);

      const passInvoices = mockInvoices.filter((i) => i.compliance_gate_status === 'PASS');
      const holdInvoices = mockInvoices.filter((i) => i.compliance_gate_status === 'HOLD');
      const rejectInvoices = mockInvoices.filter((i) => i.compliance_gate_status === 'REJECT');

      expect(m.passedCount).toBe(passInvoices.length);
      expect(m.heldCount).toBe(holdInvoices.length);
      expect(m.rejectedCount).toBe(rejectInvoices.length);
      expect(m.totalInvoicesCount).toBe(mockInvoices.length);

      const totalPassedAmount = passInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      const totalHeldAmount = holdInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      const totalRejectedAmount = rejectInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

      expect(m.totalPassedAmount).toBe(totalPassedAmount);
      expect(m.totalHeldAmount).toBe(totalHeldAmount);
      expect(m.totalRejectedAmount).toBe(totalRejectedAmount);
    });

    it('5.2 metrics update dynamically when invoice status transitions from HOLD to PASS', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      const holdInvoice = result.current.invoices.find((i) => i.compliance_gate_status === 'HOLD');
      expect(holdInvoice).toBeDefined();

      const initialPassedAmount = result.current.metrics.totalPassedAmount;
      const initialHeldAmount = result.current.metrics.totalHeldAmount;
      const initialPassedCount = result.current.metrics.passedCount;
      const initialHeldCount = result.current.metrics.heldCount;
      const invoiceAmount = holdInvoice!.total_amount;

      await act(async () => {
        await result.current.updateInvoiceStatus(
          holdInvoice!.id,
          'PASS',
          'Release payment hold',
          'CFO_RELEASE'
        );
      });

      const updatedMetrics = result.current.metrics;
      expect(updatedMetrics.totalPassedAmount).toBe(initialPassedAmount + invoiceAmount);
      expect(updatedMetrics.totalHeldAmount).toBe(initialHeldAmount - invoiceAmount);
      expect(updatedMetrics.passedCount).toBe(initialPassedCount + 1);
      expect(updatedMetrics.heldCount).toBe(initialHeldCount - 1);
      expect(updatedMetrics.totalSpend).toBe(result.current.metrics.totalSpend);
    });

    it('5.3 [REMEDIATED VERIFICATION] checks presence and values of contract metric fields', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();
      const m = result.current.metrics as Record<string, unknown>;

      // Verify all contract fields are present and computed
      const hasTotalItcSaved = 'totalItcSaved' in m && m.totalItcSaved !== undefined;
      const hasItcProtected = 'itcProtected' in m && typeof m.itcProtected === 'number';

      const hasHeldWorkingCapital = 'heldWorkingCapital' in m && m.heldWorkingCapital !== undefined;
      const hasTotalHeldAmount = 'totalHeldAmount' in m && typeof m.totalHeldAmount === 'number';

      const hasActiveHoldsCount = 'activeHoldsCount' in m && m.activeHoldsCount !== undefined;
      const hasHeldCount = 'heldCount' in m && typeof m.heldCount === 'number';

      const hasPassRate = 'passRate' in m && m.passRate !== undefined;

      expect(hasTotalItcSaved).toBe(true);
      expect(hasItcProtected).toBe(true);
      expect(m.totalItcSaved).toBe(180000);
      expect(m.itcProtected).toBe(180000);

      expect(hasHeldWorkingCapital).toBe(true);
      expect(hasTotalHeldAmount).toBe(true);
      expect(m.heldWorkingCapital).toBe(m.totalHeldAmount);

      expect(hasActiveHoldsCount).toBe(true);
      expect(hasHeldCount).toBe(true);
      expect(m.activeHoldsCount).toBe(m.heldCount);

      expect(hasPassRate).toBe(true);
      expect(typeof m.passRate).toBe('number');
      expect(m.passRate).toBeGreaterThan(0);
    });

    it('5.4 [REMEDIATED VERIFICATION] verifies dynamic evaluation of leakagePrevented', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      // Dynamically evaluated across line-item discrepancies (400k + 180k = 580k)
      expect(result.current.metrics.leakagePrevented).toBe(580000);
    });

    it('5.5 [REMEDIATED VERIFICATION] verifies previous_status in simulateGstr2bSync reflects actual status', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { result } = renderAPData();

      // Set target invoice to REJECT first
      const targetInvoice = result.current.invoices.find(
        (i) => i.invoice_number === 'INV-DLX-9902'
      );
      expect(targetInvoice).toBeDefined();

      await act(async () => {
        await result.current.updateInvoiceStatus(
          targetInvoice!.id,
          'REJECT',
          'Rejecting first',
          'AUDITOR'
        );
      });

      // Verify status is now REJECT
      expect(result.current.getInvoiceById(targetInvoice!.id)?.compliance_gate_status).toBe('REJECT');

      // Now call simulateGstr2bSync
      await act(async () => {
        await result.current.simulateGstr2bSync('27AABCD1234E1Z5', 'INV-DLX-9902');
      });

      // Check the generated audit log:
      const syncLog = result.current.auditLogs[0];
      expect(syncLog.event_type).toBe('GSTR2B_SIMULATED_SYNC');
      // previous_status now accurately captures targetInvoice.compliance_gate_status ('REJECT')
      expect(syncLog.previous_status).toBe('REJECT');
    });
  });
});
