import { BUSINESS_GOALS } from "../_data/content";
import { ArrowIcon, ModuleIcon } from "./icons";
import { Reveal } from "./reveal";
import { Container, Eyebrow } from "./ui";

/**
 * Outcome-led entry points, sitting between the hero and the product detail.
 * Each card is an anchor into the section that answers it, so a visitor who
 * knows their problem can skip straight to it.
 */
export function BusinessGoals() {
  return (
    <section
      id="goals"
      className="relative scroll-mt-20 bg-erp-surface pb-16 sm:pb-20 lg:pb-24"
    >
      {/* Carries the hero's navy up behind the cards so they lift off it. */}
      <div className="absolute inset-x-0 top-0 h-28 bg-erp-navy" aria-hidden />

      <Container className="relative">
        <div className="rounded-erp-xl border border-erp-line bg-white p-6 shadow-erp-lg sm:p-8 lg:p-10">
          <Reveal>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>Start where it hurts</Eyebrow>
                <h2 className="mt-2 text-xl font-medium tracking-normal text-erp-ink sm:text-2xl">
                  I want to&hellip;
                </h2>
              </div>
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-erp-soft">
                Four places teams usually start. Pick the one that sounds like
                this quarter.
              </p>
            </div>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BUSINESS_GOALS.map((goal, index) => (
              <Reveal key={goal.label} delay={index * 70} as="li" className="h-full">
                <a
                  href={goal.href}
                  className="erp-card group flex h-full flex-col rounded-erp-lg border border-erp-line bg-erp-surface-2 p-5 hover:border-erp-brand/40 hover:bg-white hover:shadow-erp-md"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-erp-sm bg-white text-erp-brand shadow-erp-sm transition-colors duration-300 group-hover:bg-erp-brand group-hover:text-white">
                    <ModuleIcon name={goal.icon} className="size-5" />
                  </span>

                  <h3 className="mt-4 text-[0.9375rem] leading-snug font-semibold text-erp-ink">
                    {goal.label}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-erp-body">
                    {goal.copy}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-erp-brand">
                    {goal.cta}
                    <ArrowIcon className="size-4 transition-transform duration-300 ease-erp group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
