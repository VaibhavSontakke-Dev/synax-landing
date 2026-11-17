// Layout checks without screenshots, sampled every 0.5 s over the whole video:
//  - text that overflows its own box (scrollWidth > clientWidth)
//  - elements inside a card that stick out of that card
//  - visible elements off screen (only when the camera is at rest)
//  - speech-free overlap: cards (.cd / .chip / .mt) of one scene that overlap each other
const { chromium } = require("playwright");
const path = require("path");
const url = "file:///" + path.resolve("demo.html").split(path.sep).join("/");
(async () => {
  const b = await chromium.launch({ channel: process.env.PW_CHANNEL || "msedge" });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto(url);
  await p.waitForFunction(() => window.__ready || window.__err, null, { timeout: 30000 });
  const total = await p.evaluate(() => window.__total);
  const issues = await p.evaluate(async (total) => {
    const seen = new Map();
    const vis = (el) => {
      for (let e = el; e && e !== document.body; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.6) return false;
      }
      return true;
    };
    const name = (el) => (el.id ? "#" + el.id : el.className && el.className.baseVal === undefined ? "." + String(el.className).split(" ").join(".") : el.tagName) + " «" + (el.textContent || "").trim().slice(0, 40) + "»";
    const add = (t, kind, el, extra = "") => {
      const k = kind + name(el);
      if (!seen.has(k)) seen.set(k, `${t.toFixed(1)}s ${kind}: ${name(el)} ${extra}`);
    };
    for (let t = 0; t < total; t += 0.5) {
      window.__apply(t);
      const camRest = !document.getElementById("world").style.transform;
      const els = document.querySelectorAll(".scene .cd, .scene .chip, .scene .mt, .scene .pill, .scene .tag, .scene .mi, .scene .kv, .scene .fs, .scene .mach, .scene .ping, .scene .dept, .scene .bub, .scene .btn, .scene .stitle h1, .scene .big, .scene td, .scene .ch, .scene .row, #end h2, #end p");
      const cards = [];
      for (const el of els) {
        if (!vis(el)) continue;
        const ws = getComputedStyle(el).whiteSpace;
        if (el.scrollWidth > el.clientWidth + 2 && (ws === "nowrap" || el.tagName === "TD" || el.classList.contains("pill") || el.classList.contains("chip"))) add(t, "text overflow", el, `${el.scrollWidth}>${el.clientWidth}`);
        const r = el.getBoundingClientRect();
        if (camRest && (r.left < -2 || r.top < -2 || r.right > 1922 || r.bottom > 1082)) add(t, "off screen", el, `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}`);
        const card = el.parentElement && el.parentElement.closest(".cd,.mach,.dept,.chat");
        if (card && card !== el) {
          const c = card.getBoundingClientRect();
          if (r.right > c.right + 3 || r.bottom > c.bottom + 3 || r.left < c.left - 3) add(t, "sticks out of card", el, `in ${name(card)}`);
        }
        if (el.matches(".cd,.chip,.mt,.mach,.dept") && camRest) cards.push([el, r]);
      }
      for (let i = 0; i < cards.length; i++)
        for (let j = i + 1; j < cards.length; j++) {
          const [a, ra] = cards[i];
          const [c, rc] = cards[j];
          if (a.contains(c) || c.contains(a)) continue;
          if (a.closest(".scene") !== c.closest(".scene")) continue;
          const ox = Math.min(ra.right, rc.right) - Math.max(ra.left, rc.left);
          const oy = Math.min(ra.bottom, rc.bottom) - Math.max(ra.top, rc.top);
          if (ox > 6 && oy > 6) add(t, "overlap", a, `with ${name(c)}`);
        }
      if (t % 30 === 0) await new Promise((r) => setTimeout(r, 0));
    }
    return [...seen.values()];
  }, total);
  console.log(issues.length ? issues.join("\n") : "no layout issues");
  await b.close();
})();
