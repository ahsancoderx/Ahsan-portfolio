'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { loadFull } from 'tsparticles';

const Particles = dynamic(
  () => import('@tsparticles/react').then((m) => m.default),
  { ssr: false }
);

export default function GlobalParticles() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 }, // ✅ IMPORTANT
        background: { color: 'transparent' },
        particles: {
          number: { value: 60 },
          color: { value: '#E05C40' },
          links: {
            enable: true,
            color: '#E05C40',
            distance: 150,
          },
          move: {
            enable: true,
            speed: 1.5,
          },
          size: { value: 2 },
        },
      }}
    />
  );
}