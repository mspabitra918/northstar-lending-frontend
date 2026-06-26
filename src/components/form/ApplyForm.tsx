"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, SelectField, RadioCards, CheckboxField } from "./fields";
import { AddressAutocomplete } from "./AddressAutocomplete";
import type { SelectedAddress } from "./AddressAutocomplete";
import { api, ApiError } from "@/lib/api";
import { LOAN, BRAND, formatUSD } from "@/lib/constants";
import {
  computeLoanSummary,
  formatUSDCents,
  formatPaymentDate,
} from "@/lib/loanMath";
import * as v from "@/lib/validation";
import type { ApplyPayload } from "@/lib/types";

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];
const STEPS = ["Personal", "Employment", "Banking", "References", "Consents"];

type Values = Record<string, string>;

const INITIAL: Values = {
  loan_amount: "",
  loan_term: "",
  first_name: "",
  last_name: "",
  dob: "",
  ssn: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  employment_status: "",
  monthly_income: "",
  employer_name: "",
  employer_phone: "",
  account_type: "",
  routing_number: "",
  account_number: "",
  account_age: "",
  credit_tier: "",
  reference_name: "",
  reference_phone: "",
  reference_relationship: "",
};

export function ApplyForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(INITIAL);
  const [consentCredit, setConsentCredit] = useState(false);
  const [consentTcpa, setConsentTcpa] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // const setField = (name: string, value: string) => {
  //   setValues((prev) => ({ ...prev, [name]: value }));
  //   if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  // };

  const MAX_LOAN_AMOUNT = 10000;

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (name === "loan_amount") {
      const amount = Number(value.replace(/,/g, ""));

      if (amount > MAX_LOAN_AMOUNT) {
        setErrors((prev) => ({
          ...prev,
          loan_amount: `Loan amount cannot exceed ${formatUSD(MAX_LOAN_AMOUNT)}.`,
        }));
        return;
      }
    }

    // Clear the error when the value becomes valid
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Fill the address fields from a selected Google Places suggestion.
  const handleAddressSelect = (addr: SelectedAddress) => {
    setValues((prev) => ({
      ...prev,
      address: addr.streetAddress,
      city: addr.city,
      state: addr.state,
      zip_code: addr.zipCode,
    }));
    setErrors((e) => ({
      ...e,
      address: "",
      city: "",
      state: "",
      zip_code: "",
    }));
  };

  function validateStep(current: number): Record<string, string> {
    const employed = values.employment_status === "Employed";
    const maps: Record<number, Record<string, v.Validator | undefined>> = {
      0: {
        loan_amount: v.loanAmount,
        first_name: v.required("First name"),
        last_name: v.required("Last name"),
        dob: v.dob,
        ssn: v.ssn,
        email: v.email,
        phone: v.phone,
        address: v.required("Street address"),
        city: v.required("City"),
        state: v.required("State"),
        zip_code: v.zip,
      },
      1: {
        employment_status: v.required("Employment status"),
        monthly_income: v.income,
        employer_name: employed ? v.required("Employer name") : undefined,
        employer_phone: employed ? v.phone : undefined,
      },
      2: {
        account_type: v.required("Account type"),
        routing_number: v.routing,
        account_number: v.accountNumber,
        account_age: v.required("Account age"),
        credit_tier: v.required("Credit tier"),
      },
      3: {
        reference_name: v.required("Reference name"),
        reference_phone: v.phone,
        reference_relationship: v.required("Relationship"),
      },
      4: {},
    };
    return v.validateFields(values, maps[current]);
  }

  function next() {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    const consentErrors: Record<string, string> = {};
    if (!consentCredit)
      consentErrors.consent_credit = "Required to process your application.";
    if (!consentTcpa) consentErrors.consent_tcpa = "Required to continue.";
    if (Object.keys(consentErrors).length) {
      setErrors(consentErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload: ApplyPayload = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      dob: values.dob,
      ssn_encrypted: values.ssn.replace(/\D/g, ""),
      email: values.email.trim(),
      phone: values.phone.replace(/\D/g, ""),
      address: values.address.trim(),
      city: values.city.trim(),
      state: values.state,
      zip_code: values.zip_code.trim(),
      employment_status: values.employment_status,
      employer_name: values.employer_name.trim(),
      employer_phone: values.employer_phone.replace(/\D/g, ""),
      monthly_income: Number(values.monthly_income.replace(/\D/g, "")),
      account_type: values.account_type,
      routing_number_encrypted: values.routing_number.replace(/\D/g, ""),
      account_number_encrypted: values.account_number.replace(/\D/g, ""),
      account_age: values.account_age,
      credit_tier: values.credit_tier,
      reference_name: values.reference_name.trim(),
      reference_phone: values.reference_phone.replace(/\D/g, ""),
      reference_relationship: values.reference_relationship,
      loan_amount: Number(values.loan_amount),
      loan_term: Number(values.loan_term),
      status: "APPLICATION_SUBMITTED",
      bank_verified: false,
      consent_accepted: consentCredit && consentTcpa,
    };

    try {
      const loan = await api.apply(payload);
      // Hand off to bank verification. Pass the internal UUID (needed by the
      // bank-connections endpoint) and the public reference id for display.
      const params = new URLSearchParams({
        id: loan.id,
        ref: loan.application_id,
        name: loan.last_name,
      });
      router.push(`/verify-bank?${params.toString()}`);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong submitting your application. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
      <div className="card p-6 sm:p-8">
        <Stepper step={step} />

        <div className="mt-8">
          {step === 0 && (
            <StepPersonal
              values={values}
              errors={errors}
              set={setField}
              onAddressSelect={handleAddressSelect}
            />
          )}
          {step === 1 && (
            <StepEmployment values={values} errors={errors} set={setField} />
          )}
          {step === 2 && (
            <StepBanking values={values} errors={errors} set={setField} />
          )}
          {step === 3 && (
            <StepReferences values={values} errors={errors} set={setField} />
          )}
          {step === 4 && (
            <StepConsents
              values={values}
              consentCredit={consentCredit}
              consentTcpa={consentTcpa}
              setConsentCredit={(c) => {
                setConsentCredit(c);
                setErrors((e) => ({ ...e, consent_credit: "" }));
              }}
              setConsentTcpa={(c) => {
                setConsentTcpa(c);
                setErrors((e) => ({ ...e, consent_tcpa: "" }));
              }}
              errors={errors}
            />
          )}
        </div>

        {submitError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={back}
              disabled={submitting}
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn-primary" onClick={next}>
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          )}
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <p className="text-sm font-medium text-navy-500">You’re requesting</p>
          <p className="mt-1 text-3xl font-bold text-navy-900">
            {formatUSD(Number(values.loan_amount) || 0)}
          </p>
          <p className="mt-1 text-sm text-navy-500">
            over {values.loan_term} months · {LOAN.apr}% fixed APR
          </p>
          <ul className="mt-4 space-y-2 text-sm text-navy-600">
            <li className="flex items-center gap-2">
              <Check /> No collateral required
            </li>
            <li className="flex items-center gap-2">
              <Check /> {formatUSD(0)} upfront fees
            </li>
            <li className="flex items-center gap-2">
              <Check /> Funded within {LOAN.fundingHours} hours
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-navy-100 bg-navy-50 p-5 text-sm text-navy-600">
          <p className="font-medium text-navy-800">🔒 Your data is protected</p>
          <p className="mt-1.5 leading-relaxed">
            Submitted over TLS 1.3 and encrypted at rest with AES-256. We never
            store your online-banking password.
          </p>
        </div>
        <p className="px-1 text-xs text-navy-400">
          Already applied?{" "}
          <Link
            href="/status"
            className="font-medium text-star-600 hover:underline"
          >
            Check your status
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}

/* ---------- Steps ---------- */

interface StepProps {
  values: Values;
  errors: Record<string, string>;
  set: (name: string, value: string) => void;
}

function StepPersonal({
  values,
  errors,
  set,
  onAddressSelect,
}: StepProps & {
  onAddressSelect: (address: SelectedAddress) => void;
}) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="Tell us about you"
        sub="Step 1 of 5 — Personal details"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Loan amount (USD)"
          name="loan_amount"
          type="text"
          value={values.loan_amount}
          error={errors.loan_amount}
          onChange={set}
          placeholder="Your Amount"
          hint={`${formatUSD(LOAN.minAmount)}–${formatUSD(LOAN.maxAmount)}`}
        />
        <SelectField
          label="Repayment term"
          name="loan_term"
          value={values.loan_term}
          error={errors.loan_term}
          onChange={set}
          placeholder="Your Select Term"
          options={LOAN.terms.map((t) => ({
            value: String(t),
            label: `${t} months`,
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Legal first name"
          name="first_name"
          value={values.first_name}
          error={errors.first_name}
          onChange={set}
          autoComplete="given-name"
          placeholder="Your First name"
        />
        <TextField
          label="Legal last name"
          name="last_name"
          value={values.last_name}
          error={errors.last_name}
          onChange={set}
          placeholder="Your Last name"
          autoComplete="family-name"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Date of birth"
          name="dob"
          type="text"
          value={values.dob}
          error={errors.dob}
          onChange={(_, value) => {
            const digits = value.replace(/\D/g, "").slice(0, 8);
            let formatted = digits;
            if (digits.length > 4) {
              formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
            } else if (digits.length > 2) {
              formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
            }
            set("dob", formatted);
          }}
          autoComplete="bday"
          placeholder="Your Date of Birth"
        />
        <TextField
          label="SSN or ITIN"
          name="ssn"
          value={values.ssn}
          error={errors.ssn}
          onChange={(_, value) => {
            const digits = value.replace(/\D/g, "").slice(0, 9);
            let formatted = digits;
            if (digits.length > 5) {
              formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
            } else if (digits.length > 3) {
              formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
            }
            set("ssn", formatted);
          }}
          inputMode="numeric"
          placeholder="Your SSN or ITIN"
          hint="Encrypted at the field level."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={set}
          placeholder="Your Email Address"
          autoComplete="email"
        />
        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          value={values.phone}
          error={errors.phone}
          inputMode="tel"
          autoComplete="tel"
          placeholder="Your Phone Number"
          onChange={(_, value) => {
            const digits = value.replace(/\D/g, "").slice(0, 10);

            let formatted = digits;

            if (digits.length > 6) {
              formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            } else if (digits.length > 3) {
              formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
            } else if (digits.length > 0) {
              formatted = `(${digits}`;
            }

            set("phone", formatted);
          }}
        />
      </div>
      <AddressAutocomplete
        value={values.address}
        error={errors.address}
        onChange={(value) => set("address", value)}
        onSelect={onAddressSelect}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="City"
          name="city"
          value={values.city}
          error={errors.city}
          onChange={set}
          placeholder="Your City"
          autoComplete="address-level2"
        />
        <SelectField
          label="State"
          name="state"
          placeholder="Your State"
          value={values.state}
          error={errors.state}
          onChange={set}
          options={US_STATES}
        />
        <TextField
          label="ZIP code"
          name="zip_code"
          value={values.zip_code}
          error={errors.zip_code}
          onChange={set}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="Your ZIP Code"
        />
      </div>
    </div>
  );
}

function StepEmployment({ values, errors, set }: StepProps) {
  const employed = values.employment_status === "Employed";
  return (
    <div className="space-y-6">
      <StepHeading
        title="Your employment & income"
        sub="Step 2 of 5 — Employment details"
      />
      <SelectField
        label="Employment status"
        name="employment_status"
        placeholder="Your Employment Status"
        value={values.employment_status}
        error={errors.employment_status}
        onChange={set}
        options={[
          { value: "Employed", label: "Employed" },
          { value: "Self-Employed", label: "Self-employed" },
          { value: "Unemployed", label: "Unemployed" },
          { value: "Retired", label: "Retired" },
          { value: "Student", label: "Student" },
        ]}
      />
      <TextField
        label="Monthly gross income (USD)"
        name="monthly_income"
        value={values.monthly_income}
        error={errors.monthly_income}
        onChange={set}
        inputMode="numeric"
        placeholder="Your Monthly Gross Income (USD) "
      />
      {employed && (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Employer name"
            name="employer_name"
            value={values.employer_name}
            error={errors.employer_name}
            onChange={set}
            placeholder="Your Employer Name"
          />
          <TextField
            label="Employer phone"
            placeholder="Your Employer Phone Number"
            name="employer_phone"
            type="tel"
            value={values.employer_phone}
            error={errors.employer_phone}
            onChange={(_, value) => {
              const digits = value.replace(/\D/g, "").slice(0, 10);

              let formatted = digits;

              if (digits.length > 6) {
                formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
              } else if (digits.length > 3) {
                formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
              } else if (digits.length > 0) {
                formatted = `(${digits}`;
              }

              set("employer_phone", formatted);
            }}
            inputMode="tel"
          />
        </div>
      )}
    </div>
  );
}

function StepBanking({ values, errors, set }: StepProps) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="Banking details"
        sub="Step 3 of 5 — Where funds will be deposited"
      />
      <RadioCards
        label="Account type"
        name="account_type"
        value={values.account_type}
        error={errors.account_type}
        onChange={set}
        options={[
          { value: "Checking", label: "Checking" },
          { value: "Savings", label: "Savings" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Routing number"
          placeholder="Your Routing Number"
          name="routing_number"
          value={values.routing_number}
          error={errors.routing_number}
          onChange={set}
          inputMode="numeric"
          hint="9 digits — validated against the Federal Reserve."
        />
        <TextField
          label="Account number"
          placeholder="Your Account Number"
          name="account_number"
          value={values.account_number}
          error={errors.account_number}
          onChange={set}
          inputMode="numeric"
          hint="Encrypted at the field level."
        />
      </div>
      <RadioCards
        label="How long have you had this account?"
        name="account_age"
        value={values.account_age}
        error={errors.account_age}
        onChange={set}
        options={[
          { value: "<6 months", label: "Under 6 months" },
          { value: "6-12 months", label: "6–12 months" },
          { value: "1+ years", label: "1+ years" },
        ]}
      />
      <SelectField
        label="Self-reported credit tier"
        name="credit_tier"
        placeholder="Your Self-reported Credit Tier"
        value={values.credit_tier}
        error={errors.credit_tier}
        onChange={set}
        options={[
          { value: "Excellent", label: "Excellent (720+)" },
          { value: "Good", label: "Good (660–719)" },
          { value: "Fair", label: "Fair (600–659)" },
          { value: "Poor", label: "Poor (below 600)" },
          { value: "Unknown", label: "I’m not sure" },
        ]}
      />
    </div>
  );
}

function StepReferences({ values, errors, set }: StepProps) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="One personal reference"
        sub="Step 4 of 5 — Someone who knows you"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Reference full name"
          placeholder="Enter reference's full name"
          name="reference_name"
          value={values.reference_name}
          error={errors.reference_name}
          onChange={set}
        />
        <TextField
          label="Reference phone"
          placeholder="Enter reference's phone number"
          name="reference_phone"
          type="tel"
          value={values.reference_phone || ""}
          error={errors.reference_phone}
          onChange={(_, value) => {
            const digits = value.replace(/\D/g, "").slice(0, 10);

            let formatted = digits;

            if (digits.length > 6) {
              formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            } else if (digits.length > 3) {
              formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
            } else if (digits.length > 0) {
              formatted = `(${digits}`;
            }

            set("reference_phone", formatted);
          }}
          inputMode="tel"
        />
        {/* <TextField
          label="Reference phone"
          name="reference_phone"
          type="tel"
          value={values.reference_phone}
          error={errors.reference_phone}
          inputMode="tel"
          autoComplete="tel"
          onChange={set}
        /> */}
      </div>
      <SelectField
        label="Relationship to you"
        placeholder="Select your relationship"
        name="reference_relationship"
        value={values.reference_relationship}
        error={errors.reference_relationship}
        onChange={set}
        options={[
          "Parent",
          "Sibling",
          "Spouse",
          "Friend",
          "Coworker",
          "Other",
        ].map((r) => ({ value: r, label: r }))}
      />
    </div>
  );
}

function StepConsents({
  values,
  consentCredit,
  consentTcpa,
  setConsentCredit,
  setConsentTcpa,
  errors,
}: {
  values: Values;
  consentCredit: boolean;
  consentTcpa: boolean;
  setConsentCredit: (c: boolean) => void;
  setConsentTcpa: (c: boolean) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="Review & consent"
        sub="Step 5 of 5 — Required authorizations"
      />
      <LoanSummaryCard
        amount={Number(values.loan_amount) || 0}
        term={Number(values.loan_term) || 0}
      />
      <div className="space-y-5 rounded-2xl border border-navy-100 bg-navy-50 p-5">
        <CheckboxField
          name="consent_credit"
          checked={consentCredit}
          error={errors.consent_credit}
          onChange={(_, c) => setConsentCredit(c)}
        >
          I authorize {BRAND.name} to obtain a credit assessment and verify the
          information I have provided in order to evaluate my application, and I
          acknowledge that my information will be handled in accordance with the{" "}
          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-star-600 hover:underline"
          >
            Privacy Policy
          </Link>
          . I understand all credit tiers are considered.
        </CheckboxField>

        <CheckboxField
          name="consent_tcpa"
          checked={consentTcpa}
          error={errors.consent_tcpa}
          onChange={(_, c) => setConsentTcpa(c)}
        >
          By checking this box and clicking <strong>"Submit"</strong>, I provide
          my express written consent to receive transactional and promotional
          communications from {BRAND.name} and its affiliates via automatic
          telephone dialing systems, artificial or prerecorded voice messages,
          SMS text messages, and emails at the phone number and email address
          provided. I understand that my consent is not a condition of
          purchasing any property, goods, or services, and that I may revoke
          this consent at any time by replying <strong>"STOP"</strong> to text
          messages or contacting support. Standard message and data rates may
          apply.
        </CheckboxField>
      </div>
      <p className="text-xs leading-relaxed text-navy-400">
        By submitting, you confirm the information provided is accurate. Your
        data is transmitted over TLS 1.3 and encrypted at rest. After
        submitting, you’ll be guided to securely verify your bank account.
      </p>
    </div>
  );
}

/* ---------- bits ---------- */

// Repayment preview shown on the final review step so the borrower sees exactly
// what they'll owe — monthly payment, total interest, and the first/last due
// dates — before submitting. Hidden until a valid amount + term are chosen.
function LoanSummaryCard({ amount, term }: { amount: number; term: number }) {
  if (!amount || !term) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-white p-5 text-sm text-navy-500">
        Choose a loan amount and term in Step 1 to see your repayment summary.
      </div>
    );
  }

  const summary = computeLoanSummary(amount, term, LOAN.apr);

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
      <div className="border-b border-navy-100 bg-navy-50 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-star-600">
          Your repayment summary
        </p>
        <p className="mt-1 text-3xl font-bold text-navy-900">
          {formatUSDCents(summary.monthlyPayment)}
          <span className="ml-1 text-base font-medium text-navy-500">
            / month
          </span>
        </p>
        <p className="mt-1 text-sm text-navy-500">
          {term} monthly payments · {LOAN.apr}% fixed APR
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 p-5 text-sm">
        <SummaryItem label="Loan amount" value={formatUSD(summary.principal)} />
        <SummaryItem label="Loan term" value={`${term} months`} />
        <SummaryItem
          label="Total interest"
          value={formatUSDCents(summary.totalInterest)}
        />
        <SummaryItem
          label="Total to repay"
          value={formatUSDCents(summary.totalPayment)}
        />
        <SummaryItem
          label="First payment"
          value={formatPaymentDate(summary.firstPaymentDate)}
        />
        <SummaryItem
          label="Final payment"
          value={formatPaymentDate(summary.lastPaymentDate)}
        />
      </dl>
      <p className="border-t border-navy-100 px-5 py-3 text-xs leading-relaxed text-navy-400">
        Payments are due on the 10th of each month. Your first installment is
        the 10th of next month. This is an estimate based on a {LOAN.apr}% fixed
        APR; your final terms are confirmed in your loan agreement.
      </p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-navy-400">
        {label}
      </dt>
      <dd className="text-base font-semibold text-navy-900">{value}</dd>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                  done
                    ? "bg-navy-900 text-white"
                    : active
                      ? "bg-star-400 text-navy-950"
                      : "bg-navy-100 text-navy-400"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`mt-1.5 hidden text-xs sm:block ${active ? "font-semibold text-navy-900" : "text-navy-400"}`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-1 h-0.5 flex-1 ${done ? "bg-navy-900" : "bg-navy-100"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-star-600">
        {sub}
      </p>
      <h2 className="mt-1 text-2xl font-bold">{title}</h2>
    </div>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      className="shrink-0 fill-green-500"
      aria-hidden="true"
    >
      <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.4-1.4z" />
    </svg>
  );
}
