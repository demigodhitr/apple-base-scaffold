import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createParticles, createStudioEnv } from "@/three/environment";

gsap.registerPlugin(ScrollTrigger);

type SceneRefs = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  rig: THREE.Group;
  spinner: THREE.Group;
  material: THREE.MeshStandardMaterial;
  particles: THREE.Points;
};

/** Builds the metallic hero mesh, lights it, and links scroll progress to its transform. */
export function useThreeScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  dark: boolean,
) {
  const refs = useRef<SceneRefs | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 5);

    const envMap = createStudioEnv(renderer, dark);
    scene.environment = envMap;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(dark ? "#7f8898" : "#787f8d"),
      roughness: 0.28,
      metalness: 1,
      envMap,
      envMapIntensity: dark ? 1.2 : 1,
    });

    const geometry = new THREE.TorusKnotGeometry(1, 0.34, 256, 40);
    const mesh = new THREE.Mesh(geometry, material);

    const ringGeo = new THREE.TorusGeometry(1.95, 0.008, 8, 220);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(dark ? "#2997ff" : "#0071e3"),
      transparent: true,
      opacity: 0.26,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;

    const spinner = new THREE.Group();
    spinner.add(mesh);
    spinner.add(ring);

    const rig = new THREE.Group();
    rig.position.x = 1.25;
    rig.add(spinner);
    scene.add(rig);

    const particles = createParticles(dark);
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.3 : 0.38));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(5, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-5, -5, -2);
    scene.add(fill);
    const rim = new THREE.PointLight(dark ? 0xff7a2f : 0xffffff, 1.2);
    rim.position.set(0, 2, 2);
    scene.add(rim);

    refs.current = { renderer, scene, camera, rig, spinner, material, particles };

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      spinner.rotation.y += 0.0022;
      spinner.position.y = Math.sin(t * 0.7) * 0.08;
      ring.rotation.z = t * 0.12;
      particles.rotation.y = t * 0.02;
      camera.position.x += (pointer.x * 0.28 - camera.position.x) * 0.045;
      camera.position.y += (-pointer.y * 0.2 - camera.position.y) * 0.045;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();
      envMap.dispose();
      renderer.dispose();
      refs.current = null;
    };
    // scene is rebuilt on theme change so reflections/lighting match the palette
  }, [canvasRef, dark]);

  /* Scroll choreography: three distinct phases across the whole page. */
  useEffect(() => {
    const s = refs.current;
    if (!s) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { rig, camera } = s;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 — cinematic spin + swell (Hero → Precision Engineered)
      tl.to(rig.rotation, { y: Math.PI, x: 0.55 }, 0)
        .to(rig.scale, { x: 1.25, y: 1.25, z: 1.25 }, 0)
        .to(rig.position, { x: 1.55 }, 0)
        // Phase 2 — slide aside + macro zoom (Precision → Showcase)
        .to(rig.rotation, { y: Math.PI * 2.1, x: -0.25 }, 1)
        .to(rig.position, { x: 1.15, y: -0.25 }, 1)
        .to(rig.scale, { x: 1.8, y: 1.8, z: 1.8 }, 1)
        .to(camera.position, { z: 3.4 }, 1)
        // Phase 3 — return to a floating centre (Showcase → Available Now)
        .to(rig.rotation, { y: Math.PI * 2.75, x: 0 }, 2)
        .to(rig.position, { x: 0.8, y: 0 }, 2)
        .to(rig.scale, { x: 1.05, y: 1.05, z: 1.05 }, 2)
        .to(camera.position, { z: 5.6 }, 2);
    });

    return () => ctx.revert();
  }, [dark]);

  return { failed };
}
