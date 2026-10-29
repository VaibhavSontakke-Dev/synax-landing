import { ArrowIcon } from "./icons";

/* -------------------------------------------------------------------------- */
/* Layout primitives                                                          */
/* -------------------------------------------------------------------------- */

/** Page gutter. 20px at 320px, widening with the viewport, capped at 1200px. */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  id,
  className = "",
  tone = "light",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  tone?: "light" | "tint" | "dark";
}) {
  const tones = {
    light: "bg-erp-surface",
    tint: "bg-erp-surface-2",
    dark: "bg-erp-navy text-white erp-on-dark",
  };

  return (
    <section
      id={id}
      className={`relative scroll-mt-20 py-16 sm:py-20 lg:py-28 ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

export function Eyebrow({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    /* Sora 700 at 0.09em, as the live site sets its section kickers. */
    <p
      className={`text-[0.6875rem] font-bold tracking-[0.09em] uppercase ${
        tone === "dark" ? "text-erp-sky" : "text-erp-brand-dark"
      } ${className}`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2
        className={`mt-3 text-[length:var(--erp-h2)] leading-[1.15] font-medium tracking-normal text-balance ${
          dark ? "text-white" : "text-erp-ink"
        }`}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={`mt-4 text-[length:var(--erp-lead)] leading-relaxed text-pretty ${
            dark ? "text-slate-300" : "text-erp-body"
          }`}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost-dark";
  size?: "md" | "lg";
  className?: string;
  withArrow?: boolean;
  /** Only passed from client components — e.g. to close the drawer on tap. */
  onNavigate?: () => void;
};

/**
 * All CTAs are anchors pointing at in-page sections, so they scroll correctly
 * before any JavaScript loads and remain usable if it never does.
 */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  withArrow = false,
  onNavigate,
}: ButtonProps) {
  const external = href.startsWith("http");

  const variants = {
    primary:
      "bg-erp-brand text-white shadow-erp-brand hover:bg-erp-brand-dark hover:shadow-[0_14px_32px_rgba(11,108,255,0.38)]",
    secondary:
      "bg-white text-erp-ink border border-erp-line-strong hover:border-erp-brand hover:text-erp-brand",
    "ghost-dark":
      "bg-white/5 text-white border border-white/20 backdrop-blur-sm hover:bg-white/12 hover:border-white/40",
  };

  const sizes = {
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-[0.9375rem] sm:h-[3.25rem] sm:px-7 sm:text-base",
  };

  return (
    <a
      href={href}
      onClick={onNavigate}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-center gap-2 rounded-erp-md font-semibold whitespace-nowrap transition-all duration-300 ease-erp ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {withArrow ? (
        <ArrowIcon className="size-4 shrink-0 transition-transform duration-300 ease-erp group-hover:translate-x-1" />
      ) : null}
    </a>
  );
}

/** Quiet inline link with a nudging arrow, used at the foot of cards. */
export function TextLink({
  href,
  children,
  tone = "light",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group/link inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
        tone === "dark"
          ? "text-erp-sky hover:text-white"
          : "text-erp-brand hover:text-erp-brand-dark"
      } ${className}`}
    >
      {children}
      <ArrowIcon className="size-4 transition-transform duration-300 ease-erp group-hover/link:translate-x-1" />
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* Small parts                                                                */
/* -------------------------------------------------------------------------- */

export function Chip({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <li
      className={`rounded-erp-sm border px-2.5 py-1.5 text-[0.8125rem] leading-snug ${
        tone === "dark"
          ? "border-erp-line-dark bg-white/[0.04] text-slate-300"
          : "border-erp-line bg-erp-surface-2 text-erp-body"
      }`}
    >
      {children}
    </li>
  );
}
