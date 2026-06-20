import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VerifyBankClient } from '@/components/VerifyBankClient';

export const metadata: Metadata = {
  title: 'Verify Your Bank Account',
  description:
    'Securely verify your bank account through Plaid to unlock 24-hour funding. Northstar Lending never stores your online-banking credentials.',
  // Post-application, applicant-specific — keep out of the index.
  robots: { index: false, follow: false },
};

export default function VerifyBankPage() {
  return (
    <Suspense fallback={<div className="container-x py-24 text-center text-navy-400">Loading…</div>}>
      <VerifyBankClient />
    </Suspense>
  );
}
