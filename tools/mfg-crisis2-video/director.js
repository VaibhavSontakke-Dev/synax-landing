/* Film 2 (dialogue version) of the manufacturing crisis: the plant talks its way through an emergency nobody can explain.
   Same 2.5D technique as film 1 (layered sets, parallax camera, lighting overlays), with six speaking characters whose
   mouths follow the word timings of their lines. Scenes: 1 failure, 2 everyone communicating, 3 material and production
   losses, 4 nobody has the answer, 5 the root cause (flashback), 6 turning point (Synax ERP), 7 manufacturing with Synax,
   8 transformation, 9 brand close. */
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
const SFX = [];
const sfx = (t, n, g = 0.3) => SFX.push([+t.toFixed(3), n, g]);

/* ---------- the clip timeline (dialogue and narration) ---------- */
const GAP = [0, -0.25, 0.15, 0.2, 1.0, 0.15, 0.1, 1.0, 0.1, -0.2, 0.05, -0.15, 0.1, 1.3, 1.2, 0.9, 0.9, 0.9]; // before each line
const C = [];
CLIPS.forEach((cl, k) => {
  const w = WORDS[k];
  const speech = w[w.length - 1].t + w[w.length - 1].d - w[0].t;
  const s = k === 0 ? 12.0 : C[k - 1].e + GAP[k];
  C.push({ who: cl.who, s, e: s + speech, file: s - w[0].t });
});
const TOTAL = C[C.length - 1].e + 2.2;
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
function CW(k, word, nth = 0, off = 0) {
  const ws = WORDS[k].filter((x) => norm(x.w) === norm(word));
  if (!ws.length) throw new Error("word not found: " + k + " " + word);
  return C[k].file + ws[Math.min(nth, ws.length - 1)].t + off;
}
// scene starts
const S = [0, 12.0, C[4].s - 0.6, C[7].s - 0.7, C[13].s - 1.0, C[14].s - 0.7, C[15].s - 0.6, C[16].s - 0.5, C[17].s - 0.5, TOTAL];
// how open a speaker's mouth is: follows the words of their lines
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
const T = {
  vib: 3.3, sparks: 3.6, alarm: 4.0, stop: 4.5, spunDown: 5.6, estop: 5.2, pileFrom: 7.2, convStop: 8.6, rush: 9.2,
  walkie: C[0].s - 0.5, supRun: C[1].s - 0.6, qiIn: C[2].s - 1.2, calls: C[2].e + 0.1,
  loss: [C[4].s - 0.4, C[4].s + 1.2, C[4].s + 2.6, C[4].s + 4.0], invIn: C[4].s + 6.0,
  fb: S[4] + 0.05, write0: CW(13, "single", 0, -0.1), write1: CW(13, "entry", 0, 0.1), mark: CW(13, "entry", 0, 0.3), toTray: CW(13, "passed", 0, -0.2),
  hand: CW(13, "manual", 0, -0.3), keyIn: CW(13, "entire", 0, -0.4), run: CW(13, "operation", 0, -0.3), fbEnd: S[5],
  manual: [CW(14, "spreadsheets", 0, -0.15), CW(14, "paper", 0, -0.15), CW(14, "communication", 0, -0.15)], synax: CW(14, "Meet", 0, -0.4), logo: CW(14, "Synax", 0, -0.1), nodes: CW(14, "connected", 0, -0.2),
  feats: [CW(15, "glance", 0, -0.25), CW(15, "fulfilment", 0, -0.35), CW(15, "Organise", 0, -0.15), CW(15, "dashboards", 0, -0.25), CW(15, "reports", 0, -0.2), CW(15, "connected", 0, -0.3)],
  okRead: S[7] + 2.2,
};

/* ---------- sets, people ---------- */
const SETS = { factory: { p: [0.62, 0.86, 1] }, qc: { p: [0.7, 1, 1] }, office: { p: [0.75, 1, 1] }, plant: { p: [0.85, 1, 1] } };
const PEOPLE = [];
const addPerson = (set, layer, id, cast, x, y, s, front) => PEOPLE.push({ set, layer, id, cast, x, y, s, front });
addPerson("factory", 1, "fw1", "w1", 330, 885, 0.62);
addPerson("factory", 1, "fw2", "w2", 660, 885, 0.62);
addPerson("factory", 2, "fsup", "sup", 420, 1000, 1.0, "clipboard");
addPerson("factory", 2, "fqi", "qi", 260, 1000, 1.0, "parts");
addPerson("factory", 2, "fop", "op", 960, 960, 0.95);
addPerson("factory", 2, "fpm", "pm", 560, 1010, 1.0, "tablet");
addPerson("qc", 2, "qqi", "qi", 900, 880, 1.0);
addPerson("office", 1, "ope", "pe", 790, 842, 1.0);
addPerson("plant", 2, "pop", "op", 280, 1000, 1.0);
addPerson("plant", 2, "pqi", "qi", 600, 1000, 1.0);
addPerson("plant", 2, "ppm", "pm", 980, 1060, 1.12);
addPerson("plant", 2, "pinv", "inv", 1360, 1000, 1.0, "clipboard");
addPerson("plant", 2, "ppl", "pl", 1680, 1000, 1.0, "report");
const HEADPROP = {
  walkie: `<g transform="translate(46,20) rotate(14)"><rect x="-13" y="-36" width="26" height="62" rx="6" fill="#1e293b"/><rect x="-5" y="-60" width="6" height="26" rx="2" fill="#334155"/><rect x="-8" y="-24" width="16" height="12" rx="2" fill="#60a5fa"/><circle cx="0" cy="8" r="6" fill="#475569"/></g>`,
  phone: `<g transform="translate(46,0) rotate(-8)"><rect x="-10" y="-30" width="20" height="56" rx="6" fill="#1e293b"/><rect x="-7" y="-25" width="14" height="44" rx="3" fill="#60a5fa"/></g>`,
};
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
      const inner = name === "factory" ? set[ln]() + ppl : name === "office" && li === 1 ? set[ln]() + ppl : ppl + set[ln]();
      d.innerHTML = `<svg viewBox="0 0 1920 1080" width="1920" height="1080" overflow="visible">${inner}</svg>`;
      g.appendChild(d);
      return d;
    });
    host.appendChild(g);
    cfg.el = g;
  }
  $$("opeP_aR").insertAdjacentHTML("beforeend", `<g transform="translate(0,138) rotate(-30)"><rect x="-4" y="-34" width="8" height="46" rx="3" fill="#1e3a8a"/><path d="M-4,12 L4,12 L0,22Z" fill="#334155"/></g>`);
  $$("qCal").insertAdjacentHTML("beforeend", `<circle cx="842" cy="672" r="18" fill="#60a5fa"/><g id="qHandR"><circle cx="915" cy="672" r="18" fill="#60a5fa"/></g>`);
  [["fopP", "walkie"], ["ppmP", "phone"], ["fsupP", "walkie"]].forEach(([pid, k]) => $$(pid + "_head").insertAdjacentHTML("beforeend", `<g id="${pid}_hp" opacity="0">${HEADPROP[k]}</g>`));
}

/* ---------- characters per frame ---------- */
function face(pid, c, o) {
  const { talk = 0, mood = 0, look = 0, shock = 0, smile = 0 } = o;
  const open = Math.max(talk * 9, shock * 9);
  setA($$(pid + "_talk"), "opacity", open > 0.8 ? 1 : 0);
  setA($$(pid + "_talk"), "ry", Math.max(2, open).toFixed(1));
  setA($$(pid + "_talk"), "rx", (10 - shock * 2).toFixed(1));
  setA($$(pid + "_smile"), "opacity", open <= 0.8 && (smile > 0.5 || mood < 0.3) ? 1 : 0);
  setA($$(pid + "_frown"), "opacity", open <= 0.8 && smile <= 0.5 && mood >= 0.6 ? 1 : 0);
  setA($$(pid + "_flat"), "opacity", open <= 0.8 && smile <= 0.5 && mood >= 0.3 && mood < 0.6 ? 1 : 0);
  const up = shock * 7 + mood * 3;
  setA($$(pid + "_bl"), "transform", `rotate(${(mood * -9 + shock * 4).toFixed(1)} -18 -19) translate(0 ${(-up).toFixed(1)})`);
  setA($$(pid + "_br"), "transform", `rotate(${(mood * 9 - shock * 4).toFixed(1)} 18 -19) translate(0 ${(-up).toFixed(1)})`);
  const blink = (c + pid.length * 0.7) % 3.4 < 0.13 && shock < 0.5 ? 0.92 : 0;
  setA($$(pid + "_eyes"), "transform", `translate(0 -3) scale(${(1 + shock * 0.12).toFixed(3)} ${((1 - blink) * (1 + shock * 0.18)).toFixed(3)}) translate(0 3)`);
  setA($$(pid + "_pl"), "cx", (-17 + look * 3.2).toFixed(1));
  setA($$(pid + "_pr"), "cx", (17 + look * 3.2).toFixed(1));
  setA($$(pid + "_pl"), "r", (4.8 - shock * 1.3).toFixed(2));
  setA($$(pid + "_pr"), "r", (4.8 - shock * 1.3).toFixed(2));
}
// len < 1 bends the arm (used to hold a phone or walkie-talkie to the head)
const arm = (pid, side, a, len = 1) => setA($$(pid + "_a" + (side < 0 ? "L" : "R")), "transform", `translate(${side * 72},-298) rotate(${a.toFixed(1)}) scale(1,${len.toFixed(3)})`);
const head = (pid, dx, rot) => setA($$(pid + "_head"), "transform", `translate(${dx.toFixed(1)},-376) rotate(${rot.toFixed(1)} 0 46)`);
const place = (id, x, y, s) => setA($$(id), "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(3)})`);
const bobY = (t, k) => Math.sin(t * 2.1 + k) * 2;
const holdToHead = (pid, on) => {
  setA($$(pid + "_hp"), "opacity", on ? 1 : 0);
  if (on) arm(pid, 1, 160, 0.48);
};
const walk = (t, a, b) => { const u = smoother(prog(t, a, b)); return { u, moving: u > 0 && u < 1 }; };

/* ---------- factory ---------- */
function factory(t, mode) {
  const crisis = mode === "crisis" || mode === "idle";
  const clean = mode === "clean";
  const flash = mode === "flash";
  // machine 02: normal, chatter, sparks, stop. In the flashback it runs (cutting the wrong size)
  const running = clean || flash || t < T.stop;
  const spd = running ? 1 : 1 - smoother(prog(t, T.stop, T.spunDown));
  const vib = mode === "crisis" ? prog(t, T.vib, T.sparks + 0.4) * (1 - prog(t, T.stop, T.stop + 0.5)) : 0;
  const ang = running ? t * 38 : T.stop * 38 + (t - T.stop) * 38 * (1 - prog(t, T.stop, T.spunDown)) * 0.5;
  [0, 1, 2].forEach((k) => {
    const ph = ang + (k * Math.PI * 2) / 3;
    setA($$("fJ" + k), "y", (520 + Math.sin(ph) * 60).toFixed(1));
    setA($$("fJ" + k), "opacity", (0.35 + 0.65 * Math.max(0, Math.cos(ph))).toFixed(2));
  });
  [0, 1, 2, 3, 4, 5].forEach((k) => setA($$("fSm" + k), "opacity", (0.25 + 0.35 * Math.abs(Math.sin(ang * 1.3 + k))).toFixed(2)));
  setA($$("fM4body"), "transform", `translate(${(vib * noise(t * 2.2, 1) * 6).toFixed(1)},${(vib * noise(t * 2.5, 3) * 4).toFixed(1)})`);
  setA($$("fTool"), "transform", `translate(${(vib * noise(t * 3, 5) * 5).toFixed(1)},${(vib * noise(t * 3.3, 7) * 6).toFixed(1)})`);
  setA($$("fCool"), "opacity", running ? 1 : 1 - prog(t, T.stop, T.stop + 0.4));
  const alarm = crisis && t >= T.alarm;
  const blinkR = alarm ? (Math.sin(t * 9) > 0 ? 1 : 0.25) * (mode === "idle" ? 0.6 : 1) : 0;
  setA($$("fTR"), "opacity", blinkR.toFixed(2));
  setA($$("fTRglow"), "opacity", (blinkR * 0.9).toFixed(2));
  setA($$("fTA"), "opacity", mode === "crisis" && t >= T.vib && t < T.alarm ? 1 : 0);
  setA($$("fTG"), "opacity", clean || flash || (mode !== "idle" && t < T.vib) ? 1 : 0);
  let scr;
  if (flash) scr = `<text x="1113" y="466" text-anchor="middle" font-size="15" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">JOB SET-UP</text><text x="1113" y="504" text-anchor="middle" font-size="26" font-weight="800" fill="#e2e8f0" font-family="Inter,sans-serif">Ø ${"24.50".slice(0, clamp(Math.floor((t - T.keyIn) * 9 + 5 * (t >= T.keyIn + 0.6 ? 1 : 0)), 0, 5))}</text>`;
  else if (clean) scr = `<text x="1113" y="464" text-anchor="middle" font-size="14" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">PRODUCTION ORDER</text><text x="1113" y="498" text-anchor="middle" font-size="24" font-weight="800" fill="#86efac" font-family="Inter,sans-serif">Ø 25.40 ✓</text><text x="1113" y="516" text-anchor="middle" font-size="11" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">connected record</text>`;
  else if (alarm) scr = `<rect x="1044" y="434" width="138" height="92" rx="6" fill="${Math.sin(t * 9) > 0 ? "#7f1d1d" : "#450a0a"}"/><text x="1113" y="472" text-anchor="middle" font-size="22" font-weight="800" fill="#fecaca" font-family="Inter,sans-serif">STOPPED</text><text x="1113" y="500" text-anchor="middle" font-size="13" font-weight="700" fill="#fecaca" font-family="Inter,sans-serif">EMERGENCY STOP</text>`;
  else scr = `<text x="1113" y="466" text-anchor="middle" font-size="15" font-weight="700" fill="#93c5fd" font-family="Inter,sans-serif">RUNNING</text><text x="1113" y="502" text-anchor="middle" font-size="24" font-weight="800" fill="#e2e8f0" font-family="Inter,sans-serif">${(2400 * spd).toFixed(0)} rpm</text>`;
  put($$("fScreen"), scr);
  setA($$("fEstop"), "transform", `translate(0 ${(mode === "crisis" ? Math.sin(Math.PI * prog(t, T.estop, T.estop + 0.25)) * 4 : 0).toFixed(1)})`);
  // sparks and smoke
  const sparkOn = mode === "crisis" && t >= T.sparks && t < T.stop + 0.5;
  for (let i = 0; i < 36; i++) {
    const e = $$("fSk" + i);
    if (!sparkOn) { setA(e, "opacity", 0); continue; }
    const life = 0.35 + hash(i, 3) * 0.3;
    const ph = ((t - T.sparks) / life + hash(i, 4)) % 1;
    const a = -Math.PI * (0.15 + hash(i, 5) * 0.7) + (hash(i, 6) - 0.5) * 0.6;
    const v = 220 + hash(i, 7) * 260;
    const pos = (q) => [1477 + Math.cos(a) * v * q * life * 3, 524 + Math.sin(a) * v * q * life * 3 + 1200 * Math.pow(q * life, 2)];
    const [x, y] = pos(ph), [xt, yt] = pos(Math.max(0, ph - 0.06));
    setA(e, "x1", xt.toFixed(1)); setA(e, "y1", yt.toFixed(1)); setA(e, "x2", x.toFixed(1)); setA(e, "y2", y.toFixed(1));
    setA(e, "opacity", ((1 - ph) * (1 - prog(t, T.stop, T.stop + 0.5))).toFixed(2));
  }
  for (let i = 0; i < 8; i++) {
    const e = $$("fSmk" + i);
    const on = crisis && t >= T.stop + 0.2 && t < S[2];
    if (!on) { setA(e, "opacity", 0); continue; }
    const ph = ((t - T.stop - 0.2) * 0.35 + i / 8) % 1;
    setA(e, "cx", (1470 + Math.sin(ph * 5 + i) * 30 + ph * 40).toFixed(1));
    setA(e, "cy", (510 - ph * 170).toFixed(1));
    setA(e, "r", (14 + ph * 40).toFixed(1));
    setA(e, "opacity", (Math.sin(Math.PI * ph) * 0.28 * prog(t, T.stop + 0.2, T.stop + 1)).toFixed(2));
  }
  [1, 2, 3].forEach((k) => setA($$("fM" + k + "L"), "fill", crisis && t >= T.convStop - 0.6 ? "#facc15" : "#22c55e"));
  // conveyor and the pile of unfinished parts on the other line
  const conv = clean || flash || t < T.convStop - 1.2;
  const dist = conv ? t * 90 : (T.convStop - 1.2) * 90 + 108 * smoother(prog(t, T.convStop - 1.2, T.convStop));
  for (let i = 0; i < 12; i++) setA($$("fP" + i), "transform", `translate(${(((dist + i * 100) % 1200) - 80).toFixed(1)},806)`);
  const piled = crisis ? Math.floor(16 * smoother(prog(t, T.pileFrom, T.pileFrom + 2.6))) : clean ? 3 : 2;
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 5), col = i % 5;
    setA($$("fPl" + i), "opacity", i < piled ? 1 : 0);
    setA($$("fPl" + i), "transform", `translate(${(22 + col * 22 + row * 9).toFixed(1)},${(38 - row * 15).toFixed(1)}) rotate(${((hash(i, 9) - 0.5) * 40).toFixed(1)})`);
  }
  // the operator: hits the E-stop, looks around in panic, calls on the walkie-talkie
  {
    const k = "fopP";
    const reach = mode === "crisis" ? Math.min(prog(t, T.estop - 0.45, T.estop - 0.1), 1 - prog(t, T.estop + 0.6, T.estop + 1.0)) : 0;
    const panic = mode === "crisis" ? prog(t, T.estop + 0.5, T.estop + 0.9) : 0;
    const onWalkie = mode === "crisis" && t >= T.walkie && t < C[0].e + 0.6;
    if (onWalkie) holdToHead(k, true);
    else {
      holdToHead(k, false);
      arm(k, 1, flash ? -105 + Math.sin(t * 6) * 4 * prog(t, T.keyIn - 0.6, T.keyIn) : clean ? -100 + Math.sin(t * 2) * 6 : lerp(-10, -117, smoother(reach)) - panic * 30);
    }
    arm(k, -1, flash ? 40 : clean ? 12 : 10 + panic * 40);
    const lookAround = panic && t < T.walkie ? Math.sin((t - T.estop) * 4) : 0.5;
    face(k, t, { talk: talkOf("op", t), shock: panic * (t < T.walkie ? 1 : 0.4), mood: crisis ? 0.8 : 0, look: clean || flash ? 0.9 : lookAround, smile: clean ? 1 : 0 });
    head(k, lookAround * 6, lookAround * 6);
    place("fop", 960, 960 + bobY(t, 1), 0.95);
  }
  // background workers: work, then rush to the machine, then wait
  [["fw1", 330, 0], ["fw2", 660, 1]].forEach(([id, x0, k]) => {
    const pid = id + "P";
    const r = crisis ? walk(t, T.rush + k * 0.25, T.rush + 2.2 + k * 0.25) : { u: 0, moving: false };
    const x = x0 + r.u * (760 - x0 + k * 40);
    place(id, x, 885 + bobY(t, k) - (r.moving ? Math.abs(Math.sin(t * 11 + k)) * 8 : 0), 0.62);
    const idle = mode === "idle";
    arm(pid, 1, clean ? -60 + Math.sin(t * 3 + k) * 12 : r.moving ? Math.sin(t * 11 + k) * 30 : idle ? 30 : crisis && t > T.alarm ? -30 : -55 + Math.sin(t * 2.5 + k) * 10);
    arm(pid, -1, r.moving ? -Math.sin(t * 11 + k) * 30 : idle ? -30 : 20);
    face(pid, t, { shock: mode === "crisis" ? prog(t, T.stop + 0.6, T.stop + 1.2) : 0, look: crisis && t > T.alarm ? 0.9 : 0, smile: clean ? 1 : 0, mood: crisis ? 0.6 : 0 });
  });
  // the supervisor: monitors at first, then runs to the machine shouting
  {
    const pid = "fsupP";
    const r = mode === "crisis" ? walk(t, T.supRun, T.supRun + 2.0) : { u: 1, moving: false };
    const x = clean ? 760 + Math.sin(t * 0.5) * 14 : lerp(-200, 620, r.u);
    const visible = clean || flash || (mode === "crisis" && (t < 2.9 || t >= T.supRun)) || mode === "idle";
    show($$("fsup"), visible, "inline");
    place("fsup", flash ? 760 : t < 2.9 && mode === "crisis" ? 440 : x, 1000 + bobY(t, 3) - (r.moving ? Math.abs(Math.sin(t * 10)) * 9 : 0), 1.0);
    const shout = speaking("sup", t);
    arm(pid, 1, flash ? lerp(-20, -95, smoother(prog(t, T.hand - 0.3, T.hand + 0.3))) : shout ? -120 + Math.sin(t * 6) * 15 : r.moving ? Math.sin(t * 10) * 30 : -20);
    arm(pid, -1, r.moving ? -Math.sin(t * 10) * 30 : 18);
    face(pid, t, { talk: talkOf("sup", t), mood: crisis ? 0.8 : 0, smile: clean ? 1 : 0, look: crisis ? 0.7 : 0.2 });
    head(pid, 0, shout ? Math.sin(t * 5) * 3 : 0);
  }
  // the quality inspector arrives carrying rejected parts
  {
    const pid = "fqiP";
    const r = mode === "crisis" ? walk(t, T.qiIn, T.qiIn + 1.6) : { u: 0, moving: false };
    const on = mode === "crisis" && t >= T.qiIn && t < S[2];
    show($$("fqi"), on, "inline");
    place("fqi", lerp(-180, 300, r.u), 1000 + bobY(t, 4) - (r.moving ? Math.abs(Math.sin(t * 10)) * 8 : 0), 1.0);
    arm(pid, 1, 40);
    arm(pid, -1, -40);
    face(pid, t, { talk: talkOf("qi", t), mood: 0.85, look: 0.8 });
  }
  // the production manager (only in the clean factory, with a tablet)
  {
    const pid = "fpmP";
    show($$("fpm"), clean, "inline");
    place("fpm", 520 + Math.sin(t * 0.4) * 20, 1010 + bobY(t, 2), 1.0);
    arm(pid, 1, -25);
    arm(pid, -1, 25);
    face(pid, t, { smile: 1, look: -0.3 });
  }
}

/* ---------- QC bench ---------- */
function qc(t, mode) {
  const clean = mode === "clean";
  const lcd = $$("qLCD");
  const v = clean ? (t >= T.okRead ? "25.40" : (25.4 * smoother(prog(t, T.okRead - 0.7, T.okRead))).toFixed(2)) : "24.50";
  if (lcd.textContent !== v) lcd.textContent = v;
  setA(lcd, "fill", clean ? (t >= T.okRead ? "#15803d" : "#0f2347") : "#b91c1c");
  const close = clean ? smoother(prog(t, T.okRead - 0.8, T.okRead - 0.2)) : 1;
  setA($$("qJaw"), "transform", `translate(${(70 * (1 - close)).toFixed(1)},0)`);
  setA($$("qHandR"), "transform", `translate(${(70 * (1 - close)).toFixed(1)},0)`);
  for (let i = 0; i < 6; i++) {
    const e = $$("qS" + i);
    const t0 = T.okRead + 0.4;
    const u = clean ? (i === 0 ? smoother(prog(t, t0, t0 + 0.7)) : 0) : 1;
    const bx = clean ? 385 : 605, by = 600 + (i % 3) * 8;
    const x0 = 1094 + (i % 3) * 104 + 48, y0 = 600 - Math.floor(i / 3) * 18;
    const x = lerp(x0, bx, u), y = lerp(y0, by, u) - Math.sin(Math.PI * u) * 120;
    setA(e, "transform", `translate(${(x - x0).toFixed(1)},${(y - y0).toFixed(1)}) rotate(${(u * (hash(i, 2) - 0.5) * 120).toFixed(1)} ${x0} ${y0 + 10})`);
  }
  const pid = "qqiP";
  arm(pid, -1, 40);
  arm(pid, 1, -40);
  face(pid, t, { mood: clean ? 0 : 0.8, smile: clean && t > T.okRead ? 1 : 0, look: -0.2 });
  head(pid, 0, 0);
  place("qqi", 900, 880 + bobY(t, 3), 1.0);
}

/* ---------- office (flashback) ---------- */
function office(t) {
  const pid = "opeP";
  const writing = t >= T.write0 - 0.6 && t < T.toTray;
  arm(pid, 1, writing ? -48 + Math.sin(t * 14) * 6 : -30 + Math.sin(t * 2) * 6);
  arm(pid, -1, 34);
  face(pid, t, { smile: 1, look: 0.6 });
  head(pid, 0, writing ? 6 : 2);
  place("ope", 790, 842 + bobY(t, 5), 1.0);
  setA($$("oClockM"), "transform", `rotate(${(t * 40).toFixed(1)})`);
  const u = smoother(prog(t, T.toTray, T.toTray + 0.9));
  setA($$("oCard"), "transform", `translate(${lerp(900, 1495, u).toFixed(1)},${(lerp(640, 590, u) - Math.sin(Math.PI * u) * 80).toFixed(1)}) rotate(${lerp(-8, 3, u).toFixed(1)}) scale(${lerp(1, 0.8, u).toFixed(3)})`);
}

/* ---------- plant office: the losses, the questions ---------- */
function plant(t, mode) {
  const two = t < S[3]; // scene 3: only the manager and the inventory employee
  const all = !two;
  setA($$("pClockM"), "transform", `rotate(${(t * 60).toFixed(1)})`);
  setA($$("pClockH"), "transform", `rotate(${(t * 5 + 120).toFixed(1)})`);
  [["pop", "op", 280, 0], ["pqi", "qi", 600, 1], ["ppl", "pl", 1680, 3]].forEach(([id, who, x, k]) => {
    show($$(id), all, "inline");
    if (!all) return;
    const pid = id + "P";
    const sp = speaking(who, t);
    arm(pid, 1, sp ? -40 + Math.sin(t * 5 + k) * 18 : -20 + Math.sin(t * 1.6 + k) * 6);
    arm(pid, -1, sp ? 40 - Math.sin(t * 5 + k) * 14 : 20);
    face(pid, t, { talk: talkOf(who, t), mood: 0.8, look: x < 980 ? 0.8 : -0.8 });
    head(pid, 0, sp ? Math.sin(t * 4 + k) * 3 : Math.sin(t * 0.8 + k) * 2);
    place(id, x, 1000 + bobY(t, k), 1.0);
  });
  // inventory employee: walks up to the manager in scene 3, stands with the team in scene 4
  {
    const pid = "pinvP";
    const r = walk(t, T.invIn - 1.2, T.invIn);
    const x = two ? lerp(1980, 1300, r.u) : 1360;
    place("pinv", x, 1000 + bobY(t, 5) - (two && r.moving ? Math.abs(Math.sin(t * 10)) * 8 : 0), 1.0);
    const sp = speaking("inv", t);
    arm(pid, 1, sp ? -30 + Math.sin(t * 5) * 14 : -15);
    arm(pid, -1, 22);
    face(pid, t, { talk: talkOf("inv", t), mood: 0.75, look: -0.8 });
    head(pid, 0, sp ? Math.sin(t * 4) * 3 : 0);
  }
  // the production manager: calls, questions, worry
  {
    const pid = "ppmP";
    const onPhone = (t >= T.calls && t < C[3].e + 0.3) || (t >= C[12].e + 0.1 && t < S[4]);
    if (onPhone) holdToHead(pid, true);
    else {
      holdToHead(pid, false);
      arm(pid, 1, speaking("pm", t) ? -60 + Math.sin(t * 5) * 20 : -15);
    }
    arm(pid, -1, speaking("pm", t) ? 50 + Math.sin(t * 4) * 15 : 20);
    const worry = prog(t, C[5].s, C[6].e + 1);
    face(pid, t, { talk: talkOf("pm", t), mood: 0.8 + 0.2 * worry, shock: two ? worry * 0.4 * (speaking("pm", t) ? 0 : 1) : 0, look: Math.sin(t * 0.9) * 0.8 });
    head(pid, Math.sin(t * 0.9) * 4, speaking("pm", t) ? Math.sin(t * 4) * 3 : Math.sin(t * 1.1) * 2);
    place("ppm", 980 + (two ? 0 : Math.sin(t * 0.35) * 30), 1060 + bobY(t, 6), 1.12);
  }
  // paper: job cards out of the cabinet, loose sheets on the floor
  for (let i = 0; i < 6; i++) {
    const on = all && t >= C[12].s;
    const ph = (t * 0.7 + i / 6) % 1;
    setA($$("pCd" + i), "transform", `translate(${(200 + ph * 140 + Math.sin(i) * 20).toFixed(1)},${(560 - Math.sin(Math.PI * ph) * 160).toFixed(1)}) rotate(${(ph * 200 * (hash(i, 3) - 0.5)).toFixed(1)})`);
    setA($$("pCd" + i), "opacity", on ? (Math.sin(Math.PI * ph) * 0.95).toFixed(2) : 0);
  }
  for (let i = 0; i < 10; i++) {
    setA($$("pPp" + i), "transform", `translate(${(200 + hash(i, 11) * 1500).toFixed(1)},${(1010 + hash(i, 12) * 50).toFixed(1)}) rotate(${((hash(i, 13) - 0.5) * 80).toFixed(1)}) scale(1,.35)`);
    setA($$("pPp" + i), "opacity", all ? 0.9 : 0.4);
  }
}

/* ---------- shots ---------- */
const SHOTS = [];
const shot = (t0, set, mode, cam, extra = {}) => SHOTS.push({ t0, set, mode, cam, ...extra });
const key = (t, s, x, y) => [t, s, x, y];
// 1: normal operations, then the failure
shot(0, "factory", "crisis", [key(0, 1.0, 880, 560), key(3.2, 1.08, 1000, 560)]);
shot(3.2, "factory", "crisis", [key(3.2, 3.0, 1450, 548), key(4.7, 3.3, 1452, 545)], { shake: 1 });
shot(4.7, "factory", "crisis", [key(4.7, 3.4, 1112, 548), key(6.0, 3.6, 1114, 552)], { shake: 1 });
shot(6.0, "factory", "crisis", [key(6.0, 2.3, 970, 600), key(7.6, 2.5, 975, 596)]);
shot(7.6, "factory", "crisis", [key(7.6, 2.6, 1090, 790), key(9.4, 2.85, 1095, 792)]);
shot(9.4, "factory", "crisis", [key(9.4, 1.45, 480, 640), key(12.0, 1.45, 900, 640)]);
// 2: everyone starts communicating
shot(C[0].s - 0.5, "factory", "crisis", [key(C[0].s - 0.5, 2.0, 980, 630), key(C[1].s, 2.15, 985, 620)], { tag: ["op", "Machine Operator"] });
shot(C[1].s, "factory", "crisis", [key(C[1].s, 1.5, 520, 660), key(C[2].s - 0.4, 1.6, 640, 650)], { tag: ["sup", "Production Supervisor"] });
shot(C[2].s - 0.4, "factory", "crisis", [key(C[2].s - 0.4, 1.75, 320, 660), key(C[2].e + 0.05, 1.85, 330, 650)], { tag: ["qi", "Quality Inspector"] });
shot(C[2].e + 0.05, "plant", "cool", [key(C[2].e + 0.05, 1.55, 980, 640), key(S[2], 1.75, 985, 630)], { calls: 1, tag: ["pm", "Production Manager"] });
// 3: material and production losses (a montage over the inventory employee's line), then the two of them
shot(T.loss[0], "factory", "idle", [key(T.loss[0], 1.05, 700, 600), key(T.loss[1], 1.1, 760, 600)], { lossTag: 0, cutaway: 1 });
shot(T.loss[1], "qc", "alarm", [key(T.loss[1], 1.55, 1000, 610), key(T.loss[2], 1.62, 990, 610)], { lossTag: 1, cutaway: 1 });
shot(T.loss[2], "plant", "cool", [key(T.loss[2], 1.7, 1590, 650), key(T.loss[3], 1.8, 1600, 640)], { lossTag: 2, cutaway: 1 });
shot(T.loss[3], "plant", "cool", [key(T.loss[3], 1.8, 980, 270), key(C[4].s + 5.3, 1.9, 990, 265)], { lossTag: 3, cutaway: 1 });
shot(C[4].s + 5.3, "plant", "cool", [key(C[4].s + 5.3, 1.4, 1130, 640), key(C[5].s, 1.45, 1140, 630)], { tag: ["inv", "Inventory Employee"], cutaway: 1 });
shot(C[5].s, "plant", "cool", [key(C[5].s, 2.2, 985, 620), key(C[6].s, 2.35, 985, 610)]);
shot(C[6].s, "plant", "cool", [key(C[6].s, 2.2, 1300, 640), key(S[3], 2.35, 1300, 630)]);
// 4: nobody has the answer
shot(S[3], "plant", "cool", [key(S[3], 1.0, 960, 600), key(C[8].s, 1.05, 960, 600)]);
shot(C[8].s, "plant", "cool", [key(C[8].s, 2.2, 280, 640), key(C[9].s, 2.3, 285, 635)]);
shot(C[9].s, "plant", "cool", [key(C[9].s, 2.2, 600, 640), key(C[10].s, 2.3, 600, 635)]);
shot(C[10].s, "plant", "cool", [key(C[10].s, 2.2, 1360, 640), key(C[11].s, 2.3, 1360, 635)]);
shot(C[11].s, "plant", "cool", [key(C[11].s, 2.2, 1660, 640), key(C[12].s, 2.3, 1660, 635)], { tag: ["pl", "Production Planner"] });
// the manager's last questions: his face, the paper files, the clock, his face again (calling)
shot(C[12].s, "plant", "cool", [key(C[12].s, 2.1, 985, 620), key(CW(12, "entered", 0, -0.1), 2.25, 985, 612)]);
shot(CW(12, "entered", 0, -0.1), "plant", "cool", [key(CW(12, "entered", 0, -0.1), 1.9, 260, 640), key(CW(12, "Why", 0, -0.3), 2.0, 270, 630)], { cutaway: 1 });
shot(CW(12, "Why", 0, -0.3), "plant", "cool", [key(CW(12, "Why", 0, -0.3), 3.2, 1340, 195), key(CW(12, "Why", 0, 0.8), 3.4, 1340, 192)], { cutaway: 1 });
shot(CW(12, "Why", 0, 0.8), "plant", "cool", [key(CW(12, "Why", 0, 0.8), 2.4, 985, 605), key(S[4], 2.7, 985, 590)]);
// 5: the root cause (flashback)
shot(S[4], "office", "flash", [key(S[4], 1.2, 900, 600), key(T.write0 - 0.5, 1.35, 880, 600)]);
shot(T.write0 - 0.5, "office", "flash", [key(T.write0 - 0.5, 1.35, 880, 600)], { insert: 1 });
shot(T.toTray, "office", "flash", [key(T.toTray, 1.3, 1100, 610), key(T.hand - 0.4, 1.4, 1150, 600)]);
shot(T.hand - 0.4, "factory", "flash", [key(T.hand - 0.4, 1.5, 860, 640), key(T.keyIn - 0.5, 1.6, 900, 630)]);
shot(T.keyIn - 0.5, "factory", "flash", [key(T.keyIn - 0.5, 1.9, 1050, 630), key(T.run - 0.2, 2.1, 1080, 600)]);
shot(T.run - 0.2, "factory", "flash", [key(T.run - 0.2, 2.6, 1445, 545), key(S[5], 3.0, 1450, 545)]);
// 6: the turning point
shot(S[5], "factory", "idle", [key(S[5], 1.05, 960, 560), key(T.synax, 1.2, 1100, 560)], { manual: 1 });
shot(T.synax, "factory", "clean", [key(T.synax, 1.0, 960, 560), key(S[6], 1.06, 960, 560)], { network: 1 });
// 7: manufacturing with Synax ERP (the manager in front, the factory out of focus)
shot(S[6], "factory", "clean", [key(S[6], 1.1, 1100, 560), key(S[7], 1.18, 1250, 560)], { blur: 7, dim: 0.35, panels: 1 });
// 8: transformation
shot(S[7], "factory", "clean", [key(S[7], 1.0, 960, 560), key(S[7] + 1.9, 1.08, 1000, 560)]);
shot(S[7] + 1.9, "qc", "clean", [key(S[7] + 1.9, 1.6, 920, 610), key(S[8] - 0.2, 1.7, 900, 610)]);
// 9: brand close
shot(S[8] - 0.2, "factory", "clean", [key(S[8] - 0.2, 2.3, 570, 620), key(S[8] + 1, 2.4, 575, 615)], { endcard: 1 });
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
const LOSS = [["CirclePause", "Machines idle, people waiting"], ["PackageX", "Rejected parts · finished goods on hold"], ["Boxes", "Raw material already consumed"], ["CalendarX", "Production orders delayed"]];
const NODES = [["Cog", "Manufacturing operations"], ["ClipboardList", "Production orders"], ["PackageCheck", "Order fulfilment"], ["Boxes", "Material information"], ["Users", "Workforce coordination"], ["Wrench", "Assets"], ["ChartColumn", "Management reporting"]];
const NPOS = [];
function layoutNodes() {
  const host = $("#nodes");
  host.style.display = "block";
  const ws = NODES.map((_, k) => $("#no" + k).offsetWidth);
  host.style.display = "none";
  const rows = [[0, 1, 2, 3], [4, 5, 6]];
  rows.forEach((row, r) => {
    const total = row.reduce((a, k) => a + ws[k], 0) + 24 * (row.length - 1);
    let x = 960 - total / 2;
    row.forEach((k) => {
      NPOS[k] = [x, 400 + r * 96];
      x += ws[k] + 24;
    });
  });
}
function buildOverlays() {
  $("#ins").innerHTML = `<div class="paper po"><div class="ph">CUSTOMER PURCHASE ORDER</div><div class="pl">PO 4471 · Line 1</div><div class="pl">Drive shaft DS-120 · Qty 60</div><div class="pk">Diameter</div><div class="pv" id="insPO">Ø 25.40 mm</div><div class="pl dim">Tolerance ± 0.02 mm</div></div>
    <div class="paper jc"><div class="ph">JOB CARD</div><div class="pl">Part DS-120 · Machine M02</div><div class="pk">Diameter</div><div class="hand"><span>Ø </span><span id="insHand"></span></div><div class="pl dim">Qty 60 · Today</div><div class="ring" id="insRing"></div></div>
    <div class="pen" id="insPen"></div>`;
  $("#calls").innerHTML = [["Factory", "Line 2 · Supervisor"], ["SearchCheck", "Quality"], ["Boxes", "Stores"]].map(([i, n], k) => `<div class="call" id="call${k}"><span class="ci">${ic("Phone")}</span><div><b>${n}</b><span>Incoming call</span></div></div>`).join("");
  $("#loss").innerHTML = LOSS.map(([i, n], k) => `<div class="ltag" id="lt${k}">${ic(i)}${n}</div>`).join("");
  $("#manual").innerHTML = [["Sheet", "Spreadsheets"], ["Files", "Paper records"], ["PhoneCall", "Manual communication"]].map(([i, n], k) => `<div class="mcard" id="mc${k}">${ic(i)}<b>${n}</b><span class="x">${ic("Unlink")}</span></div>`).join("");
  const pts = [[260, 560], [590, 560], [920, 560], [1450, 520], [1113, 480], [1100, 790]];
  $("#net").innerHTML = `<svg width="1920" height="1080" overflow="visible">${pts.map(([x, y], k) => `<path id="nl${k}" d="M960,300 Q${(960 + x) / 2},${Math.min(y, 300) - 60} ${x},${y}" stroke="#60a5fa" stroke-width="3" fill="none" stroke-dasharray="900" stroke-dashoffset="900"/><circle id="nd${k}" cx="${x}" cy="${y}" r="10" fill="#93c5fd" opacity="0"/>`).join("")}</svg>`;
  $("#nodes").innerHTML = NODES.map(([i, n], k) => `<div class="node" id="no${k}">${ic(i)}${n}</div>`).join("");
  // the feature panels: a 3 x 2 grid to the right of the manager
  const P = [
    ["LayoutDashboard", "Manufacturing overview", `<div class="tiles"><div class="tile"><span>Machines running</span><b id="f0a">0/12</b></div><div class="tile"><span>Jobs in progress</span><b id="f0b">0</b></div><div class="tile"><span>Waiting for QC</span><b id="f0c">0</b></div></div>`],
    ["PackageCheck", "Order fulfilment", [["PO-4471", 72], ["PO-4475", 45], ["PO-4480", 18]].map(([o, v], k) => `<div class="ord"><span>${o}</span><div class="bar"><i id="f1${k}" data-v="${v}"></i></div><b id="f1v${k}">0%</b></div>`).join("")],
    ["ClipboardList", "Production management", [["Production order PO-4471", "In progress", "now"], ["Production order PO-4475", "Released", "rel"], ["Production order PO-4462", "Completed", "done"]].map(([o, s, c]) => `<div class="prow"><span>${o}</span><i class="st ${c}">${s}</i></div>`).join("")],
    ["ChartColumn", "Dashboards", `<div class="chart">${[46, 62, 58, 74, 80, 88, 92].map((h, k) => `<i id="f3${k}" style="height:${h}%"></i>`).join("")}</div>`],
    ["FileChartColumn", "Reports hub", ["Production report", "Material consumption", "Rejection report", "Order status"].map((r) => `<div class="rrow">${ic("FileText")}${r}</div>`).join("")],
    ["Network", "Connected information", `<div class="conn"><div class="hubn">Synax</div>${["Production", "Quality", "Stores", "Planning"].map((d, k) => `<div class="dep d${k}" id="f5${k}">${d}</div>`).join("")}<svg width="370" height="170">${[[70, 32], [310, 32], [70, 138], [310, 138]].map(([x, y], k) => `<line id="f5l${k}" x1="190" y1="85" x2="${x}" y2="${y}" stroke="#60a5fa" stroke-width="3" stroke-dasharray="160" stroke-dashoffset="160"/>`).join("")}</svg></div>`],
  ];
  $("#pan").innerHTML = P.map(([i, h, body], k) => `<div class="gp" id="gp${k}" style="left:${560 + (k % 3) * 450}px;top:${150 + Math.floor(k / 3) * 400}px"><div class="gh">${ic(i)}${h}</div>${body}</div>`).join("");
  // the manager reviewing on his tablet, drawn sharp in front of the blurred factory
  $("#pmOver").innerHTML = `<svg viewBox="0 0 520 1080" width="520" height="1080" overflow="visible"><g id="xpm" transform="translate(270,1180) scale(1.55)">${ART.person("xpmP", ART.castO("pm", "tablet"))}</g></svg>`;
}

/* ---------- main apply ---------- */
function apply(t) {
  const sh = shotAt(t);
  let [s, cx, cy] = camAt(sh, t);
  const shake = sh.shake ? prog(t, T.vib, T.sparks + 0.4) * (1 - prog(t, T.stop + 0.2, T.stop + 1.0)) : 0;
  s *= 1 + Math.max(0, 1 - (t - sh.t0) / 0.25) * (sh.shake ? 0.04 : 0);
  cx += (shake * noise(t * 2, 11) * 14) / s;
  cy += (shake * noise(t * 2.3, 13) * 10) / s;
  for (const [name, cfg] of Object.entries(SETS)) {
    const on = name === sh.set;
    show(cfg.el, on);
    if (!on) continue;
    cfg.layers.forEach((L, li) => {
      const p = cfg.p[li];
      const sl = 1 + (s - 1) * p, xl = 960 + (cx - 960) * p, yl = 540 + (cy - 540) * p;
      L.style.transform = `translate(${(960 - xl * sl).toFixed(2)}px,${(540 - yl * sl).toFixed(2)}px) scale(${sl.toFixed(4)})`;
      const dof = sh.blur ? sh.blur : li === 0 ? clamp((s - 1.4) * 2.2, 0, 4) : li === 1 && name === "factory" ? clamp((s - 2.0) * 1.6, 0, 3) : 0;
      L.style.filter = dof > 0.05 ? `blur(${dof.toFixed(2)}px)` : "none";
    });
  }
  const mode = sh.mode;
  if (sh.set === "factory") factory(t, mode);
  if (sh.set === "qc") qc(t, mode);
  if (sh.set === "office") office(t);
  if (sh.set === "plant") plant(t, mode);

  // lighting
  const flash = mode === "flash";
  $("#world").style.filter = flash ? "sepia(.75) saturate(.55) contrast(1.05) brightness(.95)" : mode === "cool" ? "saturate(.7) brightness(.92)" : mode === "idle" ? "saturate(.6) brightness(.85)" : mode === "clean" ? "brightness(1.12) saturate(1.05)" : "none";
  const redOn = mode === "crisis" ? (t >= T.alarm ? 1 : prog(t, T.vib, T.alarm) * 0.3) : mode === "alarm" || mode === "idle" ? 0.4 : 0;
  const pulse = 0.55 + 0.45 * Math.max(0, Math.sin(t * 9));
  $("#red").style.opacity = (redOn * pulse * 0.55).toFixed(3);
  $("#redglow").style.opacity = (redOn * pulse * 0.7).toFixed(3);
  $("#vig").style.opacity = mode === "clean" ? 0.25 : 0.75;
  $("#cool").style.opacity = mode === "cool" ? 0.5 : 0;
  $("#cleanL").style.opacity = mode === "clean" ? (sh.panels ? 0.2 : 0.55) : 0;
  $("#dim").style.opacity = sh.dim || 0;
  const fl = Math.max(1 - Math.abs(t - T.fb) / 0.25, 1 - Math.abs(t - T.fbEnd) / 0.25, 0);
  $("#flash").style.opacity = clamp(fl).toFixed(3);
  $("#fbLabel").style.opacity = flash ? win(t, S[4] + 0.3, T.write0 - 0.6, 0.4) : 0;
  $("#grain").style.opacity = flash ? 0.5 + 0.1 * Math.sin(t * 40) : 0;

  // role tags: a lower third the first time each person speaks
  const tagOn = sh.tag && t < sh.t0 + 2.8;
  $("#role").style.opacity = tagOn ? win(t, sh.t0 + 0.2, sh.t0 + 2.8, 0.3) : 0;
  if (sh.tag) put($("#role"), `<b>${sh.tag[1]}</b>`);
  // incoming calls on the manager's phone
  show($("#calls"), !!sh.calls);
  if (sh.calls) [0, 1, 2].forEach((k) => {
    const t0 = T.calls + k * 0.45;
    const u = prog(t, t0, t0 + 0.4);
    $("#call" + k).style.opacity = smoother(u) * (1 - prog(t, S[2] - 0.5, S[2]));
    $("#call" + k).style.transform = `translateX(${((1 - eo(u)) * 60).toFixed(1)}px) rotate(${(Math.sin(t * 30) * (t < t0 + 1.2 ? 1.5 : 0)).toFixed(2)}deg)`;
  });
  // loss tags in the montage
  LOSS.forEach((_, k) => {
    const on = sh.lossTag === k;
    const u = on ? prog(t, sh.t0 + 0.15, sh.t0 + 0.5) : 0;
    $("#lt" + k).style.opacity = smoother(u);
    $("#lt" + k).style.transform = `translateY(${((1 - eo(u)) * 20).toFixed(1)}px)`;
  });

  // the insert: the order and the hand-written job card
  show($("#ins"), !!sh.insert);
  if (sh.insert) {
    const u = smoother(prog(t, sh.t0, sh.t0 + 0.4));
    $("#ins").style.opacity = u;
    $("#ins").style.transform = `scale(${(1.04 - 0.04 * u + 0.12 * smoother(prog(t, T.write1, T.toTray))).toFixed(4)})`;
    $("#ins").style.transformOrigin = "70% 48%";
    put($("#insHand"), "24.50".slice(0, Math.floor(5 * prog(t, T.write0, T.write1))));
    const r = smoother(prog(t, T.mark, T.mark + 0.4));
    $("#insRing").style.opacity = r;
    $("#insRing").style.transform = `scale(${(1.3 - 0.3 * r).toFixed(3)})`;
    const pu = prog(t, T.write0, T.write1);
    $("#insPen").style.transform = `translate(${(1160 + pu * 210 + (pu > 0 && pu < 1 ? Math.sin(t * 30) * 6 : 0)).toFixed(1)}px,${(520 + (pu > 0 && pu < 1 ? Math.cos(t * 24) * 6 : 0) - (pu >= 1 ? 40 : 0)).toFixed(1)}px) rotate(28deg)`;
  }
  // the turning point: the manual ways of working, then the ripple, the network, the logo and the areas
  show($("#manual"), !!sh.manual, "flex");
  if (sh.manual) T.manual.forEach((tm, k) => {
    const u = prog(t, tm, tm + 0.45);
    const out = smoother(prog(t, T.synax - 0.35, T.synax));
    $("#mc" + k).style.opacity = smoother(u) * (1 - out);
    $("#mc" + k).style.transform = `translateY(${((1 - eo(u)) * 30 + out * 40).toFixed(1)}px) rotate(${((k - 1) * 3).toFixed(1)}deg)`;
  });
  const rp = prog(t, T.synax - 0.3, T.synax + 0.6);
  $("#ripple").style.opacity = rp > 0 && rp < 1 ? (1 - rp) * 0.9 : 0;
  $("#ripple").style.transform = `translate(-50%,-50%) scale(${(0.1 + rp * 3.2).toFixed(3)})`;
  const netOn = !!sh.network;
  show($("#net"), netOn);
  show($("#nodes"), netOn);
  const lg = prog(t, T.logo, T.logo + 0.7);
  $("#logo").style.opacity = netOn ? smoother(lg) : 0;
  $("#logo").style.transform = `translate(-50%,0) translateY(${((1 - eo(lg)) * 24).toFixed(1)}px) scale(${(0.92 + 0.08 * eo(lg)).toFixed(3)})`;
  if (netOn) {
    [0, 1, 2, 3, 4, 5].forEach((k) => {
      const d = smoother(prog(t, T.logo + 0.4 + k * 0.15, T.logo + 1.0 + k * 0.15));
      $$("nl" + k).setAttribute("stroke-dashoffset", (900 * (1 - d)).toFixed(0));
      $$("nd" + k).setAttribute("opacity", d >= 1 ? (0.6 + 0.4 * Math.sin(t * 4 + k)).toFixed(2) : 0);
    });
    NODES.forEach((_, k) => {
      const n = $("#no" + k);
      const u = prog(t, T.nodes + k * 0.16, T.nodes + 0.4 + k * 0.16);
      n.style.left = NPOS[k][0] + "px";
      n.style.top = NPOS[k][1] + "px";
      n.style.opacity = smoother(u);
      n.style.transform = `scale(${(0.7 + 0.3 * back(u)).toFixed(3)})`;
    });
  }
  // the feature panels and the manager
  const panOn = !!sh.panels;
  show($("#pan"), panOn);
  show($("#pmOver"), panOn);
  if (panOn) {
    T.feats.forEach((tf, k) => {
      const u = prog(t, tf, tf + 0.5);
      $("#gp" + k).style.opacity = smoother(u);
      $("#gp" + k).style.transform = `translateY(${((1 - eo(u)) * 40).toFixed(1)}px) scale(${(0.94 + 0.06 * eo(u)).toFixed(3)})`;
      $("#gp" + k).classList.toggle("hot", t >= tf && t < (T.feats[k + 1] || S[7]));
    });
    const c0 = smoother(prog(t, T.feats[0] + 0.2, T.feats[0] + 1.2));
    put($("#f0a"), `${Math.round(11 * c0)}/12`);
    put($("#f0b"), String(Math.round(24 * c0)));
    put($("#f0c"), String(Math.round(3 * c0)));
    [0, 1, 2].forEach((k) => {
      const v = +$("#f1" + k).dataset.v, u = smoother(prog(t, T.feats[1] + 0.2 + k * 0.15, T.feats[1] + 1.2 + k * 0.15));
      $("#f1" + k).style.width = v * u + "%";
      put($("#f1v" + k), Math.round(v * u) + "%");
    });
    for (let k = 0; k < 7; k++) $("#f3" + k).style.transform = `scaleY(${smoother(prog(t, T.feats[3] + 0.2 + k * 0.08, T.feats[3] + 0.7 + k * 0.08)).toFixed(3)})`;
    [0, 1, 2, 3].forEach((k) => {
      const u = smoother(prog(t, T.feats[5] + 0.2 + k * 0.15, T.feats[5] + 0.6 + k * 0.15));
      $$("f5l" + k).setAttribute("stroke-dashoffset", (160 * (1 - u)).toFixed(0));
      $("#f5" + k).style.opacity = 0.35 + 0.65 * u;
    });
    const pu = smoother(prog(t, S[6], S[6] + 0.6));
    $("#pmOver").style.opacity = pu;
    $("#pmOver").style.transform = `translateX(${((1 - pu) * -60).toFixed(1)}px)`;
    arm("xpmP", 1, -25);
    arm("xpmP", -1, 25);
    face("xpmP", t, { smile: 1, look: 0.8 });
    head("xpmP", 0, -4);
  }
  // end card
  const endOn = !!sh.endcard;
  const ec = endOn ? smoother(prog(t, S[8], S[8] + 0.7)) : 0;
  $("#end").style.opacity = ec;
  const e1 = prog(t, CW(17, "From", 0, -0.1), CW(17, "From", 0, 0.6)), e2 = prog(t, CW(17, "Synax", 0, -0.2), CW(17, "Synax", 0, 0.5));
  $("#endLogo").style.opacity = smoother(prog(t, S[8] + 0.2, S[8] + 0.9));
  $("#endT").style.opacity = smoother(e1);
  $("#endT").style.transform = `translateY(${((1 - eo(e1)) * 20).toFixed(1)}px)`;
  $("#endS").style.opacity = smoother(e2);
  $("#endS").style.transform = `translateY(${((1 - eo(e2)) * 16).toFixed(1)}px)`;
  $("#fade0").style.opacity = 1 - smoother(prog(t, 0, 0.35));
  $("#fadeEnd").style.opacity = smoother(prog(t, TOTAL - 0.6, TOTAL));
}

/* ---------- sound cues ---------- */
function cues() {
  sfx(0, "hum", 0.5);
  sfx(T.vib, "rattle", 0.45);
  sfx(T.sparks, "sparks", 0.4);
  sfx(T.alarm, "alarm", 0.3);
  [3.2, 4.7, 6.0, 7.6].forEach((c) => sfx(c, "hit", 0.4));
  sfx(T.estop, "clank", 0.55);
  sfx(T.stop, "spindown", 0.5);
  sfx(T.convStop - 1.2, "motordown", 0.35);
  for (let i = 0; i < 10; i++) sfx(T.pileFrom + 0.3 + i * 0.26, "tink", 0.18 + hash(i, 4) * 0.1);
  [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75].forEach((d) => sfx(T.rush + d, "step", 0.2));
  // walkie-talkie squelch around the operator's call and the supervisor's answer
  sfx(C[0].s - 0.3, "squelch", 0.3);
  sfx(C[0].e + 0.05, "squelch", 0.25);
  sfx(C[3].s - 1.0, "phone", 0.2);
  sfx(T.calls + 0.45, "phone2", 0.16);
  T.loss.forEach((tl) => sfx(tl, "hit", 0.25));
  sfx(T.invIn - 1.0, "paper", 0.2);
  sfx(C[6].s + 0.5, "paper", 0.22);
  sfx(C[12].s + 0.5, "paper", 0.25);
  sfx(CW(12, "entered", 0, -0.3), "clockt", 0.3);
  sfx(CW(12, "Why", 0, -0.5), "phone", 0.18);
  sfx(T.fb - 0.6, "riser", 0.35);
  sfx(T.fb, "whoosh", 0.35);
  sfx(T.write0, "scribble", 0.3);
  sfx(T.mark, "hit", 0.35);
  sfx(T.toTray, "paper", 0.25);
  sfx(T.keyIn - 0.4, "keys", 0.25);
  sfx(T.run, "hum", 0.3);
  sfx(T.fbEnd - 0.4, "whoosh", 0.35);
  T.manual.forEach((tm) => sfx(tm, "glitch", 0.2));
  sfx(T.synax - 1.2, "riser", 0.4);
  sfx(T.synax, "logo", 0.5);
  NODES.forEach((_, k) => sfx(T.nodes + 0.1 + k * 0.16, "ping", 0.16));
  T.feats.forEach((tf) => sfx(tf, "pop", 0.24));
  sfx(T.okRead, "okbeep", 0.3);
  sfx(S[8], "logo", 0.45);
  sfx(CW(17, "Synax", 0, -0.1), "endchime", 0.4);
}

async function boot() {
  try {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
    buildSets();
    buildOverlays();
    layoutNodes();
    cues();
    window.__apply = apply;
    window.__total = TOTAL;
    window.__starts = S;
    window.__T = T;
    window.__C = C;
    window.__shots = SHOTS.map((s) => [s.t0, s.set, s.mode, !!s.cutaway]);
    window.__meta = {
      total: TOTAL, clips: C.map((c, k) => c.file), sfx: SFX.sort((a, b) => a[0] - b[0]),
      music: { tension: [0, T.synax - 0.4], resolve: [T.synax - 0.4, TOTAL], swell: [S[2], T.synax] }, scenes: S, cuts: SHOTS.map((s) => s.t0),
    };
    window.__ready = true;
    apply(0);
  } catch (e) {
    window.__err = e.stack || String(e);
  }
}
boot();
