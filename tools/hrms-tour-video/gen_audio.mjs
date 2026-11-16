// Narration: Microsoft Edge neural voice en-IN-NeerjaNeural via msedge-tts (same voice as the Assets tour). One mp3 per beat.
// Clips are cached by text hash, so only changed lines are regenerated. Writes durations.json and words.json (word timings).
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "child_process";
import { createRequire } from "module";
const TTS_DIR = process.env.TTS_DIR || "C:/Users/Admin/AppData/Local/Temp/claude/296ff3029d4a13d6/7b502f58-0f06-4011-b150-123473dea60b/scratchpad/tts";
const req = createRequire(TTS_DIR + "/package.json");
const { MsEdgeTTS, OUTPUT_FORMAT } = req("msedge-tts");
const here = createRequire(import.meta.url);
const ffmpeg = here("ffmpeg-static");
const NARR = here("./narration.js");
const outDir = "audio";
fs.mkdirSync(outDir, { recursive: true });
const hashFile = path.join(outDir, "hashes.json");
const hashes = fs.existsSync(hashFile) ? JSON.parse(fs.readFileSync(hashFile, "utf8")) : {};
const oldD = fs.existsSync("durations.json") ? JSON.parse(fs.readFileSync("durations.json", "utf8")) : {};
const oldW = fs.existsSync("words.json") ? JSON.parse(fs.readFileSync("words.json", "utf8")) : {};
const RATE = "+8%";
const dur = {}, words = {};
const probe = (f) => {
  const r = spawnSync(ffmpeg, ["-i", f, "-f", "null", "-"], { encoding: "utf8" });
  const m = /time=(\d+):(\d+):(\d+\.\d+)/g;
  let last, t;
  while ((t = m.exec(r.stderr))) last = t;
  return last ? Math.round((+last[1] * 3600 + +last[2] * 60 + parseFloat(last[3])) * 100) / 100 : NaN;
};
let tts = null;
for (const [key, text] of Object.entries(NARR)) {
  const h = crypto.createHash("sha1").update(RATE + "|" + text).digest("hex");
  const dest = path.join(outDir, key + ".mp3");
  if (hashes[key] === h && fs.existsSync(dest) && oldD[key] && oldW[key]) {
    dur[key] = oldD[key];
    words[key] = oldW[key];
    continue;
  }
  if (!tts) {
    tts = new MsEdgeTTS();
    await tts.setMetadata("en-IN-NeerjaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, { wordBoundaryEnabled: true });
  }
  const tmp = path.join(outDir, "_tmp_" + key);
  fs.mkdirSync(tmp, { recursive: true });
  const { audioFilePath, metadataFilePath } = await tts.toFile(tmp, text, { rate: RATE });
  fs.copyFileSync(audioFilePath, dest);
  const meta = JSON.parse(fs.readFileSync(metadataFilePath, "utf8")).Metadata || [];
  words[key] = meta.filter((m) => m.Type === "WordBoundary").map((m) => ({ w: m.Data.text.Text, t: m.Data.Offset / 1e7, d: m.Data.Duration / 1e7 }));
  fs.rmSync(tmp, { recursive: true, force: true });
  dur[key] = probe(dest);
  hashes[key] = h;
  console.log(key, dur[key], "s,", words[key].length, "words");
}
if (tts) tts.close();
fs.writeFileSync(hashFile, JSON.stringify(hashes));
fs.writeFileSync("durations.json", JSON.stringify(dur));
fs.writeFileSync("words.json", JSON.stringify(words));
console.log("clips", Object.keys(dur).length, "narration total", Object.values(dur).reduce((a, b) => a + b, 0).toFixed(1), "s");
