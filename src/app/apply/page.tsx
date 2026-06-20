import type { Metadata } from 'next';
import { ApplyForm } from '@/components/form/ApplyForm';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { LOAN, formatUSD } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Apply Now — Get Your Personal Loan in Minutes',
  description: `Apply for a ${formatUSD(LOAN.minAmount)}–${formatUSD(LOAN.maxAmount)} unsecured personal loan at a fixed ${LOAN.apr}% APR. No upfront fees, all credit welcome, funded within 24 hours.`,
  alternates: { canonical: '/apply' },
  robots: { index: true, follow: true },
};

export default function ApplyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Apply Now', path: '/apply' },
        ])}
      />
      <section className="container-x py-12 sm:py-16">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold sm:text-4xl">Apply for your loan</h1>
          <p className="mt-3 text-lg text-navy-600">
            It takes about five minutes. There are no upfront fees and checking
            your amount won’t cost you anything.
          </p>
        </div>
        <ApplyForm />
      </section>
    </>
  );
}
