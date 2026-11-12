/**
 * Facts taken from the live Synax portal (https://synax.senwellgroup.com/landing), read from its
 * published bundle on 2026-11-11. This is the source of truth for the new pages: when the live site
 * changes, update this file. Wording is the portal's own, shortened only where noted.
 *
 * What the live landing page does NOT say (so the new pages do not either): any uptime figure or SLA,
 * "256-bit"/encryption specifics, an ITAR vault, ISO 9001, CMMC, NADCAP. Its route metadata mentions
 * "AS9100D QMS controls attached at critical workflow checkpoints"; its privacy page cites the DPDP
 * Act, 2023, with Senwell Group Private Limited as the operator.
 */

export const LIVE_SOURCE = "https://synax.senwellgroup.com/landing";

/** The portal's own positioning line. */
export const LIVE_POSITIONING = {
  headline: "The ERP for precision and job-work manufacturers.",
  sub: "From the machine spindle to the GST invoice, in one workspace, with AI that chases your exceptions.",
};

/** Chips under the portal's hero. */
export const LIVE_TRUST_CHIPS = [
  "GST e-invoice & e-way bill",
  "Works with Tally",
  "Audit trail on every posting",
  "Built in India, for Indian shop floors",
];

/** "Why Synax": three pillars. */
export const LIVE_PILLARS = [
  {
    kicker: "Job-work native",
    title: "Your customer's material, accounted to the last piece.",
    copy: "Customer-supplied material is a first-class citizen, not a spreadsheet on the side. Every challan, Material ID range and rejection stays tied to the customer who owns it.",
    points: [
      "Inward challans with Material ID ranges and PO line references",
      "Raw material consumed 1:1 against every invoiced part",
      "Customer material balance, return deliveries and scrap documents",
      "ITC-04 data pack and a read-only customer portal",
    ],
  },
  {
    kicker: "Machine to invoice",
    title: "The spindle reports the count. The route card, COC and invoice follow.",
    copy: "Connect CNC machines and let real cycle counts, alarms and downtime drive production confirmation, with no separate MES or integrator.",
    points: [
      "Live machine board with alarms and downtime reasons",
      "Start jobs by route card number or barcode scan",
      "Cycle counts proposed, operator confirms with a variance reason",
      "OEE per job and the machining record on the COC",
    ],
  },
  {
    kicker: "AI that acts",
    title: "Synax AI finds the exception and proposes the fix. You approve.",
    copy: "Ask Synax anything about your ERP data, and let its agents watch for the problems that cost you money. Nothing changes until an approver says yes.",
    points: [
      "Challan reconciliation and overdue chasers",
      "Dispatch readiness and receivables follow-up",
      "Quality compliance and shop-floor watch",
      "Maker-checker approval with a full event history",
    ],
  },
];

/** "Spindle to invoice": each document carries the one before it. */
export const LIVE_FLOW = [
  { title: "RFQ & customer PO", copy: "Quotations per line, revisions and PO open-quantity control." },
  { title: "Gate entry & GRN", copy: "Inward against PO or challan, with receipt tolerance and inspection." },
  { title: "Route card", copy: "Released against the BOM, with material reserved by RI unit." },
  { title: "Machine-confirmed operations", copy: "Operations confirmed from the machine, with buy-offs per stage." },
  { title: "Inspection & COC", copy: "Final inspection, FAIR and certificate of conformance." },
  { title: "Invoice & dispatch", copy: "Packing, GST invoice, IRN and e-way bill in one flow." },
];
export const LIVE_FLOW_LEAD =
  "Each document carries the one before it, so any part can be traced back to its PO, material lot, machine and operator.";

/** "Security & control": audit-ready by design, not by report. */
export const LIVE_SECURITY = [
  {
    title: "Isolated workspaces",
    copy: "Every company runs in its own tenant. Data never crosses between them.",
    icon: "layers",
  },
  {
    title: "Server-checked postings",
    copy: "Stock, quantities and status changes are validated on the server, not in the browser.",
    icon: "shield",
  },
  {
    title: "Audit history",
    copy: "Who changed what and when, kept for every material business change.",
    icon: "badge",
  },
  {
    title: "Role-based access",
    copy: "Menus, actions and sensitive values follow roles you configure, with two-step sign-in.",
    icon: "lock",
  },
] as const;

/** Pricing, as the portal states it. */
export const LIVE_PRICING = {
  headline: "Free for SMEs with fewer than 50 employees.",
  copy: "The full platform at no cost for small plants, as our support for small-scale industries and Atmanirbhar Bharat. Plans for larger teams are priced per seat, with add-ons for the modules you need.",
};

/** "Questions we hear most." */
export const LIVE_FAQ = [
  {
    q: "Who is Synax built for?",
    a: "Precision and job-work manufacturers, especially aerospace, defence and automotive suppliers who machine customer-supplied material. The same workspace also runs HR, attendance, payroll and projects.",
  },
  {
    q: "Do we have to move our accounts out of Tally?",
    a: "No. Run operations in Synax and keep your books in Tally. The Tally bridge sends the vouchers across.",
  },
  {
    q: "Which machines can Synax connect to?",
    a: "CNC machines through the OEM connection or open FOCAS. Machines that cannot connect still work: operators confirm counts on the shop-floor screen.",
  },
  {
    q: "Does Synax generate e-invoices and e-way bills?",
    a: "Yes. Connect your GST suvidha provider (ClearTax or Masters India) and the IRN is generated when an invoice is approved.",
  },
  {
    q: "Can the AI change our data on its own?",
    a: "No. Synax agents only propose. Every action waits for an approver with the right role, and the decision is recorded.",
  },
  {
    q: "Is Synax free for small manufacturers?",
    a: "Yes. Synax is free for SMEs with fewer than 50 employees, to support small-scale industries and Atmanirbhar Bharat.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most plants go live module by module within a few weeks, depending on how ready your masters and opening stock are. We import part, BOM and stock data from Excel.",
  },
];

/** "Start with what hurts most. Add the rest when you are ready." — module directory, by area. */
export const LIVE_MODULES = [
  { area: "Sales", items: ["RFQ & quotations", "Customer PO & amendments", "Monthly sales plan", "Order fulfilment"] },
  {
    area: "Procurement & Stores",
    items: ["Purchase requisition", "Vendor PO & receipt tolerance", "Gate entry, GRN & store inward", "Stock ledger & goods issue"],
  },
  {
    area: "Production",
    items: ["Part master & BOM suite", "Operation master & routing", "Route card production order", "Machine monitoring & jobs"],
  },
  { area: "Quality", items: ["Receiving & final inspection", "Stage buy-offs", "FAIR register", "Certificate of conformance"] },
  {
    area: "Dispatch & GST",
    items: ["Packing & customer invoice", "Delivery challans", "E-invoice (IRN) & e-way bill", "Tally bridge"],
  },
  {
    area: "People",
    items: ["Employee records", "Attendance, leave & WFH", "Payroll with approvals", "Department KPIs"],
  },
  {
    area: "Collaboration",
    items: ["Chat, calls & meetings", "Meeting calendar", "Push notifications", "Support help desk", "Microsoft 365 mail"],
  },
  { area: "Platform", items: ["Customer portal", "Integration center", "Synax AI assistant"] },
];

/** "Running on Synax" (named on the portal). */
export const LIVE_CLIENTS = ["Exxon Info", "Senwell Exports", "Stacwell Rubber", "Stacem France", "Stacem Morocco"];

/** Compliance-related statements that appear on the portal (metadata and privacy page). */
export const LIVE_COMPLIANCE = [
  {
    name: "AS9100D QMS controls",
    how: "Quality gates and AS9100D QMS controls are attached at critical workflow checkpoints, so the evidence is created by the work itself.",
  },
  {
    name: "India GST: e-invoice and e-way bill",
    how: "Connect your GST suvidha provider (ClearTax or Masters India) and the IRN is generated when an invoice is approved. Packing, invoice and e-way bill sit in one flow.",
  },
  {
    name: "ITC-04 for job work",
    how: "Customer material balances, returns and scrap documents feed an ITC-04 data pack.",
  },
  {
    name: "DPDP Act, 2023 (privacy)",
    how: "Senwell Group Private Limited publishes a privacy policy describing how personal data in Synax is collected, used and protected under the Digital Personal Data Protection Act, 2023.",
  },
];

/** The portal's rollout guide (/rollout): four phases, with the points it lists under each. */
export const LIVE_ROLLOUT = [
  {
    week: "Week 1",
    title: "Discovery & mapping",
    points: [
      "Map departments, process owners and current tools",
      "Define the must-have workflows for Day 1 go-live",
      "Finalize the role matrix and access boundaries",
    ],
  },
  {
    week: "Week 2",
    title: "Configuration & data setup",
    points: [
      "Configure modules by domain: IT, HR, finance, manufacturing",
      "Import core records: employees, projects, customers, vendors, inventory",
      "Set approval chains and notification rules",
    ],
  },
  {
    week: "Week 3",
    title: "Pilot launch",
    points: [
      "Run one controlled team or plant-cell pilot",
      "Track blockers daily and close priority process gaps",
      "Train managers and process champions using real workflows",
    ],
  },
  {
    week: "Week 4+",
    title: "Full rollout & optimization",
    points: [
      "Expand to all target teams with phased onboarding batches",
      "Monitor adoption KPIs and compliance metrics weekly",
      "Automate repeat approvals and reporting after stabilization",
    ],
  },
];
export const LIVE_ROLLOUT_NOTE = "Start with your highest-impact team first, then expand in 1-2 week waves.";
