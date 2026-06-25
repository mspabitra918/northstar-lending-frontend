"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface Props {
  applicationId: string;
}

// Opens the applicant's uploaded document. The file lives in a private bucket,
// so we fetch a short-lived signed URL on demand and open it in a new tab.
export default function DocumentViewButton({ applicationId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleView() {
    setLoading(true);
    setError(null);
    try {
      const doc = await api.getDocumentUrl(applicationId);
      if (!doc?.url) {
        setError("No document on file.");
        return;
      }
      window.open(doc.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Couldn’t load the document. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleView}
        disabled={loading}
        className="text-blue-600 underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Opening…" : "View Document"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
