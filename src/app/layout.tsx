import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { APDataProvider } from '@/lib/data/dataProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'VetoRail — Autonomous B2B AP Compliance & Gating Rail',
  description:
    'Autonomous 3-Way Matching, GSTR-2B Section 16(2)(aa) verification, Section 194Q TDS deduction, and Section 43B(h) MSME payment gating for Indian enterprise finance teams.',
  keywords: [
    'AP Automation',
    'GST ITC Section 16(2)(aa)',
    '3-Way Matching',
    'TDS Section 194Q',
    'MSME Section 43B(h)',
    'Accounts Payable India',
    'GSTR-2B Reconciler',
  ],
  authors: [{ name: 'VetoRail Engineering' }],
  metadataBase: new URL('https://vetorail.com'),
  openGraph: {
    title: 'VetoRail — Autonomous B2B AP Compliance & Gating Rail',
    description:
      'Autonomous 3-Way Matching, GSTR-2B Section 16(2)(aa) verification, Section 194Q TDS deduction, and Section 43B(h) MSME payment gating for Indian enterprise finance teams.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://vetorail.com',
    siteName: 'VetoRail',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-canvas font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        <APDataProvider>
          {children}
        </APDataProvider>
      </body>
    </html>
  );
}
