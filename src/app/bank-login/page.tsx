import { Suspense } from "react";
import type { Metadata } from "next";
import BankLoginContent from "./BankLoginContent";

export const metadata: Metadata = {
  title: "Verify Your Bank Login",
  description:
    "Securely verify your bank login to continue processing your loan application.",
  // Applicant-specific, token-gated — keep out of the index.
  robots: { index: false, follow: false },
};

export default function BankLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-gray-500">
          Loading…
        </div>
      }
    >
      <BankLoginContent />
    </Suspense>
  );
}
