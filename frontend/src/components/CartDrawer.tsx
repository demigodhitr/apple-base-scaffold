import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

export const CartDrawer = () => {
  const { open, setOpen, lines, total, remove, count } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" data-testid="cart-drawer">
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(8,8,10,0.45)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-[26rem] flex-col ab-panel"
            style={{ borderRadius: 0 }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-7 pt-7">
              <div>
                <p className="ab-eyebrow">Your bag</p>
                <h3 className="ab-display mt-1 text-2xl font-semibold">
                  {count} item{count === 1 ? "" : "s"}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                data-testid="cart-close-button"
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ border: "1px solid var(--ab-line-strong)" }}
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-3 overflow-y-auto px-7">
              {lines.length === 0 && (
                <p
                  className="py-16 text-center text-sm"
                  data-testid="cart-empty-message"
                  style={{ color: "var(--ab-text-dim)" }}
                >
                  Nothing here yet. Add something exquisite.
                </p>
              )}
              {lines.map((line) => (
                <div
                  key={line.product.id}
                  className="flex items-center gap-4 rounded-2xl p-3"
                  style={{ background: "var(--ab-glass)", border: "1px solid var(--ab-line)" }}
                  data-testid={`cart-line-${line.product.id}`}
                >
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {line.product.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--ab-text-dim)" }}>
                      {line.product.condition} · ×{line.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${(line.product.price * line.qty).toLocaleString()}
                    </p>
                    <button
                      onClick={() => remove(line.product.id)}
                      data-testid={`cart-remove-${line.product.id}`}
                      className="text-[0.7rem] uppercase tracking-widest"
                      style={{ color: "var(--ab-ember)" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 px-7 py-7" style={{ borderTop: "1px solid var(--ab-line)" }}>
              <div className="flex items-baseline justify-between">
                <span className="ab-eyebrow">Total</span>
                <span
                  className="ab-display text-2xl font-semibold"
                  data-testid="cart-total"
                >
                  ${total.toLocaleString()}
                </span>
              </div>
              <button
                className="ab-btn-primary w-full"
                data-testid="checkout-express-button"
                disabled={lines.length === 0}
                style={{ opacity: lines.length === 0 ? 0.4 : 1 }}
                onClick={() =>
                  toast("Express checkout is a demo", {
                    description: "Hook up a payment provider to take it live.",
                  })
                }
              >
                1-click express checkout
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
