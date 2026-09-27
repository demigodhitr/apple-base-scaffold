import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      data-testid="theme-toggle-button"
      className="relative flex h-9 w-[4.25rem] items-center rounded-full px-1 transition-colors duration-500"
      style={{
        border: "1px solid var(--ab-line-strong)",
        background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
      }}
    >
      <motion.span
        className="grid h-7 w-7 place-items-center rounded-full"
        style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
        animate={{ x: dark ? 34 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        {dark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.span>
      <span className="sr-only">{dark ? "Dark" : "Light"} mode</span>
    </button>
  );
};
