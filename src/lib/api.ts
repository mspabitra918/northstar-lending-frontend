import type {
  Agreement,
  AdminNote,
  ApplicationStatus,
  ApplyPayload,
  Loan,
  ContactsPayload,
  Contact,
} from "./types";
import { getToken } from "./auth";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Admin endpoints are guarded by JWT; attach the bearer token when one is
  // present (client-side only — getToken returns null during SSR, which is
  // fine for the public endpoints rendered on the server).
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    // Status/lookup data must always be fresh.
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message)
          ? body.message.join(", ")
          : body.message;
      }
    } catch {
      /* non-JSON error body — keep the default message */
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

export const api = {
  async createContacts(payload: ContactsPayload) {
    const data = await request(`/api/contact/create`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  },
  // Submit a new loan application. Returns the created loan (with its public
  // application_id and internal UUID).
  async apply(payload: ApplyPayload): Promise<Loan> {
    const data = await request<{ message: string; loan: Loan }>(
      "/api/loans/apply",
      { method: "POST", body: JSON.stringify(payload) },
    );
    return data.loan;
  },

  async getApplication(query = ""): Promise<{
    applications: Loan[];
    total: number;
  }> {
    const data = await request<{
      loans: {
        applications: Loan[];
        total: number;
      };
    }>(`/api/loans/applications${query ? `?${query}` : ""}`);

    // if (!data.loans?.applications?.length) {
    //   throw new ApiError("Application not found", 404);
    // }

    return {
      applications: data.loans.applications,
      total: data.loans.total,
    };
  },

  // Look up a single application by its public NS-YYYY-XXXXX id.
  async getApplicationByIdUser(applicationId: string): Promise<Loan> {
    const data = await request<{ loan: Loan }>(
      `/api/loans/applications/${encodeURIComponent(applicationId)}/user`,
    );
    if (!data.loan) {
      throw new ApiError("Application not found", 404);
    }
    return data.loan;
  },
  async getApplicationByIdAdmin(applicationId: string): Promise<Loan> {
    const data = await request<{ loan: Loan }>(
      `/api/loans/applications/${encodeURIComponent(applicationId)}/admin`,
    );
    if (!data.loan) {
      throw new ApiError("Application not found", 404);
    }
    return data.loan;
  },

  // Fetch a short-lived signed URL + signing state for the loan agreement.
  // Returns null when no agreement has been generated yet.
  async getAgreement(applicationId: string): Promise<Agreement | null> {
    const data = await request<{ agreement: Agreement | null }>(
      `/api/loans/applications/${encodeURIComponent(applicationId)}/agreement`,
    );
    return data.agreement ?? null;
  },

  // Submit the applicant's typed-name e-signature for the loan agreement.
  async signAgreement(
    applicationId: string,
    fullName: string,
  ): Promise<{ signed: boolean; signed_at: string; signed_name: string }> {
    const data = await request<{
      result: { signed: boolean; signed_at: string; signed_name: string };
    }>(
      `/api/loans/applications/${encodeURIComponent(applicationId)}/sign-agreement`,
      {
        method: "POST",
        body: JSON.stringify({ full_name: fullName, agree: true }),
      },
    );
    return data.result;
  },

  // --- Plaid-backed bank verification ---
  async createPlaidLinkToken(userId: string): Promise<{ link_token: string }> {
    return request("/api/plaid/link-token", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  },

  // Record a verified bank connection after Plaid Link succeeds. application_id
  // here is the internal UUID, not the public NS id.
  async connectBank(input: {
    application_id: string;
    public_token: string;
    institution_name?: string;
  }): Promise<{ message: string }> {
    return request("/api/bank-connections", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async getBankStatus(applicationUuid: string): Promise<unknown> {
    return request(
      `/api/bank-connections/${encodeURIComponent(applicationUuid)}/status`,
    );
  },

  // --- Admin actions ---

  // Update an application's status. application_id is the public NS-YYYY-XXXXX
  // id; admin_id is the acting admin's UUID (recorded in the audit trail). The
  // backend emails the applicant the matching status-update notification.
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    adminId: string,
  ): Promise<Loan> {
    const data = await request<{ loan: Loan }>(
      `/api/loans/applications/${encodeURIComponent(applicationId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, admin_id: adminId }),
      },
    );
    return data.loan;
  },

  // Attach an internal admin note to an application.
  async addAdminNote(
    applicationId: string,
    note: string,
    adminId: string,
  ): Promise<AdminNote> {
    const data = await request<{ message: string; note: AdminNote }>(
      `/api/admin-notes/${encodeURIComponent(applicationId)}`,
      {
        method: "POST",
        body: JSON.stringify({
          note,
          admin_id: adminId,
          application_id: applicationId,
        }),
      },
    );
    return data.note;
  },

  // Record that the current admin viewed this application (audit trail). The
  // acting admin + IP are taken from the JWT/request server-side. Fire-and-
  // forget — a logging failure must never block the page.
  async logApplicationView(applicationId: string): Promise<void> {
    try {
      await request<void>(
        `/api/loans/applications/${encodeURIComponent(applicationId)}/view`,
        { method: "POST" },
      );
    } catch {
      /* view logging is best-effort */
    }
  },

  // Approve (fund) an application — manager-level only. Advances to FUNDED,
  // locks the record, and fires the approval notification.
  async approveApplication(applicationId: string): Promise<Loan> {
    const data = await request<{ loan: Loan }>(
      `/api/loans/applications/${encodeURIComponent(applicationId)}/approve`,
      { method: "POST" },
    );
    return data.loan;
  },

  // Decline an application — manager-level only. Permanently marks DECLINED,
  // locks the record, and triggers the adverse action notice.
  async declineApplication(
    applicationId: string,
    reason?: string,
  ): Promise<Loan> {
    const data = await request<{ loan: Loan }>(
      `/api/loans/applications/${encodeURIComponent(applicationId)}/decline`,
      {
        method: "POST",
        body: JSON.stringify({ reason: reason || undefined }),
      },
    );
    return data.loan;
  },

  // Collect Documents — send the applicant a secure upload link by email/SMS.
  async collectDocuments(
    applicationId: string,
    channel: "email" | "sms" | "both" = "email",
  ): Promise<{ sent: boolean; channel: string; expires_at: string }> {
    return request(
      `/api/loans/applications/${encodeURIComponent(applicationId)}/collect-documents`,
      {
        method: "POST",
        body: JSON.stringify({ channel }),
      },
    );
  },

  // Resolve a secure document-collection token to its application (public).
  async resolveDocumentToken(
    token: string,
  ): Promise<{ application_id: string; first_name: string }> {
    const data = await request<{
      application: { application_id: string; first_name: string };
    }>(`/api/loans/applications/document-token/${encodeURIComponent(token)}`);
    return data.application;
  },
};
