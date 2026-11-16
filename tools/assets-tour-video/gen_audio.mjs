import { MsEdgeTTS, OUTPUT_FORMAT } from "../tts/node_modules/msedge-tts/dist/index.js";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, ""));
const outDir = path.join(here, "audio");
fs.mkdirSync(outDir, { recursive: true });

// Narration (acronyms are not used here, so the text is spoken as written).
const LINES = [
  "Welcome to the Assets module in Synax. Keep track of every laptop, phone and accessory your company owns, in one place.",
  "To add an asset, open Assets, then Add. Start by choosing the asset type: laptop, desktop, tablet, mobile, headphone, and more.",
  "Once you choose a type, the full form opens. Enter the company name, and the vendor company name.",
  "The serial number is generated for you. In automatic mode, the category code, location code and running number are filled in, and together they make the asset number.",
  "Add the charger number, and describe the configuration: RAM, storage, processor, and so on.",
  "Record the purchase date and the warranty period, so you always know when cover ends.",
  "Add notes if you need them, then click Save Asset. Synax confirms that the asset has been created.",
  "You land on the asset list. Assets are grouped by type with live counts. Search, sort by any column, and edit or delete a record. Warranty end dates are shown in green.",
  "That's the Assets module. Add an asset in a minute, and find it again just as fast. Book a demo to see it on your own data.",
];

const tts = new MsEdgeTTS();
await tts.setMetadata("en-IN-NeerjaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, { wordBoundaryEnabled: true });

const durations = [];
const words = [];
for (let i = 0; i < LINES.length; i++) {
  const tmp = path.join(outDir, "_tmp" + i);
  fs.mkdirSync(tmp, { recursive: true });
  const { audioFilePath, metadataFilePath } = await tts.toFile(tmp, LINES[i], { rate: "-4%" });
  const dest = path.join(outDir, `s${i + 1}.mp3`);
  fs.copyFileSync(audioFilePath, dest);
  const meta = JSON.parse(fs.readFileSync(metadataFilePath, "utf8")).Metadata || [];
  words.push(meta.filter((m) => m.Type === "WordBoundary").map((m) => ({ w: m.Data.text.Text, t: m.Data.Offset / 1e7, d: m.Data.Duration / 1e7 })));
  fs.rmSync(tmp, { recursive: true, force: true });
  const r = spawnSync(ffmpeg, ["-i", dest, "-f", "null", "-"], { encoding: "utf8" });
  const m = /time=(\d+):(\d+):(\d+\.\d+)/g;
  let last, t;
  while ((t = m.exec(r.stderr))) last = t;
  const sec = last ? +last[1] * 3600 + +last[2] * 60 + parseFloat(last[3]) : NaN;
  durations.push(Math.round(sec * 100) / 100);
  console.log(`s${i + 1}.mp3`, durations[i], "s,", words[i].length, "words");
}
fs.writeFileSync(path.join(here, "durations.json"), JSON.stringify(durations));
fs.writeFileSync(path.join(here, "words.json"), JSON.stringify(words));
tts.close();
console.log("total", durations.reduce((a, b) => a + b, 0).toFixed(1));
