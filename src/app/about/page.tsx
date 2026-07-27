import type { Metadata } from 'next';
import { AboutHero } from '../_components/about/about-hero';
import { AboutStory } from '../_components/about/about-story';
import { AboutMission } from '../_components/about/about-mission';
import { AboutValues } from '../_components/about/about-values';
import { SiteFooter } from '../_components/site-footer';

export const metadata: Metadata = {
  title: 'About us',
  description:
    "Why we built SafeRoute, what we stand for, and how community reports become road intelligence you can act on before you set out."
};

export default function AboutPage() {
  return (
    <main id="top">
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <AboutValues />
      <SiteFooter />
    </main>
  );
}
