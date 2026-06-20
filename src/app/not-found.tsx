import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-x py-28 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-star-600">404</p>
      <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-navy-600">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">Back home</Link>
        <Link href="/apply" className="btn-secondary">Apply now</Link>
      </div>
    </section>
  );
}
