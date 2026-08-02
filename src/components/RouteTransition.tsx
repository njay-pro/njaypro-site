import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<HTMLDivElement>(null);
  const clickPosRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
  });

  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Global listener to record last click/tap origin coordinates
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const socketEl = target.closest('.socket, .btn, a, button') as HTMLElement | null;
        if (socketEl) {
          const rect = socketEl.getBoundingClientRect();
          clickPosRef.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
          return;
        }
      }
      clickPosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion || !overlayRef.current || !socketRef.current) return;

    const { x, y } = clickPosRef.current;

    // Position socket at clicked origin coordinates
    gsap.set(socketRef.current, {
      left: `${x}px`,
      top: `${y}px`,
      scale: 0.1,
      opacity: 1,
    });

    gsap.set(overlayRef.current, {
      display: 'block',
      opacity: 1,
    });

    const tl = gsap.timeline();

    tl.to(socketRef.current, {
      scale: 85,
      duration: 0.38,
      ease: 'power3.inOut',
    }).to(overlayRef.current, {
      opacity: 0,
      duration: 0.22,
      ease: 'power2.out',
      onComplete: () => {
        if (overlayRef.current) {
          overlayRef.current.style.display = 'none';
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, [location.pathname, isReducedMotion]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 'var(--z-overlay)',
          pointerEvents: 'none',
          display: 'none',
          background: 'transparent',
          overflow: 'hidden',
        }}
      >
        <div
          ref={socketRef}
          style={{
            position: 'absolute',
            width: '24px',
            height: '24px',
            marginLeft: '-12px',
            marginTop: '-12px',
            borderRadius: '50%',
            backgroundColor: 'var(--signal-mint)',
            transformOrigin: 'center center',
          }}
        />
      </div>
      {children}
    </>
  );
};
