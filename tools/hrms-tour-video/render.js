// Frame renderer: node render.js <worker> <workers> [fromFrame] [toFrame]. Resumable (skips frames that already exist).
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
const FPS = 30;
const worker = +process.argv[2];
const workers = +process.argv[3];
const from = process.argv[4] ? +process.argv[4] : 0;
const to = process.argv[5] ? +process.argv[5] : null;
(async () => {
  fs.mkdirSync("frames", { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready, null, { timeout: 30000 });
  const total = await p.evaluate(() => window.__total);
  const frames = to != null ? to : Math.ceil(total * FPS);
  for (let n = from + worker; n < frames; n += workers) {
    const f = "frames/f" + String(n).padStart(5, "0") + ".jpg";
    if (fs.existsSync(f)) continue;
    await p.evaluate((t) => window.__apply(t), n / FPS);
    await p.screenshot({ path: f, type: "jpeg", quality: 92 });
  }
  await b.close();
  console.log("worker", worker, "done");
})();
