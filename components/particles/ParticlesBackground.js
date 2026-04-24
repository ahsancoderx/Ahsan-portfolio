'use client';

import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from 'tsparticles-slim';

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },

        background: {
          color: 'transparent',
        },

        particles: {
          number: { value: 40 },
          color: { value: '#E05C40' },

          links: {
            enable: true,
            color: '#E05C40',
            opacity: 0.2,
          },

          move: {
            enable: true,
            speed: 1,
          },

          size: {
            value: 2,
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
          },
        },
      }}
    />
  );
}