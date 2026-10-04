# AppleBase — 3D Product Showcase + Storefront

## Original problem statement
Build a React **TypeScript + Vite** application (`/app/frontend`) delivering an Awwwards-level 3D
product showcase inspired by Apple's product landing pages, for a fictional brand **AppleBase**.

Hard requirements from the user:
- Three.js full-screen fixed/sticky `<canvas>` background with real device models
- GSAP **ScrollTrigger** linking scroll progress to 3D rotation / scale / movement
- **framer-motion** micro-interactions and reveals, **Lenis** momentum scrolling
- Light theme by default, dark mode switchable
- Vite + React TS (explicitly **not** CRA)
- Later asks: real 3D device models (not generic shapes), hero that showcases products,
  Amazon-level product density, product overview page per item, smooth (non-sluggish) scrolling

## Stack
React 19 + TypeScript, Vite 8 (`vite.config.mts`), Tailwind + shadcn primitives, Three.js r128,
GSAP ScrollTrigger, Lenis 1.3, framer-motion, sonner, react-router-dom. No backend is used
(FastAPI/Mongo are present but untouched — the catalogue is static data).

## Architecture
```
/app/frontend
├── index.html                 (Vite entry, Google fonts)
├── vite.config.mts            (react + emergent overlay/visual-edits plugins, port 3000)
├── eslint.config.mjs          (flat config: js + typescript-eslint + react-hooks)
├── public/models/*.glb        iphone, macbook, ipad, watch, buds (Draco + webp, ~1.3 MB total)
└── src
    ├── main.tsx               ThemeProvider > CartProvider > BrowserRouter > App
    ├── App.tsx                nav/announcement/footer shell + routes + route-change scroll reset
    ├── pages/Landing.tsx      Scene + Hero + Features + Showcase + SpecsCTA
    ├── pages/ProductPage.tsx  /product/:id — viewer, gallery, price, specs, related rail
    ├── three/
    │   ├── Scene.tsx          fixed canvas + readability scrim + WebGL fallback
    │   ├── useThreeScene.ts   hero stage, 3 acts (one ScrollTrigger per section)
    │   ├── ProductViewer.tsx  OrbitControls viewer (drag + auto-orbit), image fallback
    │   ├── devices.ts         procedural fallback devices + generated screen textures
    │   ├── loadModel.ts       GLB loader (Draco), normalize, instantiate, findLid, applyScreenTexture
    │   └── environment.ts     procedural studio env map + particles
    ├── sections/              Hero, Features, Showcase, SpecsCTA, Footer
    ├── components/            Navbar, AnnouncementBar, ProductCard, ProductRail, CartDrawer,
    │                         ThemeToggle, ScrollProgress, Reveal
    ├── hooks/                 useTheme, useCart, useLenis (+ scrollToSection/scrollToTop)
    └── data/catalog.ts        24 SKUs across iPhone / Mac / iPad / Watch / Audio
```

## Implemented (2026-07)
- **Vite + React TS migration** completed (CRA/craco removed, `vite.config.mts`, `tsconfig.json`,
  flat ESLint config, `@types/three@0.128`)
- **Hero choreography with real models**: iPhone 17 Pro Max presents and spins out → MacBook Pro
  rises and its **lid opens** (real hinge node animated) → Apple Watch Ultra orbits in. Each act is
  bound to its own section trigger; pointer parallax + idle float on top.
- **Real GLB models** self-hosted in `/public/models` (sourced publicly; iPad supplied by the user),
  optimised with `@gltf-transform/cli` (6 MB → ~200–450 KB each, Draco + webp). Procedural devices
  remain the automatic fallback, and generated screen textures light up real laptop/tablet displays.
- **Storefront**: 24 SKUs, hero "Trending" rail, Hot deals + Top rated rails, category tabs, deal
  filters, 5 sort modes, search, condition chips, stock urgency, cart drawer with toasts.
- **Product overview page** `/product/:id`: interactive 3D viewer (drag to rotate, auto-orbit),
  3D/photo gallery switch, price + savings, stock, add-to-bag / buy-now / trade-in, highlights,
  spec table, related rail.
- **Performance**: removed `backdrop-filter` from cards (kept for nav/drawer), dropped
  framer-motion layout reflows, capped DPR at 1.5, Lenis retuned to `lerp: 0.12`.
- **Rail scrolling fix** (user-reported): arrows, pointer-drag with click suppression, and
  `data-lenis-prevent` so Lenis no longer swallows horizontal wheel — verified by testing agent.
- Light/dark themes with full palette swap (scene env map, lighting and scrim rebuild per theme).

## Enhancements (second round, 2026-07)
- **Colourway picker** on the product page — swatches per family recolour the live 3D model
  (`applyTint` blends toward the finish and skips emissive/screen meshes so displays stay lit)
- **Compare tray + sheet** — up to 3 products, floating tray, side-by-side spec rows,
  per-column "Add to bag", limit toast, persisted in `localStorage: applebase-compare`
- **Recently viewed** — rail on the product page and in the storefront
  (`localStorage: applebase-recently-viewed`, newest first, current product excluded)
- **Scroll captions** — keynote-style chip that tracks the 3D acts (Act I–IV) via a rAF
  viewport-centre check, links to the matching product, and hides over the footer
- **Bag persistence** — cart survives reloads (`localStorage: applebase-bag`)
- Footer stage cleanup: a footer-triggered GSAP timeline slides the watch out of frame
- Cross-route nav fix: nav links from `/product/:id` pass the target through router state and
  re-aim after the layout settles (a `ScrollTrigger.refresh()` was resetting the scroll)
- `<Scene />` now mounts after the first paint so route changes paint sooner

## Testing
- `/app/test_reports/iteration_1.json` — first pass on the pre-router version: all flows passed
- `/app/test_reports/iteration_2.json` — full regression: 10/10 critical flows pass, rail-scroll bug
  confirmed fixed, all five GLBs return 200, no console errors. The single minor finding
  (nav link from a product page not scrolling after the route change) was fixed afterwards by
  passing the target through router state and scrolling once `Landing` mounts — verified manually.
- `/app/test_reports/iteration_3.json` — four enhancements: all pass; two minor findings
  (cross-route nav scroll, 3D watch/caption over the footer)
- `/app/test_reports/iteration_4.json` — both findings confirmed FIXED, full regression green
- No auth anywhere, so `/app/memory/test_credentials.md` is not applicable.

## Backlog
P1
- Replace models if higher-quality GLBs arrive (loader + fallback already in place)
- Re-export GLBs without the secondary UV set to silence `THREE.GLTFLoader` UV warnings
P2
- Wishlist / save-for-later
- Keyboard-accessible rail scrolling + focus rings audit
- Mobile tuning of the 3D acts (devices currently centre and shrink under 1024px)
