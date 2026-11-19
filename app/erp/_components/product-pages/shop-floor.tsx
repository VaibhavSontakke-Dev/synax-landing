import Image from "next/image";
import { useTranslations } from "next-intl";
import { CalendarRange, Cpu, Gauge, Hand, PlugZap, ScanLine, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { industryHref } from "../../_data/industries";
import { Block } from "../site-page";
import { HeroBand, HeroCopy, ModChips, ProductTail, faqItems, relatedProduct } from "./shared";

/**
 * Shop Floor & Machine Monitoring — a floor plan hero with the copy card on top, three stacked layers and the connection options.
 * The words come from messages/*.json ("ProductPage.shopfloor"); the arrays keep icons, states and keys.
 */

const MACHINES: { n: number; state: "run" | "idle" | "alarm" | "manual"; pct: number }[] = [
  { n: 1, state: "run", pct: 82 },
  { n: 2, state: "run", pct: 64 },
  { n: 3, state: "idle", pct: 30 },
  { n: 4, state: "run", pct: 90 },
  { n: 5, state: "alarm", pct: 12 },
  { n: 6, state: "run", pct: 70 },
  { n: 0, state: "manual", pct: 0 },
  { n: 7, state: "run", pct: 55 },
  { n: 8, state: "run", pct: 76 },
];
const STATE_STYLE = {
  run: { ring: "border-slate-300", dot: "bg-brand-solid", bar: "bg-blue-900/40" },
  idle: { ring: "border-slate-300", dot: "bg-slate-400", bar: "bg-slate-400" },
  alarm: { ring: "border-orange-300", dot: "bg-orange-300", bar: "bg-slate-400" },
  manual: { ring: "border-slate-300", dot: "bg-slate-300", bar: "bg-slate-300" },
};

/** `count` is the number of module chips ("ProductPage.shopfloor.layers.l<n>.m<k>"). */
const LAYERS: { tone: string; count: number }[] = [
  { tone: "border-t-blue-900", count: 4 },
  { tone: "border-t-orange-600", count: 3 },
  { tone: "border-t-emerald-600", count: 5 },
];

const CONNECT: { icon: LucideIcon }[] = [{ icon: PlugZap }, { icon: Server }, { icon: Hand }];

export function ShopFloorPage() {
  const t = useTranslations("ProductPage.shopfloor");
  const ti = useTranslations("Industries");
  const tf = useTranslations("ProductPage.shopfloor.faq");
  return (
    <main>
      {/* Hero: the photo runs off the right edge of the page and fades into the background, machine cards on top of it */}
      <HeroBand productKey="shopfloor">
        <div className="relative lg:flex lg:min-h-[clamp(26rem,64vh,40rem)] lg:items-start">
          <div
            className="pointer-events-none absolute inset-y-0 right-[calc(50%-50vw)] left-[38%] hidden [mask-image:linear-gradient(to_right,transparent,#000_40%)] lg:block"
            aria-hidden="true"
          >
            <Image
              src="/images/products/shop-floor.webp"
              alt=""
              fill
              sizes="62vw"
              quality={75}
              className="object-cover object-[60%_50%]"
            />
          </div>

          <div className="relative z-10 max-w-xl lg:max-w-md">
            <HeroCopy
              productKey="shopfloor"
              compact
              eyebrow={t("eyebrow")}
              subtitle={t("subtitle")}
              lead={t("lead")}
            />
          </div>

          {/* Small screens: photo banner below the copy */}
          <div className="relative mt-6 h-52 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:hidden">
            <Image src="/images/products/shop-floor.webp" alt={t("imgAlt")} fill sizes="100vw" quality={70} className="object-cover" />
          </div>

          <ul
            className="relative mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:absolute lg:top-8 lg:right-4 lg:mt-0 lg:block lg:w-60 lg:space-y-3 xl:right-10"
            aria-label={t("boardAria")}
          >
            {MACHINES.filter((m) => [4, 3, 5].includes(m.n)).map((m) => {
              const s = STATE_STYLE[m.state];
              return (
                <li key={m.n} className={`rounded-xl border-2 bg-surface p-3 shadow-lg ${s.ring}`}>
                  <p className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
                    <span className={`size-2.5 rounded-full ${s.dot} ${m.state === "alarm" ? "synax-prod-pulse" : ""}`} aria-hidden="true" />
                    {m.n ? t("machine", { n: String(m.n).padStart(2, "0") }) : t("manualMachine")}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-tight text-slate-600">{t(`state.${m.state}`)}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                    <div className={`h-1.5 rounded-full ${s.bar}`} style={{ width: `${m.pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </HeroBand>

      {/* Three layers */}
      <Block
        id="layers"
        tag={t("layers.tag")}
        title={t("layers.title")}
        lead={t("layers.lead")}
      >
        <ol className="mx-auto max-w-5xl space-y-4">
          {LAYERS.map((l, i) => (
            <li key={i} className={`grid gap-4 rounded-2xl border border-t-4 border-slate-200 bg-surface p-5 shadow-sm md:grid-cols-[170px_1fr] ${l.tone}`}>
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-solid font-mono text-sm font-semibold text-white">{i + 1}</span>
                <h3 className="text-lg font-extrabold text-slate-900">{t(`layers.l${i + 1}.title`)}</h3>
              </div>
              <div>
                <p className="text-sm leading-relaxed text-slate-600">{t(`layers.l${i + 1}.copy`)}</p>
                <ModChips items={Array.from({ length: l.count }, (_, k) => t(`layers.l${i + 1}.m${k + 1}`))} className="mt-3" />
              </div>
            </li>
          ))}
        </ol>
      </Block>

      {/* Connect */}
      <Block
        id="connect"
        tag={t("connect.tag")}
        title={t("connect.title")}
        lead={t("connect.lead")}
        tone="white"
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {CONNECT.map((c, i) => {
            const Icon = c.icon;
            return (
              <li key={i} className="rounded-2xl border border-t-4 border-slate-200 border-t-emerald-600 bg-surface p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">{t(`connect.c${i + 1}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t(`connect.c${i + 1}.copy`)}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Before and after */}
      <Block
        id="record"
        tag={t("record.tag")}
        title={t("record.title")}
        lead={t("record.lead")}
      >
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-slate-400 bg-surface p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <CalendarRange className="size-4 text-slate-400" aria-hidden="true" />
              {t("record.withoutTitle")}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t("record.withoutCopy")}</p>
          </div>
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-emerald-600 bg-surface p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Cpu className="size-4 text-emerald-600" aria-hidden="true" />
              {t("record.withTitle")}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t("record.withCopy")}</p>
          </div>
        </div>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <ScanLine className="size-4 text-accent" aria-hidden="true" />
            {t("record.barcode")}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge className="size-4 text-accent" aria-hidden="true" />
            {t("record.oee")}
          </span>
        </p>
      </Block>

      <ProductTail
        productKey="shopfloor"
        related={[
          relatedProduct("precision", t("related.precision")),
          relatedProduct("ai", t("related.ai")),
          relatedProduct("hrms", t("related.hrms")),
          { label: ti("industrial-machinery-equipment.name"), note: t("related.machinery"), href: industryHref("industrial-machinery-equipment") },
        ]}
        faq={faqItems(["Which machines can Synax connect to?", "How long does onboarding take?"], [
          { q: tf("q1"), a: tf("a1") },
          { q: tf("q2"), a: tf("a2") },
        ])}
      />
    </main>
  );
}
