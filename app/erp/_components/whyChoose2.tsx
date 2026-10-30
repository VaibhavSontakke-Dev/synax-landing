"use client";

import { useRef, useState } from "react";

import { PLATFORM_BENEFITS } from "../_data/content";
import { CheckIcon, ModuleIcon } from "./icons";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading } from "./ui";

/**
 * Pain-first benefit tabs. Follows the WAI-ARIA tabs pattern: roving tabindex,
 * arrow/Home/End navigation, and a panel wired to its tab both ways. The list
 * is vertical from `lg` and a horizontally scrollable strip below it.
 */
export function WhyChoose2() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = PLATFORM_BENEFITS.length - 1;

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    let next: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      next = active === last ? 0 : active + 1;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = active === 0 ? last : active - 1;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    }

    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const benefit = PLATFORM_BENEFITS[active];

  return (
    <Section id="platform-benefits" tone="tint">
      <div className="absolute inset-0 erp-grid-light" aria-hidden />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Why Synax"
            title="Built around the controls regulated production actually needs"
            lead="Not a feature count — the handful of things that decide whether an ERP survives contact with an aerospace shop floor."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10">
            {/* ----------------------- Tab list ----------------------- */}
            <div
              role="tablist"
              aria-label="Platform benefits"
              aria-orientation="vertical"
              onKeyDown={handleKeyDown}
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {PLATFORM_BENEFITS.map((item, index) => {
                const selected = index === active;

                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`${item.id}-tab`}
                    aria-selected={selected}
                    aria-controls={`${item.id}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    className={`flex shrink-0 items-center gap-3 rounded-erp-md border px-4 py-3 text-left text-[0.875rem] font-semibold whitespace-nowrap transition-all duration-300 ease-erp lg:w-full lg:border-l-[3px] lg:whitespace-normal ${
                      selected
                        ? "border-erp-brand/35 bg-white text-erp-ink shadow-erp-md lg:border-l-erp-brand"
                        : "border-erp-line bg-white/60 text-erp-soft hover:border-erp-brand/30 hover:bg-white hover:text-erp-ink"
                    }`}
                  >
                    <span
                      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-erp-sm transition-colors duration-300 ${
                        selected
                          ? "bg-erp-brand text-white"
                          : "bg-erp-surface-3 text-erp-brand"
                      }`}
                    >
                      <ModuleIcon name={item.icon} className="size-4" />
                    </span>
                    {item.tab}
                  </button>
                );
              })}
            </div>

            {/* ----------------------- Panel ----------------------- */}
            <div
              role="tabpanel"
              id={`${benefit.id}-panel`}
              aria-labelledby={`${benefit.id}-tab`}
              tabIndex={0}
              className="relative overflow-hidden rounded-erp-xl border border-erp-line bg-white p-6 shadow-erp-md sm:p-8 lg:p-10"
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full opacity-50 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(11,108,255,0.18) 0%, transparent 70%)",
                }}
                aria-hidden
              />

              {/* key= restarts the entrance each time the tab changes. */}
              <div key={benefit.id} className="relative animate-erp-rise">
                <h3 className="text-[length:var(--erp-h3)] leading-snug font-semibold text-balance text-erp-ink">
                  {benefit.question}
                </h3>
                <p className="mt-4 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-erp-body">
                  {benefit.answer}
                </p>

                <ul className="mt-6 space-y-3 border-t border-erp-line pt-6">
                  {benefit.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-erp-accent" />
                      <span className="text-[0.9375rem] leading-snug text-erp-body">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
