import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { KineticCanvas } from '../components/KineticCanvas';
import './PlanCPage.css';

export const PlanCPage: React.FC<{ isReducedMotion?: boolean }> = ({ isReducedMotion = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.manifest-rule',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.out', stagger: 0.3 }
      );
      gsap.fromTo(
        '.manifest-headline',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
      );
      gsap.fromTo(
        '.manifest-col',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: 'power2.out', delay: 0.9 }
      );
      gsap.fromTo(
        '.manifest-footer',
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: 'power2.out', delay: 1.3 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <div className="plan-c-page" ref={containerRef}>
      <KineticCanvas isReducedMotion={isReducedMotion} />

      <main className="manifest-stage">
        {/* Top Rule */}
        <div className="manifest-rule" />

        {/* Hero Zone */}
        <section className="manifest-hero">
          <h1 className="manifest-headline">
            i am a <em>multidisciplinary</em> creative.
          </h1>
        </section>

        {/* Middle Rule */}
        <div className="manifest-rule" />

        {/* Register Zone (2 columns) */}
        <section className="manifest-register">
          <div className="manifest-col">
            <span className="manifest-label mono">DISCIPLINE</span>
            <ul className="manifest-list">
              <li>brand identity</li>
              <li>procedural 3d</li>
              <li>motion graphics</li>
              <li>agent systems</li>
            </ul>
          </div>

          <div className="manifest-col">
            <span className="manifest-label mono">STATUS</span>
            <p className="manifest-status-text">
              Commercial work is held in private consultation.
            </p>
          </div>
        </section>

        {/* Bottom Rule */}
        <div className="manifest-rule" />

        {/* Action Zone */}
        <footer className="manifest-footer">
          <div className="manifest-cta-row">
            <Link to="/notes" className="manifest-btn mono">
              read the blog ↗
            </Link>
            <Link to="/contact" className="manifest-btn mono">
              inquire ↗
            </Link>
          </div>

          <div className="manifest-meta mono">
            <span>bali / wita</span>
            <span className="dot">·</span>
            <span>architectural register</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
