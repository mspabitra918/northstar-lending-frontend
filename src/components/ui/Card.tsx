export function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="container-x py-16">
      <div className="mx-auto max-w-xl">
        <div className="card p-8">{children}</div>
      </div>
    </section>
  );
}
