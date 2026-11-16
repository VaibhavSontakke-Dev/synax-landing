/* Deterministic director: apply(t) draws the whole video for time t (seconds). No CSS transitions, no timers.
   Scenes (one narration clip each): 0 cartoon, 1 Synax reveal, 2 module overview, 3-8 adding an asset (a six-step wizard),
   9 asset list, 10 assigning, 11 benefits, 12 end card.
   Nothing here copies a portal screen: the screenshots were only a reference for which fields, labels, steps and data exist. */
const $ = (s, r = document) => r.querySelector(s);
const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[n] || ""}</svg>`;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, u) => a + (b - a) * u;
const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10);
const eo = (u) => 1 - Math.pow(1 - u, 3);
const back = (u) => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2);
const prog = (t, a, b) => clamp((t - a) / (b - a));
const hash = (k, seed = 1) => {
  const x = Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const cache = new Map();
function put(el, html) {
  if (cache.get(el) !== html) {
    el.innerHTML = html;
    cache.set(el, html);
  }
}
const tf = (el, x, y, s = 1, o = 1) => {
  el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${s.toFixed(4)})`;
  el.style.opacity = clamp(o).toFixed(3);
};
const show = (el, on, disp = "block") => (el.style.display = on ? disp : "none");
const caretOn = (t) => (t * 2) % 1 < 0.6;

/* ---------- timing ---------- */
const LEAD = 0.2; // narration starts this long after a scene starts
const GAPEND = 0.55; // quiet after each narration clip
const D = DUR.map((d) => LEAD + d + GAPEND);
D[1] += 0.5; // a little air before the module overview
const S = [0];
D.forEach((d, i) => S.push(S[i] + d));
const TOTAL = S[D.length] + 0.4;
const at = (i, r) => S[i] + LEAD + r; // r = seconds after the narration of scene i starts
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
function W(i, word, nth = 0, off = 0) {
  const ws = WORDS[i].filter((x) => norm(x.w) === norm(word));
  if (!ws.length) throw new Error("word not found: " + i + " " + word);
  return at(i, ws[Math.min(nth, ws.length - 1)].t + off);
}
const REV = S[1]; // reveal starts
const APP = S[2]; // module overview starts

/* ---------- script: every time below comes from a spoken word ---------- */
const T = {
  menuIn: APP - 0.35,
  menuLinks: W(2, "Assets", 0, -0.1),
  menuTiles: [W(2, "List", 0, -0.15), W(2, "Add", 0, -0.15), W(2, "Assign", 0, -0.15)],
  curOn: at(3, 0.5),
  modHover: W(3, "Assets", 0, -0.05),
  addClick: W(3, "Add", 1, 0.08),
  cardOpen: W(3, "Add", 1, 0.3),
  typeWords: ["laptop", "desktop", "tablet", "mobile", "headphone", "more"].map((w) => W(3, w, 0, -0.08)),
  pick: W(3, "more", 0, 0.7),
  // step k starts (0 type, 1 details, 2 codes, 3 specs, 4 dates, 5 save); step 6 = done
  st: [W(3, "Add", 1, 0.3), W(4, "form", 0, -0.25), at(5, -0.15), at(6, -0.15), at(7, -0.15), at(8, -0.15)],
  companyClick: W(4, "Enter", 0, 0.15),
  vendorClick: W(4, "vendor", 0, -0.3),
  gen: [W(5, "serial", 0, -0.15), W(5, "asset", 0, -0.15)],
  genGlow: W(5, "automatically", 0, -0.1),
  chargerClick: W(6, "charger", 0, -0.05),
  chips: [W(6, "RAM", 0, -0.1), W(6, "storage", 0, -0.1), W(6, "processor", 0, -0.1), W(6, "so", 0, -0.1)],
  dates: [W(7, "purchase", 0, -0.1), W(7, "warranty", 0, -0.15), W(7, "warranty", 0, 0.1)],
  tlFill: W(7, "period", 0, -0.2),
  shield: W(7, "ends", 0, -0.2),
  notesClick: W(8, "notes", 0, 0.05),
  saveClick: W(8, "Save", 0, 0.08),
  success: W(8, "Synax", 0, -0.15),
  toList: S[9] - 0.3,
  land: W(9, "land", 0, 0.05),
  grouped: W(9, "grouped", 0, -0.1),
  counts: W(9, "counts", 0, 0),
  searchClick: W(9, "Search", 0, -0.35),
  searchType: W(9, "Search", 0, -0.05),
  // the filtered result stays up while the voice says "sort by any column", then the search clears and the column is sorted
  searchClear: W(9, "column", 0, -0.35),
  sortClick: W(9, "column", 0, 0.15),
  edit: W(9, "edit", 0, -0.05),
  del: W(9, "delete", 0, -0.05),
  warranty: W(9, "Warranty", 0, -0.1),
  assignClick: W(10, "Assign", 0, 0.05),
  assignedClick: W(10, "tab", 0, 0.1),
  bene: at(11, 0.0),
  curOff: at(11, 0.3),
  endCard: at(12, 0.1),
};
T.flyStart = T.assignClick + 0.5;
T.flyEnd = T.flyStart + 0.75;
T.assignDone = T.flyEnd + 0.1;
T.empOut = T.assignedClick - 0.55;

/* ---------- typing ---------- */
function keyTimes(text, cps, seed) {
  const times = [];
  let c = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    c += (1 / cps) * (0.7 + 0.6 * hash(i, seed)) + (ch === " " ? 0.05 : ch === "." ? 0.06 : 0);
    times.push(c);
  }
  return times;
}
const TY = {};
const KEYS = [];
function defType(id, text, t0, cps, seed) {
  TY[id] = { text, t0, kt: keyTimes(text, cps, seed) };
  TY[id].kt.forEach((k) => KEYS.push(t0 + k));
}
function typedAt(id, t) {
  const y = TY[id];
  let n = 0;
  while (n < y.kt.length && y.kt[n] <= t - y.t0) n++;
  return y.text.slice(0, n);
}
defType("company", "ABC Ltd", T.companyClick + 0.12, 15, 1);
defType("vendor", "Senwell group", T.vendorClick + 0.25, 12, 2);
defType("charger", "SN029", T.chargerClick + 0.3, 7, 3);
defType("search", "ABC", T.searchType, 9, 4);
function setInput(el, text, focused, t, ph = "") {
  const car = focused && caretOn(t) ? '<span class="caret"></span>' : "";
  put(el, text ? esc(text) + car : car + (ph ? `<span class="ph">${esc(ph)}</span>` : ""));
  el.classList.toggle("focus", !!focused);
}

/* ---------- data (fictional, consistent across scenes) ---------- */
const SERIAL = "SN-LAP-1794806792028212";
const ROWS = {
  nw: { icon: "Laptop", no: "ASTLTPLON001", co: "ABC Ltd", sn: SERIAL, cfg: "16 GB RAM · 512 GB SSD", pd: "17-Nov-2026", we: "16-Nov-2027", who: ["EC", "Emma Clarke", "#7c3aed"] },
  hp: { icon: "Laptop", no: "ASTLTPQLT001", co: "HP", sn: "SN-LAP-1779790782823848", cfg: "8 GB RAM · 256 GB SSD", pd: "06-May-2026", we: "05-May-2027", who: ["LM", "Lucas Martin", "#0ea5e9"] },
  dsk: { icon: "Monitor", no: "ASTDSKLON001", co: "Dell", sn: "SN-DSK-1781204455019834", cfg: "16 GB RAM · 1 TB HDD", pd: "12-Jan-2026", we: "11-Jan-2028", who: null },
  mob: { icon: "Smartphone", no: "ASTMOBLON001", co: "Samsung", sn: "SN-MOB-1783377610245517", cfg: "8 GB · 128 GB", pd: "03-Mar-2026", we: "02-Mar-2027", who: ["SR", "Sofia Rossi", "#14b8a6"] },
};
const COLS = [["Asset", 20], ["Company", 330], ["Serial Number", 540], ["Configuration", 880], ["Purchase", 1130], ["Warranty End", 1290], ["Actions", 1446]];
const VIEWS = [
  [-1, ["hp", "dsk", "mob"], false],
  [T.land, ["nw", "hp", "dsk", "mob"], false],
  [T.searchType + 0.5, ["nw"], false],
  [T.searchClear + 0.2, ["nw", "hp", "dsk", "mob"], false],
  [T.sortClick + 0.05, ["dsk", "mob", "hp", "nw"], false],
  [T.assignedClick + 0.05, ["mob", "hp", "nw"], true],
];
const ROW0 = 370, ROWH = 76;
const PILLS = [["Laptop", "Laptop"], ["Desktop", "Monitor"], ["Tablet", "Tablet"], ["Mobile", "Smartphone"], ["Headphone", "Headphones"], ["All assets", "LayoutGrid"], ["Assigned assets", "UserRoundCheck"]];

/* ---------- build ---------- */
const E = {};
const rcEl = [];
let linkEl = [];
const RT = {
  logo: W(1, "Meet", 0, -0.1), eyebrow: W(1, "Meet", 0, 0.05), title: W(1, "Smarter", 0, -0.12), control: W(1, "complete", 0, -0.08),
  panel: W(1, "Register", 0, -0.2), snap: W(1, "Register", 0, 0.05),
  pills: [W(1, "Register", 0, -0.05), W(1, "assign", 0, -0.05), W(1, "track", 0, -0.05)],
  linksL: W(1, "assign", 0, 0.1), linksR: W(1, "track", 0, 0.1), pulse: W(1, "organised", 0, -0.1),
};
const RCARDS = [
  ["Laptop", "Asset Number", "ASTLTPLON001"], ["Calendar", "Warranty End", "16-Nov-2027"], ["Box", "Vendor Company", "Senwell group"], ["Hash", "Charger Number", "SN029"],
  ["Laptop", "Asset Number", "ASTLTPQLT001"], ["UserRoundCheck", "Assigned Assets", "3 allocated"], ["Calendar", "Purchase Date", "17-Nov-2026"], ["Search", "Serial Number", "SN-LAP-1794806…"],
];
const RROWS = [400, 525, 650, 775];
const HUB = { kpi: [4, 3, 2], bars: [["Laptop", 2], ["Desktop", 1], ["Mobile", 1], ["Tablet", 0], ["Headphone", 0]] };

function build() {
  // reveal
  $("#rpills").innerHTML = [["CirclePlus", "Register"], ["UserRoundCheck", "Assign"], ["List", "Track"]]
    .map(([i, n], k) => (k ? `<span class="rarr" id="rarr${k}">${ic("ArrowRight")}</span>` : "") + `<div class="rpill" id="rpill${k}">${ic(i)}<span>${n}</span></div>`).join("");
  let svg = "";
  RCARDS.forEach(([i, k, v], n) => {
    const d = document.createElement("div");
    d.className = "rc";
    d.innerHTML = `<div class="ri">${ic(i)}</div><div><div class="rk">${k}</div><div class="rv">${v}</div></div>`;
    $("#rcards").appendChild(d);
    const left = n < 4, row = n % 4;
    rcEl.push({ el: d, fx: left ? 70 : 1520, fy: RROWS[row], sx: 140 + hash(n, 11) * 1310, sy: 130 + hash(n, 12) * 760, sr: (hash(n, 13) - 0.5) * 56, ss: 0.82 + hash(n, 14) * 0.16, left });
    const y = RROWS[row] + 48, x1 = left ? 400 : 1520, x2 = left ? 518 : 1402;
    svg += `<path id="rl${n}" d="M${x1},${y} L${x2},${y}" stroke="#60a5fa" stroke-width="2.5" fill="none" stroke-dasharray="118" stroke-dashoffset="118"/><circle id="rd${n}" r="5" cx="${x1}" cy="${y}" fill="#93c5fd" opacity="0"/>`;
  });
  $("#rlinks").innerHTML = svg;
  linkEl = RCARDS.map((_, n) => [document.getElementById("rl" + n), document.getElementById("rd" + n)]);
  $("#hub .hic").innerHTML = ic("Box");
  $("#hbars").innerHTML = HUB.bars.map(([n], k) => `<div class="hbar"><div class="b" id="hb${k}"></div><div class="l">${n}</div></div>`).join("");

  // module overview
  $("#mod .mi").innerHTML = ic("Box");
  [["List", "List", "All your assets, by type"], ["CirclePlus", "Add", "Register a new asset"], ["UserRoundCheck", "Assign", "Hand it to an employee"]].forEach(([i, h, p], k) => {
    const d = document.createElement("div");
    d.className = "tile mtile";
    d.id = "mt" + k;
    d.style.left = 210 + k * 540 + "px";
    d.innerHTML = `<div class="ti">${ic(i)}</div><h3>${h}</h3><p>${p}</p>`;
    $("#menu").appendChild(d);
  });
  $("#mlinks").innerHTML = [0, 1, 2].map((k) => {
    const x2 = 420 + k * 540;
    return `<path id="ml${k}" d="M960,270 C960,370 ${x2},370 ${x2},470" stroke="#60a5fa" stroke-width="3" fill="none" stroke-dasharray="620" stroke-dashoffset="620" opacity=".8"/>`;
  }).join("");

  // wizard
  const steps = ["Type", "Details", "Codes", "Specs", "Dates", "Save"];
  let sh = "";
  steps.forEach((n, k) => {
    if (k) sh += `<div class="sline" style="left:${(k - 1) * 118 + 78}px;width:72px"><i id="sl${k}"></i></div>`;
    sh += `<div class="stp" id="sp${k}" style="left:${k * 118}px"><div class="d">${k + 1}</div><div class="n">${n}</div></div>`;
  });
  $("#steps").innerHTML = sh;
  [["Laptop", "Laptop"], ["Monitor", "Desktop"], ["Tablet", "Tablet"], ["Smartphone", "Mobile"], ["Headphones", "Headphone"], ["LayoutGrid", "More"]].forEach(([i, n], k) => {
    const d = document.createElement("div");
    d.className = "typ";
    d.id = "ty" + k;
    d.style.left = 80 + k * 196 + "px";
    d.innerHTML = `<div class="ti">${ic(i)}</div><div class="tn">${n}</div><div class="chk">${ic("Check")}</div>`;
    $("#st0").appendChild(d);
  });
  $("#selchip").innerHTML = `${ic("Laptop")}Laptop${ic("Check")}`;
  [["Hash", "Serial Number", SERIAL], ["Box", "Asset Number", "ASTLTPLON001"]].forEach(([i, k, v], n) => {
    $("#g" + n).innerHTML = `<div class="gi">${ic(i)}</div><div><div class="k">${k}</div><div class="v">${v}</div></div><span class="auto">${ic("Check")}Auto-generated</span><div class="gsh"></div>`;
  });
  [0, 1, 2].forEach((k) => ($("#d" + k + " .di").innerHTML = ic("Calendar")));
  $("#shield .si").innerHTML = ic("ShieldCheck");
  $("#pv .pic").innerHTML = ic("Laptop");
  // success sparks
  $("#sparks").innerHTML = Array.from({ length: 14 }, (_, k) => `<div class="spark" id="sk${k}" style="background:${["#22c55e", "#3b82f6", "#a78bfa", "#38bdf8"][k % 4]}"></div>`).join("");
  $("#sno").innerHTML = `${ic("Laptop")}ASTLTPLON001`;

  // list
  $("#ladd").innerHTML = `${ic("CirclePlus")}Add Asset`;
  $("#lassign").innerHTML = `${ic("UserRoundCheck")}Assign Asset`;
  $("#lsearch").innerHTML = `${ic("Search")}<span id="sq"></span>`;
  $("#lpills").innerHTML = PILLS.map(([n, i], k) => `<div class="lp" id="lp${k}">${ic(i)}<span>${n}</span><span class="c" id="lc${k}">0</span></div>`).join("");
  $("#lhead").innerHTML = COLS.map(([n, x], k) => `<div class="hc" id="hc${k}" style="left:${x}px">${k === 3 ? '<span id="hcfg">Configuration</span>' : n}${k >= 1 && k <= 5 ? ic("ArrowDownUp") : ""}</div>`).join("");
  $("#lrows").innerHTML = Object.entries(ROWS).map(([key, r]) => {
    const who = r.who ? `<div class="av" style="background:${r.who[2]}">${r.who[0]}</div>${r.who[1]}` : `<span style="color:#9aabc6">Not assigned</span>`;
    return `<div class="row" id="row_${key}">
      <div class="cell" style="left:20px"><div class="aic">${ic(r.icon)}</div>${r.no}</div>
      <div class="cell" style="left:330px">${esc(r.co)}</div>
      <div class="cell mut" style="left:540px">${r.sn}</div>
      <div class="cell mut" id="cfg_${key}" style="left:880px;font-size:18px">${r.cfg}</div>
      <div class="cell" id="who_${key}" style="left:880px;font-size:18px;opacity:0">${who}</div>
      <div class="cell mut" style="left:1130px">${r.pd}</div>
      <div class="cell" style="left:1290px"><span class="wb" id="wb_${key}">${r.we}</span></div>
      <div class="act" id="ed_${key}" style="left:1446px">${ic("SquarePen")}<div class="tip">Edit</div></div>
      <div class="act del" id="dl_${key}" style="left:1492px">${ic("Trash2")}<div class="tip">Delete</div></div>
    </div>`;
  }).join("");
  $("#ests").innerHTML = `${ic("UserRoundCheck")}<span>Assigning ASTLTPLON001…</span>`;
  $("#fly").innerHTML = `<div class="aic">${ic("Laptop")}</div>ASTLTPLON001`;

  // benefits
  $("#bcards").innerHTML = [
    ["Eye", "Full visibility", "Every asset in one searchable list, grouped by type"],
    ["UserRoundCheck", "Clear ownership", "Assign assets and see what is allocated"],
    ["ShieldCheck", "Warranty in view", "Purchase and warranty dates on every record"],
  ].map(([i, h, p], k) => `<div class="bc" id="bc${k}"><div class="bi">${ic(i)}</div><h3>${h}</h3><p>${p}</p></div>`).join("");
}

/* ---------- geometry (measured once, untransformed) ---------- */
const P = {};
function rect(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}
const C = (id, fx = 0.5, fy = 0.5) => {
  const r = P[id];
  if (!r) throw new Error("no rect " + id);
  return [r.x + r.w * fx, r.y + r.h * fy];
};
function measure() {
  ["#menu", "#card", "#list", "#emp"].forEach((s) => ($(s).style.display = "block"));
  $("#menu").style.opacity = 1;
  for (let k = 0; k < 6; k++) $("#st" + k).style.display = "block";
  // configuration chips: laid out from their measured widths (needs the step to be displayed)
  let cx = 80, cy = 212;
  [0, 1, 2, 3].forEach((k) => {
    const c = $("#c" + k);
    c.style.left = "0px";
    const w = c.offsetWidth;
    if (cx + w > 840) {
      cx = 80;
      cy += 78;
    }
    c.style.left = cx + "px";
    c.style.top = cy + "px";
    cx += w + 16;
  });
  P.mod = rect($("#mod"));
  [0, 1, 2].forEach((k) => (P["mt" + k] = rect($("#mt" + k))));
  for (let k = 0; k < 6; k++) P["ty" + k] = rect($("#ty" + k));
  ["i_company", "i_vendor", "g0", "g1", "i_charger", "notes", "save", "shield", "tl"].forEach((id) => (P[id] = rect(document.getElementById(id))));
  [0, 1, 2, 3].forEach((k) => (P["c" + k] = rect($("#c" + k))));
  [0, 1, 2].forEach((k) => (P["d" + k] = rect($("#d" + k))));
  P.search = rect($("#lsearch"));
  P.ladd = rect($("#ladd"));
  P.lassign = rect($("#lassign"));
  PILLS.forEach((_, k) => (P["lp" + k] = rect($("#lp" + k))));
  P.hcPurchase = rect($("#hc4"));
  P.emp = rect($("#emp"));
  P.list = rect($("#list"));
  for (let k = 0; k < 6; k++) $("#st" + k).style.display = "none";
  ["#menu", "#card", "#list", "#emp"].forEach((s) => ($(s).style.display = "none"));
}
// a row's on-screen rectangle when it sits at index i of the table
const rowRect = (i) => ({ x: P.list.x + 30, y: P.list.y + ROW0 + i * ROWH, w: P.list.w - 60, h: 66 });
const rowPt = (i, dx, fy = 0.5) => { const r = rowRect(i); return [r.x + dx, r.y + r.h * fy]; };

/* ---------- cursor ---------- */
let STOPS = [];
let CLICKS = [];
function buildStops() {
  const s = [];
  const k = (t, p, click, sel) => {
    s.push({ t, p, sel });
    if (click) CLICKS.push(t + 0.06);
  };
  k(0, [1500, 980]);
  k(T.curOn, [1380, 900]);
  k(T.modHover, C("mod", 0.5, 0.55), 0, "#mod");
  k(T.addClick - 0.06, C("mt1", 0.5, 0.45), 1, "#mt1");
  T.typeWords.forEach((tw, n) => k(tw + 0.05, C("ty" + n, 0.5, 0.55), 0, "#ty" + n));
  k(T.pick - 0.06, C("ty0", 0.55, 0.5), 1, "#ty0");
  k(T.companyClick - 0.06, C("i_company", 0.3, 0.5), 1, "#i_company");
  k(T.vendorClick - 0.06, C("i_vendor", 0.3, 0.5), 1, "#i_vendor");
  T.gen.forEach((tg, n) => k(tg + 0.45, C("g" + n, 0.78, 0.62), 0, "#g" + n));
  k(T.chargerClick - 0.06, C("i_charger", 0.3, 0.5), 1, "#i_charger");
  T.chips.forEach((tc, n) => k(tc + 0.3, C("c" + n, 0.6, 0.6), 0, "#c" + n));
  k(T.dates[0] + 0.3, C("d0", 0.6, 0.6), 0, "#d0");
  k(T.dates[2] + 0.3, C("d2", 0.6, 0.6), 0, "#d2");
  k(T.shield + 0.1, C("shield", 0.82, 0.55), 0, "#shield");
  k(T.notesClick - 0.06, C("notes", 0.3, 0.4), 1, "#notes");
  k(T.saveClick - 0.06, C("save", 0.5, 0.5), 1, "#save");
  k(T.success + 0.6, [1380, 860]);
  k(T.land + 0.35, rowPt(0, 760, 0.6), 0, "#row_nw");
  k(T.grouped + 0.05, C("lp0", 0.5, 0.55), 0, "#lp0");
  k(T.searchClick - 0.06, C("search", 0.3, 0.5), 1, "#lsearch");
  k(T.sortClick - 0.06, C("hcPurchase", 0.4, 0.5), 1, "#hc4");
  k(T.edit, rowPt(3, 1446 + 20, 0.5), 0, "#ed_nw");
  k(T.del, rowPt(3, 1492 + 20, 0.5), 0, "#dl_nw");
  k(T.warranty + 0.05, rowPt(3, 1290 + 70, 0.55), 0, "#wb_nw");
  k(T.assignClick - 0.06, C("lassign", 0.5, 0.5), 1, "#lassign");
  k(T.flyEnd + 0.3, C("emp", 0.75, 0.75), 0, "#emp");
  k(T.assignedClick - 0.06, C("lp6", 0.5, 0.5), 1, "#lp6");
  k(T.curOff, C("lp6", 0.55, 0.62));
  STOPS = s.sort((a, b) => a.t - b.t);
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
      if (t <= t0) return [p.p[0] + Math.sin(t * 3.1) * 0.8, p.p[1] + Math.cos(t * 2.3) * 0.8];
      const u = smoother((t - t0) / dur);
      const dx = q.p[0] - p.p[0], dy = q.p[1] - p.p[1];
      const dist = Math.hypot(dx, dy) || 1;
      const arc = Math.sin(Math.PI * u) * Math.min(38, dist * 0.07);
      return [p.p[0] + dx * u + (-dy / dist) * arc, p.p[1] + dy * u + (dx / dist) * arc];
    }
  }
  return s[s.length - 1].p;
}
const pressAt = (t, clicks, w = 0.2) => {
  let u = 0;
  for (const c of clicks) if (t >= c && t < c + w) u = Math.max(u, 1 - (t - c) / w);
  return u;
};
const over = (t, id) => {
  const [x, y] = cursorAt(t);
  const r = P[id];
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
};
const overR = (t, r) => {
  const [x, y] = cursorAt(t);
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
};

/* ---------- scenes ---------- */
const pulseAt = (t) => (t < RT.pulse ? 0 : 0.5 + 0.5 * Math.sin((t - RT.pulse) * 4.5));
function applyBackdrop(t) {
  show($("#bg"), t > REV - 0.5);
  $("#bggrid").style.opacity = 0.9 * smoother(prog(t, REV - 0.3, REV + 0.8));
  $("#bgglow").style.opacity = 0.55 + 0.35 * Math.pow(Math.sin(t * 0.8), 2);
  tf($("#orb1"), 160 + Math.sin(t * 0.21) * 120, 120 + Math.cos(t * 0.17) * 80, 1, 0.5);
  tf($("#orb2"), 1480 + Math.cos(t * 0.19) * 120, 700 + Math.sin(t * 0.23) * 90, 1, 0.45);
}

function applyReveal(t) {
  const vis = t > REV - 0.5 && t < APP + 0.4;
  show($("#rev"), vis);
  if (!vis) return;
  const out = smoother(prog(t, APP - 0.85, APP - 0.15));
  const lg = smoother(prog(t, RT.logo, RT.logo + 0.6));
  $("#rlogo").style.opacity = lg * (1 - out);
  $("#rlogo").style.transform = `translateX(-50%) translateY(${(1 - lg) * 18 - out * 30}px) scale(${0.94 + 0.06 * lg})`;
  const sw = prog(t, RT.logo + 0.6, RT.logo + 1.2);
  $("#rsheen").style.opacity = sw > 0 && sw < 1 ? 0.9 : 0;
  $("#rsheen").style.left = -120 + sw * 460 + "px";
  const ey = smoother(prog(t, RT.eyebrow, RT.eyebrow + 0.5));
  $("#reye").style.opacity = ey * (1 - out);
  $("#reye").style.letterSpacing = 16 - 6 * ey + "px";
  const t1 = smoother(prog(t, RT.title, RT.title + 0.55)), t2 = smoother(prog(t, RT.control, RT.control + 0.55));
  $("#rt1").style.transform = `translateY(${(1 - t1) * 110}%)`;
  $("#rt2").style.transform = `translateY(${(1 - t2) * 110}%)`;
  $("#rtitle").style.opacity = 1 - out;
  $("#rtitle").style.transform = `translateY(${-out * 30}px)`;
  RT.pills.forEach((pt, k) => {
    const u = prog(t, pt, pt + 0.45);
    const p = $("#rpill" + k);
    p.style.opacity = smoother(u) * (1 - out);
    p.style.transform = `scale(${0.7 + 0.3 * eo(u)})`;
    p.classList.toggle("on", t >= pt + 0.2 && t < (RT.pills[k + 1] || RT.pulse) + 0.2);
    if (k) $("#rarr" + k).style.opacity = smoother(prog(t, pt - 0.2, pt + 0.2)) * (1 - out);
  });
  $("#rpills").style.transform = `translateY(${-out * 24}px)`;
  // the hub: an illustrated overview that fills in as the voice says "register, assign, track"
  const pop = eo(prog(t, RT.panel, RT.panel + 0.6));
  const hub = $("#hub");
  hub.style.opacity = t < RT.panel ? 0 : pop * (1 - out);
  hub.style.transform = `translateY(${(1 - pop) * 30 + Math.sin(t * 1.5) * 5}px) scale(${(0.86 + 0.14 * pop) * (1 + 0.1 * out)})`;
  hub.style.boxShadow = `0 40px 110px rgba(0,0,0,.55), 0 0 0 2px rgba(96,165,250,.35), 0 0 90px rgba(59,130,246,${(0.25 + 0.3 * pulseAt(t)).toFixed(2)})`;
  HUB.kpi.forEach((v, k) => put($("#hk" + k), String(Math.round(v * eo(prog(t, RT.panel + 0.3 + k * 0.15, RT.panel + 1.3 + k * 0.15))))));
  HUB.bars.forEach(([, v], k) => {
    const u = back(prog(t, RT.linksL + k * 0.12, RT.linksL + 0.6 + k * 0.12));
    $("#hb" + k).style.height = Math.max(6, (v / 2) * 96 * clamp(u, 0, 1.2)) + "px";
  });
  // scattered cards burst out of the cartoon, drift, then snap into order beside the hub
  rcEl.forEach((c, n) => {
    const burst = eo(prog(t, REV - 0.25 + n * 0.03, REV + 0.75 + n * 0.03));
    const snap = smoother(prog(t, RT.snap + n * 0.06, RT.snap + 0.85 + n * 0.06));
    const drift = 1 - snap;
    const sx = lerp(960 - 165, c.sx, burst) + Math.sin(t * 1.3 + n) * 18 * drift;
    const sy = lerp(560, c.sy, burst) + Math.cos(t * 1.1 + n * 2) * 14 * drift;
    const x = lerp(sx, c.fx, snap), y = lerp(sy, c.fy, snap);
    const r = lerp(c.sr + Math.sin(t * 0.9 + n) * 4, 0, snap), sc = lerp(c.ss * (0.4 + 0.6 * burst), 1, snap);
    c.el.style.transform = `translate(${x + out * (c.left ? 60 : -60)}px, ${y}px) rotate(${r}deg) scale(${sc * (1 - 0.15 * out)})`;
    c.el.style.opacity = Math.min(1, burst * 1.4) * (1 - out);
    c.el.classList.toggle("ok", snap > 0.55);
    const [ln, dot] = linkEl[n];
    const lt = c.left ? RT.linksL : RT.linksR;
    const du = smoother(prog(t, lt + (n % 4) * 0.12, lt + 0.5 + (n % 4) * 0.12));
    ln.setAttribute("stroke-dashoffset", (118 * (1 - du)).toFixed(1));
    ln.style.opacity = 1 - out;
    const ph = du >= 1 ? ((t - lt) * 0.9 + n * 0.23) % 1 : 0;
    const x1 = c.left ? 400 : 1520, x2 = c.left ? 518 : 1402;
    dot.setAttribute("cx", (x1 + (x2 - x1) * ph).toFixed(1));
    dot.setAttribute("opacity", du >= 1 ? (Math.sin(Math.PI * ph) * (1 - out)).toFixed(2) : 0);
  });
}

function applyMenu(t) {
  const vis = t > T.menuIn - 0.05 && t < T.cardOpen + 0.7;
  show($("#menu"), vis);
  if (!vis) return;
  const out = smoother(prog(t, T.addClick + 0.12, T.addClick + 0.55));
  const mIn = prog(t, T.menuIn, T.menuIn + 0.6);
  const mod = $("#mod");
  tf(mod, 0, (1 - eo(mIn)) * 40 - out * 30, 0.9 + 0.1 * back(mIn), smoother(mIn) * (1 - out));
  mod.classList.toggle("hot", t > T.modHover - 0.05 && t < T.addClick - 0.3);
  [0, 1, 2].forEach((k) => {
    const d = smoother(prog(t, T.menuLinks + k * 0.15, T.menuLinks + 0.7 + k * 0.15));
    const l = $("#ml" + k);
    l.setAttribute("stroke-dashoffset", (620 * (1 - d)).toFixed(1));
    l.style.opacity = 0.8 * (1 - out);
    const u = prog(t, T.menuTiles[k], T.menuTiles[k] + 0.55);
    const el = $("#mt" + k);
    const isAdd = k === 1;
    const press = isAdd ? pressAt(t, [T.addClick], 0.25) : 0;
    const o = smoother(u) * (isAdd ? 1 - smoother(prog(t, T.cardOpen - 0.05, T.cardOpen + 0.3)) : 1 - out);
    const drop = isAdd ? 0 : out * 60;
    tf(el, 0, (1 - eo(u)) * 60 + drop, (0.85 + 0.15 * back(u)) * (1 - 0.05 * press) * (isAdd ? 1 + 0.08 * out : 1), o);
    const spoken = t > T.menuTiles[k] + 0.1 && t < T.menuTiles[k] + 1.9;
    const hover = isAdd && t > T.addClick - 0.45 && t < T.addClick + 0.3;
    el.classList.toggle("hot", spoken || hover);
  });
}

function applyCard(t) {
  const card = $("#card");
  const vis = t > T.cardOpen - 0.15 && t < T.toList + 0.7;
  show(card, vis);
  if (!vis) return;
  const open = prog(t, T.cardOpen - 0.1, T.cardOpen + 0.5);
  const away = smoother(prog(t, T.toList, T.toList + 0.6));
  // flies toward the top row of the list as it shrinks
  const r0 = rowRect(0);
  const tx = away * (r0.x + r0.w / 2 - (310 + 650)), ty = away * (r0.y + 33 - (140 + 480));
  card.style.transform = `translate(${tx}px,${ty}px) scale(${((0.35 + 0.65 * back(open)) * (1 - 0.75 * away)).toFixed(4)})`;
  card.style.opacity = (smoother(prog(t, T.cardOpen - 0.1, T.cardOpen + 0.2)) * (1 - smoother(prog(t, T.toList + 0.25, T.toList + 0.6)))).toFixed(3);

  // stepper
  const done = t >= T.success;
  let cur = 0;
  T.st.forEach((s, k) => t >= s && (cur = k));
  for (let k = 0; k < 6; k++) {
    const el = $("#sp" + k);
    el.className = "stp" + (done || k < cur ? " done" : k === cur ? " on" : "");
    put(el.firstChild, done || k < cur ? ic("Check") : String(k + 1));
    if (k) $("#sl" + k).style.width = (done || k <= cur ? 100 * smoother(prog(t, T.st[k] - 0.1, T.st[k] + 0.4)) : 0) + "%";
  }
  const hideHead = smoother(prog(t, T.success - 0.1, T.success + 0.3));
  ["#steps", "#cdiv", "#card .ct", "#card .cs"].forEach((s) => ($(s).style.opacity = 1 - hideHead));

  // step panels slide in from the right and out to the left
  for (let k = 0; k < 6; k++) {
    const a = T.st[k], b = k < 5 ? T.st[k + 1] : T.success;
    const el = $("#st" + k);
    const on = t >= a - 0.01 && t < b + 0.42;
    show(el, on);
    if (!on) continue;
    const inU = k === 0 ? 1 : smoother(prog(t, a, a + 0.42));
    const outU = smoother(prog(t, b, b + 0.4));
    tf(el, (1 - inU) * 70 - outU * 70, 0, 1, inU * (1 - outU));
  }
  stepType(t);
  stepDetails(t);
  stepCodes(t);
  stepSpecs(t);
  stepDates(t);
  stepSave(t);
  preview(t, hideHead);
  successAnim(t);
}

function stepType(t) {
  if (t > T.st[1] + 0.5) return;
  for (let k = 0; k < 6; k++) {
    const el = $("#ty" + k);
    const u = prog(t, T.cardOpen + 0.15 + k * 0.06, T.cardOpen + 0.6 + k * 0.06);
    const hot = t >= T.typeWords[k] && t < (T.typeWords[k + 1] || T.pick - 0.25);
    const sel = k === 0 && t >= T.pick;
    const press = k === 0 ? pressAt(t, [T.pick], 0.22) : 0;
    el.className = "typ" + (sel ? " sel" : hot ? " hot" : "");
    tf(el, 0, (1 - eo(u)) * 40 - (hot ? 8 : 0), (0.9 + 0.1 * back(u)) * (hot ? 1.05 : 1) * (1 - 0.05 * press), smoother(u) * (t >= T.pick && k ? 0.55 : 1));
    if (k === 0) {
      const c = back(prog(t, T.pick, T.pick + 0.35));
      tf(el.querySelector(".chk"), 0, 0, 0.4 + 0.6 * c, t >= T.pick ? 1 : 0);
    }
  }
}
function stepDetails(t) {
  if (t < T.st[1] - 0.1 || t > T.st[2] + 0.5) return;
  const c = back(prog(t, T.st[1] + 0.2, T.st[1] + 0.6));
  tf($("#selchip"), 0, 0, 0.8 + 0.2 * c, smoother(prog(t, T.st[1] + 0.2, T.st[1] + 0.45)));
  setInput($("#i_company"), typedAt("company", t), t >= T.companyClick && t < T.vendorClick, t, "Company name");
  setInput($("#i_vendor"), typedAt("vendor", t), t >= T.vendorClick && t < T.st[2], t, "Vendor company name");
}
// codes step, as a concept only: the serial number and the asset number simply appear, marked as generated automatically
function stepCodes(t) {
  if (t < T.st[2] - 0.1 || t > T.st[3] + 0.5) return;
  T.gen.forEach((tg, k) => {
    const el = $("#g" + k);
    const u = prog(t, tg, tg + 0.5);
    tf(el, 0, (1 - eo(u)) * 30, 0.92 + 0.08 * back(u), smoother(u));
    // a light sweep across the card as its value appears
    const sw = prog(t, tg + 0.2, tg + 0.9);
    const sh = el.querySelector(".gsh");
    sh.style.opacity = sw > 0 && sw < 1 ? 0.85 : 0;
    sh.style.left = -160 + sw * 980 + "px";
    const glow = t >= T.genGlow ? 0.5 + 0.5 * Math.sin((t - T.genGlow) * 5) : 0;
    el.style.boxShadow = `0 0 0 ${(5 * glow).toFixed(1)}px rgba(59,130,246,.18), 0 0 ${(40 * glow).toFixed(0)}px rgba(96,165,250,${(0.45 * glow).toFixed(2)})`;
  });
}
function stepSpecs(t) {
  if (t < T.st[3] - 0.1 || t > T.st[4] + 0.5) return;
  setInput($("#i_charger"), typedAt("charger", t), t >= T.chargerClick && t < T.chips[0], t, "Charger number");
  T.chips.forEach((tc, k) => {
    const u = prog(t, tc, tc + 0.4);
    tf($("#c" + k), 0, (1 - eo(u)) * 20, 0.7 + 0.3 * back(u), smoother(u));
  });
}
function stepDates(t) {
  if (t < T.st[4] - 0.1 || t > T.st[5] + 0.5) return;
  T.dates.forEach((td, k) => {
    const u = prog(t, td, td + 0.45);
    tf($("#d" + k), 0, (1 - eo(u)) * 30, 0.9 + 0.1 * back(u), smoother(u));
  });
  const tl = smoother(prog(t, T.tlFill - 0.3, T.tlFill));
  tf($("#tl"), 0, (1 - tl) * 20, 1, tl);
  const f = smoother(prog(t, T.tlFill, T.tlFill + 1.4));
  $("#tlf").style.width = 736 * f + "px";
  $("#tld2").style.transform = `scale(${1 + 0.25 * Math.sin(Math.PI * prog(t, T.tlFill + 1.3, T.tlFill + 1.7))})`;
  const sh = prog(t, T.shield, T.shield + 0.45);
  tf($("#shield"), 0, (1 - eo(sh)) * 20, 0.85 + 0.15 * back(sh), smoother(sh));
}
function stepSave(t) {
  if (t < T.st[5] - 0.1 || t > T.success + 0.5) return;
  setInput($("#notes"), "", t >= T.notesClick && t < T.saveClick - 0.3, t, "Add a note (optional)");
  const sb = $("#save");
  const hover = t > T.saveClick - 0.4 && t < T.saveClick;
  const saving = t >= T.saveClick + 0.15;
  put(sb, saving ? `<div class="spin" style="transform:rotate(${((t * 400) % 360).toFixed(0)}deg)"></div>Saving…` : `${ic("Check")}Save Asset`);
  const press = pressAt(t, [T.saveClick], 0.2);
  sb.style.transform = `scale(${((hover ? 1.04 : 1) * (1 - 0.06 * press)).toFixed(3)})`;
  sb.style.boxShadow = hover ? "0 12px 26px rgba(37,99,235,.35), 0 0 0 6px rgba(59,130,246,.22)" : "";
}
function preview(t, hideHead) {
  const pv = $("#pv");
  const u = prog(t, T.st[1], T.st[1] + 0.5);
  show(pv, u > 0 && hideHead < 1);
  tf(pv, (1 - eo(u)) * 40, 0, 1, smoother(u) * (1 - hideHead));
  if (t < T.st[1]) return;
  const val = (el, v, t0) => {
    put(el, v ? esc(v) : "—");
    el.className = "v" + (v ? "" : " e");
    el.parentElement.classList.toggle("fresh", t0 != null && t >= t0 && t < t0 + 0.9);
  };
  put($("#pvn"), "Laptop");
  val($("#pv0"), typedAt("company", t), t < TY.company.t0 + 1.4 ? TY.company.t0 : null);
  val($("#pv1"), typedAt("vendor", t), t < TY.vendor.t0 + 1.5 ? TY.vendor.t0 : null);
  const an = t >= T.gen[1] + 0.5 ? "ASTLTPLON001" : "";
  val($("#pv2"), an, T.gen[1] + 0.5);
  const cfg = ["16 GB", "512 GB", "Core i5"].filter((_, k) => t >= T.chips[k] + 0.2).join(" · ");
  val($("#pv3"), cfg, t >= T.chips[0] + 0.2 ? T.chips[[0, 1, 2].filter((k) => t >= T.chips[k] + 0.2).pop()] + 0.2 : null);
  val($("#pv4"), t >= T.tlFill + 1.4 ? "Until 16 Nov 2027" : "", T.tlFill + 1.4);
}
function successAnim(t) {
  const el = $("#succ");
  const on = t >= T.success;
  show(el, on, "flex");
  if (!on) return;
  const u = prog(t, T.success, T.success + 0.5);
  tf($("#scirc"), 0, 0, 0.3 + 0.7 * back(u), smoother(prog(t, T.success, T.success + 0.2)));
  $("#schk").setAttribute("stroke-dashoffset", (22 * (1 - smoother(prog(t, T.success + 0.25, T.success + 0.6)))).toFixed(1));
  const r = prog(t, T.success + 0.1, T.success + 0.9);
  $("#sring").style.opacity = r > 0 && r < 1 ? 0.8 * (1 - r) : 0;
  $("#sring").style.transform = `scale(${0.8 + r * 1.6})`;
  const tx = prog(t, T.success + 0.35, T.success + 0.8);
  tf($("#stxt"), 0, (1 - eo(tx)) * 24, 1, smoother(tx));
  const tn = prog(t, T.success + 0.55, T.success + 1.0);
  tf($("#sno"), 0, (1 - eo(tn)) * 24, 0.9 + 0.1 * back(tn), smoother(tn));
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * Math.PI * 2 + hash(k, 21) * 0.4;
    const p = eo(prog(t, T.success + 0.15, T.success + 1.1));
    const d = 120 + p * (130 + hash(k, 22) * 90);
    const e = $("#sk" + k);
    e.style.left = 650 + Math.cos(a) * d - 7 + "px";
    e.style.top = 300 + Math.sin(a) * d - 7 + "px";
    e.style.opacity = t > T.success + 0.15 ? (1 - prog(t, T.success + 0.6, T.success + 1.3)).toFixed(2) : 0;
    e.style.transform = `rotate(${(k * 40 + p * 180).toFixed(0)}deg) scale(${(1 - 0.5 * p).toFixed(2)})`;
  }
}

function viewAt(t) {
  let v = 0;
  VIEWS.forEach((w, k) => t >= w[0] && (v = k));
  return v;
}
function applyList(t) {
  const list = $("#list");
  const vis = t > T.toList + 0.05 && t < T.endCard + 1;
  show(list, vis);
  if (!vis) return;
  const u = prog(t, T.toList + 0.1, T.toList + 0.7);
  tf(list, 0, (1 - eo(u)) * 50, 0.96 + 0.04 * eo(u), smoother(u));
  // counts: the new laptop lands, then the assignment
  const landed = t >= T.land + 0.3, assigned = t >= T.assignDone;
  const counts = [landed ? 2 : 1, 1, 0, 1, 0, landed ? 4 : 3, assigned ? 3 : 2];
  const bumps = [T.land + 0.3, -9, -9, -9, -9, T.land + 0.3, T.assignDone];
  const assignedView = t >= T.assignedClick;
  PILLS.forEach((_, k) => {
    const el = $("#lp" + k);
    put($("#lc" + k), String(counts[k]));
    const b = Math.sin(Math.PI * prog(t, bumps[k], bumps[k] + 0.35));
    $("#lc" + k).style.transform = `scale(${(1 + 0.35 * b).toFixed(3)})`;
    const active = assignedView ? k === 6 : k === 5;
    const glow = (t >= T.grouped + k * 0.12 && t < T.counts + 1.0) || (k === 6 && t > T.assignedClick - 0.45 && t < T.assignedClick);
    el.className = "lp" + (active ? " on" : "") + (glow && !active ? " glow" : "");
    el.style.transform = `scale(${(1 - 0.05 * (k === 6 ? pressAt(t, [T.assignedClick], 0.2) : 0)).toFixed(3)})`;
  });
  put($("#lcount"), `${counts[5]} records`);
  // search
  const typing = t >= T.searchType && t < T.searchClear;
  let q = typing ? typedAt("search", t) : "";
  if (t >= T.searchClear && t < T.searchClear + 0.3) q = "ABC".slice(0, 3 - Math.floor((t - T.searchClear) / 0.09));
  const sf = t >= T.searchClick && t < T.searchClear + 0.4;
  put($("#sq"), q ? `<span class="q">${esc(q)}</span>${sf && caretOn(t) ? '<span class="caret"></span>' : ""}` : sf && caretOn(t) ? '<span class="caret"></span>' : "Search assets");
  $("#lsearch").classList.toggle("focus", sf);
  // header
  $("#hc4").classList.toggle("sorted", t >= T.sortClick);
  $("#hc4").style.transform = `scale(${(1 - 0.06 * pressAt(t, [T.sortClick], 0.2)).toFixed(3)})`;
  const av = smoother(prog(t, T.assignedClick, T.assignedClick + 0.4));
  put($("#hcfg"), av > 0.5 ? "Assigned to" : "Configuration");
  // rows move between views
  const v = viewAt(t);
  const [tv, order, asg] = VIEWS[v];
  const [, prevOrder] = VIEWS[Math.max(0, v - 1)];
  const mv = smoother(prog(t, tv, tv + 0.45));
  Object.keys(ROWS).forEach((key) => {
    const el = $("#row_" + key);
    const i1 = order.indexOf(key), i0 = v ? prevOrder.indexOf(key) : i1;
    let y, o, x = 0;
    if (i1 >= 0 && i0 >= 0) { y = lerp(i0, i1, mv); o = 1; }
    else if (i1 >= 0) { y = i1; o = mv; x = key === "nw" && v === 1 ? 0 : (1 - mv) * 40; if (key === "nw" && v === 1) y = i1 - (1 - mv) * 0.6; }
    else if (i0 >= 0) { y = i0; o = 1 - mv; x = -mv * 40; }
    else { y = 0; o = 0; }
    el.style.display = o > 0.001 ? "block" : "none";
    el.style.top = ROW0 + y * ROWH + "px";
    el.style.transform = `translateX(${x.toFixed(1)}px)`;
    el.style.opacity = o.toFixed(3);
    const hl = key === "nw" && ((t >= T.land && t < T.land + 2.2) || (t >= T.assignDone - 0.1 && t < T.assignDone + 1.2));
    el.classList.toggle("hl", hl);
    // assigned view swaps the configuration column for the person who has the asset
    $("#cfg_" + key).style.opacity = (1 - av).toFixed(3);
    $("#who_" + key).style.opacity = av.toFixed(3);
    const wg = t >= T.warranty && t < T.warranty + 2.4 ? 0.5 + 0.5 * Math.sin((t - T.warranty) * 6) : 0;
    $("#wb_" + key).style.boxShadow = wg ? `0 0 0 ${(4 * wg).toFixed(1)}px rgba(34,197,94,.25)` : "none";
    $("#wb_" + key).style.transform = `scale(${(1 + 0.05 * wg).toFixed(3)})`;
    // edit / delete hover (only on rows that are shown)
    const idx = order.indexOf(key);
    ["ed_", "dl_"].forEach((p, n) => {
      const a = $("#" + p + key);
      const r = rowRect(Math.max(0, idx));
      const hov = idx >= 0 && mv >= 1 && overR(t, { x: r.x + (n ? 1492 : 1446), y: r.y + 13, w: 40, h: 40 }) && t > T.edit - 0.5 && t < T.warranty;
      a.classList.toggle("hov", hov);
      a.querySelector(".tip").style.display = hov ? "block" : "none";
    });
  });
  // buttons
  const ab = $("#lassign");
  const hovA = t > T.assignClick - 0.4 && t < T.assignClick + 0.15;
  ab.style.transform = `scale(${((hovA ? 1.04 : 1) * (1 - 0.06 * pressAt(t, [T.assignClick], 0.2))).toFixed(3)})`;
  ab.style.boxShadow = hovA ? "0 12px 26px rgba(22,163,74,.3), 0 0 0 6px rgba(34,197,94,.22)" : "";
  // assigning: dim the list, a person card appears, the asset flies to them
  const dimU = Math.min(smoother(prog(t, T.assignClick + 0.15, T.assignClick + 0.5)), 1 - smoother(prog(t, T.empOut, T.empOut + 0.35)));
  show($("#adim"), dimU > 0);
  $("#adim").style.opacity = dimU;
  const emp = $("#emp");
  const eu = prog(t, T.assignClick + 0.3, T.assignClick + 0.75);
  const eOut = smoother(prog(t, T.empOut, T.empOut + 0.35));
  show(emp, eu > 0 && eOut < 1);
  tf(emp, 0, (1 - eo(eu)) * 40 + eOut * 20, (0.9 + 0.1 * back(eu)) * (1 + 0.06 * Math.sin(Math.PI * prog(t, T.flyEnd, T.flyEnd + 0.35))), smoother(eu) * (1 - eOut));
  const ok = t >= T.assignDone;
  $("#ests").className = "es" + (ok ? " ok" : "");
  put($("#ests span"), ok ? "ASTLTPLON001 assigned" : "Assigning ASTLTPLON001…");
  const fly = $("#fly");
  const fu = prog(t, T.flyStart, T.flyEnd);
  show(fly, fu > 0 && fu < 1, "flex");
  if (fu > 0 && fu < 1) {
    const idx = order.indexOf("nw");
    const a = rowPt(Math.max(0, idx), 20, 0.5), b = [P.emp.x + 72, P.emp.y + 76];
    const e2 = smoother(fu);
    const x = lerp(a[0], b[0], e2), y = lerp(a[1], b[1], e2) - Math.sin(Math.PI * e2) * 160;
    tf(fly, x - 30, y - 28, 1 - 0.35 * smoother(prog(fu, 0.7, 1)), Math.min(1, fu * 6) * (1 - smoother(prog(fu, 0.85, 1))));
  }
}

function applyBenefits(t) {
  const b = $("#bene");
  const inU = smoother(prog(t, T.bene - 0.1, T.bene + 0.6));
  b.style.display = inU > 0 ? "flex" : "none";
  if (!inU) return;
  b.style.opacity = inU;
  $("#bhead").style.transform = `translateY(${(1 - inU) * 20}px)`;
  BT.cards.forEach((ct, k) => {
    const u = prog(t, ct, ct + 0.5);
    const e = $("#bc" + k);
    e.style.opacity = smoother(u);
    e.style.transform = `translateY(${(1 - eo(u)) * 40}px) scale(${0.92 + 0.08 * eo(u)})`;
  });
}
const BT = { head: T.bene, cards: [W(11, "see", 0, -0.1), W(11, "who", 0, -0.1), W(11, "warranty", 0, -0.1)] };

/* ---------- main apply ---------- */
function apply(t) {
  applyBackdrop(t);
  applyReveal(t);
  applyMenu(t);
  applyCard(t);
  applyList(t);
  applyBenefits(t);

  // cursor + click ripple
  const [px, py] = cursorAt(t);
  const cur = $("#cursor");
  const cpress = pressAt(t, CLICKS, 0.16);
  cur.style.transform = `translate(${px - 3}px, ${py - 2}px) scale(${1 - 0.14 * cpress})`;
  cur.style.opacity = t > T.curOn && t < T.curOff + 0.5 ? Math.min(prog(t, T.curOn, T.curOn + 0.4), 1 - prog(t, T.curOff, T.curOff + 0.5)) : 0;
  let rp = 0, rx = 0, ry = 0;
  for (const ct of CLICKS) {
    if (t >= ct && t < ct + 0.45) {
      rp = (t - ct) / 0.45;
      [rx, ry] = cursorAt(ct);
    }
  }
  const rip = $("#ripple");
  rip.style.opacity = rp ? 0.9 * (1 - rp) : 0;
  rip.style.transform = `translate(${rx}px, ${ry}px) scale(${0.35 + eo(rp) * 1.5})`;

  // end card
  const ec = smoother(prog(t, T.endCard, T.endCard + 0.9));
  $("#end").style.opacity = ec;
  $("#end").style.transform = `scale(${1.03 - 0.03 * ec})`;

  // opening cartoon, then a quick zoom-blur into the reveal
  const toonOut = smoother(prog(t, REV - 0.35, REV + 0.45));
  const toonEl = $("#toon");
  toonEl.style.opacity = t < REV + 0.5 ? 1 - toonOut : 0;
  toonEl.style.display = t < REV + 0.5 ? "block" : "none";
  toonEl.style.transform = `scale(${1 + 0.12 * toonOut})`;
  toonEl.style.filter = toonOut > 0 ? `blur(${10 * toonOut}px)` : "none";
  if (t < REV + 0.5) Toon.apply(t);
  $("#fade0").style.opacity = 1 - smoother(prog(t, 0, 0.6));
}

/* ---------- boot ---------- */
async function boot() {
  try {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
    Toon.build($("#toon"));
    build();
    measure();
    buildStops();
    window.__apply = apply;
    window.__total = TOTAL;
    window.__starts = S;
    window.__P = P;
    window.__T = T;
    window.__stops = STOPS;
    window.__meta = {
      rev: REV, app: APP, reveal: RT, toon: Toon.times, bene: BT, total: TOTAL, clicks: CLICKS, keys: KEYS.sort((a, b) => a - b),
      menuTiles: T.menuTiles, toForm: T.cardOpen - 0.1, toList: T.toList, alertIn: T.success, steps: T.st.slice(1), gen: T.gen,
      chips: T.chips, dates: T.dates, shield: T.shield, fly: [T.flyStart, T.flyEnd], assignDone: T.assignDone, land: T.land, endCard: T.endCard,
      sceneStarts: S.map((x) => x + LEAD).slice(0, DUR.length),
    };
    window.__ready = true;
    apply(0);
  } catch (e) {
    window.__err = e.stack || String(e);
  }
}
boot();
