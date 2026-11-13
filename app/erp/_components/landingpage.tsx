"use client";

import React, { useState, useEffect } from "react";
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
import { Hero } from "./home-hero";
import { Purpose } from "./home-purpose";
import { Products } from "./home-products";
import { Sectors } from "./home-sectors";
import { Comparison } from "./home-comparison";
import Link from "next/link";
import { ConsoleViewport } from "./console-viewport";
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

/** Tabs of the live console preview. */
type PreviewTab = "precision" | "aerospace" | "hrms" | "staffing";


/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

/**
 * The home page body. The header, footer, demo/tour modals and page frame now come from
 * <ErpShell> (shared with the product routes); each product has its own route under /products.
 */
export default function Landingpage() {
  const { openDemo, openTour, modalOpen } = useDemo();
  // The mobile sticky CTA only appears once the hero's own buttons have scrolled away,
  // so it never covers them.
  const [showStickyCta, setShowStickyCta] = useState(false);

  // Interactive Live Console Preview Tab in Hero
  const [previewTab, setPreviewTab] = useState<PreviewTab>("precision");

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <HomeView
        openModal={openDemo}
        openTourModal={openTour}
        previewTab={previewTab}
        setPreviewTab={setPreviewTab}
      />

      {/* Sticky mobile CTA: keeps the primary conversion action in reach below the hero. */}
      {showStickyCta && !modalOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => openDemo()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <span>Schedule a Demo</span>
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
  previewTab: PreviewTab;
  setPreviewTab: (tab: PreviewTab) => void;
}

function HomeView({
  openModal,
  openTourModal,
  previewTab,
  setPreviewTab,
}: HomeViewProps) {
  return (
    <main>
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
      <section id="synax-ai" className="scroll-mt-20 py-10 sm:py-12 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <SectionTag tone="dark">Synax AI — Always On</SectionTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Enterprise, Answered{" "}
              <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                Instantly
              </span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Synax AI is a built-in intelligent assistant that understands your entire enterprise — orders, HRMS records, live transactions, inventory, compliance status, and more. Just ask.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Capability Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: <BarChart3 className="w-4 h-4" />,
                  color: "text-orange-300 bg-orange-500/10 border-orange-500/20",
                  title: "Live Transaction Queries",
                  desc: "Ask \"What are today's open purchase orders?\" or \"Show me all invoices pending approval\" and get instant answers from live ERP data.",
                },
                {
                  icon: <Users className="w-4 h-4" />,
                  color: "text-slate-300 bg-slate-500/10 border-slate-500/20",
                  title: "HRMS & Workforce Intelligence",
                  desc: "Query attendance records, payroll status, leave balances, skill certifications, and biometric punch logs in plain language.",
                },
                {
                  icon: <Factory className="w-4 h-4" />,
                  color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  title: "Shop Floor & Production Data",
                  desc: "Get real-time OEE, job traveler status, tool life remaining, scrap rates, and machine queue depth — all from a single chat prompt.",
                },
                {
                  icon: <ShieldCheck className="w-4 h-4" />,
                  color: "text-orange-200 bg-orange-400/10 border-orange-400/20",
                  title: "Compliance & Audit Readiness",
                  desc: "Surface FAIR register status, certificates of conformance, shop-floor quality exceptions and calibration expiry alerts on demand. Agents propose; an approver decides.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors">
                  <div className={`p-2 rounded-xl border shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Chat UI Mock */}
            <div className="bg-slate-950/80 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/60">
                <div className="w-8 h-8 rounded-xl bg-orange-400/15 border border-orange-300/25 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-orange-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Synax AI</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected to your enterprise data
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-5 space-y-4 text-xs">
                {/* User message 1 */}
                <div className="flex justify-end">
                  <div className="bg-orange-400/15 text-orange-50 border border-orange-300/25 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                    What are the current open transactions today?
                  </div>
                </div>
                {/* AI reply 1 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-400/15 border border-orange-300/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-orange-300" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] space-y-2">
                    <p>Here&apos;s a live summary of today&apos;s open transactions:</p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">Purchase Orders</div>
                        <div className="font-bold text-white">14 Open</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">Sales Invoices</div>
                        <div className="font-bold text-white">7 Pending</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">Job Orders</div>
                        <div className="font-bold text-white">23 Active</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-lg px-2.5 py-1.5">
                        <div className="text-[10px] text-slate-400">GRN Pending</div>
                        <div className="font-bold text-white">5 Awaiting</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User message 2 */}
                <div className="flex justify-end">
                  <div className="bg-orange-400/15 text-orange-50 border border-orange-300/25 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                    Show me attendance for Shift A today
                  </div>
                </div>
                {/* AI reply 2 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-400/15 border border-orange-300/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-orange-300" />
                  </div>
                  <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                    <span className="text-emerald-400 font-semibold">Shift A — 428 punched in</span>, 12 on active break pass, 3 on approved leave. Payroll sync is up to date. No overstay alerts.
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
                  <span className="text-xs text-slate-500 flex-1">Ask anything about your enterprise data...</span>
                  <button className="p-1.5 rounded-lg bg-orange-400/15 hover:bg-orange-400/25 border border-orange-300/25 transition-colors cursor-pointer" aria-label="Send message">
                    <Send className="w-3 h-3 text-orange-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center space-y-4">
            <p className="text-xs text-slate-500">Synax AI is included in every enterprise plan — no extra setup, no third-party integrations.</p>
            <Link
              href={hrefFor("ai")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-orange-50 text-blue-900 font-semibold text-xs transition-all shadow-lg"
            >
              <Bot className="w-4 h-4" />
              <span>Explore AI &amp; Business Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHY SYNAX
         ========================================================================= */}
      <Comparison onSeeProducts={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} />


       {/* Interactive Platform Console */}
          <section className="pt-6 pb-8 md:pt-8 md:pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
              <SectionTag>Live Platform Preview</SectionTag>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                See Synax in Action
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Switch between products to see how each one reads: where the work is in its flow, what needs attention, and the records behind it. Figures shown are sample data.
              </p>
            </div>
            <div>
              {/* Viewport Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-200 text-slate-600 px-4 py-2.5 rounded-t-2xl border border-slate-300 gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-[11px] text-slate-500">
                    synax.senwellgroup.com/console/{previewTab}
                  </span>
                </div>

                {/* Switchable 4 Product Tabs */}
                <div className="flex flex-wrap gap-1 bg-slate-300/60 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewTab("precision")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      previewTab === "precision"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Manufacturing ERP
                  </button>
                  <button
                    onClick={() => setPreviewTab("aerospace")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      previewTab === "aerospace"
                        ? "bg-blue-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Aerospace &amp; Defence
                  </button>
                  <button
                    onClick={() => setPreviewTab("hrms")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      previewTab === "hrms"
                        ? "bg-blue-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    HRMS
                  </button>
                  <button
                    onClick={() => setPreviewTab("staffing")}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      previewTab === "staffing"
                        ? "bg-orange-700 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Staffing
                  </button>
                </div>
              </div>

              <ConsoleViewport tab={previewTab} />
            </div>
          </section>


      {/* =========================================================================
         TRUSTED ENTERPRISE CLIENTS & ECOSYSTEM PARTNERS
         ========================================================================= */}
      <section className="py-10 sm:py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <SectionTag>Running on Synax</SectionTag>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Senwell Group & Ecosystem Companies
            </h2>
            <p className="text-sm text-slate-600">
              Companies across the Senwell ecosystem run their operations on Synax.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {/* Client 1: Senwell Exports */}
            <a
              href="https://senwellexports.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-300 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <img
                src="https://senwellexports.com/static/media/SenwellLogo.524bb520c09926753630.png" referrerPolicy="no-referrer"
                alt="Senwell Exports"
                className="h-10 sm:h-12 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-emerald-700 transition-colors">
                senwellexports.com
              </span>
            </a>

            {/* Client 2: Exxon Info */}
            <a
              href="https://exxoninfo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
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
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-900 transition-colors">
                exxoninfo.com
              </span>
            </a>

            {/* Client 3: Stacwell */}
            <a
              href="https://stacwell.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <img
                src="https://stacwell.com/_next/image?url=%2FstacwellLogo.webp&w=256&q=75" referrerPolicy="no-referrer"
                alt="Stacwell"
                className="h-9 sm:h-11 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-900 transition-colors">
                stacwell.com
              </span>
            </a>

            {/* Client 4: Stacem */}
            <a
              href="https://www.stacem.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-3 min-h-[140px]"
            >
              <img
                src="https://www.stacem.com/wp-content/themes/themeb17/img/logo-stacem.svg" referrerPolicy="no-referrer"
                alt="Stacem"
                className="h-8 sm:h-10 w-auto max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-900 transition-colors">
                stacem.com
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECURITY & ARCHITECTURE PILLARS
         ========================================================================= */}
      <section id="security" className="scroll-mt-20 py-10 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <SectionTag>Security &amp; control</SectionTag>
            <h2 className="text-2xl font-extrabold text-slate-900">Audit-ready by design, not by report.</h2>
            <p className="text-xs text-slate-600">
              Each company runs in its own workspace, and every material change leaves a record.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LIVE_SECURITY.map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <ModuleIcon name={item.icon} className="w-6 h-6 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center">
            <Link href="/security" className="text-xs font-bold text-blue-900 hover:underline">
              Read more about security &amp; trust &rarr;
            </Link>
          </p>
        </div>
      </section>

         {/* =========================================================================
         SENWELL GROUP PARENTAGE & HERITAGE
         ========================================================================= */}
      <section id="senwell" className="scroll-mt-20 py-10 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <SectionTag>Manufacturing Pedigree</SectionTag>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Industrial Heritage. Purpose-Built Software.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Synax was not engineered in a generic software incubator. It was born out of{" "}
                <strong className="text-slate-800">Senwell Group’s</strong> multi-decade heritage in
                precision aerospace manufacturing, global industrial export (Senwell Exports,
                Stacwell Rubber, Stacem France & Morocco), and high-volume engineering operations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full lg:w-auto">
              {LIVE_CLIENTS.slice(1).map((name) => (
                <div key={name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">{name}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">Running on Synax</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         BOTTOM EXECUTIVE CTA SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-white py-10 text-slate-900 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <SectionTag>Senwell Group Enterprise Software</SectionTag>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            See your own shop floor in Synax.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A 30-minute walkthrough with your parts, your challans and your machines.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <DemoButton />
            <TourButton title="Synax Platform Overview" />
          </div>
        </div>
      </section>
    </main>
  );
}
