'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export function AosInit() {
  useEffect(() => {
    AOS.init({
      debounceDelay: 40,
      duration: 920,
      easing: 'ease-out-back',
      mirror: true,
      offset: 90,
      once: false
    });

    const refresh = () => AOS.refreshHard();
    window.addEventListener('load', refresh, { once: true });

    return () => window.removeEventListener('load', refresh);
  }, []);

  return null;
}
