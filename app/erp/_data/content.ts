/**
 * Content for the /erp landing page.
 *
 * Everything in this file is transcribed from the live Synax product site
 * (synax.senwellgroup.com) on 2026-10-28 — the landing page, the module
 * directory at /modules, and the contact page. Nothing is invented.
 *
 * Deliberately NOT included, because no source confirmed them:
 *   - "Master Data" and "Asset Management" as named modules. The nearest real
 *     capabilities are Bill of Materials / Material History and the
 *     Calibration Dashboard; those are listed under their real names instead.
 *   - Customer counts, revenue figures, testimonials, named certifications
 *     beyond AS9100D, and any integration or automation claim.
 *   - Postal address, phone number and email. The live site publishes none;
 *     every contact route points at the real /contact-us form.
 */

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavLink[];
};

/**
 * Provenance only — where the facts in this file were read from. Nothing in the
 * UI links here: the /erp page is self-contained and every href is an in-page
 * anchor.
 */
export const SOURCES = {
  landing: "https://synax.senwellgroup.com/landing",
  modules: "https://synax.senwellgroup.com/modules",
  rollout: "https://synax.senwellgroup.com/rollout",
  contact: "https://synax.senwellgroup.com/contact-us",
} as const;

export const NAV: NavItem[] = [
  {
    label: "Platform",
    href: "#platform-benefits",
    children: [
      {
        label: "Why Synax",
        href: "#platform-benefits",
        description: "The five things that decide whether an ERP survives the shop floor.",
      },
      {
        label: "Connected workflows",
        href: "#workflows",
        description: "How plan, execute, inspect and release stay linked.",
      },
      {
        label: "Quality gates",
        href: "#quality",
        description: "Stage checks that hold a part until it passes.",
      },
      {
        label: "Technology",
        href: "#technology",
        description: "Architecture, access control and deployment model.",
      },
    ],
  },
  {
    label: "Solutions",
    href: "#modules",
    children: [
      {
        label: "Module directory",
        href: "#modules",
        description: "Every stack that ships today, grouped by team.",
      },
      {
        label: "Product tour",
        href: "#showcase",
        description: "Plan boards, quality records and delivery views.",
      },
      {
        label: "Fits your stack",
        href: "#integrations",
        description: "Where Synax meets the systems already in place.",
      },
      {
        label: "Rollout blueprint",
        href: "#rollout",
        description: "Pilot to full scale in three phases.",
      },
    ],
  },
  {
    label: "Industries",
    href: "#industries",
    children: [
      {
        label: "Aerospace & Defense",
        href: "#industry-aerospace",
        description: "Traceability and AS9100D-aligned control.",
      },
      {
        label: "Precision Manufacturing",
        href: "#industry-manufacturing",
        description: "Machine loading, material flow and inspection.",
      },
      {
        label: "IT Services",
        href: "#industry-it",
        description: "Delivery tracking, staffing and billing visibility.",
      },
    ],
  },
  { label: "Customers", href: "#customers" },
  { label: "Contact", href: "#demo" },
];

/* -------------------------------------------------------------------------- */
/* Business goals — outcome-led entry points, the "I want to…" pattern         */
/* -------------------------------------------------------------------------- */

export const BUSINESS_GOALS = [
  {
    label: "Get off spreadsheets",
    copy: "Move scheduling, material and quality records into one system without a year-long migration.",
    href: "#modules",
    cta: "See the modules",
    icon: "layers" as const,
  },
  {
    label: "Pass an AS9100D audit",
    copy: "Attach clauses and evidence to the workflow stages that produce them, so the record builds itself.",
    href: "#quality",
    cta: "See quality gates",
    icon: "badge" as const,
  },
  {
    label: "See production and projects together",
    copy: "Run the shop floor and the delivery book off one model instead of reconciling two.",
    href: "#workflows",
    cta: "See the workflow",
    icon: "route" as const,
  },
  {
    label: "Start small, prove it, scale",
    copy: "Switch on one stack, confirm it works, then extend — with governance at each release.",
    href: "#rollout",
    cta: "See the rollout",
    icon: "gauge" as const,
  },
];

/* -------------------------------------------------------------------------- */
/* Platform benefits — pain first, then the answer                            */
/* -------------------------------------------------------------------------- */

export type PlatformBenefit = {
  id: string;
  tab: string;
  question: string;
  answer: string;
  points: string[];
  icon: IconName;
};

export const PLATFORM_BENEFITS: PlatformBenefit[] = [
  {
    id: "benefit-quality",
    tab: "Built-in quality",
    question: "Tired of chasing paperwork after the part has shipped?",
    answer:
      "Quality gates sit on the operations themselves. A part cannot move to the next step until its check is recorded, so the evidence exists before anyone asks for it.",
    points: [
      "Mandatory gate checks across machining, inspection, dispatch and release",
      "NCR / CAPA and FAIR records raised in the same flow",
      "Calibration status tracked against the equipment that measured the part",
    ],
    icon: "shield",
  },
  {
    id: "benefit-compliance",
    tab: "Audit readiness",
    question: "Does an audit still mean weeks of reassembling records?",
    answer:
      "AS9100D clauses map to the workflow stages they govern. The audit reads the same records the floor already filled in, rather than a parallel binder maintained for the auditor.",
    points: [
      "AS9100D QMS requirements attached at critical process points",
      "Evidence linked to the stage that produced it",
      "Genealogy trace held from planning to final delivery",
    ],
    icon: "badge",
  },
  {
    id: "benefit-traceability",
    tab: "Traceability",
    question: "Can you follow one part all the way back?",
    answer:
      "Part, process and quality history stay linked across the lifecycle, so a question about a shipped item resolves against records rather than recollection.",
    points: [
      "Material entry audit and material history end to end",
      "Bill of materials tied to the jobs that consumed it",
      "Dispatch release controls gated on a complete record",
    ],
    icon: "route",
  },
  {
    id: "benefit-security",
    tab: "Secure by tenant",
    question: "Worried about who can see which programme?",
    answer:
      "Multi-tenant architecture keeps each workspace isolated, with role-based permissions and route-level controls deciding what a given person reaches.",
    points: [
      "Tenant-isolated workspaces with dedicated subdomain hosting",
      "Role-based permissions by department and function",
      "Route-level access control, not just hidden menu items",
    ],
    icon: "lock",
  },
  {
    id: "benefit-connected",
    tab: "One data spine",
    question: "How many systems does one job touch today?",
    answer:
      "Projects, manufacturing, QA, HR, payroll, approvals and finance sit in one traceable model, so status and cost stop being two separate conversations.",
    points: [
      "Shared records across operations, workforce and finance",
      "Approval orchestration and alerts on the same spine",
      "Execution reports read from the schedule that was published",
    ],
    icon: "layers",
  },
];

/* -------------------------------------------------------------------------- */
/* Technology highlights                                                      */
/* -------------------------------------------------------------------------- */

export const TECH_HIGHLIGHTS = [
  {
    title: "Multi-tenant architecture",
    copy: "Isolated workspaces per tenant, with dedicated subdomain hosting available for each.",
    icon: "layers" as const,
  },
  {
    title: "Role-based access control",
    copy: "Permissions by department and role, enforced at the route level rather than the menu.",
    icon: "lock" as const,
  },
  {
    title: "Operator-facing by design",
    copy: "A dedicated operator panel and login, so the floor works the published schedule directly.",
    icon: "machine" as const,
  },
  {
    title: "Biometric attendance sync",
    copy: "Attendance logs and approvals sync from biometric devices into payroll and OT workflows.",
    icon: "device" as const,
  },
  {
    title: "Phased module activation",
    copy: "Stacks switch on in stages with governance and operational safeguards at each release.",
    icon: "bolt" as const,
  },
  {
    title: "Reporting on live records",
    copy: "Execution reports and dashboards read the same records the work created, not a nightly copy.",
    icon: "chart" as const,
  },
];

/* -------------------------------------------------------------------------- */
/* Platform facts — figures published on the live site, used as impact tiles   */
/* -------------------------------------------------------------------------- */

export const IMPACT_STATS = [
  {
    value: "AS9100D",
    label: "QMS controls",
    detail: "Attached at critical workflow checkpoints",
  },
  {
    value: "99.9%",
    label: "Platform availability",
    detail: "Across tenant workspaces",
  },
  {
    value: "Multi-tenant",
    label: "Isolated by design",
    detail: "Dedicated subdomain hosting per tenant",
  },
  {
    value: "₹0",
    label: "For SMEs under 50",
    detail: "Full platform, in support of Atmanirbhar Bharat",
  },
];

/* -------------------------------------------------------------------------- */
/* Fits-your-stack — verified touchpoints, not a third-party integration list  */
/* -------------------------------------------------------------------------- */

export const INTEGRATION_POINTS = [
  {
    title: "Biometric devices",
    copy: "Attendance logs and overtime approvals sync from the readers already on site.",
    icon: "device" as const,
  },
  {
    title: "Vendor and internal POs",
    copy: "Procurement runs through vendor PO and internal PO workflows alongside your suppliers.",
    icon: "box" as const,
  },
  {
    title: "Per-tenant hosting",
    copy: "Dedicated subdomain workspaces keep each business unit's data apart.",
    icon: "lock" as const,
  },
  {
    title: "Phased adoption",
    copy: "Run Synax beside what you have, stack by stack, instead of a single cutover.",
    icon: "plug" as const,
  },
];

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

/** Verified on the live landing page. */
export const HERO_PROOF = [
  {
    label: "Quality gates",
    value: "Stage-level",
    detail: "Configured at critical manufacturing stages",
  },
  {
    label: "Standard",
    value: "AS9100D",
    detail: "QMS linked to each important process checkpoint",
  },
  {
    label: "Availability",
    value: "99.9%",
    detail: "Platform availability",
  },
  {
    label: "Architecture",
    value: "Multi-tenant",
    detail: "Isolated tenant workspaces",
  },
];

/* -------------------------------------------------------------------------- */
/* Industries                                                                 */
/* -------------------------------------------------------------------------- */

export type Industry = {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  /** Each point maps to a module that exists in the live directory. */
  points: string[];
  accent: "brand" | "accent" | "sky";
  icon: "aerospace" | "precision" | "it";
};

export const INDUSTRIES: Industry[] = [
  {
    id: "industry-aerospace",
    eyebrow: "01 — Regulated production",
    title: "Aerospace & Defense",
    blurb:
      "Build, inspect and release with stage-level control and a record behind every part. AS9100D requirements attach to the workflow points where they actually apply.",
    points: [
      "Genealogy trace across part and process history",
      "FAIR manager and NCR / CAPA workflows",
      "Dispatch release controls before a part ships",
      "Calibration dashboard for measurement equipment",
    ],
    accent: "brand",
    icon: "aerospace",
  },
  {
    id: "industry-manufacturing",
    eyebrow: "02 — Shop floor execution",
    title: "Precision Manufacturing",
    blurb:
      "Plan jobs, load machines and move material without losing the thread. Operators work from the same schedule the planners publish.",
    points: [
      "Machine loading plan board and job scheduling calendar",
      "Operator panel with its own login",
      "Material entry audit, history and stock-out control",
      "Vendor PO, internal PO and bill of materials",
    ],
    accent: "accent",
    icon: "precision",
  },
  {
    id: "industry-it",
    eyebrow: "03 — Services delivery",
    title: "IT Services",
    blurb:
      "Track delivery, people and billing in one place, so project status and the cost of getting there are never two different conversations.",
    points: [
      "Project list, activity tracker and daily meetings",
      "PM / PC dashboards and project billing tracker",
      "Employee management, attendance and OT approval",
      "Budget planner, payroll and break pass management",
    ],
    accent: "sky",
    icon: "it",
  },
];

/* -------------------------------------------------------------------------- */
/* Modules — transcribed verbatim from synax.senwellgroup.com/modules          */
/* -------------------------------------------------------------------------- */

export type ModuleGroup = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  items: string[];
};

export type ModuleStack = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  groups: ModuleGroup[];
};

export const COMMON_SERVICES: ModuleGroup = {
  id: "common",
  title: "Common Services",
  description: "Shared services available across IT and Manufacturing.",
  icon: "layers",
  items: [
    "Team Chat",
    "Audio / Video Call",
    "Public & Private Meetings",
    "DWM (Daily Work Management)",
    "Attendance Management",
    "Ticket Support System",
  ],
};

export const MODULE_STACKS: ModuleStack[] = [
  {
    id: "stack-it",
    kicker: "IT Services",
    title: "Delivery, people and service workflows",
    description:
      "Everything a services team needs to plan work, run the people side of it and keep customers answered.",
    groups: [
      {
        id: "project-delivery",
        title: "Project Delivery",
        description:
          "Execution-focused tools for planning, tracking, and delivery visibility.",
        icon: "chart",
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
        description:
          "Everything needed to run teams, attendance, and payroll operations smoothly.",
        icon: "people",
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
        description:
          "Collaboration, support, and customer communication modules in one place.",
        icon: "chat",
        items: [
          "Team Chat",
          "Video Calls",
          "Support Tickets",
          "Public Meetings",
          "Company Visitor Management",
        ],
      },
    ],
  },
  {
    id: "stack-manufacturing",
    kicker: "Manufacturing",
    title: "Planning, material and quality workflows",
    description:
      "The production side of the platform, from the plan board down to the record that releases a part.",
    groups: [
      {
        id: "planning-execution",
        title: "Planning & Execution",
        description:
          "Plan jobs and execute production with live operator and machine coordination.",
        icon: "machine",
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
        description:
          "Control material flow from entry to stock-out with traceable procurement.",
        icon: "box",
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
        description:
          "Structured quality workflows for audits, traceability, and corrective actions.",
        icon: "shield",
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
];

/* -------------------------------------------------------------------------- */
/* Workflow — the "data spine" described on the live landing page              */
/* -------------------------------------------------------------------------- */

export const WORKFLOW_STAGES = [
  {
    id: "plan",
    step: "01",
    title: "Plan",
    copy: "Capture part programs, timelines, owners and dependencies so every team starts from one source of truth.",
    modules: ["Project List", "Job Scheduling Calendar", "Bill of Materials"],
  },
  {
    id: "execute",
    step: "02",
    title: "Execute",
    copy: "Run operations, approvals and schedules with stage-level controls and no handoff blind spots.",
    modules: ["Machine Loading Plan Board", "Operator Panel", "DWM"],
  },
  {
    id: "inspect",
    step: "03",
    title: "Inspect",
    copy: "Hold the part at the gate until the check is recorded, with AS9100D evidence attached where it applies.",
    modules: ["FAIR Manager", "NCR / CAPA", "Calibration Dashboard"],
  },
  {
    id: "release",
    step: "04",
    title: "Release",
    copy: "Release against a complete record, then keep the trace linked for the audit that comes later.",
    modules: ["Dispatch Release Controls", "Genealogy Trace", "Execution Reports"],
  },
];

/* -------------------------------------------------------------------------- */
/* Customers                                                                  */
/* -------------------------------------------------------------------------- */

/** Named on the live landing page under "Trusted by our clients". */
export const CLIENTS = [
  "Exxon Info",
  "Senwell Exports",
  "Stacwell Rubber",
  "Stacem France",
  "Stacem Morocco",
];

/* -------------------------------------------------------------------------- */
/* Rollout — the three phases published on the live site                      */
/* -------------------------------------------------------------------------- */

export const ROLLOUT = [
  {
    step: "01",
    title: "Map",
    copy: "Model business units, roles and workflow ownership for each department.",
  },
  {
    step: "02",
    title: "Activate",
    copy: "Enable modules in phased releases with governance and operational safeguards.",
  },
  {
    step: "03",
    title: "Scale",
    copy: "Track outcomes, tighten bottlenecks and extend automation where impact is highest.",
  },
];

export type IconName =
  | "layers"
  | "chart"
  | "people"
  | "chat"
  | "machine"
  | "box"
  | "shield"
  | "badge"
  | "route"
  | "lock"
  | "gauge"
  | "device"
  | "bolt"
  | "plug";
