import type { Metadata } from "next";
import { Check, ExternalLink } from "lucide-react";
import { LIVE_COMPLIANCE, LIVE_SECURITY, LIVE_SOURCE } from "../erp/_data/live";
import { Block, CtaBand, PageHero } from "../erp/_components/site-page";
import { JumpBar } from "../erp/_components/jump-bar";
import { SectionTag } from "../erp/_components/section-tag";
import { ModuleIcon } from "../erp/_components/icons";
import type { IconName } from "../erp/_data/content";

export const metadata: Metadata = {
  title: "Security & Trust | Synax by Senwell",
  description:
    "Isolated workspaces per company, server-checked postings, an audit history of every material change, role-based access with two-step sign-in, and AI agents that only propose until an approver says yes.",
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security & Trust | Synax",
    description: "Audit-ready by design, not by report.",
    type: "website",
  },
};

interface Pillar {
  icon: IconName;
  title: string;
  summary: string;
  points: string[];
}

/*
 * Source: the live portal's "Security & control" section, FAQ and metadata (see _data/live.ts). Nothing here
 * is invented. Removed from the earlier draft because the live site does not say it: "99.9% availability",
 * encryption specifics, "monitored 24/7", ISO 9001, CMMC, ITAR/EAR vault. Add any back only once the owner
 * confirms it.
 */
const [TENANT, SERVER, AUDIT, ROLES] = LIVE_SECURITY;

const PILLARS: Pillar[] = [
  {
    icon: TENANT.icon,
    title: TENANT.title,
    summary: TENANT.copy,
    points: ["Dedicated subdomain hosting for each tenant", "Business units can be kept apart in their own workspaces"],
  },
  {
    icon: SERVER.icon,
    title: SERVER.title,
    summary: SERVER.copy,
    points: ["Receipt tolerance and PO open-quantity control", "Material reserved by RI unit against the route card"],
  },
  {
    icon: AUDIT.icon,
    title: AUDIT.title,
    summary: AUDIT.copy,
    points: ["An audit trail on every posting", "Maker-checker approval with a full event history"],
  },
  {
    icon: ROLES.icon,
    title: ROLES.title,
    summary: ROLES.copy,
    points: ["Two-step sign-in", "Sensitive values shown only to the roles you choose"],
  },
  {
    icon: "bolt",
    title: "AI that proposes, you approve",
    summary: "Synax agents only propose. Every action waits for an approver with the right role, and the decision is recorded.",
    points: ["The AI cannot change your data on its own", "Each approval is kept in the event history"],
  },
  {
    icon: "box",
    title: "Customer material stays with its owner",
    summary: "Every challan, Material ID range and rejection stays tied to the customer who owns it.",
    points: ["Customer material balances, returns and scrap documents", "A read-only customer portal"],
  },
];

const OURS = [
  "Running the platform and keeping each company's tenant isolated",
  "Validating stock, quantities and status changes on the server",
  "Recording an audit history of material business changes",
  "Providing role-based access and two-step sign-in",
];

const YOURS = [
  "Deciding who gets which role, and removing access when people leave",
  "Setting your approval, attendance and task-update procedures",
  "Choosing which records and checks are mandatory in your process",
  "Holding your own certifications and passing your own audits",
];

const FACTS: { icon: IconName; label: string; value: string }[] = [
  { icon: "layers", label: "Workspaces", value: "One tenant per company" },
  { icon: "lock", label: "Sign-in", value: "Two-step" },
  { icon: "shield", label: "Postings", value: "Checked on the server" },
  { icon: "badge", label: "History", value: "Who changed what, and when" },
];

/** What happens to a posting, using only statements from the live portal. */
const PROCESS: { icon: IconName; title: string; copy: string }[] = [
  { icon: "lock", title: "Role check", copy: "Menus, actions and sensitive values follow the roles you configure." },
  { icon: "shield", title: "Server check", copy: "Stock, quantities and status changes are validated on the server, not in the browser." },
  { icon: "bolt", title: "Approval", copy: "Where your process needs it, an approver with the right role decides." },
  { icon: "badge", title: "Audit history", copy: "Who changed what and when is kept for every material business change." },
];

const JUMP = [
  { id: "controls", label: "Controls" },
  { id: "process", label: "How it works" },
  { id: "compliance", label: "Compliance" },
  { id: "responsibility", label: "Responsibility" },
  { id: "legal", label: "Privacy & terms" },
];

/** /security — what protects your data and records, and where responsibility sits. Calm type, tight spacing. */
export default function SecurityPage() {
  return (
    <main className="pb-6">
      <PageHero
        tourTitle="Synax Security Overview"
        crumbs={[{ label: "Security & Trust" }]}
        tag="Security & Trust"
        title="Audit-ready by design, not by report"
        lead="Each company runs in its own workspace, every posting is checked on the server, and the system keeps a record of who changed what and when. Here is how that works, and what stays your responsibility."
        aside={
          <ul className="grid grid-cols-2 gap-3" aria-label="Security at a glance">
            {FACTS.map((f) => (
              <li key={f.label} className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-blue-900">
                  <ModuleIcon name={f.icon} className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{f.label}</p>
                  <p className="mt-0.5 text-sm leading-snug font-bold text-blue-900">{f.value}</p>
                </div>
              </li>
            ))}
          </ul>
        }
      />

      <JumpBar items={JUMP} />

      {/* Controls */}
      <Block
        compact
        id="controls"
        tag="Security & control"
        title="Six controls, in plain language"
        lead="What each one does, and what it means for you."
      >
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <li
              key={p.title}
              className="flex flex-col rounded-2xl border border-t-[3px] border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-blue-900">
                  <ModuleIcon name={p.icon} className="size-[18px]" />
                </span>
                <h3 className="text-[15px] leading-snug font-bold text-slate-900">{p.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.summary}</p>
              <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-[13px] leading-snug text-slate-700">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Block>

      {/* How a posting is protected */}
      <section id="process" aria-labelledby="process-heading" className="scroll-mt-32 border-y border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionTag lines="start">How it works</SectionTag>
              <h2 id="process-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                What happens to every posting
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600">Four checks sit between a request and the record.</p>
          </div>

          <div className="relative mt-7">
            <div className="absolute top-[19px] right-[12.5%] left-[12.5%] hidden h-0.5 bg-blue-900/70 lg:block" aria-hidden="true" />
            <ol className="relative grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4">
              {PROCESS.map((step, i) => (
                <li key={step.title} className="px-1 text-center">
                  <span className="relative inline-flex size-10 items-center justify-center rounded-full border-2 border-blue-900 bg-white text-blue-900">
                    <ModuleIcon name={step.icon} className="size-[18px]" />
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-orange-300 text-[11px] font-semibold text-orange-950">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-2.5 text-[15px] font-bold text-slate-900">{step.title}</h3>
                  <p className="mx-auto mt-1 max-w-[16rem] text-[13px] leading-relaxed text-slate-600">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Compliance + responsibility, side by side */}
      <section aria-label="Compliance and responsibility" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div id="compliance" className="scroll-mt-32">
              <SectionTag lines="start">Compliance alignment</SectionTag>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Supports your standards. Your audit stays yours.</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Synax gives you the controls and the records these requirements ask for. Certification belongs to your organisation and its auditor, not to the software.
              </p>
              <dl className="mt-5 space-y-2.5">
                {LIVE_COMPLIANCE.map((c) => (
                  <div key={c.name} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-orange-200 bg-orange-50 text-orange-600">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-sm font-bold text-slate-900">{c.name}</dt>
                      <dd className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{c.how}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div id="responsibility" className="scroll-mt-32">
              <SectionTag lines="start">Shared responsibility</SectionTag>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Who looks after what</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Security works when both sides are clear about their part.</p>
              <div className="mt-5 grid gap-3">
                <section aria-labelledby="ours-heading" className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <h3 id="ours-heading" className="text-sm font-bold text-slate-900">Synax and Senwell Group</h3>
                  <ul className="mt-2.5 space-y-2">
                    {OURS.map((o) => (
                      <li key={o} className="flex gap-2.5 text-[13px] leading-snug text-slate-700">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-blue-900" aria-hidden="true" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="yours-heading" className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
                  <h3 id="yours-heading" className="text-sm font-bold text-slate-900">Your organisation</h3>
                  <ul className="mt-2.5 space-y-2">
                    {YOURS.map((o) => (
                      <li key={o} className="flex gap-2.5 text-[13px] leading-snug text-slate-700">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and terms */}
      <section id="legal" aria-labelledby="legal-heading" className="scroll-mt-32 border-y border-sky-200 bg-sky-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <SectionTag lines="start">Privacy &amp; terms</SectionTag>
            <h2 id="legal-heading" className="mt-1.5 text-lg font-extrabold text-slate-900">Operated by Senwell Group Private Limited</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              The privacy policy explains how personal data in Synax is collected, used and protected under the DPDP Act, 2023. The terms govern use of the platform.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Statements on this page follow the live portal at{" "}
              <a href={LIVE_SOURCE} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                synax.senwellgroup.com
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Privacy Policy", href: "https://synax.senwellgroup.com/privacy" },
              { label: "Terms and Conditions", href: "https://synax.senwellgroup.com/terms" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border-2 border-orange-500 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                {l.label}
                <ExternalLink className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        tone="light"
        tourTitle="Synax Security Overview"
        title="Bring your security questionnaire"
        text="Book a security and trust review with a Senwell Group systems engineer and bring your questions. We will go through them with you."
        product="Security & Trust Review"
      />
    </main>
  );
}
