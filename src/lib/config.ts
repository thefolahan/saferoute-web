const defaultApiBaseUrl = 'http://localhost:3000/api/v1';
const defaultSupportEmail = 'support@saferoutehq.com';

export const siteConfig = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_BASE_URL ??
    defaultApiBaseUrl,
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#join-beta',
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#join-beta',
  betaContactEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ??
    process.env.NEXT_PUBLIC_BETA_CONTACT_EMAIL ??
    defaultSupportEmail
} as const;

function mailto(subject: string, body: string): string {
  return `mailto:${siteConfig.betaContactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function betaMailto(): string {
  return mailto(
    'SafeRoute beta access',
    'Hi SafeRoute team, I want beta access for SafeRoute.\n\nCity:\nPlatform: iOS / Android\n'
  );
}

export function trialMailto(): string {
  return mailto(
    'SafeRoute 30 Day Trial',
    'Hi SafeRoute team, I want to start a free 30 day trial.\n\nName:\nCity:\nUse case:\n'
  );
}

export function meetingMailto(): string {
  return mailto(
    'SafeRoute meeting request',
    'Hi SafeRoute team, I would like to book a meeting.\n\nName:\nOrganization:\nPreferred time:\n'
  );
}
