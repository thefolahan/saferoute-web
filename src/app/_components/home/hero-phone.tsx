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
    <div className="relative h-full">
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
        className="aspect-[9/16] h-full w-auto max-w-none object-contain"
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
            sizes="(min-width: 1024px) 440px, (min-width: 640px) 440px, 300px"
            className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-100 ${
              i === shown ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
