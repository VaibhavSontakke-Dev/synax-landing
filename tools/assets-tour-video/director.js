/* Deterministic director: apply(t) draws the whole video for time t (seconds). No CSS transitions, no timers. */
const $ = (s, r = document) => r.querySelector(s);
const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[n] || ""}</svg>`;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, u) => a + (b - a) * u;
const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10);
const eo = (u) => 1 - Math.pow(1 - u, 3);
const prog = (t, a, b) => clamp((t - a) / (b - a));
const hash = (k, seed = 1) => {
  const x = Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- timing ---------- */
const INTRO = 3.1; // premium opening
const LEAD = 0.2; // narration starts this long after a scene starts
const GAPEND = 0.55; // quiet after each narration clip
const D = DUR.map((d) => LEAD + d + GAPEND);
const S = [INTRO + 0.1];
D.forEach((d, i) => S.push(S[i] + d));
const TOTAL = S[D.length] + 0.4;
const at = (i, r) => S[i] + LEAD + r; // r = seconds after the narration of scene i starts

/* ---------- sidebar ---------- */
const side = $("#side");
const navDefs = [
  ["Home", "House", 109], ["Work Tracker", "Timer", 149.5], ["Projects", "Briefcase", 190, 1], ["Master", "LayoutGrid", 230.5, 1],
  ["Staffing", "BriefcaseBusiness", 271, 1], ["HRMS", "Users", 311.5, 1], ["Department Performance", "Gauge", 352], ["Manufacturing", "Hammer", 392.5, 1],
  ["Assets", "Box", 433, 2], ["Chat", "MessageCircle", 584.5], ["Calendar", "CalendarDays", 625], ["Public Meetings", "Video", 665.5], ["Help & Support", "CircleHelp", 706],
];
const navEl = {};
navDefs.forEach(([name, icon, cy, ch]) => {
  const d = document.createElement("div");
  d.className = "nav" + (name === "Assets" ? " on" : "");
  d.style.top = cy - 20.25 + "px";
  d.innerHTML = `${ic(icon)}<span>${name}</span>` + (ch ? `<span class="ch">${ic(ch === 2 ? "ChevronUp" : "ChevronDown")}</span>` : "");
  d.firstChild.style.fontSize = "18px";
  side.appendChild(d);
  navEl[name] = d;
});
const subDefs = [["List", "List", 471], ["Add", "CirclePlus", 508], ["Assign", "UserRoundCheck", 544]];
const subEl = {};
subDefs.forEach(([name, icon, cy]) => {
  const d = document.createElement("div");
  d.className = "sub";
  d.style.top = cy - 18.5 + "px";
  d.innerHTML = `${ic(icon)}<span>${name}</span>`;
  d.firstChild.style.fontSize = "17px";
  side.appendChild(d);
  subEl[name] = d;
});
$("#kebab").innerHTML = ic("EllipsisVertical");
$("#ic_back").innerHTML = ic("ArrowLeft");
$("#ic_back2").innerHTML = ic("ArrowLeft");
$("#ic_bell1").innerHTML = ic("Bell").replace("<svg", '<svg style="fill:#60a5fa"');
$("#ic_bell2").innerHTML = ic("Bell").replace("<svg", '<svg style="fill:#60a5fa"');
$("#ic_plus1").innerHTML = ic("CirclePlus");
$("#ic_plus2").innerHTML = ic("CirclePlus");
$("#ic_search").innerHTML = ic("Search");
$("#ic_plus1").firstChild.style.fontSize = "17px";
$("#ic_plus2").firstChild.style.fontSize = "17px";
$("#ic_search").firstChild.style.fontSize = "19px";
$("#ic_search").firstChild.style.color = "#cfcfcf";

/* ---------- form ---------- */
const COLX = [0, 396, 792, 1189];
const ROWY = [0, 116, 204, 357];
const FIELDS = [
  { id: "type", label: "Asset Type", req: 1, col: 0, row: 0 },
  { id: "company", label: "Company Name", req: 1, col: 1, row: 0 },
  { id: "vendor", label: "Vendor Company Name", req: 1, col: 2, row: 0 },
  { id: "serial", label: "Serial Number", col: 3, row: 0, help: "Auto-generated" },
  { id: "mode", label: "Asset Code Mode", col: 0, row: 1 },
  { id: "cat", label: "Asset Category Code", col: 1, row: 1 },
  { id: "loc", label: "Location Code", col: 2, row: 1 },
  { id: "run", label: "Running No (NNN)", col: 3, row: 1 },
  { id: "assetno", label: "Asset Number", req: 1, col: 0, row: 2 },
  { id: "charger", label: "Charger Number", req: 1, col: 1, row: 2 },
  { id: "config", label: "Configuration (RAM, Storage, Processor, etc.)", req: 1, col: 2, row: 2, ta: 107 },
  { id: "purchase", label: "Purchase Date", req: 1, col: 3, row: 2, cal: 1 },
  { id: "wstart", label: "Warranty Start Date", req: 1, col: 0, row: 3, cal: 1 },
  { id: "wend", label: "Warranty End Date", req: 1, col: 1, row: 3, cal: 1 },
  { id: "notes", label: "Notes (optional)", col: 2, row: 3, ta: 106 },
];
const fgrid = $("#fgrid");
const F = {};
FIELDS.forEach((f) => {
  const d = document.createElement("div");
  d.className = "fld";
  d.style.left = COLX[f.col] + "px";
  d.style.top = ROWY[f.row] + "px";
  d.innerHTML =
    `<label${f.help ? ' style="margin-bottom:0"' : ""}>${f.label}${f.req ? "<i>*</i>" : ""}</label>` +
    (f.help ? `<div class="help">${f.help}</div>` : "") +
    `<div class="inp${f.ta ? " ta" : ""}" id="inp_${f.id}"${f.ta ? ` style="height:${f.ta}px"` : ""}></div>`;
  fgrid.appendChild(d);
  F[f.id] = { box: d, inp: d.querySelector(".inp"), cal: f.cal };
  F[f.id].inp.innerHTML = f.cal ? '<span class="txt"></span><span class="cal">' + ic("Calendar") + "</span>" : '<span class="txt"></span>';
});
F.type.inp.id = "sel";
const VAL = {
  type: "Laptop", company: "ABC Pvt. Ltd", vendor: "Senwell group", serial: "SN-LAP-1794806394349718", mode: "Auto", cat: "LTP", loc: "KHD", run: "1",
  assetno: "ASTLTPKHD001", charger: "SN029", config: "2 GB RAM\n16 GB Storage", purchase: "17-11-2026", wstart: "17-11-2026", wend: "16-11-2027", notes: "",
};
const OPTS = ["Select Asset Type", "Laptop", "Desktop", "Tablet", "Mobile", "Headphone", "Screen", "Keyboard", "Mouse", "Other"];
const dd = $("#dd");
OPTS.forEach((o, i) => {
  const d = document.createElement("div");
  d.textContent = o;
  if (i === 0) d.className = "ph";
  dd.appendChild(d);
});

/* ---------- list page ---------- */
const TAB_DEFS = [["Laptop", "Laptop"], ["Desktop", "Monitor"], ["Tablet", "Tablet"], ["Mobile", "Smartphone"], ["Headphone", "Headphones"], ["All Assets", "LayoutGrid"], ["Assigned Assets", "UserRoundCheck"]];
const tabsEl = $("#tabs");
const tabE = [];
TAB_DEFS.forEach(([n, icon]) => {
  const d = document.createElement("div");
  d.className = "tab";
  d.style.marginRight = "9px";
  tabsEl.appendChild(d);
  tabE.push({ el: d, n, icon });
});
const COLS = [
  ["#", 13, "n"], ["Company Name", 64, "company"], ["Serial Number", 229, "serial"], ["Asset Number", 467, "assetno"], ["Charger No.", 620, "charger"],
  ["Configuration", 757, "config"], ["Purchase Date", 971, "purchase"], ["Warranty Start", 1124, "wstart"], ["Warranty End", 1281, "wend"], ["Actions", 1429, "act"],
];
const ROWS = {
  hp: { company: "HP", serial: "SN-LAP-1779790782823848", assetno: "ASTLTPQLT001", charger: "01", config: "2GB Ram 256GB S", purchase: "06-May-2026", wstart: "06-May-2026", wend: "05-May-2027" },
  abc: { company: "ABC Pvt. Ltd", serial: "SN-LAP-1794806792028212", assetno: "ASTLTPKHD001", charger: "SN029", config: "2 GB RAM 16 GB Storage", purchase: "17-Nov-2026", wstart: "17-Nov-2026", wend: "16-Nov-2027" },
};
const tbl = $("#tbl");
let tblKey = "";
function renderTable(order, hiNew, sorted) {
  let h = `<div class="th">`;
  COLS.forEach(([n, x, k]) => {
    h += `<div class="td" style="left:${x}px">${n}${k !== "n" && k !== "act" ? `<span style="font-size:14px;color:${sorted && k === "company" ? "#bfdbfe" : "#7fb0f0"}">${ic("ArrowDownUp")}</span>` : ""}</div>`;
  });
  h += "</div>";
  order.forEach((key, i) => {
    const r = ROWS[key];
    h += `<div class="tr" id="row_${key}" style="top:${31 + i * 39}px;${hiNew && key === "abc" ? "background:rgba(96,165,250,.14)" : ""}">`;
    COLS.forEach(([n, x, k]) => {
      if (k === "n") h += `<div class="td" style="left:${x + 8}px">${i + 1}</div>`;
      else if (k === "act") h += `<div class="act2" style="left:1491px" id="${key}_edit">${ic("SquarePen")}</div><div class="act2" style="left:1527px" id="${key}_del">${ic("Trash2")}</div>`;
      else h += `<div class="td${k === "wend" ? " g" : ""}" style="left:${x}px">${r[k]}</div>`;
    });
    h += "</div>";
  });
  h += `<div class="foot" style="top:${31 + order.length * 39}px"><div style="position:absolute;left:14px;top:20px">Rows per page</div>
    <div style="position:absolute;left:118px;top:8px;width:82px;height:40px;border:1px solid #2a2a2a;border-radius:10px;background:#161616;color:#f1f1f1;font-weight:700;font-size:15px;line-height:38px;padding-left:12px">20</div>
    <div class="pg" style="left:1236px">${ic("ChevronsLeft")}</div><div class="pg" style="left:1280px">${ic("ChevronLeft")}</div>
    <div class="pg" style="left:1328px;background:#5aa1f7;color:#0b2a52;font-weight:700;font-size:14px">1</div>
    <div class="pg" style="left:1376px">${ic("ChevronRight")}</div><div class="pg" style="left:1420px">${ic("ChevronsRight")}</div>
    <div style="position:absolute;left:1480px;top:20px;color:#d6d6d6">Page 1 of 1</div></div>`;
  tbl.style.height = 31 + order.length * 39 + 57 + "px";
  tbl.innerHTML = h;
}
function renderTabs(added, activeIdx) {
  tabE.forEach((t, i) => {
    const count = [added ? 2 : 1, 0, 0, 0, 0, added ? 4 : 3, 2][i];
    t.el.className = "tab" + (i === activeIdx ? " on" : "");
    t.el.innerHTML = `${ic(t.icon)}<span>${t.n} (${count})</span>`;
  });
}

/* ---------- geometry (measured once, unzoomed) ---------- */
const P = {};
function rect(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}
function measure() {
  setForm(1);
  renderTabs(true, 0);
  renderTable(["hp", "abc"], false, false);
  $("#pageForm").style.opacity = 1;
  $("#pageList").style.opacity = 1;
  FIELDS.forEach((f) => (P["f." + f.id] = rect(F[f.id].inp)));
  P["f.save"] = rect($("#savebtn"));
  P["s.assets"] = rect(navEl["Assets"]);
  P["s.add"] = rect(subEl["Add"]);
  P["s.list"] = rect(subEl["List"]);
  P["s.sub"] = { x: 12, y: P["s.assets"].y, w: 259, h: 544 + 18.5 - P["s.assets"].y };
  P["dd"] = { x: 317, y: 198, w: 377, h: 312 };
  OPTS.forEach((o, i) => (P["dd." + i] = { x: 317, y: 198 + i * 31.1, w: 377, h: 31.1 }));
  tabE.forEach((t, i) => (P["t." + i] = rect(t.el)));
  P["tabs"] = { x: P["t.0"].x, y: P["t.0"].y, w: P["t.6"].x + P["t.6"].w - P["t.0"].x, h: 49 };
  P["search"] = rect($("#search"));
  P["row_abc"] = rect($("#row_abc"));
  const th = rect($("#tbl .th"));
  const cols = [...document.querySelectorAll("#tbl .th .td")].map(rect);
  P["th.company"] = cols[1];
  P["col.wend"] = { x: cols[8].x - 12, y: th.y, w: 170, h: 31 + 78 };
  renderTable(["abc", "hp"], false, true);
  P["abc_edit"] = rect($("#abc_edit"));
  P["abc_del"] = rect($("#abc_del"));
  P["actions"] = { x: P["abc_edit"].x - 14, y: th.y, w: 80, h: 109 };
  P["alert.ok"] = { x: 679 + 562 - 21 - 87, y: -8 + 184 - 19 - 46, w: 87, h: 46 };
}
const C = (id, fx = 0.5, fy = 0.5) => {
  const r = P[id];
  return [r.x + r.w * fx, r.y + r.h * fy];
};

/* ---------- state setters ---------- */
function setForm(p) {
  const h = lerp(67, 490, smoother(p));
  fgrid.style.height = h + "px";
  $("#fcard").style.height = 23 + h + 32 + 44 + 21 + "px";
  $("#savebtn").style.top = 23 + h + 32 + "px";
  FIELDS.forEach((f) => {
    if (f.id === "type") return;
    const u = smoother(clamp((p - f.row * 0.15) / 0.55));
    F[f.id].box.style.opacity = u;
    F[f.id].box.style.transform = `translateY(${(1 - u) * 16}px)`;
  });
  $("#savebtn").className = "btn " + (p > 0.9 ? "act" : "dis");
}
// realistic typing: each key takes a slightly different time, with small pauses after spaces, dots and line breaks
function keyTimes(text, cps, seed) {
  const times = [];
  let c = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    c += (1 / cps) * (0.7 + 0.6 * hash(i, seed)) + (ch === " " ? 0.05 : ch === "." ? 0.06 : ch === "\n" ? 0.32 : 0);
    times.push(c);
  }
  return times;
}
const KT = {};
function typed(id, text, t, t0, cps, seed) {
  if (!KT[id]) KT[id] = keyTimes(text, cps, seed);
  const kt = KT[id];
  let n = 0;
  while (n < kt.length && kt[n] <= t - t0) n++;
  return { text: text.slice(0, n), typing: t >= t0 && t - t0 <= (kt[kt.length - 1] || 0) + 0.7 };
}
const caretOn = (t) => (t * 2) % 1 < 0.6;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const cache = new Map();
function put(el, html) {
  if (cache.get(el) !== html) {
    el.innerHTML = html;
    cache.set(el, html);
  }
}
function setField(id, text, focused, typing, t) {
  const f = F[id];
  const cal = f.cal ? '<span class="cal">' + ic("Calendar") + "</span>" : "";
  const showCaret = focused && (typing || caretOn(t));
  put(f.inp, `<span class="txt">${esc(text)}${showCaret ? '<span class="caret"></span>' : ""}</span>${cal}`);
  f.inp.classList.toggle("focus", !!focused);
}

/* ---------- script (all times come from the narration) ---------- */
const T = {
  toForm: () => at(1, 3.2),
  selectLaptop: () => at(1, 12.0),
  expand: () => at(2, 1.2),
  toList: () => at(6, 7.4),
  alertIn: () => at(6, 4.3),
  alertOut: () => at(6, 7.0),
  saveClick: () => at(6, 2.9),
  addClick: () => at(1, 2.95),
  sortClick: () => at(7, 7.55),
  endCard: () => at(8, 0.1),
};
// cursor stops: it sits at a point until it must leave to arrive at the next one on time
let STOPS = [];
function buildStops() {
  const s = [];
  const k = (t, p) => s.push({ t, p });
  k(0, [1560, 760]);
  k(at(0, 1.2), C("s.assets", 0.38, 0.5));
  k(at(1, 2.85), C("s.add", 0.4, 0.5));
  k(at(1, 5.35), C("f.type", 0.55, 0.5));
  k(at(1, 6.65), C("dd.1", 0.45, 0.5));
  k(at(1, 7.6), C("dd.2", 0.45, 0.5));
  k(at(1, 8.4), C("dd.3", 0.45, 0.5));
  k(at(1, 9.1), C("dd.4", 0.45, 0.5));
  k(at(1, 9.8), C("dd.5", 0.45, 0.5));
  k(at(1, 11.0), C("dd.9", 0.45, 0.5));
  k(at(1, 11.9), C("dd.1", 0.45, 0.5));
  k(at(2, 3.75), C("f.company", 0.3, 0.5));
  k(at(2, 5.6), C("f.vendor", 0.3, 0.5));
  k(at(3, 0.4), C("f.serial", 0.8, 0.5));
  k(at(3, 3.9), C("f.mode", 0.6, 0.5));
  k(at(3, 5.15), C("f.cat", 0.6, 0.5));
  k(at(3, 6.35), C("f.loc", 0.6, 0.5));
  k(at(3, 7.55), C("f.run", 0.6, 0.5));
  k(at(3, 9.7), C("f.assetno", 0.85, 0.5));
  k(at(4, 0.3), C("f.charger", 0.3, 0.5));
  k(at(4, 2.35), C("f.config", 0.3, 0.3));
  k(at(5, 0.5), C("f.purchase", 0.3, 0.5));
  k(at(5, 1.95), C("f.wstart", 0.3, 0.5));
  k(at(5, 3.5), C("f.wend", 0.3, 0.5));
  k(at(6, 0.3), C("f.notes", 0.4, 0.4));
  k(at(6, 2.15), C("f.save", 0.5, 0.5));
  k(at(6, 6.4), C("alert.ok", 0.5, 0.5));
  k(at(7, 1.6), [900, 760]);
  [0, 1, 2, 3, 4, 5, 6].forEach((i, n) => k(at(7, 3.55 + n * 0.36), C("t." + i, 0.5, 0.5)));
  k(at(7, 6.45), C("search", 0.35, 0.5));
  k(at(7, 7.45), C("th.company", 0.4, 0.5));
  k(at(7, 9.25), C("abc_edit", 0.5, 0.5));
  k(at(7, 9.9), C("abc_del", 0.5, 0.5));
  k(at(7, 11.85), C("col.wend", 0.4, 0.8));
  k(at(7, 15.0), C("col.wend", 0.55, 0.9));
  STOPS = s;
}
const moveDur = (a, b) => clamp(0.26 + Math.hypot(b[0] - a[0], b[1] - a[1]) / 2400, 0.28, 0.62);
function cursorAt(t) {
  const s = STOPS;
  if (t <= s[0].t) return s[0].p;
  for (let i = 1; i < s.length; i++) {
    if (t <= s[i].t) {
      const p = s[i - 1], q = s[i];
      const dur = Math.min(moveDur(p.p, q.p), q.t - p.t);
      const t0 = q.t - dur;
      if (t <= t0) {
        // resting: a very small drift so the pointer is never perfectly still
        return [p.p[0] + Math.sin(t * 3.1) * 0.8, p.p[1] + Math.cos(t * 2.3) * 0.8];
      }
      const u = smoother((t - t0) / dur);
      const dx = q.p[0] - p.p[0], dy = q.p[1] - p.p[1];
      const dist = Math.hypot(dx, dy) || 1;
      const arc = Math.sin(Math.PI * u) * Math.min(38, dist * 0.07);
      return [p.p[0] + dx * u + (-dy / dist) * arc, p.p[1] + dy * u + (dx / dist) * arc];
    }
  }
  return s[s.length - 1].p;
}
const CLICKS = () => [
  at(1, 2.95), at(1, 6.0), at(1, 12.0), at(2, 3.9), at(2, 5.75), at(4, 0.45), at(4, 2.5), at(5, 0.65), at(5, 2.1), at(5, 3.65), at(6, 0.45), at(6, 2.9), at(6, 6.9),
  at(7, 6.55), at(7, 7.55),
];
const FOCUS = () => [
  ["company", at(2, 3.9), at(2, 5.75)], ["vendor", at(2, 5.75), at(3, 0.2)], ["charger", at(4, 0.45), at(4, 2.5)], ["config", at(4, 2.5), at(5, 0.5)],
  ["purchase", at(5, 0.65), at(5, 2.1)], ["wstart", at(5, 2.1), at(5, 3.65)], ["wend", at(5, 3.65), at(6, 0.45)], ["notes", at(6, 0.45), at(6, 2.9)],
];
const RINGS = () => [
  ["s.sub", at(0, 1.2), at(0, 9.2), 6], ["dd", at(1, 6.0), at(1, 11.95), 6],
  ["f.serial", at(3, 0.3), at(3, 2.9), 6], ["f.mode", at(3, 3.8), at(3, 5.0), 6], ["f.cat", at(3, 5.1), at(3, 6.3), 6], ["f.loc", at(3, 6.3), at(3, 7.4), 6], ["f.run", at(3, 7.5), at(3, 8.9), 6],
  ["f.assetno", at(3, 9.6), at(3, 12.4), 6], ["f.config", at(4, 2.8), at(4, 7.0), 6], ["f.purchase", at(5, 0.6), at(5, 1.95), 6], ["f.wstart", at(5, 2.0), at(5, 5.4), 6], ["f.wend", at(5, 3.6), at(5, 5.4), 6],
  ["f.save", at(6, 2.0), at(6, 3.0), 6],
  ["row_abc", at(7, 0.15), at(7, 1.5), 4], ["tabs", at(7, 3.5), at(7, 6.4), 6], ["search", at(7, 6.5), at(7, 7.5), 6], ["th.company", at(7, 7.45), at(7, 8.9), 8], ["actions", at(7, 9.3), at(7, 11.2), 6], ["col.wend", at(7, 11.8), at(7, 15.3), 6],
];
// camera: [time, scale, centre x, centre y]
let ZK = [];
function buildZoom() {
  const z = [];
  const k = (t, s, x, y) => z.push([t, s, x, y]);
  k(0, 1, 960, 540);
  k(at(0, 0.4), 1, 960, 540); k(at(0, 1.5), 1.5, 330, 480); k(at(1, 3.0), 1.5, 330, 480); k(at(1, 4.2), 1, 960, 540);
  k(at(1, 5.0), 1, 960, 540); k(at(1, 5.9), 1.4, 640, 360); k(at(1, 12.0), 1.4, 640, 360); k(at(2, 1.4), 1, 960, 540);
  k(at(2, 3.4), 1, 960, 540); k(at(2, 4.1), 1.25, 900, 290); k(at(2, 7.6), 1.25, 900, 290); k(at(3, 0.1), 1.4, 1450, 300);
  k(at(3, 3.2), 1.4, 1450, 300); k(at(3, 4.0), 1.4, 1100, 340); k(at(3, 8.6), 1.4, 1100, 340); k(at(3, 9.5), 1.45, 800, 420); k(at(3, 12.4), 1.45, 800, 420);
  k(at(4, 0.2), 1.4, 1000, 440); k(at(4, 7.6), 1.4, 1000, 440);
  k(at(5, 0.2), 1.4, 1100, 520); k(at(5, 5.6), 1.4, 1100, 520);
  k(at(6, 0.2), 1.3, 1450, 580); k(at(6, 3.2), 1.3, 1450, 580); k(at(6, 4.0), 1, 960, 540);
  k(at(7, 0.6), 1, 960, 540); k(at(7, 3.3), 1, 960, 540); k(at(7, 4.1), 1.35, 760, 200); k(at(7, 6.3), 1.35, 760, 200); k(at(7, 6.6), 1.3, 760, 300); k(at(7, 8.7), 1.3, 760, 300);
  k(at(7, 9.3), 1.5, 1500, 380); k(at(7, 15.3), 1.5, 1500, 380); k(at(8, 0.3), 1, 960, 540);
  ZK = z;
}
function zoomAt(t) {
  if (t <= ZK[0][0]) return ZK[0].slice(1);
  for (let i = 1; i < ZK.length; i++) {
    if (t <= ZK[i][0]) {
      const p = ZK[i - 1], q = ZK[i];
      const u = smoother(clamp((t - p[0]) / (q[0] - p[0])));
      return [lerp(p[1], q[1], u), lerp(p[2], q[2], u), lerp(p[3], q[3], u)];
    }
  }
  return ZK[ZK.length - 1].slice(1);
}

function camAt(t) {
  if (window.__nozoom) return [1, 960, 540];
  const [sc, x, y] = zoomAt(t);
  return [sc, clamp(x, 960 / sc, 1920 - 960 / sc), clamp(y, 540 / sc, 1080 - 540 / sc)];
}

/* ---------- rings ---------- */
const ringsEl = $("#rings");
let ringDefs = [];
function buildRings() {
  ringDefs = RINGS();
  ringDefs.forEach((r) => {
    const d = document.createElement("div");
    d.className = "ring";
    const p = P[r[0]];
    const pad = r[3];
    d.style.left = p.x - pad + "px";
    d.style.top = p.y - pad + "px";
    d.style.width = p.w + pad * 2 + "px";
    d.style.height = p.h + pad * 2 + "px";
    ringsEl.appendChild(d);
    r.push(d);
  });
}
const pill = (el, u) => {
  el.style.background = `rgba(31,44,61,${u})`;
  el.style.borderColor = `rgba(44,74,115,${u})`;
  el.style.borderLeftColor = `rgba(96,165,250,${u})`;
  el.style.color = u > 0.5 ? "#fff" : "#e6e6e6";
};
// latest click within `win` seconds before t -> 0..1 press strength (1 at the click)
const pressAt = (t, clicks, win = 0.2) => {
  let u = 0;
  for (const c of clicks) if (t >= c && t < c + win) u = Math.max(u, 1 - (t - c) / win);
  return u;
};

/* ---------- main apply ---------- */
function apply(t) {
  const toForm = T.toForm(), toList = T.toList();
  const cf = smoother(prog(t, toForm - 0.1, toForm + 0.45));
  const cl = smoother(prog(t, toList - 0.1, toList + 0.7));
  const formOp = t < toForm ? 0 : t < toList ? cf : 1 - cl;
  const listOp = t < toForm ? 1 - cf : t < toList ? 0 : cl;
  $("#pageForm").style.opacity = formOp;
  $("#pageForm").style.transform = `translateY(${(1 - (t < toList ? cf : 1)) * 14}px)`;
  $("#pageList").style.opacity = listOp;
  $("#pageList").style.transform = `translateY(${t >= toList ? (1 - cl) * 14 : 0}px)`;

  // sidebar pills
  const addU = t < T.addClick() ? 0 : t < toList ? smoother(prog(t, T.addClick(), T.addClick() + 0.3)) : 1 - smoother(prog(t, toList, toList + 0.3));
  pill(subEl["Add"], addU);
  pill(subEl["List"], 1 - addU);
  const clicks = CLICKS();
  subEl["Add"].style.transform = `scale(${1 - 0.03 * pressAt(t, [T.addClick()])})`;

  // form expand + select
  const exp = prog(t, T.expand(), T.expand() + 1.3);
  setForm(exp);
  const picked = t >= T.selectLaptop();
  const ddOpen = t >= at(1, 6.0) && t < T.selectLaptop() + 0.06;
  const focusType = t >= at(1, 6.0) && t < T.selectLaptop() + 0.1;
  put(F.type.inp, `<span class="txt">${picked ? "Laptop" : "Select Asset Type"}</span>`);
  F.type.inp.style.color = picked ? "#f3f3f3" : "#cfcfcf";
  F.type.inp.classList.toggle("focus", focusType);
  const ddIn = smoother(prog(t, at(1, 6.0), at(1, 6.25)));
  dd.style.display = ddOpen ? "block" : "none";
  dd.style.opacity = ddIn;
  dd.style.transform = `translateY(${(1 - ddIn) * -6}px)`;
  if (ddOpen) {
    const [, cy] = cursorAt(t);
    const idx = clamp(Math.floor((cy - 198) / 31.1), 0, 9);
    [...dd.children].forEach((c, i) => c.classList.toggle("hi", i === idx && i > 0));
  }

  // focus + typed text
  const foc = FOCUS();
  const focusId = (() => {
    for (const [id, t0, t1] of foc) if (t >= t0 && t < t1) return id;
    return null;
  })();
  const ty = (id, t0, cps, seed) => typed(id, VAL[id], t, t0, cps, seed);
  let r;
  r = ty("company", at(2, 4.0), 7.5, 1); setField("company", r.text, focusId === "company", r.typing, t);
  r = ty("vendor", at(2, 5.9), 7.5, 2); setField("vendor", r.text, focusId === "vendor", r.typing, t);
  setField("serial", VAL.serial, false, false, t);
  setField("mode", VAL.mode, false, false, t);
  setField("cat", VAL.cat, false, false, t);
  setField("loc", VAL.loc, false, false, t);
  setField("run", VAL.run, false, false, t);
  r = ty("assetno", at(3, 10.5), 11, 3); setField("assetno", r.text, false, false, t);
  r = ty("charger", at(4, 0.6), 7.5, 4); setField("charger", r.text, focusId === "charger", r.typing, t);
  r = ty("config", at(4, 2.9), 8.5, 5); setField("config", r.text, focusId === "config", r.typing, t);
  r = ty("purchase", at(5, 0.8), 9, 6); setField("purchase", r.text, focusId === "purchase", r.typing, t);
  r = ty("wstart", at(5, 2.25), 9, 7); setField("wstart", r.text, focusId === "wstart", r.typing, t);
  r = ty("wend", at(5, 3.8), 9, 8); setField("wend", r.text, focusId === "wend", r.typing, t);
  setField("notes", "", focusId === "notes", false, t);

  // save button states
  const sb = $("#savebtn");
  const hoverSave = t >= at(6, 2.2) && t < T.saveClick();
  const pressedSave = t >= T.saveClick() && t < T.saveClick() + 0.15;
  const submitting = t >= T.saveClick() + 0.15 && t < toList;
  sb.textContent = submitting ? "Submitting…" : "Save Asset";
  sb.style.background = submitting ? "#1a1a1a" : hoverSave || pressedSave ? "#27405f" : "";
  sb.style.color = submitting ? "#5b6b7d" : "";
  sb.style.transform = pressedSave ? "scale(.94)" : hoverSave ? "scale(1.03)" : "scale(1)";
  sb.style.boxShadow = hoverSave && !pressedSave ? "0 0 0 3px rgba(96,165,250,.25)" : "none";

  // alert
  const aIn = smoother(prog(t, T.alertIn(), T.alertIn() + 0.4));
  const aOut = smoother(prog(t, T.alertOut(), T.alertOut() + 0.3));
  const alertOp = aIn * (1 - aOut);
  $("#alert").style.opacity = alertOp;
  $("#alert").style.transform = `translateY(${(1 - aIn) * -22 + aOut * -12}px) scale(${0.94 + 0.06 * aIn})`;
  $("#dim").style.opacity = 0.55 * alertOp;
  const okPressed = t >= at(6, 6.9) && t < at(6, 7.0);
  $("#alert .ok").style.transform = okPressed ? "scale(.92)" : "scale(1)";

  // list state
  const added = t >= toList;
  const searchText = (() => {
    const s0 = at(7, 6.75);
    if (t < s0) return "";
    const n = [0.12, 0.26, 0.4].filter((k) => t - s0 >= k).length;
    if (t < at(7, 7.25)) return "ABC".slice(0, n);
    const b = [0, 0.09, 0.18].filter((k) => t - at(7, 7.25) >= k).length;
    return "ABC".slice(0, 3 - b);
  })();
  const filtered = searchText === "ABC";
  const sorted = t >= T.sortClick() + 0.05;
  const hiNew = t >= at(7, 0.15) && t < at(7, 1.5) && Math.floor((t - at(7, 0.15)) * 3) % 2 === 0;
  const key = [added, filtered, sorted, hiNew].join("|");
  if (key !== tblKey) {
    tblKey = key;
    let order = sorted ? ["abc", "hp"] : ["hp", "abc"];
    if (!added) order = ["hp"];
    else if (filtered) order = ["abc"];
    renderTabs(added, 0);
    renderTable(order, hiNew && added, sorted && added);
    $("#chip").textContent = (added ? 2 : 1) + " Records";
  }
  const sFocus = t >= at(7, 6.55) && t < at(7, 7.5);
  put($("#searchtxt"), searchText ? `<span style="color:#f1f1f1">${esc(searchText)}</span>${caretOn(t) ? '<span class="caret"></span>' : ""}` : sFocus && caretOn(t) ? '<span class="caret"></span>' : "Search assets");
  $("#search").style.borderColor = sFocus ? "#3b82f6" : "#2a2a2a";
  if (t >= at(7, 3.4) && t < at(7, 6.4)) {
    const [cx2, cy2] = cursorAt(t);
    tabE.forEach((tb, i) => {
      const r2 = P["t." + i];
      const over = cx2 >= r2.x && cx2 <= r2.x + r2.w && cy2 >= r2.y && cy2 <= r2.y + r2.h;
      if (i !== 0) tb.el.style.background = over ? "#242d38" : "";
    });
  } else tabE.forEach((tb, i) => i !== 0 && (tb.el.style.background = ""));
  // edit / delete hover
  const [hx, hy] = cursorAt(t);
  ["abc_edit", "abc_del"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rr = P[id];
    const over = t >= at(7, 9.2) && t < at(7, 11.4) && hx >= rr.x && hx <= rr.x + rr.w && hy >= rr.y && hy <= rr.y + rr.h;
    el.style.background = over ? "#2b4f7e" : "";
    el.style.transform = over ? "scale(1.12)" : "";
  });

  // rings
  ringDefs.forEach((rd) => {
    const [, t0, t1, , el] = rd;
    const a2 = Math.min(prog(t, t0, t0 + 0.3), 1 - prog(t, t1 - 0.3, t1));
    el.style.opacity = a2 * (0.75 + 0.25 * Math.sin(t * 4));
    el.style.transform = `scale(${0.985 + 0.015 * smoother(prog(t, t0, t0 + 0.3))})`;
  });

  // camera (with a gentle push when the intro hands over to the app)
  let [s, cx, cy] = camAt(t);
  const introOut = prog(t, INTRO - 0.55, INTRO + 0.35);
  s *= 1 + 0.045 * (1 - smoother(introOut));
  $("#app").style.transform = `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`;
  $("#app").style.opacity = smoother(prog(t, INTRO - 0.55, INTRO + 0.3));

  // cursor + ripple
  const [px, py] = cursorAt(t);
  const stageX = 960 + (px - cx) * s, stageY = 540 + (py - cy) * s;
  const cur = $("#cursor");
  const endT = T.endCard();
  const cpress = pressAt(t, clicks, 0.16);
  cur.style.transform = `translate(${stageX - 3}px, ${stageY - 2}px) scale(${1 - 0.14 * cpress})`;
  const showCur = t > INTRO + 0.1 && t < endT + 0.5;
  cur.style.opacity = showCur ? Math.min(prog(t, INTRO + 0.1, INTRO + 0.5), 1 - prog(t, endT, endT + 0.5)) : 0;
  let rp = 0, rx = 0, ry = 0;
  for (const ct of clicks) {
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

  // end card
  const ec = smoother(prog(t, endT, endT + 0.9));
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
}

/* ---------- boot ---------- */
async function boot() {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
  measure();
  buildStops();
  buildZoom();
  buildRings();
  window.__apply = apply;
  window.__total = TOTAL;
  window.__starts = S;
  window.__meta = {
    intro: INTRO, total: TOTAL, clicks: CLICKS(), toForm: T.toForm(), toList: T.toList(), alertIn: T.alertIn(), alertOut: T.alertOut(), endCard: T.endCard(),
    sceneStarts: S.map((x) => x + LEAD),
  };
  window.__ready = true;
  apply(0);
}
boot();
