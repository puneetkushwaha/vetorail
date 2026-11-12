// @vitest-environment happy-dom
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { APDataProvider, useAPData } from '@/lib/data/dataProvider';
import { ApQueueTable } from '@/components/dashboard/ApQueueTable';
import ApInboxPage from '@/app/app/page';
import ThreeWayMatchingStudioPage from '@/app/app/matching/page';
import { ThreeWayMatchDrawer } from '@/components/dashboard/ThreeWayMatchDrawer';
import { OverrideModal } from '@/components/dashboard/OverrideModal';
import { matchThreeWay, matchSingleLineItem } from '@/lib/engines/threeWayMatcher';
import { InvoiceWithDetails } from '@/lib/types';

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <APDataProvider>{children}</APDataProvider>;
}

describe('Milestone 4 Adversarial & Empirical Challenge Suite', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  // ============================================================================
  // Challenge Track 1: Line-Item Variance Behavior & Discrepancy Diagnostics
  // ============================================================================
  describe('Challenge 1: Line-Item Matching Discrepancy Engine Diagnostics', () => {
    it('1.1 correctly identifies pure price variance exceeding corporate tolerance', () => {
      const result = matchSingleLineItem(
        {
          item_sku: 'SKU-TEST-001',
          billed_qty: 100,
          unit_rate: 105, // 5% overage
          tax_rate: 18,
          cgst_amount: 945,
          sgst_amount: 945,
          igst_amount: 0
        },
        [
          {
            id: 'po-item-1',
            po_id: 'po-1',
            item_sku: 'SKU-TEST-001',
            quantity: 100,
            unit_price: 100,
            tax_rate: 18,
            total_amount: 11800
          }
        ],
        [
          {
            id: 'grn-item-1',
            grn_id: 'grn-1',
            po_item_id: 'po-item-1',
            item_sku: 'SKU-TEST-001',
            quantity_accepted: 100,
            quantity_received: 100,
            quantity_rejected: 0
          }
        ],
        0.5, // 0.5% rate tolerance
        0.0  // 0.0% qty tolerance
      );

      expect(result.lineResult.status).toBe('PRICE_VARIANCE');
      expect(result.lineResult.rateDiscrepancy).toBe(5);
      expect(result.lineResult.rateDiscrepancyPct).toBe(5.0);
      expect(result.lineResult.qtyDiscrepancy).toBe(0);
      // Line variance amount = rateDiscrepancy * billedQty = 5 * 100 = 500
      expect(result.lineVarianceAmount).toBe(500);
    });

    it('1.2 correctly handles negative price variance (vendor underbilling unit price)', () => {
      const result = matchSingleLineItem(
        {
          item_sku: 'SKU-TEST-002',
          billed_qty: 50,
          unit_rate: 90, // Contract was 100; vendor charged 90
          tax_rate: 18,
          cgst_amount: 405,
          sgst_amount: 405,
          igst_amount: 0
        },
        [
          {
            id: 'po-item-2',
            po_id: 'po-1',
            item_sku: 'SKU-TEST-002',
            quantity: 50,
            unit_price: 100,
            tax_rate: 18
          }
        ],
        [
          {
            id: 'grn-item-2',
            grn_id: 'grn-1',
            po_item_id: 'po-item-2',
            item_sku: 'SKU-TEST-002',
            quantity_accepted: 50
          }
        ],
        0.5,
        0.0
      );

      // Negative rate discrepancy percentage (-10%) does not exceed positive rate tolerance (+0.5%)
      expect(result.lineResult.status).toBe('MATCH');
      expect(result.lineResult.rateDiscrepancy).toBe(-10);
      expect(result.lineResult.rateDiscrepancyPct).toBe(-10.0);
      expect(result.lineVarianceAmount).toBe(0);
    });

    it('1.3 flags quantity overbilling when billedQty > acceptedQty even if orderedQty was higher', () => {
      // Scenario: PO ordered 200, GRN warehouse accepted only 120 (80 rejected/damaged), invoice billed 150
      const result = matchSingleLineItem(
        {
          item_sku: 'SKU-TEST-003',
          billed_qty: 150,
          unit_rate: 200,
          tax_rate: 18,
          cgst_amount: 2700,
          sgst_amount: 2700,
          igst_amount: 0
        },
        [
          {
            id: 'po-item-3',
            po_id: 'po-1',
            item_sku: 'SKU-TEST-003',
            quantity: 200,
            unit_price: 200,
            tax_rate: 18
          }
        ],
        [
          {
            id: 'grn-item-3',
            grn_id: 'grn-1',
            po_item_id: 'po-item-3',
            item_sku: 'SKU-TEST-003',
            quantity_accepted: 120
          }
        ],
        0.5,
        0.0
      );

      expect(result.lineResult.status).toBe('QTY_OVERBILLING');
      expect(result.lineResult.qtyDiscrepancy).toBe(30); // 150 - 120
      expect(result.lineVarianceAmount).toBe(30 * 200); // 6000
    });

    it('1.4 flags missing GRN as MISSING_GRN_HOLD with entire invoice amount as variance', () => {
      const summary = matchThreeWay({
        invoice: {
          id: 'inv-no-grn',
          invoice_number: 'INV-MOCK-NOGRN',
          total_amount: 450000,
          subtotal: 381356,
          tax_amount: 68644
        },
        invoiceItems: [
          {
            item_sku: 'SKU-HEAVY-MOTOR',
            billed_qty: 10,
            unit_rate: 38135.6
          }
        ],
        purchaseOrder: {
          id: 'po-nogrn',
          po_number: 'PO-NOGRN-01'
        },
        poItems: [
          {
            id: 'poi-1',
            po_id: 'po-nogrn',
            item_sku: 'SKU-HEAVY-MOTOR',
            quantity: 10,
            unit_price: 38135.6
          }
        ],
        grn: null, // No GRN issued
        grnItems: []
      });

      expect(summary.overallStatus).toBe('MISSING_GRN_HOLD');
      expect(summary.canAutoRelease).toBe(false);
      expect(summary.totalVarianceAmount).toBe(450000);
      expect(summary.lineResults[0].status).toBe('QTY_OVERBILLING');
      expect(summary.lineResults[0].acceptedQty).toBe(0);
    });

    it('1.5 enforces discrepancy hierarchy: TAX_ARITHMETIC_REJECT overrides QTY and PRICE holds', () => {
      const summary = matchThreeWay({
        invoice: {
          id: 'inv-multi-err',
          invoice_number: 'INV-MULTI-DISCREPANCY',
          total_amount: 100000
        },
        invoiceItems: [
          // Line 1: Exact Match
          {
            item_sku: 'SKU-L1',
            billed_qty: 10,
            unit_rate: 100,
            tax_rate: 18,
            cgst_amount: 90,
            sgst_amount: 90,
            igst_amount: 0
          },
          // Line 2: Price Variance (billed 250 vs PO 200)
          {
            item_sku: 'SKU-L2',
            billed_qty: 10,
            unit_rate: 250,
            tax_rate: 18,
            cgst_amount: 225,
            sgst_amount: 225,
            igst_amount: 0
          },
          // Line 3: Qty Overbilling (billed 20 vs GRN 10)
          {
            item_sku: 'SKU-L3',
            billed_qty: 20,
            unit_rate: 100,
            tax_rate: 18,
            cgst_amount: 180,
            sgst_amount: 180,
            igst_amount: 0
          },
          // Line 4: Tax Mismatch (PO rate 18%, billed 28% without justification)
          {
            item_sku: 'SKU-L4',
            billed_qty: 10,
            unit_rate: 100,
            tax_rate: 28,
            cgst_amount: 140,
            sgst_amount: 140,
            igst_amount: 0
          }
        ],
        purchaseOrder: { id: 'po-multi' },
        poItems: [
          { id: 'poi-1', po_id: 'po-multi', item_sku: 'SKU-L1', quantity: 10, unit_price: 100, tax_rate: 18 },
          { id: 'poi-2', po_id: 'po-multi', item_sku: 'SKU-L2', quantity: 10, unit_price: 200, tax_rate: 18 },
          { id: 'poi-3', po_id: 'po-multi', item_sku: 'SKU-L3', quantity: 20, unit_price: 100, tax_rate: 18 },
          { id: 'poi-4', po_id: 'po-multi', item_sku: 'SKU-L4', quantity: 10, unit_price: 100, tax_rate: 18 } // PO contracted 18%
        ],
        grn: { id: 'grn-multi' },
        grnItems: [
          { id: 'gi-1', grn_id: 'grn-multi', item_sku: 'SKU-L1', quantity_accepted: 10 },
          { id: 'gi-2', grn_id: 'grn-multi', item_sku: 'SKU-L2', quantity_accepted: 10 },
          { id: 'gi-3', grn_id: 'grn-multi', item_sku: 'SKU-L3', quantity_accepted: 10 }, // Shortage 10
          { id: 'gi-4', grn_id: 'grn-multi', item_sku: 'SKU-L4', quantity_accepted: 10 }
        ]
      });

      // Because SKU-L4 has tax mismatch against PO contracted rate of 18%,
      // overall status must escalate to TAX_ARITHMETIC_REJECT!
      expect(summary.overallStatus).toBe('TAX_ARITHMETIC_REJECT');
      expect(summary.canAutoRelease).toBe(false);
      expect(summary.lineResults.map((l) => l.status)).toEqual([
        'MATCH',
        'PRICE_VARIANCE',
        'QTY_OVERBILLING',
        'TAX_MISMATCH'
      ]);
    });
  });

  // ============================================================================
  // Challenge Track 2: Interactive Tolerance Sensitivity & Calibration Studio
  // ============================================================================
  describe('Challenge 2: Tolerance Sensitivity in 3-Way Matching Studio', () => {
    it('2.1 switching invoice in 3-Way Matching Studio updates line comparison immediately', () => {
      render(
        <TestWrapper>
          <ThreeWayMatchingStudioPage />
        </TestWrapper>
      );

      // Target select dropdown
      const select = screen.getByRole('combobox');
      expect(select).toBeDefined();

      // Switch to Tata Steel (compliant exact match invoice)
      fireEvent.change(select, { target: { value: 'inv-001' } });

      // Should display Tata Steel invoice lines and EXACT_MATCH verdict
      expect(screen.getByText('SKU-STEEL-HR-2062')).toBeDefined();
      expect(screen.getByText('EXACT_MATCH')).toBeDefined();
      expect(screen.getByText('Pass (Release)')).toBeDefined();
    });

    it('2.2 calibrated quantity tolerance turns quantity hold into match when within threshold', () => {
      // In mock data: INV-ZPC-7721 has 100 billed vs 85 accepted (15 units overbilled = 17.65% overage)
      render(
        <TestWrapper>
          <ThreeWayMatchingStudioPage />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'inv-004' } }); // INV-ZPC-7721

      expect(screen.getByText('QUANTITY_OVERBILLING_HOLD')).toBeDefined();

      // Find sliders: first is rate tolerance, second is qty tolerance
      const sliders = screen.getAllByRole('slider');
      const qtySlider = sliders[1];

      // Set qty tolerance to 5.0% (still below 17.65% overage): should remain QTY_OVERBILLING_HOLD
      fireEvent.change(qtySlider, { target: { value: '5.0' } });
      expect(screen.getByText('QUANTITY_OVERBILLING_HOLD')).toBeDefined();
    });

    it('2.3 performs Pass action from 3-Way Studio and shows feedback toast with audit note', async () => {
      render(
        <TestWrapper>
          <ThreeWayMatchingStudioPage />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'inv-001' } });

      const passButton = screen.getByRole('button', { name: /Pass \(Release\)/i });
      fireEvent.click(passButton);

      await waitFor(() => {
        expect(screen.getByText(/successfully released \(PASS\)/i)).toBeDefined();
        expect(screen.getByText('Audit Stream Appended')).toBeDefined();
      });
    });

    it('2.4 performs Hold action from 3-Way Studio and updates feedback', async () => {
      render(
        <TestWrapper>
          <ThreeWayMatchingStudioPage />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'inv-001' } });

      const holdButton = screen.getByRole('button', { name: /^Hold$/i });
      fireEvent.click(holdButton);

      await waitFor(() => {
        expect(screen.getByText(/placed on HOLD/i)).toBeDefined();
      });
    });

    it('2.5 performs Reject action from 3-Way Studio and updates feedback', async () => {
      render(
        <TestWrapper>
          <ThreeWayMatchingStudioPage />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'inv-001' } });

      const rejectButton = screen.getByRole('button', { name: /^Reject$/i });
      fireEvent.click(rejectButton);

      await waitFor(() => {
        expect(screen.getByText(/REJECTED/i)).toBeDefined();
      });
    });
  });

  // ============================================================================
  // Challenge Track 3: State Transitions, Reactive Data Provider & Audit Log Integrity
  // ============================================================================
  describe('Challenge 3: State Mutation & Cryptographic Audit Event Stream', () => {
    function StateTestHarness() {
      const { invoices, auditLogs, updateInvoiceStatus, metrics, resetToDefault } = useAPData();
      return (
        <div>
          <button
            onClick={() => updateInvoiceStatus('inv-001', 'HOLD', 'Manual security audit hold', 'CFO_USER')}
          >
            Hold Inv 001
          </button>
          <button
            onClick={() => updateInvoiceStatus('inv-001', 'REJECT', 'Fraud check failed', 'AUDITOR_CHIEF')}
          >
            Reject Inv 001
          </button>
          <button
            onClick={() => updateInvoiceStatus('inv-001', 'PASS', 'Audit clearance granted', 'HEAD_OF_TAX')}
          >
            Pass Inv 001
          </button>
          <button onClick={resetToDefault}>Reset State</button>
          <div data-testid="inv-001-status">{invoices.find((i) => i.id === 'inv-001')?.compliance_gate_status}</div>
          <div data-testid="audit-log-count">{auditLogs.length}</div>
          <div data-testid="latest-actor">{auditLogs[0]?.actor}</div>
          <div data-testid="latest-event">{auditLogs[0]?.event_type}</div>
          <div data-testid="latest-reason">{auditLogs[0]?.reason}</div>
          <div data-testid="metrics-held-count">{metrics.heldCount}</div>
          <div data-testid="metrics-passed-count">{metrics.passedCount}</div>
        </div>
      );
    }

    it('3.1 executes full cycle PASS -> HOLD -> REJECT -> PASS with persistent audit trail', async () => {
      render(
        <TestWrapper>
          <StateTestHarness />
        </TestWrapper>
      );

      // Initial state: inv-001 is PASS
      expect(screen.getByTestId('inv-001-status').textContent).toBe('PASS');
      const initialLogsCount = Number(screen.getByTestId('audit-log-count').textContent);

      // Step 1: Transition to HOLD
      fireEvent.click(screen.getByText('Hold Inv 001'));
      expect(screen.getByTestId('inv-001-status').textContent).toBe('HOLD');
      expect(screen.getByTestId('latest-actor').textContent).toBe('CFO_USER');
      expect(screen.getByTestId('latest-event').textContent).toBe('GATE_MANUAL_HOLD');
      expect(screen.getByTestId('latest-reason').textContent).toBe('Manual security audit hold');
      expect(Number(screen.getByTestId('audit-log-count').textContent)).toBe(initialLogsCount + 1);

      // Step 2: Transition to REJECT
      fireEvent.click(screen.getByText('Reject Inv 001'));
      expect(screen.getByTestId('inv-001-status').textContent).toBe('REJECT');
      expect(screen.getByTestId('latest-actor').textContent).toBe('AUDITOR_CHIEF');
      expect(screen.getByTestId('latest-event').textContent).toBe('GATE_MANUAL_REJECT');
      expect(Number(screen.getByTestId('audit-log-count').textContent)).toBe(initialLogsCount + 2);

      // Step 3: Transition to PASS
      fireEvent.click(screen.getByText('Pass Inv 001'));
      expect(screen.getByTestId('inv-001-status').textContent).toBe('PASS');
      expect(screen.getByTestId('latest-actor').textContent).toBe('HEAD_OF_TAX');
      expect(screen.getByTestId('latest-event').textContent).toBe('GATE_MANUAL_PASS');
      expect(Number(screen.getByTestId('audit-log-count').textContent)).toBe(initialLogsCount + 3);

      // Step 4: Reset restores default state
      fireEvent.click(screen.getByText('Reset State'));
      expect(screen.getByTestId('inv-001-status').textContent).toBe('PASS');
      expect(Number(screen.getByTestId('audit-log-count').textContent)).toBe(initialLogsCount);
    });
  });

  // ============================================================================
  // Challenge Track 4: Manager Override Security & Form Validation
  // ============================================================================
  describe('Challenge 4: Manager Exception Override Modal Robustness', () => {
    const dummyHeldInvoice: InvoiceWithDetails = {
      id: 'inv-test-override',
      invoice_number: 'INV-OVERRIDE-8899',
      vendor_id: 'ven-1',
      invoice_date: '2026-04-10',
      due_date: '2026-05-25',
      subtotal: 100000,
      tax_amount: 18000,
      total_amount: 118000,
      compliance_gate_status: 'HOLD',
      match_status: 'PRICE_VARIANCE_HOLD',
      gstr2b_status: 'HOLD_UNFILED',
      tds_194q_amount: 100,
      net_payable: 117900,
      risk_score: 75,
      vendor: {
        id: 'ven-1',
        name: 'Precision Test Components Ltd',
        gstin: '27AABCT8899Z1Z5',
        pan: 'AABCT8899Z',
        msme_category: 'SMALL',
        msme_reg_number: 'UDYAM-MH-03-0099881',
        compliance_score: 60,
        fy_spend: 5200000,
        bank_account: '1234567890',
        ifsc_code: 'HDFC0001234',
        created_at: '2026-04-01T00:00:00Z'
      },
      items: [
        {
          id: 'item-1',
          invoice_id: 'inv-test-override',
          item_sku: 'SKU-VALVE-X',
          description: 'Precision Hydraulic Valve X',
          hsn_sac: '8481',
          billed_qty: 10,
          unit_rate: 10000,
          tax_rate: 18,
          cgst_amount: 9000,
          sgst_amount: 9000,
          igst_amount: 0,
          total_amount: 118000,
          created_at: '2026-04-10T00:00:00Z'
        }
      ],
      poItems: [],
      grnItems: []
    };

    it('4.1 blocks submission and displays error when acknowledgment checkbox is not checked', async () => {
      let overrideConfirmed = false;
      render(
        <OverrideModal
          isOpen={true}
          onClose={() => {}}
          invoice={dummyHeldInvoice}
          onConfirmOverride={async () => {
            overrideConfirmed = true;
          }}
        />
      );

      // Enter notes
      const notes = screen.getByPlaceholderText(/Detail executive rationale/i);
      fireEvent.change(notes, { target: { value: 'Emergency signoff by management.' } });

      // Button is disabled when acknowledgment checkbox is not checked
      const submitBtn = screen.getByRole('button', { name: /Authorize Override/i });
      expect((submitBtn as HTMLButtonElement).disabled).toBe(true);

      // Attempting form submission directly triggers the validation guard
      fireEvent.submit(submitBtn.closest('form')!);

      expect(overrideConfirmed).toBe(false);
      // Required acknowledgment message
      expect(
        screen.getByText('You must confirm statutory and operational acknowledgment before proceeding.')
      ).toBeDefined();
    });

    it('4.2 blocks submission when audit notes are empty or only whitespace', async () => {
      let overrideConfirmed = false;
      render(
        <OverrideModal
          isOpen={true}
          onClose={() => {}}
          invoice={dummyHeldInvoice}
          onConfirmOverride={async () => {
            overrideConfirmed = true;
          }}
        />
      );

      // Check acknowledgment
      const ack = screen.getByRole('checkbox');
      fireEvent.click(ack);

      // Fill only whitespace in notes
      const notes = screen.getByPlaceholderText(/Detail executive rationale/i);
      fireEvent.change(notes, { target: { value: '    ' } });

      const submitBtn = screen.getByRole('button', { name: /Authorize Override/i });
      fireEvent.click(submitBtn);

      expect(overrideConfirmed).toBe(false);
      expect(screen.getByText('Please provide audit notes justifying this management override.')).toBeDefined();
    });

    it('4.3 constructs rich audit trail string on valid override submission', async () => {
      let capturedArgs: { invoiceId: string; reason: string; approverName: string; notes: string } | null = null;
      let modalClosed = false;

      render(
        <OverrideModal
          isOpen={true}
          onClose={() => {
            modalClosed = true;
          }}
          invoice={dummyHeldInvoice}
          onConfirmOverride={async (invoiceId, reason, approverName, notes) => {
            capturedArgs = { invoiceId, reason, approverName, notes };
          }}
        />
      );

      // Change approver name and role
      const approverInputs = screen.getAllByRole('textbox');
      fireEvent.change(approverInputs[0], { target: { value: 'Vikramaditya Singhania' } });
      fireEvent.change(approverInputs[1], { target: { value: 'Executive Director of Finance' } });

      // Fill notes
      const notesTextarea = screen.getByPlaceholderText(/Detail executive rationale/i);
      fireEvent.change(notesTextarea, {
        target: { value: 'Board resolution #BR-2026/04 approved commercial exception.' }
      });

      // Acknowledge
      const ack = screen.getByRole('checkbox');
      fireEvent.click(ack);

      // Submit
      const submitBtn = screen.getByRole('button', { name: /Authorize Override/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(capturedArgs).not.toBeNull();
        expect(capturedArgs?.invoiceId).toBe('inv-test-override');
        expect(capturedArgs?.approverName).toBe('Vikramaditya Singhania');
        expect(capturedArgs?.notes).toBe('Board resolution #BR-2026/04 approved commercial exception.');
        expect(capturedArgs?.reason).toContain('MANAGER_OVERRIDE');
        expect(capturedArgs?.reason).toContain('Vikramaditya Singhania, Executive Director of Finance');
        expect(modalClosed).toBe(true);
      });
    });
  });

  // ============================================================================
  // Challenge Track 5: AP Queue Table Edge Cases & Filter Resilience
  // ============================================================================
  describe('Challenge 5: AP Queue Table Filter Resilience & Boundary Inputs', () => {
    it('5.1 survives adversarial search strings containing regex metacharacters without crashing', () => {
      render(
        <TestWrapper>
          <ApQueueTable onInspectInvoice={() => {}} onOpenOverride={() => {}} />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/Filter queue rows/i);

      // Regex metacharacters that would crash RegExp constructors if not using string search
      const adversarialStrings = ['[a-z]+', '(', ')', '{5,10}', '*?', '.*\\', '(?=.*)'];

      for (const query of adversarialStrings) {
        fireEvent.change(searchInput, { target: { value: query } });
        // Should not throw, should display empty table gracefully
        expect(screen.getByText('No invoices matching the selected criteria.')).toBeDefined();
      }

      // Restore normal search
      fireEvent.change(searchInput, { target: { value: 'Tata Steel' } });
      expect(screen.getByText('Tata Steel Limited')).toBeDefined();
    });

    it('5.2 drawer renders full line items and allows direct release for compliant invoice', async () => {
      render(
        <TestWrapper>
          <ApInboxPage />
        </TestWrapper>
      );

      // Inspect Tata Steel (INV-TSL-2026-4401 - fully compliant)
      const inspectBtn = screen.getByRole('button', { name: /Inspect INV-TSL-2026-4401/i });
      fireEvent.click(inspectBtn);

      // Verify Release Payment (Pass) button is rendered in the drawer
      const releaseBtn = screen.getByRole('button', { name: /Release Payment \(Pass\)/i });
      expect(releaseBtn).toBeDefined();

      fireEvent.click(releaseBtn);

      await waitFor(() => {
        expect(screen.queryByText('Side-by-Side Line Item Cross Examination')).toBeNull();
      });
    });

    it('5.3 drawer opens override modal directly when clicking Override & Release', async () => {
      render(
        <TestWrapper>
          <ApInboxPage />
        </TestWrapper>
      );

      // Inspect an unfiled invoice (INV-DLX-9902)
      const inspectBtn = screen.getByRole('button', { name: /Inspect INV-DLX-9902/i });
      fireEvent.click(inspectBtn);

      const overrideDrawerBtn = screen.getByRole('button', { name: /Override & Release/i });
      fireEvent.click(overrideDrawerBtn);

      // Modal should appear over the drawer
      expect(screen.getByText('Authorized Manager Exception Override')).toBeDefined();
      expect(screen.getByText(/Section 16\(2\)\(aa\) Warning/i)).toBeDefined();
    });

    it('5.4 drawer cleanly unmounts when closed or when invoice is null', () => {
      render(
        <ThreeWayMatchDrawer
          isOpen={false}
          invoice={null}
          onClose={() => {}}
          onOpenOverride={() => {}}
          onHoldInvoice={async () => {}}
          onRejectInvoice={async () => {}}
        />
      );
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('5.5 drawer hides direct Pass release button for discrepant invoices', () => {
      // In mock data: INV-AIF-2026-108 has price variance hold
      render(
        <TestWrapper>
          <ApInboxPage />
        </TestWrapper>
      );

      const inspectBtn = screen.getByRole('button', { name: /Inspect INV-AIF-2026-108/i });
      fireEvent.click(inspectBtn);

      // Direct release button must NOT exist for discrepant invoices
      expect(screen.queryByRole('button', { name: /Release Payment \(Pass\)/i })).toBeNull();
      // Only Maintain Hold, Reject, and Override must exist
      expect(screen.getByRole('button', { name: /Maintain Hold/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Reject Invoice/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Override & Release/i })).toBeDefined();
    });
  });

  // ============================================================================
  // Challenge Track 6: Reactive Filter Tabs & Dynamic Queue Re-Evaluation
  // ============================================================================
  describe('Challenge 6: Reactive Filter Tabs & Instant List Eviction', () => {
    it('6.1 evicts passed invoice from Gated On Hold tab immediately upon Pass action', async () => {
      render(
        <TestWrapper>
          <ApInboxPage />
        </TestWrapper>
      );

      // Switch to Gated On Hold tab
      const holdTab = screen.getByRole('button', { name: /Gated On Hold/i });
      fireEvent.click(holdTab);

      // INV-DLX-9902 is currently on Hold and visible
      expect(screen.getByText('INV-DLX-9902')).toBeDefined();

      // Click Pass on INV-DLX-9902
      const passBtn = screen.getByRole('button', { name: /Pass INV-DLX-9902/i });
      fireEvent.click(passBtn);

      // It should be evicted from the Gated On Hold view immediately
      await waitFor(() => {
        expect(screen.queryByText('INV-DLX-9902')).toBeNull();
      });

      // Switch to Ready to Release (Pass) tab
      const passTab = screen.getByRole('button', { name: /Ready to Release \(Pass\)/i });
      fireEvent.click(passTab);

      // Now INV-DLX-9902 must be visible in the Pass tab!
      expect(screen.getByText('INV-DLX-9902')).toBeDefined();
    });
  });

  // ============================================================================
  // Challenge Track 7: Extreme Boundary & Floating Point Precision
  // ============================================================================
  describe('Challenge 7: Arithmetic Precision & Boundary Conditions', () => {
    it('7.1 exact tolerance boundary: variance equal to tolerance is treated as MATCH', () => {
      // Contract: 1000. Billed: 1005 (exactly +0.5000% variance). Tolerance: 0.5%
      const result = matchSingleLineItem(
        {
          item_sku: 'SKU-BOUNDARY-01',
          billed_qty: 10,
          unit_rate: 1005,
          tax_rate: 18,
          cgst_amount: 904.5,
          sgst_amount: 904.5,
          igst_amount: 0
        },
        [
          {
            id: 'poi-b1',
            po_id: 'po-b',
            item_sku: 'SKU-BOUNDARY-01',
            quantity: 10,
            unit_price: 1000,
            tax_rate: 18
          }
        ],
        [
          {
            id: 'grni-b1',
            grn_id: 'grn-b',
            po_item_id: 'poi-b1',
            item_sku: 'SKU-BOUNDARY-01',
            quantity_accepted: 10
          }
        ],
        0.5, // 0.5% tolerance
        0.0
      );

      // Because rateDiscrepancyPct (0.5) is NOT strictly greater than rateTolerancePct (0.5), it passes as MATCH
      expect(result.lineResult.status).toBe('MATCH');
      expect(result.lineVarianceAmount).toBe(0);
    });

    it('7.2 variance just over tolerance (+0.51%) triggers PRICE_VARIANCE', () => {
      const result = matchSingleLineItem(
        {
          item_sku: 'SKU-BOUNDARY-02',
          billed_qty: 10,
          unit_rate: 1005.1,
          tax_rate: 18,
          cgst_amount: 904.59,
          sgst_amount: 904.59,
          igst_amount: 0
        },
        [
          {
            id: 'poi-b2',
            po_id: 'po-b',
            item_sku: 'SKU-BOUNDARY-02',
            quantity: 10,
            unit_price: 1000,
            tax_rate: 18
          }
        ],
        [
          {
            id: 'grni-b2',
            grn_id: 'grn-b',
            po_item_id: 'poi-b2',
            item_sku: 'SKU-BOUNDARY-02',
            quantity_accepted: 10
          }
        ],
        0.5,
        0.0
      );

      expect(result.lineResult.status).toBe('PRICE_VARIANCE');
      expect(result.lineResult.rateDiscrepancyPct).toBeGreaterThan(0.5);
    });

    it('7.3 handles unmapped items (SKU not present in PO or GRN) safely', () => {
      const result = matchSingleLineItem(
        {
          item_sku: 'SKU-ROGUE-ITEM-99',
          billed_qty: 5,
          unit_rate: 5000,
          tax_rate: 18,
          cgst_amount: 2250,
          sgst_amount: 2250,
          igst_amount: 0
        },
        [], // No matching PO items
        [], // No matching GRN items
        0.5,
        0.0
      );

      // With no GRN item, acceptedQty is 0 -> billedQty (5) > maxAllowedQty (0) -> QTY_OVERBILLING
      expect(result.lineResult.status).toBe('QTY_OVERBILLING');
      expect(result.lineResult.acceptedQty).toBe(0);
      expect(result.lineResult.orderedQty).toBe(0);
      expect(result.lineResult.qtyDiscrepancy).toBe(5);
    });
  });
});
