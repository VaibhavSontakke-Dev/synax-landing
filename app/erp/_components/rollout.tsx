import { ROLLOUT } from "../_data/content";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading, TextLink } from "./ui";

export function Rollout() {
  return (
    <Section id="rollout">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Rollout blueprint"
            title="Pilot to full scale in three focused phases"
            lead="Modules switch on in stages, with governance and operational safeguards at each release."
          />
        </Reveal>

        <div className="relative mt-12 lg:mt-14">
          <div
            className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-erp-line via-erp-brand/40 to-erp-line sm:block"
            aria-hidden
          />

          <ol className="grid gap-6 sm:grid-cols-3 sm:gap-5">
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
                <h3 className="mt-5 text-base font-semibold text-erp-ink">
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
              Most teams launch in phased mode within a few weeks, depending on
              process complexity and data readiness.
            </p>
            <TextLink href="#demo">Talk through your phases</TextLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
