import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import type { Condition, Product } from "@/data/catalog";
import { useCart } from "@/hooks/useCart";

const CONDITION_STYLE: Record<Condition, { bg: string; fg: string }> = {
  New: { bg: "rgba(16,185,129,0.14)", fg: "#0f9d6f" },
  "Open-Box": { bg: "rgba(255,95,24,0.16)", fg: "#e2560f" },
  "Used — Excellent": { bg: "rgba(139,92,246,0.18)", fg: "#7c5cf0" },
};

export const ProductCard = ({ product, i = 0 }: { product: Product; i?: number }) => {
  const { add } = useCart();
  const chip = CONDITION_STYLE[product.condition];
  const saving = product.was ? product.was - product.price : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.6, delay: Math.min(i % 4, 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] ab-panel transition-transform duration-300 hover:-translate-y-1.5"
        data-testid={`product-card-${product.id}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span
              className="rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em]"
              style={{ background: chip.bg, color: chip.fg }}
              data-testid={`condition-chip-${product.id}`}
            >
              {product.condition}
            </span>
            {saving > 0 && (
              <span
                className="rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em]"
                style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
              >
                −${saving}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <p className="ab-eyebrow">{product.categoryLabel}</p>
            <span
              className="flex items-center gap-1 text-[0.7rem] font-semibold"
              style={{ color: "var(--ab-text-dim)" }}
            >
              <Star size={11} fill="currentColor" /> {product.rating}
            </span>
          </div>

          <div>
            <h3 className="ab-display text-base font-semibold leading-tight sm:text-lg">
              {product.name}
            </h3>
            <p className="mt-1 text-xs" style={{ color: "var(--ab-text-dim)" }}>
              {product.spec}
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="ab-display text-xl font-semibold">
                  ${product.price.toLocaleString()}
                </span>
                {product.was && (
                  <span className="text-xs line-through" style={{ color: "var(--ab-text-dim)" }}>
                    ${product.was.toLocaleString()}
                  </span>
                )}
              </div>
              <p
                className="mt-0.5 text-[0.7rem]"
                style={{
                  color: product.stock < 6 ? "var(--ab-ember)" : "var(--ab-text-dim)",
                }}
                data-testid={`stock-counter-${product.id}`}
              >
                {product.stock < 6 ? `Only ${product.stock} left` : `${product.stock} in stock`}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                add(product);
              }}
              data-testid={`add-to-cart-button-${product.id}`}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 hover:rotate-90"
              style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
              aria-label={`Add ${product.name} to bag`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
