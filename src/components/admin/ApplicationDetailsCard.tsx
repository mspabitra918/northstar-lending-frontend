import React from "react";
import type { AdminNote, AuditLog, Loan } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { formatDateTime, formatMoney, initials } from "./adminFormat";
import { InfoRow } from "../ui/InfoRow";

interface Props {
  loan: Loan;
}

function fmtDate(value?: string | null): string {
  if (!value) return "-";
  return formatDateTime(value);
}

function noteDate(n: AdminNote | AuditLog): string {
  return fmtDate(n.createdAt ?? n.created_at ?? null);
}

const Section = ({
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

export default function ApplicationDetailsCard({ loan }: Props) {
  const fullName = `${loan.first_name ?? ""} ${loan.last_name ?? ""}`.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-gradient-to-r from-indigo-50 to-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
              {initials(fullName) || "—"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {fullName || "Applicant"}
              </h2>
              <p className="text-sm text-gray-500">
                Application ID: {loan.application_id}
              </p>
            </div>
          </div>
          <StatusBadge status={loan.status} />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 divide-x divide-y border-t sm:grid-cols-6 sm:divide-y-0">
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Loan Amount
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {loan.loan_amount != null ? formatMoney(loan.loan_amount) : "-"}
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Term
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {loan.loan_term ? `${loan.loan_term} mo` : "-"}
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Bank Verified
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                loan.bank_verified ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {loan.bank_verified ? "Yes" : "No"}
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Upload Document
            </p>

            <p
              className={`mt-1 text-lg font-bold ${
                loan?.documents?.length > 0
                  ? "text-emerald-600"
                  : "text-gray-400"
              }`}
            >
              {loan?.documents?.length > 0 ? "Yes" : "No"}
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Agreement Aigned
            </p>

            <p
              className={`mt-1 text-lg font-bold ${
                loan?.agreement_signed_at ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {loan?.agreement_signed_at ? "Yes" : "No"}
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Applied
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {fmtDate(loan.createdAt ?? loan.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <Section title="Personal Information">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoRow label="Email" value={loan.email} />
          <InfoRow label="Phone" value={loan.phone} />
          <InfoRow label="Date of Birth" value={loan.dob} />
          <InfoRow label="Address" value={loan.address} />
          <InfoRow label="City" value={loan.city} />
          <InfoRow label="State" value={loan.state} />
          <InfoRow label="Zip Code" value={loan.zip_code} />
        </div>
      </Section>

      {/* Employment */}
      <Section title="Employment Details">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoRow label="Employment Status" value={loan.employment_status} />
          <InfoRow label="Employer" value={loan.employer_name} />
          <InfoRow label="Employer Phone" value={loan.employer_phone} />
          <InfoRow
            label="Monthly Income"
            value={
              loan.monthly_income != null
                ? formatMoney(loan.monthly_income)
                : "-"
            }
          />
        </div>
      </Section>

      {/* Banking */}
      <Section title="Bank Information">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoRow label="Account Type" value={loan.account_type} />
          <InfoRow label="Account Age" value={loan.account_age} />
          <InfoRow
            label="Bank Verified"
            value={loan.bank_verified ? "Yes" : "No"}
          />
        </div>
      </Section>

      {/* Loan */}
      <Section title="Loan Information">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoRow
            label="Loan Amount"
            value={
              loan.loan_amount != null ? formatMoney(loan.loan_amount) : "-"
            }
          />
          <InfoRow
            label="Loan Term"
            value={loan.loan_term ? `${loan.loan_term} Months` : "-"}
          />
          <InfoRow label="Credit Tier" value={loan.credit_tier} />
          <InfoRow
            label="Consent Accepted"
            value={loan.consent_accepted ? "Yes" : "No"}
          />
        </div>
      </Section>

      {/* Reference */}
      <Section title="Reference Information">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoRow label="Reference Name" value={loan.reference_name} />
          <InfoRow label="Reference Phone" value={loan.reference_phone} />
          <InfoRow label="Relationship" value={loan.reference_relationship} />
        </div>
      </Section>

      {/* Agreement */}
      <Section title="Agreement Details">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoRow
            label="Agreement Generated"
            value={fmtDate(loan.agreement_generated_at)}
          />
          <InfoRow label="Signed By" value={loan.agreement_signed_name} />
          <InfoRow
            label="Signed At"
            value={fmtDate(loan.agreement_signed_at)}
          />
          <InfoRow label="IP Address" value={loan.agreement_signed_ip} />
        </div>
      </Section>

      {/* Admin Notes */}
      <Section title="Admin Notes">
        {loan.admin_notes?.length ? (
          <div className="space-y-3">
            {loan.admin_notes.slice(0, 4).map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <p className="whitespace-pre-wrap text-sm text-gray-800">
                  {note.note}
                </p>
                <p className="mt-2 text-xs text-gray-500">{noteDate(note)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No notes yet.</p>
        )}
      </Section>

      {/* Audit Logs */}
      <Section title="Audit Logs">
        {loan.audit_logs?.length ? (
          <div className="space-y-3">
            {loan.audit_logs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between rounded-lg border border-gray-100 p-4"
              >
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">
                    {log.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {log.users?.first_name && log.users?.last_name
                      ? `${log.users.first_name} ${log.users.last_name}`
                      : "System"}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-500">
                  {noteDate(log)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No activity recorded yet.</p>
        )}
      </Section>
    </div>
  );
}
