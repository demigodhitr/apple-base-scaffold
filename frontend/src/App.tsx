import { useEffect } from "react";
import { Toaster } from "sonner";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scene } from "@/three/Scene";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/sections/Hero";
import { Features } from "@/sections/Features";
import { Showcase } from "@/sections/Showcase";
import { SpecsCTA } from "@/sections/SpecsCTA";
import { Footer } from "@/sections/Footer";
import { useLenis } from "@/hooks/useLenis";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  const { theme } = useTheme();
  useLenis();

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative min-h-screen" data-testid="app-root">
      <Scene />
      <ScrollProgress />
      <div className="relative z-10">
        <AnnouncementBar />
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Showcase />
          <SpecsCTA />
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{ style: { borderRadius: "1rem" } }}
      />
    </div>
  );
}
