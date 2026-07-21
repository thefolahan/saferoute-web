import { SiteFooter } from '../_components/site-footer';
import { DownloadCta } from '../_components/download-cta';
import { FeaturesShowcase } from '../_components/features/features-showcase';
import { FeaturesHero } from '../_components/features/hero';

export const metadata = {
  title: 'Features — SafeRoute',
  description:
    'From real-time incident reports to route safety scores, SafeRoute gives you the information you need before and during every journey.'
};

export default function FeaturesPage() {
  return (
    <main id="top">
      <FeaturesHero />
      <FeaturesShowcase />
      <DownloadCta />
      <SiteFooter />
    </main>
  );
}
