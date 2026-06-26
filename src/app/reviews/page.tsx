import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading, Stars, CtaBanner } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { TESTIMONIALS } from "@/lib/content";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reviews & Trust — What Borrowers Say About Northstar Lending",
  description:
    "Read verified customer reviews and learn how Northstar Lending protects your data with bank-grade security, transparent fixed rates, and full GLBA/CCPA compliance.",
  alternates: { canonical: "/reviews" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${BRAND.domain}`;

const avgRating =
  Math.round(
    (TESTIMONIALS.reduce((s, t) => s + t.rating, 0) / TESTIMONIALS.length) * 10,
  ) / 10;

const TRUST_CORNERS = [
  {
    title: "Bank-grade encryption",
    body: "AES-256 at rest and TLS 1.3 in transit. Your SSN and account numbers are encrypted at the field level — not just the database.",
  },
  {
    title: "We never store your bank password",
    body: "Bank verification runs through Plaid, a regulated aggregator. Your online-banking credentials are entered into Plaid directly and never touch our servers.",
  },
  {
    title: "GLBA & CCPA compliant",
    body: "We honor data-deletion requests and maintain strict data segregation in line with federal and state financial-privacy laws.",
  },
  {
    title: "No hidden fees, ever",
    body: "One fixed 10% APR and $0 upfront fees. The amount you see is the amount you repay — plus simple interest.",
  },
];

export default function ReviewsPage() {
  // AggregateRating schema attached to the organization for rich results.
  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      bestRating: 5,
      ratingCount: TESTIMONIALS.length,
    },
    review: TESTIMONIALS.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
      },
      reviewBody: t.quote,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          ratingSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Reviews & Trust", path: "/reviews" },
          ]),
        ]}
      />

      <section className="bg-navy-950">
        <div className="container-x py-10 md:py-20 text-center">
          <div className="flex items-center justify-center gap-3">
            <Stars rating={5} />
            <span className="text-2xl font-bold text-white">{avgRating}/5</span>
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold text-white sm:text-5xl">
            Trusted by borrowers across all 50 states
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-200">
            Honest rates and a process people actually finish. Here’s what real
            Northstar customers have to say.
          </p>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="container-x mt-7 md:mt-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex flex-col p-6">
              <div className="flex items-center justify-between">
                <Stars rating={t.rating} />
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.4-1.4z" />
                  </svg>
                  Verified
                </span>
              </div>
              <blockquote className="mt-4 flex-1 text-navy-700 leading-relaxed">
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
      </section>

      {/* Trust corners */}
      <section className="container-x mt-24">
        <SectionHeading
          center
          eyebrow="Built on trust"
          title="Your security is the product"
          subtitle="Handling sensitive financial data means earning trust at every layer. Here’s how we protect you."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {TRUST_CORNERS.map((c) => (
            <div key={c.title} className="card flex gap-4 p-6">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-star-400">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-navy-600 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
