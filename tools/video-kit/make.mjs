// One command for every video step. Run from tools/video-kit:
//
//   node make.mjs list                         videos in videos/
//   node make.mjs new <name> [--from <video>]  start a new video (copies an existing one as the starting point)
//   node make.mjs <video> audio                icons + narration (msedge-tts) + build + timeline + layout check
//   node make.mjs <video> preview              build + timeline + layout check (no new audio)
//   node make.mjs <video> snap 12 40.5 ...     half-size stills at those seconds -> work/<video>/snaps (+ contact sheets)
//   node make.mjs <video> draft [workers]      quick 960x540 draft -> work/<video>/draft.mp4 (not published)
//   node make.mjs <video> final [workers]      1920x1080 frames + mix + encode -> public/videos/<name>.mp4, poster, master
//   (add --resume to draft/final to keep frames from an interrupted render)
//
// Each video lives in videos/<video>/ (video.json, lines.json, director.js, optional style.css, README.md).
// Everything generated (demo.html, audio, frames, mixes) goes to work/<video>/, which git ignores.
import { spawnSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const KIT = path.dirname(fileURLToPath(import.meta.url));
const ENGINE = path.join(KIT, "engine");
const VIDEOS = path.join(KIT, "videos");
const REPO = process.env.REPO || path.resolve(KIT, "../..");
const [, , a1, a2, ...rest] = process.argv;

const die = (m) => (console.error(m), process.exit(1));
const videos = () => fs.readdirSync(VIDEOS).filter((d) => fs.existsSync(path.join(VIDEOS, d, "video.json")));

if (!a1 || a1 === "help") die(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\nimport")[0].replace(/^\/\/ ?/gm, ""));
if (!fs.existsSync(path.join(KIT, "node_modules", "playwright"))) die("First run: npm install (in tools/video-kit)");

if (a1 === "list") {
  for (const v of videos()) console.log(v.padEnd(22), JSON.parse(fs.readFileSync(path.join(VIDEOS, v, "video.json"), "utf8")).title || "");
  process.exit(0);
}

if (a1 === "new") {
  const name = a2 || die("node make.mjs new <name> [--from <video>]");
  const from = rest[0] === "--from" ? rest[1] : "manufacturing-erp";
  const dst = path.join(VIDEOS, name);
  if (fs.existsSync(dst)) die(dst + " already exists");
  fs.mkdirSync(dst, { recursive: true });
  for (const f of ["video.json", "lines.json", "director.js", "style.css"]) {
    const src = path.join(VIDEOS, from, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dst, f));
  }
  const vj = JSON.parse(fs.readFileSync(path.join(dst, "video.json"), "utf8"));
  vj.title = "TODO: what this video is and where the site plays it";
  vj.name = name;
  vj.master = "synax-" + name + "-1080p.mp4";
  fs.writeFileSync(path.join(dst, "video.json"), JSON.stringify(vj, null, 2) + "\n");
  fs.writeFileSync(path.join(dst, "README.md"), `# ${name} (source)\n\nStarted from \`videos/${from}\`. Edit lines.json (script), director.js (scenes) and video.json (name, end card, music).\n`);
  console.log("created", path.relative(KIT, dst), "from", from);
  process.exit(0);
}

const video = a1;
const VDIR = path.join(VIDEOS, video);
if (!fs.existsSync(path.join(VDIR, "video.json"))) die(`No video "${video}". Videos: ${videos().join(", ")}`);
const WORK = path.join(KIT, "work", video);
fs.mkdirSync(path.join(WORK, "assets"), { recursive: true });

// Copy this video's files (and the shared bird rig and logo) into its work folder.
function sync() {
  for (const f of ["video.json", "lines.json", "director.js", "style.css", "words.json", "durations.json", "icons.json"]) {
    const src = path.join(VDIR, f);
    const dst = path.join(WORK, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, dst);
    else if (f !== "style.css") fs.existsSync(dst) || fs.writeFileSync(dst, "{}");
    else fs.rmSync(dst, { force: true });
  }
  fs.copyFileSync(path.join(ENGINE, "birds.js"), path.join(WORK, "birds.js"));
  for (const f of ["synax-pro.webp", "synax-pro-light.webp"]) {
    const src = path.join(REPO, "public/images", f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(WORK, "assets", f));
  }
}
// Keep the generated timings and icons with the video's source, so a rebuild needs no new narration call.
function keep() {
  for (const f of ["words.json", "durations.json", "icons.json"]) fs.copyFileSync(path.join(WORK, f), path.join(VDIR, f));
}
function run(script, args = [], env = {}) {
  console.log(`\n> ${script} ${args.join(" ")}`);
  const r = spawnSync(process.execPath, [path.join(ENGINE, script), ...args], { cwd: WORK, stdio: "inherit", env: { ...process.env, REPO, ...env } });
  if (r.status !== 0) die(`${script} failed`);
}
function renderAll(workers, env) {
  console.log(`\n> render.js with ${workers} workers`);
  const t0 = Date.now();
  return Promise.all(
    Array.from({ length: workers }, (_, w) =>
      new Promise((res, rej) => {
        const p = spawn(process.execPath, [path.join(ENGINE, "render.js"), String(w), String(workers)], { cwd: WORK, stdio: "inherit", env: { ...process.env, REPO, ...env } });
        p.on("exit", (c) => (c ? rej(new Error("render worker " + w + " failed")) : res()));
      })
    )
  ).then(() => console.log("rendered in", Math.round((Date.now() - t0) / 1000), "s"));
}

const step = a2 || die("Steps: audio, preview, snap, draft, final");
const workers = +(rest.find((x) => /^\d+$/.test(x)) || 4);
// frames from an earlier render are reused only with --resume (after an interrupted render of the same version)
const fresh = (dir) => rest.includes("--resume") || fs.rmSync(path.join(WORK, dir), { recursive: true, force: true });
sync();
if (step === "audio") {
  run("icons.mjs");
  run("gen_audio.mjs");
  keep();
  run("build.js"), run("meta.js"), run("check.js");
} else if (step === "preview") {
  run("build.js"), run("meta.js"), run("check.js");
} else if (step === "snap") {
  run("build.js");
  fs.rmSync(path.join(WORK, "snaps"), { recursive: true, force: true });
  run("snap.js", rest, { SNAPS: "snaps" });
  run("sheet.js", [], { SNAPS: "snaps" });
} else if (step === "draft") {
  run("build.js"), run("meta.js"), run("sound.js");
  fresh("frames_draft");
  await renderAll(workers, { DRAFT: "1" });
  run("encode.js", [], { DRAFT: "1" });
} else if (step === "final") {
  run("build.js"), run("meta.js"), run("sound.js");
  fresh("frames");
  await renderAll(workers, {});
  run("encode.js");
} else die(`Unknown step "${step}". Steps: audio, preview, snap, draft, final`);
