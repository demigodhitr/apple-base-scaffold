import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCart } from "@/hooks/useCart";
import { scrollToSection } from "@/hooks/useLenis";

const LINKS = [
  { label: "Store", target: "#showcase" },
  { label: "Engineering", target: "#features" },
  { label: "Specs", target: "#specs" },
];

export const Navbar = () => {
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const go = (target: string) => {
    if (pathname !== "/") {
      navigate("/");
      window.setTimeout(() => scrollToSection(target), 380);
      return;
    }
    scrollToSection(target);
  };

  return (
    <motion.header
      className="sticky top-0 z-40 ab-glass"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      data-testid="navbar"
    >
      <div className="ab-shell flex h-16 items-center justify-between gap-6">
        <button
          onClick={() => (pathname === "/" ? scrollToSection("#hero") : navigate("/"))}
          className="flex items-center gap-2.5"
          data-testid="brand-logo-button"
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-[0.6rem] text-xs font-bold"
            style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
          >
            A
          </span>
          <span className="ab-display text-base font-semibold">AppleBase</span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.target)}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="group relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300"
              style={{ color: "var(--ab-text-dim)" }}
            >
              <span className="transition-colors duration-300 group-hover:[color:var(--ab-text)]">
                {l.label}
              </span>
              <span
                className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full transition-all duration-300 group-hover:w-5"
                style={{ background: "var(--ab-ember)" }}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            data-testid="cart-drawer-trigger"
            className="relative flex h-9 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
          >
            <ShoppingBag size={15} />
            Bag
            <span
              className="grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.65rem]"
              style={{ background: "var(--ab-ember)", color: "#fff" }}
              data-testid="cart-count-badge"
            >
              {count}
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};
