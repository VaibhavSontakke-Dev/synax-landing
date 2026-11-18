// Checks without screenshots, measured in the page:
// - every shot frames whoever is speaking in it (their head fully on screen and big enough), plus listed subjects;
// - every speaker is visible (not hidden) while their line plays, at least in the shots of their set;
// - overlays (calls, loss tags, manual cards, Synax areas, panels, role tags) stay on screen and do not overlap;
// - no text overflows its box.
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
    const shots = window.__shots, cuts = window.__meta.cuts, C = window.__C, T = window.__T;
    // who plays which role in each set (instance ids)
    const INST = { factory: { op: "fop", sup: "fsup", qi: "fqi" }, plant: { pm: "ppm", op: "pop", qi: "pqi", inv: "pinv", pl: "ppl" } };
    // subjects of the shots without dialogue
    const EXTRA = { 1: ["fChuck"], 2: ["fScreen"], 3: ["fopP_head"], 4: ["fPile"], 5: ["fw1P_head"] };
    let checked = 0;
    shots.forEach(([t0, set, mode, cutaway], i) => {
      const t1 = i + 1 < cuts.length ? cuts[i + 1] : window.__total;
      if (cutaway && !EXTRA[i]) return;
      [t0 + 0.08, (t0 + t1) / 2, t1 - 0.08].forEach((t) => {
        __apply(t);
        const ids = [...(EXTRA[i] || [])];
        C.forEach((c) => {
          if (t >= c.s && t <= c.e && INST[set] && INST[set][c.who]) ids.push(INST[set][c.who] + "P_head");
        });
        ids.forEach((id) => {
          const e = document.getElementById(id);
          if (!e) return res.push(`SHOT ${i} missing ${id}`);
          checked++;
          const r = R(e);
          const g = document.getElementById(id.replace(/P_head$/, ""));
          if (g && getComputedStyle(g).display === "none") res.push(`SHOT ${i} (${set}) ${id} is hidden at ${t.toFixed(2)} while speaking`);
          if (!inScreen(r, 2)) res.push(`SHOT ${i} (${set}) ${id} not fully in frame at ${t.toFixed(2)} ${f(r)}`);
          if (r.w < 60) res.push(`SHOT ${i} (${set}) ${id} too small at ${t.toFixed(2)} (${r.w.toFixed(0)} px)`);
        });
      });
    });
    // dialogue lines: is the speaker on screen at some point of their line? (some lines play over cutaways, on purpose)
    C.forEach((c, k) => {
      if (c.who === "nar") return;
      let seen = 0;
      for (let t = c.s; t < c.e; t += 0.25) {
        __apply(t);
        const sh = shots.filter((s) => s[0] <= t).pop();
        const id = INST[sh[1]] && INST[sh[1]][c.who];
        if (id && getComputedStyle(document.getElementById(id)).display !== "none" && inScreen(R(document.getElementById(id + "P_head")), 2)) seen++;
      }
      const share = seen / Math.ceil((c.e - c.s) / 0.25);
      if (share < 0.35) res.push(`LINE ${k} (${c.who}) speaker on screen only ${(share * 100).toFixed(0)}% of the line`);
    });
    const group = (label, t, sel, pad = 6) => {
      __apply(t);
      const els = [...document.querySelectorAll(sel)].filter(vis);
      if (!els.length) res.push(`${label}: nothing visible at ${t.toFixed(2)}`);
      els.forEach((e, i) => {
        const r = R(e);
        if (!inScreen(r, -10)) res.push(`${label} off screen ${e.id || e.className} ${f(r)}`);
        els.forEach((e2, j) => { if (i < j && ov(r, R(e2), pad)) res.push(`${label} overlap ${e.id || e.className} x ${e2.id || e2.className}`); });
      });
    };
    group("CALLS", T.calls + 1.6, ".call");
    T.loss.forEach((tl, k) => group("LOSS " + k, tl + 0.9, ".ltag"));
    group("MANUAL", T.manual[2] + 0.6, ".mcard");
    group("NODES", T.nodes + 1.8, ".node, #logo");
    group("PANELS", T.feats[5] + 1.0, ".gp");
    __apply(T.feats[5] + 1.0);
    const xh = R(document.getElementById("xpmP_head"));
    if (!inScreen(xh, 0)) res.push("PANELS the manager's head is off screen " + f(xh));
    document.querySelectorAll(".gp").forEach((g) => ov(R(g), xh) && res.push("PANELS " + g.id + " covers the manager's head"));
    const fits = (label, t, sel) => {
      __apply(t);
      document.querySelectorAll(sel).forEach((e) => {
        if (!vis(e)) return;
        if (e.scrollWidth > e.clientWidth + 1) res.push(`${label} text overflow ${e.id || e.className} "${e.textContent.trim().slice(0, 40)}" ${e.scrollWidth} > ${e.clientWidth}`);
        const box = e.closest(".gp,.paper,.call,.node,.mcard,.ltag");
        if (box && box !== e) {
          const rb = R(box), r = R(e);
          if (r.r > rb.r + 1 || r.b > rb.b + 1) res.push(`${label} outside its box ${e.id || e.className} "${e.textContent.trim().slice(0, 30)}"`);
        }
      });
    };
    fits("PANELS", T.feats[5] + 1.0, ".gp *");
    fits("INSERT", T.mark + 0.5, "#ins .paper, #ins .paper *");
    fits("CALLS", T.calls + 1.6, ".call *");
    fits("NODES", T.nodes + 1.8, ".node");
    fits("END", window.__total - 1, "#endT, #endS");
    // role tags
    shots.forEach(([t0], i) => {
      __apply(t0 + 1.0);
      const r = document.getElementById("role");
      if (+getComputedStyle(r).opacity > 0.1) {
        const rr = R(r);
        if (!inScreen(rr, 0)) res.push("ROLE TAG off screen at shot " + i);
        if (r.scrollWidth > r.clientWidth + 1) res.push("ROLE TAG overflow " + r.textContent);
      }
    });
    res.push(`checked ${checked} framings`);
    res.push("total " + window.__total.toFixed(1) + " s; scenes " + window.__starts.map((x) => x.toFixed(1)).join(" "));
    res.push("lines " + C.map((c, k) => `${k}:${c.who}@${c.s.toFixed(1)}-${c.e.toFixed(1)}`).join(" "));
    return res;
  });
  console.log(out.join("\n"));
  await b.close();
})();
