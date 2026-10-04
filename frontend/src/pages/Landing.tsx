import { useEffect } from "react";
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

  useEffect(() => {
    const target = state?.scrollTo;
    if (!target) return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToSection(target);
    }, 450);
    return () => window.clearTimeout(id);
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
      <Scene />
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
