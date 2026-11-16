// Layout checks without screenshots, measured in the page: opening and vignette bubbles, the reveal, the overview, every
// solution scene (elements on screen, text that overflows its box or its card, cards that overlap), and every cursor stop.
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
    const name = (e) => e.id || (e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className) || e.tagName;
    const M = window.__meta, SEC = window.__SEC;
    // opening bubbles: on screen, clear of heads and chips
    Toon.bubbles.forEach((bb, i) => {
      __apply(Math.min((bb.t0 + bb.t1) / 2 + 0.4, bb.t1 - 0.3));
      const r = R(document.getElementById("tB" + i).querySelector("rect:nth-of-type(2)"));
      const heads = ["A", "B", "C", "D"].filter((k) => document.getElementById("g" + k).getAttribute("opacity") !== "0").filter((k) => ov(r, R(document.getElementById("p" + k + "_head"))));
      const chip = [0, 1, 2, 3].some((k) => +document.getElementById("tC" + k).getAttribute("opacity") > 0.1 && ov(r, R(document.getElementById("tC" + k))));
      if (!inScreen(r, 8) || heads.length || chip) res.push(`OPENING bubble ${i} ${f(r)} screen:${inScreen(r, 8)} heads:${heads} chips:${chip}`);
    });
    __apply(10.4);
    const cr = [0, 1, 2, 3].map((k) => R(document.getElementById("tC" + k)));
    if (!cr.every((r) => inScreen(r, 10)) || cr.some((a, i) => cr.some((c, j) => i < j && ov(a, c)))) res.push("OPENING chips " + cr.map(f).join(" "));
    // vignettes: bubble, tag and person on screen; bubble clear of the head and the tag; text fully typed
    SEC.forEach((s, k) => {
      __apply(s.sol - 0.1);
      const pfx = "v" + k;
      const bub = R(document.getElementById(pfx + "B").querySelector("rect:nth-of-type(2)"));
      const tag = R(document.getElementById(pfx + "Tag"));
      const head = R(document.querySelector(`[id^="${pfx}p"][id$="_head"]`));
      const body = R(document.querySelector(`[id^="${pfx}p"][id$="_body"]`));
      const bad = [!inScreen(bub, 8) && "bubble off", ov(bub, head) && "bubble over head", ov(bub, tag) && "bubble over tag", !inScreen(head, 0) && "head off", body.b > 1080 + 200 && "body far off"].filter(Boolean);
      if (bad.length) res.push(`VIGNETTE ${k} ${bad} bubble ${f(bub)} head ${f(head)} tag ${f(tag)}`);
      const txt = [...document.getElementById(pfx + "B").querySelectorAll("text")].map((t) => t.textContent).join("");
      if (txt.replace(/\s/g, "") !== ToonV.cfg[k].lines.join("").replace(/\s/g, "")) res.push(`VIGNETTE ${k} text not complete when the wipe starts: "${txt}"`);
    });
    // reveal, organised
    __apply(M.reveal.pulse + 0.6);
    const hub = R(document.getElementById("hub")), title = R(document.getElementById("rt1")), pills = R(document.getElementById("rpills"));
    [...document.querySelectorAll(".rc")].map(R).forEach((c, i, all) => {
      const bad = [ov(c, hub) && "hub", ov(c, title) && "title", ov(c, pills) && "pills", !inScreen(c, 10) && "off", ...all.map((d, j) => j !== i && ov(c, d, 4) && "card" + j)].filter(Boolean);
      if (bad.length) res.push(`REVEAL card ${i} ${f(c)} ${bad}`);
    });
    if (R(document.getElementById("rt2")).r > 1900 || title.x < 20) res.push("REVEAL title off screen");
    document.querySelectorAll("#hub .kpi .k, #hub .hbar .l, .rc .rv").forEach((e) => e.scrollWidth > e.clientWidth + 1 && res.push("REVEAL text overflow " + e.textContent));
    // overview
    __apply(window.__starts[3] - 0.6);
    document.querySelectorAll(".otile").forEach((e, i) => {
      if (!inScreen(R(e), 10)) res.push("OVERVIEW tile off " + i);
      if (e.querySelector(".on").scrollWidth > e.clientWidth - 64) res.push("OVERVIEW name too wide " + e.textContent);
    });
    if (R(document.getElementById("ovh")).b > R(document.getElementById("ot0")).y - 20) res.push("OVERVIEW heading too close to tiles");
    // each solution near its end
    const textSel = ".big,.mut,.kv .v,.kv .k,.nm,.note,.mark,.status,.tms,.proj,.file,.btnp,.vstep,.hol,.cyc,.chk,.amt,.quote,.search,.st,.pt,#p_nt";
    SEC.forEach((s, k) => {
      __apply(s.end - 0.15);
      const sol = document.getElementById("sol" + k);
      if (!vis(sol)) {
        res.push("SOLUTION " + k + " not visible at its end");
        return;
      }
      [...sol.querySelectorAll("*")].filter((e) => e.namespaceURI !== "http://www.w3.org/2000/svg" && vis(e)).forEach((e) => {
        const r = R(e);
        if (r.w > 0 && !inScreen(r, 0)) res.push(`SOLUTION ${k} off screen ${name(e)} ${f(r)}`);
      });
      sol.querySelectorAll(textSel).forEach((e) => {
        if (!vis(e)) return;
        if (e.scrollWidth > e.clientWidth + 1) res.push(`SOLUTION ${k} text overflow ${name(e)} "${e.textContent.trim().slice(0, 50)}" ${e.scrollWidth} > ${e.clientWidth}`);
        const card = e.closest(".card");
        if (card) {
          const rc = R(card), r = R(e);
          if (r.r > rc.r - 8 || r.b > rc.b - 8 || r.x < rc.x + 4) res.push(`SOLUTION ${k} outside its card ${name(e)} "${e.textContent.trim().slice(0, 30)}" ${f(r)} card ${f(rc)}`);
        }
      });
      const blocks = [...sol.querySelectorAll(".card,.kcol,.proj,.cyc,.sh,#p_team")].filter(vis).map((e) => [e, R(e)]);
      blocks.forEach(([e, r], i) => blocks.forEach(([e2, r2], j) => {
        if (i < j && ov(r, r2)) res.push(`SOLUTION ${k} overlap ${name(e)} ${f(r)} x ${name(e2)} ${f(r2)}`);
      }));
      const fl = [...sol.querySelectorAll(".kcard,.note,.task,.mark")].filter(vis).map((e) => [e, R(e)]);
      fl.forEach(([e, r], i) => fl.forEach(([e2, r2], j) => {
        if (i < j && ov(r, r2)) res.push(`SOLUTION ${k} floating overlap ${name(e)} ${f(r)} x ${name(e2)} ${f(r2)}`);
      }));
    });
    // cursor stops
    ["#end", "#bene", "#toon", "#fade0", "#cursor", "#ripple"].forEach((s) => (document.querySelector(s).style.pointerEvents = "none"));
    document.querySelectorAll(".vg").forEach((v) => (v.style.pointerEvents = "none"));
    let ok = 0, n = 0;
    window.__stops.forEach((st) => {
      if (!st.sel) return;
      n++;
      __apply(st.t + 0.02);
      const e = document.elementFromPoint(st.p[0], st.p[1]);
      const hit = e && e.closest(st.sel);
      if (hit && vis(hit)) ok++;
      else res.push(`STOP ${st.sel} @${st.t.toFixed(2)} (${st.p.map((v) => v.toFixed(0))}) -> ${e ? name(e) : "none"}`);
    });
    res.push(`cursor stops on target: ${ok}/${n}`);
    res.push("scenes " + __starts.map((x) => x.toFixed(1)).join(" ") + " total " + __total.toFixed(1));
    res.push("sections (vignette in / wipe / end): " + SEC.map((s) => `${s.vIn.toFixed(1)}/${s.sol.toFixed(1)}/${s.end.toFixed(1)}`).join("  "));
    return res;
  });
  console.log(out.join("\n"));
  await b.close();
})();
