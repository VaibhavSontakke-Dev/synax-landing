import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { BENCHMARK } from "../erp/_data/benchmark";
import { PLATFORM_BENEFITS } from "../erp/_data/content";
import {
  LIVE_CLIENTS,
  LIVE_FAQ,
  LIVE_FLOW,
  LIVE_FLOW_LEAD,
  LIVE_PILLARS,
  LIVE_POSITIONING,
  LIVE_PRICING,
} from "../erp/_data/live";
import { Block, Breadcrumb, CtaBand, Faq } from "../erp/_components/site-page";
import { DemoButton, TourButton } from "../erp/_components/demo-buttons";
import { SectionTag } from "../erp/_components/section-tag";
import { ReasonTabs } from "../erp/_components/reason-tabs";
import { ModuleIcon } from "../erp/_components/icons";

export const metadata: Metadata = {
  title: "Why Synax | Synax by Senwell",
  description:
    "Why manufacturers and service businesses choose Synax: quality gates built into the workflow, audit-ready records, end-to-end traceability, tenant-isolated workspaces, and one connected data model.",
  alternates: { canonical: "/why-synax" },
  openGraph: {
    title: "Why Synax",
    description: "Built-in quality, audit readiness, traceability and one connected data model.",
    type: "website",
  },
};

/** Benchmark row icon -> the module icon set used elsewhere on the site. */
const ROW_ICON = { cpu: "machine", filecheck: "badge", clock: "device", users: "people", receipt: "box" } as const;

const LEGACY = "Legacy ERP suites";
const POINT = "Disconnected point tools";

/** Facts on the hero's proof board (all from the live portal; see _data/live.ts). */
const PROOF = [
  { value: "Free", label: "for SMEs under 50 employees", accent: true },
  { value: "Tally", label: "vouchers bridge across" },
  { value: "GST", label: "e-invoice and e-way bill" },
  { value: "AS9100D", label: "QMS controls at checkpoints" },
];

const JUMP = [
  { id: "pillars", label: "Pillars" },
  { id: "flow", label: "Flow" },
  { id: "reasons", label: "Reasons" },
  { id: "compare", label: "Compare" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

/** /why-synax — light-blue hero, jump bar, pillars, flow rail, tabbed reasons, comparison, pricing + FAQ, heritage. */
export default function WhySynaxPage() {
  return (
    <main className="pb-6">
      {/* Hero */}
      <section aria-labelledby="page-heading" className="border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumb items={[{ label: "Why Synax" }]} />
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <SectionTag lines="start">Why Synax</SectionTag>
              <h1
                id="page-heading"
                className="mt-3 text-3xl leading-[1.1] font-extrabold tracking-tight text-blue-900 sm:text-4xl lg:text-5xl"
              >
                Why industry leaders choose{" "}
                <span className="relative inline-block">
                  Synax
                  <svg
                    className="absolute -bottom-1.5 left-0 h-2 w-full text-orange-300"
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2 6 C40 1 80 8 120 4 S180 3 198 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
                {LIVE_POSITIONING.headline} {LIVE_POSITIONING.sub}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <DemoButton />
                <TourButton title="Synax Platform Overview" />
              </div>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Highlights">
                {["Built in India, for Indian shop floors", "Audit trail on every posting"].map((c) => (
                  <li key={c} className="rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700">
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <ul className="grid grid-cols-2 gap-3" aria-label="Key facts">
              {PROOF.map((p) => (
                <li key={p.value} className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
                  <p className={`text-2xl font-extrabold tracking-tight ${p.accent ? "text-orange-600" : "text-blue-900"}`}>{p.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{p.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Jump bar */}
      <nav aria-label="On this page" className="sticky top-16 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
          {JUMP.map((j) => (
            <li key={j.id} className="shrink-0">
              <a
                href={`#${j.id}`}
                className="block rounded-full border border-slate-200 px-3.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                {j.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Pillars */}
      <Block
        id="pillars"
        tag="Built around a machine shop"
        title="Three things that set Synax apart"
        lead="In the portal's own words."
      >
        <ul className="grid gap-5 lg:grid-cols-3">
          {LIVE_PILLARS.map((p, i) => (
            <li
              key={p.kicker}
              className={`flex flex-col rounded-2xl border border-t-4 border-slate-200 bg-white p-6 shadow-sm ${i === 1 ? "border-t-orange-300" : "border-t-blue-900"}`}
            >
              <p className="text-xs font-bold tracking-wider text-orange-600 uppercase">{p.kicker}</p>
              <h3 className="mt-2 text-lg leading-snug font-extrabold tracking-tight text-slate-900">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.copy}</p>
              <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-orange-600" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Block>

      {/* Flow rail */}
      <section id="flow" aria-labelledby="flow-heading" className="scroll-mt-32 border-y border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionTag lines="start">Spindle to invoice</SectionTag>
              <h2 id="flow-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-blue-900 sm:text-3xl">
                One connected flow, every step traceable
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600">{LIVE_FLOW_LEAD}</p>
          </div>

          <div className="relative mt-8">
            <div className="absolute top-[13px] right-[8.3%] left-[8.3%] hidden h-0.5 bg-blue-900 lg:block" aria-hidden="true" />
            <ol className="relative grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
              {LIVE_FLOW.map((step, i) => {
                const emphasis = i === 3;
                return (
                  <li key={step.title} className="text-center">
                    <span
                      className={`inline-flex size-[26px] items-center justify-center rounded-full text-xs font-semibold ${
                        emphasis ? "bg-orange-300 text-orange-950 outline-[3px] outline-orange-100" : "bg-blue-900 text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <h3 className={`mt-2 text-[13px] leading-snug ${emphasis ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>{step.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.copy}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Reasons */}
      <Block
        id="reasons"
        tag="Five reasons"
        title="What changes when quality lives in the workflow"
        lead="Pick a reason to see the question we hear most, and what Synax does about it."
      >
        <ReasonTabs items={PLATFORM_BENEFITS} />
      </Block>

      {/* Comparison */}
      <Block
        id="compare"
        tag="Market benchmark"
        title="How Synax compares with the usual alternatives"
        lead="Most businesses run either a heavy legacy ERP with add-ons, or a set of disconnected tools. Here is how each handles the same jobs."
        tone="white"
      >
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Synax compared with legacy ERP suites and disconnected point tools</caption>
            <thead>
              <tr className="bg-slate-50 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <th scope="col" className="px-5 py-3.5">Capability</th>
                <th scope="col" className="bg-blue-900 px-5 py-3.5 text-white">Synax</th>
                <th scope="col" className="px-5 py-3.5">{LEGACY}</th>
                <th scope="col" className="px-5 py-3.5">{POINT}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {BENCHMARK.map((r) => (
                <tr key={r.title}>
                  <th scope="row" className="px-5 py-4 font-bold text-slate-900">
                    <span className="flex items-center gap-2.5">
                      <ModuleIcon name={ROW_ICON[r.icon]} className="size-4 shrink-0 text-blue-900" />
                      {r.title}
                    </span>
                  </th>
                  <td className="bg-sky-50 px-5 py-4 font-semibold text-slate-900">
                    <span className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-orange-600" aria-hidden="true" />
                      {r.synax}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    <span className="flex gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                      {r.legacy}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    <span className="flex gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                      {r.point}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-4 md:hidden">
          {BENCHMARK.map((r) => (
            <li key={r.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
              <p className="mt-2 flex gap-2 rounded-lg bg-sky-50 p-2.5 text-sm font-semibold text-slate-900">
                <Check className="mt-0.5 size-4 shrink-0 text-orange-600" aria-hidden="true" />
                <span>
                  <span className="sr-only">Synax: </span>
                  {r.synax}
                </span>
              </p>
              <p className="mt-2 flex gap-2 text-sm text-slate-600">
                <X className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{LEGACY}:</span> {r.legacy}
                </span>
              </p>
              <p className="mt-1.5 flex gap-2 text-sm text-slate-600">
                <X className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{POINT}:</span> {r.point}
                </span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          The alternatives column describes typical setups, not a specific product. Ask us to walk through your own current tools.
        </p>
      </Block>

      {/* Pricing + FAQ */}
      <section aria-label="Pricing and questions" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10">
          <div
            id="pricing"
            className="scroll-mt-32 rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-sky-50 to-white p-7 shadow-sm lg:sticky lg:top-36"
          >
            <SectionTag lines="start">Pricing</SectionTag>
            <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-blue-900">{LIVE_PRICING.headline}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{LIVE_PRICING.copy}</p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-orange-300 px-5 py-2.5 text-sm font-semibold text-orange-950 transition-colors hover:bg-orange-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              See the six products <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div id="faq" className="scroll-mt-32">
            <SectionTag lines="start">FAQ</SectionTag>
            <h2 className="mt-2 mb-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Questions we hear most</h2>
            <Faq items={LIVE_FAQ} />
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section aria-labelledby="heritage-heading" className="border-y border-sky-200 bg-sky-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-md">
            <SectionTag lines="start">Manufacturing pedigree</SectionTag>
            <h2 id="heritage-heading" className="mt-2 text-xl font-extrabold tracking-tight text-blue-900 sm:text-2xl">
              Industrial heritage. Purpose-built software.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Born out of Senwell Group&apos;s multi-decade heritage in precision aerospace manufacturing, industrial export and high-volume engineering operations.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Running on Synax">
            {LIVE_CLIENTS.slice(1).map((name) => (
              <li key={name} className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-900 shadow-sm">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        tone="light"
        title="See why it works on your own process"
        text="A short walkthrough with a Senwell Group systems engineer, using your workflows rather than a canned demo."
        tourTitle="Synax Platform Overview"
      />
    </main>
  );
}
