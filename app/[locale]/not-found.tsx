import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ErpShell } from "../erp/_components/erp-shell";

/**
 * The 404 page, in the visitor's language. It is shown for any unknown address under a language (`/fr/nope`, `/nope`) through the
 * catch-all `[...rest]/page.tsx`, and when a page calls `notFound()` (for example /products/unknown). It is a page of its own, so it
 * wraps itself in the same frame (header, footer, modals) as the other pages. Search engines are told not to index it.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return { title: `${t("metaTitle")} | Synax by Senwell`, robots: { index: false, follow: false } };
}

const LINKS = [
  { href: "/products", key: "products" },
  { href: "/solutions", key: "solutions" },
  { href: "/why-synax", key: "why" },
  { href: "/security", key: "security" },
] as const;

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <ErpShell>
      <section aria-labelledby="not-found-heading" className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-bold tracking-[0.14em] text-accent uppercase">{t("code")}</p>
        <h1 id="not-found-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">{t("text")}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-xl bg-brand-solid px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          {t("home")}
        </Link>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex rounded-full border border-slate-300 bg-surface px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:border-brand-line hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                {t(l.key)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ErpShell>
  );
}
