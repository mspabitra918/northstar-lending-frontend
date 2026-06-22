// components/legal/LegalPage.tsx

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="bg-white">
      <section className="bg-navy-950">
        <div className="container-x py-20">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
        </div>
      </section>

      <section className="container-x py-12">
        <div className="prose prose-lg max-w-none">{children}</div>
      </section>
    </div>
  );
}
