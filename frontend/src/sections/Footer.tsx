const COLUMNS = [
  { title: "Shop", items: ["Notebooks", "Desktops", "Audio", "Wearables"] },
  { title: "Condition", items: ["New", "Open-box", "Used — Excellent", "Grading guide"] },
  { title: "Support", items: ["Warranty", "Trade-in", "Delivery", "Contact"] },
];

export const Footer = () => (
  <footer className="relative pb-14 pt-24" data-testid="footer">
    <div className="ab-shell">
      <div className="ab-hairline" />
      <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,0.6fr)]">
        <div>
          <p className="ab-display text-2xl font-semibold">AppleBase</p>
          <p className="mt-3 max-w-xs text-sm" style={{ color: "var(--ab-text-dim)" }}>
            A demo storefront and 3D showcase. Built with Three.js, GSAP and
            Lenis.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="ab-eyebrow">{col.title}</p>
            <ul className="mt-5 space-y-3">
              {col.items.map((item) => (
                <li key={item}>
                  <a
                    href="#showcase"
                    className="text-sm transition-colors duration-300 hover:[color:var(--ab-text)]"
                    style={{ color: "var(--ab-text-dim)" }}
                    data-testid={`footer-link-${item.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-16 text-xs" style={{ color: "var(--ab-text-dim)" }}>
        © {new Date().getFullYear()} AppleBase. Not affiliated with Apple Inc.
      </p>
    </div>
  </footer>
);
