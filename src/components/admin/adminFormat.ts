import { ApplicationStatus } from "@/lib/types";

// Date/time helpers live in one place so every surface renders application
// timestamps in Pacific time. Re-exported here to preserve existing imports.
export { formatDate, formatDateTime, todayISO } from "@/lib/datetime";

/** Display metadata for each loan status — label + badge colour classes. */
export const LOAN_STATUS_META: Record<
  ApplicationStatus,
  { label: string; badge: string; dot: string }
> = {
  APPLICATION_SUBMITTED: {
    label: "APPLICATION SUBMITTED",
    badge: "bg-sky-50 text-sky-700 ring-sky-600/20",
    dot: "bg-sky-500",
  },
  BANK_VERIFICATION_PENDING: {
    label: "BANK VERIFICATION PENDING",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  PHONE_VERIFICATION_PENDING: {
    label: "PHONE VERIFICATION PENDING",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  SIGN_LOAN_AGREEMENT: {
    label: "SIGN LOAN AGREEMENT",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  VERIFICATION_DEPOSIT: {
    label: "VERIFICATION DEPOSIT",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  FUNDED: {
    label: "FUNDED",
    badge: "bg-[#0B7A5A]/10 text-[#0B7A5A] ring-[#0B7A5A]/20",
    dot: "bg-[#0B7A5A]",
  },
  DECLINED: {
    label: "DECLINED",
    badge: "bg-rose-50 text-rose-700 ring-rose-600/20",
    dot: "bg-rose-500",
  },
};

export const LOAN_STATUSES = Object.keys(
  LOAN_STATUS_META,
) as ApplicationStatus[];

/** Format a numeric/string dollar amount as USD currency. */
export function formatMoney(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return String(value ?? "—");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Initials for an avatar bubble, e.g. "John Doe" → "JD". */
export function initials(name: string): string {
  return name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
