"use client";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { useState } from "react";

const schema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Northstar Lending",
  url: "https://www.northstarlend.com",
  telephone: "+1-747-208-0334",
  email: "support@northstarlend.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "355 S Grand Ave, Office #20 W",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    postalCode: "90071",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  priceRange: "$$",
};

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const payload = {
        full_name: fullName,
        email,
        number,
        message,
      };

      await api.createContacts(payload);

      setFullName("");
      setEmail("");
      setNumber("");
      setMessage("");
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-navy-950">
          <div className="container-x py-20 text-center">
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold text-white sm:text-5xl">
              Contact Northstar Lending
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-200">
              We're here to help. Reach out with questions about your loan
              application, account, or lending options.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow">
              <h2 className="mb-4 text-xl font-semibold">Office Address</h2>

              <p className="text-gray-600">
                355 S Grand Ave
                <br />
                Office #20 W
                <br />
                Los Angeles, CA 90071
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow">
              <h2 className="mb-4 text-xl font-semibold">Customer Support</h2>

              <div className="space-y-3">
                <a
                  href="tel:+17472080334"
                  className="block text-blue-600 hover:underline"
                >
                  (747) 208-0334
                </a>

                <a
                  href="mailto:support@northstarlend.com"
                  className="block text-blue-600 hover:underline"
                >
                  support@northstarlend.com
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow">
              <h2 className="mb-4 text-xl font-semibold">Business Hours</h2>

              <div className="space-y-2 text-gray-600">
                <p>Monday – Friday: 8:00 AM – 6:00 PM (PST)</p>
                <p>Saturday: 9:00 AM – 2:00 PM (PST)</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form + Map */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-2xl bg-white p-8 shadow">
              <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>

              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border p-3"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full rounded-lg border p-3"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone Number
                  </label>
                  <input
                    value={number}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      let formatted = digits;

                      if (digits.length > 6) {
                        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                      } else if (digits.length > 3) {
                        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                      } else if (digits.length > 0) {
                        formatted = `(${digits}`;
                      }

                      setNumber(formatted);
                    }}
                    type="tel"
                    className="w-full rounded-lg border p-3"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border p-3"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="button"
                  onClick={handelSubmit}
                  disabled={loading}
                  className="w-full rounded-lg bg-star-400 px-6 py-3 font-semibold text-black hover:bg-star-500"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className={loading ? "animate-spin" : ""} />
                    </div>
                  ) : (
                    " Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Google Map */}
            <div className="overflow-hidden rounded-2xl shadow">
              <iframe
                title="Northstar Lending Location"
                src="https://www.google.com/maps?q=355+S+Grand+Ave+Los+Angeles+CA+90071&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                className="min-h-[600px] w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
