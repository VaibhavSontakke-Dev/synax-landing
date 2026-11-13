import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, ClipboardList, Headset, LayoutDashboard, MessagesSquare, Phone, UserCheck, UsersRound, Video, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Block } from "../site-page";
import { Reveal } from "../reveal";
import { HeroBand, HeroCopy, ProductTail, faqItems, relatedProduct } from "./shared";

/** Work & Delivery Management — a tilted stack of cards, three connected lanes and a card per role. */

const LANES: { n: number; title: string; copy: string; items: { name: string; note: string }[] }[] = [
  {
    n: 1,
    title: "The day's work",
    copy: "Tasks, owners, progress and blockers stay in one tracker, so nobody has to ask what is happening.",
    items: [
      { name: "Work Tracker", note: "Tasks, owners, progress and blockers" },
      { name: "Daily Meetings", note: "The day's check-in, kept with the work" },
      { name: "Activity Tracker", note: "What was done, and when" },
    ],
  },
  {
    n: 2,
    title: "Projects",
    copy: "Run delivery against what the customer asked for: their requirements and the SOW behind each project.",
    items: [
      { name: "Project List and Project Add", note: "Create projects and see them all" },
      { name: "Customer requirements and SOWs", note: "What was agreed, next to the work" },
      { name: "PM and PC dashboards", note: "Status for project managers and coordinators" },
    ],
  },
  {
    n: 3,
    title: "Hours to billing",
    copy: "Turn time and cost into a bill, with a view of profitability while the project is still running.",
    items: [
      { name: "Timesheets and Work Logs", note: "Hours recorded against the project" },
      { name: "Development Costs", note: "What the delivery is costing" },
      { name: "Project Billing Tracker", note: "What is billed and what is due" },
      { name: "Budget Planner", note: "Plan against the budget" },
    ],
  },
];

const ROLES: { icon: LucideIcon; role: string; sees: string }[] = [
  { icon: BriefcaseBusiness, role: "Project manager", sees: "The PM dashboard: project status, hours and billing." },
  { icon: UserCheck, role: "Project coordinator", sees: "The PC dashboard: the day-to-day follow-up." },
  { icon: ClipboardList, role: "Team member", sees: "The work tracker, timesheet and work log." },
  { icon: Wallet, role: "Finance", sees: "The project billing tracker and budget planner." },
];

const AROUND: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: MessagesSquare, title: "Team Chat", copy: "Fast team messaging across functions." },
  { icon: Phone, title: "Audio and video calls", copy: "Instant 1:1 and team calling." },
  { icon: Video, title: "Public and private meetings", copy: "Open rooms and access-controlled meetings." },
  { icon: Headset, title: "Support tickets", copy: "Create and resolve SLA-based tickets." },
  { icon: UsersRound, title: "Company visitor management", copy: "Keep a record of who comes to the office." },
  { icon: LayoutDashboard, title: "Department performance", copy: "See how each department is doing." },
];

export function WorkDeliveryPage() {
  return (
    <main className="pb-6">
      {/* Hero: copy left, a team-at-the-board photo right with three lane cards over its edge */}
      <HeroBand productKey="it">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <HeroCopy
            productKey="it"
            eyebrow="Delivery, people and billing"
            subtitle="Plan the work, track the hours, bill what you deliver"
            lead="Track the day's work, run projects against customer requirements and SOWs, record timesheets and costs, and bill with a clear view of profitability. People, attendance and approvals are shared with the rest of Synax, not re-entered."
          />
          <div className="relative lg:pl-16">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-md">
              <Image
                src="/images/products/work-delivery.webp"
                alt="A team looking at a task board on a whiteboard"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                quality={75}
                className="object-cover"
              />
            </div>
            <span className="absolute top-4 right-4 rounded-full bg-blue-900 px-3 py-1 text-xs font-semibold text-white shadow-md">Hours to billing</span>
            <ul className="mt-3 grid grid-cols-3 gap-2 lg:absolute lg:top-8 lg:left-0 lg:mt-0 lg:block lg:w-44 lg:space-y-3" aria-label="From a task to an invoice line">
              {[
                { t: "Work Tracker", n: "Task, owner, progress" },
                { t: "Timesheets", n: "Hours against the project" },
                { t: "Billing Tracker", n: "Invoice line and profitability" },
              ].map((c, i) => (
                <li key={c.t} className={`rounded-xl border border-l-4 border-slate-200 bg-white p-2.5 shadow-lg ${i === 2 ? "border-l-orange-300" : "border-l-blue-900"}`}>
                  <p className="text-xs font-bold text-blue-900">{c.t}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-600">{c.n}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </HeroBand>

      {/* Three lanes */}
      <Block
        id="lanes"
        tag="Day to invoice"
        title="One path from a task to a bill"
        lead="Work, hours and billing sit in the same workspace, so the number on the invoice traces back to the work behind it."
      >
        <ol className="grid gap-5 lg:grid-cols-3">
          {LANES.map((l, i) => (
            <Reveal key={l.title} as="li" delay={i * 70} className="relative flex">
              <div className="flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-blue-900 font-mono text-sm font-semibold text-white">{l.n}</span>
                  <h3 className="text-base font-bold text-slate-900">{l.title}</h3>
                </div>
                <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2.5 text-[13px] leading-snug text-slate-700">{l.copy}</p>
                <ul className="mt-4 space-y-2.5">
                  {l.items.map((it) => (
                    <li key={it.name} className="border-t border-slate-100 pt-2.5 first:border-0 first:pt-0">
                      <p className="text-sm font-semibold text-slate-900">{it.name}</p>
                      <p className="text-[13px] text-slate-600">{it.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
              {i < LANES.length - 1 ? (
                <ArrowRight className="absolute top-1/2 -right-3.5 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-white text-orange-500 lg:block" aria-hidden="true" />
              ) : null}
            </Reveal>
          ))}
        </ol>
      </Block>

      {/* Roles */}
      <Block id="roles" tag="Who uses it" title="A different first screen for each role" lead="Everyone works from the same records; each role opens on what matters to them." tone="white">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.role} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-blue-900">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[15px] font-bold text-slate-900">{r.role}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{r.sees}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Around the work */}
      <Block id="around" tag="Around the work" title="Collaboration and support in the same place" lead="The team talks, meets and raises tickets without leaving the workspace.">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AROUND.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.title} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-blue-900">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                  <p className="text-[13px] text-slate-600">{a.copy}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Block>

      <ProductTail
        productKey="it"
        related={[
          relatedProduct("hrms", "Attendance, leave and payroll for the same people."),
          relatedProduct("staffing", "Requirements, candidates and deployments."),
          relatedProduct("ai", "Dashboards, reports and approvals."),
          relatedProduct("precision", "The same workspace on the shop floor."),
        ]}
        faq={faqItems(["Is Synax free for small manufacturers?", "How long does onboarding take?"], [
          {
            q: "Do people and attendance have to be entered again?",
            a: "No. Work & Delivery sits in the same workspace as Manufacturing ERP, HRMS and Staffing, so people, attendance and approvals are shared.",
          },
        ])}
      />
    </main>
  );
}
