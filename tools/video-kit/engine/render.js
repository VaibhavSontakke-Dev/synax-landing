// Frame capture, 30 fps: node render.js <worker> <workers> [limit]. 1920x1080 -> frames/, or with DRAFT=1 960x540 -> frames_draft/.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
const FPS = 30;
const worker = +process.argv[2];
const workers = +process.argv[3];
const DRAFT = !!process.env.DRAFT;
const DIR = DRAFT ? "frames_draft" : "frames";
const limit = process.argv[4] ? +process.argv[4] : null;
(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  const b = await chromium.launch({ channel: process.env.PW_CHANNEL || "msedge" });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: DRAFT ? 0.5 : 1 });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready, null, { timeout: 30000 });
  const total = await p.evaluate(() => window.__total);
  const frames = limit || Math.ceil(total * FPS);
  for (let n = worker; n < frames; n += workers) {
    const f = DIR + "/f" + String(n).padStart(5, "0") + ".jpg";
    if (fs.existsSync(f)) continue; // resumable
    await p.evaluate((t) => window.__apply(t), n / FPS);
    await p.screenshot({ path: f, type: "jpeg", quality: DRAFT ? 85 : 92 });
  }
  await b.close();
  console.log("worker", worker, "done");
})();
