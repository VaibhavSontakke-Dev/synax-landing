import { DeliveryMock, PlanBoardMock, QualityMock } from "./dashboard";
import { CheckIcon } from "./icons";
import { Reveal } from "./reveal";
import { Container, Eyebrow, Section, TextLink } from "./ui";

const ROWS = [
  {
    id: "plan-board",
    eyebrow: "Planning & execution",
    title: "Plan the week, then run the shift against it",
    copy: "Planners publish to the machine loading plan board; operators work the same schedule from the operator panel. Execution reports come back off the floor instead of being reconstructed afterwards.",
    points: [
      "Machine loading plan board and job scheduling calendar",
      "Operator panel with its own login",
      "Execution reports tied to the published schedule",
    ],
    visual: <PlanBoardMock />,
  },
  {
    id: "quality",
    eyebrow: "Quality & compliance",
    title: "The gate holds until the record exists",
    copy: "Quality gates sit at the operations that matter — machining, inspection, dispatch, release. AS9100D clauses and their evidence attach to the stage they govern, so an audit reads the same records the shop floor already filled in.",
    points: [
      "NCR / CAPA and FAIR manager workflows",
      "Calibration dashboard for measurement equipment",
      "Genealogy trace and dispatch release controls",
    ],
    visual: <QualityMock />,
  },
  {
    id: "delivery",
    eyebrow: "Project delivery",
    title: "Delivery status and what it costs, in one view",
    copy: "PM and PC dashboards read from the same records as the activity tracker and the billing tracker. Progress and margin stop being two separate conversations held in two separate tools.",
    points: [
      "Project list, activity tracker and daily meetings",
      "PM / PC dashboards and project billing tracker",
      "Attendance, OT approval and budget planner alongside",
    ],
    visual: <DeliveryMock />,
  },
];

export function Showcase() {
  return (
    <Section id="showcase" tone="light">
      <Container>
        <div className="space-y-16 lg:space-y-24">
          {ROWS.map((row, index) => {
            const flipped = index % 2 === 1;

            return (
              <div
                key={row.id}
                id={row.id}
                className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <Reveal className={flipped ? "lg:order-2" : undefined}>
                  <div className="max-w-xl">
                    <Eyebrow>{row.eyebrow}</Eyebrow>
                    <h3 className="mt-3 text-[length:var(--erp-h2)] leading-[1.15] font-medium tracking-normal text-balance text-erp-ink">
                      {row.title}
                    </h3>
                    <p className="mt-4 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-erp-body">
                      {row.copy}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {row.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <CheckIcon className="mt-0.5 size-4 shrink-0 text-erp-brand" />
                          <span className="text-[0.9375rem] leading-snug text-erp-body">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7">
                      <TextLink href="#demo">See it on your own data</TextLink>
                    </div>
                  </div>
                </Reveal>

                <Reveal
                  delay={120}
                  className={flipped ? "lg:order-1" : undefined}
                >
                  <div className="erp-card erp-card-surface group relative overflow-hidden rounded-erp-xl border border-erp-line hover:border-erp-brand/20 hover:shadow-erp-lg">
                    <div
                      className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-erp-brand/12 to-erp-accent/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                      aria-hidden
                    />
                    <div className="relative">{row.visual}</div>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
