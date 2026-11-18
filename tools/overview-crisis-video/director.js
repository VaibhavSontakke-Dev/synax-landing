/* "Running Out of Hands": the Synax overview as a crisis film. A founder's bad morning (every department calls with a
   problem), the real cause (nothing is connected), then Synax ERP solving each problem in turn, Synax AI keeping watch,
   and the same day under control. Same 2.5D technique as the manufacturing films. A pure function of time, apply(t). */
const $ = (s, r = document) => r.querySelector(s);
const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[n] || ""}</svg>`;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, u) => a + (b - a) * u;
const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10);
const eo = (u) => 1 - Math.pow(1 - u, 3);
const back = (u) => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2);
const prog = (t, a, b) => clamp((t - a) / (b - a));
const win = (t, a, b, f = 0.3) => Math.min(smoother(prog(t, a, a + f)), 1 - smoother(prog(t, b - f, b)));
const hash = (k, seed = 1) => {
  const x = Math.sin(k * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const noise = (t, k) => Math.sin(t * 13.1 + k) * 0.5 + Math.sin(t * 29.7 + k * 2.3) * 0.3 + Math.sin(t * 51.3 + k * 4.1) * 0.2;
const cache = new Map();
const setA = (e, k, v) => {
  let m = cache.get(e);
  if (!m) cache.set(e, (m = {}));
  if (m[k] !== v) {
    e.setAttribute(k, v);
    m[k] = v;
  }
};
const put = (el, html) => {
  if (cache.get(el) !== html) {
    el.innerHTML = html;
    cache.set(el, html);
  }
};
const EL = {};
const $$ = (id) => EL[id] || (EL[id] = document.getElementById(id));
const show = (el, on, d = "block") => (el.style.display = on ? d : "none");
const pop = (el, t, t0, dy = 24, d = 0.45) => {
  const u = prog(t, t0, t0 + d);
  el.style.opacity = smoother(prog(t, t0, t0 + d * 0.6)).toFixed(3);
  el.style.transform = `translateY(${((1 - eo(u)) * dy).toFixed(1)}px) scale(${(0.9 + 0.1 * back(u)).toFixed(3)})`;
  return u;
};
const SFX = [];
const sfx = (t, n, g = 0.3) => SFX.push([+t.toFixed(3), n, g]);

/* ---------- clip timeline ---------- */
const GAP = [0, 0.35, -0.25, -0.1, -0.1, -0.25, -0.15, -0.25, 0.7, 3.4, 1.5, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.2, 1.0, 0.9];
const C = [];
CLIPS.forEach((cl, k) => {
  const w = WORDS[k];
  const speech = w[w.length - 1].t + w[w.length - 1].d - w[0].t;
  const s = k === 0 ? 3.4 : C[k - 1].e + GAP[k];
  C.push({ who: cl.who, s, e: s + speech, file: s - w[0].t });
});
const TOTAL = C[C.length - 1].e + 2.4;
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
function CW(k, word, nth = 0, off = 0) {
  const ws = WORDS[k].filter((x) => norm(x.w) === norm(word));
  if (!ws.length) throw new Error("word not found: " + k + " " + word);
  return C[k].file + ws[Math.min(nth, ws.length - 1)].t + off;
}
function talkOf(who, t) {
  for (let k = 0; k < C.length; k++) {
    const c = C[k];
    if (c.who !== who || t < c.s - 0.05 || t > c.e + 0.05) continue;
    for (const w of WORDS[k]) {
      const a = c.file + w.t, b = a + w.d;
      if (t >= a && t <= b + 0.04) return 0.45 + 0.55 * Math.abs(Math.sin((t - a) * 22 + k));
    }
    return 0.05;
  }
  return 0;
}
const speaking = (who, t) => C.some((c) => c.who === who && t >= c.s && t <= c.e);

/* ---------- key moments ---------- */
// the six solutions: clip, area, the person and their set
const SOLS = [
  { k: 11, area: "Projects", who: "pmg", set: "desk", pain: "Three sheets, no margin", icon: "FolderKanban" },
  { k: 12, area: "Staffing", who: "stf", set: "desk", pain: "Candidates in email", icon: "UserCog" },
  { k: 13, area: "HRMS", who: "hr", set: "desk", pain: "Wrong balances", icon: "Users" },
  { k: 14, area: "Manufacturing", who: "prd", set: "factory", pain: "Machine stopped, no reason", icon: "Factory" },
  { k: 15, area: "Quality", who: "qi", set: "qc", pain: "Lot can't be traced", icon: "ShieldCheck" },
  { k: 16, area: "Finance & Assets", who: "fin", set: "desk", pain: "Can't bill, can't find the laptop", icon: "Wallet" },
];
SOLS.forEach((s) => {
  s.before = C[s.k].s - 1.05;
  s.sol = C[s.k].s - 0.25;
  s.end = C[s.k + 1] ? C[s.k + 1].s - 1.05 : C[s.k].e + 0.6;
  // the panel is "solved" once its last item has appeared
  s.solved = null;
});
const T = {
  open: 0, notif: [0.35, 0.85, 1.35, 1.85, 2.35],
  cut: [C[8].e + 0.2, C[8].e + 0.82, C[8].e + 1.44, C[8].e + 2.06, C[8].e + 2.68],
  islands: C[9].s - 0.3, broken: CW(9, "connected", 0, -0.1),
  hub: C[10].s - 1.2, logo: CW(10, "Synax", 0, -0.1), ring: CW(10, "platform", 0, -0.4), spokes: CW(10, "shared", 0, -0.2),
  ai: C[17].s - 1.0, aiAns: CW(17, "flag", 0, -0.2), aiProp: CW(17, "propose", 0, -0.2), aiOk: CW(17, "approves", 0, 0.05),
  calm: C[18].s - 0.9, end: C[19].s - 0.5,
};

/* ---------- sets and people ---------- */
const SETS = { founder: { p: [0.8, 1, 1] }, desk: { p: [0.75, 1, 1] }, factory: { p: [0.62, 0.86, 1] }, qc: { p: [0.7, 1, 1] } };
const PEOPLE = [];
const addPerson = (set, layer, id, cast, x, y, s, front) => PEOPLE.push({ set, layer, id, cast, x, y, s, front });
addPerson("founder", 1, "ffo", "fo", 790, 842, 1.0);
["pmg", "stf", "hr", "fin", "adm"].forEach((k) => addPerson("desk", 1, "d" + k, k, 790, 842, 1.0));
addPerson("factory", 1, "fw1", "w1", 330, 885, 0.62);
addPerson("factory", 1, "fw2", "w2", 660, 885, 0.62);
addPerson("factory", 2, "fop", "op", 960, 960, 0.95);
addPerson("factory", 2, "fprd", "prd", 620, 1000, 1.0, "clipboard");
addPerson("qc", 2, "qqi", "qi", 900, 880, 1.0);
const PHONE = `<g transform="translate(46,0) rotate(-8)"><rect x="-10" y="-30" width="20" height="56" rx="6" fill="#1e293b"/><rect x="-7" y="-25" width="14" height="44" rx="3" fill="#60a5fa"/></g>`;
function buildSets() {
  const host = $("#world");
  for (const [name, cfg] of Object.entries(SETS)) {
    const set = ART.sets[name];
    const g = document.createElement("div");
    g.className = "set";
    g.id = "set_" + name;
    cfg.layers = ["bg", "mid", "fg"].map((ln, li) => {
      const d = document.createElement("div");
      d.className = "layer";
      const ppl = PEOPLE.filter((p) => p.set === name && p.layer === li)
        .map((p) => `<g id="${p.id}" transform="translate(${p.x},${p.y}) scale(${p.s})">${ART.person(p.id + "P", ART.castO(p.cast, p.front))}</g>`).join("");
      const seated = name === "founder" || name === "desk" || name === "office";
      const inner = name === "factory" ? set[ln]() + ppl : seated && li === 1 ? set[ln]() + ppl : ppl + set[ln]();
      d.innerHTML = `<svg viewBox="0 0 1920 1080" width="1920" height="1080" overflow="visible">${inner}</svg>`;
      g.appendChild(d);
      return d;
    });
    host.appendChild(g);
    cfg.el = g;
  }
  $$("qCal").insertAdjacentHTML("beforeend", `<circle cx="842" cy="672" r="18" fill="#60a5fa"/><circle cx="915" cy="672" r="18" fill="#60a5fa"/>`);
  ["ffoP", "dstfP", "dadmP"].forEach((pid) => $$(pid + "_head").insertAdjacentHTML("beforeend", `<g id="${pid}_hp" opacity="0">${PHONE}</g>`));
  // the solution scenes show the person sharp in front of their blurred set
  $("#xp").innerHTML = `<svg viewBox="0 0 560 1080" width="560" height="1080" overflow="visible">${SOLS.map((s) => `<g id="x${s.who}" transform="translate(290,1230) scale(1.6)" style="display:none">${ART.person("x" + s.who + "P", ART.castO(s.who))}</g>`).join("")}<g id="xadm" transform="translate(470,1260) scale(1.35)" style="display:none">${ART.person("xadmP", ART.castO("adm"))}</g></svg>`;
}

/* ---------- characters per frame ---------- */
function face(pid, c, o) {
  const { talk = 0, mood = 0, look = 0, shock = 0, smile = 0 } = o;
  const open = Math.max(talk * 9, shock * 9);
  setA($$(pid + "_talk"), "opacity", open > 0.8 ? 1 : 0);
  setA($$(pid + "_talk"), "ry", Math.max(2, open).toFixed(1));
  setA($$(pid + "_smile"), "opacity", open <= 0.8 && (smile > 0.5 || mood < 0.3) ? 1 : 0);
  setA($$(pid + "_frown"), "opacity", open <= 0.8 && smile <= 0.5 && mood >= 0.6 ? 1 : 0);
  setA($$(pid + "_flat"), "opacity", open <= 0.8 && smile <= 0.5 && mood >= 0.3 && mood < 0.6 ? 1 : 0);
  const up = shock * 7 + mood * 3;
  setA($$(pid + "_bl"), "transform", `rotate(${(mood * -9 + shock * 4).toFixed(1)} -18 -19) translate(0 ${(-up).toFixed(1)})`);
  setA($$(pid + "_br"), "transform", `rotate(${(mood * 9 - shock * 4).toFixed(1)} 18 -19) translate(0 ${(-up).toFixed(1)})`);
  const blink = (c + pid.length * 0.7) % 3.4 < 0.13 && shock < 0.5 ? 0.92 : 0;
  setA($$(pid + "_eyes"), "transform", `translate(0 -3) scale(1 ${(1 - blink).toFixed(3)}) translate(0 3)`);
  setA($$(pid + "_pl"), "cx", (-17 + look * 3.2).toFixed(1));
  setA($$(pid + "_pr"), "cx", (17 + look * 3.2).toFixed(1));
}
const arm = (pid, side, a, len = 1) => setA($$(pid + "_a" + (side < 0 ? "L" : "R")), "transform", `translate(${side * 72},-298) rotate(${a.toFixed(1)}) scale(1,${len.toFixed(3)})`);
const head = (pid, dx, rot) => setA($$(pid + "_head"), "transform", `translate(${dx.toFixed(1)},-376) rotate(${rot.toFixed(1)} 0 46)`);
const place = (id, x, y, s) => setA($$(id), "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(3)})`);
const bobY = (t, k) => Math.sin(t * 2.1 + k) * 2;
const phoneUp = (pid, on) => {
  setA($$(pid + "_hp"), "opacity", on ? 1 : 0);
  if (on) arm(pid, 1, 160, 0.48);
};

/* ---------- founder's office ---------- */
function founder(t, mode) {
  const pid = "ffoP";
  const calm = mode === "clean";
  const onPhone = !calm && t >= C[0].s - 0.5 && t < C[7].e + 0.4;
  if (onPhone) phoneUp(pid, true);
  else {
    phoneUp(pid, false);
    arm(pid, 1, calm ? -150 : speaking("fo", t) ? -50 + Math.sin(t * 4) * 12 : -30);
  }
  arm(pid, -1, calm ? 150 : t > C[8].s ? 40 + Math.sin(t * 2) * 10 : 30);
  const stress = calm ? 0 : prog(t, C[1].s, C[8].s);
  face(pid, t, { talk: talkOf("fo", t), mood: calm ? 0 : 0.4 + 0.6 * stress, smile: calm ? 1 : 0, look: onPhone ? Math.sin(t * 0.7) * 0.6 : 0.3 });
  head(pid, 0, calm ? -6 : onPhone ? 5 : Math.sin(t * 0.6) * 3);
  place("ffo", 790, 842 + bobY(t, 1) + (calm ? 6 : 0), 1.0);
  setA($$("foClockM"), "transform", `rotate(${(t * 36).toFixed(1)})`);
  setA($$("foClockH"), "transform", `rotate(${(t * 3 + 150).toFixed(1)})`);
  // phone buzzing on the desk before he answers
  const buzz = t < C[0].s - 0.5 ? (Math.sin(t * 50) > 0 ? 1 : -1) * (Math.floor(t * 1.6) % 2 === 0 ? 3 : 0) : 0;
  setA($$("foPhone"), "transform", `translate(${(500 + buzz).toFixed(1)},612) rotate(${(buzz * 0.8).toFixed(1)})`);
  setA($$("foPhone"), "opacity", onPhone ? 0 : 1);
  setA($$("foWarn"), "opacity", calm ? 0 : (0.35 + 0.65 * Math.max(0, Math.sin(t * 8))).toFixed(2));
  setA($$("foWarn"), "fill", calm ? "#22c55e" : "#ef4444");
  // papers pile up on the desk during the calls
  const n = calm ? 0 : Math.floor(9 * prog(t, C[1].s, C[8].s));
  for (let i = 0; i < 9; i++) {
    setA($$("foPp" + i), "opacity", i < n ? 1 : 0);
    setA($$("foPp" + i), "transform", `translate(${(420 + (i % 3) * 120 + hash(i, 3) * 30).toFixed(1)},${(630 - Math.floor(i / 3) * 10).toFixed(1)}) rotate(${((hash(i, 4) - 0.5) * 16).toFixed(1)})`);
  }
  put($$("foScreen"), calm
    ? `<rect x="20" y="22" width="120" height="12" rx="4" fill="#bfdbfe"/><circle cx="150" cy="95" r="40" fill="none" stroke="#86efac" stroke-width="8"/><path d="M132,95 L146,108 L170,82" fill="none" stroke="#86efac" stroke-width="8" stroke-linecap="round"/>`
    : `${[0, 1, 2, 3, 4].map((i) => `<rect x="${20 + (i % 2) * 12}" y="${20 + i * 28}" width="${200 - i * 16}" height="20" rx="4" fill="${i < 1 + Math.floor(prog(t, 0, C[8].s) * 5) ? "#ef4444" : "#3b82f6"}" opacity=".9"/>`).join("")}`);
}

/* ---------- department desk ---------- */
function desk(t, who, mode) {
  ["pmg", "stf", "hr", "fin", "adm"].forEach((k) => {
    show($$("d" + k), k === who, "inline");
    setA($$("dk_" + k), "opacity", k === who ? 1 : 0);
  });
  if (!who) return;
  const pid = "d" + who + "P";
  const calm = mode === "clean";
  const phone = (who === "stf" || who === "adm") && !calm;
  if (phone) phoneUp(pid, true);
  else {
    if (pid === "dstfP" || pid === "dadmP") phoneUp(pid, false);
    arm(pid, 1, speaking(who, t) ? -55 + Math.sin(t * 5) * 18 : calm ? -30 : -20);
  }
  arm(pid, -1, speaking(who, t) ? 45 - Math.sin(t * 4) * 12 : 25);
  face(pid, t, { talk: talkOf(who, t), mood: calm ? 0 : 0.8, smile: calm ? 1 : 0, look: 0.4 });
  head(pid, 0, speaking(who, t) ? Math.sin(t * 4) * 3 : 2);
  place("d" + who, 790, 842 + bobY(t, who.length), 1.0);
  put($$("dkScreen"), calm
    ? `<rect x="20" y="22" width="110" height="12" rx="4" fill="#3b82f6"/><rect x="20" y="46" width="200" height="10" rx="4" fill="#93c5fd"/><rect x="20" y="66" width="160" height="10" rx="4" fill="#93c5fd"/><circle cx="200" cy="118" r="14" fill="#22c55e"/>`
    : `${[0, 1, 2, 3].map((i) => `<rect x="20" y="${22 + i * 30}" width="${180 - i * 20}" height="18" rx="3" fill="${i % 2 ? "#cbd5e1" : "#fca5a5"}"/>`).join("")}`);
}

/* ---------- factory and QC (same sets as the manufacturing films) ---------- */
function factory(t, mode) {
  const calm = mode === "clean";
  const ang = calm ? t * 38 : 0;
  [0, 1, 2].forEach((k) => {
    const ph = ang + (k * Math.PI * 2) / 3;
    setA($$("fJ" + k), "y", (520 + Math.sin(ph) * 60).toFixed(1));
  });
  setA($$("fCool"), "opacity", calm ? 1 : 0);
  const blinkR = calm ? 0 : Math.sin(t * 9) > 0 ? 1 : 0.25;
  setA($$("fTR"), "opacity", blinkR.toFixed(2));
  setA($$("fTRglow"), "opacity", (blinkR * 0.9).toFixed(2));
  setA($$("fTA"), "opacity", 0);
  setA($$("fTG"), "opacity", calm ? 1 : 0);
  put($$("fScreen"), calm
    ? `<text x="1113" y="466" text-anchor="middle" font-size="15" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">LIVE · M04</text><text x="1113" y="502" text-anchor="middle" font-size="24" font-weight="800" fill="#86efac" font-family="Inter,sans-serif">RUNNING</text>`
    : `<rect x="1044" y="434" width="138" height="92" rx="6" fill="${Math.sin(t * 9) > 0 ? "#7f1d1d" : "#450a0a"}"/><text x="1113" y="472" text-anchor="middle" font-size="22" font-weight="800" fill="#fecaca" font-family="Inter,sans-serif">STOPPED</text><text x="1113" y="500" text-anchor="middle" font-size="13" font-weight="700" fill="#fecaca" font-family="Inter,sans-serif">REASON: ?</text>`);
  for (let i = 0; i < 36; i++) setA($$("fSk" + i), "opacity", 0);
  for (let i = 0; i < 8; i++) setA($$("fSmk" + i), "opacity", 0);
  [1, 2, 3].forEach((k) => setA($$("fM" + k + "L"), "fill", calm ? "#22c55e" : "#facc15"));
  const dist = calm ? t * 90 : 40;
  for (let i = 0; i < 12; i++) setA($$("fP" + i), "transform", `translate(${(((dist + i * 100) % 1200) - 80).toFixed(1)},806)`);
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 5), col = i % 5;
    setA($$("fPl" + i), "opacity", !calm && i < 12 ? 1 : i < 2 ? 1 : 0);
    setA($$("fPl" + i), "transform", `translate(${(22 + col * 22 + row * 9).toFixed(1)},${(38 - row * 15).toFixed(1)}) rotate(${((hash(i, 9) - 0.5) * 40).toFixed(1)})`);
  }
  ["fw1", "fw2"].forEach((id, k) => {
    const pid = id + "P";
    place(id, [330, 660][k], 885 + bobY(t, k), 0.62);
    arm(pid, 1, calm ? -60 + Math.sin(t * 3 + k) * 12 : 30);
    arm(pid, -1, calm ? 20 : -30);
    face(pid, t, { mood: calm ? 0 : 0.7, smile: calm ? 1 : 0, look: 0.8 });
  });
  arm("fopP", 1, calm ? -100 + Math.sin(t * 2) * 6 : -20);
  arm("fopP", -1, 12);
  face("fopP", t, { mood: calm ? 0 : 0.8, smile: calm ? 1 : 0, look: 0.9 });
  place("fop", 960, 960 + bobY(t, 2), 0.95);
  const pid = "fprdP";
  const sp = speaking("prd", t);
  arm(pid, 1, sp ? -120 + Math.sin(t * 6) * 15 : calm ? -25 : -20);
  arm(pid, -1, 18);
  face(pid, t, { talk: talkOf("prd", t), mood: calm ? 0 : 0.85, smile: calm ? 1 : 0, look: 0.7 });
  head(pid, 0, sp ? Math.sin(t * 5) * 3 : 0);
  place("fprd", 620, 1000 + bobY(t, 3), 1.0);
}
function qc(t, mode) {
  const calm = mode === "clean";
  const lcd = $$("qLCD");
  const v = calm ? "25.40" : "24.50";
  if (lcd.textContent !== v) lcd.textContent = v;
  setA(lcd, "fill", calm ? "#15803d" : "#b91c1c");
  for (let i = 0; i < 6; i++) setA($$("qS" + i), "transform", calm ? "" : `translate(${(605 - (1094 + (i % 3) * 104 + 48)).toFixed(1)},${(600 + (i % 3) * 8 - (600 - Math.floor(i / 3) * 18)).toFixed(1)})`);
  const pid = "qqiP";
  arm(pid, -1, speaking("qi", t) ? 60 + Math.sin(t * 5) * 20 : 40);
  arm(pid, 1, -40);
  face(pid, t, { talk: talkOf("qi", t), mood: calm ? 0 : 0.85, smile: calm ? 1 : 0, look: -0.2 });
  place("qqi", 900, 880 + bobY(t, 3), 1.0);
}

/* ---------- shots ---------- */
const SHOTS = [];
const shot = (t0, set, mode, cam, extra = {}) => SHOTS.push({ t0, set, mode, cam, ...extra });
const key = (t, s, x, y) => [t, s, x, y];
// part 1: the pain
shot(0, "founder", "dawn", [key(0, 1.0, 960, 560), key(C[0].s - 0.4, 1.1, 900, 570)], { notif: 1 });
shot(C[0].s - 0.4, "founder", "dawn", [key(C[0].s - 0.4, 2.2, 800, 520), key(C[1].s - 0.3, 2.35, 800, 515)]);
const CALLS = [[1, "desk", "pmg", "Project Manager"], [2, "desk", "stf", "Staffing Lead"], [3, "desk", "hr", "HR Manager"], [4, "factory", "prd", "Production Manager"], [5, "qc", "qi", "Quality Inspector"], [6, "desk", "fin", "Finance Head"], [7, "desk", "adm", "IT & Admin"]];
CALLS.forEach(([k, set, who, role], n) => {
  const t0 = C[k].s - 0.3;
  const cam = set === "desk" ? [key(t0, 1.75, 840, 600), key(C[k].e, 1.9, 840, 590)] : set === "factory" ? [key(t0, 1.7, 760, 640), key(C[k].e, 1.85, 780, 630)] : [key(t0, 1.6, 1000, 600), key(C[k].e, 1.75, 990, 595)];
  shot(t0, set, set === "desk" ? "cool" : "alarm", cam, { who, tag: role, split: n >= 3, whip: n % 2 ? -1 : 1 });
});
shot(C[8].s - 0.3, "founder", "overwhelm", [key(C[8].s - 0.3, 1.5, 820, 560), key(C[8].e + 0.2, 2.3, 800, 520)], { sheets: 1 });
T.cut.forEach((tc, n) => shot(tc, n === 2 ? "factory" : "founder", n === 2 ? "alarm" : "overwhelm", n === 2 ? [key(tc, 1.2, 1100, 560)] : [key(tc, 1.1, 960, 560)], { cutCard: n === 2 ? -1 : n, whip: n % 2 ? 1 : -1 }));
shot(T.islands, "founder", "overwhelm", [key(T.islands, 1.0, 960, 560), key(T.hub, 1.12, 960, 560)], { islands: 1, dim: 0.5 });
// part 2: Synax
shot(T.hub, "founder", "clean", [key(T.hub, 1.0, 960, 560)], { hub: 1, dim: 0.85, blur: 6 });
SOLS.forEach((s) => {
  const camB = s.set === "desk" ? [key(s.before, 1.6, 840, 600)] : s.set === "factory" ? [key(s.before, 1.5, 900, 600)] : [key(s.before, 1.5, 1000, 600)];
  shot(s.before, s.set, s.set === "desk" ? "cool" : "alarm", camB, { who: s.who, beforeOf: s, whip: 1 });
  shot(s.sol, s.set, "clean", [key(s.sol, 1.05, 1100, 560), key(s.end, 1.12, 1150, 560)], { who: s.who, solOf: s, blur: 6, dim: 0.35 });
});
shot(T.ai, "founder", "clean", [key(T.ai, 1.0, 960, 560)], { ai: 1, dim: 0.92, blur: 8 });
shot(T.calm, "founder", "clean", [key(T.calm, 1.0, 960, 560), key(C[18].s + 2.2, 1.0, 960, 560), key(T.end, 1.9, 800, 520)]);
shot(T.end, "founder", "clean", [key(T.end, 1.9, 800, 520)], { endcard: 1 });
const shotAt = (t) => {
  let s = SHOTS[0];
  for (const x of SHOTS) if (t >= x.t0) s = x;
  return s;
};
const camAt = (sh, t) => {
  const K = sh.cam;
  if (t <= K[0][0] || K.length === 1) return K[0].slice(1);
  for (let i = 1; i < K.length; i++)
    if (t <= K[i][0]) {
      const u = smoother(prog(t, K[i - 1][0], K[i][0]));
      return [1, 2, 3].map((k) => lerp(K[i - 1][k], K[i][k], u));
    }
  return K[K.length - 1].slice(1);
};

/* ---------- overlays ---------- */
// [from, to, text]: short title cards, never the narration's own words on screen
const TITLES = [
  [0.25, 2.9, "8:55 AM · Monday"],
  [CW(9, "Nothing", 0, -0.1), CW(9, "Every", 0, 1.6), "Nothing is connected."],
  [C[10].s - 1.0, CW(10, "platform", 0, -0.5), "Meet Synax ERP"],
  [C[18].s - 0.8, C[18].s + 2.0, "Back in control."],
];
const MODS = [["FolderKanban", "Projects"], ["UserCog", "Staffing"], ["Users", "HRMS"], ["Factory", "Manufacturing"], ["ShieldCheck", "Quality"], ["Wallet", "Finance"], ["Box", "Assets"], ["KeyRound", "Access Control"], ["Sparkles", "Synax AI"]];
const ISLES = [["FolderKanban", "Projects", 300, 300], ["UserCog", "Staffing", 960, 260], ["Users", "HR", 1620, 300], ["Factory", "Manufacturing", 300, 860], ["Wallet", "Finance", 960, 910], ["Box", "Assets", 1620, 860]];
// solution panels: rows that pop in on their words
const PANELS = {
  11: { title: "Portal Revamp · PRJ-0142", rows: [["Timer", "Work Tracker", "312 h logged", "work"], ["Calculator", "Cost Mapper", "Cost to date, by person", "cost"], ["Receipt", "Billing", "2 of 4 milestones billed", "billing"], ["ChartColumn", "Project analytics", "Margin 24% · on budget", "analytics"]] },
  12: { title: "REQ-2207 · 3 Java developers", flow: [["Requirement", "requirement"], ["Candidates 6", "candidates"], ["Interviews 5", "interviews"], ["Offers 4", "offers"], ["Deployed 3", "deployment"]], flow2: [["Timesheets", "timesheets"], ["Invoices", "invoices"], ["Payments", "payments"]] },
  13: { title: "Mia Johansson · one employee record", flow: [["Manpower request", "manpower"], ["Offer", "offer"], ["Pre-joining checks", "prejoining"], ["Employee portal", "portal"], ["Reviews", "reviews"], ["Exit", "exit"]] },
  14: { title: "Order FH-220 · 500 parts", flow: [["Customer PO", "customer"], ["Material", "material"], ["Route card", "route"], ["Schedule", "schedule"]], tiles: [["Gauge", "Live monitoring", "11 of 12 running", "live"], ["Clock", "Downtime", "M04 · tool change, 12 min", "downtime"]] },
  15: { title: "Part S/N 0418 · genealogy", rows: [["CircleCheck", "Inspection", "Final inspection and COC", "inspection"], ["TriangleAlert", "NCR and CAPA", "NCR-0091 → corrective action", "CAPA"]], chain: [["Order", "PO-4471", "order"], ["Material lot", "ML-2291", "material"], ["Machine", "M04", "machine"], ["Operator", "D. Weber", "operator"]] },
  16: { title: "Finance & Assets", rows: [["Receipt", "Customer invoice", "INV-2026-0418 · sent", "invoices"], ["FileText", "Debit and credit notes", "DN-0032 · CN-0019", "debit"], ["Laptop", "Asset LT-0217", "Assigned to Ethan Brooks", "asset"], ["KeyRound", "Access control", "Roles · users · page permissions", "access"]] },
};
function buildOverlays() {
  $("#notif").innerHTML = [["Mail", "12 unread messages"], ["PhoneMissed", "3 missed calls"], ["TriangleAlert", "Machine 4: alarm"], ["Mail", "Client: escalation"], ["CalendarX", "Delivery due Friday"]].map(([i, n], k) => `<div class="nt" id="nt${k}">${ic(i)}${n}</div>`).join("");
  $("#sheets").innerHTML = [["Order FH-220", "500"], ["Order FH-220", "480"], ["Order FH-220", "520"], ["Order FH-220", "?"], ["Order FH-220", "460"]].map(([a, b], k) => `<div class="sh" id="sh${k}"><div class="shh">${ic("Sheet")}Sheet ${k + 1}</div><div class="shr"><span>${a}</span><b>${b}</b></div><div class="shg"></div></div>`).join("");
  $("#cuts").innerHTML = [
    `<div class="cc cal">${ic("CalendarX")}<b>Fri 21 Nov</b><span>Delivery missed</span></div>`,
    `<div class="cc mail">${ic("Mail")}<b>RE: Escalation</b><span>Your delivery is late again</span></div>`,
    ``,
    `<div class="cc cand">${ic("UserRoundX")}<b>Candidate withdrew</b><span>Offer came too late</span></div>`,
    `<div class="cc inv">${ic("Receipt")}<b>Invoice not raised</b><span class="stamp">OVERDUE</span></div>`,
  ].map((h, k) => `<div class="cut" id="cut${k}">${h}</div>`).join("");
  $("#isl").innerHTML = ISLES.map(([i, n, x, y], k) => `<div class="isle" id="is${k}" style="left:${x - 140}px;top:${y - 50}px">${ic(i)}<div><b>${n}</b><span>its own sheet</span></div></div>`).join("") +
    `<svg width="1920" height="1080">${[[0, 1], [1, 2], [0, 3], [2, 5], [3, 4], [4, 5], [1, 4]].map(([a, b], k) => `<line id="il${k}" x1="${ISLES[a][2]}" y1="${ISLES[a][3]}" x2="${ISLES[b][2]}" y2="${ISLES[b][3]}" stroke="#94a3b8" stroke-width="3" stroke-dasharray="16 14"/>`).join("")}</svg><div id="islX">${[[0, 1], [1, 2], [0, 3], [2, 5], [3, 4], [4, 5], [1, 4]].map(([a, b], k) => `<span id="ix${k}" style="left:${(ISLES[a][2] + ISLES[b][2]) / 2 - 18}px;top:${(ISLES[a][3] + ISLES[b][3]) / 2 - 18}px">×</span>`).join("")}</div>`;
  $("#hubv").innerHTML = `<svg id="hubsp" width="1920" height="1080">${MODS.map((_, k) => { const a = -Math.PI / 2 + (k / MODS.length) * Math.PI * 2; return `<line id="hl${k}" x1="960" y1="560" x2="${960 + Math.cos(a) * 400}" y2="${560 + Math.sin(a) * 330}" stroke="#60a5fa" stroke-width="3" stroke-dasharray="460" stroke-dashoffset="460"/><circle id="hd${k}" r="7" fill="#93c5fd" opacity="0"/>`; }).join("")}</svg>
    <div id="hubc"><img src="assets/synax-pro-light.webp" alt=""><span>One platform. Connected business.</span></div>
    ${MODS.map(([i, n], k) => { const a = -Math.PI / 2 + (k / MODS.length) * Math.PI * 2; return `<div class="mt" id="mt${k}" style="left:${960 + Math.cos(a) * 400 - 110}px;top:${560 + Math.sin(a) * 330 - 32}px">${ic(i)}${n}</div>`; }).join("")}`;
  // solution panels
  let ph = "";
  SOLS.forEach((s) => {
    const P = PANELS[s.k];
    let body = "";
    if (P.rows) body += P.rows.map(([i, a, b, w], n) => `<div class="pr" id="pr${s.k}_${n}">${ic(i)}<div><b>${a}</b><span id="prt${s.k}_${n}" data-t="${b}">${b}</span></div><i class="ok">${ic("Check")}</i><div class="pb"><i id="pb${s.k}_${n}"></i></div></div>`).join("");
    if (P.flow) body += `<div class="flow" id="fl${s.k}"><span class="dot" id="fd${s.k}"></span>${P.flow.map(([a], n) => `<div class="fs" id="fs${s.k}_${n}">${a}</div>`).join(`<span class="fa">${ic("ArrowRight")}</span>`)}</div>`;
    if (P.flow2) body += `<div class="flow f2">${P.flow2.map(([a], n) => `<div class="fs" id="fs2${s.k}_${n}">${a}</div>`).join(`<span class="fa">${ic("ArrowRight")}</span>`)}</div>`;
    if (P.tiles) body += `<div class="tiles">${P.tiles.map(([i, a, b], n) => `<div class="tl" id="tl${s.k}_${n}">${ic(i)}<b>${a}</b><span>${b}</span></div>`).join("")}</div>`;
    if (P.chain) body += `<div class="chain">${P.chain.map(([a, b], n) => `<div class="ch" id="ch${s.k}_${n}"><span>${a}</span><b>${b}</b></div>`).join("")}</div>`;
    ph += `<div class="sp" id="sp${s.k}"><div class="solved" id="sv${s.k}">${ic("CircleCheck")}Solved</div><div class="burst" id="bu${s.k}"></div><div class="spt"><span class="tag">${ic("Sparkles")}With Synax</span><b>${ic(s.icon)}${s.area}</b></div><div class="sph">${P.title}</div>${body}</div>`;
  });
  $("#sols").innerHTML = ph;
  $("#titles").innerHTML = TITLES.map(([, , txt], k) => `<div class="tt" id="tt${k}"><div class="ttm"><span>${txt}</span></div><i></i></div>`).join("");
  $("#before").innerHTML = SOLS.map((s) => `<div class="bf" id="bf${s.k}">${ic("TriangleAlert")}${s.pain}</div>`).join("");
  $("#ai").innerHTML = `<div class="aiw"><div class="aih">${ic("Sparkles")}Synax AI</div>
    <div class="q" id="aiq"><span id="aiqt"></span></div>
    <div class="a" id="aia">${ic("Sparkles")}<div><b>3 challans are past their return date</b><span>Orion Aero · DC-1182, DC-1187, DC-1190</span></div></div>
    <div class="ag" id="aig"><div class="agh">${ic("Bot")}Synax agent proposes</div><div class="agb">Draft reminders for the 3 overdue challans?</div><div class="agf"><span class="ap" id="aiap">Approve</span><span class="mut">Agents only propose.</span></div></div>
    <div class="done" id="aid">${ic("CircleCheck")}Approved by the founder · recorded</div></div><div id="aicur"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M3 2l15 9.2-6.3 1.6 3.7 7.1-2.9 1.5-3.7-7.2L3 20z" fill="#fff" stroke="#0f172a" stroke-width="1.5"/></svg></div>`;
}

/* ---------- main apply ---------- */
function apply(t) {
  const sh = shotAt(t);
  let [s, cx, cy] = camAt(sh, t);
  // a slight hand-held drift during the calls
  if (sh.mode === "cool" || sh.mode === "alarm") { cx += noise(t * 0.6, 3) * 6; cy += noise(t * 0.7, 5) * 4; }
  // whip pan: the new shot slides in fast with a motion streak
  const wd = sh.whip ? prog(t, sh.t0, sh.t0 + 0.26) : 1;
  if (wd < 1) cx += (sh.whip * (1 - eo(wd)) * 520) / s;
  $("#whip").style.opacity = wd < 1 ? (1 - wd) * 0.9 : 0;
  $("#whip").style.transform = `translateX(${((sh.whip || 1) * (1 - eo(wd)) * 40).toFixed(1)}%)`;
  for (const [name, cfg] of Object.entries(SETS)) {
    const on = name === sh.set;
    show(cfg.el, on);
    if (!on) continue;
    cfg.layers.forEach((L, li) => {
      const p = cfg.p[li];
      const sl = 1 + (s - 1) * p, xl = 960 + (cx - 960) * p, yl = 540 + (cy - 540) * p;
      L.style.transform = `translate(${(960 - xl * sl).toFixed(2)}px,${(540 - yl * sl).toFixed(2)}px) scale(${sl.toFixed(4)})`;
      const dof = sh.blur ? sh.blur : li === 0 ? clamp((s - 1.4) * 2.2, 0, 4) : li === 1 && name === "factory" ? clamp((s - 2.0) * 1.6, 0, 3) : 0;
      const mb = wd < 1 ? (1 - wd) * 7 : 0;
      L.style.filter = dof + mb > 0.05 ? `blur(${(dof + mb).toFixed(2)}px)` : "none";
    });
  }
  const mode = sh.mode;
  if (sh.set === "founder") founder(t, mode);
  if (sh.set === "desk") desk(t, sh.who, mode);
  if (sh.set === "factory") factory(t, mode);
  if (sh.set === "qc") qc(t, mode);
  // lighting
  $("#world").style.filter = mode === "cool" ? "saturate(.75) brightness(.95)" : mode === "overwhelm" ? `saturate(${(0.7 - 0.3 * prog(t, C[8].s, T.hub)).toFixed(3)}) brightness(.88)` : mode === "clean" ? "brightness(1.1) saturate(1.05)" : mode === "dawn" ? "brightness(.95)" : "none";
  const redOn = mode === "alarm" ? 0.45 : mode === "overwhelm" ? 0.18 : 0;
  const pulse = 0.55 + 0.45 * Math.max(0, Math.sin(t * 9));
  $("#red").style.opacity = (redOn * pulse * 0.55).toFixed(3);
  $("#redglow").style.opacity = (redOn * pulse * 0.6).toFixed(3);
  $("#vig").style.opacity = mode === "clean" ? 0.25 : 0.75;
  $("#cool").style.opacity = mode === "cool" || mode === "overwhelm" ? 0.45 : 0;
  $("#cleanL").style.opacity = mode === "clean" && !sh.dim ? 0.5 : 0;
  $("#dim").style.opacity = sh.dim || 0;
  // role tags, notifications
  const rl = sh.tag ? win(t, sh.t0 + 0.15, sh.t0 + 3.0, 0.3) : 0;
  $("#role").style.opacity = rl;
  $("#role").style.transform = `translateX(${((1 - eo(prog(t, sh.t0 + 0.15, sh.t0 + 0.5))) * -60).toFixed(1)}px)`;
  if (sh.tag) put($("#role"), `<i></i><b>${sh.tag}</b>`);
  // kinetic title cards at the big moments
  TITLES.forEach(([a, b, txt], k) => {
    const e = $("#tt" + k);
    const on = t >= a - 0.05 && t < b + 0.3;
    show(e, on, "flex");
    if (!on) return;
    const u = prog(t, a, a + 0.45), o = prog(t, b - 0.3, b);
    e.style.opacity = (1 - o).toFixed(3);
    e.querySelector("span").style.transform = `translateY(${((1 - eo(u)) * 110).toFixed(1)}%)`;
    e.querySelector("i").style.width = `${(smoother(prog(t, a + 0.25, a + 0.75)) * 100).toFixed(1)}%`;
  });
  show($("#notif"), !!sh.notif);
  if (sh.notif) T.notif.forEach((tn, k) => { const u = prog(t, tn, tn + 0.35); $("#nt" + k).style.opacity = smoother(u); $("#nt" + k).style.transform = `translateX(${((1 - eo(u)) * 60).toFixed(1)}px)`; });
  // the overwhelm: five sheets with five different numbers; quick cutaways
  show($("#sheets"), !!sh.sheets);
  if (sh.sheets) [0, 1, 2, 3, 4].forEach((k) => {
    const e = $("#sh" + k);
    const u = prog(t, C[8].s + k * 0.35, C[8].s + k * 0.35 + 0.4);
    const a = (k / 5) * Math.PI * 2 + t * 0.15;
    e.style.left = 960 + Math.cos(a) * 640 - 140 + "px";
    e.style.top = 520 + Math.sin(a) * 300 - 60 + "px";
    e.style.opacity = smoother(u) * 0.95;
    e.style.transform = `rotate(${((k - 2) * 4 + Math.sin(t + k) * 2).toFixed(1)}deg) scale(${(0.85 + 0.15 * back(u)).toFixed(3)})`;
  });
  [0, 1, 2, 3, 4].forEach((k) => {
    const on = sh.cutCard === k;
    const e = $("#cut" + k);
    show(e, on, "flex");
    if (on) { const u = prog(t, sh.t0, sh.t0 + 0.25); e.style.opacity = smoother(u); e.firstChild && (e.firstChild.style.transform = `scale(${(1.08 - 0.08 * eo(u)).toFixed(3)}) rotate(${((k % 2 ? -2 : 2)).toFixed(1)}deg)`); }
  });
  // islands
  show($("#isl"), !!sh.islands);
  if (sh.islands) {
    ISLES.forEach((_, k) => pop($("#is" + k), t, T.islands + 0.2 + k * 0.12, 20));
    [0, 1, 2, 3, 4, 5, 6].forEach((k) => {
      const br = t >= T.broken;
      $$("il" + k).setAttribute("stroke", br ? "#ef4444" : "#94a3b8");
      $$("il" + k).style.opacity = br ? (Math.sin(t * 20 + k) > 0 ? 0.9 : 0.3) * (1 - prog(t, T.broken + 1.2, T.broken + 1.8)) + 0.15 : 0.7;
      const x = $("#ix" + k);
      x.style.opacity = br ? smoother(prog(t, T.broken + k * 0.08, T.broken + 0.3 + k * 0.08)) : 0;
    });
  }
  // the hub
  const rp = prog(t, T.hub - 0.3, T.hub + 0.7);
  $("#ripple").style.opacity = rp > 0 && rp < 1 ? (1 - rp) * 0.9 : 0;
  $("#ripple").style.transform = `translate(-50%,-50%) scale(${(0.1 + rp * 3.2).toFixed(3)})`;
  show($("#hubv"), !!sh.hub);
  if (sh.hub) {
    const lg = prog(t, T.logo, T.logo + 0.6);
    $("#hubc").style.opacity = smoother(lg);
    $("#hubc").style.transform = `translate(-50%,-50%) scale(${(0.8 + 0.2 * back(lg)).toFixed(3)})`;
    MODS.forEach((_, k) => {
      pop($("#mt" + k), t, T.ring + k * 0.12, 16);
      const d = smoother(prog(t, T.ring + k * 0.12, T.ring + 0.5 + k * 0.12));
      $$("hl" + k).setAttribute("stroke-dashoffset", (460 * (1 - d)).toFixed(0));
      const ph = t >= T.spokes ? ((t - T.spokes) * 0.8 + k * 0.11) % 1 : -1;
      const a = -Math.PI / 2 + (k / MODS.length) * Math.PI * 2;
      $$("hd" + k).setAttribute("cx", (960 + Math.cos(a) * 400 * (1 - Math.max(0, ph))).toFixed(1));
      $$("hd" + k).setAttribute("cy", (560 + Math.sin(a) * 330 * (1 - Math.max(0, ph))).toFixed(1));
      $$("hd" + k).setAttribute("opacity", ph >= 0 ? Math.sin(Math.PI * ph).toFixed(2) : 0);
    });
  }
  // before flashes and solution panels
  SOLS.forEach((so) => {
    const bf = $("#bf" + so.k);
    const bOn = sh.beforeOf === so;
    bf.style.opacity = bOn ? win(t, so.before + 0.05, so.sol, 0.2) : 0;
    bf.style.transform = `translate(-50%,0) scale(${bOn ? (0.9 + 0.1 * back(prog(t, so.before, so.before + 0.3))).toFixed(3) : 1})`;
    const sp = $("#sp" + so.k);
    const sOn = sh.solOf === so;
    show(sp, sOn);
    show($$("x" + so.who), sOn, "inline");
    if (so.k === 16) show($$("xadm"), sOn, "inline");
    if (!sOn) return;
    const u = prog(t, so.sol, so.sol + 0.6);
    sp.style.opacity = smoother(u);
    sp.style.transform = `translateX(${((1 - eo(u)) * 60).toFixed(1)}px)`;
    const P = PANELS[so.k];
    const last = [];
    (P.rows || []).forEach(([, , , w], n) => {
      const tw = CW(so.k, w, 0, -0.15);
      last.push(tw);
      pop($("#pr" + so.k + "_" + n), t, tw, 14, 0.35);
      $("#pr" + so.k + "_" + n).classList.toggle("on", t >= tw + 0.5);
      // numbers count up; the row's bar fills
      const span = $("#prt" + so.k + "_" + n);
      const c = smoother(prog(t, tw + 0.05, tw + 0.9));
      put(span, span.dataset.t.replace(/\d+/g, (d) => String(Math.round(+d * c))));
      $("#pb" + so.k + "_" + n).style.width = (c * 100).toFixed(1) + "%";
    });
    let lit = -1;
    (P.flow || []).forEach(([, w], n) => { const tw = CW(so.k, w, 0, -0.15); last.push(tw); pop($("#fs" + so.k + "_" + n), t, tw, 12, 0.3); $("#fs" + so.k + "_" + n).classList.toggle("on", t >= tw); if (t >= tw) lit = n; });
    if (P.flow) {
      // a data dot runs along the lit part of the flow, again and again
      const d = $("#fd" + so.k);
      const a0 = $("#fs" + so.k + "_0"), a1 = $("#fs" + so.k + "_" + Math.max(0, lit));
      const x0 = a0.offsetLeft + a0.offsetWidth / 2, x1 = a1.offsetLeft + a1.offsetWidth / 2;
      const ph = (t * 0.9) % 1;
      d.style.left = lerp(x0, x1, ph).toFixed(1) + "px";
      d.style.top = a0.offsetTop + a0.offsetHeight + 10 + "px";
      d.style.opacity = lit > 0 ? Math.sin(Math.PI * ph).toFixed(2) : 0;
    }
    (P.flow2 || []).forEach(([, w], n) => { const tw = CW(so.k, w, 0, -0.15); last.push(tw); pop($("#fs2" + so.k + "_" + n), t, tw, 12, 0.3); $("#fs2" + so.k + "_" + n).classList.toggle("on", t >= tw); });
    (P.tiles || []).forEach(([, , , w], n) => { const tw = CW(so.k, w, 0, -0.15); last.push(tw); pop($("#tl" + so.k + "_" + n), t, tw, 14, 0.35); });
    (P.chain || []).forEach(([, , w], n) => { const tw = CW(so.k, w, 0, -0.15); last.push(tw); pop($("#ch" + so.k + "_" + n), t, tw, 12, 0.3); });
    // solved: a green stamp and a ring burst once everything is on the panel
    const tsv = Math.max(...last) + 0.7;
    so.solved = tsv;
    const sv = prog(t, tsv, tsv + 0.4);
    $("#sv" + so.k).style.opacity = smoother(sv);
    $("#sv" + so.k).style.transform = `rotate(-8deg) scale(${(1.6 - 0.6 * back(sv)).toFixed(3)})`;
    const br = prog(t, tsv, tsv + 0.8);
    $("#bu" + so.k).style.opacity = br > 0 && br < 1 ? (1 - br).toFixed(2) : 0;
    $("#bu" + so.k).style.transform = `scale(${(0.4 + br * 1.8).toFixed(3)})`;
    // the person, now relaxed
    const pid = "x" + so.who + "P";
    arm(pid, 1, -25 + Math.sin(t * 1.5) * 4);
    arm(pid, -1, 25);
    face(pid, t, { smile: 1, look: 0.8 });
    head(pid, 0, -3);
    if (so.k === 16) { arm("xadmP", 1, -20); arm("xadmP", -1, 20); face("xadmP", t, { smile: 1, look: 0.6 }); }
  });
  show($("#xp"), !!sh.solOf);
  if (sh.solOf) { const u = smoother(prog(t, sh.solOf.sol, sh.solOf.sol + 0.6)); $("#xp").style.opacity = u; $("#xp").style.transform = `translateX(${((1 - u) * -50).toFixed(1)}px)`; }
  // Synax AI
  show($("#ai"), !!sh.ai);
  if (sh.ai) {
    const q = "Which challans are past their return date?";
    put($("#aiqt"), q.slice(0, Math.floor(q.length * prog(t, T.ai + 0.3, T.ai + 2.2))));
    pop($("#aiq"), t, T.ai + 0.2, 14);
    pop($("#aia"), t, T.aiAns, 16);
    pop($("#aig"), t, T.aiProp, 16);
    const ok = t >= T.aiOk + 0.08;
    $("#aiap").classList.toggle("pressed", t >= T.aiOk && t < T.aiOk + 0.2);
    $("#aid").style.opacity = smoother(prog(t, T.aiOk + 0.1, T.aiOk + 0.45));
    $("#aig").classList.toggle("done", ok);
    const ap = $("#aiap").getBoundingClientRect();
    const tx = ap.left + ap.width * 0.5, ty = ap.top + ap.height * 0.55;
    const m = smoother(prog(t, T.aiOk - 1.0, T.aiOk - 0.1));
    const cur = $("#aicur");
    cur.style.opacity = win(t, T.aiOk - 1.2, T.aiOk + 1.2, 0.3);
    cur.style.transform = `translate(${lerp(tx + 260, tx, m).toFixed(1)}px,${lerp(ty + 180, ty, m).toFixed(1)}px) scale(${t >= T.aiOk && t < T.aiOk + 0.15 ? 0.86 : 1})`;
  }
  // end card
  const ec = sh.endcard ? smoother(prog(t, T.end, T.end + 0.7)) : 0;
  $("#end").style.opacity = ec;
  const e1 = prog(t, CW(19, "From", 0, -0.1), CW(19, "From", 0, 0.6)), e2 = prog(t, CW(19, "Synax", 0, -0.2), CW(19, "Synax", 0, 0.5));
  $("#endLogo").style.opacity = smoother(prog(t, T.end + 0.2, T.end + 0.9));
  $("#endT").style.opacity = smoother(e1);
  $("#endT").style.transform = `translateY(${((1 - eo(e1)) * 20).toFixed(1)}px)`;
  $("#endS").style.opacity = smoother(e2);
  $("#endS").style.transform = `translateY(${((1 - eo(e2)) * 16).toFixed(1)}px)`;
  $("#fade0").style.opacity = 1 - smoother(prog(t, 0, 0.35));
  $("#fadeEnd").style.opacity = smoother(prog(t, TOTAL - 0.6, TOTAL));
}

/* ---------- sound cues ---------- */
function cues() {
  [0.15, 0.95, 1.75, 2.55].forEach((d) => sfx(d, "buzz", 0.32));
  sfx(0, "clockt", 0.25);
  T.notif.forEach((tn) => sfx(tn, "ping", 0.12));
  CALLS.forEach(([k], n) => { sfx(C[k].s - 0.35, n % 2 ? "phone2" : "squelch", 0.18); sfx(C[k].s - 0.3, "hit", 0.18 + n * 0.02); });
  sfx(C[4].s - 0.3, "alarm", 0.18);
  sfx(C[8].s, "riser", 0.2);
  T.cut.forEach((tc) => sfx(tc, "hit", 0.32));
  sfx(T.islands, "whoosh", 0.25);
  sfx(T.broken, "glitch", 0.3);
  sfx(T.hub - 1.2, "riser", 0.4);
  sfx(T.hub, "logo", 0.5);
  MODS.forEach((_, k) => sfx(T.ring + k * 0.12, "pop", 0.14));
  SOLS.forEach((s) => { sfx(s.before, "whip", 0.3); sfx(s.before + 0.05, "error", 0.18); sfx(s.sol, "whoosh", 0.24); });
  CALLS.forEach(([k]) => sfx(C[k].s - 0.3, "whip", 0.28));
  T.cut.forEach((tc) => sfx(tc, "whip", 0.26));
  TITLES.forEach(([a]) => sfx(a, "hit", 0.32));
  Object.entries(PANELS).forEach(([k, P]) => [...(P.rows || []).map((r) => r[3]), ...(P.flow || []).map((r) => r[1]), ...(P.flow2 || []).map((r) => r[1]), ...(P.tiles || []).map((r) => r[3]), ...(P.chain || []).map((r) => r[2])].forEach((w) => sfx(CW(+k, w, 0, -0.15), "pop", 0.14)));
  for (let i = 0; i < 18; i++) sfx(T.ai + 0.3 + i * 0.1, "tick", 0.08);
  sfx(T.aiAns, "ping", 0.2);
  sfx(T.aiProp, "ping", 0.2);
  sfx(T.aiOk, "click", 0.32);
  sfx(T.aiOk + 0.1, "okbeep", 0.28);
  sfx(T.calm, "whoosh", 0.22);
  sfx(T.end, "logo", 0.45);
  sfx(CW(19, "Synax", 0, -0.1), "endchime", 0.4);
}

async function boot() {
  try {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
    buildSets();
    buildOverlays();
    cues();
    window.__apply = apply;
    window.__total = TOTAL;
    window.__T = T;
    window.__C = C;
    window.__SOLS = SOLS;
    window.__titles = TITLES;
    window.__shots = SHOTS.map((s) => [s.t0, s.set, s.mode, s.who || "", !!(s.solOf || s.hub || s.ai || s.endcard || s.cutCard !== undefined || s.islands)]);
    window.__meta = {
      total: TOTAL, clips: C.map((c) => c.file), sfx: SFX.sort((a, b) => a[0] - b[0]),
      music: { tension: [0, T.hub - 0.4], resolve: [T.hub - 0.4, TOTAL], swell: [C[1].s, T.hub] }, cuts: SHOTS.map((s) => s.t0),
    };
    window.__ready = true;
    apply(0);
  } catch (e) {
    window.__err = e.stack || String(e);
  }
}
boot();
