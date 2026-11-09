/**
 * The one section tag used across the landing page ("Market-Ready Platforms", "Rollout blueprint", …):
 * small uppercase tracked text in orange, flanked by short rules. Keep every section kicker on this
 * component so they cannot drift apart again.
 *
 * - `lines="both"` (default): rule on each side, for centred headings.
 * - `lines="start"`: leading rule only, for left-aligned headings and cards.
 * - `tone="dark"`: lighter orange for dark surfaces (Synax AI section, footer call-to-action).
 */
export function SectionTag({
  children,
  tone = "light",
  lines = "both",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  lines?: "both" | "start";
  className?: string;
}) {
  const text = tone === "dark" ? "text-orange-300" : "text-orange-600";
  const rule = tone === "dark" ? "bg-orange-300" : "bg-orange-600";

  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${text} ${className}`}
    >
      <span className={`h-0.5 w-5 shrink-0 ${rule}`} aria-hidden="true" />
      {children}
      {lines === "both" ? <span className={`h-0.5 w-5 shrink-0 ${rule}`} aria-hidden="true" /> : null}
    </span>
  );
}
