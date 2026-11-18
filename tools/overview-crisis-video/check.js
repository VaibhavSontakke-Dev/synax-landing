// Checks without screenshots, measured in the page: whoever speaks in a shot has their face in frame; every overlay
// (notifications, sheets, cutaway cards, islands, hub tiles, solution panels, the AI scene) stays on screen, does not
// overlap its neighbours, and its text fits; the solution panel does not cover the person beside it.
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
    const R = (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom }; };
    const f = (r) => `[${r.x.toFixed(0)},${r.y.toFixed(0)} ${r.w.toFixed(0)}x${r.h.toFixed(0)}]`;
    const inScreen = (r, m = 0) => r.x >= -m && r.y >= -m && r.r <= 1920 + m && r.b <= 1080 + m;
    const ov = (a, c, pad = 0) => a.x < c.r + pad && c.x < a.r + pad && a.y < c.b + pad && c.y < a.b + pad;
    const vis = (e) => { for (let n = e; n && n !== document.body; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === "none" || +cs.opacity < 0.05) return false; } return true; };
    const shots = window.__shots, cuts = window.__meta.cuts, C = window.__C, T = window.__T, SOLS = window.__SOLS;
    const INST = { founder: { fo: "ffo" }, desk: { pmg: "dpmg", stf: "dstf", hr: "dhr", fin: "dfin", adm: "dadm" }, factory: { prd: "fprd" }, qc: { qi: "qqi" } };
    let framed = 0;
    shots.forEach(([t0, set, mode, who, overlay], i) => {
      if (overlay) return;
      const t1 = i + 1 < cuts.length ? cuts[i + 1] : window.__total;
      [t0 + 0.08, (t0 + t1) / 2, t1 - 0.08].forEach((t) => {
        __apply(t);
        C.forEach((c) => {
          if (t < c.s || t > c.e || !INST[set] || !INST[set][c.who]) return;
          if (who && c.who !== who) return; // a line that overlaps the cut to the next caller
          const id = INST[set][c.who];
          framed++;
          const g = document.getElementById(id);
          const r = R(document.getElementById(id + "P_head"));
          if (getComputedStyle(g).display === "none") res.push(`SHOT ${i} (${set}) ${id} hidden while speaking at ${t.toFixed(2)}`);
          else if (!inScreen(r, 2)) res.push(`SHOT ${i} (${set}) ${id} head not in frame at ${t.toFixed(2)} ${f(r)}`);
        });
      });
    });
    // every dialogue line: the speaker is on screen for a good part of it
    C.forEach((c, k) => {
      if (c.who === "nar") return;
      let seen = 0, n = 0;
      for (let t = c.s; t < c.e; t += 0.25) {
        n++;
        __apply(t);
        const sh = shots.filter((s) => s[0] <= t).pop();
        const id = INST[sh[1]] && INST[sh[1]][c.who];
        if (id && getComputedStyle(document.getElementById(id)).display !== "none" && inScreen(R(document.getElementById(id + "P_head")), 2)) seen++;
      }
      if (seen / n < 0.5) res.push(`LINE ${k} (${c.who}) speaker on screen only ${((seen / n) * 100).toFixed(0)}%`);
    });
    const group = (label, t, sel, pad = 4) => {
      __apply(t);
      const els = [...document.querySelectorAll(sel)].filter(vis);
      if (!els.length) res.push(`${label}: nothing visible at ${t.toFixed(2)}`);
      els.forEach((e, i) => {
        const r = R(e);
        if (!inScreen(r, -6)) res.push(`${label} off screen ${e.id || e.className} ${f(r)}`);
        els.forEach((e2, j) => { if (i < j && ov(r, R(e2), pad)) res.push(`${label} overlap ${e.id || e.className} x ${e2.id || e2.className}`); });
      });
    };
    const fits = (label, t, sel) => {
      __apply(t);
      document.querySelectorAll(sel).forEach((e) => {
        if (!vis(e)) return;
        if (e.scrollWidth > e.clientWidth + 1) res.push(`${label} text overflow ${e.id || e.className} "${e.textContent.trim().slice(0, 40)}" ${e.scrollWidth} > ${e.clientWidth}`);
        const box = e.closest(".sp,.cc,.isle,.mt,.nt,.sh,.aiw,.bf,#hubc");
        if (box && box !== e) { const rb = R(box), r = R(e); if (r.r > rb.r + 1 || r.b > rb.b + 1) res.push(`${label} outside its box ${e.id || e.className} "${e.textContent.trim().slice(0, 30)}"`); }
      });
    };
    group("NOTIF", T.notif[4] + 0.4, ".nt");
    fits("NOTIF", T.notif[4] + 0.4, ".nt");
    group("SHEETS", C[8].e - 0.2, ".sh", 0);
    [0, 1, 3, 4].forEach((k) => { fits("CUT " + k, T.cut[k] + 0.4, "#cut" + k + " *"); });
    group("ISLANDS", T.broken + 0.8, ".isle", 10);
    fits("ISLANDS", T.broken + 0.8, ".isle *");
    group("HUB", T.spokes + 0.6, ".mt, #hubc", 4);
    fits("HUB", T.spokes + 0.6, ".mt, #hubc *");
    SOLS.forEach((s) => {
      const t = Math.min(s.end - 0.2, C[s.k].e);
      __apply(t);
      const sp = document.getElementById("sp" + s.k);
      if (!vis(sp)) return res.push(`SOLUTION ${s.area} panel not visible at ${t.toFixed(2)}`);
      const rs = R(sp);
      if (!inScreen(rs, 0)) res.push(`SOLUTION ${s.area} panel off screen ${f(rs)}`);
      const hd = R(document.getElementById("x" + s.who + "P_head"));
      if (!inScreen(hd, 0)) res.push(`SOLUTION ${s.area} person's head off screen ${f(hd)}`);
      if (ov(rs, hd)) res.push(`SOLUTION ${s.area} panel covers the person's head`);
      if (s.k === 16) { const ha = R(document.getElementById("xadmP_head")); if (ov(rs, ha) || !inScreen(ha, 0)) res.push("SOLUTION finance: admin head covered or off screen " + f(ha)); }
      fits("SOLUTION " + s.area, t, `#sp${s.k} *`);
      [...sp.querySelectorAll(".pr,.fs,.tl,.ch")].forEach((e) => { const r = R(e); if (r.r > rs.r - 8 || r.b > rs.b - 8) res.push(`SOLUTION ${s.area} item outside the panel "${e.textContent.trim().slice(0, 30)}" ${f(r)}`); if (!vis(e)) res.push(`SOLUTION ${s.area} item never appeared "${e.textContent.trim().slice(0, 30)}"`); });
      __apply(s.before + 0.5);
      const bf = document.getElementById("bf" + s.k);
      if (!vis(bf) || !inScreen(R(bf), 0)) res.push(`BEFORE ${s.area} flash not visible/on screen`);
    });
    // title cards: on screen, clear of the islands, hub tiles and notifications
    [...document.querySelectorAll(".tt")].forEach((e, k) => {
      const box = window.__titles[k];
      __apply((box[0] + box[1]) / 2);
      const r = R(e.querySelector(".ttm"));
      if (!vis(e) || !inScreen(r, 0)) res.push(`TITLE ${k} not visible or off screen ${f(r)}`);
      document.querySelectorAll(".isle, .mt, #hubc, .nt, .sh").forEach((o) => { if (vis(o) && ov(r, R(o), 6)) res.push(`TITLE ${k} overlaps ${o.id || o.className}`); });
      if (e.querySelector("span").scrollWidth > 1880) res.push(`TITLE ${k} too wide`);
    });
    // role tags stay on screen at their new height
    shots.forEach(([t0]) => { __apply(t0 + 1.0); const ro = document.getElementById("role"); if (+getComputedStyle(ro).opacity > 0.1 && !inScreen(R(ro), 0)) res.push("ROLE TAG off screen at " + t0.toFixed(1)); });
    group("AI", T.aiOk + 0.6, ".q, .a, .ag, .done", 2);
    fits("AI", T.aiOk + 0.6, ".aiw *");
    fits("END", window.__total - 1, "#endT, #endS");
    if (R(document.getElementById("endT")).w > 1820) res.push("END title too wide");
    res.push(`checked ${framed} framings`);
    res.push("total " + window.__total.toFixed(1) + " s; lines " + C.map((c, k) => `${k}:${c.who}@${c.s.toFixed(1)}`).join(" "));
    return res;
  });
  console.log(out.join("\n"));
  await b.close();
})();
