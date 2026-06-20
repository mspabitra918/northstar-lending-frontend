import { Suspense } from "react";
import type { Metadata } from "next";
import { StatusClient } from "@/components/status/StatusClient";

export const metadata: Metadata = {
  title: "Check Your Loan Status",
  description:
    "Track your Northstar Lending application in real time. Enter your Application ID and last name to see your current loan lifecycle stage.",
  alternates: { canonical: "/status" },
};

export default function StatusPage() {
  return (
    <section className="container-x py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Track your loan</h1>
        <p className="mx-auto mt-3 max-w-lg text-lg text-navy-600">
          Enter your Application ID and last name to see exactly where your loan
          is in the 5-stage process.
        </p>
      </div>
      <Suspense
        fallback={<div className="text-center text-navy-400">Loading…</div>}
      >
        <StatusClient />
      </Suspense>
    </section>
  );
}
