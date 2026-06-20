import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/Faq";
import { SectionHeading, StatBar, Stars, CtaBanner } from "@/components/ui";
import { faqSchema } from "@/lib/schema";
import { FAQS, TESTIMONIALS, TRUST_SIGNALS } from "@/lib/content";
import { LOAN, formatUSD } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Personal Loans up to $10,000, Funded in 24 Hours",
  description: `Get an unsecured personal loan from ${formatUSD(LOAN.minAmount)} to ${formatUSD(LOAN.maxAmount)} at a fixed ${LOAN.apr}% APR. No collateral, $0 upfront fees, all credit tiers welcome.`,
  alternates: { canonical: "/" },
};

const VALUE_PROPS = [
  {
    title: "24-hour funding",
    body: "Once approved, your money is sent by ACH and typically lands within a single day.",
    icon: "bolt",
  },
  {
    title: `Fixed ${LOAN.apr}% APR`,
    body: "One simple rate that never changes. No teaser rates, no surprises down the line.",
    icon: "percent",
  },
  {
    title: "$0 upfront fees",
    body: "No application fee, no processing fee. You only ever repay principal plus interest.",
    icon: "shield",
  },
  {
    title: "All credit welcome",
    body: "We consider every credit tier and every loan purpose. A low score won’t stop you.",
    icon: "users",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={faqSchema(
          FAQS.slice(0, 6) as unknown as { question: string; answer: string }[],
        )}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_0%,rgba(245,158,11,0.18),transparent)]" />
        <div className="container-x relative grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900 px-4 py-1.5 text-sm font-medium text-star-300">
              <span className="h-2 w-2 rounded-full bg-star-400" />
              Now lending in all 50 states
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Personal loans that move
              <span className="text-star-400"> as fast as you do.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200">
              Borrow {formatUSD(LOAN.minAmount)}–{formatUSD(LOAN.maxAmount)} at
              a fixed {LOAN.apr}% APR. No collateral, no upfront fees, and
              funding within {LOAN.fundingHours} hours of approval.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/apply" className="btn-primary">
                Apply Now — it’s free
              </Link>
              <Link
                href="/how-it-works"
                className="btn-secondary border-navy-700 bg-transparent text-white hover:bg-navy-800"
              >
                How it works
              </Link>
            </div>
            <p className="mt-5 text-sm text-navy-400">
              Bank-grade AES-256 encryption · TLS 1.3 · Your data stays private.
            </p>
          </div>

          {/* Rate card */}
          <div className="lg:justify-self-end">
            <div className="w-full lg:w-96 rounded-md bg-white p-7 shadow-lift">
              <p className="text-sm font-medium text-navy-500">
                Your fixed rate
              </p>
              <p className="mt-1 text-5xl font-bold text-navy-900">
                {LOAN.apr}
                <span className="text-2xl">% APR</span>
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                <Row
                  label="Loan amount"
                  value={`${formatUSD(LOAN.minAmount)} – ${formatUSD(LOAN.maxAmount)}`}
                />
                <Row label="Collateral" value="None required" />
                <Row label="Upfront fees" value={formatUSD(LOAN.upfrontFees)} />
                <Row
                  label="Funding time"
                  value={`~${LOAN.fundingHours} hours`}
                />
                <Row label="Credit needed" value="All tiers" />
              </dl>
              <Link href="/apply" className="btn-primary mt-7 w-full">
                Check your amount
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="container-x -mt-8 relative">
        <StatBar items={TRUST_SIGNALS} />
      </section>

      {/* Value props */}
      <section className="container-x mt-24">
        <SectionHeading
          center
          eyebrow="Why Northstar"
          title="A straightforward alternative to legacy banks"
          subtitle="Everything is fixed, transparent, and built for speed. No fine print working against you."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((p) => (
            <div key={p.title} className="card p-6">
              <Icon name={p.icon} />
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof preview */}
      <section className="container-x mt-24">
        <SectionHeading
          eyebrow="Trusted nationwide"
          title="Real borrowers, real results"
          subtitle="Thousands of applicants have used Northstar to cover what life throws at them."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <figure key={t.name} className="card p-6">
              <Stars rating={t.rating} />
              <blockquote className="mt-4 text-navy-700 leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-navy-900">
                {t.name}{" "}
                <span className="font-normal text-navy-400">
                  · {t.location}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/reviews"
            className="btn-ghost px-0 text-star-600 hover:bg-transparent hover:underline"
          >
            Read all reviews & trust signals →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x mt-24">
        <SectionHeading
          center
          eyebrow="Questions, answered"
          title="Frequently asked questions"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <Faq items={FAQS} />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-navy-50 pb-2">
      <dt className="text-navy-500">{label}</dt>
      <dd className="font-semibold text-navy-900">{value}</dd>
    </div>
  );
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
    percent: (
      <>
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="17" r="2.5" />
        <path d="M19 5L5 19" strokeLinecap="round" />
      </>
    ),
    shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path
          d="M3 20a6 6 0 0112 0M16 5a3 3 0 010 6M21 20a6 6 0 00-4-5.6"
          strokeLinecap="round"
        />
      </>
    ),
  };
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-star-100 text-star-600">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      >
        {paths[name]}
      </svg>
    </span>
  );
}
