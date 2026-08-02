# Njaypro Site — Build Brief

## Objective

Build a production-ready, two-route personal website that expresses Njay as a multidisciplinary **builder** through its typography, spatial logic, procedural graphics, motion, interaction, and technical restraint.

This is not a portfolio. The website itself is the proof.

## Routes

### `/` — Builder

Narrative sequence:

1. **Hero**
   - Eyebrow: `NJAY / MULTIDISCIPLINARY BUILDER`
   - Main composition:
     - `I WAS TRAINED`
     - `BY STEEL.`
     - `THEN SYSTEMS.`
     - `NOW INTELLIGENCE.`
   - Supporting statement: `I design the thing, shape the story, and build the system that makes it move.`
   - Primary CTA: `Enter the graph`
   - Secondary route link: `The first public node → Archetype Router`

2. **Identity graph**
   - Four connected nodes:
     - `01 / FABRICATION` — `Before pixels, material taught me that every line has to hold.`
     - `02 / VISUAL SYSTEMS` — `Identity is not decoration. It is how many decisions learn to speak as one.`
     - `03 / PROCEDURAL WORLDS` — `Geometry Nodes made logic visible: fields, instances, constraints, outcomes.`
     - `04 / AGENT SYSTEMS` — `AI made the engineering layer available. I stopped handing the build away.`
   - Each node becomes active on scroll and causes a graph pulse + 3D state shift.

3. **Manifesto frame**
   - `Industrialization split the person who imagines it, the person who makes it beautiful, and the person who builds it.`
   - `I never fit that split.`
   - `Call me a builder.`

4. **AI thesis**
   - Large statement: `AI IS NOT MY NEW DISCIPLINE.`
   - Counterline: `IT IS THE ENGINEERING LAYER COMING BACK TO DESIGN.`
   - Body: `A pure engineer can disappear into complexity. A pure creative can ignore the machine. The useful position is between them: enough judgment to know what should exist, enough appetite to make it real.`

5. **Shipped proof / route output**
   - Label: `OUTPUT / 001 / OPEN SOURCE`
   - Title: `One subagent is not a system.`
   - Product: `Hermes Archetype Router`
   - Body: `Five specialist minds. Each with a different model, persona, tool boundary, horizon, and skill context.`
   - CTA to `/archetype`: `Follow the signal`
   - GitHub external CTA.

6. **Footer**
   - `NJAY — BALI / WITA`
   - `DESIGN / SYSTEMS / 3D / AI`
   - GitHub and email.

### `/archetype` — Hermes Archetype Router

1. **Product hero**
   - Eyebrow: `OPEN SOURCE / HERMES AGENT PLUGIN`
   - Headline: `ONE SUBAGENT IS NOT A SYSTEM.`
   - Subhead: `Give the task the kind of mind it needs.`
   - CTA: GitHub and `Explore the five`.

2. **Five-archetype working graph**
   - Consultant / Long Horizon / High Hallucination / Speedster Internal / Speedster Internet.
   - Desktop: nodes arranged as a navigable constellation/sequence around the procedural router scene.
   - Mobile: horizontal/vertical accessible selector.
   - Selected node updates copy and code panel.

3. **Actual archetype data**

```json
[
  {
    "id": "consultant",
    "glyph": "◆",
    "tool": "delegate_task_consultant",
    "role": "Resolve ambiguity",
    "summary": "Raw nuance, architecture, intent distillation, near-completion synthesis.",
    "tools": "terminal · file · web",
    "iterations": 50,
    "signal": "amber"
  },
  {
    "id": "long-horizon",
    "glyph": "☰",
    "tool": "delegate_task_long_horizon",
    "role": "Carry the build",
    "summary": "Stateful, multi-step execution with a self-managed plan and anti-drift posture.",
    "tools": "terminal · file · web",
    "iterations": 100,
    "signal": "mint"
  },
  {
    "id": "high-hallucination",
    "glyph": "✦",
    "tool": "delegate_task_high_hallucination",
    "role": "Open alternatives",
    "summary": "Short-horizon lateral exploration with creative range and explicit grounding.",
    "tools": "terminal · file · web",
    "iterations": 40,
    "signal": "oxide"
  },
  {
    "id": "speedster-internal",
    "glyph": "▣",
    "tool": "delegate_task_speedster_internal",
    "role": "Scan the machine",
    "summary": "Fast deterministic extraction from local files, with no terminal or network surface.",
    "tools": "file only",
    "iterations": 15,
    "signal": "cyan"
  },
  {
    "id": "speedster-internet",
    "glyph": "◌",
    "tool": "delegate_task_speedster_internet",
    "role": "Scan the network",
    "summary": "Fast fetching, endpoint extraction, and web pre-filtering with no local file surface.",
    "tools": "web only",
    "iterations": 20,
    "signal": "cyan"
  }
]
```

4. **Contrast section**
   - Headline: `THE ROUTING DECISION BELONGS BEFORE THE PROMPT.`
   - Explain the five layers: model, persona, toolset, horizon, skill context.
   - Visual graph changes as each layer is switched on.

5. **Usage / code surface**
   - Live selected archetype example.
   - Copy button with real feedback.
   - Include `preload_files` and skill isolation as secondary details.

6. **Install prompt**
   - Copyable Hermes agent installation prompt.
   - Accurate current release: v1.0.0.
   - GitHub CTA.

7. **Footer / back connection**
   - `Built by Njay + Hermes inside OMCA.`
   - Back to identity graph.

## Interaction requirements

- Desktop navigation follows pointer and scroll subtly; mobile has fixed compact header.
- Route transition is custom: outgoing output socket expands/wipes into incoming input socket.
- Every button/link has focus-visible state.
- `Explore the five` scrolls to selector.
- Archetype selection works with click, Enter/Space, and arrow keys.
- Code/install copy buttons write to clipboard and update accessible status text.
- External links use real URLs and descriptive labels.
- Reduced motion path is complete.

## Technical posture

- Vite + React + TypeScript.
- React Router for exactly two routes.
- GSAP + ScrollTrigger for narrative motion.
- p5.js instance mode for deterministic background relation field.
- Three.js direct API for procedural instanced router sculpture; no React Three Fiber dependency.
- Vanilla CSS design tokens; no Tailwind.
- Vitest + Testing Library for functional components.
- Playwright for real route and interaction verification/screenshots.
- ESLint optional only if setup remains clean; build/typecheck and tests are mandatory.

## Verification

- `pnpm build` passes.
- Unit tests pass.
- `/` and `/archetype` return rendered content under preview server.
- Browser console contains no uncaught errors.
- Real click/keyboard interactions change state.
- Copy feedback fires.
- Desktop 1440×1000 and mobile 390×844 screenshots inspected.
- No horizontal overflow at 390px.
- Canvas animation pauses on hidden tab and respects reduced motion.
