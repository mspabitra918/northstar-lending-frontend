import { APP_TIME_ZONE } from "./datetime";

// Day of the month every installment is due. Business rule: regardless of which
// day (1–31) the loan is taken, the first installment falls on the 10th of the
// FOLLOWING month, and every subsequent installment on the 10th thereafter.
export const PAYMENT_DUE_DAY = 10;

export interface LoanSummary {
  principal: number;
  termMonths: number;
  aprPct: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  firstPaymentDate: Date;
  lastPaymentDate: Date;
}

// Standard fixed-rate amortized monthly payment:
//   M = P · r / (1 − (1 + r)^−n),  where r = monthly rate, n = term in months.
// Falls back to straight-line (P / n) for a 0% APR to avoid a divide-by-zero.
export function monthlyPayment(
  principal: number,
  aprPct: number,
  termMonths: number,
): number {
  if (termMonths <= 0) return 0;
  const r = aprPct / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -termMonths));
}

// First installment = the 10th of the month AFTER `from`. Taking the loan on
// June 25 → first payment July 10; the last payment is (termMonths − 1) months
// later, also on the 10th. Built from Pacific-time calendar parts so the due
// day never drifts across time zones.
export function firstPaymentDate(from: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "numeric",
  }).formatToParts(from);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value); // 1–12
  // month is 1-based here; `new Date(year, month, day)` uses 0-based months, so
  // passing `month` (not month−1) already advances to the next calendar month.
  // Built at local noon so formatting (local components) can never slip to the
  // 9th/11th across a midnight time-zone boundary.
  return new Date(year, month, PAYMENT_DUE_DAY, 12, 0, 0);
}

export function lastPaymentDate(
  termMonths: number,
  from: Date = new Date(),
): Date {
  const first = firstPaymentDate(from);
  return new Date(
    first.getFullYear(),
    first.getMonth() + Math.max(termMonths - 1, 0),
    PAYMENT_DUE_DAY,
    12,
    0,
    0,
  );
}

// Full repayment preview for the requested amount/term at the given fixed APR.
export function computeLoanSummary(
  principal: number,
  termMonths: number,
  aprPct: number,
  from: Date = new Date(),
): LoanSummary {
  const monthly = monthlyPayment(principal, aprPct, termMonths);
  const totalPayment = monthly * termMonths;
  return {
    principal,
    termMonths,
    aprPct,
    monthlyPayment: monthly,
    totalPayment,
    totalInterest: Math.max(totalPayment - principal, 0),
    firstPaymentDate: firstPaymentDate(from),
    lastPaymentDate: lastPaymentDate(termMonths, from),
  };
}

// Currency with cents — installment amounts need the precision that the
// whole-dollar `formatUSD` helper deliberately drops.
export function formatUSDCents(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPaymentDate(date: Date): string {
  // Format with the date's own local components (it was built at local noon) so
  // the calendar day stays exactly as computed.
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
