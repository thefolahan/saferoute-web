import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingPageView } from '../_components/marketing';
import {
  getMarketingPage,
  marketingPageSlugs
} from '../_lib/marketing-content';

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return marketingPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getMarketingPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.label} | SafeRoute`,
    description: page.description,
    openGraph: {
      title: `${page.label} | SafeRoute`,
      description: page.description,
      siteName: 'SafeRoute',
      type: 'website'
    }
  };
}

export default async function MarketingRoutePage({ params }: RouteProps) {
  const { slug } = await params;
  const page = getMarketingPage(slug);

  if (!page) {
    notFound();
  }

  return <MarketingPageView page={page} />;
}
