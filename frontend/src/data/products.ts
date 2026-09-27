export type Condition = "New" | "Open-Box" | "Used — Excellent";

export type Product = {
  id: string;
  name: string;
  line: string;
  price: number;
  was?: number;
  condition: Condition;
  stock: number;
  image: string;
  spec: string;
  groups: Array<"hot" | "available" | "recommended">;
};

export const PRODUCTS: Product[] = [
  {
    id: "titan-pro-16",
    name: "Titan Pro 16",
    line: "Notebook",
    price: 2399,
    was: 2799,
    condition: "New",
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1668606143699-26b823c2a0bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "M-series Ultra · 48GB · 2TB",
    groups: ["hot", "available"],
  },
  {
    id: "titan-air-13",
    name: "Titan Air 13",
    line: "Notebook",
    price: 1099,
    was: 1299,
    condition: "Open-Box",
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1668608321309-8fa4f70deeed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "M-series Air · 16GB · 512GB",
    groups: ["hot", "recommended"],
  },
  {
    id: "studio-deck",
    name: "Studio Deck",
    line: "Desktop",
    price: 1799,
    condition: "New",
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1787572972403-0574502bf056?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "M-series Max · 64GB · 4TB",
    groups: ["available", "recommended"],
  },
  {
    id: "aura-buds",
    name: "Aura Buds Pro",
    line: "Audio",
    price: 219,
    was: 279,
    condition: "New",
    stock: 38,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "Adaptive ANC · Spatial audio",
    groups: ["hot", "available"],
  },
  {
    id: "aura-over",
    name: "Aura Studio Max",
    line: "Audio",
    price: 449,
    condition: "Used — Excellent",
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1641048930621-ab5d225ae5b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "Planar drivers · 40h battery",
    groups: ["recommended"],
  },
  {
    id: "aura-mini",
    name: "Aura Mini",
    line: "Audio",
    price: 129,
    was: 159,
    condition: "Open-Box",
    stock: 21,
    image:
      "https://images.unsplash.com/photo-1628202926206-c63a34b1618f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "Room-sensing · 360° field",
    groups: ["available"],
  },
  {
    id: "pulse-watch",
    name: "Pulse Watch Ultra",
    line: "Wearable",
    price: 749,
    was: 849,
    condition: "New",
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1786124967103-875dda046e85?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "Titanium · 100m · LTE",
    groups: ["hot", "recommended"],
  },
  {
    id: "pulse-watch-se",
    name: "Pulse Watch SE",
    line: "Wearable",
    price: 279,
    condition: "Open-Box",
    stock: 16,
    image:
      "https://images.unsplash.com/photo-1774389992420-44d11d49f16b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "Aluminium · 50m · GPS",
    groups: ["available"],
  },
  {
    id: "pulse-band",
    name: "Pulse Band Alpine",
    line: "Wearable",
    price: 89,
    was: 119,
    condition: "New",
    stock: 54,
    image:
      "https://images.unsplash.com/photo-1783792894893-8332ee93d1de?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4Nx&q=85&w=1200",
    spec: "Woven titanium loop",
    groups: ["hot", "available", "recommended"],
  },
];

export const FILTERS = [
  { id: "all", label: "Everything" },
  { id: "hot", label: "Hot deals" },
  { id: "available", label: "Available now" },
  { id: "recommended", label: "Recommended" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

export const SPECS = [
  { label: "Processor", value: "M-series Ultra", detail: "24-core CPU · 76-core GPU" },
  { label: "Display", value: "Micro-LED Retina", detail: "1600 nits · 120Hz adaptive" },
  { label: "Battery", value: "28 hours", detail: "Graphene cell · 45m fast charge" },
  { label: "Connectivity", value: "Thunderbolt 5", detail: "Wi-Fi 7 · UWB · 5G ready" },
];
