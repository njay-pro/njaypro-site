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
