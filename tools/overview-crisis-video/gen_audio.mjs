// Overview crisis film. Dialogue and narration: Edge neural voices via msedge-tts, a mixed Indian / UK / US cast (UK narrator).
// One mp3 per clip; writes clips.json (speaker, text), durations.json and words.json (word timings).
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
  // a mixed Indian / UK / US cast, delivered with more energy (faster, a little brighter)
  nar: ["en-GB-RyanNeural", "+8%", "+0Hz"],
  fo: ["en-IN-PrabhatNeural", "+12%", "+2Hz"],
  pmg: ["en-US-AvaNeural", "+12%", "+2Hz"],
  stf: ["en-GB-ThomasNeural", "+14%", "+2Hz"],
  hr: ["en-IN-NeerjaNeural", "+14%", "+2Hz"],
  prd: ["en-US-GuyNeural", "+12%", "+0Hz"],
  qi: ["en-GB-SoniaNeural", "+12%", "+2Hz"],
  fin: ["en-US-EmmaNeural", "+12%", "+2Hz"],
  adm: ["en-US-BrianNeural", "+14%", "+2Hz"],
};
const CLIPS = [
  // part 1: the pain
  ["fo", "Okay. Talk to me."],
  ["pmg", "We are three weeks into the portal project, and I can not tell if we are making money. Hours are in one sheet, costs in another, billing in a third."],
  ["stf", "The client needs three Java developers by Monday! Candidates are in email, interview notes on paper, and I do not know who is already deployed."],
  ["hr", "Attendance does not match, leave balances are wrong, and a new joiner starts tomorrow with no checks done."],
  ["prd", "Machine four has stopped, and nobody knows why. The order is due Friday, and stores can not confirm the material."],
  ["qi", "This batch failed inspection, and I can not trace which material lot it came from."],
  ["fin", "We can not bill the client. The timesheets and dispatch papers have not reached us."],
  ["adm", "Who has the laptop for the new hire? The asset register is out of date."],
  ["fo", "Every team is working hard. So why are we always behind?"],
  ["nar", "It is not the people. Nothing is connected. Every team keeps its own sheet, its own version of the truth, and every problem lands on the founder's desk."],
  // part 2: the solution
  ["nar", "Synax ERP brings it all onto one platform. Each team gets its own workspace, on shared data."],
  ["nar", "Projects: the work tracker logs the hours, cost mapper adds up the costs, and billing and project analytics sit side by side."],
  ["nar", "Staffing: one flow from the client's requirement to candidates, interviews, offers and deployment, then timesheets, invoices and payments."],
  ["nar", "H R: one employee record, from the manpower request and the offer, to pre-joining checks, the employee portal, reviews and exit."],
  ["nar", "Manufacturing: follow every order from the customer P O to material, route card and schedule, with live monitoring and downtime on the floor."],
  ["nar", "Quality: inspection, N C R and CAPA, and genealogy that traces any part back to its order, material lot, machine and operator."],
  ["nar", "Finance and assets: invoices, debit and credit notes, every asset assigned to a person, and access control for who sees what."],
  ["nar", "And Synax A I keeps watch. Agents flag exceptions, like overdue challans, and propose a fix. Nothing changes until someone with the right role approves."],
  // part 3: control
  ["fo", "Less juggling. More visibility. Better control."],
  ["nar", "From disconnected teams to one connected business. Synax ERP."],
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
