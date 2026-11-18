// Loads demo.html headless (no screenshots) and exports the timeline to meta.json.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready || window.__err, null, { timeout: 30000 });
  const err = await p.evaluate(() => window.__err);
  if (err) {
    console.log("BOOT ERROR\n" + err);
    process.exit(1);
  }
  const meta = await p.evaluate(() => window.__meta);
  fs.writeFileSync("meta.json", JSON.stringify(meta, null, 1));
  console.log("meta", meta.total.toFixed(2), "s,", meta.sfx.length, "sound events");
  await b.close();
})();
