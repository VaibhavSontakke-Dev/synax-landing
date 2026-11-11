import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PRODUCT_DATA, PRODUCT_ROUTES, hrefFor } from "../erp/_data/products";
import { TourButton } from "../erp/_components/demo-buttons";
import { SectionTag } from "../erp/_components/section-tag";
import { TONE } from "../erp/_components/route-tone";

export const metadata: Metadata = {
  title: "Products | Synax by Senwell",
  description:
    "Six Synax products: Manufacturing ERP, Work & Delivery Management, HRMS, Staffing & Resource Management, Shop Floor & Machine Monitoring, and AI & Business Intelligence.",
  alternates: { canonical: "/products" },
};

/** /products — one card per product, each linking to its own page. */
export default function ProductsIndexPage() {
  return (
    <main className="pb-6">
      <section className="border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-white" aria-labelledby="products-index-heading">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8 lg:py-10">
          <SectionTag>Market-Ready Platforms</SectionTag>
          <h1
            id="products-index-heading"
            className="mx-auto mt-3 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-blue-900 sm:text-5xl"
          >
            Six products. One platform.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
            Start with the product your business needs today. They are built to work together, so adding the
            next one does not mean starting over.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TourButton title="Synax Platform Overview" />
          </div>
        </div>
      </section>

      <section aria-label="All products" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_ROUTES.map((r) => {
            const meta = PRODUCT_DATA[r.key];
            const tone = TONE[r.tone];
            const Icon = meta.icon;
            return (
              <li
                key={r.key}
                className={`flex flex-col rounded-2xl border border-t-4 border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${tone.bar}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${tone.tile}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{r.name}</h2>
                    <p className="text-xs text-slate-500">{meta.badge}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{meta.subtitle}.</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {meta.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className={`mt-0.5 size-4 shrink-0 ${tone.check}`} aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={hrefFor(r.key)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border-2 border-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  Explore {r.name}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
