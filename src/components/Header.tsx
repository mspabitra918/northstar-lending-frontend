"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND, NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label={BRAND.name}
        >
          <StarMark />
          <span className="text-lg font-bold tracking-tight text-navy-900">
            Northstar<span className="text-star-500"> Lending</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-50 hover:text-navy-900"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/apply" className="btn-primary ml-2 px-5 py-2 text-sm">
            Apply Now
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-navy-700 hover:bg-navy-50"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-navy-100 bg-white md:hidden"
          aria-label="Mobile"
        >
          <div className="container-x flex flex-col gap-1 py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="btn-primary mt-1 text-sm"
              onClick={() => setOpen(false)}
            >
              Apply Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function StarMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"
        className="fill-star-400"
      />
    </svg>
  );
}
