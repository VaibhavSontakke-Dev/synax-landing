import { ROLLOUT, ROLLOUT_CHECKLIST, ROLLOUT_ROLES } from "../_data/content";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading, TextLink } from "./ui";

export function Rollout() {
  return (
    <Section id="rollout" tone="tint">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Rollout blueprint"
            title="A phased path from discovery to optimization"
            lead="Prepare the data and owners first, pilot with one team, then expand in governed waves."
          />
        </Reveal>

        <div className="relative mt-12 lg:mt-14">
          <div
            className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-erp-line via-erp-brand/40 to-erp-line lg:block"
            aria-hidden
          />

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {ROLLOUT.map((phase, index) => (
              <Reveal
                key={phase.step}
                delay={index * 90}
                as="li"
                className="erp-card group relative h-full rounded-erp-lg border border-erp-line bg-white p-6 text-center hover:border-erp-brand/35 hover:shadow-erp-md"
              >
                <span className="relative z-10 mx-auto flex size-14 items-center justify-center rounded-full border border-erp-line bg-erp-surface-2 font-mono text-sm font-semibold text-erp-brand transition-colors duration-300 group-hover:border-erp-brand group-hover:bg-erp-brand group-hover:text-white">
                  {phase.step}
                </span>
                <p className="mt-3 font-mono text-[0.6875rem] font-semibold uppercase text-erp-brand">
                  {phase.timing}
                </p>
                <h3 className="mt-1 text-base font-semibold text-erp-ink">
                  {phase.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-erp-body">
                  {phase.copy}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={60}>
          <div className="mt-10 flex flex-col items-start gap-3 rounded-erp-lg border border-erp-line bg-erp-surface-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9375rem] text-erp-body">
              Start with the highest-impact team, then expand in 1–2 week waves.
              Total timing depends on process complexity and data readiness.
            </p>
            <TextLink href="#demo">Talk through your phases</TextLink>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 border-t border-erp-line pt-10 lg:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-erp-ink">Before onboarding</h3>
            <ul className="mt-4 space-y-3">
              {ROLLOUT_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-3 text-[0.875rem] leading-relaxed text-erp-body">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-erp-brand" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-erp-ink">Rollout ownership</h3>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {ROLLOUT_ROLES.map((role) => (
                <div key={role.title} className="border-t border-erp-line pt-3">
                  <dt className="text-sm font-semibold text-erp-ink">{role.title}</dt>
                  <dd className="mt-1 text-[0.8125rem] leading-relaxed text-erp-body">
                    {role.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
