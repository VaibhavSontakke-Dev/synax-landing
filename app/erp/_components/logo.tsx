/**
 * Synax wordmark, redrawn as inline SVG from the live brand asset
 * (assets/logo/synax_logo.png): "SYNAX" set tight and heavy, with the
 * upper-right arm of the X extended into a cyan arrowhead pointing up and to
 * the right. Inline so it stays crisp at any size and can recolor for the dark
 * header and footer without shipping two bitmaps.
 */
export function SynaxLogo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const wordFill = tone === "dark" ? "#13294b" : "#ffffff";

  return (
    <svg
      viewBox="0 0 196 48"
      role="img"
      aria-label="Synax by Senwell"
      className={className}
    >
      <defs>
        <linearGradient id="erp-logo-arrow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0b6cff" />
          <stop offset="55%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>

      <text
        x="0"
        y="30"
        fill={wordFill}
        fontFamily="var(--font-sans), ui-sans-serif, system-ui, sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="0.5"
      >
        SYNA
      </text>

      {/* Lower-left to upper-right stroke of the X, carrying the arrowhead. */}
      <path d="M86 31 L104 9 l5.2 4.3 -18 22 Z" fill="url(#erp-logo-arrow)" />
      <path d="M96.5 7.5 L110.5 6 l-1.2 13.6 -4.6 -4.4 -3.4 -3.3 Z" fill="url(#erp-logo-arrow)" />
      {/* Upper-left to lower-right stroke. */}
      <path d="M87.6 9 L92.6 5 l16.4 21.2 -4.2 5.6 Z" fill={wordFill} />

      <text
        x="118"
        y="21"
        fill={tone === "dark" ? "#64748b" : "rgba(226,240,255,0.72)"}
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="2.4"
      >
        BY
      </text>
      <text
        x="118"
        y="34"
        fill={tone === "dark" ? "#334155" : "rgba(226,240,255,0.9)"}
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="2.4"
      >
        SENWELL
      </text>
    </svg>
  );
}
