import { slug } from "@/i18n/slug";
import { WORKFLOW_STAGES } from "./content";
import type { FlowStep, IndustryPage } from "./industries";
import { LIVE_FLOW } from "./live";
import type { ModuleSection, ProductKey } from "./products";

/**
 * Turns the English data in `industries.ts` / `products.ts` into the visitor's language.
 *
 * The data files keep the structure (slugs, group ids, the order and number of steps, which products deliver a page) and the
 * English words as the identity. The words that are shown come from messages/*.json:
 *   - `Industries.<slug>.*`        challenges, flow steps, tagline, SEO text, hero captions of one solution page
 *   - `Workflow`, `Live.flow`      flows that several pages share (aerospace uses the first, precision and machinery the second)
 *   - `Modules.<slug(name)>`       the module chips under a flow step
 *   - `ProductModules.<key>`       the three module groups of a product (also shown on the solution pages)
 *
 * Both functions are pure: pass in the translators (`useTranslations` in a component, `getTranslations` in `generateMetadata`).
 */

type Translator = (key: string, values?: Record<string, string | number>) => string;
type HasTranslator = Translator & { has: (key: string) => boolean };

export function localizeIndustry(
  page: IndustryPage,
  t: HasTranslator,
  tm: Translator,
  tw: Translator,
  tl: Translator,
): IndustryPage {
  const s = page.slug;
  const mod = (name: string) => tm(slug(name));

  let flow: FlowStep[];
  if (t.has(`${s}.flow.f1.title`)) {
    // A flow of this page's own (oil & gas, rubber, IT services, workforce).
    flow = page.flow.map((step, i) => ({
      title: t(`${s}.flow.f${i + 1}.title`),
      copy: t(`${s}.flow.f${i + 1}.copy`),
      ...(step.chips ? { chips: step.chips.map(mod) } : {}),
    }));
  } else if (s === "aerospace-defence") {
    flow = WORKFLOW_STAGES.map((st) => ({ title: tw(`${st.id}.title`), copy: tw(`${st.id}.copy`), chips: st.modules.map(mod) }));
  } else {
    // precision and machinery: the portal's six-step flow.
    flow = LIVE_FLOW.map((_, i) => ({ title: tl(`flow.f${i + 1}.title`), copy: tl(`flow.f${i + 1}.copy`) }));
  }

  const titleHead = t(`${s}.titleHead`);
  const titleTail = t(`${s}.titleTail`);

  return {
    ...page,
    name: t(`${s}.name`),
    menu: t(`${s}.menu`),
    tag: t(`${s}.tag`),
    titleHead,
    titleTail,
    title: `${titleHead}${titleTail}`,
    lead: t(`${s}.lead`),
    whoFor: t(`${s}.whoFor`),
    seoTitle: t(`${s}.seoTitle`),
    seoDescription: t(`${s}.seoDescription`),
    challenges: page.challenges.map((_, i) => ({ title: t(`${s}.ch${i + 1}.title`), text: t(`${s}.ch${i + 1}.text`) })),
    flowTitle: t(`${s}.flowTitle`),
    flowLead: t(`${s}.flowLead`),
    flow,
    heroImage: page.heroImage ? { ...page.heroImage, alt: t(`${s}.heroAlt`) } : undefined,
  };
}

/** The module groups of a product in the visitor's language (`tp` = translator for "ProductModules"). */
export function localizeModules(section: ModuleSection, key: ProductKey, tp: Translator): ModuleSection {
  return {
    kicker: tp(`${key}.kicker`),
    subtitle: tp(`${key}.subtitle`),
    groups: section.groups.map((g, gi) => ({
      id: g.id,
      title: tp(`${key}.g${gi + 1}.title`),
      description: tp(`${key}.g${gi + 1}.desc`),
      items: g.items.map((_, ii) => tp(`${key}.g${gi + 1}.i${ii + 1}`)),
    })),
  };
}
