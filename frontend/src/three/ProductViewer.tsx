import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createStudioEnv } from "@/three/environment";
import { createDevice, createScreenTexture } from "@/three/devices";
import {
  applyScreenTexture,
  applyTint,
  instantiate,
  loadDeviceModel,
} from "@/three/loadModel";
import { useTheme } from "@/hooks/useTheme";
import type { Kind } from "@/data/catalog";

const FRAME: Record<Kind, number> = {
  phone: 3.2,
  laptop: 3.9,
  tablet: 3.6,
  watch: 2.3,
  audio: 2.6,
};

/** Interactive single-product viewer: drag to rotate, gentle auto-orbit. */
export const ProductViewer = ({
  kind,
  image,
  name,
  tint,
}: {
  kind: Kind;
  image: string;
  name: string;
  tint?: string;
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<THREE.Object3D | null>(null);
  const tintRef = useRef(tint);
  tintRef.current = tint;
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    const size = () => ({
      w: host.clientWidth || 600,
      h: host.clientHeight || 520,
    });
    const { w, h } = size();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.setAttribute("data-testid", "product-viewer-canvas");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0.6, 0.35, FRAME[kind]);

    const envMap = createStudioEnv(renderer, dark);
    scene.environment = envMap;

    const model = createDevice(kind, envMap, dark);
    if (model.lid) model.lid.rotation.x = -0.2;
    const holder = new THREE.Group();
    holder.add(model.group);
    scene.add(holder);
    subjectRef.current = holder;

    let disposed = false;
    let screenMap: THREE.Texture | null = null;
    loadDeviceModel(kind).then((loaded) => {
      if (!loaded || disposed) return;
      const real = instantiate(loaded, envMap);
      screenMap = createScreenTexture(kind);
      applyScreenTexture(real, screenMap);
      holder.remove(model.group);
      holder.add(real);
      if (tintRef.current) applyTint(holder, tintRef.current);
    });

    scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.5 : 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-4, -2, -3);
    scene.add(fill);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;
    controls.minPolarAngle = Math.PI / 3.6;
    controls.maxPolarAngle = Math.PI / 1.7;

    let raf = 0;
    const loop = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const ro = new ResizeObserver(() => {
      const next = size();
      camera.aspect = next.w / next.h;
      camera.updateProjectionMatrix();
      renderer.setSize(next.w, next.h);
    });
    ro.observe(host);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      model.dispose();
      screenMap?.dispose();
      envMap.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      subjectRef.current = null;
    };
  }, [kind, dark]);

  useEffect(() => {
    if (subjectRef.current && tint) applyTint(subjectRef.current, tint);
  }, [tint]);

  if (failed) {
    return (
      <img
        src={image}
        alt={name}
        className="h-full w-full rounded-[1.6rem] object-cover"
        data-testid="product-viewer-fallback"
      />
    );
  }

  return (
    <div
      ref={hostRef}
      className="relative h-full w-full overflow-hidden rounded-[1.6rem]"
      data-testid="product-viewer"
      style={{
        background:
          "radial-gradient(120% 90% at 30% 10%, var(--ab-surface) 0%, var(--ab-bg-deep) 100%)",
        border: "1px solid var(--ab-line)",
      }}
    >
      <span
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.24em]"
        style={{ background: "var(--ab-glass)", color: "var(--ab-text-dim)" }}
      >
        Drag to rotate
      </span>
    </div>
  );
};
