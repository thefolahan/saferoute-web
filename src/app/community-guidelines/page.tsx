import { LegalPage } from '../_components/legal-page';
import { communityGuidelinesText } from '../_lib/legal-policy-text';

export const metadata = {
  title: 'Community Guidelines',
  description:
    'The rules for reporting incidents, livestreaming, and treating other people on SafeRoute Africa — and how we enforce them.',
  alternates: { canonical: '/community-guidelines' }
};

export default function CommunityGuidelinesPage() {
  return <LegalPage title="Community Guidelines" body={communityGuidelinesText} />;
}
