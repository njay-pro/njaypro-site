import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { KineticCanvas } from '../components/KineticCanvas';
import './ArchetypePage.css';

/* =====================================================================
   HERMES ARCHETYPE ROUTER — STORY-DRIVEN LANDING
   Story arc beats (mirroring OMO + memPalace):
     1. THE MOMENT  — the moment you felt it.
     2. THE GAP     — what is missing in the world.
     3. THE SYSTEM  — five archetypes, picked by intent.
     4. THE PROOF   — same prompt, different minds.
     5. THE DOOR    — open source, install in 7 lines.
     . FOR BUILDERS — quiet code tail, optional.
   ===================================================================== */

export interface Archetype {
  id: string;
  glyph: string;
  role: string;
  tagline: string;       // 1-line in plain language
  when: string;          // 1-line use case
  counter: string;       // 1-line contrast
  signal: 'amber' | 'mint' | 'cyan' | 'oxide';
}

export const ARCHETYPES_DATA: Archetype[] = [
  {
    id: 'consultant',
    glyph: '◆',
    role: 'Consultant',
    tagline: 'Reads the room, then decides.',
    when: 'Open-ended problems, ambiguous input, "we need a recommendation."',
    counter: 'A single LLM guesses — a Consultant weighs options and commits.',
    signal: 'amber',
  },
  {
    id: 'long-horizon',
    glyph: '☰',
    role: 'Long-Horizon',
    tagline: 'Carries the build across the whole day.',
    when: 'Multi-step execution with files, terminals, and a real plan.',
    counter: 'A single LLM forgets by step 3 — Long-Horizon owns the plan end-to-end.',
    signal: 'mint',
  },
  {
    id: 'high-hallucination',
    glyph: '✦',
    role: 'High-Hallucination',
    tagline: 'Opens three alternatives, not one answer.',
    when: 'Creative direction, divergent options, "show me the range."',
    counter: 'A single LLM converges too fast — High-Hallucination explores the map before picking.',
    signal: 'oxide',
  },
  {
    id: 'speedster-internal',
    glyph: '▣',
    role: 'Speedster · Internal',
    tagline: 'Reads the machine, fast.',
    when: 'File scans, repo searches, deterministic extraction.',
    counter: 'A single LLM times out — Speedster returns the matching paths in seconds.',
    signal: 'cyan',
  },
  {
    id: 'speedster-internet',
    glyph: '◌',
    role: 'Speedster · Internet',
    tagline: 'Reads the network, fast.',
    when: 'Endpoint extraction, breaking-change lookups, web pre-filtering.',
    counter: 'A single LLM tries too much — Speedster fetches, parses, hands back the delta.',
    signal: 'cyan',
  },
];

export const ACCURATE_INSTALL_PROMPT = `Install Hermes Archetype Router v1.0.0 from:
https://github.com/njay-pro/hermes-archetype-subagent

Do the installation end-to-end:
1. Clone tag v1.0.0 to ~/.hermes/plugins/archetype-router.
2. Install its development and test dependencies with \`uv sync --extra dev --extra test\`.
3. Discover every Hermes profile under ~/.hermes/profiles/ and symlink each
   profile's plugins/archetype-router to the canonical clone.
4. Read archetype_model_config.json and register every \`arc-*\` combo in each
   profile with \`hermes config set custom_providers.0.models.<combo>.context_length 1000000 --force\`.
5. Run the plugin test suite.
6. Restart the gateway so Hermes loads the plugin.
7. Verify a real \`delegate_task_consultant\` call and report the exact result.

If a step fails, stop and report the failed step and real error. Do not invent a workaround.`;

/* =====================================================================
   SECTION 4: PROOF — Same prompt, different minds.
   We pick one real, meaningful prompt and show how five archetypes
   answer it differently. This is the visceral "oh, that's the point"
   beat — OMO does this with `delegation_mode`, memPalace with
   `image → prompt → memory → image`.
   ===================================================================== */

interface SamePromptBeat {
  prompt: string;
  context: string;
  archetype: string;
  headline: string;
  bullets: string[];
}

const SAME_PROMPT_BEATS: SamePromptBeat[] = [
  {
    prompt: '"Should we keep the existing checkout or move to a headless storefront?"',
    context: 'A real decision, not a demo.',
    archetype: 'consultant',
    headline: 'A Consultant weighs the tradeoffs and commits.',
    bullets: [
      'Surfaces revenue impact, retention, ops cost, and brand risk.',
      'Commits to one of three scenarios, with a 90-day rollout.',
      'Returns a one-paragraph recommendation, not a survey.',
    ],
  },
  {
    prompt: '"Plan, implement, and verify the storefront migration."',
    context: 'A multi-day body of work.',
    archetype: 'long-horizon',
    headline: 'Long-Horizon owns the plan end-to-end.',
    bullets: [
      'Reads the migration brief, opens the milestones, runs the tests.',
      'Surfaces blockers as they appear — never silently skips.',
      'Returns when the build is green, or when it has the real reason it is not.',
    ],
  },
  {
    prompt: '"Show me three different homepage directions before we commit to one."',
    context: 'A creative fork in the road.',
    archetype: 'high-hallucination',
    headline: 'High-Hallucination explores the map before picking.',
    bullets: [
      'Returns exactly three distinct directions, with explicit contrast.',
      'Cites the constraints each direction trades against.',
      'Refuses to converge too fast — that is the whole point.',
    ],
  },
  {
    prompt: '"Find every asset path in /brand that matches the word `warm`."',
    context: 'A local-machine task.',
    archetype: 'speedster-internal',
    headline: 'Speedster · Internal returns the matching paths in seconds.',
    bullets: [
      'Reads the file system, runs the matcher, returns paths only.',
      'No network surface, no terminal scope, no hallucinated names.',
      'Closes its own iteration loop before the parent is even watching.',
    ],
  },
  {
    prompt: '"Pull the breaking-change notes for v2 and v3 from the upstream changelogs."',
    context: 'A network task with two endpoints.',
    archetype: 'speedster-internet',
    headline: 'Speedster · Internet fetches, parses, hands back the delta.',
    bullets: [
      'Holds the endpoints in parallel, never serially.',
      'Returns the breaking notes only — not the full release page.',
      'Closes its own iteration loop before the parent is even watching.',
    ],
  },
];

/* =====================================================================
   SECTION 5: THE DOOR — A real install that takes 7 lines.
   One command + one paragraph of context. No wall of text.
   ===================================================================== */

interface DoorStep {
  n: number;
  label: string;
  detail: string;
}

const DOOR_STEPS: DoorStep[] = [
  { n: 1, label: 'Clone the v1.0.0 tag', detail: 'git clone --branch v1.0.0 https://github.com/njay-pro/hermes-archetype-subagent ~/.hermes/plugins/archetype-router' },
  { n: 2, label: 'Install dependencies', detail: 'cd ~/.hermes/plugins/archetype-router && uv sync --extra dev --extra test' },
  { n: 3, label: 'Register the five `arc-*` models in each Hermes profile', detail: 'For every profile under ~/.hermes/profiles/, set each `arc-*` model context to 1,000,000.' },
  { n: 4, label: 'Restart the Hermes gateway', detail: '`hermes gateway restart` — the plugin appears as five new delegate_task_* tools.' },
  { n: 5, label: 'Make one real call', detail: 'Run a real delegate_task_consultant in production — report the exact result.' },
];

interface ArchetypePageProps {
  isReducedMotion?: boolean;
}

export const ArchetypePage: React.FC<ArchetypePageProps> = ({ isReducedMotion = false }) => {
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<number>(1);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [installCopyState, setInstallCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [routeSettled, setRouteSettled] = useState(true);
  void routeSettled; void setRouteSettled; // legacy state — ThreeSculpture dep removed

  useEffect(() => {
    const settle = () => setRouteSettled(true);
    window.addEventListener('nodal-route-settled', settle);
    const frame = window.requestAnimationFrame(settle);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('nodal-route-settled', settle);
    };
  }, []);

  const handleArchetypeSelect = (index: number) => {
    setSelectedArchetypeIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleArchetypeSelect(index);
      return;
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % ARCHETYPES_DATA.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + ARCHETYPES_DATA.length) % ARCHETYPES_DATA.length;
    } else {
      return;
    }
    handleArchetypeSelect(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const copyText = async (text: string, setState: (s: 'idle' | 'copied' | 'failed') => void) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setState('copied');
      window.setTimeout(() => setState('idle'), 2400);
    } catch {
      setState('failed');
      window.setTimeout(() => setState('idle'), 3000);
    }
  };

  const selectedArchetype = ARCHETYPES_DATA[selectedArchetypeIndex];
  void selectedArchetype; // referenced inside the builders section JSX

  return (
    <div className="archetype-page">
      <KineticCanvas isReducedMotion={isReducedMotion} />

      <main id="main-content">
        {/* ============================================================
            BEAT 1 — THE MOMENT
            The first sentence is the moment you felt it. It is not a
            tagline. It is not a slogan. It is a real failure mode.
            ============================================================ */}
        <section className="hero-section section container">
          <div className="hero-content">
            <div className="eyebrow font-mono text-signal-mint">
              <span className="socket mint" />
              <span>OPEN SOURCE · HERMES AGENT PLUGIN · v1.0.0</span>
            </div>

            <h1 className="hero-title font-display">
              You watched one AI answer ten different questions with the same voice.
            </h1>

            <p className="hero-subhead font-display">
              We did too. That is why we built five minds instead.
            </p>

            <div className="hero-actions">
              <a
                href="#story-the-gap"
                className="btn btn-primary"
              >
                <span>Start at the beginning</span>
                <span>↓</span>
              </a>
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

        {/* ============================================================
            BEAT 2 — THE GAP
            What is missing in the world, told in Njay's voice.
            Three columns of "the gap," each one a real failure you have
            seen in production.
            ============================================================ */}
        <section id="story-the-gap" className="section container story-gap-section">
          <header className="story-section-header">
            <span className="font-mono text-signal-amber">01 · THE GAP</span>
            <h2 className="story-section-title font-display">
              Most agents are a single voice<br /> answering every kind of work.
            </h2>
          </header>

          <ol className="story-gap-list">
            <li className="story-gap-item">
              <span className="story-gap-num font-mono">A</span>
              <p>
                <strong>The architect that also does the dishes.</strong> One model,
                one prompt, one tone. A real decision and a typo fix get the same
                thirty seconds.
              </p>
            </li>
            <li className="story-gap-item">
              <span className="story-gap-num font-mono">B</span>
              <p>
                <strong>The long build that forgot step 3.</strong> Stateful,
                multi-day work that quietly loses context between calls — and
                silently invents the missing pieces.
              </p>
            </li>
            <li className="story-gap-item">
              <span className="story-gap-num font-mono">C</span>
              <p>
                <strong>The creative brief that converged too fast.</strong> One
                answer, when the brief was really asking for the range. The map
                was never drawn — only the destination.
              </p>
            </li>
          </ol>

          <p className="story-thesis font-display">
            Each failure is a missing kind of mind. The fix is not a bigger
            model. It is a <span className="text-signal-mint">router</span>.
          </p>
        </section>

        {/* ============================================================
            BEAT 3 — THE SYSTEM
            The five archetypes, explained in plain language, with the
            counter that names the failure each one closes.
            ============================================================ */}
        <section className="section container story-system-section">
          <header className="story-section-header">
            <span className="font-mono text-signal-mint">02 · THE SYSTEM</span>
            <h2 className="story-section-title font-display">
              Five kinds of mind.<br /> Pick by intent. The router picks the rest.
            </h2>
            <p className="story-section-lede">
              Each archetype is a specialist — model, persona, toolset, and a
              bounded horizon. You write the goal. The router writes the brief.
            </p>
          </header>

          <div className="archetype-grid" role="tablist" aria-label="Archetype selector">
            {/* Cards 1-3: Consultant, Long-Horizon, High-Hallucination */}
            {ARCHETYPES_DATA.slice(0, 3).map((arch, idx) => {
              const isSelected = idx === selectedArchetypeIndex;
              return (
                <button
                  key={arch.id}
                  ref={(el) => (tabRefs.current[idx] = el)}
                  type="button"
                  role="tab"
                  id={`tab-${arch.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${arch.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  className={`archetype-card ${isSelected ? 'active' : ''}`}
                  onClick={() => handleArchetypeSelect(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                >
                  <div className="archetype-card-head">
                    <div className="archetype-card-glyph-box">
                      <span className="archetype-glyph font-mono">{arch.glyph}</span>
                      <span className={`socket ${arch.signal} ${isSelected ? 'pulse' : ''}`} />
                    </div>
                    <span className="archetype-id font-mono">{arch.id}</span>
                  </div>
                  <h3 className="archetype-role font-display">{arch.role}</h3>
                  <p className="archetype-tagline">{arch.tagline}</p>
                  <p className="archetype-when">{arch.when}</p>
                  <p className="archetype-counter">{arch.counter}</p>
                </button>
              );
            })}

            {/* Card 4: Dual panel for Speedster (Internal | Internet) */}
            <div className={`archetype-card archetype-speedster-card ${selectedArchetypeIndex >= 3 ? 'active' : ''}`}>
              {ARCHETYPES_DATA.slice(3, 5).map((arch, offset) => {
                const idx = 3 + offset;
                const isSelected = idx === selectedArchetypeIndex;
                return (
                  <button
                    key={arch.id}
                    ref={(el) => (tabRefs.current[idx] = el)}
                    type="button"
                    role="tab"
                    id={`tab-${arch.id}`}
                    aria-selected={isSelected}
                    aria-controls={`panel-${arch.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    className={`speedster-subpanel ${isSelected ? 'active' : ''}`}
                    onClick={() => handleArchetypeSelect(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                  >
                    <div className="archetype-card-head">
                      <div className="archetype-card-glyph-box">
                        <span className="archetype-glyph font-mono">{arch.glyph}</span>
                        <span className={`socket ${arch.signal} ${isSelected ? 'pulse' : ''}`} />
                      </div>
                      <span className="archetype-id font-mono">{arch.id}</span>
                    </div>
                    <h3 className="archetype-role font-display">{arch.role}</h3>
                    <p className="archetype-tagline">{arch.tagline}</p>
                    <p className="archetype-when">{arch.when}</p>
                    <p className="archetype-counter">{arch.counter}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            BEAT 4 — THE PROOF
            Same prompt, different minds. Five real beats.
            This is where the page turns from concept to evidence.
            ============================================================ */}
        <section className="section container story-proof-section">
          <header className="story-section-header">
            <span className="font-mono text-signal-cyan">03 · THE PROOF</span>
            <h2 className="story-section-title font-display">
              Same prompt. Five minds.<br /> Five different answers.
            </h2>
            <p className="story-section-lede">
              Five real prompts, one each per archetype. The router is the
              only thing that changes.
            </p>
          </header>

          <div className="proof-stack">
            {SAME_PROMPT_BEATS.map((beat) => (
              <article key={beat.archetype} className="proof-card panel">
                <div className="proof-card-head">
                  <span className="proof-archetype font-mono">
                    {beat.archetype}
                  </span>
                  <span className="proof-context font-mono">{beat.context}</span>
                </div>

                <blockquote className="proof-prompt font-display">
                  {beat.prompt}
                </blockquote>

                <div className="proof-payload">
                  <span className="proof-payload-label font-mono">
                    What comes back
                  </span>
                  <h4 className="proof-headline font-display">{beat.headline}</h4>
                  <ul className="proof-bullets">
                    {beat.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================
            BEAT 5 — THE DOOR
            A real install. Five steps. Five lines of prose.
            One CTA into the GitHub repo.
            ============================================================ */}
        <section className="section container story-door-section">
          <header className="story-section-header">
            <span className="font-mono text-signal-mint">04 · THE DOOR</span>
            <h2 className="story-section-title font-display">
              It is open source. It ships today.
            </h2>
            <p className="story-section-lede">
              v1.0.0 is on GitHub. Five steps, five minutes, zero gatekeepers.
            </p>
          </header>

          <ol className="door-steps">
            {DOOR_STEPS.map((step) => (
              <li key={step.n} className="door-step">
                <span className="door-step-num font-mono">{String(step.n).padStart(2, '0')}</span>
                <div className="door-step-body">
                  <h4 className="door-step-label font-display">{step.label}</h4>
                  <code className="door-step-detail font-mono">{step.detail}</code>
                </div>
              </li>
            ))}
          </ol>

          <div className="door-note">
            <p className="door-note-text">
              <strong>9router is recommended</strong> for the full archetype experience
              (internal fallback chains, combo routing, cost-mode switching), but it is
              <strong>completely optional</strong>. The plugin works with any provider you
              register in Hermes — point each archetype directly at OpenRouter, Anthropic,
              Ollama, or any custom provider. If you do not have 9router running, skip
              the 9router-specific steps and register your preferred models in
              <code>archetype_model_config.json</code> with your chosen provider.
            </p>
          </div>

          <div className="door-cta-row">
            <a
              href="https://github.com/njay-pro/hermes-archetype-subagent"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <span>Open the repo · v1.0.0</span>
              <span>↗</span>
            </a>
            <a
              href="https://github.com/njay-pro/hermes-archetype-subagent#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <span>Read the README</span>
              <span>↗</span>
            </a>
          </div>
        </section>

        {/* ============================================================
            FOR BUILDERS — quiet tail.
            For the engineer or vibe-coder in the audience, here is the
            actual tool call. Faded so it does not compete with the
            story above.
            ============================================================ */}
        <section className="section container story-builders-section">
          <header className="story-section-header">
            <span className="font-mono text-muted">FOR BUILDERS · OPTIONAL</span>
            <h2 className="story-section-title-sm font-display">
              If you write Python, here is the call.
            </h2>
            <p className="story-section-lede">
              The tool surface. Copy-pasteable. Skippable — you do not need
              this section to understand the page.
            </p>
          </header>

          <div className="builders-row">
            <div className="builders-card panel">
              <div className="builders-card-head">
                <span className="font-mono text-signal-mint">
                  {ARCHETYPES_DATA[selectedArchetypeIndex].id}.py
                </span>
                <button
                  type="button"
                  className="builders-copy font-mono"
                  onClick={() => {
                    const tool = `delegate_task_${ARCHETYPES_DATA[selectedArchetypeIndex].id.replace(/-/g, '_')}`;
                    const a = ARCHETYPES_DATA[selectedArchetypeIndex];
                    const code = `${tool}(\n    goal="...",\n    context="...",\n    max_iterations=${a.id === 'speedster-internal' ? 15 : a.id === 'speedster-internet' ? 20 : a.id === 'high-hallucination' ? 40 : a.id === 'consultant' ? 50 : 100},\n)`;
                    void copyText(code, setCopyState);
                  }}
                  aria-label="Copy tool-call snippet"
                >
                  {copyState === 'copied' ? '✓ Copied' : 'Copy snippet'}
                </button>
              </div>
              <pre className="builders-code font-mono">
{`# Pick by intent, not by model.
delegate_task_${ARCHETYPES_DATA[selectedArchetypeIndex].id.replace(/-/g, '_')}(
    goal="<the work, written in one sentence>",
    context="<the brief, written in one paragraph>",
    max_iterations=${selectedArchetypeIndex === 3 ? 15 : selectedArchetypeIndex === 4 ? 20 : selectedArchetypeIndex === 2 ? 40 : selectedArchetypeIndex === 0 ? 50 : 100},
)`}
              </pre>
            </div>

            <div className="builders-card panel">
              <div className="builders-card-head">
                <span className="font-mono text-signal-mint">install.md</span>
                <button
                  type="button"
                  className="builders-copy font-mono"
                  onClick={() => void copyText(ACCURATE_INSTALL_PROMPT, setInstallCopyState)}
                  aria-label="Copy installation prompt"
                >
                  {installCopyState === 'copied' ? '✓ Copied' : 'Copy agent prompt'}
                </button>
              </div>
              <pre className="builders-code font-mono">
{`# Paste this to Hermes and walk away.
${ACCURATE_INSTALL_PROMPT.split('\n').slice(0, 3).join('\n')}
... (7 steps total — see repo)`}
              </pre>
            </div>
          </div>
        </section>

        {/* ============================================================
            CLOSE — Njay's footer.
            Honest, brief, no marketing fog.
            ============================================================ */}
        <footer className="story-footer">
          <div className="container story-footer-inner">
            <div className="story-footer-left">
              <span className="font-mono text-muted">
                BUILT BY NJAY + HERMES · INSIDE OMCA
              </span>
              <Link to="/" className="story-back-link font-mono">
                ← Back to the identity graph
              </Link>
            </div>
            <div className="story-footer-right">
              <a
                href="https://github.com/njay-pro/hermes-archetype-subagent"
                target="_blank"
                rel="noopener noreferrer"
                className="story-footer-link font-mono"
              >
                GitHub ↗
              </a>
              <a
                href="https://github.com/njay-pro/hermes-archetype-subagent/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="story-footer-link font-mono"
              >
                Issues ↗
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
