// Two-voice narration: Pip (curious) = en-IN-NeerjaNeural, Sage (calm guide) = en-IN-PrabhatNeural,
// via msedge-tts (unofficial Edge client: a placeholder; regenerate with a licensed voice service before launch).
// One mp3 per line (audio/<id>.mp3), cached by text; word timings -> words.json, durations -> durations.json.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "child_process";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");
const ffmpeg = require("ffmpeg-static");

const LINES = JSON.parse(fs.readFileSync("lines.json", "utf8"));
const VOICE = {
  P: { name: "en-IN-NeerjaNeural", rate: "+10%", pitch: "+12Hz" },
  S: { name: "en-IN-PrabhatNeural", rate: "+6%", pitch: "-2Hz" },
};
// a video can override a voice in video.json: "voices": { "P": { "name": ..., "rate": ..., "pitch": ... } }
const VIDEO = fs.existsSync("video.json") ? JSON.parse(fs.readFileSync("video.json", "utf8")) : {};
Object.assign(VOICE, VIDEO.voices || {});
fs.mkdirSync("audio", { recursive: true });
const cachePath = "audio/cache.json";
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, "utf8")) : {};
const words = fs.existsSync("words.json") ? JSON.parse(fs.readFileSync("words.json", "utf8")) : {};
const durations = fs.existsSync("durations.json") ? JSON.parse(fs.readFileSync("durations.json", "utf8")) : {};

function dur(file) {
  const r = spawnSync(ffmpeg, ["-i", file, "-f", "null", "-"], { encoding: "utf8" });
  const m = /time=(\d+):(\d+):(\d+\.\d+)/g;
  let last, t;
  while ((t = m.exec(r.stderr))) last = t;
  return last ? Math.round((+last[1] * 3600 + +last[2] * 60 + parseFloat(last[3])) * 100) / 100 : NaN;
}

for (const who of ["P", "S"]) {
  const v = VOICE[who];
  const todo = LINES.filter((l) => l.who === who).filter((l) => {
    const key = crypto.createHash("md5").update(JSON.stringify([v, l.text])).digest("hex");
    l.key = key;
    return cache[l.id] !== key || !fs.existsSync(`audio/${l.id}.mp3`);
  });
  if (!todo.length) continue;
  const tts = new MsEdgeTTS();
  await tts.setMetadata(v.name, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, { wordBoundaryEnabled: true });
  for (const l of todo) {
    const tmp = path.join("audio", "_tmp_" + l.id);
    fs.mkdirSync(tmp, { recursive: true });
    const { audioFilePath, metadataFilePath } = await tts.toFile(tmp, l.text, { rate: v.rate, pitch: v.pitch });
    fs.copyFileSync(audioFilePath, `audio/${l.id}.mp3`);
    const meta = JSON.parse(fs.readFileSync(metadataFilePath, "utf8")).Metadata || [];
    words[l.id] = meta.filter((m) => m.Type === "WordBoundary").map((m) => ({ w: m.Data.text.Text, t: m.Data.Offset / 1e7, d: m.Data.Duration / 1e7 }));
    fs.rmSync(tmp, { recursive: true, force: true });
    durations[l.id] = dur(`audio/${l.id}.mp3`);
    cache[l.id] = l.key;
    console.log(l.id, who, durations[l.id], "s", words[l.id].length, "words");
  }
  tts.close();
}
fs.writeFileSync("words.json", JSON.stringify(words));
fs.writeFileSync("durations.json", JSON.stringify(durations));
fs.writeFileSync(cachePath, JSON.stringify(cache));
const total = LINES.reduce((a, l) => a + durations[l.id], 0);
console.log("speech total", total.toFixed(1), "s for", LINES.length, "lines");
