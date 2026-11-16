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
  // 0 opening cartoon (problem)
  ["Leave questions. Missed interviews. Late settlements. When HR runs on spreadsheets, everyone ends up waiting.", "+2%"],
  // 1 reveal
  ["Meet Synax ERP. Smarter HR, happier people. Hire, manage and support every employee, all in one place.", "+0%"],
  // 2 overview
  ["The HRMS module covers the whole employee journey, from the first interview to the last working day.", "+0%"],
  // 3-10: each area is a problem question, then the solution
  ["Can't find an employee's details? Synax keeps one complete profile for every person: role, department, joining date and salary, in one searchable list.", "+0%"],
  ["Candidates left waiting? Schedule every interview, move each candidate from screening to offer, and keep the feedback in one place.", "+0%"],
  ["Not sure who is in today? Attendance records check in, breaks and check out, and overtime goes for approval automatically.", "+0%"],
  ["Work tracked on sticky notes? Daily work management turns projects into tasks, assigns them, and shows progress on one board.", "+0%"],
  ["Great referrals lost in email? Employees refer a candidate in a few clicks, and HR follows every referral through to the hire.", "+0%"],
  ["Nobody knows the leave balance? Employees see what is left, request time off, and managers approve it, with company holidays already in the calendar.", "+0%"],
  ["Review notes scattered everywhere? Run review cycles with scores, notes and variable pay, for every employee.", "+0%"],
  ["Slow exits and late settlements? Offboarding runs the clearance checklist, settles the full and final amount, and records the exit interview.", "+0%"],
  // 11 benefits, 12 end
  ["One record for every employee, faster hiring, and smooth exits. That is HR, organised.", "+0%"],
  ["That's the HRMS module in Synax. Book a demo to see it with your own team.", "+0%"],
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
