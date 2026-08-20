const COLUMNS = [
  {
    title: "Machine",
    links: ["ARC/1", "Specification", "Gallery", "Configurator", "Charging"],
  },
  {
    title: "Ownership",
    links: ["Reserve", "Test rides", "Service", "Warranty", "Finance"],
  },
  {
    title: "Company",
    links: ["About", "Engineering", "Careers", "Press", "Contact"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline-soft bg-surface/30">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="var(--color-volt-400)"
                  strokeWidth="2"
                  strokeDasharray="42 15"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="2.5" fill="var(--color-volt-400)" />
              </svg>
              <span className="font-display text-xl font-bold uppercase tracking-[0.18em] text-content">
                Voltarc
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-content-faint">
              Voltarc Motorcycles B.V. · Keilehaven 14, 3029 BJ Rotterdam,
              Netherlands.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow text-content-subtle">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-content-muted transition-colors duration-[--duration-fast] hover:text-volt-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="rule-x mt-14" />

        <div className="mt-6 flex flex-col gap-4 text-xs text-content-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Voltarc Motorcycles B.V. All rights reserved.</p>
          <p className="font-mono">
            Figures are provisional and subject to homologation.
          </p>
        </div>
      </div>
    </footer>
  );
}
