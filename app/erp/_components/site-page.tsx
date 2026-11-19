import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DemoButton, TourButton } from "./demo-buttons";
import { SectionTag } from "./section-tag";

/**
 * Building blocks for the long-form marketing pages (/solutions, /why-synax, /security).
 * Server components; the only client code is the two action buttons.
 */

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
      <Link href="/" className="hover:text-brand hover:underline">
        Synax
      </Link>
      {items.map((c, i) => (
        <span key={c.label} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5" aria-hidden="true" />
          {c.href && i < items.length - 1 ? (
            <Link href={c.href} className="hover:text-brand hover:underline">
              {c.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-semibold text-slate-800">
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({
  crumbs,
  tag,
  title,
  lead,
  tourTitle,
  aside,
  calm = false,
  fit = false,
  foot,
}: {
  crumbs: Crumb[];
  tag: string;
  title: string;
  lead: string;
  /** Title shown in the "Watch overview" tour modal. (Heroes carry only this button; "Schedule a Demo" lives in the header and the closing band.) */
  tourTitle: string;
  /** Optional right-hand card. */
  aside?: React.ReactNode;
  /** Softer type: a semibold dusky-gray headline instead of the bold navy one. */
  calm?: boolean;
  /** On desktop the hero is at least as tall as the first screen under the header (like the home hero); the content starts right under the breadcrumb, as on Security & Trust and Why Synax. */
  fit?: boolean;
  /** A strip of cards under the hero content, like the one under the Security & Trust and Why Synax heroes. With `fit` it sits at the bottom of the screen-high hero. */
  foot?: React.ReactNode;
}) {
  return (
    <section
      className={`border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-page ${fit ? "relative isolate overflow-hidden lg:flex lg:min-h-[calc(100svh-4.1rem)]" : ""}`}
      aria-labelledby="page-heading"
    >
      {fit ? (
        // Same backdrop as the Security & Trust and Why Synax heroes: dot grid fading out, a soft sky glow, and a navy base line with a sky accent.
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="synax-stars absolute inset-0" />
          <div className="absolute inset-0 [background-image:radial-gradient(var(--grid-dot)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]" />
          <div className="absolute -top-24 left-[30%] size-96 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-solid" />
          <div className="absolute bottom-0 left-0 h-1 w-32 bg-sky-400" />
        </div>
      ) : null}
      <div className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${fit ? "flex w-full flex-col lg:py-5" : "lg:py-10"}`}>
        <Breadcrumb items={crumbs} />
        <div className={aside ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-14" : "max-w-3xl"}>
          <div>
            <SectionTag lines="start">{tag}</SectionTag>
            <h1
              id="page-heading"
              className={`mt-3 text-3xl leading-tight tracking-tight sm:text-4xl ${fit ? "lg:text-[clamp(1.875rem,5vh,3rem)]" : "lg:text-5xl"} ${calm ? "font-semibold text-slate-700" : "font-extrabold text-brand"}`}
            >
              {title}
            </h1>
            <p className={`mt-4 max-w-xl text-sm leading-relaxed sm:text-base ${calm ? "text-slate-500" : "text-slate-700"}`}>{lead}</p>
            <div className={`mt-7 flex flex-col gap-3 sm:flex-row sm:items-center ${fit ? "lg:mt-[clamp(1rem,3vh,1.75rem)]" : ""}`}>
              <TourButton title={tourTitle} />
            </div>
          </div>
          {aside}
        </div>
        {foot ? <div className={fit ? "mt-10 lg:mt-auto lg:pt-[clamp(0.75rem,3vh,2rem)]" : "mt-10"}>{foot}</div> : null}
      </div>
    </section>
  );
}

/** A page section with the shared tag / heading / lead header. `tone="white"` adds a white band. */
export function Block({
  id,
  tag,
  title,
  lead,
  tone = "plain",
  align = "center",
  calm = false,
  compact = false,
  children,
}: {
  id?: string;
  tag: string;
  title: string;
  lead?: string;
  tone?: "plain" | "white";
  align?: "center" | "start";
  /** Softer type: semibold dusky-gray heading and a lighter lead. */
  calm?: boolean;
  /** Less vertical space above, below and between the heading and the content. */
  compact?: boolean;
  children: React.ReactNode;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-32 ${tone === "white" ? "border-y border-slate-200 bg-surface" : ""}`}
    >
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${compact ? "py-8 lg:py-10" : "py-10 lg:py-12"}`}>
        <div className={`max-w-2xl space-y-2 ${compact ? "mb-5" : "mb-7 space-y-3"} ${align === "center" ? "mx-auto text-center" : ""}`}>
          <SectionTag lines={align === "center" ? "both" : "start"}>{tag}</SectionTag>
          <h2
            id={headingId}
            className={`tracking-tight sm:text-4xl ${compact ? "text-2xl sm:text-3xl" : "text-2xl"} ${calm ? "font-semibold text-slate-700" : "font-extrabold text-slate-900"}`}
          >
            {title}
          </h2>
          {lead ? <p className={`text-sm leading-relaxed sm:text-base ${calm ? "text-slate-500" : "text-slate-600"}`}>{lead}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

/**
 * Questions and answers as native <details> (keyboard accessible, no client code). One card per question; the
 * type is Geist (the page-level sans), question 15px semibold, answer 14px regular, the same on every page that
 * has an FAQ (all of them use this component).
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3 font-[family-name:var(--font-geist-sans)]">
      {items.map((item) => (
        <details key={item.q} className="group overflow-hidden rounded-xl border border-slate-200 bg-surface shadow-xs">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] leading-snug font-semibold text-slate-900 marker:content-none hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500 [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="size-4 shrink-0 text-sky-500 transition-transform group-open:rotate-180 group-open:text-slate-400" aria-hidden="true" />
          </summary>
          <p className="px-5 pb-5 text-sm leading-[1.6] font-normal text-slate-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title,
  text,
  product,
  tourTitle,
  tone = "dark",
}: {
  title: string;
  text: string;
  product?: string;
  tourTitle: string;
  /** "light" is the sky-blue band (used on /why-synax); "dark" is the navy band used elsewhere. */
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <section aria-labelledby="cta-heading" className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
      <div
        className={`flex flex-col items-start justify-between gap-6 rounded-3xl border p-7 shadow-xl md:flex-row md:items-center md:px-10 md:py-8 ${
          light
            ? "border-sky-300 bg-gradient-to-br from-sky-200 via-sky-100 to-sky-100"
            : "keep-light-palette border-white/10 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 shadow-2xl"
        }`}
      >
        <div className="max-w-xl">
          <SectionTag tone={light ? "light" : "dark"} lines="start">
            Get started
          </SectionTag>
          <h2 id="cta-heading" className={`mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl ${light ? "text-brand" : "text-white"}`}>
            {title}
          </h2>
          <p className={`mt-2 text-sm leading-relaxed ${light ? "text-slate-700" : "text-slate-300"}`}>{text}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <DemoButton product={product} onDark={!light} />
          <TourButton title={tourTitle} onDark={!light} />
        </div>
      </div>
    </section>
  );
}
