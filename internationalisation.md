# Internationalisation (i18n) of the Synax website

This document explains **what internationalisation is, every technology we use for it, how it works in this project, and
how to work with it**. It is written so that someone new to the subject can read it from top to bottom and then
safely add a translation, a page, or a whole new language.

- **Languages**: English (`en`, default), French (`fr`), German (`de`).
- **Status**: Phase 1 and phase 2 are done: routing, switcher, SEO links, the header (including its Products and Solutions menus), footer, demo
  form, buttons, shared page parts and the whole home page are translated. Phase 3 is under way: the Solutions data and the `/products`, `/solutions`, `/why-synax`, `/security` and the 7 `/solutions/<slug>` pages and the 6 `/products/<slug>` pages are translated;
  `/sitemap.xml` and a localised 404 page exist. Phase 3 is complete; what is left is the tours, the legal pages and native review of the drafts. See [section 13](#13-what-is-translated-today-and-the-roadmap).
- **Stack**: Next.js 16.4 (App Router, Cache Components) with the `next-intl` 4 library.

Contents

1. [The vocabulary](#1-the-vocabulary)
2. [The concepts you need](#2-the-concepts-you-need)
3. [The technologies, one by one](#3-the-technologies-one-by-one)
4. [How a request travels through the site](#4-how-a-request-travels-through-the-site)
5. [The files and what each one does](#5-the-files-and-what-each-one-does)
6. [Day-to-day guide: using translations in code](#6-day-to-day-guide-using-translations-in-code)
7. [Links, navigation and the language switcher](#7-links-navigation-and-the-language-switcher)
8. [SEO for several languages](#8-seo-for-several-languages)
9. [Translating the site's content (the big data files)](#9-translating-the-sites-content-the-big-data-files)
10. [Things that are not plain text](#10-things-that-are-not-plain-text)
11. [Translation workflow and quality](#11-translation-workflow-and-quality)
12. [Testing and the QA checklist](#12-testing-and-the-qa-checklist)
13. [What is translated today, and the roadmap](#13-what-is-translated-today-and-the-roadmap)
14. [How to add a new language](#14-how-to-add-a-new-language)
15. [Troubleshooting and lessons learned](#15-troubleshooting-and-lessons-learned)
16. [Decisions and why](#16-decisions-and-why)
17. [Further reading](#17-further-reading)

---

## 1. The vocabulary

| Term | Meaning |
|---|---|
| **i18n** (internationalisation) | Building the software so that it *can* work in many languages. It is engineering work, done once: routing, message files, formatting, layout that survives long words. ("i", 18 letters, "n".) |
| **l10n** (localisation) | Producing one particular language version: the translations, local formats, local examples. It is content work, done per language. |
| **g11n** (globalisation) | Umbrella word for i18n plus l10n. |
| **Locale** | A language, optionally with a region and other preferences: `en`, `fr`, `fr-CA`, `de-AT`. Synax uses plain languages (`en`, `fr`, `de`). |
| **BCP 47** | The standard that defines locale codes (`language-Script-REGION`, e.g. `zh-Hant-TW`). `hreflang` and `<html lang>` use it. |
| **Message / message key** | One piece of interface text, stored under a stable name: `Nav.scheduleDemo` = "Schedule a Demo". |
| **Message file / dictionary / catalogue** | A JSON file with all messages of one language: `messages/en.json`, `fr.json`, `de.json`. |
| **Interpolation** | Putting a value inside a message: `"Products ({count})"`. |
| **Pluralisation** | Choosing the right form for a number: "1 module" / "2 modules". Rules differ by language. |
| **ICU MessageFormat** | The standard mini-language for interpolation, plurals and selects inside messages: `{count, plural, one {# module} other {# modules}}`. next-intl uses it. |
| **Fallback** | What is shown when a translation is missing (here: English). |
| **Text expansion** | Translated text is usually longer than English (German often +30 %, French +20 %), so layouts must not break. |
| **Source language** | The language everything is written in first (English). |
| **Translation memory (TM)** | A database of already translated sentences so that repeats are reused and consistent. |
| **Glossary / termbase** | The agreed translation of key product terms (for example "Route card", "Job work", "Shop floor"). |
| **hreflang** | An HTML/HTTP annotation that tells search engines which URL is the French (or German...) version of a page. |
| **Canonical URL** | The one official address of a page; stops search engines treating copies as duplicates. |
| **Proxy** | Next.js 16's name for the former "middleware": code that runs before a page request. |
| **Root parameter** | A dynamic route segment above the root layout (here `[locale]`); readable anywhere on the server with `next/root-params`. |

## 2. The concepts you need

### 2.1 Language is not country
`fr` is French; `fr-CA` is Canadian French; `fr-CH` is Swiss French. They share most words but differ in spelling,
quotation marks, number formats and sometimes vocabulary. We chose **plain languages** because a marketing site
rarely needs more, and we can add a region later (for example `de-CH`) without redoing the rest.

### 2.2 The three jobs of an international site
1. **Routing** - which URL belongs to which language, and how a visitor lands in the right one.
2. **Translation** - interface text and content in each language.
3. **Formatting** - numbers, dates, currencies, lists, sorting, in the visitor's convention.

### 2.3 Routing strategies

| Strategy | Example | Good | Bad |
|---|---|---|---|
| **Sub-path** (our choice) | `/fr/products` | One domain, one deployment, shared authority for search engines, easy to link. | Needs a locale-aware router. |
| Sub-domain | `fr.synax.com` | Can be hosted separately. | More DNS/TLS work, weaker shared authority. |
| Domain per country | `synax.fr` | Strong local signal. | One site per domain to run. |
| Cookie / header only | same URL for everyone | Simple. | Search engines see one language; URLs cannot be shared. **Avoid.** |

**Prefix policy (`localePrefix`)**: *always* (`/en/...`, `/fr/...`), *as-needed* (default language without prefix),
*never*. We use **as-needed**: English stays at `/` and `/products`; French is `/fr`, `/fr/products`; German is `/de/...`.
This keeps every existing English URL (and every existing link, bookmark and search ranking) working.

### 2.4 Detecting the visitor's language
The browser sends an `Accept-Language` header (`fr-FR,fr;q=0.9,en;q=0.5`). The order of authority we use:
1. The **URL** (`/fr/...`) - always wins.
2. The **`NEXT_LOCALE` cookie** - remembers an explicit choice made with the language switcher.
3. **`Accept-Language`** - only decides when someone arrives at a prefix-free URL for the first time.
4. The **default** (`en`).

A visitor who chooses a language with the switcher is never bounced back by detection, because the cookie records the choice.

### 2.5 Two kinds of text
- **Interface text** (buttons, menu items, form labels, error messages): short, reused, lives in `messages/*.json`.
- **Content** (product pages, solution pages, FAQ, legal text): long, structured, lives in the TypeScript data files under
  `app/erp/_data/`. It needs a different approach (see [section 9](#9-translating-the-sites-content-the-big-data-files)).

### 2.6 Messages are not strings you concatenate
Never build sentences by joining pieces (`"You have " + n + " " + word`). Word order differs between languages. Give the
translator the **whole sentence with placeholders**, and let ICU handle the rest:

```json
"modules": "{count, plural, one {# module} other {# modules}}"
```

### 2.7 Plural categories differ per language
CLDR defines up to six categories: `zero, one, two, few, many, other`.
- English: `one`, `other`.
- German: `one`, `other`.
- French: `one` (0 and 1), `many` (large round numbers, for example "1 000 000"), `other`.
- (Arabic uses all six; Polish uses `one, few, many, other`.)

Write the categories the target language needs; `other` is always required.

### 2.8 Formatting is built in, not typed
The browser's `Intl` API formats according to the locale: `1,234.5` (en) vs `1 234,5` (fr) vs `1.234,5` (de); dates
`11/19/2026` vs `19/11/2026` vs `19.11.2026`; currency; lists ("A, B, and C" vs "A, B et C" vs "A, B und C"). **Never
hard-code a format**; use `useFormatter()` (next-intl, which wraps `Intl`).

### 2.9 Text expansion and layout
German compound words ("Bedarfsplanung", "Produktionsplanung") do not wrap at spaces. Buttons, menus and cards need room, and
long words may need `hyphens: auto` and `overflow-wrap`. Test German first; if it fits, French and English fit.

### 2.10 Right-to-left (RTL)
Arabic, Hebrew and others read right to left. English, French and German do not, so the site is **left-to-right only**.
If an RTL language is ever added, `<html dir="rtl">` and logical CSS (`margin-inline-start`, Tailwind's `ms-*` / `ps-*`)
are needed. Writing new CSS with logical properties now avoids pain later.

### 2.11 Fallback, missing keys, and "never ship half a sentence"
If a key is missing in French, the site must still render. The rule here: **English is the source of truth**; a missing
key is a bug to fix, and the translation check (section 12) lists it before release.

### 2.12 Translating URLs (slugs)
`/fr/produits/erp-de-fabrication` would be nicer for French search, but costs: a mapping table, redirects, and
duplicate-slug care. **Decision for now: slugs stay English** in every language. next-intl supports translated
`pathnames` in `defineRouting` when we decide to do it.

### 2.13 Search engines
Each language page must declare: its own `<html lang>`, a **canonical** link to itself, **hreflang** links to *every*
language version (including itself), and an `x-default`. The links must be reciprocal (A points to B and B to A) or they
are ignored. Titles and descriptions should be translated, not just the body.

### 2.14 Machine translation, human review, legal text
Machine translation is fast and good for drafts; **marketing copy needs a native reader** (tone, idioms, "vous" vs "tu",
"Sie" vs "du"); **legal text needs a lawyer** (privacy policy, terms). Do not publish unreviewed legal translations.

## 3. The technologies, one by one

### 3.1 Next.js 16 (App Router)
- **Dynamic segment `[locale]`**: a folder named `app/[locale]` captures the first URL segment (`fr` in `/fr/products`).
  All pages live under it, so every page and layout can know its language.
- **Root layout inside `[locale]`**: `app/[locale]/layout.tsx` is the root layout (it renders `<html>`), so `<html lang>`
  is set per language. This is the pattern in the official Next.js internationalisation guide
  (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`).
- **`next/root-params`**: `import { locale } from "next/root-params"` gives any server code the current language without passing
  props down. Not usable in Client Components, Server Actions or Route Handlers.
- **Cache Components (`cacheComponents: true`)**: Next.js can pre-render pages into static shells. It requires every root
  parameter to have at least one known value, so the root layout exports `generateStaticParams()` returning `en`, `fr`, `de`.
- **`generateStaticParams`**: tells Next.js which pages to build ahead of time. Layout: the three languages. Product and
  solution pages: their slugs. Next.js combines them (3 languages x every slug).
- **`generateMetadata`**: per-page, per-language `<title>`, description, canonical and hreflang links.
- **`proxy.ts`** (formerly `middleware.ts`): runs before each request; here it detects/redirects/rewrites language URLs.
- **`next.config.ts`**: `redirects()` (`/erp` -> `/`), `headers()` (security headers), and the next-intl plugin wrapper.
- **`notFound()`**: `app/[locale]/layout.tsx` calls it when the first segment is not a language (for example `/xx/products`).
- **Server vs Client Components**: server components read translations at render time (zero JavaScript cost); client
  components (`"use client"`: the header, footer, demo form) read them from the provider.

### 3.2 next-intl 4.x
The library that turns the ideas above into code. Pieces we use:

| Piece | Import | Purpose |
|---|---|---|
| `defineRouting` | `next-intl/routing` | Declares locales, default locale, prefix policy (`i18n/routing.ts`). |
| `createNavigation` | `next-intl/navigation` | Builds locale-aware `Link`, `usePathname`, `useRouter`, `redirect`, `getPathname` (`i18n/navigation.ts`). |
| `getRequestConfig` | `next-intl/server` | Per-request setup: which language, which messages (`i18n/request.ts`). |
| `createNextIntlPlugin` | `next-intl/plugin` | Connects `i18n/request.ts` to Next.js (`next.config.ts`). |
| `createMiddleware` | `next-intl/middleware` | The proxy: detection, redirect, rewrite, cookie, `Link` hreflang header (`proxy.ts`). |
| `NextIntlClientProvider` | `next-intl` | Gives client components their language and messages (root layout). |
| `useTranslations` / `getTranslations` | `next-intl` / `next-intl/server` | Read messages (hook in components; async function in server-only code and metadata). |
| `useLocale` / `getLocale` | same | The current language code. |
| `useFormatter` / `getFormatter` | same | Numbers, dates, relative time, lists. |
| `hasLocale` | `next-intl` | Type-safe check that a string is one of our languages. |
| `t.rich()` | from `useTranslations` | Messages with tags: `"Read our <link>privacy policy</link>"` -> real React elements. |

### 3.3 The browser's `Intl` API
Built into every browser and Node: `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.PluralRules`, `Intl.ListFormat`,
`Intl.RelativeTimeFormat`, `Intl.Collator` (sorting). next-intl wraps these; we do not need extra date libraries for this.

### 3.4 ICU MessageFormat and CLDR
ICU is the message syntax; **CLDR** (Unicode Common Locale Data Repository) is the data about plurals, formats and names that
all of the above rely on.

### 3.5 HTML and HTTP features
`<html lang>`, `<link rel="alternate" hreflang>`, `<link rel="canonical">`, the HTTP `Link:` header (the proxy also adds
hreflang this way), the `Accept-Language` request header, the `NEXT_LOCALE` cookie, `lang` attributes on foreign-language
snippets (the language switcher marks each language name with its own `lang`).

### 3.6 Open Graph
`og:locale` (`en_US`, `fr_FR`, `de_DE`) tells social networks the language of a shared link (`OG_LOCALE` in `i18n/routing.ts`).

### 3.7 TypeScript, ESLint, Tailwind
TypeScript checks our code (`npx tsc --noEmit`); ESLint finds mistakes (`npx eslint`). Tailwind v4 classes must tolerate longer
words. Neither needs a language-specific setup today.

### 3.8 Voice and captions (for the video tours)
The narrated tours use `msedge-tts` (Microsoft Edge neural voices, run on the developer's machine) with captions in
`app/erp/_data/tour-lines.json`. French and German need their own voices (for example `fr-FR-DeniseNeural`, `de-DE-KatjaNeural`).

## 4. How a request travels through the site

Example: a visitor in Germany opens `https://site/` for the first time.

```
Browser  ->  GET /          (Accept-Language: de-DE,de;q=0.9)
   |
   v
proxy.ts (next-intl middleware)
   - URL has no language prefix, no cookie yet
   - reads Accept-Language -> best match is "de"
   - default locale is "en" but the visitor prefers "de"  ->  redirect 307 to /de
   - sets cookie NEXT_LOCALE=de
   v
GET /de
   v
proxy.ts: URL already has /de, nothing to change; adds Link: <...>; rel="alternate"; hreflang="..."
   v
Next.js router matches app/[locale]/page.tsx with locale = "de"
   v
app/[locale]/layout.tsx
   - await locale() from next/root-params  ->  "de"
   - hasLocale(...) ok, else notFound()
   - <html lang="de">, fonts, theme script
   - <NextIntlClientProvider>  (messages of "de" for client components)
   v
i18n/request.ts runs  ->  { locale: "de", messages: messages/de.json }
   v
Page renders. Server components call useTranslations(...)/getTranslations(...);
client components call useTranslations(...) via the provider.
   v
generateMetadata() adds canonical + hreflang links to <head>
   v
HTML to the browser
```

And an **English** visitor to `/products`:

```
GET /products  ->  proxy: no prefix + default language  ->  internal REWRITE to /en/products (the address bar stays /products)
```

A rewrite (invisible) is what keeps English URLs prefix-free; a redirect (visible) is what sends French/German
visitors to `/fr/...` / `/de/...`.

## 5. The files and what each one does

```
proxy.ts                     Language detection, redirect/rewrite, cookie, hreflang Link header
next.config.ts               next-intl plugin wrapper, /erp -> / redirect, security headers
i18n/
  routing.ts                 locales, default, prefix policy; LOCALE_NAMES; OG_LOCALE
  navigation.ts              locale-aware Link, usePathname, useRouter, redirect, getPathname
  request.ts                 per-request language + messages loader (uses next/root-params)
  seo.ts                     localizedPath(), localizedAlternates() -> canonical + hreflang
  site.ts                    SITE_URL (from NEXT_PUBLIC_SITE_URL), used by the layout's metadataBase and by the sitemap
messages/
  en.json  fr.json  de.json  all message text, one file per language. Namespaces:
                             Common, Language, Nav, Buttons, Theme, Shared, Footer, DemoForm, TourModal, Products, Hero, Home,
                             Carousel, Purpose, Usp, Benchmark, Comparison, Rollout, SolutionGroups, Solutions, Sectors,
                             Meta, Areas, AreasShort, Modules, Workflow, Faq, SolutionPaths, Industries, ProductData, ProductsPage, SolutionsPage, Scene,
                             Live, Benefits, Why, WhyRace, ReasonTabs, Security, SolutionPage, ProductModules, ProductShared, ProductPage, AiBoard, ProductMeta, NotFound, Chat
tools/
  check-messages.mjs         release check: same keys, {placeholders} and <tags> in all three files
  add-messages.mjs           merges new messages written as [english, french, german] triples into the three files
app/
  [locale]/
    layout.tsx               ROOT layout: <html lang>, fonts, theme script, provider, generateStaticParams, base metadata
    page.tsx                 home page (+ alternates)
    products/ solutions/ security/ why-synax/ (legal)/ cloud-erp-software/   all pages (each with alternates)
  api/demo-request/route.ts  form endpoint (NOT under [locale]). Errors carry a `code` (translated in the browser); the lead carries `language`
  erp/_components/           the UI components (shared by every language)
    language-switcher.tsx    the globe dropdown in the header
    site-nav.tsx             header, uses useTranslations("Nav")
    erp-shell.tsx            page frame, skip link uses useTranslations("Common")
    home-footer.tsx          footer ("Footer", "Products"), demo-provider.tsx demo form + tour modal ("DemoForm", "TourModal")
    home-hero.tsx, landingpage.tsx   home hero ("Hero", "Products") and the home body sections ("Home")
    home-products.tsx, home-purpose.tsx, home-usp.tsx, home-comparison.tsx, rollout.tsx
                             the other home sections ("Carousel", "Purpose", "Usp", "Comparison" + "Benchmark", "Rollout")
  erp/_data/                 the content data files (English today; see section 9)
internationalisation.md      this document
```

**Environment variable**: `NEXT_PUBLIC_SITE_URL` (for example `https://synax.senwellgroup.com`). Canonical and hreflang URLs are
absolute and are built from it; the localhost fallback is only for development. **Set it in production.**

## 6. Day-to-day guide: using translations in code

### 6.1 Add a message
Add the same key to **all three** files, English first:

```json
// messages/en.json
{ "Footer": { "legal": "Legal" } }
// messages/fr.json
{ "Footer": { "legal": "Mentions légales" } }
// messages/de.json
{ "Footer": { "legal": "Rechtliches" } }
```

Naming: `Namespace.camelCaseKey`. The namespace is the component or area (`Nav`, `Footer`, `DemoForm`, `Home`). Name the key by
**meaning**, not by wording (`scheduleDemo`, not `scheduleADemoButton`). Keep one idea per key; never reuse a key for two
different meanings (the translation may differ).

### 6.2 Use it in a Server Component
```tsx
import { useTranslations } from "next-intl";
export function Title() {
  const t = useTranslations("Footer");
  return <h2>{t("legal")}</h2>;
}
```
In an `async` function (page, metadata) use `await getTranslations("Footer")` from `next-intl/server`.

### 6.3 Use it in a Client Component
Identical: `"use client"` + `useTranslations("Nav")`. It works because `NextIntlClientProvider` is in the root layout.
(Note: today the provider sends **all** messages to the browser. When the files grow, pass only the namespaces client
components use: `<NextIntlClientProvider messages={pick(messages, ["Nav", "DemoForm"])}>`.)

### 6.4 Values, plurals, tags
```json
"products": "Products ({count})",
"modules": "{count, plural, one {# module} other {# modules}}",
"privacy": "I agree to the <link>Privacy Policy</link>"
```
```tsx
t("products", { count: 6 });
t("modules", { count: 1 });
t.rich("privacy", { link: (chunks) => <Link href="/privacy">{chunks}</Link> });
```

### 6.5 Numbers, dates, lists
```tsx
import { useFormatter } from "next-intl";
const format = useFormatter();
format.number(1234.5);                            // 1,234.5  |  1 234,5  |  1.234,5
format.number(99, { style: "currency", currency: "EUR" });
format.dateTime(new Date(), { dateStyle: "long" });
format.list(["Aerospace", "Energy", "Machinery"]); // "A, B, and C" | "A, B et C" | "A, B und C"
```

### 6.6 Never hard-code a language-specific thing
No `"€"`, no `"11/19/2026"`, no `"en-US"`, no English plural `s`, no sentence made of concatenated pieces, no text inside an
image if avoidable (see section 10), no `lang="en"` anywhere (the layout sets it).

### 6.7 Conventions used so far (phase 2)
- **One name, one place**: product names and their one-line descriptions live once in `messages/*.json` under `Products.<key>.name` and
  `Products.<key>.heroDesc` (keys `precision`, `it`, `hrms`, `staffing`, `shopfloor`, `ai`, the same as `ProductKey`). The home hero and the
  footer already use them; phase 3 will move the header menus and product pages to them, so a name is never translated twice.
- **Rich text tags** in messages are plain names that the component maps to elements: `<em>` (underlined or gradient word), `<b>` / `<strong>`
  (bold), `<link>` (a `Link`), `<g>` (green highlight). The same tags must exist in all three languages; `check-messages.mjs` checks it.
- **Values versus labels**: when a form option's *value* is stored or sent somewhere (the CRM), keep the value in English and translate only
  the label (`optionLabel()` in `demo-provider.tsx`).
- **Shared names use the `slug()` helper**: where the same English phrase appears on several pages (module names, FAQ questions), the message key is
  the phrase turned into a key (`slug("Stage buy-offs")` = `stage-buy-offs`), so every page looks it up the same way and a phrase is translated once.
- **Server answers use codes, not sentences**: an API returns `{ code: "invalid_email" }` and the page maps it to a translated message
  (`DemoForm.errors.<code>`), because route handlers sit outside `[locale]`.
- **Sample data inside messages** (the numbers in the Synax AI chat) is passed as a value: `t("ai.tiles.poValue", { count: 14 })`, so the
  sentence structure can change per language while the number stays a number.
- **Authoring many messages**: write them as `[english, french, german]` triples in a small module and run
  `node tools/add-messages.mjs <module.mjs>`; it merges them into the three files and keeps the key order. Then run
  `node tools/check-messages.mjs`.

## 7. Links, navigation and the language switcher

- **Always import `Link` from `@/i18n/navigation`**, not `next/link`. It adds the language prefix automatically:
  `<Link href="/products">` is `/products` in English and `/fr/products` in French. (All 21 existing files were converted.)
  An external `https://...` link is left alone.
- `usePathname()` from `@/i18n/navigation` returns the path **without** the language prefix, so
  `pathname === "/products"` works in every language.
- `useRouter()` / `redirect()` from the same file are locale-aware too. `notFound` still comes from `next/navigation`.
- **Switching language** (`app/erp/_components/language-switcher.tsx`): each option is a real link to the *same page* in
  another language: `<Link href={pathname} locale="fr">`. It works without JavaScript, can be opened in a new tab, and search
  engines can follow it. Choosing a language also sets the `NEXT_LOCALE` cookie.
- Language names are shown in their own language (`English`, `Français`, `Deutsch`) and are **not** translated.

## 8. SEO for several languages

What every page emits (verified on `/de/products/work-delivery-management`):

```html
<html lang="de">
<link rel="canonical" href="https://SITE/de/products/work-delivery-management"/>
<link rel="alternate" hrefLang="en" href="https://SITE/products/work-delivery-management"/>
<link rel="alternate" hrefLang="fr" href="https://SITE/fr/products/work-delivery-management"/>
<link rel="alternate" hrefLang="de" href="https://SITE/de/products/work-delivery-management"/>
<link rel="alternate" hrefLang="x-default" href="https://SITE/products/work-delivery-management"/>
<meta property="og:locale" content="de_DE"/>
```

plus the HTTP `Link:` header from the proxy. How to add it to a new page: export `generateMetadata` and call
`localizedAlternates("/the/english/path", locale)` from `i18n/seo.ts`.

**Sitemap**: `app/sitemap.ts` serves `/sitemap.xml`: every page in every language (20 pages x 3 languages = 60 entries), each entry with its
`hreflang` alternates and `x-default`. It is built from the same data that creates the pages (`PRODUCT_ROUTES`, `INDUSTRY_PAGES`) plus a short list of
fixed paths, so a new product or solution page is included automatically; the legacy `/cloud-erp-software/...` address is left out (it now redirects), and there is no
`lastModified` (a build-time date would claim a change that did not happen). The URLs use `NEXT_PUBLIC_SITE_URL`, so **set it in production** or the
sitemap lists `http://localhost:3000`.

Still to do for SEO (roadmap): a `robots.txt` that points to the sitemap (not added yet, it needs a decision about what to allow).

## 9. Translating the site's content (the big data files)

Most of the words of the site are not in components but in TypeScript data: `products.ts` (616 lines), `content.ts`,
`industries.ts`, `solutions.ts`, `solution-paths.ts`, `live.ts`, `benchmark.ts`, `legal.ts`, `tours.ts` (about 3,300 lines in all), plus
hard-coded text inside many components (hero copy, section headings, button labels).

**Recommended approach: keep structure in code, move words to message files, key by id.**

1. Give every translatable thing a stable **id** (a product `key`, an industry `slug`, a flow step index).
2. In `messages/<lang>.json`, store the words under that id:
   ```json
   "Industries": { "aerospace-defence": { "title": "ERP for aerospace and defence suppliers", "lead": "...", "challenges": [ { "title": "...", "text": "..." } ] } }
   ```
3. The data file keeps the structure (icons, tones, slugs, which products) and a small helper merges the words in:
   `getIndustry(slug)` -> data + `getTranslations("Industries")`.
4. English stays the fallback: if a key is missing, show the English value.

Why not duplicate the data files per language (`industries.fr.ts`)? They drift apart. Structure belongs to one place.

Components with inline text (for example `landingpage.tsx`, `home-hero.tsx`) get their text moved into namespaces
(`Home`, `Hero`, `Footer`, `DemoForm` ...) one component at a time.

Big blocks of long prose (the legal pages) may be better as **one Markdown/TS file per language** than as JSON keys.

## 10. Things that are not plain text

| Item | What is needed |
|---|---|
| **Images that contain words** (the hero dashboard screenshots, machine board, banners) | Not translatable as images. Options: redraw per language, or redesign so the words are real text over the image. Plan per image. |
| **Video tours** (`/audio/tours/<slug>/scene-N.mp3`) | New captions in `tour-lines.json` per language, new audio per language (French/German voices), `tour-durations.json` per language. The tour code needs a language level (`tour-lines.fr.json`...). |
| **Legal pages** (privacy, terms) | Professional/legal translation. Until reviewed, show English with a notice. |
| **Demo form** (`demo-provider.tsx`, `app/api/demo-request/route.ts`) | **Done**: labels, placeholders, size options, consent line, success text and errors are translated. Option *values* stay English because they go to the sales team's CRM; only the labels change. The API route lives outside `[locale]`, so it returns an error **code** (`name_company`, `invalid_email`, ...) and the browser translates it (`DemoForm.errors.*`). The browser also sends `locale`, and the route forwards it as `language` (`en`/`fr`/`de`) in the webhook payload so the team can reply in that language. Still to do: the email/notification the team receives, if you want it in the visitor's language. |
| **Form validation messages** | Come from the server in English today; return message *codes* and translate on the client. |
| **Currency, units, dates** | Via `useFormatter`. Today the copy mentions INR/GST: prices and tax wording may differ by market (business decision). |
| **Address, phone, company names** | Usually not translated; confirm per market. |
| **Cookie banner / consent text** (if added) | Translate; legally relevant. |
| **Error pages** | Done: `app/[locale]/not-found.tsx` (messages `NotFound`) shows a translated 404 inside the normal header and footer. Unknown addresses reach it through the catch-all `app/[locale]/[...rest]/page.tsx`, which only calls `notFound()`; pages such as `/products/unknown` reach it by calling `notFound()` themselves. A path like `/zz/foo` is not a language, so the proxy treats it as an English address and shows the English 404. The page sets `robots: noindex`. |
| **Accessibility labels** (`aria-label`, `alt`) | Translate them too. The header already does (`homeAria`, `toggleMenu`). |

## 11. Translation workflow and quality

1. **Source of truth**: English in `messages/en.json`. Change English first; never change only French/German.
2. **Draft**: a first French/German draft (machine or by Claude) goes into the files.
3. **Native review**: a French and a German native speaker with industry knowledge reviews each file before release.
4. **Glossary first**: agree the key terms once, then reuse. Suggested starting points (to be confirmed by reviewers):

   | English | Français | Deutsch |
   |---|---|---|
   | Job work | Sous-traitance | Lohnfertigung |
   | Route card | Gamme de fabrication / fiche suiveuse | Laufkarte / Arbeitsplan |
   | Shop floor | Atelier de production | Fertigung / Shop Floor |
   | Challan | Bon de livraison (challan) | Lieferschein (Challan) |
   | Quality gate | Point de contrôle qualité | Qualitätsfreigabe |
   | Schedule a demo | Planifier une démo | Demo vereinbaren |

   Keep brand and product names (Synax, Senwell, Synax AI) and terms of Indian law (GST, IRN, e-way bill, ITC-04, Tally)
   as they are, with a short explanation in the target language where a European reader needs it.
5. **Tone**: French - formal "vous". German - formal "Sie". Short, concrete sentences like the English.
6. **Keep keys in sync**: a missing key in `fr.json`/`de.json` must be caught before release (check script, section 12).
7. **Tools (optional, later)**: a translation management system (Crowdin, Lokalise, Phrase), or the `next-intl` extractor, for
   translator workflows and translation memory.
8. **Never edit translations to fix layout**; fix the layout.

## 12. Testing and the QA checklist

Automated (what we can check now):
- `npx tsc --noEmit` and `npx eslint app i18n proxy.ts next.config.ts`.
- Probe the routes (dev server): `/`, `/fr`, `/de`, `/products`, `/fr/products/staffing`, `/xx/products` (404), `/erp` (redirect).
- **`node tools/check-messages.mjs`** (exists): every key in `en.json` exists in `fr.json` and `de.json` and vice versa, and the `{placeholders}` and `<tags>` match. It exits with code 1 when something differs, so it can run in CI.

Manual, per language, per release:
- [ ] `<html lang>` is right; the page title/description are translated (when phase 3 is done).
- [ ] Every internal link keeps the language (`/fr/...`); the language switcher stays on the same page.
- [ ] No English left in a French/German page that should be translated; no raw keys (`Nav.overview`) visible.
- [ ] German text: no overflow, truncation or broken buttons, header menu still fits, mobile menu fits.
- [ ] Plurals, numbers, dates look right for the language.
- [ ] Dark mode and light mode both fine.
- [ ] Forms work and their messages/emails are in the right language.
- [ ] hreflang links are reciprocal; canonical points at itself; `NEXT_PUBLIC_SITE_URL` set.
- [ ] Browser back/forward, direct links and a hard refresh keep the language.
- [ ] Try a browser set to French (Accept-Language) opening `/` for the first time -> goes to `/fr`; then pick English with the switcher -> stays English.

Useful trick: **pseudo-localisation** - temporarily make every English message 40 % longer with accented characters
(`Schedule a Demo` -> `[Šçhéđúlé á Ðémó ~~~~]`) to find layout breaks and untranslated text without waiting for translators.

## 13. What is translated today, and the roadmap

**Done (phase 1)**
- Routing for `en` (no prefix), `fr`, `de`; `/erp` redirects to `/`.
- `<html lang>`, per-language Open Graph locale, canonical + hreflang on every page, hreflang `Link` header.
- Language switcher (desktop and mobile header).
- All internal links are language-aware.

**Done so far in phase 2** (401 messages per language, checked by `tools/check-messages.mjs`)
- Header (menu labels, buttons, aria labels) and the skip link.
- Buttons ("Schedule a Demo", "Watch overview"), theme toggle labels, breadcrumb, "Get started" band tag, jump bar label.
- Footer: headings, intro, compliance chips, links, legal bar, product names.
- Demo form and tour modal (everything described in section 10), including the language sent with each lead.
- Home hero: headline, the three ticks, buttons, product names and one-line descriptions (`Products.*`).
- Home body: the Synax AI section (cards and the sample chat), "Running on Synax", security intro, heritage text, closing banner, mobile sticky button.
- Home product carousel (`Carousel`), the purpose section (`Purpose`), the USP section with its three story rows and the invoice mock-up (`Usp`),
  the comparison section (`Comparison`, with the five benchmark rows in `Benchmark`, which `/why-synax` will reuse) and the rollout blueprint (`Rollout`).

**Left in phase 2**
- Remaining small items: tour player labels (`tour-player.tsx`), `jump-bar` chip labels (they come from the pages).

**Done so far in phase 3** (505 messages per language)
- **Solutions** (`SolutionGroups`, `Solutions`, `Sectors`): the 8 solutions (title, one-line summary, tag, description, challenge, solution,
  four capabilities; a shorter `footer` name for three of them) and the 3 group names live in the message files, keyed by the solution `key`
  (`aerospace`, `energy`, `machinery`, `services`, `precision`, `rubber`, `workforce`, `staffing`) and the group id (`industry`, `process`, `need`).
  They are used by the header's Solutions menu (desktop and mobile), the footer, and the home "Sector & Challenge Alignment" block. `solutions.ts`
  keeps the structure (key, group, tone, product, href, related solutions) and still holds the English text, which is no longer displayed on the
  pages converted so far.
- **Product menu lines**: `Products.<key>.menu` (the one-line description, also used by the hero) feeds the header's Products menu (desktop and
  mobile) and the footer's product cards.

- **`/products`** (`ProductsPage`, `ProductData`): hero, the six cards with badge, subtitle and three highlights, buttons. `ProductData.<key>` holds
  the badge, the subtitle and the four highlights (`h1`..`h4`) of each product and is what the six product pages will reuse.
- **`/solutions`** (`SolutionsPage`, `Scene`, `SolutionPaths`, `Areas`, `AreasShort`, `Modules`, `Workflow`, `Faq`, `Industries`): hero and the animated
  scene, eight starting paths, the coverage table, the module directory, the solution-page list, the shared workflow, the FAQ and the closing band.
- **Shared words, translated once**: the 52 module names (`Modules`), the 8 module areas (`Areas`), the 4 workflow stages (`Workflow`), the 7 FAQ
  questions and answers (`Faq`) and the 7 solution pages' names and one-line summaries (`Industries`). They will be reused by the solution pages,
  `/why-synax` and the product pages. Lookups use the `slug()` helper (`i18n/slug.ts`): `t(slug("Gate entry, GRN & store inward"))` reads
  `Modules.gate-entry-grn-store-inward`.
- **`/why-synax`** (`Why`, `WhyRace`, `ReasonTabs`, `Benefits`) and **`/security`** (`Security`): heroes, the three pillars, the flow, the five reasons,
  the animated "one part, two ways" scene, the comparison table (reusing `Benchmark`), pricing, FAQ, heritage, the six controls, the posting checks,
  compliance, shared responsibility, privacy and terms, and the closing bands.
- **The portal's own statements** (`Live`): the positioning line, the three pillars (kicker, title, copy, four points each), the six flow steps and
  their lead, the four security statements, the pricing text and the four compliance statements. They are used by `/why-synax`, `/security`, the
  footer's tagline and the home page's security cards, and the flow steps will be reused by the solution pages. `Benefits.<id>` holds the five
  platform benefits (`quality`, `compliance`, `traceability`, `security`, `connected`: tab, question, answer, three points).
- **The 7 solution pages** (`/solutions/<slug>`; `SolutionPage`, `Industries.<slug>`, `ProductModules`): the page template (jump bar, counts, the
  challenge, the flow, the modules, the products, proof, FAQ, other industries, closing band), the five hero compositions (flight deck, drawing,
  pipeline, poster, roster) and each page's own text: tagline, headline (split into `titleHead` + `titleTail`, because the coloured part of the
  headline starts after "for"/"pour les"/"für"), lead, who it is for, four challenges (`ch1..ch4`), flow title and lead, custom flow steps
  (`flow.f1..fN`, for oil & gas, rubber, IT services and workforce), hero captions and image descriptions, and the browser title and description.
  The aerospace page reuses `Workflow`, precision and machinery reuse `Live.flow`, and the chips under a step reuse `Modules`.
- **How a solution page is translated** (`app/erp/_data/localize.ts`): `industries.ts` keeps the English data (slug, order, products, which
  module group to show) and `localizeIndustry(page, ...)` returns a copy with every word taken from the messages; `localizeModules()` does the
  same for a product's three module groups (`ProductModules.<key>.g1..g3`, with `title`, `desc`, `i1..iN`; all 7 products are translated so the
  product pages can reuse them). Things that must not change with the language use the English data: the tour's name (`tourTitleOf(slug)`,
  because tours are looked up by that title), the demo form's product value, and the hero logic that finds the "inspect" gate and the
  overtime/payroll rows (by id or by position in the English flow).
- **The 6 product pages** (`/products/<slug>`; `ProductShared`, `ProductPage.<key>`, `AiBoard`, `ProductMeta`): each page has its own layout, so each
  has its own message group, keyed by product (`precision`, `it`, `hrms`, `staffing`, `shopfloor`, `ai`). The component keeps the structure (icons,
  widths, which colour, how many items) and reads every word with `t("...")`. Repeated items use numbered keys (`chain.s1..s6`, `l1..l5`, `a1..a6`),
  so a list in the page and its messages stay in step. `ProductShared` holds what all six pages share: the breadcrumb, "Start with what hurts
  most", the four rollout phases, "Works with the rest of Synax", the FAQ heading and the closing band. Module chips are looked up in `Modules` by
  `slug(name)` (eight HR module names were added for HRMS); notes in the "works with" cards and a product's own extra FAQ entries are passed to
  `ProductTail` already translated, while the portal's FAQ entries are found by their English question and read from `Faq`. The animated chat board
  of the AI page (`ai-ask-board.tsx`) reads `AiBoard` (its four scenarios, sample names and the approve/reject buttons); its typing loop restarts
  only when the language changes. Tour names, the "Assets Module Tour" and the product name sent with the demo form stay English.
- **Page titles and descriptions** for `/products`, `/solutions`, `/why-synax` and `/security` come from the `Meta` namespace; the six product pages read
  `ProductMeta.<key>` and the solution pages `Industries.<slug>`. They are read through
  `getTranslations(...)` in `generateMetadata` (for example `getTranslations("Meta.why")`; the solution pages use `Industries.<slug>.seoTitle` and
  `.seoDescription`).

**Left in phase 3**
- Clean-up: `/cloud-erp-software/manufacturing-management` now redirects (permanently, `308`) to `/products/manufacturing-erp` in each language, so its route
  folder `app/[locale]/cloud-erp-software/`, the generic `product-page.tsx` and the English `description`, `capabilities`, `heroStat` and `highlights` in
  `products.ts` are no longer reachable or shown and can be deleted. Redirects in `next.config.ts` run before the language proxy, so a redirect for a
  page needs one rule for English and one for `/fr` and `/de` (see the legacy rule there). The older redirects (`/products/it-services-project-erp`,
  `/solutions/automotive-heavy-industrial`) only cover English addresses.
- `robots.txt`.
- On the solution pages the guided tour: the buttons are translated, but the tour player's title, captions and audio are still English (phase 4).

**How the data-driven home sections were done**: where a section reads a data file (`benchmark.ts`, `content.ts` rollout), the data file keeps the
structure (icons, order, ids) and the words moved to messages keyed by the row's id or position (`Benchmark.<icon>.*`, `Rollout.phases.p1..p4`),
so the English text exists in one place only (`messages/en.json`) and the old English strings in the data files are no longer shown.

**Phase 3 - content**
Product pages (6), solution pages (8), `/solutions`, `/products`, `/why-synax`, `/security`; translated `<title>` and
descriptions; `sitemap.xml`; localised 404 (all done); native review (open).

**Phase 4 - media and legal**
Tour captions and audio per language; hero images with words; privacy/terms with legal review; locale-specific
numbers/currency decisions.

**Phase 5 - quality**
Key-parity check in CI, pseudo-localisation, typed message keys (`declare module "next-intl" { interface AppConfig { Messages: typeof en } }`),
trim the client message payload, translation management tool.

## 14. How to add a new language

Example: Spanish (`es`).
1. `i18n/routing.ts`: add `"es"` to `locales`; add `es: "Español"` to `LOCALE_NAMES` and `es: "es_ES"` to `OG_LOCALE`.
2. Create `messages/es.json` with every key of `en.json` translated.
3. (Content) add the same language to the content message files and the tour lines/audio.
4. Check layout (text expansion, accents), add the language to QA.
5. Nothing else is needed: the proxy, `generateStaticParams`, the switcher, `<html lang>` and hreflang all read `routing.locales`.

To make another language the default: change `defaultLocale` (and think about redirects: the old prefix-free URLs are English).

## 15. Troubleshooting and lessons learned

| Symptom | Cause / fix |
|---|---|
| **Every English sub-page (`/products`) is 404, but `/` and `/fr/products` work** | The proxy only ran for `/`. The `matcher` in `proxy.ts` lost a backslash: `"/((?!api\|_next\|_vercel\|.*\\..*).*)"` needs a **double** backslash inside a TypeScript string (`\\.`), otherwise it becomes `.*..*` and excludes every path. (This happened during phase 1.) |
| Changes to `next.config.ts` or `proxy.ts` do nothing | Restart `npm run dev`. |
| Everything returns 500 after editing config | Never run `next build` while `next dev` runs (both write `.next`). Stop dev, delete `.next`, start again. |
| `Error: tour <slug>: 0 captions for N scenes` | A solution page was added without tour captions/durations/audio. Add them in the same change (README rule). |
| Raw key shown (`Nav.overview`) | The key is missing in that language file (or the namespace name is wrong). |
| A French message shows `<b>` tags (or `{name}`) as plain text | A straight apostrophe next to a tag or placeholder (`l'<b>IA</b>`) starts a quoted section in ICU message format. Write the typographic apostrophe `’` there (`l’<b>IA</b>`) or double the straight one (`''`). `node tools/check-messages.mjs` now reports this. |
| Link loses the language | A file still imports `Link` from `next/link`. Use `@/i18n/navigation`. |
| Active link not highlighted | `usePathname` was imported from `next/navigation` (it includes `/fr`). Use the one from `@/i18n/navigation`. |
| Flash of English on a French page | A component still holds hard-coded text. |
| Canonical/hreflang point at `localhost` | `NEXT_PUBLIC_SITE_URL` is not set. |
| Hydration warning about `lang` | Browser translation extensions (Chrome Translate) modify the page; harmless. `<html>` already has `suppressHydrationWarning`. |
| Build error: "root param needs a value" | A root parameter needs `generateStaticParams` with at least one value (the root layout has it). |

## 16. Decisions and why

| Decision | Reason | Alternative kept in mind |
|---|---|---|
| Sub-path URLs, English without prefix | Keeps all existing English URLs; one domain; best for SEO. | `always` prefix (`/en/...`); domains per country. |
| `next-intl` | Works in server *and* client components (our header/footer/forms are client components), ICU plurals, typed navigation, Next 16 support. | Next.js's built-in dictionary pattern (server-only plumbing). |
| `next/root-params` for the language | The current, recommended way (the older `requestLocale` is deprecated); fits Cache Components. | `params` prop drilling. |
| Slugs stay English | Avoids redirect/mapping complexity in phase 1. | Translated `pathnames`. |
| English is the fallback | A missing translation never breaks a page. | Fail the build on missing keys (planned parity check). |
| Draft translations reviewed by native speakers | Speed plus quality. | Fully professional translation. |
| Left-to-right only | The three languages are LTR. | Add `dir` support with an RTL language. |

## 17. Further reading

- Next.js docs in this repo: `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`,
  `.../03-api-reference/04-functions/next-root-params.md`, `.../03-file-conventions/proxy.md`.
- next-intl: <https://next-intl.dev> (routing, navigation, messages, ICU, formatting, root params).
- ICU MessageFormat: <https://unicode-org.github.io/icu/userguide/format_parse/messages/>.
- CLDR plural rules: <https://cldr.unicode.org/index/cldr-spec/plural-rules>.
- MDN `Intl`: <https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl>.
- Google on multilingual sites and hreflang: <https://developers.google.com/search/docs/specialty/international>.
- W3C Internationalization (i18n) activity: <https://www.w3.org/International/>.
