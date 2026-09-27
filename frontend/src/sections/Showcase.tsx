import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { FILTERS, PRODUCTS, type FilterId } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export const Showcase = () => {
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const inGroup =
        filter === "all" || p.groups.includes(filter as "hot" | "available" | "recommended");
      const matches =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.line.toLowerCase().includes(q) ||
        p.spec.toLowerCase().includes(q);
      return inGroup && matches;
    });
  }, [filter, query]);

  return (
    <section id="showcase" className="relative py-32" data-testid="section-showcase">
      <div className="ab-shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Reveal>
              <p className="ab-eyebrow">Chapter 03 — Storefront</p>
            </Reveal>
            <Reveal i={1}>
              <h2 className="ab-display mt-6 text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold">
                The{" "}
                <span className="ab-serif-italic font-normal">showcase</span>
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-6 text-base" style={{ color: "var(--ab-text-dim)" }}>
                Certified new, open-box and excellent-condition inventory —
                graded by hand, priced honestly.
              </p>
            </Reveal>
          </div>

          <Reveal i={3} className="w-full lg:w-80">
            <label
              className="flex items-center gap-3 rounded-full px-5 py-3.5"
              style={{ background: "var(--ab-glass)", border: "1px solid var(--ab-line)" }}
            >
              <Search size={16} style={{ color: "var(--ab-text-dim)" }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the catalogue"
                data-testid="product-search-input"
                className="w-full bg-transparent text-sm outline-none placeholder:opacity-60"
                style={{ color: "var(--ab-text)" }}
              />
            </label>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-wrap gap-2" data-testid="filter-row">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                data-testid={`filter-category-${f.id}`}
                className="ab-pill"
                style={{
                  background: active ? "var(--ab-text)" : "var(--ab-glass)",
                  color: active ? "var(--ab-bg)" : "var(--ab-text-dim)",
                  border: "1px solid var(--ab-line)",
                }}
              >
                {f.label}
                <span className="text-[0.65rem] opacity-70">
                  {f.id === "all"
                    ? PRODUCTS.length
                    : PRODUCTS.filter((p) =>
                        p.groups.includes(f.id as "hot" | "available" | "recommended"),
                      ).length}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="product-grid"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} i={i} />
            ))}
          </AnimatePresence>
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
