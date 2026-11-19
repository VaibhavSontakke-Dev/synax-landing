import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { slug } from "@/i18n/slug";
import { ArrowRight, BookOpen, Check, FileCheck2, FileText, Layers, PackageCheck, Receipt, Settings2, Truck, Undo2, Trash2, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SOLUTION_PATHS } from "../../_data/solution-paths";
import { industryHref } from "../../_data/industries";
import { Block } from "../site-page";
import { SectionTag } from "../section-tag";
import { HeroBand, HeroCopy, ModChips, ProductTail, StartPath, faqItems, relatedProduct } from "./shared";

/**
 * Manufacturing ERP — a long vertical document chain, the customer-material ledger and the Tally split.
 * The words come from messages/*.json ("ProductPage.precision"); the arrays below keep the icons and the module names (the chips
 * are looked up in "Modules" by their English name).
 */

const PASSPORT: { icon: LucideIcon }[] = [{ icon: FileText }, { icon: PackageCheck }, { icon: Layers }, { icon: Wrench }, { icon: FileCheck2 }, { icon: Receipt }];

const CHAIN: { modules: string[] }[] = [
  {
    modules: ["RFQ & quotations", "Customer PO & amendments", "Monthly sales plan", "Order fulfilment"],
  },
  {
    modules: ["Purchase requisition", "Vendor PO & receipt tolerance", "Gate entry, GRN & store inward", "Stock ledger & goods issue"],
  },
  {
    modules: ["Part master & BOM suite", "Operation master & routing", "Route card production order"],
  },
  {
    modules: ["Machine monitoring & jobs", "Stage buy-offs"],
  },
  {
    modules: ["Receiving & final inspection", "FAIR register", "Certificate of conformance"],
  },
  {
    modules: ["Packing & customer invoice", "Delivery challans", "E-invoice (IRN) & e-way bill", "Tally bridge"],
  },
];

const LEDGER: { icon: LucideIcon }[] = [{ icon: BookOpen }, { icon: Settings2 }, { icon: Check }, { icon: Undo2 }, { icon: Trash2 }];

export function ManufacturingErpPage() {
  const t = useTranslations("ProductPage.precision");
  const tm = useTranslations("Modules");
  const ti = useTranslations("Industries");
  return (
    <main>
      {/* Hero: copy left, a framed workshop photo right with a passport card on its corner, the full part passport below */}
      <HeroBand productKey="precision">
        <div className="grid items-center gap-10 lg:items-start lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:gap-y-[clamp(1rem,3vh,2rem)]">
          <HeroCopy
            productKey="precision"
            eyebrow={t("eyebrow")}
            subtitle={t("subtitle")}
            lead={t("lead")}
            secondTourLabel={t("second")}
          />
          <div className="relative mx-auto w-full max-w-xl pb-6 lg:max-w-none">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-brand-solid" aria-hidden="true" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-auto lg:h-[clamp(12rem,38vh,25rem)] border border-slate-200 bg-slate-200">
              <Image
                src="/images/products/manufacturing-erp.webp"
                alt={t("imgAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 540px, 100vw"
                quality={75}
                className="object-cover"
              />
            </div>
            <span className="absolute top-4 right-4 rounded-full border border-slate-200 bg-surface px-3 py-1 text-xs font-semibold text-brand shadow-md">
              {t("badge")}
            </span>
            <div className="absolute bottom-0 left-3 w-60 rounded-xl border border-slate-200 bg-surface p-3 shadow-lg sm:-left-4">
              <p className="text-xs font-bold text-brand">{t("passportCard")}</p>
              <p className="mt-0.5 text-[11px] text-slate-600">{t("passportCardSub")}</p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                <div className="h-1.5 w-[70%] rounded-full bg-blue-900/40" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 rounded-3xl border border-slate-200 bg-surface p-4 shadow-sm sm:p-6 lg:mt-[clamp(1.25rem,4vh,3rem)] lg:py-[clamp(0.75rem,2.2vh,1.5rem)]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <p className="font-bold text-slate-900">{t("passportHead")}</p>
            <p>{t("passportTrace")}</p>
          </div>
          <div className="relative">
            <span
              aria-hidden="true"
              className="synax-prod-dash-x absolute top-[22px] right-[8.3%] left-[8.3%] hidden h-0.5 text-brand/40 lg:block"
            />
            <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {PASSPORT.map((p, i) => {
                const Icon = p.icon;
                const last = i === PASSPORT.length - 1;
                return (
                  <li key={i} className="text-center">
                    <span
                      className={`relative mx-auto flex size-11 items-center justify-center rounded-full border-2 bg-surface ${last ? "border-orange-300 text-brand" : "border-brand-line text-brand"}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      <span className={`absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full text-[11px] font-semibold ${last ? "bg-orange-300 text-orange-950" : "bg-brand-solid text-white"}`}>
                        {i + 1}
                      </span>
                    </span>
                    <p className="mt-2.5 text-[13px] font-bold text-slate-900">{t(`passport.p${i + 1}.title`)}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{t(`passport.p${i + 1}.note`)}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </HeroBand>

      {/* The chain */}
      <Block
        id="chain"
        tag={t("chain.tag")}
        title={t("chain.title")}
        lead={t("chain.lead")}
      >
        <ol className="mx-auto max-w-4xl">
          {CHAIN.map((s, i) => (
            <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {i < CHAIN.length - 1 ? <span aria-hidden="true" className="absolute top-10 bottom-0 left-[17px] w-0.5 bg-slate-200" /> : null}
              <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-solid font-mono text-sm font-semibold text-white">{i + 1}</span>
              <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900">{t(`chain.s${i + 1}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t(`chain.s${i + 1}.copy`)}</p>
                <ModChips items={s.modules.map((m) => tm(slug(m)))} className="mt-3" />
              </div>
            </li>
          ))}
        </ol>
      </Block>

      {/* Customer material */}
      <Block
        id="customer-material"
        tag={t("material.tag")}
        title={t("material.title")}
        lead={t("material.lead")}
        tone="white"
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LEDGER.map((l, i) => {
            const Icon = l.icon;
            return (
              <li key={i} className="relative flex flex-col rounded-2xl border border-t-4 border-slate-200 border-t-emerald-600 bg-surface p-4 shadow-sm">
                <span className="flex size-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">{t("material.step", { n: i + 1 })}</p>
                <h3 className="text-sm font-bold text-slate-900">{t(`material.l${i + 1}.title`)}</h3>
                <p className="mt-1 text-[13px] leading-snug text-slate-600">{t(`material.l${i + 1}.copy`)}</p>
                {i < LEDGER.length - 1 ? <ArrowRight className="absolute top-1/2 -right-3.5 z-10 hidden size-4 -translate-y-1/2 text-slate-400 lg:block" aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ol>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {(["n1", "n2", "n3"] as const).map((n) => (
            <p key={n} className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-slate-700">
              <span className="block font-bold text-slate-900">{t(`material.${n}.title`)}</span>
              {t(`material.${n}.copy`)}
            </p>
          ))}
        </div>
      </Block>

      {/* Tally and GST */}
      <section id="accounts" aria-labelledby="accounts-heading" className="scroll-mt-32 border-b border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
            <SectionTag>{t("accounts.tag")}</SectionTag>
            <h2 id="accounts-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {t("accounts.title")}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              {t("accounts.lead")}
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_1fr]">
            <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-surface p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-900">{t("accounts.inSynax.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("accounts.inSynax.copy")}</p>
            </div>
            <div className="hidden items-center md:flex" aria-hidden="true">
              <span className="synax-prod-dash-x h-0.5 w-10 text-orange-500" />
              <ArrowRight className="-ml-1 size-4 text-orange-500" />
            </div>
            <div className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-surface p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-900">{t("accounts.inTally.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("accounts.inTally.copy")}</p>
            </div>
            <div className="rounded-2xl border border-t-4 border-slate-200 border-t-emerald-600 bg-surface p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-900">{t("accounts.einv.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("accounts.einv.copy")}</p>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            <Truck className="mr-1.5 inline size-4 text-accent" aria-hidden="true" />
            {t.rich("accounts.aerospace", {
              link: (chunks) => (
                <Link href={industryHref("aerospace-defence")} className="font-semibold text-brand hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </section>

      <StartPath solution="precision" path={SOLUTION_PATHS.precision} />

      <ProductTail
        productKey="precision"
        related={[
          relatedProduct("shopfloor", t("related.shopfloor")),
          relatedProduct("ai", t("related.ai")),
          relatedProduct("hrms", t("related.hrms")),
          { label: ti("aerospace-defence.name"), note: t("related.aerospace"), href: industryHref("aerospace-defence") },
        ]}
        faq={faqItems([
          "Do we have to move our accounts out of Tally?",
          "Does Synax generate e-invoices and e-way bills?",
          "Which machines can Synax connect to?",
          "How long does onboarding take?",
        ])}
      />
    </main>
  );
}
