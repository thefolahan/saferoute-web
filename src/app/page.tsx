import { DownloadCta } from './_components/download-cta';
import { Faq } from './_components/home/faq';
import { FeatureShowcase } from './_components/home/feature-showcase';
import { Hero } from './_components/home/hero';
import { HowItWorks } from './_components/home/how-it-works';
import { IncidentShowcase } from './_components/home/incident-showcase';
import { Testimonials } from './_components/home/testimonials';
import { SiteFooter } from './_components/site-footer';

export default function HomePage() {
  return (
    <main id="top">
      <Hero />
      <IncidentShowcase />
      <FeatureShowcase />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <DownloadCta />
      <SiteFooter />
    </main>
  );
}
