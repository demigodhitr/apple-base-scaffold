import { toast } from "sonner";
import { ArrowUpRight, Repeat } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SPECS } from "@/data/products";
import { useCart } from "@/hooks/useCart";

export const SpecsCTA = () => {
  const { setOpen, count } = useCart();

  return (
    <section id="specs" className="relative py-36" data-testid="section-specs">
      <div className="ab-shell">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <p className="ab-eyebrow">Chapter 04 — Availability</p>
            </Reveal>
            <Reveal i={1}>
              <h2 className="ab-display mt-6 text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold">
                Available{" "}
                <span className="ab-serif-italic font-normal">now</span>
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-6 max-w-md text-base" style={{ color: "var(--ab-text-dim)" }}>
                Ships in 24 hours with a two-year warranty, carbon-neutral
                delivery and trade-in credit applied at checkout.
              </p>
            </Reveal>
            <Reveal i={3}>
              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  className="ab-btn-primary"
                  onClick={() => setOpen(true)}
                  data-testid="specs-open-bag-button"
                >
                  Review bag ({count}) <ArrowUpRight size={16} />
                </button>
                <button
                  className="ab-btn-ghost"
                  data-testid="trade-in-button"
                  onClick={() =>
                    toast("Trade-in estimate", {
                      description:
                        "Your current device is worth up to $640 in instant credit.",
                    })
                  }
                >
                  <Repeat size={15} /> Estimate trade-in
                </button>
              </div>
            </Reveal>
          </div>

          <div className="rounded-[1.8rem] ab-panel p-3" data-testid="spec-table">
            {SPECS.map((s, i) => (
              <Reveal
                key={s.label}
                i={i}
                className="flex items-center justify-between gap-6 px-6 py-7"
              >
                <div className="flex items-center gap-6">
                  <span
                    className="ab-display text-xs"
                    style={{ color: "var(--ab-text-dim)" }}
                  >
                    0{i + 1}
                  </span>
                  <span className="ab-eyebrow">{s.label}</span>
                </div>
                <div className="text-right">
                  <p className="ab-display text-lg font-semibold sm:text-xl">
                    {s.value}
                  </p>
                  <p className="text-xs" style={{ color: "var(--ab-text-dim)" }}>
                    {s.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
