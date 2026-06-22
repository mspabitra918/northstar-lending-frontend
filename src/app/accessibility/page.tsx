// app/accessibility/page.tsx

import LegalPage from "@/components/legal/LegalPage";

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement">
      <div className="space-y-10">
        {/* Introduction */}
        <div className="rounded-xl border border-star-200 bg-star-50 p-6">
          <p className="leading-8 text-slate-700">
            Northstar Lending is committed to ensuring digital accessibility for
            people with disabilities. We are continually improving the user
            experience for everyone and applying recognized accessibility
            standards to provide equal access to our services.
          </p>
        </div>

        {/* Conformance Status */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            1. Conformance Status
          </h2>

          <div className="rounded-xl border bg-white p-6">
            <p className="leading-8 text-slate-600">
              We strive to conform to the Web Content Accessibility Guidelines
              (WCAG) 2.1 Level AA. These internationally recognized guidelines
              explain how to make web content more accessible for people with
              disabilities while improving usability for all visitors.
            </p>

            <div className="mt-6 rounded-lg bg-slate-50 p-5">
              <h3 className="mb-3 font-semibold text-navy-950">
                Our Accessibility Goals Include:
              </h3>

              <ul className="space-y-3 text-slate-600">
                <li>✓ Providing sufficient color contrast for readability.</li>
                <li>
                  ✓ Supporting keyboard-only navigation throughout the site.
                </li>
                <li>
                  ✓ Ensuring forms include accessible labels and instructions.
                </li>
                <li>
                  ✓ Maintaining compatibility with screen readers and assistive
                  technologies.
                </li>
                <li>✓ Using clear headings and semantic HTML structure.</li>
                <li>
                  ✓ Continuously reviewing and improving accessibility features.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feedback & Assistance */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            2. Feedback & Assistance
          </h2>

          <div className="rounded-xl border-l-4 border-star-400 bg-slate-50 p-6">
            <p className="leading-8 text-slate-600">
              If you experience difficulty accessing any part of this website,
              encounter accessibility barriers, or need assistance completing a
              loan application, please contact us. Our team is happy to provide
              assistance and alternative communication methods when needed.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              We aim to respond to accessibility-related feedback and requests
              within <strong>2 business days</strong>.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="rounded-2xl bg-navy-950 p-8 text-white">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Contact Accessibility Support
          </h2>

          <div className="space-y-4">
            <div>
              <p className="font-semibold">Phone</p>
              <p>(747) 208-0334</p>
            </div>

            <div>
              <p className="font-semibold">Email</p>
              <p>support@northstarlend.com</p>
            </div>

            <div>
              <p className="font-semibold">Mailing Address</p>
              <p>355 S Grand Ave</p>
              <p>Office #20 W</p>
              <p>Los Angeles, CA 90071</p>
            </div>
          </div>
        </section>

        {/* Ongoing Improvements */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy-950">
            Ongoing Accessibility Improvements
          </h2>

          <p className="leading-8 text-slate-600">
            Accessibility is an ongoing effort at Northstar Lending. We
            regularly evaluate our website, applications, and digital services
            to identify and address accessibility issues and improve usability
            for all users.
          </p>
        </section>
      </div>
    </LegalPage>
  );
}
