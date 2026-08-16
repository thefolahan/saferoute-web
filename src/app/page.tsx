import { Faq } from './_components/home/faq';
import { FeatureShowcase } from './_components/home/feature-showcase';
import { Hero } from './_components/home/hero';
import { HowItWorks } from './_components/home/how-it-works';
// import { LiveAlerts } from './_components/home/live-alerts';
import { Testimonials } from './_components/home/testimonials';
import { SiteFooter } from './_components/site-footer';
import { StructuredData } from './_components/structured-data';

export const metadata = {
  alternates: { canonical: '/' }
};

export default function HomePage() {
  return (
    <main id="top">
      <StructuredData />
      <Hero />
      {/*<LiveAlerts />*/}
      <FeatureShowcase />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <SiteFooter />
    </main>
  );
}
