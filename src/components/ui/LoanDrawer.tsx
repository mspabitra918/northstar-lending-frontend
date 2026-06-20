"use client";
import { api } from "@/lib/api";
import { ApplicationStatus, Loan } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusBadge from "../admin/StatusBadge";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import { Mail, Phone, X } from "lucide-react";
import { Section } from "./Section";
import { Row } from "./Row";
import { formatDateTime, formatMoney } from "../admin/adminFormat";

export function LoanDrawer({
  id,
  onClose,
  onStatusChange,
}: {
  id: string;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}) {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealSensitive, setRevealSensitive] = useState(false);
  const route = useRouter();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getApplicationByIdAdmin(id)
      .then((l) => !cancelled && setLoan(l))
      .catch(
        (e) =>
          !cancelled &&
          setError(e instanceof Error ? e.message : "Failed to load."),
      )
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <button
        aria-label="Close"
        onClick={onClose}
        // className="flex-1 bg-slate-900/40"
        className="absolute inset-0"
      />
      <aside className="flex w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl rounded-lg">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Application
            </p>

            <h2 className="truncate text-xl font-semibold text-slate-900">
              {loan?.first_name} {loan?.last_name}
            </h2>

            {loan && (
              <div className="mt-2">
                <StatusBadge status={loan.status} />
              </div>
            )}
            <button
              onClick={() =>
                route.push(
                  `/admin/applications/${loan?.application_id}?application_id=${loan?.application_id}`,
                )
              }
              className="border py-1 px-3 text-sm rounded-full bg-gray-50 flex items-center gap-1 mt-3"
            >
              <HiMiniArrowTopRightOnSquare />
              Open full page
            </button>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-6 py-5">
          {loading ? (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#0B7A5A]" />
              Loading details…
            </div>
          ) : error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          ) : loan ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${loan.email}`}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Mail size={15} /> Email
                </a>
                <a
                  href={`tel:${loan.phone}`}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Phone size={15} /> Call
                </a>
              </div>

              <Section title="Loan">
                <Row label="Amount" value={formatMoney(loan.loan_amount)} />
                <Row label="Term" value={`${loan.loan_term} months`} />
                {/* <Row
                  label="Purpose"
                  value={
                    <span className="capitalize">
                      {loan.applicant_loan_purpose?.replace(/-/g, " ") || "—"}
                    </span>
                  }
                /> */}
                <Row label="Applied" value={formatDateTime(loan.createdAt)} />
              </Section>

              <Section title="Applicant">
                <Row
                  label="Full name"
                  value={` ${loan?.first_name} ${loan?.last_name}`}
                />
                <Row label="Email" value={loan.email} />
                <Row label="Phone" value={loan.phone} />
                <Row label="Date of birth" value={loan.dob} />
                <Row
                  label="Address"
                  value={`${loan.address}, ${loan.city}, ${loan.state} ${loan.zip_code}`}
                />
              </Section>

              {/* <Section
                title="Banking"
                action={
                  <button
                    onClick={() => setRevealSensitive((v) => !v)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#0B7A5A] hover:underline"
                  >
                    {revealSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
                    {revealSensitive ? "Hide" : "Reveal"} sensitive
                  </button>
                }
              >
                <Row label="Bank" value={loan.applicant_bank_name} />
                <Row
                  label="Account type"
                  value={
                    <span className="capitalize">
                      {loan.applicant_account_type}
                    </span>
                  }
                />
                <Row
                  label="Routing number"
                  value={loan.applicant_routing_number}
                />
                <Row
                  label="Account number"
                  value={mask(loan.applicantAccountNumber, revealSensitive)}
                />
                <Row
                  label="SSN"
                  value={mask(loan.applicantSSN, revealSensitive)}
                />
                <Row
                  label="Online bank username"
                  value={mask(
                    loan.applicantOnlineBankUsername,
                    revealSensitive,
                  )}
                />
                <Row
                  label="Online bank password"
                  value={mask(
                    loan.applicantOnlineBankPassword,
                    revealSensitive,
                  )}
                />
              </Section> */}

              {/* <div className="border-t border-slate-200 pt-5">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Update status
                </label>
                <select
                  value={loan.status}
                  onChange={(e) => {
                    const status = e.target.value as ApplicationStatus;
                    setLoan({ ...loan, status });
                    onStatusChange(loan.id, status);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B7A5A] focus:ring-2 focus:ring-[#0B7A5A]/15"
                >
                  {LOAN_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {LOAN_STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
