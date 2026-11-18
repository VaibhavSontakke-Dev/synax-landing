const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
const FPS = 30;
const worker = +process.argv[2];
const workers = +process.argv[3];
const limit = process.argv[4] ? +process.argv[4] : null; // optional: render only the first N frames (test)

(async () => {
  fs.mkdirSync("frames", { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready, null, { timeout: 20000 });
  const total = await p.evaluate(() => window.__total);
  const frames = limit || Math.ceil(total * FPS);
  for (let n = worker; n < frames; n += workers) {
    await p.evaluate((t) => window.__apply(t), n / FPS);
    await p.screenshot({ path: "frames/f" + String(n).padStart(5, "0") + ".jpg", type: "jpeg", quality: 92, timeout: 180000 });
  }
  await b.close();
  console.log("worker", worker, "done");
})();
