import Image from "next/image";
import { useTranslations } from "next-intl";
import { ClipboardCheck, RefreshCw, ShieldCheck, Timer, UserRound, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SOLUTION_PATHS } from "../../_data/solution-paths";
import { Block } from "../site-page";
import { HeroBand, HeroCopy, ProductTail, StartPath, faqItems, relatedProduct } from "./shared";

/**
 * Staffing & Resource Management — a match board in the hero (mirrored), a narrowing hiring funnel and two sides.
 * The words come from messages/*.json ("ProductPage.staffing"); the arrays keep icons, widths and keys.
 */

const STAGE_WIDTHS = ["100%", "88%", "76%", "64%", "52%", "40%"];

const AFTER: { icon: LucideIcon }[] = [{ icon: Users }, { icon: RefreshCw }, { icon: Timer }];

const CANDIDATES = [
  { letter: "A", stage: "interview", pct: 40, done: false },
  { letter: "B", stage: "offer", pct: 70, done: false },
  { letter: "C", stage: "deployed", pct: 100, done: true },
] as const;

export function StaffingPage() {
  const t = useTranslations("ProductPage.staffing");
  const tf = useTranslations("ProductPage.staffing.faq");
  return (
    <main>
      {/* Hero (mirrored): an interview photo cropped to a circle with the stages orbiting it, copy right */}
      <HeroBand productKey="staffing">
        <div className="grid items-center gap-12 lg:items-start lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1" aria-label={t("matchAria")}>
            <div className="relative mx-auto size-72 sm:size-80">
              <span className="absolute inset-0 rounded-full border-2 border-dashed border-brand-line/30" aria-hidden="true" />
              <div className="absolute inset-5 overflow-hidden rounded-full border-4 border-surface bg-slate-200 shadow-lg">
                <Image
                  src="/images/products/staffing.webp"
                  alt={t("imgAlt")}
                  fill
                  priority
                  sizes="320px"
                  quality={75}
                  className="object-cover object-[32%_30%]"
                />
              </div>
              <span className="absolute top-6 left-0 rounded-full border border-slate-300 bg-surface px-3 py-1 text-xs font-semibold text-brand shadow-md">{t("orbit.requirement")}</span>
              <span className="absolute top-0 right-6 rounded-full border border-slate-300 bg-surface px-3 py-1 text-xs font-semibold text-brand shadow-md">{t("orbit.interviews")}</span>
              <span className="absolute right-0 bottom-14 rounded-full bg-brand-solid px-3 py-1 text-xs font-semibold text-white shadow-md">{t("orbit.offer")}</span>
              <span className="absolute bottom-6 left-2 rounded-full border border-slate-300 bg-surface px-3 py-1 text-xs font-semibold text-brand shadow-md">{t("orbit.deployment")}</span>
              <ul className="absolute -bottom-16 left-1/2 w-64 -translate-x-1/2 space-y-1.5 rounded-xl border border-slate-200 bg-surface p-2.5 shadow-lg">
                {CANDIDATES.map((c) => (
                  <li key={c.letter}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <p className="flex items-center gap-1.5 font-bold text-slate-900">
                        <UserRound className="size-3.5 text-slate-400" aria-hidden="true" />
                        {t("candidate", { letter: c.letter })}
                      </p>
                      <p className={`font-semibold ${c.done ? "text-slate-600" : "text-brand"}`}>{t(`stageName.${c.stage}`)}</p>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-slate-200">
                      <div className={`h-1 rounded-full ${c.done ? "bg-blue-900/40" : "bg-slate-400"}`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-20 text-center text-xs text-slate-500">{t("illustration")}</p>
          </div>
          <div className="order-1 lg:order-2">
            <HeroCopy
              productKey="staffing"
              eyebrow={t("eyebrow")}
              subtitle={t("subtitle")}
              lead={t("lead")}
            />
          </div>
        </div>
      </HeroBand>

      {/* Funnel */}
      <Block
        id="pipeline"
        tag={t("pipeline.tag")}
        title={t("pipeline.title")}
        lead={t("pipeline.lead")}
      >
        <ol className="mx-auto max-w-4xl space-y-3">
          {STAGE_WIDTHS.map((width, i) => (
            <li key={i} className="grid items-center gap-2 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-5">
              <div
                className="flex items-center gap-3 rounded-xl border border-orange-200 px-4 py-3"
                style={{ width, backgroundColor: `rgba(249, 115, 22, ${0.16 - i * 0.02})` }}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-solid text-[11px] font-semibold text-white">{i + 1}</span>
                <p className="text-sm font-bold text-slate-900">{t(`pipeline.s${i + 1}.title`)}</p>
              </div>
              <p className="text-[13px] leading-relaxed text-slate-600">{t(`pipeline.s${i + 1}.copy`)}</p>
            </li>
          ))}
        </ol>
      </Block>

      {/* After day one */}
      <Block id="after" tag={t("after.tag")} title={t("after.title")} lead={t("after.lead")} tone="white">
        <ul className="grid gap-5 md:grid-cols-3">
          {AFTER.map((a, i) => {
            const Icon = a.icon;
            return (
              <li key={i} className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-surface p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-accent-strong">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">{t(`after.a${i + 1}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t(`after.a${i + 1}.copy`)}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Two sides */}
      <Block
        id="sides"
        tag={t("sides.tag")}
        title={t("sides.title")}
        lead={t("sides.lead")}
      >
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-surface p-5 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-brand">
              <ClipboardCheck className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-900">{t("sides.customerTitle")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t("sides.customerCopy")}</p>
          </div>
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-surface p-5 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-accent-strong">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-900">{t("sides.candidateTitle")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t("sides.candidateCopy")}</p>
          </div>
        </div>
      </Block>

      <StartPath solution="staffing" path={SOLUTION_PATHS.staffing} />

      <ProductTail
        productKey="staffing"
        related={[
          relatedProduct("hrms", t("related.hrms")),
          relatedProduct("it", t("related.it")),
          relatedProduct("ai", t("related.ai")),
          relatedProduct("precision", t("related.precision")),
        ]}
        faq={faqItems(["Is Synax free for small manufacturers?", "How long does onboarding take?"], [
          { q: tf("q1"), a: tf("a1") },
          { q: tf("q2"), a: tf("a2") },
        ])}
      />
    </main>
  );
}
