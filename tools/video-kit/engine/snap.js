// Preview stills (half resolution) at given times: node snap.js 12.5 40 ... -> snaps/t0012.5.jpg
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
(async () => {
  fs.mkdirSync((process.env.SNAPS || "snaps"), { recursive: true });
  const b = await chromium.launch({ channel: process.env.PW_CHANNEL || "msedge" });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.5 });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready || window.__err, null, { timeout: 30000 });
  const err = await p.evaluate(() => window.__err);
  if (err) return console.log(err), process.exit(1);
  for (const a of process.argv.slice(2)) {
    const t = +a;
    await p.evaluate((t) => window.__apply(t), t);
    const f = (process.env.SNAPS || "snaps") + "/t" + t.toFixed(1).padStart(6, "0") + ".jpg";
    await p.screenshot({ path: f, type: "jpeg", quality: 80 });
    console.log(f);
  }
  await b.close();
})();
