import { Reveal } from './reveal';
import { SiteFooter } from './site-footer';
import { SiteNav } from './site-nav';

/**
 * Section headings in the Terms / Privacy copy: a line opening with "1.", "1)"
 * or "a)". Numbered clauses ("1.1 In these Terms…") and the indented sub-lists
 * deliberately fall through — only top-level headings match.
 */
const HEADING = /^(?:\d+[.)]|[a-z]\))\s+\S/;

/**
 * Legal pages (Terms / Privacy / Cookies) — not in the Figma landing design, so
 * kept intentionally plain: the shared light nav, a readable prose column, and
 * the shared footer. Footer links point here.
 *
 * `boldHeadings` opts a page into heading emphasis; the Cookies copy numbers its
 * step lists the same way headings are numbered, so it stays plain.
 */
export function LegalPage({
  title,
  body,
  boldHeadings = false,
}: {
  title: string;
  body: string;
  boldHeadings?: boolean;
}) {
  return (
    <main id="top">
      <div className="relative bg-white pb-24 pt-32">
        <SiteNav theme="light" />
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-20">
          <Reveal
            as="h1"
            className="text-[40px] font-semibold leading-tight tracking-tightest text-gray-900"
          >
            {title}
          </Reveal>
          {/* One block, not one per paragraph: legal copy is a single wall of
              prose and staggering it would be a distraction, not a flourish. */}
          <Reveal
            delay={110}
            className="mt-8 whitespace-pre-wrap text-[16px] leading-7 text-gray-600"
          >
            {boldHeadings
              ? body.split('\n').map((line, i) => (
                  <span
                    key={i}
                    className={
                      HEADING.test(line) ? 'font-semibold text-gray-900' : undefined
                    }
                  >
                    {line}
                    {'\n'}
                  </span>
                ))
              : body}
          </Reveal>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
