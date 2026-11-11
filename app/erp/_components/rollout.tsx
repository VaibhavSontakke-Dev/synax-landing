"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  CircleCheck,
  Compass,
  Flag,
  Repeat,
  Rocket,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { ROLLOUT, ROLLOUT_CHECKLIST, ROLLOUT_ROLES } from "../_data/content";
import { Reveal } from "./reveal";
import { Container, Section, SectionHeading } from "./ui";
import { SectionTag } from "./section-tag";

/**
 * Rollout blueprint.
 *
 * lg+: one connected track runs through four milestone nodes (solid navy to the
 * pilot, dashed orange for the open-ended last phase) with a card under each.
 * Below lg the cards stack and the nodes sit beside them. The Week 3 pilot is
 * the go-live milestone, so it gets the orange emphasis. Copy comes from
 * `_data/content.ts` unchanged.
 */

// One icon per phase, in the same order as ROLLOUT.
const PHASE_ICONS: LucideIcon[] = [Compass, SlidersHorizontal, Rocket, TrendingUp];
const ROLE_ICONS: LucideIcon[] = [Flag, UsersRound, Settings, Award];

const GO_LIVE_INDEX = 2;
const ONGOING_INDEX = 3;

function timingLabel(timing: string, index: number) {
  if (index === GO_LIVE_INDEX) return `${timing} · Go-live`;
  if (index === ONGOING_INDEX) return `${timing} · Ongoing`;
  return timing;
}

export function Rollout() {
  return (
    <Section id="rollout" tone="tint" compact>
      <Container>
        <Reveal>
          <div className="text-center">
            <SectionTag>Rollout blueprint</SectionTag>
          </div>
          <SectionHeading
            align="center"
            title="A phased path from discovery to optimization"
            lead="Prepare the data and owners first, pilot with one team, then expand in governed waves."
          />
        </Reveal>

        {/* Timeline */}
        <div className="relative mt-12 lg:mt-14">
          {/* Track (lg+): navy through the pilot, dashed orange afterwards */}
          <div className="pointer-events-none absolute inset-x-0 top-5 hidden lg:block" aria-hidden>
            <div className="absolute top-0 left-[12.5%] h-0.5 w-[50%] bg-erp-brand" />
            <div className="absolute top-0 left-[62.5%] h-0 w-[25%] border-t-2 border-dashed border-orange-500" />
            <ArrowRight className="absolute -top-[9px] left-[calc(87.5%+0.25rem)] size-5 text-orange-500" />
          </div>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ROLLOUT.map((phase, index) => {
              const Icon = PHASE_ICONS[index] ?? Compass;
              const goLive = index === GO_LIVE_INDEX;
              const ongoing = index === ONGOING_INDEX;

              return (
                <Reveal key={phase.step} delay={index * 90} as="li" className="relative flex flex-col">
                  {/* Milestone node */}
                  <div className="mb-3 flex lg:justify-center">
                    <span
                      className={`relative z-10 flex size-10 items-center justify-center rounded-full font-mono text-sm font-semibold ${
                        goLive
                          ? "bg-orange-600 text-white"
                          : ongoing
                            ? "border-2 border-dashed border-orange-500 bg-white text-orange-600"
                            : "bg-erp-brand text-white"
                      }`}
                    >
                      {phase.step}
                    </span>
                  </div>

                  <div
                    className={`h-full rounded-2xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md ${
                      goLive
                        ? "border-2 border-orange-500"
                        : ongoing
                          ? "border border-dashed border-orange-400"
                          : "border border-erp-line"
                    }`}
                  >
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold ${
                        goLive ? "bg-orange-600 text-white" : "bg-erp-surface-3 text-erp-body"
                      }`}
                    >
                      {timingLabel(phase.timing, index)}
                    </span>
                    <div className="mt-3 flex items-start gap-2">
                      <Icon className="mt-0.5 size-[18px] shrink-0 text-orange-600" aria-hidden />
                      <h3 className="text-[0.9375rem] leading-snug font-semibold text-erp-ink">{phase.title}</h3>
                    </div>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-erp-body">{phase.copy}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        {/* Pacing note + CTA */}
        <Reveal delay={60}>
          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-erp-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex max-w-2xl items-start gap-3 text-[0.9375rem] text-erp-body">
              <Repeat className="mt-0.5 size-5 shrink-0 text-orange-600" aria-hidden />
              <span>
                Start with the highest-impact team, then expand in 1–2 week waves. Total timing depends on
                process complexity and data readiness.
              </span>
            </p>
          </div>
        </Reveal>

        {/* Checklist + ownership */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-erp-line bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-erp-ink">Before onboarding</h3>
              <span className="text-xs text-erp-soft">{ROLLOUT_CHECKLIST.length} steps</span>
            </div>
            <ul className="mt-4 space-y-3">
              {ROLLOUT_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-3 text-[0.875rem] leading-relaxed text-erp-body">
                  <CircleCheck className="mt-0.5 size-[18px] shrink-0 text-orange-600" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={90} className="rounded-2xl border border-erp-line bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-erp-ink">Rollout ownership</h3>
              <span className="text-xs text-erp-soft">{ROLLOUT_ROLES.length} roles</span>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {ROLLOUT_ROLES.map((role, index) => {
                const Icon = ROLE_ICONS[index] ?? Flag;
                return (
                  <div key={role.title} className="rounded-xl bg-erp-surface-3 p-3.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-erp-brand text-white">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <dt className="mt-2.5 text-sm font-semibold text-erp-ink">{role.title}</dt>
                    <dd className="mt-1 text-[0.8125rem] leading-relaxed text-erp-body">{role.description}</dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
