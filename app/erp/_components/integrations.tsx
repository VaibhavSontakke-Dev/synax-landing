import { INTEGRATION_POINTS } from "../_data/content";
import { ModuleIcon } from "./icons";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading, TextLink } from "./ui";

/**
 * "Fits your stack" rather than a logo wall. The live product publishes no
 * third-party integration catalogue, so this section names only the touchpoints
 * that are confirmed — biometric readers, PO workflows, per-tenant hosting and
 * phased adoption — instead of implying connectors that may not exist.
 */
export function Integrations() {
  return (
    <Section id="integrations" tone="tint">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Fits your stack"
              title="Works alongside what you already run"
              lead="Synax does not ask for a single cutover weekend. It meets the devices, suppliers and business units already in place, and takes over stack by stack."
            />
            <div className="mt-6">
              <TextLink href="#rollout">See how a phased rollout works</TextLink>
            </div>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2">
            {INTEGRATION_POINTS.map((point, index) => (
              <Reveal
                key={point.title}
                delay={index * 70}
                as="li"
                className="erp-card erp-card-surface group h-full rounded-erp-lg border border-erp-line p-5 hover:border-erp-accent/40 hover:shadow-erp-md"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-erp-sm bg-teal-50 text-erp-accent transition-colors duration-300 group-hover:bg-erp-accent group-hover:text-white">
                  <ModuleIcon name={point.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-[0.9375rem] font-semibold text-erp-ink">
                  {point.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-erp-body">
                  {point.copy}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
