import { BarChart3, CalendarCheck, CircleCheck, Factory, Fingerprint, LogOut, UserPlus, UserRoundCheck, Wallet, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SOLUTION_PATHS } from "../../_data/solution-paths";
import { industryHref } from "../../_data/industries";
import { Block } from "../site-page";
import { Reveal } from "../reveal";
import { HeroBand, HeroCopy, ModChips, ProductTail, StartPath, faqItems, relatedProduct } from "./shared";

/** HRMS — a month of attendance in the hero, a six-stage lifecycle, a monthly cycle and a plant/office split. */

type Day = "p" | "l" | "w" | "o" | "-";
/** A sample month (Monday first). p present, l leave, w work from home, o overtime, - weekend. */
const MONTH: Day[] = "ppppp--ppwpp--pppop--ppplp--pwppp--".split("") as Day[];
const DAY_STYLE: Record<Day, string> = {
  p: "bg-blue-900",
  l: "bg-amber-300",
  w: "bg-blue-900/40",
  o: "bg-orange-300",
  "-": "bg-slate-200",
};
const LEGEND: { key: Day; label: string }[] = [
  { key: "p", label: "Present" },
  { key: "l", label: "Leave" },
  { key: "w", label: "Work from home" },
  { key: "o", label: "Overtime" },
];

const LIFECYCLE: { icon: LucideIcon; title: string; copy: string; modules: string[] }[] = [
  {
    icon: UserPlus,
    title: "Hire",
    copy: "Recruitment and interviews run in the same place, and the chosen candidate moves straight into an employee record.",
    modules: ["Recruitment and interviews"],
  },
  {
    icon: UserRoundCheck,
    title: "Onboard",
    copy: "One record per person from day one, with employee self-service so staff can see and update their own details.",
    modules: ["Employee records", "Employee self-service"],
  },
  {
    icon: CalendarCheck,
    title: "Attend",
    copy: "Attendance, leave and work-from-home in one flow. Biometric devices sync the logs, and break passes are managed alongside.",
    modules: ["Attendance, leave & WFH", "Biometric device sync", "Break pass management"],
  },
  {
    icon: CircleCheck,
    title: "Approve",
    copy: "Attendance and overtime are approved before they reach payroll, so payroll starts from data that has been checked.",
    modules: ["Attendance & OT approval"],
  },
  {
    icon: Wallet,
    title: "Pay",
    copy: "Payroll runs with approvals, in the same workspace as attendance and operations, with an audit trail on every posting.",
    modules: ["Payroll with approvals"],
  },
  {
    icon: LogOut,
    title: "Grow and exit",
    copy: "Department KPIs and performance management show how teams are doing, and offboarding closes the person's record.",
    modules: ["Department KPIs", "Performance management", "Offboarding", "Budget planner"],
  },
];

const MONTHLY = [
  "Biometric logs sync",
  "Leave and WFH approved",
  "Overtime approved",
  "Payroll run with approval",
  "Department KPIs reviewed",
];

export function HrmsPage() {
  return (
    <main className="pb-6">
      {/* Hero: centred copy over a month of attendance */}
      <HeroBand productKey="hrms">
        <HeroCopy
          productKey="hrms"
          center
          eyebrow="Employee lifecycle, attendance & payroll"
          subtitle="Employee operations and workforce administration"
          lead="Run employee records, attendance, leave and work-from-home, and payroll with approvals in the same workspace as operations. Attendance logs and overtime approvals sync from biometric devices."
        />
        <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <p className="font-bold text-slate-900">A month of attendance</p>
            <p>Sample data</p>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-slate-500" aria-hidden="true">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5" role="img" aria-label="Sample month of attendance: present, leave, work from home and overtime days">
            {MONTH.map((d, i) => (
              <span key={i} className={`aspect-square rounded-md ${DAY_STYLE[d]}`} />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600" aria-label="Legend">
            {LEGEND.map((l) => (
              <li key={l.key} className="flex items-center gap-1.5">
                <span className={`size-2.5 rounded-sm ${DAY_STYLE[l.key]}`} aria-hidden="true" />
                {l.label}
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "Biometric sync", orange: false },
              { label: "Overtime approval", orange: false },
              { label: "Payroll with approval", orange: true },
            ].map((p) => (
              <li key={p.label} className={`rounded-full px-3 py-1 text-xs font-semibold ${p.orange ? "bg-orange-300 text-orange-950" : "bg-blue-900 text-white"}`}>
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      </HeroBand>

      {/* Lifecycle */}
      <Block
        id="lifecycle"
        tag="Employee lifecycle"
        title="One record per person, from hire to exit"
        lead="Every stage reads from the same employee record, so nothing is typed twice."
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LIFECYCLE.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} as="li" delay={(i % 3) * 70} className="flex">
                <div className="flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-blue-900">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold tracking-wider text-orange-700 uppercase">Stage {i + 1}</p>
                      <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{s.copy}</p>
                  <ModChips items={s.modules} className="mt-4" />
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Block>

      {/* Monthly cycle */}
      <Block
        id="month"
        tag="Every month"
        title="What a payroll month looks like in Synax"
        lead="Attendance, leave and overtime are approved first, so payroll starts from checked data."
        tone="white"
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {MONTHLY.map((m, i) => (
            <li key={m} className={`rounded-2xl border border-t-4 border-slate-200 bg-white p-4 shadow-sm ${i === 3 ? "border-t-orange-600" : "border-t-blue-900"}`}>
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Step {i + 1}</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{m}</p>
            </li>
          ))}
        </ol>
      </Block>

      {/* Plant and office */}
      <Block
        id="plant-office"
        tag="Standalone or integrated"
        title="Use it alone, or alongside operations"
        lead="HRMS runs on its own, or in the same workspace as Manufacturing ERP and Work & Delivery, so people data meets production and projects."
      >
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-blue-900">
              <Factory className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-900">On the shop floor</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Biometric attendance, overtime approval and break pass management for plant workers.</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-900">
              <Fingerprint className="size-4" aria-hidden="true" />
              See the{" "}
              <a href={industryHref("plant-workforce-hcm")} className="underline">
                Plant Workforce page
              </a>
            </p>
          </div>
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-white p-5 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-700">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-900">In the office</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Daily Work Management, the budget planner and department performance for teams.</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-orange-700">
              <BarChart3 className="size-4" aria-hidden="true" />
              Department KPIs and performance management
            </p>
          </div>
        </div>
      </Block>

      <StartPath path={SOLUTION_PATHS.hrms} />

      <ProductTail
        productKey="hrms"
        related={[
          relatedProduct("precision", "Plant attendance meets production."),
          relatedProduct("it", "Projects, timesheets and billing."),
          relatedProduct("staffing", "Candidates, offers and deployments."),
          { label: "Plant Workforce & HCM", note: "The industry page for plants.", href: industryHref("plant-workforce-hcm") },
        ]}
        faq={faqItems(["Is Synax free for small manufacturers?", "How long does onboarding take?"], [
          { q: "Does attendance connect to biometric devices?", a: "Yes. Attendance logs and overtime approvals sync from biometric devices." },
          { q: "Is payroll approved before it is posted?", a: "Payroll runs with approvals, and an audit trail is kept on every posting." },
        ])}
      />
    </main>
  );
}
