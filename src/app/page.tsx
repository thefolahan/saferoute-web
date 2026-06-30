import { HomePageView } from './_components/marketing';
import { getIncidentPreview } from '../lib/incidents';

export default async function HomePage() {
  const incidentPreview = await getIncidentPreview();

  return <HomePageView incidents={incidentPreview} />;
}
