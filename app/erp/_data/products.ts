import type { LucideIcon } from "lucide-react";
import { Activity, Bot, Briefcase, Building2, Factory, ShieldCheck, Users } from "lucide-react";

/**
 * Product + solution content and the route registry.
 *
 * `PRODUCT_DATA` was moved out of landingpage.tsx unchanged (precision, aerospace, hrms, staffing);
 * `it`, `shopfloor` and `ai` are new and use the same shape, with copy taken from the home page's
 * product cards and module stacks. `PRODUCT_ROUTES` decides the URL of every page — change a slug
 * there and every link follows. This file has no React state, so server pages can import it.
 */

export type ProductKey = "precision" | "it" | "hrms" | "staffing" | "shopfloor" | "ai" | "aerospace";

export interface ModuleGroup {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface ModuleSection {
  kicker: string;
  subtitle: string;
  groups: ModuleGroup[];
}

export interface ProductMeta {
  id: ProductKey;
  title: string;
  badge: string;
  subtitle: string;
  accentColor: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  icon: LucideIcon;
  description: string;
  heroStat: { label: string; value: string };
  highlights: string[];
  moduleSection?: ModuleSection;
  capabilities: {
    title: string;
    description: string;
    metric?: string;
  }[];
}

export const PRODUCT_DATA: Record<ProductKey, ProductMeta> = {
  precision: {
    id: "precision",
    title: "Precision Manufacturing",
    badge: "Precision & Job-Work ERP",
    subtitle: "Customer Material, Route Cards & Machine-to-Invoice Control",
    accentColor: "emerald",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
    accentBorder: "border-emerald-200",
    icon: Factory,
    description:
      "Built for precision and job-work machine shops, Synax connects customer orders and supplied-material challans to route cards, machine-confirmed production, inspection, dispatch, and invoicing. Track each customer's material through consumption, returns, and scrap.",
    heroStat: { label: "Production Flow", value: "Spindle to Invoice" },
    highlights: [
      "Link customer purchase orders, inward challans, and material ID ranges",
      "Track customer material balances, consumption, returns, and scrap",
      "Capture machine cycle counts, alarms, and downtime against route cards",
      "Connect inspection, COC, dispatch, GST invoices, and Tally vouchers",
    ],
    moduleSection: {
      kicker: "Precision & Job-Work",
      subtitle: "Trace every order from customer material receipt through dispatch",
      groups: [
        {
          id: "planning-execution",
          title: "Route Cards & Production",
          description:
            "Release production from customer orders and confirm each operation against its route card.",
          items: [
            "Customer PO Lines & Revisions",
            "BOM and Operation Routing",
            "Route Card or Barcode Job Start",
            "Machine Counts, Alarms & Downtime",
            "Operator-Confirmed Count Variances",
          ],
        },
        {
          id: "material-procurement",
          title: "Customer Material & Stores",
          description:
            "Keep customer-owned stock distinct and traceable from inward challan through consumption, return, or scrap.",
          items: [
            "Inward Challans & Material ID Ranges",
            "Customer Material Balances",
            "Material Issued to Production",
            "Returns & Scrap Records",
            "Purchase, Receipt & Stock Ledger",
          ],
        },
        {
          id: "quality-compliance",
          title: "Inspection & Dispatch",
          description:
            "Carry machining and inspection history through certification, packing, and invoicing.",
          items: [
            "Receiving & Final Inspection",
            "Stage Buy-Offs & FAIR Register",
            "Certificate of Conformance",
            "Packing & Delivery Challans",
            "GST Invoice, E-Way Bill & Tally Bridge",
          ],
        },
      ],
    },
    capabilities: [
      {
        title: "Customer Material Traceability",
        description:
          "Tie supplied material to its customer, PO line, inward challan, material IDs, production usage, returns, and scrap records.",
        metric: "Customer-level balances",
      },
      {
        title: "Machine-Confirmed Production",
        description:
          "Use CNC cycle counts, alarms, and downtime to support production confirmation, with operators reviewing count variances.",
        metric: "Live job counts",
      },
      {
        title: "Route Cards & Stage Buy-Offs",
        description:
          "Start jobs by route-card number or barcode, then keep operation status and stage approvals tied to the production record.",
        metric: "Operation-level tracking",
      },
      {
        title: "Inspection & Certificate of Conformance",
        description:
          "Carry inspection results and the machining record into the FAIR register and certificate issued with the finished part.",
        metric: "Part-level history",
      },
      {
        title: "Spindle-to-Invoice Dispatch",
        description:
          "Connect production completion to packing, customer invoice, delivery challan, GST e-invoice, and e-way bill workflows.",
        metric: "Connected dispatch flow",
      },
      {
        title: "Tally Accounting Bridge",
        description:
          "Manage purchasing, stores, production, and dispatch in Synax while sending accounting vouchers to Tally.",
        metric: "Keep books in Tally",
      },
    ],
  },
  aerospace: {
    id: "aerospace",
    title: "Aerospace & Defence",
    badge: "AS9100D QMS controls",
    subtitle: "Quality gates, traceability and compliance workflows",
    accentColor: "navy",
    accentBg: "bg-slate-100",
    accentText: "text-blue-900",
    accentBorder: "border-slate-300",
    icon: ShieldCheck,
    description:
      "Built for aerospace, defence and automotive suppliers who machine customer-supplied material. Quality gates and AS9100D QMS controls are attached at critical workflow checkpoints, so the record behind every part is created by the work itself.",
    heroStat: { label: "Standard", value: "AS9100D QMS controls" },
    highlights: [
      "AS9100D QMS controls attached at critical workflow checkpoints",
      "Material entry audit and genealogy trace from planning to final delivery",
      "FAIR register and certificate of conformance in the same flow",
      "Role-based access, with an audit history of material changes",
    ],
    moduleSection: {
      kicker: "Aerospace & Defence",
      subtitle: "AS9100D quality gates, traceability and compliance workflows",
      groups: [
        {
          id: "planning-execution",
          title: "Planning & Execution",
          description: "Plan jobs and execute production with live operator and machine coordination.",
          items: [
            "Machine Loading Plan Board",
            "Operator Panel & Login",
            "Job Scheduling Calendar",
            "Job Schedule List",
            "Execution Reports",
          ],
        },
        {
          id: "material-procurement",
          title: "Material & Procurement",
          description: "Control material flow from entry to stock-out with traceable procurement.",
          items: [
            "Material Entry Audit",
            "Material History",
            "Stock Out Management",
            "Vendor PO & Internal PO",
            "Bill of Materials",
          ],
        },
        {
          id: "quality-compliance",
          title: "Quality & Compliance",
          description: "Structured quality workflows for audits, traceability, and corrective actions.",
          items: [
            "NCR / CAPA",
            "FAIR Manager",
            "Calibration Dashboard",
            "Genealogy Trace",
            "Dispatch Release Controls",
          ],
        },
      ],
    },
    capabilities: [],
  },
  hrms: {
    id: "hrms",
    title: "HRMS",
    badge: "Employee lifecycle, attendance & payroll",
    subtitle: "Employee operations and workforce administration",
    accentColor: "navy",
    accentBg: "bg-slate-100",
    accentText: "text-blue-900",
    accentBorder: "border-slate-300",
    icon: Building2,
    description:
      "Run employee records, attendance, leave and work-from-home, and payroll with approvals in the same workspace as operations. Department KPIs show how teams are doing, and attendance logs and overtime approvals sync from biometric devices.",
    heroStat: { label: "Product Focus", value: "Employee lifecycle & payroll" },
    highlights: [
      "Employee lifecycle, recruitment, and offboarding",
      "Attendance, leave and WFH, with overtime approvals",
      "Payroll with approvals",
      "Department KPIs and performance management",
    ],
    moduleSection: {
      kicker: "HRMS",
      subtitle: "Employee operations and workforce administration, standalone or integrated",
      groups: [
        {
          id: "employee-lifecycle",
          title: "Employee Lifecycle",
          description: "From hiring to offboarding, one record per person.",
          items: ["Employee records", "Recruitment and interviews", "Offboarding", "Employee self-service"],
        },
        {
          id: "attendance-payroll",
          title: "Attendance & Payroll",
          description: "Attendance, leave and payroll in one flow, with approvals.",
          items: [
            "Attendance, leave & WFH",
            "Attendance & OT approval",
            "Biometric device sync",
            "Payroll with approvals",
            "Break pass management",
          ],
        },
        {
          id: "work-performance",
          title: "Work & Performance",
          description: "Plan the day's work and see how teams are doing.",
          items: ["Daily Work Management (DWM)", "Department KPIs", "Performance management", "Budget planner"],
        },
      ],
    },
    capabilities: [],
  },
  staffing: {
    id: "staffing",
    title: "Staffing & Resource Management",
    badge: "Candidates, interviews & deployments",
    subtitle: "Source, deploy, and manage customer staffing requirements",
    accentColor: "orange",
    accentBg: "bg-orange-50",
    accentText: "text-orange-700",
    accentBorder: "border-orange-300",
    icon: Users,
    description:
      "Manage customer requirements and candidates, run interviews, offers and onboarding, and track deployments, replacements and resource performance, with approvals along the way.",
    heroStat: { label: "Product Focus", value: "Talent Deployment" },
    highlights: [
      "Customer requirements and candidate management",
      "Interviews, offers, and onboarding",
      "Deployments and resource performance",
      "Replacements and approvals",
    ],
    moduleSection: {
      kicker: "Staffing",
      subtitle: "From the customer's requirement to the person on site",
      groups: [
        {
          id: "requirements-candidates",
          title: "Requirements & Candidates",
          description: "Capture what the customer needs and who can fill it.",
          items: ["Customer requirements", "Candidate management", "Interviews"],
        },
        {
          id: "offers-onboarding",
          title: "Offers & Onboarding",
          description: "Move a chosen candidate to day one.",
          items: ["Offers", "Onboarding", "Approvals"],
        },
        {
          id: "deployments-performance",
          title: "Deployments & Performance",
          description: "Keep track of who is where, and how they are doing.",
          items: ["Deployments", "Resource performance", "Replacements", "Timesheets & project billing"],
        },
      ],
    },
    capabilities: [],
  },
  it: {
    id: "it",
    title: "IT Services & Project ERP",
    badge: "Delivery, people & billing",
    subtitle: "Project delivery and profitability across IT service teams",
    accentColor: "navy",
    accentBg: "bg-slate-100",
    accentText: "text-blue-900",
    accentBorder: "border-slate-300",
    icon: Briefcase,
    description:
      "Run IT services delivery from one place: track projects against customer requirements, manage SOWs and resource allocation, capture timesheets and work logs, and bill projects with a clear view of profitability.",
    heroStat: { label: "Business Lifecycle", value: "Project to Billing" },
    highlights: [
      "Project and work tracking with customer requirements",
      "SOWs, resource allocation, and staffing",
      "Timesheets, work logs, and development costs",
      "Project billing and profitability",
    ],
    moduleSection: {
      kicker: "IT Services",
      subtitle: "Delivery, people and service workflows in one connected system",
      groups: [
        {
          id: "project-delivery",
          title: "Project Delivery",
          description: "Execution-focused tools for planning, tracking, and delivery visibility.",
          items: [
            "Project List & Project Add",
            "Daily Meetings",
            "Activity Tracker",
            "PM / PC Dashboards",
            "Project Billing Tracker",
          ],
        },
        {
          id: "people-operations",
          title: "People Operations",
          description: "Everything needed to run teams, attendance, and payroll operations smoothly.",
          items: [
            "Employee Management",
            "Attendance & OT Approval",
            "Budget Planner",
            "Payroll",
            "Break Pass Management",
          ],
        },
        {
          id: "communication-service",
          title: "Communication & Service",
          description: "Collaboration, support, and customer communication modules in one place.",
          items: ["Team Chat", "Video Calls", "Support Tickets", "Public Meetings", "Company Visitor Management"],
        },
      ],
    },
    capabilities: [],
  },
  shopfloor: {
    id: "shopfloor",
    title: "Shop Floor & Machine Monitoring",
    badge: "Production execution",
    subtitle: "Production execution and machine operations management",
    accentColor: "emerald",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
    accentBorder: "border-emerald-200",
    icon: Activity,
    description:
      "Connect CNC machines and let real cycle counts, alarms and downtime drive production confirmation, with no separate MES or integrator. Schedule work onto machines, give operators the job in front of them, and see what every machine is doing.",
    heroStat: { label: "Product Focus", value: "Machine Execution" },
    highlights: [
      "Machine scheduling and load charts",
      "Operator job cards and live machine monitoring",
      "Downtime and alarm visibility",
      "Production tracking and machine utilization",
    ],
    moduleSection: {
      kicker: "Shop floor",
      subtitle: "From the schedule to the spindle, with the machine's own counts",
      groups: [
        {
          id: "machine-scheduling",
          title: "Machine Scheduling",
          description: "Plan machine load and release each job to the right machine.",
          items: [
            "Machine scheduling & load charts",
            "BOM and Operation Routing",
            "Route card released against the BOM",
            "Start jobs by route card number or barcode scan",
          ],
        },
        {
          id: "operator-job-cards",
          title: "Operator Job Cards",
          description: "Give operators the job in front of them and capture what actually happened.",
          items: [
            "Operator job cards",
            "Cycle counts proposed, operator confirms with a variance reason",
            "Machines that cannot connect still work: operators confirm counts on the shop-floor screen",
            "Production tracking",
          ],
        },
        {
          id: "live-monitoring",
          title: "Live Machine Monitoring",
          description: "See what every machine is doing, and what it has been doing.",
          items: [
            "Live machine board with alarms and downtime reasons",
            "CNC machines through the OEM connection or open FOCAS",
            "OEE per job and the machining record on the COC",
            "Machine utilization",
          ],
        },
      ],
    },
    capabilities: [],
  },
  ai: {
    id: "ai",
    title: "AI & Business Intelligence",
    badge: "Assistance & insights",
    subtitle: "Intelligent assistance and insights for business operations",
    accentColor: "orange",
    accentBg: "bg-orange-50",
    accentText: "text-orange-700",
    accentBorder: "border-orange-200",
    icon: Bot,
    description:
      "Ask Synax anything about your ERP data, and let its agents watch for the problems that cost you money. Nothing changes until an approver says yes. Dashboards and reports across business workflows keep decisions on current data.",
    heroStat: { label: "Product Focus", value: "Insights & Assistance" },
    highlights: [
      "AI-powered assistance and Synax Agents",
      "Operational analytics and business dashboards",
      "Reports across business workflows",
      "Performance insights for informed decisions",
    ],
    moduleSection: {
      kicker: "AI & BI",
      subtitle: "Ask a question, get an answer from your own data",
      groups: [
        {
          id: "ai-assistance",
          title: "AI Assistance",
          description: "Ask in plain language and get answers from live records.",
          items: [
            "Ask Synax anything about your ERP data",
            "Challan reconciliation and overdue chasers",
            "Dispatch readiness and receivables follow-up",
            "Quality compliance and shop-floor watch",
          ],
        },
        {
          id: "approval-first",
          title: "Approval-First Control",
          description: "Agents propose. A person with the right role decides.",
          items: [
            "Agents only propose; the AI cannot change your data on its own",
            "Every action waits for an approver with the right role",
            "Maker-checker approval",
            "The decision is recorded in a full event history",
          ],
        },
        {
          id: "reports",
          title: "Analytics & Reports",
          description: "Dashboards and reports across the workflows you already run.",
          items: [
            "Business dashboards",
            "Operational analytics",
            "Reports across business workflows",
            "Performance insights",
          ],
        },
      ],
    },
    capabilities: [],
  },
};

/* =========================================================================
   ROUTES
   ========================================================================= */

export type RouteTone = "emerald" | "navy" | "orange";

export interface ProductRoute {
  key: ProductKey;
  slug: string;
  /** "/products" for the six products, "/solutions" for industry pages. */
  base: "/products" | "/solutions";
  /** Name used in menus, cards and the page H1. */
  name: string;
  /** Short menu description. */
  menu: string;
  tone: RouteTone;
  /** <title> and meta description. */
  seoTitle: string;
  seoDescription: string;
}

/** The six products, in the same order as the home page. Aerospace is an industry page. */
export const PRODUCT_ROUTES: ProductRoute[] = [
  {
    key: "precision",
    slug: "manufacturing-erp",
    base: "/products",
    name: "Manufacturing ERP",
    menu: "Planning, procurement, shop-floor, quality & costing",
    tone: "emerald",
    seoTitle: "Manufacturing ERP",
    seoDescription:
      "Customer material, route cards, inspection, dispatch and invoicing in one traceable machine-to-invoice workflow.",
  },
  {
    key: "it",
    slug: "it-services-project-erp",
    base: "/products",
    name: "IT Services & Project ERP",
    menu: "Projects, SOWs, resources, timesheets & billing",
    tone: "navy",
    seoTitle: "IT Services & Project ERP",
    seoDescription:
      "Project delivery, SOWs, resource allocation, timesheets and project billing for IT service teams.",
  },
  {
    key: "hrms",
    slug: "hrms",
    base: "/products",
    name: "HRMS",
    menu: "Employee lifecycle, attendance, payroll & performance",
    tone: "navy",
    seoTitle: "HRMS",
    seoDescription:
      "Employee lifecycle, recruitment, attendance, leave, payroll, compliance and performance management, standalone or integrated.",
  },
  {
    key: "staffing",
    slug: "staffing-resource-management",
    base: "/products",
    name: "Staffing & Resource Management",
    menu: "Customer needs, candidates, interviews & deployments",
    tone: "orange",
    seoTitle: "Staffing & Resource Management",
    seoDescription:
      "Source, deploy and manage customer staffing requirements: candidates, interviews, offers, onboarding and deployments.",
  },
  {
    key: "shopfloor",
    slug: "shop-floor-machine-monitoring",
    base: "/products",
    name: "Shop Floor & Machine Monitoring",
    menu: "Scheduling, job cards, live machines & downtime",
    tone: "emerald",
    seoTitle: "Shop Floor & Machine Monitoring",
    seoDescription:
      "Machine scheduling, operator job cards, live machine monitoring, downtime and utilization.",
  },
  {
    key: "ai",
    slug: "ai-business-intelligence",
    base: "/products",
    name: "AI & Business Intelligence",
    menu: "AI assistance, agents, analytics & reports",
    tone: "orange",
    seoTitle: "AI & Business Intelligence",
    seoDescription:
      "Synax AI assistance and agents, with operational analytics, dashboards and reports across business workflows.",
  },
];

export const SOLUTION_ROUTES: ProductRoute[] = [
  {
    key: "aerospace",
    slug: "aerospace-defence",
    base: "/solutions",
    name: "Aerospace & Defence",
    menu: "AS9100D QMS controls, FAIR register & COC",
    tone: "navy",
    seoTitle: "ERP for Aerospace & Defence",
    seoDescription:
      "AS9100D QMS controls at workflow checkpoints, FAIR register, certificates of conformance and traceability for aerospace, defence and automotive suppliers.",
  },
];

const ALL_ROUTES = [...PRODUCT_ROUTES, ...SOLUTION_ROUTES];

export function routeFor(key: ProductKey): ProductRoute {
  const found = ALL_ROUTES.find((r) => r.key === key);
  if (!found) throw new Error(`No route for ${key}`);
  return found;
}

export function hrefFor(key: ProductKey): string {
  const r = routeFor(key);
  return `${r.base}/${r.slug}`;
}

export function routeBySlug(base: ProductRoute["base"], slug: string): ProductRoute | undefined {
  return ALL_ROUTES.find((r) => r.base === base && r.slug === slug);
}
