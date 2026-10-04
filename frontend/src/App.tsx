import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Footer } from "@/sections/Footer";
import Landing from "@/pages/Landing";
import ProductPage from "@/pages/ProductPage";
import { useLenis, scrollToTop } from "@/hooks/useLenis";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  const { theme } = useTheme();
  const location = useLocation();
  useLenis();

  useEffect(() => {
    scrollToTop(true);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen" data-testid="app-root">
      <ScrollProgress />
      <div className="relative z-20">
        <AnnouncementBar />
        <Navbar />
      </div>
      <main className="relative">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      <div className="relative z-10">
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
