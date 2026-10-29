/**
 * Product visuals for the /erp page.
 *
 * These are composed mockups, not screenshots. Every panel title, module name
 * and navigation label is taken from the real Synax module directory, and the
 * two headline figures (128 active projects, 06 live workflow alerts) are the
 * ones the live landing page publishes. Row-level values are illustrative
 * interface content, the same way a product screenshot shows one tenant's data.
 *
 * Built from layout primitives rather than bitmaps so they stay sharp, reflow
 * at every breakpoint and cost nothing to download.
 */

const DOTS = ["#ff5f56", "#ffbd2e", "#27c93f"];

function MockWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-erp-lg border border-erp-line bg-white shadow-erp-lg ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-erp-line bg-erp-surface-2 px-3 py-2.5">
        <div className="flex gap-1.5">
          {DOTS.map((color) => (
            <span
              key={color}
              className="size-2 rounded-full"
              style={{ background: color }}
            />
          ))}
        </div>
        <p className="truncate font-mono text-[0.625rem] font-medium tracking-wide text-erp-soft">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function StatTile({
  label,
  value,
  note,
  accent = "brand",
}: {
  label: string;
  value: string;
  note: string;
  accent?: "brand" | "accent" | "amber";
}) {
  const accents = {
    brand: "text-erp-brand",
    accent: "text-erp-accent",
    amber: "text-amber-600",
  };

  return (
    <div className="rounded-erp-md border border-erp-line bg-white p-2.5">
      <p className="font-mono text-[0.5625rem] tracking-[0.12em] text-erp-soft uppercase">
        {label}
      </p>
      <p className={`mt-1 text-lg leading-none font-semibold ${accents[accent]}`}>
        {value}
      </p>
      <p className="mt-1 text-[0.625rem] leading-tight text-erp-soft">{note}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero visual                                                                */
/* -------------------------------------------------------------------------- */

const SIDEBAR = [
  "Projects",
  "DWM",
  "Plan Board",
  "Material",
  "Quality",
  "People",
];

const THROUGHPUT = [38, 52, 44, 61, 57, 72, 66, 81];

const GATES = [
  { op: "OP-20 · Turning", state: "Passed", tone: "pass" },
  { op: "OP-40 · Inspection", state: "In gate", tone: "hold" },
  { op: "OP-60 · FAIR", state: "Queued", tone: "idle" },
];

const GATE_TONES = {
  pass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  hold: "bg-amber-50 text-amber-700 ring-amber-200",
  idle: "bg-slate-50 text-slate-500 ring-slate-200",
} as const;

export function HeroDashboard() {
  return (
    <MockWindow title="synax · operations overview">
      <div className="flex">
        {/* Module rail — the real top-level areas of the product. */}
        <nav className="hidden w-32 shrink-0 border-r border-erp-line bg-erp-surface-2 p-2.5 sm:block">
          {SIDEBAR.map((item, index) => (
            <p
              key={item}
              className={`truncate rounded-erp-sm px-2 py-1.5 text-[0.6875rem] font-medium ${
                index === 0
                  ? "bg-erp-brand text-white"
                  : "text-erp-soft"
              }`}
            >
              {item}
            </p>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-3 p-3">
          <div className="grid grid-cols-2 gap-2">
            <StatTile
              label="Active projects"
              value="128"
              note="+18% this month"
            />
            <StatTile
              label="Workflow alerts"
              value="06"
              note="All critical items monitored"
              accent="amber"
            />
          </div>

          {/* Throughput — illustrative series, labelled as such by its axis. */}
          <div className="rounded-erp-md border border-erp-line p-2.5">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[0.5625rem] tracking-[0.12em] text-erp-soft uppercase">
                Execution reports
              </p>
              <p className="text-[0.5625rem] text-erp-soft">Last 8 weeks</p>
            </div>
            <svg
              viewBox="0 0 160 44"
              className="mt-2 h-11 w-full"
              preserveAspectRatio="none"
              aria-hidden
            >
              {THROUGHPUT.map((value, index) => {
                const height = (value / 90) * 40;
                return (
                  <rect
                    key={index}
                    x={index * 20 + 3}
                    y={44 - height}
                    width="12"
                    height={height}
                    rx="2.5"
                    fill={index === THROUGHPUT.length - 1 ? "#0b6cff" : "#dce9ff"}
                  />
                );
              })}
            </svg>
          </div>

          {/* Quality gates — the product's defining behaviour. */}
          <div className="rounded-erp-md border border-erp-line p-2.5">
            <p className="font-mono text-[0.5625rem] tracking-[0.12em] text-erp-soft uppercase">
              Quality gates
            </p>
            <ul className="mt-2 space-y-1.5">
              {GATES.map((gate) => (
                <li key={gate.op} className="flex items-center justify-between gap-2">
                  <span className="truncate text-[0.6875rem] text-erp-body">
                    {gate.op}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[0.5625rem] font-semibold ring-1 ring-inset ${
                      GATE_TONES[gate.tone as keyof typeof GATE_TONES]
                    }`}
                  >
                    {gate.state}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}

/* -------------------------------------------------------------------------- */
/* Showcase visuals                                                           */
/* -------------------------------------------------------------------------- */

const MACHINES = [
  { id: "VMC-01", load: [0, 42], tone: "#0b6cff" },
  { id: "VMC-02", load: [18, 38], tone: "#3d88ff" },
  { id: "CNC-07", load: [10, 66], tone: "#00b2a9" },
  { id: "GRND-02", load: [48, 34], tone: "#38bdf8" },
];

export function PlanBoardMock() {
  return (
    <MockWindow title="synax · machine loading plan board">
      <div className="space-y-2.5 p-3">
        <div className="flex items-center justify-between">
          <p className="text-[0.6875rem] font-semibold text-erp-ink">
            Week 44 · Shift A
          </p>
          <p className="font-mono text-[0.5625rem] text-erp-soft">
            4 machines · 11 jobs
          </p>
        </div>

        <div className="space-y-1.5">
          {MACHINES.map((machine) => (
            <div key={machine.id} className="flex items-center gap-2">
              <span className="w-14 shrink-0 font-mono text-[0.5625rem] text-erp-soft">
                {machine.id}
              </span>
              <div className="relative h-5 flex-1 rounded-erp-sm bg-erp-surface-3">
                <div
                  className="absolute inset-y-0 rounded-erp-sm"
                  style={{
                    left: `${machine.load[0]}%`,
                    width: `${machine.load[1]}%`,
                    background: machine.tone,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-erp-line pt-2.5">
          <span className="size-1.5 rounded-full bg-erp-accent" />
          <p className="text-[0.625rem] text-erp-soft">
            Operator panel in sync · 2 jobs awaiting release
          </p>
        </div>
      </div>
    </MockWindow>
  );
}

const QUALITY_ROWS = [
  { ref: "NCR-2291", type: "NCR / CAPA", state: "Open", tone: "hold" },
  { ref: "FAIR-0416", type: "FAIR Manager", state: "Approved", tone: "pass" },
  { ref: "CAL-0088", type: "Calibration", state: "Due 14d", tone: "idle" },
  { ref: "GEN-7731", type: "Genealogy Trace", state: "Linked", tone: "pass" },
];

export function QualityMock() {
  return (
    <MockWindow title="synax · quality & compliance">
      <div className="p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[0.6875rem] font-semibold text-erp-ink">
            AS9100D evidence register
          </p>
          <span className="rounded-full bg-erp-brand-soft px-2 py-0.5 font-mono text-[0.5625rem] font-semibold text-erp-brand-dark">
            AUDIT READY
          </span>
        </div>

        <ul className="divide-y divide-erp-line">
          {QUALITY_ROWS.map((row) => (
            <li key={row.ref} className="flex items-center gap-2 py-2">
              <span className="w-[4.5rem] shrink-0 font-mono text-[0.5625rem] text-erp-brand">
                {row.ref}
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.6875rem] text-erp-body">
                {row.type}
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[0.5625rem] font-semibold ring-1 ring-inset ${
                  GATE_TONES[row.tone as keyof typeof GATE_TONES]
                }`}
              >
                {row.state}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </MockWindow>
  );
}

const DELIVERY = [
  { name: "Avionics bracket line", pct: 82, tone: "#0b6cff" },
  { name: "Landing gear retrofit", pct: 64, tone: "#00b2a9" },
  { name: "Managed services — EU", pct: 47, tone: "#38bdf8" },
];

export function DeliveryMock() {
  return (
    <MockWindow title="synax · pm dashboard">
      <div className="space-y-3 p-3">
        <div className="grid grid-cols-3 gap-2">
          <StatTile label="On track" value="18" note="Projects" />
          <StatTile label="At risk" value="03" note="Needs review" accent="amber" />
          <StatTile label="Billable" value="94%" note="Utilisation" accent="accent" />
        </div>

        <div className="space-y-2.5 rounded-erp-md border border-erp-line p-2.5">
          {DELIVERY.map((project) => (
            <div key={project.name}>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[0.6875rem] text-erp-body">
                  {project.name}
                </span>
                <span className="shrink-0 font-mono text-[0.5625rem] text-erp-soft">
                  {project.pct}%
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-erp-surface-3">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${project.pct}%`, background: project.tone }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockWindow>
  );
}
