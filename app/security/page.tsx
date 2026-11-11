import type { Metadata } from "next";
import { Check, ExternalLink } from "lucide-react";
import { LIVE_COMPLIANCE, LIVE_SECURITY, LIVE_SOURCE } from "../erp/_data/live";
import { Block, CtaBand, PageHero } from "../erp/_components/site-page";
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

/** /security — what protects your data and records, and where responsibility sits. */
export default function SecurityPage() {
  return (
    <main className="pb-6">
      <PageHero
        crumbs={[{ label: "Security & Trust" }]}
        tag="Security & Trust"
        title="Audit-ready by design, not by report"
        lead="Each company runs in its own workspace, every posting is checked on the server, and the system keeps a record of who changed what and when. Here is how that works, and what stays your responsibility."
        product="Security & Trust Review"
        tourTitle="Synax Security Overview"
        aside={
          <ul className="grid grid-cols-2 gap-3" aria-label="Security at a glance">
            {[
              { label: "Workspaces", value: "One tenant per company" },
              { label: "Sign-in", value: "Two-step" },
              { label: "Postings", value: "Checked on the server" },
              { label: "History", value: "Who changed what, and when" },
            ].map((f) => (
              <li key={f.label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{f.label}</p>
                <p className="mt-1.5 text-lg leading-snug font-extrabold tracking-tight text-slate-900">{f.value}</p>
              </li>
            ))}
          </ul>
        }
      />

      <Block
        id="pillars"
        tag="Security & control"
        title="Six controls, in plain language"
        lead="What each one does, and what it means for you."
      >
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <li
              key={p.title}
              className="flex flex-col rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-6 shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-100 text-blue-900">
                <ModuleIcon name={p.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.summary}</p>
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

      <Block
        id="compliance"
        tag="Compliance alignment"
        title="Supports your standards. Your audit stays yours."
        lead="Synax gives you the controls and the records these requirements ask for. Certification belongs to your organisation and its auditor, not to the software."
        tone="white"
      >
        <dl className="grid gap-4 md:grid-cols-2">
          {LIVE_COMPLIANCE.map((s) => (
            <div key={s.name} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <dt className="flex items-center gap-2 text-base font-bold text-slate-900">
                <span className="flex size-7 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-700">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                {s.name}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{s.how}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block
        id="responsibility"
        tag="Shared responsibility"
        title="Who looks after what"
        lead="Security works when both sides are clear about their part."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <section aria-labelledby="ours-heading" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 id="ours-heading" className="text-base font-bold text-slate-900">Synax and Senwell Group</h3>
            <ul className="mt-4 space-y-3">
              {OURS.map((o) => (
                <li key={o} className="flex gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-blue-900" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="yours-heading" className="rounded-2xl border-2 border-orange-500 bg-white p-6 shadow-sm">
            <h3 id="yours-heading" className="text-base font-bold text-slate-900">Your organisation</h3>
            <ul className="mt-4 space-y-3">
              {YOURS.map((o) => (
                <li key={o} className="flex gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-orange-600" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Block>

      <Block
        id="legal"
        tag="Privacy & terms"
        title="Operated by Senwell Group Private Limited"
        lead="Synax is a product of Senwell Group. The privacy policy explains how personal data in Synax is collected, used and protected under the DPDP Act, 2023, and the terms govern use of the platform."
        tone="white"
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          {[
            { label: "Privacy Policy", href: "https://synax.senwellgroup.com/privacy" },
            { label: "Terms and Conditions", href: "https://synax.senwellgroup.com/terms" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border-2 border-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              {l.label}
              <ExternalLink className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Statements on this page follow the live portal at{" "}
          <a href={LIVE_SOURCE} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
            synax.senwellgroup.com
          </a>
          .
        </p>
      </Block>

      <CtaBand
        title="Bring your security questionnaire"
        text="Book a security and trust review with a Senwell Group systems engineer and bring your questions. We will go through them with you."
        product="Security & Trust Review"
        tourTitle="Synax Security Overview"
      />
    </main>
  );
}
