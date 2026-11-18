/* Overview crisis film. Sound design and score, synthesised in ffmpeg (no samples), mixed under the narration and
   normalised to -16 LUFS. Effects: phone buzz, rings, notification pings, whips on the fast cuts, cinematic hits, glitches,
   risers, the logo shimmer, pops, ticks, clicks and chimes. Score: a driving tension pulse that speeds up under the calls,
   then an upbeat 120 BPM theme after the reveal. Both duck under the voice. */
const { spawnSync } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const meta = JSON.parse(fs.readFileSync("meta.json", "utf8"));
const DUR = JSON.parse(fs.readFileSync("durations.json", "utf8"));
const CLIPS = JSON.parse(fs.readFileSync("clips.json", "utf8"));
const TOTAL = meta.total;
fs.mkdirSync("sfx", { recursive: true });
function run(args, what) {
  const r = spawnSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", ...args], { encoding: "utf8" });
  if (r.status !== 0) {
    console.log("FAILED", what, "\n", r.stderr.slice(-900));
    process.exit(1);
  }
}
const synth = (name, expr, d, af) => run(["-f", "lavfi", "-i", `aevalsrc='${expr}':d=${d}:s=44100:c=mono`, ...(af ? ["-af", af] : []), `sfx/${name}.wav`], name);
const noise = (name, d, color, amp, af) => run(["-f", "lavfi", "-i", `anoisesrc=d=${d}:c=${color}:a=${amp}`, "-af", af, `sfx/${name}.wav`], name);

// machine and factory
const stopAt = 4.5;
synth("hum", `(0.16*sin(2*PI*98*t)+0.08*sin(2*PI*196*t)+0.04*sin(2*PI*294*t)+0.05*sin(2*PI*1180*t)*(0.6+0.4*sin(2*PI*7*t)))*(lt(t,${stopAt})+gte(t,${stopAt})*exp(-1.6*(t-${stopAt})))`, 6.5);
noise("rattle", 1.9, "white", 0.6, "bandpass=f=900:w=700,volume='0.2+0.8*abs(sin(2*PI*23*t))*min(t/1.2,1)':eval=frame,afade=t=out:st=1.5:d=0.4");
noise("sparks", 1.9, "white", 0.8, "highpass=f=2500,volume='gt(sin(2*PI*31*t)*sin(2*PI*7.3*t),0.55)':eval=frame,afade=t=in:d=0.1,afade=t=out:st=1.4:d=0.5");
synth("alarm", "0.22*sin(2*PI*if(lt(mod(t,0.9),0.45),960,740)*t)*(0.7+0.3*sin(2*PI*4*t))*min(t/0.05,1)*if(lt(t,6),1,exp(-0.5*(t-6)))", 12);
synth("hit", "0.9*sin(2*PI*48*t)*exp(-3.2*t)+0.35*sin(2*PI*96*t)*exp(-5*t)", 2.2, "lowpass=f=400");
synth("clank", "(0.5*sin(2*PI*523*t)+0.35*sin(2*PI*1307*t)+0.25*sin(2*PI*2311*t)+0.2*sin(2*PI*3517*t))*exp(-11*t)+0.6*sin(2*PI*70*t)*exp(-14*t)", 1.0);
synth("clank2", "(0.4*sin(2*PI*880*t)+0.3*sin(2*PI*2093*t)+0.18*sin(2*PI*3271*t))*exp(-16*t)", 0.6);
synth("tink", "(0.35*sin(2*PI*1760*t)+0.2*sin(2*PI*3920*t))*exp(-24*t)", 0.4);
synth("spindown", "0.22*sin(2*PI*(900*t-300*t*t))*exp(-1.4*t)*lt(t,1.4)", 1.5);
synth("motordown", "0.2*sin(2*PI*(140*t-40*t*t))*exp(-1.2*t)*lt(t,1.6)+0.08*sin(2*PI*(280*t-80*t*t))*exp(-1.4*t)*lt(t,1.6)", 1.8);
synth("beep", "0.25*sin(2*PI*2400*t)*lt(t,0.09)", 0.12);
synth("error", "0.22*sin(2*PI*330*t)*(lt(t,0.12)+gt(t,0.18)*lt(t,0.3))", 0.4);
synth("okbeep", "0.22*sin(2*PI*1568*t)*lt(t,0.08)+0.22*sin(2*PI*2093*(t-0.1))*gte(t,0.1)*lt(t,0.2)", 0.3);
noise("paper", 0.8, "white", 0.5, "highpass=f=1500,lowpass=f=7000,volume='abs(sin(2*PI*5*t))':eval=frame,afade=t=out:st=0.4:d=0.4");
noise("scribble", 1.4, "pink", 0.5, "bandpass=f=3200:w=2400,volume='0.4+0.6*abs(sin(2*PI*9*t))':eval=frame,afade=t=in:d=0.1,afade=t=out:st=1.1:d=0.3");
synth("keys", "0.3*sin(2*PI*1900*t)*exp(-80*mod(t,0.13))", 0.8);
synth("clockt", "0.25*sin(2*PI*2000*t)*exp(-90*mod(t,0.5))", 3.0);
synth("phone", "0.16*(sin(2*PI*480*t)+sin(2*PI*620*t))*lt(mod(t,3),1.4)*(0.6+0.4*sin(2*PI*20*t))", 9.0);
noise("glitch", 0.7, "white", 0.5, "bandpass=f=1800:w=1500,volume='gt(sin(2*PI*17*t),0.2)':eval=frame,afade=t=out:st=0.4:d=0.3");
noise("whoosh", 1.1, "pink", 0.55, "highpass=f=600,lowpass=f=5200,afade=t=in:d=0.4,afade=t=out:st=0.6:d=0.5");
synth("riser", "0.2*sin(2*PI*(200*t+180*t*t))*pow(min(t/1.2,1),2)*lt(t,1.25)", 1.3);
synth("logo", "(0.26*sin(2*PI*523.25*t)+0.2*sin(2*PI*783.99*t)+0.16*sin(2*PI*1046.5*t)+0.06*sin(2*PI*2093*t))*exp(-1.8*t)+0.5*sin(2*PI*55*t)*exp(-3*t)", 3.5);
noise("squelch", 0.35, "white", 0.6, "highpass=f=1500,lowpass=f=6000,afade=t=in:d=0.02,afade=t=out:st=0.15:d=0.2");
synth("phone2", "0.12*(sin(2*PI*700*t)+sin(2*PI*900*t))*lt(mod(t,0.5),0.25)", 3.0);
synth("tick", "0.35*sin(2*PI*2600*t)*exp(-140*t)+0.18*sin(2*PI*900*t)*exp(-90*t)", 0.05);
synth("click", "0.5*sin(2*PI*1900*t)*exp(-75*t)+0.32*sin(2*PI*640*t)*exp(-48*t)", 0.12);
synth("buzz", "0.18*sin(2*PI*150*t)*(0.6+0.4*sin(2*PI*28*t))*lt(mod(t,0.55),0.38)", 1.0);
synth("step", "0.6*sin(2*PI*90*t)*exp(-38*t)+0.2*sin(2*PI*180*t)*exp(-50*t)", 0.15);
synth("ping", "(0.22*sin(2*PI*1318.5*t)+0.1*sin(2*PI*2637*t))*exp(-7*t)", 0.9);
synth("pop", "0.5*sin(2*PI*(420*t+2600*t*t))*exp(-26*t)", 0.18);
synth("endchime", "(0.22*sin(2*PI*523.25*t)*exp(-3.5*t)+gte(t,0.16)*0.22*sin(2*PI*659.25*(t-0.16))*exp(-3.5*(t-0.16))+gte(t,0.32)*0.22*sin(2*PI*783.99*(t-0.32))*exp(-3.2*(t-0.32))+gte(t,0.48)*0.2*sin(2*PI*1046.5*(t-0.48))*exp(-2.6*(t-0.48)))", 3.2);
// factory ambience (machines and air), quieter during the office scenes
noise("amb", TOTAL, "brown", 0.5, `lowpass=f=500,highpass=f=50,volume=0.5,afade=t=in:d=0.3`);

// score: a driving tension pulse until the reveal, speeding up as the calls pile in
const [ts, te] = meta.music.tension;
const tens = te - ts;
const [sw0, sw1] = meta.music.swell;
// intensity 0.45 -> 1 across the calls; the pulse goes from 2 to 2.6 beats a second (120 -> 156 BPM), as a smooth ramp
const k = `(0.45+0.55*min(max((t-${(sw0 - ts).toFixed(2)})/${(sw1 - sw0).toFixed(2)},0),1))`;
const ph = `(2*t+0.3*t*t/${tens.toFixed(2)})`; // beat phase (accelerating)
const tension =
  `0.10*sin(2*PI*41.2*t)*(0.7+0.3*sin(2*PI*0.1*t))` +
  `+${k}*0.55*sin(2*PI*(50+70*exp(-28*mod(${ph},1)))*mod(${ph},1)/2)*exp(-11*mod(${ph},1))` +
  `+${k}*0.12*sin(2*PI*55*t)*exp(-14*mod(${ph}+0.5,1))` +
  `+${k}*0.025*sin(2*PI*7200*t)*exp(-55*mod(2*${ph},1))` +
  `+${k}*0.045*(sin(2*PI*(220+40*t/${tens.toFixed(2)})*t)+sin(2*PI*(221.7+40*t/${tens.toFixed(2)})*t))*(0.6+0.4*sin(2*PI*8*t))`;
synth("tension", tension, tens.toFixed(2), `lowpass=f=7000,afade=t=in:d=1.2,afade=t=out:st=${(tens - 1.2).toFixed(2)}:d=1.2`);
// the upbeat theme: C G Am F, 2 s per chord (120 BPM), sixteenth-note arpeggio, kick on the beat, hats, clap on 2 and 4
const [rs, re] = meta.music.resolve;
const rd = re - rs;
const ch = "mod(floor(t/2),4)";
const f = (a, b, c, d) => `if(eq(${ch},0),${a},if(eq(${ch},1),${b},if(eq(${ch},2),${c},${d})))`;
const pad = [f(261.63, 246.94, 220.0, 174.61), f(329.63, 293.66, 261.63, 220.0), f(392.0, 392.0, 329.63, 261.63)].map((fr) => `0.03*sin(2*PI*${fr}*t)`).join("+");
const step = "mod(floor(t/0.125),4)";
const arpF = `if(eq(${step},0),${f(523.25, 493.88, 440, 349.23)},if(eq(${step},1),${f(659.25, 587.33, 523.25, 440)},if(eq(${step},2),${f(783.99, 783.99, 659.25, 523.25)},${f(1046.5, 987.77, 880, 698.46)})))`;
const arp = `0.045*sin(2*PI*${arpF}*t)*exp(-14*mod(t,0.125))`;
const kick = `0.34*sin(2*PI*(55+70*exp(-30*mod(t,0.5)))*mod(t,0.5))*exp(-11*mod(t,0.5))`;
const hats = `0.02*sin(2*PI*8400*t)*exp(-70*mod(t+0.25,0.5))+0.012*sin(2*PI*9600*t)*exp(-90*mod(t,0.25))`;
const clap = `0.06*sin(2*PI*1500*t)*sin(2*PI*2300*t)*exp(-30*mod(t-0.5,1))*gte(mod(t,1),0.5)`;
const bass = `0.08*sin(2*PI*${f(65.41, 61.74, 55, 43.65)}*t)*(0.55+0.45*exp(-6*mod(t,0.5)))`;
synth("theme", `(${pad}+${arp}+${kick}+${hats}+${clap}+${bass})*min(t/1.2,1)`, rd.toFixed(2), `lowpass=f=9000,afade=t=out:st=${(rd - 2.5).toFixed(2)}:d=2.5`);
// a fast whip (noise sweep) for the whip pans
run(["-f", "lavfi", "-i", "anoisesrc=d=0.35:c=pink:a=0.7", "-af", "highpass=f=900,lowpass=f=6500,afade=t=in:d=0.08,afade=t=out:st=0.12:d=0.23", "sfx/whip.wav"], "whip");

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
// dialogue lines that come over the walkie-talkie or the phone keep their natural voice (no radio filter), so they stay clear
const voice = DUR.map((d, i) => add(`audio/c${i}.mp3`, meta.clips[i], CLIPS[i].who === "nar" ? 1.0 : 0.95, `v${i}`));
const fx = [];
let kk = 0;
const F = (name, t, g) => fx.push(add(`sfx/${name}.wav`, t, g, `f${kk++}`));
meta.sfx.filter(([, , g]) => g > 0).forEach(([t, name, g]) => F(name, t, g));
const music = [add("sfx/tension.wav", ts, 0.8, "mT"), add("sfx/theme.wav", rs, 0.75, "mR"), add("sfx/amb.wav", 0, 0.22, "mA")];

const mixVoice = `${voice.join("")}amix=inputs=${voice.length}:normalize=0:dropout_transition=0,highpass=f=70,acompressor=threshold=-20dB:ratio=2.2:attack=8:release=140,apad=whole_dur=${TOTAL.toFixed(2)}[vmix]`;
const mixFx = `${fx.join("")}amix=inputs=${fx.length}:normalize=0:dropout_transition=0,apad=whole_dur=${TOTAL.toFixed(2)}[fxmix]`;
const mixMus = `${music.join("")}amix=inputs=3:normalize=0:dropout_transition=0,apad=whole_dur=${TOTAL.toFixed(2)}[mus]`;
// music ducks while the narrator speaks
const duck = `[vmix]asplit=2[vfin][vsc];[mus][vsc]sidechaincompress=threshold=0.02:ratio=5:attack=40:release=600:makeup=1[musd]`;
const final = `[vfin][musd][fxmix]amix=inputs=3:normalize=0:dropout_transition=0,alimiter=limit=0.85,loudnorm=I=-16:TP=-3:LRA=11[out]`;
run([...inputs, "-filter_complex", [...filters, mixVoice, mixFx, mixMus, duck, final].join(";"), "-map", "[out]", "-t", TOTAL.toFixed(2), "-ar", "44100", "audio_final.wav"], "final mix");
console.log("sound mixed", TOTAL.toFixed(2), "s,", fx.length, "effects");
