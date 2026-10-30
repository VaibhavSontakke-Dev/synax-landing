import { ModuleIcon } from "./icons";
import { Reveal } from "./reveal";
import { Button, Eyebrow } from "./ui";

const PILLARS = [
  {
    icon: "layers" as const,
    title: "Centralized Management",
    description:
      "A unified operational core connecting engineering, shop-floor execution, inventory, and finance without departmental silos.",
  },
  {
    icon: "chart" as const,
    title: "Actionable Insights",
    description:
      "Real-time KPI telemetry, machine throughput analytics, and live margin visibility for proactive decision-making.",
  },
  {
    icon: "bolt" as const,
    title: "Operational Efficiency",
    description:
      "Automated quality gates, digital traveler handoffs, and traceable compliance workflows that accelerate cycle times.",
  },
];

export function DashboardShowcase() {
  return (
    <section
      id="dashboard"
      className="relative scroll-mt-20 overflow-hidden bg-erp-navy py-10 erp-on-dark sm:py-14 lg:py-16"
    >
      {/* Ambient brand glow — top-center depth lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, #0b6cff 0%, rgba(0,178,169,0.55) 45%, transparent 72%)",
        }}
        aria-hidden
      />

      {/* Secondary accent glow — bottom-right */}
      <div
        className="pointer-events-none absolute -bottom-36 right-[-8%] size-[32rem] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #00b2a9 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Subtle square grid texture matching landing page style */}
      <div className="absolute inset-0 erp-grid-dark" aria-hidden />

      {/* Medium-sized container so the full dashboard fits in one view without scrolling */}
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── Heading block ── */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="dark">Platform Overview</Eyebrow>
            <h2 className="mt-2 text-[length:var(--erp-h2)] font-medium leading-[1.15] tracking-normal text-balance text-white">
              Everything You Need.{" "}
              <span className="bg-gradient-to-r from-erp-brand-mid via-erp-sky to-erp-accent bg-clip-text text-transparent">
                One Powerful Dashboard.
              </span>
            </h2>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-pretty text-slate-300">
              Unify planning, operations, quality control, and business
              intelligence into a single, real-time command center built for
              modern manufacturing and enterprise precision.
            </p>
          </div>
        </Reveal>

        {/* ── Medium-Size Dashboard Showcase Frame (Fully in view without scrolling) ── */}
        <Reveal delay={100}>
          <div className="relative mx-auto mt-6 max-w-4xl lg:max-w-[920px] lg:mt-8">
            {/* Multi-layered brand glow halo behind the frame */}
            <div
              className="pointer-events-none absolute -inset-3 sm:-inset-5 rounded-[2rem] opacity-45 blur-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(11,108,255,0.4) 0%, rgba(0,178,169,0.28) 50%, rgba(56,189,248,0.2) 100%)",
              }}
              aria-hidden
            />

            {/* Application Mockup Frame */}
            <div className="relative overflow-hidden rounded-erp-xl border border-erp-line-dark/80 bg-erp-navy-2/95 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(11,108,255,0.12)] ring-1 ring-white/10 backdrop-blur-sm lg:rounded-[1.5rem]">
              {/* Reflective top highlight */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                aria-hidden
              />

              {/* Browser / App chrome header */}
              <div className="flex items-center justify-between border-b border-erp-line-dark/70 bg-erp-navy-3/90 px-3.5 py-2 sm:px-5 sm:py-2.5">
                {/* Traffic light control dots */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="size-2.5 sm:size-3 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]/40 shadow-sm" />
                  <span className="size-2.5 sm:size-3 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]/40 shadow-sm" />
                  <span className="size-2.5 sm:size-3 rounded-full bg-[#27c93f]/90 border border-[#1aab29]/40 shadow-sm" />
                </div>

                {/* Central URL / Workspace pill */}
                <div className="flex items-center gap-1.5 sm:gap-2 rounded-erp-sm border border-erp-line-dark/60 bg-erp-navy-2/90 px-3 py-0.5 sm:py-1 font-mono text-[0.625rem] sm:text-[0.6875rem] text-slate-400 shadow-inner">
                  <svg
                    className="size-2.5 sm:size-3 text-erp-sky/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeWidth="2" />
                  </svg>
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300">
                    app.synax.senwellgroup.com
                  </span>
                </div>

                {/* Status indicator badge */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[0.5625rem] font-medium text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Operations
                  </span>
                </div>
              </div>

              {/* Dashboard image canvas - Medium size, native aspect ratio preserved */}
              <div className="relative w-full bg-erp-navy-2">
                <img
                  src="/images/synax-dashboard.png"
                  alt="Synax ERP unified dashboard — centralized business management, real-time insights, and operational workflows"
                  width={1376}
                  height={768}
                  className="block h-auto w-full object-contain"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Product Description + Feature Highlights + CTAs ── */}
        <Reveal delay={160}>
          <div className="mx-auto mt-8 max-w-3xl text-center lg:mt-10">
            {/* Professional narrative description highlighting centralized management, insights, and operational efficiency */}
            <p className="text-sm sm:text-[0.9375rem] leading-relaxed text-pretty text-slate-300">
              Synax brings your core business operations together into a
              centralized, intelligent workspace. By integrating real-time
              shop-floor execution, resource planning, and quality governance,
              leadership and teams gain instant visibility and actionable
              insights—eliminating operational silos, accelerating delivery, and
              driving peak operational efficiency across every stage of delivery.
            </p>

            {/* 3 Value Pillar Cards */}
            <div className="mt-6 grid gap-3 text-left sm:grid-cols-3 sm:gap-4">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="group relative rounded-erp-lg border border-erp-line-dark/70 bg-erp-navy-3/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-erp-brand/40 hover:bg-erp-navy-3/80 hover:-translate-y-0.5"
                >
                  <span className="inline-flex size-8 sm:size-9 items-center justify-center rounded-erp-sm border border-erp-line-dark/80 bg-erp-navy-2 text-erp-sky transition-colors duration-300 group-hover:border-erp-brand/50 group-hover:bg-erp-brand group-hover:text-white">
                    <ModuleIcon name={pillar.icon} className="size-4 sm:size-4.5" />
                  </span>
                  <h3 className="mt-2.5 text-sm sm:text-base font-semibold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-[0.8125rem] leading-relaxed text-slate-400">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="#demo" size="md" withArrow>
                Book a Demo
              </Button>
              <Button href="#showcase" variant="ghost-dark" size="md">
                See It in Action
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
