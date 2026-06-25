"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { UserRole, type ApplicationStatus } from "@/lib/types";

// Lifecycle statuses in the order the applicant progresses through them, with
// the same wording shown on the public status portal and in the emails so the
// admin, the applicant, and the notifications all stay in sync.
//
// FUNDED and DECLINED are intentionally absent: they are final decisions
// executed through the manager-gated Approve / Decline actions below, not the
// generic status dropdown.
const STATUS_FLOW: { value: ApplicationStatus; label: string }[] = [
  { value: "APPLICATION_SUBMITTED", label: "Application Submitted" },
  { value: "BANK_VERIFICATION_PENDING", label: "Bank Verification" },
  { value: "PHONE_VERIFICATION_PENDING", label: "Phone Verification" },
  { value: "SIGN_LOAN_AGREEMENT", label: "Sign Agreement" },
  { value: "VERIFICATION_DEPOSIT", label: "Verification Deposit" },
];

interface Props {
  applicationId: string;
  currentStatus: ApplicationStatus;
  isLocked?: boolean;
  declineReason?: string | null;
}

export default function StatusUpdatePanel({
  applicationId,
  currentStatus,
  isLocked = false,
  declineReason = null,
}: Props) {
  const router = useRouter();

  // Standard agents can advance intermediate statuses, send follow-ups, and
  // request documents. Only manager-level accounts can execute the final
  // Approve / Decline decisions (also enforced server-side).
  const user = getUser();
  const canFinalize =
    user?.role === UserRole.MANAGER || user?.role === UserRole.SUPER_ADMIN;

  // A locked application is the result of a final decision and is read-only.
  const locked = isLocked;

  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [action, setAction] = useState<
    "approve" | "decline" | "docs" | "bank" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Collect-documents delivery channel + decline reason.
  const [docChannel, setDocChannel] = useState<"email" | "sms" | "both">(
    "email",
  );
  const [showDecline, setShowDecline] = useState(false);
  const [reason, setReason] = useState("");

  const busy = saving || action !== null;

  // The note field "opens" only once the admin picks a different status — it's
  // the place to record *why* the application moved.
  const statusChanged = status !== currentStatus;
  const noteOnly = !statusChanged && note.trim().length > 0;

  // Audit requirement: record that this admin viewed the application. Best
  // effort — fired once on open and never blocks the page.
  useEffect(() => {
    void api.logApplicationView(applicationId);
  }, [applicationId]);

  function requireSession(): boolean {
    if (!user?.id) {
      setError("Your admin session has expired. Please sign in again.");
      return false;
    }
    return true;
  }

  async function handleSave() {
    setError(null);
    setSuccess(null);
    if (!requireSession()) return;

    if (!statusChanged && !note.trim()) {
      setError("Change the status or add a note before saving.");
      return;
    }

    setSaving(true);
    try {
      if (statusChanged) {
        await api.updateApplicationStatus(applicationId, status, user!.id);
      }
      if (note.trim()) {
        await api.addAdminNote(applicationId, note.trim(), user!.id);
      }
      setSuccess(
        statusChanged
          ? "Status updated and the applicant has been notified by email."
          : "Note saved.",
      );
      setNote("");
      router.refresh();
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove() {
    setError(null);
    setSuccess(null);
    if (!requireSession()) return;
    if (
      !window.confirm(
        "Approve and fund this application? This advances it to Funded, locks the record, and notifies the applicant. This cannot be undone.",
      )
    ) {
      return;
    }
    setAction("approve");
    try {
      await api.approveApplication(applicationId);
      setSuccess("Application approved and funded. The record is now locked.");
      router.refresh();
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setAction(null);
    }
  }

  async function handleDecline() {
    setError(null);
    setSuccess(null);
    if (!requireSession()) return;
    setAction("decline");
    try {
      await api.declineApplication(applicationId, reason.trim());
      setSuccess(
        "Application declined. An adverse action notice has been sent and the record is locked.",
      );
      setShowDecline(false);
      setReason("");
      router.refresh();
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setAction(null);
    }
  }

  async function handleCollectDocuments() {
    setError(null);
    setSuccess(null);
    if (!requireSession()) return;
    setAction("docs");
    try {
      const res = await api.collectDocuments(applicationId, docChannel);
      setSuccess(
        `Secure document upload link sent (${res.channel}). It expires in 7 days.`,
      );
      router.refresh();
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setAction(null);
    }
  }

  async function handleCollectBankUserNameandPassword() {
    setError(null);
    setSuccess(null);
    if (!requireSession()) return;
    setAction("bank");
    try {
      const res = await api.collectBankUserNameandPasswords(
        applicationId,
        docChannel,
      );
      setSuccess(
        `Secure bank login link sent (${res.channel}). It expires in 7 days.`,
      );
      router.refresh();
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setAction(null);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Manage Application</h3>
        {locked ? (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            Locked
          </span>
        ) : (
          statusChanged && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
              Unsaved change
            </span>
          )
        )}
      </div>

      {locked ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          A final decision has been recorded for this application
          {currentStatus === "DECLINED" ? " (Declined)" : " (Funded)"}. The
          record is locked and can no longer be changed.
          {currentStatus === "DECLINED" && declineReason && (
            <span className="mt-1 block text-gray-500">
              Reason: {declineReason}
            </span>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Application status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as ApplicationStatus);
                  setError(null);
                  setSuccess(null);
                }}
                disabled={busy}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
              >
                {STATUS_FLOW.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={busy || (!statusChanged && !note.trim())}
              className="h-[42px] rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : noteOnly ? "Save note" : "Save changes"}
            </button>
          </div>

          {/* Admin note — revealed once a status change is pending, but always
              available so an admin can leave a standalone note too. */}
          <div className="mt-4">
            <label
              htmlFor="admin-note"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Admin note{" "}
              <span className="font-normal normal-case text-gray-400">
                {statusChanged
                  ? "(recommended — explain this status change)"
                  : "(optional)"}
              </span>
            </label>
            <textarea
              id="admin-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={busy}
              rows={3}
              placeholder={
                statusChanged
                  ? "e.g. Verified income docs over the phone, advancing to agreement."
                  : "Add an internal note about this application…"
              }
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
            />
          </div>

          {/* ── Actionable triggers ─────────────────────────────────────── */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </h4>
              {!canFinalize && (
                <span className="text-xs text-gray-400">
                  Approvals &amp; declines require a manager account
                </span>
              )}
            </div>

            {/* Collect Documents — available to all admins (a follow-up). */}
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label
                  htmlFor="doc-channel"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  Send link via
                </label>
                <select
                  id="doc-channel"
                  value={docChannel}
                  onChange={(e) =>
                    setDocChannel(e.target.value as "email" | "sms" | "both")
                  }
                  disabled={busy}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                >
                  <option value="email">Email</option>
                  {/* <option value="sms">SMS</option> */}
                  {/* <option value="both">Email &amp; SMS</option> */}
                </select>
              </div>
              <button
                type="button"
                onClick={handleCollectDocuments}
                disabled={busy}
                className="h-[42px] rounded-lg border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {action === "docs" ? "Sending…" : "Collect Documents"}
              </button>
            </div>

            {/* Approve / Decline — manager-level final decisions. */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleApprove}
                disabled={busy || !canFinalize}
                title={canFinalize ? undefined : "Manager approval required"}
                className="h-[42px] rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {action === "approve" ? "Approving…" : "Approve & Fund"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setShowDecline((v) => !v);
                }}
                disabled={busy || !canFinalize}
                title={canFinalize ? undefined : "Manager approval required"}
                className="h-[42px] rounded-lg border border-rose-300 bg-white px-5 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Decline
              </button>
              {/* <button
                type="button"
                onClick={handleCollectBankUserNameandPassword}
                disabled={busy || !canFinalize}
                title={canFinalize ? undefined : "Manager approval required"}
                className="h-[42px] rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {action === "bank"
                  ? "Sending…"
                  : "Collect Bank username and password"}
              </button> */}
            </div>

            {showDecline && canFinalize && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                <label
                  htmlFor="decline-reason"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-rose-700"
                >
                  Reason for decline{" "}
                  <span className="font-normal normal-case text-rose-400">
                    (included in the adverse action notice)
                  </span>
                </label>
                <textarea
                  id="decline-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={busy}
                  rows={2}
                  placeholder="e.g. Unable to verify income; debt-to-income ratio too high."
                  className="w-full resize-y rounded-lg border border-rose-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-60"
                />
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={handleDecline}
                    disabled={busy}
                    className="h-[38px] rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {action === "decline" ? "Declining…" : "Confirm decline"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDecline(false)}
                    disabled={busy}
                    className="h-[38px] rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}
    </div>
  );
}

function toMessage(err: unknown): string {
  return err instanceof ApiError
    ? err.message
    : "Something went wrong. Please try again.";
}
