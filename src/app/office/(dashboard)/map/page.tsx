import { officeFetch } from '../../_lib/session';
import { MapView, type MapCard } from './map-view';

export const dynamic = 'force-dynamic';

type ApiMap = {
  incidents: {
    id: string;
    title: string;
    category: string;
    severity: string;
    latitude: number;
    longitude: number;
    addressText: string | null;
    city: string;
    reportedAt: string;
  }[];
};

/**
 * NOTE: the basemap is the designer's static export, which is not
 * geo-referenced — there is no projection from a real lat/lng onto it. So the
 * pins keep the design's positions and take their labels from live incidents,
 * while the card rail below is fully real. Swapping in a tiled map provider is
 * what would make the pin positions truthful.
 */
export default async function MapPage() {
  const data = await officeFetch<ApiMap>('/admin/map/incidents');
  const incidents = data?.incidents ?? [];

  return (
    <MapView
      pins={incidents.slice(0, 4).map((incident) => ({
        id: incident.id,
        label: humanise(incident.category)
      }))}
      cards={incidents.slice(0, 8).map((incident): MapCard => ({
        id: incident.id,
        title: humanise(incident.category),
        place: incident.addressText ?? incident.city,
        away: new Date(incident.reportedAt).toLocaleDateString('en', {
          month: 'short',
          day: 'numeric'
        })
      }))}
    />
  );
}

function humanise(category: string): string {
  return category.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}
