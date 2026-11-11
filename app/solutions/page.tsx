import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowDown, ArrowRight, Check } from "lucide-react";
import { PRODUCT_DATA, hrefFor, routeFor } from "../erp/_data/products";
import { SOLUTIONS } from "../erp/_data/solutions";
import { INDUSTRY_PAGES, industryHref } from "../erp/_data/industries";
import { ROLLOUT, ROLLOUT_CHECKLIST, WORKFLOW_STAGES } from "../erp/_data/content";
import { Block, CtaBand, PageHero } from "../erp/_components/site-page";
import { DemoButton } from "../erp/_components/demo-buttons";
import { TONE } from "../erp/_components/route-tone";
import { Reveal } from "../erp/_components/reveal";
import { SectionTag } from "../erp/_components/section-tag";
import { INDUSTRY_ICON } from "../erp/_components/industry-icons";

export const metadata: Metadata = {
  title: "Solutions by Industry & Business Need | Synax by Senwell",
  description:
    "How Synax is used in precision manufacturing, aerospace and defence, workforce management and IT staffing: the challenge, how it is solved, the capabilities involved and how a rollout works.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Solutions by Industry & Business Need | Synax",
    description: "The challenge, the Synax answer and the capabilities behind each solution.",
    type: "website",
  },
};

/** Header band tint per product tone (full class names so Tailwind keeps them). */
const HEAD_FROM = {
  emerald: "from-emerald-50",
  navy: "from-slate-100",
  orange: "from-orange-50",
} as const;

/** Which industry page expands each solution. */
const INDUSTRY_OF = {
  precision: "precision-cnc-machining",
  aerospace: "aerospace-defence",
  hrms: "plant-workforce-hcm",
  staffing: "it-services-staffing",
} as const;

type Sol = (typeof SOLUTIONS)[number];

function Challenge({ s }: { s: Sol }) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
      <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-orange-700 uppercase">
        <AlertCircle className="size-4" aria-hidden="true" />
        The challenge
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{s.challenge}</p>
    </div>
  );
}

function Answer({ s }: { s: Sol }) {
  return (
    <div className="rounded-2xl border border-blue-900/15 bg-slate-50 p-5">
      <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-900 uppercase">
        <Check className="size-4" aria-hidden="true" />
        How Synax solves it
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{s.solution}</p>
    </div>
  );
}

/** Small round arrow between the challenge and the answer. */
function Connector() {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <span className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
        <ArrowDown className="size-4 text-blue-900" />
      </span>
    </div>
  );
}

function Capabilities({ s, twoCols }: { s: Sol; twoCols?: boolean }) {
  const t = TONE[routeFor(s.key).tone];
  return (
    <div>
      <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Key capabilities</p>
      <ul className={`mt-3 grid gap-2.5 ${twoCols ? "sm:grid-cols-2" : ""}`}>
        {s.capabilities.map((c) => (
          <li
            key={c}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50/60"
          >
            <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${t.tile}`}>
              <Check className="size-3" aria-hidden="true" />
            </span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Delivered({ s }: { s: Sol }) {
  const route = routeFor(s.key);
  return (
    <p className="text-xs text-slate-500">
      Delivered by{" "}
      <Link href={hrefFor(s.key)} className="font-semibold text-blue-900 underline-offset-2 hover:underline">
        {route.name}
      </Link>
      <span aria-hidden="true"> · </span>
      <Link href={industryHref(INDUSTRY_OF[s.key])} className="font-semibold text-blue-900 underline-offset-2 hover:underline">
        Industry page
      </Link>
    </p>
  );
}

function Actions({ s }: { s: Sol }) {
  const route = routeFor(s.key);
  return (
    <div className="flex flex-wrap gap-3">
      <DemoButton product={s.demoName} className="!px-5 !py-2.5 !text-xs">
        Book a demo
      </DemoButton>
      <Link
        href={hrefFor(s.key)}
        className="inline-flex items-center gap-1.5 rounded-md border-2 border-orange-500 px-4 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        Explore {route.name}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

function SolutionTitle({ s, size }: { s: Sol; size: "lg" | "md" }) {
  const route = routeFor(s.key);
  const t = TONE[route.tone];
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-0.5 text-[11px] font-semibold ${t.chip}`}>{s.group}</span>
        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{s.tag}</span>
      </div>
      <h3
        id={`${s.key}-heading`}
        className={`mt-1.5 font-extrabold tracking-tight text-slate-900 ${size === "lg" ? "text-3xl" : "text-2xl"}`}
      >
        {s.title}
      </h3>
    </div>
  );
}

const CARD = "scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg";

/** Wide card: the story on one side, the problem and answer on the other. `flip` mirrors it. */
function WideCard({ s, index, flip = false }: { s: Sol; index: number; flip?: boolean }) {
  const route = routeFor(s.key);
  const t = TONE[route.tone];
  const Icon = PRODUCT_DATA[s.key].icon;
  return (
    <article id={s.key} aria-labelledby={`${s.key}-heading`} className={`${CARD} grid lg:grid-cols-5`}>
      <div
        className={`relative flex flex-col gap-5 overflow-hidden border-b border-slate-200 bg-gradient-to-br to-white p-6 sm:p-8 lg:col-span-2 lg:border-b-0 ${HEAD_FROM[route.tone]} ${flip ? "lg:order-2 lg:border-l" : "lg:border-r"}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -bottom-6 text-[9rem] leading-none font-black tracking-tighter text-slate-900/[0.05] select-none"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`relative flex size-14 items-center justify-center rounded-2xl border bg-white shadow-sm ${t.tile}`}>
          <Icon className="size-7" aria-hidden="true" />
        </span>
        <div className="relative">
          <SolutionTitle s={s} size="lg" />
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{s.description}</p>
        </div>
        <div className="relative mt-auto space-y-4 pt-2">
          <Delivered s={s} />
          <Actions s={s} />
        </div>
      </div>

      <div className="space-y-4 p-6 sm:p-8 lg:col-span-3">
        <Challenge s={s} />
        <Connector />
        <Answer s={s} />
        <div className="pt-3">
          <Capabilities s={s} twoCols />
        </div>
      </div>
    </article>
  );
}

/** Compact card: a header band, then everything stacked. Two sit side by side. */
function CompactCard({ s, index }: { s: Sol; index: number }) {
  const route = routeFor(s.key);
  const t = TONE[route.tone];
  const Icon = PRODUCT_DATA[s.key].icon;
  return (
    <article id={s.key} aria-labelledby={`${s.key}-heading`} className={`${CARD} flex h-full flex-col`}>
      <header
        className={`relative flex items-center gap-4 overflow-hidden border-b border-slate-200 bg-gradient-to-r to-white px-6 py-5 ${HEAD_FROM[route.tone]}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-7xl font-black tracking-tighter text-slate-900/[0.05] select-none"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`relative flex size-12 shrink-0 items-center justify-center rounded-xl border bg-white shadow-sm ${t.tile}`}>
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div className="relative">
          <SolutionTitle s={s} size="md" />
        </div>
      </header>

      <div className="flex-1 space-y-4 p-6">
        <p className="text-sm leading-relaxed text-slate-600">{s.description}</p>
        <Challenge s={s} />
        <Connector />
        <Answer s={s} />
        <div className="pt-2">
          <Capabilities s={s} />
        </div>
      </div>

      <footer className="space-y-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4">
        <Delivered s={s} />
        <Actions s={s} />
      </footer>
    </article>
  );
}

/** /solutions — every solution in detail, then the shared workflow and rollout behind them. */
export default function SolutionsPage() {
  return (
    <main className="pb-6">
      <PageHero
        crumbs={[{ label: "Solutions" }]}
        tag="Solutions by industry & business need"
        title="Solutions shaped around how your business runs"
        lead="Start from your industry or from the problem in front of you. Each solution below sets out the challenge we see most, how Synax answers it, the capabilities involved, and which product delivers it."
        tourTitle="Synax Platform Overview"
        aside={
          <nav aria-label="On this page" className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-slate-900">Jump to a solution</p>
            <ul className="mt-4 space-y-2">
              {SOLUTIONS.map((s) => {
                const route = routeFor(s.key);
                const t = TONE[route.tone];
                const Icon = PRODUCT_DATA[s.key].icon;
                return (
                  <li key={s.key}>
                    <a
                      href={`#${s.key}`}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${t.tile}`}>
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-slate-900">{s.title}</span>
                        <span className="block text-xs text-slate-500">
                          {s.group} · {s.short}
                        </span>
                      </span>
                      <ArrowDown className="size-4 shrink-0 text-slate-400 group-hover:text-orange-600" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        }
      />

      {/* Solution deep dives */}
      <section
        id="solutions"
        aria-labelledby="solutions-heading"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <SectionTag>Solutions in detail</SectionTag>
          <h2 id="solutions-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Each solution, from problem to answer
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            The challenge we see most, how Synax answers it, and the capabilities involved.
          </p>
        </div>

        <div className="space-y-8">
          {SOLUTIONS.length > 0 ? (
            <Reveal>
              <WideCard s={SOLUTIONS[0]} index={0} />
            </Reveal>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-2">
            {SOLUTIONS.slice(1, -1).map((sol, i) => (
              <Reveal key={sol.key} className="h-full" delay={i * 90}>
                <CompactCard s={sol} index={i + 1} />
              </Reveal>
            ))}
          </div>

          {SOLUTIONS.length > 1 ? (
            <Reveal>
              <WideCard s={SOLUTIONS[SOLUTIONS.length - 1]} index={SOLUTIONS.length - 1} flip />
            </Reveal>
          ) : null}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Your sector is not listed? Start with the product that matches your problem — see{" "}
          <Link href="/products" className="font-semibold text-blue-900 hover:underline">
            all six products
          </Link>
          .
        </p>
      </section>

      {/* Industry pages */}
      <Block
        id="industries"
        tag="By industry"
        title="A dedicated page for your industry"
        lead="Who it is for, the challenges, the flow that answers them, and the products behind it."
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
        tone="white"
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STAGES.map((stage) => (
            <li key={stage.id} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-900 font-mono text-sm font-semibold text-white">
                {stage.step}
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">{stage.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{stage.copy}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${stage.title} modules`}>
                {stage.modules.map((m) => (
                  <li key={m} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
                    {m}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>

      {/* Rollout */}
      <Block
        id="rollout"
        tag="How a solution goes live"
        title="A phased path from discovery to optimization"
        lead="Prepare the data and owners first, pilot with one team, then expand in governed waves."
      >
        <div className="grid gap-8 lg:grid-cols-5">
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {ROLLOUT.map((p, i) => (
              <li
                key={p.step}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${i === 2 ? "border-2 border-orange-500" : "border-slate-200"}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-9 items-center justify-center rounded-full font-mono text-sm font-semibold text-white ${i === 2 ? "bg-orange-600" : "bg-blue-900"}`}
                  >
                    {p.step}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{p.timing}</span>
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.copy}</p>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="text-base font-bold text-slate-900">Before onboarding</h3>
            <ul className="mt-4 space-y-3">
              {ROLLOUT_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-orange-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
              Total timing depends on process complexity and data readiness.
            </p>
          </div>
        </div>
      </Block>

      <CtaBand
        title="Tell us the problem. We will show you the solution."
        text="A short walkthrough with a Senwell Group systems engineer, focused on the solution that fits your business."
        tourTitle="Synax Platform Overview"
      />
    </main>
  );
}
