import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { KineticCanvas } from '../components/KineticCanvas';
import './ContactPage.css';

/**
 * Contact — DM is the door.
 *
 * The page says: Instagram is the only door. That's intentional.
 * If someone wants the portfolio, they have to ask for it.
 * Most designer portfolios are open by default. This one isn't.
 */

export const ContactPage: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = headingRef.current?.querySelectorAll('.heading-line');
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.18, duration: 1.2, ease: 'power3.out', delay: 0.4 }
        );
      }
      gsap.fromTo(
        bodyRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 1.4 }
      );
      gsap.fromTo(
        ctaRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 1.8 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="contact-page">
      <KineticCanvas />

      <main className="contact-stage">
        <section className="contact-content center-column">
          <h1 className="contact-heading" ref={headingRef}>
            <span className="heading-line">if you want my</span>
            <span className="heading-line"><em>portfolio</em>,</span>
            <span className="heading-line">dm me on instagram.</span>
          </h1>

          <p className="contact-body" ref={bodyRef}>
            i don't publish work here on a webpage. not yet.
            <br />
            if it's worth seeing, it's a conversation.
          </p>

          <a
            ref={ctaRef}
            href="https://instagram.com/njay.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-cta mono"
          >
            <span>instagram.com/njay.pro</span>
            <span className="cta-arrow">→</span>
          </a>
        </section>
      </main>
    </div>
  );
};
