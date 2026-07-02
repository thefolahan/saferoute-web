'use client';

import { useEffect, useState } from 'react';

const globeHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
    <style>
      html,
      body {
        width: 100vw;
        height: 100vh;
        min-width: 320px;
        min-height: 320px;
        margin: 0;
        overflow: hidden;
        background: #000204;
        touch-action: none;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
      }

      #globeViz {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        min-width: 320px;
        min-height: 320px;
        overflow: hidden;
        background: transparent;
        touch-action: none;
        z-index: 1;
      }

      canvas {
        display: block;
      }

      #webStars,
      #webStars2 {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image:
          radial-gradient(circle, rgba(255,255,255,0.72) 0 1px, transparent 1.5px),
          radial-gradient(circle, rgba(255,255,255,0.42) 0 1px, transparent 1.7px),
          radial-gradient(circle, rgba(255,255,255,0.52) 0 1px, transparent 1.6px),
          radial-gradient(circle, rgba(255,255,255,0.28) 0 1px, transparent 1.5px);
        background-position: 8% 18%, 26% 68%, 72% 28%, 88% 82%;
        background-size: 120px 120px, 170px 170px, 210px 210px, 260px 260px;
        animation: twinkle 2.8s ease-in-out infinite alternate;
      }

      #webStars2 {
        opacity: 0.55;
        background-position: 18% 74%, 46% 20%, 66% 88%, 92% 36%;
        background-size: 150px 150px, 190px 190px, 230px 230px, 290px 290px;
        animation-delay: -1.4s;
        animation-duration: 3.6s;
      }

      @keyframes twinkle {
        0% { opacity: 0.18; }
        45% { opacity: 0.78; }
        100% { opacity: 0.32; }
      }

      #loading {
        position: absolute;
        inset: 0;
        display: none;
        place-items: center;
        color: rgba(255,255,255,0.7);
        font-size: 13px;
        font-weight: 700;
        z-index: 2;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/globe.gl@2.41.3/dist/globe.gl.min.js"></script>
  </head>
  <body>
    <div id="webStars"></div>
    <div id="webStars2"></div>
    <div id="globeViz"></div>
    <div id="loading"></div>
    <script>
      const loading = document.getElementById('loading');

      function getViewportSize() {
        return {
          width: Math.max(
            document.documentElement.clientWidth,
            window.innerWidth,
            360
          ),
          height: Math.max(
            document.documentElement.clientHeight,
            window.innerHeight,
            360
          )
        };
      }

      function showError(message) {
        loading.textContent = message;
        loading.style.display = 'grid';
      }

      function bootGlobe() {
        try {
          if (!window.Globe || !window.THREE) {
            setTimeout(bootGlobe, 300);
            return;
          }

          const viewport = getViewportSize();
          const world = new Globe(document.getElementById('globeViz'), {
            animateIn: false
          })
            .width(viewport.width)
            .height(viewport.height)
            .backgroundColor('rgba(0,0,0,0)')
            .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
            .showAtmosphere(false);

          const controls = world.controls();
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.85;
          controls.enableZoom = false;
          controls.enablePan = false;
          controls.minPolarAngle = 0;
          controls.maxPolarAngle = Math.PI;

          world.pointOfView({ lat: 8, lng: 12, altitude: 2.15 }, 0);

          const CLOUDS_IMG_URL = 'https://cdn.jsdelivr.net/gh/vasturiano/globe.gl/example/clouds/clouds.png';
          const CLOUDS_ALT = 0.004;
          const CLOUDS_ROTATION_SPEED = -0.006;
          const textureLoader = new THREE.TextureLoader();
          textureLoader.setCrossOrigin('anonymous');
          textureLoader.load(CLOUDS_IMG_URL, (cloudsTexture) => {
            const clouds = new THREE.Mesh(
              new THREE.SphereGeometry(
                world.getGlobeRadius() * (1 + CLOUDS_ALT),
                75,
                75
              ),
              new THREE.MeshPhongMaterial({
                map: cloudsTexture,
                transparent: true,
                opacity: 0.34,
                depthWrite: false
              })
            );

            world.scene().add(clouds);

            (function rotateClouds() {
              clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
              requestAnimationFrame(rotateClouds);
            })();
          });

          window.addEventListener('resize', () => {
            const nextViewport = getViewportSize();
            world.width(nextViewport.width).height(nextViewport.height);
          });

          setTimeout(() => {
            loading.style.display = 'none';
          }, 500);
        } catch {
          showError('Globe unavailable.');
        }
      }

      bootGlobe();
    </script>
  </body>
</html>
`;

export function EarthGlobe() {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    setSrcDoc(globeHtml);
  }, []);

  return (
    <iframe
      className="earth-globe"
      srcDoc={srcDoc}
      title="Rotating Earth globe"
      aria-label="Rotating Earth globe"
      scrolling="no"
    />
  );
}
