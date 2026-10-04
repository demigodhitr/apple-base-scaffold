import { Cpu, Gem, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CARDS = [
  {
    icon: Gem,
    stat: "Grade-5",
    title: "Aerospace titanium frame",
    body: "One billet, milled for 42 minutes, micro-blasted so it shrugs off fingerprints.",
  },
  {
    icon: Cpu,
    stat: "24-core",
    title: "M-series architecture",
    body: "Unified memory at 800GB/s with an on-device neural engine that renders in real time.",
  },
  {
    icon: MonitorSmartphone,
    stat: "1600 nits",
    title: "Micro-LED retina panel",
    body: "Per-pixel dimming with 120Hz adaptive refresh, sustained — not peak.",
  },
  {
    icon: ShieldCheck,
    stat: "30 days",
    title: "Trial on every condition grade",
    body: "New, open-box or certified — same promise.",
  },
];

export const Features = () => (
  <section id="features" className="relative py-32" data-testid="section-features">
    <div className="ab-shell">
      <div className="lg:w-[62%]">
      <div className="max-w-2xl">
        <Reveal>
          <p className="ab-eyebrow">Chapter 02 — Craft</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="ab-display mt-5 text-[clamp(2.2rem,5vw,4.2rem)] font-semibold">
            Precision <span className="ab-serif-italic font-normal">engineered</span>
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mt-5 text-base sm:text-lg" style={{ color: "var(--ab-text-dim)" }}>
            Nothing decorative. Every gram, nit and cycle of silicon exists to make
            the thing in your hands feel inevitable.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid auto-rows-fr gap-4 sm:grid-cols-2">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <Reveal
              key={card.title}
              i={i}
              className={`group relative overflow-hidden rounded-[1.4rem] ab-panel p-6 transition-transform duration-500 hover:-translate-y-1.5`}
            >
              <div
                className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
                style={{ background: "var(--ab-blue)" }}
              />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ border: "1px solid var(--ab-line-strong)" }}
                  >
                    <Icon size={17} />
                  </div>
                  <span
                    className="ab-display rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: "var(--ab-bg-deep)", color: "var(--ab-text-dim)" }}
                  >
                    {card.stat}
                  </span>
                </div>
                <h3 className="ab-display mt-6 text-lg font-semibold sm:text-xl">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--ab-text-dim)" }}>
                  {card.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
      </div>
    </div>
  </section>
);
