import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BarChart3, ClipboardList, FileBarChart, LayoutDashboard, LineChart, Lock, ShieldCheck, Sparkles, Truck, Wallet, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Block } from "../site-page";
import { Reveal } from "../reveal";
import { AiAskBoard } from "../ai-ask-board";
import { HeroBand, HeroCopy, ProductTail, faqItems, relatedProduct } from "./shared";

/**
 * AI & Business Intelligence — the approval gate first, then the agents, the questions and the analytics.
 * The words come from messages/*.json ("ProductPage.ai"); the arrays keep icons, accents and keys.
 */

const GATE: { accent: "navy" | "orange" }[] = [{ accent: "navy" }, { accent: "navy" }, { accent: "orange" }, { accent: "orange" }];

const AGENTS: { icon: LucideIcon }[] = [{ icon: ClipboardList }, { icon: Sparkles }, { icon: Truck }, { icon: Wallet }, { icon: ShieldCheck }, { icon: Wrench }];

const BI: { icon: LucideIcon }[] = [{ icon: LayoutDashboard }, { icon: LineChart }, { icon: FileBarChart }, { icon: BarChart3 }];

export function AiBiPage() {
  const t = useTranslations("ProductPage.ai");
  const tn = useTranslations("Nav");
  return (
    <main>
      {/* Hero: copy left, an animated "Ask Synax AI" chat board right (same style as the home page's "Answered Instantly" section) */}
      <HeroBand productKey="ai">
        <div className="lg:grid lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-12">
        <div className="lg:col-start-1 lg:row-start-1">
          <HeroCopy
            productKey="ai"
            centerBelowLg
            compact
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
            lead={t("lead")}
          />
        </div>
        <div className="mx-auto mt-8 w-full max-w-xl lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mt-0 lg:max-w-none lg:self-start">
          <AiAskBoard />
        </div>
        <ol className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs font-semibold lg:col-start-1 lg:row-start-2 lg:mx-0 lg:mt-6 lg:justify-start" aria-label={t("gateAria")}>
          {GATE.map((g, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 ${g.accent === "orange" ? "bg-orange-300 text-orange-950" : "bg-brand-solid text-white"}`}>
                {i + 1}. {t(`gate.g${i + 1}`)}
              </span>
              {i < GATE.length - 1 ? <span className="text-slate-400" aria-hidden="true">→</span> : null}
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-4 max-w-md rounded-xl border border-dashed border-orange-300 bg-surface/70 px-4 py-2.5 text-center text-xs text-slate-600 lg:col-start-1 lg:row-start-3 lg:mx-0 lg:text-left">
          {t("gateNote")}
        </p>
        </div>
      </HeroBand>

      {/* Why approval first */}
      <Block
        id="approval"
        tag={t("approval.tag")}
        title={t("approval.title")}
        lead={t("approval.lead")}
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n, i) => (
            <Reveal key={n} as="li" delay={i * 70} className="flex">
              <div className="flex w-full flex-col rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-surface p-5 shadow-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-orange-300 font-mono text-sm font-semibold text-orange-950">{i + 1}</span>
                <h3 className="mt-3 text-[15px] font-bold text-slate-900">{t(`approval.l${n}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t(`approval.l${n}.copy`)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
          <Lock className="size-4 text-accent" aria-hidden="true" />
          <span>
            {t.rich("approval.security", {
              link: (chunks) => (
                <Link href="/security" className="font-semibold text-brand hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </p>
      </Block>

      {/* Agents */}
      <Block id="agents" tag={t("agents.tag")} title={t("agents.title")} lead={t("agents.lead")} tone="white">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a, i) => {
            const Icon = a.icon;
            return (
              <li key={i} className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-surface p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-accent-strong">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">{t(`agents.a${i + 1}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t(`agents.a${i + 1}.copy`)}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Ask Synax */}
      <Block id="ask" tag={t("ask.tag")} title={t("ask.title")} lead={t("ask.lead")}>
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-surface p-5 shadow-sm">
            <p className="text-[11px] font-bold tracking-wider text-brand uppercase">{t("ask.youAsk")}</p>
            <ul className="mt-3 space-y-2">
              {(["q1", "q2", "q3"] as const).map((q) => (
                <li key={q} className="rounded-xl rounded-bl-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                  {t(`ask.${q}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-surface p-5 shadow-sm">
            <p className="text-[11px] font-bold tracking-wider text-accent-strong uppercase">{t("ask.answers")}</p>
            <p className="mt-3 rounded-xl rounded-bl-sm border border-orange-200 bg-orange-50/70 px-3 py-2 text-sm text-slate-800">
              {t("ask.answer")}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
              {t("ask.approve")} <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Block>

      {/* Business intelligence */}
      <Block id="bi" tag={t("bi.tag")} title={t("bi.title")} lead={t("bi.lead")} tone="white">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BI.map((b, i) => {
            const Icon = b.icon;
            return (
              <li key={i} className="rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-brand">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[15px] font-bold text-slate-900">{t(`bi.b${i + 1}.title`)}</h3>
                <p className="mt-1 text-sm text-slate-600">{t(`bi.b${i + 1}.copy`)}</p>
              </li>
            );
          })}
        </ul>
      </Block>

      <ProductTail
        productKey="ai"
        related={[
          relatedProduct("precision", t("related.precision")),
          relatedProduct("shopfloor", t("related.shopfloor")),
          relatedProduct("hrms", t("related.hrms")),
          { label: tn("security"), note: t("related.security"), href: "/security" },
        ]}
        faq={faqItems(["Can the AI change our data on its own?", "Who is Synax built for?", "How long does onboarding take?"])}
      />
    </main>
  );
}
