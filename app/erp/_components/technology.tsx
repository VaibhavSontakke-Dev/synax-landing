import { TECH_HIGHLIGHTS } from "../_data/content";
import { ModuleIcon } from "./icons";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading } from "./ui";

export function Technology() {
  return (
    <Section id="technology" tone="dark">
      <div className="absolute inset-0 erp-grid-dark" aria-hidden />
      <div
        className="pointer-events-none absolute top-0 right-0 size-[30rem] rounded-full opacity-25 blur-[120px]"
        style={{ background: "radial-gradient(circle, #00b2a9 0%, transparent 70%)" }}
        aria-hidden
      />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Technology"
            title="A platform shaped by how the work actually runs"
            lead="Architecture decisions that matter on a shop floor: who can see what, who works from which screen, and how a deployment grows without a rebuild."
          />
        </Reveal>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-erp-xl border border-erp-line-dark bg-white/[0.07] sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {TECH_HIGHLIGHTS.map((item, index) => (
            <Reveal
              key={item.title}
              delay={(index % 3) * 70}
              as="li"
              className="group h-full bg-erp-navy/85 p-6 transition-colors duration-300 hover:bg-erp-navy-2/90 lg:p-7"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-erp-md border border-erp-line-dark bg-white/[0.06] text-erp-sky transition-colors duration-300 group-hover:border-erp-sky/40 group-hover:text-white">
                <ModuleIcon name={item.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-slate-400">
                {item.copy}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
