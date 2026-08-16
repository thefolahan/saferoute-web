import { LegalPage } from '../_components/legal-page';
import { privacyPolicyText } from '../_lib/legal-policy-text';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How SafeRoute Africa collects, uses, stores, shares, and deletes personal information, and the data-protection rights available to you.',
  alternates: { canonical: '/privacy-policy' }
};

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" body={privacyPolicyText} />;
}
