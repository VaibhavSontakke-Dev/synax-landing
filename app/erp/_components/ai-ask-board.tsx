"use client";

import { useEffect, useState } from "react";
import { Bot, MessageSquare, Send } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Hero visual of the AI & Business Intelligence page: an animated "Ask Synax AI" board in the same dark chat
 * style as the home page's "Your Enterprise, Answered Instantly" section.
 *
 * It plays a loop: a question is typed into the input, sent, the assistant "thinks", answers with a card, holds,
 * then the board clears and the next question is asked, and so on. With reduced motion it shows the first
 * answer, still. Everything here is an illustration with sample data (labelled as such); the board is hidden
 * from assistive tech and described by a short text instead.
 *
 * The words come from messages/*.json ("AiBoard"); `SCENARIOS` keeps the structure (which rows have initials, which are warnings,
 * whether a scenario ends with a note or with the approval buttons).
 */

interface Row {
  initials?: string;
  warn?: boolean;
}

interface Scenario {
  /** Message group under "AiBoard" ("s1".."s4"). */
  id: "s1" | "s2" | "s3" | "s4";
  rows: Row[];
  /** Small line under the card ("note"). */
  note?: boolean;
  /** Show the approval buttons (the agent proposes, a person decides): "approval". */
  approval?: boolean;
}

const SCENARIOS: Scenario[] = [
  { id: "s1", rows: [{ initials: "EC" }, { initials: "DM" }, { initials: "SA" }], note: true },
  // Follow-up: takes a name from the answer above.
  { id: "s2", rows: [{ initials: "EC" }, {}], note: true },
  { id: "s3", rows: [{ warn: true }, { warn: true }], approval: true },
  { id: "s4", rows: [{}, {}, {}], note: true },
];

const TYPE_MS = 38;

type Phase = "typing" | "asked" | "thinking" | "answered" | "leaving";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function AiAvatar({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-orange-300/25 bg-orange-400/15 ${small ? "mt-0.5 size-6 rounded-lg" : "size-8 rounded-xl"}`}
    >
      <Bot className={small ? "size-3 text-orange-300" : "size-4 text-orange-300"} />
    </div>
  );
}

export function AiAskBoard() {
  const t = useTranslations("AiBoard");
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [still, setStill] = useState(false);

  // The questions in the visitor's language (read once per language, so the typing loop below does not restart).
  const questionsKey = SCENARIOS.map((sc) => t(`${sc.id}.q`)).join("|");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => {
        setStill(true);
        setPhase("answered");
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    (async () => {
      let i = 0;
      while (!cancelled) {
        const q = questionsKey.split("|")[i];
        setIdx(i);
        setPhase("typing");
        setTyped("");
        await wait(700);
        for (let c = 1; c <= q.length && !cancelled; c++) {
          setTyped(q.slice(0, c));
          await wait(TYPE_MS);
        }
        await wait(450);
        if (cancelled) return;
        setPhase("asked");
        setTyped("");
        await wait(500);
        if (cancelled) return;
        setPhase("thinking");
        await wait(1100);
        if (cancelled) return;
        setPhase("answered");
        await wait(4800);
        if (cancelled) return;
        setPhase("leaving");
        await wait(450);
        i = (i + 1) % SCENARIOS.length;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [questionsKey]);

  const s = SCENARIOS[idx];
  const question = t(`${s.id}.q`);
  const showQuestion = phase !== "typing";
  const showThinking = phase === "thinking";
  const showAnswer = phase === "answered" || phase === "leaving";
  const leaving = phase === "leaving";

  return (
    <figure className="m-0">
      <p className="sr-only">
        {t("srDescription")}
      </p>
      <div aria-hidden="true" className="keep-light-palette overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/60 px-5 py-3.5">
          <AiAvatar />
          <div>
            <div className="text-sm font-bold text-white">{t("name")}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              {t("connected")}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className={`h-[19.5rem] space-y-3.5 overflow-hidden p-5 text-xs transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`}>
          {showQuestion ? (
            <div key={`q-${idx}`} className="synax-ask-in flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm border border-orange-300/25 bg-orange-400/15 px-4 py-2.5 text-orange-50">{question}</div>
            </div>
          ) : null}

          {showThinking ? (
            <div key={`t-${idx}`} className="synax-ask-in flex items-center gap-2.5">
              <AiAvatar small />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3">
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : null}

          {showAnswer ? (
            <div key={`a-${idx}`} className="synax-ask-in flex items-start gap-2.5">
              <AiAvatar small />
              <div className="min-w-0 max-w-[92%] space-y-2 rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3 text-slate-200">
                <p>{t(`${s.id}.lead`)}</p>
                <ul className="space-y-1.5 pt-0.5">
                  {s.rows.map((r, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2.5 rounded-lg bg-slate-700/60 px-2.5 py-1.5 ${still ? "" : "synax-ask-in"}`}
                      style={still ? undefined : { animationDelay: `${180 + i * 140}ms` }}
                    >
                      {r.initials ? (
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-600 text-[10px] font-bold text-white">{r.initials}</span>
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-white">{t(`${s.id}.r${i + 1}.title`)}</span>
                        <span className="block truncate text-[10px] text-slate-400">{t(`${s.id}.r${i + 1}.sub`)}</span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.warn ? "bg-orange-400/20 text-orange-200" : "bg-emerald-400/15 text-emerald-300"}`}
                      >
                        {t(`${s.id}.r${i + 1}.tag`)}
                      </span>
                    </li>
                  ))}
                </ul>
                {s.approval ? (
                  <div className={`rounded-lg border border-dashed border-orange-300/40 px-2.5 py-2 ${still ? "" : "synax-ask-in"}`} style={still ? undefined : { animationDelay: "700ms" }}>
                    <p className="text-[10px] font-bold tracking-wider text-orange-300 uppercase">{t("proposes")}</p>
                    <p className="mt-0.5 font-semibold text-white">{t(`${s.id}.approval`)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-md bg-orange-300 px-3 py-1 text-[11px] font-semibold text-orange-950">{t("approve")}</span>
                      <span className="rounded-md border border-slate-600 px-3 py-1 text-[11px] font-semibold text-slate-300">{t("reject")}</span>
                    </div>
                  </div>
                ) : s.note ? (
                  <p className="text-[10px] text-slate-400">{t(`${s.id}.note`)}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {/* Input bar */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3">
            <MessageSquare className="size-4 shrink-0 text-slate-500" />
            <span className="min-w-0 flex-1 truncate text-xs">
              {phase === "typing" && typed ? (
                <span className="text-slate-100">
                  {typed}
                  <span className="ml-px inline-block h-3 w-px translate-y-0.5 animate-pulse bg-orange-300" />
                </span>
              ) : (
                <span className="text-slate-500">{t("placeholder")}</span>
              )}
            </span>
            <span className={`rounded-lg border p-1.5 transition-colors ${phase === "typing" && typed.length === question.length ? "border-orange-300/60 bg-orange-400/30" : "border-orange-300/25 bg-orange-400/15"}`}>
              <Send className="size-3 text-orange-200" />
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[11px] text-slate-500 lg:text-right">{t("caption")}</figcaption>
    </figure>
  );
}
