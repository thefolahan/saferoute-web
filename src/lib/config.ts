const defaultApiBaseUrl = 'http://localhost:3000/api/v1';

export const siteConfig = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_BASE_URL ??
    defaultApiBaseUrl,
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#join-beta',
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#join-beta',
  betaContactEmail:
    process.env.NEXT_PUBLIC_BETA_CONTACT_EMAIL ??
    process.env.ADMIN_INITIAL_EMAIL ??
    'officialjoshua9@gmail.com'
} as const;

export function betaMailto(): string {
  const subject = encodeURIComponent('SafeRoute beta access');
  const body = encodeURIComponent(
    'Hi SafeRoute team, I want beta access for SafeRoute.\n\nCity:\nPlatform: iOS / Android\n'
  );

  return `mailto:${siteConfig.betaContactEmail}?subject=${subject}&body=${body}`;
}
