import { Faq } from './_components/home/faq';
import { FeatureShowcase } from './_components/home/feature-showcase';
import { Hero } from './_components/home/hero';
import { HowItWorks } from './_components/home/how-it-works';
// import { LiveAlerts } from './_components/home/live-alerts';
import { Testimonials } from './_components/home/testimonials';
import { SiteFooter } from './_components/site-footer';

export default function HomePage() {
  return (
    <main id="top">
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
