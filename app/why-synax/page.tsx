import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, Check, Cpu, FileCheck2, PackageCheck, Receipt, Sparkles, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { TONE } from "../erp/_components/route-tone";
import { Block, CtaBand, Faq, PageHero } from "../erp/_components/site-page";
import { Reveal } from "../erp/_components/reveal";
import { SectionTag } from "../erp/_components/section-tag";
import { ReasonTabs } from "../erp/_components/reason-tabs";
import { JumpBar } from "../erp/_components/jump-bar";
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
const ROW_ICON = { cpu: "machine", filecheck: "badge", clock: "device", sparkles: "bolt", receipt: "box" } as const;

const LEGACY = "Legacy ERP suites";
const POINT = "Disconnected point tools";

/** One icon + colour per pillar (same order as LIVE_PILLARS). */
const PILLAR_STYLE: { icon: LucideIcon; tone: keyof typeof TONE }[] = [
  { icon: PackageCheck, tone: "navy" },
  { icon: Cpu, tone: "orange" },
  { icon: Sparkles, tone: "emerald" },
];

/** Facts on the hero card (all from the live portal; see _data/live.ts). */
const PROOF: { icon: LucideIcon; value: string; label: string; accent?: boolean }[] = [
  { icon: BadgeIndianRupee, value: "Free", label: "for SMEs under 50 employees", accent: true },
  { icon: Receipt, value: "Tally", label: "vouchers bridge across" },
  { icon: FileCheck2, value: "GST", label: "e-invoice and e-way bill" },
  { icon: Check, value: "AS9100D", label: "QMS controls at checkpoints" },
];

const JUMP = [
  { id: "pillars", label: "Pillars" },
  { id: "flow", label: "Flow" },
  { id: "reasons", label: "Reasons" },
  { id: "compare", label: "Compare" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

/** /why-synax — same layout language as /solutions: hero + card, sky band of cards, then alternating blocks. */
export default function WhySynaxPage() {
  return (
    <main className="pb-6">
      <PageHero
        tourTitle="Synax Platform Overview"
        crumbs={[{ label: "Why Synax" }]}
        tag="Why Synax"
        title="Why industry leaders choose Synax"
        lead={`${LIVE_POSITIONING.headline} ${LIVE_POSITIONING.sub}`}
        aside={
          <div className="rounded-3xl border border-sky-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-slate-900">Synax at a glance</p>
            <ul className="mt-4 space-y-2" aria-label="Key facts">
              {PROOF.map((p) => {
                const Icon = p.icon;
                return (
                  <li key={p.value} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${
                        p.accent ? "border-orange-200 bg-orange-50 text-orange-700" : "border-sky-200 bg-sky-100 text-blue-900"
                      }`}
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900">{p.value}</span>
                      <span className="block text-xs text-slate-600">{p.label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
              {["Built in India, for Indian shop floors", "Audit trail on every posting"].map((c) => (
                <li key={c} className="rounded-md border border-dashed border-sky-300 bg-sky-50 px-2 py-1 text-[11.5px] font-medium text-slate-700">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* Jump bar: the current section is navy */}
      <JumpBar items={JUMP} />

      {/* Pillars */}
      <section id="pillars" aria-labelledby="pillars-heading" className="scroll-mt-32 border-b border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
            <SectionTag>Built around a machine shop</SectionTag>
            <h2 id="pillars-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Three things that set Synax apart
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">In the portal&apos;s own words.</p>
          </div>

          <ul className="grid gap-5 lg:grid-cols-3">
            {LIVE_PILLARS.map((p, i) => {
              const style = PILLAR_STYLE[i] ?? PILLAR_STYLE[0];
              const t = TONE[style.tone];
              const Icon = style.icon;
              return (
                <Reveal key={p.kicker} as="li" delay={i * 70} className="flex">
                  <article
                    aria-labelledby={`pillar-${i}-title`}
                    className={`flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${t.bar}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${t.tile}`}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">{p.kicker}</p>
                    </div>
                    <h3 id={`pillar-${i}-title`} className="mt-4 text-base leading-snug font-bold text-slate-900">
                      {p.title}
                    </h3>
                    <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2.5 text-[13px] leading-snug text-slate-700">{p.copy}</p>
                    <p className="mt-4 text-[11px] font-bold tracking-wider text-blue-900 uppercase">What you get</p>
                    <ul className="mt-2 space-y-1.5">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-[13px] leading-snug font-medium text-slate-800">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                          <span>{pt}</span>
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

      {/* Flow */}
      <Block id="flow" tag="Spindle to invoice" title="One connected flow, every step traceable" lead={LIVE_FLOW_LEAD} tone="white">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {LIVE_FLOW.map((step, i) => {
            const emphasis = i === 3;
            return (
              <li
                key={step.title}
                className={`flex flex-col rounded-2xl border border-t-4 bg-white p-4 shadow-sm ${
                  emphasis ? "border-slate-200 border-t-orange-500" : "border-slate-200 border-t-blue-900"
                }`}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full font-mono text-sm font-semibold ${
                    emphasis ? "bg-orange-300 text-orange-950" : "bg-blue-900 text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm leading-snug font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{step.copy}</p>
              </li>
            );
          })}
        </ol>
      </Block>

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
              <tr className="bg-slate-50 text-xs font-bold text-slate-600">
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
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-blue-900">
                        <ModuleIcon name={ROW_ICON[r.icon]} className="size-4" />
                      </span>
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
            <li key={r.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
        <p className="mt-4 text-center text-xs text-slate-500">
          The alternatives column describes typical setups, not a specific product. Ask us to walk through your own current tools.
        </p>
      </Block>

      {/* Pricing */}
      <section id="pricing" aria-labelledby="pricing-heading" className="scroll-mt-32 border-y border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <SectionTag>Pricing</SectionTag>
            <h2 id="pricing-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {LIVE_PRICING.headline}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{LIVE_PRICING.copy}</p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md bg-orange-300 px-5 py-2.5 text-sm font-semibold text-orange-950 transition-colors hover:bg-orange-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                See the six products <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Block id="faq" tag="FAQ" title="Questions we hear most" lead="Answers from the portal, in its own words.">
        <Faq items={LIVE_FAQ} />
      </Block>

      {/* Heritage */}
      <Block
        id="heritage"
        tag="Manufacturing pedigree"
        title="Industrial heritage. Purpose-built software."
        lead="Born out of Senwell Group's multi-decade heritage in precision aerospace manufacturing, industrial export and high-volume engineering operations."
        tone="white"
      >
        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Running on Synax">
          {LIVE_CLIENTS.slice(1).map((name) => (
            <li key={name} className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-center text-sm font-bold text-slate-900 shadow-sm">
              {name}
            </li>
          ))}
        </ul>
      </Block>

      <CtaBand
        tone="light"
        tourTitle="Synax Platform Overview"
        title="See why it works on your own process"
        text="A short walkthrough with a Senwell Group systems engineer, using your workflows rather than a canned demo."
      />
    </main>
  );
}
