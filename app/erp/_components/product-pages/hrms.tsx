import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { slug } from "@/i18n/slug";
import { BarChart3, CalendarCheck, CircleCheck, Factory, Fingerprint, LogOut, UserPlus, UserRoundCheck, Wallet, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SOLUTION_PATHS } from "../../_data/solution-paths";
import { industryHref } from "../../_data/industries";
import { Block } from "../site-page";
import { Reveal } from "../reveal";
import { HeroBand, HeroCopy, ModChips, ProductTail, StartPath, faqItems, relatedProduct } from "./shared";

/**
 * HRMS — a month of attendance in the hero, a six-stage lifecycle, a monthly cycle and a plant/office split.
 * The words come from messages/*.json ("ProductPage.hrms"); the arrays keep icons, keys and module names.
 */

type Day = "p" | "l" | "w" | "o" | "-";
/** A sample month (Monday first). p present, l leave, w work from home, o overtime, - weekend. */
const MONTH: Day[] = "ppppp--ppwpp--pppop--ppplp--pwppp--".split("") as Day[];
const DAY_STYLE: Record<Day, string> = {
  p: "bg-brand-solid",
  l: "bg-amber-300",
  w: "bg-blue-900/40",
  o: "bg-orange-300",
  "-": "bg-slate-200",
};
const LEGEND: Day[] = ["p", "l", "w", "o"];

const LIFECYCLE: { icon: LucideIcon; modules: string[] }[] = [
  {
    icon: UserPlus,
    modules: ["Recruitment and interviews"],
  },
  {
    icon: UserRoundCheck,
    modules: ["Employee records", "Employee self-service"],
  },
  {
    icon: CalendarCheck,
    modules: ["Attendance, leave & WFH", "Biometric device sync", "Break pass management"],
  },
  {
    icon: CircleCheck,
    modules: ["Attendance & OT approval"],
  },
  {
    icon: Wallet,
    modules: ["Payroll with approvals"],
  },
  {
    icon: LogOut,
    modules: ["Department KPIs", "Performance management", "Offboarding", "Budget planner"],
  },
];

const MONTHLY = ["m1", "m2", "m3", "m4", "m5"] as const;

export function HrmsPage() {
  const t = useTranslations("ProductPage.hrms");
  const tm = useTranslations("Modules");
  const ti = useTranslations("Industries");
  const tf = useTranslations("ProductPage.hrms.faq");
  return (
    <main>
      {/* Hero: centred copy, a panoramic team photo, and a month of attendance overlapping its bottom edge */}
      <HeroBand productKey="hrms">
        <div className="lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
        <HeroCopy
          productKey="hrms"
          centerBelowLg
          eyebrow={t("eyebrow")}
          subtitle={t("subtitle")}
          lead={t("lead")}
        />
        <div>
        <div className="relative mx-auto mt-8 h-56 max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-md sm:h-72 lg:mt-0 lg:h-[clamp(13rem,34vh,22rem)]">
          <Image
            src="/images/products/hrms.webp"
            alt={t("imgAlt")}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            quality={75}
            className="object-cover object-[50%_60%]"
          />
        </div>
        <div className="relative mx-auto -mt-16 max-w-xl rounded-3xl border border-slate-200 bg-surface p-5 shadow-xl sm:-mt-20 lg:-mt-24 lg:max-w-sm">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <p className="font-bold text-slate-900">{t("monthTitle")}</p>
            <p>{t("sample")}</p>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-slate-500" aria-hidden="true">
            {(["d1", "d2", "d3", "d4", "d5", "d6", "d7"] as const).map((d) => (
              <span key={d}>{t(`days.${d}`)}</span>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5" role="img" aria-label={t("monthAria")}>
            {MONTH.map((d, i) => (
              <span key={i} className={`aspect-square rounded-md lg:aspect-auto lg:h-6 ${DAY_STYLE[d]}`} />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600" aria-label={t("legendAria")}>
            {LEGEND.map((l) => (
              <li key={l} className="flex items-center gap-1.5">
                <span className={`size-2.5 rounded-sm ${DAY_STYLE[l]}`} aria-hidden="true" />
                {t(`legend.${l}`)}
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-2">
            {[
              { key: "a", orange: false },
              { key: "b", orange: false },
              { key: "c", orange: true },
            ].map((p) => (
              <li key={p.key} className={`rounded-full px-3 py-1 text-xs font-semibold ${p.orange ? "bg-orange-300 text-orange-950" : "bg-brand-solid text-white"}`}>
                {t(`pill.${p.key}`)}
              </li>
            ))}
          </ul>
        </div>
        </div>
        </div>
      </HeroBand>

      {/* Lifecycle */}
      <Block
        id="lifecycle"
        tag={t("lifecycle.tag")}
        title={t("lifecycle.title")}
        lead={t("lifecycle.lead")}
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LIFECYCLE.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={i} as="li" delay={(i % 3) * 70} className="flex">
                <div className="flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-surface p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold tracking-wider text-accent-strong uppercase">{t("lifecycle.stage", { n: i + 1 })}</p>
                      <h3 className="text-base font-bold text-slate-900">{t(`lifecycle.s${i + 1}.title`)}</h3>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{t(`lifecycle.s${i + 1}.copy`)}</p>
                  <ModChips items={s.modules.map((m) => tm(slug(m)))} className="mt-4" />
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Block>

      {/* Monthly cycle */}
      <Block
        id="month"
        tag={t("month.tag")}
        title={t("month.title")}
        lead={t("month.lead")}
        tone="white"
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {MONTHLY.map((m, i) => (
            <li key={m} className={`rounded-2xl border border-t-4 border-slate-200 bg-surface p-4 shadow-sm ${i === 3 ? "border-t-orange-600" : "border-t-blue-900"}`}>
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">{t("month.step", { n: i + 1 })}</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{t(`month.${m}`)}</p>
            </li>
          ))}
        </ol>
      </Block>

      {/* Plant and office */}
      <Block
        id="plant-office"
        tag={t("plantOffice.tag")}
        title={t("plantOffice.title")}
        lead={t("plantOffice.lead")}
      >
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-surface p-5 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-brand">
              <Factory className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-900">{t("plantOffice.plantTitle")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t("plantOffice.plantCopy")}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand">
              <Fingerprint className="size-4" aria-hidden="true" />
              {t.rich("plantOffice.plantLink", {
                link: (chunks) => (
                  <Link href={industryHref("plant-workforce-hcm")} className="underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-surface p-5 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-accent-strong">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-base font-bold text-slate-900">{t("plantOffice.officeTitle")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t("plantOffice.officeCopy")}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-accent-strong">
              <BarChart3 className="size-4" aria-hidden="true" />
              {t("plantOffice.officeNote")}
            </p>
          </div>
        </div>
      </Block>

      <StartPath solution="workforce" path={SOLUTION_PATHS.workforce} />

      <ProductTail
        productKey="hrms"
        related={[
          relatedProduct("precision", t("related.precision")),
          relatedProduct("it", t("related.it")),
          relatedProduct("staffing", t("related.staffing")),
          { label: ti("plant-workforce-hcm.name"), note: t("related.plant"), href: industryHref("plant-workforce-hcm") },
        ]}
        faq={faqItems(["Is Synax free for small manufacturers?", "How long does onboarding take?"], [
          { q: tf("q1"), a: tf("a1") },
          { q: tf("q2"), a: tf("a2") },
        ])}
      />
    </main>
  );
}
