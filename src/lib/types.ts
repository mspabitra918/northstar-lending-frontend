// Mirror of the backend's application status enum and the loan shape returned
// by GET /api/loans/applications/:application_id.

export type ApplicationStatus =
  | "APPLICATION_SUBMITTED"
  | "BANK_VERIFICATION_PENDING"
  | "PHONE_VERIFICATION_PENDING"
  | "SIGN_LOAN_AGREEMENT"
  | "VERIFICATION_DEPOSIT"
  | "FUNDED"
  | "DECLINED";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  AGENT = "AGENT",
}

export interface BankConnection {
  id: string;
  institution_name?: string | null;
  status?: string;
}

// Internal note an admin attaches to an application.
export interface AdminNote {
  id: string;
  note: string;
  admin_id?: string;
  createdAt?: string;
  created_at?: string;
}

// Audit-trail entry recorded for an application.
export interface AuditLog {
  id: string;
  action: string;
  ip_address?: string | null;
  createdAt?: string;
  created_at?: string;
  users: {
    first_name: string;
    last_name: string;
  };
}

export interface Loan {
  id: string; // internal UUID — needed for bank verification
  application_id: string; // public NS-YYYY-XXXXX
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  loan_amount: number;
  loan_term: number;
  status: ApplicationStatus;
  bank_verified: boolean;
  // Locked once a manager has Approved (FUNDED) or Declined (DECLINED) — the
  // decision is final and no further changes are accepted.
  is_locked?: boolean;
  decline_reason?: string | null;
  created_at?: string;
  bank_connections?: BankConnection[];
  // Loan agreement signing state (SIGN_LOAN_AGREEMENT step).
  agreement_generated_at?: string | null;
  agreement_signed_at?: string | null;
  agreement_signed_name?: string | null;
  createdAt: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  // Employment
  employment_status?: string;
  employer_name?: string;
  employer_phone?: string;
  monthly_income?: number | string;
  // Banking
  account_type?: string;
  account_age?: string;
  // Loan extras
  credit_tier?: string;
  consent_accepted?: boolean;
  // Reference
  reference_name?: string;
  reference_phone?: string;
  reference_relationship?: string;
  // Agreement extras
  agreement_signed_ip?: string | null;
  // Related records (included on the admin detail fetch)
  admin_notes?: AdminNote[];
  audit_logs?: AuditLog[];
  total: string;
  documents: [];
}

// Returned by GET /api/loans/applications/:id/agreement. null when no agreement
// has been generated yet.
export interface Agreement {
  url: string;
  generated_at?: string | null;
  signed: boolean;
  signed_at?: string | null;
  signed_name?: string | null;
}

// Payload sent to POST /api/loans/apply. Field names match the backend DTO.
// Note: ssn/account/routing arrive in the `*_encrypted` fields as plain text
// over TLS and are encrypted at rest server-side (see backend encryption.util).
export interface ApplyPayload {
  first_name: string;
  last_name: string;
  dob: string;
  ssn_encrypted: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  employment_status: string;
  employer_name: string;
  employer_phone?: string;
  monthly_income: number;
  account_type: string;
  routing_number_encrypted: string;
  account_number_encrypted: string;
  account_age: string;
  credit_tier: string;
  reference_name: string;
  reference_phone: string;
  reference_relationship: string;
  loan_amount: number;
  loan_term: number;
  status: ApplicationStatus;
  bank_verified: boolean;
  consent_accepted: boolean;
}
