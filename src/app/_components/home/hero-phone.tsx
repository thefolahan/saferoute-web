'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const OVERLAYS = [
  '/images/landing/Live1.png',
  '/images/landing/Live2.png',
  '/images/landing/Live3.png',
  '/images/landing/Live4.png'
] as const;

const SEGMENT = 2;
const FADE_IN_AT = 0;
const FADE_OUT_AT = 1.8;

const SCREEN = 'inset-y-0 left-[8.6%] right-[8.9%]';

/**
 * The clip trims the black the render carries around the device: measured off a
 * frame, the body runs x 48-670 of 720 and its corners are ~96px round, while
 * top and bottom are already cropped flush by the frame.
 */
const DEVICE_CLIP = 'inset(0 6.9% 0 6.7% round 13.3% / 7.5%)';

export function HeroPhone() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = video.currentTime % (SEGMENT * OVERLAYS.length);
      const i = Math.min(OVERLAYS.length - 1, Math.floor(t / SEGMENT));
      const within = t - i * SEGMENT;
      const next =
        video.paused || (within >= FADE_IN_AT && within <= FADE_OUT_AT) ? i : -1;
      setShown((prev) => (prev === next ? prev : next));
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full sm:h-full sm:w-auto">
      <video
        ref={videoRef}
        src="/video/landing/phone-web.mp4"
        poster="/video/landing/phone-poster.jpg"
        aria-label="SafeRoute live broadcast of a road incident on the Lekki-Epe Expressway"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        width={720}
        height={1280}
        style={{ clipPath: DEVICE_CLIP }}
        className="aspect-[9/16] w-full max-w-none object-contain sm:h-full sm:w-auto"
      />

      <div className={`pointer-events-none absolute ${SCREEN}`} aria-hidden>
        {OVERLAYS.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={482}
            height={1000}
            priority={i === 0}
            sizes="(min-width: 640px) 440px, 396px"
            className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-100 ${
              i === shown ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
