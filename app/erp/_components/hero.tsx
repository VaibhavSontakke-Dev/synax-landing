import { HERO_PROOF } from "../_data/content";
import { AnimatedHeadline } from "./animated-headline";
import { HeroCards } from "./hero-cards";
import { Button, Container } from "./ui";

/**
 * Entrance is a pure CSS stagger (`animate-erp-rise` with a delay per item), so
 * the hero animates on first paint without waiting for hydration, and the
 * reduced-motion rule in globals.css collapses it to an instant render.
 */
function Rise({
  delay,
  children,
  className = "",
}: {
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`animate-erp-rise ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-erp-navy erp-on-dark">
      {/* Depth: two soft brand lights. */}
      <div
        className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full opacity-60 blur-[110px]"
        style={{ background: "radial-gradient(circle, #0b6cff 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-52 -left-40 size-[32rem] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, #00b2a9 0%, transparent 70%)" }}
        aria-hidden
      />

      <Container className="relative">
        {/* Vertical padding tracks viewport height rather than sitting at a
            fixed 112px, so the hero keeps its proportions on a tall monitor but
            stops pushing the CTAs past the fold on a laptop. */}
        <div className="grid items-center gap-10 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-14 lg:py-[clamp(1.5rem,4vh,3.5rem)]">
          {/* ------------------------- Copy ------------------------- */}
          <div className="max-w-xl">
            <Rise delay={0}>
              <AnimatedHeadline />
            </Rise>

            <Rise delay={120}>
              <p className="mt-4 max-w-lg text-[length:var(--erp-lead)] leading-relaxed text-pretty text-slate-300">
                Connect business operations, projects, production, assets and
                resources with Synax ERP — designed to support the needs of
                aerospace and defense, precision manufacturing, and IT services
                businesses.
              </p>
            </Rise>

            <Rise delay={200}>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="#demo" size="lg" withArrow>
                  Book a Demo
                </Button>
                <Button href="#industries" variant="ghost-dark" size="lg">
                  Explore Solutions
                </Button>
              </div>
            </Rise>
          </div>

          {/* ------------------------- Solution cards ------------------------- */}
          {/* Not wrapped in Rise — each card runs its own staggered entrance. */}
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-5 rounded-[2rem] opacity-70 blur-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(11,108,255,0.35), rgba(0,178,169,0.22))",
              }}
              aria-hidden
            />
            <div className="relative">
              <HeroCards />
            </div>
          </div>
        </div>

        {/* ------------------------- Verified proof strip ------------------------- */}
        <Rise delay={400}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-erp-lg border border-erp-line-dark bg-white/[0.07] lg:grid-cols-4">
            {HERO_PROOF.map((proof) => (
              <div key={proof.label} className="bg-erp-navy/80 p-4 sm:p-5">
                <dt className="font-mono text-[0.5625rem] tracking-[0.14em] text-erp-sky uppercase">
                  {proof.label}
                </dt>
                <dd className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                  {proof.value}
                </dd>
                <dd className="mt-1 text-[0.75rem] leading-snug text-slate-400">
                  {proof.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Rise>

        <div className="h-4 sm:h-6 lg:h-8" />
      </Container>
    </section>
  );
}
