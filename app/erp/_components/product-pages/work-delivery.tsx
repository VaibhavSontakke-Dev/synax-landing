import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, BriefcaseBusiness, ClipboardList, Headset, Laptop, LayoutDashboard, MessagesSquare, Phone, UserCheck, UsersRound, Video, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Block } from "../site-page";
import { Reveal } from "../reveal";
import { TourButton } from "../demo-buttons";
import { HeroBand, HeroCopy, ProductTail, faqItems, relatedProduct } from "./shared";

/**
 * Work & Delivery Management — a tilted stack of cards, three connected lanes and a card per role.
 * The words come from messages/*.json ("ProductPage.it"); the arrays keep icons, counts and keys.
 */

/** Number of items in each lane (the words are "ProductPage.it.lanes.l<n>.i<m>"). */
const LANE_ITEMS = [3, 3, 4];

const ROLES: { icon: LucideIcon }[] = [{ icon: BriefcaseBusiness }, { icon: UserCheck }, { icon: ClipboardList }, { icon: Wallet }];

const AROUND: { icon: LucideIcon }[] = [{ icon: MessagesSquare }, { icon: Phone }, { icon: Video }, { icon: Headset }, { icon: UsersRound }, { icon: LayoutDashboard }, { icon: Laptop }];

export function WorkDeliveryPage() {
  const t = useTranslations("ProductPage.it");
  const tf = useTranslations("ProductPage.it.faq");
  return (
    <main>
      {/* Hero: copy left, a team-at-the-board photo right with three lane cards over its edge */}
      <HeroBand productKey="it">
        <div className="grid items-center gap-10 lg:items-start lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <HeroCopy
            productKey="it"
            eyebrow={t("eyebrow")}
            subtitle={t("subtitle")}
            lead={t("lead")}
          />
          <div className="relative lg:pl-16">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl lg:aspect-auto lg:h-[clamp(15rem,52vh,31rem)] border border-slate-200 bg-slate-200 shadow-md">
              <Image
                src="/images/products/work-delivery.webp"
                alt={t("imgAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                quality={75}
                className="object-cover"
              />
            </div>
            <span className="absolute top-4 right-4 rounded-full bg-brand-solid px-3 py-1 text-xs font-semibold text-white shadow-md">{t("badge")}</span>
            <ul className="mt-3 grid grid-cols-3 gap-2 lg:absolute lg:top-8 lg:left-0 lg:mt-0 lg:block lg:w-44 lg:space-y-3" aria-label={t("cardsAria")}>
              {(["c1", "c2", "c3"] as const).map((c, i) => (
                <li key={c} className={`rounded-xl border border-l-4 border-slate-200 bg-surface p-2.5 shadow-lg ${i === 2 ? "border-l-orange-300" : "border-l-blue-900"}`}>
                  <p className="text-xs font-bold text-brand">{t(`card.${c}.t`)}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-600">{t(`card.${c}.n`)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </HeroBand>

      {/* Three lanes */}
      <Block
        id="lanes"
        tag={t("lanes.tag")}
        title={t("lanes.title")}
        lead={t("lanes.lead")}
      >
        <ol className="grid gap-5 lg:grid-cols-3">
          {LANE_ITEMS.map((count, i) => (
            <Reveal key={i} as="li" delay={i * 70} className="relative flex">
              <div className="flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-surface p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-solid font-mono text-sm font-semibold text-white">{i + 1}</span>
                  <h3 className="text-base font-bold text-slate-900">{t(`lanes.l${i + 1}.title`)}</h3>
                </div>
                <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-2.5 text-[13px] leading-snug text-slate-700">{t(`lanes.l${i + 1}.copy`)}</p>
                <ul className="mt-4 space-y-2.5">
                  {Array.from({ length: count }, (_, m) => m + 1).map((m) => (
                    <li key={m} className="border-t border-slate-100 pt-2.5 first:border-0 first:pt-0">
                      <p className="text-sm font-semibold text-slate-900">{t(`lanes.l${i + 1}.i${m}.name`)}</p>
                      <p className="text-[13px] text-slate-600">{t(`lanes.l${i + 1}.i${m}.note`)}</p>
                    </li>
                  ))}
                </ul>
              </div>
              {i < LANE_ITEMS.length - 1 ? (
                <ArrowRight className="absolute top-1/2 -right-3.5 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-surface text-orange-500 lg:block" aria-hidden="true" />
              ) : null}
            </Reveal>
          ))}
        </ol>
      </Block>

      {/* Roles */}
      <Block id="roles" tag={t("roles.tag")} title={t("roles.title")} lead={t("roles.lead")} tone="white">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            return (
              <li key={i} className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-brand">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[15px] font-bold text-slate-900">{t(`roles.r${i + 1}.role`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(`roles.r${i + 1}.sees`)}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Around the work */}
      <Block id="around" tag={t("around.tag")} title={t("around.title")} lead={t("around.lead")}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AROUND.map((a, i) => {
            const Icon = a.icon;
            return (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-100 text-brand">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t(`around.a${i + 1}.title`)}</h3>
                  <p className="text-[13px] text-slate-600">{t(`around.a${i + 1}.copy`)}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex justify-center">
          <TourButton title="Assets Module Tour">{t("around.assetsTour")}</TourButton>
        </div>
      </Block>

      <ProductTail
        productKey="it"
        related={[
          relatedProduct("hrms", t("related.hrms")),
          relatedProduct("staffing", t("related.staffing")),
          relatedProduct("ai", t("related.ai")),
          relatedProduct("precision", t("related.precision")),
        ]}
        faq={faqItems(["Is Synax free for small manufacturers?", "How long does onboarding take?"], [{ q: tf("q1"), a: tf("a1") }])}
      />
    </main>
  );
}
