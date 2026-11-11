import Link from "next/link";
import { AlertCircle, ArrowRight, Check } from "lucide-react";
import { PRODUCT_DATA, hrefFor, routeFor } from "../_data/products";
import { INDUSTRY_PAGES, industryHref, type IndustryPage } from "../_data/industries";
import { INDUSTRY_ICON } from "./industry-icons";
import { LIVE_FAQ } from "../_data/live";
import { Block, CtaBand, Faq, PageHero } from "./site-page";
import { TONE } from "./route-tone";

/**
 * Industry page template (/solutions/<slug>): who it is for, the challenges, the flow that answers
 * them, the modules and products involved, proof where there is any, the questions people ask, and the
 * other industries. Server component; content comes from `_data/industries.ts`.
 */

export function IndustryPageView({ page }: { page: IndustryPage }) {
  const tone = TONE[page.tone];
  const Icon = INDUSTRY_ICON[page.icon];
  const modules = PRODUCT_DATA[page.modulesFrom].moduleSection;
  const faq = LIVE_FAQ.filter((f) => page.faq.includes(f.q));
  const others = INDUSTRY_PAGES.filter((i) => i.slug !== page.slug);

  return (
    <main className="pb-6">
      <PageHero
        crumbs={[{ label: "Solutions", href: "/solutions" }, { label: page.name }]}
        tag={page.tag}
        title={page.title}
        lead={page.lead}
        product={page.demoName}
        tourTitle={`${page.name} Tour`}
        aside={
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <span className={`flex size-10 items-center justify-center rounded-xl border ${tone.tile}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-slate-900">At a glance</span>
            </div>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-bold tracking-wider text-slate-500 uppercase">Built for</dt>
                <dd className="mt-1 leading-relaxed text-slate-700">{page.whoFor}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-wider text-slate-500 uppercase">Delivered by</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {page.products.map((key) => {
                    const r = routeFor(key);
                    return (
                      <Link
                        key={key}
                        href={hrefFor(key)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:bg-white ${TONE[r.tone].chip}`}
                      >
                        {r.name}
                      </Link>
                    );
                  })}
                </dd>
              </div>
            </dl>
          </div>
        }
      />

      {/* Challenges */}
      <Block
        id="challenges"
        tag="The challenge"
        title="What gets in the way today"
        lead="The problems we hear most from this kind of business."
      >
        <ul className="grid gap-5 sm:grid-cols-2">
          {page.challenges.map((c) => (
            <li key={c.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600">
                <AlertCircle className="size-[18px]" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      {/* Flow */}
      <Block id="flow" tag="How Synax answers it" title={page.flowTitle} lead={page.flowLead} tone="white">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.flow.map((step, i) => (
            <li key={step.title} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-900 font-mono text-sm font-semibold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.copy}</p>
              {step.chips ? (
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${step.title} modules`}>
                  {step.chips.map((c) => (
                    <li key={c} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
                      {c}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </Block>

      {/* Modules */}
      {modules ? (
        <Block id="modules" tag={modules.kicker} title="The modules behind it" lead={modules.subtitle}>
          <ul className="grid gap-5 md:grid-cols-3">
            {modules.groups.map((g) => (
              <li
                key={g.id}
                className={`flex flex-col rounded-2xl border border-t-4 border-slate-200 bg-white p-6 shadow-sm ${tone.bar}`}
              >
                <h3 className="text-base font-bold text-slate-900">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.description}</p>
                <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className={`mt-0.5 size-4 shrink-0 ${tone.check}`} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {/* Products */}
      <Block
        id="products"
        tag="Delivered by"
        title="The products behind this solution"
        lead="Start with the first and add the others when you are ready."
        tone="white"
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {page.products.map((key, i) => {
            const r = routeFor(key);
            const t = TONE[r.tone];
            const PIcon = PRODUCT_DATA[key].icon;
            return (
              <li key={key}>
                <Link
                  href={hrefFor(key)}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex size-10 items-center justify-center rounded-xl border ${t.tile}`}>
                      <PIcon className="size-5" aria-hidden="true" />
                    </span>
                    {i === 0 ? (
                      <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">Start here</span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{r.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{PRODUCT_DATA[key].subtitle}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900">
                    Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Block>

      {/* Proof */}
      {page.proof ? (
        <Block
          id="proof"
          tag="Running on Synax"
          title="Built by a group that runs industrial operations"
          lead="These Senwell Group companies run on Synax."
        >
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {page.proof.map((name) => (
              <li key={name} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <p className="text-base font-extrabold tracking-tight text-slate-900">{name}</p>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {/* FAQ */}
      {faq.length > 0 ? (
        <Block id="faq" tag="FAQ" title="Questions we hear most" tone={page.proof ? "white" : "plain"}>
          <Faq items={faq} />
        </Block>
      ) : null}

      {/* Other industries */}
      <section aria-labelledby="other-heading" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 id="other-heading" className="mb-8 text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Other industries
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => {
              const t = TONE[o.tone];
              const OIcon = INDUSTRY_ICON[o.icon];
              return (
                <li key={o.slug}>
                  <Link
                    href={industryHref(o.slug)}
                    className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${t.tile}`}>
                      <OIcon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900">{o.name}</span>
                      <span className="block text-xs text-slate-500">{o.menu}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-600" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand
        title="See Synax on your own process"
        text="A short walkthrough with a Senwell Group systems engineer, using your own parts, people and processes."
        product={page.demoName}
        tourTitle={`${page.name} Tour`}
      />
    </main>
  );
}

