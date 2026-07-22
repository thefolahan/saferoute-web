import { LegalPage } from '../_components/legal-page';
import { termsPolicyText } from '../_lib/legal-policy-text';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return <LegalPage title="Terms of Service" body={termsPolicyText} />;
}
