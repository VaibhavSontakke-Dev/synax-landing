import { hrefFor, type ProductKey, type RouteTone } from "./products";
import { industryHref } from "./industries";

/**
 * Solutions, seen three ways: the industries our customers serve, how they manufacture, and the business need
 * in front of them. The home page section ("Sector & Challenge Alignment") and the /solutions page read the same
 * copy. Plain data (no icons), so server pages can import it; icons live in _components/solution-icons.ts.
 *
 * Every statement comes from features the site already describes (products.ts, live.ts, industries.ts); no
 * certifications or numbers are added. Rubber & Polymer Moulding is described only by the Manufacturing ERP flow
 * (orders, customer material, route cards, inspection, job-work records, dispatch): Synax does not manage
 * compound recipes or press cure parameters, so the copy does not suggest it.
 */

export type SolutionKey =
  | "aerospace"
  | "energy"
  | "machinery"
  | "services"
  | "precision"
  | "rubber"
  | "workforce"
  | "staffing";

export type SolutionGroup = "industry" | "process" | "need";

/** An entry's starting-path card on /solutions, for entries without a page of their own. */
const startHref = (key: SolutionKey) => `/solutions#start-${key}`;

export const SOLUTION_GROUPS: { id: SolutionGroup; label: string; lead: string }[] = [
  { id: "industry", label: "Industries we serve", lead: "The markets our customers supply." },
  { id: "process", label: "How you manufacture", lead: "The way the work is done on your floor." },
  { id: "need", label: "Business needs", lead: "The problem in front of you, in any sector." },
];

export const groupLabel = (id: SolutionGroup) => SOLUTION_GROUPS.find((g) => g.id === id)?.label ?? id;

export interface Solution {
  key: SolutionKey;
  group: SolutionGroup;
  title: string;
  short: string;
  tag: string;
  description: string;
  challenge: string;
  solution: string;
  capabilities: string[];
  /** The product that delivers it ("Powered by"). */
  product: ProductKey;
  tone: RouteTone;
  /**
   * Where "Explore" and the Solutions menu go: the entry's own page (an industry page, or the product page for
   * Staffing), otherwise its starting path on /solutions (`/solutions#start-<key>`).
   */
  href: string;
  /** Other solutions that usually go with this one, across the three groups. */
  related: SolutionKey[];
  /** Must be one of the demo form's product options (see demo-provider.tsx). */
  demoName: string;
}

export const SOLUTIONS: Solution[] = [
  /* ---------------------------------------------------------------- Industries we serve */
  {
    key: "aerospace",
    group: "industry",
    title: "Aerospace & Defence",
    short: "AS9100D quality controls",
    tag: "AS9100D QMS controls",
    description: "Built for aerospace and defence suppliers who machine customer-supplied material.",
    challenge:
      "Audit evidence assembled by hand after the part has shipped, first-article reports and certificates kept in separate files, and customer-owned material that is hard to trace to a delivered part.",
    solution:
      "AS9100D QMS controls attached at critical workflow checkpoints, a FAIR register and certificate of conformance in the same flow, material genealogy from entry to dispatch, and role-based access to drawings and records.",
    capabilities: [
      "FAIR Register & First Article Records",
      "Certificate of Conformance with the Machining Record",
      "Material Entry Audit & Genealogy Trace",
      "NCR / CAPA Quality Gateways",
    ],
    product: "precision",
    tone: "navy",
    href: industryHref("aerospace-defence"),
    related: ["precision", "rubber", "workforce"],
    demoName: "Aerospace & Defence",
  },
  {
    key: "energy",
    group: "industry",
    title: "Oil, Gas & Energy",
    short: "Traceable parts for critical service",
    tag: "Traceability & quality records",
    description:
      "For suppliers of machined and moulded parts to oil, gas, power and energy customers, where every part has to trace back to its material and its inspection.",
    challenge:
      "Material lots, inspection results and certificates are kept apart from the job, so proving where a delivered part came from means searching files after it has shipped.",
    solution:
      "Customer material tracked by challan and Material ID, receiving and final inspection with stage buy-offs, NCR and CAPA when a check fails, and a certificate of conformance issued from the same record.",
    capabilities: [
      "Material Genealogy from Receipt to Dispatch",
      "Receiving, Stage & Final Inspection",
      "NCR / CAPA Quality Gateways",
      "Certificate of Conformance with the Record",
    ],
    product: "precision",
    tone: "emerald",
    href: industryHref("oil-gas-energy"),
    related: ["precision", "rubber", "workforce"],
    demoName: "Manufacturing ERP",
  },
  {
    key: "machinery",
    group: "industry",
    title: "Industrial Machinery & Equipment",
    short: "BOMs, routings & machine load",
    tag: "Engineered equipment",
    description:
      "For makers of pumps, valves, compressors, gearboxes and other equipment, and for the suppliers who machine their parts.",
    challenge:
      "Bills of material, routings and machine load are planned in spreadsheets, production status reaches the office late, and stores, production and dispatch are re-keyed into the books.",
    solution:
      "Part masters and BOMs, operation routings and route cards released against them, machine scheduling with live counts and downtime, then packing, the GST invoice and the Tally bridge in one flow.",
    capabilities: [
      "Part Master, BOM & Operation Routing",
      "Machine Scheduling & Load Charts",
      "Live Machine Board, Alarms & Downtime",
      "GST Dispatch & Tally Voucher Bridge",
    ],
    product: "precision",
    tone: "emerald",
    href: industryHref("industrial-machinery-equipment"),
    related: ["precision", "rubber", "workforce"],
    demoName: "Manufacturing ERP",
  },
  {
    key: "services",
    group: "industry",
    title: "IT Services & Consulting",
    short: "Projects, timesheets & billing",
    tag: "Services delivery",
    description: "For IT services firms and technical consultancies that deliver projects and place people with clients.",
    challenge:
      "Hours, work logs and costs are not tied to the project they belong to, unbillable bench time shows up only at month end, and client communication happens outside the system of record.",
    solution:
      "The Work Tracker and projects, timesheets and work logs against each project, project billing with a view of profitability, and client requirements and deployments in the same workspace.",
    capabilities: [
      "Work Tracker & Project Dashboards",
      "Timesheets, Work Logs & Development Costs",
      "Project Billing Tracker & Budget Planner",
      "Support Tickets & Team Collaboration",
    ],
    product: "it",
    tone: "navy",
    href: industryHref("it-services-staffing"),
    related: ["staffing", "workforce"],
    demoName: "Work & Delivery Management",
  },

  /* ---------------------------------------------------------------- How you manufacture */
  {
    key: "precision",
    group: "process",
    title: "Precision CNC Machining & Job Work",
    short: "Customer material to invoice",
    tag: "Precision & job work",
    description:
      "Track customer-supplied material by challan, PO line, and material ID, then carry each job through route-card operations, machine-confirmed quantities, inspection, and dispatch.",
    challenge:
      "Customer-owned material, production status, inspection records, and dispatch paperwork often sit in separate sheets, making consumption and invoiced quantities difficult to reconcile.",
    solution:
      "Link customer POs and material challans to route cards, machine-reported counts with operator-approved variances, stage buy-offs, COC records, and GST dispatch, with vouchers bridged to Tally.",
    capabilities: [
      "Customer Challans, PO Lines & Material IDs",
      "Machine Counts, Alarms & Operator Variance Sign-Off",
      "Route Cards, Stage Buy-Offs & COC Records",
      "GST Dispatch Documents & Tally Voucher Bridge",
    ],
    product: "precision",
    tone: "emerald",
    href: industryHref("precision-cnc-machining"),
    related: ["aerospace", "energy", "machinery"],
    demoName: "Manufacturing ERP",
  },
  {
    key: "rubber",
    group: "process",
    title: "Rubber & Polymer Moulding",
    short: "Job work, lots & inspection",
    tag: "Moulded parts",
    description:
      "For moulders of seals, gaskets, hoses and other rubber and polymer parts who work to customer POs and, often, customer-supplied material.",
    challenge:
      "Customer POs, material received on challan, production lots, rejections and dispatch are kept in separate registers, so material balances and job-work returns are rebuilt by hand each period.",
    solution:
      "The same Manufacturing ERP flow: customer POs and challans, a route card for each job, receiving and final inspection, rejections recorded against the job, and ITC-04 job-work records with GST dispatch.",
    capabilities: [
      "Customer POs, Challans & Material IDs",
      "Route Cards & Production Tracking",
      "Receiving & Final Inspection",
      "ITC-04 Job-Work Records & GST Dispatch",
    ],
    product: "precision",
    tone: "emerald",
    href: startHref("rubber"),
    related: ["energy", "machinery", "aerospace"],
    demoName: "Manufacturing ERP",
  },

  /* ---------------------------------------------------------------- Business needs */
  {
    key: "workforce",
    group: "need",
    title: "Plant Workforce & HR",
    short: "Attendance, shifts & payroll",
    tag: "Workforce & HCM",
    description:
      "Designed for high-intensity industrial plants, multi-facility manufacturing enterprises, and shift-based engineering teams.",
    challenge:
      "Buddy punching, unaccounted plant floor break passes leaving active machining lines unattended, and multi-day manual payroll calculations with complex shift differential and tax errors.",
    solution:
      "Attendance, leave and work-from-home with overtime approvals, biometric device sync, payroll with approvals, and department KPIs, in the same workspace as operations.",
    capabilities: [
      "Employee Records & Lifecycle",
      "Attendance, Leave & WFH",
      "Biometric Attendance Sync & OT Approvals",
      "Payroll with Approvals",
    ],
    product: "hrms",
    tone: "navy",
    href: industryHref("plant-workforce-hcm"),
    related: ["precision", "machinery", "staffing"],
    demoName: "HRMS",
  },
  {
    key: "staffing",
    group: "need",
    title: "Staffing & Contract Talent",
    short: "Requirements to deployment",
    tag: "Staffing & resource management",
    description:
      "Built for staffing agencies, technical consulting networks, and contingent workforce providers managing customer requirements and deployments.",
    challenge:
      "Weeks-long recruiting cycles, consultants sitting idle on unbillable bench time, multi-vendor communication friction, and disputed timesheets and invoices.",
    solution:
      "Customer requirements, candidates, interviews, offers and onboarding in one flow, with deployments, replacements and approvals tracked against each requirement.",
    capabilities: [
      "Customer Requirements & Candidate Management",
      "Interviews, Offers & Onboarding",
      "Deployments & Resource Performance",
      "Replacements & Approvals",
    ],
    product: "staffing",
    tone: "orange",
    href: hrefFor("staffing"),
    related: ["services", "workforce"],
    demoName: "Staffing & Resource Management",
  },
];

export const solutionByKey = (key: SolutionKey) => SOLUTIONS.find((s) => s.key === key)!;
