import Link from 'next/link';

// Small shared presentational helpers used across marketing pages.

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-star-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-navy-600">{subtitle}</p>
      )}
    </div>
  );
}

export function StatBar({
  items,
}: {
  items: readonly { stat: string; label: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-navy-100 bg-navy-100 sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="bg-white px-5 py-6 text-center">
          <dt className="text-3xl font-bold text-navy-900">{it.stat}</dt>
          <dd className="mt-1 text-sm text-navy-500">{it.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className={i < rating ? 'fill-star-400' : 'fill-navy-200'}
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.3L22 9.3l-5 4.6 1.3 6.8L12 17.5 5.7 20.7 7 13.9l-5-4.6 7.1-1z" />
        </svg>
      ))}
    </div>
  );
}

export function CtaBanner() {
  return (
    <section className="container-x my-24">
      <div className="overflow-hidden rounded-3xl bg-navy-900 px-8 py-14 text-center sm:px-16">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-navy-200">
          Check your amount with no upfront fees and no impact to start. Most
          applicants finish in under five minutes.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/apply" className="btn-primary w-full sm:w-auto">
            Apply Now
          </Link>
          <Link href="/how-it-works" className="btn-secondary w-full border-navy-700 bg-transparent text-white hover:bg-navy-800 sm:w-auto">
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
