import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PRODUCT_DATA, PRODUCT_ROUTES, hrefFor } from "../../erp/_data/products";
import { TourButton } from "../../erp/_components/demo-buttons";
import { SectionTag } from "../../erp/_components/section-tag";
import { TONE } from "../../erp/_components/route-tone";
import { localizedAlternates } from "@/i18n/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Meta.products");
  return { title: t("title"), description: t("description"), alternates: localizedAlternates("/products", locale) };
}

const HIGHLIGHTS = ["h1", "h2", "h3"] as const;

/** /products — one card per product, each linking to its own page. The words come from messages/*.json ("ProductsPage", "Products", "ProductData"). */
export default function ProductsIndexPage() {
  const t = useTranslations("ProductsPage");
  const tp = useTranslations("Products");
  const td = useTranslations("ProductData");
  return (
    <main>
      <section className="border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-page" aria-labelledby="products-index-heading">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8 lg:py-10">
          <SectionTag>{t("tag")}</SectionTag>
          <h1
            id="products-index-heading"
            className="mx-auto mt-3 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-brand sm:text-5xl"
          >
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">{t("lead")}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TourButton title="Synax Platform Overview" />
          </div>
        </div>
      </section>

      <section aria-label={t("allAria")} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_ROUTES.map((r) => {
            const meta = PRODUCT_DATA[r.key];
            const tone = TONE[r.tone];
            const Icon = meta.icon;
            const name = tp(`${r.key}.name`);
            return (
              <li
                key={r.key}
                className={`flex flex-col rounded-2xl border border-t-4 border-slate-200 bg-surface p-6 shadow-sm transition-shadow hover:shadow-md ${tone.bar}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${tone.tile}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{name}</h2>
                    <p className="text-xs text-slate-500">{td(`${r.key}.badge`)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{td(`${r.key}.subtitle`)}.</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {HIGHLIGHTS.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className={`mt-0.5 size-4 shrink-0 ${tone.check}`} aria-hidden="true" />
                      <span>{td(`${r.key}.${h}`)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={hrefFor(r.key)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border-2 border-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  {t("explore", { name })}
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
