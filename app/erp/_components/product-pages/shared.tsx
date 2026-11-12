import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { hrefFor, routeFor, type ProductKey } from "../../_data/products";
import { LIVE_FAQ, LIVE_ROLLOUT, LIVE_ROLLOUT_NOTE } from "../../_data/live";
import type { SolutionPath } from "../../_data/solution-paths";
import { Block, Breadcrumb, CtaBand, Faq } from "../site-page";
import { SectionTag } from "../section-tag";
import { TourButton } from "../demo-buttons";
import { HeroBackdrop } from "../home-hero";

/**
 * Pieces shared by the six product pages. Each product page builds its own hero and body (they are meant to
 * look different); only the breadcrumb, hero copy, "start with" path and the closing sections live here.
 */

/** Hero band with the home page's backdrop (dot grid, soft glow, navy and orange base line) and the standard width and spacing. Put the page's own hero layout inside. */
export function HeroBand({ productKey, children }: { productKey: ProductKey; children: React.ReactNode }) {
  const route = routeFor(productKey);
  return (
    <section aria-labelledby="product-heading" className="relative isolate overflow-hidden">
      <HeroBackdrop />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Breadcrumb items={[{ label: "Products", href: "/products" }, { label: route.name }]} />
        {children}
      </div>
    </section>
  );
}

/** Eyebrow, H1, subtitle, lead and the "Watch overview" button. `center` for centred heroes. */
export function HeroCopy({
  productKey,
  eyebrow,
  title,
  subtitle,
  lead,
  center = false,
  compact = false,
}: {
  productKey: ProductKey;
  eyebrow: string;
  /** Defaults to the product name. */
  title?: string;
  subtitle: string;
  lead: string;
  center?: boolean;
  /** A smaller headline, for narrow cards and long titles. */
  compact?: boolean;
}) {
  const route = routeFor(productKey);
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <SectionTag lines="start">{eyebrow}</SectionTag>
      <h1
        id="product-heading"
        className={`mt-3 leading-tight font-extrabold tracking-tight text-blue-900 ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"}`}
      >
        {title ?? route.name}
      </h1>
      <p className="mt-2 text-base font-semibold text-slate-700">{subtitle}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">{lead}</p>
      <div className={`mt-7 flex ${center ? "justify-center" : ""}`}>
        <TourButton title={`${route.name} Tour`} />
      </div>
    </div>
  );
}

/** Module names as small chips. */
export function ModChips({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((m) => (
        <li key={m} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11.5px] font-medium text-slate-600">
          {m}
        </li>
      ))}
    </ul>
  );
}

/** The portal's "start with what hurts most" path for a product (from `solution-paths.ts`). */
export function StartPath({ path }: { path: SolutionPath }) {
  return (
    <Block id="start" tag="Where to start" title="Start with what hurts most" lead="Switch on the first modules, then add the rest when you are ready." tone="white">
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-[1fr_1.2fr]">
        <p className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 text-sm leading-relaxed text-slate-700">
          <span className="block text-[11px] font-bold tracking-wider text-orange-700 uppercase">What hurts</span>
          <span className="mt-1 block text-base font-semibold text-slate-900">{path.pain}</span>
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold tracking-wider text-blue-900 uppercase">Start with</p>
          <ol className="mt-2 space-y-1.5">
            {path.start.map((m, n) => (
              <li key={m} className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-900 text-[11px] font-semibold text-white">{n + 1}</span>
                {m}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Then add</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {path.then.map((m) => (
              <li key={m} className="flex items-center gap-1 rounded-md border border-dashed border-sky-300 bg-sky-50 px-2 py-1 text-[11.5px] font-medium text-slate-700">
                <Plus className="size-3 text-sky-700" aria-hidden="true" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Block>
  );
}

export interface Related {
  label: string;
  note: string;
  href: string;
}

/** A product as a "works with" card. */
export function relatedProduct(key: ProductKey, note: string): Related {
  return { label: routeFor(key).name, note, href: hrefFor(key) };
}

/** Portal FAQ entries by question, followed by any extra ones written for this product. */
export function faqItems(portalQuestions: string[], extra: { q: string; a: string }[] = []) {
  const portal = portalQuestions.map((q) => LIVE_FAQ.find((f) => f.q === q)).filter((f): f is { q: string; a: string } => Boolean(f));
  return [...extra, ...portal];
}

/** Closing sections shared by every product page: rollout, works-with, FAQ and the call-to-action band. */
export function ProductTail({
  productKey,
  related,
  faq,
}: {
  productKey: ProductKey;
  related: Related[];
  faq: { q: string; a: string }[];
}) {
  const route = routeFor(productKey);
  return (
    <>
      <Block
        id="rollout"
        tag="Getting live"
        title="Phased, module by module"
        lead={`The portal's rollout guide. ${LIVE_ROLLOUT_NOTE}`}
        tone="white"
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LIVE_ROLLOUT.map((r, i) => (
            <li key={r.week} className="flex flex-col rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-blue-900 font-mono text-sm font-semibold text-white">{i + 1}</span>
                <p className="text-[11px] font-bold tracking-wider text-orange-700 uppercase">{r.week}</p>
              </div>
              <h3 className="mt-3 text-[15px] font-bold text-slate-900">{r.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13px] leading-snug text-slate-600">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>

      <Block id="works-with" tag="One workspace" title="Works with the rest of Synax" lead="Every product shares the same people, records and approvals.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <span className="flex items-center justify-between gap-2 text-sm font-bold text-slate-900">
                  {r.label}
                  <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-600" aria-hidden="true" />
                </span>
                <span className="mt-1 text-xs leading-snug text-slate-600">{r.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="faq" tag="Questions" title={`About ${route.name}`} lead="Answers from the portal, and a few written for this product." tone="white">
        <Faq items={faq} />
      </Block>

      <CtaBand
        tone="light"
        tourTitle={`${route.name} Tour`}
        product={route.name}
        title={`See ${route.name} working with your data`}
        text="A short walkthrough with a Senwell Group systems engineer, focused on the modules that matter to you."
      />
    </>
  );
}
