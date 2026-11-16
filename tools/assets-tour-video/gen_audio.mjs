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

// [text, rate]. Scene texts are matched by the director through their word timings.
const LINES = [
  ["With spreadsheets and paperwork, nobody knows who has what, or when it was last maintained. And damaged equipment has no history.", "+8%"],
  ["Meet Synax ERP. Smarter asset management, complete control. Register every asset, assign it to your people, and track it, all in one organised system.", "+2%"],
  ["Everything lives under Assets. List shows every asset you own, Add creates a new one, and Assign gives an asset to an employee.", "-4%"],
  ["To add an asset, open Assets, then Add. Start by choosing the asset type: laptop, desktop, tablet, mobile, headphone, and more.", "-4%"],
  ["Once you choose a type, the full form opens. Enter the company name, and the vendor company name.", "-4%"],
  ["Synax generates the serial number and the asset number for you, automatically.", "-4%"],
  ["Add the charger number, and describe the configuration: RAM, storage, processor, and so on.", "-4%"],
  ["Record the purchase date and the warranty period, so you always know when cover ends.", "-4%"],
  ["Add notes if you need them, then click Save Asset. Synax confirms that the asset has been created.", "-4%"],
  ["You land on the asset list. Assets are grouped by type with live counts. Search, sort by any column, and edit or delete a record. Warranty end dates are shown in green.", "-4%"],
  ["To hand an asset to an employee, use Assign Asset. The Assigned Assets tab then shows everything that is currently allocated.", "-4%"],
  ["No more lost records. You see every asset, you know who has it, and you always know when its warranty ends.", "-2%"],
  ["That's the Assets module. Add an asset in a minute, and find it again just as fast. Book a demo to see it on your own data.", "-4%"],
];

const tts = new MsEdgeTTS();
await tts.setMetadata("en-IN-NeerjaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, { wordBoundaryEnabled: true });
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
