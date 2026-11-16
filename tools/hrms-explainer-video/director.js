/* Deterministic director for the HRMS explainer: apply(t) draws the whole video for time t (seconds). No CSS transitions.
   Scenes (one narration clip each): 0 cartoon, 1 Synax reveal, 2 overview, 3-10 eight HRMS areas (each: a cartoon problem
   vignette, a circular wipe, then the Synax solution), 11 benefits, 12 end card.
   Nothing copies a portal screen: the screenshots were only a reference for which areas, fields and steps exist. */
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
// pop an element in at t0 (scale with a little overshoot, slide up)
const pop = (el, t, t0, dy = 30, d = 0.45) => {
  const u = prog(t, t0, t0 + d);
  tf(el, 0, (1 - eo(u)) * dy, 0.88 + 0.12 * back(u), smoother(prog(t, t0, t0 + d * 0.6)));
  return u;
};

/* ---------- timing ---------- */
const LEAD = 0.2, GAPEND = 0.55;
const D = DUR.map((d) => LEAD + d + GAPEND);
D[1] += 0.5;
const S = [0];
D.forEach((d, i) => S.push(S[i] + d));
const TOTAL = S[D.length] + 0.4;
const at = (i, r) => S[i] + LEAD + r;
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
function W(i, word, nth = 0, off = 0) {
  const ws = WORDS[i].filter((x) => norm(x.w) === norm(word));
  if (!ws.length) throw new Error("word not found: " + i + " " + word);
  return at(i, ws[Math.min(nth, ws.length - 1)].t + off);
}
const REV = S[1], APP = S[2];
const SFX = []; // [time, sound, gain] for sound.js
const sfx = (t, n, g) => SFX.push([+t.toFixed(3), n, g]);

/* ---------- typing ---------- */
function keyTimes(text, cps, seed) {
  const times = [];
  let c = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    c += (1 / cps) * (0.7 + 0.6 * hash(i, seed)) + (ch === " " ? 0.04 : ch === "." ? 0.05 : 0);
    times.push(c);
  }
  return times;
}
const TY = {};
function defType(id, text, t0, cps, seed) {
  TY[id] = { text, t0, kt: keyTimes(text, cps, seed) };
  TY[id].kt.forEach((k) => sfx(t0 + k, "tick", 0.1));
}
function typedAt(id, t) {
  const y = TY[id];
  let n = 0;
  while (n < y.kt.length && y.kt[n] <= t - y.t0) n++;
  return y.text.slice(0, n);
}
const typeEnd = (id) => TY[id].t0 + TY[id].kt[TY[id].kt.length - 1];

/* ---------- shared data (fictional, international; amounts in euros at x10 of the sample figures) ---------- */
const PEOPLE = {
  SL: ["Sophie Laurent", "#7c3aed"], OB: ["Oliver Bennett", "#0ea5e9"], JM: ["Julia Meyer", "#14b8a6"], FW: ["Felix Wagner", "#f43f5e"],
  VH: ["Victor Hale", "#6366f1"], LS: ["Laura Schmidt", "#ec4899"], NB: ["Noah Becker", "#2563eb"], NH: ["Nora Hansen", "#0891b2"],
  EB: ["Ethan Brooks", "#4f46e5"], IG: ["Isabel Garcia", "#db2777"], LR: ["Leo Rossi", "#059669"], EC: ["Elena Costa", "#9333ea"],
  CM: ["Chloe Martin", "#e11d48"], LM: ["Lucas Moreau", "#0284c7"], MJ: ["Mia Johansson", "#7c3aed"], PE: ["Paul Evans", "#16a34a"],
};
const av = (k, size = 44) => `<div class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.36)}px;background:${PEOPLE[k][1]}">${k}</div>`;

/* ---------- sections ---------- */
// n: scene index; split: first word of the solution; icon, title: the area
const SEC = [
  { n: 3, split: "Synax", icon: "Users", title: "Employee Management" },
  { n: 4, split: "Schedule", icon: "UserRoundSearch", title: "Recruitment & Interviews" },
  { n: 5, split: "Attendance", icon: "Clock", title: "Attendance & Breaks" },
  { n: 6, split: "Daily", icon: "ListChecks", title: "Daily Work Management" },
  { n: 7, split: "Employees", icon: "Share2", title: "Referrals" },
  { n: 8, split: "Employees", icon: "CalendarDays", title: "Leave & Holidays" },
  { n: 9, split: "Run", icon: "Star", title: "Performance Reviews" },
  { n: 10, split: "Offboarding", icon: "DoorOpen", title: "Offboarding & Settlement" },
];
SEC.forEach((s, k) => {
  s.k = k;
  s.vIn = S[s.n] - 0.3; // vignette fades in over the end of the previous scene
  s.sol = W(s.n, s.split, 0, -0.3); // the wipe into the solution starts just before the solution words
  s.end = S[s.n + 1] + 0.1;
});

/* ---------- reveal ---------- */
const RT = {
  logo: W(1, "Meet", 0, -0.1), eyebrow: W(1, "Meet", 0, 0.05), title: W(1, "Smarter", 0, -0.12), control: W(1, "happier", 0, -0.08),
  panel: W(1, "Hire", 0, -0.2), snap: W(1, "Hire", 0, 0.05),
  pills: [W(1, "Hire", 0, -0.05), W(1, "manage", 0, -0.05), W(1, "support", 0, -0.05)],
  linksL: W(1, "manage", 0, 0.1), linksR: W(1, "support", 0, 0.1), pulse: W(1, "one", 0, -0.1),
};
const RCARDS = [
  ["Users", "Employee", "Sophie Laurent"], ["CalendarDays", "Leave Balance", "12 days left"], ["Clock", "Check-in", "09:02"], ["Wallet", "FNF Amount", "€ 1,865,000"],
  ["UserRoundSearch", "Interview", "17 Nov, 11:00"], ["Star", "Review Score", "4 / 5"], ["Share2", "Referral", "Chloe Martin"], ["ListChecks", "Task", "Onboarding screens"],
];
const RROWS = [400, 525, 650, 775];
const HUB = { kpi: [["Employees", 36], ["Open interviews", 6], ["On leave today", 3]], bars: [["Engineering", 18], ["Design", 4], ["QA", 5], ["HR", 4], ["Sales", 5]] };
const rcEl = [];
let linkEl = [];
const pulseAt = (t) => (t < RT.pulse ? 0 : 0.5 + 0.5 * Math.sin((t - RT.pulse) * 4.5));
function buildReveal() {
  $("#rpills").innerHTML = [["UserRoundSearch", "Hire"], ["Users", "Manage"], ["HeartHandshake", "Support"]]
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
  $("#hub .hic").innerHTML = ic("Users");
  $("#hkpis").innerHTML = HUB.kpi.map(([k], n) => `<div class="kpi"><div class="k">${k}</div><div class="v" id="hk${n}">0</div></div>`).join("");
  $("#hbars").innerHTML = HUB.bars.map(([n], k) => `<div class="hbar"><div class="b" id="hb${k}"></div><div class="l">${n}</div></div>`).join("");
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
  const p0 = eo(prog(t, RT.panel, RT.panel + 0.6));
  const hub = $("#hub");
  hub.style.opacity = t < RT.panel ? 0 : p0 * (1 - out);
  hub.style.transform = `translateY(${(1 - p0) * 30 + Math.sin(t * 1.5) * 5}px) scale(${(0.86 + 0.14 * p0) * (1 + 0.1 * out)})`;
  hub.style.boxShadow = `0 40px 110px rgba(0,0,0,.55), 0 0 0 2px rgba(96,165,250,.35), 0 0 90px rgba(59,130,246,${(0.25 + 0.3 * pulseAt(t)).toFixed(2)})`;
  HUB.kpi.forEach(([, v], k) => put($("#hk" + k), String(Math.round(v * eo(prog(t, RT.panel + 0.3 + k * 0.15, RT.panel + 1.3 + k * 0.15))))));
  HUB.bars.forEach(([, v], k) => {
    const u = back(prog(t, RT.linksL + k * 0.12, RT.linksL + 0.6 + k * 0.12));
    $("#hb" + k).style.height = Math.max(6, (v / 18) * 96 * clamp(u, 0, 1.2)) + "px";
  });
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

/* ---------- overview: the employee journey ---------- */
// tiles in journey order, drawn as a snake: row 1 left to right, row 2 right to left
const OV = [["UserRoundSearch", "Recruitment"], ["Users", "Employees"], ["Clock", "Attendance"], ["ListChecks", "Daily work"], ["DoorOpen", "Offboarding"], ["Star", "Performance"], ["CalendarDays", "Leave"], ["Share2", "Referrals"]];
const ovPos = (k) => (k < 4 ? [140 + k * 420, 330] : [140 + (7 - k) * 420, 610]);
const OT = { head: APP - 0.3, tiles: OV.map((_, k) => W(2, "covers", 0, -0.2) + k * 0.22), dot0: W(2, "first", 0, -0.1), dot1: W(2, "day", 0, 0.2) };
function buildOverview() {
  const host = $("#ov");
  OV.forEach(([i, n], k) => {
    const [x, y] = ovPos(k);
    const d = document.createElement("div");
    d.className = "otile";
    d.id = "ot" + k;
    d.style.left = x + "px";
    d.style.top = y + "px";
    d.innerHTML = `<div class="oi">${ic(i)}</div><div class="on">${n}</div><div class="onum">${k + 1}</div>`;
    host.appendChild(d);
  });
  // the journey path through the tile centres
  const c = OV.map((_, k) => { const [x, y] = ovPos(k); return [x + 190, y + 95]; });
  let d = `M${c[0][0]},${c[0][1]}`;
  for (let k = 1; k < 8; k++) d += k === 4 ? ` C${c[3][0] + 160},${c[3][1]} ${c[4][0] + 160},${c[4][1]} ${c[4][0]},${c[4][1]}` : ` L${c[k][0]},${c[k][1]}`;
  $("#ovpath").innerHTML = `<path id="ovp" d="${d}" fill="none" stroke="#60a5fa" stroke-width="4" stroke-dasharray="10 12" opacity=".7"/><circle id="ovdot" r="16" fill="#fff" stroke="#3b82f6" stroke-width="6"/>`;
}
function applyOverview(t) {
  const vis = t > OT.head - 0.1 && t < S[3] + 0.4;
  show($("#ov"), vis);
  if (!vis) return;
  const out = smoother(prog(t, S[3] - 0.35, S[3] + 0.2));
  $("#ov").style.opacity = 1 - out;
  const h = prog(t, OT.head, OT.head + 0.5);
  tf($("#ovh"), 0, (1 - eo(h)) * 20, 1, smoother(h));
  OV.forEach((_, k) => pop($("#ot" + k), t, OT.tiles[k], 40));
  const p = $("#ovp");
  const L = p.getTotalLength();
  const u = smoother(prog(t, OT.dot0, OT.dot1));
  const pt = p.getPointAtLength(L * u);
  const dot = $("#ovdot");
  dot.setAttribute("cx", pt.x.toFixed(1));
  dot.setAttribute("cy", pt.y.toFixed(1));
  dot.setAttribute("opacity", t > OT.dot0 - 0.2 ? 1 : 0);
  OV.forEach((_, k) => $("#ot" + k).classList.toggle("hot", u > 0 && Math.abs(u * 7 - k) < 0.5));
}

/* ---------- section solutions ---------- */
// each builder fills its .sol container and returns an apply(t) function; times come from the narration words
const SOL = [];
function solHead(k) {
  const s = SEC[k];
  return `<div class="sh"><div class="tag">${ic("Sparkles")}With Synax</div><div class="st">${ic(s.icon)}${s.title}</div></div>`;
}
const CUR = { stops: [], clicks: [], win: [] }; // cursor stops, clicks and the windows in which it is visible
const stop = (t, p, click, sel) => {
  CUR.stops.push({ t, p, sel });
  if (click) {
    CUR.clicks.push(t + 0.06);
    sfx(t + 0.06, "click", 0.32);
  }
};
const R = {}; // element rectangles measured at boot
const cen = (id, fx = 0.5, fy = 0.5) => [R[id].x + R[id].w * fx, R[id].y + R[id].h * fy];

// 1. employees: one profile fills in, joins the list, the list is searched
SOL[0] = (host) => {
  const n = 3;
  const rows = [["Role", "Software Developer", W(n, "role", 0, -0.1)], ["Department", "Engineering", W(n, "department", 0, -0.1)], ["Joining date", "14 Nov 2026", W(n, "joining", 0, -0.1)], ["Salary (CTC)", "€ 8,400,000 / year", W(n, "salary", 0, -0.1)]];
  const list = [["OB", "Senior Software Engineer"], ["JM", "Software Developer"], ["FW", "QA Engineer"], ["VH", "Junior Developer"], ["LS", "UI/UX Designer"]];
  host.innerHTML = solHead(0) + `
   <div class="card" id="e_prof" style="left:140px;top:230px;width:640px;height:620px">
    <div style="display:flex;align-items:center;gap:24px">${av("SL", 110)}<div><div class="big">Sophie Laurent</div><div class="mut" style="font-size:22px;margin-top:6px">Employee profile</div></div></div>
    ${rows.map(([k, v], i) => `<div class="kv" id="e_r${i}"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
   </div>
   <div class="card" id="e_list" style="left:840px;top:230px;width:940px;height:620px">
    <div style="display:flex;align-items:center;gap:14px"><div class="big" style="font-size:32px">Employees</div><div class="chipc" id="e_cnt">35</div></div>
    <div class="search" id="e_search" style="margin-top:22px">${ic("Search")}<span id="e_q"></span></div>
    <div id="e_rows" style="position:relative;margin-top:18px;height:400px">
     ${[["SL", "Software Developer"], ...list].map(([k, d], i) => `<div class="lrow" id="e_l${k}">${av(k, 46)}<span class="nm">${PEOPLE[k][0]}</span><span class="mut">${d}</span></div>`).join("")}
    </div>
   </div>`;
  const tJoin = W(n, "one", 1, -0.1), tSearch = W(n, "searchable", 0, -0.2);
  defType("emp", "Sop", tSearch + 0.25, 7, 5);
  return (t, s) => {
    pop($("#e_prof"), t, s.sol + 0.15, 40);
    pop($("#e_list"), t, s.sol + 0.4, 40);
    rows.forEach((r, i) => {
      const u = pop($("#e_r" + i), t, r[2], 16, 0.4);
      $("#e_r" + i).classList.toggle("fresh", t >= r[2] && t < r[2] + 0.9);
    });
    // the new profile slides into the list, then the search filters it
    const joined = t >= tJoin;
    put($("#e_cnt"), joined ? "36" : "35");
    $("#e_cnt").style.transform = `scale(${(1 + 0.3 * Math.sin(Math.PI * prog(t, tJoin, tJoin + 0.35))).toFixed(3)})`;
    const q = typedAt("emp", t);
    const filtered = q.length >= 3;
    const fu = smoother(prog(t, typeEnd("emp") + 0.05, typeEnd("emp") + 0.45));
    const order = ["SL", ...list.map((l) => l[0])];
    order.forEach((k, i) => {
      const el = $("#e_l" + k);
      if (k === "SL") {
        const u = smoother(prog(t, tJoin, tJoin + 0.5));
        tf(el, (1 - u) * -60, 0, 1, u);
        el.classList.toggle("hl", t >= tJoin && t < tJoin + 2.5);
      } else {
        const y = joined ? smoother(prog(t, tJoin, tJoin + 0.4)) * 66 : 0;
        tf(el, 0, y - 66, 1, 1 - fu);
      }
      el.style.top = (k === "SL" ? 0 : i * 66) + "px";
    });
    const focus = t >= tSearch && t < s.end;
    put($("#e_q"), q ? `<b>${q}</b>${focus && caretOn(t) ? '<span class="caret"></span>' : ""}` : focus && caretOn(t) ? '<span class="caret"></span>' : "Search employees");
    $("#e_search").classList.toggle("focus", focus);
    $("#e_prof").style.boxShadow = filtered ? "0 30px 80px rgba(0,0,0,.45), 0 0 0 4px rgba(96,165,250,.6)" : "";
  };
};
SOL[0].cursor = () => {
  const n = 3;
  stop(W(n, "searchable", 0, -0.2), cen("e_search", 0.3, 0.5), 1, "#e_search");
};
SOL[0].measure = () => (R.e_search = rect($("#e_search")));

// 2. recruitment: a candidate moves across the interview board
const REC_COLS = ["Screening", "Technical", "HR Round", "Offered"];
SOL[1] = (host) => {
  const n = 4;
  const fixed = [[0, "NH", "Full Stack Developer"], [0, "EB", "DevOps Engineer"], [1, "IG", "Full Stack Developer"], [2, "LR", "QA Engineer"], [3, "EC", "UI/UX Designer"]];
  host.innerHTML = solHead(1) + `<div id="k_board">${REC_COLS.map((c, i) => `<div class="kcol" id="k_c${i}" style="left:${140 + i * 410}px"><div class="kh">${c}<span class="chipc" id="k_n${i}"></span></div></div>`).join("")}
    ${fixed.map(([c, k, r], i) => `<div class="kcard" id="k_f${i}" style="left:${160 + c * 410}px;top:${c === 0 ? 600 + i * 120 : c === 3 ? 740 : 600}px">${av(k, 44)}<div><div class="nm">${PEOPLE[k][0]}</div><div class="mut">${r}</div></div></div>`).join("")}
    <div class="kcard mov" id="k_nb" style="left:160px;top:400px">${av("NB", 44)}<div><div class="nm">Noah Becker</div><div class="mut">React Developer</div></div></div>
    <div class="note" id="k_when">${ic("CalendarDays")}17 Nov · 11:00 · Video call</div>
    <div class="note fb" id="k_fb">${ic("MessageSquare")}"Strong in React and system design"</div>
    <div class="note eur" id="k_off">${ic("Wallet")}Offered CTC € 12,000,000</div></div>`;
  const tCol = [W(n, "screening", 0, 0), W(n, "screening", 0, 0.5), W(n, "offer", 0, -0.35), W(n, "offer", 0, 0.15)];
  // column index of the moving card over time: 0 until "screening", then 1, 2, 3 as the voice reaches "offer"
  const moves = [[W(n, "candidate", 0, 0.05), 1], [W(n, "screening", 0, 0.2), 2], [W(n, "offer", 0, -0.05), 3]];
  SOL[1].moves = moves;
  return (t, s) => {
    REC_COLS.forEach((_, i) => pop($("#k_c" + i), t, s.sol + 0.15 + i * 0.08, 30));
    [0, 1, 2, 3, 4].forEach((i) => pop($("#k_f" + i), t, s.sol + 0.35 + i * 0.06, 20));
    const nb = $("#k_nb");
    let x = 0;
    let col = 0;
    moves.forEach(([tm, c], i) => {
      const u = smoother(prog(t, tm, tm + 0.5));
      if (u > 0) col = c;
      x = lerp(x, c * 410, u);
    });
    const lift = Math.max(...moves.map(([tm]) => Math.sin(Math.PI * prog(t, tm, tm + 0.5))));
    const pin = pop(nb, t, W(n, "Schedule", 0, -0.2), 30);
    tf(nb, x, -lift * 14, (0.88 + 0.12 * back(pin)) * (1 + 0.04 * lift), smoother(pin));
    nb.style.boxShadow = lift > 0.05 ? "0 30px 60px rgba(0,0,0,.45), 0 0 0 4px #60a5fa" : "";
    const counts = [2, 1, 1, 1].map((c, i) => c + (i === col && t >= W(n, "Schedule", 0, -0.2) ? 1 : 0));
    counts.forEach((c, i) => put($("#k_n" + i), String(c)));
    // the schedule note follows the card; the feedback and offer notes appear at the end
    const wn = $("#k_when");
    const wu = prog(t, W(n, "interview", 0, -0.15), W(n, "interview", 0, 0.3));
    wn.style.left = 160 + x + "px";
    wn.style.top = "512px";
    wn.style.opacity = smoother(wu);
    wn.style.transform = `scale(${(0.85 + 0.15 * back(wu)).toFixed(3)})`;
    const fb = $("#k_fb");
    fb.style.left = 160 + 3 * 410 + "px";
    fb.style.top = "574px";
    pop(fb, t, W(n, "feedback", 0, -0.15), 20);
    const off = $("#k_off");
    off.style.left = 160 + 3 * 410 + "px";
    off.style.top = "636px";
    pop(off, t, W(n, "offer", 0, 0.45), 20);
  };
};
SOL[1].cursor = () => {
  const n = 4;
  const y = 400 + 55;
  SOL[1].moves.forEach(([tm, c]) => {
    stop(tm - 0.05, [160 + (c - 1) * 410 + 300, y], 0, null);
    stop(tm + 0.5, [160 + c * 410 + 300, y], 0, "#k_nb");
  });
};

// 3. attendance: one day on a timeline, overtime approved, the team at a glance
SOL[2] = (host) => {
  const n = 5;
  const H0 = 8, H1 = 20, X0 = 120, X1 = 1220; // timeline inside the card
  const hx = (h) => X0 + ((h - H0) / (H1 - H0)) * (X1 - X0);
  const team = [["SL", "In", "g"], ["OB", "In", "g"], ["JM", "On break", "v"], ["FW", "In", "g"], ["LS", "Leave", "a"], ["VH", "In", "g"]];
  host.innerHTML = solHead(2) + `
   <div class="card" id="a_day" style="left:280px;top:220px;width:1360px;height:330px">
    <div style="display:flex;align-items:center;gap:18px">${av("SL", 64)}<div><div class="big" style="font-size:32px">Sophie Laurent</div><div class="mut" style="font-size:20px">Today, 17 Nov</div></div></div>
    <div class="tl" style="left:${X0}px;width:${X1 - X0}px"></div><div class="tlf" id="a_fill" style="left:${hx(9.03)}px;width:0"></div>
    <div class="tlbrk" id="a_brk" style="left:${hx(13)}px;width:${hx(13.5) - hx(13)}px"></div>
    ${[8, 10, 12, 14, 16, 18, 20].map((h) => `<div class="tlh" style="left:${hx(h) - 30}px">${String(h).padStart(2, "0")}:00</div>`).join("")}
    <div class="mark in" id="a_in" style="left:${hx(9.03) - 70}px">${ic("LogIn")}Check in 09:02</div>
    <div class="mark br" id="a_br" style="left:${hx(13.25) - 80}px">${ic("Coffee")}Break 13:00–13:30</div>
    <div class="mark out" id="a_out" style="left:${hx(18.08) - 80}px">${ic("LogOut")}Check out 18:05</div>
   </div>
   <div class="card" id="a_ot" style="left:280px;top:590px;width:520px;height:260px">
    <div class="mut" style="font-size:20px">Overtime</div><div class="big" style="margin-top:6px">1 h 05 min</div>
    <div class="status" id="a_ots"></div>
   </div>
   <div class="card" id="a_team" style="left:840px;top:590px;width:800px;height:260px">
    <div class="mut" style="font-size:20px">Who's in today</div>
    <div style="display:flex;gap:18px;margin-top:22px">${team.map(([k, st, c], i) => `<div class="tm" id="a_t${i}">${av(k, 62)}<span class="dot ${c}"></span><div class="tms">${st}</div></div>`).join("")}</div>
   </div>`;
  const tIn = W(n, "check", 0, -0.05), tBr = W(n, "breaks", 0, -0.1), tOut = W(n, "check", 1, -0.05), tOt = W(n, "overtime", 0, -0.1), tAp = W(n, "automatically", 0, 0.0);
  SOL[2].sound = [tIn, tBr, tOut, tOt, tAp];
  return (t, s) => {
    pop($("#a_day"), t, s.sol + 0.15, 40);
    pop($("#a_team"), t, s.sol + 0.45, 40);
    pop($("#a_ot"), t, tOt - 0.1, 30);
    team.forEach((_, i) => pop($("#a_t" + i), t, s.sol + 0.6 + i * 0.1, 20));
    pop($("#a_in"), t, tIn, 16);
    pop($("#a_br"), t, tBr, 16);
    pop($("#a_out"), t, tOut, 16);
    $("#a_fill").style.width = (hx(18.08) - hx(9.03)) * smoother(prog(t, tIn, tOut + 0.3)) + "px";
    $("#a_brk").style.opacity = smoother(prog(t, tBr, tBr + 0.3));
    const ok = t >= tAp;
    put($("#a_ots"), ok ? `${ic("CircleCheck")}Approved` : `${ic("Clock")}Sent for approval`);
    $("#a_ots").className = "status" + (ok ? " ok" : " wait");
    $("#a_ots").style.transform = `scale(${(1 + 0.12 * Math.sin(Math.PI * prog(t, tAp, tAp + 0.35))).toFixed(3)})`;
  };
};

// 4. daily work: tasks on a board, assigned, one moves to Done
const DW_COLS = ["To Do", "In Progress", "Done"];
SOL[3] = (host) => {
  const n = 6;
  const tasks = [["Design onboarding screens", "LS", "120 h"], ["Build login API", "OB", "40 h"], ["Test sign-up flow", "FW", "16 h"]];
  host.innerHTML = solHead(3) + `<div class="proj" id="d_proj">${ic("Briefcase")}Mobile App 2.0<div class="pbar"><i id="d_pf"></i></div><span id="d_pp">0%</span></div>
   ${DW_COLS.map((c, i) => `<div class="kcol" id="d_c${i}" style="left:${200 + i * 520}px;width:480px;top:330px;height:540px"><div class="kh">${c}</div></div>`).join("")}
   ${tasks.map(([tt, k, h], i) => `<div class="task" id="d_t${i}" style="left:220px;top:${410 + i * 140}px"><div class="nm">${tt}</div><div class="trow"><span class="mut">${ic("Clock")}${h}</span><span class="asg" id="d_a${i}">${av(k, 36)}${PEOPLE[k][0]}</span></div></div>`).join("")}`;
  const tTasks = W(n, "tasks", 0, -0.15), tAsg = W(n, "assigns", 0, -0.1), tMv = [W(n, "progress", 0, -0.3), W(n, "board", 0, -0.2)];
  SOL[3].moves = tMv;
  SOL[3].sound = [tTasks, tAsg];
  return (t, s) => {
    pop($("#d_proj"), t, W(n, "projects", 0, -0.15), 20);
    DW_COLS.forEach((_, i) => pop($("#d_c" + i), t, s.sol + 0.15 + i * 0.08, 30));
    tasks.forEach((_, i) => {
      const el = $("#d_t" + i);
      if (i === 0) {
        const x = 520 * (smoother(prog(t, tMv[0], tMv[0] + 0.5)) + smoother(prog(t, tMv[1], tMv[1] + 0.5)));
        const lift = Math.max(Math.sin(Math.PI * prog(t, tMv[0], tMv[0] + 0.5)), Math.sin(Math.PI * prog(t, tMv[1], tMv[1] + 0.5)));
        const u = prog(t, tTasks, tTasks + 0.45);
        tf(el, x, (1 - eo(u)) * 20 - lift * 14, (0.88 + 0.12 * back(u)) * (1 + 0.04 * lift), smoother(u));
        el.style.boxShadow = lift > 0.05 ? "0 30px 60px rgba(0,0,0,.45), 0 0 0 4px #60a5fa" : "";
        el.classList.toggle("done", t >= tMv[1] + 0.4);
      } else pop(el, t, tTasks + i * 0.15, 20);
      const a = prog(t, tAsg + i * 0.15, tAsg + 0.4 + i * 0.15);
      $("#d_a" + i).style.opacity = smoother(a);
      $("#d_a" + i).style.transform = `scale(${(0.6 + 0.4 * back(a)).toFixed(3)})`;
    });
    const pct = Math.round(35 * smoother(prog(t, tMv[0], tMv[1] + 0.6)));
    $("#d_pf").style.width = pct + "%";
    put($("#d_pp"), pct + "%");
  };
};
SOL[3].cursor = () => {
  const [a, b] = SOL[3].moves;
  stop(a - 0.05, [220 + 300, 410 + 50], 0, "#d_t0");
  stop(a + 0.5, [220 + 520 + 300, 410 + 50], 0, "#d_t0");
  stop(b - 0.05, [220 + 520 + 300, 410 + 50], 0, "#d_t0");
  stop(b + 0.5, [220 + 1040 + 300, 410 + 50], 0, "#d_t0");
};

// 5. referrals: refer in a few clicks, then follow the referral to the hire
const RF_STEPS = ["New", "Shortlisted", "Interview", "Joined"];
SOL[4] = (host) => {
  const n = 7;
  const f = [["Candidate", "Chloe Martin"], ["Role", "React Developer"], ["Experience", "4 years"], ["Location", "Berlin"]];
  host.innerHTML = solHead(4) + `
   <div class="card" id="r_form" style="left:180px;top:230px;width:720px;height:620px">
    <div class="big" style="font-size:32px">Refer a candidate</div>
    ${f.map(([k, v], i) => `<div class="kv" id="r_f${i}"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}
    <div class="file" id="r_cv">${ic("FileText")}Chloe_Martin_CV.pdf</div>
    <div class="btnp" id="r_btn">${ic("Send")}Refer</div>
   </div>
   <div class="card" id="r_track" style="left:980px;top:230px;width:760px;height:620px">
    <div style="display:flex;align-items:center;gap:18px">${av("CM", 64)}<div><div class="big" style="font-size:30px">Chloe Martin</div><div class="mut" style="font-size:20px">Referred by Oliver Bennett</div></div></div>
    ${RF_STEPS.map((st, i) => `<div class="vstep" id="r_s${i}"><span class="vd">${ic("Check")}</span>${st}</div>`).join("")}
   </div>`;
  const tF = W(n, "refer", 0, -0.1), tClick = W(n, "clicks", 0, 0.05), tSteps = [W(n, "follows", 0, -0.1), W(n, "every", 0, 0), W(n, "referral", 1, 0), W(n, "hire", 0, -0.05)];
  SOL[4].click = tClick;
  SOL[4].sound = tSteps;
  return (t, s) => {
    pop($("#r_form"), t, s.sol + 0.15, 40);
    f.forEach((_, i) => pop($("#r_f" + i), t, tF + i * 0.18, 14, 0.35));
    pop($("#r_cv"), t, tF + 0.8, 14, 0.35);
    pop($("#r_btn"), t, tF + 0.95, 14, 0.35);
    $("#r_btn").style.transform += ` scale(${(1 - 0.06 * clamp(1 - Math.abs(t - tClick - 0.06) / 0.12)).toFixed(3)})`;
    const sent = t >= tClick + 0.1;
    put($("#r_btn"), sent ? `${ic("CircleCheck")}Referred` : `${ic("Send")}Refer`);
    $("#r_btn").classList.toggle("ok", sent);
    pop($("#r_track"), t, tClick + 0.25, 40);
    tSteps.forEach((ts, i) => {
      const el = $("#r_s" + i);
      el.className = "vstep" + (t >= ts ? " on" : "") + (i === 3 && t >= ts ? " win" : "");
      el.style.transform = `scale(${(1 + 0.05 * Math.sin(Math.PI * prog(t, ts, ts + 0.35))).toFixed(3)})`;
    });
  };
};
SOL[4].cursor = () => stop(SOL[4].click, cen("r_btn", 0.5, 0.5), 1, "#r_btn");
SOL[4].measure = () => (R.r_btn = rect($("#r_btn")));

// 6. leave: balance, request, approval, holidays
SOL[5] = (host) => {
  const n = 8;
  host.innerHTML = solHead(5) + `
   <div class="card" id="l_bal" style="left:140px;top:230px;width:520px;height:620px;text-align:center">
    <div class="mut" style="font-size:22px;text-align:left">Leave balance</div>
    <svg width="300" height="300" viewBox="0 0 300 300" style="margin:28px auto 0;display:block"><circle cx="150" cy="150" r="120" fill="none" stroke="#e5ecf6" stroke-width="30"/><circle id="l_ring" cx="150" cy="150" r="120" fill="none" stroke="#3b82f6" stroke-width="30" stroke-linecap="round" stroke-dasharray="754" stroke-dashoffset="754" transform="rotate(-90 150 150)"/></svg>
    <div class="ringv"><b id="l_left">0</b><span>of 15 days left</span></div>
    <div class="mut" style="font-size:22px;margin-top:26px">Earned Leave</div>
   </div>
   <div class="card" id="l_req" style="left:700px;top:230px;width:600px;height:620px">
    <div class="big" style="font-size:32px">Leave request</div>
    <div class="kv" id="l_k0"><span class="k">Type</span><span class="v">Paid leave</span></div>
    <div class="kv" id="l_k1"><span class="k">Dates</span><span class="v">12 – 13 Nov 2026</span></div>
    <div class="kv" id="l_k2"><span class="k">Day</span><span class="v">Full day</span></div>
    <div class="status wait" id="l_st"></div>
    <div class="btnp" id="l_ap">${ic("Check")}Approve</div>
   </div>
   <div class="card" id="l_hol" style="left:1340px;top:230px;width:440px;height:620px">
    <div class="big" style="font-size:30px">Company holidays</div>
    ${[["01 Jan", "New Year's Day"], ["01 May", "Labour Day"], ["25 Dec", "Christmas Day"]].map(([d, h], i) => `<div class="hol" id="l_h${i}"><span class="hd">${d}</span>${h}</div>`).join("")}
   </div>`;
  const tSee = W(n, "see", 0, -0.1), tReq = W(n, "request", 0, -0.1), tAp = W(n, "approve", 0, 0.0), tHol = W(n, "holidays", 0, -0.15);
  SOL[5].click = tAp;
  SOL[5].sound = [tReq, tHol];
  return (t, s) => {
    pop($("#l_bal"), t, s.sol + 0.15, 40);
    const r = smoother(prog(t, tSee, tSee + 1.0));
    $("#l_ring").setAttribute("stroke-dashoffset", (754 * (1 - (12 / 15) * r)).toFixed(1));
    put($("#l_left"), String(Math.round(12 * r)));
    pop($("#l_req"), t, tReq - 0.1, 40);
    [0, 1, 2].forEach((i) => pop($("#l_k" + i), t, tReq + 0.1 + i * 0.15, 14, 0.35));
    pop($("#l_ap"), t, tReq + 0.5, 14, 0.35);
    const ok = t >= tAp + 0.08;
    put($("#l_st"), ok ? `${ic("CircleCheck")}Approved` : `${ic("Clock")}Pending approval`);
    $("#l_st").className = "status" + (ok ? " ok" : " wait");
    pop($("#l_st"), t, tReq + 0.35, 14, 0.35);
    $("#l_st").style.transform += ` scale(${(1 + 0.12 * Math.sin(Math.PI * prog(t, tAp + 0.08, tAp + 0.45))).toFixed(3)})`;
    $("#l_ap").style.transform += ` scale(${(1 - 0.06 * clamp(1 - Math.abs(t - tAp - 0.06) / 0.12)).toFixed(3)})`;
    pop($("#l_hol"), t, tHol - 0.3, 40);
    [0, 1, 2].forEach((i) => pop($("#l_h" + i), t, tHol + i * 0.2, 14, 0.35));
  };
};
SOL[5].cursor = () => stop(SOL[5].click, cen("l_ap", 0.5, 0.5), 1, "#l_ap");
SOL[5].measure = () => (R.l_ap = rect($("#l_ap")));

// 7. performance: a review cycle with a score, notes and variable pay, for everyone
SOL[6] = (host) => {
  const n = 9;
  const team = [["OB", 4.5], ["FW", 4], ["LS", 5], ["VH", 3.5], ["SL", 4], ["MJ", 4.5]];
  host.innerHTML = solHead(6) + `<div class="cyc" id="p_cyc">${ic("CalendarDays")}Review cycle · Q3 2026 · Jul – Sep</div>
   <div class="card" id="p_rev" style="left:300px;top:300px;width:1320px;height:350px">
    <div style="display:flex;align-items:center;gap:20px">${av("JM", 76)}<div><div class="big" style="font-size:34px">Julia Meyer</div><div class="mut" style="font-size:20px">Software Developer</div></div></div>
    <div class="stars" id="p_stars">${[0, 1, 2, 3, 4].map((i) => `<span id="p_s${i}">${ic("Star")}</span>`).join("")}<b id="p_sc">0 / 5</b></div>
    <div class="pnote" id="p_note"><span class="mut" style="font-size:18px">Notes</span><div id="p_nt"></div></div>
    <div class="vpay" id="p_vp"><span class="mut" style="font-size:18px">Variable pay</span><b>12%</b></div>
   </div>
   <div id="p_team" style="position:absolute;left:300px;top:690px;width:1320px;display:flex;gap:20px">${team.map(([k, sc], i) => `<div class="pt" id="p_t${i}">${av(k, 50)}<b>${sc}</b>${ic("Star")}</div>`).join("")}</div>`;
  const tSc = W(n, "scores", 0, -0.1), tNotes = W(n, "notes", 1, -0.15), tVp = W(n, "variable", 0, -0.1), tAll = W(n, "every", 0, -0.1);
  defType("perf", "Delivered the payroll module ahead of schedule.", tNotes + 0.1, 26, 7);
  SOL[6].sound = [tSc, tVp, tAll];
  return (t, s) => {
    pop($("#p_cyc"), t, W(n, "cycles", 0, -0.3), 20);
    pop($("#p_rev"), t, s.sol + 0.15, 40);
    const sc = Math.round(4 * smoother(prog(t, tSc, tSc + 0.8)) * 10) / 10;
    [0, 1, 2, 3, 4].forEach((i) => $("#p_s" + i).classList.toggle("on", i < Math.round(sc)));
    put($("#p_sc"), (t >= tSc + 0.8 ? "4" : String(Math.round(sc))) + " / 5");
    const typing = t >= TY.perf.t0 && t < typeEnd("perf") + 0.4;
    put($("#p_nt"), esc(typedAt("perf", t)) + (typing && caretOn(t) ? '<span class="caret"></span>' : ""));
    pop($("#p_vp"), t, tVp, 16);
    pop($("#p_note"), t, tNotes - 0.2, 16);
    team.forEach((_, i) => pop($("#p_t" + i), t, tAll + i * 0.12, 20));
  };
};

// 8. offboarding: clearance checklist, the settlement, the exit interview
SOL[7] = (host) => {
  const n = 10;
  const items = ["IT assets returned", "Finance cleared", "HR documents", "Manager sign-off"];
  host.innerHTML = solHead(7) + `
   <div class="card" id="o_chk" style="left:140px;top:230px;width:760px;height:620px">
    <div style="display:flex;align-items:center;gap:18px">${av("LM", 64)}<div><div class="big" style="font-size:30px">Lucas Moreau</div><div class="mut" style="font-size:20px">Clearance checklist</div></div></div>
    ${items.map((it, i) => `<div class="chk" id="o_i${i}"><span class="cb">${ic("Check")}</span>${it}</div>`).join("")}
   </div>
   <div class="card" id="o_fnf" style="left:960px;top:230px;width:820px;height:300px">
    <div class="mut" style="font-size:22px">Full and final settlement</div>
    <div class="amt" id="o_amt">€ 0</div>
    <div class="status wait" id="o_st"></div>
   </div>
   <div class="card" id="o_exit" style="left:960px;top:570px;width:820px;height:280px">
    <div class="mut" style="font-size:22px">Exit interview</div>
    <div class="kv" id="o_rh" style="margin-top:14px"><span class="k">Rehire eligible</span><span class="v">Yes</span></div>
    <div class="quote">"Great team. Leaving for a larger role in Berlin."</div>
   </div>`;
  const tChk = W(n, "checklist", 0, -0.3), tAmt = W(n, "settles", 0, -0.1), tPaid = W(n, "amount", 0, 0.1), tExit = W(n, "exit", 0, -0.2);
  SOL[7].sound = [...items.map((_, i) => tChk + i * 0.3), tPaid, tExit];
  return (t, s) => {
    pop($("#o_chk"), t, s.sol + 0.15, 40);
    items.forEach((_, i) => {
      const ti = tChk + i * 0.3;
      pop($("#o_i" + i), t, s.sol + 0.4 + i * 0.1, 14, 0.35);
      const el = $("#o_i" + i);
      el.classList.toggle("on", t >= ti);
      el.querySelector(".cb").style.transform = `scale(${(1 + 0.25 * Math.sin(Math.PI * prog(t, ti, ti + 0.3))).toFixed(3)})`;
    });
    pop($("#o_fnf"), t, tAmt - 0.3, 40);
    const v = Math.round(1865000 * eo(prog(t, tAmt, tPaid)));
    put($("#o_amt"), "€ " + v.toLocaleString("en-US"));
    const paid = t >= tPaid;
    put($("#o_st"), paid ? `${ic("CircleCheck")}Settled and paid` : `${ic("Clock")}Calculating…`);
    $("#o_st").className = "status" + (paid ? " ok" : " wait");
    $("#o_st").style.transform = `scale(${(1 + 0.12 * Math.sin(Math.PI * prog(t, tPaid, tPaid + 0.35))).toFixed(3)})`;
    pop($("#o_exit"), t, tExit, 40);
    pop($("#o_rh"), t, tExit + 0.25, 14, 0.35);
  };
};

/* ---------- section driver: vignette, wipe, solution ---------- */
const solApply = [];
function buildSections() {
  SEC.forEach((s, k) => {
    const v = document.createElement("div");
    v.className = "vg";
    v.id = "vg" + k;
    $("#stage").insertBefore(v, $("#toon"));
    ToonV.build(v, k);
    const sol = document.createElement("div");
    sol.className = "sol";
    sol.id = "sol" + k;
    $("#sols").appendChild(sol);
    solApply[k] = SOL[k](sol);
    // sounds: the problem bubble pops, the wipe whooshes
    sfx(s.vIn + 0.6, "pop", 0.32);
    sfx(s.vIn + 0.4, "alert", 0.14);
    sfx(s.sol, "whoosh", 0.26);
    (SOL[k].sound || []).forEach((tt) => sfx(tt, "ping", 0.16));
  });
}
function applySections(t) {
  SEC.forEach((s, k) => {
    const v = $("#vg" + k), sol = $("#sol" + k);
    const vOn = t >= s.vIn && t < s.sol + 0.75;
    show(v, vOn);
    if (vOn) {
      const u = smoother(prog(t, s.vIn, s.vIn + 0.4));
      v.style.opacity = u;
      v.style.transform = `scale(${(1.04 - 0.04 * u).toFixed(4)})`;
      ToonV.apply(k, t - s.vIn);
    }
    const sOn = t >= s.sol && t < s.end + 0.45;
    show(sol, sOn);
    if (sOn) {
      // a circle opens from the speech bubble into the solution; the next vignette fades in on top at the end
      const w = eo(prog(t, s.sol, s.sol + 0.7));
      sol.style.clipPath = w < 1 ? `circle(${(w * 1250).toFixed(0)}px at 50% 42%)` : "none";
      sol.style.opacity = 1 - smoother(prog(t, s.end + 0.05, s.end + 0.45));
      solApply[k](t, s);
    }
  });
}

/* ---------- benefits + end ---------- */
const BT = { head: at(11, -0.1), cards: [W(11, "One", 0, -0.1), W(11, "faster", 0, -0.1), W(11, "smooth", 0, -0.1)] };
function buildBenefits() {
  $("#bcards").innerHTML = [
    ["Users", "One record", "Every employee's details in one profile"],
    ["UserRoundSearch", "Faster hiring", "Interviews, feedback and offers on one board"],
    ["DoorOpen", "Smooth exits", "Clearance and settlement, step by step"],
  ].map(([i, h, p], k) => `<div class="bc" id="bc${k}"><div class="bi">${ic(i)}</div><h3>${h}</h3><p>${p}</p></div>`).join("");
}
function applyBenefits(t) {
  const b = $("#bene");
  const inU = smoother(prog(t, BT.head - 0.1, BT.head + 0.6));
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

/* ---------- cursor ---------- */
function rect(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}
const moveDur = (a, b) => clamp(0.26 + Math.hypot(b[0] - a[0], b[1] - a[1]) / 2400, 0.28, 0.62);
function cursorAt(t) {
  const s = CUR.stops;
  if (!s.length) return [1500, 900];
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
function buildCursor() {
  // the pointer only appears in the sections where it does something
  [0, 1, 3, 4, 5].forEach((k) => {
    const s = SEC[k];
    const before = CUR.stops.length;
    SOL[k].cursor();
    const mine = CUR.stops.slice(before);
    const first = mine[0], last = mine[mine.length - 1];
    CUR.stops.splice(before, 0, { t: Math.max(s.sol + 0.6, first.t - 1.2), p: [first.p[0] + 260, first.p[1] + 220] });
    CUR.win.push([Math.max(s.sol + 0.6, first.t - 1.2), Math.min(s.end - 0.1, last.t + 1.2)]);
  });
  CUR.stops.sort((a, b) => a.t - b.t);
}
function cursorOpacity(t) {
  let o = 0;
  CUR.win.forEach(([a, b]) => (o = Math.max(o, Math.min(prog(t, a, a + 0.3), 1 - prog(t, b - 0.3, b)))));
  return o;
}

/* ---------- main apply ---------- */
function apply(t) {
  show($("#bg"), t > REV - 0.5);
  $("#bggrid").style.opacity = 0.9 * smoother(prog(t, REV - 0.3, REV + 0.8));
  $("#bgglow").style.opacity = 0.55 + 0.35 * Math.pow(Math.sin(t * 0.8), 2);
  tf($("#orb1"), 160 + Math.sin(t * 0.21) * 120, 120 + Math.cos(t * 0.17) * 80, 1, 0.5);
  tf($("#orb2"), 1480 + Math.cos(t * 0.19) * 120, 700 + Math.sin(t * 0.23) * 90, 1, 0.45);
  applyReveal(t);
  applyOverview(t);
  applySections(t);
  applyBenefits(t);

  const [px, py] = cursorAt(t);
  const cur = $("#cursor");
  cur.style.transform = `translate(${px - 3}px, ${py - 2}px) scale(${1 - 0.14 * pressAt(t, CUR.clicks, 0.16)})`;
  cur.style.opacity = cursorOpacity(t);
  let rp = 0, rx = 0, ry = 0;
  for (const ct of CUR.clicks) if (t >= ct && t < ct + 0.45) { rp = (t - ct) / 0.45; [rx, ry] = cursorAt(ct); }
  const rip = $("#ripple");
  rip.style.opacity = rp ? 0.9 * (1 - rp) : 0;
  rip.style.transform = `translate(${rx}px, ${ry}px) scale(${0.35 + eo(rp) * 1.5})`;

  const endT = at(12, 0.1);
  const ec = smoother(prog(t, endT, endT + 0.9));
  $("#end").style.opacity = ec;
  $("#end").style.transform = `scale(${1.03 - 0.03 * ec})`;

  const toonOut = smoother(prog(t, REV - 0.35, REV + 0.45));
  const toonEl = $("#toon");
  toonEl.style.display = t < REV + 0.5 ? "block" : "none";
  toonEl.style.opacity = 1 - toonOut;
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
    buildReveal();
    buildOverview();
    buildSections();
    buildBenefits();
    // measure the elements the cursor visits (solutions shown, untransformed)
    SEC.forEach((_, k) => (show($("#sol" + k), true), ($("#sol" + k).style.clipPath = "none")));
    SOL.forEach((f) => f.measure && f.measure());
    SEC.forEach((_, k) => show($("#sol" + k), false));
    buildCursor();
    // sounds for the opening and reveal
    Toon.times.bubbles.forEach((tt) => sfx(tt, "pop", 0.34));
    Toon.times.chips.forEach((tt) => sfx(tt + 0.05, "alert", 0.2));
    sfx(Toon.times.fly, "rustle", 0.16);
    [0, 0.2, 0.4, 0.6].forEach((d) => sfx(Toon.times.enter + 0.05 + d, "step", 0.22));
    sfx(REV - 0.5, "whoosh", 0.3);
    sfx(RT.logo - 1.35, "sweep", 0.3);
    sfx(RT.logo - 0.05, "sub", 0.45);
    sfx(RT.logo + 0.05, "chime", 0.34);
    for (let c = 0; c < 8; c++) sfx(RT.snap + 0.35 + c * 0.06, "snap", 0.18);
    RT.pills.forEach((tt) => sfx(tt + 0.05, "ping", 0.22));
    sfx(RT.pulse, "ping", 0.18);
    OT.tiles.forEach((tt) => sfx(tt + 0.05, "pop", 0.16));
    sfx(BT.head, "swish", 0.22);
    BT.cards.forEach((tt) => sfx(tt, "pop", 0.26));
    sfx(at(12, 0.1), "endchime", 0.4);
    window.__apply = apply;
    window.__total = TOTAL;
    window.__starts = S;
    window.__SEC = SEC;
    window.__stops = CUR.stops;
    window.__meta = { rev: REV, app: APP, total: TOTAL, sfx: SFX.sort((a, b) => a[0] - b[0]), sceneStarts: S.map((x) => x + LEAD).slice(0, DUR.length), sections: SEC.map((s) => [s.vIn, s.sol, s.end]), reveal: RT };
    window.__ready = true;
    apply(0);
  } catch (e) {
    window.__err = e.stack || String(e);
  }
}
boot();
