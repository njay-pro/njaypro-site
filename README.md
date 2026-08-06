# Njaypro Site

A working self-portrait. White canvas. Kinetic type.

This is **not** a portfolio. It's not a startup landing page either.
It's a quiet page that says one thing out loud, and a kinetic canvas
behind it that keeps breathing.

## Pages

| Route | What it is |
|---|---|
| `/` | Home — the statement, the kinetic canvas, the door |
| `/archetype-hermes-subagent` | The plugin landing (story-driven, 5 beats) |
| `/contact` | DM is the door |

The URL structure keeps words together (`/archetype-hermes-subagent`,
not `/archetype/something`) — every path reads as one phrase.

## Source documents

- [`DESIGN.md`](DESIGN.md) — visual system: paper canvas, single
  verdigris accent, kinetic canvas (p5.js particles + Three.js ASCII
  form), Cormorant Garamond display, Inter body, JetBrains Mono.
- [`BUILD_BRIEF.md`](BUILD_BRIEF.md) — exact routes, copy, interaction
  requirements, verification criteria.

## Development

```bash
pnpm install
pnpm dev          # localhost:5173
pnpm test         # vitest
pnpm test:e2e     # playwright
pnpm build        # production build → dist/
pnpm preview      # serve dist/ locally
```

Stack: Vite, React, TypeScript, GSAP, p5.js, Three.js.

## Kinetic canvas

The background of every page is a `<KineticCanvas />` component:

1. **p5.js particle field** — ~110 dark-ink particles falling under
   gravity on a paper-white canvas. Mouse proximity creates a soft
   inverse-square curl deflection (no hard repulsion).
2. **Three.js ASCII-rendered icosahedron** — rendered to a low-res
   offscreen target, then sampled per-pixel in a fragment shader that
   maps each cell to an ASCII char from ` .,:;ilLtTfFjJnN`. Rotates
   at a fixed cadence — the heartbeat of the page.

Both layers respect `prefers-reduced-motion`.

## What this isn't

- not a portfolio container
- not a marketing page
- not dark-themed industrial
- not startup jargon
- not AI-generated-looking

It is what it is.
