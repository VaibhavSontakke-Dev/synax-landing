/* The HR office cartoon, drawn as SVG, as a pure function of time.
   Toon:  the opening story (an Employee asks about leave, a Hiring Manager about an interview, a leaving Employee about a
          settlement, the HR Manager searches spreadsheets), with speech bubbles and problem chips.
   ToonV: eight short "problem" vignettes with the same characters, one before each HRMS area.
   Exposes window.Toon = { build(host), apply(c), times, bubbles, chips } and window.ToonV = { build(host, i), apply(i, c), cfg }. */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const sm = (u) => u * u * u * (u * (u * 6 - 15) + 10);
  const pr = (t, a, b) => cl((t - a) / (b - a));
  const lerp = (a, b, u) => a + (b - a) * u;
  const hs = (k, s = 1) => {
    const x = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const back = (u) => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2); // ease-out with a little overshoot
  const ico = (n, x, y, s, color, sw = 2) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ""}</svg>`;

  /* ---------- people ---------- */
  function person(id, o) {
    const hairC = o.hair === "none" ? "#2b2b2b" : o.hair;
    const hair = {
      short: `<path d="M-49,-4 Q-56,-54 0,-60 Q56,-54 49,-4 Q46,-30 24,-35 Q0,-27 -24,-35 Q-46,-30 -49,-4Z" fill="${o.hair}"/>`,
      pony: `<path d="M-49,-4 Q-56,-54 0,-60 Q56,-54 49,-4 Q46,-30 24,-35 Q0,-27 -24,-35 Q-46,-30 -49,-4Z" fill="${o.hair}"/><path d="M44,-30 Q82,-26 70,30 Q62,4 46,-8Z" fill="${o.hair}"/><circle cx="52" cy="-26" r="7" fill="#3b82f6"/>`,
    }[o.style];
    const glasses = o.glasses ? `<g fill="none" stroke="#1e293b" stroke-width="3.5"><circle cx="-17" cy="-3" r="14"/><circle cx="17" cy="-3" r="14"/><path d="M-3,-3 L3,-3"/></g>` : "";
    const tie = o.tie ? `<path d="M-8,-318 L8,-318 L11,-232 L0,-214 L-11,-232Z" fill="${o.tie}"/><path d="M-22,-330 L0,-304 L22,-330 L8,-336 L0,-326 L-8,-336Z" fill="#f8fafc"/>` : `<path d="M-20,-330 Q0,-300 20,-330 Q0,-338 -20,-330Z" fill="${o.skinD}"/>`;
    return `<g id="${id}">
 <ellipse cx="0" cy="4" rx="86" ry="15" fill="rgba(12,24,52,.26)"/>
 <g id="${id}_legs">
  <rect x="-43" y="-184" width="37" height="172" rx="11" fill="${o.pants}"/><rect x="6" y="-184" width="37" height="172" rx="11" fill="${o.pants}"/>
  <path d="M-54,-12 Q-54,-25 -37,-25 L-6,-25 L-6,-5 Q-6,3 -17,3 L-47,3 Q-54,3 -54,-5Z" fill="#0f172a"/><path d="M54,-12 Q54,-25 37,-25 L6,-25 L6,-5 Q6,3 17,3 L47,3 Q54,3 54,-5Z" fill="#0f172a"/>
 </g>
 <g id="${id}_body">
  <path d="M-64,-318 Q-72,-318 -72,-298 L-68,-168 Q-68,-158 -58,-158 L58,-158 Q68,-158 68,-168 L72,-298 Q72,-318 64,-318 Q32,-332 0,-332 Q-32,-332 -64,-318Z" fill="${o.shirt}"/>
  <path d="M-64,-318 Q-72,-318 -72,-298 L-68,-168 Q-68,-158 -58,-158 L-40,-158 L-44,-318Z" fill="#fff" opacity=".07"/>
  ${tie}
  <g id="${id}_aL" transform="translate(-72,-298)"><rect x="-16" y="-8" width="32" height="136" rx="16" fill="${o.sleeve}"/><circle cy="138" r="16" fill="${o.skin}"/></g>
  <g id="${id}_aR" transform="translate(72,-298)"><rect x="-16" y="-8" width="32" height="136" rx="16" fill="${o.sleeve}"/><circle cy="138" r="16" fill="${o.skin}"/></g>
  ${o.front || ""}
  <rect x="-15" y="-352" width="30" height="30" rx="8" fill="${o.skinD}"/>
  <g id="${id}_head" transform="translate(0,-376)">
   <circle cx="-47" cy="2" r="10" fill="${o.skin}"/><circle cx="47" cy="2" r="10" fill="${o.skin}"/>
   <circle r="47" fill="${o.skin}"/>
   <g id="${id}_eyes"><ellipse cx="-17" cy="-3" rx="8.5" ry="9.5" fill="#fff"/><ellipse cx="17" cy="-3" rx="8.5" ry="9.5" fill="#fff"/><circle id="${id}_pl" cx="-17" cy="-2" r="4.8" fill="#1e293b"/><circle id="${id}_pr" cx="17" cy="-2" r="4.8" fill="#1e293b"/></g>
   <path id="${id}_bl" d="M-28,-19 L-8,-19" stroke="${hairC}" stroke-width="4.5" stroke-linecap="round"/><path id="${id}_br" d="M8,-19 L28,-19" stroke="${hairC}" stroke-width="4.5" stroke-linecap="round"/>
   <path d="M0,4 Q6,14 0,16" fill="none" stroke="${o.skinD}" stroke-width="3" stroke-linecap="round"/>
   <path id="${id}_smile" d="M-13,22 Q0,36 13,22" fill="none" stroke="#7a2f2f" stroke-width="4" stroke-linecap="round"/>
   <path id="${id}_frown" d="M-12,32 Q0,20 12,32" fill="none" stroke="#7a2f2f" stroke-width="4" stroke-linecap="round" opacity="0"/>
   <ellipse id="${id}_talk" cx="0" cy="27" rx="10" ry="2" fill="#7a2f2f" opacity="0"/>
   ${glasses}
   ${hair}
  </g>
 </g>
</g>`;
  }
  // things people hold (drawn in front of the body)
  const FRONT = {
    clipboard: `<g transform="translate(-92,-196) rotate(-10)"><rect x="-38" y="-48" width="76" height="98" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><rect x="-16" y="-56" width="32" height="14" rx="5" fill="#64748b"/><path d="M-24,-22 L24,-22 M-24,-4 L24,-4 M-24,14 L10,14" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/></g><circle cx="-88" cy="-170" r="16" fill="SKIN"/>`,
    box: `<g transform="translate(0,-226)"><rect x="-104" y="-64" width="208" height="128" rx="8" fill="#d8b98a"/><rect x="-104" y="-64" width="208" height="24" fill="#c9a774"/><path d="M-36,-64 L-36,-40 M36,-64 L36,-40" stroke="#b08d5c" stroke-width="4"/><g transform="translate(-50,-64)"><rect x="-14" y="-30" width="28" height="32" rx="5" fill="#f8fafc"/><path d="M14,-22 Q26,-18 14,-8" fill="none" stroke="#f8fafc" stroke-width="4"/></g><g transform="translate(46,-64)"><rect x="-16" y="-14" width="32" height="18" rx="4" fill="#94a3b8"/><path d="M0,-14 Q-26,-50 -6,-74 Q4,-44 0,-14 Q14,-56 34,-62 Q22,-30 0,-14" fill="#22c55e"/></g></g>`,
    phone: `<g transform="translate(66,-214) rotate(8)"><rect x="-26" y="-46" width="52" height="92" rx="10" fill="#1e293b"/><rect x="-20" y="-38" width="40" height="72" rx="5" fill="#60a5fa"/><path d="M-12,-18 L12,-18 M-12,-6 L8,-6 M-12,6 L12,6" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round"/></g>`,
  };
  const CAST = {
    A: { skin: "#d9a073", skinD: "#c48a5c", hair: "#2a1d18", style: "pony", shirt: "#3b82f6", sleeve: "#3b82f6", pants: "#1e293b" },
    B: { skin: "#f1c9a5", skinD: "#dcae88", hair: "#2b2b33", style: "short", shirt: "#f8fafc", sleeve: "#e8eef7", pants: "#1e293b", tie: "#1e3a8a", glasses: 1 },
    C: { skin: "#b9764a", skinD: "#a3643c", hair: "#3f3f46", style: "short", shirt: "#475569", sleeve: "#475569", pants: "#1e293b", tie: "#0f172a", front: "clipboard" },
    D: { skin: "#8d5a3b", skinD: "#774a30", hair: "#16110f", style: "short", shirt: "#0ea5e9", sleeve: "#0ea5e9", pants: "#334155", front: "box" },
  };
  const castO = (k, front) => {
    const o = { ...CAST[k] };
    const f = front === undefined ? o.front : front;
    o.front = f ? FRONT[f].replace("SKIN", o.skin) : "";
    return o;
  };
  const ppl = {
    A: { x: 330, y: 930, s: 1 },
    B: { x: 790, y: 842, s: 1 },
    C: { x: 1580, y: 940, s: 1 },
    D: { x: 560, y: 1012, s: 1.1 },
  };

  /* ---------- scene pieces (ids are prefixed so several SVGs can live on one page) ---------- */
  const skyline = [[0, 70, 60], [60, 130, 40], [100, 50, 70], [170, 110, 50], [220, 80, 80], [300, 140, 44], [344, 60, 66], [410, 100, 54], [464, 70, 40]]
    .map(([x, h, w]) => `<rect x="${x}" y="${330 - h}" width="${w}" height="${h}" fill="#9db6d6"/>`).join("");
  const boxes = [[1360, 276, 96, 54, "#d8c3a0"], [1470, 292, 84, 38, "#e2e8f0"], [1568, 266, 110, 64, "#d8c3a0"], [1692, 284, 90, 46, "#cbd5e1"],
    [1372, 506, 120, 54, "#e2e8f0"], [1506, 486, 100, 74, "#d8c3a0"], [1620, 512, 70, 48, "#cbd5e1"], [1704, 496, 84, 64, "#d8c3a0"]]
    .map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${c}"/><rect x="${x}" y="${y + h * 0.4}" width="${w}" height="${h * 0.14}" fill="rgba(30,58,138,.18)"/>`).join("");
  const grid = (() => {
    let g = "";
    for (let r = 0; r <= 5; r++) g += `<line x1="0" x2="214" y1="${r * 20}" y2="${r * 20}" stroke="#cbd5e1" stroke-width="1.4"/>`;
    for (let c = 0; c <= 4; c++) g += `<line y1="0" y2="100" x1="${c * 53.5}" x2="${c * 53.5}" stroke="#cbd5e1" stroke-width="1.4"/>`;
    return g;
  })();
  const PAPERS = Array.from({ length: 12 }, (_, i) => ({ x: 640 + (i % 6) * 62 + hs(i, 3) * 20, y: 624 - Math.floor(i / 6) * 4, r: (hs(i, 4) - 0.5) * 24 }));
  const BG = (p, shelves = true) => `
<defs>
 <linearGradient id="${p}Wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6edf8"/><stop offset="1" stop-color="#c9d7ec"/></linearGradient>
 <linearGradient id="${p}Floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa5c6"/><stop offset="1" stop-color="#5f789f"/></linearGradient>
 <linearGradient id="${p}Sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fbdf2"/><stop offset="1" stop-color="#e3effc"/></linearGradient>
 <radialGradient id="${p}Vig" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#0a1428" stop-opacity="0"/><stop offset="1" stop-color="#0a1428" stop-opacity=".55"/></radialGradient>
 <linearGradient id="${p}Beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<rect x="-200" y="-100" width="2320" height="830" fill="url(#${p}Wall)"/>
<rect x="-200" y="696" width="2320" height="26" fill="#b3c3dc"/>
<rect x="-200" y="720" width="2320" height="460" fill="url(#${p}Floor)"/>
${[-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<line x1="${960 + (i - 2.5) * 70}" y1="722" x2="${960 + (i - 2.5) * 360}" y2="1180" stroke="rgba(255,255,255,.07)" stroke-width="2"/>`).join("")}
<g transform="translate(150,120)"><rect x="-14" y="-14" width="528" height="378" rx="10" fill="#f1f5fb"/><svg x="0" y="0" width="500" height="350"><rect width="500" height="350" fill="url(#${p}Sky)"/><g transform="translate(0,20)">${skyline}</g><circle cx="410" cy="70" r="26" fill="#fff" opacity=".7"/></svg><path d="M250,0 L250,350 M0,175 L500,175" stroke="#f1f5fb" stroke-width="10"/></g>
<polygon points="150,470 650,470 1010,930 440,930" fill="url(#${p}Beam)" opacity=".5"/>
${shelves ? `<rect x="1330" y="150" width="500" height="470" rx="10" fill="#d6e0f0"/><rect x="1346" y="166" width="468" height="438" rx="6" fill="#bccae0"/>
<rect x="1346" y="330" width="468" height="14" fill="#8e9db8"/><rect x="1346" y="560" width="468" height="14" fill="#8e9db8"/>${boxes}` : ""}`;
  const CLOCK = (p, x, y, r) => `<g transform="translate(${x},${y})"><circle r="${r}" fill="#f8fafc" stroke="#94a3b8" stroke-width="${r * 0.14}"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<line x1="${Math.sin((i * Math.PI) / 6) * r * 0.8}" y1="${-Math.cos((i * Math.PI) / 6) * r * 0.8}" x2="${Math.sin((i * Math.PI) / 6) * r * 0.92}" y2="${-Math.cos((i * Math.PI) / 6) * r * 0.92}" stroke="#64748b" stroke-width="${r * 0.06}"/>`).join("")}<line id="${p}ClockM" x1="0" y1="0" x2="0" y2="${-r * 0.68}" stroke="#1e293b" stroke-width="${r * 0.08}" stroke-linecap="round"/><line id="${p}ClockH" x1="0" y1="0" x2="0" y2="${-r * 0.45}" stroke="#1e293b" stroke-width="${r * 0.1}" stroke-linecap="round"/><circle r="${r * 0.07}" fill="#1e293b"/></g>`;
  const CHAIR = `<rect x="712" y="452" width="158" height="250" rx="34" fill="#1e3a8a"/><rect x="734" y="474" width="114" height="206" rx="24" fill="#27489f"/>`;
  const DESK = (p) => `
<rect x="560" y="640" width="680" height="34" rx="8" fill="#d3dbe8"/><rect x="580" y="674" width="640" height="170" fill="#9fb0c9"/><rect x="580" y="674" width="640" height="14" fill="rgba(0,0,0,.1)"/>
<rect x="600" y="700" width="260" height="120" rx="6" fill="#8ea1be"/><rect x="940" y="700" width="260" height="120" rx="6" fill="#8ea1be"/>
<rect x="716" y="750" width="28" height="9" rx="4" fill="#64748b"/><rect x="1056" y="750" width="28" height="9" rx="4" fill="#64748b"/>
<g transform="translate(970,468)"><rect x="-12" y="-12" width="238" height="154" rx="9" fill="#1e293b"/><rect x="0" y="0" width="214" height="130" rx="3" fill="#fff"/><rect x="0" y="0" width="214" height="20" fill="#2f6fd6"/>
 <g transform="translate(0,20)"><svg x="0" y="0" width="214" height="110" viewBox="0 0 214 110">${grid}</svg>
  <rect id="${p}Cell1" x="54" y="22" width="52" height="19" fill="#ef4444" opacity=".9"/><rect id="${p}Cell2" x="108" y="62" width="52" height="19" fill="#ef4444" opacity=".9"/><rect id="${p}Cell3" x="2" y="42" width="52" height="19" fill="#fbbf24" opacity=".9"/><rect id="${p}Cell4" x="161" y="22" width="52" height="19" fill="#ef4444" opacity=".9"/>
  <text x="62" y="36" font-size="13" font-weight="700" fill="#fff" font-family="Inter,sans-serif">#N/A</text><text x="171" y="36" font-size="13" font-weight="700" fill="#fff" font-family="Inter,sans-serif">???</text><text x="14" y="56" font-size="13" font-weight="700" fill="#5b3b00" font-family="Inter,sans-serif">old</text><text x="117" y="76" font-size="13" font-weight="700" fill="#fff" font-family="Inter,sans-serif">#N/A</text></g></g>
<rect x="1070" y="610" width="26" height="30" fill="#64748b"/><rect x="1040" y="634" width="86" height="8" rx="4" fill="#64748b"/>
<rect x="1130" y="624" width="26" height="20" rx="4" fill="#f8fafc"/><path d="M1156,628 Q1170,632 1156,640" fill="none" stroke="#f8fafc" stroke-width="3"/>
<rect x="640" y="626" width="120" height="14" rx="3" fill="#e2e8f0"/>`;
  const papersSvg = (p) => `<g>${PAPERS.map((q, i) => `<rect id="${p}Pap${i}" x="-22" y="-28" width="44" height="56" rx="3" fill="${i % 3 ? "#ffffff" : "#eef3fb"}" stroke="#c4d0e2" stroke-width="2"/>`).join("")}</g>`;
  const qmarks = (p) => `<g fill="#1e3a8a" font-family="Inter,sans-serif" font-weight="800" font-size="64">${[0, 1, 2].map((i) => `<text id="${p}Q${i}" x="0" y="0" text-anchor="middle" opacity="0">?</text>`).join("")}</g>`;

  /* ---------- shared drawing helpers ---------- */
  const el = {};
  const cache = new Map();
  const setA = (e, k, v) => {
    let m = cache.get(e);
    if (!m) cache.set(e, (m = {}));
    if (m[k] !== v) {
      e.setAttribute(k, v);
      m[k] = v;
    }
  };
  const $$ = (id) => el[id] || (el[id] = document.getElementById(id));
  function face(pid, c, speaking, mood, look, blink) {
    const m = speaking ? 0.5 + 0.5 * Math.sin(c * 17 + pid.length) : 0;
    setA($$(pid + "_talk"), "opacity", speaking ? 1 : 0);
    setA($$(pid + "_talk"), "ry", (2 + m * 7).toFixed(1));
    setA($$(pid + "_smile"), "opacity", !speaking && mood < 0.5 ? 1 : 0);
    setA($$(pid + "_frown"), "opacity", !speaking && mood >= 0.5 ? 1 : 0);
    const by = mood * 3;
    setA($$(pid + "_bl"), "transform", `rotate(${mood * -9} -18 -19) translate(0 ${-by})`);
    setA($$(pid + "_br"), "transform", `rotate(${mood * 9} 18 -19) translate(0 ${-by})`);
    setA($$(pid + "_pl"), "cx", (-17 + look * 3.2).toFixed(1));
    setA($$(pid + "_pr"), "cx", (17 + look * 3.2).toFixed(1));
    setA($$(pid + "_eyes"), "transform", `translate(0 -3) scale(1 ${(1 - 0.92 * blink).toFixed(2)}) translate(0 3)`);
  }
  const blinkAt = (c, k) => {
    const period = 3.1 + k * 0.37, ph = (c + k * 0.9) % period;
    return ph < 0.14 ? Math.sin((ph / 0.14) * Math.PI) : 0;
  };
  const setArm = (pid, side, a) => setA($$(pid + "_a" + (side < 0 ? "L" : "R")), "transform", `translate(${side * 72},-298) rotate(${a.toFixed(1)})`);
  const camAt = (CAM, c) => {
    if (c <= CAM[0][0]) return CAM[0].slice(1);
    for (let i = 1; i < CAM.length; i++)
      if (c <= CAM[i][0]) {
        const u = sm(pr(c, CAM[i - 1][0], CAM[i][0]));
        return [1, 2, 3].map((k) => lerp(CAM[i - 1][k], CAM[i][k], u));
      }
    return CAM[CAM.length - 1].slice(1);
  };
  const measure = (svgEl, size, weight, lines) => {
    const probe = document.createElementNS(NS, "text");
    probe.setAttribute("font-size", size);
    probe.setAttribute("font-weight", weight);
    probe.setAttribute("font-family", "Inter,sans-serif");
    svgEl.appendChild(probe);
    let w = 0;
    lines.forEach((l) => {
      probe.textContent = l;
      w = Math.max(w, probe.getComputedTextLength());
    });
    svgEl.removeChild(probe);
    return w;
  };
  // a speech bubble above a head; returns its box. leftOpen: the bubble opens to the left of the speaker
  function bubbleSvg(svgEl, id, lines, px, headTop, leftOpen) {
    const w = measure(svgEl, 36, 600, lines);
    const bw = w + 64, bh = lines.length * 46 + 38;
    const bx = leftOpen ? px - bw + 80 : cl(px - bw / 2, 40, 1880 - bw);
    const by = headTop - (leftOpen ? 56 : 40) - bh;
    const box = { x: bx, y: by, w: bw, h: bh, tx: cl(px, bx + 40, bx + bw - 40) };
    const g = document.createElementNS(NS, "g");
    g.id = id;
    g.innerHTML = `<g transform="translate(${bx},${by})"><rect x="3" y="6" width="${bw}" height="${bh}" rx="26" fill="rgba(10,20,40,.22)"/><rect width="${bw}" height="${bh}" rx="26" fill="#fff" stroke="#c8d6ec" stroke-width="2"/>` +
      `<path d="M${box.tx - bx - 20},${bh - 2} L${box.tx - bx},${bh + 30} L${box.tx - bx + 22},${bh - 2}Z" fill="#fff" stroke="#c8d6ec" stroke-width="2"/><rect x="${box.tx - bx - 18}" y="${bh - 6}" width="38" height="6" fill="#fff"/>` +
      lines.map((_, li) => `<text id="${id}_${li}" x="32" y="${50 + li * 46}" font-size="36" font-weight="600" fill="#0f2347" font-family="Inter,sans-serif"></text>`).join("") + `</g>`;
    return { g, box };
  }
  function bubbleApply(id, box, lines, c, t0, t1) {
    const g = $$(id);
    const inU = back(pr(c, t0, t0 + 0.34));
    const out = sm(pr(c, t1 - 0.25, t1));
    setA(g, "opacity", (cl(pr(c, t0, t0 + 0.18)) * (1 - out)).toFixed(3));
    const s = 0.55 + 0.45 * inU;
    setA(g, "transform", `translate(${(box.tx * (1 - s)).toFixed(1)},${((box.y + box.h + 30) * (1 - s)).toFixed(1)}) scale(${s.toFixed(3)})`);
    let n = Math.floor((c - t0 - 0.12) * 34);
    lines.forEach((l, li) => {
      const k = cl(n, 0, l.length);
      n -= l.length;
      const t = $$(id + "_" + li);
      if (t.textContent !== l.slice(0, k)) t.textContent = l.slice(0, k);
    });
  }
  const headTopOf = (p) => p.y - 376 * p.s - 62 * p.s;
  function papersApply(p, c, f0, f1) {
    PAPERS.forEach((q, i) => {
      const e = $$(p + "Pap" + i);
      const flying = c >= f0 && c < f1 + 1.2;
      let x = q.x, y = q.y, r = q.r, sy = 0.3;
      if (flying) {
        const ph = ((c - f0) * (0.55 + hs(i, 5) * 0.35) + hs(i, 6)) % 1;
        const k = Math.sin(Math.PI * ph) * (1 - pr(c, f1, f1 + 1.2));
        x = q.x + (hs(i, 7) - 0.5) * 360 * k;
        y = q.y - (140 + hs(i, 8) * 170) * k;
        r = q.r + (hs(i, 9) - 0.5) * 520 * ph;
        sy = 0.3 + 0.6 * cl(k * 4);
      }
      setA(e, "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(.9 ${sy.toFixed(2)})`);
    });
  }
  function qApply(p, c, on, x0, y0) {
    [0, 1, 2].forEach((i) => {
      const ph = (c * 0.6 + i / 3) % 1;
      const a = on ? Math.sin(Math.PI * ph) : 0;
      setA($$(p + "Q" + i), "opacity", a.toFixed(2));
      setA($$(p + "Q" + i), "transform", `translate(${x0 + i * 100 + Math.sin(c * 3 + i) * 10},${y0 - ph * 90}) scale(${0.7 + a * 0.5})`);
    });
  }
  function cellsApply(p, c, on) {
    ["Cell1", "Cell2", "Cell4"].forEach((id, i) => setA($$(p + id), "opacity", !on ? 0 : (0.55 + 0.45 * Math.sin(c * 7 + i * 1.7)).toFixed(2)));
    setA($$(p + "Cell3"), "opacity", on ? 0.9 : 0);
  }

  /* ---------- opening story ---------- */
  // times follow the narration: "Leave questions (A). Missed interviews (C). Late settlements (D). ...spreadsheets (B)"
  const BUBBLES = [
    { who: "A", lines: ["How many leaves", "do I have left?"], t0: 0.35, t1: 2.7 },
    { who: "C", lines: ["When is the", "interview again?"], t0: 2.25, t1: 4.7 },
    { who: "D", lines: ["Is my settlement", "done yet?"], t0: 4.3, t1: 7.0 },
    { who: "B", lines: ["Let me check", "the spreadsheets..."], t0: 6.8, t1: 10.4 },
  ];
  const CHIPS = [
    { ic: "CalendarDays", text: "Leave confusion", t: 0.45 },
    { ic: "Clock", text: "Missed interviews", t: 2.35 },
    { ic: "Wallet", text: "Late settlements", t: 4.3 },
    { ic: "FileX", text: "Scattered records", t: 7.5 },
  ];
  const D_ENTER = [3.4, 4.2]; // the leaving employee walks in with a box
  const FLY = [6.6, 9.8]; // paperwork in the air
  const times = { bubbles: BUBBLES.map((b) => b.t0), chips: CHIPS.map((c) => c.t), enter: D_ENTER[0], fly: FLY[0], end: 10.6 };
  const CAM0 = [[0, 1.0, 960, 540], [0.4, 1.05, 700, 580], [2.0, 1.05, 720, 580], [2.8, 1.1, 1150, 600], [3.9, 1.1, 1150, 610], [4.6, 1.08, 800, 620], [6.4, 1.08, 800, 620], [7.2, 1.06, 760, 580], [10.9, 1.03, 860, 590]];

  function build(host) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1920 1080");
    svg.setAttribute("width", "1920");
    svg.setAttribute("height", "1080");
    const people = (k) => `<g id="g${k}" transform="translate(${ppl[k].x},${ppl[k].y}) scale(${ppl[k].s})">${person("p" + k, castO(k))}</g>`;
    let h = `<g id="tCam">${BG("t")}${CLOCK("t", 1010, 186, 50)}`;
    h += qmarks("t");
    h += people("A") + CHAIR + people("B") + DESK("t") + papersSvg("t");
    h += people("C") + people("D");
    h += `<g id="tBubbles"></g></g><rect width="1920" height="1080" fill="url(#tVig)"/><g id="tChips"></g>`;
    svg.innerHTML = h;
    host.appendChild(svg);
    const bg = svg.querySelector("#tBubbles");
    BUBBLES.forEach((b, i) => {
      const p = ppl[b.who];
      const r = bubbleSvg(svg, "tB" + i, b.lines, p.x, headTopOf(p), b.who === "D");
      b.box = r.box;
      bg.appendChild(r.g);
    });
    const cg = svg.querySelector("#tChips");
    CHIPS.forEach((c) => (c.w = measure(svg, 28, 700, [c.text]) + 88));
    const gap = 26;
    let x0 = 960 - (CHIPS.reduce((a, c) => a + c.w, 0) + gap * (CHIPS.length - 1)) / 2;
    CHIPS.forEach((c, i) => {
      c.x = x0;
      x0 += c.w + gap;
      const g = document.createElementNS(NS, "g");
      g.id = "tC" + i;
      g.innerHTML = `<g transform="translate(${c.x},40)"><rect x="2" y="5" width="${c.w}" height="64" rx="32" fill="rgba(10,20,40,.28)"/><rect width="${c.w}" height="64" rx="32" fill="#fff"/><circle cx="34" cy="32" r="21" fill="#fee2e2"/>${ico(c.ic, 21, 19, 26, "#dc2626", 2.2)}<text x="68" y="42" font-size="28" font-weight="700" fill="#0f2347" font-family="Inter,sans-serif">${c.text}</text></g>`;
      cg.appendChild(g);
    });
    return svg;
  }
  const speaker = (c) => {
    for (const b of BUBBLES) if (c >= b.t0 + 0.15 && c < b.t1 - 0.3) return b.who;
    return null;
  };
  function apply(c) {
    const who = speaker(c);
    const sp = (k) => who === k;
    const bob = (k, a = 2) => Math.sin(c * 2.2 + k.charCodeAt(0)) * a;
    { // Employee A asks about leave, pointing at the HR desk
      const act = pr(c, 0.2, 0.7) * (1 - pr(c, 2.6, 3.1));
      setArm("pA", 1, -8 - act * (62 + Math.sin(c * 4.2) * 10));
      setArm("pA", -1, 6);
      face("pA", c, sp("A"), c > 2.9 ? 0.7 : 0.2, c < 2.6 ? 0.6 : 0.2, blinkAt(c, 1));
      const ax = lerp(330, 200, sm(pr(c, D_ENTER[0], D_ENTER[1] + 0.2)));
      setA($$("gA"), "transform", `translate(${ax.toFixed(1)},${930 + bob("A")}) scale(1)`);
      setA($$("pA_head"), "transform", `translate(${Math.sin(c * 1.4) * 2},-376) rotate(${sp("A") ? Math.sin(c * 5) * 2.5 : -2} 0 46)`);
    }
    { // HR Manager B: searching, hands up, papers flying
      const search = pr(c, 6.2, 6.8) * (1 - pr(c, 10.2, 10.8));
      const panic = Math.sin(c * 6.2) * 14 * search;
      setArm("pB", 1, -8 - search * (150 + panic));
      setArm("pB", -1, 8 + search * (140 - panic));
      face("pB", c, sp("B"), search > 0.5 ? 1 : c > 0.3 ? 0.4 : 0, c < 2.2 ? -0.8 : c < 4.3 ? 0.8 : c < 6.2 ? -0.6 : 0, blinkAt(c, 2));
      setA($$("gB"), "transform", `translate(790,${842 + bob("B")}) scale(1)`);
      setA($$("pB_head"), "transform", `translate(${search * Math.sin(c * 4) * 5},-376) rotate(${search * Math.sin(c * 5.3) * 6} 0 46)`);
    }
    { // Hiring Manager C, checking the clipboard
      setArm("pC", 1, -10 - pr(c, 2.2, 2.7) * (1 - pr(c, 4.6, 5.0)) * (40 + Math.sin(c * 4.6) * 8));
      setArm("pC", -1, 7);
      face("pC", c, sp("C"), c > 4.6 ? 0.8 : 0.1, c < 2.2 ? -0.7 : -0.4, blinkAt(c, 3));
      setA($$("gC"), "transform", `translate(1580,${940 + bob("C")}) scale(1)`);
      setA($$("pC_head"), "transform", `translate(0,-376) rotate(${sp("C") ? Math.sin(c * 4.4) * 2.5 : 0} 0 46)`);
    }
    { // leaving employee D walks in carrying a box
      const u = sm(pr(c, D_ENTER[0], D_ENTER[1]));
      const x = lerp(-180, 560, u);
      const walking = c > D_ENTER[0] && c < D_ENTER[1];
      setA($$("gD"), "transform", `translate(${x.toFixed(1)},${(1012 + bob("D") - (walking ? Math.abs(Math.sin(c * 11)) * 10 : 0)).toFixed(1)}) scale(1.1)`);
      setArm("pD", 1, 38);
      setArm("pD", -1, -38);
      face("pD", c, sp("D"), 0.9, 0.4, blinkAt(c, 4));
      setA($$("pD_head"), "transform", `translate(0,-376) rotate(${sp("D") ? Math.sin(c * 5) * 2.5 : 0} 0 46)`);
      setA($$("gD"), "opacity", u > 0 ? 1 : 0);
      setA($$("pD_legs"), "transform", `translate(0,${(walking ? Math.sin(c * 11) * 3 : 0).toFixed(1)})`);
    }
    cellsApply("t", c, c >= 6.2);
    setA($$("tClockM"), "transform", `rotate(${(c * 30 + 40).toFixed(1)})`);
    setA($$("tClockH"), "transform", `rotate(${(c * 2.5 + 95).toFixed(1)})`);
    papersApply("t", c, FLY[0], FLY[1]);
    qApply("t", c, (c > 4.4 && c < 6.4) || (c > 9.6 && c < 11), 690, 405);
    BUBBLES.forEach((b, i) => bubbleApply("tB" + i, b.box, b.lines, c, b.t0, b.t1));
    CHIPS.forEach((ch, i) => {
      const u = back(pr(c, ch.t, ch.t + 0.45));
      setA($$("tC" + i), "opacity", (pr(c, ch.t, ch.t + 0.2) * (1 - sm(pr(c, 10.6, 11.0)))).toFixed(3));
      setA($$("tC" + i), "transform", `translate(0,${((1 - u) * -26).toFixed(1)})`);
    });
    const [s, fx, fy] = camAt(CAM0, c);
    setA($$("tCam"), "transform", `translate(960 540) scale(${s.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  }
  window.Toon = { build, apply, times, bubbles: BUBBLES, chips: CHIPS };

  /* ---------- problem vignettes (one per HRMS area) ---------- */
  // who: character; seat: B at the desk; prop: what is around them; lines: the speech bubble
  const VCFG = [
    { who: "B", seat: 1, prop: "papers", lines: ["Where is that", "employee's file?"] },
    { who: "C", prop: "clock", lines: ["The candidate is", "still waiting!"] },
    { who: "A", prop: "register", lines: ["Did I mark my", "attendance today?"] },
    { who: "B", seat: 1, prop: "stickies", lines: ["Who is working", "on what?"] },
    { who: "D", front: "phone", prop: "mail", lines: ["I know a great candidate.", "Who do I tell?"] },
    { who: "A", prop: "calendar", lines: ["How many leaves", "do I have left?"] },
    { who: "C", prop: "notes", lines: ["Where are last", "quarter's review notes?"] },
    { who: "D", prop: "pending", lines: ["Still waiting for my", "final settlement..."] },
  ];
  const STAND = { x: 760, y: 930, s: 1 };
  const STICKY = Array.from({ length: 11 }, (_, i) => ({ x: 600 + (i % 6) * 120 + hs(i, 31) * 40, y: 300 + Math.floor(i / 6) * 120 + hs(i, 32) * 40, r: (hs(i, 33) - 0.5) * 24, c: ["#fde68a", "#fbcfe8", "#bfdbfe", "#bbf7d0"][i % 4] }));
  const MAILS = Array.from({ length: 6 }, (_, i) => ({ y: 330 + hs(i, 41) * 260, sp: 0.5 + hs(i, 42) * 0.4, ph: hs(i, 43) }));
  function propSvg(p, prop) {
    if (prop === "clock") return CLOCK(p, 1240, 360, 150);
    if (prop === "register")
      return `<g transform="translate(1250,380) rotate(4)"><rect x="-170" y="-210" width="340" height="420" rx="18" fill="#f8fafc" stroke="#94a3b8" stroke-width="5"/><rect x="-60" y="-226" width="120" height="34" rx="10" fill="#64748b"/><text x="0" y="-140" text-anchor="middle" font-size="34" font-weight="800" fill="#0f2347" font-family="Inter,sans-serif">Attendance</text>${[0, 1, 2, 3, 4].map((r) => `<line x1="-130" x2="130" y1="${-90 + r * 56}" y2="${-90 + r * 56}" stroke="#cbd5e1" stroke-width="3"/><circle cx="104" cy="${-112 + r * 56}" r="12" fill="none" stroke="#cbd5e1" stroke-width="3"/>`).join("")}<text id="${p}RQ" x="104" y="-60" text-anchor="middle" font-size="44" font-weight="800" fill="#ef4444" font-family="Inter,sans-serif">?</text></g>`;
    if (prop === "stickies") return `<g>${STICKY.map((s, i) => `<g id="${p}St${i}" transform="translate(${s.x},${s.y}) rotate(${s.r})"><rect x="-44" y="-44" width="88" height="88" rx="4" fill="${s.c}"/><path d="M-28,-14 L26,-14 M-28,4 L18,4 M-28,22 L8,22" stroke="rgba(15,35,71,.35)" stroke-width="5" stroke-linecap="round"/></g>`).join("")}</g>`;
    if (prop === "mail") return `<g>${MAILS.map((m, i) => `<g id="${p}M${i}"><rect x="-46" y="-32" width="92" height="64" rx="8" fill="#fff" stroke="#93c5fd" stroke-width="4"/><path d="M-42,-26 L0,6 L42,-26" fill="none" stroke="#93c5fd" stroke-width="4" stroke-linejoin="round"/></g>`).join("")}</g>`;
    if (prop === "calendar")
      return `<g transform="translate(1250,360)"><rect x="-190" y="-200" width="380" height="400" rx="20" fill="#f8fafc" stroke="#94a3b8" stroke-width="5"/><rect x="-190" y="-200" width="380" height="80" rx="20" fill="#3b82f6"/><rect x="-190" y="-150" width="380" height="30" fill="#3b82f6"/><text x="0" y="-146" text-anchor="middle" font-size="36" font-weight="800" fill="#fff" font-family="Inter,sans-serif">November</text>${Array.from({ length: 20 }, (_, k) => {
        const x = -150 + (k % 5) * 75, y = -80 + Math.floor(k / 5) * 66;
        const crossed = [2, 6, 7, 13].includes(k);
        return `<rect x="${x - 26}" y="${y - 22}" width="52" height="44" rx="8" fill="#eef2f8"/>${crossed ? `<path d="M${x - 16},${y - 14} L${x + 16},${y + 14} M${x + 16},${y - 14} L${x - 16},${y + 14}" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>` : ""}`;
      }).join("")}<text id="${p}CQ" x="120" y="150" text-anchor="middle" font-size="80" font-weight="800" fill="#ef4444" font-family="Inter,sans-serif">?</text></g>`;
    if (prop === "notes") return `<g>${Array.from({ length: 9 }, (_, i) => `<rect id="${p}N${i}" x="-34" y="-44" width="68" height="88" rx="5" fill="#fff" stroke="#c4d0e2" stroke-width="3"/>`).join("")}</g>`;
    if (prop === "pending")
      return `${CLOCK(p, 1260, 300, 90)}<g id="${p}Stamp" transform="translate(1260,560) rotate(-8)"><rect x="-170" y="-50" width="340" height="100" rx="16" fill="none" stroke="#ef4444" stroke-width="8"/><text x="0" y="22" text-anchor="middle" font-size="58" font-weight="800" fill="#ef4444" font-family="Inter,sans-serif" letter-spacing="4">PENDING</text></g>`;
    return "";
  }
  const V = [];
  function vbuild(host, i) {
    const cfg = VCFG[i];
    const p = "v" + i;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1920 1080");
    svg.setAttribute("width", "1920");
    svg.setAttribute("height", "1080");
    const pos = cfg.seat ? ppl.B : cfg.who === "D" ? { x: 760, y: 1012, s: 1.1 } : STAND;
    const pid = p + "p" + cfg.who;
    const o = castO(cfg.who, cfg.front);
    let h = `<g id="${p}Cam">${BG(p, !cfg.seat && cfg.prop !== "clock" && cfg.prop !== "register" && cfg.prop !== "calendar" && cfg.prop !== "pending")}`;
    if (cfg.prop !== "papers" && cfg.prop !== "notes") h += propSvg(p, cfg.prop);
    h += qmarks(p);
    const pers = `<g id="${p}g" transform="translate(${pos.x},${pos.y}) scale(${pos.s})">${person(pid, o)}</g>`;
    if (cfg.seat) h += CHAIR + pers + DESK(p) + (cfg.prop === "papers" ? papersSvg(p) : "");
    else h += pers;
    if (cfg.prop === "notes") h += propSvg(p, "notes");
    h += `<g id="${p}Bub"></g></g><rect width="1920" height="1080" fill="url(#${p}Vig)"/>`;
    // "The problem" tag
    h += `<g id="${p}Tag" transform="translate(70,60)"><rect x="2" y="5" width="250" height="60" rx="30" fill="rgba(10,20,40,.28)"/><rect width="250" height="60" rx="30" fill="#fff"/><circle cx="32" cy="30" r="20" fill="#fee2e2"/>${ico("CircleAlert", 20, 18, 24, "#dc2626", 2.2)}<text x="64" y="40" font-size="26" font-weight="800" fill="#b91c1c" font-family="Inter,sans-serif" letter-spacing="1.5">THE PROBLEM</text></g>`;
    svg.innerHTML = h;
    host.appendChild(svg);
    const r = bubbleSvg(svg, p + "B", cfg.lines, pos.x, headTopOf(pos), false);
    svg.querySelector("#" + p + "Bub").appendChild(r.g);
    V[i] = { cfg, p, pid, pos, box: r.box };
    return svg;
  }
  function vapply(i, c) {
    const { cfg, p, pid, pos, box } = V[i];
    const talking = c > 0.4 && c < 0.4 + cfg.lines.join("").length / 34 + 0.3;
    const bob = Math.sin(c * 2.2 + i) * 2;
    setA($$(p + "g"), "transform", `translate(${pos.x},${(pos.y + bob).toFixed(1)}) scale(${pos.s})`);
    face(pid, c, talking, 0.9, cfg.seat ? 0.4 : 0.6, blinkAt(c, i));
    const act = pr(c, 0.2, 0.6);
    if (cfg.seat) {
      const panic = Math.sin(c * 6.2) * 14;
      setArm(pid, 1, -8 - act * (150 + panic));
      setArm(pid, -1, 8 + act * (140 - panic));
    } else if (cfg.front === "phone") {
      setArm(pid, 1, -20 - act * 12);
      setArm(pid, -1, 10);
    } else if (cfg.who === "D") {
      setArm(pid, 1, 38);
      setArm(pid, -1, -38);
    } else if (cfg.who === "C") {
      setArm(pid, 1, -10 - act * (55 + Math.sin(c * 4.6) * 10)); // gestures toward the prop
      setArm(pid, -1, 7);
    } else {
      setArm(pid, 1, -8 - act * (62 + Math.sin(c * 4.2) * 10));
      setArm(pid, -1, 6);
    }
    setA($$(pid + "_head"), "transform", `translate(0,-376) rotate(${talking ? Math.sin(c * 5) * 2.5 : 3} 0 46)`);
    bubbleApply(p + "B", box, cfg.lines, c, 0.3, 99);
    qApply(p, c, c > 0.8 && !cfg.seat, pos.x + 120, headTopOf(pos) + 70);
    // props
    if (cfg.prop === "papers") {
      papersApply(p, c, 0, 99);
      cellsApply(p, c, true);
    }
    if (cfg.prop === "stickies") {
      cellsApply(p, c, true);
      STICKY.forEach((s, k) => setA($$(p + "St" + k), "transform", `translate(${s.x},${(s.y + Math.sin(c * 3 + k) * 4).toFixed(1)}) rotate(${(s.r + Math.sin(c * 4 + k * 2) * 6).toFixed(1)})`));
    }
    if (cfg.prop === "clock" || cfg.prop === "pending") {
      setA($$(p + "ClockM"), "transform", `rotate(${(c * 240).toFixed(1)})`); // time racing
      setA($$(p + "ClockH"), "transform", `rotate(${(c * 20 + 60).toFixed(1)})`);
    }
    if (cfg.prop === "pending") {
      const u = back(pr(c, 0.7, 1.1));
      setA($$(p + "Stamp"), "transform", `translate(1260,560) rotate(-8) scale(${(1.6 - 0.6 * u).toFixed(3)})`);
      setA($$(p + "Stamp"), "opacity", pr(c, 0.7, 0.85).toFixed(2));
    }
    if (cfg.prop === "register") setA($$(p + "RQ"), "opacity", (0.5 + 0.5 * Math.sin(c * 6)).toFixed(2));
    if (cfg.prop === "calendar") setA($$(p + "CQ"), "transform", `scale(${(1 + 0.08 * Math.sin(c * 6)).toFixed(3)})`);
    if (cfg.prop === "mail")
      MAILS.forEach((m, k) => {
        const ph = (c * m.sp + m.ph) % 1;
        const x = 1000 + ph * 1100, y = m.y - Math.sin(ph * Math.PI) * 60;
        setA($$(p + "M" + k), "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(ph * 40 - 10).toFixed(1)}) scale(${(1 - 0.4 * ph).toFixed(2)})`);
        setA($$(p + "M" + k), "opacity", (Math.sin(ph * Math.PI) * 0.95).toFixed(2));
      });
    if (cfg.prop === "notes")
      for (let k = 0; k < 9; k++) {
        const ph = (c * (0.5 + hs(k, 51) * 0.3) + hs(k, 52)) % 1;
        const x = 1040 + hs(k, 53) * 600 + Math.sin(ph * 6 + k) * 40, y = 260 + ph * 620;
        setA($$(p + "N" + k), "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(ph * 300 * (hs(k, 54) - 0.5)).toFixed(1)})`);
        setA($$(p + "N" + k), "opacity", Math.sin(ph * Math.PI).toFixed(2));
      }
    const tg = back(pr(c, 0.05, 0.45));
    setA($$(p + "Tag"), "transform", `translate(${(70 - (1 - tg) * 40).toFixed(1)},60)`);
    setA($$(p + "Tag"), "opacity", pr(c, 0.05, 0.25).toFixed(2));
    const s = 1.04 + 0.05 * sm(pr(c, 0, 3.5));
    setA($$(p + "Cam"), "transform", `translate(960 540) scale(${s.toFixed(4)}) translate(-900 -580)`);
  }
  window.ToonV = { build: vbuild, apply: vapply, cfg: VCFG, box: (i) => V[i].box };
})();
