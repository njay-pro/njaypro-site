import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

export type FieldState = 'LATENT' | 'EVALUATING' | 'RESOLVED';

interface P5FieldProps {
  fieldState?: FieldState;
  activeSignal?: 'amber' | 'mint' | 'cyan' | 'oxide';
  isReducedMotion?: boolean;
}

export const P5Field: React.FC<P5FieldProps> = ({
  fieldState = 'LATENT',
  activeSignal = 'mint',
  isReducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ fieldState, activeSignal, isReducedMotion });

  useEffect(() => {
    stateRef.current = { fieldState, activeSignal, isReducedMotion };
  }, [fieldState, activeSignal, isReducedMotion]);

  useEffect(() => {
    if (!containerRef.current) return;

    let p5Instance: p5 | null = null;

    const sketch = (p: p5) => {
      const NODE_COUNT = 45;
      const MAX_DIST = 140;

      interface FieldNode {
        x: number;
        y: number;
        vx: number;
        vy: number;
        pulsePhase: number;
      }

      let nodes: FieldNode[] = [];

      const getSignalRGB = (sig: string) => {
        switch (sig) {
          case 'amber': return [216, 140, 69];
          case 'cyan': return [101, 217, 232];
          case 'oxide': return [135, 63, 45];
          case 'mint':
          default: return [168, 255, 184];
        }
      };

      p.setup = () => {
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;

        const canvas = p.createCanvas(width, height);
        canvas.style('display', 'block');

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        p.pixelDensity(dpr);
        p.randomSeed(42);

        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
          nodes.push({
            x: p.random(width),
            y: p.random(height),
            vx: p.random(-0.15, 0.15),
            vy: p.random(-0.15, 0.15),
            pulsePhase: p.random(0, Math.PI * 2),
          });
        }

        if (isReducedMotion) {
          p.noLoop();
          renderField();
        }
      };

      const renderField = () => {
        const { fieldState: currentFS, activeSignal: currentAS } = stateRef.current;
        p.background(9, 10, 9); // --bg-void #090A09

        const [r, g, b] = getSignalRGB(currentAS);

        // State parameters
        let lineBaseAlpha = 0.12;
        let lineWeight = 1;
        let pulseSpeed = 0.02;

        if (currentFS === 'EVALUATING') {
          lineBaseAlpha = 0.25;
          lineWeight = 1.25;
          pulseSpeed = 0.05;
        } else if (currentFS === 'RESOLVED') {
          lineBaseAlpha = 0.18;
          lineWeight = 1;
          pulseSpeed = 0.01;
        }

        // Draw topology relation lines
        for (let i = 0; i < nodes.length; i++) {
          const ni = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const nj = nodes[j];
            const dx = ni.x - nj.x;
            const dy = ni.y - nj.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < MAX_DIST * MAX_DIST) {
              const dist = Math.sqrt(distSq);
              const distFactor = 1 - dist / MAX_DIST;
              const alpha = distFactor * lineBaseAlpha;

              if (currentFS === 'EVALUATING' && (i + j) % 5 === 0) {
                // Traveling pulse on signal wire
                p.stroke(r, g, b, alpha * 255 * 1.5);
                p.strokeWeight(lineWeight);
              } else {
                p.stroke(43, 48, 41, alpha * 255 * 1.8); // --line-structural #2B3029
                p.strokeWeight(lineWeight);
              }

              p.line(ni.x, ni.y, nj.x, nj.y);
            }
          }
        }

        // Draw subtle node joints (minimal dots, not heavy colored circles)
        p.noStroke();
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.pulsePhase += pulseSpeed;

          if (currentFS === 'EVALUATING' && i % 8 === 0) {
            p.fill(r, g, b, 120);
            p.ellipse(node.x, node.y, 3, 3);
          } else if (currentFS === 'RESOLVED' && i % 12 === 0) {
            p.fill(r, g, b, 160);
            p.ellipse(node.x, node.y, 2.5, 2.5);
          } else {
            p.fill(69, 75, 66, 60); // --line-strong #454B42
            p.ellipse(node.x, node.y, 2, 2);
          }
        }
      };

      p.draw = () => {
        if (stateRef.current.isReducedMotion) return;
        if (document.visibilityState === 'hidden') return;

        const width = p.width;
        const height = p.height;

        // Update positions smoothly
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        renderField();
      };

      p.windowResized = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        p.resizeCanvas(width, height);
        if (stateRef.current.isReducedMotion) renderField();
      };
    };

    p5Instance = new p5(sketch, containerRef.current);

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        p5Instance?.noLoop();
      } else if (!stateRef.current.isReducedMotion) {
        p5Instance?.loop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      p5Instance?.remove();
    };
  }, [isReducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 'var(--z-bg)',
        pointerEvents: 'none',
        opacity: 0.7,
      }}
    />
  );
};
