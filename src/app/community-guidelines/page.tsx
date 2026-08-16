import { LegalPage } from '../_components/legal-page';
import { communityGuidelinesText } from '../_lib/legal-policy-text';

export const metadata = { title: 'Community Guidelines' };

export default function CommunityGuidelinesPage() {
  return <LegalPage title="Community Guidelines" body={communityGuidelinesText} />;
}
