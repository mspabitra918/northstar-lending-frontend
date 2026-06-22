// app/e-sign-consent/page.tsx

import LegalPage from "@/components/legal/LegalPage";

export default function ESignConsentPage() {
  return (
    <LegalPage title="Electronic Communications & E-Sign Consent Disclosure">
      <div className="space-y-10">
        {/* Effective Notice */}
        <div className="rounded-xl border border-star-200 bg-star-50 p-5">
          <p className="font-medium text-slate-700">
            By using Northstar Lending's online services, you agree to receive
            certain communications and documents electronically.
          </p>
        </div>

        {/* Intro */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            Electronic Communications and E-Sign Consent Disclosure
          </h2>

          <p className="leading-8 text-slate-600">
            To process your loan application online, Northstar Lending requires
            your consent to provide disclosures, agreements, notices, and other
            loan-related communications electronically rather than in paper
            form.
          </p>
        </section>

        {/* Scope of Consent */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            1. Scope of Consent
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <p className="leading-8 text-slate-600">
              By agreeing to this disclosure, you consent to receive all
              communications related to your loan electronically, including but
              not limited to:
            </p>

            <ul className="mt-5 space-y-3 text-slate-600">
              <li>✓ Loan Agreements</li>
              <li>✓ Truth-in-Lending Disclosures</li>
              <li>✓ Adverse Action Notices</li>
              <li>✓ Account Notifications</li>
              <li>✓ Payment and Funding Communications</li>
              <li>✓ Regulatory and Legal Notices</li>
              <li>✓ Subsequent Account Communications</li>
            </ul>
          </div>
        </section>

        {/* Hardware Requirements */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            2. Hardware and Software Requirements
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border p-6">
              <h3 className="mb-4 text-lg font-semibold text-navy-950">
                Required Technology
              </h3>

              <ul className="space-y-3 text-slate-600">
                <li>• Active Email Address</li>
                <li>• Internet Connection</li>
                <li>• Computer, Tablet, or Smartphone</li>
                <li>• Ability to Download and Save Files</li>
              </ul>
            </div>

            <div className="rounded-xl border p-6">
              <h3 className="mb-4 text-lg font-semibold text-navy-950">
                Supported Software
              </h3>

              <ul className="space-y-3 text-slate-600">
                <li>• Google Chrome</li>
                <li>• Apple Safari</li>
                <li>• Microsoft Edge</li>
                <li>• Browser Supporting 128-bit Encryption</li>
                <li>• PDF Reader (Adobe Acrobat Reader or equivalent)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Withdraw Consent */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            3. Withdrawing Consent
          </h2>

          <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-6">
            <p className="leading-8 text-slate-700">
              You may withdraw your consent to receive electronic records and
              communications at any time without penalty by contacting us at
              <span className="font-semibold"> support@northstarlend.com</span>.
            </p>

            <p className="mt-4 leading-8 text-slate-700">
              Please note that withdrawing consent before loan funding is
              completed may result in delays or cancellation of your loan
              application because certain documents must be delivered and signed
              electronically to complete the lending process.
            </p>
          </div>
        </section>

        {/* Paper Copies */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            4. Requesting Paper Copies
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <p className="leading-8 text-slate-600">
              You have the right to request a free paper copy of any electronic
              record that we provide.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              To request paper copies, please send a written request to:
            </p>

            <div className="mt-5 rounded-lg bg-slate-50 p-5">
              <p className="font-semibold text-navy-950">Northstar Lending</p>
              <p className="text-slate-600">355 S Grand Ave</p>
              <p className="text-slate-600">Office #20 W</p>
              <p className="text-slate-600">Los Angeles, CA 90071</p>
            </div>
          </div>
        </section>

        {/* Agreement */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            Electronic Signature Agreement
          </h2>

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <p className="leading-8 text-slate-700">
              By checking the consent box and electronically signing your loan
              documents, you acknowledge that:
            </p>

            <ul className="mt-5 space-y-3 text-slate-700">
              <li>✓ You can access and review electronic records.</li>
              <li>
                ✓ You satisfy the hardware and software requirements listed
                above.
              </li>
              <li>✓ You consent to receiving documents electronically.</li>
              <li>
                ✓ Your electronic signature has the same legal effect as a
                handwritten signature.
              </li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl bg-navy-950 p-8 text-white">
          <h2 className="mb-6 text-2xl font-bold text-white">Questions?</h2>

          <div className="space-y-3">
            <p>
              <strong>Email:</strong> support@northstarlend.com
            </p>

            <p>
              <strong>Phone:</strong> (747) 208-0334
            </p>
          </div>
        </section>
      </div>
    </LegalPage>
  );
}
