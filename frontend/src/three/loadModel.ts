import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { Kind } from "@/data/catalog";

/**
 * Optional real device models. Drop .glb files into /app/frontend/public/models/
 * and they are used automatically; otherwise the procedural devices are kept.
 */
const FILES: Record<Kind, string> = {
  phone: "iphone.glb",
  laptop: "macbook.glb",
  tablet: "ipad.glb",
  watch: "watch.glb",
  audio: "buds.glb",
};

/** Target size (largest dimension, in scene units) so any model frames identically. */
const TARGET: Record<Kind, number> = {
  phone: 1.55,
  laptop: 2,
  tablet: 1.78,
  watch: 0.85,
  audio: 1,
};

const cache = new Map<string, Promise<THREE.Object3D | null>>();

function normalize(root: THREE.Object3D, kind: Kind) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const largest = Math.max(size.x, size.y, size.z) || 1;
  const scale = TARGET[kind] / largest;
  root.position.sub(center);
  const wrapper = new THREE.Group();
  wrapper.add(root);
  wrapper.scale.setScalar(scale);
  return wrapper;
}

async function fetchModel(kind: Kind): Promise<THREE.Object3D | null> {
  const url = `/models/${FILES[kind]}`;
  try {
    const probe = await fetch(url, { method: "GET", headers: { Range: "bytes=0-3" } });
    if (!probe.ok) return null;
    const type = probe.headers.get("content-type") ?? "";
    if (type.includes("text/html")) return null; // dev server fallback page
  } catch {
    return null;
  }

  try {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(draco);
    const gltf = await loader.loadAsync(url);
    return normalize(gltf.scene, kind);
  } catch {
    return null;
  }
}

export function loadDeviceModel(kind: Kind) {
  if (!cache.has(kind)) cache.set(kind, fetchModel(kind));
  return cache.get(kind)!;
}

/** Lights up a real model's display by fitting an emissive plane over the panel. */
export function applyScreenTexture(root: THREE.Object3D, map: THREE.Texture) {
  const targets: THREE.Mesh[] = [];
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && /matte|display|screen_?surface/i.test(mesh.name)) targets.push(mesh);
  });

  targets.forEach((mesh) => {
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    const normals = mesh.geometry.getAttribute("normal");
    if (!box || !normals) return;

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // outward direction of the panel, averaged from its own normals
    const normal = new THREE.Vector3();
    const sample = new THREE.Vector3();
    const count = Math.min(normals.count, 240);
    for (let i = 0; i < count; i += 1) {
      sample.fromBufferAttribute(normals, i);
      normal.add(sample);
    }
    if (normal.lengthSq() === 0) return;
    normal.normalize();

    const dims = [size.x, size.y, size.z].sort((a, b) => b - a);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(dims[0] * 0.97, dims[1] * 0.97),
      new THREE.MeshBasicMaterial({ map, toneMapped: false }),
    );
    plane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    plane.position.copy(center).addScaledVector(normal, dims[0] * 0.004);
    mesh.add(plane);
  });
}

/** Finds the hinged lid/display node of a laptop model, if the author kept one. */
export function findLid(root: THREE.Object3D): THREE.Object3D | null {
  let found: THREE.Object3D | null = null;
  root.traverse((child) => {
    if (found) return;
    if (/^(screen|lid|display|top)/i.test(child.name)) found = child;
  });
  return found;
}

/** Clone + re-light a loaded model so several viewers can share one download. */
export function instantiate(model: THREE.Object3D, envMap: THREE.Texture) {
  const clone = model.clone(true);
  clone.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((mat) => {
      const std = mat as THREE.MeshStandardMaterial;
      if ("envMap" in std) {
        std.envMap = envMap;
        std.envMapIntensity = 1.1;
        std.needsUpdate = true;
      }
    });
  });
  return clone;
}
