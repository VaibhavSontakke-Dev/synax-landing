import { INDUSTRIES } from "../_data/content";
import { AerospaceIcon, CheckIcon, ItIcon, PrecisionIcon } from "./icons";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading, TextLink } from "./ui";

const GLYPHS = {
  aerospace: AerospaceIcon,
  precision: PrecisionIcon,
  it: ItIcon,
};

const ACCENTS = {
  brand: {
    bar: "from-erp-brand to-erp-brand-mid",
    chip: "bg-erp-brand-soft text-erp-brand-dark",
    glyph: "text-erp-brand",
    hover: "hover:border-erp-brand/40",
  },
  accent: {
    bar: "from-erp-accent to-teal-400",
    chip: "bg-teal-50 text-teal-700",
    glyph: "text-erp-accent",
    hover: "hover:border-erp-accent/40",
  },
  sky: {
    bar: "from-erp-sky to-cyan-300",
    chip: "bg-cyan-50 text-cyan-700",
    glyph: "text-cyan-500",
    hover: "hover:border-erp-sky/50",
  },
} as const;

export function Industries() {
  return (
    <Section id="industries" tone="tint">
      <div className="absolute inset-0 erp-grid-light" aria-hidden />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Industry solutions"
            title="Three industries, one operating model"
            lead="Synax ships the workflows each sector actually runs on — not a generic ERP with an industry label bolted to the front."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {INDUSTRIES.map((industry, index) => {
            const Glyph = GLYPHS[industry.icon];
            const accent = ACCENTS[industry.accent];

            return (
              <Reveal
                key={industry.id}
                id={industry.id}
                delay={index * 90}
                /* Three cards in a two-column grid: the odd one out goes wide
                   rather than leaving a hole beside it. */
                className={`scroll-mt-24 ${
                  index === INDUSTRIES.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <article
                  className={`erp-card group flex h-full flex-col overflow-hidden rounded-erp-xl border border-erp-line bg-white hover:shadow-erp-lg ${accent.hover}`}
                >
                  <div className={`h-1 bg-gradient-to-r ${accent.bar}`} />

                  <div className="flex flex-1 flex-col p-6 lg:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`inline-flex size-12 items-center justify-center rounded-erp-md ${accent.chip}`}
                      >
                        <Glyph className="size-6" />
                      </span>
                      <span className="font-mono text-[0.625rem] tracking-[0.12em] text-erp-soft uppercase">
                        {industry.eyebrow}
                      </span>
                    </div>

                    <h3 className="mt-5 text-[length:var(--erp-h3)] font-semibold tracking-[-0.01em] text-erp-ink">
                      {industry.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-erp-body">
                      {industry.blurb}
                    </p>

                    <ul className="mt-5 space-y-2.5 border-t border-erp-line pt-5">
                      {industry.points.map((point) => (
                        <li key={point} className="flex gap-2.5">
                          <CheckIcon
                            className={`mt-0.5 size-4 shrink-0 ${accent.glyph}`}
                          />
                          <span className="text-[0.875rem] leading-snug text-erp-body">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-1">
                      <TextLink href="#demo">
                        Talk to the {industry.title} team
                      </TextLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
