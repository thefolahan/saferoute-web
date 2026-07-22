import type { Metadata } from 'next';
import { AboutHero } from '../_components/about/about-hero';
import { AboutStory } from '../_components/about/about-story';
import { AboutMission } from '../_components/about/about-mission';
import { DownloadCta } from '../_components/download-cta';
import { SiteFooter } from '../_components/site-footer';

export const metadata: Metadata = {
  title: 'About us',
  description:
    "We're helping people travel with confidence. SafeRoute provides real-time road intelligence that helps travelers avoid delays, navigate disruptions, and make smarter decisions before they hit the road."
};

export default function AboutPage() {
  return (
    <main id="top">
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <DownloadCta />
      <SiteFooter />
    </main>
  );
}
