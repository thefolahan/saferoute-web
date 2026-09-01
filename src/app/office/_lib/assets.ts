/* Image fills exported from the Figma file by their imageRef.
   Re-download: python3 scripts/figma.py images apps/web/public/office <ref,...> */
const img = (ref: string) => `/office/${ref}.png`;

export const AVATAR = {
  admin: img('1bfac056a5e2d81fdba7c3952411444c90b8323d'),
  user: img('ff93610df4eee5111c6fb82324e69611316bace3'),
  a: img('08a3b47613f2d0f6aced2c3c467602e3aa1638f1'),
  b: img('6424b0d14893954b1bbf127484daab7d652e2e3f'),
  c: img('ab9201148cfdefe023e21366139405f0dda8c4d3'),
  d: img('f411169b0890cb85aaf2ca68bc27e793bfc47b0c'),
  e: img('5e02411319a7ebbf4cbc31cc29d72a3ba29aac9d'),
  f: img('66daa47d7cbb70003c1ec154ed80132ae1395e7f'),
  g: img('f804b18a955c5e659c1e5d520dd14fdeffe0454a'),
  h: img('75bbf14372bf1565a71e264b3a52b13b2af7fe79'),
  i: img('268015648fb05fae95d6c156fbfe4fdcb713eaf2'),
  j: img('c9431810e35ba3e7b32190386688d94c82a6bd95'),
  k: img('8dc2cd13a0f0c0d4758835e49dbdc8a317bafb51')
} as const;

export const PHOTO = {
  incident: img('e5ee185c6d0d52ac7f7f386119bf1e7efdc70821'),
  incidentAlt: img('8fe7ad6b85c053224d98bfd7e680608c07f3c239'),
  map: img('bd85ab5e98a5cd8dabb796ff8b3be073cecfc05b'),
  mapWide: img('6a04e2063a7dd0a1bf006e585dc1984ecd7a6b0a'),
  asset: img('1b0dcbbb227447e757e2e84a6c1fb54078897235'),
  /* Figma 907:17338 — the Map screen's base layer (parks/water/roads), 2x. */
  mapBase: '/office/map-base.png',
  /* Figma 907:14741 — the Federal Road Safety Corps mark on the agency card. */
  agencyLogo: '/office/agency-logo.png'
} as const;

export const AVATARS = [
  AVATAR.a, AVATAR.b, AVATAR.c, AVATAR.d, AVATAR.e, AVATAR.f,
  AVATAR.g, AVATAR.h, AVATAR.i, AVATAR.j, AVATAR.k
];
