import {
  AlertCircle,
  BarChart3,
  BadgeCheck,
  Boxes,
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck,
  Check,
  CircleCheck,
  ClipboardList,
  Coffee,
  Cpu,
  FileBarChart,
  FileText,
  Fingerprint,
  Hand,
  Headset,
  Layers,
  LayoutDashboard,
  LineChart,
  Lock,
  MessagesSquare,
  Package,
  PackageCheck,
  Phone,
  PlugZap,
  RefreshCw,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  Timer,
  Trash2,
  Truck,
  Undo2,
  UserCheck,
  Users,
  UsersRound,
  Video,
  Wallet,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PRODUCT_DATA, routeFor, type ProductKey } from "./products";
import { INDUSTRY_PAGES, type IndustryPage } from "./industries";
import { BENCHMARK } from "./benchmark";
import { LIVE_PILLARS, LIVE_POSITIONING, LIVE_SECURITY } from "./live";
import LINES from "./tour-lines.json";
import DURATIONS from "./tour-durations.json";

/**
 * The narrated explainer videos played by the Watch overview button (see tour-player.tsx), keyed by the tour
 * title the button passes ("Synax Platform Overview", "<product name> Tour"). Captions (= the spoken words) live in
 * tour-lines.json, the audio in /public/audio, and the measured audio length of each scene in tour-durations.json;
 * only the pictures are described here. A title without an entry keeps the "tour is being prepared" message.
 */

export type TourScene =
  | { kind: "intro"; pre?: string[]; head: string; accent: string; sub?: string }
  | { kind: "tiles"; head: string; accent: string; items: { Icon: LucideIcon; label: string; note?: string }[]; cols?: 3 | 4 }
  | { kind: "steps"; head: string; accent: string; items: { t: string; n: string }[]; cols?: 3 | 4; approve?: boolean }
  | { kind: "bars"; head: string; accent: string; items: { t: string; n: string; pct: number; alarm?: boolean }[]; note?: string }
  | { kind: "flow"; head: string; accent: string; items: { Icon: LucideIcon; label: string }[] }
  | { kind: "feature"; Icon: LucideIcon; kicker: string; title: string; points: string[] }
  | { kind: "compare"; head: string; accent: string; left: string; right: string; rows: { t: string; a: string; b: string }[] }
  | { kind: "stats"; head: string; accent: string; items: { value: string; label: string }[] }
  | { kind: "cta" };

export interface Tour {
  slug: string;
  /** Folder of scene-1.mp3 … scene-N.mp3. */
  audioDir: string;
  scenes: TourScene[];
  captions: string[];
  /** Seconds per scene (the audio length), used as the fallback timer. */
  durations: number[];
  /** Small label shown top right of the video. */
  tag?: string;
}

const LINE_MAP = LINES as Record<string, string[]>;
const DUR_MAP = DURATIONS as Record<string, number[]>;

function tour(slug: string, audioDir: string, scenes: TourScene[], tag?: string): Tour {
  const captions = LINE_MAP[slug] ?? [];
  if (captions.length !== scenes.length) throw new Error(`tour ${slug}: ${captions.length} captions for ${scenes.length} scenes`);
  return { slug, audioDir, scenes, captions, durations: DUR_MAP[slug] ?? scenes.map(() => 10), tag };
}

const GATE = [
  { t: "1 Ask", n: "Which challans are overdue?" },
  { t: "2 Agent finds", n: "2 are past their return date" },
  { t: "3 Agent proposes", n: "Draft reminders" },
  { t: "4 You approve", n: "Only then does anything change" },
];

const MACHINES = [
  { t: "CNC 01", n: "Running", pct: 82 },
  { t: "CNC 03", n: "Idle: waiting for material", pct: 30 },
  { t: "CNC 05", n: "Alarm: needs a person", pct: 12, alarm: true },
];

const CTA: TourScene = { kind: "cta" };

const PRODUCT_KEYS: ProductKey[] = ["precision", "it", "hrms", "staffing", "shopfloor", "ai"];

const overview = tour("overview", "/audio/overview", [
  { kind: "intro", pre: ["Spreadsheets", "Paper registers", "Five separate tools"], head: "Meet ", accent: "Synax", sub: "by Senwell Group" },
  { kind: "tiles", head: "Six products, ", accent: "one platform", items: PRODUCT_KEYS.map((k) => ({ Icon: PRODUCT_DATA[k].icon, label: routeFor(k).name })) },
  {
    kind: "steps",
    head: "Spindle to invoice, ",
    accent: "one record",
    items: [
      { t: "RFQ and customer PO", n: "Quotes and revisions" },
      { t: "Gate entry and GRN", n: "Inward and inspection" },
      { t: "Route card", n: "Released against the BOM" },
      { t: "Machine-confirmed", n: "Counts and buy-offs" },
      { t: "Inspection and COC", n: "FAIR and certificate" },
      { t: "Invoice and dispatch", n: "IRN and e-way bill" },
    ],
  },
  { kind: "bars", head: "The spindle ", accent: "reports the count", items: MACHINES, note: "Illustration" },
  {
    kind: "flow",
    head: "Your accounts ",
    accent: "stay in Tally",
    items: [
      { Icon: BookOpen, label: "Accounting vouchers" },
      { Icon: FileText, label: "GST invoice" },
      { Icon: Truck, label: "IRN and e-way bill" },
    ],
  },
  { kind: "steps", head: "AI that proposes. ", accent: "You approve.", items: GATE, approve: true, cols: 4 },
  CTA,
]);

const manufacturing = tour("manufacturing-erp", "/audio/tours/manufacturing-erp", [
  { kind: "intro", head: "Manufacturing ERP", accent: " from spindle to GST invoice", sub: "Precision and job-work machine shops" },
  {
    kind: "steps",
    head: "One part, ",
    accent: "one passport",
    items: [
      { t: "Customer PO line", n: "Quote and revision" },
      { t: "Material lot", n: "Material ID range" },
      { t: "Route card", n: "Released against the BOM" },
      { t: "Machine and operator", n: "Cycle count, buy-off" },
      { t: "COC", n: "Carries the machining record" },
      { t: "Invoice", n: "IRN and e-way bill" },
    ],
  },
  {
    kind: "tiles",
    head: "Customer material, ",
    accent: "accounted for",
    items: [
      { Icon: BookOpen, label: "Inward challan", note: "Material ID ranges" },
      { Icon: Settings2, label: "Issued to production", note: "Against the route card" },
      { Icon: Check, label: "Consumed 1:1", note: "Against every invoiced part" },
      { Icon: Undo2, label: "Returned", note: "With their documents" },
      { Icon: Trash2, label: "Scrap", note: "Tied to the customer" },
    ],
  },
  {
    kind: "steps",
    head: "Machine-confirmed ",
    accent: "production",
    cols: 4,
    items: [
      { t: "Start the job", n: "Route card number or barcode scan" },
      { t: "Counts proposed", n: "From the machine's cycle count" },
      { t: "Operator confirms", n: "With a variance reason" },
      { t: "Buy-offs", n: "Recorded at each stage" },
    ],
  },
  {
    kind: "flow",
    head: "One flow, ",
    accent: "your books stay in Tally",
    items: [
      { Icon: Package, label: "Packing" },
      { Icon: FileText, label: "GST invoice and IRN" },
      { Icon: Truck, label: "E-way bill" },
      { Icon: BookOpen, label: "Tally vouchers" },
    ],
  },
  CTA,
]);

const workDelivery = tour("work-delivery", "/audio/tours/work-delivery", [
  { kind: "intro", head: "Work and Delivery", accent: " Management", sub: "Plan the work, track the hours, bill what you deliver" },
  {
    kind: "steps",
    head: "One path from ",
    accent: "a task to a bill",
    items: [
      { t: "The day's work", n: "Tasks, owners, progress, blockers" },
      { t: "Projects", n: "Requirements and the SOW behind them" },
      { t: "Hours to billing", n: "Timesheets, costs, profitability" },
    ],
  },
  {
    kind: "tiles",
    head: "Each role sees ",
    accent: "what it needs",
    cols: 4,
    items: [
      { Icon: BriefcaseBusiness, label: "Project manager", note: "PM dashboard" },
      { Icon: UserCheck, label: "Project coordinator", note: "PC dashboard" },
      { Icon: ClipboardList, label: "Team member", note: "Work tracker, timesheet" },
      { Icon: Wallet, label: "Finance", note: "Billing tracker, budget planner" },
    ],
  },
  {
    kind: "tiles",
    head: "Around ",
    accent: "the work",
    items: [
      { Icon: MessagesSquare, label: "Team chat" },
      { Icon: Phone, label: "Audio and video calls" },
      { Icon: Video, label: "Public and private meetings" },
      { Icon: Headset, label: "Support tickets" },
      { Icon: UsersRound, label: "Visitor management" },
      { Icon: LayoutDashboard, label: "Department performance" },
    ],
  },
  CTA,
]);

const hrms = tour("hrms", "/audio/tours/hrms", [
  { kind: "intro", head: "HRMS", accent: " from hire to payslip", sub: "Records, attendance, leave and payroll with approvals" },
  {
    kind: "steps",
    head: "The employee ",
    accent: "lifecycle",
    items: [
      { t: "Hire", n: "Straight into an employee record" },
      { t: "Onboard", n: "One record from day one" },
      { t: "Attend", n: "Biometric sync, leave, WFH" },
      { t: "Approve", n: "Attendance and overtime" },
      { t: "Pay", n: "Payroll with approvals" },
      { t: "Grow and exit", n: "KPIs and offboarding" },
    ],
  },
  {
    kind: "tiles",
    head: "Attendance you ",
    accent: "can trust",
    cols: 4,
    items: [
      { Icon: Fingerprint, label: "Biometric sync", note: "Logs flow into attendance" },
      { Icon: CalendarCheck, label: "Attendance, leave, WFH", note: "One flow" },
      { Icon: Coffee, label: "Break passes", note: "Managed alongside" },
      { Icon: CircleCheck, label: "Overtime approval", note: "Before payroll" },
    ],
  },
  {
    kind: "flow",
    head: "From approved data, ",
    accent: "to payroll",
    items: [
      { Icon: CircleCheck, label: "Approved attendance" },
      { Icon: Wallet, label: "Payroll with approvals" },
      { Icon: BarChart3, label: "Department KPIs" },
    ],
  },
  CTA,
]);

const staffing = tour("staffing", "/audio/tours/staffing", [
  { kind: "intro", head: "Staffing and", accent: " Resource Management", sub: "Source, deploy and manage customer requirements" },
  {
    kind: "steps",
    head: "From requirement ",
    accent: "to deployment",
    items: [
      { t: "Customer requirement", n: "Role, skills, headcount" },
      { t: "Candidates", n: "Linked to the requirement" },
      { t: "Interviews", n: "Rounds and feedback" },
      { t: "Offer", n: "Approval before it goes out" },
      { t: "Onboarding", n: "Accepted offer to day one" },
      { t: "Deployment", n: "See who is where" },
    ],
  },
  {
    kind: "bars",
    head: "Every candidate, ",
    accent: "tracked",
    items: [
      { t: "Candidate A", n: "Interview", pct: 40 },
      { t: "Candidate B", n: "Offer", pct: 70 },
      { t: "Candidate C", n: "Deployed", pct: 100 },
    ],
    note: "Illustration: sample candidates",
  },
  {
    kind: "tiles",
    head: "After ",
    accent: "the placement",
    items: [
      { Icon: Users, label: "Resource performance", note: "Against what the customer expected" },
      { Icon: RefreshCw, label: "Replacements", note: "History of the requirement kept" },
      { Icon: Timer, label: "Timesheets and billing", note: "Bill the hours delivered" },
    ],
  },
  CTA,
]);

const shopFloor = tour("shop-floor", "/audio/tours/shop-floor", [
  { kind: "intro", head: "Shop Floor &", accent: " Machine Monitoring", sub: "The spindle reports the count" },
  {
    kind: "steps",
    head: "Plan, run, ",
    accent: "watch",
    items: [
      { t: "Plan", n: "Load machines, release jobs against the BOM" },
      { t: "Run", n: "Operator job cards, counts confirmed" },
      { t: "Watch", n: "Live board, alarms and downtime" },
    ],
  },
  {
    kind: "tiles",
    head: "Three ways to ",
    accent: "connect a machine",
    items: [
      { Icon: PlugZap, label: "OEM connection", note: "The manufacturer's own" },
      { Icon: Server, label: "Open FOCAS", note: "Counts, alarms, downtime" },
      { Icon: Hand, label: "No connection", note: "Operators confirm counts" },
    ],
  },
  { kind: "bars", head: "The live ", accent: "machine board", items: MACHINES, note: "Illustration" },
  CTA,
]);

const aiBi = tour("ai-bi", "/audio/tours/ai-bi", [
  { kind: "intro", head: "AI & Business", accent: " Intelligence", sub: "Finds the exception, proposes the fix. You approve." },
  { kind: "steps", head: "AI that proposes. ", accent: "You approve.", items: GATE, approve: true, cols: 4 },
  {
    kind: "tiles",
    head: "Agents that ",
    accent: "watch for you",
    items: [
      { Icon: ClipboardList, label: "Challan reconciliation" },
      { Icon: Sparkles, label: "Overdue chasers" },
      { Icon: Truck, label: "Dispatch readiness" },
      { Icon: Wallet, label: "Receivables follow-up" },
      { Icon: ShieldCheck, label: "Quality compliance" },
      { Icon: Wrench, label: "Shop-floor watch" },
    ],
  },
  {
    kind: "tiles",
    head: "Dashboards on ",
    accent: "current data",
    cols: 4,
    items: [
      { Icon: LayoutDashboard, label: "Business dashboards" },
      { Icon: LineChart, label: "Operational analytics" },
      { Icon: FileBarChart, label: "Reports across workflows" },
      { Icon: BarChart3, label: "Performance insights" },
    ],
  },
  CTA,
]);


/* -------------------------------------------------------------------------- */
/* Industry tours: scenes are derived from the industry page's own data        */
/* -------------------------------------------------------------------------- */

const GROUP_ICONS: LucideIcon[] = [ClipboardList, Boxes, ShieldCheck];

/** A short note for a flow step: its first module chip, or the first sentence of its copy, trimmed. */
function shortNote(copy: string, chip?: string) {
  if (chip) return chip;
  const first = copy.split(/(?<=.)s/)[0].replace(/.$/, "");
  return first.length > 56 ? first.slice(0, first.lastIndexOf(" ", 56)) + "…" : first;
}

function industryTour(page: IndustryPage): Tour {
  const groups = PRODUCT_DATA[page.modulesFrom].moduleSection?.groups ?? [];
  const flowCols = page.flow.length === 4 ? 4 : 3;
  return tour(page.slug, `/audio/tours/${page.slug}`, [
    { kind: "intro", head: "", accent: page.name, sub: page.title },
    { kind: "tiles", head: "What gets in the way ", accent: "today", cols: 4, items: page.challenges.map((c) => ({ Icon: AlertCircle, label: c.title })) },
    {
      kind: "steps",
      head: "How Synax ",
      accent: "answers it",
      cols: flowCols,
      items: page.flow.map((f) => ({ t: f.title, n: shortNote(f.copy, f.chips?.[0]) })),
    },
    {
      kind: "tiles",
      head: "The modules ",
      accent: "behind it",
      items: groups.map((g, i) => ({ Icon: GROUP_ICONS[i % GROUP_ICONS.length], label: g.title, note: `${g.items.length} modules` })),
    },
    {
      kind: "tiles",
      head: "Delivered by ",
      accent: "these products",
      items: page.products.map((k, i) => ({ Icon: PRODUCT_DATA[k].icon, label: routeFor(k).name, note: i === 0 ? "Start here" : "Add when you are ready" })),
    },
    CTA,
  ]);
}


const PILLAR_ICONS: LucideIcon[] = [PackageCheck, Cpu, Sparkles];
const SECURITY_ICONS: LucideIcon[] = [Layers, ShieldCheck, BadgeCheck, Lock];
const SECURITY_NOTES = ["Every company in its own tenant", "Validated on the server", "Who changed what, and when", "Roles and two-step sign-in"];

const whySynax = tour(
  "why-synax",
  "/audio/tours/why-synax",
  [
    { kind: "intro", pre: ["A separate MES", "Evidence rebuilt by hand", "Re-keying into Tally"], head: "Why ", accent: "Synax", sub: LIVE_POSITIONING.headline },
    ...LIVE_PILLARS.map((p, i): TourScene => ({ kind: "feature", Icon: PILLAR_ICONS[i], kicker: p.kicker, title: p.title, points: [...p.points] })),
    {
      kind: "compare",
      head: "How Synax ",
      accent: "compares",
      left: "Typical alternatives",
      right: "Synax",
      rows: BENCHMARK.map((r) => ({ t: r.title, a: r.legacy, b: r.synax })),
    },
    {
      kind: "stats",
      head: "Built in India, ",
      accent: "for Indian shop floors",
      items: [
        { value: "Free", label: "for SMEs under 50 employees" },
        { value: "Tally", label: "vouchers bridge across" },
        { value: "GST", label: "e-invoice and e-way bill" },
        { value: "AS9100D", label: "QMS controls at checkpoints" },
      ],
    },
    {
      kind: "tiles",
      head: "Audit-ready ",
      accent: "by design, not by report",
      cols: 4,
      items: LIVE_SECURITY.map((s, i) => ({ Icon: SECURITY_ICONS[i], label: s.title, note: SECURITY_NOTES[i] })),
    },
    CTA,
  ],
  "Why Synax",
);

/** Tour title (as passed to the Watch overview button) -> its video. */
export const TOURS: Record<string, Tour> = {
  "Synax Platform Overview": overview,
  "Why Synax": whySynax,
  [`${routeFor("precision").name} Tour`]: manufacturing,
  [`${routeFor("it").name} Tour`]: workDelivery,
  [`${routeFor("hrms").name} Tour`]: hrms,
  [`${routeFor("staffing").name} Tour`]: staffing,
  [`${routeFor("shopfloor").name} Tour`]: shopFloor,
  [`${routeFor("ai").name} Tour`]: aiBi,
  ...Object.fromEntries(INDUSTRY_PAGES.map((p) => [`${p.name} Tour`, industryTour(p)])),
};
