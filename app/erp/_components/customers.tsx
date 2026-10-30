import { CLIENTS, IMPACT_STATS } from "../_data/content";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading, TextLink } from "./ui";

/**
 * Customers and platform facts.
 *
 * The named organisations are the ones the live site lists. No testimonial
 * quotes, outcome percentages or per-customer results appear here, because none
 * are published — the figures in IMPACT_STATS are platform facts, not customer
 * results, and are labelled as such.
 */
export function Customers() {
  return (
    <Section id="customers" tone="dark">
      <Container>
        <Reveal>
          <SectionHeading
            tone="dark"
            align="center"
            eyebrow="Customers"
            title="Running mission-critical operations"
            lead="Adopted by IT and manufacturing organisations scaling their operations with phased, governed rollouts."
          />
        </Reveal>

        {/* ------------------------- Client roster ------------------------- */}
        <Reveal delay={80}>
          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-erp-xl border border-erp-line-dark bg-erp-line-dark sm:grid-cols-3 lg:grid-cols-5">
            {CLIENTS.map((client) => (
              <li
                key={client}
                className="group flex min-h-24 items-center justify-center bg-erp-navy-3 px-4 py-6 text-center transition-colors duration-300 ease-erp hover:bg-erp-navy-2"
              >
                <span className="text-[0.9375rem] font-semibold tracking-tight text-slate-400 transition-colors duration-300 group-hover:text-white">
                  {client}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ------------------------- Platform facts ------------------------- */}
        <div className="mt-14 lg:mt-16">
          <Reveal>
            <p className="text-center font-mono text-[0.625rem] font-semibold tracking-[0.16em] text-slate-500 uppercase">
              Platform facts — not customer results
            </p>
          </Reveal>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_STATS.map((stat, index) => (
              <Reveal key={stat.value} delay={index * 70} className="h-full">
                <div className="erp-card group relative h-full overflow-hidden rounded-erp-lg border border-erp-line-dark bg-white/[0.04] p-6 hover:border-erp-brand/50 hover:bg-white/[0.07] hover:shadow-erp-md">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-erp-brand to-erp-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <dt className="font-mono text-[0.5625rem] tracking-[0.14em] text-slate-500 uppercase">
                    {stat.label}
                  </dt>
                  <dd className="mt-3 bg-gradient-to-br from-erp-brand to-erp-accent bg-clip-text text-3xl leading-none font-semibold text-transparent sm:text-4xl transition-transform duration-300 group-hover:scale-105">
                    {stat.value}
                  </dd>
                  <dd className="mt-3 text-[0.8125rem] leading-snug text-slate-400">
                    {stat.detail}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={60}>
            <p className="mt-8 text-center text-[0.9375rem] text-slate-400">
              Want to see how this maps onto your operation?{" "}
              <TextLink href="#demo" tone="dark" className="align-middle">
                Book a demo
              </TextLink>
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
