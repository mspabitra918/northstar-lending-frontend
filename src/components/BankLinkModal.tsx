"use client";

import { useEffect, useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { BRAND } from "@/lib/constants";
import { Lock } from "./icon/Lock";

// A custom, Northstar-branded bank-linking experience that mirrors the familiar
// aggregator flow (intro → pick bank → credentials → linking → success) WITHOUT
// using Plaid or any third-party SDK. The applicant's bank name and online-
// banking login are collected in our own UI and posted to the backend, which
// encrypts them at rest.

// Common US institutions surfaced first; the applicant can also search for /
// type any other bank name.
const POPULAR_BANKS = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "Capital One",
  "USAA",
  "PNC Bank",
  "U.S. Bank",
  "TD Bank",
  "Truist",
  "Navy Federal Credit Union",
  "American Express",
  "Discover",
  "Ally Bank",
  "Regions Bank",
  "Fifth Third Bank",
  "Charles Schwab",
  "SoFi",
];

type Step = "intro" | "select" | "credentials" | "sending" | "success";

export function BankLinkModal({
  applicationId,
  onClose,
  onComplete,
}: {
  // Public NS-YYYY-XXXXX id used to record the connection server-side.
  applicationId: string;
  onClose: () => void;
  onComplete: (institution: string) => void;
}) {
  const [step, setStep] = useState<Step>("intro");
  const [bank, setBank] = useState("");
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // While linking and on success the flow can't be abandoned mid-write.
  const dismissable = step !== "sending" && step !== "success";

  // Close on Escape (except during the uninterruptible steps) and lock the
  // background from scrolling while the sheet is open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && dismissable) onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [dismissable, onClose]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POPULAR_BANKS;
    return POPULAR_BANKS.filter((b) => b.toLowerCase().includes(q));
  }, [query]);

  // Allow linking a bank that isn't in our curated list.
  const customName = query.trim();
  const showCustom =
    customName.length > 1 &&
    !POPULAR_BANKS.some((b) => b.toLowerCase() === customName.toLowerCase());

  function chooseBank(name: string) {
    setBank(name);
    setError(null);
    setStep("credentials");
  }

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both your username and password.");
      return;
    }
    setError(null);
    setStep("sending");
    try {
      await api.connectBankManual({
        application_id: applicationId,
        institution_name: bank,
        username: username.trim(),
        password,
      });
      setStep("success");
    } catch (err) {
      // Drop the applicant back to the credentials step with a clear message.
      setError(
        err instanceof ApiError
          ? err.message
          : "We couldn’t link your bank just now. Please try again.",
      );
      setStep("credentials");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => dismissable && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Link your bank"
    >
      <div
        className="flex h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:h-[640px] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — Northstar branding (no third-party logos). */}
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy-900 text-star-400">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 6.9H22l-6 4.4 2.3 7.1L12 16.1 5.7 20.4 8 13.3 2 8.9h7.6z" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-navy-900">
              {BRAND.name}
            </span>
          </div>
          {dismissable && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-full text-navy-400 transition hover:bg-navy-50 hover:text-navy-700"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
          {step === "intro" && (
            <IntroStep onContinue={() => setStep("select")} />
          )}

          {step === "select" && (
            <SelectStep
              query={query}
              setQuery={setQuery}
              matches={matches}
              showCustom={showCustom}
              customName={customName}
              onChoose={chooseBank}
            />
          )}

          {step === "credentials" && (
            <CredentialsStep
              bank={bank}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={error}
              onBack={() => {
                setError(null);
                setStep("select");
              }}
              onSubmit={submitCredentials}
            />
          )}

          {step === "sending" && <SendingStep bank={bank} />}

          {step === "success" && (
            <SuccessStep bank={bank} onDone={() => onComplete(bank)} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Steps ─────────────────────────────────────────────────────────────── */

function IntroStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto mt-4 grid h-20 w-20 place-items-center rounded-2xl bg-navy-50">
        <span className="text-navy-900">
          <Lock />
        </span>
      </div>
      <h2 className="mt-6 text-center text-2xl font-bold text-navy-900">
        {BRAND.name} securely links your bank
      </h2>

      <ul className="mt-8 space-y-5">
        <li className="flex gap-3">
          <Check />
          <div>
            <p className="font-semibold text-navy-900">Secure</p>
            <p className="text-sm text-navy-600">
              Your bank data is transferred over an encrypted, bank-grade
              connection.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <Check />
          <div>
            <p className="font-semibold text-navy-900">Private</p>
            <p className="text-sm text-navy-600">
              We only use your details to verify this account for your loan —
              nothing more.
            </p>
          </div>
        </li>
      </ul>

      <div className="mt-auto pt-8">
        <p className="mb-4 text-center text-xs text-navy-500">
          By selecting “Continue,” you agree to our{" "}
          <a
            target="_blank"
            href="/privacy-policy"
            className="font-medium text-navy-700 underline"
          >
            Privacy Policy
          </a>
          .
        </p>
        <ModalButton onClick={onContinue}>Continue</ModalButton>
      </div>
    </div>
  );
}

function SelectStep({
  query,
  setQuery,
  matches,
  showCustom,
  customName,
  onChoose,
}: {
  query: string;
  setQuery: (v: string) => void;
  matches: string[];
  showCustom: boolean;
  customName: string;
  onChoose: (name: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <h2 className="text-xl font-bold text-navy-900">Select your bank</h2>
      <div className="relative mt-4">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
        </span>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your bank"
          className="field-input pl-10"
        />
      </div>

      <div className="-mx-1 mt-4 flex-1 overflow-y-auto">
        {matches.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => onChoose(b)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-navy-50"
          >
            <BankAvatar name={b} />
            <span className="font-medium text-navy-900">{b}</span>
          </button>
        ))}

        {showCustom && (
          <button
            type="button"
            onClick={() => onChoose(customName)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-navy-50"
          >
            <BankAvatar name={customName} />
            <span className="font-medium text-navy-900">
              Use “{customName}”
            </span>
          </button>
        )}

        {matches.length === 0 && !showCustom && (
          <p className="px-3 py-6 text-center text-sm text-navy-500">
            Type your bank’s name to continue.
          </p>
        )}
      </div>
    </div>
  );
}

function CredentialsStep({
  bank,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  onBack,
  onSubmit,
}: {
  bank: string;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  error: string | null;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      {/* Bank name shown in place of an institution logo. */}
      <div className="flex items-center gap-3">
        <BankAvatar name={bank} size="lg" />
        <div>
          <p className="text-lg font-semibold text-navy-900">{bank}</p>
          <p className="text-sm text-navy-500">Online banking</p>
        </div>
      </div>

      <h2 className="mt-7 text-xl font-bold text-navy-900">
        Enter your credentials
      </h2>

      <div className="mt-5 space-y-4">
        <div>
          <label className="field-label" htmlFor="bank-username">
            Username
          </label>
          <input
            id="bank-username"
            autoFocus
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="bank-password">
            Password
          </label>
          <div className="relative">
            <input
              id="bank-password"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="field-input pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-navy-500 hover:text-navy-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <p className="mt-5 flex items-center gap-2 text-xs text-navy-500">
        <Lock /> Your credentials are encrypted and used only to verify this
        account.
      </p>

      <div className="mt-auto space-y-3 pt-8">
        <ModalButton type="submit">Continue</ModalButton>
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-sm font-medium text-navy-500 hover:text-navy-800"
        >
          Choose a different bank
        </button>
      </div>
    </form>
  );
}

function SendingStep({ bank }: { bank: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-navy-100 border-t-navy-900" />
      <p className="mt-6 font-semibold text-navy-900">Sending credentials</p>
      <p className="mt-1 text-sm text-navy-500">
        Securely connecting to {bank}…
      </p>
    </div>
  );
}

function SuccessStep({ bank, onDone }: { bank: string; onDone: () => void }) {
  return (
    <div className="flex h-full flex-col items-center text-center">
      <div className="mx-auto mt-8 grid h-20 w-20 place-items-center rounded-full bg-green-50">
        <svg
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-bold text-navy-900">Success!</h2>
      <p className="mt-2 text-navy-600">
        Your {bank} account has been successfully linked to your application.
      </p>
      <div className="mt-auto w-full pt-8">
        <ModalButton onClick={onDone}>Done</ModalButton>
      </div>
    </div>
  );
}

/* ── Small shared pieces ───────────────────────────────────────────────── */

function ModalButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full rounded-xl bg-navy-900 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}

function Check() {
  return (
    <span className="mt-0.5 shrink-0 text-green-600">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

// Initials avatar — a neutral stand-in for a bank logo we don't license.
function BankAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "md" | "lg";
}) {
  const initials = name
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const dims = size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-sm";
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-navy-900 font-semibold text-star-300 ${dims}`}
    >
      {initials || "B"}
    </span>
  );
}
