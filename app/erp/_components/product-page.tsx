import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { PRODUCT_DATA, PRODUCT_ROUTES, hrefFor, routeFor, type ProductKey } from "../_data/products";
import { DemoButton, TourButton } from "./demo-buttons";
import { SectionTag } from "./section-tag";
import { TONE } from "./route-tone";

/**
 * One page template for every product and solution route (server component, no state).
 *
 * Content comes from `PRODUCT_DATA[key]`; colours from the route's tone (green / navy / orange, the
 * same as the Products menu). Per-product "capability metrics" from the old in-page view are left
 * out on purpose: they were unverified numbers.
 */
export function ProductPage({ productKey }: { productKey: ProductKey }) {
  const meta = PRODUCT_DATA[productKey];
  const route = routeFor(productKey);
  const tone = TONE[route.tone];
  const Icon = meta.icon;
  const isProduct = route.base === "/products";
  const others = PRODUCT_ROUTES.filter((r) => r.key !== productKey);

  return (
    <main className="pb-6">
      {/* Hero */}
      <section className="border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-white" aria-labelledby="product-heading">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/erp" className="hover:text-blue-900 hover:underline">
              Synax
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            {isProduct ? (
              <Link href="/products" className="hover:text-blue-900 hover:underline">
                Products
              </Link>
            ) : (
              <span>Industries</span>
            )}
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span aria-current="page" className="font-semibold text-slate-800">
              {route.name}
            </span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionTag lines="start">{meta.badge}</SectionTag>
              <h1
                id="product-heading"
                className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-blue-900 sm:text-4xl lg:text-5xl"
              >
                {route.name}
              </h1>
              <p className="mt-2 text-base font-semibold text-slate-700">{meta.subtitle}</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">{meta.description}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <TourButton title={`${route.name} Tour`} />
              </div>
            </div>

            {/* Highlights card */}
            <div className="rounded-3xl border border-sky-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className={`flex size-10 items-center justify-center rounded-xl border ${tone.tile}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold text-slate-900">What it covers</span>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${tone.chip}`}>
                  {meta.heroStat.label}: {meta.heroStat.value}
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {meta.highlights.map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                    <Check className={`mt-0.5 size-4 shrink-0 ${tone.check}`} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      {meta.moduleSection ? (
        <section id="modules" aria-labelledby="modules-heading" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto mb-7 max-w-2xl space-y-3 text-center">
            <SectionTag>{meta.moduleSection.kicker}</SectionTag>
            <h2 id="modules-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Core modules &amp; capabilities
            </h2>
            <p className="text-sm text-slate-600 sm:text-base">{meta.moduleSection.subtitle}</p>
          </div>

          <ul className="grid gap-5 md:grid-cols-3">
            {meta.moduleSection.groups.map((group) => (
              <li
                key={group.id}
                className={`flex flex-col rounded-2xl border border-t-4 border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${tone.bar}`}
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${tone.tile}`}>
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{group.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{group.description}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className={`mt-0.5 size-4 shrink-0 ${tone.check}`} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Other products */}
      <section aria-labelledby="more-heading" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 space-y-3 text-center">
            <SectionTag>One connected platform</SectionTag>
            <h2 id="more-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {isProduct ? "The rest of the Synax suite" : "Products behind this solution"}
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => {
              const t = TONE[r.tone];
              const RIcon = PRODUCT_DATA[r.key].icon;
              return (
                <li key={r.key}>
                  <Link
                    href={hrefFor(r.key)}
                    className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${t.tile}`}>
                      <RIcon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900">{r.name}</span>
                      <span className="block text-xs text-slate-500">{r.menu}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-600" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section aria-labelledby="cta-heading" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 p-7 shadow-2xl md:flex-row md:items-center md:p-10">
          <div className="max-w-xl">
            <SectionTag tone="dark" lines="start">
              Get started
            </SectionTag>
            <h2 id="cta-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              See {route.name} working with your data
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              A short walkthrough with a Senwell Group systems engineer, focused on the modules that matter to you.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <DemoButton product={route.name} onDark />
            <TourButton title={`${route.name} Tour`} onDark />
          </div>
        </div>
      </section>
    </main>
  );
}
