// Layout checks without screenshots, measured in the page: cartoon bubbles and chips, reveal, every scene's elements on
// screen, text that does not fit its box, overlapping elements inside each step, and every cursor stop on its target.
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
    const inScreen = (r, m = 0) => r.x >= m && r.y >= m && r.r <= 1920 - m && r.b <= 1080 - m;
    const ov = (a, c, pad = 0) => a.x < c.r + pad && c.x < a.r + pad && a.y < c.b + pad && c.y < a.b + pad;
    const f = (r) => `[${r.x.toFixed(0)},${r.y.toFixed(0)} ${r.w.toFixed(0)}x${r.h.toFixed(0)}]`;
    const vis = (e) => {
      for (let n = e; n && n !== document.body; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.display === "none" || +cs.opacity < 0.05) return false;
      }
      return true;
    };
    const M = window.__meta, T = window.__T;
    // ---- cartoon
    Toon.bubbles.forEach((bb, i) => {
      __apply(Math.min((bb.t0 + bb.t1) / 2 + 0.6, bb.t1 - 0.3));
      const g = document.getElementById("tB" + i);
      const r = R(g.querySelector("rect:nth-of-type(2)"));
      const hits = ["A", "B", "C", "D"].filter((k) => k !== "D" || bb.t0 > 6).filter((k) => ov(r, R(document.getElementById("p" + k + "_head"))));
      const chipHit = [0, 1, 2, 3].some((k) => +document.getElementById("tC" + k).getAttribute("opacity") > 0.1 && ov(r, R(document.getElementById("tC" + k))));
      if (!inScreen(r, 8) || hits.length || chipHit) res.push(`BUBBLE ${i} ${f(r)} screen:${inScreen(r, 8)} heads:${hits} chips:${chipHit}`);
    });
    __apply(8.8);
    const cr = [0, 1, 2, 3].map((k) => R(document.getElementById("tC" + k)));
    if (!cr.every((r) => inScreen(r, 10)) || cr.some((a, i) => cr.some((c, j) => i < j && ov(a, c)))) res.push("CHIPS " + cr.map(f).join(" "));
    // ---- reveal, organised
    __apply(M.reveal.pulse + 0.6);
    const hub = R(document.getElementById("hub"));
    const title = R(document.getElementById("rt1")), pills = R(document.getElementById("rpills"));
    [...document.querySelectorAll(".rc")].map(R).forEach((c, i, all) => {
      const bad = [ov(c, hub) && "hub", ov(c, title) && "title", ov(c, pills) && "pills", !inScreen(c, 10) && "off", ...all.map((d, j) => j !== i && ov(c, d, 4) && "card" + j)].filter(Boolean);
      if (bad.length) res.push(`REVEAL card ${i} ${f(c)} ${bad}`);
    });
    if (pills.b > hub.y - 20) res.push("REVEAL pills too close to hub");
    res.push(`reveal hub ${f(hub)} title ${f(title)}`);
    // ---- text that does not fit: any element whose content is wider than its box
    const fits = (label, sel) => document.querySelectorAll(sel).forEach((e) => {
      if (!vis(e)) return;
      if (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2) res.push(`OVERFLOW ${label} ${sel} "${e.textContent.trim().slice(0, 40)}" ${e.scrollWidth}x${e.scrollHeight} > ${e.clientWidth}x${e.clientHeight}`);
    });
    const allOn = (label, sel) => document.querySelectorAll(sel).forEach((e) => { if (vis(e) && !inScreen(R(e), 0)) res.push(`OFFSCREEN ${label} ${sel} ${f(R(e))}`); });
    const moments = [
      ["menu", T.menuTiles[2] + 1.0, ["#mod", ".mtile", ".mtile h3", ".mtile p"]],
      ["type", T.pick + 0.5, [".typ .tn"]],
      ["details", T.st[2] - 0.1, ["#i_company", "#i_vendor", "#selchip", "#pv", ".pr .v"]],
      ["codes", T.st[3] - 0.1, [".gen .v", ".gen .k", ".gen .auto"]],
      ["specs", T.st[4] - 0.1, ["#i_charger", ".chip", ".pr .v"]],
      ["dates", T.st[5] - 0.1, [".dt", ".dt .v", ".dt .k", "#tl", "#shield", ".pr .v"]],
      ["save", T.saveClick - 0.1, ["#notes", "#save"]],
      ["success", T.success + 1.5, ["#stxt", "#sno"]],
      ["list", T.land + 1.5, ["#list", ".lp", "#lsearch", "#ladd", "#lassign", ".hc", ".cell", ".wb"]],
      ["assign", T.assignDone + 0.3, ["#emp", "#emp .es", "#emp .en"]],
      ["assigned-view", T.assignedClick + 1.0, [".cell", ".hc"]],
      ["benefits", M.bene.cards[2] + 1, [".bc", ".bc h3", ".bc p", "#bhead"]],
    ];
    moments.forEach(([label, t, sels]) => {
      __apply(t);
      sels.forEach((s) => { fits(label, s); allOn(label, s); });
    });
    // ---- overlaps inside each wizard step (children of the step panel that are visible)
    const pairsOK = (a, b) => (a.classList.contains("lbl") && b.classList.contains("inp")) || (b.classList.contains("lbl") && a.classList.contains("inp"));
    [[0, T.pick + 0.5], [1, T.st[2] - 0.1], [2, T.st[3] - 0.1], [3, T.st[4] - 0.1], [4, T.st[5] - 0.1], [5, T.saveClick - 0.1]].forEach(([k, t]) => {
      __apply(t);
      const kids = [...document.getElementById("st" + k).children].filter(vis).map((e) => [e, R(e)]);
      const pv = R(document.getElementById("pv"));
      kids.forEach(([e, r], i) => {
        if (k > 0 && ov(r, pv)) res.push(`OVERLAP step ${k} ${e.id || e.className} with preview`);
        if (r.b > 940 - 10) res.push(`OVERLAP step ${k} ${e.id || e.className} below card ${f(r)}`);
        kids.forEach(([e2, r2], j) => { if (i < j && ov(r, r2) && !pairsOK(e, e2)) res.push(`OVERLAP step ${k} t=${t.toFixed(1)} ${e.id || e.className} ${f(r)} x ${e2.id || e2.className} ${f(r2)}`); });
      });
    });
    // list: header columns vs cells (cell content must end before the next column starts)
    __apply(T.land + 1.5);
    const COLX = [20, 330, 540, 880, 1130, 1290, 1446];
    document.querySelectorAll("#row_nw .cell, #row_hp .cell, #row_dsk .cell, #row_mob .cell").forEach((c) => {
      const left = parseFloat(c.style.left);
      const nx = COLX.find((x) => x > left + 1) || 1540;
      const w = c.scrollWidth;
      if (left + w > nx - 12 && getComputedStyle(c).opacity > 0.05) res.push(`COLUMN ${c.parentElement.id} "${c.textContent.trim()}" ${left}+${w} > ${nx - 12}`);
    });
    __apply(T.assignedClick + 1);
    document.querySelectorAll("[id^=who_]").forEach((c) => {
      if (parseFloat(c.style.left) + c.scrollWidth > 1130 - 12) res.push("COLUMN who " + c.textContent);
    });
    // ---- cursor stops: the element under the pointer at each stop
    ["#end", "#bene", "#toon", "#fade0", "#cursor", "#ripple", "#adim"].forEach((s) => (document.querySelector(s).style.pointerEvents = "none"));
    let okN = 0;
    window.__stops.forEach((st) => {
      if (!st.sel) return;
      __apply(st.t + 0.02);
      const [x, y] = st.p;
      const e = document.elementFromPoint(x, y);
      const hit = e && e.closest(st.sel);
      if (hit && vis(hit)) okN++;
      else res.push(`STOP ${st.sel} @${st.t.toFixed(2)} (${x.toFixed(0)},${y.toFixed(0)}) -> ${e ? e.id || e.className.baseVal || e.className || e.tagName : "none"}${hit ? " (hidden)" : ""}`);
    });
    res.push(`cursor stops on target: ${okN}`);
    res.push("scenes " + __starts.map((x) => x.toFixed(1)).join(" ") + " total " + __total.toFixed(1));
    return res;
  });
  console.log(out.join("\n"));
  await b.close();
})();
