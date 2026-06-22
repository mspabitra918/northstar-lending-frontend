"use client";
import { api, ApiError } from "@/lib/api";
import { formatUSD, LOAN } from "@/lib/constants";
import { Agreement, Loan } from "@/lib/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedPanel } from "./SignedPanel";

export function SignAgreementBlock({ loan }: { loan: Loan }) {
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loadingAgreement, setLoadingAgreement] = useState(true);
  const [agreementError, setAgreementError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [agreed, setAgreed] = useState(false);
  // E-Sign Consent Disclosure must be accepted before the borrower can view or
  // sign the PDF contract. Pre-seed as accepted if the loan is already signed.
  const [esignConsent, setEsignConsent] = useState(
    Boolean(loan.agreement_signed_at),
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Locally track a signature completed this session so the UI flips without a
  // full reload. Pre-seed from the loan in case it was already signed.
  const [signed, setSigned] = useState<{ at: string; name: string } | null>(
    loan.agreement_signed_at
      ? { at: loan.agreement_signed_at, name: loan.agreement_signed_name ?? "" }
      : null,
  );

  useEffect(() => {
    let active = true;
    setLoadingAgreement(true);
    api
      .getAgreement(loan.application_id)
      .then((a) => {
        if (!active) return;
        setAgreement(a);
        if (a?.signed && a.signed_at && !signed) {
          setSigned({ at: a.signed_at, name: a.signed_name ?? "" });
        }
      })
      .catch(() => {
        if (active)
          setAgreementError(
            "We couldn’t load your agreement. Please try again shortly.",
          );
      })
      .finally(() => {
        if (active) setLoadingAgreement(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loan.application_id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!esignConsent) {
      setFormError(
        "Please accept the Electronic Communications & E-Sign Consent Disclosure to continue.",
      );
      return;
    }
    if (!fullName.trim()) {
      setFormError("Type your full legal name to sign.");
      return;
    }
    if (!agreed) {
      setFormError("Please confirm you have read and agree to the agreement.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const result = await api.signAgreement(
        loan.application_id,
        fullName.trim(),
      );
      setSigned({ at: result.signed_at, name: result.signed_name });
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong submitting your signature. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Loan terms rendered inline so the agreement is always visible in the portal,
  // independent of the generated PDF. APR is the product's fixed rate.
  const amount = Number(loan.loan_amount) || 0;
  const termMonths = Number(loan.loan_term) || 0;
  const monthlyRate = LOAN.apr / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0 && termMonths > 0
      ? (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))
      : termMonths > 0
        ? amount / termMonths
        : amount;
  const totalRepayment = monthlyPayment * termMonths;
  const borrowerName = `${loan.first_name} ${loan.last_name}`.trim();

  const terms: [string, string][] = [
    ["Borrower", borrowerName || "—"],
    ["Principal amount", formatUSD(amount)],
    ["Term", `${termMonths} months`],
    ["Fixed APR", `${LOAN.apr}%`],
    ["Est. monthly payment", formatUSD(monthlyPayment)],
    ["Est. total of payments", formatUSD(totalRepayment)],
  ];

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-navy-200 bg-white">
      {/* Document header */}
      <div className="border-b border-navy-100 bg-navy-50 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-star-600">
          Loan Agreement
        </p>
        <h2 className="mt-0.5 text-lg font-bold text-navy-900">
          Review &amp; sign your loan agreement
        </h2>
        <p className="mt-1 text-sm text-navy-600">
          Confirm the terms below, then sign electronically to continue your
          application.
        </p>
      </div>

      <div className="px-6 py-5">
        {/* Terms summary */}
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {terms.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-navy-50 py-1.5"
            >
              <dt className="text-sm text-navy-500">{label}</dt>
              <dd className="text-sm font-semibold text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs leading-relaxed text-navy-500">
          By signing, you agree to repay the principal plus interest at the
          fixed APR shown above in equal monthly installments over the stated
          term. You may prepay at any time without penalty. This agreement is
          governed by applicable federal and state law and you consent to the
          use of electronic records and signatures.
        </p>

        {/* ── E-Sign Consent gate ───────────────────────────────── */}
        {/* The E-Sign Consent Disclosure must be accepted before the borrower
            can view or sign the PDF contract. */}
        {!signed && (
          <label className="mt-5 flex items-start gap-2 rounded-xl border border-navy-200 bg-navy-50/60 px-4 py-3 text-sm text-navy-700">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={esignConsent}
              onChange={(e) => {
                setEsignConsent(e.target.checked);
                if (e.target.checked) setFormError(null);
              }}
              disabled={submitting}
            />
            <span>
              I have read and agree to the{" "}
              <Link
                href="/e-sign-consent"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-star-700 hover:underline"
              >
                Electronic Communications &amp; E-Sign Consent Disclosure
              </Link>
              , and I consent to receiving and signing my loan documents
              electronically.
            </span>
          </label>
        )}

        {/* Full PDF link — only available once E-Sign consent is accepted */}
        {!signed && !esignConsent ? (
          <p className="mt-3 text-sm text-navy-400">
            Accept the E-Sign Consent Disclosure above to view and sign your
            agreement.
          </p>
        ) : loadingAgreement ? (
          <p className="mt-3 text-sm text-navy-400">
            Preparing your agreement document…
          </p>
        ) : agreementError ? (
          <p className="mt-3 text-sm text-red-700">{agreementError}</p>
        ) : agreement ? (
          <a
            href={agreement.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-star-700 hover:underline"
          >
            📄 Open the full agreement (PDF)
          </a>
        ) : null}

        {/* ── Digital signature block ───────────────────────────── */}
        {signed ? (
          <SignedPanel name={signed.name || borrowerName} at={signed.at} />
        ) : !esignConsent ? null : (
          <form onSubmit={submit} className="mt-6">
            <p className="text-sm font-semibold text-navy-900">
              Your signature
            </p>
            {/* Live signature preview */}
            <div className="mt-2 flex h-24 items-end rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/40 px-5 pb-3">
              <span
                className="text-3xl text-navy-800"
                style={{ fontFamily: "cursive" }}
              >
                {fullName.trim() || (
                  <span className="text-base italic text-navy-300">
                    Your name will appear here as you type
                  </span>
                )}
              </span>
            </div>

            <div className="mt-4">
              <label htmlFor="sign-name" className="field-label">
                Full legal name
              </label>
              <input
                id="sign-name"
                className="field-input"
                placeholder="e.g. John A. Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                disabled={submitting}
              />
            </div>

            <label className="mt-4 flex items-start gap-2 text-sm text-navy-700">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={submitting}
              />
              <span>
                I have read and agree to the loan agreement, and I consent to
                signing it electronically. I understand my typed name is my
                legal signature.
              </span>
            </label>

            {formError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary mt-5 w-full px-5 py-2.5 text-sm sm:w-auto"
              disabled={submitting}
            >
              {submitting ? "Signing…" : "Sign agreement"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
