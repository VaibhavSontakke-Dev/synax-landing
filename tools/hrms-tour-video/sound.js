/* Sound design, synthesised in JS (no sample files): launch sound, section whooshes, page swishes, UI clicks, soft typing
   ticks, success chimes and an end chime, mixed with the narration. ffmpeg then adds a quiet ambient pad that ducks under the
   voice, limits and loudness-normalises. Needs meta.json (timeline) and audio/*.mp3 (narration). */
const { spawnSync } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const meta = JSON.parse(fs.readFileSync("meta.json", "utf8"));
const SR = 44100;
const TOTAL = meta.total;
const N = Math.ceil((TOTAL + 1) * SR);
const PI2 = 2 * Math.PI;

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const synth = (dur, fn) => {
  const n = Math.floor(dur * SR);
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = fn(i / SR);
  return a;
};
const noise = (dur, hp, lp, env) => {
  // white noise through one-pole filters, shaped by an envelope
  const a = synth(dur, () => rnd() * 2 - 1);
  const kl = 1 - Math.exp(-PI2 * lp / SR), kh = 1 - Math.exp(-PI2 * hp / SR);
  let l = 0, h = 0;
  for (let i = 0; i < a.length; i++) {
    l += kl * (a[i] - l);
    h += kh * (l - h);
    a[i] = (l - h) * env(i / SR, dur);
  }
  return a;
};
const bell = (t, f, d) => Math.sin(PI2 * f * t) * Math.exp(-d * t);
const S = {
  click: synth(0.12, (t) => 0.5 * Math.sin(PI2 * 1900 * t) * Math.exp(-75 * t) + 0.32 * Math.sin(PI2 * 640 * t) * Math.exp(-48 * t)),
  keys: [0, 1, 2, 3].map((v) => synth(0.05, (t) => (0.3 * Math.sin(PI2 * (2000 + v * 380) * t) + 0.5 * (rnd() - 0.5)) * Math.exp(-130 * t))),
  tick: synth(0.1, (t) => 0.4 * Math.sin(PI2 * 1400 * t) * Math.exp(-55 * t) + 0.25 * Math.sin(PI2 * 2100 * t) * Math.exp(-75 * t)),
  success: synth(1.4, (t) => 0.3 * bell(t, 880, 5) + (t >= 0.11 ? 0.3 * bell(t - 0.11, 1318.5, 5) + 0.12 * bell(t - 0.11, 1760, 6) : 0)),
  endchime: synth(3.2, (t) => 0.22 * bell(t, 523.25, 3.5) + (t >= 0.16 ? 0.22 * bell(t - 0.16, 659.25, 3.5) : 0) + (t >= 0.32 ? 0.22 * bell(t - 0.32, 783.99, 3.2) : 0) + (t >= 0.48 ? 0.2 * bell(t - 0.48, 1046.5, 2.6) : 0)),
  sub: synth(2.2, (t) => 0.9 * Math.sin(PI2 * 55 * t) * Math.exp(-2.6 * t)),
  sweep: synth(1.5, (t) => (t < 1.45 ? 0.3 * Math.sin(PI2 * (220 * t + 560 * t * t)) * Math.pow(Math.min(t / 1.4, 1), 2.2) : 0)),
  chime: synth(3.0, (t) => (0.26 * Math.sin(PI2 * 1046.5 * t) + 0.2 * Math.sin(PI2 * 1568 * t) + 0.12 * Math.sin(PI2 * 2093 * t) + 0.05 * Math.sin(PI2 * 3136 * t)) * Math.exp(-3 * t)),
  whoosh: noise(1.1, 700, 5200, (t, d) => 0.9 * Math.pow(Math.sin((Math.PI * t) / d), 1.6)),
  swish: noise(0.5, 900, 4200, (t, d) => 0.9 * Math.pow(Math.sin((Math.PI * t) / d), 1.4)),
};

const fx = new Float32Array(N);
const voice = new Float32Array(N);
const add = (dst, src, t, g) => {
  const o = Math.round(t * SR);
  if (o < 0) return;
  for (let i = 0; i < src.length && o + i < dst.length; i++) dst[o + i] += src[i] * g;
};
const decode = (file) => {
  const r = spawnSync(ffmpeg, ["-v", "error", "-i", file, "-f", "f32le", "-ac", "1", "-ar", String(SR), "-"], { maxBuffer: 1 << 29 });
  if (r.status !== 0) throw new Error("decode failed " + file);
  return new Float32Array(r.stdout.buffer.slice(r.stdout.byteOffset, r.stdout.byteOffset + r.stdout.length));
};

// narration
meta.audio.forEach((a) => add(voice, decode(`audio/${a.file}.mp3`), a.t, 1.0));
// launch
add(fx, S.sub, 0.15, 0.45);
add(fx, S.sweep, 0.25, 0.34);
add(fx, S.chime, 1.55, 0.34);
add(fx, S.whoosh, meta.intro - 0.85, 0.26);
// UI
meta.clicks.forEach((t) => add(fx, S.click, t, 0.3));
meta.keys.forEach((t, i) => add(fx, S.keys[i % 4], t, 0.1 + 0.04 * rnd()));
const GAIN = { swish: 0.22, whoosh: 0.26, success: 0.4, tick: 0.25, endchime: 0.4 };
meta.fx.forEach((e) => add(fx, S[e.name], e.t, (GAIN[e.name] || 0.3) * (e.gain ?? 1)));

const wav = (file, data) => {
  const b = Buffer.alloc(44 + data.length * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + data.length * 2, 4); b.write("WAVE", 8); b.write("fmt ", 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i])) * 32767), 44 + i * 2);
  fs.writeFileSync(file, b);
};
wav("voice.wav", voice);
wav("fx.wav", fx);

// ambience: a very low, slowly moving pad with a faint shimmer, for the whole video
const amb =
  "0.05*sin(2*PI*55*t)*(0.7+0.3*sin(2*PI*0.07*t))" +
  "+0.034*sin(2*PI*82.41*t)*(0.7+0.3*sin(2*PI*0.05*t+1))" +
  "+0.026*sin(2*PI*110*t)*(0.7+0.3*sin(2*PI*0.09*t+2))" +
  "+0.014*sin(2*PI*164.81*t)*(0.6+0.4*sin(2*PI*0.11*t))" +
  "+0.006*sin(2*PI*1760*t)*(0.5+0.5*sin(2*PI*0.2*t))*(0.5+0.5*sin(2*PI*0.037*t))";
const fc =
  `[2:a]lowpass=f=2600,afade=t=in:st=0.2:d=2.4,afade=t=out:st=${(TOTAL - 3.5).toFixed(2)}:d=3.4,volume=0.3[ambq];` +
  `[0:a]highpass=f=70,acompressor=threshold=-20dB:ratio=2.2:attack=8:release=140,apad=whole_dur=${TOTAL.toFixed(2)},asplit=2[vfin][vsc];` +
  `[ambq][vsc]sidechaincompress=threshold=0.012:ratio=8:attack=30:release=700:makeup=1[ambd];` + // ambience ducks under the voice
  `[vfin][ambd][1:a]amix=inputs=3:normalize=0:dropout_transition=0,alimiter=limit=0.93,loudnorm=I=-16:TP=-1.5:LRA=9[out]`;
const r = spawnSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-i", "voice.wav", "-i", "fx.wav", "-f", "lavfi", "-i", `aevalsrc='${amb}':d=${TOTAL.toFixed(2)}:s=44100:c=mono`, "-filter_complex", fc, "-map", "[out]", "-t", TOTAL.toFixed(2), "-ar", "44100", "audio_final.wav"], { encoding: "utf8" });
if (r.status !== 0) {
  console.log("FAILED\n", r.stderr.slice(-1200));
  process.exit(1);
}
console.log("sound mixed", TOTAL.toFixed(1), "s");
