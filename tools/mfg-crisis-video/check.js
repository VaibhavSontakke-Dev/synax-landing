// Checks without screenshots, measured in the page: every shot frames its subject (fully on screen and big enough),
// overlays stay on screen and do not overlap, and no text overflows its box.
const { chromium } = require("playwright");
const path = require("path");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready || window.__err, null, { timeout: 30000 });
  const out = await p.evaluate(() => {
    if (window.__err) return ["BOOT " + window.__err];
    const res = [];
    const R = (e) => {
      const r = e.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom };
    };
    const f = (r) => `[${r.x.toFixed(0)},${r.y.toFixed(0)} ${r.w.toFixed(0)}x${r.h.toFixed(0)}]`;
    const inScreen = (r, m = 0) => r.x >= -m && r.y >= -m && r.r <= 1920 + m && r.b <= 1080 + m;
    const ov = (a, c, pad = 0) => a.x < c.r + pad && c.x < a.r + pad && a.y < c.b + pad && c.y < a.b + pad;
    const vis = (e) => {
      for (let n = e; n && n !== document.body; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.display === "none" || +cs.opacity < 0.05) return false;
      }
      return true;
    };
    const shots = window.__shots;
    const cuts = window.__meta.cuts;
    // the subject of every shot: [element id, min share of the screen width, must be fully in frame]
    const SUBJ = [
      [["fChuck", 0.04], ["fTool", 0.04]], [["fScreen", 0.12], ["fEstop", 0.02]], [["fChuck", 0.03], ["fTool", 0.03]], [["fopP_head", 0.1]], [["fChuck", 0.02], ["fPanel", 0.05], ["fop", 0.03]],
      [["fop", 0.03], ["fw1", 0.02]], [["fPile", 0.05]], [["fpmP_head", 0.05]],
      [["qCal", 0.2], ["qqiP_head", 0.05]], [["qLCD", 0.03], ["qTag", 0.1]], [["qqiP_head", 0.1]], [["qBinNG", 0.08], ["qTray", 0.15]], [["qpmP_head", 0.05]],
      [["opeP_head", 0.04]], [], [["opeP_head", 0.04], ["oTray", 0.05]], [["fopP_head", 0.05], ["fScreen", 0.05]],
      [["qTable", 0.5]], [["qBinNG", 0.08]], [["pBoard", 0.4]], [["qpmP_head", 0.08]],
      [["ppmP_head", 0.03], ["ppeP_head", 0.02], ["popP_head", 0.02], ["pqiP_head", 0.02]], [["ppeP_head", 0.05]], [["popP_head", 0.05]], [["pqiP_head", 0.05]], [["ppmP_head", 0.03]],
      [["ppmP_head", 0.04]], [["fChuck", 0.02], ["fPanel", 0.05]], [], [["fChuck", 0.02], ["fPanel", 0.05], ["fpm", 0.03]], [["qCal", 0.15]], [["fpmP_head", 0.06]], [],
    ];
    if (SUBJ.length !== shots.length) res.push(`NOTE subjects listed for ${SUBJ.length} shots, film has ${shots.length}`);
    shots.forEach(([t0, set, mode], i) => {
      const t1 = i + 1 < cuts.length ? cuts[i + 1] : window.__total;
      [t0 + 0.05, (t0 + t1) / 2, t1 - 0.05].forEach((t) => {
        __apply(t);
        (SUBJ[i] || []).forEach(([id, minW]) => {
          const e = document.getElementById(id);
          if (!e) { res.push(`SHOT ${i} missing element ${id}`); return; }
          const r = R(e);
          if (!vis(e) && !e.closest("svg")) res.push(`SHOT ${i} (${set}) ${id} hidden at ${t.toFixed(2)}`);
          if (!inScreen(r, 2)) res.push(`SHOT ${i} (${set}) ${id} not fully in frame at ${t.toFixed(2)} ${f(r)}`);
          if (r.w / 1920 < minW) res.push(`SHOT ${i} (${set}) ${id} too small at ${t.toFixed(2)}: ${(r.w / 1920 * 100).toFixed(1)}% of the width`);
        });
      });
    });
    // overlays
    const T = window.__T;
    const checkGroup = (label, t, sel, pad = 6) => {
      __apply(t);
      const els = [...document.querySelectorAll(sel)].filter(vis);
      els.forEach((e, i) => {
        const r = R(e);
        if (!inScreen(r, -10)) res.push(`${label} off screen ${e.id || e.className} ${f(r)}`);
        els.forEach((e2, j) => { if (i < j && ov(r, R(e2), pad)) res.push(`${label} overlap ${e.id || e.className} x ${e2.id || e2.className}`); });
      });
      if (!els.length) res.push(`${label}: nothing visible at ${t.toFixed(2)}`);
    };
    checkGroup("CONSEQUENCES", T.cons[3] + 1.0, "#cons .cchip, #due");
    checkGroup("ISLANDS", T.islands + 1.0, ".isle");
    checkGroup("NODES", T.nodes + 2.5, ".node, #logo");
    checkGroup("PANELS", T.p3 + 1.5, ".gp:not(.pass)");
    checkGroup("PASSPORT", T.links[3] + 0.8, ".pass .pl, .pass .part, .pass .gh");
    // text that does not fit
    const fits = (label, t, sel) => {
      __apply(t);
      document.querySelectorAll(sel).forEach((e) => {
        if (!vis(e)) return;
        if (e.scrollWidth > e.clientWidth + 1) res.push(`${label} text overflow ${e.id || e.className} "${e.textContent.trim().slice(0, 40)}" ${e.scrollWidth} > ${e.clientWidth}`);
        const box = e.closest(".gp,.paper,.cchip,.node,.isle,.due");
        if (box && box !== e) {
          const rb = R(box), r = R(e);
          if (r.r > rb.r + 1 || r.b > rb.b + 1) res.push(`${label} outside its box ${e.id || e.className} "${e.textContent.trim().slice(0, 30)}"`);
        }
      });
    };
    fits("PANELS", T.p3 + 1.5, ".gp:not(.pass) *");
    fits("PASSPORT", T.links[3] + 0.8, ".pass *");
    fits("INSERT", T.mark + 0.6, "#ins .paper, #ins .paper *");
    fits("END", window.__total - 1, "#endT, #endS");
    const eT = R(document.getElementById("endT"));
    if (eT.w > 1800) res.push("END title too wide " + eT.w);
    // the bubble sits on screen
    __apply(T.stopSign + 0.6);
    const bb = R(document.getElementById("bubble"));
    if (!inScreen(bb, 0)) res.push("BUBBLE off screen " + f(bb));
    res.push("total " + window.__total.toFixed(1) + " s; scenes " + window.__starts.map((x) => x.toFixed(1)).join(" "));
    res.push("shots " + shots.length + "; cuts " + cuts.map((c) => c.toFixed(1)).join(" "));
    return res;
  });
  console.log(out.join("\n"));
  await b.close();
})();
