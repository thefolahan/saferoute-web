import { siteConfig } from './config';

export type PublicIncidentPreview = {
  id: string;
  title: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  verificationStatus: string;
  city: string;
  state?: string | null;
  reportedAt: string;
};

const requestTimeoutMs = 2500;

const fallbackIncidents: PublicIncidentPreview[] = [
  {
    id: 'preview-lagos-1',
    title: 'Road accident reported near Lekki Expressway',
    category: 'road_accident',
    severity: 'high',
    status: 'under_review',
    verificationStatus: 'unverified',
    city: 'Lagos',
    state: 'Lagos',
    reportedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: 'preview-abuja-1',
    title: 'Fire outbreak reported near Wuse 2',
    category: 'fire_outbreak',
    severity: 'critical',
    status: 'verified',
    verificationStatus: 'moderator_verified',
    city: 'Abuja',
    state: 'FCT',
    reportedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString()
  },
  {
    id: 'preview-ibadan-1',
    title: 'Flooding reported around Ring Road',
    category: 'flood',
    severity: 'high',
    status: 'verified',
    verificationStatus: 'moderator_verified',
    city: 'Ibadan',
    state: 'Oyo',
    reportedAt: new Date(Date.now() - 46 * 60 * 1000).toISOString()
  },
  {
    id: 'preview-ph-1',
    title: 'Dangerous road condition reported in GRA',
    category: 'dangerous_road_condition',
    severity: 'medium',
    status: 'under_review',
    verificationStatus: 'unverified',
    city: 'Port Harcourt',
    state: 'Rivers',
    reportedAt: new Date(Date.now() - 63 * 60 * 1000).toISOString()
  }
];

type IncidentApiRecord = Partial<PublicIncidentPreview> & {
  publicId?: string;
};

export async function getIncidentPreview(): Promise<PublicIncidentPreview[]> {
  const url = new URL(`${normalizeBaseUrl(siteConfig.apiBaseUrl)}/incidents/trending`);
  url.searchParams.set('limit', '4');

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(requestTimeoutMs)
    });

    if (!response.ok) {
      logIncidentPreviewFallback(response.status);
      return fallbackIncidents;
    }

    const body = (await response.json()) as unknown;

    if (!Array.isArray(body)) {
      logIncidentPreviewFallback('invalid_shape');
      return fallbackIncidents;
    }

    const incidents = body
      .slice(0, 4)
      .map((item) => toIncidentPreview(item as IncidentApiRecord))
      .filter((item): item is PublicIncidentPreview => item !== null);

    return incidents.length > 0 ? incidents : fallbackIncidents;
  } catch (error) {
    logIncidentPreviewFallback(error instanceof Error ? error.name : 'unknown');
    return fallbackIncidents;
  }
}

export function formatCategory(category: string): string {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatRelativeTime(value: string): string {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return 'Recently';
  }

  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60_000));

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  return `${hours} hr ago`;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

function toIncidentPreview(
  record: IncidentApiRecord
): PublicIncidentPreview | null {
  if (!record.id || !record.title || !record.category || !record.reportedAt) {
    return null;
  }

  return {
    id: record.id,
    title: record.title,
    category: record.category,
    severity: normalizeSeverity(record.severity),
    status: record.status ?? 'under_review',
    verificationStatus: record.verificationStatus ?? 'unverified',
    city: record.city ?? 'Nigeria',
    state: record.state,
    reportedAt: record.reportedAt
  };
}

function normalizeSeverity(
  severity: PublicIncidentPreview['severity'] | undefined
): PublicIncidentPreview['severity'] {
  if (
    severity === 'low' ||
    severity === 'medium' ||
    severity === 'high' ||
    severity === 'critical'
  ) {
    return severity;
  }

  return 'medium';
}

function logIncidentPreviewFallback(reason: number | string): void {
  if (process.env.NODE_ENV === 'production') {
    console.warn('SafeRoute web incident preview using fallback data.', {
      reason
    });
  }
}
