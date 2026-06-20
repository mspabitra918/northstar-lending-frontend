'use client';

import { useState } from 'react';

// Accessible FAQ accordion. Questions render as <h3> headings so crawlers and
// answer engines map them to conversational queries (AEO).
export function Faq({
  items,
}: {
  items: readonly { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3 className="m-0">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-navy-900 hover:bg-navy-50"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.question}
                <span
                  className={`shrink-0 text-star-500 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  aria-hidden="true"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            {isOpen && (
              <div className="px-5 pb-5 text-navy-600 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
