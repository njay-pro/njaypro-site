# Visual QA — Pass 01

## Verdict

Functional implementation is green, but visual sign-off is **blocked**. The first build reads as a polished dark developer landing page rather than a multidisciplinary builder’s authored spatial system.

The critical issue is not color or polish. It is composition: the WebGL object obscures the hero, the graph metaphor collapses into repeated cards, and mobile is a compressed stack rather than a redesigned narrative.

## Tier 1 — must fix

1. **Hero legibility destroyed by WebGL**
   - Both desktop heroes: black cube arms sit above the headline, subhead, and CTAs.
   - Mobile builder: cubes cover body copy and both buttons.
   - Fix: sculpture must sit behind type with controlled mask/opacity, never over interactive content. Give sculpture a bounded composition zone and lower contrast where type crosses it.

2. **Wrong external URLs**
   - Current code links to `github.com/njaypro/hermes-archetype-router` and `github.com/njaypro`.
   - Correct plugin URL: `https://github.com/njay-pro/hermes-archetype-subagent`.
   - Correct profile: `https://github.com/njay-pro`.

3. **Fabricated install command**
   - Current UI displays `npx @hermes/cli@v1.0.0 add archetype-router`; this is not a verified install path.
   - Replace with the accurate copyable Hermes-agent installation prompt from the rebuilt README.

4. **Clipboard false-success path**
   - Catch block currently shows success even if fallback copy fails.
   - Only show “Copied” after `execCommand('copy') === true`; otherwise show accessible failure message.

5. **Keyboard selection does not move focus**
   - Roving `tabIndex` updates selected state but Arrow keys leave DOM focus on the old tab.
   - Move focus to the newly selected tab.

## Tier 2 — art direction failures

1. **Graph became a grid of cards**
   - Builder desktop uses four equal marketing cards in one row.
   - Archetype selector is five stacked cards + one generic detail card.
   - Layer system is five equal cards.
   - This contradicts the locked spatial spine / constellation direction.
   - Fix: create a real SVG/DOM wire system, alternating identity nodes along a diagonal/vertical rail. Archetypes orbit or branch from a center router; layers become an evaluated sequence, not cards.

2. **3D is a tutorial particle/cube cloud**
   - Current identity states jump between column, grid, helix, sphere. This is visual sampling, not one authored material evolving.
   - Replace with the selected Weld-Beam Construct → Signal Router: rough joined rectangular beams and heat joints on `/`, precise five-branch beam router on `/archetype`.
   - Remove constant per-cube rotation and constant group auto-rotation. Pointer/scroll should affect the structure causally.

3. **Route transition is a generic center wipe**
   - Current socket appears at viewport center after the route has already changed. It is not connected to the clicked output node.
   - Build a shared `SignalLink`/transition trigger that captures the CTA socket bounds, expands from that position, navigates at midpoint, and contracts into the incoming hero socket.
   - Respect reduced motion; current component ignores it.

4. **Mobile is compressed desktop**
   - Fixed header consumes too much horizontal space.
   - Hero line breaks collapse to one huge line; sculpture covers controls.
   - Identity cards become a long generic stack with massive whitespace.
   - Archetype page becomes tabs + detail + five layer cards + code/install cards.
   - Fix: mobile route switcher as compact numeric rail/menu; authored four-line hero; vertical signal spine with compact node moments; archetype selector as horizontal scroll-snap or branch list; reduce canvas dominance.

5. **Typography hierarchy drifts after hero**
   - Strong type exists, but repeated section-title + grid patterns flatten the experience.
   - The manifesto is a large bordered panel rather than a near-full-frame statement.
   - The AI thesis is a familiar two-column marketing block.
   - Fix: remove enclosing panels from the two statement frames. Let type and the graph create depth. Use one phrase per spatial beat.

6. **Backdrops/shadows drift from design contract**
   - Navigation uses `backdrop-filter: blur(12px)`.
   - Several panels and sockets use glow/box-shadow.
   - Remove glass behavior and broad glows; reserve brightness for the evaluation pulse only.

7. **p5 field is decorative wallpaper**
   - It does not visibly transition LATENT → EVALUATING → RESOLVED.
   - Add explicit field state controlled by scroll/selected node. Reduce signal-colored particles; make relation lines and topology the focus.

## Tier 3 — product/copy integrity

- Correct `MODEL / PERSONA / TOOLSET / HORIZON / SKILL CONTEXT` explanation so claims match actual plugin mechanics. “state persistence parameters” is not currently a horizon feature.
- Code surface should show a real tool call, not an invented JSON config object.
- Avoid “Plug the system…” generic marketing. Let the accurate agent install prompt be the product interaction.
- Add a direct documentation path and current public repository identity.

## Verification gates for Pass 02

- Desktop hero text and CTAs remain fully readable at 1440×1000.
- Mobile hero remains fully readable at 390×844; no canvas crosses text/button hit areas.
- Identity route has visible wires/sockets and no four-equal-card row.
- Archetype route has visible five-branch topology and no five-equal-layer-card row.
- Route transition originates from clicked output socket.
- Correct GitHub links and install prompt.
- Arrow-key selection moves focus.
- Clipboard success/failure is truthful.
- Zero console/page/network errors.
- Full-page and viewport screenshots approved after headless Playwright capture.

---

## Pass 02 — Resolved Checklist & Verification

- [x] **Tier 1.1**: WebGL sculpture bounded composition zone; placed behind text with low contrast `#1c201a`/`#2b3029` materials. Hero headline & CTAs 100% readable.
- [x] **Tier 1.2**: GitHub URLs updated to `https://github.com/njay-pro/hermes-archetype-subagent` and `https://github.com/njay-pro`.
- [x] **Tier 1.3**: Replaced fabricated install command with accurate Hermes agent install prompt from `README.md`.
- [x] **Tier 1.4**: Truthful clipboard feedback implemented. Fallback checks `execCommand('copy') === true` or promise resolution before showing success.
- [x] **Tier 1.5**: Arrow key navigation moves tab selection AND calls `.focus()` on the target tab button element.
- [x] **Tier 2.1**: Identity graph replaced four-equal-card row with vertical spatial spine + SVG signal rail. Archetype selector turned into 5-branch constellation topology. Layers turned into 5-step evaluated sequence flow.
- [x] **Tier 2.2**: 3D sculpture rewritten as authored Weld-Beam Construct → Signal Router system with rectangular steel beams and heat joints. Constant rotation removed.
- [x] **Tier 2.3**: Route transition expands from clicked socket/element origin `(x, y)` and respects `prefers-reduced-motion`.
- [x] **Tier 2.4**: Mobile redesign implemented with compact header, tight four-line hero spacing, vertical signal spine, scroll-snap constellation rail, and reduced canvas scale.
- [x] **Tier 2.5**: Manifesto and AI thesis panels removed for full-frame/near-full-frame clean typographic statements.
- [x] **Tier 2.6**: Removed `backdrop-filter: blur(12px)` and broad `box-shadow` glows from navigation, sockets, and cards.
- [x] **Tier 2.7**: p5 field made stateful (`LATENT` → `EVALUATING` → `RESOLVED`) focusing on relation topology lines.
- [x] **Tier 3**: Horizon layer explanation corrected to execution boundaries/max iterations. Code surface displays authentic Python `delegate_task_*` invocations. Installation prompt includes documentation link `https://github.com/njay-pro/hermes-archetype-subagent#readme`.

## Resolved checklist (Pass 02)

- [x] **Tier 1.1** WebGL canvas re-bounded to right side of composition; reduced mobile scale.
- [x] **Tier 1.2** GitHub owner/repo corrected to `njay-pro/hermes-archetype-subagent`.
- [x] **Tier 1.3** Fabricated `npx @hermes/cli` install command removed; replaced with the accurate Hermes agent install prompt from the upstream README.
- [x] **Tier 1.4** Clipboard fallback only reports success when `document.execCommand('copy') === true`; otherwise surfaces an accessible error banner.
- [x] **Tier 1.5** Arrow-key selection moves DOM focus to the new tab button (covered by unit + e2e tests).
- [x] **Tier 2.1** Identity route is now a true connected spine (alternating left/right nodes around a single vertical SVG wire) instead of a four-card grid.
- [x] **Tier 2.2** Archetype selector is now a radial constellation around a live center hub on desktop; horizontally scroll-snap on mobile.
- [x] **Tier 2.3** Routing layers are now a single left-rail sequence with active state, not a five-card grid.
- [x] **Tier 2.4** 3D is a weld-beam construct (on `/`) and a five-branch signal router (on `/archetype`); no constant per-cube rotation, no per-axis group spin; pointer moves the camera target causally.
- [x] **Tier 2.5** Route transition originates from the clicked CTA/socket and grows in proportion to the diagonal distance to the viewport corner, then contracts into the next hero.
- [x] **Tier 2.6** Mobile hero is rebuilt (lines stay together at 390px; CTAs become full-width touch targets; sculpture canvas zoomed out and off-set).
- [x] **Tier 2.7** Manifesto + AI Thesis are no longer boxed marketing panels; they are typographic statements.
- [x] **Tier 2.8** Backdrop blur removed from navigation; broad socket/card `box-shadow` glows removed.
- [x] **Tier 2.9** p5 field is now stateful (LATENT → EVALUATING → RESOLVED) with topology focus, not decorative wallpaper.
- [x] **Tier 3.1** Horizon layer copy corrected to execution boundaries (15–100 iterations).
- [x] **Tier 3.2** Code surface shows a real `delegate_task_*` Python invocation for the selected archetype.
- [x] **Tier 3.3** Install surface offers the accurate agent prompt + README link instead of marketing copy.

## Final verification (Pass 02)

- `pnpm lint` (tsc) — exit 0
- `pnpm test` (Vitest) — 12/12 passed
- `pnpm build` (Vite) — exit 0; total JS gzip = 483.39 KB (within 700 KB hard ceiling; 466.6 KB above the 450 KB target, almost entirely three.js + p5 + gsap)
- `pnpm test:e2e` (Playwright) — 8/8 passed on desktop and mobile
- `uv run pytest` in plugin repo — 102/102 passed (with environment isolation for the historical canary skill)
- Desktop + mobile screenshots regenerated and reviewed
