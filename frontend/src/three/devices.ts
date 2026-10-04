import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Kind } from "@/data/catalog";

export type DeviceModel = {
  group: THREE.Group;
  lid?: THREE.Group;
  dispose: () => void;
};

type Bin = Array<THREE.BufferGeometry | THREE.Material | THREE.Texture>;

/* ------------------------------------------------------------------ *
 * Screen art — drawn with rounded corners on black so the plane reads
 * like a real display with bezels.
 * ------------------------------------------------------------------ */

function screenTexture(kind: Kind, bin: Bin): THREE.Texture {
  const landscape = kind === "laptop";
  const c = document.createElement("canvas");
  c.width = landscape ? 1024 : 620;
  c.height = landscape ? 660 : 1280;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#04040a";
  ctx.fillRect(0, 0, c.width, c.height);

  const inset = landscape ? 26 : 18;
  const radius = kind === "watch" ? 150 : landscape ? 14 : 84;
  const w = c.width - inset * 2;
  const h = c.height - inset * 2;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(inset, inset, w, h, radius);
  ctx.clip();

  const ramps: Record<Kind, [string, string, string]> = {
    phone: ["#ff8a3d", "#c22a86", "#241a6b"],
    laptop: ["#17245c", "#48269a", "#070b1c"],
    tablet: ["#0b74e0", "#12b6c6", "#081230"],
    watch: ["#0b0b10", "#1d3560", "#04050a"],
    audio: ["#1d1d22", "#0b0b0e", "#000000"],
  };
  const ramp = ramps[kind];
  const g = ctx.createLinearGradient(inset, inset, c.width, c.height);
  g.addColorStop(0, ramp[0]);
  g.addColorStop(0.55, ramp[1]);
  g.addColorStop(1, ramp[2]);
  ctx.fillStyle = g;
  ctx.fillRect(inset, inset, w, h);

  // soft light bloom
  const bloom = ctx.createRadialGradient(
    inset + w * 0.25,
    inset + h * 0.2,
    0,
    inset + w * 0.25,
    inset + h * 0.2,
    w * 0.8,
  );
  bloom.addColorStop(0, "rgba(255,255,255,0.35)");
  bloom.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(inset, inset, w, h);

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.95)";

  if (kind === "phone" || kind === "tablet") {
    ctx.font = "600 118px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText("9:41", c.width / 2, inset + h * 0.24);
    ctx.font = "500 38px 'DM Sans', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fillText("Monday 14 July", c.width / 2, inset + h * 0.29);
    // home-screen icon grid
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    const cols = 4;
    const iconW = w / 6.4;
    const gap = (w - cols * iconW) / (cols + 1);
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = inset + gap + col * (iconW + gap);
        const y = inset + h * 0.42 + row * (iconW + gap * 0.7);
        ctx.beginPath();
        ctx.roundRect(x, y, iconW, iconW, iconW * 0.28);
        ctx.fill();
      }
    }
    // dock
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.roundRect(inset + gap * 0.7, inset + h - iconW * 1.9, w - gap * 1.4, iconW * 1.45, iconW * 0.32);
    ctx.fill();
  }

  if (kind === "laptop") {
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fillRect(inset, inset, w, 34);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "600 74px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText("AppleBase", c.width / 2, c.height / 2);
    ctx.font = "400 32px 'DM Sans', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("Innovation reimagined", c.width / 2, c.height / 2 + 54);
    // dock
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.roundRect(c.width / 2 - 200, c.height - inset - 66, 400, 44, 18);
    ctx.fill();
  }

  if (kind === "watch") {
    ctx.font = "600 232px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText("9:41", c.width / 2, c.height * 0.46);
    ctx.font = "500 64px 'DM Sans', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText("112 BPM", c.width / 2, c.height * 0.6);
    ctx.strokeStyle = "#ff5f18";
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(c.width / 2, c.height * 0.78, 92, -Math.PI / 2, Math.PI * 0.9);
    ctx.stroke();
  }

  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.encoding = THREE.sRGBEncoding;
  tex.anisotropy = 4;
  bin.push(tex);
  return tex;
}

/** Standalone display texture (used to light up real .glb laptop screens). */
export function createScreenTexture(kind: Kind): THREE.Texture {
  return screenTexture(kind, []);
}

/* ------------------------------------------------------------------ */

function palette(envMap: THREE.Texture, dark: boolean, bin: Bin) {
  const mk = <T extends THREE.Material>(m: T) => {
    bin.push(m);
    return m;
  };
  return {
    titanium: mk(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(dark ? "#8a919d" : "#a9b0bb"),
        metalness: 1,
        roughness: 0.34,
        envMap,
        envMapIntensity: dark ? 1.15 : 1,
      }),
    ),
    rail: mk(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(dark ? "#6e7581" : "#8c939f"),
        metalness: 1,
        roughness: 0.18,
        envMap,
        envMapIntensity: 1.3,
      }),
    ),
    graphite: mk(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#15151a"),
        metalness: 0.6,
        roughness: 0.46,
        envMap,
        envMapIntensity: 0.7,
      }),
    ),
    glass: mk(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#04040a"),
        metalness: 0.25,
        roughness: 0.06,
        envMap,
        envMapIntensity: 1.5,
      }),
    ),
    accent: mk(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(dark ? "#2997ff" : "#0071e3"),
        metalness: 0.35,
        roughness: 0.35,
      }),
    ),
  };
}

type Pal = ReturnType<typeof palette>;

const screenMat = (kind: Kind, bin: Bin) => {
  const m = new THREE.MeshBasicMaterial({ map: screenTexture(kind, bin), toneMapped: false });
  bin.push(m);
  return m;
};

const geo = <T extends THREE.BufferGeometry>(g: T, bin: Bin) => {
  bin.push(g);
  return g;
};

/* ------------------------------ phone ----------------------------- */

function phone(p: Pal, bin: Bin): THREE.Group {
  const g = new THREE.Group();

  const body = new THREE.Mesh(geo(new RoundedBoxGeometry(0.76, 1.56, 0.092, 6, 0.13), bin), p.titanium);
  g.add(body);

  // polished titanium rail slightly proud of the glass
  const rail = new THREE.Mesh(geo(new RoundedBoxGeometry(0.775, 1.575, 0.07, 6, 0.135), bin), p.rail);
  g.add(rail);

  const front = new THREE.Mesh(geo(new RoundedBoxGeometry(0.735, 1.535, 0.03, 5, 0.12), bin), p.glass);
  front.position.z = 0.04;
  g.add(front);

  const screen = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.708, 1.508), bin), screenMat("phone", bin));
  screen.position.z = 0.058;
  g.add(screen);

  // dynamic island
  const island = new THREE.Mesh(geo(new RoundedBoxGeometry(0.2, 0.055, 0.012, 4, 0.026), bin), p.glass);
  island.position.set(0, 0.63, 0.062);
  g.add(island);

  // camera plateau
  const plateau = new THREE.Mesh(geo(new RoundedBoxGeometry(0.34, 0.34, 0.035, 4, 0.085), bin), p.titanium);
  plateau.position.set(-0.17, 0.52, -0.062);
  g.add(plateau);

  const rimGeo = geo(new THREE.TorusGeometry(0.062, 0.014, 10, 26), bin);
  const lensGeo = geo(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 22), bin);
  (
    [
      [-0.25, 0.6],
      [-0.09, 0.6],
      [-0.17, 0.44],
    ] as Array<[number, number]>
  ).forEach(([x, y]) => {
    const rim = new THREE.Mesh(rimGeo, p.rail);
    rim.position.set(x, y, -0.086);
    g.add(rim);
    const lens = new THREE.Mesh(lensGeo, p.glass);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, y, -0.084);
    g.add(lens);
  });

  const flash = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 16), bin), p.rail);
  flash.rotation.x = Math.PI / 2;
  flash.position.set(-0.03, 0.44, -0.08);
  g.add(flash);

  // side buttons
  const btnGeo = geo(new RoundedBoxGeometry(0.02, 0.17, 0.035, 3, 0.008), bin);
  [
    [0.383, 0.28],
    [-0.383, 0.3],
    [-0.383, 0.08],
  ].forEach(([x, y]) => {
    const b = new THREE.Mesh(btnGeo, p.rail);
    b.position.set(x, y, 0);
    g.add(b);
  });

  return g;
}

/* ----------------------------- laptop ----------------------------- */

function laptop(p: Pal, bin: Bin): { group: THREE.Group; lid: THREE.Group } {
  const group = new THREE.Group();

  const base = new THREE.Mesh(geo(new RoundedBoxGeometry(2.02, 1.4, 0.082, 5, 0.05), bin), p.titanium);
  base.rotation.x = -Math.PI / 2;
  group.add(base);

  // keyboard well + individual keys (instanced for cheapness)
  const well = new THREE.Mesh(geo(new THREE.PlaneGeometry(1.7, 0.72), bin), p.graphite);
  well.rotation.x = -Math.PI / 2;
  well.position.set(0, 0.044, -0.2);
  group.add(well);

  const keyGeo = geo(new THREE.BoxGeometry(0.098, 0.016, 0.072), bin);
  const rows = 5;
  const cols = 15;
  const keys = new THREE.InstancedMesh(keyGeo, p.graphite, rows * cols);
  const mtx = new THREE.Matrix4();
  let idx = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let cIdx = 0; cIdx < cols; cIdx += 1) {
      mtx.setPosition(
        -0.79 + cIdx * 0.113,
        0.052,
        -0.48 + r * 0.128,
      );
      keys.setMatrixAt(idx, mtx);
      idx += 1;
    }
  }
  keys.instanceMatrix.needsUpdate = true;
  group.add(keys);

  const pad = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.76, 0.46), bin), p.glass);
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, 0.045, 0.43);
  group.add(pad);

  const hinge = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.03, 0.03, 1.9, 16), bin), p.graphite);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, 0.03, -0.69);
  group.add(hinge);

  const footGeo = geo(new THREE.CylinderGeometry(0.035, 0.035, 0.016, 12), bin);
  [
    [-0.85, -0.55],
    [0.85, -0.55],
    [-0.85, 0.55],
    [0.85, 0.55],
  ].forEach(([x, z]) => {
    const foot = new THREE.Mesh(footGeo, p.graphite);
    foot.position.set(x, -0.048, z);
    group.add(foot);
  });

  const lid = new THREE.Group();
  lid.position.set(0, 0.025, -0.69);

  const panel = new THREE.Mesh(geo(new RoundedBoxGeometry(2.02, 1.36, 0.048, 5, 0.045), bin), p.titanium);
  panel.position.y = 0.68;
  lid.add(panel);

  const bezel = new THREE.Mesh(geo(new RoundedBoxGeometry(1.96, 1.3, 0.02, 4, 0.03), bin), p.glass);
  bezel.position.set(0, 0.68, 0.026);
  lid.add(bezel);

  const screen = new THREE.Mesh(geo(new THREE.PlaneGeometry(1.9, 1.24), bin), screenMat("laptop", bin));
  screen.position.set(0, 0.68, 0.038);
  lid.add(screen);

  const notch = new THREE.Mesh(geo(new RoundedBoxGeometry(0.22, 0.045, 0.012, 3, 0.02), bin), p.glass);
  notch.position.set(0, 1.3, 0.042);
  lid.add(notch);

  lid.rotation.x = -Math.PI / 2 + 0.05; // closed
  group.add(lid);

  return { group, lid };
}

/* ----------------------------- tablet ----------------------------- */

function tablet(p: Pal, bin: Bin): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(geo(new RoundedBoxGeometry(1.3, 1.8, 0.07, 5, 0.07), bin), p.titanium);
  g.add(body);
  const front = new THREE.Mesh(geo(new RoundedBoxGeometry(1.27, 1.77, 0.024, 4, 0.062), bin), p.glass);
  front.position.z = 0.032;
  g.add(front);
  const screen = new THREE.Mesh(geo(new THREE.PlaneGeometry(1.2, 1.7), bin), screenMat("tablet", bin));
  screen.position.z = 0.046;
  g.add(screen);

  const cam = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 18), bin), p.glass);
  cam.rotation.x = Math.PI / 2;
  cam.position.set(-0.48, 0.76, -0.042);
  g.add(cam);

  const pencil = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.032, 0.032, 1.2, 14), bin), p.rail);
  pencil.position.set(0.72, 0.06, 0.02);
  pencil.rotation.z = -0.05;
  g.add(pencil);
  return g;
}

/* ------------------------------ watch ----------------------------- */

function watch(p: Pal, bin: Bin): THREE.Group {
  const g = new THREE.Group();

  const body = new THREE.Mesh(geo(new RoundedBoxGeometry(0.68, 0.8, 0.27, 6, 0.15), bin), p.titanium);
  g.add(body);

  const glass = new THREE.Mesh(geo(new RoundedBoxGeometry(0.6, 0.72, 0.05, 5, 0.13), bin), p.glass);
  glass.position.z = 0.125;
  g.add(glass);

  const screen = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.5, 0.62), bin), screenMat("watch", bin));
  screen.position.z = 0.152;
  g.add(screen);

  // digital crown with ridges
  const crown = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.062, 0.062, 0.075, 20), bin), p.rail);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(0.372, 0.15, 0.02);
  g.add(crown);
  const ridge = new THREE.Mesh(geo(new THREE.TorusGeometry(0.062, 0.006, 8, 22), bin), p.graphite);
  ridge.rotation.y = Math.PI / 2;
  ridge.position.copy(crown.position);
  g.add(ridge);

  const side = new THREE.Mesh(geo(new RoundedBoxGeometry(0.022, 0.17, 0.05, 3, 0.01), bin), p.rail);
  side.position.set(0.352, -0.1, 0.02);
  g.add(side);

  // wrist loop: a full torus whose axis runs along the arm
  const band = new THREE.Mesh(geo(new THREE.TorusGeometry(0.46, 0.052, 12, 44), bin), p.graphite);
  band.rotation.y = Math.PI / 2;
  band.position.y = -0.5;
  band.scale.z = 0.88;
  g.add(band);

  // lugs joining case to band
  const lugGeo = geo(new RoundedBoxGeometry(0.34, 0.1, 0.16, 3, 0.04), bin);
  [0.42, -0.42].forEach((y) => {
    const lug = new THREE.Mesh(lugGeo, p.graphite);
    lug.position.set(0, y, 0);
    g.add(lug);
  });

  return g;
}

/* ------------------------------ audio ----------------------------- */

function audio(p: Pal, bin: Bin): THREE.Group {
  const g = new THREE.Group();

  const shell = new THREE.Mesh(geo(new RoundedBoxGeometry(1.02, 0.64, 0.38, 6, 0.18), bin), p.titanium);
  g.add(shell);

  const seam = new THREE.Mesh(geo(new THREE.BoxGeometry(1.01, 0.014, 0.37), bin), p.graphite);
  seam.position.y = 0.09;
  g.add(seam);

  const led = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.022, 0.022, 0.014, 14), bin), p.accent);
  led.rotation.x = Math.PI / 2;
  led.position.set(0, -0.12, 0.192);
  g.add(led);

  const budGeo = geo(new THREE.SphereGeometry(0.15, 22, 18), bin);
  const stemGeo = geo(new THREE.CylinderGeometry(0.046, 0.038, 0.36, 16), bin);
  [-1, 1].forEach((dir) => {
    const bud = new THREE.Mesh(budGeo, p.titanium);
    bud.position.set(0.62 * dir, 0.36, 0.05);
    bud.scale.set(1, 0.86, 0.94);
    g.add(bud);

    const tip = new THREE.Mesh(geo(new THREE.SphereGeometry(0.075, 16, 12), bin), p.graphite);
    tip.position.set(0.62 * dir + 0.1 * dir, 0.42, 0.05);
    g.add(tip);

    const stem = new THREE.Mesh(stemGeo, p.titanium);
    stem.position.set(0.62 * dir, 0.1, 0.05);
    stem.rotation.z = -0.08 * dir;
    g.add(stem);
  });

  return g;
}

/* ------------------------------------------------------------------ */

export function createDevice(kind: Kind, envMap: THREE.Texture, dark: boolean): DeviceModel {
  const bin: Bin = [];
  const p = palette(envMap, dark, bin);

  let group: THREE.Group;
  let lid: THREE.Group | undefined;

  switch (kind) {
    case "laptop": {
      const built = laptop(p, bin);
      group = built.group;
      lid = built.lid;
      break;
    }
    case "tablet":
      group = tablet(p, bin);
      break;
    case "watch":
      group = watch(p, bin);
      break;
    case "audio":
      group = audio(p, bin);
      break;
    default:
      group = phone(p, bin);
  }

  return {
    group,
    lid,
    dispose: () => bin.forEach((d) => d.dispose()),
  };
}
