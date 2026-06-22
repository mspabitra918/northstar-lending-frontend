// app/terms/page.tsx

import LegalPage from "@/components/legal/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Northstar Lending Terms of Service">
      <div className="space-y-10">
        {/* Effective Date */}
        <div className="rounded-xl border border-star-200 bg-star-50 p-5">
          <p className="font-medium text-slate-700">
            Effective Date: June 22, 2026
          </p>
        </div>

        {/* Acceptance */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            1. Acceptance of Terms
          </h2>

          <p className="leading-8 text-slate-600">
            By accessing or using northstarlend.com, you agree to be bound by
            these Terms of Service and all applicable laws and regulations. If
            you do not agree with any part of these terms, you must discontinue
            use of this website immediately.
          </p>
        </section>

        {/* Site Usage */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-navy-950">
            2. Use of the Site
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <p className="mb-5 text-slate-600">
              To use our services and apply for a loan, you must:
            </p>

            <ul className="space-y-3 text-slate-600">
              <li>✓ Be at least 18 years of age.</li>
              <li>✓ Be a resident of the United States.</li>
              <li>
                ✓ Provide accurate, current, and complete information during the
                application process.
              </li>
              <li>
                ✓ Use the website only for lawful purposes and in compliance
                with all applicable laws.
              </li>
            </ul>

            <p className="mt-5 text-slate-600">
              Northstar Lending reserves the right to deny access to users who
              provide false information or violate these Terms of Service.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            3. Intellectual Property
          </h2>

          <div className="rounded-xl border-l-4 border-star-400 bg-slate-50 p-6">
            <p className="leading-8 text-slate-600">
              All content available on this website, including but not limited
              to text, graphics, logos, icons, images, software, website design,
              and source code, is the exclusive property of Northstar Lending
              and is protected by applicable copyright, trademark, and
              intellectual property laws.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              You may not reproduce, distribute, modify, publish, transmit, or
              create derivative works from any website content without prior
              written consent from Northstar Lending.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            4. Limitation of Liability
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <p className="leading-8 text-slate-600">
              Northstar Lending shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising
              out of or relating to your use of this website, reliance upon its
              content, or inability to access the website.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              While we strive to maintain accurate and uninterrupted services,
              we do not guarantee that the website will be error-free,
              uninterrupted, secure, or available at all times.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            5. Governing Law
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <p className="leading-8 text-slate-600">
              These Terms of Service shall be governed by and construed in
              accordance with the laws of the State of California, without
              regard to conflict of law principles.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Any dispute, claim, or controversy arising from or relating to
              these Terms of Service or your use of this website shall be
              resolved exclusively in the state or federal courts located in Los
              Angeles County, California.
            </p>
          </div>
        </section>

        {/* Changes */}
        {/* <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            6. Changes to These Terms
          </h2>

          <p className="leading-8 text-slate-600">
            Northstar Lending reserves the right to modify or update these Terms
            of Service at any time. Any changes will become effective
            immediately upon posting to this page. Continued use of the website
            after changes are posted constitutes acceptance of the revised
            terms.
          </p>
        </section> */}

        {/* Contact */}
        <section className="rounded-2xl bg-navy-950 p-8 text-white">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Contact Information
          </h2>

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
