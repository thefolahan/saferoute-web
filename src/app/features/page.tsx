import { SiteFooter } from '../_components/site-footer';
import { FeaturesDownload } from '../_components/features/download';
import { FeatureBlock } from '../_components/features/feature-block';
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

      <div className="bg-gray-950">
        <FeatureBlock
          heading="Stay informed in real time."
          description="View reports from nearby residents, verified organizations, and trusted news outlets as incidents unfold."
          phone="/images/landing/491-22714.png"
        />
        <FeatureBlock
          phoneLeft
          heading="See what's happening before you arrive."
          description="Watch live broadcasts from people at the scene to better understand traffic, flooding, accidents, and other incidents."
          phone="/images/landing/491-25783.png"
        />
        <FeatureBlock
          heading="Choose the safest route."
          description="Every route is analyzed using community reports, live activity, and neighborhood intelligence to help you make informed travel decisions."
          phone="/images/landing/491-26551.png"
        />
        <FeatureBlock
          phoneLeft
          eyebrow="Explore Neighborhoods"
          heading="Know an area before you visit."
          description="Watch live broadcasts from people at the scene to better understand traffic, flooding, accidents, and other incidents."
          phone="/images/landing/491-26798.png"
        />
        <FeatureBlock
          heading="Share every journey with people you trust."
          description="Keep family and friends informed with live journey sharing and emergency notifications whenever you need them."
          phone="/images/landing/491-27059.png"
        />
        <FeatureBlock
          phoneLeft
          small
          heading="Built on trusted community intelligence."
          description="Reports become more reliable as nearby users verify incidents with photos, videos, and live updates."
          phone="/images/landing/491-26031.png"
        />
      </div>

      <FeaturesDownload />
      <SiteFooter />
    </main>
  );
}
