import type { Metadata } from "next";
import { routing, type Locale } from "./routing";

/** A path as a visitor sees it in one language: English has no prefix, the others do ("/" becomes "/fr"). */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  if (locale === routing.defaultLocale) return clean === "" ? "/" : clean;
  return `/${locale}${clean}`;
}

/**
 * The canonical link plus one hreflang link per language (and x-default) for a page.
 * `path` is the page's English path without any language prefix, e.g. "/products/staffing" or "/".
 * Put the result in the page's metadata: `alternates: localizedAlternates("/products", locale)`.
 * The URLs are relative; Next.js makes them absolute with `metadataBase` (see app/[locale]/layout.tsx).
 */
export function localizedAlternates(path: string, locale: Locale): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedPath(path, l);
  languages["x-default"] = localizedPath(path, routing.defaultLocale);
  return { canonical: localizedPath(path, locale), languages };
}
