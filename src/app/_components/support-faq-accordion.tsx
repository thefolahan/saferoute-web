'use client';

import { useId, useState } from 'react';

type SupportFaq = {
  answer: string;
  question: string;
};

export function SupportFaqAccordion({ faqs }: { faqs: SupportFaq[] }) {
  const accordionId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-10 grid gap-3">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${accordionId}-panel-${index}`;

        return (
          <article className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} key={item.question}>
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="faq-trigger"
              onClick={() => setOpenIndex((current) => (current === index ? null : index))}
              type="button"
            >
              <span>{item.question}</span>
              <span className="faq-symbol" aria-hidden="true">
                {isOpen ? '-' : '+'}
              </span>
            </button>
            <div className={`faq-panel ${isOpen ? 'faq-panel--open' : ''}`} id={panelId}>
              <div className="faq-panel-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

