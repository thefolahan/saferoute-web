'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Globe?: new (element: HTMLElement, options?: { animateIn?: boolean }) => GlobeInstance;
    THREE?: {
      Mesh: new (geometry: unknown, material: unknown) => unknown;
      MeshPhongMaterial: new (options: Record<string, unknown>) => unknown;
      SphereGeometry: new (radius: number, widthSegments: number, heightSegments: number) => unknown;
      TextureLoader: new () => {
        load: (url: string, onLoad: (texture: unknown) => void) => void;
        setCrossOrigin: (crossOrigin: string) => void;
      };
    };
  }
}

type GlobeControls = {
  autoRotate: boolean;
  autoRotateSpeed: number;
  enablePan: boolean;
  enableZoom: boolean;
  maxPolarAngle: number;
  minPolarAngle: number;
};

type GlobeInstance = {
  backgroundColor: (color: string) => GlobeInstance;
  bumpImageUrl: (url: string) => GlobeInstance;
  controls: () => GlobeControls;
  getGlobeRadius: () => number;
  globeImageUrl: (url: string) => GlobeInstance;
  height: (height: number) => GlobeInstance;
  pointOfView: (point: { altitude: number; lat: number; lng: number }, duration: number) => GlobeInstance;
  scene: () => { add: (object: unknown) => void };
  showAtmosphere: (show: boolean) => GlobeInstance;
  width: (width: number) => GlobeInstance;
};

const scripts = [
  'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js',
  'https://cdn.jsdelivr.net/npm/globe.gl@2.41.3/dist/globe.gl.min.js'
];
const earthImageUrl = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg';
const earthBumpUrl = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png';
const cloudsImageUrl = 'https://cdn.jsdelivr.net/gh/vasturiano/globe.gl/example/clouds/clouds.png';

let loadPromise: Promise<void> | undefined;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (existing?.dataset.loaded === 'true') {
      resolve();
      return;
    }

    const script = existing ?? document.createElement('script');

    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));

    if (!existing) {
      document.head.appendChild(script);
    }
  });
}

function loadGlobeScripts() {
  loadPromise ??= scripts.reduce(
    (promise, src) => promise.then(() => loadScript(src)),
    Promise.resolve()
  );

  return loadPromise;
}

function sizeFor(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const size = Math.max(320, Math.floor(Math.min(rect.width, rect.height)));

  return { height: size, width: size };
}

export function EarthGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let animationId = 0;
    let resizeObserver: ResizeObserver | undefined;

    void loadGlobeScripts().then(() => {
      const container = containerRef.current;
      const Globe = window.Globe;
      const THREE = window.THREE;

      if (!container || !Globe || !THREE || cancelled) {
        return;
      }

      container.replaceChildren();

      const dimensions = sizeFor(container);
      const world = new Globe(container, { animateIn: false })
        .width(dimensions.width)
        .height(dimensions.height)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl(earthImageUrl)
        .bumpImageUrl(earthBumpUrl)
        .showAtmosphere(false);

      const controls = world.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.85;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = 0;
      controls.maxPolarAngle = Math.PI;

      world.pointOfView({ altitude: 2.15, lat: 8, lng: 12 }, 0);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.setCrossOrigin('anonymous');
      textureLoader.load(cloudsImageUrl, (cloudsTexture) => {
        if (cancelled) {
          return;
        }

        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(world.getGlobeRadius() * 1.004, 75, 75),
          new THREE.MeshPhongMaterial({
            depthWrite: false,
            map: cloudsTexture,
            opacity: 0.34,
            transparent: true
          })
        ) as { rotation?: { y: number } };

        world.scene().add(clouds);

        const rotateClouds = () => {
          if (cancelled) {
            return;
          }

          if (clouds.rotation) {
            clouds.rotation.y += (-0.006 * Math.PI) / 180;
          }

          animationId = window.requestAnimationFrame(rotateClouds);
        };

        rotateClouds();
      });

      resizeObserver = new ResizeObserver(() => {
        const next = sizeFor(container);
        world.width(next.width).height(next.height);
      });
      resizeObserver.observe(container);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationId);
      resizeObserver?.disconnect();
      containerRef.current?.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className="earth-globe" aria-label="Rotating Earth globe" role="img" />;
}
