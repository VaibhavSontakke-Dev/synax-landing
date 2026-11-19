"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Users,
  ArrowRight,
  BarChart3,
  Factory,
  MessageSquare,
  Bot,
  Send,
} from "lucide-react";
import { Rollout } from "./rollout";
import { HomeMotion } from "./home-motion";
import { Hero } from "./home-hero";
import { Purpose } from "./home-purpose";
import { Products } from "./home-products";
import { Sectors } from "./home-sectors";
import { Comparison } from "./home-comparison";
import { Link } from "@/i18n/navigation";
import { Usp } from "./home-usp";
import { DemoButton, TourButton } from "./demo-buttons";
import { hrefFor } from "../_data/products";
import { SectionTag } from "./section-tag";
import { useDemo } from "./demo-provider";
import { LIVE_CLIENTS, LIVE_SECURITY } from "../_data/live";
import { ModuleIcon } from "./icons";

/* =========================================================================
   TYPES
   ========================================================================= */

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

/**
 * The home page body. The header, footer, demo/tour modals and page frame now come from
 * <ErpShell> (shared with the product routes); each product has its own route under /products.
 */
export default function Landingpage() {
  const tb = useTranslations("Buttons");
  const { openDemo, openTour, modalOpen } = useDemo();
  // The mobile sticky CTA only appears once the hero's own buttons have scrolled away,
  // so it never covers them.
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <HomeView openModal={openDemo} openTourModal={openTour} />

      {/* Sticky mobile CTA: keeps the primary conversion action in reach below the hero. */}
      {showStickyCta && !modalOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-surface/95 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => openDemo()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-solid py-3 text-sm font-semibold text-white hover:bg-brand-solid-hover"
          >
            <span>{tb("scheduleDemo")}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </>
  );
}

/* =========================================================================
   1. MAIN LANDING HUB VIEW (HOME)
   ========================================================================= */

interface HomeViewProps {
  openModal: (prodName?: string) => void;
  openTourModal: (title?: string) => void;
}

function HomeView({ openModal, openTourModal }: HomeViewProps) {
  const t = useTranslations("Home");
  const live = useTranslations("Live");
  return (
    <main>
      {/* Scroll reveals and parallax for the whole page: see home-motion.tsx and "Home page motion" in globals.css */}
      <HomeMotion />

      {/* HERO: see home-hero.tsx */}
      <Hero
        onScheduleDemo={() => openModal()}
        onWatchOverview={() => openTourModal("Synax Platform Overview")}
      />

      {/* USP: AI, live machines, Tally and GST */}
      <Usp />


      {/* =========================================================================
         Product Ecosystem
         ========================================================================= */}
      <Products />

      {/* <Modules /> */}

      {/* =========================================================================
         Solutions by Industry / Business Need
         ========================================================================= */}
      <Sectors />

      <Rollout />

      {/* =========================================================================
         THE LARGER PURPOSE BEHIND THE SYNAX ECOSYSTEM
         ========================================================================= */}
      <Purpose />

      {/* =========================================================================
         SYNAX AI — INTELLIGENT ENTERPRISE ASSISTANT
         ========================================================================= */}
      <section id="synax-ai" className="keep-light-palette scroll-mt-20 py-10 sm:py-12 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
        {/* Ambient glow */}
        <div data-parallax="0.14" className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div data-parallax="0.22" className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div data-anim-stagger="rise" className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <SectionTag tone="dark">{t("ai.tag")}</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.rich("ai.title", {
                em: (chunks) => (
                  <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">{chunks}</span>
                ),
              })}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {t("ai.lead")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Capability Cards */}
            <div data-anim-stagger="rise" className="space-y-4">
              {[
                {
                  icon: <BarChart3 className="w-4 h-4" />,
                  color: "text-orange-300 bg-orange-500/10 border-orange-500/20",
                  key: "live",
                },
                {
                  icon: <Users className="w-4 h-4" />,
                  color: "text-slate-300 bg-slate-500/10 border-slate-500/20",
                  key: "hrms",
                },
                {
                  icon: <Factory className="w-4 h-4" />,
                  color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  key: "floor",
                },
                {
                  icon: <ShieldCheck className="w-4 h-4" />,
                  color: "text-orange-200 bg-orange-400/10 border-orange-400/20",
                  key: "compliance",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors">
                  <div className={`p-2 rounded-xl border shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t(`ai.cards.${item.key}.title`)}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{t(`ai.cards.${item.key}.desc`)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Chat UI Mock */}
            <div data-anim="rise-lg" className="bg-slate-950/80 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/60">
                <div className="w-8 h-8 rounded-xl bg-orange-400/15 border border-orange-300/25 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-orange-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Synax AI</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t("ai.connected")}
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-5 space-y-4 text-xs">
                {/* User message 1 */}
                <div className="flex justify-end">
                  <div className="bg-orange-400/15 text-orange-50 border border-orange-300/25 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                    {t("ai.user1")}
                  </div>
                </div>
                {/* AI reply 1 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-400/15 border border-orange-300/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-orange-300" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] space-y-2">
                    <p>{t("ai.reply1")}</p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">{t("ai.tiles.poLabel")}</div>
                        <div className="font-bold text-white">{t("ai.tiles.poValue", { count: 14 })}</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">{t("ai.tiles.invLabel")}</div>
                        <div className="font-bold text-white">{t("ai.tiles.invValue", { count: 7 })}</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">{t("ai.tiles.jobLabel")}</div>
                        <div className="font-bold text-white">{t("ai.tiles.jobValue", { count: 23 })}</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">{t("ai.tiles.grnLabel")}</div>
                        <div className="font-bold text-white">{t("ai.tiles.grnValue", { count: 5 })}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User message 2 */}
                <div className="flex justify-end">
                  <div className="bg-orange-400/15 text-orange-50 border border-orange-300/25 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                    {t("ai.user2")}
                  </div>
                </div>
                {/* AI reply 2 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-400/15 border border-orange-300/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-orange-300" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                    {t.rich("ai.reply2", { g: (chunks) => <span className="text-emerald-400 font-semibold">{chunks}</span> })}
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-400/15 border border-orange-300/25 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-orange-300" />
                  </div>
                  <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                  <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs text-slate-500 flex-1">{t("ai.inputPlaceholder")}</span>
                  <button className="p-1.5 rounded-lg bg-orange-400/15 hover:bg-orange-400/25 border border-orange-300/25 transition-colors cursor-pointer" aria-label={t("ai.send")}>
                    <Send className="w-3 h-3 text-orange-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center space-y-4">
            <p className="text-xs text-slate-500">{t("ai.note")}</p>
            <Link
              href={hrefFor("ai")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-surface hover:bg-orange-50 text-brand font-semibold text-xs transition-all shadow-lg"
            >
              <Bot className="w-4 h-4" />
              <span>{t("ai.explore")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHY SYNAX
         ========================================================================= */}
      <Comparison onSeeProducts={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} />


      {/* =========================================================================
         TRUSTED ENTERPRISE CLIENTS & ECOSYSTEM PARTNERS
         ========================================================================= */}
      <section className="py-10 sm:py-12 bg-surface border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-anim-stagger="rise" className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <SectionTag>{t("clients.tag")}</SectionTag>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t("clients.title")}</h2>
            <p className="text-sm text-slate-600">{t("clients.lead")}</p>
          </div>

          {/* The four logos are made for light backgrounds (dark lettering), so in dark mode each sits on a white plate. */}
          <div data-anim-stagger="scale" className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {/* Client 1: Senwell Exports */}
            <a
              href="https://senwellexports.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-300 bg-surface hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <span className="inline-flex items-center justify-center rounded-xl dark:bg-white dark:px-4 dark:py-2.5 dark:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.7)]">
                <img
                  src="https://senwellexports.com/static/media/SenwellLogo.524bb520c09926753630.png" referrerPolicy="no-referrer"
                  alt="Senwell Exports"
                  className="h-10 sm:h-12 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </span>
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-emerald-700 transition-colors">
                senwellexports.com
              </span>
            </a>

            {/* Client 2: Exxon Info */}
            <a
              href="https://exxoninfo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-surface hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105 rounded-xl dark:bg-white dark:px-4 dark:py-2.5 dark:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.7)]">
                <img
                  src="https://exxoninfo.com/favicon.ico" referrerPolicy="no-referrer"
                  alt="Exxon Info"
                  className="w-7 h-7 object-contain"
                  loading="lazy"
                />
                <span className="font-extrabold text-[#0a1128] tracking-tight text-lg sm:text-xl">
                  EXXON <span className="text-[#0b6cff]">INFO</span>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-brand transition-colors">
                exxoninfo.com
              </span>
            </a>

            {/* Client 3: Stacwell */}
            <a
              href="https://stacwell.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-surface hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <span className="inline-flex items-center justify-center rounded-xl dark:bg-white dark:px-4 dark:py-2.5 dark:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.7)]">
                <img
                  src="https://stacwell.com/_next/image?url=%2FstacwellLogo.webp&w=256&q=75" referrerPolicy="no-referrer"
                  alt="Stacwell"
                  className="h-9 sm:h-11 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </span>
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-brand transition-colors">
                stacwell.com
              </span>
            </a>

            {/* Client 4: Stacem */}
            <a
              href="https://www.stacem.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-surface hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <span className="inline-flex items-center justify-center rounded-xl dark:bg-white dark:px-4 dark:py-2.5 dark:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.7)]">
                <img
                  src="https://www.stacem.com/wp-content/themes/themeb17/img/logo-stacem.svg" referrerPolicy="no-referrer"
                  alt="Stacem"
                  className="h-8 sm:h-10 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </span>
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-brand transition-colors">
                stacem.com
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECURITY & ARCHITECTURE PILLARS
         ========================================================================= */}
      <section id="security" className="scroll-mt-20 py-10 bg-surface border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-anim-stagger="rise" className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <SectionTag>{t("security.tag")}</SectionTag>
            <h2 className="text-2xl font-extrabold text-slate-900">{t("security.title")}</h2>
            <p className="text-xs text-slate-600">{t("security.lead")}</p>
          </div>

          <div data-anim-stagger="scale" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LIVE_SECURITY.map((item, i) => (
              <div key={item.icon} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <ModuleIcon name={item.icon} className="w-6 h-6 text-brand" />
                <h3 className="text-sm font-bold text-slate-900">{live(`security.${(["tenant", "server", "audit", "roles"] as const)[i]}.title`)}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{live(`security.${(["tenant", "server", "audit", "roles"] as const)[i]}.copy`)}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center">
            <Link href="/security" className="text-xs font-bold text-brand hover:underline">
              {t("security.more")} &rarr;
            </Link>
          </p>
        </div>
      </section>

         {/* =========================================================================
         SENWELL GROUP PARENTAGE & HERITAGE
         ========================================================================= */}
      <section id="senwell" className="scroll-mt-20 py-10 bg-surface border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div data-anim-stagger="rise" className="space-y-3 text-center lg:text-left max-w-xl">
              <SectionTag>{t("heritage.tag")}</SectionTag>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t("heritage.title")}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.rich("heritage.body", { b: (chunks) => <strong className="text-slate-800">{chunks}</strong> })}
              </p>
            </div>

            <div data-anim-stagger="scale" className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full lg:w-auto">
              {LIVE_CLIENTS.slice(1).map((name) => (
                <div key={name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">{name}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">{t("clients.tag")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         BOTTOM EXECUTIVE CTA SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-surface py-10 text-slate-900 sm:py-12">
        <div data-anim-stagger="rise" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <SectionTag>{t("cta.tag")}</SectionTag>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{t("cta.title")}</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">{t("cta.lead")}</p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <DemoButton />
            <TourButton title="Synax Platform Overview" />
          </div>
        </div>
      </section>
    </main>
  );
}
