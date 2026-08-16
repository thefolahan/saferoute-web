import { Fragment } from 'react';
import { Reveal } from './reveal';
import { SiteFooter } from './site-footer';
import { SiteNav } from './site-nav';

/**
 * Legal pages (Terms of Use / Privacy Policy / Community Guidelines / Cookies)
 * — not in the Figma landing design, so kept intentionally plain: the shared
 * light nav, a readable prose column, and the shared footer. Footer links
 * point here.
 *
 * `body` carries the light markup described in _lib/legal-policy-text.ts:
 * `## ` section, `### ` sub-section, `- ` bullet, anything else a paragraph.
 * The Cookies copy predates that markup, so it passes `format="plain"` and is
 * rendered as pre-wrapped text instead.
 */
export function LegalPage({
  title,
  body,
  format = 'structured',
}: {
  title: string;
  body: string;
  format?: 'structured' | 'plain';
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
          <Reveal delay={110} className="mt-8 max-w-[820px] text-[16px] leading-7 text-gray-600">
            {format === 'structured' ? (
              renderBlocks(body)
            ) : (
              <div className="whitespace-pre-wrap">{body}</div>
            )}
          </Reveal>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

/**
 * Groups the flat lines into blocks so consecutive `- ` lines become one <ul>
 * and consecutive paragraph lines stay a single <p> — the source documents put
 * every sentence of a paragraph on its own line, so joining them back with a
 * space is what restores the intended prose.
 */
function renderBlocks(body: string) {
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  let para: string[] = [];

  const flushBullets = () => {
    if (!bullets.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="mt-3 flex list-disc flex-col gap-1.5 pl-6">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  const flushPara = () => {
    if (!para.length) return;
    out.push(
      <p key={`p-${out.length}`} className="mt-4">
        {para.join(' ')}
      </p>
    );
    para = [];
  };

  const flush = () => {
    flushBullets();
    flushPara();
  };

  for (const line of body.split('\n')) {
    if (line.startsWith('## ')) {
      flush();
      out.push(
        <h2
          key={`h2-${out.length}`}
          className="mt-10 text-[20px] font-semibold leading-7 text-gray-900"
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flush();
      out.push(
        <h3
          key={`h3-${out.length}`}
          className="mt-6 text-[17px] font-semibold leading-6 text-gray-900"
        >
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      flushPara();
      bullets.push(line.slice(2));
    } else if (line.trim() === '') {
      flush();
    } else {
      flushBullets();
      para.push(line);
    }
  }
  flush();

  return <Fragment>{out}</Fragment>;
}
