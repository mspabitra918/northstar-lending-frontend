import { ApplicationStatus } from "@/lib/types";
import { LOAN_STATUS_META } from "./adminFormat";

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = LOAN_STATUS_META[status] ?? {
    label: status,
    badge: "bg-slate-100 text-slate-700 ring-slate-600/20",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
