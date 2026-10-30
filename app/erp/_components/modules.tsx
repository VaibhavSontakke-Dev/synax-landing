import { COMMON_SERVICES, MODULE_STACKS } from "../_data/content";
import { ModuleIcon } from "./icons";
import { Reveal } from "./reveal";
import { Chip, Container, Eyebrow, Section, SectionHeading, TextLink } from "./ui";

export function Modules() {
  return (
    <Section id="modules" tone="tint">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="ERP modules"
            title="The module directory, as it ships today"
            lead="Synax groups modules into focused operating stacks so teams adopt in phases without losing process control. Everything below is live in the product."
          />
        </Reveal>

        {/* ------------------- Shared services ------------------- */}
        <Reveal delay={80} className="mt-12 lg:mt-14">
          <div className="erp-card-surface overflow-hidden rounded-erp-xl border border-erp-line p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:items-center lg:gap-10">
              <div>
                <span className="inline-flex size-12 items-center justify-center rounded-erp-md bg-white text-erp-brand shadow-erp-sm">
                  <ModuleIcon name={COMMON_SERVICES.icon} className="size-6" />
                </span>
                <h3 className="mt-5 text-[length:var(--erp-h3)] font-semibold text-erp-ink">
                  {COMMON_SERVICES.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-erp-body">
                  {COMMON_SERVICES.description}
                </p>
              </div>

              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {COMMON_SERVICES.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ------------------- Per-industry stacks ------------------- */}
        {MODULE_STACKS.map((stack) => (
          <div key={stack.id} className="mt-12 lg:mt-16">
            <Reveal>
              <div className="flex flex-col gap-3 border-t border-erp-line pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <div className="max-w-2xl">
                  <Eyebrow>{stack.kicker}</Eyebrow>
                  <h3 className="mt-2 text-xl font-medium tracking-normal text-erp-ink sm:text-2xl">
                    {stack.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-erp-body">
                    {stack.description}
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stack.groups.map((group, index) => (
                <Reveal key={group.id} delay={index * 80}>
                  {/* Border width stays fixed on hover — growing it shifted the
                      card's text sideways, which the lift already covers. */}
                  <article className="erp-card erp-card-surface group flex h-full flex-col rounded-erp-lg border border-l-4 border-erp-line border-l-erp-brand p-5 hover:border-erp-brand/35 hover:shadow-erp-md lg:p-6">
                    <span className="inline-flex size-10 items-center justify-center rounded-erp-sm bg-erp-surface-3 text-erp-brand transition-colors duration-300 group-hover:bg-erp-brand group-hover:text-white">
                      <ModuleIcon name={group.icon} className="size-5" />
                    </span>

                    <h4 className="mt-4 text-base font-semibold text-erp-ink">
                      {group.title}
                    </h4>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-erp-soft">
                      {group.description}
                    </p>

                    <ul className="mt-4 flex flex-1 flex-col gap-1.5 border-t border-erp-line pt-4">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-2 text-[0.8125rem] leading-snug text-erp-body"
                        >
                          <span
                            className="mt-[0.4rem] size-1 shrink-0 rounded-full bg-erp-brand-mid"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        ))}

        <Reveal delay={60}>
          <div className="erp-panel-surface mt-10 flex flex-col items-start gap-3 rounded-erp-lg border border-erp-line p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9375rem] text-erp-body">
              Adoption is phased — enable one stack, then the next, with
              governance at each step.
            </p>
            <TextLink href="#showcase">See these modules in use</TextLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
