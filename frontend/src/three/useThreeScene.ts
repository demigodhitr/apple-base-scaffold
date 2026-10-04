import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createParticles, createStudioEnv } from "@/three/environment";
import { createDevice, createScreenTexture, type DeviceModel } from "@/three/devices";
import {
  applyScreenTexture,
  findLid,
  instantiate,
  loadDeviceModel,
} from "@/three/loadModel";
import type { Kind } from "@/data/catalog";

gsap.registerPlugin(ScrollTrigger);

type Stage = {
  holder: THREE.Group;
  inner: THREE.Group;
  model: DeviceModel;
};

/**
 * Hero device stage: an iPhone presents itself, hands off to a MacBook that
 * opens its lid, then a Watch orbits in — each act tied to its own section.
 */
export function useThreeScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  dark: boolean,
) {
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState(0);
  const stagesRef = useRef<{ phone: Stage; laptop: Stage; watch: Stage } | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lidRef = useRef<THREE.Object3D | null>(null);
  const lidOpenRef = useRef(-0.18);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: window.devicePixelRatio < 2,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const envMap = createStudioEnv(renderer, dark);
    scene.environment = envMap;

    const compact = window.innerWidth < 1024;
    const rx = compact ? 0.05 : 1.55;
    const base = compact ? 0.72 : 1;
    let disposed = false;
    const screenMaps: THREE.Texture[] = [];

    const makeStage = (
      kind: Kind,
      position: [number, number, number],
      scale: number,
    ): Stage => {
      const model = createDevice(kind, envMap, dark);
      const inner = new THREE.Group();
      inner.add(model.group);
      const holder = new THREE.Group();
      holder.add(inner);
      holder.position.set(...position);
      holder.scale.setScalar(scale);
      scene.add(holder);

      // upgrade to the real .glb in /public/models when it arrives
      loadDeviceModel(kind).then((loaded) => {
        if (!loaded || disposed) return;
        const real = instantiate(loaded, envMap);
        inner.remove(model.group);
        inner.add(real);
        if (kind === "laptop" || kind === "tablet" || kind === "phone") {
          const map = createScreenTexture(kind);
          screenMaps.push(map);
          applyScreenTexture(real, map);
        }
        if (kind === "laptop") {
          const realLid = findLid(real);
          lidRef.current = realLid;
          if (realLid) lidOpenRef.current = realLid.rotation.x;
        }
        setVersion((v) => v + 1);
      });

      return { holder, inner, model };
    };

    const phone = makeStage("phone", [rx, -0.05, 0], 1.12 * base);
    phone.holder.rotation.y = -0.45;

    const laptop = makeStage("laptop", [rx + 0.35, -3.4, 0], 0.62 * base);
    laptop.holder.rotation.set(0.2, -0.5, 0);

    const watchStage = makeStage("watch", [5.8, 1.9, 0], 1.05 * base);

    const particles = createParticles(dark);
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.45 : 0.75));
    const key = new THREE.DirectionalLight(0xffffff, dark ? 1.6 : 1.35);
    key.position.set(4, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.45);
    fill.position.set(-5, -3, -2);
    scene.add(fill);
    const rim = new THREE.PointLight(dark ? 0xff7a2f : 0x99bbff, 1.3, 14);
    rim.position.set(-1.5, 1.5, 2.5);
    scene.add(rim);

    stagesRef.current = { phone, laptop, watch: watchStage };

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      phone.inner.position.y = Math.sin(t * 0.8) * 0.06;
      phone.inner.rotation.z = Math.sin(t * 0.5) * 0.03;
      laptop.inner.position.y = Math.sin(t * 0.7 + 1) * 0.05;
      watchStage.inner.rotation.y = Math.sin(t * 0.35) * 0.4;
      watchStage.inner.position.y = Math.sin(t * 0.9) * 0.05;
      particles.rotation.y = t * 0.015;
      camera.position.x += (pointer.x * 0.22 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.16 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      [phone, laptop, watchStage].forEach((s) => s.model.dispose());
      screenMaps.forEach((m) => m.dispose());
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();
      envMap.dispose();
      renderer.dispose();
      stagesRef.current = null;
      cameraRef.current = null;
    };
  }, [canvasRef, dark]);

  /* Scroll choreography — one trigger per section so the handoffs land with the copy. */
  useEffect(() => {
    const stages = stagesRef.current;
    const camera = cameraRef.current;
    if (!stages || !camera) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { phone, laptop, watch } = stages;
    const lid = lidRef.current ?? laptop.model.lid!;
    const lidOpen = lidRef.current ? lidOpenRef.current : -0.18;
    lid.rotation.x = lidRef.current ? lidOpen - Math.PI / 2 : -Math.PI / 2 + 0.05;
    const compact = window.innerWidth < 1024;
    const rx = compact ? 0.05 : 1.55;
    const common = { scrub: 0.5 as const, invalidateOnRefresh: true };

    const ctx = gsap.context(() => {
      // Act 1 — the iPhone turns to camera, then spins out of frame
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", ...common },
        })
        .to(phone.holder.rotation, { y: 0.9, duration: 0.6 }, 0)
        .to(phone.holder.position, { x: rx + 0.15, y: 0.12, duration: 0.6 }, 0)
        .to(phone.holder.rotation, { y: 3.6, x: 0.45, duration: 0.4 }, 0.6)
        .to(phone.holder.position, { x: rx + 3.8, y: 0.8, duration: 0.4 }, 0.62)
        .to(phone.holder.scale, { x: 0.65, y: 0.65, z: 0.65, duration: 0.4 }, 0.62);

      // Act 2 — the MacBook rises into frame and opens
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "#features", start: "top bottom", end: "bottom top", ...common },
        })
        .to(laptop.holder.position, { y: -0.2, duration: 0.25 }, 0)
        .to(lid.rotation, { x: lidOpen, duration: 0.3 }, 0.2)
        .to(laptop.holder.rotation, { y: 0.3, x: 0.3, duration: 0.55 }, 0.25)
        .to(laptop.holder.position, { y: -4, duration: 0.18 }, 0.85)
        .to(laptop.holder.rotation, { y: 1.2, duration: 0.18 }, 0.85);

      // Act 3 — the Watch orbits in over the closing chapter
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "#specs", start: "top bottom", end: "bottom 35%", ...common },
        })
        .to(watch.holder.position, { x: rx - 0.3, y: -0.6, duration: 0.45 }, 0)
        .to(watch.holder.rotation, { y: Math.PI * 2, duration: 0.6 }, 0)
        .to(watch.holder.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.35 }, 0.45)
        .to(watch.holder.rotation, { y: Math.PI * 2.4, duration: 0.2 }, 0.8);

      // the footer gets a clean stage — the watch slides out of frame
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "footer", start: "top 92%", end: "top 45%", ...common },
        })
        .to(watch.holder.position, { x: rx + 5, y: 0.8, duration: 1 }, 0)
        .to(watch.holder.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 1 }, 0);
    });

    return () => ctx.revert();
  }, [dark, version]);

  return { failed };
}
