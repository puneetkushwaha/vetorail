'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Enterprise Sidebar */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Global Multi-Tenant Header */}
        <Header onSearchChange={setGlobalSearch} searchQuery={globalSearch} />

        {/* Scrollable Viewport */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
