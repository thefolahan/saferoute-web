/**
 * Generates the share/link-preview assets that need the brand background baked
 * into the pixels.
 *
 * The source logo (public/images/logo.png) is a white mark on transparency, so
 * anywhere it lands on a light surface — a WhatsApp preview card, a browser tab
 * in light theme — it disappears. Chat clients render the card in their own
 * chrome and ignore any CSS we ship, so the only fix is an image that carries
 * its own dark background.
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
const LOGO = join(IMAGES, 'logo.png');

/** The white mark, trimmed of its transparent padding so sizing is predictable. */
const mark = (size) =>
  sharp(LOGO)
    .trim({ threshold: 10 })
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
async function icon(size, file, { rounded, dir = IMAGES }) {
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

  const png = await img.png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(join(dir, file), png);
  return [file, png.length];
}

const results = [
  await ogCover(),
  await icon(512, 'icon-512.png', { rounded: true }),
  await icon(180, 'apple-touch-icon.png', { rounded: false }),
  // app/icon.png is Next's file convention. metadata.icons currently shadows it,
  // but it is still served at /icon.png, so keep it in sync.
  await icon(512, 'icon.png', { rounded: true, dir: join(WEB, 'src', 'app') })
];
for (const [file, bytes] of results) console.log(`${file}  ${(bytes / 1024).toFixed(0)}KB`);
