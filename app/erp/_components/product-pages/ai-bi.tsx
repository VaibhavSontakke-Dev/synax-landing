import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardList, FileBarChart, LayoutDashboard, LineChart, Lock, ShieldCheck, Sparkles, Truck, Wallet, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Block } from "../site-page";
import { Reveal } from "../reveal";
import { HeroBand, HeroCopy, ProductTail, faqItems, relatedProduct } from "./shared";

/** AI & Business Intelligence — the approval gate first, then the agents, the questions and the analytics. */

const GATE: { title: string; text: string; accent: "navy" | "orange" }[] = [
  { title: "Ask", text: "Which challans are past their return date?", accent: "navy" },
  { title: "Agent finds", text: "2 challans are past their return date.", accent: "navy" },
  { title: "Agent proposes", text: "Draft reminders to the customer.", accent: "orange" },
  { title: "You approve", text: "Only then does anything change.", accent: "orange" },
];

const LADDER: { title: string; copy: string }[] = [
  { title: "The agent finds the exception", copy: "Agents watch your records for the problems that cost money: an overdue return, a lot that is not ready, a payment that is late." },
  { title: "The agent proposes the fix", copy: "Instead of changing anything, it drafts the action: a reminder, a follow-up, a note for the right person." },
  { title: "An approver decides", copy: "Every action waits for an approver with the right role. This is the maker-checker model the rest of Synax already uses." },
  { title: "The decision is recorded", copy: "Who approved what, and when, is kept in a full event history, next to the record it changed." },
];

const AGENTS: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: ClipboardList, title: "Challan reconciliation", copy: "Checks customer material challans against what came back, and flags the gaps." },
  { icon: Sparkles, title: "Overdue chasers", copy: "Drafts the reminder when a challan passes its return date, ready for approval." },
  { icon: Truck, title: "Dispatch readiness", copy: "Shows which lots are ready to dispatch and what is holding up the rest." },
  { icon: Wallet, title: "Receivables follow-up", copy: "Lines up who to chase for payment, with the follow-up drafted." },
  { icon: ShieldCheck, title: "Quality compliance", copy: "Watches for open quality items against the checks your process requires." },
  { icon: Wrench, title: "Shop-floor watch", copy: "Brings alarms and downtime that need a person to your attention." },
];

/** Sample figures for the hero dashboard (illustration only). */
const KPIS = [
  { label: "Challans past return date", value: "2", pct: "30%" },
  { label: "Lots ready to dispatch", value: "5", pct: "70%" },
  { label: "Route cards awaiting buy-off", value: "3", pct: "45%" },
];
const BARS = [40, 55, 48, 70, 62, 80, 74, 90];
const ATTENTION = ["2 challans are past their return date", "5 lots are ready to dispatch", "3 route cards await a buy-off"];

const QUESTIONS = ["Which challans are past their return date?", "Which lots are ready to dispatch?", "Which route cards are awaiting buy-off?"];

const BI: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: LayoutDashboard, title: "Business dashboards", copy: "The state of the business on one screen." },
  { icon: LineChart, title: "Operational analytics", copy: "How the operation is running, day by day." },
  { icon: FileBarChart, title: "Reports across workflows", copy: "Reports for sales, stores, production, quality, dispatch and people." },
  { icon: BarChart3, title: "Performance insights", copy: "What to look at next, based on current data." },
];

export function AiBiPage() {
  return (
    <main className="pb-6">
      {/* Hero: centred headline over a gray browser frame holding the photo, the approval card on its corner */}
      <HeroBand productKey="ai">
        <HeroCopy
          productKey="ai"
          center
          compact
          eyebrow="AI & Business Intelligence"
          title="Synax AI finds the exception and proposes the fix."
          subtitle="You approve."
          lead="Ask Synax anything about your ERP data, and let its agents watch for the problems that cost you money. Nothing changes until an approver says yes. Dashboards and reports across your workflows keep decisions on current data."
        />
        <div className="relative mx-auto mt-8 max-w-4xl pb-10 md:pb-4">
          <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-lg">
            <div className="flex items-center gap-2.5 border-b border-slate-300 bg-slate-200 px-4 py-2.5 text-xs text-slate-600">
              <span className="flex gap-1.5" aria-hidden="true">
                <i className="size-2.5 rounded-full bg-slate-400" />
                <i className="size-2.5 rounded-full bg-slate-400" />
                <i className="size-2.5 rounded-full bg-slate-400" />
              </span>
              <span className="font-mono text-slate-500">synax.senwellgroup.com</span>
            </div>
            <div className="bg-slate-50 p-4 pb-16 sm:p-5 sm:pb-20 md:pb-5">
              <div className="mb-3 flex items-center justify-between text-xs">
                <p className="font-bold text-slate-900">Business dashboard</p>
                <p className="text-slate-500">Sample data</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-3">
                {KPIS.map((k) => (
                  <li key={k.label} className="rounded-xl border border-slate-200 bg-white p-3.5 text-left">
                    <p className="text-[11px] font-semibold text-slate-500">{k.label}</p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-blue-900">{k.value}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                      <div className="h-1.5 rounded-full bg-blue-900/40" style={{ width: k.pct }} />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 grid gap-3 md:grid-cols-[1.5fr_1fr]">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-left">
                  <p className="text-[11px] font-semibold text-slate-500">Lots ready to dispatch, by week</p>
                  <div className="mt-3 flex h-24 items-end gap-2" role="img" aria-label="Sample bar chart of lots ready to dispatch, rising over eight weeks">
                    {BARS.map((h, i) => (
                      <span
                        key={i}
                        className={`flex-1 rounded-t ${i === BARS.length - 1 ? "bg-orange-300" : "bg-blue-900/35"}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="hidden rounded-xl border border-slate-200 bg-white p-3.5 text-left md:block">
                  <p className="text-[11px] font-semibold text-slate-500">Needs attention</p>
                  <ul className="mt-2 space-y-2 text-xs text-slate-700">
                    {ATTENTION.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-orange-300" aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-3 -bottom-0 w-64 rounded-2xl border border-t-4 border-slate-200 border-t-orange-300 bg-white p-4 shadow-xl sm:right-6 md:-bottom-6">
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Synax AI proposes</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{GATE[2].text}</p>
            <p className="mt-0.5 text-xs text-slate-600">{GATE[1].text}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md bg-orange-300 px-3 py-1 text-xs font-semibold text-orange-950">Approve</span>
              <span className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600">Reject</span>
            </div>
          </div>
        </div>
        <ol className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs font-semibold" aria-label="How a Synax AI action works">
          {GATE.map((g, i) => (
            <li key={g.title} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 ${g.accent === "orange" ? "bg-orange-300 text-orange-950" : "bg-blue-900 text-white"}`}>
                {i + 1}. {g.title}
              </span>
              {i < GATE.length - 1 ? <span className="text-slate-400" aria-hidden="true">→</span> : null}
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-4 max-w-md rounded-xl border border-dashed border-orange-300 bg-white/70 px-4 py-2.5 text-center text-xs text-slate-600">
          Every decision is kept in the event history. Agents cannot change your data on their own.
        </p>
      </HeroBand>

      {/* Why approval first */}
      <Block
        id="approval"
        tag="Approval first"
        title="The AI proposes. A person decides."
        lead="Agents cannot change your data on their own. Every action waits for an approver with the right role, and the decision is recorded."
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {LADDER.map((l, i) => (
            <Reveal key={l.title} as="li" delay={i * 70} className="flex">
              <div className="flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-white p-5 shadow-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-300 font-mono text-sm font-semibold text-orange-950">{i + 1}</span>
                <h3 className="mt-3 text-[15px] font-bold text-slate-900">{l.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{l.copy}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
          <Lock className="size-4 text-orange-600" aria-hidden="true" />
          Roles, two-step sign-in and the audit history are described on the{" "}
          <Link href="/security" className="font-semibold text-blue-900 hover:underline">
            Security &amp; Trust page
          </Link>
          .
        </p>
      </Block>

      {/* Agents */}
      <Block id="agents" tag="Synax agents" title="Six jobs the agents watch" lead="Each agent looks for a specific problem and brings you a proposed fix." tone="white">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.title} className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-white p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{a.copy}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Ask Synax */}
      <Block id="ask" tag="Ask Synax" title="Questions answered from your own data" lead="Ask in plain language and get answers from live records.">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold tracking-wider text-blue-900 uppercase">You ask</p>
            <ul className="mt-3 space-y-2">
              {QUESTIONS.map((q) => (
                <li key={q} className="rounded-xl rounded-bl-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {q}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold tracking-wider text-orange-700 uppercase">Synax answers</p>
            <p className="mt-3 rounded-xl rounded-bl-sm border border-orange-200 bg-orange-50/70 px-3 py-2 text-sm text-slate-800">
              A list from your live records, with the next step proposed for approval.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
              Approve <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Block>

      {/* Business intelligence */}
      <Block id="bi" tag="Business intelligence" title="Dashboards and reports on the workflows you already run" lead="The same records, summarised for the people who decide." tone="white">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BI.map((b) => {
            const Icon = b.icon;
            return (
              <li key={b.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-blue-900">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[15px] font-bold text-slate-900">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{b.copy}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      <ProductTail
        productKey="ai"
        related={[
          relatedProduct("precision", "Challans, route cards, dispatch and invoices."),
          relatedProduct("shopfloor", "Alarms, downtime and machine counts."),
          relatedProduct("hrms", "Attendance, payroll and department KPIs."),
          { label: "Security & Trust", note: "Roles, audit history and approvals.", href: "/security" },
        ]}
        faq={faqItems(["Can the AI change our data on its own?", "Who is Synax built for?", "How long does onboarding take?"])}
      />
    </main>
  );
}
