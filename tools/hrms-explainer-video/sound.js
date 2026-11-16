/* Sound design, synthesised in ffmpeg (no sample files), mixed under the narration and loudness-normalised (-16 LUFS).
   The director lists every sound event (meta.sfx: [time, sound, gain]); this script synthesises the sounds, places them,
   adds an office room tone under the cartoon scenes and a soft technology ambience from the reveal on, ducked under the voice. */
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
const noise = (name, d, color, amp, af) => run(["-f", "lavfi", "-i", `anoisesrc=d=${d}:c=${color}:a=${amp}`, "-af", af, `sfx/${name}.wav`], name);

synth("sub", "0.9*sin(2*PI*55*t)*exp(-2.6*t)", 2.2);
synth("sweep", "0.30*sin(2*PI*(220*t+560*t*t))*pow(min(t/1.4,1),2.2)*lt(t,1.45)", 1.5);
synth("chime", "(0.26*sin(2*PI*1046.5*t)+0.2*sin(2*PI*1568*t)+0.12*sin(2*PI*2093*t)+0.05*sin(2*PI*3136*t))*exp(-3.0*t)", 3.0);
noise("whoosh", 1.1, "pink", 0.55, "highpass=f=700,lowpass=f=5200,afade=t=in:d=0.3,afade=t=out:st=0.5:d=0.6");
noise("swish", 0.5, "pink", 0.5, "highpass=f=900,lowpass=f=4200,afade=t=in:d=0.15,afade=t=out:st=0.2:d=0.3");
synth("click", "0.5*sin(2*PI*1900*t)*exp(-75*t)+0.32*sin(2*PI*640*t)*exp(-48*t)", 0.12);
synth("tick", "0.35*sin(2*PI*2600*t)*exp(-140*t)+0.18*sin(2*PI*900*t)*exp(-90*t)", 0.05);
synth("endchime", "(0.22*sin(2*PI*523.25*t)*exp(-3.5*t)+gte(t,0.16)*0.22*sin(2*PI*659.25*(t-0.16))*exp(-3.5*(t-0.16))+gte(t,0.32)*0.22*sin(2*PI*783.99*(t-0.32))*exp(-3.2*(t-0.32))+gte(t,0.48)*0.2*sin(2*PI*1046.5*(t-0.48))*exp(-2.6*(t-0.48)))", 3.2);
synth("pop", "0.55*sin(2*PI*(420*t+2600*t*t))*exp(-26*t)", 0.18);
synth("alert", "(0.3*sin(2*PI*392*t)+0.12*sin(2*PI*784*t))*exp(-9*t)+gte(t,0.09)*(0.26*sin(2*PI*330*(t-0.09)))*exp(-9*(t-0.09))", 0.5);
noise("rustle", 2.6, "white", 0.5, "highpass=f=1800,lowpass=f=7000,volume='0.45+0.55*abs(sin(2*PI*3.1*t))':eval=frame,afade=t=in:d=0.3,afade=t=out:st=1.9:d=0.7");
synth("step", "0.6*sin(2*PI*90*t)*exp(-38*t)+0.2*sin(2*PI*180*t)*exp(-50*t)", 0.15);
synth("snap", "0.32*sin(2*PI*1400*t)*exp(-60*t)+0.2*sin(2*PI*2800*t)*exp(-80*t)", 0.1);
synth("ping", "(0.22*sin(2*PI*1318.5*t)+0.1*sin(2*PI*2637*t))*exp(-7*t)", 0.9);
noise("room", meta.rev + 1.0, "brown", 0.5, `lowpass=f=420,highpass=f=60,afade=t=in:d=0.5,afade=t=out:st=${(meta.rev - 0.6).toFixed(2)}:d=1.2`);
noise("room2", 4.2, "brown", 0.5, "lowpass=f=420,highpass=f=60,afade=t=in:d=0.4,afade=t=out:st=3.0:d=1.2");

const AMB0 = Math.max(0, meta.rev - 0.6);
const ambD = TOTAL - AMB0;
const amb =
  "0.05*sin(2*PI*55*t)*(0.7+0.3*sin(2*PI*0.07*t))" +
  "+0.034*sin(2*PI*82.41*t)*(0.7+0.3*sin(2*PI*0.05*t+1))" +
  "+0.026*sin(2*PI*110*t)*(0.7+0.3*sin(2*PI*0.09*t+2))" +
  "+0.014*sin(2*PI*164.81*t)*(0.6+0.4*sin(2*PI*0.11*t))" +
  "+0.006*sin(2*PI*1760*t)*(0.5+0.5*sin(2*PI*0.2*t))*(0.5+0.5*sin(2*PI*0.037*t))";
run(["-f", "lavfi", "-i", `aevalsrc='${amb}':d=${ambD.toFixed(2)}:s=44100:c=mono`, "-af", `lowpass=f=2600,afade=t=in:st=0:d=2.0,afade=t=out:st=${(ambD - 3.5).toFixed(2)}:d=3.4`, "sfx/ambience.wav"], "ambience");

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
const voice = DUR.map((d, i) => add(`audio/s${i}.mp3`, meta.sceneStarts[i], 1.0, `v${i}`));
const fx = [];
let k = 0;
const F = (name, t, g) => fx.push(add(`sfx/${name}.wav`, t, g, `f${k++}`));
F("room", 0, 0.22);
meta.sections.forEach(([vIn]) => F("room2", vIn, 0.18));
meta.sfx.forEach(([t, name, g]) => F(name, t, g));
const amb2 = add("sfx/ambience.wav", AMB0, 1.0, "amb");

const mixVoice = `${voice.join("")}amix=inputs=${voice.length}:normalize=0:dropout_transition=0,highpass=f=70,acompressor=threshold=-20dB:ratio=2.2:attack=8:release=140,apad=whole_dur=${TOTAL.toFixed(2)}[vmix]`;
const mixFx = `${fx.join("")}amix=inputs=${fx.length}:normalize=0:dropout_transition=0,apad=whole_dur=${TOTAL.toFixed(2)}[fxmix]`;
const duck = `[vmix]asplit=2[vfin][vsc];${amb2}volume=0.3,apad=whole_dur=${TOTAL.toFixed(2)}[ambq];[ambq][vsc]sidechaincompress=threshold=0.012:ratio=8:attack=30:release=700:makeup=1[ambd]`;
const final = `[vfin][ambd][fxmix]amix=inputs=3:normalize=0:dropout_transition=0,alimiter=limit=0.85,loudnorm=I=-16:TP=-3:LRA=9[out]`;
run([...inputs, "-filter_complex", [...filters, mixVoice, mixFx, duck, final].join(";"), "-map", "[out]", "-t", TOTAL.toFixed(2), "-ar", "44100", "audio_final.wav"], "final mix");
console.log("sound mixed", TOTAL.toFixed(2), "s,", fx.length, "effects");
