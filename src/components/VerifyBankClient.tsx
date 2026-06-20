"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { loadPlaid } from "@/lib/plaid";
import { BRAND } from "@/lib/constants";
import { Lock } from "./icon/Lock";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

type Phase = "idle" | "connecting" | "success" | "error";

export function VerifyBankClient() {
  const params = useSearchParams();
  const appUuid = params.get("id") ?? "";
  const ref = params.get("ref") ?? "";

  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Warn early if we somehow landed here without an application context.
  useEffect(() => {
    if (!appUuid) {
      setPhase("error");
      setMessage(
        "We couldn’t find your application reference. Please start from the application page.",
      );
    }
  }, [appUuid]);

  async function startVerification() {
    if (!appUuid) return;
    setPhase("connecting");
    setMessage(null);

    try {
      const { link_token } = await api.createPlaidLinkToken(appUuid);
      const Plaid = await loadPlaid();
      const handler = Plaid.create({
        token: link_token,
        onSuccess: async (publicToken, metadata) => {
          try {
            await api.connectBank({
              application_id: ref,
              public_token: publicToken,
              institution_name: metadata?.institution?.name,
            });
            setPhase("success");
          } catch (err) {
            setPhase("error");
            setMessage(
              err instanceof ApiError
                ? err.message
                : "We couldn’t save your bank connection. Please try again.",
            );
          }
        },
        onExit: () => {
          // User closed Plaid without finishing — return them to idle.
          setPhase("idle");
        },
      });
      handler.open();
    } catch (err) {
      setPhase("error");
      setMessage(
        err instanceof ApiError
          ? err.message
          : "Bank verification is temporarily unavailable. You can complete this step later from your status page.",
      );
    }
  }

  if (phase === "success") {
    return (
      <Card>
        <div className="text-center">
          <Badge tone="success">Bank verified</Badge>
          <h1 className="mt-5 text-3xl font-bold">You’re all set.</h1>
          <p className="mt-3 text-navy-600">
            Your bank account is verified and your application{" "}
            {ref && <span className="font-semibold text-navy-900">{ref}</span>}{" "}
            is moving forward. We’ll email and text you at each milestone.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={ref ? `/status?ref=${encodeURIComponent(ref)}` : "/status"}
              className="btn-primary"
            >
              View my loan status
            </Link>
            <Link href="/" className="btn-secondary">
              Back to home
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {ref && (
        <p className="mb-2 text-sm text-navy-500">
          Application <span className="font-semibold text-navy-900">{ref}</span>
        </p>
      )}
      <h1 className="text-3xl font-bold">Verify your bank account</h1>
      <p className="mt-3 text-navy-600 leading-relaxed">
        This is the fastest, most secure way to confirm your account and unlock
        24-hour funding. You’ll connect through <strong>Plaid</strong>, a
        regulated bank-aggregation service. {BRAND.name} never sees or stores
        your online-banking username or password.
      </p>

      <ul className="mt-6 space-y-3 text-sm text-navy-700">
        <li className="flex items-center gap-2">
          <Lock /> Credentials entered directly into Plaid — never our servers.
        </li>
        <li className="flex items-center gap-2">
          <Lock /> Read-only access to verify your account and routing details.
        </li>
        <li className="flex items-center gap-2">
          <Lock /> Bank-grade encryption end to end.
        </li>
      </ul>

      {message && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {message}
        </div>
      )}

      <button
        type="button"
        className="btn-primary mt-8 w-full"
        onClick={startVerification}
        disabled={phase === "connecting" || !appUuid}
      >
        {phase === "connecting"
          ? "Opening secure connection…"
          : "Connect my bank securely"}
      </button>

      <p className="mt-4 text-center text-sm text-navy-500">
        Prefer to do this later?{" "}
        <Link
          href={ref ? `/status?ref=${encodeURIComponent(ref)}` : "/status"}
          className="font-medium text-star-600 hover:underline"
        >
          Skip to my status page
        </Link>
        . We’ll remind you for the next 5 days.
      </p>
    </Card>
  );
}
