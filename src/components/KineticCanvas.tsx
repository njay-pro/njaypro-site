import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import * as THREE from 'three';
import './KineticCanvas.css';

/**
 * KineticCanvas — the heart of the home page.
 *
 * Two layers stacked:
 *   1. A p5.js particle field on a transparent canvas.
 *      - 100 particles, dark ink, on the warm paper background.
 *      - Gravity pulls them down. Mouse proximity deflects them
 *        with a soft inverse-square curl — no hard repulsion.
 *   2. A Three.js ASCII-rendered icosahedron floating behind the type.
 *      - Rendered to a low-res offscreen target, then sampled
 *        per-pixel in a shader that maps each cell to an ASCII char
 *        from the ramp " .,:;ilLtTfFjJnN".
 *      - Rotates at a fixed cadence — the page's heartbeat.
 *
 * Both render onto a single fullscreen canvas-bg layer.
 * Pointer events are turned OFF on the canvas so the type stays
 * clickable.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
}

const ASCII_RAMP = ' .,:;ilLtTfFjJnN';

export const KineticCanvas: React.FC<{ isReducedMotion?: boolean }> = ({
  isReducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let cleanupFns: Array<() => void> = [];

    /* ----------------------------------------------------------------------
       p5.js particles — drawn into a 2D canvas layered below the 3D form.
       ---------------------------------------------------------------------- */
    const sketch = (p: p5) => {
      const particles: Particle[] = [];
      const PARTICLE_COUNT = 110;
      const GRAVITY = 0.045;
      const MOUSE_RADIUS = 130;
      const MOUSE_FORCE = 0.55;

      const mouseX = { v: -9999 };
      const mouseY = { v: -9999 };

      const spawn = (fromTop = true): Particle => {
        return {
          x: p.random(p.width),
          y: fromTop ? p.random(-p.height, 0) : p.random(p.height),
          vx: p.random(-0.15, 0.15),
          vy: p.random(0.1, 0.5),
          mass: p.random(0.7, 1.4),
        };
      };

      p.setup = () => {
        const c = p.createCanvas(p.windowWidth, p.windowHeight);
        c.parent(container);
        c.position(0, 0);
        c.style('z-index', '1');
        c.style('pointer-events', 'none');

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(spawn(false));
        }
      };

      const onMove = (e: MouseEvent) => {
        mouseX.v = e.clientX;
        mouseY.v = e.clientY;
      };
      window.addEventListener('mousemove', onMove);
      cleanupFns.push(() => window.removeEventListener('mousemove', onMove));

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      p.draw = () => {
        // Soft paper-cream trail — gives a faint comet tail.
        p.noStroke();
        p.fill(247, 245, 240, 22);
        p.rect(0, 0, p.width, p.height);

        for (const part of particles) {
          // gravity
          part.vy += GRAVITY * part.mass;

          // mouse deflection — inverse-square curl, no hard repulsion.
          const dx = part.x - mouseX.v;
          const dy = part.y - mouseY.v;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < MOUSE_RADIUS * MOUSE_RADIUS && dist2 > 1) {
            const dist = Math.sqrt(dist2);
            const force = (MOUSE_FORCE * (MOUSE_RADIUS - dist)) / dist2;
            part.vx += dx * force;
            part.vy += dy * force * 0.5;
          }

          // damping so the field settles
          part.vx *= 0.985;
          part.vy *= 0.99;

          part.x += part.vx;
          part.y += part.vy;

          // respawn when off-bottom
          if (part.y > p.height + 30) {
            const fresh = spawn(true);
            part.x = fresh.x;
            part.y = fresh.y;
            part.vx = fresh.vx;
            part.vy = fresh.vy;
          }
          // wrap horizontal
          if (part.x < 0) part.x = p.width;
          else if (part.x > p.width) part.x = 0;

          // dot — small ink fleck
          p.fill(26, 26, 26, 180);
          p.circle(part.x, part.y, 1.6);
        }
      };
    };

    const p5Instance = new p5(sketch);
    cleanupFns.push(() => p5Instance.remove());

    /* ----------------------------------------------------------------------
       Three.js ASCII-rendered icosahedron, layered above p5.
       ---------------------------------------------------------------------- */
    if (!isReducedMotion) {
      try {
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        // We render to a low-res offscreen target.
        const RT_W = 240;
        const RT_H = Math.round(RT_H_dynamic(width, height));

        const renderTarget = new THREE.WebGLRenderTarget(RT_W, RT_H, {
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
        });

        // The actual 3D scene with the icosahedron
        const scene3d = new THREE.Scene();
        const perspCam = new THREE.PerspectiveCamera(45, RT_W / RT_H, 0.1, 100);
        perspCam.position.set(0, 0, 4);

        const light = new THREE.DirectionalLight(0xffffff, 1.2);
        light.position.set(2, 2, 3);
        scene3d.add(light);
        scene3d.add(new THREE.AmbientLight(0xffffff, 0.45));

        const geom = new THREE.IcosahedronGeometry(1.4, 4);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x1a1a1a,
          roughness: 0.55,
          metalness: 0.0,
        });
        const mesh = new THREE.Mesh(geom, mat);
        scene3d.add(mesh);

        // Post shader: sample RT, output ASCII char per cell.
        const shaderMat = new THREE.ShaderMaterial({
          uniforms: {
            uTex: { value: renderTarget.texture },
            uResolution: { value: new THREE.Vector2(width, height) },
            uCells: { value: new THREE.Vector2(RT_W, RT_H) },
            uColor: { value: new THREE.Color(0x1a1a1a) },
            uRampLen: { value: ASCII_RAMP.length },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTex;
            uniform vec2 uResolution;
            uniform vec2 uCells;
            uniform vec3 uColor;

            // The ASCII ramp in order of luminance (light → dark)
            const string chars = "${ASCII_RAMP}";
            int rampLen = ${ASCII_RAMP.length};

            void main() {
              // How many cells fit across the screen?
              vec2 screenCells = vec2(
                uResolution.x / 8.0,
                uResolution.y / 14.0
              );
              vec2 cell = floor(vUv * screenCells);
              vec2 cellUv = (cell + 0.5) / screenCells;

              // Sample luminance at this cell center
              float lum = texture2D(uTex, cellUv).r;
              // Pick a char from the ramp based on luminance
              int idx = int(floor(lum * float(rampLen)));
              idx = clamp(idx, 0, rampLen - 1);

              // Sub-cell position to draw the dot of the ASCII char
              vec2 subUv = fract(vUv * screenCells);
              // 4x6 dot pattern? We'll fake it with a circular dot if
              // the sub-cell position is near the centre.
              float dx = subUv.x - 0.5;
              float dy = subUv.y - 0.5;
              float d = length(vec2(dx, dy * 0.6));
              float dot_ = 1.0 - smoothstep(0.18, 0.32, d);

              // Only render the dot for chars whose luminance is below
              // the threshold (i.e. only dark cells become visible).
              float visible = (idx > 0) ? 1.0 : 0.0;

              gl_FragColor = vec4(uColor, dot_ * visible);
            }
          `,
          transparent: true,
        });

        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMat);
        scene.add(quad);

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
        });
        renderer.setPixelRatio(1);
        renderer.setSize(width, height);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.zIndex = '0';
        renderer.domElement.style.pointerEvents = 'none';
        renderer.domElement.style.mixBlendMode = 'multiply';
        container.appendChild(renderer.domElement);

        const onResize = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          renderer.setSize(w, h);
          shaderMat.uniforms.uResolution.value.set(w, h);
        };
        window.addEventListener('resize', onResize);
        cleanupFns.push(() => window.removeEventListener('resize', onResize));

        let raf = 0;
        const start = performance.now();
        const animate = () => {
          const t = (performance.now() - start) / 1000;
          // Fixed cadence — the heartbeat of the page.
          mesh.rotation.y = t * 0.34;
          mesh.rotation.x = t * 0.13;
          mesh.position.x = Math.sin(t * 0.42) * 0.32;
          mesh.position.y = Math.cos(t * 0.31) * 0.22;

          renderer.setRenderTarget(renderTarget);
          renderer.render(scene3d, perspCam);
          renderer.setRenderTarget(null);
          renderer.render(scene, camera);

          raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        cleanupFns.push(() => cancelAnimationFrame(raf));
        cleanupFns.push(() => renderer.dispose());
        cleanupFns.push(() => renderTarget.dispose());
      } catch (e) {
        // WebGL not available — fine, p5 particles still work.
        console.warn('[KineticCanvas] WebGL unavailable, 3D form skipped', e);
      }
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [isReducedMotion]);

  return <div ref={containerRef} className="kinetic-canvas" aria-hidden="true" />;
};

// Helper: dynamic RT height that respects aspect ratio of the screen.
// We need RT_H ≈ RT_W * (screen_h / screen_w). We don't know screen yet
// so return a sensible default — the renderer.setSize on init recalcs.
function RT_H_dynamic(_w: number, h: number): number {
  return Math.max(80, Math.round((240 * h) / Math.max(_w, 1) * 1.2));
}
