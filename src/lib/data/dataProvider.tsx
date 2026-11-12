'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Vendor,
  PurchaseOrder,
  PurchaseOrderItem,
  GoodsReceiptNote,
  GoodsReceiptNoteItem,
  Invoice,
  InvoiceItem,
  Gstr2bRecord,
  ComplianceAuditLog,
  InvoiceWithDetails,
  DashboardMetrics,
  ComplianceGateStatus,
  APDataContextType,
  UrgencyTier
} from '../types';
import {
  mockVendors,
  mockPurchaseOrders,
  mockPurchaseOrderItems,
  mockGoodsReceiptNotes,
  mockGoodsReceiptNoteItems,
  mockInvoices,
  mockInvoiceItems,
  mockGstr2bRecords,
  mockComplianceAuditLogs
} from './mockData';

const LOCAL_STORAGE_KEY = 'vetorail_ap_data_v1';

const APDataContext = createContext<APDataContextType | null>(null);

export function APDataProvider({ children }: { children: React.ReactNode }) {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // In-Memory Reactive State
  const [vendorsState, setVendorsState] = useState<Vendor[]>(mockVendors);
  const [posState, setPosState] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [poItemsState, setPoItemsState] = useState<PurchaseOrderItem[]>(mockPurchaseOrderItems);
  const [grnsState, setGrnsState] = useState<GoodsReceiptNote[]>(mockGoodsReceiptNotes);
  const [grnItemsState, setGrnItemsState] = useState<GoodsReceiptNoteItem[]>(mockGoodsReceiptNoteItems);
  const [invoicesState, setInvoicesState] = useState<Invoice[]>(mockInvoices);
  const [invoiceItemsState, setInvoiceItemsState] = useState<InvoiceItem[]>(mockInvoiceItems);
  const [gstr2bState, setGstr2bState] = useState<Gstr2bRecord[]>(mockGstr2bRecords);
  const [auditLogsState, setAuditLogsState] = useState<ComplianceAuditLog[]>(mockComplianceAuditLogs);

  // Hydrate from LocalStorage
  const loadFromLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.invoices && parsed.invoices.length > 0) {
            setVendorsState(parsed.vendors || mockVendors);
            setPosState(parsed.purchaseOrders || mockPurchaseOrders);
            setPoItemsState(parsed.purchaseOrderItems || mockPurchaseOrderItems);
            setGrnsState(parsed.goodsReceiptNotes || mockGoodsReceiptNotes);
            setGrnItemsState(parsed.goodsReceiptNoteItems || mockGoodsReceiptNoteItems);
            setInvoicesState(parsed.invoices || mockInvoices);
            setInvoiceItemsState(parsed.invoiceItems || mockInvoiceItems);
            setGstr2bState(parsed.gstr2bRecords || mockGstr2bRecords);
            setAuditLogsState(parsed.auditLogs || mockComplianceAuditLogs);
          }
        }
      } catch (err) {
        console.error('Failed to parse AP data from localStorage:', err);
      }
    }
    setIsLoading(false);
  }, []);

  // Load from Supabase Client
  const fetchFromSupabase = useCallback(async (client: SupabaseClient) => {
    try {
      setIsLoading(true);
      const [
        { data: ven },
        { data: po },
        { data: poi },
        { data: grn },
        { data: grni },
        { data: inv },
        { data: invi },
        { data: g2b },
        { data: logs }
      ] = await Promise.all([
        client.from('vendors').select('*'),
        client.from('purchase_orders').select('*'),
        client.from('purchase_order_items').select('*'),
        client.from('goods_receipt_notes').select('*'),
        client.from('goods_receipt_note_items').select('*'),
        client.from('invoices').select('*'),
        client.from('invoice_items').select('*'),
        client.from('gstr2b_records').select('*'),
        client.from('compliance_audit_logs').select('*').order('created_at', { ascending: false })
      ]);

      if (ven && ven.length > 0) setVendorsState(ven);
      if (po && po.length > 0) setPosState(po);
      if (poi && poi.length > 0) setPoItemsState(poi);
      if (grn && grn.length > 0) setGrnsState(grn);
      if (grni && grni.length > 0) setGrnItemsState(grni);
      if (inv && inv.length > 0) setInvoicesState(inv);
      if (invi && invi.length > 0) setInvoiceItemsState(invi);
      if (g2b && g2b.length > 0) setGstr2bState(g2b);
      if (logs && logs.length > 0) setAuditLogsState(logs);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, [loadFromLocalStorage]);

  // Initialize Provider & Detect Supabase Credentials
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
      try {
        const client = createClient(supabaseUrl, supabaseAnonKey);
        setSupabaseClient(client);
        setIsSupabaseConnected(true);
        // Load initial records from Supabase
        fetchFromSupabase(client);
      } catch (err) {
        console.warn('Failed to initialize Supabase client, falling back to LocalStorage demo mode:', err);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
  }, [fetchFromSupabase, loadFromLocalStorage]);

  // Sync to LocalStorage
  const persistState = useCallback((
    newInvoices: Invoice[],
    newAuditLogs: ComplianceAuditLog[],
    newGstr2b: Gstr2bRecord[]
  ) => {
    if (typeof window !== 'undefined') {
      try {
        const bundle = {
          vendors: vendorsState,
          purchaseOrders: posState,
          purchaseOrderItems: poItemsState,
          goodsReceiptNotes: grnsState,
          goodsReceiptNoteItems: grnItemsState,
          invoices: newInvoices,
          invoiceItems: invoiceItemsState,
          gstr2bRecords: newGstr2b,
          auditLogs: newAuditLogs
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bundle));
      } catch (err) {
        console.warn('Failed to persist AP data to localStorage:', err);
      }
    }
  }, [vendorsState, posState, poItemsState, grnsState, grnItemsState, invoiceItemsState]);

  // Join Invoices with Vendors, POs, GRNs, and Line Items
  const enrichedInvoices: InvoiceWithDetails[] = useMemo(() => {
    return invoicesState.map((inv) => {
      const vendor = vendorsState.find((v) => v.id === inv.vendor_id);
      const po = posState.find((p) => p.id === inv.po_id);
      const grn = grnsState.find((g) => g.id === inv.grn_id);
      const items = invoiceItemsState.filter((ii) => ii.invoice_id === inv.id);
      const poItems = po ? poItemsState.filter((poi) => poi.po_id === po.id) : [];
      const grnItems = grn ? grnItemsState.filter((grni) => grni.grn_id === grn.id) : [];
      const gstr2b = gstr2bState.find(
        (g) => g.vendor_gstin === vendor?.gstin && g.invoice_number === inv.invoice_number
      );

      // Compute Section 43B(h) SLA Urgency
      let msmeUrgency: UrgencyTier = 'NOT_APPLICABLE';
      let daysElapsed = 0;
      let daysRemaining = 45;

      if (vendor && (vendor.msme_category === 'MICRO' || vendor.msme_category === 'SMALL') && grn) {
        const grnDate = new Date(grn.grn_date);
        const today = new Date('2026-05-12'); // Standardized runtime reference date
        const diffTime = today.getTime() - grnDate.getTime();
        daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const maxDays = Math.min(vendor.agreement_days || 45, 45);
        daysRemaining = maxDays - daysElapsed;

        if (daysRemaining <= 0) msmeUrgency = 'RED_OVERDUE';
        else if (daysRemaining <= 5) msmeUrgency = 'ORANGE';
        else if (daysRemaining <= 15) msmeUrgency = 'YELLOW';
        else msmeUrgency = 'GREEN';
      }

      return {
        ...inv,
        vendor,
        po,
        grn,
        items,
        poItems,
        grnItems,
        gstr2bRecord: gstr2b,
        msmeUrgency,
        daysElapsed,
        daysRemaining
      };
    });
  }, [
    invoicesState,
    vendorsState,
    posState,
    grnsState,
    invoiceItemsState,
    poItemsState,
    grnItemsState,
    gstr2bState
  ]);

  // Executive CFO Dashboard Metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const totalSpend = invoicesState.reduce((sum, inv) => sum + inv.total_amount, 0);
    const passedInvoices = invoicesState.filter((inv) => inv.compliance_gate_status === 'PASS');
    const heldInvoices = invoicesState.filter((inv) => inv.compliance_gate_status === 'HOLD');
    const rejectedInvoices = invoicesState.filter((inv) => inv.compliance_gate_status === 'REJECT');

    const totalPassedAmount = passedInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const totalHeldAmount = heldInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const totalRejectedAmount = rejectedInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

    // ITC Protected from unfiled GSTR-2B hold
    const itcProtected = heldInvoices
      .filter((inv) => inv.gstr2b_status === 'HOLD_UNFILED')
      .reduce((sum, inv) => sum + inv.tax_amount, 0);

    // Corporate Tax Disallowance Shielded
    const msmeOverdueRisk = enrichedInvoices
      .filter((inv) => inv.msmeUrgency === 'RED_OVERDUE' || inv.msmeUrgency === 'ORANGE')
      .reduce((sum, inv) => sum + inv.subtotal * 0.30, 0);

    // Line Item Overbilling & Rate Variance Prevented (Dynamically Evaluated)
    const leakagePrevented = enrichedInvoices.reduce((totalLeakage, inv) => {
      let invLeakage = 0;
      inv.items.forEach((item) => {
        const poItem = inv.poItems?.find((p) => p.id === item.po_item_id || p.item_sku === item.item_sku);
        const grnItem = inv.grnItems?.find((g) => g.po_item_id === item.po_item_id || g.item_sku === item.item_sku);

        // Price variance
        if (poItem && item.unit_rate > poItem.unit_price) {
          invLeakage += (item.unit_rate - poItem.unit_price) * item.billed_qty;
        }

        // Quantity overbilling
        if (grnItem && item.billed_qty > grnItem.quantity_accepted) {
          const baseRate = poItem ? poItem.unit_price : item.unit_rate;
          invLeakage += (item.billed_qty - grnItem.quantity_accepted) * baseRate;
        }
      });
      return totalLeakage + invLeakage;
    }, 0);

    const totalInvoicesCount = invoicesState.length;
    const passedCount = passedInvoices.length;
    const heldCount = heldInvoices.length;
    const rejectedCount = rejectedInvoices.length;
    const passRate = totalInvoicesCount > 0 ? (passedCount / totalInvoicesCount) * 100 : 0;

    return {
      totalSpend,
      totalPassedAmount,
      totalHeldAmount,
      totalRejectedAmount,
      itcProtected,
      msmeOverdueRisk,
      leakagePrevented,
      totalInvoicesCount,
      passedCount,
      heldCount,
      rejectedCount,
      totalItcSaved: itcProtected,
      heldWorkingCapital: totalHeldAmount,
      activeHoldsCount: heldCount,
      passRate
    };
  }, [invoicesState, enrichedInvoices]);

  // Method 1: Get Invoices
  const getInvoices = useCallback(() => enrichedInvoices, [enrichedInvoices]);

  // Method 2: Get Invoice by ID
  const getInvoiceById = useCallback(
    (id: string) => enrichedInvoices.find((inv) => inv.id === id),
    [enrichedInvoices]
  );

  // Method 3: Update Invoice Status (Pass, Hold, Reject, Override)
  const updateInvoiceStatus = useCallback(
    async (
      id: string,
      newStatus: ComplianceGateStatus,
      reason: string,
      actor: string = 'AP_SPECIALIST'
    ): Promise<boolean> => {
      const targetInvoice = invoicesState.find((inv) => inv.id === id);
      if (!targetInvoice) return false;

      const prevStatus = targetInvoice.compliance_gate_status;
      const updatedInvoice: Invoice = {
        ...targetInvoice,
        compliance_gate_status: newStatus
      };

      const newAuditLog: ComplianceAuditLog = {
        id: `log-${Date.now()}`,
        invoice_id: id,
        event_type: `GATE_MANUAL_${newStatus}`,
        actor,
        previous_status: prevStatus,
        new_status: newStatus,
        reason,
        metadata: {
          updated_at: new Date().toISOString(),
          manual_action: true
        },
        created_at: new Date().toISOString()
      };

      const newInvoicesList = invoicesState.map((inv) => (inv.id === id ? updatedInvoice : inv));
      const newAuditLogsList = [newAuditLog, ...auditLogsState];

      // Update State Immediately
      setInvoicesState(newInvoicesList);
      setAuditLogsState(newAuditLogsList);

      // Persist to Supabase if connected
      if (isSupabaseConnected && supabaseClient) {
        try {
          await Promise.all([
            supabaseClient
              .from('invoices')
              .update({ compliance_gate_status: newStatus })
              .eq('id', id),
            supabaseClient.from('compliance_audit_logs').insert([newAuditLog])
          ]);
        } catch (err) {
          console.error('Failed to sync update to Supabase:', err);
        }
      }

      // Persist to LocalStorage
      persistState(newInvoicesList, newAuditLogsList, gstr2bState);
      return true;
    },
    [invoicesState, auditLogsState, gstr2bState, isSupabaseConnected, supabaseClient, persistState]
  );

  // Method 4: Get Vendors
  const getVendors = useCallback(() => vendorsState, [vendorsState]);

  // Method 5: Get Vendor by ID
  const getVendorById = useCallback(
    (id: string) => vendorsState.find((v) => v.id === id),
    [vendorsState]
  );

  // Method 6: Get Audit Logs
  const getAuditLogs = useCallback(
    (invoiceId?: string) => {
      if (invoiceId) {
        return auditLogsState.filter((log) => log.invoice_id === invoiceId);
      }
      return auditLogsState;
    },
    [auditLogsState]
  );

  // Method 7: Get GSTR-2B Records
  const getGstr2bRecords = useCallback(() => gstr2bState, [gstr2bState]);

  // Method 8: Simulate GSTR-2B GSTN Portal Sync
  const simulateGstr2bSync = useCallback(
    async (vendorGstin: string, invoiceNumber: string): Promise<boolean> => {
      // Find invoice
      const targetInvoice = invoicesState.find((inv) => inv.invoice_number === invoiceNumber);
      if (!targetInvoice) return false;

      const new2BRecord: Gstr2bRecord = {
        id: `g2b-${Date.now()}`,
        vendor_gstin: vendorGstin,
        invoice_number: invoiceNumber,
        invoice_date: targetInvoice.invoice_date,
        invoice_type: 'B2B',
        taxable_value: targetInvoice.subtotal,
        igst: targetInvoice.tax_amount,
        cgst: 0,
        sgst: 0,
        filing_date: new Date().toISOString().split('T')[0],
        gstr2b_period: '042026',
        itc_eligibility: 'ELIGIBLE',
        is_rcm: false
      };

      const updatedGstr2b = [...gstr2bState, new2BRecord];
      const updatedInvoices = invoicesState.map((inv) => {
        if (inv.id === targetInvoice.id) {
          return {
            ...inv,
            gstr2b_status: 'PASS_2B' as const,
            compliance_gate_status: 'PASS' as const,
            risk_score: 10
          };
        }
        return inv;
      });

      const syncAuditLog: ComplianceAuditLog = {
        id: `log-${Date.now()}`,
        invoice_id: targetInvoice.id,
        event_type: 'GSTR2B_SIMULATED_SYNC',
        actor: 'GSTN_SYNC_SIMULATOR',
        previous_status: targetInvoice.compliance_gate_status,
        new_status: 'PASS',
        reason: 'Simulated GSTR-2B live sync: Supplier GSTR-1 return detected on GSTN. ITC unlocked under Section 16(2)(aa).',
        metadata: {
          gstn_filing_date: new2BRecord.filing_date,
          itc_unlocked: targetInvoice.tax_amount
        },
        created_at: new Date().toISOString()
      };

      const updatedLogs = [syncAuditLog, ...auditLogsState];

      setGstr2bState(updatedGstr2b);
      setInvoicesState(updatedInvoices);
      setAuditLogsState(updatedLogs);

      if (isSupabaseConnected && supabaseClient) {
        try {
          await Promise.all([
            supabaseClient.from('gstr2b_records').insert([new2BRecord]),
            supabaseClient
              .from('invoices')
              .update({ gstr2b_status: 'PASS_2B', compliance_gate_status: 'PASS' })
              .eq('id', targetInvoice.id),
            supabaseClient.from('compliance_audit_logs').insert([syncAuditLog])
          ]);
        } catch (err) {
          console.error('Error syncing 2B update to Supabase:', err);
        }
      }

      persistState(updatedInvoices, updatedLogs, updatedGstr2b);
      return true;
    },
    [invoicesState, auditLogsState, gstr2bState, isSupabaseConnected, supabaseClient, persistState]
  );

  // Method 9: Reset to Default Mock Data
  const resetToDefault = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setVendorsState(mockVendors);
    setPosState(mockPurchaseOrders);
    setPoItemsState(mockPurchaseOrderItems);
    setGrnsState(mockGoodsReceiptNotes);
    setGrnItemsState(mockGoodsReceiptNoteItems);
    setInvoicesState(mockInvoices);
    setInvoiceItemsState(mockInvoiceItems);
    setGstr2bState(mockGstr2bRecords);
    setAuditLogsState(mockComplianceAuditLogs);
  }, []);

  const contextValue = useMemo<APDataContextType>(
    () => ({
      isSupabaseConnected,
      isLoading,
      invoices: enrichedInvoices,
      vendors: vendorsState,
      gstr2bRecords: gstr2bState,
      auditLogs: auditLogsState,
      metrics,
      getInvoices,
      getInvoiceById,
      updateInvoiceStatus,
      getVendors,
      getVendorById,
      getAuditLogs,
      getGstr2bRecords,
      simulateGstr2bSync,
      resetToDefault
    }),
    [
      isSupabaseConnected,
      isLoading,
      enrichedInvoices,
      vendorsState,
      gstr2bState,
      auditLogsState,
      metrics,
      getInvoices,
      getInvoiceById,
      updateInvoiceStatus,
      getVendors,
      getVendorById,
      getAuditLogs,
      getGstr2bRecords,
      simulateGstr2bSync,
      resetToDefault
    ]
  );

  return <APDataContext.Provider value={contextValue}>{children}</APDataContext.Provider>;
}

export function useAPData(): APDataContextType {
  const context = useContext(APDataContext);
  if (!context) {
    throw new Error('useAPData must be used within an APDataProvider');
  }
  return context;
}
