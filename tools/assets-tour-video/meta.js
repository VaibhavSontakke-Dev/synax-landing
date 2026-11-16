const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready, null, { timeout: 20000 });
  const meta = await p.evaluate(() => window.__meta);
  fs.writeFileSync("meta.json", JSON.stringify(meta, null, 1));
  console.log("meta", meta.total.toFixed(2), "clicks", meta.clicks.length);
  await b.close();
})();
