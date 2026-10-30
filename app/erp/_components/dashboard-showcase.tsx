import { Reveal } from "./reveal";
import { Button, Container, Eyebrow } from "./ui";

export function DashboardShowcase() {
  return (
    <section
      id="dashboard"
      className="relative scroll-mt-20 overflow-hidden bg-erp-navy py-16 erp-on-dark sm:py-20 lg:py-28"
    >
      {/* Ambient brand glow — top-center */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 size-[48rem] -translate-x-1/2 rounded-full opacity-30 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, #0b6cff 0%, rgba(0,178,169,0.6) 45%, transparent 72%)",
        }}
        aria-hidden
      />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 erp-grid-dark" aria-hidden />

      <Container className="relative">
        {/* ── Heading block ── */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow tone="dark">Platform Overview</Eyebrow>
            <h2 className="mt-3 text-[length:var(--erp-h2)] font-medium leading-[1.15] tracking-normal text-balance text-white">
              Everything You Need.{" "}
              <span className="bg-gradient-to-r from-erp-brand-mid via-erp-sky to-erp-accent bg-clip-text text-transparent">
                One Powerful Dashboard.
              </span>
            </h2>
            <p className="mt-4 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-slate-300">
              Complete visibility, smarter insights, and seamless control of
              your business operations — all from one unified platform.
            </p>
          </div>
        </Reveal>

        {/* ── Dashboard image frame ── */}
        <Reveal delay={100}>
          <div className="relative mt-12 lg:mt-16">
            {/* Glow halo behind the frame */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2.5rem] opacity-50 blur-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(11,108,255,0.4) 0%, rgba(0,178,169,0.25) 50%, rgba(56,189,248,0.2) 100%)",
              }}
              aria-hidden
            />

            {/* Frame */}
            <div className="relative overflow-hidden rounded-erp-xl border border-erp-line-dark shadow-[0_40px_100px_rgba(0,0,0,0.55)] lg:rounded-[1.5rem]">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 border-b border-erp-line-dark bg-erp-navy-3 px-4 py-3">
                <span className="size-3 rounded-full bg-red-400/70" />
                <span className="size-3 rounded-full bg-yellow-400/70" />
                <span className="size-3 rounded-full bg-green-400/70" />
                <div className="mx-3 flex-1 rounded-erp-sm bg-erp-navy-2 px-3 py-1 text-center font-mono text-[0.6875rem] text-slate-500">
                  app.synax.senwellgroup.com
                </div>
              </div>

              {/* Dashboard image */}
              <div className="bg-erp-navy-2">
                <img
                  src="/images/synax-dashboard.png"
                  alt="Synax ERP unified dashboard — production planning, quality gates, and project delivery in one view"
                  className="block w-full object-contain object-top"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Description + CTA ── */}
        <Reveal delay={160}>
          <div className="mx-auto mt-12 max-w-2xl text-center lg:mt-14">
            <p className="text-[0.9375rem] leading-relaxed text-slate-400">
              Synax brings your essential business operations together in one
              intuitive workspace. Monitor performance, access critical
              insights, manage workflows, and make informed decisions with a
              centralised dashboard designed to simplify the way you work.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="#demo" size="lg" withArrow>
                Book a Demo
              </Button>
              <Button href="#showcase" variant="ghost-dark" size="lg">
                See It in Action
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
