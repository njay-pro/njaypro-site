import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { KineticCanvas } from '../components/KineticCanvas';
import './BuilderPage.css';

interface BuilderPageProps {
  isReducedMotion?: boolean;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({ isReducedMotion = false }) => {
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const gateRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Eyebrow
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.8, ease: 'power2.out', delay: 0.3 }
      );

      // 2. Headline lines stagger in
      const lines = headingRef.current?.querySelectorAll('.heading-line');
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.16,
            duration: 1.1,
            ease: 'power3.out',
            delay: 0.5,
          }
        );
      }

      // 3. Sub practice line
      gsap.fromTo(
        subRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 0.72, duration: 0.9, ease: 'power2.out', delay: 1.3 }
      );

      // 4. Elevated portfolio gate line
      gsap.fromTo(
        gateRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 0.52, duration: 0.9, ease: 'power2.out', delay: 1.7 }
      );

      // 5. CTA Buttons
      gsap.fromTo(
        ctaRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 2.1 }
      );

      // 6. Meta block
      gsap.fromTo(
        metaRef.current,
        { opacity: 0 },
        { opacity: 0.45, duration: 1.2, ease: 'power2.out', delay: 2.5 }
      );
    });

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <div className="home-page">
      {/* Fixed background ambient canvas */}
      <KineticCanvas isReducedMotion={isReducedMotion} />

      <main className="home-stage">
        <section className="home-statement center-column">
          <span className="home-eyebrow mono" ref={eyebrowRef}>
            NJAY / BALI
          </span>

          <h1 className="home-heading" ref={headingRef}>
            <span className="heading-line">i am a</span>
            <span className="heading-line"><em>multidisciplinary</em></span>
            <span className="heading-line">creative.</span>
          </h1>

          <p className="home-sub" ref={subRef}>
            brand identity, procedural 3d, motion, and agent systems.
          </p>

          <p className="home-gate" ref={gateRef}>
            Commercial work is unindexed. Selected case studies available upon introduction.
          </p>

          <div className="home-cta-row" ref={ctaRef}>
            <Link to="/notes" className="btn-atelier btn-primary">
              read the blog
            </Link>
            <Link to="/contact" className="btn-atelier btn-secondary">
              inquire
            </Link>
          </div>

          <div className="home-meta mono" ref={metaRef}>
            <span>bali / wita</span>
            <span className="dot">·</span>
            <span>design × systems × intelligence</span>
          </div>
        </section>
      </main>
    </div>
  );
};
