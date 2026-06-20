# Northstar Lending — Frontend

Next.js 14 (App Router) marketing site + application funnel for Northstar
Lending. Server-rendered for SEO/AEO, styled with Tailwind, and wired to the
NestJS backend.

## Stack

- **Next.js 14** (App Router, RSC) — SSR for indexability + Core Web Vitals
- **TypeScript**, **Tailwind CSS**
- JSON-LD structured data: `FinancialProduct` + `LoanOrCredit`,
  `FinancialService` (LocalBusiness), `FAQPage`, `BreadcrumbList`, `Review`

## Pages

| Route            | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `/`              | Home — value props, rate card, social proof, FAQ               |
| `/how-it-works`  | 5-step application flow + 5-stage loan lifecycle               |
| `/reviews`       | Verified testimonials, aggregate rating, "Trust Corners"       |
| `/apply`         | 5-step application funnel with real-time validation + consents |
| `/verify-bank`   | Plaid-backed bank verification (post-submission)               |
| `/status`        | Loan status tracker (Application ID + last name)               |

## Setup

```bash
npm install
cp .env.local .env.local   # already present; adjust if needed
npm run dev                # http://localhost:3000
```

### Environment

| Var                        | Default                  | Notes                                  |
| -------------------------- | ------------------------ | -------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000`  | NestJS backend origin                  |
| `NEXT_PUBLIC_SITE_URL`     | `https://northstarlend.com` | Canonical origin for SEO + JSON-LD  |

The backend must allow this origin via CORS (`FRONTEND_ORIGIN`, defaults to
`http://localhost:3000`).

## Backend integration

- `POST /api/loans/apply` — submit application → returns `loan.id` (UUID) +
  `loan.application_id` (`NS-YYYY-XXXXX`)
- `GET /api/loans/applications/:application_id` — status lookup
- `POST /plaid/link-token`, `POST /bank-connections` — bank verification

All sensitive fields (SSN, account/routing numbers) are sent over TLS and
encrypted at rest server-side. Online-banking credentials are entered directly
into Plaid Link and never touch this app or the backend.

## Scripts

- `npm run dev` — dev server (port 3000)
- `npm run build` / `npm start` — production
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint`
