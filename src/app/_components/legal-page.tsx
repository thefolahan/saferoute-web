import { SiteFooter } from './site-footer';
import { SiteNav } from './site-nav';

/**
 * Legal pages (Terms / Privacy / Cookies) — not in the Figma landing design, so
 * kept intentionally plain: the shared light nav, a readable prose column, and
 * the shared footer. Footer links point here.
 */
export function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <main id="top">
      <div className="relative bg-white pb-24 pt-32">
        <SiteNav active="Home" theme="light" />
        <div className="mx-auto max-w-[760px] px-6">
          <h1 className="text-[40px] font-semibold leading-tight tracking-tightest text-gray-900">
            {title}
          </h1>
          <div className="mt-8 whitespace-pre-wrap text-[16px] leading-7 text-gray-600">
            {body}
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
