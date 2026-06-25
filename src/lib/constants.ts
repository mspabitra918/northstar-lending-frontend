// Central source of truth for the business rules from the brief. Keeping these
// in one place means the marketing copy, JSON-LD schema, and form validation
// never drift apart.

export const BRAND = {
  name: "Northstar Lending",
  legalName: "Northstar Lending, LLC",
  domain: "northstarlend.com",
  tagline: "Modern personal loans, funded in 24 hours.",
  phone: "(747) 208-0334",
  email: "support@northstarlend.com",
  address: {
    street: "633 W 5th St",
    city: "Los Angeles",
    region: "CA",
    postalCode: "90071",
    country: "US",
  },
  geo: { lat: 34.0509, lng: -118.2551 },
} as const;

export const LOAN = {
  minAmount: 2000,
  maxAmount: 10000,
  apr: 10, // % fixed APR
  collateral: false,
  upfrontFees: 0,
  fundingHours: 24,
  // Available term lengths in months.
  terms: [12, 24, 36],
} as const;

// The five sequential milestones a user can see on their status page, in order.
// DECLINED is a terminal off-ramp handled separately.
export const LIFECYCLE_STAGES = [
  {
    key: "APPLICATION_SUBMITTED",
    label: "Application Submitted",
    blurb:
      "Your details are safely stored. Next, connect your bank to verify your account.",
  },
  {
    key: "PHONE_VERIFICATION_PENDING",
    label: "Phone Verification",
    blurb: "A loan specialist will confirm a few details with you by phone.",
  },
  {
    key: "SIGN_LOAN_AGREEMENT",
    label: "Sign Agreement",
    blurb: "Review and e-sign your loan agreement from this portal.",
  },
  {
    key: "VERIFICATION_DEPOSIT",
    label: "Verification Deposit",
    blurb:
      "A small micro-deposit confirms your routing details before funding.",
  },
  {
    key: "FUNDED",
    label: "Funded",
    blurb: "Your funds are on the way — typically within 24 hours via ACH.",
  },
] as const;

// BANK_VERIFICATION_PENDING is a real backend status but is treated as part of
// the first milestone from the user's point of view (it just means "go verify").
export const STATUS_TO_STAGE_INDEX: Record<string, number> = {
  APPLICATION_SUBMITTED: 0,
  BANK_VERIFICATION_PENDING: 0,
  PHONE_VERIFICATION_PENDING: 1,
  SIGN_LOAN_AGREEMENT: 2,
  VERIFICATION_DEPOSIT: 3,
  FUNDED: 4,
  DECLINED: -1,
};

export const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/reviews", label: "Reviews & Trust" },
  { href: "/status", label: "Loan Status" },
  { href: "/contact", label: "Contact" },
] as const;

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
