"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, FileText, Pause, Play, RotateCcw, Truck, Volume2, VolumeX } from "lucide-react";
import { PRODUCT_DATA, routeFor, type ProductKey } from "../_data/products";

/**
 * "Synax Platform Overview" video, played inside the Watch overview modal. Seven animated scenes drawn in code,
 * each narrated by a pre-recorded neural voice (`/public/audio/overview/scene-N.mp3`, en-IN Neerja, made with
 * Microsoft's text-to-speech from the lines below). A scene ends when its audio ends; captions show the same
 * words. Everything is drawn on a fixed 880 x 495 stage that is scaled to fit, so it looks the same at any size.
 * If audio cannot play (blocked or missing) the scene still advances on a timer, so the video never stalls.
 */

const STAGE_W = 880;
const STAGE_H = 495;
const SRC = (i: number) => `/audio/overview/scene-${i + 1}.mp3`;

/** Caption = what the voice says. `dur` is the fallback length in seconds (the real audio length otherwise). */
const SCENES: { caption: string; dur: number }[] = [
  { caption: "Running a plant on spreadsheets, paper registers and five separate tools? Meet Synax, by Senwell Group.", dur: 9 },
  { caption: "Synax brings six products into one connected platform: manufacturing ERP, work and delivery management, HRMS, staffing, shop floor monitoring, and AI with business intelligence.", dur: 15.4 },
  { caption: "Follow a part from the customer's PO to the GST invoice. Every document carries the one before it, so any part can be traced back to its PO, material lot, machine and operator.", dur: 15.2 },
  { caption: "On the shop floor, machines report their own cycle counts. Alarms and downtime reach the board as they happen.", dur: 9.2 },
  { caption: "Your accounts stay in Tally. Synax generates the e-invoice, the IRN and the e-way bill in the same flow, and sends the vouchers across.", dur: 11.7 },
  { caption: "Synax AI finds the exception and proposes the fix, but it never changes your data on its own. Nothing happens until an approver says yes, and every decision is recorded.", dur: 13.9 },
  { caption: "Start with what hurts most, and add the rest when you are ready. Book a demo to see Synax on your own process.", dur: 9.2 },
];

const PRODUCT_KEYS: ProductKey[] = ["precision", "it", "hrms", "staffing", "shopfloor", "ai"];

const CHAIN = [
  { t: "RFQ and customer PO", n: "Quotes and revisions" },
  { t: "Gate entry and GRN", n: "Inward and inspection" },
  { t: "Route card", n: "Released against the BOM" },
  { t: "Machine-confirmed", n: "Counts and buy-offs" },
  { t: "Inspection and COC", n: "FAIR and certificate" },
  { t: "Invoice and dispatch", n: "IRN and e-way bill" },
];

const MACHINES = [
  { name: "CNC 01", note: "Running", pct: 82, alarm: false },
  { name: "CNC 03", note: "Idle: waiting for material", pct: 30, alarm: false },
  { name: "CNC 05", note: "Alarm: needs a person", pct: 12, alarm: true },
];

const GATE = [
  { t: "1 Ask", n: "Which challans are overdue?" },
  { t: "2 Agent finds", n: "2 are past their return date" },
  { t: "3 Agent proposes", n: "Draft reminders" },
  { t: "4 You approve", n: "Only then does anything change" },
];

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

function Stage({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 flex flex-col items-center justify-center px-14 pb-28 text-center">{children}</div>;
}

function SceneView({ i, onBook }: { i: number; onBook: () => void }) {
  switch (i) {
    case 0:
      return (
        <Stage>
          <div className="synax-ov-in flex flex-wrap justify-center gap-3">
            {["Spreadsheets", "Paper registers", "Five separate tools"].map((c) => (
              <span key={c} className="rounded-full border border-white/25 px-4 py-1.5 text-base text-slate-300 line-through decoration-orange-300 decoration-2">
                {c}
              </span>
            ))}
          </div>
          <h3 className="synax-ov-in mt-8 text-6xl font-semibold tracking-tight text-white" style={d(700)}>
            Meet <span className="text-orange-300">Synax</span>
          </h3>
          <p className="synax-ov-in mt-3 text-xl text-slate-300" style={d(1200)}>
            by Senwell Group
          </p>
        </Stage>
      );
    case 1:
      return (
        <Stage>
          <h3 className="synax-ov-in text-4xl font-semibold tracking-tight text-white">
            Six products, <span className="text-sky-200">one platform</span>
          </h3>
          <ul className="mt-8 grid w-[620px] grid-cols-3 gap-4">
            {PRODUCT_KEYS.map((k, n) => {
              const Icon = PRODUCT_DATA[k].icon;
              return (
                <li key={k} className="synax-ov-in rounded-xl border border-white/20 bg-white/10 px-3 py-4 text-sm text-slate-100" style={d(500 + n * 1500)}>
                  <Icon className="mx-auto mb-2 size-7 text-orange-300" aria-hidden="true" />
                  {routeFor(k).name}
                </li>
              );
            })}
          </ul>
        </Stage>
      );
    case 2:
      return (
        <Stage>
          <h3 className="synax-ov-in text-4xl font-semibold tracking-tight text-white">
            Spindle to invoice, <span className="text-orange-300">one record</span>
          </h3>
          <ol className="mt-8 grid w-[700px] grid-cols-3 gap-4">
            {CHAIN.map((c, n) => (
              <li key={c.t} className="synax-ov-in rounded-xl border border-white/20 bg-white/10 p-4 text-left" style={d(900 + n * 1700)}>
                <span className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${n === 5 ? "bg-orange-300 text-blue-950" : "bg-white text-blue-900"}`}>{n + 1}</span>
                <p className="mt-2 text-base font-semibold text-white">{c.t}</p>
                <p className="text-sm text-slate-300">{c.n}</p>
              </li>
            ))}
          </ol>
        </Stage>
      );
    case 3:
      return (
        <Stage>
          <h3 className="synax-ov-in text-4xl font-semibold tracking-tight text-white">
            The spindle <span className="text-orange-300">reports the count</span>
          </h3>
          <ul className="mt-8 flex gap-4">
            {MACHINES.map((m, n) => (
              <li
                key={m.name}
                className={`synax-ov-in w-48 rounded-xl border-2 bg-white/10 p-4 text-left ${m.alarm ? "border-orange-300" : "border-white/25"}`}
                style={d(600 + n * 1500)}
              >
                <p className="flex items-center gap-2 text-base font-semibold text-white">
                  {m.alarm ? <span className="synax-prod-pulse size-2.5 rounded-full bg-orange-300" aria-hidden="true" /> : null}
                  {m.name}
                </p>
                <p className="mt-0.5 text-sm text-slate-300">{m.note}</p>
                <div className="mt-3 h-1.5 rounded-full bg-white/20">
                  <div className="synax-ov-bar h-1.5 rounded-full bg-sky-200" style={{ width: `${m.pct}%`, ...d(900 + n * 1500) }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-slate-400">Illustration</p>
        </Stage>
      );
    case 4:
      return (
        <Stage>
          <h3 className="synax-ov-in text-4xl font-semibold tracking-tight text-white">
            Your accounts <span className="text-sky-200">stay in Tally</span>
          </h3>
          <div className="mt-9 flex items-center gap-4">
            {[
              { Icon: BookOpen, t: "Accounting vouchers", at: 1200 },
              { Icon: FileText, t: "GST invoice", at: 4200 },
              { Icon: Truck, t: "IRN and e-way bill", at: 7000 },
            ].map((s, n) => (
              <div key={s.t} className="flex items-center gap-4">
                {n > 0 ? <ArrowRight className="synax-ov-in size-6 text-orange-300" style={d(s.at - 400)} aria-hidden="true" /> : null}
                <div className="synax-ov-in w-52 rounded-xl border border-white/20 bg-white/10 px-4 py-5 text-base text-slate-100" style={d(s.at)}>
                  <s.Icon className="mx-auto mb-2 size-8 text-orange-300" aria-hidden="true" />
                  {s.t}
                </div>
              </div>
            ))}
          </div>
        </Stage>
      );
    case 5:
      return (
        <Stage>
          <h3 className="synax-ov-in text-4xl font-semibold tracking-tight text-white">
            AI that proposes. <span className="text-orange-300">You approve.</span>
          </h3>
          <ol className="mt-8 grid w-[740px] grid-cols-4 gap-3">
            {GATE.map((g, n) => (
              <li
                key={g.t}
                className={`synax-ov-in rounded-xl border bg-white/10 p-4 text-left ${n === 3 ? "border-orange-300" : "border-white/20"}`}
                style={d(700 + n * 2400)}
              >
                <p className="text-base font-semibold text-white">{g.t}</p>
                <p className="mt-1 text-sm text-slate-300">{g.n}</p>
                {n === 3 ? <span className="mt-3 inline-block rounded-md bg-orange-300 px-3 py-1 text-sm font-semibold text-blue-950">Approve</span> : null}
              </li>
            ))}
          </ol>
        </Stage>
      );
    default:
      return (
        <Stage>
          <h3 className="synax-ov-in text-4xl font-semibold tracking-tight text-white">Start with what hurts most.</h3>
          <h3 className="synax-ov-in mt-2 text-4xl font-semibold tracking-tight text-sky-200" style={d(900)}>
            Add the rest when you are ready.
          </h3>
          <button
            type="button"
            onClick={onBook}
            className="synax-ov-in mt-9 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-300 px-7 py-3 text-base font-semibold text-blue-950 transition-colors hover:bg-orange-200"
            style={d(2200)}
          >
            Schedule a Demo <ArrowRight className="size-5" aria-hidden="true" />
          </button>
          <p className="synax-ov-in mt-5 text-sm text-slate-400" style={d(2800)}>
            synax.senwellgroup.com
          </p>
        </Stage>
      );
  }
}

export function OverviewPlayer({ onBook }: { onBook: () => void }) {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(1);

  const audio = useRef<HTMLAudioElement | null>(null);
  const frame = useRef<HTMLDivElement | null>(null);
  const playingRef = useRef(true);
  const mutedRef = useRef(false);
  const audioOk = useRef(true);
  const fallbackStart = useRef(0);
  const sceneRef = useRef(0);

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / STAGE_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((n: number) => {
    audioOk.current = true;
    fallbackStart.current = performance.now();
    setDone(false);
    setProgress(0);
    sceneRef.current = n;
    setScene(n);
  }, []);

  const next = useCallback(() => {
    const s = sceneRef.current;
    if (s >= SCENES.length - 1) {
      playingRef.current = false;
      setPlaying(false);
      setDone(true);
      setProgress(1);
      return;
    }
    go(s + 1);
  }, [go]);

  // Load and (if playing) start the voice for the current scene.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.src = SRC(scene);
    a.muted = mutedRef.current;
    if (playingRef.current) {
      a.play().catch(() => {
        // Blocked or missing: keep going on the timer below.
        audioOk.current = false;
      });
    }
  }, [scene]);

  // Timer fallback (no audio) and the progress bar when audio is not reporting.
  useEffect(() => {
    if (!playing) return;
    fallbackStart.current = performance.now() - progress * SCENES[scene].dur * 1000;
    const id = window.setInterval(() => {
      if (audioOk.current && audio.current && !audio.current.paused && audio.current.duration > 0) return;
      const p = (performance.now() - fallbackStart.current) / (SCENES[scene].dur * 1000);
      if (p >= 1) next();
      else setProgress(p);
    }, 120);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, scene, next]);

  // Stop the voice when the player closes.
  useEffect(() => {
    const a = audio.current;
    return () => {
      a?.pause();
    };
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (done) {
      playingRef.current = true;
      setPlaying(true);
      go(0);
      return;
    }
    if (playing) {
      playingRef.current = false;
      setPlaying(false);
      a?.pause();
    } else {
      playingRef.current = true;
      setPlaying(true);
      a?.play().catch(() => {
        audioOk.current = false;
      });
    }
  };

  const toggleMute = () => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (audio.current) audio.current.muted = mutedRef.current;
  };

  const jump = (n: number) => {
    playingRef.current = true;
    setPlaying(true);
    go(n);
  };

  return (
    <div>
      <div ref={frame} className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fdba74 1px, transparent 1px)", backgroundSize: "24px 24px" }} aria-hidden="true" />
        <div className="absolute top-0 left-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
          <div key={scene} className="absolute inset-0">
            <SceneView i={scene} onBook={onBook} />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex min-h-24 items-end justify-center bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent px-16 pt-8 pb-5">
            <p aria-live="polite" className="max-w-[720px] text-center text-[17px] leading-snug text-white">
              {SCENES[scene].caption}
            </p>
          </div>
        </div>
        <audio
          ref={audio}
          preload="auto"
          onEnded={() => next()}
          onError={() => {
            audioOk.current = false;
          }}
          onTimeUpdate={(e) => {
            const a = e.currentTarget;
            if (a.duration > 0) setProgress(a.currentTime / a.duration);
          }}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-800 bg-slate-950 px-4 py-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={done ? "Replay the overview" : playing ? "Pause the overview" : "Play the overview"}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-blue-900 transition-colors hover:bg-orange-100"
        >
          {done ? <RotateCcw className="size-4" /> : playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
        </button>
        <ol className="flex flex-1 gap-1.5" aria-label="Scenes">
          {SCENES.map((s, n) => (
            <li key={n} className="flex-1">
              <button
                type="button"
                onClick={() => jump(n)}
                aria-label={`Go to scene ${n + 1} of ${SCENES.length}`}
                aria-current={n === scene ? "true" : undefined}
                className="relative block h-2 w-full cursor-pointer overflow-hidden rounded-full bg-slate-700 hover:bg-slate-600"
              >
                <span className="absolute inset-y-0 left-0 bg-orange-300" style={{ width: n < scene ? "100%" : n === scene ? `${Math.min(100, progress * 100)}%` : "0%" }} />
              </button>
            </li>
          ))}
        </ol>
        <span className="hidden w-14 shrink-0 text-right text-xs text-slate-400 sm:block">
          {scene + 1} / {SCENES.length}
        </span>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn the voice on" : "Mute the voice"}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>
    </div>
  );
}
