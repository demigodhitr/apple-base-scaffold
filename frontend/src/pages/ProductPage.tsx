import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Repeat, Scale, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS, getProduct } from "@/data/catalog";
import { ProductViewer } from "@/three/ProductViewer";
import { ProductRail } from "@/components/ProductRail";
import { useCart } from "@/hooks/useCart";
import { useCompare } from "@/hooks/useCompare";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

type View = "3d" | number;

export default function ProductPage() {
  const { id = "" } = useParams();
  const product = getProduct(id);
  const { add, setOpen } = useCart();
  const compare = useCompare();
  const [view, setView] = useState<View>("3d");
  const [finish, setFinish] = useState(0);
  const { items: recentlyViewed } = useRecentlyViewed(product?.id);

  useEffect(() => {
    setView("3d");
    setFinish(0);
  }, [id]);

  const related = useMemo(
    () =>
      product
        ? PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
            .concat(PRODUCTS.filter((p) => p.category !== product.category).slice(0, 4))
            .slice(0, 8)
        : [],
    [product],
  );

  if (!product) {
    return (
      <div className="ab-shell py-40 text-center" data-testid="product-not-found">
        <h1 className="ab-display text-3xl font-semibold">Product not found</h1>
        <Link to="/" className="ab-btn-primary mt-8 inline-flex">
          Back to the store
        </Link>
      </div>
    );
  }

  const saving = product.was ? product.was - product.price : 0;
  const colorway = product.colorways[finish] ?? product.colorways[0];
  const comparing = compare.has(product.id);

  return (
    <div className="relative pb-24 pt-10" data-testid="product-page">
      <div className="ab-shell">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--ab-text-dim)" }}
          data-testid="back-to-store-link"
        >
          <ArrowLeft size={14} /> Store / {product.categoryLabel}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* visual */}
          <div>
            <motion.div
              className="h-[clamp(20rem,52vh,34rem)] w-full"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === "3d" ? (
                <ProductViewer
                  kind={product.kind}
                  image={product.image}
                  name={product.name}
                  tint={colorway.hex}
                />
              ) : (
                <img
                  src={product.gallery[view]}
                  alt={product.name}
                  className="h-full w-full rounded-[1.6rem] object-cover"
                  style={{ border: "1px solid var(--ab-line)" }}
                  data-testid="gallery-main-image"
                />
              )}
            </motion.div>

            <div className="mt-4 flex gap-3" data-testid="gallery-thumbs">
              <button
                onClick={() => setView("3d")}
                data-testid="gallery-thumb-3d"
                className="ab-display grid h-20 w-24 place-items-center rounded-2xl text-[0.65rem] uppercase tracking-[0.2em]"
                style={{
                  border: `1px solid ${view === "3d" ? "var(--ab-text)" : "var(--ab-line)"}`,
                  background: "var(--ab-surface)",
                  color: "var(--ab-text)",
                }}
              >
                3D view
              </button>
              {product.gallery.map((src, idx) => (
                <button
                  key={src}
                  onClick={() => setView(idx)}
                  data-testid={`gallery-thumb-${idx}`}
                  className="h-20 w-24 overflow-hidden rounded-2xl"
                  style={{
                    border: `1px solid ${view === idx ? "var(--ab-text)" : "var(--ab-line)"}`,
                  }}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div>
            <p className="ab-eyebrow">{product.categoryLabel}</p>
            <h1
              className="ab-display mt-4 text-[clamp(2rem,4.4vw,3.4rem)] font-semibold"
              data-testid="product-title"
            >
              {product.name}
            </h1>
            <p className="mt-3 text-base" style={{ color: "var(--ab-text-dim)" }}>
              {product.tagline}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 font-semibold">
                <Star size={14} fill="currentColor" /> {product.rating}
              </span>
              <span style={{ color: "var(--ab-text-dim)" }}>
                {product.reviews.toLocaleString()} reviews
              </span>
              <span
                className="rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]"
                style={{ background: "var(--ab-glass)", color: "var(--ab-text-dim)" }}
                data-testid="product-condition"
              >
                {product.condition}
              </span>
              <span style={{ color: "var(--ab-text-dim)" }} data-testid="selected-colorway">
                {colorway.name}
              </span>
            </div>

            <div className="mt-8 flex items-end gap-3">
              <span className="ab-display text-4xl font-semibold" data-testid="product-price">
                ${product.price.toLocaleString()}
              </span>
              {product.was && (
                <span className="pb-1 text-lg line-through" style={{ color: "var(--ab-text-dim)" }}>
                  ${product.was.toLocaleString()}
                </span>
              )}
              {saving > 0 && (
                <span
                  className="mb-1.5 rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: "var(--ab-ember)", color: "#fff" }}
                >
                  Save ${saving}
                </span>
              )}
            </div>
            <p
              className="mt-2 text-sm"
              style={{ color: product.stock < 6 ? "var(--ab-ember)" : "var(--ab-text-dim)" }}
              data-testid="product-stock"
            >
              {product.stock < 6
                ? `Only ${product.stock} left in this condition`
                : `${product.stock} in stock · ships in 24h`}
            </p>

            <div className="mt-8">
              <p className="ab-eyebrow">Finish — {colorway.name}</p>
              <div className="mt-3 flex items-center gap-3" data-testid="colorway-picker">
                {product.colorways.map((c, idx) => {
                  const active = idx === finish;
                  return (
                    <button
                      key={c.name}
                      onClick={() => {
                        setFinish(idx);
                        setView("3d");
                      }}
                      aria-label={c.name}
                      title={c.name}
                      data-testid={`colorway-${c.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 hover:scale-110"
                      style={{
                        background: c.hex,
                        boxShadow: active
                          ? "0 0 0 2px var(--ab-bg), 0 0 0 4px var(--ab-text)"
                          : "0 0 0 1px var(--ab-line-strong)",
                      }}
                    >
                      {active && (
                        <Check size={13} color={c.hex === "#f1f1f3" || c.hex === "#d8dade" ? "#111" : "#fff"} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="ab-btn-primary"
                data-testid="product-add-to-bag"
                onClick={() => add(product)}
              >
                <ShoppingBag size={16} /> Add to bag
              </button>
              <button
                className="ab-btn-ghost"
                data-testid="product-buy-now"
                onClick={() => {
                  add(product);
                  setOpen(true);
                }}
              >
                Buy now
              </button>
              <button
                className="ab-btn-ghost"
                data-testid="product-trade-in"
                onClick={() =>
                  toast("Trade-in estimate", {
                    description: `Trade your current device for up to $${Math.round(
                      product.price * 0.42,
                    )} credit.`,
                  })
                }
              >
                <Repeat size={15} /> Trade-in
              </button>
              <button
                className="ab-btn-ghost"
                data-testid="product-compare-toggle"
                onClick={() => compare.toggle(product)}
                style={comparing ? { background: "var(--ab-text)", color: "var(--ab-bg)" } : undefined}
              >
                {comparing ? <Check size={15} /> : <Scale size={15} />}
                {comparing ? "In compare" : "Compare"}
              </button>
            </div>

            <ul className="mt-9 space-y-3" data-testid="product-highlights">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm">
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full"
                    style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
                  >
                    <Check size={12} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div
              className="mt-9 overflow-hidden rounded-[1.4rem] ab-panel"
              data-testid="product-specs"
            >
              {product.specs.map((s, i) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between gap-6 px-6 py-4"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--ab-line)" }}
                >
                  <span className="ab-eyebrow">{s.label}</span>
                  <span className="text-right text-sm font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {recentlyViewed.length > 0 && (
          <div className="mt-24" data-testid="recently-viewed-section">
            <h2 className="ab-display text-xl font-semibold sm:text-2xl">
              Recently viewed
            </h2>
            <div className="mt-6">
              <ProductRail items={recentlyViewed} testId="recently-viewed-rail" size="sm" />
            </div>
          </div>
        )}

        <div className="mt-24">
          <h2 className="ab-display text-xl font-semibold sm:text-2xl">
            Pairs well with
          </h2>
          <div className="mt-6">
            <ProductRail items={related} testId="related-rail" />
          </div>
        </div>
      </div>
    </div>
  );
}
