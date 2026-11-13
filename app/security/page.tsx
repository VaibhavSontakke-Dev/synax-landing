import type { Metadata } from "next";
import { Check, ExternalLink } from "lucide-react";
import { LIVE_COMPLIANCE, LIVE_SECURITY, LIVE_SOURCE } from "../erp/_data/live";
import { Block, CtaBand } from "../erp/_components/site-page";
import { SecurityHero } from "../erp/_components/security-hero";
import { JumpBar } from "../erp/_components/jump-bar";
import { SectionTag } from "../erp/_components/section-tag";
import { Reveal } from "../erp/_components/reveal";
import { TONE } from "../erp/_components/route-tone";
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
  tone: keyof typeof TONE;
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
    tone: "navy",
  },
  {
    icon: SERVER.icon,
    title: SERVER.title,
    summary: SERVER.copy,
    points: ["Receipt tolerance and PO open-quantity control", "Material reserved by RI unit against the route card"],
    tone: "navy",
  },
  {
    icon: AUDIT.icon,
    title: AUDIT.title,
    summary: AUDIT.copy,
    points: ["An audit trail on every posting", "Maker-checker approval with a full event history"],
    tone: "navy",
  },
  {
    icon: ROLES.icon,
    title: ROLES.title,
    summary: ROLES.copy,
    points: ["Two-step sign-in", "Sensitive values shown only to the roles you choose"],
    tone: "navy",
  },
  {
    icon: "bolt",
    title: "AI that proposes, you approve",
    summary: "Synax agents only propose. Every action waits for an approver with the right role, and the decision is recorded.",
    points: ["The AI cannot change your data on its own", "Each approval is kept in the event history"],
    tone: "orange",
  },
  {
    icon: "box",
    title: "Customer material stays with its owner",
    summary: "Every challan, Material ID range and rejection stays tied to the customer who owns it.",
    points: ["Customer material balances, returns and scrap documents", "A read-only customer portal"],
    tone: "orange",
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

/** What happens to a posting, using only statements from the live portal. */
const PROCESS: { icon: IconName; title: string; copy: string }[] = [
  { icon: "lock", title: "Role check", copy: "Menus, actions and sensitive values follow the roles you configure." },
  { icon: "shield", title: "Server check", copy: "Stock, quantities and status changes are validated on the server, not in the browser." },
  { icon: "bolt", title: "Approval", copy: "Where your process needs it, an approver with the right role decides." },
  { icon: "badge", title: "Audit history", copy: "Who changed what and when is kept for every material business change." },
];

/** One short line per check for the hero strip (the full wording is in the "How it works" section below). */
const HERO_GATE_COPY = ["Menus, actions and values follow roles", "Validated on the server", "An approver decides", "Who changed what, and when"];

const JUMP = [
  { id: "controls", label: "Controls" },
  { id: "process", label: "How it works" },
  { id: "compliance", label: "Compliance" },
  { id: "responsibility", label: "Responsibility" },
  { id: "legal", label: "Privacy & terms" },
];

/** /security — same layout language as /solutions: hero + card, sky band of cards, then alternating blocks. */
export default function SecurityPage() {
  return (
    <main className="pb-6">
      <SecurityHero gates={PROCESS.map((p, i) => ({ ...p, copy: HERO_GATE_COPY[i] }))} />

      <JumpBar items={JUMP} />

      {/* Controls */}
      <section id="controls" aria-labelledby="controls-heading" className="scroll-mt-32 border-b border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
            <SectionTag>Security &amp; control</SectionTag>
            <h2 id="controls-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Six controls, in plain language
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">What each one does, and what it means for you.</p>
          </div>

          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => {
              const t = TONE[p.tone];
              return (
                <Reveal key={p.title} as="li" delay={(i % 3) * 70} className="flex">
                  <article
                    aria-labelledby={`control-${i}-title`}
                    className={`flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${t.bar}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${t.tile}`}>
                        <ModuleIcon name={p.icon} className="size-5" />
                      </span>
                      <h3 id={`control-${i}-title`} className="text-[15px] leading-snug font-bold text-slate-900">
                        {p.title}
                      </h3>
                    </div>
                    <p className="mt-4 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2.5 text-[13px] leading-snug text-slate-700">
                      <span className="block text-[11px] font-bold tracking-wider text-orange-700 uppercase">What it does</span>
                      {p.summary}
                    </p>
                    <p className="mt-4 text-[11px] font-bold tracking-wider text-blue-900 uppercase">In practice</p>
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

      {/* How a posting is protected */}
      <Block id="process" tag="How it works" title="What happens to every posting" lead="Four checks sit between a request and the record." tone="white">
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-full bg-blue-900 font-mono text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span className="flex size-9 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-blue-900">
                  <ModuleIcon name={step.icon} className="size-[18px]" />
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.copy}</p>
            </li>
          ))}
        </ol>
      </Block>

      {/* Compliance */}
      <Block
        id="compliance"
        tag="Compliance alignment"
        title="Supports your standards. Your audit stays yours."
        lead="Synax gives you the controls and the records these requirements ask for. Certification belongs to your organisation and its auditor, not to the software."
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          {LIVE_COMPLIANCE.map((c) => (
            <div key={c.name} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-[15px] font-bold text-slate-900">{c.name}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-600">{c.how}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Block>

      {/* Shared responsibility */}
      <Block
        id="responsibility"
        tag="Shared responsibility"
        title="Who looks after what"
        lead="Security works when both sides are clear about their part."
        tone="white"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <section aria-labelledby="ours-heading" className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm">
            <h3 id="ours-heading" className="text-[15px] font-bold text-slate-900">Synax and Senwell Group</h3>
            <ul className="mt-3 space-y-2">
              {OURS.map((o) => (
                <li key={o} className="flex gap-2.5 text-[13px] leading-snug font-medium text-slate-800">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-blue-900" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="yours-heading" className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-white p-5 shadow-sm">
            <h3 id="yours-heading" className="text-[15px] font-bold text-slate-900">Your organisation</h3>
            <ul className="mt-3 space-y-2">
              {YOURS.map((o) => (
                <li key={o} className="flex gap-2.5 text-[13px] leading-snug font-medium text-slate-800">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Block>

      {/* Privacy and terms */}
      <Block
        id="legal"
        tag="Privacy & terms"
        title="Operated by Senwell Group Private Limited"
        lead="The privacy policy explains how personal data in Synax is collected, used and protected under the DPDP Act, 2023. The terms govern use of the platform."
      >
        <div className="flex flex-wrap justify-center gap-3">
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
        <p className="mt-4 text-center text-xs text-slate-500">
          Statements on this page follow the live portal at{" "}
          <a href={LIVE_SOURCE} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
            synax.senwellgroup.com
          </a>
          .
        </p>
      </Block>

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
