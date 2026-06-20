"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, API_BASE } from "@/lib/api";

export default function DocumentsContent() {
  const searchParams = useSearchParams();
  // Preferred secure flow: a single-use token from the email/SMS link. The
  // legacy ?application_id= link is still honoured for older messages.
  const token = searchParams.get("token");
  const legacyApplicationId = searchParams.get("application_id");

  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Resolved-from-token application id (kept separate from the legacy query id).
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [resolving, setResolving] = useState<boolean>(!!token);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Validate the token up front so we can show a clear error before the user
  // bothers selecting a file.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setResolving(true);
    api
      .resolveDocumentToken(token)
      .then((app) => {
        if (!cancelled) setResolvedId(app.application_id);
      })
      .catch(() => {
        if (!cancelled)
          setTokenError(
            "This document upload link is invalid or has expired. Please ask us to send a new one.",
          );
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  // What we display to the applicant and use for legacy uploads.
  const applicationId = resolvedId ?? legacyApplicationId;

  if (token && resolving) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-8 shadow-lg text-gray-600">
          Validating your secure link…
        </div>
      </div>
    );
  }

  if ((token && tokenError) || (!token && !legacyApplicationId)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-red-600">
            Invalid Document Request
          </h2>
          <p className="mt-2 text-gray-600">
            {tokenError ?? "Please use the link sent to your email or SMS."}
          </p>
        </div>
      </div>
    );
  }

  const handleUpload = async () => {
    if (!documentType) {
      alert("Please select a document type");
      return;
    }

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("document_type", documentType);
      formData.append("file_url", file);

      // Token uploads derive the application server-side; legacy uploads pass
      // the application id in the path.
      const url = token
        ? `${API_BASE}/documents/token/${encodeURIComponent(token)}/upload`
        : `${API_BASE}/documents/${encodeURIComponent(
            legacyApplicationId!,
          )}/upload`;

      const response = await fetch(url, { method: "POST", body: formData });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to upload document");
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
            Upload Successful
          </h2>
          <p className="mt-2 text-gray-600">
            Your document has been received and is under review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-[#fbbf23] p-8 text-white">
            <h1 className="text-3xl font-bold">Upload Document</h1>
            <p className="mt-2 text-gray-500">
              Application ID: {applicationId}
            </p>
          </div>

          <div className="space-y-6 p-8">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 focus:border-[#fbbf23] focus:outline-none"
              >
                <option value="">Select document type</option>
                <option value="ID">Government ID</option>
                <option value="PASSPORT">Passport</option>
                <option value="PAYSTUB">Pay Stub</option>
                <option value="BANK_STATEMENT">Bank Statement</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Upload File
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-[#fbbf23] p-3"
              />

              {file && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full rounded-xl bg-[#fbbf23] py-4 font-semibold text-black hover:bg-[#fbbf23] disabled:bg-[#fbbf23]"
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
