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
      <Link href="/erp" className="hover:text-blue-900 hover:underline">
        Synax
      </Link>
      {items.map((c, i) => (
        <span key={c.label} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5" aria-hidden="true" />
          {c.href && i < items.length - 1 ? (
            <Link href={c.href} className="hover:text-blue-900 hover:underline">
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
}) {
  return (
    <section className="border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-white" aria-labelledby="page-heading">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Breadcrumb items={crumbs} />
        <div className={aside ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-14" : "max-w-3xl"}>
          <div>
            <SectionTag lines="start">{tag}</SectionTag>
            <h1
              id="page-heading"
              className={`mt-3 text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl ${calm ? "font-semibold text-slate-700" : "font-extrabold text-blue-900"}`}
            >
              {title}
            </h1>
            <p className={`mt-4 max-w-xl text-sm leading-relaxed sm:text-base ${calm ? "text-slate-500" : "text-slate-700"}`}>{lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TourButton title={tourTitle} />
            </div>
          </div>
          {aside}
        </div>
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
      className={`scroll-mt-32 ${tone === "white" ? "border-y border-slate-200 bg-white" : ""}`}
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

/** Questions and answers as native <details> (keyboard accessible, no client code). */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-slate-900 marker:content-none hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500 sm:text-base [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{item.a}</p>
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
    <section aria-labelledby="cta-heading" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div
        className={`flex flex-col items-start justify-between gap-6 rounded-3xl border p-7 shadow-xl md:flex-row md:items-center md:p-10 ${
          light
            ? "border-sky-200 bg-gradient-to-br from-sky-200 via-sky-100 to-sky-50"
            : "border-white/10 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 shadow-2xl"
        }`}
      >
        <div className="max-w-xl">
          <SectionTag tone={light ? "light" : "dark"} lines="start">
            Get started
          </SectionTag>
          <h2 id="cta-heading" className={`mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl ${light ? "text-blue-900" : "text-white"}`}>
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
