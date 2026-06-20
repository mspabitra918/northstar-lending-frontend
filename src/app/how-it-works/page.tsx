import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading, CtaBanner } from "@/components/ui";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { LIFECYCLE_STAGES, LOAN, formatUSD } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works — From Application to Funded in 24 Hours",
  description: `See the full Northstar Lending loan process: apply in minutes, verify your bank securely, e-sign, and get funded within ${LOAN.fundingHours} hours. ${LOAN.apr}% fixed APR, no collateral.`,
  alternates: { canonical: "/how-it-works" },
};

const APPLY_STEPS = [
  {
    title: "Tell us about you",
    body: "Share your personal details — name, contact, and address — in a clean, guided form.",
  },
  {
    title: "Add employment & income",
    body: "Let us know your employment status and monthly income so we can tailor your offer.",
  },
  {
    title: "Connect your bank",
    body: "Securely link your account through Plaid. We never see or store your banking password.",
  },
  {
    title: "Add a reference & consent",
    body: "Provide one reference and review the required legal consents.",
  },
  {
    title: "Submit & track",
    body: "Get your Application ID instantly and follow every milestone in your status portal.",
  },
];

const PROCESS_FAQ = [
  {
    question: "How long does the whole process take?",
    answer:
      "Most applicants complete the application in under five minutes. After final approval, funds are typically sent within 24 hours via ACH.",
  },
  {
    question: "Why do you ask me to connect my bank?",
    answer:
      "Connecting your bank through our secure aggregator (Plaid) instantly verifies your account and routing details, which speeds up funding and protects against fraud. Your online-banking credentials are entered directly into Plaid and never reach Northstar.",
  },
  {
    question: "What happens after I submit my application?",
    answer:
      "You move through five clear milestones: Application Submitted, Phone Verification, Sign Agreement, Verification Deposit, and Funded. You can watch your progress any time on the Loan Status page.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "How It Works", path: "/how-it-works" },
          ]),
          faqSchema(PROCESS_FAQ),
        ]}
      />

      <section className="bg-navy-950">
        <div className="container-x py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold text-white sm:text-5xl">
            From “I need it” to funded — in about a day.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-200">
            A transparent, five-step path with no surprises. Here’s exactly how
            a Northstar loan works from start to finish.
          </p>
        </div>
      </section>

      {/* Application steps */}
      <section className="container-x mt-20">
        <SectionHeading
          eyebrow="The application"
          title="Five simple steps to apply"
          subtitle="The form is broken into short, digestible steps with real-time validation so nothing trips you up."
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {APPLY_STEPS.map((s, i) => (
            <li key={s.title} className="card relative p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-star-400">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Lifecycle */}
      <section className="container-x mt-24">
        <SectionHeading
          eyebrow="After you submit"
          title="The 5-stage loan lifecycle"
          subtitle="Every application advances through these milestones. You’ll see your current stage — and get an email and text — each time you move forward."
        />
        <ol className="mt-12 space-y-4">
          {LIFECYCLE_STAGES.map((stage, i) => (
            <li key={stage.key} className="card flex gap-5 p-6">
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-star-400 text-base font-bold text-navy-950">
                  {i + 1}
                </span>
                {i < LIFECYCLE_STAGES.length - 1 && (
                  <span className="mt-2 h-full w-px flex-1 bg-navy-100" />
                )}
              </div>
              <div className="pb-1">
                <h3 className="text-lg font-semibold">{stage.label}</h3>
                <p className="mt-1 text-navy-600 leading-relaxed">
                  {stage.blurb}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Process FAQ */}
      <section className="container-x mt-24">
        <SectionHeading center title="More about the process" />
        <div className="mx-auto mt-10 max-w-3xl space-y-6">
          {PROCESS_FAQ.map((f) => (
            <div key={f.question} className="card p-6">
              <h3 className="text-lg font-semibold">{f.question}</h3>
              <p className="mt-2 text-navy-600 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/apply" className="btn-primary">
            Start my application
          </Link>
          <p className="mt-3 text-sm text-navy-500">
            {formatUSD(LOAN.minAmount)}–{formatUSD(LOAN.maxAmount)} · {LOAN.apr}
            % fixed APR · No upfront fees
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
