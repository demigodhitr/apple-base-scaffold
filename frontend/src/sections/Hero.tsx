import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MaskedLines } from "@/components/Reveal";
import { ProductRail } from "@/components/ProductRail";
import { PRODUCTS } from "@/data/catalog";
import { scrollToSection } from "@/hooks/useLenis";

const METRICS = [
  { k: "24", v: "Live SKUs" },
  { k: "32%", v: "Open-box savings" },
  { k: "24h", v: "Dispatch" },
  { k: "4.8★", v: "Avg. rating" },
];

const FEATURED = [
  "iphone-titan-pro-max",
  "mac-titan-pro-16",
  "watch-titan-ultra",
  "ipad-titan-pro-13",
  "audio-buds-pro",
  "iphone-titan-open",
  "mac-titan-air",
]
  .map((id) => PRODUCTS.find((p) => p.id === id)!)
  .filter(Boolean);

export const Hero = () => (
  <section
    id="hero"
    className="relative flex min-h-[104vh] flex-col justify-center pb-16 pt-20"
    data-testid="section-hero"
  >
    <div className="ab-shell w-full">
      <div className="max-w-2xl lg:max-w-[46rem]">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span className="h-px w-10" style={{ background: "var(--ab-line-strong)" }} />
          <p className="ab-eyebrow">AppleBase — Titan Series</p>
        </motion.div>

        <h1 className="ab-display mt-7 text-[clamp(2.8rem,8vw,6.4rem)] font-bold">
          <MaskedLines
            delay={0.2}
            lines={[
              <>Innovation</>,
              <>
                <span className="ab-serif-italic font-normal">re</span>imagined
              </>,
            ]}
          />
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-base sm:text-lg"
          style={{ color: "var(--ab-text-dim)" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          iPhone, Mac, iPad, Watch and Audio — new, open-box and certified
          pre-loved, graded by hand and priced honestly. Scroll to watch the
          line-up assemble itself.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            className="ab-btn-primary"
            onClick={() => scrollToSection("#showcase")}
            data-testid="hero-shop-button"
          >
            Shop all 24 products <ArrowUpRight size={16} />
          </button>
          <button
            className="ab-btn-ghost"
            onClick={() => scrollToSection("#features")}
            data-testid="hero-explore-button"
          >
            See the engineering
          </button>
        </motion.div>
      </div>

        <motion.div
          className="mt-12 grid max-w-xl grid-cols-2 gap-y-6 sm:grid-cols-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          data-testid="hero-metrics"
        >
          {METRICS.map((m) => (
            <div key={m.k} className="pr-6" style={{ borderLeft: "1px solid var(--ab-line-strong)", paddingLeft: "0.9rem" }}>
              <p className="ab-display text-2xl font-semibold">{m.k}</p>
              <p className="mt-1 text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--ab-text-dim)" }}>
                {m.v}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

    <motion.div
      className="ab-shell mt-14 w-full"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <p className="ab-eyebrow">Trending in the store</p>
        <button
          onClick={() => scrollToSection("#showcase")}
          className="text-xs font-semibold underline decoration-dotted underline-offset-4"
          style={{ color: "var(--ab-text-dim)" }}
          data-testid="hero-rail-see-all"
        >
          See everything
        </button>
      </div>
      <ProductRail items={FEATURED} testId="hero-product-rail" size="sm" />
    </motion.div>

    <motion.button
      onClick={() => scrollToSection("#features")}
      className="mx-auto mt-10 flex flex-col items-center gap-2"
      style={{ color: "var(--ab-text-dim)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.8 }}
      data-testid="scroll-indicator"
    >
      <span className="text-[0.62rem] uppercase tracking-[0.32em]">Scroll</span>
      <motion.span
        animate={{ y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ArrowDown size={15} />
      </motion.span>
    </motion.button>
  </section>
);
