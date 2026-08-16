import { LegalPage } from '../_components/legal-page';
import { privacyPolicyText } from '../_lib/legal-policy-text';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" body={privacyPolicyText} />;
}
