import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Check, ChevronDown, FileText, Lock, Mail } from "lucide-react";
import { Breadcrumb } from "./site-page";
import { SectionTag } from "./section-tag";
import { LegalToc } from "./legal-toc";
import { LEGAL_EMAIL, LEGAL_ENTITY, PRIVACY, TERMS, type LegalBlock, type LegalDoc } from "../_data/legal";

/**
 * The Privacy Policy and Terms pages (/privacy, /terms). One layout for both:
 * hero with the "In short" card, a sticky contents list beside numbered section cards, and a contact band.
 * The wording lives in `_data/legal.ts`.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";
const DOCS = [PRIVACY, TERMS];

/** Turns the contact email into a mail link and, in the Terms, "Privacy Policy" into a link to /privacy. */
function Rich({ text, doc }: { text: string; doc: LegalDoc }) {
  const pattern = doc.slug === "terms" ? /(info@senwellexports\.com|Privacy Policy)/g : /(info@senwellexports\.com)/g;
  return (
    <>
      {text.split(pattern).map((part, i) =>
        part === LEGAL_EMAIL ? (
          <a key={i} href={`mailto:${LEGAL_EMAIL}`} className={`rounded-sm font-semibold text-brand underline decoration-brand-line/30 underline-offset-2 hover:decoration-brand-line ${FOCUS}`}>
            {part}
          </a>
        ) : part === "Privacy Policy" ? (
          <Link key={i} href="/privacy" className={`rounded-sm font-semibold text-brand underline decoration-brand-line/30 underline-offset-2 hover:decoration-brand-line ${FOCUS}`}>
            {part}
          </Link>
        ) : (
          part
        )
      )}
    </>
  );
}

/** A list item; a short lead-in before a colon ("Account data: …") or a quoted defined term is set in bold. */
function Item({ text, doc }: { text: string; doc: LegalDoc }) {
  const label = /^([^:"]{3,48}):\s(.+)$/.exec(text);
  const term = /^("[^"]+")(.+)$/.exec(text);
  if (label)
    return (
      <>
        <strong className="font-semibold text-slate-900">{label[1]}:</strong> <Rich text={label[2]} doc={doc} />
      </>
    );
  if (term)
    return (
      <>
        <strong className="font-semibold text-slate-900">{term[1]}</strong>
        <Rich text={term[2]} doc={doc} />
      </>
    );
  return <Rich text={text} doc={doc} />;
}

function Body({ blocks, doc }: { blocks: LegalBlock[]; doc: LegalDoc }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-slate-700">
      {blocks.map((b, i) =>
        typeof b === "string" ? (
          <p key={i}>
            <Rich text={b} doc={doc} />
          </p>
        ) : (
          <ul key={i} className="space-y-2.5">
            {b.list.map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
                <span>
                  <Item text={t} doc={doc} />
                </span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const other = DOCS.find((d) => d.slug !== doc.slug)!;
  const toc = doc.sections.map((s) => ({ id: s.id, title: s.title }));

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-sky-200 bg-gradient-to-b from-sky-100 via-sky-50 to-page" aria-labelledby="page-heading">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <Breadcrumb items={[{ label: "Legal" }, { label: doc.title }]} />
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_440px] lg:gap-14">
            <div>
              <SectionTag lines="start">Legal</SectionTag>
              <h1 id="page-heading" className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-brand sm:text-4xl lg:text-5xl">
                {doc.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-surface px-3 py-1.5 text-brand">
                  <CalendarDays className="size-3.5 text-orange-500" aria-hidden="true" />
                  Effective <time dateTime={doc.effectiveIso}>{doc.effective}</time>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-surface px-3 py-1.5 text-slate-700">
                  <Building2 className="size-3.5 text-orange-500" aria-hidden="true" />
                  {LEGAL_ENTITY}
                </span>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">{doc.intro}</p>

              {/* Switch between the two documents */}
              <nav aria-label="Legal documents" className="mt-7 inline-flex rounded-xl border border-slate-200 bg-surface p-1 shadow-sm">
                {DOCS.map((d) => {
                  const on = d.slug === doc.slug;
                  const Icon = d.slug === "privacy" ? Lock : FileText;
                  return (
                    <Link
                      key={d.slug}
                      href={`/${d.slug}`}
                      aria-current={on ? "page" : undefined}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${FOCUS} ${
                        on ? "bg-brand-solid text-white shadow" : "text-slate-600 hover:bg-sky-50 hover:text-brand"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span className="sm:hidden">{d.short}</span>
                      <span className="hidden sm:inline">{d.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* In short */}
            <aside aria-labelledby="in-short-heading" className="relative overflow-hidden rounded-2xl border border-slate-200 bg-surface p-6 shadow-[0_20px_50px_-20px_rgba(30,58,138,0.25)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-orange-300" aria-hidden="true" />
              <h2 id="in-short-heading" className="text-lg font-extrabold tracking-tight text-brand">
                In short
              </h2>
              <ul className="mt-4 space-y-3">
                {doc.summary.map((s) => (
                  <li key={s} className="flex gap-3 text-sm leading-snug text-slate-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Check className="size-3 text-accent" aria-hidden="true" strokeWidth={3} />
                    </span>
                    <span>
                      <Rich text={s} doc={doc} />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                This summary is for convenience. The full text below is what applies.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Full text */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-12 lg:px-8 lg:py-14">
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <LegalToc items={toc} />
          </div>
        </div>

        <div id="legal-text" className="min-w-0">
          {/* Contents on phones and tablets */}
          <details className="group mb-6 rounded-2xl border border-slate-200 bg-surface shadow-sm lg:hidden">
            <summary className={`flex cursor-pointer list-none items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold text-brand ${FOCUS}`}>
              On this page · {doc.sections.length} sections
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ol className="grid gap-1 border-t border-slate-100 px-3 py-3 sm:grid-cols-2">
              {toc.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`flex gap-2 rounded-md px-2 py-1.5 text-[13px] text-slate-700 hover:bg-sky-50 hover:text-brand ${FOCUS}`}>
                    <span className="w-5 shrink-0 text-right text-slate-400 tabular-nums">{i + 1}.</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <ol className="space-y-5">
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <section id={s.id} aria-labelledby={`${s.id}-heading`} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-surface p-5 shadow-sm sm:p-7">
                  <div className="mb-4 flex items-center gap-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-sm font-bold text-white tabular-nums">
                      {i + 1}
                    </span>
                    <h2 id={`${s.id}-heading`} className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                      {s.title}
                    </h2>
                  </div>
                  <Body blocks={s.body} doc={doc} />
                </section>
              </li>
            ))}
          </ol>

          {/* Contact */}
          <section aria-labelledby="legal-contact-heading" className="keep-light-palette relative mt-8 overflow-hidden rounded-2xl bg-blue-950 p-6 text-white sm:p-8">
            <div className="absolute -top-16 -right-16 size-56 rounded-full bg-orange-500/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 id="legal-contact-heading" className="text-xl font-extrabold tracking-tight">
                  Questions about this document?
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Write to <span className="font-semibold text-white">{LEGAL_EMAIL}</span> and we will get back to you.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <a
                  href={`mailto:${LEGAL_EMAIL}`}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 ${FOCUS}`}
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Email us
                </a>
                <Link href={`/${other.slug}`} className={`inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-orange-300 hover:text-orange-200 ${FOCUS}`}>
                  Read the {other.title}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
