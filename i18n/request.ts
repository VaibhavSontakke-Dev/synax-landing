import { locale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Runs once per request on the server: decides which language this request is in and loads its message file.
 * The language comes from the `[locale]` folder in the URL, read with Next.js's `next/root-params`.
 */
export default getRequestConfig(async () => {
  const requested = await locale();
  const resolved = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default,
  };
});
