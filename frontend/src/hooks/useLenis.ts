import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Lenis momentum scrolling, wired into the GSAP ticker so ScrollTrigger stays in sync. */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      syncTouch: true,
      prevent: (node: HTMLElement) => node.hasAttribute("data-lenis-prevent"),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
}

export function scrollToSection(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -40 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function scrollToTop(immediate = true) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}
