import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Product } from "@/data/catalog";
import { useCart } from "@/hooks/useCart";

/** Horizontally-scrolling product rail: arrows, wheel, touch and drag all work. */
export const ProductRail = ({
  items,
  testId,
  size = "md",
}: {
  items: Product[];
  testId: string;
  size?: "sm" | "md";
}) => {
  const { add } = useCart();
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const width = size === "sm" ? "w-[13rem]" : "w-[16rem]";

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || e.pointerType === "touch") return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const arrowStyle = {
    background: "var(--ab-surface)",
    border: "1px solid var(--ab-line-strong)",
    color: "var(--ab-text)",
  };

  return (
    <div className="relative" data-testid={`${testId}-wrapper`}>
      <button
        onClick={() => nudge(-1)}
        disabled={atStart}
        aria-label="Scroll left"
        data-testid={`${testId}-prev`}
        className="absolute -left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full shadow-lg transition-opacity duration-300 disabled:opacity-0 sm:grid"
        style={arrowStyle}
      >
        <ChevronLeft size={17} />
      </button>
      <button
        onClick={() => nudge(1)}
        disabled={atEnd}
        aria-label="Scroll right"
        data-testid={`${testId}-next`}
        className="absolute -right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full shadow-lg transition-opacity duration-300 disabled:opacity-0 sm:grid"
        style={arrowStyle}
      >
        <ChevronRight size={17} />
      </button>

      <div
        ref={trackRef}
        data-lenis-prevent
        data-lenis-prevent-wheel
        onScroll={sync}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="flex cursor-grab snap-x gap-4 overflow-x-auto overscroll-x-contain pb-2 active:cursor-grabbing"
        data-testid={testId}
      >
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            draggable={false}
            className={`group relative shrink-0 snap-start overflow-hidden rounded-[1.2rem] ab-panel transition-transform duration-300 hover:-translate-y-1 ${width}`}
            data-testid={`rail-card-${p.id}`}
          >
            <div className="relative aspect-[5/4] overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {p.was && (
                <span
                  className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.1em]"
                  style={{ background: "var(--ab-ember)", color: "#fff" }}
                >
                  Save ${p.was - p.price}
                </span>
              )}
            </div>
            <div className="flex items-end justify-between gap-2 p-4">
              <div className="min-w-0">
                <p className="ab-eyebrow truncate">{p.categoryLabel}</p>
                <p className="ab-display mt-1 truncate text-sm font-semibold">{p.name}</p>
                <p className="ab-display mt-1 text-base font-semibold">
                  ${p.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  add(p);
                }}
                data-testid={`rail-add-${p.id}`}
                aria-label={`Add ${p.name} to bag`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 hover:rotate-90"
                style={{ background: "var(--ab-text)", color: "var(--ab-bg)" }}
              >
                <Plus size={15} />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
