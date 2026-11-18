// Dialogue and narration: Edge neural voices via msedge-tts. Only three Indian-English voices exist (Prabhat, Neerja,
// Neerja Expressive), so the six speaking roles are cast from them with different pitch and pace. One mp3 per clip;
// writes clips.json (speaker, text), durations.json and words.json (word timings).
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { createRequire } from "module";
const TTS_DIR = process.env.TTS_DIR || "C:/Users/Admin/AppData/Local/Temp/claude/296ff3029d4a13d6/7b502f58-0f06-4011-b150-123473dea60b/scratchpad/tts";
const { MsEdgeTTS, OUTPUT_FORMAT } = createRequire(TTS_DIR + "/package.json")("msedge-tts");
const ffmpeg = createRequire(import.meta.url)("ffmpeg-static");
const outDir = "audio";
fs.mkdirSync(outDir, { recursive: true });
const VOICE = {
  nar: ["en-IN-PrabhatNeural", "-2%", "-6Hz"],
  pm: ["en-IN-PrabhatNeural", "+14%", "-2Hz"],
  sup: ["en-IN-PrabhatNeural", "+20%", "+14Hz"],
  op: ["en-IN-NeerjaExpressiveNeural", "+18%", "+0Hz"],
  qi: ["en-IN-NeerjaNeural", "+16%", "+0Hz"],
  inv: ["en-IN-NeerjaNeural", "+14%", "-12Hz"],
  pl: ["en-IN-NeerjaExpressiveNeural", "+16%", "+10Hz"],
};
const CLIPS = [
  // scene 2: everyone starts communicating
  ["op", "Sir! Machine zero two has stopped! Something is wrong with the components. We cannot continue production!"],
  ["sup", "Stop the entire batch! Don't process any more components until we identify the problem!"],
  ["qi", "These measurements are incorrect! We have already identified several rejected pieces!"],
  ["pm", "What happened? Which production order is affected? Who supplied these specifications?"],
  // scene 3: material and production losses
  ["inv", "Sir, we have already consumed a significant amount of raw material. We need to check how much stock is affected!"],
  ["pm", "How much material have we lost? How many units have been produced incorrectly?"],
  ["inv", "I don't have the complete figures yet. I need to verify the manual stock records."],
  // scene 4: nobody has the answer
  ["pm", "Who approved these specifications?"],
  ["op", "We followed the job card we received. The measurements were already written on it."],
  ["qi", "We discovered the problem during inspection. Several components are already defective."],
  ["inv", "We need to reconcile the material records before confirming the total loss."],
  ["pl", "The customer order is already delayed. We need to know when production can restart."],
  ["pm", "Where is the original job card? Who entered these measurements? Why wasn't this identified earlier?"],
  // scene 5: the root cause (narration)
  ["nar", "Sometimes, a major operational crisis begins with one small mistake. A single incorrect entry, passed through disconnected manual processes, can put an entire production operation at risk."],
  // scene 6: the turning point
  ["nar", "Your manufacturing operations need more than disconnected spreadsheets, paper records and manual communication. Meet Synax ERP: one connected platform for manufacturing."],
  // scene 7: manufacturing with Synax ERP
  ["nar", "See manufacturing at a glance. Track production orders to fulfilment. Organise production, follow it on dashboards, and open any report in the reports hub. Every team works from the same connected information."],
  // scene 8 and 9
  ["nar", "Better information. Better coordination. Better control."],
  ["nar", "From manual chaos to manufacturing control. Synax ERP."],
];
const tts = new MsEdgeTTS();
let current = "";
const durations = [], words = [];
for (let i = 0; i < CLIPS.length; i++) {
  const [who, text] = CLIPS[i];
  const [voice, rate, pitch] = VOICE[who];
  if (voice !== current) {
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3, { wordBoundaryEnabled: true });
    current = voice;
  }
  const tmp = path.join(outDir, "_tmp" + i);
  fs.mkdirSync(tmp, { recursive: true });
  const { audioFilePath, metadataFilePath } = await tts.toFile(tmp, text, { rate, pitch });
  const dest = path.join(outDir, `c${i}.mp3`);
  fs.copyFileSync(audioFilePath, dest);
  const meta = JSON.parse(fs.readFileSync(metadataFilePath, "utf8")).Metadata || [];
  words.push(meta.filter((m) => m.Type === "WordBoundary").map((m) => ({ w: m.Data.text.Text, t: m.Data.Offset / 1e7, d: m.Data.Duration / 1e7 })));
  fs.rmSync(tmp, { recursive: true, force: true });
  const r = spawnSync(ffmpeg, ["-i", dest, "-f", "null", "-"], { encoding: "utf8" });
  const m = /time=(\d+):(\d+):(\d+\.\d+)/g;
  let last, t;
  while ((t = m.exec(r.stderr))) last = t;
  durations.push(last ? Math.round((+last[1] * 3600 + +last[2] * 60 + parseFloat(last[3])) * 100) / 100 : NaN);
  console.log(`c${i}`, who, durations[i]);
}
tts.close();
fs.writeFileSync("clips.json", JSON.stringify(CLIPS.map(([who, text]) => ({ who, text }))));
fs.writeFileSync("durations.json", JSON.stringify(durations));
fs.writeFileSync("words.json", JSON.stringify(words));
console.log("total", durations.reduce((a, b) => a + b, 0).toFixed(1));
