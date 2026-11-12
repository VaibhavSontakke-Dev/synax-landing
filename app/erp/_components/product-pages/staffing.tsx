import { ClipboardCheck, RefreshCw, ShieldCheck, Timer, UserRound, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SOLUTION_PATHS } from "../../_data/solution-paths";
import { Block } from "../site-page";
import { HeroBand, HeroCopy, ProductTail, StartPath, faqItems, relatedProduct } from "./shared";

/** Staffing & Resource Management — a match board in the hero (mirrored), a narrowing hiring funnel and two sides. */

const STAGES: { title: string; copy: string; width: string }[] = [
  { title: "Customer requirement", copy: "Capture what the customer needs: the role, the skills and how many people.", width: "100%" },
  { title: "Candidates", copy: "Manage the people who can fill it, with each candidate linked to the requirement they are for.", width: "88%" },
  { title: "Interviews", copy: "Schedule interview rounds and keep the feedback against the candidate and the requirement.", width: "76%" },
  { title: "Offer", copy: "Prepare the offer and take it through approval before it goes out.", width: "64%" },
  { title: "Onboarding", copy: "Move the chosen candidate from accepted offer to day one.", width: "52%" },
  { title: "Deployment", copy: "Place the person with the customer and see who is where.", width: "40%" },
];

const AFTER: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: Users, title: "Resource performance", copy: "See how each deployed person is doing against what the customer expected." },
  { icon: RefreshCw, title: "Replacements", copy: "Replace a resource and keep the requirement's history, instead of starting again." },
  { icon: Timer, title: "Timesheets and project billing", copy: "Record the hours delivered and bill the customer for them." },
];

const CANDIDATES = [
  { name: "Candidate A", stage: "Interview", pct: 40, done: false },
  { name: "Candidate B", stage: "Offer", pct: 70, done: false },
  { name: "Candidate C", stage: "Deployed", pct: 100, done: true },
];

export function StaffingPage() {
  return (
    <main className="pb-6">
      {/* Hero (mirrored): match board left, copy right */}
      <HeroBand productKey="staffing">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1" aria-label="A requirement matched to candidates">
            <div className="grid items-center gap-4 sm:grid-cols-[170px_1fr]">
              <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Customer requirement</p>
                <p className="mt-1 text-sm font-bold text-slate-900">Role, skills, headcount</p>
                <p className="mt-1 text-xs text-slate-600">Approvals along the way</p>
              </div>
              <div className="relative sm:pl-8">
                <svg className="absolute top-1/2 left-0 hidden h-40 w-8 -translate-y-1/2 text-blue-900/40 sm:block" viewBox="0 0 32 160" fill="none" aria-hidden="true">
                  <path d="M0 80 C16 80 16 22 32 22 M0 80 L32 80 M0 80 C16 80 16 138 32 138" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
                <ul className="space-y-2.5">
                  {CANDIDATES.map((c) => (
                    <li key={c.name} className={`rounded-xl border border-l-4 border-slate-200 bg-white p-3 shadow-sm ${c.done ? "border-l-slate-400" : "border-l-blue-900"}`}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          <UserRound className="size-4 text-slate-400" aria-hidden="true" />
                          {c.name}
                        </p>
                        <p className={`text-xs font-semibold ${c.done ? "text-slate-600" : "text-blue-900"}`}>{c.stage}</p>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                        <div className={`h-1.5 rounded-full ${c.done ? "bg-blue-900/40" : "bg-slate-400"}`} style={{ width: `${c.pct}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Illustration: sample candidates.</p>
          </div>
          <div className="order-1 lg:order-2">
            <HeroCopy
              productKey="staffing"
              eyebrow="Candidates, interviews & deployments"
              subtitle="Source, deploy and manage customer staffing requirements"
              lead="Manage customer requirements and candidates, run interviews, offers and onboarding, and track deployments, replacements and resource performance, with approvals along the way."
            />
          </div>
        </div>
      </HeroBand>

      {/* Funnel */}
      <Block
        id="pipeline"
        tag="Hiring pipeline"
        title="From the customer's requirement to the person on site"
        lead="Every candidate stays linked to the requirement it is filling."
      >
        <ol className="mx-auto max-w-4xl space-y-3">
          {STAGES.map((s, i) => (
            <li key={s.title} className="grid items-center gap-2 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-5">
              <div
                className="flex items-center gap-3 rounded-xl border border-orange-200 px-4 py-3"
                style={{ width: s.width, backgroundColor: `rgba(249, 115, 22, ${0.16 - i * 0.02})` }}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-900 text-[11px] font-semibold text-white">{i + 1}</span>
                <p className="text-sm font-bold text-slate-900">{s.title}</p>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-600">{s.copy}</p>
            </li>
          ))}
        </ol>
      </Block>

      {/* After day one */}
      <Block id="after" tag="After day one" title="Keep the placement healthy" lead="Placing a person is the start. These modules cover what happens next." tone="white">
        <ul className="grid gap-5 md:grid-cols-3">
          {AFTER.map((a) => {
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

      {/* Two sides */}
      <Block
        id="sides"
        tag="Two sides, one record"
        title="Nothing moves without the right sign-off"
        lead="Offers, onboarding and deployments pass through approvals, and the history stays with the record."
      >
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-blue-900">
              <ClipboardCheck className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-900">Customer side</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">The requirement, the interview feedback and the deployment status in one place.</p>
          </div>
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-white p-5 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-700">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-900">Candidate side</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">The profile, the interviews, the offer and the onboarding steps.</p>
          </div>
        </div>
      </Block>

      <StartPath path={SOLUTION_PATHS.staffing} />

      <ProductTail
        productKey="staffing"
        related={[
          relatedProduct("hrms", "Employee records, attendance and payroll."),
          relatedProduct("it", "Timesheets, projects and billing."),
          relatedProduct("ai", "Dashboards, reports and approvals."),
          relatedProduct("precision", "The same workspace for manufacturing."),
        ]}
        faq={faqItems(["Is Synax free for small manufacturers?", "How long does onboarding take?"], [
          {
            q: "Is staffing a separate system?",
            a: "No. It runs in the same workspace as HRMS and Work & Delivery, so people, projects and approvals are shared.",
          },
          { q: "Are timesheets billed to the customer?", a: "Timesheets and project billing are part of Staffing & Resource Management." },
        ])}
      />
    </main>
  );
}
