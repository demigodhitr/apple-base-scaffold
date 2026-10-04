import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { PRODUCTS, type Product } from "@/data/catalog";

const MAX = 3;
const KEY = "applebase-compare";

const restore = (): Product[] => {
  try {
    const raw = window.localStorage.getItem(KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    return ids
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  } catch {
    return [];
  }
};

type CompareApi = {
  items: Product[];
  ids: string[];
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: (p: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const CompareContext = createContext<CompareApi | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(restore);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(items.map((p) => p.id)));
  }, [items]);

  const toggle = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= MAX) {
        toast("Compare tray is full", {
          description: `Remove one of the ${MAX} products to add another.`,
        });
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const value = useMemo<CompareApi>(
    () => ({
      items,
      ids: items.map((p) => p.id),
      open,
      setOpen,
      toggle,
      remove: (id: string) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => {
        setItems([]);
        setOpen(false);
      },
      has: (id: string) => items.some((p) => p.id === id),
    }),
    [items, open, toggle],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
