import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSculptureProps {
  mode: 'identity' | 'archetype';
  activeIndex?: number; // 0..3 for identity, 0..4 for archetype
  isReducedMotion?: boolean;
  routeSettled?: boolean;
}

export const ThreeSculpture: React.FC<ThreeSculptureProps> = ({
  mode,
  activeIndex = 0,
  isReducedMotion = false,
  routeSettled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a09, 0.06);

    // Camera setup with bounded composition zone
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Offset camera position on desktop to keep 3D sculpture in right composition zone, away from hero text
    const targetOffsetX = isMobile ? 0 : 3.2;
    const targetOffsetY = isMobile ? -0.7 : 0;
    camera.position.set(0, 0, isMobile ? 16 : 14);
    const cameraTarget = new THREE.Vector3(targetOffsetX, targetOffsetY, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Controlled Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xf0eee6, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa8ffb8, 1.0);
    dirLight.position.set(6, 10, 8);
    scene.add(dirLight);

    const pointLightAmber = new THREE.PointLight(0xd88c45, 1.5, 12);
    pointLightAmber.position.set(-3, -2, 3);
    scene.add(pointLightAmber);

    const pointLightCyan = new THREE.PointLight(0x65d9e8, 1.5, 12);
    pointLightCyan.position.set(4, 3, -1);
    scene.add(pointLightCyan);

    // Weld-Beam Construct & Signal Router Geometries
    // Long rectangular steel beams and heat joint plates
    const BEAM_COUNT = isMobile ? 40 : 80;
    const JOINT_COUNT = isMobile ? 25 : 50;

    const beamGeometry = new THREE.BoxGeometry(0.16, 1.6, 0.16);
    const jointGeometry = new THREE.BoxGeometry(0.32, 0.32, 0.32);

    const beamMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c201a,
      metalness: 0.85,
      roughness: 0.3,
    });

    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b3029,
      metalness: 0.6,
      roughness: 0.4,
    });

    const beamMesh = new THREE.InstancedMesh(beamGeometry, beamMaterial, BEAM_COUNT);
    const jointMesh = new THREE.InstancedMesh(jointGeometry, jointMaterial, JOINT_COUNT);
    scene.add(beamMesh);
    scene.add(jointMesh);

    // Matrix dummy helpers
    const dummy = new THREE.Object3D();
    const beamTargets: { pos: THREE.Vector3; rot: THREE.Euler; scale: THREE.Vector3; col: THREE.Color }[] = [];
    const jointTargets: { pos: THREE.Vector3; col: THREE.Color }[] = [];

    const beamCurrent: THREE.Vector3[] = [];
    const jointCurrent: THREE.Vector3[] = [];

    const colorMint = new THREE.Color(0xa8ffb8);
    const colorAmber = new THREE.Color(0xd88c45);
    const colorCyan = new THREE.Color(0x65d9e8);
    const colorOxide = new THREE.Color(0x873f2d);
    const colorSteel = new THREE.Color(0x2b3029);

    for (let i = 0; i < BEAM_COUNT; i++) {
      beamTargets.push({
        pos: new THREE.Vector3(),
        rot: new THREE.Euler(),
        scale: new THREE.Vector3(1, 1, 1),
        col: colorSteel.clone(),
      });
      beamCurrent.push(new THREE.Vector3());
    }

    for (let i = 0; i < JOINT_COUNT; i++) {
      jointTargets.push({
        pos: new THREE.Vector3(),
        col: colorSteel.clone(),
      });
      jointCurrent.push(new THREE.Vector3());
    }

    // Authored structural positions calculation
    const computeStructure = () => {
      if (mode === 'identity') {
        // Authored Weld-Beam Construct across 4 identity states
        for (let i = 0; i < BEAM_COUNT; i++) {
          const u = i / BEAM_COUNT;
          const pos = new THREE.Vector3();
          const rot = new THREE.Euler();
          let col = colorSteel.clone();

          if (activeIndex === 0) {
            // 01 / FABRICATION: Joined steel frame with amber heat joints
            const layer = Math.floor(i / 8);
            const sub = i % 8;
            pos.set(
              (sub - 3.5) * 0.55,
              (layer - 4) * 0.85,
              (sub % 2 === 0 ? 0.3 : -0.3)
            );
            rot.set(0, 0, (sub % 2 === 0 ? 0 : Math.PI / 2));
            if (i % 5 === 0) col = colorAmber.clone();
          } else if (activeIndex === 1) {
            // 02 / VISUAL SYSTEMS: Structural alignment grid
            const cols = 8;
            const gx = (i % cols) - cols / 2;
            const gy = Math.floor(i / cols) - (BEAM_COUNT / cols) / 2;
            pos.set(gx * 0.7, gy * 0.7, (gx + gy) * 0.15);
            rot.set(0, 0, (gx % 2 === 0 ? 0 : Math.PI / 2));
            if (i % 4 === 0) col = colorMint.clone();
          } else if (activeIndex === 2) {
            // 03 / PROCEDURAL WORLDS: Interlocking logic lattice
            const angle = u * Math.PI * 8;
            const rad = 2.0;
            pos.set(Math.cos(angle) * rad, (u - 0.5) * 6, Math.sin(angle) * rad);
            rot.set(angle * 0.5, angle, 0);
            if (i % 3 === 0) col = colorCyan.clone();
          } else {
            // 04 / AGENT SYSTEMS: Orchestration construct with mint signal
            const phi = Math.acos(-1 + (2 * i) / BEAM_COUNT);
            const theta = Math.sqrt(BEAM_COUNT * Math.PI) * phi;
            const rad = 2.8;
            pos.set(
              rad * Math.cos(theta) * Math.sin(phi),
              rad * Math.sin(theta) * Math.sin(phi),
              rad * Math.cos(phi)
            );
            rot.set(phi, theta, 0);
            if (i % 3 === 0) col = colorMint.clone();
            else if (i % 7 === 0) col = colorAmber.clone();
          }

          beamTargets[i].pos.copy(pos);
          beamTargets[i].rot.copy(rot);
          beamTargets[i].col = col;
          if (beamCurrent[i].lengthSq() === 0) beamCurrent[i].copy(pos);
        }

        // Joints at structural intersections
        for (let i = 0; i < JOINT_COUNT; i++) {
          const u = i / JOINT_COUNT;
          const pos = new THREE.Vector3();
          let col = colorSteel.clone();

          const bIdx = Math.floor(u * BEAM_COUNT);
          pos.copy(beamTargets[bIdx]?.pos || new THREE.Vector3());

          if (activeIndex === 0 && i % 3 === 0) col = colorAmber.clone();
          else if (activeIndex === 1 && i % 4 === 0) col = colorMint.clone();
          else if (activeIndex === 2 && i % 3 === 0) col = colorCyan.clone();
          else if (activeIndex === 3 && i % 2 === 0) col = colorMint.clone();

          jointTargets[i].pos.copy(pos);
          jointTargets[i].col = col;
          if (jointCurrent[i].lengthSq() === 0) jointCurrent[i].copy(pos);
        }
      } else {
        // Archetype Mode: Precise Five-Branch Beam Router
        for (let i = 0; i < BEAM_COUNT; i++) {
          const branch = i % 5;
          const step = Math.floor(i / 5);
          const angle = (branch * (Math.PI * 2 / 5)) - Math.PI / 2;
          const dist = 0.8 + step * 0.45;

          const pos = new THREE.Vector3(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist,
            (step - 4) * 0.2
          );
          const rot = new THREE.Euler(0, 0, angle);

          let col = colorSteel.clone();
          if (branch === activeIndex) {
            if (branch === 0) col = colorAmber.clone();
            else if (branch === 1) col = colorMint.clone();
            else if (branch === 2) col = colorOxide.clone();
            else col = colorCyan.clone();
          }

          beamTargets[i].pos.copy(pos);
          beamTargets[i].rot.copy(rot);
          beamTargets[i].col = col;
          if (beamCurrent[i].lengthSq() === 0) beamCurrent[i].copy(pos);
        }

        for (let i = 0; i < JOINT_COUNT; i++) {
          const branch = i % 5;
          const step = Math.floor(i / 5);
          const angle = (branch * (Math.PI * 2 / 5)) - Math.PI / 2;
          const dist = 1.0 + step * 0.6;

          const pos = new THREE.Vector3(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist,
            (step - 3) * 0.25
          );

          let col = colorSteel.clone();
          if (branch === activeIndex) {
            if (branch === 0) col = colorAmber.clone();
            else if (branch === 1) col = colorMint.clone();
            else if (branch === 2) col = colorOxide.clone();
            else col = colorCyan.clone();
          }

          jointTargets[i].pos.copy(pos);
          jointTargets[i].col = col;
          if (jointCurrent[i].lengthSq() === 0) jointCurrent[i].copy(pos);
        }
      }
    };

    computeStructure();

    let animationFrameId: number;

    const render = () => {
      // Causal pointer movement (gently shifts camera target, NO constant spinning)
      const targetCamX = targetOffsetX + pointerRef.current.x * 0.45;
      const targetCamY = targetOffsetY + pointerRef.current.y * 0.45;
      cameraTarget.x += (targetCamX - cameraTarget.x) * 0.05;
      cameraTarget.y += (targetCamY - cameraTarget.y) * 0.05;
      camera.lookAt(cameraTarget);

      // Lerp beam positions
      for (let i = 0; i < BEAM_COUNT; i++) {
        if (!isReducedMotion) {
          beamCurrent[i].lerp(beamTargets[i].pos, 0.08);
        } else {
          beamCurrent[i].copy(beamTargets[i].pos);
        }

        dummy.position.copy(beamCurrent[i]);
        dummy.rotation.copy(beamTargets[i].rot);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();

        beamMesh.setMatrixAt(i, dummy.matrix);
        beamMesh.setColorAt(i, beamTargets[i].col);
      }

      // Lerp joint positions
      for (let i = 0; i < JOINT_COUNT; i++) {
        if (!isReducedMotion) {
          jointCurrent[i].lerp(jointTargets[i].pos, 0.08);
        } else {
          jointCurrent[i].copy(jointTargets[i].pos);
        }

        dummy.position.copy(jointCurrent[i]);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();

        jointMesh.setMatrixAt(i, dummy.matrix);
        jointMesh.setColorAt(i, jointTargets[i].col);
      }

      beamMesh.instanceMatrix.needsUpdate = true;
      if (beamMesh.instanceColor) beamMesh.instanceColor.needsUpdate = true;

      jointMesh.instanceMatrix.needsUpdate = true;
      if (jointMesh.instanceColor) jointMesh.instanceColor.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const animate = () => {
      if (document.visibilityState !== 'hidden') {
        render();
      }
      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isReducedMotion) {
      render();
    } else {
      animate();
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (isReducedMotion) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerRef.current = { x, y };
    };

    window.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      render();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      beamGeometry.dispose();
      jointGeometry.dispose();
      beamMaterial.dispose();
      jointMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode, activeIndex, isReducedMotion, routeSettled]);

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
        zIndex: 'var(--z-canvas)',
        pointerEvents: 'none',
        opacity: routeSettled ? (mode === 'identity' ? 0.42 : 0.48) : 0,
        transition: 'opacity 320ms ease',
      }}
    />
  );
};
