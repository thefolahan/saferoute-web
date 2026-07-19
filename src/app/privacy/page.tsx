import { LegalPage } from '../_components/legal-page';
import { privacyPolicyText } from '../_lib/legal-policy-text';

export const metadata = { title: 'Privacy Policy | SafeRoute' };

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" body={privacyPolicyText} />;
}
