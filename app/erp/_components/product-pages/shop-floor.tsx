import Image from "next/image";
import { CalendarRange, Cpu, Gauge, Hand, PlugZap, ScanLine, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { industryHref } from "../../_data/industries";
import { Block } from "../site-page";
import { HeroBand, HeroCopy, ModChips, ProductTail, faqItems, relatedProduct } from "./shared";

/** Shop Floor & Machine Monitoring — a floor plan hero with the copy card on top, three stacked layers and the connection options. */

const MACHINES: { name: string; state: "run" | "idle" | "alarm" | "manual"; pct: number; note: string }[] = [
  { name: "CNC 01", state: "run", pct: 82, note: "Running" },
  { name: "CNC 02", state: "run", pct: 64, note: "Running" },
  { name: "CNC 03", state: "idle", pct: 30, note: "Idle: waiting for material" },
  { name: "CNC 04", state: "run", pct: 90, note: "Running" },
  { name: "CNC 05", state: "alarm", pct: 12, note: "Alarm: needs a person" },
  { name: "CNC 06", state: "run", pct: 70, note: "Running" },
  { name: "Manual lathe", state: "manual", pct: 0, note: "Counts confirmed by the operator" },
  { name: "CNC 07", state: "run", pct: 55, note: "Running" },
  { name: "CNC 08", state: "run", pct: 76, note: "Running" },
];
const STATE_STYLE = {
  run: { ring: "border-slate-300", dot: "bg-blue-900", bar: "bg-blue-900/40" },
  idle: { ring: "border-slate-300", dot: "bg-slate-400", bar: "bg-slate-400" },
  alarm: { ring: "border-orange-300", dot: "bg-orange-300", bar: "bg-slate-400" },
  manual: { ring: "border-slate-300", dot: "bg-slate-300", bar: "bg-slate-300" },
};

const LAYERS: { n: string; title: string; tone: string; copy: string; modules: string[] }[] = [
  {
    n: "1",
    title: "Plan",
    tone: "border-t-blue-900",
    copy: "Load the machines and release each job against the BOM. Start a job by typing the route card number or scanning its barcode, so the right job reaches the right machine.",
    modules: ["Machine scheduling & load charts", "BOM and operation routing", "Route card released against the BOM", "Start by route card number or barcode scan"],
  },
  {
    n: "2",
    title: "Run",
    tone: "border-t-orange-600",
    copy: "Give the operator the job in front of them and capture what actually happened. Cycle counts are proposed, and the operator confirms them with a variance reason.",
    modules: ["Operator job cards", "Cycle counts proposed, operator confirms", "Production tracking"],
  },
  {
    n: "3",
    title: "Watch",
    tone: "border-t-emerald-600",
    copy: "See what every machine is doing and what it has been doing. Alarms and downtime reasons are on the board, and the machining record follows the part to the certificate.",
    modules: ["Live machine board", "Alarms and downtime reasons", "Machine utilization", "OEE per job", "Machining record on the COC"],
  },
];

const CONNECT: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: PlugZap, title: "OEM connection", copy: "CNC machines can connect through the manufacturer's own connection." },
  { icon: Server, title: "Open FOCAS", copy: "Machines that speak open FOCAS report their counts, alarms and downtime." },
  { icon: Hand, title: "No connection", copy: "Machines that cannot connect still work: operators confirm counts on the shop-floor screen." },
];

export function ShopFloorPage() {
  return (
    <main className="pb-6">
      {/* Hero: the photo runs off the right edge of the page and fades into the background, machine cards on top of it */}
      <HeroBand productKey="shopfloor">
        <div className="relative lg:flex lg:min-h-[28rem] lg:items-center">
          <div
            className="pointer-events-none absolute inset-y-0 right-[calc(50%-50vw)] left-[38%] hidden [mask-image:linear-gradient(to_right,transparent,#000_40%)] lg:block"
            aria-hidden="true"
          >
            <Image
              src="/images/products/shop-floor.webp"
              alt=""
              fill
              priority
              sizes="62vw"
              quality={75}
              className="object-cover object-[60%_50%]"
            />
          </div>

          <div className="relative z-10 max-w-xl lg:max-w-md">
            <HeroCopy
              productKey="shopfloor"
              compact
              eyebrow="Production execution"
              subtitle="The spindle reports the count"
              lead="Connect CNC machines and let real cycle counts, alarms and downtime drive production confirmation, with no separate MES or integrator. Schedule work onto machines, give operators the job in front of them, and see what every machine is doing."
            />
          </div>

          {/* Small screens: photo banner below the copy */}
          <div className="relative mt-6 h-52 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:hidden">
            <Image src="/images/products/shop-floor.webp" alt="A blue industrial robot arm working on a production line" fill sizes="100vw" quality={70} className="object-cover" />
          </div>

          <ul
            className="relative mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:absolute lg:top-8 lg:right-4 lg:mt-0 lg:block lg:w-60 lg:space-y-3 xl:right-10"
            aria-label="Live machine board (illustration)"
          >
            {MACHINES.filter((m) => ["CNC 04", "CNC 03", "CNC 05"].includes(m.name)).map((m) => {
              const s = STATE_STYLE[m.state];
              return (
                <li key={m.name} className={`rounded-xl border-2 bg-white p-3 shadow-lg ${s.ring}`}>
                  <p className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
                    <span className={`size-2.5 rounded-full ${s.dot} ${m.state === "alarm" ? "synax-prod-pulse" : ""}`} aria-hidden="true" />
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-tight text-slate-600">{m.note}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                    <div className={`h-1.5 rounded-full ${s.bar}`} style={{ width: `${m.pct}%` }} />
                  </div>
                </li>
              );
            })}
            <li className="px-1 text-[11px] text-slate-500 sm:col-span-3 lg:col-span-1">Live machine board: sample data.</li>
          </ul>
        </div>
      </HeroBand>

      {/* Three layers */}
      <Block
        id="layers"
        tag="Schedule to spindle"
        title="Plan, run, watch"
        lead="The same job moves from the plan, to the operator, to the machine's own record."
      >
        <ol className="mx-auto max-w-5xl space-y-4">
          {LAYERS.map((l) => (
            <li key={l.title} className={`grid gap-4 rounded-2xl border border-t-4 border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[170px_1fr] ${l.tone}`}>
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                <span className="flex size-10 items-center justify-center rounded-full bg-blue-900 font-mono text-sm font-semibold text-white">{l.n}</span>
                <h3 className="text-lg font-extrabold text-slate-900">{l.title}</h3>
              </div>
              <div>
                <p className="text-sm leading-relaxed text-slate-600">{l.copy}</p>
                <ModChips items={l.modules} className="mt-3" />
              </div>
            </li>
          ))}
        </ol>
      </Block>

      {/* Connect */}
      <Block
        id="connect"
        tag="Connect your machines"
        title="Connected or not, the job still gets confirmed"
        lead="No separate MES or integrator. Machines that can connect report for themselves; the rest are confirmed on the shop-floor screen."
        tone="white"
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {CONNECT.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.title} className="rounded-2xl border border-t-4 border-slate-200 border-t-emerald-600 bg-white p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.copy}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Before and after */}
      <Block
        id="record"
        tag="One machine record"
        title="The count comes from the machine, the record goes to the invoice"
        lead="Production confirmation, the certificate and the invoice all read the same machine record."
      >
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-slate-400 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <CalendarRange className="size-4 text-slate-400" aria-hidden="true" />
              Without it
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Counts are written on paper, typed in later and corrected at dispatch.</p>
          </div>
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-emerald-600 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Cpu className="size-4 text-emerald-600" aria-hidden="true" />
              With Synax
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Counts are proposed by the machine, confirmed by the operator and carried to the certificate of conformance.</p>
          </div>
        </div>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <ScanLine className="size-4 text-orange-600" aria-hidden="true" />
            Start jobs by route card number or barcode
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge className="size-4 text-orange-600" aria-hidden="true" />
            OEE per job
          </span>
        </p>
      </Block>

      <ProductTail
        productKey="shopfloor"
        related={[
          relatedProduct("precision", "Route cards, inspection, dispatch and invoicing."),
          relatedProduct("ai", "Shop-floor watch and quality compliance agents."),
          relatedProduct("hrms", "Operator attendance and overtime."),
          { label: "Aerospace & Defence", note: "AS9100D controls and certificates.", href: industryHref("aerospace-defence") },
        ]}
        faq={faqItems(["Which machines can Synax connect to?", "How long does onboarding take?"], [
          { q: "Can jobs be started by barcode?", a: "Yes. Start jobs by route card number or barcode scan." },
          { q: "Do we need a separate MES?", a: "No. Real cycle counts, alarms and downtime drive production confirmation, with no separate MES or integrator." },
        ])}
      />
    </main>
  );
}
