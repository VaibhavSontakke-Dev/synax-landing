import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "./site-page";
import { SectionTag } from "./section-tag";
import { TourButton } from "./demo-buttons";

/**
 * Hero of /security: the headline and three tick points on the left, a shield inside concentric "tenant" rings
 * with four control chips on the right, and below them a row of four cards that follows one posting through the
 * four checks. Bluish background (sky gradient, blue glow, navy base line). Every statement is one the page already
 * made (see `_data/live.ts`); nothing new is claimed. Server component. The slow ring rotation and the halo are off
 * for reduced motion (`synax-sec-*` in globals.css).
 */

/** Message ids under "Security.hero.ticks". */
const TICKS = ["signin", "roles", "ai"] as const;

/** `id` is a message id under "Security.hero.chips". */
const CHIPS: { id: "tenant" | "signin" | "server" | "audit"; pos: string; accent?: boolean }[] = [
  { id: "tenant", pos: "top-[12%] left-0" },
  { id: "signin", pos: "top-[2%] right-2" },
  { id: "server", pos: "right-0 bottom-[16%]" },
  { id: "audit", pos: "bottom-[6%] left-3", accent: true },
];

export function SecurityHero({ gates }: { gates: { id: string; title: string; copy: string }[] }) {
  const t = useTranslations("Security.hero");
  const nav = useTranslations("Nav");
  const last = gates.length - 1;
  return (
    <section aria-labelledby="page-heading" className="relative isolate overflow-hidden border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-page">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="synax-stars absolute inset-0" />
          <div className="absolute inset-0 [background-image:radial-gradient(var(--grid-dot)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent_90%)]" />
        <div className="absolute -top-24 left-[30%] size-96 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-solid" />
        <div className="absolute bottom-0 left-0 h-1 w-32 bg-sky-400" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8 lg:pt-10 lg:pb-12">
        <Breadcrumb items={[{ label: nav("security") }]} />

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionTag lines="start">{t("tag")}</SectionTag>
            <h1 id="page-heading" className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t.rich("title", { b: (chunks) => <span className="text-brand">{chunks}</span> })}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
              {t("lead")}
            </p>
            <div className="mt-7">
              <TourButton title="Synax Security Overview" />
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-medium text-slate-700" aria-label={t("highlightsAria")}>
              {TICKS.map((tick) => (
                <li key={tick} className="flex items-center gap-1.5">
                  <span className="text-brand" aria-hidden="true">
                    ✓
                  </span>
                  {t(`ticks.${tick}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Tenant rings */}
          <div
            className="relative mx-auto aspect-square w-full max-w-[24rem]"
            role="img"
            aria-label={t("ringsAria")}
          >
            <span className="synax-sec-spin absolute inset-0 rounded-full border-2 border-dashed border-brand-line/30" aria-hidden="true" />
            <span className="absolute inset-[11%] rounded-full border border-slate-300 bg-surface/60" aria-hidden="true" />
            <span className="absolute inset-[23%] rounded-full border border-brand-line/30 bg-sky-100/80" aria-hidden="true" />
            <span className="synax-sec-halo absolute inset-[36%] flex items-center justify-center rounded-full bg-brand-solid text-white shadow-xl">
              <ShieldCheck className="size-1/2" aria-hidden="true" />
            </span>
            {CHIPS.map((c) => (
              <span
                key={c.id}
                className={`absolute ${c.pos} rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap shadow-md ${
                  c.accent ? "bg-orange-300 text-blue-950" : "border border-slate-300 bg-surface text-brand"
                }`}
              >
                {t(`chips.${c.id}`)}
              </span>
            ))}
          </div>
        </div>

        {/* One posting through four checks */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">{t("gates")}</p>
          <ol className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-stretch lg:gap-0">
            {gates.map((g, i) => {
              const end = i === last;
              return (
                <li key={g.id} className="flex flex-1 items-stretch">
                  <div className={`w-full rounded-xl border bg-surface p-4 shadow-sm ${end ? "border-orange-300" : "border-slate-300"}`}>
                    <span
                      className={`flex size-6 items-center justify-center rounded-full font-mono text-xs font-semibold ${
                        end ? "bg-orange-300 text-blue-950" : "bg-brand-solid text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <p className="mt-2 text-sm font-bold text-slate-900">{g.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{g.copy}</p>
                  </div>
                  {i < last ? <span className="synax-prod-dash-x hidden h-0.5 w-6 shrink-0 self-center text-brand/40 lg:block" aria-hidden="true" /> : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
