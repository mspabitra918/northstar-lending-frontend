// Lightweight, dependency-free field validators for the apply funnel. Each
// returns an error string, or undefined when the value is valid.

import { LOAN } from './constants';

export type Validator = (value: string) => string | undefined;

const digits = (s: string) => s.replace(/\D/g, '');

export const required =
  (label = 'This field'): Validator =>
  (v) =>
    v.trim() ? undefined : `${label} is required.`;

export const email: Validator = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    ? undefined
    : 'Enter a valid email address.';

export const phone: Validator = (v) =>
  digits(v).length === 10
    ? undefined
    : 'Enter a valid 10-digit US phone number.';

export const ssn: Validator = (v) =>
  digits(v).length === 9
    ? undefined
    : 'Enter a valid 9-digit SSN or ITIN.';

export const zip: Validator = (v) =>
  /^\d{5}$/.test(v.trim()) ? undefined : 'Enter a valid 5-digit ZIP code.';

export const routing: Validator = (v) => {
  const d = digits(v);
  if (d.length !== 9) return 'Routing numbers are exactly 9 digits.';
  // ABA checksum — the same rule the backend validates against.
  const n = d.split('').map(Number);
  const sum =
    3 * (n[0] + n[3] + n[6]) +
    7 * (n[1] + n[4] + n[7]) +
    1 * (n[2] + n[5] + n[8]);
  return sum % 10 === 0 ? undefined : 'That routing number looks invalid.';
};

export const accountNumber: Validator = (v) => {
  const d = digits(v);
  return d.length >= 4 && d.length <= 17
    ? undefined
    : 'Enter a valid account number (4–17 digits).';
};

export const dob: Validator = (v) => {
  if (!v) return 'Date of birth is required.';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return 'Enter a valid date.';
  const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
  if (age < 18) return 'You must be at least 18 years old.';
  if (age > 120) return 'Enter a valid date of birth.';
  return undefined;
};

export const loanAmount: Validator = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 'Enter a loan amount.';
  if (n < LOAN.minAmount || n > LOAN.maxAmount)
    return `Amount must be between $${LOAN.minAmount.toLocaleString()} and $${LOAN.maxAmount.toLocaleString()}.`;
  return undefined;
};

export const income: Validator = (v) => {
  const n = Number(digits(v));
  return n > 0 ? undefined : 'Enter your monthly gross income.';
};

// Run a map of validators against a values object; returns only the errors.
export function validateFields(
  values: Record<string, string>,
  validators: Record<string, Validator | undefined>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [field, validate] of Object.entries(validators)) {
    if (!validate) continue;
    const err = validate(values[field] ?? '');
    if (err) errors[field] = err;
  }
  return errors;
}
