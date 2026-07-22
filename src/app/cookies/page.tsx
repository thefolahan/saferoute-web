import { LegalPage } from '../_components/legal-page';
import { copyrightPolicyText } from '../_lib/legal-policy-text';

export const metadata = { title: 'Cookies Policy' };

// No dedicated cookies text exists in the source; using the copyright/legal
// notice as a placeholder. Replace with a real cookies policy before launch.
export default function CookiesPage() {
  return <LegalPage title="Cookies Policy" body={copyrightPolicyText} />;
}
