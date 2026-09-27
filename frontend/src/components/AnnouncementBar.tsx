const ITEMS = [
  "2-year AppleBase warranty on every order",
  "Open-box savings up to 32%",
  "Trade in. Level up. Instant credit.",
  "Free carbon-neutral delivery",
];

export const AnnouncementBar = () => (
  <div
    className="relative z-30 overflow-hidden border-b py-2.5"
    style={{ borderColor: "var(--ab-line)", background: "var(--ab-glass)" }}
    data-testid="announcement-bar"
  >
    <div className="flex w-max ab-marquee">
      {[0, 1].map((dup) => (
        <div className="flex shrink-0" key={dup}>
          {ITEMS.map((item) => (
            <span
              key={`${dup}-${item}`}
              className="flex items-center gap-4 px-8 text-[0.7rem] uppercase tracking-[0.28em] font-semibold"
              style={{ color: "var(--ab-text-dim)" }}
            >
              {item}
              <span
                className="h-1 w-1 rounded-full"
                style={{ background: "var(--ab-ember)" }}
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
