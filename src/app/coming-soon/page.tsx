import type { Metadata } from 'next';
import { ComingSoon } from '../_components/coming-soon';

export const metadata: Metadata = {
  title: 'Coming soon'
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
