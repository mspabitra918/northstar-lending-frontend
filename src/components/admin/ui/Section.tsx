export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
      {title}
    </h3>
    {children}
  </div>
);
