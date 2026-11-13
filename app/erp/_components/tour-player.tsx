"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Check, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import type { Tour, TourScene } from "../_data/tours";

/**
 * Narrated explainer video for the Watch overview modal. One component plays any `Tour` (see `_data/tours.ts`):
 * animated scenes drawn in code, each narrated by a pre-recorded neural voice (`<audioDir>/scene-N.mp3`, en-IN
 * Neerja). A scene ends when its audio ends; captions show the same words. If audio cannot play (blocked or
 * missing) a scene advances on a timer, so the video never stalls. Everything is drawn on a fixed 880 x 495 stage
 * that is scaled to fit, so it looks the same at any size.
 */

const STAGE_W = 880;
const STAGE_H = 495;

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

/** Delay for item `n` of `count`, spreading the reveal over the first ~55% of the scene. */
function at(n: number, count: number, dur: number) {
  const step = Math.min(1800, Math.max(400, (dur * 1000 * 0.55 - 700) / Math.max(1, count)));
  return Math.round(700 + n * step);
}

const WIDTH = { 3: "w-[640px]", 4: "w-[780px]" } as const;
const GRID = { 3: "grid-cols-3", 4: "grid-cols-4" } as const;

function Stage({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 flex flex-col items-center justify-center px-12 pb-32 text-center">{children}</div>;
}

function Heading({ head, accent, tone = "orange" }: { head: string; accent: string; tone?: "orange" | "sky" }) {
  return (
    <h3 className="synax-ov-in text-4xl font-semibold tracking-tight text-white">
      {head}
      <span className={tone === "orange" ? "text-orange-300" : "text-sky-200"}>{accent}</span>
    </h3>
  );
}

function SceneView({ scene, dur, onBook }: { scene: TourScene; dur: number; onBook: () => void }) {
  switch (scene.kind) {
    case "intro":
      return (
        <Stage>
          {scene.pre ? (
            <div className="synax-ov-in mb-8 flex flex-wrap justify-center gap-3">
              {scene.pre.map((c) => (
                <span key={c} className="rounded-full border border-white/25 px-4 py-1.5 text-base text-slate-300 line-through decoration-orange-300 decoration-2">
                  {c}
                </span>
              ))}
            </div>
          ) : null}
          <h3 className="synax-ov-in text-6xl font-semibold tracking-tight text-white" style={d(scene.pre ? 700 : 100)}>
            {scene.head}
            <span className="text-orange-300">{scene.accent}</span>
          </h3>
          {scene.sub ? (
            <p className="synax-ov-in mt-4 text-xl text-slate-300" style={d(scene.pre ? 1200 : 700)}>
              {scene.sub}
            </p>
          ) : null}
        </Stage>
      );
    case "tiles": {
      const cols = scene.cols ?? 3;
      return (
        <Stage>
          <Heading head={scene.head} accent={scene.accent} tone="sky" />
          <ul className={`mt-8 grid ${WIDTH[cols]} ${GRID[cols]} gap-4`}>
            {scene.items.map((t, n) => (
              <li key={t.label} className="synax-ov-in rounded-xl border border-white/20 bg-white/10 px-3 py-4 text-slate-100" style={d(at(n, scene.items.length, dur))}>
                <t.Icon className="mx-auto mb-2 size-7 text-orange-300" aria-hidden="true" />
                <p className="text-sm font-semibold">{t.label}</p>
                {t.note ? <p className="mt-0.5 text-xs text-slate-300">{t.note}</p> : null}
              </li>
            ))}
          </ul>
        </Stage>
      );
    }
    case "steps": {
      const cols = scene.cols ?? 3;
      const last = scene.items.length - 1;
      return (
        <Stage>
          <Heading head={scene.head} accent={scene.accent} />
          <ol className={`mt-8 grid ${WIDTH[cols]} ${GRID[cols]} gap-4`}>
            {scene.items.map((s, n) => (
              <li
                key={s.t}
                className={`synax-ov-in rounded-xl border bg-white/10 p-4 text-left ${scene.approve && n === last ? "border-orange-300" : "border-white/20"}`}
                style={d(at(n, scene.items.length, dur))}
              >
                {scene.approve ? null : (
                  <span className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${n === last ? "bg-orange-300 text-blue-950" : "bg-white text-blue-900"}`}>{n + 1}</span>
                )}
                <p className={`${scene.approve ? "" : "mt-2 "}text-base font-semibold text-white`}>{s.t}</p>
                <p className="mt-0.5 text-sm text-slate-300">{s.n}</p>
                {scene.approve && n === last ? <span className="mt-3 inline-block rounded-md bg-orange-300 px-3 py-1 text-sm font-semibold text-blue-950">Approve</span> : null}
              </li>
            ))}
          </ol>
        </Stage>
      );
    }
    case "bars":
      return (
        <Stage>
          <Heading head={scene.head} accent={scene.accent} />
          <ul className="mt-8 flex gap-4">
            {scene.items.map((m, n) => (
              <li
                key={m.t}
                className={`synax-ov-in w-52 rounded-xl border-2 bg-white/10 p-4 text-left ${m.alarm ? "border-orange-300" : "border-white/25"}`}
                style={d(at(n, scene.items.length, dur))}
              >
                <p className="flex items-center gap-2 text-base font-semibold text-white">
                  {m.alarm ? <span className="synax-prod-pulse size-2.5 rounded-full bg-orange-300" aria-hidden="true" /> : null}
                  {m.t}
                </p>
                <p className="mt-0.5 text-sm text-slate-300">{m.n}</p>
                <div className="mt-3 h-1.5 rounded-full bg-white/20">
                  <div className="synax-ov-bar h-1.5 rounded-full bg-sky-200" style={{ width: `${m.pct}%`, ...d(at(n, scene.items.length, dur) + 300) }} />
                </div>
              </li>
            ))}
          </ul>
          {scene.note ? <p className="mt-5 text-xs text-slate-400">{scene.note}</p> : null}
        </Stage>
      );
    case "flow": {
      const w = scene.items.length > 3 ? "w-40" : "w-52";
      return (
        <Stage>
          <Heading head={scene.head} accent={scene.accent} tone="sky" />
          <div className="mt-9 flex items-center gap-3">
            {scene.items.map((s, n) => {
              const delay = at(n, scene.items.length, dur) + 500;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  {n > 0 ? <ArrowRight className="synax-ov-in size-6 shrink-0 text-orange-300" style={d(delay - 400)} aria-hidden="true" /> : null}
                  <div className={`synax-ov-in ${w} rounded-xl border border-white/20 bg-white/10 px-3 py-5 text-base text-slate-100`} style={d(delay)}>
                    <s.Icon className="mx-auto mb-2 size-8 text-orange-300" aria-hidden="true" />
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Stage>
      );
    }
    case "feature":
      return (
        <Stage>
          <span className="synax-ov-in flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-300/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-orange-300">
            <scene.Icon className="size-4" aria-hidden="true" />
            {scene.kicker}
          </span>
          <h3 className="synax-ov-in mt-5 max-w-[700px] text-[34px] leading-tight font-semibold tracking-tight text-white" style={d(400)}>
            {scene.title}
          </h3>
          <ul className="mt-7 grid w-[740px] grid-cols-2 gap-3 text-left">
            {scene.points.map((p, n) => (
              <li key={p} className="synax-ov-in flex items-start gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[15px] text-slate-100" style={d(at(n, scene.points.length, dur) + 600)}>
                <Check className="mt-0.5 size-5 shrink-0 text-orange-300" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </Stage>
      );
    case "compare":
      return (
        <Stage>
          <Heading head={scene.head} accent={scene.accent} tone="sky" />
          <div className="mt-6 w-[800px] text-left">
            <div className="synax-ov-in grid grid-cols-[190px_1fr_1.15fr] gap-3 px-3 pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase" style={d(300)}>
              <span />
              <span>{scene.left}</span>
              <span className="text-orange-300">{scene.right}</span>
            </div>
            <ul className="space-y-1.5">
              {scene.rows.map((r, n) => (
                <li
                  key={r.t}
                  className="synax-ov-in grid grid-cols-[190px_1fr_1.15fr] items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-3 py-2"
                  style={d(at(n, scene.rows.length, dur) + 400)}
                >
                  <span className="text-[13px] leading-tight font-semibold text-white">{r.t}</span>
                  <span className="flex items-start gap-1.5 text-xs leading-snug text-slate-400">
                    <X className="mt-0.5 size-3.5 shrink-0 text-slate-500" aria-hidden="true" />
                    {r.a}
                  </span>
                  <span className="flex items-start gap-1.5 text-xs leading-snug font-medium text-sky-100">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-orange-300" aria-hidden="true" />
                    {r.b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Stage>
      );
    case "stats":
      return (
        <Stage>
          <Heading head={scene.head} accent={scene.accent} />
          <ul className="mt-9 grid w-[780px] grid-cols-4 gap-4">
            {scene.items.map((s, n) => (
              <li key={s.value} className="synax-ov-in rounded-2xl border border-white/20 bg-white/10 px-3 py-6" style={d(at(n, scene.items.length, dur) + 400)}>
                <p className="text-4xl font-semibold tracking-tight text-white">{s.value}</p>
                <p className="mx-auto mt-2 max-w-[150px] text-sm text-slate-300">{s.label}</p>
              </li>
            ))}
          </ul>
        </Stage>
      );
    case "cta":
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

export function TourPlayer({ tour, onBook }: { tour: Tour; onBook: () => void }) {
  const count = tour.scenes.length;
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
    if (s >= count - 1) {
      playingRef.current = false;
      setPlaying(false);
      setDone(true);
      setProgress(1);
      return;
    }
    go(s + 1);
  }, [go, count]);

  // Load and (if playing) start the voice for the current scene.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.src = `${tour.audioDir}/scene-${scene + 1}.mp3`;
    a.muted = mutedRef.current;
    if (playingRef.current) {
      a.play().catch(() => {
        // Blocked or missing: keep going on the timer below.
        audioOk.current = false;
      });
    }
  }, [scene, tour.audioDir]);

  // Timer fallback (no audio) and the progress bar when audio is not reporting.
  useEffect(() => {
    if (!playing) return;
    const len = (tour.durations[scene] ?? 10) * 1000;
    fallbackStart.current = performance.now() - progress * len;
    const id = window.setInterval(() => {
      if (audioOk.current && audio.current && !audio.current.paused && audio.current.duration > 0) return;
      const p = (performance.now() - fallbackStart.current) / len;
      if (p >= 1) next();
      else setProgress(p);
    }, 120);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, scene, next, tour.durations]);

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
          <div className="synax-ov-glow pointer-events-none absolute -top-28 right-10 size-[26rem] rounded-full bg-orange-300/10 blur-3xl" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/synax-pro-light.webp" alt="" width={480} height={132} className="absolute top-5 left-7 h-6 w-auto opacity-90" />
          {tour.tag ? (
            <span className="absolute top-5 right-7 rounded-full border border-white/25 px-3 py-1 text-xs font-semibold tracking-wide text-slate-200">{tour.tag}</span>
          ) : null}
          <div key={`${tour.slug}-${scene}`} className="absolute inset-0">
            <SceneView scene={tour.scenes[scene]} dur={tour.durations[scene] ?? 10} onBook={onBook} />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex min-h-24 items-end justify-center bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent px-12 pt-8 pb-4">
            <p aria-live="polite" className="max-w-[790px] text-center text-[15px] leading-snug text-white">
              {tour.captions[scene]}
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
          aria-label={done ? "Replay the video" : playing ? "Pause the video" : "Play the video"}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-blue-900 transition-colors hover:bg-orange-100"
        >
          {done ? <RotateCcw className="size-4" /> : playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
        </button>
        <ol className="flex flex-1 gap-1.5" aria-label="Scenes">
          {tour.scenes.map((_, n) => (
            <li key={n} className="flex-1">
              <button
                type="button"
                onClick={() => jump(n)}
                aria-label={`Go to scene ${n + 1} of ${count}`}
                aria-current={n === scene ? "true" : undefined}
                className="relative block h-2 w-full cursor-pointer overflow-hidden rounded-full bg-slate-700 hover:bg-slate-600"
              >
                <span className="absolute inset-y-0 left-0 bg-orange-300" style={{ width: n < scene ? "100%" : n === scene ? `${Math.min(100, progress * 100)}%` : "0%" }} />
              </button>
            </li>
          ))}
        </ol>
        <span className="hidden w-14 shrink-0 text-right text-xs text-slate-400 sm:block">
          {scene + 1} / {count}
        </span>
        <span className="hidden shrink-0 text-xs text-slate-500 md:block">AI-generated voice</span>
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
