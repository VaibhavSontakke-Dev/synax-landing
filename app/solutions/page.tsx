import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Cog, Layers, MessageSquare, Package, Plus, Receipt, ShieldCheck, ShoppingCart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PRODUCT_DATA, routeFor } from "../erp/_data/products";
import { SOLUTIONS } from "../erp/_data/solutions";
import { AREAS, SOLUTION_PATHS, type AreaName } from "../erp/_data/solution-paths";
import { INDUSTRY_PAGES, industryHref } from "../erp/_data/industries";
import { WORKFLOW_STAGES } from "../erp/_data/content";
import { LIVE_FAQ, LIVE_MODULES } from "../erp/_data/live";
import { Block, CtaBand, Faq, PageHero } from "../erp/_components/site-page";
import { TONE } from "../erp/_components/route-tone";
import { Reveal } from "../erp/_components/reveal";
import { SectionTag } from "../erp/_components/section-tag";
import { INDUSTRY_ICON } from "../erp/_components/industry-icons";

export const metadata: Metadata = {
  title: "Solutions by Industry & Business Need | Synax by Senwell",
  description:
    "Start with what hurts most and add the rest when you are ready: where to begin for precision manufacturing, aerospace and defence, HRMS and staffing, how far each solution reaches, and the full module directory.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Solutions by Industry & Business Need | Synax",
    description: "Where to start for each solution, what to add next, and the module directory.",
    type: "website",
  },
};

/** Which industry page expands each solution. */
const INDUSTRY_OF = {
  precision: "precision-cnc-machining",
  aerospace: "aerospace-defence",
  hrms: "plant-workforce-hcm",
  staffing: "it-services-staffing",
} as const;

const AREA_ICON: Record<AreaName, LucideIcon> = {
  Sales: ShoppingCart,
  "Procurement & Stores": Package,
  Production: Cog,
  Quality: ShieldCheck,
  "Dispatch & GST": Receipt,
  People: Users,
  Collaboration: MessageSquare,
  Platform: Layers,
};

const WHO = LIVE_FAQ.find((f) => f.q === "Who is Synax built for?");
const START_FAQ = LIVE_FAQ.filter((f) =>
  [
    "How long does onboarding take?",
    "Do we have to move our accounts out of Tally?",
    "Does Synax generate e-invoices and e-way bills?",
    "Which machines can Synax connect to?",
    "Is Synax free for small manufacturers?",
  ].includes(f.q),
);

/** /solutions — where to start for each solution, how far each reaches, the module directory, then the shared workflow. */
export default function SolutionsPage() {
  return (
    <main className="pb-6">
      <PageHero
        tourTitle="Synax Platform Overview"
        crumbs={[{ label: "Solutions" }]}
        tag="Solutions by industry & business need"
        title="Start with what hurts most. Add the rest when you are ready."
        lead="Pick the problem in front of you. For each solution you will see the modules to switch on first, what to add next, how far it reaches across the platform, and the full module directory."
        aside={
          <nav aria-label="Pick your starting point" className="rounded-3xl border border-sky-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-slate-900">Pick your starting point</p>
            <ul className="mt-4 space-y-2">
              {SOLUTIONS.map((s) => {
                const route = routeFor(s.key);
                const t = TONE[route.tone];
                const Icon = PRODUCT_DATA[s.key].icon;
                return (
                  <li key={s.key}>
                    <a
                      href={`#start-${s.key}`}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-sky-300 hover:bg-sky-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${t.tile}`}>
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-slate-900">{s.title}</span>
                        <span className="block text-xs text-slate-600">{SOLUTION_PATHS[s.key].pain}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-slate-400 group-hover:text-orange-600" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        }
      />

      {/* Start with what hurts most */}
      <section id="start" aria-labelledby="start-heading" className="scroll-mt-24 border-b border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
            <SectionTag>Where to start</SectionTag>
            <h2 id="start-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Four starting points
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Most plants go live module by module within a few weeks. Begin with the modules on the left of each path.
            </p>
          </div>

          {WHO ? (
            <p className="mx-auto mb-8 flex max-w-3xl gap-3 rounded-2xl border border-sky-200 bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-orange-600" aria-hidden="true" />
              <span>
                <span className="font-bold text-slate-900">Who is Synax built for? </span>
                {WHO.a}
              </span>
            </p>
          ) : null}

          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {SOLUTIONS.map((s, i) => {
              const route = routeFor(s.key);
              const t = TONE[route.tone];
              const Icon = PRODUCT_DATA[s.key].icon;
              const path = SOLUTION_PATHS[s.key];
              return (
                <Reveal key={s.key} as="li" delay={i * 70} className="flex">
                  <article
                    id={`start-${s.key}`}
                    aria-labelledby={`start-${s.key}-title`}
                    className={`flex w-full scroll-mt-28 flex-col rounded-2xl border border-t-4 border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${t.bar}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${t.tile}`}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 id={`start-${s.key}-title`} className="text-[15px] leading-snug font-bold text-slate-900">
                          {s.title}
                        </h3>
                        <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{s.group}</p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2.5 text-[13px] leading-snug text-slate-700">
                      <span className="block text-[11px] font-bold tracking-wider text-orange-700 uppercase">What hurts</span>
                      {path.pain}
                    </p>

                    <p className="mt-4 text-[11px] font-bold tracking-wider text-blue-900 uppercase">Start with</p>
                    <ol className="mt-2 space-y-1.5">
                      {path.start.map((m, n) => (
                        <li key={m} className="flex items-center gap-2.5 text-[13px] font-medium text-slate-800">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-900 text-[11px] font-semibold text-white">
                            {n + 1}
                          </span>
                          {m}
                        </li>
                      ))}
                    </ol>

                    <p className="mt-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Then add</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {path.then.map((m) => (
                        <li
                          key={m}
                          className="flex items-center gap-1 rounded-md border border-dashed border-sky-300 bg-sky-50 px-2 py-1 text-[11.5px] font-medium text-slate-700"
                        >
                          <Plus className="size-3 text-sky-700" aria-hidden="true" />
                          {m}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={industryHref(INDUSTRY_OF[s.key])}
                      className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-blue-900 hover:underline"
                    >
                      See the industry page
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How far each solution reaches */}
      <Block
        id="reach"
        tag="Coverage"
        title="How far each solution reaches"
        lead="Typical use across the platform's eight module areas. Everything is on one workspace, so you can extend any solution later."
        tone="white"
      >
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <caption className="sr-only">Module areas used by each solution: core, optional or not typical</caption>
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-600">
                <th scope="col" className="px-4 py-3">Solution</th>
                {AREAS.map((a) => {
                  const AIcon = AREA_ICON[a];
                  return (
                    <th key={a} scope="col" className="px-2 py-3 text-center">
                      <span className="flex flex-col items-center gap-1">
                        <AIcon className="size-4 text-blue-900" aria-hidden="true" />
                        <span className="leading-tight">{a}</span>
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SOLUTIONS.map((s) => {
                const route = routeFor(s.key);
                const t = TONE[route.tone];
                const Icon = PRODUCT_DATA[s.key].icon;
                const cov = SOLUTION_PATHS[s.key].coverage;
                return (
                  <tr key={s.key}>
                    <th scope="row" className="px-4 py-3.5 font-bold text-slate-900">
                      <span className="flex items-center gap-2.5">
                        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${t.tile}`}>
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        {s.title}
                      </span>
                    </th>
                    {AREAS.map((a) => (
                      <td key={a} className="px-2 py-3.5 text-center">
                        {cov[a] === 2 ? (
                          <span className="mx-auto block size-3.5 rounded-full bg-blue-900">
                            <span className="sr-only">Core</span>
                          </span>
                        ) : cov[a] === 1 ? (
                          <span className="mx-auto block size-3.5 rounded-full border-2 border-blue-900 bg-white">
                            <span className="sr-only">Optional</span>
                          </span>
                        ) : (
                          <span className="mx-auto block h-0.5 w-3 rounded bg-slate-300">
                            <span className="sr-only">Not typical</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600" aria-label="Legend">
          <li className="flex items-center gap-2"><span className="size-3.5 rounded-full bg-blue-900" aria-hidden="true" /> Core to the solution</li>
          <li className="flex items-center gap-2"><span className="size-3.5 rounded-full border-2 border-blue-900 bg-white" aria-hidden="true" /> Optional, add when ready</li>
          <li className="flex items-center gap-2"><span className="h-0.5 w-3 rounded bg-slate-300" aria-hidden="true" /> Not usually part of it</li>
        </ul>
      </Block>

      {/* Module directory (portal) */}
      <Block
        id="modules"
        tag="Module directory"
        title="What you can switch on"
        lead="The portal's own directory, by area. Start with what hurts most and add the rest when you are ready."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LIVE_MODULES.map((m) => {
            const area = m.area as AreaName;
            const AIcon = AREA_ICON[area] ?? Layers;
            const users = SOLUTIONS.filter((s) => SOLUTION_PATHS[s.key].coverage[area] === 2);
            return (
              <li key={m.area} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-blue-900">
                    <AIcon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <h3 className="text-[15px] font-bold text-slate-900">{m.area}</h3>
                </div>
                <ul className="mt-3 flex-1 space-y-1.5 text-[13px] text-slate-700">
                  {m.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                {users.length > 0 ? (
                  <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-snug text-slate-500">
                    Core to: {users.map((u) => routeFor(u.key).name).join(", ")}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-center text-sm text-slate-600">
          Your sector is not listed? Start with the product that matches your problem — see{" "}
          <Link href="/products" className="font-semibold text-blue-900 hover:underline">
            all six products
          </Link>
          .
        </p>
      </Block>

      {/* Industry pages */}
      <Block
        id="industries"
        tag="By industry"
        title="A dedicated page for your industry"
        lead="Who it is for, the challenges, the flow that answers them, and the products behind it."
        tone="white"
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRY_PAGES.map((i) => {
            const t = TONE[i.tone];
            const IIcon = INDUSTRY_ICON[i.icon];
            return (
              <li key={i.slug}>
                <Link
                  href={industryHref(i.slug)}
                  className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${t.tile}`}>
                    <IIcon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900">{i.name}</span>
                    <span className="block text-xs text-slate-500">{i.menu}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-600" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Shared workflow */}
      <Block
        id="workflow"
        tag="One workflow behind every solution"
        title="Plan, execute, inspect, release"
        lead="Whatever the sector, work moves through the same four stages and the record is built as it goes."
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STAGES.map((stage) => (
            <li key={stage.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-900 font-mono text-sm font-semibold text-white">
                {stage.step}
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">{stage.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{stage.copy}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${stage.title} modules`}>
                {stage.modules.map((m) => (
                  <li key={m} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
                    {m}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>

      {/* Getting started (portal FAQ) */}
      <Block
        id="faq"
        tag="Getting started"
        title="Questions about going live"
        lead="Answers from the portal: onboarding, Tally, GST, machines and pricing."
        tone="white"
      >
        <Faq items={START_FAQ} />
      </Block>

      <CtaBand
        tone="light"
        tourTitle="Synax Platform Overview"
        title="Tell us the problem. We will show you the solution."
        text="A short walkthrough with a Senwell Group systems engineer, focused on the solution that fits your business."
      />
    </main>
  );
}
