import { TESTIMONIALS } from "../_data/content";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading } from "./ui";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          className={`size-[0.9375rem] ${
            i < rating ? "text-erp-accent" : "text-erp-line-strong"
          }`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 1l1.854 3.756L14 5.528l-3 2.924.708 4.13L8 10.5l-3.708 2.082L5 8.452 2 5.528l4.146-.772z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  return (
    <span
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-erp-brand/10 font-semibold text-[0.8125rem] text-erp-brand"
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function Testimonials() {
  return (
    <Section id="testimonials" tone="light">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Client Success"
            title="What Our Clients Say"
            lead="Hear from the teams who've transformed their operations with Synax ERP."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {TESTIMONIALS.map((t, index) => (
            <Reveal key={t.id} delay={index * 75} className="h-full">
              <article className="erp-card erp-card-surface group relative flex h-full flex-col overflow-hidden rounded-erp-xl border border-erp-line p-6 hover:border-erp-brand/30 hover:shadow-erp-md">
                {/* Top accent bar — reveals on hover */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-erp-brand via-erp-accent to-erp-sky opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />

                {/* Decorative quote mark */}
                <div
                  className="pointer-events-none absolute right-5 top-4 font-display text-[4.5rem] leading-none text-erp-brand/[0.07] select-none"
                  aria-hidden
                >
                  &ldquo;
                </div>

                {/* Stars */}
                <StarRating rating={t.rating} />

                {/* Quote */}
                <p className="relative mt-4 flex-1 text-[0.9rem] leading-relaxed text-erp-body">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Divider */}
                <div className="my-5 h-px bg-erp-line" />

                {/* Client */}
                <div className="flex items-center gap-3">
                  <Avatar name={t.clientName} />
                  <div className="min-w-0">
                    <p className="truncate text-[0.9rem] font-semibold leading-snug text-erp-ink">
                      {t.clientName}
                    </p>
                    <p className="mt-0.5 truncate text-[0.8rem] leading-snug text-erp-soft">
                      {t.designation}
                    </p>
                    <p className="truncate text-[0.8rem] leading-snug text-erp-soft">
                      {t.company}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
