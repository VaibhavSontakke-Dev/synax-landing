import { WORKFLOW_STAGES } from "../_data/content";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading } from "./ui";

/** Domains the live site lists as sharing one traceable model. */
const SPINE = [
  "Projects",
  "Precision manufacturing",
  "QA",
  "HR",
  "Payroll",
  "Approvals",
  "Finance",
];

export function Workflow() {
  return (
    <Section id="workflows" tone="dark">
      <div className="absolute inset-0 erp-grid-dark" aria-hidden />
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 size-[36rem] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
        style={{ background: "radial-gradient(circle, #0b6cff 0%, transparent 70%)" }}
        aria-hidden
      />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            tone="dark"
            align="center"
            eyebrow="Connected business workflows"
            title="One thread from the plan to the release"
            lead="A part moves through four stages. At each one the next step inherits the record the previous step produced — which is what makes the trace hold up later."
          />
        </Reveal>

        {/* Rail: horizontal on desktop, a vertical spine on mobile. */}
        <div className="relative mt-14">
          <div
            className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-erp-sky/40 to-transparent lg:block"
            aria-hidden
          />
          <div
            className="absolute top-0 bottom-0 left-[1.4375rem] w-px bg-gradient-to-b from-erp-sky/40 via-erp-sky/20 to-transparent lg:hidden"
            aria-hidden
          />

          <ol className="grid gap-6 lg:grid-cols-4 lg:gap-6">
            {WORKFLOW_STAGES.map((stage, index) => (
              <Reveal
                key={stage.id}
                delay={index * 100}
                as="li"
                className="relative flex gap-5 lg:block"
              >
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-erp-sky/30 bg-erp-navy font-mono text-sm font-semibold text-erp-sky">
                  {stage.step}
                </span>

                <div className="min-w-0 flex-1 pb-2 lg:mt-5 lg:pb-0">
                  <h3 className="text-lg font-semibold text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-slate-400">
                    {stage.copy}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {stage.modules.map((moduleName) => (
                      <li
                        key={moduleName}
                        className="rounded-erp-sm border border-erp-line-dark bg-white/[0.05] px-2 py-1 text-[0.6875rem] text-slate-300"
                      >
                        {moduleName}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* The shared model underneath the four stages. */}
        <Reveal delay={120}>
          <div className="mt-14 rounded-erp-xl border border-erp-line-dark bg-white/[0.04] p-6 backdrop-blur-sm lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
              <div className="lg:w-72 lg:shrink-0">
                <p className="font-mono text-[0.625rem] tracking-[0.16em] text-erp-accent uppercase">
                  Aerospace manufacturing data spine
                </p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-300">
                  These stay connected in one traceable model rather than
                  syncing between separate systems.
                </p>
              </div>

              <ul className="flex flex-1 flex-wrap gap-2">
                {SPINE.map((domain) => (
                  <li
                    key={domain}
                    className="rounded-erp-md border border-erp-line-dark bg-erp-navy/60 px-3 py-2 text-[0.8125rem] font-medium text-slate-200"
                  >
                    {domain}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
