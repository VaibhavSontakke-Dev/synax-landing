import { defineRouting } from "next-intl/routing";

/**
 * The single source of truth for which languages the site speaks and how their URLs look.
 *
 *  - `en` is the default and has NO prefix:  /  /products  /solutions/aerospace-defence
 *  - `fr` and `de` are prefixed:             /fr  /fr/products  /de/solutions/aerospace-defence
 *
 * (`localePrefix: "as-needed"` is what makes the default language prefix-free.) Page names (slugs) stay in English in every
 * language for now. See internationalisation.md in the project root for the full explanation.
 */
export const routing = defineRouting({
  locales: ["en", "fr", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** The language names, each written in its own language (never translated: a German visitor must still find "Deutsch"). */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

/** Value for Open Graph's `locale` (language_TERRITORY). */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
};
