export type Condition = "New" | "Open-Box" | "Used — Excellent";
export type Kind = "phone" | "laptop" | "tablet" | "watch" | "audio";
export type CategoryId = "iphone" | "mac" | "ipad" | "watch" | "audio";
export type GroupId = "hot" | "available" | "recommended";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: CategoryId;
  categoryLabel: string;
  kind: Kind;
  price: number;
  was?: number;
  condition: Condition;
  stock: number;
  rating: number;
  reviews: number;
  colorway: string;
  spec: string;
  image: string;
  gallery: string[];
  groups: GroupId[];
  highlights: string[];
  specs: Array<{ label: string; value: string }>;
};

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=${w}`;

const IMG = {
  iphone: [
    U("1592832122594-c0c6bad718b1"),
    U("1609085174857-cfea32ae0140"),
    U("1592750475338-74b7b21085ab"),
    U("1650580809796-39361e4d77f6"),
  ],
  mac: [
    U("1531297484001-80022131f5a1"),
    U("1611186871348-b1ce696e52c9"),
    U("1525547719571-a2d4ac8945e2"),
    U("1651241680016-cc9e407e7dc3"),
    U("1668606143699-26b823c2a0bc"),
    U("1787572972403-0574502bf056"),
  ],
  ipad: [
    U("1623126908029-58cb08a2b272"),
    U("1662893170097-d6563d0093d3"),
    U("1561154464-82e9adf32764"),
    U("1627372129933-9abc19b91f21"),
  ],
  watch: [
    U("1637160151663-a410315e4e75"),
    U("1434493789847-2f02dc6ca35d"),
    U("1660844817855-3ecc7ef21f12"),
    U("1508685096489-7aacd43bd3b1"),
    U("1786124967103-875dda046e85"),
    U("1774389992420-44d11d49f16b"),
  ],
  audio: [
    U("1504274066651-8d31a536b11a"),
    U("1632835746204-22f652dac3af"),
    U("1578319439584-104c94d37305"),
    U("1618366712010-f4ae9c647dcb"),
    U("1641048930621-ab5d225ae5b0"),
    U("1628202926206-c63a34b1618f"),
  ],
} as const;

export const CATEGORIES: Array<{
  id: CategoryId;
  label: string;
  kind: Kind;
  blurb: string;
}> = [
  { id: "iphone", label: "iPhone", kind: "phone", blurb: "Titanium. Telephoto. Terrifyingly fast." },
  { id: "mac", label: "Mac", kind: "laptop", blurb: "Studio power, notebook silence." },
  { id: "ipad", label: "iPad", kind: "tablet", blurb: "The canvas that goes anywhere." },
  { id: "watch", label: "Watch", kind: "watch", blurb: "A day of sensing, on your wrist." },
  { id: "audio", label: "Audio", kind: "audio", blurb: "Sound that disappears into the room." },
];

const BASE_SPECS: Record<CategoryId, Array<{ label: string; value: string }>> = {
  iphone: [
    { label: "Chip", value: "A-series Bionic" },
    { label: "Display", value: "6.3\" Super Retina XDR, 120Hz" },
    { label: "Camera", value: "48MP fusion + 5× telephoto" },
    { label: "Battery", value: "Up to 33h video" },
    { label: "Build", value: "Grade-5 titanium, IP68" },
  ],
  mac: [
    { label: "Chip", value: "M-series, 24-core GPU" },
    { label: "Memory", value: "Unified, up to 128GB" },
    { label: "Display", value: "Liquid Retina XDR, 1600 nits" },
    { label: "Battery", value: "Up to 28h" },
    { label: "Ports", value: "3× Thunderbolt 5, HDMI, SDXC" },
  ],
  ipad: [
    { label: "Chip", value: "M-series, 10-core" },
    { label: "Display", value: "Tandem OLED, 120Hz" },
    { label: "Pencil", value: "Hover + squeeze support" },
    { label: "Battery", value: "Up to 14h" },
    { label: "Connectivity", value: "Wi-Fi 7, optional 5G" },
  ],
  watch: [
    { label: "Case", value: "Titanium, 49mm" },
    { label: "Display", value: "LTPO3 always-on, 3000 nits" },
    { label: "Sensors", value: "ECG, SpO₂, temperature" },
    { label: "Battery", value: "Up to 72h low power" },
    { label: "Water", value: "100m + EN13319 dive" },
  ],
  audio: [
    { label: "Driver", value: "Custom planar" },
    { label: "Noise control", value: "Adaptive ANC + transparency" },
    { label: "Audio", value: "Personalised spatial + head tracking" },
    { label: "Battery", value: "Up to 40h with case" },
    { label: "Chip", value: "H-series wireless" },
  ],
};

type Seed = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  was?: number;
  condition: Condition;
  stock: number;
  img: number;
  groups: GroupId[];
  colorway: string;
  spec: string;
  rating: number;
  reviews: number;
  highlights?: string[];
};

const SEEDS: Record<CategoryId, Seed[]> = {
  iphone: [
    { id: "iphone-titan-pro-max", name: "iPhone Titan Pro Max", tagline: "The biggest sensor we've ever shipped.", price: 1399, was: 1499, condition: "New", stock: 12, img: 2, groups: ["hot", "available"], colorway: "Natural Titanium", spec: "512GB · 5× telephoto", rating: 4.9, reviews: 2841 },
    { id: "iphone-titan-pro", name: "iPhone Titan Pro", tagline: "Pro in every dimension but one.", price: 1099, was: 1199, condition: "New", stock: 24, img: 0, groups: ["hot", "available", "recommended"], colorway: "Black Titanium", spec: "256GB · ProMotion", rating: 4.8, reviews: 1902 },
    { id: "iphone-titan", name: "iPhone Titan", tagline: "Everything essential, nothing extra.", price: 849, condition: "New", stock: 31, img: 3, groups: ["available"], colorway: "Desert Sand", spec: "128GB · Dual camera", rating: 4.7, reviews: 1140 },
    { id: "iphone-titan-open", name: "iPhone Titan Pro — Open Box", tagline: "Opened once. Graded twice.", price: 899, was: 1199, condition: "Open-Box", stock: 5, img: 1, groups: ["hot", "recommended"], colorway: "Crimson", spec: "256GB · 98% battery", rating: 4.6, reviews: 318 },
    { id: "iphone-titan-se", name: "iPhone Titan SE", tagline: "The quiet overachiever.", price: 549, was: 629, condition: "Used — Excellent", stock: 8, img: 2, groups: ["hot"], colorway: "Graphite", spec: "128GB · 94% battery", rating: 4.5, reviews: 642 },
  ],
  mac: [
    { id: "mac-titan-pro-16", name: "MacBook Titan Pro 16", tagline: "A render farm that fits in a sleeve.", price: 2399, was: 2799, condition: "New", stock: 7, img: 3, groups: ["hot", "available"], colorway: "Space Black", spec: "M-Ultra · 48GB · 2TB", rating: 4.9, reviews: 1523 },
    { id: "mac-titan-pro-14", name: "MacBook Titan Pro 14", tagline: "Silent, and then suddenly enormous.", price: 1899, condition: "New", stock: 14, img: 2, groups: ["available", "recommended"], colorway: "Space Black", spec: "M-Max · 32GB · 1TB", rating: 4.8, reviews: 988 },
    { id: "mac-titan-air", name: "MacBook Titan Air", tagline: "1.06kg of restraint.", price: 1099, was: 1299, condition: "Open-Box", stock: 12, img: 1, groups: ["hot", "recommended"], colorway: "Starlight", spec: "M-Air · 16GB · 512GB", rating: 4.8, reviews: 2210 },
    { id: "mac-studio-deck", name: "Mac Studio Deck", tagline: "Desktop-class, desk-sized.", price: 1799, condition: "New", stock: 4, img: 5, groups: ["available"], colorway: "Silver", spec: "M-Max · 64GB · 4TB", rating: 4.9, reviews: 476 },
    { id: "mac-titan-air-used", name: "MacBook Titan Air — Certified", tagline: "Second owner. First-class condition.", price: 799, was: 1099, condition: "Used — Excellent", stock: 3, img: 4, groups: ["hot"], colorway: "Midnight", spec: "M-Air · 16GB · 256GB", rating: 4.5, reviews: 214 },
  ],
  ipad: [
    { id: "ipad-titan-pro-13", name: "iPad Titan Pro 13", tagline: "Two OLED panels, stacked for light.", price: 1299, was: 1399, condition: "New", stock: 9, img: 3, groups: ["hot", "available"], colorway: "Space Black", spec: "1TB · Wi-Fi + 5G", rating: 4.8, reviews: 764 },
    { id: "ipad-titan-air", name: "iPad Titan Air", tagline: "The everyday canvas.", price: 749, condition: "New", stock: 22, img: 0, groups: ["available", "recommended"], colorway: "Blue", spec: "256GB · Wi-Fi", rating: 4.7, reviews: 1105 },
    { id: "ipad-titan-mini", name: "iPad Titan Mini", tagline: "Pocket studio energy.", price: 499, was: 579, condition: "Open-Box", stock: 15, img: 1, groups: ["hot"], colorway: "Starlight", spec: "128GB · Wi-Fi", rating: 4.6, reviews: 498 },
    { id: "ipad-titan-pro-used", name: "iPad Titan Pro 11 — Certified", tagline: "Graded, cleaned, guaranteed.", price: 649, was: 999, condition: "Used — Excellent", stock: 6, img: 2, groups: ["hot", "recommended"], colorway: "Silver", spec: "256GB · 96% battery", rating: 4.5, reviews: 187 },
  ],
  watch: [
    { id: "watch-titan-ultra", name: "Pulse Watch Ultra", tagline: "Built for altitude and depth.", price: 749, was: 849, condition: "New", stock: 9, img: 4, groups: ["hot", "recommended"], colorway: "Natural Titanium", spec: "49mm · LTE · 100m", rating: 4.9, reviews: 1342 },
    { id: "watch-titan-series", name: "Pulse Watch Series X", tagline: "Thinner case, brighter face.", price: 449, condition: "New", stock: 18, img: 0, groups: ["available"], colorway: "Jet Black", spec: "45mm · GPS + LTE", rating: 4.8, reviews: 2093 },
    { id: "watch-titan-se", name: "Pulse Watch SE", tagline: "The essentials, sensibly priced.", price: 279, condition: "Open-Box", stock: 16, img: 1, groups: ["available", "recommended"], colorway: "Silver", spec: "44mm · GPS", rating: 4.6, reviews: 1620 },
    { id: "watch-titan-ultra-used", name: "Pulse Watch Ultra — Certified", tagline: "Trail-tested, fully reconditioned.", price: 529, was: 749, condition: "Used — Excellent", stock: 4, img: 2, groups: ["hot"], colorway: "Slate", spec: "49mm · 95% battery", rating: 4.5, reviews: 265 },
    { id: "watch-band-alpine", name: "Pulse Band Alpine Loop", tagline: "Woven titanium thread.", price: 89, was: 119, condition: "New", stock: 54, img: 5, groups: ["hot", "available", "recommended"], colorway: "Indigo", spec: "One-piece loop · 49mm", rating: 4.7, reviews: 843 },
  ],
  audio: [
    { id: "audio-buds-pro", name: "Aura Buds Pro", tagline: "Noise, negotiated.", price: 219, was: 279, condition: "New", stock: 38, img: 0, groups: ["hot", "available"], colorway: "White", spec: "Adaptive ANC · Spatial", rating: 4.8, reviews: 3401 },
    { id: "audio-buds", name: "Aura Buds", tagline: "All day, no drama.", price: 139, condition: "New", stock: 44, img: 1, groups: ["available", "recommended"], colorway: "Charcoal", spec: "ANC · 30h case", rating: 4.6, reviews: 1789 },
    { id: "audio-studio-max", name: "Aura Studio Max", tagline: "Planar drivers, memory-foam silence.", price: 449, condition: "Used — Excellent", stock: 3, img: 4, groups: ["recommended"], colorway: "Teal", spec: "Over-ear · 40h", rating: 4.7, reviews: 512 },
    { id: "audio-studio", name: "Aura Studio", tagline: "The reference pair.", price: 329, was: 399, condition: "Open-Box", stock: 11, img: 3, groups: ["hot"], colorway: "Sand", spec: "Over-ear · ANC", rating: 4.6, reviews: 706 },
    { id: "audio-mini", name: "Aura Mini Speaker", tagline: "Room-sensing 360° field.", price: 129, was: 159, condition: "Open-Box", stock: 21, img: 5, groups: ["available"], colorway: "Midnight", spec: "360° · room sensing", rating: 4.5, reviews: 934 },
  ],
};

function build(): Product[] {
  const out: Product[] = [];
  CATEGORIES.forEach((cat) => {
    const pool = IMG[cat.id];
    SEEDS[cat.id].forEach((s) => {
      const gallery = [
        pool[s.img % pool.length],
        pool[(s.img + 1) % pool.length],
        pool[(s.img + 2) % pool.length],
      ];
      out.push({
        ...s,
        category: cat.id,
        categoryLabel: cat.label,
        kind: cat.kind,
        image: gallery[0],
        gallery,
        highlights:
          s.highlights ??
          [
            "Two-year AppleBase warranty",
            "30-day no-questions returns",
            "Carbon-neutral next-day delivery",
          ],
        specs: BASE_SPECS[cat.id],
      });
    });
  });
  return out;
}

export const PRODUCTS: Product[] = build();

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const FILTERS = [
  { id: "all", label: "Everything" },
  { id: "hot", label: "Hot deals" },
  { id: "available", label: "Available now" },
  { id: "recommended", label: "Recommended" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "savings", label: "Biggest savings" },
  { id: "rating", label: "Top rated" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export const sortProducts = (items: Product[], sort: SortId) => {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "savings":
      return copy.sort(
        (a, b) => (b.was ? b.was - b.price : 0) - (a.was ? a.was - a.price : 0),
      );
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy;
  }
};

export const SPECS = [
  { label: "Processor", value: "M-series Ultra", detail: "24-core CPU · 76-core GPU" },
  { label: "Display", value: "Micro-LED Retina", detail: "1600 nits · 120Hz adaptive" },
  { label: "Battery", value: "28 hours", detail: "Graphene cell · 45m fast charge" },
  { label: "Connectivity", value: "Thunderbolt 5", detail: "Wi-Fi 7 · UWB · 5G ready" },
];
