import { TECH_HIGHLIGHTS } from "../_data/content";
import { ModuleIcon } from "./icons";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading } from "./ui";

export function Technology() {
  return (
    <Section id="technology" tone="tint">
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Technology"
            title="A platform shaped by how the work actually runs"
            lead="Architecture decisions that matter on a shop floor: who can see what, who works from which screen, and how a deployment grows without a rebuild."
          />
        </Reveal>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-erp-xl border border-erp-line bg-erp-surface-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {TECH_HIGHLIGHTS.map((item, index) => (
            <Reveal
              key={item.title}
              delay={(index % 3) * 70}
              as="li"
              className="group h-full bg-white p-6 transition-colors duration-300 hover:bg-erp-surface-2 lg:p-7"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-erp-md border border-erp-line bg-erp-surface-3 text-erp-brand transition-colors duration-300 group-hover:border-erp-brand/40 group-hover:text-white group-hover:bg-erp-brand">
                <ModuleIcon name={item.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-erp-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-erp-body">
                {item.copy}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
