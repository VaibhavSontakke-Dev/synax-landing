import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { slug } from "@/i18n/slug";
import { ArrowRight, Check, Plus } from "lucide-react";
import { hrefFor, routeFor, type ProductKey } from "../../_data/products";
import { LIVE_FAQ } from "../../_data/live";
import type { SolutionKey } from "../../_data/solutions";
import type { SolutionPath } from "../../_data/solution-paths";
import { Block, Breadcrumb, CtaBand, Faq } from "../site-page";
import { SectionTag } from "../section-tag";
import { TourButton } from "../demo-buttons";
import { HeroBackdrop } from "../home-hero";

/**
 * Pieces shared by the six product pages. Each product page builds its own hero and body (they are meant to
 * look different); only the breadcrumb, hero copy, "start with" path and the closing sections live here.
 */

/**
 * Hero band with the home page's backdrop (dot grid, soft glow, navy and orange base line) and the standard
 * width and spacing. Put the page's own hero layout inside.
 *
 * Same frame on all six product pages: on desktop the band fills exactly the first screen under the header
 * (like the home hero), the breadcrumb is pinned at the top and the hero content starts a fixed gap below it,
 * so the breadcrumb and the first line (eyebrow / title) sit in the same place on every page. Each page sizes its own content from the viewport height
 * so it does not overflow.
 */
export function HeroBand({ productKey, children }: { productKey: ProductKey; children: React.ReactNode }) {
  const t = useTranslations("ProductShared");
  const tpr = useTranslations("Products");
  return (
    <section aria-labelledby="product-heading" className="relative isolate overflow-hidden lg:flex lg:min-h-[calc(100svh-4.1rem)]">
      <HeroBackdrop />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-5">
        <Breadcrumb items={[{ label: t("breadcrumbProducts"), href: "/products" }, { label: tpr(`${productKey}.name`) }]} />
        <div className="lg:mt-[clamp(0.5rem,6vh,4rem)]">{children}</div>
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
  centerBelowLg = false,
  compact = false,
  secondTourLabel,
}: {
  productKey: ProductKey;
  eyebrow: string;
  /** Defaults to the product name. */
  title?: string;
  subtitle: string;
  lead: string;
  center?: boolean;
  /** Centred on phones and tablets, left-aligned from `lg` (for a two-column hero). */
  centerBelowLg?: boolean;
  /** A smaller headline, for narrow cards and long titles. */
  compact?: boolean;
  /** Label of an optional second tour button; it opens the tour titled "<product> Tour 2" in `TOURS`. */
  secondTourLabel?: string;
}) {
  // The tour is looked up by its English title (`_data/tours.ts`); only the visible name is translated.
  const route = routeFor(productKey);
  const tpr = useTranslations("Products");
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : centerBelowLg ? "mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-left" : "max-w-xl"}>
      <SectionTag lines="start">{eyebrow}</SectionTag>
      <h1
        id="product-heading"
        className={`mt-3 leading-tight font-extrabold tracking-tight text-brand ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"}`}
      >
        {title ?? tpr(`${productKey}.name`)}
      </h1>
      <p className="mt-2 text-base font-semibold text-slate-700">{subtitle}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">{lead}</p>
      <div className={`mt-7 flex flex-wrap gap-3 ${center ? "justify-center" : centerBelowLg ? "justify-center lg:justify-start" : ""}`}>
        <TourButton title={`${route.name} Tour`} />
        {secondTourLabel ? <TourButton title={`${route.name} Tour 2`}>{secondTourLabel}</TourButton> : null}
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
export function StartPath({ path, solution }: { path: SolutionPath; solution: SolutionKey }) {
  const t = useTranslations("ProductShared.startPath");
  const tp = useTranslations("SolutionPaths");
  const tm = useTranslations("Modules");
  return (
    <Block id="start" tag={t("tag")} title={t("title")} lead={t("lead")} tone="white">
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-[1fr_1.2fr]">
        <p className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 text-sm leading-relaxed text-slate-700">
          <span className="block text-[11px] font-bold tracking-wider text-accent-strong uppercase">{t("whatHurts")}</span>
          <span className="mt-1 block text-base font-semibold text-slate-900">{tp(`${solution}.pain`)}</span>
        </p>
        <div className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
          <p className="text-[11px] font-bold tracking-wider text-brand uppercase">{t("startWith")}</p>
          <ol className="mt-2 space-y-1.5">
            {path.start.map((m, n) => (
              <li key={m} className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-solid text-[11px] font-semibold text-white">{n + 1}</span>
                {tm(slug(m))}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">{t("thenAdd")}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {path.then.map((m) => (
              <li key={m} className="flex items-center gap-1 rounded-md border border-dashed border-sky-300 bg-sky-50 px-2 py-1 text-[11.5px] font-medium text-slate-700">
                <Plus className="size-3 text-sky-700" aria-hidden="true" />
                {tm(slug(m))}
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
  /** Set for product cards, so the name is read in the visitor's language. */
  key?: ProductKey;
}

/** A product as a "works with" card. */
export function relatedProduct(key: ProductKey, note: string): Related {
  return { label: routeFor(key).name, note, href: hrefFor(key), key };
}

/** Portal FAQ entries by question, followed by any extra ones written for this product. */
export function faqItems(portalQuestions: string[], extra: { q: string; a: string }[] = []) {
  const portal = portalQuestions.map((q) => LIVE_FAQ.find((f) => f.q === q)).filter((f): f is { q: string; a: string } => Boolean(f));
  return [...extra, ...portal];
}

/**
 * Closing sections shared by every product page: rollout, works-with, FAQ and the call-to-action band.
 * Notes in `related` and the product's own extra FAQ entries are passed in already translated; the portal's FAQ entries (found by their
 * English question) are read from the "Faq" messages here.
 */
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
  const t = useTranslations("ProductShared");
  const tpr = useTranslations("Products");
  const tf = useTranslations("Faq");
  const name = tpr(`${productKey}.name`);
  const phases = ["p1", "p2", "p3", "p4"] as const;
  const items = faq.map((f) => (tf.has(`${slug(f.q)}.q`) ? { q: tf(`${slug(f.q)}.q`), a: tf(`${slug(f.q)}.a`) } : f));
  return (
    <>
      <Block id="rollout" tag={t("rollout.tag")} title={t("rollout.title")} lead={t("rollout.lead")} tone="white">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((p, i) => (
            <li key={p} className="flex flex-col rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-surface p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-brand-solid font-mono text-sm font-semibold text-white">{i + 1}</span>
                <p className="text-[11px] font-bold tracking-wider text-accent-strong uppercase">{t(`rollout.${p}.week`)}</p>
              </div>
              <h3 className="mt-3 text-[15px] font-bold text-slate-900">{t(`rollout.${p}.title`)}</h3>
              <ul className="mt-3 space-y-1.5">
                {(["a", "b", "c"] as const).map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-[13px] leading-snug text-slate-600">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                    <span>{t(`rollout.${p}.${pt}`)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>

      <Block id="works-with" tag={t("worksWith.tag")} title={t("worksWith.title")} lead={t("worksWith.lead")}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <span className="flex items-center justify-between gap-2 text-sm font-bold text-slate-900">
                  {r.key ? tpr(`${r.key}.name`) : r.label}
                  <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                </span>
                <span className="mt-1 text-xs leading-snug text-slate-600">{r.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="faq" tag={t("faq.tag")} title={t("faq.title", { name })} lead={t("faq.lead")} tone="white">
        <Faq items={items} />
      </Block>

      <CtaBand
        tone="light"
        tourTitle={`${route.name} Tour`}
        product={route.name}
        title={t("cta.title", { name })}
        text={t("cta.text")}
      />
    </>
  );
}
