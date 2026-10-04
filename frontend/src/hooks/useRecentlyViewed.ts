import { useCallback, useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/data/catalog";

const KEY = "applebase-recently-viewed";
const MAX = 8;

const read = (): string[] => {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

/** Remembers the products a shopper has opened, newest first. */
export function useRecentlyViewed(currentId?: string) {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    if (!currentId) return;
    const next = [currentId, ...read().filter((id) => id !== currentId)].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setIds(next);
  }, [currentId]);

  const refresh = useCallback(() => setIds(read()), []);

  const items: Product[] = ids
    .filter((id) => id !== currentId)
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return { items, refresh };
}
