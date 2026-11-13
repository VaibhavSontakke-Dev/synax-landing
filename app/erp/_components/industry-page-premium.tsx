import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, ArrowRight, Boxes, Check, ClipboardList, ShieldCheck } from "lucide-react";
import { PRODUCT_DATA, hrefFor, routeFor } from "../_data/products";
import { INDUSTRY_PAGES, industryHref, type IndustryPage } from "../_data/industries";
import { LIVE_FAQ } from "../_data/live";
import { INDUSTRY_ICON } from "./industry-icons";
import { HeroFoot, IndustryHero } from "./industry-heroes";
import { Faq } from "./site-page";
import { SectionTag } from "./section-tag";
import { DemoButton, TourButton } from "./demo-buttons";
import { JumpBar } from "./jump-bar";
import { Reveal } from "./reveal";

/**
 * Premium industry page (/solutions/<slug>), used by the pages listed in `PREMIUM_INDUSTRIES` (the route
 * picks it; every other industry still uses `IndustryPageView`). Same content as the template, laid out as:
 * a hero of its own per industry (see industry-heroes.tsx) with a slim "at a glance" band, sticky jump bar, editorial challenges, a connected
 * flow, module cards, product cards (first one featured), FAQ, other industries and a closing band.
 * Server component; the client bits are Reveal, JumpBar, the hero backdrop and the two action buttons.
 * Colours stay navy, sky and soft orange (no deep orange, green or red).
 */

/** Industry slugs that use this layout (all of them). */
export const PREMIUM_INDUSTRIES = new Set(INDUSTRY_PAGES.map((i) => i.slug));

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";
const TILE = "border-slate-300 bg-slate-100 text-blue-900";

const GROUP_ICON: LucideIcon[] = [ClipboardList, Boxes, ShieldCheck];

const LG_COLS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-3",
};

function SectionHead({
  tag,
  title,
  lead,
  id,
  align = "center",
}: {
  tag: string;
  title: string;
  lead?: string;
  id: string;
  align?: "center" | "start";
}) {
  return (
    <div className={`max-w-2xl space-y-3 ${align === "center" ? "mx-auto mb-10 text-center" : ""}`}>
      <SectionTag lines={align === "center" ? "both" : "start"}>{tag}</SectionTag>
      <h2 id={id} className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {lead ? <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{lead}</p> : null}
    </div>
  );
}

export function IndustryPagePremium({ page }: { page: IndustryPage }) {
  const meta = PRODUCT_DATA[page.modulesFrom];
  const modules = meta.moduleSection;
  const faq = LIVE_FAQ.filter((f) => page.faq.includes(f.q));
  const others = INDUSTRY_PAGES.filter((i) => i.slug !== page.slug);
  const moduleCount = modules?.groups.reduce((n, g) => n + g.items.length, 0) ?? 0;

  const jump = [
    { id: "challenges", label: "The challenge" },
    { id: "flow", label: "How it answers it" },
    ...(modules ? [{ id: "modules", label: "Modules" }] : []),
    { id: "products", label: "Products" },
    ...(page.proof ? [{ id: "proof", label: "Proof" }] : []),
    ...(faq.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "industries", label: "Other industries" },
  ];

  const stats = [
    { value: page.flow.length, label: "Flow steps" },
    ...(modules ? [{ value: modules.groups.length, label: "Module groups" }, { value: moduleCount, label: "Modules" }] : []),
    { value: page.products.length, label: "Products" },
  ];

  return (
    <main className="pb-6">
      <IndustryHero page={page} />
      <HeroFoot page={page} stats={stats} />

      <JumpBar items={jump} />

      {/* Challenges */}
      <section id="challenges" aria-labelledby="challenges-heading" className="scroll-mt-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.4fr] lg:gap-14 lg:px-8 lg:py-20">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <SectionHead
              id="challenges-heading"
              align="start"
              tag="The challenge"
              title="What gets in the way today"
              lead="The problems we hear most from this kind of business."
            />
            <p className="mt-6 hidden border-l-2 border-orange-300 pl-4 text-sm leading-relaxed text-slate-600 lg:block">
              Every one of these is a record that is created after the fact. Synax creates it while the work happens.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {page.challenges.map((c, i) => (
              <Reveal key={c.title} as="li" delay={i * 70} className="flex">
                <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-900/30 hover:shadow-lg">
                  <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-blue-900 transition-transform duration-300 group-hover:scale-y-100" aria-hidden="true" />
                  <span className="absolute top-3 right-4 text-5xl leading-none font-extrabold text-slate-100 select-none" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-500">
                    <AlertCircle className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-5 text-base font-bold text-slate-900">{c.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{c.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Flow */}
      <section id="flow" aria-labelledby="flow-heading" className="scroll-mt-32 border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHead id="flow-heading" tag="How Synax answers it" title={page.flowTitle} lead={page.flowLead} />
          <ol className={`grid gap-x-5 gap-y-10 pt-5 sm:grid-cols-2 ${LG_COLS[page.flow.length] ?? "lg:grid-cols-3"}`}>
            {page.flow.map((step, i) => (
              <Reveal key={step.title} as="li" delay={(i % 4) * 70} className="relative flex">
                {page.flow.length <= 4 && i < page.flow.length - 1 ? (
                  <span
                    className="synax-prod-dash-x absolute top-0 left-[3.75rem] z-0 hidden h-0.5 -translate-y-1/2 text-blue-900/40 lg:block"
                    style={{ right: "-2.5rem" }}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex w-full flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-5 pt-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-900/30 hover:bg-white hover:shadow-lg">
                  <span className="absolute -top-5 left-5 z-10 flex size-10 items-center justify-center rounded-full border-4 border-white bg-blue-900 font-mono text-sm font-semibold text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.copy}</p>
                  {step.chips ? (
                    <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-200 pt-4" aria-label={`${step.title} modules`}>
                      {step.chips.map((c) => (
                        <li key={c} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 transition-colors group-hover:border-sky-300 group-hover:bg-sky-50">
                          {c}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Modules */}
      {modules ? (
        <section id="modules" aria-labelledby="modules-heading" className="scroll-mt-32 border-b border-sky-200 bg-sky-50">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHead id="modules-heading" tag={modules.kicker} title="The modules behind it" lead={modules.subtitle} />
            <ul className="grid gap-5 md:grid-cols-3">
              {modules.groups.map((g, i) => {
                const GIcon = GROUP_ICON[i % GROUP_ICON.length];
                return (
                  <Reveal key={g.id} as="li" delay={i * 70} className="flex">
                    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-sky-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-900 via-blue-900/60 to-sky-200" aria-hidden="true" />
                      <div className="flex items-center justify-between">
                        <span className={`flex size-11 items-center justify-center rounded-xl border ${TILE} transition-colors group-hover:border-blue-900 group-hover:bg-blue-900 group-hover:text-white`}>
                          <GIcon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">{g.items.length} modules</span>
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-slate-900">{g.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.description}</p>
                      <ul className="mt-5 flex-1 space-y-1 border-t border-slate-100 pt-4">
                        {g.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-sky-50">
                            <Check className="mt-0.5 size-4 shrink-0 text-blue-900" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Products */}
      <section id="products" aria-labelledby="products-heading" className="scroll-mt-32">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHead
            id="products-heading"
            tag="Delivered by"
            title="The products behind this solution"
            lead="Start with the first and add the others when you are ready."
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {page.products.map((key, i) => {
              const r = routeFor(key);
              const PIcon = PRODUCT_DATA[key].icon;
              const first = i === 0;
              return (
                <Reveal key={key} as="li" delay={i * 70} className="flex">
                  <Link
                    href={hrefFor(key)}
                    className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${FOCUS} ${
                      first ? "border-blue-900 bg-blue-900 text-white shadow-lg" : "border-slate-200 bg-white shadow-sm hover:border-blue-900/30"
                    }`}
                  >
                    {first ? <span className="absolute -top-16 -right-16 size-44 rounded-full bg-orange-300/15 blur-2xl" aria-hidden="true" /> : null}
                    <div className="relative flex items-center justify-between">
                      <span className={`flex size-11 items-center justify-center rounded-xl border ${first ? "border-white/20 bg-white/10 text-white" : TILE}`}>
                        <PIcon className="size-5" aria-hidden="true" />
                      </span>
                      {first ? <span className="rounded-full bg-orange-300 px-2.5 py-0.5 text-[11px] font-bold text-blue-950">Start here</span> : null}
                    </div>
                    <h3 className={`relative mt-5 text-lg font-bold ${first ? "text-white" : "text-slate-900"}`}>{r.name}</h3>
                    <p className={`relative mt-2 flex-1 text-sm leading-relaxed ${first ? "text-slate-200" : "text-slate-600"}`}>{PRODUCT_DATA[key].subtitle}</p>
                    <span className={`relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${first ? "text-orange-300" : "text-blue-900"}`}>
                      Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Proof */}
      {page.proof ? (
        <section id="proof" aria-labelledby="proof-heading" className="scroll-mt-32 border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <SectionHead
              id="proof-heading"
              tag="Running on Synax"
              title="Built by a group that runs industrial operations"
              lead="These Senwell Group companies run on Synax."
            />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {page.proof.map((name) => (
                <li key={name} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center">
                  <p className="text-base font-extrabold tracking-tight text-slate-900">{name}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {faq.length > 0 ? (
        <section id="faq" aria-labelledby="faq-heading" className={`scroll-mt-32 ${page.proof ? "" : "border-y border-slate-200 bg-white"}`}>
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHead id="faq-heading" tag="FAQ" title="Questions we hear most" />
            <Faq items={faq} />
          </div>
        </section>
      ) : null}

      {/* Other industries */}
      <section id="industries" aria-labelledby="industries-heading" className="scroll-mt-32">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <SectionHead id="industries-heading" tag="Explore" title="Other industries" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o, i) => {
              const OIcon = INDUSTRY_ICON[o.icon];
              return (
                <Reveal key={o.slug} as="li" delay={i * 60} className="flex">
                  <Link
                    href={industryHref(o.slug)}
                    className={`group flex h-full w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-900/30 hover:shadow-lg ${FOCUS}`}
                  >
                    <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${TILE} transition-colors group-hover:border-blue-900 group-hover:bg-blue-900 group-hover:text-white`}>
                      <OIcon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900">{o.name}</span>
                      <span className="block text-xs text-slate-500">{o.menu}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-900" aria-hidden="true" />
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Closing band */}
      <section aria-labelledby="cta-heading" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 p-7 shadow-2xl md:p-12">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute inset-0 [background-image:radial-gradient(rgba(148,163,184,0.14)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_right,transparent,#000_70%)]" />
            <div className="absolute -top-24 -right-16 size-72 rounded-full bg-orange-300/15 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-300 via-orange-300/40 to-transparent" />
          </div>
          <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-xl">
              <SectionTag tone="dark" lines="start">
                Get started
              </SectionTag>
              <h2 id="cta-heading" className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                See Synax on your own process
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                A short walkthrough with a Senwell Group systems engineer, using your own parts, people and processes.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <DemoButton product={page.demoName} onDark>
                Schedule a Demo
              </DemoButton>
              <TourButton title={`${page.name} Tour`} onDark />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
