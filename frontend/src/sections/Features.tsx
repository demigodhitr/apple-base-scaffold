import { Cpu, Gem, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CARDS = [
  {
    icon: Gem,
    title: "Aerospace titanium frame",
    body: "A single billet, milled for 42 minutes, finished with a micro-blast that resists every fingerprint you throw at it.",
    span: "lg:col-span-3",
    stat: "Grade-5 alloy",
  },
  {
    icon: Cpu,
    title: "M-series architecture",
    body: "Unified memory at 800GB/s with a neural engine that renders on-device in real time.",
    span: "lg:col-span-3",
    stat: "24-core",
  },
  {
    icon: MonitorSmartphone,
    title: "Micro-LED retina panel",
    body: "1600 nits sustained, per-pixel dimming, 120Hz adaptive refresh.",
    span: "lg:col-span-4",
    stat: "1600 nits",
  },
  {
    icon: ShieldCheck,
    title: "30-day trial guarantee",
    body: "Every condition grade ships with the same promise. Change your mind, keep your money.",
    span: "lg:col-span-2",
    stat: "30 days",
  },
];

export const Features = () => (
  <section
    id="features"
    className="relative py-40"
    data-testid="section-features"
  >
    <div className="ab-shell">
      <div className="max-w-2xl">
        <Reveal>
          <p className="ab-eyebrow">Chapter 02 — Craft</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="ab-display mt-6 text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold">
            Precision{" "}
            <span className="ab-serif-italic font-normal">engineered</span>
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mt-6 text-base sm:text-lg" style={{ color: "var(--ab-text-dim)" }}>
            Nothing decorative. Every gram, every nit and every cycle of silicon
            exists to make the thing in your hands feel inevitable.
          </p>
        </Reveal>
      </div>

      <div className="mt-20 grid auto-rows-fr gap-4 lg:grid-cols-6">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <Reveal
              key={card.title}
              i={i}
              className={`group relative overflow-hidden min-h-[19rem] rounded-[1.6rem] ab-panel p-8 transition-transform duration-500 hover:-translate-y-1.5 ${card.span}`}
            >
              <div
                className="absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
                style={{ background: "var(--ab-blue)" }}
              />
              <div className="relative flex h-full flex-col">
                <div
                  className="grid h-11 w-11 place-items-center rounded-2xl"
                  style={{ border: "1px solid var(--ab-line-strong)" }}
                >
                  <Icon size={18} />
                </div>
                <h3 className="ab-display mt-8 text-xl font-semibold sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-3 max-w-md text-sm" style={{ color: "var(--ab-text-dim)" }}>
                  {card.body}
                </p>
                <p
                  className="ab-display mt-auto pt-8 text-3xl sm:text-4xl font-semibold"
                  style={{ color: "var(--ab-line-strong)" }}
                >
                  {card.stat}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
