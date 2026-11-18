/* "One Small Mistake. An Entire Production Line at Risk." The manufacturing crisis film, drawn as a pure function of time.
   2.5D: every set is split into depth layers moved with parallax by a virtual camera; lighting is done with overlays
   (red alarm, flashback sepia, cool investigation, clean blue-white). Shots are cut on narration words.
   Scenes: 0 emergency, 1 chaos, 2 quality failure, 3 flashback (the manual mistake), 4 consequences, 5 investigation,
   6 turning point (Synax ERP), 7 manufacturing with Synax, 8 transformation, 9 brand close. */
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
const tf = (el, x, y, s = 1, o = 1) => {
  el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${s.toFixed(4)})`;
  el.style.opacity = clamp(o).toFixed(3);
};
const show = (el, on, d = "block") => (el.style.display = on ? d : "none");

/* ---------- timing ---------- */
const LEADS = [4.0, 0.2, 0.2, 0.7, 0.4, 0.2, 0.2, 0.2, 0.3, 0.4]; // the film opens on sound alone; the flashback gets a beat
const TAILS = [0.5, 0.4, 1.4, 0.4, 0.6, 0.5, 0.6, 0.8, 0.6, 1.6];
const D = DUR.map((d, i) => LEADS[i] + d + TAILS[i]);
const S = [0];
D.forEach((d, i) => S.push(S[i] + d));
const TOTAL = S[D.length];
const at = (i, r) => S[i] + LEADS[i] + r;
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
function W(i, word, nth = 0, off = 0) {
  const ws = WORDS[i].filter((x) => norm(x.w) === norm(word));
  if (!ws.length) throw new Error("word not found: " + i + " " + word);
  return at(i, ws[Math.min(nth, ws.length - 1)].t + off);
}
const SFX = [];
const sfx = (t, n, g = 0.3) => SFX.push([+t.toFixed(3), n, g]);

/* ---------- key moments ---------- */
const T = {
  vib: 1.6, sparks: 2.0, alarm: 2.4, estop: 3.1, stop: 3.3, spunDown: 4.4,
  convStop: W(1, "quiet", 0, 0.2), pileFrom: W(1, "Parts", 0, -0.6), pmIn: S[1] + 0.2, stopSign: W(1, "Nobody", 0, 0.0),
  measure: W(2, "quality", 0, -0.1), read: W(2, "finds", 0, 0.35), alertQi: W(2, "Not", 0, 0.2), sort: W(2, "whole", 0, -0.2), report: S[3] - 1.0,
  fb: S[3] + 0.05, write0: W(3, "Twenty", 1, -0.05), write1: W(3, "five", 1, 0.25), mark: W(3, "five", 1, 0.45), toTray: W(3, "noticed", 0, 0.2), keyIn: W(3, "exactly", 0, -0.4), fbEnd: S[4],
  cons: [W(4, "Machine", 0, -0.1), W(4, "Material", 0, -0.1), W(4, "schedule", 0, -0.1), W(4, "delivery", 0, -0.1)],
  islands: W(5, "Every", 0, -0.1), ring: S[5] + 1.2,
  disconnected: W(6, "disconnected", 0, -0.1), synax: W(6, "Synax", 0, -0.55), logo: W(6, "Synax", 0, 0.0), nodes: W(6, "connects", 0, -0.1),
  p1: W(7, "Production", 0, -0.2), dims: W(7, "dimensions", 0, -0.1), approved: W(7, "approved", 0, -0.1), p2: W(7, "Route", 0, -0.25), ops: [W(7, "machine", 0, -0.1), W(7, "inspections", 0, -0.1), W(7, "live", 0, -0.1)],
  p3: W(7, "Dashboards", 0, -0.25), p4: W(7, "and", 2, -0.1), links: [W(7, "order", 1, -0.1), W(7, "material", 0, -0.1), W(7, "machine", 1, -0.1), W(7, "operator", 0, -0.1)],
  okRead: W(8, "Problems", 0, 0.4), end: S[9] + 0.15,
};

/* ---------- sets and layers ---------- */
// parallax factor per layer, per set
const SETS = {
  factory: { p: [0.62, 0.86, 1] },
  qc: { p: [0.7, 1, 1] },
  office: { p: [0.75, 1, 1] },
  plant: { p: [0.85, 1, 1] },
};
const PEOPLE = []; // [set, layer, id, cast, x, y, s, front]
function addPerson(set, layer, id, cast, x, y, s, front) {
  PEOPLE.push({ set, layer, id, cast, x, y, s, front });
}
addPerson("factory", 1, "fw1", "w1", 330, 885, 0.62);
addPerson("factory", 1, "fw2", "w2", 660, 885, 0.62);
addPerson("factory", 2, "fop", "op", 960, 960, 0.95);
addPerson("factory", 2, "fpm", "pm", 560, 1010, 1.0, "tablet");
addPerson("qc", 2, "qqi", "qi", 900, 880, 1.0);
addPerson("qc", 2, "qpm", "pm", 1720, 1010, 1.0, "report");
addPerson("office", 1, "ope", "pe", 790, 842, 1.0);
addPerson("plant", 2, "ppe", "pe", 330, 1000, 1.0);
addPerson("plant", 2, "pqi", "qi", 720, 1000, 1.0, "binder");
addPerson("plant", 2, "pop", "op", 1260, 1000, 1.0, "clipboard");
addPerson("plant", 2, "ppm", "pm", 990, 1060, 1.12, "phone");

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
      // people stand behind the fg furniture in the office and QC sets, in front of it on the factory floor
      const inner = name === "factory" ? set[ln]() + ppl : name === "office" && li === 1 ? set[ln]() + ppl : ppl + set[ln]();
      d.innerHTML = `<svg viewBox="0 0 1920 1080" width="1920" height="1080" overflow="visible">${inner}</svg>`;
      g.appendChild(d);
      return d;
    });
    host.appendChild(g);
    cfg.el = g;
  }
  // the employee's pen
  const aR = $$("opeP_aR");
  aR.insertAdjacentHTML("beforeend", `<g transform="translate(0,138) rotate(-30)"><rect x="-4" y="-34" width="8" height="46" rx="3" fill="#1e3a8a"/><path d="M-4,12 L4,12 L0,22Z" fill="#334155"/></g>`);
  // gloves on the caliper (the inspector's hands)
  $$("qCal").insertAdjacentHTML("beforeend", `<circle cx="842" cy="672" r="18" fill="#60a5fa"/><g id="qHandR"><circle cx="915" cy="672" r="18" fill="#60a5fa"/></g>`);
}

/* ---------- characters per frame ---------- */
function face(pid, c, o) {
  const { talk = 0, mood = 0, look = 0, shock = 0, smile = 0 } = o;
  const m = talk ? 0.5 + 0.5 * Math.sin(c * 17 + pid.length) : 0;
  const open = Math.max(talk ? 2 + m * 7 : 0, shock * 9);
  setA($$(pid + "_talk"), "opacity", open > 0.5 ? 1 : 0);
  setA($$(pid + "_talk"), "ry", open.toFixed(1));
  setA($$(pid + "_talk"), "rx", (10 - shock * 2).toFixed(1));
  setA($$(pid + "_smile"), "opacity", open <= 0.5 && (smile > 0.5 || mood < 0.3) ? 1 : 0);
  setA($$(pid + "_frown"), "opacity", open <= 0.5 && smile <= 0.5 && mood >= 0.6 ? 1 : 0);
  setA($$(pid + "_flat"), "opacity", open <= 0.5 && smile <= 0.5 && mood >= 0.3 && mood < 0.6 ? 1 : 0);
  const up = shock * 7 + mood * 3;
  setA($$(pid + "_bl"), "transform", `rotate(${(mood * -9 + shock * 4).toFixed(1)} -18 -19) translate(0 ${(-up).toFixed(1)})`);
  setA($$(pid + "_br"), "transform", `rotate(${(mood * 9 - shock * 4).toFixed(1)} 18 -19) translate(0 ${(-up).toFixed(1)})`);
  const blink = ((c + pid.length * 0.7) % 3.4) < 0.13 && shock < 0.5 ? 0.92 : 0;
  setA($$(pid + "_eyes"), "transform", `translate(0 -3) scale(${(1 + shock * 0.12).toFixed(3)} ${((1 - blink) * (1 + shock * 0.18)).toFixed(3)}) translate(0 3)`);
  setA($$(pid + "_pl"), "cx", (-17 + look * 3.2).toFixed(1));
  setA($$(pid + "_pr"), "cx", (17 + look * 3.2).toFixed(1));
  setA($$(pid + "_pl"), "r", (4.8 - shock * 1.3).toFixed(2));
  setA($$(pid + "_pr"), "r", (4.8 - shock * 1.3).toFixed(2));
}
const arm = (pid, side, a) => setA($$(pid + "_a" + (side < 0 ? "L" : "R")), "transform", `translate(${side * 72},-298) rotate(${a.toFixed(1)})`);
const head = (pid, dx, rot) => setA($$(pid + "_head"), "transform", `translate(${dx.toFixed(1)},-376) rotate(${rot.toFixed(1)} 0 46)`);
const place = (id, x, y, s, flip = 1) => setA($$(id), "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(s * flip).toFixed(3)},${s.toFixed(3)})`);
const bobY = (t, k) => Math.sin(t * 2.1 + k) * 2;

/* ---------- factory state ---------- */
const PARTS = Array.from({ length: 12 }, (_, i) => i);
function factory(t, mode) {
  const crisis = mode === "crisis" || mode === "flash";
  const clean = mode === "clean";
  const stopped = crisis && t >= T.stop;
  // machine 4: spindle speed, vibration, sparks, tower lights, screen
  const spd = clean ? 1 : t < T.stop ? 1 : 1 - smoother(prog(t, T.stop, T.spunDown));
  const vib = clean || mode === "flash" ? 0 : prog(t, T.vib, T.sparks + 0.5) * (1 - prog(t, T.stop, T.stop + 0.6));
  const ang = t * 38 * (clean ? 1 : spd > 0 ? 1 : 0) - (t >= T.stop && !clean ? (t - T.stop) * 25 * (1 - spd) : 0);
  [0, 1, 2].forEach((k) => {
    const ph = ang + (k * Math.PI * 2) / 3;
    setA($$("fJ" + k), "y", (520 + Math.sin(ph) * 60).toFixed(1));
    setA($$("fJ" + k), "opacity", (0.35 + 0.65 * Math.max(0, Math.cos(ph))).toFixed(2));
  });
  [0, 1, 2, 3, 4, 5].forEach((k) => setA($$("fSm" + k), "opacity", (0.25 + 0.35 * Math.abs(Math.sin(ang * 1.3 + k))).toFixed(2)));
  const sx = vib * noise(t * 2.2, 1) * 6, sy = vib * noise(t * 2.5, 3) * 4;
  setA($$("fM4body"), "transform", `translate(${sx.toFixed(1)},${sy.toFixed(1)})`);
  setA($$("fTool"), "transform", `translate(${(vib * noise(t * 3, 5) * 5).toFixed(1)},${(vib * noise(t * 3.3, 7) * 6).toFixed(1)})`);
  setA($$("fCool"), "opacity", clean || t < T.stop ? 1 : 1 - prog(t, T.stop, T.stop + 0.4));
  const alarm = crisis && mode !== "flash" && t >= T.alarm;
  const blinkR = alarm ? (Math.sin(t * 9) > 0 ? 1 : 0.25) : 0;
  setA($$("fTR"), "opacity", blinkR.toFixed(2));
  setA($$("fTRglow"), "opacity", (blinkR * 0.9).toFixed(2));
  setA($$("fTA"), "opacity", crisis && mode !== "flash" && t >= T.vib && t < T.alarm ? 1 : 0);
  setA($$("fTG"), "opacity", clean || mode === "flash" || t < T.vib ? 1 : 0);
  // panel screen
  let scr;
  if (mode === "flash") scr = `<text x="1113" y="466" text-anchor="middle" font-size="15" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">JOB SET-UP</text><text x="1113" y="504" text-anchor="middle" font-size="26" font-weight="800" fill="#e2e8f0" font-family="Inter,sans-serif">${t >= T.keyIn ? "Ø 24.50" : "Ø " + "24.50".slice(0, Math.max(0, Math.floor((t - T.keyIn + 0.6) * 9)))}</text>`;
  else if (clean) scr = `<text x="1113" y="464" text-anchor="middle" font-size="14" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">ROUTE CARD · OP 10</text><text x="1113" y="498" text-anchor="middle" font-size="24" font-weight="800" fill="#86efac" font-family="Inter,sans-serif">Ø 25.40 ✓</text><text x="1113" y="516" text-anchor="middle" font-size="11" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">from part master</text>`;
  else if (alarm) scr = `<rect x="1044" y="434" width="138" height="92" rx="6" fill="${Math.sin(t * 9) > 0 ? "#7f1d1d" : "#450a0a"}"/><text x="1113" y="472" text-anchor="middle" font-size="22" font-weight="800" fill="#fecaca" font-family="Inter,sans-serif">ALARM</text><text x="1113" y="500" text-anchor="middle" font-size="13" font-weight="700" fill="#fecaca" font-family="Inter,sans-serif">SPINDLE LOAD 142%</text>`;
  else scr = `<text x="1113" y="466" text-anchor="middle" font-size="15" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">RUNNING</text><text x="1113" y="502" text-anchor="middle" font-size="24" font-weight="800" fill="#e2e8f0" font-family="Inter,sans-serif">${(2400 * spd).toFixed(0)} rpm</text>`;
  put($$("fScreen"), scr);
  const press = crisis && mode !== "flash" ? Math.sin(Math.PI * prog(t, T.estop, T.estop + 0.25)) : 0;
  setA($$("fEstop"), "transform", `translate(0 ${(press * 4).toFixed(1)})`);
  // sparks: streaks flying from the tool tip while the machine chatters
  const sparkOn = crisis && mode !== "flash" && t >= T.sparks && t < T.stop + 0.5;
  for (let i = 0; i < 36; i++) {
    const e = $$("fSk" + i);
    if (!sparkOn) { setA(e, "opacity", 0); continue; }
    const life = 0.35 + hash(i, 3) * 0.3;
    const ph = ((t - T.sparks) / life + hash(i, 4)) % 1;
    const a = -Math.PI * (0.15 + hash(i, 5) * 0.7) + (hash(i, 6) - 0.5) * 0.6;
    const v = 220 + hash(i, 7) * 260;
    const x0 = 1477, y0 = 524;
    const x = x0 + Math.cos(a) * v * ph * life * 3, y = y0 + Math.sin(a) * v * ph * life * 3 + 400 * (ph * life) * (ph * life) * 3;
    const tail = 0.06;
    const xt = x0 + Math.cos(a) * v * Math.max(0, ph - tail) * life * 3, yt = y0 + Math.sin(a) * v * Math.max(0, ph - tail) * life * 3 + 400 * Math.pow(Math.max(0, ph - tail) * life, 2) * 3;
    const fade = 1 - prog(t, T.stop, T.stop + 0.5);
    setA(e, "x1", xt.toFixed(1)); setA(e, "y1", yt.toFixed(1)); setA(e, "x2", x.toFixed(1)); setA(e, "y2", y.toFixed(1));
    setA(e, "opacity", ((1 - ph) * fade * (hash(i, 8) > 0.2 ? 1 : 0.5)).toFixed(2));
  }
  for (let i = 0; i < 8; i++) {
    const e = $$("fSmk" + i);
    const on = crisis && mode !== "flash" && t >= T.stop + 0.2;
    if (!on) { setA(e, "opacity", 0); continue; }
    const ph = ((t - T.stop - 0.2) * 0.35 + i / 8) % 1;
    setA(e, "cx", (1470 + Math.sin(ph * 5 + i) * 30 + ph * 40).toFixed(1));
    setA(e, "cy", (510 - ph * 170).toFixed(1));
    setA(e, "r", (14 + ph * 40).toFixed(1));
    setA(e, "opacity", (Math.sin(Math.PI * ph) * 0.28 * prog(t, T.stop + 0.2, T.stop + 1)).toFixed(2));
  }
  // machines 1-3: green, then amber once the line stops
  [1, 2, 3].forEach((k) => setA($$("fM" + k + "L"), "fill", crisis && mode !== "flash" && t >= T.convStop - 0.6 ? "#facc15" : "#22c55e"));
  // conveyor: parts move; the line slows and stops; parts pile up at the end
  const v = clean || mode === "flash" ? 1 : t < T.convStop - 1.2 ? 1 : 1 - smoother(prog(t, T.convStop - 1.2, T.convStop));
  const dist = clean || mode === "flash" ? t * 90 : t < T.convStop - 1.2 ? t * 90 : (T.convStop - 1.2) * 90 + 90 * 1.2 * 0.5 * smoother(prog(t, T.convStop - 1.2, T.convStop)) * 2;
  PARTS.forEach((i) => {
    const x = ((dist + i * 100) % 1200) - 80;
    setA($$("fP" + i), "transform", `translate(${x.toFixed(1)},806)`);
  });
  const piled = crisis && mode !== "flash" ? Math.floor(16 * smoother(prog(t, T.pileFrom, T.pileFrom + 3.2))) : clean ? 3 : 2;
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 5), col = i % 5;
    const e = $$("fPl" + i);
    setA(e, "opacity", i < piled ? 1 : 0);
    setA(e, "transform", `translate(${(22 + col * 22 + row * 9).toFixed(1)},${(38 - row * 15).toFixed(1)}) rotate(${((hash(i, 9) - 0.5) * 40).toFixed(1)})`);
  }
  // people
  const shocked = crisis && mode !== "flash" ? prog(t, T.stop + 0.4, T.stop + 0.8) : 0;
  {
    const k = "fopP";
    const reach = crisis && mode !== "flash" ? Math.min(prog(t, T.estop - 0.45, T.estop - 0.1), 1 - prog(t, T.estop + 0.7, T.estop + 1.2)) : 0;
    const back0 = shocked * (1 - prog(t, S[1] + 2, S[1] + 3));
    arm(k, 1, mode === "flash" ? -105 + Math.sin(t * 6) * 4 * prog(t, T.keyIn - 0.6, T.keyIn) : clean ? -100 + Math.sin(t * 2) * 6 : lerp(-10, -117, smoother(reach)) - back0 * 40);
    arm(k, -1, mode === "flash" ? 40 : clean ? 12 : 10 + back0 * 50);
    face(k, t, { shock: shocked * (1 - prog(t, S[2], S[2] + 1)), mood: crisis ? 0.7 : 0, look: clean || mode === "flash" ? 0.9 : 0.7, smile: clean ? 1 : 0 });
    head(k, 0, clean ? 2 : -shocked * 6);
    place("fop", 960 - back0 * 40, 960 + bobY(t, 1), 0.95);
  }
  [["fw1", 330, 0], ["fw2", 660, 1]].forEach(([id, x0, k]) => {
    const pid = id + "P";
    const run = crisis && mode !== "flash" ? smoother(prog(t, S[1] + 0.2 + k * 0.3, S[1] + 2.6 + k * 0.3)) : 0;
    const x = x0 + run * (760 - x0 + k * 40);
    const walking = run > 0 && run < 1;
    place(id, x, 885 + bobY(t, k) - (walking ? Math.abs(Math.sin(t * 11 + k)) * 8 : 0), 0.62);
    arm(pid, 1, clean ? -60 + Math.sin(t * 3 + k) * 12 : walking ? Math.sin(t * 11 + k) * 30 : crisis && t > T.alarm ? -30 : -55 + Math.sin(t * 2.5 + k) * 10);
    arm(pid, -1, walking ? -Math.sin(t * 11 + k) * 30 : 20);
    face(pid, t, { shock: crisis && mode !== "flash" ? prog(t, T.stop + 0.6, T.stop + 1.2) : 0, look: crisis && mode !== "flash" && t > T.alarm ? 0.9 : 0, smile: clean ? 1 : 0, mood: crisis ? 0.6 : 0 });
  });
  {
    const pid = "fpmP";
    const inU = clean ? 1 : crisis && mode !== "flash" ? smoother(prog(t, T.pmIn, T.pmIn + 2.0)) : 0;
    const walking = !clean && inU > 0 && inU < 1;
    show($$("fpm"), inU > 0, "inline");
    const x = clean ? 560 + Math.sin(t * 0.4) * 30 : lerp(-180, 600, inU);
    place("fpm", x, 1010 + bobY(t, 2) - (walking ? Math.abs(Math.sin(t * 10)) * 8 : 0), 1.0);
    const sign = crisis && mode !== "flash" ? smoother(prog(t, T.stopSign - 0.2, T.stopSign + 0.15)) * (1 - prog(t, S[2] - 0.6, S[2])) : 0;
    arm(pid, 1, clean ? -25 : -10 - sign * 150);
    arm(pid, -1, clean ? 25 : walking ? Math.sin(t * 10) * 20 : 15);
    setA($$("fpmP_front"), "opacity", clean ? 1 : 0);
    face(pid, t, { talk: sign > 0.5 && t < T.stopSign + 1.0 ? 1 : 0, mood: crisis ? 0.8 : 0, smile: clean ? 1 : 0, look: clean ? -0.3 : 0.8 });
    head(pid, 0, clean ? -3 : 0);
  }
}

/* ---------- QC bench ---------- */
const LCD = (t, mode) => {
  if (mode === "clean") return { v: t >= T.okRead ? "25.40" : (25.4 * smoother(prog(t, T.okRead - 0.7, T.okRead))).toFixed(2), bad: false, ok: t >= T.okRead };
  if (t < T.measure) return { v: "0.00", bad: false };
  const u = smoother(prog(t, T.measure, T.read));
  return { v: t >= T.read ? "24.50" : (24.5 * u + 30 * (1 - u)).toFixed(2), bad: t >= T.read };
};
function qc(t, mode) {
  const clean = mode === "clean";
  const l = LCD(t, mode);
  const lcd = $$("qLCD");
  if (lcd.textContent !== l.v) lcd.textContent = l.v;
  setA(lcd, "fill", l.bad ? (Math.sin(t * 8) > -0.3 ? "#b91c1c" : "#0f2347") : l.ok ? "#15803d" : "#0f2347");
  // the moving jaw closes on the part
  const close = clean ? smoother(prog(t, T.okRead - 0.8, T.okRead - 0.2)) : smoother(prog(t, T.measure - 0.2, T.measure + 0.5));
  setA($$("qJaw"), "transform", `translate(${(70 * (1 - close)).toFixed(1)},0)`);
  setA($$("qHandR"), "transform", `translate(${(70 * (1 - close)).toFixed(1)},0)`);
  // shafts: from the tray into the reject bin (crisis) or the OK bin (clean)
  for (let i = 0; i < 6; i++) {
    const e = $$("qS" + i);
    const t0 = (clean ? T.okRead + 0.4 : T.sort) + i * 0.32;
    const u = clean ? (i === 0 ? smoother(prog(t, t0, t0 + 0.7)) : 0) : smoother(prog(t, t0, t0 + 0.55));
    const bx = clean ? 385 : 605, by = 600 + (i % 3) * 8;
    const x0 = 1094 + (i % 3) * 104 + 48, y0 = 600 - Math.floor(i / 3) * 18;
    const x = lerp(x0, bx, u), y = lerp(y0, by, u) - Math.sin(Math.PI * u) * 120;
    setA(e, "transform", `translate(${(x - x0).toFixed(1)},${(y - y0).toFixed(1)}) rotate(${(u * (hash(i, 2) - 0.5) * 120).toFixed(1)} ${x0} ${y0 + 10})`);
    setA(e, "opacity", u >= 1 && !clean ? 0.9 : 1);
  }
  // inspector
  const pid = "qqiP";
  const shock = clean ? 0 : prog(t, T.read + 0.2, T.read + 0.5);
  const wave = clean ? 0 : Math.min(prog(t, T.alertQi - 0.2, T.alertQi + 0.2), 1 - prog(t, T.sort - 0.2, T.sort + 0.2));
  arm(pid, -1, 40 + wave * (110 + Math.sin(t * 9) * 15));
  arm(pid, 1, -40);
  face(pid, t, { shock: shock * (1 - wave * 0.4) * (t < S[4] ? 1 : 0.3), mood: clean ? 0 : t > T.read ? 0.8 : 0.2, talk: wave > 0.5 ? 1 : 0, smile: clean && t > T.okRead ? 1 : 0, look: wave > 0.3 ? 0.9 : -0.2 });
  head(pid, 0, wave * 6 + (clean ? 0 : -shock * 4));
  place("qqi", 900, 880 + bobY(t, 3), 1.0);
  // manager with the report
  const pm = "qpmP";
  const pmOn = !clean && t >= T.report - 0.6;
  show($$("qpm"), pmOn, "inline");
  arm(pm, -1, 30);
  arm(pm, 1, -10);
  face(pm, t, { mood: 0.9, shock: prog(t, T.report, T.report + 0.4) * (1 - prog(t, T.report + 1.4, T.report + 2)), look: -0.5 });
  place("qpm", 1720, 1010 + bobY(t, 4), 1.0);
}

/* ---------- office (flashback) ---------- */
function office(t) {
  const pid = "opeP";
  const writing = t >= T.write0 - 0.6 && t < T.toTray;
  arm(pid, 1, writing ? -48 + Math.sin(t * 14) * 6 : -30 + Math.sin(t * 2) * 6);
  arm(pid, -1, 34);
  face(pid, t, { mood: 0, smile: 1, look: 0.6 });
  head(pid, 0, writing ? 6 : 2);
  place("ope", 790, 842 + bobY(t, 5), 1.0);
  setA($$("oClockM"), "transform", `rotate(${(t * 40).toFixed(1)})`);
  // the job card goes from the hand to the tray
  const u = smoother(prog(t, T.toTray, T.toTray + 0.9));
  const x = lerp(900, 1495, u), y = lerp(640, 590, u) - Math.sin(Math.PI * u) * 80;
  setA($$("oCard"), "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${lerp(-8, 3, u).toFixed(1)}) scale(${lerp(1, 0.8, u).toFixed(3)})`);
}

/* ---------- plant office (investigation) ---------- */
function plant(t) {
  const busy = (k) => Math.sin(t * 4 + k);
  [["ppe", 330, -80, 0], ["pqi", 720, 30, 1], ["pop", 1260, 20, 2]].forEach(([id, x, a, k]) => {
    const pid = id + "P";
    arm(pid, 1, id === "ppe" ? -150 + busy(1) * 25 : -30 + busy(k) * 10);
    arm(pid, -1, id === "ppe" ? 40 : 30 + busy(k + 1) * 8);
    face(pid, t, { mood: 0.85, look: id === "ppe" ? -0.9 : id === "pop" ? 0.9 : -0.2, talk: hash(Math.floor(t * 1.5) + k, 7) > 0.75 ? 1 : 0 });
    head(pid, id === "ppe" ? -6 : 0, Math.sin(t * 1.3 + k) * 4);
    place(id, x, 1000 + bobY(t, k), 1.0);
  });
  const pm = "ppmP";
  arm(pm, 1, -160);
  arm(pm, -1, 20 + Math.sin(t * 2) * 6);
  face(pm, t, { mood: 0.9, talk: t >= T.ring + 0.8 && Math.sin(t * 2.4) > 0 ? 1 : 0, look: Math.sin(t * 0.9) * 0.8 });
  head(pm, Math.sin(t * 0.9) * 4, Math.sin(t * 1.1) * 3);
  place("ppm", 990, 1060 + bobY(t, 6), 1.12);
  // job cards fly out of the cabinet; loose papers on the floor drift
  for (let i = 0; i < 6; i++) {
    const ph = (t * 0.7 + i / 6) % 1;
    setA($$("pCd" + i), "transform", `translate(${(200 + ph * 140 + Math.sin(i) * 20).toFixed(1)},${(560 - Math.sin(Math.PI * ph) * 160).toFixed(1)}) rotate(${(ph * 200 * (hash(i, 3) - 0.5)).toFixed(1)})`);
    setA($$("pCd" + i), "opacity", (Math.sin(Math.PI * ph) * 0.95).toFixed(2));
  }
  for (let i = 0; i < 10; i++) {
    const x = 200 + hash(i, 11) * 1500, y = 1010 + hash(i, 12) * 50;
    setA($$("pPp" + i), "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${((hash(i, 13) - 0.5) * 80 + Math.sin(t + i) * 3).toFixed(1)}) scale(1,.35)`);
    setA($$("pPp" + i), "opacity", 0.9);
  }
}

/* ---------- shots ---------- */
// each shot: start time, set, lighting mode, camera keys [time, scale, x, y] (times absolute), optional depth blur
const SHOTS = [];
const shot = (t0, set, mode, cam, extra = {}) => SHOTS.push({ t0, set, mode, cam, ...extra });
// 0: the emergency
shot(0, "factory", "crisis", [[0, 3.0, 1450, 548], [2.3, 3.3, 1452, 545]], { shake: 1 });
shot(2.3, "factory", "crisis", [[2.3, 3.5, 1112, 548], [3.5, 3.7, 1114, 552]], { shake: 1 });
shot(3.5, "factory", "crisis", [[3.5, 2.5, 1445, 545], [4.6, 2.75, 1448, 548]], { shake: 1 });
shot(4.6, "factory", "crisis", [[4.6, 2.3, 970, 600], [6.7, 2.55, 975, 596]]);
shot(6.7, "factory", "crisis", [[6.7, 1.0, 960, 560], [S[1], 1.22, 1180, 560]]);
// 1: chaos
shot(S[1], "factory", "crisis", [[S[1], 1.12, 900, 600], [W(1, "Parts", 0, -0.3), 1.04, 820, 590]]);
shot(W(1, "Parts", 0, -0.3), "factory", "crisis", [[W(1, "Parts", 0, -0.3), 2.6, 1090, 790], [W(1, "Nobody", 0, -0.3), 2.85, 1095, 792]]);
shot(W(1, "Nobody", 0, -0.3), "factory", "crisis", [[W(1, "Nobody", 0, -0.3), 1.6, 640, 640], [S[2], 1.75, 630, 630]], { bubble: { who: "fpmP", text: "Stop the line!", t0: T.stopSign, t1: S[2] - 0.2 } });
// 2: quality failure
shot(S[2], "qc", "alarm", [[S[2], 1.45, 1000, 610], [W(2, "parts", 0, -0.3), 1.6, 1000, 600]]);
shot(W(2, "parts", 0, -0.3), "qc", "alarm", [[W(2, "parts", 0, -0.3), 1.75, 1250, 600], [W(2, "Not", 0, -0.2), 1.85, 1250, 598]]);
shot(W(2, "Not", 0, -0.2), "qc", "alarm", [[W(2, "Not", 0, -0.2), 2.4, 900, 520], [W(2, "whole", 0, -0.3), 2.55, 895, 516]]);
shot(W(2, "whole", 0, -0.3), "qc", "alarm", [[W(2, "whole", 0, -0.3), 1.55, 1000, 610], [T.report - 0.6, 1.62, 990, 610]]);
shot(T.report - 0.6, "qc", "alarm", [[T.report - 0.6, 1.8, 1640, 640], [S[3], 1.95, 1650, 630]]);
// 3: flashback
shot(S[3], "office", "flash", [[S[3], 1.2, 900, 600], [W(3, "paper", 0, -0.3), 1.35, 880, 600]]);
shot(W(3, "paper", 0, -0.3), "office", "flash", [[W(3, "paper", 0, -0.3), 1.35, 880, 600]], { insert: 1 });
shot(W(3, "Nobody", 0, -0.3), "office", "flash", [[W(3, "Nobody", 0, -0.3), 1.3, 1100, 610], [W(3, "operator", 0, -0.4), 1.4, 1150, 600]]);
shot(W(3, "operator", 0, -0.4), "factory", "flash", [[W(3, "operator", 0, -0.4), 1.9, 1050, 630], [S[4], 2.15, 1080, 600]]);
// 4: consequences
shot(S[4], "qc", "alarm", [[S[4], 1.05, 960, 560], [T.cons[1] - 0.2, 1.15, 900, 570]]);
shot(T.cons[1] - 0.2, "qc", "alarm", [[T.cons[1] - 0.2, 2.1, 640, 610], [T.cons[2] - 0.2, 2.25, 630, 605]]);
shot(T.cons[2] - 0.2, "plant", "cool", [[T.cons[2] - 0.2, 1.8, 980, 270], [T.cons[3] - 0.2, 1.95, 990, 265]]);
shot(T.cons[3] - 0.2, "qc", "alarm", [[T.cons[3] - 0.2, 2.2, 1700, 600], [S[5], 2.4, 1705, 590]]);
// 5: investigation
shot(S[5], "plant", "cool", [[S[5], 1.0, 960, 600], [W(5, "Which", 0, -0.3), 1.05, 960, 600]]);
shot(W(5, "Which", 0, -0.3), "plant", "cool", [[W(5, "Which", 0, -0.3), 1.9, 300, 660], [W(5, "Which", 1, -0.3), 2.0, 310, 650]]);
shot(W(5, "Which", 1, -0.3), "plant", "cool", [[W(5, "Which", 1, -0.3), 1.8, 1330, 660], [W(5, "Which", 2, -0.3), 1.9, 1340, 650]]);
shot(W(5, "Which", 2, -0.3), "plant", "cool", [[W(5, "Which", 2, -0.3), 1.9, 720, 660], [T.islands - 0.3, 2.0, 720, 650]]);
shot(T.islands - 0.3, "plant", "cool", [[T.islands - 0.3, 1.0, 960, 600], [S[6], 1.06, 960, 600]], { islands: 1 });
// 6: turning point
shot(S[6], "plant", "cool", [[S[6], 1.15, 985, 640], [T.synax, 1.7, 990, 660]], { islands: 1 });
shot(T.synax, "factory", "clean", [[T.synax, 1.0, 960, 560], [S[7], 1.06, 960, 560]], { network: 1, ripple: 1 });
// 7: manufacturing with Synax (the factory, out of focus, behind the panels)
shot(S[7], "factory", "clean", [[S[7], 1.1, 1100, 560], [S[8], 1.18, 1250, 560]], { blur: 7, dim: 0.35, panels: 1 });
// 8: transformation
shot(S[8], "factory", "clean", [[S[8], 1.0, 960, 560], [W(8, "Problems", 0, -0.3), 1.12, 1050, 560]]);
shot(W(8, "Problems", 0, -0.3), "qc", "clean", [[W(8, "Problems", 0, -0.3), 1.6, 920, 610], [W(8, "Now", 0, -0.3), 1.7, 900, 610]]);
shot(W(8, "Now", 0, -0.3), "factory", "clean", [[W(8, "Now", 0, -0.3), 2.3, 570, 620], [S[9], 2.5, 575, 615]]);
// 9: brand close
shot(S[9], "factory", "clean", [[S[9], 2.5, 575, 615]], { endcard: 1 });

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

/* ---------- overlays: inserts, chips, islands, Synax ---------- */
function buildOverlays() {
  // the insert: the printed order and the hand-written job card on the desk
  $("#ins").innerHTML = `<div class="paper po"><div class="ph">CUSTOMER PURCHASE ORDER</div><div class="pl">PO 4471 · Line 1</div><div class="pl">Drive shaft DS-120 · Qty 60</div><div class="pk">Diameter</div><div class="pv" id="insPO">Ø 25.40 mm</div><div class="pl dim">Tolerance ± 0.02 mm</div></div>
    <div class="paper jc"><div class="ph">JOB CARD</div><div class="pl">Part DS-120 · Machine M4</div><div class="pk">Diameter</div><div class="hand"><span>Ø </span><span id="insHand"></span></div><div class="pl dim">Qty 60 · Due 21 Nov</div><div class="ring" id="insRing"></div></div>
    <div class="pen" id="insPen"></div>`;
  $("#cons").innerHTML = [["Clock", "Machine hours lost"], ["Box", "Material consumed"], ["CalendarX", "Schedule broken"], ["Truck", "Delivery at risk"]].map(([i, n], k) => `<div class="cchip" id="cc${k}">${ic(i)}${n}</div>`).join("") + `<div class="due" id="due">${ic("CalendarDays")}<div><b>Due 21 Nov</b><span>in 3 days</span></div></div>`;
  $("#isl").innerHTML = [["Production", 300, 250], ["Quality", 1620, 250], ["Stores", 300, 860], ["Planning", 1620, 860]].map(([n, x, y], k) => `<div class="isle" id="is${k}" style="left:${x - 110}px;top:${y - 36}px">${n}<span>?</span></div>`).join("") +
    `<svg width="1920" height="1080">${[[300, 250, 1620, 250], [300, 860, 1620, 860], [300, 250, 300, 860], [1620, 250, 1620, 860], [300, 250, 1620, 860]].map(([a, b, c, d], k) => `<line id="isl${k}" x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#94a3b8" stroke-width="3" stroke-dasharray="16 14"/>`).join("")}</svg>`;
  // the network over the clean factory: links between the machines, the panel, the conveyor and the logo
  const pts = [[260, 560], [590, 560], [920, 560], [1450, 520], [1113, 480], [1100, 790]];
  let net = "";
  pts.forEach(([x, y], k) => {
    net += `<path id="nl${k}" d="M960,300 Q${(960 + x) / 2},${Math.min(y, 300) - 60} ${x},${y}" stroke="#60a5fa" stroke-width="3" fill="none" stroke-dasharray="900" stroke-dashoffset="900"/><circle id="nd${k}" cx="${x}" cy="${y}" r="10" fill="#93c5fd" opacity="0"/>`;
  });
  $("#net").innerHTML = `<svg width="1920" height="1080" overflow="visible">${net}</svg>`;
  $("#nodes").innerHTML = [["ClipboardList", "Production orders"], ["Cog", "Operations"], ["Boxes", "Materials"], ["Users", "Workforce"], ["Wrench", "Assets"], ["ChartColumn", "Reports"]].map(([i, n], k) => `<div class="node" id="no${k}">${ic(i)}${n}</div>`).join("");
  // feature panels
  $("#pan").innerHTML = `
   <div class="gp" id="gp1" style="left:110px;top:200px;width:560px">
    <div class="gh">${ic("ClipboardList")}Production order</div>
    <div class="gr"><span>Order</span><b>PO-4471 · Line 1</b></div>
    <div class="gr"><span>Part</span><b>DS-120 Drive shaft</b></div>
    <div class="gr hl" id="gpDim"><span>Diameter</span><b>Ø 25.40 ± 0.02 mm</b><i class="src">from part master</i></div>
    <div class="gr"><span>Bill of materials</span><b>Rev C · Released</b></div>
    <div class="gbadge" id="gpApp">${ic("CircleCheck")}One approved record</div>
   </div>
   <div class="gp" id="gp2" style="left:700px;top:200px;width:560px">
    <div class="gh">${ic("ListChecks")}Route card · DS-120</div>
    ${[["10", "Turning", "M4 · D. Weber"], ["20", "Grinding", "M2 · in progress"], ["30", "Stage inspection", "Ø 25.40 ✓"]].map(([n, o, m], k) => `<div class="op" id="gop${k}"><span class="on">${n}</span><div><b>${o}</b><span>${m}</span></div><span class="st" id="gst${k}"></span></div>`).join("")}
   </div>
   <div class="gp" id="gp3" style="left:1300px;top:200px;width:580px">
    <div class="gh">${ic("LayoutDashboard")}Manufacturing overview</div>
    <div class="tiles"><div class="tile"><span>Machines running</span><b id="gt0">0/12</b></div><div class="tile"><span>Jobs on time</span><b id="gt1">0%</b></div><div class="tile"><span>Downtime today</span><b id="gt2">0 min</b></div></div>
    <div class="ful"><span>Order fulfilment · PO-4471</span><div class="bar"><i id="gful"></i></div><b id="gfulv">0%</b></div>
    <div class="chart">${[46, 62, 58, 74, 80, 88, 92].map((h, k) => `<i id="gch${k}" style="height:${h}%"></i>`).join("")}</div>
   </div>
   <div class="gp pass" id="gp4">
    <div class="gh">${ic("Fingerprint")}Part passport · DS-120 · S/N 0418</div>
    <div class="part"><div class="shaft"></div></div>
    ${[["ClipboardList", "Order", "PO-4471"], ["Boxes", "Material lot", "ML-2291"], ["Cog", "Machine", "M4 Turning"], ["UserRound", "Operator", "D. Weber"]].map(([i, k, v], n) => `<div class="pl" id="pl${n}">${ic(i)}<div><span>${k}</span><b>${v}</b></div></div>`).join("")}
    <svg class="plinks" width="1100" height="520">${[[550, 290, 200, 160], [550, 290, 900, 160], [550, 290, 200, 410], [550, 290, 900, 410]].map(([a, b, c, d], k) => `<line id="pll${k}" x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#60a5fa" stroke-width="3" stroke-dasharray="420" stroke-dashoffset="420"/>`).join("")}</svg>
   </div>`;
}
function bubbleAt(sh, t) {
  const b = $("#bubble");
  if (!sh.bubble || t < sh.bubble.t0 || t > sh.bubble.t1) { b.style.opacity = 0; return; }
  const u = back(prog(t, sh.bubble.t0, sh.bubble.t0 + 0.3));
  put(b, sh.bubble.text);
  // anchor above the speaker's head on screen
  const h = $$(sh.bubble.who + "_head").getBoundingClientRect();
  b.style.left = h.left + h.width / 2 + 40 + "px";
  b.style.top = h.top - 90 + "px";
  b.style.opacity = Math.min(1, prog(t, sh.bubble.t0, sh.bubble.t0 + 0.15)) * (1 - prog(t, sh.bubble.t1 - 0.2, sh.bubble.t1));
  b.style.transform = `translate(-20%,-100%) scale(${(0.6 + 0.4 * u).toFixed(3)})`;
}

/* ---------- main apply ---------- */
function apply(t) {
  const sh = shotAt(t);
  let [s, cx, cy] = camAt(sh, t);
  // camera shake during the emergency
  const shake = sh.shake ? prog(t, T.vib, T.sparks + 0.4) * (1 - prog(t, T.stop + 0.2, T.stop + 1.0)) : 0;
  const cutPunch = Math.max(0, 1 - (t - sh.t0) / 0.25) * (sh.shake ? 0.04 : 0);
  s *= 1 + cutPunch;
  cx += shake * noise(t * 2, 11) * 14 / s;
  cy += shake * noise(t * 2.3, 13) * 10 / s;
  for (const [name, cfg] of Object.entries(SETS)) {
    const on = name === sh.set;
    show(cfg.el, on);
    if (!on) continue;
    cfg.layers.forEach((L, li) => {
      const p = cfg.p[li];
      const sl = 1 + (s - 1) * p, xl = 960 + (cx - 960) * p, yl = 540 + (cy - 540) * p;
      L.style.transform = `translate(${(960 - xl * sl).toFixed(2)}px,${(540 - yl * sl).toFixed(2)}px) scale(${sl.toFixed(4)})`;
      // depth of field: the back layers soften in close-ups; the whole set is out of focus behind the panels
      const dof = sh.blur ? sh.blur : li === 0 ? clamp((s - 1.4) * 2.2, 0, 4) : li === 1 && name === "factory" ? clamp((s - 2.0) * 1.6, 0, 3) : 0;
      L.style.filter = dof > 0.05 ? `blur(${dof.toFixed(2)}px)` : "none";
    });
  }
  const mode = sh.mode;
  if (sh.set === "factory") factory(t, mode);
  if (sh.set === "qc") qc(t, mode);
  if (sh.set === "office") office(t);
  if (sh.set === "plant") plant(t);

  // lighting
  const world = $("#world");
  const flash = mode === "flash";
  world.style.filter = flash ? "sepia(.75) saturate(.55) contrast(1.05) brightness(.95)" : mode === "cool" ? `saturate(${(0.75 - 0.4 * prog(t, S[6], T.synax)).toFixed(3)}) brightness(.92)` : mode === "clean" ? "brightness(1.12) saturate(1.05)" : "none";
  const redOn = mode === "crisis" ? (t >= T.alarm ? 1 : prog(t, T.vib, T.alarm) * 0.3) : mode === "alarm" ? 0.45 : 0;
  const pulse = 0.55 + 0.45 * Math.max(0, Math.sin(t * 9));
  $("#red").style.opacity = (redOn * pulse * 0.55).toFixed(3);
  $("#redglow").style.opacity = (redOn * pulse * 0.7).toFixed(3);
  $("#vig").style.opacity = mode === "clean" ? 0.25 : 0.75;
  $("#cool").style.opacity = mode === "cool" ? 0.5 : 0;
  $("#cleanL").style.opacity = mode === "clean" ? (sh.panels ? 0.2 : 0.55) : 0;
  $("#dim").style.opacity = sh.dim || 0;
  // flashes on the way into and out of the flashback
  const fl = Math.max(1 - Math.abs(t - T.fb) / 0.25, 1 - Math.abs(t - T.fbEnd) / 0.25, 0);
  $("#flash").style.opacity = clamp(fl).toFixed(3);
  $("#fbLabel").style.opacity = flash ? win(t, S[3] + 0.3, W(3, "paper", 0, -0.4), 0.4) : 0;
  $("#grain").style.opacity = flash ? 0.5 + 0.1 * Math.sin(t * 40) : 0;

  bubbleAt(sh, t);

  // the insert (order sheet and job card on the desk)
  const insOn = !!sh.insert;
  show($("#ins"), insOn, "block");
  if (insOn) {
    const u = smoother(prog(t, sh.t0, sh.t0 + 0.4));
    $("#ins").style.opacity = u;
    $("#ins").style.transform = `scale(${(1.06 - 0.06 * u + 0.03 * prog(t, sh.t0, W(3, "Nobody", 0, -0.3))).toFixed(4)})`;
    const n = Math.floor(5 * prog(t, T.write0, T.write1));
    put($("#insHand"), "24.50".slice(0, n));
    const r = smoother(prog(t, T.mark, T.mark + 0.4));
    $("#insRing").style.opacity = r;
    $("#insRing").style.transform = `scale(${(1.3 - 0.3 * r).toFixed(3)})`;
    $("#insPO").classList.toggle("hl", t >= T.mark);
    const pu = prog(t, T.write0, T.write1);
    $("#insPen").style.transform = `translate(${(1160 + pu * 210 + (pu > 0 && pu < 1 ? Math.sin(t * 30) * 6 : 0)).toFixed(1)}px,${(520 + (pu > 0 && pu < 1 ? Math.cos(t * 24) * 6 : 0) - (pu >= 1 ? 40 : 0)).toFixed(1)}px) rotate(28deg)`;
  }

  // consequences
  const consOn = t >= S[4] && t < S[5] + 0.3;
  show($("#cons"), consOn);
  if (consOn) {
    const pos = [[150, 210], [150, 300], [150, 390], [150, 480]];
    T.cons.forEach((tc, k) => {
      const u = prog(t, tc, tc + 0.4);
      const e = $("#cc" + k);
      e.style.left = pos[k][0] + "px";
      e.style.top = pos[k][1] + "px";
      e.style.opacity = smoother(u) * (1 - prog(t, S[5] - 0.2, S[5] + 0.3));
      e.style.transform = `translateX(${((1 - eo(u)) * -40).toFixed(1)}px)`;
    });
    const d = prog(t, T.cons[3] + 0.2, T.cons[3] + 0.6);
    $("#due").style.opacity = smoother(d) * (1 - prog(t, S[5] - 0.2, S[5] + 0.3));
    $("#due").style.transform = `scale(${(0.8 + 0.2 * back(d) + 0.03 * Math.sin(t * 8)).toFixed(3)})`;
  }
  // islands: departments not connected
  const islOn = !!sh.islands;
  show($("#isl"), islOn);
  if (islOn) {
    const u = smoother(prog(t, T.islands, T.islands + 0.6)) * (1 - smoother(prog(t, T.synax - 0.4, T.synax)));
    $("#isl").style.opacity = u;
    [0, 1, 2, 3, 4].forEach((k) => {
      const flick = t >= T.disconnected && t < T.disconnected + 1.2 ? (Math.sin(t * 30 + k) > 0 ? 1 : 0.2) : 1;
      $$("isl" + k).style.opacity = (0.6 * flick).toFixed(2);
      $$("isl" + k).setAttribute("stroke", t >= T.disconnected ? "#ef4444" : "#94a3b8");
    });
  }
  // the ripple of blue light that turns chaos into the connected factory
  const rp = prog(t, T.synax - 0.3, T.synax + 0.6);
  $("#ripple").style.opacity = rp > 0 && rp < 1 ? (1 - rp) * 0.9 : 0;
  $("#ripple").style.transform = `translate(-50%,-50%) scale(${(0.1 + rp * 3.2).toFixed(3)})`;
  // network, logo, nodes
  const netOn = !!sh.network;
  show($("#net"), netOn);
  show($("#nodes"), netOn);
  const lg = prog(t, T.logo, T.logo + 0.7);
  $("#logo").style.opacity = netOn ? smoother(lg) : 0;
  $("#logo").style.transform = `translate(-50%,0) translateY(${((1 - eo(lg)) * 24).toFixed(1)}px) scale(${(0.92 + 0.08 * eo(lg)).toFixed(3)})`;
  if (netOn) {
    [0, 1, 2, 3, 4, 5].forEach((k) => {
      const d = smoother(prog(t, T.nodes + k * 0.18, T.nodes + 0.6 + k * 0.18));
      $$("nl" + k).setAttribute("stroke-dashoffset", (900 * (1 - d)).toFixed(0));
      $$("nd" + k).setAttribute("opacity", d >= 1 ? (0.6 + 0.4 * Math.sin(t * 4 + k)).toFixed(2) : 0);
      const n = $("#no" + k);
      const u = prog(t, T.nodes + 0.2 + k * 0.22, T.nodes + 0.6 + k * 0.22);
      // an arc under the logo
      const a = Math.PI * (0.1 + k * 0.16);
      n.style.left = 960 + Math.cos(a) * 620 - 120 + "px";
      n.style.top = 380 + Math.sin(a) * 230 - 33 + "px";
      n.style.opacity = smoother(u);
      n.style.transform = `scale(${(0.7 + 0.3 * back(u)).toFixed(3)})`;
    });
  }
  // feature panels
  const panOn = !!sh.panels;
  show($("#pan"), panOn);
  if (panOn) {
    const out3 = smoother(prog(t, T.p4 - 0.2, T.p4 + 0.3));
    const pin = (id, t0) => {
      const u = prog(t, t0, t0 + 0.5);
      $(id).style.opacity = smoother(u) * (1 - out3);
      $(id).style.transform = `translateY(${((1 - eo(u)) * 40 - out3 * 30).toFixed(1)}px)`;
    };
    pin("#gp1", T.p1);
    pin("#gp2", T.p2);
    pin("#gp3", T.p3);
    $("#gpDim").classList.toggle("on", t >= T.dims);
    const ab = prog(t, T.approved, T.approved + 0.4);
    $("#gpApp").style.opacity = smoother(ab);
    $("#gpApp").style.transform = `scale(${(0.8 + 0.2 * back(ab)).toFixed(3)})`;
    T.ops.forEach((to, k) => {
      const done = k === 1 ? false : t >= to;
      const live = k === 1 && t >= to;
      put($("#gst" + k), done ? ic("CircleCheck") : live ? `<i class="live"></i>` : "");
      $("#gop" + k).className = "op" + (done ? " done" : "") + (live ? " now" : "");
    });
    const cu = smoother(prog(t, T.p3 + 0.2, T.p3 + 1.4));
    put($("#gt0"), `${Math.round(11 * cu)}/12`);
    put($("#gt1"), `${Math.round(96 * cu)}%`);
    put($("#gt2"), `${Math.round(18 * cu)} min`);
    $("#gful").style.width = 72 * cu + "%";
    put($("#gfulv"), `${Math.round(72 * cu)}%`);
    for (let k = 0; k < 7; k++) $("#gch" + k).style.transform = `scaleY(${smoother(prog(t, T.p3 + 0.3 + k * 0.08, T.p3 + 0.8 + k * 0.08)).toFixed(3)})`;
    const pu = prog(t, T.p4, T.p4 + 0.6);
    $("#gp4").style.opacity = smoother(pu);
    $("#gp4").style.transform = `translate(-50%,0) scale(${(0.9 + 0.1 * back(pu)).toFixed(3)})`;
    T.links.forEach((tl, k) => {
      const u = prog(t, tl, tl + 0.45);
      $$("pll" + k).setAttribute("stroke-dashoffset", (420 * (1 - smoother(u))).toFixed(0));
      $("#pl" + k).style.opacity = smoother(prog(t, tl + 0.15, tl + 0.45));
      $("#pl" + k).style.transform = `scale(${(0.8 + 0.2 * back(prog(t, tl + 0.15, tl + 0.5))).toFixed(3)})`;
    });
  }
  // the end card
  const ec = smoother(prog(t, S[9], S[9] + 0.8));
  $("#end").style.opacity = ec;
  const e1 = prog(t, W(9, "From", 0, -0.1), W(9, "From", 0, 0.6)), e2 = prog(t, W(9, "Synax", 0, -0.2), W(9, "Synax", 0, 0.5));
  $("#endLogo").style.opacity = smoother(prog(t, S[9] + 0.2, S[9] + 0.9));
  $("#endT").style.opacity = smoother(e1);
  $("#endT").style.transform = `translateY(${((1 - eo(e1)) * 20).toFixed(1)}px)`;
  $("#endS").style.opacity = smoother(e2);
  $("#endS").style.transform = `translateY(${((1 - eo(e2)) * 16).toFixed(1)}px)`;
  $("#endGrid").style.opacity = 0.6 + 0.2 * Math.sin(t * 1.2);
  $("#fade0").style.opacity = 1 - smoother(prog(t, 0, 0.35));
  $("#fadeEnd").style.opacity = smoother(prog(t, TOTAL - 0.6, TOTAL));
}

/* ---------- sound cues ---------- */
function cues() {
  sfx(0, "hum", 0.5);
  sfx(T.vib, "rattle", 0.45);
  sfx(T.sparks, "sparks", 0.4);
  sfx(T.alarm, "alarm", 0.3);
  sfx(2.3, "hit", 0.5);
  sfx(3.5, "hit", 0.45);
  sfx(4.6, "hit", 0.4);
  sfx(T.estop, "clank", 0.55);
  sfx(T.stop, "spindown", 0.5);
  sfx(T.convStop - 1.2, "motordown", 0.35);
  for (let i = 0; i < 10; i++) sfx(T.pileFrom + 0.3 + i * 0.32, "tink", 0.18 + hash(i, 4) * 0.1);
  sfx(T.stopSign, "hit", 0.25);
  sfx(T.read, "beep", 0.3);
  sfx(T.read + 0.25, "error", 0.3);
  sfx(T.alertQi, "hit", 0.3);
  for (let i = 0; i < 6; i++) sfx(T.sort + i * 0.32 + 0.5, "clank2", 0.22);
  sfx(T.report - 0.5, "paper", 0.25);
  sfx(T.fb - 0.6, "riser", 0.35);
  sfx(T.fb, "whoosh", 0.35);
  sfx(S[3] + 0.4, "tick", 0.0);
  sfx(T.write0, "scribble", 0.3);
  sfx(T.mark, "hit", 0.35);
  sfx(T.toTray, "paper", 0.25);
  sfx(T.keyIn - 0.6, "keys", 0.25);
  sfx(T.fbEnd - 0.4, "whoosh", 0.35);
  T.cons.forEach((tc) => sfx(tc, "hit", 0.32));
  sfx(T.cons[3] + 0.3, "clockt", 0.3);
  sfx(T.ring, "phone", 0.22);
  sfx(S[5] + 0.3, "paper", 0.2);
  sfx(T.islands, "error", 0.18);
  sfx(T.disconnected, "glitch", 0.3);
  sfx(T.synax - 1.2, "riser", 0.4);
  sfx(T.synax, "logo", 0.5);
  for (let k = 0; k < 6; k++) sfx(T.nodes + 0.3 + k * 0.22, "ping", 0.18);
  [T.p1, T.p2, T.p3, T.p4].forEach((tp) => sfx(tp, "pop", 0.25));
  sfx(T.approved, "ping", 0.2);
  T.ops.forEach((to) => sfx(to, "ping", 0.16));
  T.links.forEach((tl) => sfx(tl, "ping", 0.18));
  sfx(T.okRead, "okbeep", 0.3);
  sfx(T.okRead + 0.6, "clank2", 0.16);
  sfx(S[9], "logo", 0.45);
  sfx(W(9, "Synax", 0, -0.1), "endchime", 0.4);
}

/* ---------- boot ---------- */
async function boot() {
  try {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
    buildSets();
    buildOverlays();
    cues();
    window.__apply = apply;
    window.__total = TOTAL;
    window.__starts = S;
    window.__T = T;
    window.__shots = SHOTS.map((s) => [s.t0, s.set, s.mode]);
    window.__meta = {
      total: TOTAL, sceneStarts: S.slice(0, DUR.length).map((x, i) => x + LEADS[i]), sfx: SFX.sort((a, b) => a[0] - b[0]),
      music: { tension: [0, T.synax - 0.4], resolve: [T.synax - 0.4, TOTAL], swell: [S[4], T.synax] }, scenes: S, cuts: SHOTS.map((s) => s.t0),
    };
    window.__ready = true;
    apply(0);
  } catch (e) {
    window.__err = e.stack || String(e);
  }
}
boot();
