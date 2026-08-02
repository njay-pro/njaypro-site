import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SignalRail } from '../components/SignalRail';
import { ThreeSculpture } from '../components/ThreeSculpture';
import { P5Field, FieldState } from '../components/P5Field';
import './BuilderPage.css';

gsap.registerPlugin(ScrollTrigger);

interface BuilderPageProps {
  isReducedMotion?: boolean;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({ isReducedMotion = false }) => {
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [fieldState, setFieldState] = useState<FieldState>('LATENT');
  const heroRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const identityNodes = [
    {
      id: '01',
      category: '01 / FABRICATION',
      title: 'Material & Tension',
      payload: 'Before pixels, material taught me that every line has to hold.',
      signal: 'amber' as const,
    },
    {
      id: '02',
      category: '02 / VISUAL SYSTEMS',
      title: 'Cohesive Direction',
      payload: 'Identity is not decoration. It is how many decisions learn to speak as one.',
      signal: 'mint' as const,
    },
    {
      id: '03',
      category: '03 / PROCEDURAL WORLDS',
      title: 'Geometry & Logic',
      payload: 'Geometry Nodes made logic visible: fields, instances, constraints, outcomes.',
      signal: 'cyan' as const,
    },
    {
      id: '04',
      category: '04 / AGENT SYSTEMS',
      title: 'Full-Stack Execution',
      payload: 'AI made the engineering layer available. I stopped handing the build away.',
      signal: 'mint' as const,
    },
  ];

  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero headline sequence animation
      const heroLines = heroRef.current?.querySelectorAll('.hero-line');
      if (heroLines && heroLines.length > 0) {
        gsap.fromTo(
          heroLines,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.15,
          }
        );
      }

      // ScrollTrigger for Identity Nodes & Field State updates
      nodesRef.current.forEach((node, index) => {
        if (!node) return;
        ScrollTrigger.create({
          trigger: node,
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: () => {
            setActiveNodeIndex(index);
            setFieldState('EVALUATING');
          },
          onEnterBack: () => {
            setActiveNodeIndex(index);
            setFieldState('EVALUATING');
          },
        });
      });

      // Proof output section triggers RESOLVED state
      const proofSection = document.getElementById('proof-output');
      if (proofSection) {
        ScrollTrigger.create({
          trigger: proofSection,
          start: 'top 70%',
          onEnter: () => setFieldState('RESOLVED'),
          onLeaveBack: () => setFieldState('EVALUATING'),
        });
      }
    });

    return () => ctx.revert();
  }, [isReducedMotion]);

  const scrollToGraph = () => {
    const graphSection = document.getElementById('identity-graph');
    if (graphSection) {
      graphSection.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <div className="builder-page">
      <P5Field fieldState={fieldState} activeSignal={identityNodes[activeNodeIndex]?.signal || 'mint'} isReducedMotion={isReducedMotion} />
      <ThreeSculpture mode="identity" activeIndex={activeNodeIndex} isReducedMotion={isReducedMotion} />

      <SignalRail
        currentStep={activeNodeIndex}
        totalSteps={4}
        stepLabels={identityNodes.map((n) => n.id)}
        signalColor={identityNodes[activeNodeIndex]?.signal || 'mint'}
      />

      <main id="main-content">
        {/* 1. Hero Section */}
        <section className="hero-section section container" ref={heroRef}>
          <div className="hero-content">
            <div className="eyebrow font-mono">
              <span className="socket amber" />
              <span>NJAY / MULTIDISCIPLINARY BUILDER</span>
            </div>

            <h1 className="hero-title font-display">
              <span className="hero-line block">I WAS TRAINED</span>
              <span className="hero-line block text-highlight">BY STEEL.</span>
              <span className="hero-line block">THEN SYSTEMS.</span>
              <span className="hero-line block text-signal-mint">NOW INTELLIGENCE.</span>
            </h1>

            <p className="hero-subhead">
              I design the thing, shape the story, and build the system that makes it move.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={scrollToGraph}
                aria-label="Scroll to Identity Graph"
              >
                <span>Enter the graph</span>
                <span>↓</span>
              </button>

              <Link to="/archetype" className="btn btn-ghost">
                <span>The first public node → Archetype Router</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Identity Spatial Spine Section (Connected Wire Rail, NO cards grid) */}
        <section id="identity-graph" className="section container identity-spine-section">
          <div className="section-header">
            <span className="font-mono text-muted">SYSTEM_GRAPH // IDENTITY_NODES</span>
            <h2 className="section-title font-display">Procedural Origin & Progression</h2>
          </div>

          <div className="identity-spine-container">
            {/* SVG Connecting Wire Rail */}
            <svg className="spine-wire-svg" aria-hidden="true" preserveAspectRatio="none">
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="var(--line-structural)" strokeWidth="2" />
              <line
                x1="50%"
                y1="0"
                x2="50%"
                y2={`${((activeNodeIndex + 1) / 4) * 100}%`}
                stroke="var(--signal-mint)"
                strokeWidth="2"
                className="wire-active-pulse"
              />
            </svg>

            <div className="spine-nodes-list">
              {identityNodes.map((node, index) => {
                const isActive = activeNodeIndex === index;
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={node.id}
                    ref={(el) => (nodesRef.current[index] = el)}
                    className={`spine-node-moment ${isEven ? 'left' : 'right'} ${isActive ? 'active' : ''}`}
                  >
                    <div className="spine-socket-anchor">
                      <span className={`socket ${node.signal} ${isActive ? 'pulse' : ''}`} />
                    </div>

                    <div className="spine-node-content panel-interactive">
                      <div className="spine-node-header">
                        <span className="font-mono text-muted">{node.category}</span>
                        <span className="font-mono text-signal-cyan">NODE_0{index + 1}</span>
                      </div>
                      <h3 className="spine-node-title font-display">{node.title}</h3>
                      <p className="spine-node-payload">{node.payload}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Manifesto Frame Section (Full-frame statement, NO enclosing border panel) */}
        <section className="section container manifesto-section">
          <div className="manifesto-full-frame">
            <div className="manifesto-content">
              <p className="manifesto-line font-display">
                Industrialization split the person who imagines it, the person who makes it beautiful, and the person who builds it.
              </p>
              <p className="manifesto-line font-display text-signal-amber">
                I never fit that split.
              </p>
              <h2 className="manifesto-headline font-display text-signal-mint">
                Call me a builder.
              </h2>
            </div>
          </div>
        </section>

        {/* 4. AI Thesis Section (Clean typographic statement, NO marketing panel box) */}
        <section className="section container thesis-section">
          <div className="thesis-statement-container">
            <span className="font-mono text-signal-cyan">PARADIGM_SHIFT // 004</span>
            <h2 className="thesis-title font-display">
              AI IS NOT MY NEW DISCIPLINE.
            </h2>
            <p className="thesis-counterline font-display text-signal-mint">
              IT IS THE ENGINEERING LAYER COMING BACK TO DESIGN.
            </p>

            <p className="thesis-body">
              A pure engineer can disappear into complexity. A pure creative can ignore the machine. The useful position is between them: enough judgment to know what should exist, enough appetite to make it real.
            </p>
          </div>
        </section>

        {/* 5. Shipped Proof / Route Output Section */}
        <section id="proof-output" className="section container proof-section">
          <div className="output-node-card panel">
            <div className="output-header">
              <div className="eyebrow font-mono text-signal-mint">
                <span className="socket mint" />
                <span>OUTPUT / 001 / OPEN SOURCE</span>
              </div>
              <span className="font-mono text-muted">RELEASE_V1.0.0</span>
            </div>

            <h2 className="output-title font-display">
              One subagent is not a system.
            </h2>
            <h3 className="output-product font-mono text-signal-cyan">
              Hermes Archetype Router
            </h3>

            <p className="output-body">
              Five specialist minds. Each with a different model, persona, tool boundary, horizon, and skill context.
            </p>

            <div className="output-actions">
              <Link to="/archetype" className="btn btn-primary">
                <span>Follow the signal</span>
                <span>→</span>
              </Link>

              <a
                href="https://github.com/njay-pro/hermes-archetype-subagent"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <span>View on GitHub</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 6. Footer Section */}
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand font-mono">
              <p className="footer-title">NJAY — BALI / WITA</p>
              <p className="footer-sub text-muted">DESIGN / SYSTEMS / 3D / AI</p>
            </div>

            <div className="footer-links font-mono">
              <a
                href="https://github.com/njay-pro"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub ↗
              </a>
              <a href="mailto:hello@njay.pro" className="footer-link">
                hello@njay.pro
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
