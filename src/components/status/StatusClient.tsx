"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import {
  LIFECYCLE_STAGES,
  LOAN,
  STATUS_TO_STAGE_INDEX,
  formatUSD,
} from "@/lib/constants";
import type { Agreement, Loan } from "@/lib/types";
import { StatusResult } from "./StatusResult";

export function StatusClient() {
  const params = useSearchParams();
  const [ref, setRef] = useState(params.get("ref") ?? "");
  const [lastName, setLastName] = useState(params.get("last_name") ?? "");
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core lookup, shared by the form submit and the auto-lookup from email
  // links. The by-id endpoint keys on the Application ID; we confirm the last
  // name matches client-side before revealing anything.
  async function runLookup(refValue: string, lastNameValue: string) {
    setLoading(true);
    setError(null);
    setLoan(null);
    try {
      const application = await api.getApplicationByIdUser(refValue.trim());

      if (
        application.last_name?.toLowerCase().trim() !==
        lastNameValue.toLowerCase().trim()
      ) {
        setError(
          "We couldn’t match that Application ID and last name. Please check and try again.",
        );
        return;
      }
      setLoan(application);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 404
          ? "No application found with that ID. Double-check your Application ID."
          : "Something went wrong looking up your application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // When the applicant arrives from an email link carrying both ?ref= and
  // ?last_name= (e.g. the "Review & Sign Agreement" button), skip the lookup
  // form and take them straight to their status / sign page.
  useEffect(() => {
    const r = params.get("ref");
    const ln = params.get("last_name");
    if (r) setRef(r);
    if (ln) setLastName(ln);
    if (r && ln) {
      void runLookup(r, ln);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!ref.trim() || !lastName.trim()) {
      setError("Enter both your Application ID and last name.");
      return;
    }
    await runLookup(ref, lastName);
  }

  if (loan) {
    return (
      <StatusResult
        loan={loan}
        onReset={() => {
          setLoan(null);
          setLastName("");
        }}
      />
    );
  }

  // While a lookup is in flight (including the auto-lookup from an email link),
  // show a loading panel instead of flashing the form.
  if (loading) {
    return (
      <div className="mx-auto max-w-md">
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-star-200 border-t-star-500" />
          <p className="text-navy-600">Loading your application…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={lookup} className="card space-y-5 p-7">
        <div>
          <label htmlFor="ref" className="field-label">
            Application ID
          </label>
          <input
            id="ref"
            className="field-input"
            placeholder="NS-2026-XXXXX"
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="field-label">
            Last name
          </label>
          <input
            id="lastName"
            className="field-input"
            placeholder="As it appears on your application"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Looking up…" : "Check my status"}
        </button>
        <p className="text-center text-sm text-navy-500">
          Haven’t applied yet?{" "}
          <Link
            href="/apply"
            className="font-medium text-star-600 hover:underline"
          >
            Apply now
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
