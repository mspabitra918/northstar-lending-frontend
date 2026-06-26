import Link from "next/link";
import { BRAND, LOAN, formatUSD } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-navy-100 bg-navy-950 text-navy-100">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="text-lg font-bold text-white">
            Northstar<span className="text-star-400"> Lending</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white">
            Modern, unsecured personal loans from {formatUSD(LOAN.minAmount)} to{" "}
            {formatUSD(LOAN.maxAmount)} at a fixed {LOAN.apr}% APR. No
            collateral, no upfront fees, funded within {LOAN.fundingHours}{" "}
            hours.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-star-400">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-navy-300">
            <li>
              <Link className="text-white" href="/how-it-works">
                How It Works
              </Link>
            </li>
            <li>
              <Link className="text-white" href="/reviews">
                Reviews & Trust
              </Link>
            </li>
            <li>
              <Link className="text-white" href="/status">
                Loan Status
              </Link>
            </li>
            <li>
              <Link className="text-white" href="/apply">
                Apply Now
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-star-400">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-white">
            <li>
              <Link className="hover:text-white" href="/privacy-policy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/terms">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/e-sign-consent">
                E-Sign Consent Disclosure
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/accessibility">
                Accessibility Statement
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-star-400">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-white">
            <li>
              {BRAND.address.city}, {BRAND.address.region}
            </li>
            <li>Serving all 50 states</li>
            <li>
              <a className="hover:text-white" href={`tel:${BRAND.phone}`}>
                {BRAND.phone}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="container-x py-6 text-xs leading-relaxed text-white">
          <p>
            © {BRAND.address.country === "US" ? new Date().getFullYear() : ""}{" "}
            {BRAND.legalName}. All rights reserved.
          </p>
          <p className="mt-2 max-w-3xl">
            Representative example: a {formatUSD(5000)} loan at a fixed{" "}
            {LOAN.apr}% APR over 24 months. All loans are subject to approval.
            Northstar Lending is committed to GLBA and CCPA privacy compliance.
            APR is fixed; rates and terms do not vary by applicant.
          </p>
        </div>
      </div>
    </footer>
  );
}
