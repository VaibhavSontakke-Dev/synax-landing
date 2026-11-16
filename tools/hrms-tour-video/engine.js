/* Deterministic director for the HRMS tour. apply(t) draws the whole video for time t (seconds): no CSS transitions, no timers.
   script.js describes the scenes; this file turns them into a timeline (narration beats -> timed cursor moves, typing, menus,
   zoom, highlights) and renders any instant of it. */
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, u) => a + (b - a) * u;
const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10);
const eo = (u) => 1 - Math.pow(1 - u, 3);
const prog = (t, a, b) => clamp((t - a) / (b - a));
const hash = (k, seed = 1) => {
  const x = Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const norm = (w) => String(w).toLowerCase().replace(/[^a-z0-9]/g, "");

/* ---------- timing ---------- */
const INTRO = 3.1; // premium opening
const LEAD = 0.2; // narration starts this long after a beat starts
const GAPEND = 0.5; // quiet after each narration clip
const HOLD = 0.45; // beat lasts at least this long after its last action
const CHAP = 1.7; // section title card
const WARN = [];
const AUD = []; // voice clips: {file, t}
const FX = []; // sound effects: {name, t}
const CLICKS = [];
const KEYS = [];

/* ---------- sidebar ---------- */
const navin = $("#navin");
const NAV_TOP = [["Home", "House"], ["Work Tracker", "Timer"], ["Projects", "Briefcase", 1], ["Master", "LayoutGrid", 1], ["Staffing", "BriefcaseBusiness", 1], ["HRMS", "Users", 3]];
const NAV_BOT = [["Department Performance", "Gauge"], ["Manufacturing", "Hammer", 1], ["Assets", "Box", 1], ["Chat", "MessageCircle"], ["Calendar", "CalendarDays"], ["Public Meetings", "Video"], ["Help & Support", "CircleHelp"]];
const SUBS = [
  ["Employee List", "ContactRound"], ["Employee Add", "UserRoundPlus"], ["Interview List", "PanelTop"], ["Interview Add", "UserRoundPlus"], ["Attendance Log", "SquarePen"],
  ["Attendance OT Approval", "ClipboardCheck"], ["Break Pass", "Hourglass"], ["DWM List", "SquareKanban"], ["DWM Add", "SquarePlus"], ["DWM Assign User", "UserRoundPlus"],
  ["DWM Create Project", "ContactRound"], ["Referral List", "IdCard"], ["Referral Dashboard", "Gauge"], ["Leave & Absence", "CalendarRange"], ["Leave Policies", "SquareCheck"],
  ["HRMS Compliance", "FileChartColumn"], ["Performance Reviews", "ChartNoAxesGantt"], ["Offboarding Requests", "LogOut"], ["Offboarding Clearance", "LayoutGrid"],
  ["Offboarding FNF", "Banknote"], ["Exit Interview", "FileChartColumn"],
];
const SUBH = 36;
let subsEl;
function buildSidebar() {
  const mk = (name, icon, chev) => {
    const d = document.createElement("div");
    d.className = "nav hv" + (name === "Home" ? " on-pill" : "");
    d.dataset.k = "nav:" + name;
    d.innerHTML = `${ic(icon)}<span>${name.replace("&", "&amp;")}</span>` + (chev ? `<span class="ch">${ic(chev === 1 ? "ChevronDown" : "ChevronDown")}</span>` : "");
    navin.appendChild(d);
    return d;
  };
  NAV_TOP.forEach(([n, i, c]) => mk(n, i, c));
  subsEl = document.createElement("div");
  subsEl.className = "subs";
  SUBS.forEach(([n, i]) => {
    const d = document.createElement("div");
    d.className = "sub hv";
    d.dataset.k = "sub:" + n;
    d.innerHTML = `${ic(i)}<span>${n.replace("&", "&amp;")}</span>`;
    subsEl.appendChild(d);
  });
  navin.appendChild(subsEl);
  NAV_BOT.forEach(([n, i, c]) => mk(n, i, c));
  subsEl.style.height = SUBS.length * SUBH + "px";
  $("#kebab").innerHTML = ic("EllipsisVertical");
}

/* ---------- build pages, collect elements ---------- */
const KMAP = new Map();
function buildPages() {
  const host = $("#pages");
  Object.entries(PAGES).forEach(([id, fn]) => {
    const s = document.createElement("section");
    s.className = "page";
    s.id = "pg_" + id;
    s.innerHTML = id === "home" ? fn() : fn();
    host.appendChild(s);
  });
  document.querySelectorAll("[data-k]").forEach((e) => {
    const k = e.dataset.k;
    if (!k) return;
    if (KMAP.has(k)) WARN.push("duplicate key " + k);
    else KMAP.set(k, e);
  });
}
const K = (k) => {
  if (typeof k !== "string") return k;
  const e = KMAP.get(k);
  if (!e) throw new Error("missing element " + k);
  return e;
};
const rectOf = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};
const isSide = (el) => navin.contains(el);

/* ---------- sidebar scroll / expand / pills ---------- */
const SCROLL = []; // [t, y]
function sideScroll(t) {
  let i = -1;
  for (let j = 0; j < SCROLL.length; j++) if (SCROLL[j][0] <= t) i = j;
  if (i < 0) return 0;
  const prev = i > 0 ? SCROLL[i - 1][1] : 0;
  return lerp(prev, SCROLL[i][1], smoother(prog(t, SCROLL[i][0], SCROLL[i][0] + 0.6)));
}
let MAXSCROLL = 0;
function ensureVisible(el, tNeed) {
  const r = rectOf(el);
  const yc = r.y + r.h / 2;
  const cur = SCROLL.length ? SCROLL[SCROLL.length - 1][1] : 0;
  if (yc - cur > 150 && yc - cur < 760) return;
  const target = clamp(yc - 400, 0, MAXSCROLL);
  const lastT = SCROLL.length ? SCROLL[SCROLL.length - 1][0] + 0.7 : 0;
  SCROLL.push([Math.max(lastT, tNeed - 1.3), target]);
}
let EXPAND_T = null;
const expandP = (t) => (EXPAND_T == null ? 0 : smoother(prog(t, EXPAND_T, EXPAND_T + 0.55)));
const ACT = [{ t: -10, keys: ["nav:Home"] }];
const PGS = [{ t: -10, id: "home" }];
function intervals(list, key) {
  // [a,b) windows during which `key` (or a page id) is active
  const out = [];
  let open = null;
  list.forEach((e) => {
    const on = e.keys ? e.keys.includes(key) : e.id === key;
    if (on && open == null) open = e.t;
    if (!on && open != null) {
      out.push([open, e.t]);
      open = null;
    }
  });
  if (open != null) out.push([open, Infinity]);
  return out;
}
const pillStyle = (el, u) => {
  if (u < 0.01) {
    el.classList.remove("on-pill");
    el.style.cssText = "";
    return;
  }
  el.classList.add("on-pill");
  el.style.background = `rgba(31,44,61,${u})`;
  el.style.borderColor = `rgba(44,74,115,${u})`;
  el.style.borderLeftColor = `rgba(96,165,250,${u})`;
  el.style.color = u > 0.5 ? "#fff" : "#e6e6e6";
};

/* ---------- inputs ---------- */
const INP = new Map(); // el -> {el, tgt, kind, ph, init, ev[], focus[]}
function registerInputs() {
  document.querySelectorAll("[data-ph]").forEach((el) => {
    const tgt = el.classList.contains("txt") ? el : el.querySelector(".txt");
    if (!tgt) return;
    INP.set(el, { el, tgt, kind: el.dataset.kind || "text", ph: el.dataset.ph || "", init: el.dataset.init != null ? el.dataset.init : "", ev: [], focus: [] });
  });
}
function keyTimes(text, cps, seed, kind) {
  const times = [];
  let c = 0;
  if (kind === "date" || kind === "time") {
    const n = text.replace(/\D/g, "").length;
    for (let i = 0; i < n; i++) {
      c += 0.11 + 0.07 * hash(i, seed);
      times.push(c);
    }
    return times;
  }
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    c += (1 / cps) * (0.7 + 0.6 * hash(i, seed)) + (ch === " " ? 0.05 : ch === "." ? 0.06 : ch === "\n" ? 0.3 : 0);
    times.push(c);
  }
  return times;
}
const DSEG = { date: [[2, 2, 4], ["dd", "mm", "yyyy"], "-"], time: [[2, 2], ["--", "--"], ":"] };
function inputHtml(inp, ev, t, focused) {
  let text = inp.init;
  let typing = false;
  let digits = null;
  let raw = null;
  if (ev) {
    if (ev.kind === "set") {
      text = ev.text;
      raw = ev.raw;
    } else {
      let n = 0;
      while (n < ev.kt.length && ev.kt[n] <= t - ev.t0) n++;
      typing = t - ev.t0 <= (ev.kt[ev.kt.length - 1] || 0) + 0.6;
      if (inp.kind === "date" || inp.kind === "time") digits = { full: ev.text.replace(/\D/g, ""), n: ev.erase ? ev.kt.length - n : n };
      else text = ev.erase ? ev.text.slice(0, ev.text.length - n) : ev.text.slice(0, n);
    }
  }
  if (raw != null) return raw;
  if (digits) {
    const [sizes, phs, sep] = DSEG[inp.kind];
    let used = 0;
    return sizes
      .map((sz, i) => {
        const take = digits.full.slice(used, used + sz).slice(0, Math.max(0, digits.n - used));
        used += sz;
        return take ? `<span class="v">${take}</span>` : `<span class="ph">${phs[i]}</span>`;
      })
      .join(sep);
  }
  const caret = focused && inp.kind !== "date" && inp.kind !== "time" && inp.kind !== "file" && (typing || (t * 2) % 1 < 0.6) ? '<span class="caret"></span>' : "";
  if (!text) return `${caret}<span class="ph">${esc(inp.ph)}</span>`;
  return `<span class="v">${esc(text)}</span>${caret}`;
}

/* ---------- generic state events ---------- */
const CLS = new Map(); // el -> Map(cls -> [{t0,on}])
const SHOW = new Map(); // el -> [{t0,on,flash}]
const HTML = new Map(); // el -> [{t0,html}]
const PRESS = []; // {el,t0}
const DRAG = []; // {el,t0,t1,from}
const RINGS = []; // {el,t0,t1}
const MENUS = []; // {el,t0,t1,items[]}
const CHAPS = []; // {t0,t1,el}
const SPOT = []; // [t0,t1] windows where the page is dimmed (sidebar-only tours)
const ZK = [[0, 1, 960, 540]];
const pushEv = (map, el, ev) => {
  if (!map.has(el)) map.set(el, []);
  map.get(el).push(ev);
};

/* ---------- cursor ---------- */
const STOPS = [{ t: 0, p: [1560, 760] }];
let LAST = { t: 0, p: [1560, 760] };
const moveDur = (a, b) => clamp(0.22 + Math.hypot(b[0] - a[0], b[1] - a[1]) / 2800, 0.25, 0.5);
function cursorAt(t) {
  const s = STOPS;
  if (t <= s[0].t) return s[0].p;
  for (let i = 1; i < s.length; i++) {
    if (t <= s[i].t) {
      const p = s[i - 1], q = s[i];
      const dur = Math.min(moveDur(p.p, q.p), Math.max(0.05, q.t - p.t));
      const t0 = q.t - dur;
      if (t <= t0) return [p.p[0] + Math.sin(t * 3.1) * 0.8, p.p[1] + Math.cos(t * 2.3) * 0.8];
      const u = smoother((t - t0) / dur);
      const dx = q.p[0] - p.p[0], dy = q.p[1] - p.p[1];
      const dist = Math.hypot(dx, dy) || 1;
      const arc = Math.sin(Math.PI * u) * Math.min(34, dist * 0.06);
      return [p.p[0] + dx * u + (-dy / dist) * arc, p.p[1] + dy * u + (dx / dist) * arc];
    }
  }
  return s[s.length - 1].p;
}

/* ---------- camera ---------- */
function addShot(t, s, cx, cy, ease) {
  const prev = ZK[ZK.length - 1];
  const t0 = Math.max(t, prev[0]);
  if (t - t0 < -1.0) WARN.push(`shot at ${t.toFixed(2)} delayed to ${t0.toFixed(2)}`);
  if (t0 > prev[0]) ZK.push([t0, prev[1], prev[2], prev[3]]);
  ZK.push([t0 + ease, s, cx, cy]);
}
function zoomAt(t) {
  if (t <= ZK[0][0]) return ZK[0].slice(1);
  for (let i = 1; i < ZK.length; i++) {
    if (t <= ZK[i][0]) {
      const p = ZK[i - 1], q = ZK[i];
      const u = q[0] === p[0] ? 1 : smoother(clamp((t - p[0]) / (q[0] - p[0])));
      return [lerp(p[1], q[1], u), lerp(p[2], q[2], u), lerp(p[3], q[3], u)];
    }
  }
  return ZK[ZK.length - 1].slice(1);
}
function camAt(t) {
  if (window.__nozoom) return [1, 960, 540];
  let [s, cx, cy] = zoomAt(t);
  const hx = 960 / s, hy = 540 / s;
  const [px, py] = cursorAt(t);
  const mx = 150 / s, my = 130 / s;
  cx = clamp(cx, hx, 1920 - hx);
  cy = clamp(cy, hy, 1080 - hy);
  if (px < cx - hx + mx) cx = px + hx - mx;
  if (px > cx + hx - mx) cx = px - hx + mx;
  if (py < cy - hy + my) cy = py + hy - my;
  if (py > cy + hy - my) cy = py - hy + my;
  return [s, clamp(cx, hx, 1920 - hx), clamp(cy, hy, 1080 - hy)];
}

/* ---------- beat API (used by script.js) ---------- */
class Beat {
  constructor(sc, i, t0, s, dur, words) {
    this.sc = sc; this.i = i; this.t0 = t0; this.s = s; this.dur = dur; this.words = words || [];
    this.key = sc.id + "_" + i;
    this.last = s;
  }
  w(phrase, off = 0, nth = 1) {
    const toks = String(phrase).split(/\s+/).map(norm).filter(Boolean);
    let c = 0;
    for (let a = 0; a + toks.length <= this.words.length; a++) {
      if (toks.every((tk, j) => norm(this.words[a + j].w) === tk) && ++c === nth) return this.s + this.words[a].t + off;
    }
    WARN.push(`word "${phrase}" #${nth} not found in ${this.key}`);
    return this.s + 0.6 + off;
  }
  pos(el, fx = 0.5, fy = 0.5, t = 0) {
    el = K(el);
    const r = rectOf(el);
    return [r.x + r.w * fx, r.y + r.h * fy - (isSide(el) ? sideScroll(t) : 0)];
  }
  stop(el, t, o = {}) {
    el = K(el);
    if (isSide(el)) ensureVisible(el, t);
    let p = this.pos(el, o.fx ?? 0.5, o.fy ?? 0.5, t);
    let tc = Math.max(t, LAST.t + moveDur(LAST.p, p) + 0.02);
    if (tc - t > 0.6) WARN.push(`${this.key}: cursor stop pushed ${(tc - t).toFixed(2)}s late (${el.dataset.k || el.className})`);
    p = this.pos(el, o.fx ?? 0.5, o.fy ?? 0.5, tc);
    STOPS.push({ t: tc, p, el });
    LAST = { t: tc, p };
    this.last = Math.max(this.last, tc);
    return tc;
  }
  hover(el, t, o) { return this.stop(el, t, o); }
  click(el, t, o = {}) {
    const tc = this.stop(el, t, o);
    CLICKS.push(tc);
    const e = K(el);
    if (e.matches(".abtn,.sbtn,.rad,.cb,.tab,.bell,.back,.nav,.sub") && o.press !== false) PRESS.push({ el: e, t0: tc });
    return tc;
  }
  type(el, text, t, o = {}) {
    const inp = INP.get(K(el));
    if (!inp) throw new Error("not an input: " + el);
    const kt = keyTimes(text, o.cps || 11, o.seed || 3, inp.kind);
    inp.ev.push({ kind: "type", t0: t, text, kt, erase: !!o.erase });
    this.lastType = { t0: t, kt };
    const chars = inp.kind === "date" || inp.kind === "time" ? [...text.replace(/\D/g, "")] : [...text];
    kt.forEach((k, i) => chars[i] !== " " && KEYS.push(t + k));
    const end = t + (kt[kt.length - 1] || 0);
    this.last = Math.max(this.last, end);
    return end;
  }
  fill(el, text, t, o = {}) {
    const tc = this.click(el, t, { fx: o.fx ?? 0.3 });
    const end = this.type(el, text, tc + 0.16, o);
    INP.get(K(el)).focus.push([tc, end + 0.45]);
    return end + (o.gap ?? 0.2);
  }
  erase(el, text, t, o = {}) {
    const end = this.type(el, text, t, { ...o, erase: true, cps: o.cps || 16 });
    INP.get(K(el)).focus.push([t - 0.1, end + 0.3]);
    return end + 0.15;
  }
  set(el, text, t, raw) {
    const inp = INP.get(K(el));
    inp.ev.push({ kind: "set", t0: t, text, raw });
    return t;
  }
  cls(el, c, on, t) {
    el = K(el);
    if (!CLS.has(el)) CLS.set(el, new Map());
    const m = CLS.get(el);
    if (!m.has(c)) m.set(c, { init: el.classList.contains(c), ev: [] });
    m.get(c).ev.push({ t0: t, on });
    return t;
  }
  show(el, t, flash = true) { pushEv(SHOW, K(el), { t0: t, on: true, flash }); return t; }
  hide(el, t) { pushEv(SHOW, K(el), { t0: t, on: false }); return t; }
  html(el, h, t) {
    el = K(el);
    if (!HTML.has(el)) HTML.set(el, [{ t0: -1e9, html: el.innerHTML }]);
    HTML.get(el).push({ t0: t, html: h });
    return t;
  }
  ring(els, t0, t1, o = {}) {
    const list = [].concat(els).map(K);
    const rs = list.map(rectOf);
    const x0 = Math.min(...rs.map((r) => r.x)), y0 = Math.min(...rs.map((r) => r.y));
    const x1 = Math.max(...rs.map((r) => r.x + r.w)), y1 = Math.max(...rs.map((r) => r.y + r.h));
    const pad = o.pad ?? 6;
    const side = isSide(list[0]);
    const host = side ? navin : $("#rings");
    const hr = side ? rectOf(navin) : { x: 0, y: 0 };
    const d = document.createElement("div");
    d.className = "ring";
    if (o.r != null) d.style.borderRadius = o.r + "px";
    d.style.left = x0 - pad - hr.x + "px";
    d.style.top = y0 - pad - hr.y + "px";
    d.style.width = x1 - x0 + pad * 2 + "px";
    d.style.height = y1 - y0 + pad * 2 + "px";
    host.appendChild(d);
    RINGS.push({ el: d, t0, t1 });
  }
  shot(target, scale, t, o = {}) {
    const ease = o.ease ?? 0.9;
    if (target == null) return addShot(t, 1, 960, 540, ease);
    let cx, cy, s = scale;
    if (Array.isArray(target) && typeof target[0] === "number") {
      [cx, cy] = target;
    } else {
      const list = [].concat(target).map(K);
      const rs = list.map((e) => {
        const r = rectOf(e);
        if (isSide(e)) r.y -= sideScroll(t + ease);
        return r;
      });
      const x0 = Math.min(...rs.map((r) => r.x)), y0 = Math.min(...rs.map((r) => r.y));
      const x1 = Math.max(...rs.map((r) => r.x + r.w)), y1 = Math.max(...rs.map((r) => r.y + r.h));
      cx = (x0 + x1) / 2 + (o.dx || 0);
      cy = (y0 + y1) / 2 + (o.dy || 0);
      if (scale === "fit") s = clamp(Math.min(1920 / (x1 - x0 + 260), 1080 / (y1 - y0 + 220)), 1.12, o.max || 1.6);
    }
    addShot(t, s, cx, cy, ease);
  }
  /* a dropdown: click the field, move down the list, choose an option */
  pick(el, option, t, o = {}) {
    const fe = K(el);
    const items = o.options;
    const idx = items.indexOf(option);
    if (idx < 0) throw new Error(`option ${option} not in list for ${el}`);
    const r = rectOf(fe);
    const menu = document.createElement("div");
    menu.className = "menu";
    menu.style.left = r.x + "px";
    menu.style.width = (o.w || r.w) + "px";
    menu.style.top = r.y + r.h + 4 + "px";
    menu.innerHTML = items.map((x) => `<div class="mi">${esc(x)}</div>`).join("");
    $("#menus").appendChild(menu);
    menu.style.display = "block";
    const mi = [...menu.children].map(rectOf);
    const tc = this.click(el, t, { fx: 0.35 });
    // hover down to the option: at most three stops
    const path = [];
    for (let k = Math.max(0, idx - 2); k <= idx; k++) path.push(k);
    let tt = tc + 0.32;
    path.forEach((k, j) => {
      const ex = this.stopXY(r.x + (o.w || r.w) * 0.4, mi[k].y + mi[k].h / 2, j === path.length - 1 ? tt + 0.12 : tt);
      tt = ex + 0.22;
    });
    const tp = tt;
    const clickT = this.stopXY(r.x + (o.w || r.w) * 0.4, mi[idx].y + mi[idx].h / 2, tp);
    CLICKS.push(clickT);
    this.set(el, option, clickT + 0.04, o.raw ? o.raw(option) : undefined);
    MENUS.push({ el: menu, t0: tc, t1: clickT + 0.08, rects: mi });
    INP.get(fe) && INP.get(fe).focus.push([tc, clickT + 0.2]);
    this.last = Math.max(this.last, clickT);
    return clickT + (o.gap ?? 0.3);
  }
  /* multi-select dropdown: tick several options, then click away */
  multi(el, picks, t, o = {}) {
    const fe = K(el);
    const items = o.options;
    const r = rectOf(fe);
    const menu = document.createElement("div");
    menu.className = "menu";
    menu.style.left = r.x + "px";
    menu.style.width = r.w + "px";
    menu.style.top = r.y + r.h + 4 + "px";
    menu.innerHTML = items.map((x, i) => `<div class="mi"><span class="cb" data-mk="${i}">${ic("Check")}</span>${esc(x)}</div>`).join("");
    $("#menus").appendChild(menu);
    menu.style.display = "block";
    const mi = [...menu.children].map(rectOf);
    const tc = this.click(el, t, { fx: 0.5 });
    let tt = tc + 0.35;
    picks.forEach((name) => {
      const i = items.indexOf(name);
      const ct = this.stopXY(r.x + 90, mi[i].y + mi[i].h / 2, tt);
      CLICKS.push(ct);
      const cbx = menu.children[i].querySelector(".cb");
      CLS.set(cbx, new Map([["on", { init: false, ev: [{ t0: ct, on: true }] }]]));
      tt = ct + 0.42;
    });
    const chips = picks.map((n) => `<span class="pchip">${esc(n)}${ic("X")}</span>`).join("");
    const away = this.stopXY(r.x + r.w - 60, r.y - 40, tt + 0.1, false);
    CLICKS.push(away);
    this.set(el, "", away + 0.03, `<span class="chips">${chips}</span>`);
    MENUS.push({ el: menu, t0: tc, t1: away + 0.08, rects: mi });
    INP.get(fe).focus.push([tc, away + 0.2]);
    this.last = Math.max(this.last, away);
    return away + 0.3;
  }
  stopXY(x, y, t, menu = true) {
    const p = [x, y];
    const tc = Math.max(t, LAST.t + moveDur(LAST.p, p) + 0.02);
    STOPS.push({ t: tc, p, menu });
    LAST = { t: tc, p };
    this.last = Math.max(this.last, tc);
    return tc;
  }
  /* tick a checkbox / choose a radio pill */
  check(el, t, on = true) {
    const tc = this.click(el, t, { fx: 0.5 });
    this.cls(el, "on", on, tc + 0.02);
    return tc + 0.25;
  }
  radio(el, others, t) {
    const tc = this.click(el, t);
    this.cls(el, "on", true, tc + 0.02);
    [].concat(others).forEach((o) => this.cls(o, "on", false, tc + 0.02));
    return tc + 0.25;
  }
  /* drag an element with the cursor from its centre to a target and drop it */
  drag(el, toEl, t, o = {}) {
    const t0 = this.stop(el, t, { fx: 0.4, fy: 0.3 });
    CLICKS.push(t0);
    const dur = o.dur ?? 0.9;
    const t1 = this.stop(toEl, t0 + dur, { fx: o.fx ?? 0.5, fy: o.fy ?? 0.3 });
    DRAG.push({ el: K(el), t0, t1 });
    CLICKS.push(t1);
    return t1 + 0.15;
  }
  sound(name, t, gain = 1) { FX.push({ name, t, gain }); }
  /* open the HRMS group in the sidebar */
  expand(t) {
    const tc = this.click("nav:HRMS", t, { fx: 0.4 });
    EXPAND_T = tc + 0.05;
    FX.push({ name: "swish", t: tc, gain: 0.7 });
    return tc;
  }
  /* make the beat last until at least t */
  until(t) { this.last = Math.max(this.last, t - HOLD); }
  /* click a sidebar entry and switch pages */
  go(navKey, page, t, parentKey) {
    const tc = this.click(navKey, t, { fx: 0.4 });
    PGS.push({ t: tc, id: page });
    ACT.push({ t: tc, keys: parentKey ? [parentKey, navKey] : [navKey] });
    FX.push({ name: "swish", t: tc, gain: 1 });
    return tc;
  }
}

/* ---------- timeline ---------- */
let TOTAL = 0, ENDT = 0;
const SCENEINFO = [];
function runScenes() {
  let T = INTRO + 0.1;
  let prevChap = null;
  let chapNo = 0;
  SCENES.forEach((sc) => {
    const info = { id: sc.id, t0: T };
    SCENEINFO.push(info);
    const chap = sc.chapter && sc.chapter !== prevChap ? sc.chapter : null;
    if (chap) {
      chapNo++;
      prevChap = chap;
      CHAPS.push({ t0: T, t1: T + CHAP, no: chapNo, title: chap, sub: sc.chapterSub || "" });
      FX.push({ name: "whoosh", t: T + 0.15, gain: 1 });
    }
    addShot(T + (chap ? CHAP - 0.2 : 0.1), 1, 960, 540, 0.7);
    if (sc.endcard) {
      ENDT = T + 0.1;
      FX.push({ name: "endchime", t: ENDT + 0.4, gain: 1 });
    }
    sc.beats.forEach((fn, i) => {
      const key = sc.id + "_" + i;
      const dur = DUR[key];
      if (dur == null) throw new Error("no narration duration for " + key + " (run gen_audio)");
      const lead = i === 0 ? (chap ? CHAP + 0.2 : LEAD) : 0.18;
      const b = new Beat(sc, i, T, T + lead, dur, WORDS[key]);
      AUD.push({ file: key, t: b.s });
      if (i === 0 && sc.nav && sc.page) {
        const t = b.s + (sc.navAt ?? 0.5);
        if (sc.nav.startsWith("sub:")) b.go(sc.nav, sc.page, t, "nav:HRMS");
        else b.go(sc.nav, sc.page, t);
      }
      fn(b);
      const end = Math.max(T + lead + dur + GAPEND, b.last + HOLD);
      if (b.spotOn) SPOT.push([T, end + 0.35]);
      info[`b${i}`] = [b.s, b.s + dur, end];
      if (end - (T + lead + dur + GAPEND) > 1.2) WARN.push(`${key}: actions run ${(end - (T + lead + dur + GAPEND)).toFixed(1)}s past the narration`);
      T = end;
    });
    info.t1 = T;
  });
  TOTAL = T + 0.5;
  if (!ENDT) ENDT = TOTAL;
}

/* ---------- rendering ---------- */
const cache = new Map();
const put = (el, html) => {
  if (cache.get(el) !== html) {
    el.innerHTML = html;
    cache.set(el, html);
  }
};
const setCls = (el, c, on) => {
  if (el.classList.contains(c) !== on) el.classList.toggle(c, on);
};
let HOV = [];
let INTRO_NODES;

function apply(t) {
  // pages
  const pageOpacity = {};
  Object.keys(PAGES).forEach((id) => {
    let op = 0, ty = 0;
    for (const [a, b] of PGIV[id]) {
      const fin = smoother(prog(t, a + 0.05, a + 0.5));
      const fout = b === Infinity ? 0 : smoother(prog(t, b, b + 0.3));
      const o = fin * (1 - fout);
      if (o > op) {
        op = o;
        ty = (1 - fin) * 14 - fout * 8;
      }
    }
    const el = $("#pg_" + id);
    el.style.opacity = op;
    el.style.display = op > 0.001 ? "block" : "none";
    el.style.transform = op > 0.001 && ty ? `translateY(${ty}px)` : "";
    pageOpacity[id] = op;
  });

  // sidebar
  const sy = sideScroll(t);
  navin.style.transform = `translateY(${-sy}px)`;
  const ep = expandP(t);
  subsEl.style.height = SUBS.length * SUBH * ep + "px";
  const hr = K("nav:HRMS");
  const chev = hr.querySelector(".ch");
  put(chev, ic(ep > 0.5 ? "ChevronUp" : "ChevronDown"));
  Object.entries(PILLS).forEach(([key, ivs]) => {
    let u = 0;
    ivs.forEach(([a, b]) => {
      u = Math.max(u, smoother(prog(t, a, a + 0.3)) * (b === Infinity ? 1 : 1 - smoother(prog(t, b, b + 0.3))));
    });
    pillStyle(K(key), u);
  });

  // inputs
  INP.forEach((inp) => {
    let ev = null;
    for (const e of inp.ev) {
      if (e.t0 <= t) ev = e;
      else break;
    }
    const focused = inp.focus.some(([a, b]) => t >= a && t < b);
    const box = inp.el.classList.contains("txt") ? null : inp.el;
    if (box && (box.classList.contains("inp") || box.classList.contains("hsearch"))) setCls(box, "focus", focused);
    put(inp.tgt, inputHtml(inp, ev, t, focused));
  });

  // generic state
  CLS.forEach((m, el) => {
    m.forEach((st, c) => {
      let on = st.init;
      for (const e of st.ev) if (e && e.t0 <= t) on = e.on;
      setCls(el, c, on);
    });
  });
  SHOW.forEach((evs, el) => {
    const initVis = !evs[0].on;
    let vis = initVis, t0 = -1e9, flash = false;
    for (const e of evs) if (e.t0 <= t) { vis = e.on; t0 = e.t0; flash = e.flash; }
    el.style.display = vis ? "" : "none";
    if (vis && flash && t - t0 < 1.8) {
      const u = smoother(prog(t, t0, t0 + 0.4));
      el.style.opacity = u;
      el.style.background = flash === true ? `rgba(96,165,250,${0.16 * (1 - prog(t, t0 + 0.4, t0 + 1.8))})` : "";
    } else if (el.style.opacity || el.style.background) {
      el.style.opacity = "";
      el.style.background = "";
    }
  });
  HTML.forEach((evs, el) => {
    let h = evs[0].html;
    for (const e of evs) if (e.t0 <= t) h = e.html;
    put(el, h);
  });

  // cursor, camera
  const [px, py] = cursorAt(t);
  DRAG.forEach((d) => {
    const on = t >= d.t0 && t < d.t1 + 0.06;
    if (on) {
      const [x0, y0] = cursorAt(d.t0);
      d.el.style.transform = `translate(${px - x0}px,${py - y0}px) scale(1.04) rotate(1.5deg)`;
      d.el.style.boxShadow = "0 14px 30px rgba(0,0,0,.55)";
      d.el.style.zIndex = 40;
      d.el.style.position = "relative";
    } else if (d.el.style.transform) {
      d.el.style.transform = "";
      d.el.style.boxShadow = "";
      d.el.style.zIndex = "";
    }
  });
  PRESS.forEach((p) => {
    if (DRAG.some((d) => d.el === p.el)) return;
    p.el.style.transform = t >= p.t0 && t < p.t0 + 0.16 ? "scale(.95)" : "";
  });

  // hover highlights follow the cursor
  HOV.forEach((h) => {
    const vis = h.page ? pageOpacity[h.page] > 0.5 : true;
    const y = h.side ? h.r.y - sy : h.r.y;
    const over = vis && px >= h.r.x && px <= h.r.x + h.r.w && py >= y && py <= y + h.r.h;
    setCls(h.el, "hov", over);
  });

  // menus
  MENUS.forEach((m) => {
    const a = smoother(prog(t, m.t0 + 0.04, m.t0 + 0.22)) * (1 - smoother(prog(t, m.t1, m.t1 + 0.12)));
    m.el.style.opacity = a;
    m.el.style.transform = `translateY(${(1 - a) * -6}px)`;
    if (a > 0.01) {
      [...m.el.children].forEach((c, i) => {
        const r = m.rects[i];
        setCls(c, "hi", px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h);
      });
    }
  });

  // rings
  RINGS.forEach((r) => {
    const a = Math.min(prog(t, r.t0, r.t0 + 0.3), 1 - prog(t, r.t1 - 0.3, r.t1));
    r.el.style.opacity = Math.max(0, a) * (0.78 + 0.22 * Math.sin(t * 4));
    r.el.style.transform = `scale(${0.985 + 0.015 * smoother(prog(t, r.t0, r.t0 + 0.3))})`;
  });

  // camera (with a gentle push when the intro hands over to the app)
  let [s, cx, cy] = camAt(t);
  const introOut = prog(t, INTRO - 0.55, INTRO + 0.35);
  s *= 1 + 0.045 * (1 - smoother(introOut));
  $("#app").style.transform = `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`;
  $("#app").style.opacity = smoother(prog(t, INTRO - 0.55, INTRO + 0.3));

  // cursor + ripple
  const stageX = 960 + (px - cx) * s, stageY = 540 + (py - cy) * s;
  const cur = $("#cursor");
  let press = 0;
  for (const c of CLICKS) if (t >= c && t < c + 0.16) press = Math.max(press, 1 - (t - c) / 0.16);
  cur.style.transform = `translate(${stageX - 3}px, ${stageY - 2}px) scale(${1 - 0.14 * press})`;
  const showCur = t > INTRO + 0.1 && t < ENDT + 0.5;
  cur.style.opacity = showCur ? Math.min(prog(t, INTRO + 0.1, INTRO + 0.5), 1 - prog(t, ENDT, ENDT + 0.5)) : 0;
  let rp = 0, rx = 0, ry = 0;
  for (const ct of CLICKS) {
    if (t >= ct && t < ct + 0.45) {
      rp = (t - ct) / 0.45;
      const [qx, qy] = cursorAt(ct);
      const zz = camAt(ct);
      rx = 960 + (qx - zz[1]) * zz[0];
      ry = 540 + (qy - zz[2]) * zz[0];
    }
  }
  const rip = $("#ripple");
  rip.style.opacity = rp ? 0.9 * (1 - rp) : 0;
  rip.style.transform = `translate(${rx}px, ${ry}px) scale(${0.35 + eo(rp) * 1.5})`;

  // section title cards
  let co = 0;
  CHAPS.forEach((c) => {
    const o = smoother(prog(t, c.t0, c.t0 + 0.4)) * (1 - smoother(prog(t, c.t1 - 0.45, c.t1)));
    const sl = c.el;
    sl.style.display = o > 0.001 ? "block" : "none";
    if (o > 0.001) {
      const u = smoother(prog(t, c.t0 + 0.15, c.t0 + 0.8));
      sl.querySelector(".tt span").style.transform = `translateY(${(1 - u) * 100}%)`;
      sl.querySelector(".num").style.opacity = smoother(prog(t, c.t0 + 0.1, c.t0 + 0.55));
      sl.querySelector(".ln").style.transform = `scaleX(${smoother(prog(t, c.t0 + 0.35, c.t0 + 0.95))})`;
      sl.querySelector(".sb").style.opacity = smoother(prog(t, c.t0 + 0.6, c.t0 + 1.0));
    }
    co = Math.max(co, o);
  });
  $("#chapter").style.opacity = co;

  // dimmed page during sidebar-only tours
  let so = 0;
  SPOT.forEach(([a, b2]) => (so = Math.max(so, smoother(prog(t, a, a + 0.4)) * (1 - smoother(prog(t, b2 - 0.4, b2))))));
  $("#spot").style.opacity = so;

  // end card
  const ec = smoother(prog(t, ENDT, ENDT + 0.9));
  $("#end").style.opacity = ec;
  $("#end").style.transform = `scale(${1.03 - 0.03 * ec})`;

  // premium intro
  const intro = $("#intro");
  const iv = 1 - smoother(introOut);
  intro.style.opacity = t < INTRO + 0.4 ? iv : 0;
  intro.style.transform = `scale(${1 + 0.08 * smoother(introOut)})`;
  intro.style.filter = `blur(${8 * smoother(introOut)}px)`;
  const ig = smoother(prog(t, 0, 0.9));
  $("#igrid").style.opacity = 0.9 * ig;
  $("#iglow").style.opacity = 0.6 + 0.4 * Math.pow(Math.sin(t * 2.2), 2);
  $("#iglow").style.transform = `translate(-50%,-50%) scale(${0.9 + 0.18 * smoother(prog(t, 0, 2.6))})`;
  const lg = smoother(prog(t, 0.25, 0.95));
  $("#ilogo").style.opacity = lg;
  $("#ilogo").style.transform = `translate(-50%,-50%) translateY(${(1 - lg) * 22}px) scale(${0.93 + 0.07 * lg})`;
  const sweep = prog(t, 0.95, 1.6);
  $("#isheen").style.opacity = sweep > 0 && sweep < 1 ? 0.9 : 0;
  $("#isheen").style.left = -120 + sweep * 520 + "px";
  const ey = smoother(prog(t, 0.85, 1.45));
  $("#ieye").style.opacity = ey;
  $("#ieye").style.letterSpacing = 18 - 8 * ey + "px";
  const tt = smoother(prog(t, 1.1, 1.8));
  $("#ititle").firstChild.style.transform = `translateY(${(1 - tt) * 100}%)`;
  const ln = smoother(prog(t, 1.55, 2.25));
  $("#iline").style.width = 340 * ln + "px";
  $("#iline").style.opacity = ln;
  $("#isub").style.opacity = smoother(prog(t, 1.9, 2.5));
}

/* ---------- lint (no screenshots needed): finds clipped text and out-of-frame content ---------- */
function lint() {
  window.__nozoom = true;
  const out = [...WARN];
  SCENEINFO.forEach((s) => {
    apply(s.t1 - 0.05);
    document.querySelectorAll(".page").forEach((pg) => {
      if (pg.style.display === "none" || +pg.style.opacity < 0.5) return;
      pg.querySelectorAll(".inp, .c, .chip, .tab, .abtn, .sbtn, .stc, .pchip, .hsearch, .rad").forEach((e) => {
        if (e.offsetParent === null) return;
        if (e.scrollWidth > e.clientWidth + 1) out.push(`${s.id}: clipped text in ${e.dataset.k || e.className}: "${e.textContent.trim().slice(0, 40)}"`);
      });
      pg.querySelectorAll(".th .c").forEach((e) => {
        if (e.offsetParent !== null && e.scrollHeight > e.clientHeight + 1) out.push(`${s.id}: table header wraps/clips: "${e.textContent.trim()}"`);
      });
      pg.querySelectorAll(".hdr").forEach((h) => {
        const kids = [...h.children].map((c) => c.getBoundingClientRect());
        for (let i = 1; i < kids.length; i++) if (kids[i].left < kids[i - 1].right - 1) out.push(`${s.id}: header items overlap (child ${i})`);
      });
      pg.querySelectorAll(".pg>.card").forEach((c) => {
        if (c.scrollHeight > c.clientHeight + 2) out.push(`${s.id}: card clips ${c.scrollHeight - c.clientHeight}px of content (${c.className}${c.dataset.k ? " " + c.dataset.k : ""})`);
      });
      pg.querySelectorAll(".card, .tbl, .tr").forEach((e) => {
        if (e.offsetParent === null) return;
        const r = e.getBoundingClientRect();
        if (r.right > 1912 || r.bottom > 1080) out.push(`${s.id}: element leaves the frame (${e.dataset.k || e.className.slice(0, 30)}) right=${r.right.toFixed(0)} bottom=${r.bottom.toFixed(0)}`);
      });
    });
  });
  window.__nozoom = false;
  return out;
}

/* ---------- probe: does every cursor stop land on the element it targets? (DOM check, no screenshots) ---------- */
function probe() {
  const out = [];
  ["#chapter", "#intro", "#end", "#rings", "#spot", "#ripple", "#cursor"].forEach((s) => ($(s).style.display = "none"));
  let n = 0;
  STOPS.forEach((s) => {
    if (!s.el && !s.menu) return;
    n++;
    apply(s.t);
    document.querySelectorAll(".menu").forEach((m) => (m.style.pointerEvents = s.menu && +m.style.opacity > 0.5 ? "auto" : "none"));
    const [sc, cx, cy] = camAt(s.t);
    const x = 960 + (s.p[0] - cx) * sc, y = 540 + (s.p[1] - cy) * sc;
    const name = s.el ? s.el.dataset.k || s.el.className.slice(0, 30) : "menu item";
    if (x < 0 || x > 1920 || y < 0 || y > 1080) return out.push(`t=${s.t.toFixed(1)} ${name}: cursor off screen (${x.toFixed(0)},${y.toFixed(0)})`);
    const hit = document.elementFromPoint(x, y);
    const ok = s.menu ? !!(hit && hit.closest(".menu")) : !!(hit && s.el.contains(hit));
    if (!ok) out.push(`t=${s.t.toFixed(1)} ${name}: cursor lands on ${hit ? hit.dataset.k || hit.className || hit.tagName : "nothing"}`);
  });
  ["#chapter", "#intro", "#end", "#rings", "#spot", "#ripple", "#cursor"].forEach((s) => ($(s).style.display = ""));
  document.querySelectorAll(".menu").forEach((m) => (m.style.pointerEvents = ""));
  out.unshift(`probed ${n} cursor stops`);
  return out;
}

/* ---------- boot ---------- */
let PGIV = {}, PILLS = {};
async function boot() {
  // load every Inter weight up front: measurements (rings, zoom, cursor targets) must use the final font metrics
  await Promise.all([400, 500, 600, 700].map((w) => document.fonts.load(`${w} 16px Inter`)));
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
  buildSidebar();
  buildPages();
  registerInputs();
  // measure state: every page visible, sidebar fully expanded and unscrolled
  document.querySelectorAll(".page").forEach((p) => (p.style.opacity = 1));
  MAXSCROLL = Math.max(0, navin.scrollHeight - 728);
  runScenes();
  // hover map
  HOV = [...document.querySelectorAll(".hv")].map((el) => ({ el, r: rectOf(el), side: isSide(el), page: (el.closest(".page") || {}).id ? el.closest(".page").id.slice(3) : null }));
  // chapter slides
  CHAPS.forEach((c) => {
    const d = document.createElement("div");
    d.className = "cslide";
    d.innerHTML = `<div class="num">SECTION ${String(c.no).padStart(2, "0")}</div><div class="tt"><span>${esc(c.title)}</span></div><div class="ln"></div>${c.sub ? `<div class="sb">${esc(c.sub)}</div>` : ""}`;
    d.querySelector(".ln").style.transformOrigin = "50% 50%";
    $("#chapter").appendChild(d);
    c.el = d;
  });
  Object.keys(PAGES).forEach((id) => (PGIV[id] = intervals(PGS, id)));
  [...document.querySelectorAll("#navin [data-k]")].forEach((e) => (PILLS[e.dataset.k] = intervals(ACT, e.dataset.k)));
  Object.keys(PAGES).forEach((id) => (PGIV[id] = PGIV[id].length ? PGIV[id] : []));
  // the Home page stays until the first page change; sort events
  INP.forEach((i) => i.ev.sort((a, b) => a.t0 - b.t0));
  SHOW.forEach((v) => v.sort((a, b) => a.t0 - b.t0));
  STOPS.sort((a, b) => a.t - b.t);
  CLS.forEach((m) => m.forEach((st) => st.ev.sort((a, b) => (a && b ? a.t0 - b.t0 : 0))));
  HTML.forEach((v) => v.sort((a, b) => a.t0 - b.t0));
  // reset measure state
  document.querySelectorAll(".page").forEach((p) => (p.style.opacity = 0));
  window.__apply = apply;
  window.__total = TOTAL;
  window.__lint = lint;
  window.__probe = probe;
  window.__scenes = SCENEINFO;
  window.__meta = {
    intro: INTRO, total: TOTAL, endT: ENDT, clicks: CLICKS, keys: KEYS, audio: AUD, fx: FX, scenes: SCENEINFO, chapters: CHAPS.map((c) => [c.t0, c.t1, c.title]), warn: WARN,
  };
  window.__ready = true;
  apply(0);
}
boot().catch((e) => {
  window.__err = String(e && e.stack ? e.stack : e);
  console.error(window.__err);
});
