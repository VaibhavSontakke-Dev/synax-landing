"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Activity, AlertTriangle, ArrowRight, BookOpen, CircleCheck, Plug, Receipt, Sparkles } from "lucide-react";
import { SectionTag } from "./section-tag";
import { hrefFor } from "../_data/products";

/**
 * "What sets Synax apart" — the USP section right after the hero. Three numbered story rows (AI that acts, live machine
 * monitoring, Tally and GST), each a real screen in a browser frame with floating live cards, then a navy
 * machine-to-ledger flow band. Copy is the portal's own wording (see _data/live.ts). The machine picture is an
 * illustration and the figures in the cards are sample data. Animations stop for prefers-reduced-motion.
 */

const FRAME_LEFT = "lg:[transform:perspective(1600px)_rotateY(-6deg)_rotateX(2deg)]";
const FRAME_RIGHT = "lg:[transform:perspective(1600px)_rotateY(6deg)_rotateX(2deg)]";
const FLOAT =
  "synax-usp-float z-20 mt-3 rounded-2xl border border-slate-200 bg-white p-3 text-[13px] leading-snug shadow-[0_22px_40px_-18px_rgba(30,58,138,0.55)] lg:absolute lg:mt-0";
const LINK =
  "inline-flex items-center gap-2 rounded-lg border-2 border-orange-500 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function LiveDot({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
      <span className="size-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" aria-hidden="true" />
      {children}
    </span>
  );
}

function Frame({ url, tilt, children }: { url: string; tilt: "left" | "right"; children: React.ReactNode }) {
  return (
    <div
      className={`relative rounded-2xl border border-sky-200 bg-white shadow-[0_40px_70px_-34px_rgba(30,58,138,0.55)] transition-transform duration-500 motion-reduce:[transform:none] lg:hover:[transform:none] ${
        tilt === "left" ? FRAME_LEFT : FRAME_RIGHT
      }`}
    >
      <div className="flex items-center gap-1.5 rounded-t-2xl border-b border-slate-200 bg-slate-50 px-3.5 py-2.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-rose-500" />
        <span className="size-2.5 rounded-full bg-amber-500" />
        <span className="size-2.5 rounded-full bg-emerald-500" />
        <span className="ml-2 truncate font-mono text-xs text-slate-500">{url}</span>
      </div>
      {children}
    </div>
  );
}

function Row({
  n,
  reverse = false,
  text,
  visual,
}: {
  n: number;
  reverse?: boolean;
  text: React.ReactNode;
  visual: React.ReactNode;
}) {
  return (
    <article
      className={`relative mb-10 grid items-center gap-8 last:mb-8 lg:gap-10 ${
        reverse ? "lg:grid-cols-[7fr_5fr]" : "lg:grid-cols-[5fr_7fr]"
      }`}
    >
      <span
        className="absolute top-1/2 left-1/2 z-10 hidden size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-900 text-sm font-extrabold text-white ring-8 ring-white outline-2 outline-sky-200 lg:flex"
        aria-hidden="true"
      >
        {n}
      </span>
      <div className={reverse ? "lg:order-2" : ""}>{text}</div>
      <div className={`relative ${reverse ? "lg:order-1" : ""}`}>{visual}</div>
    </article>
  );
}

function UspText({
  tile,
  label,
  title,
  body,
  points,
  href,
  cta,
}: {
  tile: React.ReactNode;
  label: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  cta: string;
}) {
  return (
    <>
      <div className="flex items-center gap-2.5 text-xs font-bold tracking-wider text-slate-500 uppercase">
        {tile}
        {label}
      </div>
      <h3 className="mt-3 text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{body}</p>
      <ul className="mt-4 mb-6 grid gap-2.5">
        {points.map((p) => (
          <li key={p} className="flex gap-2.5 text-sm text-slate-700">
            <CircleCheck className="mt-0.5 size-[18px] shrink-0 text-orange-500" aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
      <Link href={href} className={LINK}>
        {cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </>
  );
}

/* ---- 1. AI ---- */
function AiRow() {
  const [approved, setApproved] = useState(false);
  return (
    <Row
      n={1}
      text={
        <UspText
          tile={
            <span className="flex size-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-700">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
          }
          label="AI that acts"
          title="Synax AI finds the exception and proposes the fix. You approve."
          body="Ask Synax anything about your ERP data, and let its agents watch for the problems that cost you money. Nothing changes until an approver says yes."
          points={[
            "Challan reconciliation and overdue chasers",
            "Dispatch readiness and receivables follow-up",
            "Quality compliance and shop-floor watch",
            "Maker-checker approval with a full event history",
          ]}
          href={hrefFor("ai")}
          cta="Explore AI & Business Intelligence"
        />
      }
      visual={
        <>
          <Frame url="synax.senwellgroup.com/home" tilt="left">
            <div className="relative overflow-hidden rounded-b-2xl leading-[0]">
              <Image
                src="/images/hero-dashboard-overview.webp"
                alt="Synax home screen with the Overview card, Synax AI and the My Work panel"
                width={2000}
                height={1045}
                sizes="(min-width: 1024px) 700px, 100vw"
                className="block h-auto w-full"
              />
              <span
                className="synax-usp-ring pointer-events-none absolute rounded-[10px] border-[3px] border-orange-500"
                style={{ left: "25.4%", top: "37.8%", width: "10.2%", height: "4.6%" }}
                aria-hidden="true"
              />
            </div>
          </Frame>
          <div className={`${FLOAT} lg:top-[18%] lg:-left-5`} style={{ animationDelay: "0.4s" }}>
            <LiveDot>Synax AI</LiveDot>
            <p className="mt-0.5 font-bold text-slate-900">Ask anything about your ERP data</p>
          </div>
          <div className={`${FLOAT} lg:-right-6 lg:-bottom-7 lg:w-[19rem]`} aria-live="polite">
            {approved ? (
              <>
                <p className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <CircleCheck className="size-4" aria-hidden="true" /> Approved by you
                </p>
                <p className="mt-1 text-xs text-slate-600">2 reminders drafted. Recorded in the event history.</p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sparkles className="size-4" aria-hidden="true" /> Synax AI proposes
                </p>
                <p className="mt-1.5 mb-2.5 text-slate-800">2 challans are past their return date. Draft reminders to the customer?</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setApproved(true)}
                    className="cursor-pointer rounded-lg bg-blue-900 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    Approve
                  </button>
                  <span className="text-[11px] text-slate-500">Agents only propose.</span>
                </div>
              </>
            )}
          </div>
        </>
      }
    />
  );
}

/* ---- 2. Live machines ---- */
function MachineBoard() {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 3), 1100);
    return () => clearInterval(id);
  }, [reduced]);
  const m1 = 48 + tick;
  const m2 = 31 + tick;
  return (
    <div className={`${FLOAT} lg:-bottom-6 lg:-left-6 lg:w-64`} style={{ animationDelay: "1s" }}>
      <div className="flex items-center justify-between font-bold text-slate-900">
        <span>Machine board</span>
        <LiveDot>Live</LiveDot>
      </div>
      {[
        { id: "M-01", count: m1, max: 50 },
        { id: "M-02", count: m2, max: 40 },
      ].map((m) => (
        <div key={m.id} className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
          <div className="flex items-center justify-between text-xs">
            <span>
              {m.id} <span className="text-slate-500">Running</span>
            </span>
            <b>
              {m.count} / {m.max}
            </b>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-600 transition-[width] duration-500" style={{ width: `${(m.count / m.max) * 100}%` }} />
          </div>
        </div>
      ))}
      <p className="mt-2 flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-xs text-orange-800">
        <AlertTriangle className="size-3.5" aria-hidden="true" /> M-03 Alarm · tool life
      </p>
    </div>
  );
}

function MachinesRow() {
  return (
    <Row
      n={2}
      reverse
      text={
        <UspText
          tile={
            <span className="flex size-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
              <Activity className="size-5" aria-hidden="true" />
            </span>
          }
          label="Live machine monitoring"
          title="The spindle reports the count."
          body="Connect CNC machines and let real cycle counts, alarms and downtime drive production confirmation, with no separate MES or integrator."
          points={[
            "OEM connection or open FOCAS",
            "Live machine board with alarms and downtime reasons",
            "Machines that cannot connect still work: operators confirm counts",
            "Biometric devices sync attendance and overtime approvals",
          ]}
          href={hrefFor("shopfloor")}
          cta="Explore Shop Floor & Machine Monitoring"
        />
      }
      visual={
        <>
          <Frame url="synax.senwellgroup.com/machines" tilt="right">
            <div className="relative overflow-hidden rounded-b-2xl leading-[0]">
              <span
                className="synax-usp-scan pointer-events-none absolute inset-x-0 z-10 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                aria-hidden="true"
              />
              <Image
                src="/images/usp-machines.webp"
                alt="Machine monitoring view with a production line, OEE and downtime (illustration)"
                width={1400}
                height={785}
                sizes="(min-width: 1024px) 700px, 100vw"
                className="block h-auto w-full"
              />
            </div>
          </Frame>
          <div className={`${FLOAT} lg:top-[12%] lg:-right-4`} style={{ animationDelay: "0.2s" }}>
            <LiveDot>FOCAS connected</LiveDot>
            <p className="text-xs text-slate-500">Live cycle counts</p>
          </div>
          <MachineBoard />
        </>
      }
    />
  );
}

/* ---- 3. Tally and GST ---- */
const CHAIN = ["Approved", "IRN generated", "E-way bill", "Tally voucher"];

function InvoiceCard() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 6), 1100);
    return () => clearInterval(id);
  }, [reduced]);
  const done = reduced ? CHAIN.length : step;
  return (
    <div className={`${FLOAT} lg:top-5 lg:-right-6 lg:w-[19rem]`}>
      <div className="flex items-center justify-between font-bold text-slate-900">
        <span>Invoice INV-2201</span>
        <span className="text-xs font-normal text-slate-500">sample</span>
      </div>
      <ol className="mt-2.5 flex flex-wrap gap-1.5" aria-label="What happens next">
        {CHAIN.map((c, i) => (
          <li
            key={c}
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-500 ${
              i < done ? "border-blue-900 bg-blue-900 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {c}
          </li>
        ))}
      </ol>
      <p className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs">
        <Plug className="size-3.5 text-blue-900" aria-hidden="true" /> ClearTax or Masters India connected
      </p>
    </div>
  );
}

function BillingRow() {
  return (
    <Row
      n={3}
      text={
        <UspText
          tile={
            <span className="flex size-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-100 text-blue-900">
              <Receipt className="size-5" aria-hidden="true" />
            </span>
          }
          label="Tally and GST"
          title="Keep your books in Tally. Invoices carry their IRN."
          body="Run purchase, stores, production and dispatch in Synax. Vouchers flow to Tally, so your accountant changes nothing."
          points={[
            "Tally bridge for vouchers",
            "GST invoice, IRN and e-way bill in one flow",
            "ClearTax or Masters India connects the IRN on approval",
            "ITC-04 data pack for job work",
          ]}
          href={hrefFor("precision")}
          cta="Explore Manufacturing ERP"
        />
      }
      visual={
        <>
          <Frame url="synax.senwellgroup.com/invoice" tilt="left">
            <div className="rounded-b-2xl bg-slate-100 p-4 pb-16 leading-[0]">
              <Image
                src="/images/usp-billing.webp"
                alt="The Finance and Billing module: customer invoices, debit notes and invoice templates"
                width={892}
                height={336}
                sizes="(min-width: 1024px) 640px, 100vw"
                className="block h-auto w-full rounded-xl shadow-[0_8px_20px_-12px_#1e3a8a]"
              />
            </div>
          </Frame>
          <InvoiceCard />
          <div className={`${FLOAT} lg:-bottom-5 lg:-left-5`} style={{ animationDelay: "0.8s" }}>
            <p className="flex items-center gap-1.5 font-bold text-blue-900">
              <BookOpen className="size-4" aria-hidden="true" /> Voucher sent to Tally
            </p>
            <p className="text-xs text-slate-500">Your accountant changes nothing</p>
          </div>
        </>
      }
    />
  );
}

/* ---- Flow band ---- */
const FLOW = ["Machine count", "Route card", "Inspection & COC", "GST invoice · IRN", "Tally voucher"];

export function Usp() {
  return (
    <section
      id="usp"
      aria-labelledby="usp-heading"
      className="relative scroll-mt-20 overflow-hidden border-y border-sky-100 bg-gradient-to-b from-sky-50 via-white to-white"
    >
      <div className="pointer-events-none absolute -top-24 -left-20 size-[26rem] rounded-full bg-sky-100/70 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-[24rem] rounded-full bg-orange-50 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <SectionTag>What sets Synax apart (USP)</SectionTag>
          <h2 id="usp-heading" className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Built in, not bolted on: <span className="text-orange-600">AI</span>, live machines, <span className="text-orange-600">Tally</span> and GST
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Most plants stitch these together from separate tools. In Synax they share one record, from the spindle to the GST invoice.
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Highlights">
            {["Agents only propose", "OEM or open FOCAS", "IRN on approval", "Works with Tally", "Built in India"].map((c) => (
              <li key={c} className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-8">
          <div className="absolute inset-y-8 left-1/2 hidden border-l-2 border-dashed border-sky-300 lg:block" aria-hidden="true" />
          <AiRow />
          <MachinesRow />
          <BillingRow />
        </div>

        <div className="rounded-3xl bg-blue-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xs font-bold tracking-[0.14em] text-orange-300 uppercase">One record from the machine to the ledger</p>
            <p className="text-sm text-blue-100">With AI watching each step</p>
          </div>
          <div className="relative mt-8">
            <div className="absolute top-4 right-[10%] left-[10%] hidden h-0.5 bg-white/35 sm:block" aria-hidden="true" />
            <div className="relative hidden sm:block" aria-hidden="true">
              <span className="synax-usp-flow absolute top-[9px] left-[10%] size-[13px] rounded-full bg-orange-300 shadow-[0_0_0_5px_rgba(253,186,116,0.3)]" />
            </div>
            <ol className="relative grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-5">
              {FLOW.map((f, i) => (
                <li key={f} className="text-center text-[13px] font-semibold">
                  <span className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-900">{i + 1}</span>
                  {f}
                </li>
              ))}
            </ol>
          </div>
          <ul className="mt-7 flex flex-wrap justify-center gap-2" aria-label="Guarantees">
            {["Agents only propose", "IRN on approval", "Works with Tally", "Audit trail on every posting"].map((c) => (
              <li key={c} className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
