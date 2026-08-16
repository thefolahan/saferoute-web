import { LegalPage } from '../_components/legal-page';
import { termsOfUseText } from '../_lib/legal-policy-text';

export const metadata = {
  title: 'Terms of Use',
  description:
    'The Terms of Use governing your access to the SafeRoute Africa app, website, and related safety services.',
  alternates: { canonical: '/terms-of-use' }
};

export default function TermsOfUsePage() {
  return <LegalPage title="Terms of Use" body={termsOfUseText} />;
}
