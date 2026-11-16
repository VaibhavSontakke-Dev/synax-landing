/* Sound design: synthesised in ffmpeg (no sample files): launch sound, soft ambience, UI ticks, success chime, end chime,
   mixed under the narration (ambience is ducked while the voice speaks) and loudness-normalised. */
const { spawnSync } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const meta = JSON.parse(fs.readFileSync("meta.json", "utf8"));
const DUR = JSON.parse(fs.readFileSync("durations.json", "utf8"));
const TOTAL = meta.total;
fs.mkdirSync("sfx", { recursive: true });

function run(args, what) {
  const r = spawnSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", ...args], { encoding: "utf8" });
  if (r.status !== 0) {
    console.log("FAILED", what, "\n", r.stderr.slice(-900));
    process.exit(1);
  }
}
const synth = (name, expr, d) => run(["-f", "lavfi", "-i", `aevalsrc='${expr}':d=${d}:s=44100:c=mono`, `sfx/${name}.wav`], name);

// 1. launch: deep sub hit, a rising digital sweep, a bright chime on arrival
synth("sub", "0.9*sin(2*PI*55*t)*exp(-2.6*t)", 2.2);
synth("sweep", "0.30*sin(2*PI*(220*t+560*t*t))*pow(min(t/1.4,1),2.2)*lt(t,1.45)", 1.5);
synth("chime", "(0.26*sin(2*PI*1046.5*t)+0.2*sin(2*PI*1568*t)+0.12*sin(2*PI*2093*t)+0.05*sin(2*PI*3136*t))*exp(-3.0*t)", 3.0);
run(["-f", "lavfi", "-i", "anoisesrc=d=1.1:c=pink:a=0.55", "-af", "highpass=f=700,lowpass=f=5200,afade=t=in:d=0.3,afade=t=out:st=0.5:d=0.6", "sfx/whoosh.wav"], "whoosh");
run(["-f", "lavfi", "-i", "anoisesrc=d=0.5:c=pink:a=0.5", "-af", "highpass=f=900,lowpass=f=4200,afade=t=in:d=0.15,afade=t=out:st=0.2:d=0.3", "sfx/swish.wav"], "swish");

// 2. UI sounds
synth("click", "0.5*sin(2*PI*1900*t)*exp(-75*t)+0.32*sin(2*PI*640*t)*exp(-48*t)", 0.12);
synth("success", "(0.3*sin(2*PI*880*t)*exp(-5*t)+gte(t,0.11)*0.3*sin(2*PI*1318.5*(t-0.11))*exp(-5*(t-0.11))+gte(t,0.11)*0.12*sin(2*PI*1760*(t-0.11))*exp(-6*(t-0.11)))", 1.4);
synth("endchime", "(0.22*sin(2*PI*523.25*t)*exp(-3.5*t)+gte(t,0.16)*0.22*sin(2*PI*659.25*(t-0.16))*exp(-3.5*(t-0.16))+gte(t,0.32)*0.22*sin(2*PI*783.99*(t-0.32))*exp(-3.2*(t-0.32))+gte(t,0.48)*0.2*sin(2*PI*1046.5*(t-0.48))*exp(-2.6*(t-0.48)))", 3.2);

// 3. ambience: a very low, slowly moving pad plus a faint high shimmer, for the whole video
const amb =
  "0.05*sin(2*PI*55*t)*(0.7+0.3*sin(2*PI*0.07*t))" +
  "+0.034*sin(2*PI*82.41*t)*(0.7+0.3*sin(2*PI*0.05*t+1))" +
  "+0.026*sin(2*PI*110*t)*(0.7+0.3*sin(2*PI*0.09*t+2))" +
  "+0.014*sin(2*PI*164.81*t)*(0.6+0.4*sin(2*PI*0.11*t))" +
  "+0.006*sin(2*PI*1760*t)*(0.5+0.5*sin(2*PI*0.2*t))*(0.5+0.5*sin(2*PI*0.037*t))";
run(["-f", "lavfi", "-i", `aevalsrc='${amb}':d=${TOTAL.toFixed(2)}:s=44100:c=mono`, "-af", `lowpass=f=2600,afade=t=in:st=0.2:d=2.4,afade=t=out:st=${(TOTAL - 3.5).toFixed(2)}:d=3.4`, "sfx/ambience.wav"], "ambience");

// 4. the voice stem (narration placed on the timeline)
const inputs = [];
const filters = [];
let n = 0;
const add = (file, atSec, gain, label) => {
  inputs.push("-i", file);
  const ms = Math.max(0, Math.round(atSec * 1000));
  filters.push(`[${n}:a]aresample=44100,aformat=channel_layouts=mono,adelay=${ms}|${ms},volume=${gain}[${label}]`);
  n++;
  return `[${label}]`;
};
const voice = DUR.map((d, i) => add(`audio/s${i + 1}.mp3`, meta.sceneStarts[i], 1.0, `v${i}`));
const fx = [];
fx.push(add("sfx/sub.wav", 0.15, 0.45, "f_sub"));
fx.push(add("sfx/sweep.wav", 0.25, 0.34, "f_sweep"));
fx.push(add("sfx/chime.wav", 1.55, 0.34, "f_chime"));
fx.push(add("sfx/whoosh.wav", meta.intro - 0.85, 0.26, "f_whoosh"));
meta.clicks.forEach((c, i) => fx.push(add("sfx/click.wav", c, 0.32, `f_c${i}`)));
fx.push(add("sfx/swish.wav", meta.toForm - 0.15, 0.22, "f_s1"));
fx.push(add("sfx/swish.wav", meta.toList - 0.15, 0.22, "f_s2"));
fx.push(add("sfx/success.wav", meta.alertIn + 0.05, 0.4, "f_ok"));
fx.push(add("sfx/endchime.wav", meta.endCard, 0.4, "f_end"));
const amb2 = add("sfx/ambience.wav", 0, 1.0, "amb");

const mixVoice = `${voice.join("")}amix=inputs=${voice.length}:normalize=0:dropout_transition=0,highpass=f=70,acompressor=threshold=-20dB:ratio=2.2:attack=8:release=140,apad=whole_dur=${TOTAL.toFixed(2)}[vmix]`;
const mixFx = `${fx.join("")}amix=inputs=${fx.length}:normalize=0:dropout_transition=0,apad=whole_dur=${TOTAL.toFixed(2)}[fxmix]`;
// ambience sits about 30 dB under the voice and ducks further while someone is speaking
const duck = `[vmix]asplit=2[vfin][vsc];${amb2}volume=0.3[ambq];[ambq][vsc]sidechaincompress=threshold=0.012:ratio=8:attack=30:release=700:makeup=1[ambd]`;
const final = `[vfin][ambd][fxmix]amix=inputs=3:normalize=0:dropout_transition=0,alimiter=limit=0.93,loudnorm=I=-16:TP=-1.5:LRA=9[out]`;
run([...inputs, "-filter_complex", [...filters, mixVoice, mixFx, duck, final].join(";"), "-map", "[out]", "-t", TOTAL.toFixed(2), "-ar", "44100", "audio_final.wav"], "final mix");
console.log("sound mixed", TOTAL.toFixed(2), "s");
