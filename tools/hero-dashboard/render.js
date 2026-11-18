// Renders dashboard.html (light and dark) to the hero images and measures what the product cards point at.
// Outputs (public/images): hero-dashboard-v3.webp (1748x1045, shown), hero-dashboard-v3-master.webp (3496x2090, the zoom lens),
// and the same two with "-dark". Prints regions.json: [x0, y0, x1, y1] fractions per region, plus a lens crop.
const { chromium } = require("playwright");
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("ffmpeg-static");
const OUT = "C:/Projects/synax-landing/public/images/";
// node render.js [base name] [sharp list] [regions file]; the defaults are the hero's
const BASE = process.argv[2] || "hero-dashboard-v3";
const SHARP = process.argv[3] || "";
const REGIONS = process.argv[4] || "regions.json";
let html = fs.readFileSync("dashboard.html", "utf8").replace("/*ICONS*/", fs.readFileSync("icons.json", "utf8"));
fs.writeFileSync("page.html", html);
const url = "file:///" + path.resolve("page.html").split(path.sep).join("/");
const webp = (png, out, q) => {
  const r = spawnSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-i", png, "-c:v", "libwebp", "-quality", String(q), out]);
  if (r.status) throw new Error(String(r.stderr));
};
(async () => {
  const b = await chromium.launch();
  const regions = {};
  for (const theme of ["light", "dark"]) {
    for (const dpr of [1, 2]) {
      const ctx = await b.newContext({ viewport: { width: 1748, height: 1045 }, deviceScaleFactor: dpr });
      const p = await ctx.newPage();
      await p.goto(url + (SHARP ? "?sharp=" + SHARP : "") + "#" + theme);
      await p.waitForFunction(() => window.__ready && document.fonts.status === "loaded");
      await p.evaluate(() => document.fonts.ready);
      const png = `${theme}-${dpr}.png`;
      await p.screenshot({ path: png });
      const name = `${BASE}${theme === "dark" ? "-dark" : ""}${dpr === 2 ? "-master" : ""}.webp`;
      webp(png, OUT + name, dpr === 2 ? 80 : 86);
      console.log(name, Math.round(fs.statSync(OUT + name).size / 1024), "KB");
      if (dpr === 1 && theme === "light") {
        const r = await p.evaluate(() => [...document.querySelectorAll("[data-region]")].map((e) => {
          const b = e.getBoundingClientRect();
          return [e.dataset.region, b.left / 1748, b.top / 1045, b.right / 1748, b.bottom / 1045];
        }));
        // the frosted cards (the hero sweeps light across them); kind: kpi, card, wide, side, machines
        regions.haze = await p.evaluate(() => [...document.querySelectorAll("[data-haze]")].map((e) => {
          const b = e.getBoundingClientRect();
          return [e.dataset.haze, ...[b.left / 1748, b.top / 1045, b.right / 1748, b.bottom / 1045].map((v) => +v.toFixed(4))];
        }));
        r.forEach(([k, x0, y0, x1, y1]) => {
          const menu = x1 < 0.2;
          // a menu row is small: the lens shows it with some of the sidebar around it
          const crop = menu ? [0, Math.max(0, y0 - 0.035), 0.155, Math.min(1, y1 + 0.035)] : [x0 - 0.004, y0 - 0.006, x1 + 0.004, y1 + 0.006];
          regions[k] = { region: [x0, y0, x1, y1].map((v) => +v.toFixed(4)), crop: crop.map((v) => +Math.min(1, Math.max(0, v)).toFixed(4)) };
        });
      }
      await ctx.close();
      fs.unlinkSync(png);
    }
  }
  // the banner, where the hero flies the airplane
  fs.writeFileSync(REGIONS, JSON.stringify({ ...regions, banner: [252 / 1748, 14 / 1045, (252 + 1482) / 1748, 164 / 1045].map((v) => +v.toFixed(4)) }, null, 1));
  console.log(fs.readFileSync(REGIONS, "utf8"));
  await b.close();
})();
