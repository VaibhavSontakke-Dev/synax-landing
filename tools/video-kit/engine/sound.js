/* Soundtrack, all synthesised here (no sample files, no third-party music):
   - the two narration voices (audio/<id>.mp3, decoded with ffmpeg) placed at each line's start
   - sound effects from meta.sfx, synthesised in JS
   - a light corporate music bed (C major, 100 BPM) whose layers follow the story: curious opening, confident reveal,
     a rhythmic factory section, a calm AI moment, a full closing and a final chord; ducked under the voices
   - a low machine-hall ambience during manufacturing
   Mixed in float, then loudness-normalised with ffmpeg to -16 LUFS (true peak -1.5 dB) -> audio_final.wav */
const { spawnSync } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const meta = JSON.parse(fs.readFileSync("meta.json", "utf8"));
const SR = 44100;
const TOTAL = meta.total;
const N = Math.ceil(TOTAL * SR);
const TAU = Math.PI * 2;
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (u) => {
  u = cl(u);
  return u * u * (3 - 2 * u);
};

/* ---------- voices ---------- */
const voice = new Float32Array(N);
for (const l of meta.lines) {
  const r = spawnSync(ffmpeg, ["-v", "error", "-i", `audio/${l.id}.mp3`, "-f", "f32le", "-ac", "1", "-ar", String(SR), "-"], { maxBuffer: 1 << 28 });
  if (r.status) throw new Error("decode " + l.id);
  const buf = r.stdout;
  const f = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
  const o = Math.round(l.start * SR);
  for (let i = 0; i < f.length && o + i < N; i++) voice[o + i] += f[i];
}

/* ---------- sound effects ---------- */
function synth(dur, fn) {
  const n = Math.round(dur * SR);
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = fn(i / SR, i);
  return a;
}
function lp(a, k) {
  let y = 0;
  for (let i = 0; i < a.length; i++) a[i] = y += k * (a[i] - y);
  return a;
}
function hp(a, k) {
  let y = 0;
  let x0 = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    y = k * (y + x - x0);
    x0 = x;
    a[i] = y;
  }
  return a;
}
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) * d));
const FX = {
  pop: synth(0.2, (t) => 0.55 * Math.sin(TAU * (420 * t + 2600 * t * t)) * Math.exp(-26 * t)),
  tick: synth(0.06, (t) => 0.35 * Math.sin(TAU * 2600 * t) * Math.exp(-140 * t) + 0.18 * Math.sin(TAU * 900 * t) * Math.exp(-90 * t)),
  click: synth(0.12, (t) => 0.5 * Math.sin(TAU * 1900 * t) * Math.exp(-75 * t) + 0.32 * Math.sin(TAU * 640 * t) * Math.exp(-48 * t)),
  snap: synth(0.1, (t) => 0.32 * Math.sin(TAU * 1400 * t) * Math.exp(-60 * t) + 0.2 * Math.sin(TAU * 2800 * t) * Math.exp(-80 * t)),
  ping: synth(0.9, (t) => (0.22 * Math.sin(TAU * 1318.5 * t) + 0.1 * Math.sin(TAU * 2637 * t)) * Math.exp(-7 * t)),
  chime: synth(3, (t) => (0.26 * Math.sin(TAU * 1046.5 * t) + 0.2 * Math.sin(TAU * 1568 * t) + 0.12 * Math.sin(TAU * 2093 * t) + 0.05 * Math.sin(TAU * 3136 * t)) * Math.exp(-3 * t)),
  sub: synth(2.2, (t) => 0.9 * Math.sin(TAU * 55 * t) * Math.exp(-2.6 * t)),
  sweep: synth(1.5, (t) => 0.3 * Math.sin(TAU * (220 * t + 560 * t * t)) * Math.pow(Math.min(t / 1.4, 1), 2.2) * (t < 1.45 ? 1 : 0)),
  alert: synth(0.5, (t) => (0.3 * Math.sin(TAU * 392 * t) + 0.12 * Math.sin(TAU * 784 * t)) * Math.exp(-9 * t) + (t > 0.09 ? 0.26 * Math.sin(TAU * 330 * (t - 0.09)) * Math.exp(-9 * (t - 0.09)) : 0)),
  ring: synth(0.55, (t) => 0.18 * Math.sin(TAU * (Math.floor(t * 24) % 2 ? 1320 : 1660) * t) * (t < 0.5 ? 1 : 0) * sm(t / 0.02) * sm((0.55 - t) / 0.05)),
  chirp: synth(0.42, (t) => {
    const k = t < 0.14 ? t / 0.14 : t < 0.26 ? (t - 0.14) / 0.12 : (t - 0.26) / 0.16;
    const f = t < 0.14 ? 2200 + 1600 * k : t < 0.26 ? 3600 - 1500 * k : 2400 + 1900 * k;
    return 0.16 * Math.sin(TAU * f * t) * Math.sin(Math.PI * cl(k)) * (t < 0.42 ? 1 : 0);
  }),
  stamp: synth(0.35, (t) => 0.7 * Math.sin(TAU * 80 * t) * Math.exp(-22 * t) + 0.15 * rnd() * Math.exp(-60 * t)),
  success: synth(1.4, (t) => 0.2 * Math.sin(TAU * 784 * t) * env(t, 0.005, 5) + (t > 0.12 ? 0.22 * Math.sin(TAU * 1175 * (t - 0.12)) * env(t - 0.12, 0.005, 4) : 0)),
  endchime: synth(3.4, (t) => [523.25, 659.25, 783.99, 1046.5].reduce((a, f, i) => a + (t > i * 0.16 ? 0.2 * Math.sin(TAU * f * (t - i * 0.16)) * Math.exp(-3 * (t - i * 0.16)) : 0), 0)),
};
FX.whoosh = (() => {
  const a = synth(1.1, () => rnd());
  hp(a, 0.9);
  lp(a, 0.35);
  for (let i = 0; i < a.length; i++) {
    const t = i / SR;
    a[i] *= 0.5 * Math.sin(Math.PI * Math.min(1, t / 1.1)) ** 2;
  }
  return a;
})();
FX.swish = (() => {
  const a = synth(0.5, () => rnd());
  hp(a, 0.92);
  lp(a, 0.3);
  for (let i = 0; i < a.length; i++) a[i] *= 0.4 * Math.sin((Math.PI * i) / a.length) ** 2;
  return a;
})();
const sfx = new Float32Array(N);
for (const [t, name, g] of meta.sfx) {
  const s = FX[name];
  if (!s) {
    console.log("unknown sound", name);
    continue;
  }
  const o = Math.round(t * SR);
  for (let i = 0; i < s.length && o + i < N; i++) if (o + i >= 0) sfx[o + i] += s[i] * g;
}

/* ---------- machine-hall ambience (manufacturing) ---------- */
const amb = new Float32Array(N);
{
  const [m0, m1] = meta.mfg || [0, -10]; // no machine scene: no ambience
  let y = 0;
  for (let i = Math.round(m0 * SR); i < Math.min(N, Math.round((m1 + 1) * SR)); i++) {
    const t = i / SR;
    const e = sm((t - m0) / 1.5) * sm((m1 + 1 - t) / 1.5);
    y += 0.02 * (rnd() - y);
    amb[i] = e * (0.5 * y + 0.03 * Math.sin(TAU * 100 * t) + 0.02 * Math.sin(TAU * 150 * t) * (0.5 + 0.5 * Math.sin(TAU * 0.6 * t)));
  }
}

/* ---------- music bed ---------- */
const BPM = 100;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
// C – G – Am – F (one chord per bar)
const CH = [
  [48, 52, 55, 59, 64],
  [43, 50, 55, 59, 62],
  [45, 52, 57, 60, 64],
  [41, 48, 53, 57, 60],
];
const S = meta.scenes;
// layer levels per scene: [pad, pluck, bass, kick, hat]
// from video.json "music" (one entry per scene name)
const LV = JSON.parse(fs.readFileSync("video.json", "utf8")).music;
const order = Object.keys(S);
function levels(t) {
  const out = [0, 0, 0, 0, 0];
  let wsum = 0;
  for (const k of order) {
    const [a, b] = S[k];
    const w = sm((t - a + 0.8) / 1.6) * sm((b - t + 0.8) / 1.6);
    if (w > 0) {
      wsum += w;
      (LV[k] || [0.8, 0.8, 0.7, 0, 0]).forEach((v, i) => (out[i] += v * w));
    }
  }
  return wsum ? out.map((v) => v / wsum) : out;
}
const music = new Float32Array(N);
const endT = meta.endcard;
const stopT = TOTAL;
let hy = 0;
let hx = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const lv = levels(t);
  const final = t >= endT + BAR; // after the end card has settled: one long C chord
  const bar = Math.floor(t / BAR);
  const ch = final ? CH[0] : CH[bar % 4];
  const tb = t - bar * BAR;
  // pad (crossfade at bar line)
  let pad = 0;
  const xf = sm(tb / 0.25);
  const prev = CH[(bar + 3) % 4];
  for (let k = 1; k < 5; k++) {
    const f1 = hz(ch[k]);
    const f0 = hz(prev[k]);
    const v = Math.sin(TAU * f1 * t) + 0.25 * Math.sin(TAU * 2 * f1 * t + 1);
    const v0 = Math.sin(TAU * f0 * t) + 0.25 * Math.sin(TAU * 2 * f0 * t + 1);
    pad += final ? v : xf * v + (1 - xf) * v0;
  }
  pad *= 0.028 * (0.85 + 0.15 * Math.sin(TAU * 0.11 * t));
  // pluck arpeggio, eighth notes
  const e8 = Math.floor(t / (BEAT / 2));
  const t8 = t - e8 * (BEAT / 2);
  const pat = [1, 2, 3, 4, 3, 2, 4, 3];
  const note = ch[pat[e8 % 8]] + 12;
  const pl = final ? 0 : 0.07 * Math.sin(TAU * hz(note) * t8) * Math.exp(-7 * t8) + 0.02 * Math.sin(TAU * 3 * hz(note) * t8) * Math.exp(-12 * t8);
  // bass on beats 1 and 3
  const b2 = Math.floor(t / (BEAT * 2));
  const tb2 = t - b2 * BEAT * 2;
  const bass = final ? 0.09 * Math.sin(TAU * hz(36) * t) : 0.13 * Math.sin(TAU * hz(ch[0] - 12) * t) * Math.min(1, tb2 / 0.01) * Math.exp(-2.2 * tb2);
  // kick each beat, hat on the off-beats
  const b1 = Math.floor(t / BEAT);
  const tk = t - b1 * BEAT;
  const kick = final ? 0 : 0.32 * Math.sin(TAU * (45 * tk + 40 * (1 - Math.exp(-tk * 30)))) * Math.exp(-9 * tk);
  const th = t - (b1 + 0.5) * BEAT;
  const n = rnd();
  hy = 0.6 * (hy + n - hx);
  hx = n;
  const hat = final || th < 0 ? 0 : 0.05 * hy * Math.exp(-55 * th);
  let m = lv[0] * pad + lv[1] * pl + lv[2] * bass + lv[3] * kick + lv[4] * hat;
  m *= sm(t / 2.0) * (1 - sm((t - (stopT - 3.2)) / 3.0));
  music[i] = m;
}

/* ---------- ducking + mix ---------- */
let ev = 0;
const duck = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const a = Math.abs(voice[i]);
  const k = a > ev ? 1 - Math.exp(-1 / (0.03 * SR)) : 1 - Math.exp(-1 / (0.45 * SR));
  ev += k * (a - ev);
  duck[i] = ev;
}
const out = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  const d = cl(duck[i] * 6);
  const v = voice[i] + 0.55 * sfx[i] + music[i] * (0.62 - 0.38 * d) + amb[i] * (0.5 - 0.25 * d);
  out[i] = v;
  peak = Math.max(peak, Math.abs(v));
}
for (let i = 0; i < N; i++) out[i] /= peak * 1.05;
// write float WAV
function wav(path, data) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length * 4, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(3, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 4, 28);
  h.writeUInt16LE(4, 32);
  h.writeUInt16LE(32, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length * 4, 40);
  fs.writeFileSync(path, Buffer.concat([h, Buffer.from(data.buffer)]));
}
wav("mix_raw.wav", out);
const r = spawnSync(ffmpeg, ["-y", "-v", "error", "-i", "mix_raw.wav", "-af", "highpass=f=40,acompressor=threshold=-18dB:ratio=2:attack=10:release=180,loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "44100", "-ac", "2", "audio_final.wav"], { encoding: "utf8" });
if (r.status) throw new Error(r.stderr);
const m = spawnSync(ffmpeg, ["-hide_banner", "-i", "audio_final.wav", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" });
const I = /I:\s+(-?[\d.]+) LUFS/.exec(m.stderr.split("Summary:")[1] || "");
const P = /Peak:\s+(-?[\d.]+) dBFS/.exec(m.stderr.split("Summary:")[1] || "");
console.log("mixed", TOTAL.toFixed(2), "s,", meta.sfx.length, "effects; loudness", I && I[1], "LUFS, true peak", P && P[1], "dBFS");
