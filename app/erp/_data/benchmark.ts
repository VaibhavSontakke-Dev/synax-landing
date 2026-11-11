/**
 * "How Synax compares" rows, shared by the home page's Market Benchmark section and /why-synax.
 * The competitor columns describe typical alternatives (original copy) — have them reviewed before
 * launch and keep them generic (no vendor names).
 */

export type BenchmarkIcon = "cpu" | "filecheck" | "clock" | "users" | "receipt";

export interface BenchmarkRow {
  title: string;
  icon: BenchmarkIcon;
  synax: string;
  legacy: string;
  point: string;
}

export const BENCHMARK: BenchmarkRow[] = [
  {
    title: "CNC Machine IoT Telemetry",
    icon: "cpu",
    synax: "OEM connection or open FOCAS, no separate MES",
    legacy: "Needs a separate MES or integrator",
    point: "Manual paper whiteboard logging",
  },
  {
    title: "FAIR Register & Certificate of Conformance",
    icon: "filecheck",
    synax: "In the same flow as inspection and dispatch",
    legacy: "Manual paperwork entry & reassembly",
    point: "Vulnerable Excel spreadsheets",
  },
  {
    title: "Biometric Attendance & Shift Break Passes",
    icon: "clock",
    synax: "Attendance logs and OT approvals sync from biometric devices",
    legacy: "Separate HCM module with sync lags",
    point: "Isolated punch cards / buddy punching",
  },
  {
    title: "Staffing & Resource Management",
    icon: "users",
    synax: "Candidates to deployments in the same workspace",
    legacy: "Unconnected external ATS silos",
    point: "Scattered email resumes & PDFs",
  },
  {
    title: "Tally & GST (e-invoice, e-way bill)",
    icon: "receipt",
    synax: "Tally bridge, IRN and e-way bill in one flow",
    legacy: "Separate GST add-on or manual export",
    point: "Re-keying invoices into Tally",
  },
];
