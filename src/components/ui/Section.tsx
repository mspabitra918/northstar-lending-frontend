export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </h3>
        {action}
      </div>
      <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {children}
      </dl>
    </div>
  );
}
