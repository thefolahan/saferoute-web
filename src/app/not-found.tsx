import type { Metadata } from 'next';
import { ComingSoon } from './_components/coming-soon';

export const metadata: Metadata = {
  title: 'Page not found'
};

// 404 — same layout/style as the Coming Soon page, with a not-found message.
export default function NotFound() {
  return (
    <ComingSoon
      heading="Page Not Found!"
      subtitle="The page you're looking for doesn't exist or may have moved."
      waitlist={false}
    />
  );
}
