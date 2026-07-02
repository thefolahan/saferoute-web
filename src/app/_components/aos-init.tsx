'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export function AosInit() {
  useEffect(() => {
    AOS.init({
      duration: 760,
      easing: 'ease-out-cubic',
      mirror: true,
      offset: 70,
      once: false
    });

    const refresh = () => AOS.refreshHard();
    window.addEventListener('load', refresh, { once: true });

    return () => window.removeEventListener('load', refresh);
  }, []);

  return null;
}
