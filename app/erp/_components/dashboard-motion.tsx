/**
 * The motion laid over the illustrated dashboard pictures (home hero, USP "AI" and machine rows): the airplane gliding
 * over the banner (only when `banner` is given; the machine row has none), a soft light sweeping across each frosted card in turn, and pulsing live dots on the KPI tiles and the
 * machine-status card. Boxes are fractions of the picture, from tools/hero-dashboard/regions*.json. Purely decorative;
 * the animations (`synax-hero-*` in globals.css) stop for prefers-reduced-motion. Place it inside the picture's
 * `relative` wrapper.
 */
export type HazeBox = [string, number, number, number, number];

export function DashboardMotion({ banner, haze }: { banner?: [number, number, number, number]; haze: HazeBox[] }) {
  return (
    <>
      {/* The airplane: glides over the banner */}
      {banner ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute overflow-hidden rounded-[0.6rem]"
          style={{
            left: `${banner[0] * 100}%`,
            top: `${banner[1] * 100}%`,
            width: `${(banner[2] - banner[0]) * 100}%`,
            height: `${(banner[3] - banner[1]) * 100}%`,
          }}
        >
          <svg viewBox="0 0 140 46" className="synax-hero-plane absolute top-[14%] left-[46%] w-[15%] drop-shadow-[0_4px_6px_rgba(15,23,42,0.35)]">
            <path className="trail" d="M2,25 L38,25" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="7 6" />
            <path className="trail" d="M10,31 L40,31" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="5 6" opacity="0.7" />
            <path d="M50,40 L74,28 L86,28 L72,44 Z" fill="#cbd5e1" />
            <path d="M40,24 Q40,18 52,17 L118,17 Q134,18 138,24 Q134,30 118,31 L52,31 Q40,30 40,24 Z" fill="#f8fafc" />
            <path d="M44,17 L36,2 L48,2 L60,17 Z" fill="#1e3a8a" />
            <path d="M40,8 L50,8 L54,13 L43,13 Z" fill="#fb923c" />
            <path d="M118,17 Q130,18 136,23 L120,23 Z" fill="#1e3a8a" />
            {[64, 72, 80, 88, 96, 104, 112].map((x) => (
              <rect key={x} x={x} y="20" width="4.5" height="3.6" rx="1.2" fill="#1e3a8a" />
            ))}
            <path d="M52,30 L120,30" stroke="#fb923c" strokeWidth="1.6" />
            <rect x="74" y="31" width="14" height="5" rx="2.5" fill="#94a3b8" />
          </svg>
        </div>
      ) : null}
      {/* The frosted cards come alive: light sweeps (staggered) and live dots */}
      {haze.map(([kind, x0, y0, x1, y1], n) => (
        <div
          key={n}
          aria-hidden="true"
          className="synax-hero-sweep pointer-events-none absolute overflow-hidden rounded-[0.55rem]"
          style={{
            left: `${x0 * 100}%`,
            top: `${y0 * 100}%`,
            width: `${(x1 - x0) * 100}%`,
            height: `${(y1 - y0) * 100}%`,
            animationDelay: `${(n * 0.85) % 9}s`,
          }}
        >
          {kind === "kpi" || kind === "machines" ? (
            <span
              className="synax-hero-live absolute size-[0.32rem] rounded-full bg-orange-400"
              style={{ right: kind === "kpi" ? "8%" : "6%", top: kind === "kpi" ? "18%" : "9%", animationDelay: `${(n * 0.4) % 2}s` }}
            />
          ) : null}
        </div>
      ))}
    </>
  );
}
