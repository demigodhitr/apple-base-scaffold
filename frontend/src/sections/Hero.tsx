import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MaskedLines } from "@/components/Reveal";
import { scrollToSection } from "@/hooks/useLenis";

const METRICS = [
  { k: "3.4x", v: "Faster neural engine" },
  { k: "28h", v: "Sustained battery" },
  { k: "0.4kg", v: "Titanium chassis" },
  { k: "32%", v: "Open-box savings" },
];

export const Hero = () => (
  <section
    id="hero"
    className="relative flex min-h-[112vh] items-center pt-24"
    data-testid="section-hero"
  >
    <div className="ab-shell grid w-full gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
      <div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span
            className="h-px w-10"
            style={{ background: "var(--ab-line-strong)" }}
          />
          <p className="ab-eyebrow">AppleBase — Titan Series</p>
        </motion.div>

        <h1 className="ab-display mt-8 text-[clamp(3rem,9vw,7.2rem)] font-bold">
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
          className="mt-8 max-w-xl text-base sm:text-lg"
          style={{ color: "var(--ab-text-dim)" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          A storefront built like a product launch. Machined titanium, micro-LED
          light and silicon that thinks ahead — now with certified open-box
          pricing on every line.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            className="ab-btn-primary"
            onClick={() => scrollToSection("#showcase")}
            data-testid="hero-shop-button"
          >
            Shop the collection <ArrowUpRight size={16} />
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
        className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.4rem]"
        style={{ background: "var(--ab-line)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        data-testid="hero-metrics"
      >
        {METRICS.map((m) => (
          <div
            key={m.k}
            className="p-6"
            style={{ background: "var(--ab-glass)", backdropFilter: "blur(16px)" }}
          >
            <p className="ab-display text-3xl font-semibold">{m.k}</p>
            <p className="mt-2 text-xs" style={{ color: "var(--ab-text-dim)" }}>
              {m.v}
            </p>
          </div>
        ))}
      </motion.div>
    </div>

    <motion.button
      onClick={() => scrollToSection("#features")}
      className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      style={{ color: "var(--ab-text-dim)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
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
