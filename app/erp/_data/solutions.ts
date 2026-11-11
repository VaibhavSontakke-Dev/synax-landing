/**
 * Solutions by industry / business need. Moved out of home-sectors.tsx so the home page section and
 * the /solutions page read the same copy. Plain data (no icons), so server pages can import it.
 * `key` points at the product (or industry page) that delivers the solution — see products.ts.
 */

export type SolutionKey = "precision" | "aerospace" | "hrms" | "staffing";

export interface Solution {
  key: SolutionKey;
  group: "By industry" | "By business need";
  title: string;
  short: string;
  tag: string;
  description: string;
  challenge: string;
  solution: string;
  capabilities: string[];
  /** Must be one of the demo form's product options (see demo-provider.tsx). */
  demoName: string;
}

export const SOLUTIONS: Solution[] = [
  {
    key: "precision",
    group: "By industry",
    title: "Precision Manufacturing",
    short: "Precision and job-work",
    tag: "Precision & Job-Work",
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
    demoName: "Manufacturing ERP",
  },
  {
    key: "aerospace",
    group: "By industry",
    title: "Aerospace & Defence",
    short: "AS9100D quality controls",
    tag: "AS9100D QMS controls",
    description:
      "Built for aerospace, defence and automotive suppliers who machine customer-supplied material.",
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
    demoName: "Aerospace & Defence",
  },
  {
    key: "hrms",
    group: "By business need",
    title: "Human Resource Management",
    short: "Workforce and HCM",
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
    demoName: "HRMS",
  },
  {
    key: "staffing",
    group: "By business need",
    title: "IT Staffing & Workforce Management",
    short: "Requirements to deployment",
    tag: "Staffing & Resource Management",
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
    demoName: "Staffing & Resource Management",
  },
];
