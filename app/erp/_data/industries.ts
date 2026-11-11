import type { ProductKey, RouteTone } from "./products";
import { LIVE_FLOW } from "./live";
import { WORKFLOW_STAGES } from "./content";

/**
 * Industry pages: /solutions/<slug>. One entry per item in the header's Industries menu.
 *
 * Every statement comes from the live portal (_data/live.ts), the product data (_data/products.ts) or
 * the earlier site copy that the portal also supports. Nothing about certifications or numbers is
 * added here. `faq` lists questions from LIVE_FAQ by their exact text.
 */

export interface FlowStep {
  title: string;
  copy: string;
  /** Optional chips, e.g. the modules used at this step. */
  chips?: string[];
}

export interface IndustryPage {
  slug: string;
  name: string;
  /** One line for menus and cards. */
  menu: string;
  tone: RouteTone;
  /** Which product's icon to use ("layers" is the generic one). */
  icon: ProductKey | "layers";
  tag: string;
  title: string;
  lead: string;
  whoFor: string;
  seoTitle: string;
  seoDescription: string;
  challenges: { title: string; text: string }[];
  flowTitle: string;
  flowLead: string;
  flow: FlowStep[];
  /** Products that deliver it, first = primary. */
  products: ProductKey[];
  /** Product whose module groups are shown. */
  modulesFrom: ProductKey;
  /** Group companies shown as proof (names as the portal lists them). */
  proof?: string[];
  faq: string[];
  demoName: string;
}

const Q_WHO = "Who is Synax built for?";
const Q_TALLY = "Do we have to move our accounts out of Tally?";
const Q_MACHINES = "Which machines can Synax connect to?";
const Q_GST = "Does Synax generate e-invoices and e-way bills?";
const Q_AI = "Can the AI change our data on its own?";
const Q_FREE = "Is Synax free for small manufacturers?";
const Q_ONBOARD = "How long does onboarding take?";

export const INDUSTRY_PAGES: IndustryPage[] = [
  {
    slug: "aerospace-defence",
    name: "Aerospace & Defence",
    menu: "AS9100D QMS controls, FAIR register & COC",
    tone: "navy",
    icon: "aerospace",
    tag: "Aerospace & Defence",
    title: "ERP for aerospace and defence suppliers",
    lead: "Built for aerospace, defence and automotive suppliers who machine customer-supplied material: AS9100D QMS controls at the quality checkpoints, a FAIR register and certificates of conformance in the same flow, and a record behind every part.",
    whoFor: "Aerospace, defence and automotive suppliers who machine customer-supplied material.",
    seoTitle: "ERP for Aerospace & Defence",
    seoDescription:
      "AS9100D QMS controls at workflow checkpoints, FAIR register, certificates of conformance and traceability for aerospace, defence and automotive suppliers.",
    challenges: [
      { title: "Audit evidence rebuilt after the fact", text: "Records are assembled by hand once the part has shipped, so every audit costs weeks of reassembly." },
      { title: "Paperwork kept apart from the job", text: "First-article reports, certificates and inspection records sit in separate files, away from the job that produced them." },
      { title: "Customer material that is hard to trace", text: "Customer-owned material has to be followed from challan to delivered part, by Material ID." },
      { title: "Checks that depend on memory", text: "When a check can be skipped, the evidence is missing on the day an auditor asks for it." },
    ],
    flowTitle: "Plan, execute, inspect, release",
    flowLead: "Hold the part at the gate until the check is recorded, then release against a complete record.",
    flow: WORKFLOW_STAGES.map((s) => ({ title: s.title, copy: s.copy, chips: s.modules })),
    products: ["precision", "shopfloor", "ai"],
    modulesFrom: "aerospace",
    faq: [Q_WHO, Q_MACHINES, Q_AI, Q_ONBOARD],
    demoName: "Aerospace & Defence",
  },
  {
    slug: "precision-cnc-machining",
    name: "Precision CNC Machining & Tooling",
    menu: "CNC machine data, route cards & job-work material",
    tone: "emerald",
    icon: "precision",
    tag: "Precision & Job-Work",
    title: "ERP for precision and job-work manufacturers",
    lead: "Your customer's material accounted to the last piece, CNC machines reporting counts straight to the route card, and the GST invoice following from the machine.",
    whoFor: "Precision and job-work manufacturers who machine customer-supplied material.",
    seoTitle: "ERP for Precision CNC Machining & Job-Work",
    seoDescription:
      "Customer material by challan and Material ID, route cards confirmed from the machine, inspection, COC, GST invoice and Tally in one flow.",
    challenges: [
      { title: "Customer material tracked on the side", text: "Customer-supplied material lives in a spreadsheet instead of being tied to the customer who owns it." },
      { title: "Quantities that do not reconcile", text: "Consumption, returns, scrap and invoiced quantities are hard to match against what came in." },
      { title: "Counts keyed in by hand", text: "Production confirmation depends on someone re-typing what the machine already knew." },
      { title: "Dispatch paperwork assembled at the end", text: "Packing, invoice, IRN and e-way bill are compiled separately, after the job is done." },
    ],
    flowTitle: "Spindle to invoice",
    flowLead: "Each document carries the one before it, so any part can be traced back to its PO, material lot, machine and operator.",
    flow: LIVE_FLOW,
    products: ["precision", "shopfloor", "ai"],
    modulesFrom: "precision",
    faq: [Q_MACHINES, Q_TALLY, Q_GST, Q_ONBOARD, Q_FREE],
    demoName: "Manufacturing ERP",
  },
  {
    slug: "it-services-staffing",
    name: "IT Services & Talent Staffing",
    menu: "Projects, SOWs, candidates & deployments",
    tone: "orange",
    icon: "staffing",
    tag: "IT Services & Staffing",
    title: "ERP for IT services and staffing teams",
    lead: "Run project delivery, SOWs and billing next to candidates, interviews and deployments, in one workspace.",
    whoFor: "IT services teams, staffing agencies and technical consulting networks managing customer requirements and deployments.",
    seoTitle: "ERP for IT Services & Talent Staffing",
    seoDescription:
      "Projects, SOWs, timesheets and billing with customer requirements, candidates, interviews, onboarding and deployments in one workspace.",
    challenges: [
      { title: "Weeks-long recruiting cycles", text: "Requirements, candidates and interviews live in different places, so each placement takes longer than it should." },
      { title: "Consultants idle on the bench", text: "Unbillable bench time is hard to see until the month is over." },
      { title: "Multi-vendor friction", text: "Communication with several vendors and customers happens outside the system of record." },
      { title: "Disputed timesheets and invoices", text: "Hours, work logs and costs are not tied to the project they belong to." },
    ],
    flowTitle: "From the customer's requirement to the invoice",
    flowLead: "One flow from the requirement to project billing, with approvals along the way.",
    flow: [
      { title: "Customer requirement", copy: "Capture what the customer needs, with SOWs and requirements tracked against the project." },
      { title: "Candidates & interviews", copy: "Manage candidates and run interviews against each requirement." },
      { title: "Offer & onboarding", copy: "Offers, approvals and onboarding in one flow." },
      { title: "Deployment", copy: "Deploy people to projects, with resource allocation and replacements." },
      { title: "Timesheets & work logs", copy: "Timesheets, work logs and development costs recorded against the project." },
      { title: "Billing & profitability", copy: "Project billing and a view of profitability." },
    ],
    products: ["it", "staffing", "hrms"],
    modulesFrom: "it",
    faq: [Q_ONBOARD, Q_AI],
    demoName: "Work & Delivery Management",
  },
  {
    slug: "automotive-heavy-industrial",
    name: "Automotive & Heavy Industrial",
    menu: "Customer material, route cards & GST dispatch",
    tone: "emerald",
    icon: "layers",
    tag: "Automotive & Heavy Industrial",
    title: "ERP for automotive and heavy-industrial suppliers",
    lead: "Built for suppliers who machine customer-supplied material, by a group that runs industrial operations itself.",
    whoFor: "Automotive and heavy-industrial suppliers who machine customer-supplied material.",
    seoTitle: "ERP for Automotive & Heavy Industrial Suppliers",
    seoDescription:
      "Customer material, route cards, machine-confirmed production, inspection, GST dispatch and Tally for automotive and heavy-industrial suppliers.",
    challenges: [
      { title: "Customer-owned material across many jobs", text: "Every challan, Material ID range and rejection has to stay tied to the customer who owns it." },
      { title: "Production status that lags the floor", text: "Counts, alarms and downtime reach the office late, or not at all." },
      { title: "Job-work returns compiled by hand", text: "Material balances, returns and scrap documents are rebuilt for the ITC-04 return each period." },
      { title: "Accounts in one tool, operations in another", text: "Purchase, stores, production and dispatch are re-keyed into the books." },
    ],
    flowTitle: "Spindle to invoice",
    flowLead: "Each document carries the one before it, so any part can be traced back to its PO, material lot, machine and operator.",
    flow: LIVE_FLOW,
    products: ["precision", "shopfloor", "hrms"],
    modulesFrom: "precision",
    proof: ["Senwell Exports", "Stacwell Rubber", "Stacem France", "Stacem Morocco"],
    faq: [Q_WHO, Q_TALLY, Q_GST, Q_ONBOARD],
    demoName: "Manufacturing ERP",
  },
  {
    slug: "plant-workforce-hcm",
    name: "Plant Workforce & Multi-Facility HCM",
    menu: "Attendance, payroll & shift break passes",
    tone: "navy",
    icon: "hrms",
    tag: "Workforce & HCM",
    title: "HRMS for plant workforces",
    lead: "Employee records, attendance, leave and work-from-home, payroll with approvals and department KPIs, in the same workspace as operations.",
    whoFor: "High-intensity industrial plants, multi-facility manufacturers and shift-based engineering teams.",
    seoTitle: "HRMS for Plant Workforces",
    seoDescription:
      "Employee records, attendance and leave, biometric device sync, overtime approvals, payroll with approvals and department KPIs for plants and shift-based teams.",
    challenges: [
      { title: "Buddy punching", text: "Attendance that depends on a card or a colleague cannot be trusted at payroll time." },
      { title: "Unaccounted break passes", text: "Operators away from active machining lines leave machines unattended." },
      { title: "Multi-day manual payroll", text: "Shift differentials, overtime and deductions are worked out by hand, then checked again." },
      { title: "Approvals on paper", text: "Overtime and attendance exceptions are signed off outside the system." },
    ],
    flowTitle: "From the first day to the payslip",
    flowLead: "One record per person, with attendance and approvals feeding payroll.",
    flow: [
      { title: "Employee record", copy: "One record per person, from recruitment to offboarding." },
      { title: "Attendance, leave & WFH", copy: "Attendance logs sync from biometric devices into attendance and leave." },
      { title: "Overtime approval", copy: "Overtime and attendance exceptions are approved in the workflow." },
      { title: "Payroll with approvals", copy: "Payroll is prepared and approved in the same workspace." },
      { title: "Department KPIs", copy: "See how each department is performing." },
    ],
    products: ["hrms", "shopfloor", "it"],
    modulesFrom: "hrms",
    faq: [Q_ONBOARD, Q_AI, Q_FREE],
    demoName: "HRMS",
  },
];

export function industryBySlug(slug: string): IndustryPage | undefined {
  return INDUSTRY_PAGES.find((i) => i.slug === slug);
}

export const industryHref = (slug: string) => `/solutions/${slug}`;
