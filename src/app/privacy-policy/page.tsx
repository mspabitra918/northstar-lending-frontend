// app/privacy-policy/page.tsx

import LegalPage from "@/components/legal/LegalPage";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Northstar Lending Privacy Policy">
      <div className="space-y-10">
        {/* Effective Date */}
        <div className="rounded-xl border border-star-200 bg-star-50 p-5">
          <p className="font-medium text-slate-700">
            Effective Date: June 22, 2026
          </p>
        </div>

        {/* Introduction */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            1. Introduction
          </h2>

          <p className="leading-8 text-slate-600">
            Northstar Lending ("we," "our," or "us") is committed to protecting
            your privacy and safeguarding your personal information. This
            Privacy Policy explains how we collect, use, disclose, and protect
            your Personally Identifiable Information (PII) when you visit our
            website, submit a loan application, communicate with us, or use our
            services.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-navy-950">
            2. Information We Collect
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-navy-950">
                Information You Provide
              </h3>

              <ul className="space-y-2 text-slate-600">
                <li>• Full Name</li>
                <li>• Residential Address</li>
                <li>• Email Address</li>
                <li>• Phone Number</li>
                <li>• Date of Birth</li>
                <li>• Social Security Number (SSN)</li>
                <li>• Employment & Income Information</li>
                <li>• Banking Information</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-navy-950">
                Information Automatically Collected
              </h3>

              <p className="leading-7 text-slate-600">
                To detect fraud, verify identity, and maintain security, we may
                automatically collect:
              </p>

              <ul className="mt-4 space-y-2 text-slate-600">
                <li>• IP Address</li>
                <li>• Browser Type & Version</li>
                <li>• Operating System</li>
                <li>• Device Information</li>
                <li>• Access Times & Activity Logs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        {/* <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            3. How We Use Your Information
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <ul className="space-y-3 text-slate-600">
              <li>✓ Process and evaluate loan applications</li>
              <li>✓ Verify your identity</li>
              <li>✓ Prevent fraud and suspicious activity</li>
              <li>✓ Communicate regarding your application</li>
              <li>✓ Comply with legal and regulatory requirements</li>
              <li>✓ Improve our website and services</li>
            </ul>
          </div>
        </section> */}

        {/* GLBA */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            3. Gramm-Leach-Bliley Act (GLBA) Notice
          </h2>

          <div className="rounded-xl border-l-4 border-star-400 bg-slate-50 p-6">
            <p className="mb-4 leading-8 text-slate-600">
              As a financial institution, Northstar Lending complies with the
              requirements of the Gramm-Leach-Bliley Act (GLBA). We collect
              non-public personal information solely to process loan
              applications, verify identity, prevent fraud, and satisfy legal
              obligations.
            </p>

            <p className="leading-8 text-slate-600">
              We do not sell your financial information to non-affiliated third
              parties for marketing purposes without your explicit consent.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-5">
              <h3 className="mb-3 font-semibold text-navy-950">
                Information Security
              </h3>

              <ul className="space-y-2 text-slate-600">
                <li>• AES-256 Encryption</li>
                <li>• Secure Network Infrastructure</li>
                <li>• Access Control Systems</li>
                <li>• Security Monitoring</li>
              </ul>
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="mb-3 font-semibold text-navy-950">
                Limited Sharing
              </h3>

              <ul className="space-y-2 text-slate-600">
                <li>• Identity Verification Providers</li>
                <li>• Fraud Prevention Services</li>
                <li>• Regulatory Authorities</li>
                <li>• Authorized Service Providers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CCPA */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            4. California Consumer Privacy Act (CCPA)
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <p className="mb-5 text-slate-600">
              California residents may have the following rights:
            </p>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="font-bold text-green-600">✓</span>
                <span className="text-slate-600">
                  Know what personal information is collected and how it is
                  used.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="font-bold text-green-600">✓</span>
                <span className="text-slate-600">
                  Request deletion of personal information, subject to legal and
                  financial recordkeeping requirements.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="font-bold text-green-600">✓</span>
                <span className="text-slate-600">
                  Opt out of the sale of personal information. Northstar Lending
                  does not sell personal information.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="font-bold text-green-600">✓</span>
                <span className="text-slate-600">
                  Receive equal service without discrimination for exercising
                  privacy rights.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Cookies & IP Tracking */}
        {/* <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            5. Cookies & IP Tracking
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <p className="leading-8 text-slate-600">
              We use cookies, IP logging, server logs, and related technologies
              to protect applicants, prevent fraud, improve website performance,
              analyze traffic, and maintain compliance. Your IP address may be
              associated with application activity for security and auditing
              purposes.
            </p>
          </div>
        </section> */}

        {/* Data Retention */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            5. Data Retention
          </h2>

          <p className="leading-8 text-slate-600">
            We retain personal information only as long as necessary to process
            applications, provide services, comply with legal obligations,
            resolve disputes, and enforce agreements.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-navy-950 p-8 text-white">
          <h2 className="mb-6 text-2xl font-bold text-white">6. Contact Us</h2>

          <div className="space-y-3">
            <p>
              <strong>Email:</strong> support@northstarlend.com
            </p>

            <p>
              <strong>Phone:</strong> (747) 208-0334
            </p>

            <p>
              <strong>Department:</strong> Customer Privacy Department
            </p>
          </div>
        </section>

        {/* Changes */}
        {/* <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            9. Changes to This Privacy Policy
          </h2>

          <p className="leading-8 text-slate-600">
            We may update this Privacy Policy from time to time to reflect
            changes in legal requirements, security practices, or business
            operations. Any updates will be posted on this page along with a
            revised effective date.
          </p>
        </section> */}
      </div>
    </LegalPage>
  );
}
