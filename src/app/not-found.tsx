import type { Metadata } from 'next';
import { NotFoundScreen } from './_components/not-found-screen';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true }
};

export default function NotFound() {
  return <NotFoundScreen />;
}
