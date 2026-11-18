// Narration: Microsoft Edge neural voice en-IN-NeerjaNeural via msedge-tts. One mp3 per scene, word timings -> words.json, durations.json.
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { createRequire } from "module";
const TTS_DIR = process.env.TTS_DIR || "C:/Users/Admin/AppData/Local/Temp/claude/296ff3029d4a13d6/7b502f58-0f06-4011-b150-123473dea60b/scratchpad/tts";
const { MsEdgeTTS, OUTPUT_FORMAT } = createRequire(TTS_DIR + "/package.json")("msedge-tts");
const ffmpeg = createRequire(import.meta.url)("ffmpeg-static");
const outDir = "audio";
fs.mkdirSync(outDir, { recursive: true });

// [text, rate]: one clip per scene; the director anchors every action to the word timings.
const LINES = [
  ["A critical order is due in three days. And machine four has just stopped.", "+2%"],
  ["Across the floor, the line goes quiet. Parts pile up. Nobody knows why.", "+2%"],
  ["Then quality finds it. The parts are out of tolerance. Not one part. The whole batch.", "+2%"],
  ["Two days earlier, the order was copied onto a paper job card. Twenty five point four became twenty four point five. Nobody noticed. And the operator followed the card, exactly.", "+4%"],
  ["Now the cost adds up. Machine hours, lost. Material, consumed. The schedule, broken. And a delivery, at risk.", "+4%"],
  ["The team searches for answers. Which job cards? Which material? Which orders? Every department holds a piece of the story, on paper.", "+4%"],
  ["The real problem was never one wrong number. It was disconnected information. Synax ERP connects every step of manufacturing, in one place.", "+4%"],
  ["Production orders are released against the part master and bill of materials, so dimensions come from one approved record. Route cards, machine operations and inspections are tracked live. Dashboards show the whole plant. And every part has a passport, back to its order, material, machine and operator.", "+6%"],
  ["Back on the same floor, everyone works from the same information. Problems can still happen. Now they are found sooner, and traced in minutes.", "+4%"],
  ["From manual chaos to manufacturing control. Synax ERP.", "-4%"],
];

const tts = new MsEdgeTTS();
await tts.setMetadata(process.env.VOICE || "en-IN-PrabhatNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, { wordBoundaryEnabled: true });
const durations = [], words = [];
for (let i = 0; i < LINES.length; i++) {
  const tmp = path.join(outDir, "_tmp" + i);
  fs.mkdirSync(tmp, { recursive: true });
  const { audioFilePath, metadataFilePath } = await tts.toFile(tmp, LINES[i][0], { rate: LINES[i][1] });
  const dest = path.join(outDir, `s${i}.mp3`);
  fs.copyFileSync(audioFilePath, dest);
  const meta = JSON.parse(fs.readFileSync(metadataFilePath, "utf8")).Metadata || [];
  words.push(meta.filter((m) => m.Type === "WordBoundary").map((m) => ({ w: m.Data.text.Text, t: m.Data.Offset / 1e7, d: m.Data.Duration / 1e7 })));
  fs.rmSync(tmp, { recursive: true, force: true });
  const r = spawnSync(ffmpeg, ["-i", dest, "-f", "null", "-"], { encoding: "utf8" });
  const m = /time=(\d+):(\d+):(\d+\.\d+)/g;
  let last, t;
  while ((t = m.exec(r.stderr))) last = t;
  durations.push(last ? Math.round((+last[1] * 3600 + +last[2] * 60 + parseFloat(last[3])) * 100) / 100 : NaN);
  console.log(`s${i}`, durations[i], "s", words[i].length, "words");
}
fs.writeFileSync("durations.json", JSON.stringify(durations));
fs.writeFileSync("words.json", JSON.stringify(words));
tts.close();
console.log("total", durations.reduce((a, b) => a + b, 0).toFixed(1));
