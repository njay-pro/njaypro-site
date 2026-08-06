import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { KineticCanvas } from '../components/KineticCanvas';
import './BuilderPage.css';

interface BuilderPageProps {
  isReducedMotion?: boolean;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({ isReducedMotion = false }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Headline: lines arrive one after another, slow and inevitable.
      const lines = headingRef.current?.querySelectorAll('.heading-line');
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.18,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.4,
          }
        );
      }
      // Sub line: arrive after the headline settles.
      gsap.fromTo(
        subRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 1.6 }
      );
      // Meta block: quiet fade at the end.
      gsap.fromTo(
        metaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power2.out', delay: 2.2 }
      );
    });

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <div className="home-page">
      {/* The kinetic canvas lives behind everything — particles + ASCII 3D form. */}
      <KineticCanvas isReducedMotion={isReducedMotion} />

      <main className="home-stage">
        <section className="home-statement center-column">
          <h1 className="home-heading" ref={headingRef}>
            <span className="heading-line">i'm a</span>
            <span className="heading-line"><em>multidisciplinary</em> designer.</span>
            <span className="heading-line">this is not your</span>
            <span className="heading-line">typical portfolio.</span>
          </h1>

          <p className="home-sub" ref={subRef}>
            3d, motion, graphics, and recently — a lot of ai.
            <br />
            if you want my portfolio, contact me by instagram.
          </p>

          <div className="home-meta mono" ref={metaRef}>
            <span>bali / wita</span>
            <span className="dot">·</span>
            <span>designer × engineer</span>
          </div>
        </section>
      </main>
    </div>
  );
};
