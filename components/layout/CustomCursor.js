// src/components/layout/CustomCursor.js
'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  const pos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animateFollower = () => {
      followerPos.current.x += (pos.current.x - followerPos.current.x) * 0.1;
      followerPos.current.y += (pos.current.y - followerPos.current.y) * 0.1;

      if (followerRef.current) {
        followerRef.current.style.left = `${followerPos.current.x}px`;
        followerRef.current.style.top = `${followerPos.current.y}px`;
      }

      requestAnimationFrame(animateFollower);
    };

    window.addEventListener('mousemove', moveCursor);
    const raf = requestAnimationFrame(animateFollower);

    const hoverAdd = () => {
      cursorRef.current?.classList.add('hovered');
      followerRef.current?.classList.add('hovered');
    };

    const hoverRemove = () => {
      cursorRef.current?.classList.remove('hovered');
      followerRef.current?.classList.remove('hovered');
    };

    const elements = document.querySelectorAll('a, button');

    elements.forEach((el) => {
      el.addEventListener('mouseenter', hoverAdd);
      el.addEventListener('mouseleave', hoverRemove);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(raf);

      elements.forEach((el) => {
        el.removeEventListener('mouseenter', hoverAdd);
        el.removeEventListener('mouseleave', hoverRemove);
      });
    };
  }, []);

  return (
    <>
      <style>{`
        #cursor-dot {
          width: 8px;
          height: 8px;
          background: #EA002A;
          border-radius: 50%;
          position: fixed;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 99999;
          transition: width 0.2s, height 0.2s, background 0.2s;
        }

        #cursor-dot.hovered {
          width: 14px;
          height: 14px;
          background: #fff;
        }

        #cursor-follower {
          width: 36px;
          height: 36px;
          border: 2px solid rgba(234, 0, 42, 0.5);
          border-radius: 50%;
          position: fixed;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 99998;
          transition: width 0.3s, height 0.3s, border-color 0.3s;
        }

        #cursor-follower.hovered {
          width: 50px;
          height: 50px;
          border-color: rgba(234, 0, 42, 0.8);
        }
      `}</style>

      <div id="cursor-dot" ref={cursorRef} />
      <div id="cursor-follower" ref={followerRef} />
    </>
  );
}