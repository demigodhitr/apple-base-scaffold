import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Scale, X } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";
import type { Product } from "@/data/catalog";

const ROWS = [
  { label: "Price", get: (p: Product) => `$${p.price.toLocaleString()}` },
  { label: "Condition", get: (p: Product) => p.condition },
  { label: "Rating", get: (p: Product) => `${p.rating} (${p.reviews.toLocaleString()})` },
  { label: "Stock", get: (p: Product) => `${p.stock} units` },
  { label: "Finish", get: (p: Product) => p.colorway },
  { label: "Summary", get: (p: Product) => p.spec },
];

/** Floating compare tray + side-by-side spec sheet. */
export const CompareTray = () => {
  const { items, open, setOpen, remove, clear } = useCompare();

  return (
    <>
      <AnimatePresence>
        {items.length > 0 && !open && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-5 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-3 ab-panel"
            data-testid="compare-tray"
          >
            <div className="flex items-center gap-2">
              {items.map((p) => (
                <span key={p.id} className="relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={`Remove ${p.name} from compare`}
                    data-testid={`compare-remove-${p.id}`}
                    className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full"
                    style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={() => setOpen(true)}
              disabled={items.length < 2}
              data-testid="compare-open-button"
              className="rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-40"
              style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
            >
              {items.length < 2 ? "Add one more" : `Compare ${items.length}`}
            </button>
            <button
              onClick={clear}
              data-testid="compare-clear-button"
              className="text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--ab-text-dim)" }}
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[70] grid place-items-center p-4" data-testid="compare-modal">
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(8,8,10,0.5)", backdropFilter: "blur(6px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative max-h-[86vh] w-full max-w-5xl overflow-auto rounded-[1.6rem] ab-panel p-7"
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="ab-eyebrow">Side by side</p>
                  <h3 className="ab-display mt-2 text-2xl font-semibold">
                    Comparing {items.length} products
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  data-testid="compare-close-button"
                  className="grid h-9 w-9 place-items-center rounded-full"
                  style={{ border: "1px solid var(--ab-line-strong)" }}
                >
                  <X size={15} />
                </button>
              </div>

              <div
                className="mt-7 grid gap-4"
                style={{ gridTemplateColumns: `8rem repeat(${items.length}, minmax(0,1fr))` }}
              >
                <div />
                {items.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => setOpen(false)}
                    className="group"
                    data-testid={`compare-card-${p.id}`}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="aspect-[4/3] w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <p className="ab-eyebrow mt-3">{p.categoryLabel}</p>
                    <p className="ab-display mt-1 text-sm font-semibold">{p.name}</p>
                  </Link>
                ))}

                {ROWS.map((row) => (
                  <div key={row.label} className="contents">
                    <div
                      className="flex items-center py-4 text-[0.68rem] uppercase tracking-[0.2em]"
                      style={{ color: "var(--ab-text-dim)", borderTop: "1px solid var(--ab-line)" }}
                    >
                      {row.label}
                    </div>
                    {items.map((p) => (
                      <div
                        key={p.id + row.label}
                        className="flex items-center py-4 text-sm font-medium"
                        style={{ borderTop: "1px solid var(--ab-line)" }}
                        data-testid={`compare-cell-${row.label.toLowerCase()}-${p.id}`}
                      >
                        {row.get(p)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3">
                <Scale size={15} style={{ color: "var(--ab-text-dim)" }} />
                <p className="text-xs" style={{ color: "var(--ab-text-dim)" }}>
                  Every grade ships with the same two-year warranty and 30-day return window.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
