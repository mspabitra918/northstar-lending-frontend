// Conversational FAQ content, written to match natural-language queries for
// AEO. Reused both as visible <h2>/<h3> content and as FAQPage JSON-LD.

export const FAQS = [
  {
    question: 'How much can I borrow from Northstar Lending?',
    answer:
      'Northstar Lending offers unsecured personal loans from $2,000 to $10,000. You choose the exact amount during the application.',
  },
  {
    question: 'What is the interest rate on a Northstar personal loan?',
    answer:
      'Every Northstar personal loan has a fixed 10% Annual Percentage Rate (APR). The rate never changes for the life of the loan.',
  },
  {
    question: 'Are there any upfront or application fees?',
    answer:
      'No. There are $0 upfront fees — no application fee and no processing fee. You only repay your principal plus the fixed 10% APR.',
  },
  {
    question: 'Can I get a personal loan with bad credit?',
    answer:
      'Yes. Northstar Lending accepts all credit tiers and all loan purposes. Your credit score alone does not disqualify you.',
  },
  {
    question: 'Do I need collateral to qualify?',
    answer:
      'No. All Northstar personal loans are unsecured, so you never have to put up your car, home, or any other asset as collateral.',
  },
  {
    question: 'How fast will I receive my money?',
    answer:
      'Once your application is fully approved, funds are disbursed by ACH and typically arrive within 24 hours.',
  },
  {
    question: 'Is Northstar Lending available in my state?',
    answer:
      'Yes. Northstar Lending operates nationwide and serves applicants in all 50 states.',
  },
  {
    question: 'How do you keep my personal and banking information safe?',
    answer:
      'Your data is protected with AES-256 encryption at rest and TLS 1.3 in transit. Sensitive fields like your SSN and account numbers are encrypted at the field level, and bank verification is handled by a secure aggregator (Plaid) so we never store your online-banking password.',
  },
] as const;

// Customer testimonials for the Reviews & Trust page and homepage social proof.
export const TESTIMONIALS = [
  {
    name: 'Marcus T.',
    location: 'Houston, TX',
    rating: 5,
    quote:
      'Applied on a Tuesday night, money was in my account by Wednesday afternoon. No hidden fees, exactly the 10% they advertised.',
  },
  {
    name: 'Danielle R.',
    location: 'Los Angeles, CA',
    rating: 5,
    quote:
      'My credit isn’t great and every bank turned me down. Northstar actually approved me and the whole thing took minutes.',
  },
  {
    name: 'Priya S.',
    location: 'Columbus, OH',
    rating: 5,
    quote:
      'The status tracker kept me in the loop the entire time. I always knew exactly what stage my loan was in.',
  },
  {
    name: 'James W.',
    location: 'Tampa, FL',
    rating: 5,
    quote:
      'No collateral, no surprise charges. Connecting my bank through Plaid felt secure. Would use again.',
  },
  {
    name: 'Elena G.',
    location: 'Phoenix, AZ',
    rating: 5,
    quote:
      'I needed $4,000 fast for a car repair. The fixed rate meant I knew my exact payment up front. Refreshing honesty.',
  },
  {
    name: 'Tyrone B.',
    location: 'Atlanta, GA',
    rating: 4,
    quote:
      'Smooth process and quick funding. The phone verification call was painless and the rep was helpful.',
  },
] as const;

export const TRUST_SIGNALS = [
  { stat: '50', label: 'States served nationwide' },
  { stat: '24 hr', label: 'Typical funding time' },
  { stat: '$0', label: 'Upfront fees, ever' },
  { stat: '10%', label: 'Fixed APR — never changes' },
] as const;
