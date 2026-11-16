// Loads demo.html headless (no screenshots): exports the timeline (meta.json) and prints build warnings + layout lint.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  p.on("console", (m) => m.type() === "error" && console.log("CONSOLE", m.text()));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready || window.__err, null, { timeout: 30000 });
  const err = await p.evaluate(() => window.__err);
  if (err) {
    console.log("BOOT ERROR\n" + err);
    process.exit(1);
  }
  const meta = await p.evaluate(() => window.__meta);
  const lint = await p.evaluate(() => window.__lint());
  fs.writeFileSync("meta.json", JSON.stringify(meta));
  fs.writeFileSync("lint.txt", lint.join("\n"));
  console.log("total", meta.total.toFixed(1), "s; clicks", meta.clicks.length, "keys", meta.keys.length, "chapters", meta.chapters.length);
  meta.scenes.forEach((s) => console.log(s.id.padEnd(11), s.t0.toFixed(1).padStart(6), "->", s.t1.toFixed(1).padStart(6)));
  console.log(lint.length ? "ISSUES:\n" + lint.join("\n") : "lint clean");
  const probe = await p.evaluate(() => window.__probe());
  console.log(probe.join("\n"));
  await b.close();
})();
