/**
 * Generates the share/link-preview assets that need the brand background baked
 * into the pixels.
 *
 * The source logo (public/images/saferoute-icon-white.svg) is a white mark on
 * transparency, so anywhere it lands on a light surface — a WhatsApp preview
 * card, a browser tab in light theme — it disappears. Chat clients render the
 * card in their own chrome and ignore any CSS we ship, so the only fix is an
 * image that carries its own dark background.
 *
 * Run from apps/web:  node scripts/generate-brand-assets.mjs
 */
// next/og.js, not next/og — the package has no ESM export map entry for it.
import { ImageResponse } from 'next/og.js';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = dirname(dirname(fileURLToPath(import.meta.url)));
const IMAGES = join(WEB, 'public', 'images');
const FONTS = join(WEB, '..', 'mobile', 'assets', 'fonts');

const BG = '#111112'; // matches the site footer / dark nav pill
const LOGO = join(IMAGES, 'saferoute-icon-white.svg');

/** The white mark. Its viewBox is already cropped to the artwork, so rasterising
 *  it into a square box puts the mark at full height, centred — no trim pass. */
const mark = (size) =>
  sharp(LOGO, { density: 600 })
    .resize({ width: size, height: size, fit: 'inside' })
    .png()
    .toBuffer();

/** 1200x630 link-preview card — og:image / twitter:image. */
async function ogCover() {
  const uri = `data:image/png;base64,${(await mark(300)).toString('base64')}`;
  const h = (type, props, ...children) => ({
    type,
    props: { ...props, children: children.length > 1 ? children : children[0] }
  });

  const res = new ImageResponse(
    h(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: BG,
          fontFamily: 'Inter'
        }
      },
      h('img', { src: uri, width: 150, height: 150 }),
      h(
        'div',
        {
          style: {
            marginTop: 28,
            fontSize: 86,
            fontWeight: 600,
            color: '#FFFFFF',
            letterSpacing: -2.5
          }
        },
        'SafeRoute'
      ),
      h(
        'div',
        { style: { marginTop: 12, fontSize: 32, fontWeight: 400, color: '#9A9AA0' } },
        'Know Before You Go'
      )
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: readFileSync(join(FONTS, 'Inter-Regular.ttf')), weight: 400, style: 'normal' },
        { name: 'Inter', data: readFileSync(join(FONTS, 'Inter-SemiBold.ttf')), weight: 600, style: 'normal' }
      ]
    }
  );

  // Satori's PNG is unoptimised; chat clients cap the image size they'll fetch.
  const png = await sharp(Buffer.from(await res.arrayBuffer()))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  writeFileSync(join(IMAGES, 'og-cover.png'), png);
  return ['og-cover.png', png.length];
}

/** Square app icon on the brand background. `rounded` for the favicon only —
 *  iOS applies its own mask, so the Apple icon stays full-bleed. */
async function iconPng(size, { rounded }) {
  const inner = await mark(Math.round(size * 0.62));
  const meta = await sharp(inner).metadata();
  let img = sharp({ create: { width: size, height: size, channels: 4, background: BG } }).composite([
    {
      input: inner,
      top: Math.round((size - (meta.height ?? 0)) / 2),
      left: Math.round((size - (meta.width ?? 0)) / 2)
    }
  ]);

  if (rounded) {
    const r = Math.round(size * 0.1875);
    const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/></svg>`;
    img = sharp(await img.png().toBuffer()).composite([
      { input: Buffer.from(maskSvg), blend: 'dest-in' }
    ]);
  }

  return img.png({ compressionLevel: 9 }).toBuffer();
}

async function icon(size, file, { rounded, dir = IMAGES }) {
  const png = await iconPng(size, { rounded });
  writeFileSync(join(dir, file), png);
  return [file, png.length];
}

/**
 * Multi-size .ico for the site root.
 *
 * Google's favicon crawler fetches /favicon.ico by path in addition to
 * following <link rel="icon">, and that path used to 404 here — which is how a
 * retired logo stayed pinned in the search results long after the site had
 * moved on. The sizes are Google's documented ones (square, a multiple of
 * 48px); 512 is not a multiple of 48, so the PNG the page linked never met the
 * stated spec either.
 *
 * The container embeds whole PNGs rather than BMP bitmaps — legal since Vista
 * and understood by every current browser and crawler, and it keeps the file
 * small enough not to matter.
 *
 * It lands in public/, not app/: app/favicon.ico is Next's file convention and
 * emits its own <link> with a hashed query string on top of the one
 * metadata.icons declares, so the head ends up with two rel="icon" tags
 * pointing at the same bytes by different URLs. public/ serves the identical
 * /favicon.ico path with one declaration and no hash.
 */
async function faviconIco(sizes, dir) {
  const pngs = await Promise.all(sizes.map((s) => iconPng(s, { rounded: true })));

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  // Directory entries are fixed-width, so every image offset is known up front.
  let offset = header.length + pngs.length * 16;
  const entries = pngs.map((png, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0); // 0 encodes 256
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1);
    e.writeUInt8(0, 2); // palette size — 0 for truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });

  const ico = Buffer.concat([header, ...entries, ...pngs]);
  writeFileSync(join(dir, 'favicon.ico'), ico);
  return ['favicon.ico', ico.length];
}

const APP = join(WEB, 'src', 'app');

const results = [
  await ogCover(),
  // Served from the site root — the path Google's favicon crawler probes.
  await faviconIco([48, 96, 144], join(WEB, 'public')),
  // Google wants a square that is a multiple of 48px; 96 and 192 satisfy that,
  // 512 stays for PWA installs and high-DPI browser tabs.
  await icon(96, 'icon-96.png', { rounded: true }),
  await icon(192, 'icon-192.png', { rounded: true }),
  await icon(512, 'icon-512.png', { rounded: true }),
  await icon(180, 'apple-touch-icon.png', { rounded: false }),
  // app/icon.png is Next's file convention. metadata.icons currently shadows it,
  // but it is still served at /icon.png, so keep it in sync.
  await icon(512, 'icon.png', { rounded: true, dir: APP })
];
for (const [file, bytes] of results) console.log(`${file}  ${(bytes / 1024).toFixed(0)}KB`);
