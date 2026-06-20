"use client";
import {
  formatUSD,
  LIFECYCLE_STAGES,
  STATUS_TO_STAGE_INDEX,
} from "@/lib/constants";
import { Loan } from "@/lib/types";
import Link from "next/link";
import { SignAgreementBlock } from "./SignAgreementBlock";

export function StatusResult({
  loan,
  onReset,
}: {
  loan: Loan;
  onReset: () => void;
}) {
  const declined = loan.status === "DECLINED";
  const currentIndex = STATUS_TO_STAGE_INDEX[loan.status] ?? 0;
  const needsBank =
    !loan.bank_verified &&
    (loan.status === "APPLICATION_SUBMITTED" ||
      loan.status === "BANK_VERIFICATION_PENDING");
  const needsSignature = loan.status === "SIGN_LOAN_AGREEMENT";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card p-7 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-navy-500">Application</p>
            <p className="text-2xl font-bold">{loan.application_id}</p>
            <p className="mt-1 text-navy-600">
              {loan.first_name} {loan.last_name} · {formatUSD(loan.loan_amount)}{" "}
              over {loan.loan_term} months
            </p>
          </div>
          <button type="button" className="btn-ghost text-sm" onClick={onReset}>
            Look up another
          </button>
        </div>

        {declined ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-800">
              Application declined
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-red-700">
              Unfortunately we’re unable to approve this application at this
              time. You’ll receive an adverse action notice by email with
              details about this decision and your rights.
            </p>
          </div>
        ) : (
          <ol className="mt-8 space-y-1">
            {/* {LIFECYCLE_STAGES.map((stage, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <li key={stage.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                            ? "bg-star-400 text-navy-950 ring-4 ring-star-100"
                            : "bg-navy-100 text-navy-400"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    {i < LIFECYCLE_STAGES.length - 1 && (
                      <span
                        className={`my-1 h-8 w-px ${done ? "bg-green-400" : "bg-navy-100"}`}
                      />
                    )}
                  </div>
                  <div className="pb-4">
                    <p
                      className={`font-semibold ${active ? "text-navy-900" : done ? "text-navy-700" : "text-navy-400"}`}
                    >
                      {stage.label}
                      {active && (
                        <span className="ml-2 rounded-full bg-star-100 px-2 py-0.5 text-xs font-medium text-star-700">
                          Current step
                        </span>
                      )}
                    </p>
                    {(active || done) && (
                      <p className="mt-0.5 text-sm text-navy-500">
                        {stage.blurb}
                      </p>
                    )}
                  </div>
                </li>
              );
            })} */}
            {LIFECYCLE_STAGES.map((stage, i) => {
              const isFunded = loan?.status === "FUNDED";

              const done = isFunded ? i <= currentIndex : i < currentIndex;

              const active = !isFunded && i === currentIndex;

              return (
                <li key={stage.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                            ? "bg-star-400 text-navy-950 ring-4 ring-star-100"
                            : "bg-navy-100 text-navy-400"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>

                    {i < LIFECYCLE_STAGES.length - 1 && (
                      <span
                        className={`my-1 h-8 w-px ${
                          done ? "bg-green-400" : "bg-navy-100"
                        }`}
                      />
                    )}
                  </div>

                  <div className="pb-4">
                    <p
                      className={`font-semibold ${
                        active
                          ? "text-navy-900"
                          : done
                            ? "text-navy-700"
                            : "text-navy-400"
                      }`}
                    >
                      {stage.label}

                      {active && (
                        <span className="ml-2 rounded-full bg-star-100 px-2 py-0.5 text-xs font-medium text-star-700">
                          Current step
                        </span>
                      )}
                    </p>

                    {(active || done) && (
                      <p className="mt-0.5 text-sm text-navy-500">
                        {stage.blurb}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {needsBank && (
          <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-star-200 bg-star-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-navy-900">
                Action needed: verify your bank
              </p>
              <p className="text-sm text-navy-600">
                Complete bank verification to keep your loan moving.
              </p>
            </div>
            <Link
              href={`/verify-bank?id=${encodeURIComponent(loan.id)}&ref=${encodeURIComponent(loan.application_id)}`}
              className="btn-primary shrink-0 px-5 py-2.5 text-sm"
            >
              Verify now
            </Link>
          </div>
        )}

        {needsSignature && <SignAgreementBlock loan={loan} />}
      </div>
    </div>
  );
}
