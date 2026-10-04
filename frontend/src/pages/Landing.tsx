import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scene } from "@/three/Scene";
import { Hero } from "@/sections/Hero";
import { Features } from "@/sections/Features";
import { Showcase } from "@/sections/Showcase";
import { SpecsCTA } from "@/sections/SpecsCTA";

export default function Landing() {
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
      <div className="relative z-10">
        <Hero />
        <Features />
        <Showcase />
        <SpecsCTA />
      </div>
    </>
  );
}
