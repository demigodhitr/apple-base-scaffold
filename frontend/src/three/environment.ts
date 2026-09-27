import * as THREE from "three";

/** Procedural studio "softbox" environment — gives the metal something to reflect. */
export function createStudioEnv(
  renderer: THREE.WebGLRenderer,
  dark: boolean,
): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const base = ctx.createLinearGradient(0, 0, 0, 512);
  if (dark) {
    base.addColorStop(0, "#1a1c22");
    base.addColorStop(0.45, "#0b0c10");
    base.addColorStop(1, "#000000");
  } else {
    base.addColorStop(0, "#ffffff");
    base.addColorStop(0.5, "#dfe3ea");
    base.addColorStop(1, "#9aa1ad");
  }
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 512);

  // bright softboxes
  const boxes: Array<[number, number, number, string]> = dark
    ? [
        [190, 120, 190, "rgba(255,255,255,0.92)"],
        [700, 90, 150, "rgba(120,180,255,0.7)"],
        [470, 300, 200, "rgba(255,122,47,0.45)"],
      ]
    : [
        [200, 110, 210, "rgba(255,255,255,1)"],
        [720, 80, 180, "rgba(255,255,255,0.95)"],
        [480, 320, 230, "rgba(0,113,227,0.35)"],
      ];

  boxes.forEach(([x, y, r, color]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  });

  // horizon band for a crisp reflection line
  ctx.fillStyle = dark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.55)";
  ctx.fillRect(0, 250, 1024, 8);

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  const rt = new THREE.WebGLCubeRenderTarget(256);
  rt.fromEquirectangularTexture(renderer, tex);
  tex.dispose();
  return rt.texture;
}

export function createParticles(dark: boolean): THREE.Points {
  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = 4 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.032,
    color: new THREE.Color(dark ? "#8fb6ff" : "#6b7280"),
    transparent: true,
    opacity: dark ? 0.75 : 0.42,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}
