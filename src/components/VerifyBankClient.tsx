"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Lock } from "./icon/Lock";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { BankLinkModal } from "./BankLinkModal";

type Phase = "idle" | "connecting" | "success" | "error";

export function VerifyBankClient() {
  const params = useSearchParams();
  const appUuid = params.get("id") ?? "";
  const ref = params.get("ref") ?? "";

  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Warn early if we somehow landed here without an application context.
  useEffect(() => {
    if (!appUuid) {
      setPhase("error");
      setMessage(
        "We couldn’t find your application reference. Please start from the application page.",
      );
    }
  }, [appUuid]);

  // The application id used to record the connection is the public NS id (ref),
  // matching the backend bank-connection keying.
  const connectionId = ref || appUuid;

  async function startVerification() {
    if (!appUuid) return;

    setMessage(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setModalOpen(true);
    }, 3000);
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
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-lg">
            <div className="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            {/* <p className="text-gray-700 font-medium">Connecting securely...</p> */}
          </div>
        </div>
      )}
      <Card>
        {ref && (
          <p className="mb-2 text-sm text-navy-500">
            Application{" "}
            <span className="font-semibold text-navy-900">{ref}</span>
          </p>
        )}
        <h1 className="text-3xl font-bold">Verify your bank account</h1>
        <p className="mt-3 text-navy-600 leading-relaxed">
          This is the fastest, most secure way to confirm your account and
          unlock 24-hour funding. You’ll link your bank through {BRAND.name}’s
          secure, bank-grade connection — your details are encrypted end to end.
        </p>

        <ul className="mt-6 space-y-3 text-sm text-navy-700">
          <li className="flex items-center gap-2">
            <Lock /> Your credentials are encrypted the moment you submit them.
          </li>
          <li className="flex items-center gap-2">
            <Lock /> Used only to verify your account and routing details.
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
          disabled={!appUuid}
        >
          Connect my bank securely
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

        {modalOpen && (
          <BankLinkModal
            applicationId={connectionId}
            onClose={() => setModalOpen(false)}
            onComplete={() => {
              setModalOpen(false);
              setPhase("success");
            }}
          />
        )}
      </Card>
    </>
  );
}
