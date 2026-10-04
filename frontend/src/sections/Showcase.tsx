import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
  CATEGORIES,
  FILTERS,
  PRODUCTS,
  SORTS,
  sortProducts,
  type CategoryId,
  type FilterId,
  type GroupId,
  type SortId,
} from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/ProductRail";
import { Reveal } from "@/components/Reveal";

const HOT = PRODUCTS.filter((p) => p.groups.includes("hot")).slice(0, 8);
const TOP = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);

export const Showcase = () => {
  const [filter, setFilter] = useState<FilterId>("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<SortId>("featured");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const inGroup = filter === "all" || p.groups.includes(filter as GroupId);
      const inCategory = category === "all" || p.category === category;
      const matches =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.spec.toLowerCase().includes(q);
      return inGroup && inCategory && matches;
    });
    return sortProducts(list, sort);
  }, [filter, category, sort, query]);

  return (
    <section id="showcase" className="relative py-28" data-testid="section-showcase">
      <div className="ab-shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Reveal>
              <p className="ab-eyebrow">Chapter 03 — Storefront</p>
            </Reveal>
            <Reveal i={1}>
              <h2 className="ab-display mt-5 text-[clamp(2.2rem,5vw,4.2rem)] font-semibold">
                The <span className="ab-serif-italic font-normal">showcase</span>
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-5 text-base" style={{ color: "var(--ab-text-dim)" }}>
                {PRODUCTS.length} products across five families. Tap any card for
                the full 3D overview.
              </p>
            </Reveal>
          </div>

          <Reveal i={3} className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label
              className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 lg:w-72"
              style={{ background: "var(--ab-surface)", border: "1px solid var(--ab-line)" }}
            >
              <Search size={16} style={{ color: "var(--ab-text-dim)" }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 24 products"
                data-testid="product-search-input"
                className="w-full bg-transparent text-sm outline-none placeholder:opacity-60"
                style={{ color: "var(--ab-text)" }}
              />
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              data-testid="sort-select"
              className="rounded-full px-5 py-3 text-sm outline-none"
              style={{
                background: "var(--ab-surface)",
                border: "1px solid var(--ab-line)",
                color: "var(--ab-text)",
              }}
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Reveal>
        </div>

        {/* rails */}
        <div className="mt-16 space-y-12">
          <div>
            <div className="mb-4 flex items-end justify-between">
              <h3 className="ab-display text-lg font-semibold sm:text-xl">
                Hot deals this week
              </h3>
              <p className="text-xs" style={{ color: "var(--ab-text-dim)" }}>
                Scroll →
              </p>
            </div>
            <ProductRail items={HOT} testId="rail-hot-deals" />
          </div>
          <div>
            <div className="mb-4 flex items-end justify-between">
              <h3 className="ab-display text-lg font-semibold sm:text-xl">
                Top rated by owners
              </h3>
              <p className="text-xs" style={{ color: "var(--ab-text-dim)" }}>
                Scroll →
              </p>
            </div>
            <ProductRail items={TOP} testId="rail-top-rated" />
          </div>
        </div>

        <div className="ab-hairline my-14" />

        {/* filters */}
        <div className="flex flex-wrap items-center gap-2" data-testid="category-row">
          <button
            onClick={() => setCategory("all")}
            data-testid="category-tab-all"
            className="ab-pill"
            style={{
              background: category === "all" ? "var(--ab-text)" : "transparent",
              color: category === "all" ? "var(--ab-bg)" : "var(--ab-text-dim)",
              border: "1px solid var(--ab-line-strong)",
            }}
          >
            All families
          </button>
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                data-testid={`category-tab-${c.id}`}
                className="ab-pill"
                style={{
                  background: active ? "var(--ab-text)" : "transparent",
                  color: active ? "var(--ab-bg)" : "var(--ab-text-dim)",
                  border: "1px solid var(--ab-line-strong)",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-2" data-testid="filter-row">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                data-testid={`filter-category-${f.id}`}
                className="ab-pill text-xs"
                style={{
                  background: active ? "var(--ab-ember)" : "var(--ab-surface)",
                  color: active ? "#fff" : "var(--ab-text-dim)",
                  border: "1px solid var(--ab-line)",
                }}
              >
                {f.label}
                <span className="text-[0.65rem] opacity-70">
                  {f.id === "all"
                    ? PRODUCTS.length
                    : PRODUCTS.filter((p) => p.groups.includes(f.id as GroupId)).length}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-testid="product-grid"
        >
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} i={i} />
          ))}
        </motion.div>

        {visible.length === 0 && (
          <p
            className="py-20 text-center text-sm"
            style={{ color: "var(--ab-text-dim)" }}
            data-testid="no-results-message"
          >
            No matches. Try a different search.
          </p>
        )}
      </div>
    </section>
  );
};
