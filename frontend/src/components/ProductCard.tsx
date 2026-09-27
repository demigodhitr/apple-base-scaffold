import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Condition, Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";

const CONDITION_STYLE: Record<Condition, { bg: string; fg: string }> = {
  New: { bg: "rgba(16,185,129,0.14)", fg: "#0f9d6f" },
  "Open-Box": { bg: "rgba(255,95,24,0.14)", fg: "#e2560f" },
  "Used — Excellent": { bg: "rgba(139,92,246,0.16)", fg: "#7c5cf0" },
};

export const ProductCard = ({ product, i }: { product: Product; i: number }) => {
  const { add } = useCart();
  const chip = CONDITION_STYLE[product.condition];
  const saving = product.was ? product.was - product.price : 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-[1.6rem] ab-panel"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span
            className="rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]"
            style={{ background: chip.bg, color: chip.fg, backdropFilter: "blur(8px)" }}
            data-testid={`condition-chip-${product.id}`}
          >
            {product.condition}
          </span>
          {saving > 0 && (
            <span
              className="rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]"
              style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
            >
              Save ${saving}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="ab-eyebrow">{product.line}</p>
          <h3 className="ab-display mt-2 text-xl font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--ab-text-dim)" }}>
            {product.spec}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="ab-display text-2xl font-semibold">
                ${product.price.toLocaleString()}
              </span>
              {product.was && (
                <span
                  className="text-sm line-through"
                  style={{ color: "var(--ab-text-dim)" }}
                >
                  ${product.was.toLocaleString()}
                </span>
              )}
            </div>
            <p
              className="mt-1 text-xs"
              style={{ color: product.stock < 6 ? "var(--ab-ember)" : "var(--ab-text-dim)" }}
              data-testid={`stock-counter-${product.id}`}
            >
              {product.stock < 6 ? `Only ${product.stock} left` : `${product.stock} in stock`}
            </p>
          </div>
          <button
            onClick={() => add(product)}
            data-testid={`add-to-cart-button-${product.id}`}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 hover:rotate-90"
            style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
