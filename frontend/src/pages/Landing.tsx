import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/hooks/useLenis";
import { Scene } from "@/three/Scene";
import { SceneCaption } from "@/components/SceneCaption";
import { Hero } from "@/sections/Hero";
import { Features } from "@/sections/Features";
import { Showcase } from "@/sections/Showcase";
import { SpecsCTA } from "@/sections/SpecsCTA";

export default function Landing() {
  const { state } = useLocation() as { state?: { scrollTo?: string } };
  // let the DOM paint first — building the WebGL scene is the expensive part
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setShowScene(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const target = state?.scrollTo;
    if (!target) return;
    // the page height keeps changing while images/3D settle, and a ScrollTrigger
    // refresh restores the saved scroll position — so re-aim after those land
    const timers = [300, 900, 1800, 2700].map((delay) =>
      window.setTimeout(() => scrollToSection(target), delay),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [state]);

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      window.clearTimeout(id);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      {showScene && <Scene />}
      <SceneCaption />
      <div className="relative z-10">
        <Hero />
        <Features />
        <Showcase />
        <SpecsCTA />
      </div>
    </>
  );
}
