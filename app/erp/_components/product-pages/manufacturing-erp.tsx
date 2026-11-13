import Image from "next/image";
import { ArrowRight, BookOpen, Check, FileCheck2, FileText, Layers, PackageCheck, Receipt, Settings2, Truck, Undo2, Trash2, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SOLUTION_PATHS } from "../../_data/solution-paths";
import { industryHref } from "../../_data/industries";
import { Block } from "../site-page";
import { SectionTag } from "../section-tag";
import { HeroBand, HeroCopy, ModChips, ProductTail, StartPath, faqItems, relatedProduct } from "./shared";

/** Manufacturing ERP — a long vertical document chain, the customer-material ledger and the Tally split. */

const PASSPORT: { icon: LucideIcon; title: string; note: string }[] = [
  { icon: FileText, title: "Customer PO line", note: "Quote and revision" },
  { icon: PackageCheck, title: "Material lot", note: "Material ID range" },
  { icon: Layers, title: "Route card", note: "Released against the BOM" },
  { icon: Wrench, title: "Machine and operator", note: "Cycle count, buy-off" },
  { icon: FileCheck2, title: "COC", note: "Carries the machining record" },
  { icon: Receipt, title: "Invoice", note: "IRN and e-way bill" },
];

const CHAIN: { title: string; copy: string; modules: string[] }[] = [
  {
    title: "RFQ and customer PO",
    copy: "Quote every line, keep each revision, and watch the PO's open quantity so you always know what is still to ship against it.",
    modules: ["RFQ & quotations", "Customer PO & amendments", "Monthly sales plan", "Order fulfilment"],
  },
  {
    title: "Gate entry and GRN",
    copy: "Material arrives against a PO or a customer challan. Receipt tolerance is checked and inspection is recorded. Customer material is booked in with its Material ID range and PO line reference.",
    modules: ["Purchase requisition", "Vendor PO & receipt tolerance", "Gate entry, GRN & store inward", "Stock ledger & goods issue"],
  },
  {
    title: "Route card",
    copy: "The route card is released against the BOM and the operation routing. Material is reserved by RI unit, so the same stock is not promised to two jobs.",
    modules: ["Part master & BOM suite", "Operation master & routing", "Route card production order"],
  },
  {
    title: "Machine-confirmed operations",
    copy: "Start a job by route card number or barcode scan. The machine's cycle counts are proposed, the operator confirms them with a variance reason, and buy-offs are recorded per stage.",
    modules: ["Machine monitoring & jobs", "Stage buy-offs"],
  },
  {
    title: "Inspection and COC",
    copy: "Receiving and final inspection, the FAIR register, and a certificate of conformance that carries the machining record, including OEE per job.",
    modules: ["Receiving & final inspection", "FAIR register", "Certificate of conformance"],
  },
  {
    title: "Invoice and dispatch",
    copy: "Packing, the GST invoice, the IRN and the e-way bill sit in one flow. Accounting vouchers go across to Tally.",
    modules: ["Packing & customer invoice", "Delivery challans", "E-invoice (IRN) & e-way bill", "Tally bridge"],
  },
];

const LEDGER: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: BookOpen, title: "Inward challan", copy: "Material ID ranges and PO line references." },
  { icon: Settings2, title: "Issued to production", copy: "Reserved and issued against the route card." },
  { icon: Check, title: "Consumed 1:1", copy: "Raw material consumed against every invoiced part." },
  { icon: Undo2, title: "Returned", copy: "Return deliveries with their documents." },
  { icon: Trash2, title: "Scrap", copy: "Scrap documents tied to the customer." },
];

export function ManufacturingErpPage() {
  return (
    <main className="pb-6">
      {/* Hero: copy left, a framed workshop photo right with a passport card on its corner, the full part passport below */}
      <HeroBand productKey="precision">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <HeroCopy
            productKey="precision"
            eyebrow="Precision & job-work ERP"
            subtitle="From the machine spindle to the GST invoice"
            lead="Built for precision and job-work machine shops. Customer orders and supplied-material challans connect to route cards, machine-confirmed production, inspection, dispatch and invoicing, so every part carries one traceable record."
          />
          <div className="relative mx-auto w-full max-w-xl pb-6 lg:max-w-none">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-blue-900" aria-hidden="true" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-200">
              <Image
                src="/images/products/manufacturing-erp.webp"
                alt="CNC machines and workbenches in a machine shop"
                fill
                priority
                sizes="(min-width: 1024px) 540px, 100vw"
                quality={75}
                className="object-cover"
              />
            </div>
            <span className="absolute top-4 right-4 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-blue-900 shadow-md">
              Count from the machine
            </span>
            <div className="absolute bottom-0 left-3 w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-lg sm:-left-4">
              <p className="text-xs font-bold text-blue-900">Part passport</p>
              <p className="mt-0.5 text-[11px] text-slate-600">Material ID · Route card · COC</p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                <div className="h-1.5 w-[70%] rounded-full bg-blue-900/40" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <p className="font-bold text-slate-900">Part passport: one part, one record</p>
            <p>Traced back to its PO, material lot, machine and operator</p>
          </div>
          <div className="relative">
            <span
              aria-hidden="true"
              className="synax-prod-dash-x absolute top-[22px] right-[8.3%] left-[8.3%] hidden h-0.5 text-blue-900/40 lg:block"
            />
            <ol className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {PASSPORT.map((p, i) => {
                const Icon = p.icon;
                const last = i === PASSPORT.length - 1;
                return (
                  <li key={p.title} className="text-center">
                    <span
                      className={`relative mx-auto flex size-11 items-center justify-center rounded-full border-2 bg-white ${last ? "border-orange-300 text-blue-900" : "border-blue-900 text-blue-900"}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      <span className={`absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full text-[11px] font-semibold ${last ? "bg-orange-300 text-orange-950" : "bg-blue-900 text-white"}`}>
                        {i + 1}
                      </span>
                    </span>
                    <p className="mt-2.5 text-[13px] font-bold text-slate-900">{p.title}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{p.note}</p>
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
        tag="Spindle to invoice"
        title="Each document carries the one before it"
        lead="Any part can be traced back to its PO, material lot, machine and operator."
      >
        <ol className="mx-auto max-w-4xl">
          {CHAIN.map((s, i) => (
            <li key={s.title} className="relative flex gap-4 pb-5 last:pb-0">
              {i < CHAIN.length - 1 ? <span aria-hidden="true" className="absolute top-10 bottom-0 left-[17px] w-0.5 bg-slate-200" /> : null}
              <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-900 font-mono text-sm font-semibold text-white">{i + 1}</span>
              <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.copy}</p>
                <ModChips items={s.modules} className="mt-3" />
              </div>
            </li>
          ))}
        </ol>
      </Block>

      {/* Customer material */}
      <Block
        id="customer-material"
        tag="Job-work native"
        title="Your customer's material, accounted to the last piece"
        lead="Customer-supplied material is a first-class record, not a spreadsheet on the side. Every challan, Material ID range and rejection stays tied to the customer who owns it."
        tone="white"
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LEDGER.map((l, i) => {
            const Icon = l.icon;
            return (
              <li key={l.title} className="relative flex flex-col rounded-2xl border border-t-4 border-slate-200 border-t-emerald-600 bg-white p-4 shadow-sm">
                <span className="flex size-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Step {i + 1}</p>
                <h3 className="text-sm font-bold text-slate-900">{l.title}</h3>
                <p className="mt-1 text-[13px] leading-snug text-slate-600">{l.copy}</p>
                {i < LEDGER.length - 1 ? <ArrowRight className="absolute top-1/2 -right-3.5 z-10 hidden size-4 -translate-y-1/2 text-slate-400 lg:block" aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ol>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["Customer material balance", "A running balance per customer, with return deliveries and scrap documents."],
            ["ITC-04 data pack", "Customer material balances, returns and scrap documents feed the ITC-04 data pack."],
            ["Read-only customer portal", "Your customer can see their own material without being able to change it."],
          ].map(([t, c]) => (
            <p key={t} className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-slate-700">
              <span className="block font-bold text-slate-900">{t}</span>
              {c}
            </p>
          ))}
        </div>
      </Block>

      {/* Tally and GST */}
      <section id="accounts" aria-labelledby="accounts-heading" className="scroll-mt-32 border-b border-sky-200 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center">
            <SectionTag>Accounts and GST</SectionTag>
            <h2 id="accounts-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Keep your books in Tally
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Run purchase, stores, production and dispatch in Synax. Vouchers flow to Tally, so your accountant changes nothing.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_1fr]">
            <div className="rounded-2xl border border-t-4 border-slate-200 border-t-blue-900 bg-white p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-900">In Synax</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Purchase, stores, production, quality, dispatch and the GST invoice.</p>
            </div>
            <div className="hidden items-center md:flex" aria-hidden="true">
              <span className="synax-prod-dash-x h-0.5 w-10 text-orange-500" />
              <ArrowRight className="-ml-1 size-4 text-orange-500" />
            </div>
            <div className="rounded-2xl border border-t-4 border-slate-200 border-t-orange-600 bg-white p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-900">In Tally</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Your books and vouchers, as they are today. The Tally bridge sends the vouchers across.</p>
            </div>
            <div className="rounded-2xl border border-t-4 border-slate-200 border-t-emerald-600 bg-white p-5 shadow-sm">
              <h3 className="text-[15px] font-bold text-slate-900">E-invoice and e-way bill</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Connect your GST suvidha provider (ClearTax or Masters India). The IRN is generated when an invoice is approved.</p>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            <Truck className="mr-1.5 inline size-4 text-orange-600" aria-hidden="true" />
            Working with aerospace or defence customers? See the{" "}
            <a href={industryHref("aerospace-defence")} className="font-semibold text-blue-900 hover:underline">
              Aerospace &amp; Defence page
            </a>
            .
          </p>
        </div>
      </section>

      <StartPath path={SOLUTION_PATHS.precision} />

      <ProductTail
        productKey="precision"
        related={[
          relatedProduct("shopfloor", "Live machines, job cards and downtime."),
          relatedProduct("ai", "Challan chasers, dispatch readiness and approvals."),
          relatedProduct("hrms", "Plant attendance, overtime and payroll."),
          { label: "Aerospace & Defence", note: "AS9100D controls, FAIR and certificates.", href: industryHref("aerospace-defence") },
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
