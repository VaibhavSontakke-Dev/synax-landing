"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Headset, Maximize2, MessageCircle, Minimize2, SendHorizontal, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useDemo } from "../demo-provider";
import { createDummyTransport, type AgentReply, type ChatAction, type ChatIntent, type ChatTransport } from "./chat-transport";

/**
 * Chat support: a launcher in the bottom-right corner and a chat panel above it, on every page (mounted in `erp-shell.tsx`).
 *
 * For now it talks to the DUMMY transport (`chat-transport.ts`): canned, translated answers with a fake typing delay, and an
 * email box for "talk to a person". Nothing is sent anywhere. To go live, pass a real `transport`; this file does not change.
 *
 * Behaviour: the first time it opens, the assistant greets and offers quick replies. The visitor's messages are kept for the browser
 * tab (sessionStorage), so the chat survives moving between pages. Leaving an email address ends the chat ("Your chat has ended.
 * To start a new chat, click here."). Words come from messages/*.json ("Chat"). Accessible: the panel is a non-modal dialog,
 * messages are a live log, Escape closes it and returns focus to the launcher, and motion respects `prefers-reduced-motion`.
 */

interface Msg {
  id: string;
  from: "agent" | "user";
  text: string;
  at: number;
  action?: ChatAction;
  /** "open" = the email box is shown under this message, "sent" = it was used. */
  form?: "open" | "sent";
}

interface Saved {
  messages: Msg[];
  ended: boolean;
  open: boolean;
  seen: boolean;
}

const STORAGE_KEY = "synax.chat";
const MAX_SAVED = 60;
const CHIPS: ChatIntent[] = ["demo", "products", "pricing", "person"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

let counter = 0;
const newId = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function readSaved(): Saved | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Saved>;
    if (!Array.isArray(data.messages)) return null;
    return { messages: data.messages.slice(-MAX_SAVED), ended: Boolean(data.ended), open: Boolean(data.open), seen: Boolean(data.seen) };
  } catch {
    return null;
  }
}

export function ChatWidget({ transport }: { transport?: ChatTransport }) {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const { openDemo, modalOpen } = useDemo();

  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const [seen, setSeen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [draft, setDraft] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const greeting = useRef(false);
  const alive = useRef(true);

  const api = useMemo<ChatTransport>(() => transport ?? createDummyTransport(t), [transport, t]);
  const time = useMemo(() => new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }), [locale]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Restore this tab's conversation (after mount, so the server and the first client render match).
  useEffect(() => {
    const id = window.setTimeout(() => {
      const saved = readSaved();
      if (saved) {
        setMessages(saved.messages);
        setEnded(saved.ended);
        setOpen(saved.open);
        setSeen(saved.seen);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.slice(-MAX_SAVED), ended, open, seen } satisfies Saved));
    } catch {
      /* private mode or storage blocked: the chat still works, it just is not remembered */
    }
  }, [ready, messages, ended, open, seen]);

  const push = useCallback((msg: Omit<Msg, "id" | "at">) => {
    setMessages((m) => [...m, { ...msg, id: newId(), at: Date.now() }]);
  }, []);

  const pushReplies = useCallback(
    (replies: AgentReply[]) => {
      for (const r of replies) push({ from: "agent", text: r.text, action: r.action, form: r.form ? "open" : undefined });
    },
    [push],
  );

  /** The assistant's opening lines, shown the first time the chat opens (and after "start a new chat"). */
  const greet = useCallback(async () => {
    if (greeting.current) return;
    greeting.current = true;
    setTyping(true);
    await wait(700);
    if (!alive.current) return;
    push({ from: "agent", text: t("greet1") });
    await wait(900);
    if (!alive.current) return;
    push({ from: "agent", text: t("greet2") });
    setTyping(false);
    greeting.current = false;
  }, [push, t]);

  useEffect(() => {
    if (open && ready && messages.length === 0 && !ended) void greet();
  }, [open, ready, messages.length, ended, greet]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, typing, open]);

  // Focus the message box when the panel opens.
  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open, ended]);

  const toggle = () => {
    setOpen((o) => !o);
    setSeen(true);
  };

  const close = () => {
    const hadFocus = panelRef.current?.contains(document.activeElement);
    setOpen(false);
    if (hadFocus) launcherRef.current?.focus();
  };

  const send = async (text: string, intent?: ChatIntent) => {
    const clean = text.trim();
    if (!clean || typing || ended) return;
    push({ from: "user", text: clean });
    setDraft("");
    setTyping(true);
    try {
      const replies = await api.send(clean, intent);
      if (alive.current) pushReplies(replies);
    } finally {
      if (alive.current) setTyping(false);
    }
  };

  const submitEmail = async (event: React.FormEvent, messageId: string) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setEmail("");
    setMessages((all) => all.map((m) => (m.id === messageId ? { ...m, form: "sent" } : m)));
    setTyping(true);
    try {
      const replies = await api.sendEmail(value);
      if (!alive.current) return;
      pushReplies(replies);
      await wait(900);
      if (alive.current) setEnded(true);
    } finally {
      if (alive.current) setTyping(false);
    }
  };

  const restart = () => {
    setMessages([]);
    setEnded(false);
    setEmail("");
    setEmailError(false);
  };

  const runAction = (action: ChatAction) => {
    if (action === "demo") openDemo();
  };

  // The demo and tour windows cover the screen; keep the chat out of their way.
  if (modalOpen) return null;

  const hasUserMessage = messages.some((m) => m.from === "user");
  const showChips = !hasUserMessage && !typing && messages.length >= 1 && !ended;
  const unread = ready && !seen && !open;

  return (
    <>
      {open ? (
        <section
          id="synax-chat-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={t("panel")}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              close();
            }
          }}
          className={`synax-chat-in fixed right-3 bottom-[9.25rem] z-[45] flex w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-2xl h-[min(34rem,calc(100dvh-14.5rem))] sm:right-6 lg:bottom-24 lg:h-[min(34rem,calc(100dvh-11rem))] ${
            wide ? "lg:h-[min(44rem,calc(100dvh-8rem))] lg:w-[28rem]" : ""
          }`}
        >
          {/* Header */}
          <div className="keep-light-palette flex items-center gap-3 bg-brand-solid px-4 py-3 text-white">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-orange-300" aria-hidden="true">
              <Headset className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{t("agentName")}</p>
              <p className="text-[11px] leading-tight text-blue-100">{t("agentNote")}</p>
            </div>
            <button
              type="button"
              onClick={() => setWide((w) => !w)}
              aria-label={wide ? t("reduce") : t("expand")}
              className="hidden size-8 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-orange-300 lg:inline-flex"
            >
              {wide ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="inline-flex size-8 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-orange-300"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Conversation */}
          <div ref={listRef} role="log" aria-live="polite" aria-label={t("messages")} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-[13.5px] leading-relaxed">
            {messages.map((m) => (
              <div key={m.id} className={`synax-chat-msg flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 break-words ${
                    m.from === "user" ? "rounded-tr-sm bg-brand-solid text-white" : "rounded-tl-sm bg-slate-100 text-slate-800"
                  }`}
                >
                  <p>{m.text}</p>

                  {m.form === "open" ? (
                    <form onSubmit={(e) => submitEmail(e, m.id)} noValidate className="mt-2.5">
                      <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-surface px-2 py-1 focus-within:border-brand-line">
                        <label htmlFor={`chat-email-${m.id}`} className="sr-only">
                          {t("email.label")}
                        </label>
                        <input
                          id={`chat-email-${m.id}`}
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError(false);
                          }}
                          placeholder={t("email.placeholder")}
                          aria-invalid={emailError}
                          className="min-w-0 flex-1 bg-transparent py-1 text-[13px] text-slate-900 outline-none placeholder:text-slate-500"
                        />
                        <button
                          type="submit"
                          aria-label={t("email.send")}
                          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-brand transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-orange-500"
                        >
                          <SendHorizontal className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      {emailError ? (
                        <p role="alert" className="mt-1 text-[12px] font-medium text-red-600">
                          {t("email.invalid")}
                        </p>
                      ) : null}
                      <p className="mt-1.5 text-[11px] leading-snug text-slate-500">
                        {t.rich("email.note", {
                          link: (chunks) => (
                            <Link href="/privacy" className="font-semibold text-brand underline">
                              {chunks}
                            </Link>
                          ),
                        })}
                      </p>
                    </form>
                  ) : null}
                </div>

                {m.action ? (
                  <div className="mt-1.5">
                    {m.action === "demo" ? (
                      <button type="button" onClick={() => runAction("demo")} className={ACTION_CLASS}>
                        {t("action.demo")}
                      </button>
                    ) : (
                      <Link href={m.action === "products" ? "/products" : "/security"} className={ACTION_CLASS}>
                        {t(`action.${m.action}`)}
                      </Link>
                    )}
                  </div>
                ) : null}

                <span className="mt-1 text-[10px] text-slate-500">
                  <span className="sr-only">{m.from === "user" ? t("you") : t("agentName")}, </span>
                  {time.format(m.at)}
                </span>
              </div>
            ))}

            {typing ? (
              <div className="synax-chat-msg flex items-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-3" role="status">
                  <span className="sr-only">{t("typing")}</span>
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} aria-hidden="true" className="size-1.5 animate-bounce rounded-full bg-slate-400 motion-reduce:animate-none" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            ) : null}

            {showChips ? (
              <ul className="synax-chat-msg flex flex-wrap gap-2 pt-1">
                {CHIPS.map((chip) => (
                  <li key={chip}>
                    <button
                      type="button"
                      onClick={() => void send(t(`chip.${chip}`), chip)}
                      className="rounded-full border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-accent-strong transition-colors hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      {t(`chip.${chip}`)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {ended ? (
              <div className="synax-chat-msg pt-3 text-center">
                <p className="text-sm text-slate-800">{t("ended")}</p>
                <button type="button" onClick={restart} className="mt-0.5 text-sm font-semibold text-brand underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-orange-500">
                  {t("restart")}
                </button>
              </div>
            ) : null}
          </div>

          {/* Message box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-surface px-3 py-2.5"
          >
            <label htmlFor="synax-chat-input" className="sr-only">
              {t("placeholder")}
            </label>
            <input
              id="synax-chat-input"
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("placeholder")}
              maxLength={500}
              disabled={ended}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-surface px-3 py-2 text-[13.5px] text-slate-900 placeholder:text-slate-500 focus-visible:border-brand-line focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={ended || typing || !draft.trim()}
              aria-label={t("send")}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-300 text-orange-950 transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendHorizontal className="size-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? "synax-chat-panel" : undefined}
        aria-label={open ? t("close") : t("launcher")}
        className="keep-light-palette fixed right-4 bottom-20 z-[45] flex size-14 cursor-pointer items-center justify-center rounded-full bg-brand-solid text-white shadow-lg ring-1 ring-black/10 transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:right-6 lg:bottom-6"
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <MessageCircle className="size-6" aria-hidden="true" />}
        {unread ? (
          <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-orange-400 ring-2 ring-white">
            <span className="sr-only">{t("newMessage")}</span>
          </span>
        ) : null}
      </button>
    </>
  );
}

const ACTION_CLASS =
  "inline-flex rounded-lg border border-brand-line/40 bg-surface px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";
