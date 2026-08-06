---
version: alpha
name: "NJAY — White Atelier"
---

# NJAY — Design System

## What this site is

This is not a portfolio. This is a working self-portrait.

The governing metaphor is **a canvas that thinks with you**. Mostly white.
Mostly quiet. The kinetic stuff lives in the negative space — particles
falling under gravity, a 3D form breathing in ASCII, type that arrives
in cadence. Not because it's pretty. Because the work Njay makes is
the same: physical fabrication, visual systems, procedural worlds, AI
orchestration — each one a discipline, all of them held by the same
pair of hands.

The visual attitude is **avant-garde + warm**:

- white enough that a single sentence can hold a full frame;
- kinetic enough that the page feels alive without being loud;
- minimal enough that nothing on the page is decoration;
- precise enough that a 1px line, a 16ms ease, or a 0.05em tracking is
  the difference between looking intentional and looking generated.

## Colors

### Canvas

- **Paper** `#F7F5F0` — page background. Warm off-white, never clinical.
- **Bone** `#EDEAE2` — secondary surfaces (panels, soft borders).
- **Char** `#1A1A1A` — primary type. Near-black, never pure `#000`.

### Signals

Signal color is semantic. Used sparingly.

- **Ink** `#1A1A1A` — type, lines, primary strokes.
- **Verdigris** `#3F5B4A` — the only chromatic accent. Faded green-brass.
  Used for: cursor, hover, "active" states. Never for headlines.

## Typography

### Display

- `fontFamily`: `'Editorial Old', 'Times New Roman', serif` *(fallback chain)*
- **NOTE**: Editorial Old is paid. Production substitutes with a similar
  high-contrast didone. For the open-source build we use `'Cormorant Garamond'`
  (Google Fonts) which is a free serif of similar weight.
- `fontWeight`: 300 (light) for display, 500 for emphasis
- `lineHeight`: 0.94
- `letterSpacing`: `-0.035em`

### Body

- `fontFamily`: `'Inter', sans-serif`
- `fontWeight`: 400
- `lineHeight`: 1.55

### Mono (for code/structural elements)

- `fontFamily`: `'JetBrains Mono', monospace`
- `fontWeight`: 400
- `letterSpacing`: `0.01em`

## Spacing

- **unit**: `8px`
- **section**: `clamp(8rem, 18vw, 18rem)`
- **gutter**: `clamp(1.5rem, 4vw, 3rem)`

## Motion

### Principles

- Every animation is **slow and inevitable** — 800-2000ms durations.
- Every ease is `power2.out` or `power3.out`. Never linear.
- Particles never bounce. They drift, fall, settle.
- The ASCII 3D form rotates **at one fixed cadence** regardless of
  scroll. It is the heartbeat of the page.

### Particles (p5.js)

- 80-150 particles on canvas, white canvas, dark ink particles
- Each particle: position, velocity, mass
- Gravity = `0.04` px/frame² toward bottom
- On mouse proximity (radius 120px): particles deflect with inverse-
  square falloff. No repulsion wall, just a soft curl.
- When a particle hits y > height + 20: respawn at top, random x.

### ASCII 3D form (Three.js → ASCII shader)

- Single low-poly mesh (icosahedron, 80 subdivisions).
- Rendered to a low-res offscreen target (240×135).
- Sampled per-pixel in shader: each texel maps to one ASCII char
  from a 12-char ramp ` .,:;ilLtTfFjJnN`.
- Rotation: `y += 0.003` per frame, `x += 0.001` per frame.
- Position drifts in a Lissajous: `x = sin(t*0.4)*0.3, y = cos(t*0.3)*0.2`.

## Layout

### Grid

- 12-column, 24px gutter
- Max content width: 920px (display width for the home statement)
- Canvas extends edge-to-edge. Type sits in a centered column.

### Pages

| Path | Purpose |
|---|---|
| `/` | Home — the statement + kinetic canvas + contact |
| `/archetype-hermes-subagent` | The plugin landing — sourced from the GitHub README |
| `/contact` | DM is the door |

## What's gone

- Dark backgrounds — gone. Canvas is paper.
- Amber / cyan / oxide signal palette — gone. Single verdigris accent.
- "EVALUATING_NODE..." loading text — gone. Just a quiet fade.
- Industrial panel chrome — gone. No fake dashboards.
