import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ThreeSculpture } from '../components/ThreeSculpture';
import { P5Field } from '../components/P5Field';
import './ArchetypePage.css';

export interface ArchetypeData {
  id: string;
  glyph: string;
  tool: string;
  role: string;
  summary: string;
  tools: string;
  iterations: number;
  signal: 'amber' | 'mint' | 'cyan' | 'oxide';
  codeExample: string;
}

export const ARCHETYPES_DATA: ArchetypeData[] = [
  {
    id: 'consultant',
    glyph: '◆',
    tool: 'delegate_task_consultant',
    role: 'Resolve ambiguity',
    summary: 'Raw nuance, architecture, intent distillation, near-completion synthesis.',
    tools: 'terminal · file · web',
    iterations: 50,
    signal: 'amber',
    codeExample: `# Resolve an architectural decision.
delegate_task_consultant(
    goal="Analyze the auth bottleneck and recommend one architecture.",
    context="Python, FastAPI, Redis. Current baseline: 10K requests/second.",
    max_iterations=50,
)`,
  },
  {
    id: 'long-horizon',
    glyph: '☰',
    tool: 'delegate_task_long_horizon',
    role: 'Carry the build',
    summary: 'Stateful, multi-step execution with a self-managed plan and anti-drift posture.',
    tools: 'terminal · file · web',
    iterations: 100,
    signal: 'mint',
    codeExample: `# Hand a stable worker the implementation mission.
delegate_task_long_horizon(
    goal="Implement the selected auth architecture and verify the full test suite.",
    context="The architecture decision is locked. Preserve public API behavior.",
    preload_files=["/absolute/path/to/MIGRATION_PLAN.md"],
    max_iterations=100,
)`,
  },
  {
    id: 'high-hallucination',
    glyph: '✦',
    tool: 'delegate_task_high_hallucination',
    role: 'Open alternatives',
    summary: 'Short-horizon lateral exploration with creative range and explicit grounding.',
    tools: 'terminal · file · web',
    iterations: 40,
    signal: 'oxide',
    codeExample: `# Explore before committing to one visual direction.
delegate_task_high_hallucination(
    goal="Create exactly three distinct launch concepts for a luxury lighting line.",
    context="Audience: architects and high-end hospitality studios.",
    output_schema_override={"type": "array", "minItems": 3, "maxItems": 3},
    max_iterations=40,
)`,
  },
  {
    id: 'speedster-internal',
    glyph: '▣',
    tool: 'delegate_task_speedster_internal',
    role: 'Scan the machine',
    summary: 'Fast deterministic extraction from local files, with no terminal or network surface.',
    tools: 'file only',
    iterations: 15,
    signal: 'cyan',
    codeExample: `# Fast local file scanning and deterministic extraction.
delegate_task_speedster_internal(
    goal="STEP 1: Read the image bank. STEP 2: Return matching asset paths.",
    skill_include_override=["nodes_vector-search"],
    max_iterations=15,
)`,
  },
  {
    id: 'speedster-internet',
    glyph: '◌',
    tool: 'delegate_task_speedster_internet',
    role: 'Scan the network',
    summary: 'Fast fetching, endpoint extraction, and web pre-filtering with no local file surface.',
    tools: 'web only',
    iterations: 20,
    signal: 'cyan',
    codeExample: `# Fast web fetching and endpoint extraction.
delegate_task_speedster_internet(
    tasks=[
        {"goal": "STEP 1: Fetch release A. STEP 2: Extract breaking changes."},
        {"goal": "STEP 1: Fetch release B. STEP 2: Extract breaking changes."},
    ],
    max_iterations=20,
)`,
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

interface ArchetypePageProps {
  isReducedMotion?: boolean;
}

export const ArchetypePage: React.FC<ArchetypePageProps> = ({ isReducedMotion = false }) => {
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<number>(1); // Default to long-horizon
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(0);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const [installCopied, setInstallCopied] = useState<boolean>(false);
  const [copyStatusMessage, setCopyStatusMessage] = useState<string>('');
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>('');

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedArchetype = ARCHETYPES_DATA[selectedArchetypeIndex];

  const routingLayers = [
    {
      step: 'LAYER 01',
      title: 'Model',
      desc: 'Match reasoning depth and context capacity to task domain demands.',
    },
    {
      step: 'LAYER 02',
      title: 'Persona',
      desc: 'Lock behavioral rules, skepticism levels, and problem-solving posture.',
    },
    {
      step: 'LAYER 03',
      title: 'Toolset',
      desc: 'Restrict runtime surface area to only required capabilities.',
    },
    {
      step: 'LAYER 04',
      title: 'Horizon',
      desc: 'Set max iteration caps and execution boundaries (e.g. 15–100 iterations, bounded execution).',
    },
    {
      step: 'LAYER 05',
      title: 'Skill Context',
      desc: 'Inject domain-specific rulesets, schemas, and verification constraints.',
    },
  ];

  const handleArchetypeSelect = (index: number) => {
    setSelectedArchetypeIndex(index);
    setCodeCopied(false);
    setCopyStatusMessage('');
    setAriaLiveMessage(`Selected archetype: ${ARCHETYPES_DATA[index].id}`);
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
    // Focus the target tab button DOM element
    tabRefs.current[nextIndex]?.focus();
  };

  const showCopySuccess = (type: 'code' | 'install') => {
    if (type === 'code') {
      setCodeCopied(true);
      setAriaLiveMessage('Archetype Python invocation code copied to clipboard.');
      setTimeout(() => setCodeCopied(false), 3000);
    } else {
      setInstallCopied(true);
      setAriaLiveMessage('Hermes agent installation prompt copied to clipboard.');
      setTimeout(() => setInstallCopied(false), 3000);
    }
  };

  const showCopyError = () => {
    const errorMsg = 'Failed to copy to clipboard. Please select and copy text manually.';
    setCopyStatusMessage(errorMsg);
    setAriaLiveMessage(errorMsg);
    setTimeout(() => setCopyStatusMessage(''), 4000);
  };

  const copyToClipboard = (text: string, type: 'code' | 'install') => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard
        .writeText(text)
        .then(() => showCopySuccess(type))
        .catch(() => fallbackCopy(text, type));
    } else {
      fallbackCopy(text, type);
    }
  };

  const fallbackCopy = (text: string, type: 'code' | 'install') => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        showCopySuccess(type);
      } else {
        showCopyError();
      }
    } catch {
      showCopyError();
    }
  };

  const scrollToSelector = () => {
    const selectorSection = document.getElementById('archetype-selector');
    if (selectorSection) {
      selectorSection.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <div className="archetype-page">
      <P5Field fieldState="RESOLVED" activeSignal={selectedArchetype.signal} isReducedMotion={isReducedMotion} />
      <ThreeSculpture mode="archetype" activeIndex={selectedArchetypeIndex} isReducedMotion={isReducedMotion} />

      {/* Accessible Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {ariaLiveMessage}
      </div>

      <main id="main-content">
        {/* 1. Product Hero */}
        <section className="hero-section section container">
          <div className="hero-content">
            <div className="eyebrow font-mono text-signal-mint">
              <span className="socket mint" />
              <span>OPEN SOURCE / HERMES AGENT PLUGIN</span>
            </div>

            <h1 className="hero-title font-display">
              ONE SUBAGENT IS NOT A SYSTEM.
            </h1>

            <p className="hero-subhead">
              Give the task the kind of mind it needs.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={scrollToSelector}
                aria-label="Explore the five archetypes"
              >
                <span>Explore the five</span>
                <span>↓</span>
              </button>

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

        {/* 2. Five-Archetype Working Constellation Network */}
        <section id="archetype-selector" className="section container">
          <div className="section-header">
            <span className="font-mono text-muted">HERMES_ROUTER // CONSTELLATION</span>
            <h2 className="section-title font-display">Five Specialist Archetypes</h2>
          </div>

          <div className="archetype-constellation-wrapper">
            {/* SVG Constellation Signal Wires */}
            <svg className="constellation-wire-svg" aria-hidden="true" preserveAspectRatio="none">
              <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="var(--line-structural)" strokeWidth="1.5" />
            </svg>

            {/* Archetype Selector Tabs / Constellation Rail */}
            <div
              className="archetype-constellation-rail"
              role="tablist"
              aria-label="Archetype Router Selector"
            >
              {ARCHETYPES_DATA.map((arch, idx) => {
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
                    className={`archetype-node-socket panel-interactive ${isSelected ? 'active' : ''}`}
                    onClick={() => handleArchetypeSelect(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                  >
                    <div className="node-socket-top">
                      <span className="tab-glyph font-mono">{arch.glyph}</span>
                      <span className={`socket ${arch.signal} ${isSelected ? 'pulse' : ''}`} />
                    </div>
                    <div className="node-socket-main">
                      <span className="tab-id font-mono">{arch.id}</span>
                      <span className="tab-role font-display">{arch.role}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Archetype Display Card */}
            <div
              id={`panel-${selectedArchetype.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${selectedArchetype.id}`}
              className="selected-archetype-display panel"
            >
              <div className="display-header">
                <div className="display-title-group">
                  <span className="display-glyph">{selectedArchetype.glyph}</span>
                  <h3 className="display-id font-mono text-signal-mint">
                    {selectedArchetype.id}
                  </h3>
                </div>
                <span className={`socket ${selectedArchetype.signal}`} />
              </div>

              <div className="display-role font-display">
                {selectedArchetype.role}
              </div>

              <p className="display-summary">{selectedArchetype.summary}</p>

              <div className="display-meta-grid">
                <div className="meta-item">
                  <span className="meta-label font-mono">TOOL BOUNDARY</span>
                  <span className="meta-value font-mono">{selectedArchetype.tools}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label font-mono">MAX ITERATIONS</span>
                  <span className="meta-value font-mono">{selectedArchetype.iterations}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label font-mono">DELEGATE TOOL</span>
                  <span className="meta-value font-mono text-signal-cyan">{selectedArchetype.tool}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Routing Decision Sequence / Contrast Section */}
        <section className="section container contrast-section">
          <div className="contrast-header">
            <span className="font-mono text-signal-amber">ARCHITECTURE // CONTROL_FLOW</span>
            <h2 className="contrast-title font-display">
              THE ROUTING DECISION BELONGS BEFORE THE PROMPT.
            </h2>
          </div>

          <div className="layers-sequence-flow">
            {routingLayers.map((layer, idx) => {
              const isActive = activeLayerIndex === idx;
              return (
                <div
                  key={layer.step}
                  className={`layer-sequence-step panel-interactive ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveLayerIndex(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveLayerIndex(idx);
                    }
                  }}
                >
                  <div className="step-header">
                    <span className="layer-step font-mono text-muted">{layer.step}</span>
                    <span className={`socket ${isActive ? 'mint' : ''}`} />
                  </div>
                  <h3 className="layer-title font-display">{layer.title}</h3>
                  <p className="layer-desc">{layer.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Usage / Code Surface */}
        <section className="section container code-section">
          <div className="section-header">
            <span className="font-mono text-muted">PAYLOAD // LIVE_TOOL_CALL</span>
            <h2 className="section-title font-display">Archetype Invocation Syntax</h2>
          </div>

          <div className="code-surface-wrapper panel">
            <div className="code-surface-header">
              <div className="code-surface-title font-mono text-signal-mint">
                <span>{selectedArchetype.tool}.py</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost copy-btn"
                onClick={() => copyToClipboard(selectedArchetype.codeExample, 'code')}
                aria-label="Copy archetype invocation code to clipboard"
              >
                <span>{codeCopied ? '✓ Copied' : 'Copy Invocation'}</span>
              </button>
            </div>

            <pre className="code-panel">
              <code>{selectedArchetype.codeExample}</code>
            </pre>
          </div>
        </section>

        {/* 5. Accurate Hermes Agent Install Prompt */}
        <section className="section container install-section">
          <div className="install-card panel">
            <div className="install-header">
              <span className="font-mono text-signal-mint">DEPLOY // AGENT_ORCHESTRATION</span>
              <span className="font-mono text-muted">RELEASE V1.0.0</span>
            </div>

            <h2 className="install-title font-display">Install Hermes Archetype Router</h2>

            <div className="install-prompt-wrapper">
              <div className="install-prompt-actions">
                <a
                  href="https://github.com/njay-pro/hermes-archetype-subagent#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-signal-cyan docs-link"
                >
                  Read Installation Docs ↗
                </a>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => copyToClipboard(ACCURATE_INSTALL_PROMPT, 'install')}
                  aria-label="Copy Hermes agent installation prompt"
                >
                  <span>{installCopied ? '✓ Prompt Copied' : 'Copy Agent Prompt'}</span>
                </button>
              </div>

              {copyStatusMessage && (
                <div className="copy-error-banner font-mono" role="alert">
                  {copyStatusMessage}
                </div>
              )}

              <pre className="install-code-box code-panel">
                <code>{ACCURATE_INSTALL_PROMPT}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Footer / Back Connection */}
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand font-mono">
              <p className="footer-title">Built by Njay + Hermes inside OMCA.</p>
              <p className="footer-sub text-muted">OPEN SOURCE / HERMES ARCHETYPE ROUTER V1.0.0</p>
            </div>

            <div className="footer-links font-mono">
              <Link to="/" className="footer-link text-signal-mint">
                ← Back to identity graph
              </Link>
              <a
                href="https://github.com/njay-pro/hermes-archetype-subagent"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
