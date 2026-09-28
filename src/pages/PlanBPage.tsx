import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { KineticCanvas } from '../components/KineticCanvas';
import './PlanBPage.css';

export const PlanBPage: React.FC<{ isReducedMotion?: boolean }> = ({ isReducedMotion = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.terminal-section',
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.25,
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
      gsap.fromTo(
        '.terminal-btn',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out', delay: 1.4 }
      );
      gsap.fromTo(
        '.terminal-meta',
        { opacity: 0 },
        { opacity: 0.45, duration: 1, ease: 'power2.out', delay: 1.8 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  return (
    <div className="plan-b-page" ref={containerRef}>
      <KineticCanvas isReducedMotion={isReducedMotion} />

      <main className="plan-b-stage">
        <div className="terminal-card">
          {/* Section 01 */}
          <section className="terminal-section">
            <header className="terminal-header mono">
              <span className="terminal-num">01</span>
              <span className="terminal-tag">IDENTITY</span>
            </header>
            <h1 className="terminal-headline">
              <span>i am a</span>
              <span><em>multidisciplinary</em></span>
              <span>creative.</span>
            </h1>
          </section>

          {/* Section 02 */}
          <section className="terminal-section">
            <header className="terminal-header mono">
              <span className="terminal-num">02</span>
              <span className="terminal-tag">PRACTICE</span>
            </header>
            <p className="terminal-practice">
              systems, geometry nodes, motion, intelligence.
            </p>
          </section>

          {/* Section 03 */}
          <section className="terminal-section">
            <header className="terminal-header mono">
              <span className="terminal-num">03</span>
              <span className="terminal-tag">INDEX</span>
            </header>
            <p className="terminal-index">
              Work held in private index. Inquire for access.
            </p>
          </section>

          {/* Actions */}
          <div className="terminal-actions">
            <div className="terminal-cta-row">
              <Link to="/notes" className="terminal-btn mono">
                read blog
              </Link>
              <Link to="/contact" className="terminal-btn mono">
                inquire
              </Link>
            </div>
            <div className="terminal-meta mono">
              <span>bali / wita</span>
              <span className="dot">·</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
