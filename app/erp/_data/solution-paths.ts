import type { SolutionKey } from "./solutions";

/**
 * "Start with what hurts most. Add the rest when you are ready." — for each solution: the pain, the modules
 * to switch on first, what to add next, and how far it reaches across the portal's module areas.
 *
 * Module names for manufacturing come from the live portal's module directory (`LIVE_MODULES` in live.ts);
 * the staffing names come from the product's own highlights. `coverage` is typical use (2 = core, 1 =
 * optional, 0 = not usually part of it), not a product limit.
 */

export type AreaName =
  | "Sales"
  | "Procurement & Stores"
  | "Production"
  | "Quality"
  | "Dispatch & GST"
  | "People"
  | "Collaboration"
  | "Platform";

export const AREAS: AreaName[] = [
  "Sales",
  "Procurement & Stores",
  "Production",
  "Quality",
  "Dispatch & GST",
  "People",
  "Collaboration",
  "Platform",
];

export interface SolutionPath {
  pain: string;
  start: string[];
  then: string[];
  coverage: Record<AreaName, 0 | 1 | 2>;
}

export const SOLUTION_PATHS: Record<SolutionKey, SolutionPath> = {
  precision: {
    pain: "Customer material and machine counts live in spreadsheets.",
    start: ["Gate entry, GRN & store inward", "Route card production order", "Machine monitoring & jobs"],
    then: ["Receiving & final inspection", "Packing & customer invoice", "E-invoice (IRN) & e-way bill", "Tally bridge"],
    coverage: {
      Sales: 1,
      "Procurement & Stores": 2,
      Production: 2,
      Quality: 2,
      "Dispatch & GST": 2,
      People: 1,
      Collaboration: 1,
      Platform: 2,
    },
  },
  aerospace: {
    pain: "Audit evidence is rebuilt by hand after the part has shipped.",
    start: ["Stage buy-offs", "FAIR register", "Certificate of conformance"],
    then: ["Route card production order", "Receiving & final inspection", "Delivery challans"],
    coverage: {
      Sales: 1,
      "Procurement & Stores": 2,
      Production: 2,
      Quality: 2,
      "Dispatch & GST": 1,
      People: 1,
      Collaboration: 1,
      Platform: 2,
    },
  },
  hrms: {
    pain: "Attendance, overtime and payroll are chased on paper.",
    start: ["Employee records", "Attendance, leave & WFH"],
    then: ["Payroll with approvals", "Department KPIs"],
    coverage: {
      Sales: 0,
      "Procurement & Stores": 0,
      Production: 0,
      Quality: 0,
      "Dispatch & GST": 0,
      People: 2,
      Collaboration: 2,
      Platform: 1,
    },
  },
  staffing: {
    pain: "Requirements, candidates and deployments sit in different places.",
    start: ["Customer requirements", "Candidate management"],
    then: ["Interviews", "Offers & onboarding", "Deployments & replacements"],
    coverage: {
      Sales: 1,
      "Procurement & Stores": 0,
      Production: 0,
      Quality: 0,
      "Dispatch & GST": 0,
      People: 2,
      Collaboration: 2,
      Platform: 1,
    },
  },
};
