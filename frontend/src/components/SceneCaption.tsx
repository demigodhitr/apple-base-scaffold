import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

type Caption = {
  id: string;
  section: string;
  eyebrow: string;
  title: string;
  line: string;
  to?: string;
};

const CAPTIONS: Caption[] = [
  {
    id: "hero",
    section: "#hero",
    eyebrow: "Act I — iPhone Titan Pro Max",
    title: "Grade-5 titanium",
    line: "48MP fusion camera, 5× telephoto, 33 hours of video.",
    to: "/product/iphone-titan-pro-max",
  },
  {
    id: "features",
    section: "#features",
    eyebrow: "Act II — MacBook Titan Pro 16",
    title: "Opens into a studio",
    line: "M-Ultra silicon, 1600 nits sustained, 28-hour battery.",
    to: "/product/mac-titan-pro-16",
  },
  {
    id: "showcase",
    section: "#showcase",
    eyebrow: "Act III — The storefront",
    title: "24 products, graded by hand",
    line: "New, open-box and certified, each with the same promise.",
  },
  {
    id: "specs",
    section: "#specs",
    eyebrow: "Act IV — Pulse Watch Ultra",
    title: "Built for altitude",
    line: "Titanium 49mm, 3000 nits, 72 hours in low power.",
    to: "/product/watch-titan-ultra",
  },
];

/** Keynote-style caption that follows the 3D choreography, one line per act. */
export const SceneCaption = () => {
  const [active, setActive] = useState<Caption | null>(CAPTIONS[0]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;

    const pick = () => {
      frame = 0;
      const middle = window.innerHeight * 0.45;
      let next: Caption | null = null;
      CAPTIONS.forEach((c) => {
        const el = document.querySelector(c.section);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= middle && rect.bottom > middle) next = c;
      });
      if (next) setActive(next);

      const footer = document.querySelector("footer");
      setHidden(
        Boolean(footer && footer.getBoundingClientRect().top < window.innerHeight * 0.75),
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-8 right-8 z-30 hidden w-[19rem] lg:block"
      data-testid="scene-caption"
    >
      <AnimatePresence mode="wait">
        {active && !hidden && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto rounded-[1.3rem] px-6 py-5 ab-glass"
            data-testid={`scene-caption-${active.id}`}
          >
            <p className="ab-eyebrow">{active.eyebrow}</p>
            <p className="ab-display mt-3 text-lg font-semibold">{active.title}</p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--ab-text-dim)" }}>
              {active.line}
            </p>
            {active.to && (
              <Link
                to={active.to}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold"
                data-testid={`scene-caption-link-${active.id}`}
              >
                View product <ArrowUpRight size={13} />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
