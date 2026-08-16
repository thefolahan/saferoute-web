import { LegalPage } from '../_components/legal-page';
import { termsOfUseText } from '../_lib/legal-policy-text';

export const metadata = { title: 'Terms of Use' };

export default function TermsOfUsePage() {
  return <LegalPage title="Terms of Use" body={termsOfUseText} />;
}
