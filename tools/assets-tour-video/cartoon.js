/* Opening story: a 2D corporate-cartoon office drawn as SVG, as a pure function of time (seconds from the start of the video).
   Characters: Employee, Asset Manager, Operations Manager and a second Employee. Speech bubbles, problem chips, flying paperwork.
   Exposes window.Toon = { build(), apply(c), times } ; `times` lists bubble / chip / event times for the sound design. */
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
    const hair = {
      short: `<path d="M-49,-4 Q-56,-54 0,-60 Q56,-54 49,-4 Q46,-30 24,-35 Q0,-27 -24,-35 Q-46,-30 -49,-4Z" fill="${o.hair}"/>`,
      pony: `<path d="M-49,-4 Q-56,-54 0,-60 Q56,-54 49,-4 Q46,-30 24,-35 Q0,-27 -24,-35 Q-46,-30 -49,-4Z" fill="${o.hair}"/><path d="M44,-30 Q82,-26 70,30 Q62,4 46,-8Z" fill="${o.hair}"/><circle cx="52" cy="-26" r="7" fill="#3b82f6"/>`,
      hat: `<path d="M-56,-18 Q-58,-76 0,-80 Q58,-76 56,-18Z" fill="#f8fafc"/><rect x="-64" y="-24" width="128" height="13" rx="6.5" fill="#dbe4f0"/><rect x="-9" y="-79" width="18" height="52" fill="#3b82f6"/>`,
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
  ${o.extra || ""}
  <g id="${id}_aL" transform="translate(-72,-298)"><rect x="-16" y="-8" width="32" height="136" rx="16" fill="${o.sleeve}"/><circle cy="138" r="16" fill="${o.skin}"/></g>
  <g id="${id}_aR" transform="translate(72,-298)"><rect x="-16" y="-8" width="32" height="136" rx="16" fill="${o.sleeve}"/><circle cy="138" r="16" fill="${o.skin}"/></g>
  ${o.front || ""}
  <rect x="-15" y="-352" width="30" height="30" rx="8" fill="${o.skinD}"/>
  <g id="${id}_head" transform="translate(0,-376)">
   <circle cx="-47" cy="2" r="10" fill="${o.skin}"/><circle cx="47" cy="2" r="10" fill="${o.skin}"/>
   <circle r="47" fill="${o.skin}"/>
   <g id="${id}_eyes"><ellipse cx="-17" cy="-3" rx="8.5" ry="9.5" fill="#fff"/><ellipse cx="17" cy="-3" rx="8.5" ry="9.5" fill="#fff"/><circle id="${id}_pl" cx="-17" cy="-2" r="4.8" fill="#1e293b"/><circle id="${id}_pr" cx="17" cy="-2" r="4.8" fill="#1e293b"/></g>
   <path id="${id}_bl" d="M-28,-19 L-8,-19" stroke="${o.hair === "none" ? "#2b2b2b" : o.hair}" stroke-width="4.5" stroke-linecap="round"/><path id="${id}_br" d="M8,-19 L28,-19" stroke="${o.hair === "none" ? "#2b2b2b" : o.hair}" stroke-width="4.5" stroke-linecap="round"/>
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
  const ppl = {
    A: { x: 330, y: 930, s: 1, o: { skin: "#d9a073", skinD: "#c48a5c", hair: "#2a1d18", style: "pony", shirt: "#3b82f6", sleeve: "#3b82f6", pants: "#1e293b" } },
    B: { x: 790, y: 842, s: 1, o: { skin: "#f1c9a5", skinD: "#dcae88", hair: "#2b2b33", style: "short", shirt: "#f8fafc", sleeve: "#e8eef7", pants: "#1e293b", tie: "#1e3a8a", glasses: 1 } },
    C: { x: 1580, y: 940, s: 1, o: { skin: "#b9764a", skinD: "#a3643c", hair: "none", style: "hat", shirt: "#475569", sleeve: "#475569", pants: "#1e293b", tie: "#0f172a",
      front: `<g transform="translate(-92,-196) rotate(-10)"><rect x="-38" y="-48" width="76" height="98" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><rect x="-16" y="-56" width="32" height="14" rx="5" fill="#64748b"/><path d="M-24,-22 L24,-22 M-24,-4 L24,-4 M-24,14 L10,14" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/></g><circle cx="-88" cy="-170" r="16" fill="#b9764a"/>` } },
    D: { x: 560, y: 1012, s: 1.1, o: { skin: "#8d5a3b", skinD: "#774a30", hair: "#16110f", style: "short", shirt: "#0ea5e9", sleeve: "#0ea5e9", pants: "#334155",
      front: `<g transform="translate(0,-236)"><rect x="-96" y="-62" width="192" height="124" rx="10" fill="#1e293b"/><rect x="-86" y="-52" width="172" height="104" rx="5" fill="#0b1220"/><path d="M-10,-52 L8,-14 L-6,0 L22,52 M8,-14 L40,-24 M-6,0 L-40,12" fill="none" stroke="#cbd5e1" stroke-width="2.6" stroke-linejoin="round"/><path d="M-58,-6 L-44,-34 L-30,-6Z" fill="#ef4444"/><path d="M-44,-26 L-44,-16 M-44,-12 L-44,-11" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>` } },
  };

  /* ---------- scene geometry ---------- */
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
  const BG = `
<defs>
 <linearGradient id="tWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6edf8"/><stop offset="1" stop-color="#c9d7ec"/></linearGradient>
 <linearGradient id="tFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa5c6"/><stop offset="1" stop-color="#5f789f"/></linearGradient>
 <linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fbdf2"/><stop offset="1" stop-color="#e3effc"/></linearGradient>
 <radialGradient id="tVig" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#0a1428" stop-opacity="0"/><stop offset="1" stop-color="#0a1428" stop-opacity=".55"/></radialGradient>
 <linearGradient id="tBeam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<rect x="-200" y="-100" width="2320" height="830" fill="url(#tWall)"/>
<rect x="-200" y="696" width="2320" height="26" fill="#b3c3dc"/>
<rect x="-200" y="720" width="2320" height="460" fill="url(#tFloor)"/>
${[-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<line x1="${960 + (i - 2.5) * 70}" y1="722" x2="${960 + (i - 2.5) * 360}" y2="1180" stroke="rgba(255,255,255,.07)" stroke-width="2"/>`).join("")}
<g transform="translate(150,120)"><rect x="-14" y="-14" width="528" height="378" rx="10" fill="#f1f5fb"/><svg x="0" y="0" width="500" height="350"><rect width="500" height="350" fill="url(#tSky)"/><g transform="translate(0,20)">${skyline}</g><circle cx="410" cy="70" r="26" fill="#fff" opacity=".7"/></svg><path d="M250,0 L250,350 M0,175 L500,175" stroke="#f1f5fb" stroke-width="10"/></g>
<polygon points="150,470 650,470 1010,930 440,930" fill="url(#tBeam)" opacity=".5"/>
<g transform="translate(1010,186)"><circle r="50" fill="#f8fafc" stroke="#94a3b8" stroke-width="7"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<line x1="${Math.sin((i * Math.PI) / 6) * 40}" y1="${-Math.cos((i * Math.PI) / 6) * 40}" x2="${Math.sin((i * Math.PI) / 6) * 46}" y2="${-Math.cos((i * Math.PI) / 6) * 46}" stroke="#64748b" stroke-width="3"/>`).join("")}<line id="tClockM" x1="0" y1="0" x2="0" y2="-34" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/><line x1="0" y1="0" x2="22" y2="0" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/></g>
<rect x="1330" y="150" width="500" height="470" rx="10" fill="#d6e0f0"/><rect x="1346" y="166" width="468" height="438" rx="6" fill="#bccae0"/>
<rect x="1346" y="330" width="468" height="14" fill="#8e9db8"/><rect x="1346" y="560" width="468" height="14" fill="#8e9db8"/>
${boxes}
<rect x="1226" y="548" width="150" height="268" rx="10" fill="#9aa9c2"/><rect x="1236" y="560" width="130" height="76" rx="6" fill="#b2bfd4"/><rect x="1236" y="650" width="130" height="76" rx="6" fill="#b2bfd4"/><rect x="1236" y="736" width="130" height="68" rx="6" fill="#b2bfd4"/>
<rect x="1290" y="590" width="42" height="9" rx="4" fill="#64748b"/><rect x="1290" y="678" width="42" height="9" rx="4" fill="#64748b"/><rect x="1290" y="764" width="42" height="9" rx="4" fill="#64748b"/>
<g id="tDrawerPapers"><rect x="1240" y="530" width="120" height="26" rx="3" fill="#fff" transform="rotate(-6 1300 540)"/><rect x="1252" y="520" width="112" height="26" rx="3" fill="#eef2f8" transform="rotate(5 1300 540)"/></g>`;

  // everything that sits between the back row (A, C, D enter later) and B: chair, then B, then the desk in front of him
  const CHAIR = `<rect x="712" y="452" width="158" height="250" rx="34" fill="#1e3a8a"/><rect x="734" y="474" width="114" height="206" rx="24" fill="#27489f"/>`;
  const DESK = `
<rect x="560" y="640" width="680" height="34" rx="8" fill="#d3dbe8"/><rect x="580" y="674" width="640" height="170" fill="#9fb0c9"/><rect x="580" y="674" width="640" height="14" fill="rgba(0,0,0,.1)"/>
<rect x="600" y="700" width="260" height="120" rx="6" fill="#8ea1be"/><rect x="940" y="700" width="260" height="120" rx="6" fill="#8ea1be"/>
<rect x="716" y="750" width="28" height="9" rx="4" fill="#64748b"/><rect x="1056" y="750" width="28" height="9" rx="4" fill="#64748b"/>
<g transform="translate(970,468)"><rect x="-12" y="-12" width="238" height="154" rx="9" fill="#1e293b"/><rect x="0" y="0" width="214" height="130" rx="3" fill="#fff"/><rect x="0" y="0" width="214" height="20" fill="#2f6fd6"/>
 <g transform="translate(0,20)"><svg x="0" y="0" width="214" height="110" viewBox="0 0 214 110">${grid}</svg>
  <rect id="tCell1" x="54" y="22" width="52" height="19" fill="#ef4444" opacity=".9"/><rect id="tCell2" x="108" y="62" width="52" height="19" fill="#ef4444" opacity=".9"/><rect id="tCell3" x="2" y="42" width="52" height="19" fill="#fbbf24" opacity=".9"/><rect id="tCell4" x="161" y="22" width="52" height="19" fill="#ef4444" opacity=".9"/>
  <text x="62" y="36" font-size="13" font-weight="700" fill="#fff" font-family="Inter,sans-serif">#N/A</text><text x="171" y="36" font-size="13" font-weight="700" fill="#fff" font-family="Inter,sans-serif">???</text><text x="14" y="56" font-size="13" font-weight="700" fill="#5b3b00" font-family="Inter,sans-serif">old</text><text x="117" y="76" font-size="13" font-weight="700" fill="#fff" font-family="Inter,sans-serif">#N/A</text></g></g>
<rect x="1070" y="610" width="26" height="30" fill="#64748b"/><rect x="1040" y="634" width="86" height="8" rx="4" fill="#64748b"/>
<rect x="1130" y="624" width="26" height="20" rx="4" fill="#f8fafc"/><path d="M1156,628 Q1170,632 1156,640" fill="none" stroke="#f8fafc" stroke-width="3"/>
<rect x="640" y="626" width="120" height="14" rx="3" fill="#e2e8f0"/>`;

  /* ---------- bubbles, chips, timeline ---------- */
  const BUBBLES = [
    { who: "A", lines: ["Where is the laptop", "assigned to me?"], t0: 0.45, t1: 3.1 },
    { who: "B", lines: ["Let me check", "the spreadsheets..."], t0: 2.85, t1: 5.2 },
    { who: "C", lines: ["When was this machine", "last maintained?"], t0: 3.95, t1: 6.7 },
    { who: "D", lines: ["It's damaged, and", "there's no history!"], t0: 6.15, t1: 9.4 },
  ];
  const CHIPS = [
    { ic: "FileX", text: "Missing records", t: 0.6 },
    { ic: "UserRoundX", text: "Unclear ownership", t: 3.0 },
    { ic: "Wrench", text: "No maintenance history", t: 5.0 },
    { ic: "SearchX", text: "Damage goes unrecorded", t: 6.7 },
  ];
  const D_ENTER = [5.2, 6.0]; // second employee walks in
  const FLY = [2.9, 6.6]; // paperwork in the air
  const times = { bubbles: BUBBLES.map((b) => b.t0), chips: CHIPS.map((c) => c.t), enter: D_ENTER[0], fly: FLY[0], end: 9.4 };

  // camera focus keyframes [t, scale, x, y]
  const CAM = [[0, 1.0, 960, 540], [0.4, 1.05, 700, 580], [2.7, 1.05, 720, 580], [3.6, 1.1, 1150, 600], [6.4, 1.1, 1150, 610], [7.3, 1.08, 800, 620], [9.8, 1.04, 860, 600]];
  const camAt = (c) => {
    if (c <= CAM[0][0]) return CAM[0].slice(1);
    for (let i = 1; i < CAM.length; i++)
      if (c <= CAM[i][0]) {
        const u = sm(pr(c, CAM[i - 1][0], CAM[i][0]));
        return [1, 2, 3].map((k) => lerp(CAM[i - 1][k], CAM[i][k], u));
      }
    return CAM[CAM.length - 1].slice(1);
  };

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

  function build(host) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 1920 1080");
    svg.setAttribute("width", "1920");
    svg.setAttribute("height", "1080");
    const people = (k) => `<g id="g${k}" transform="translate(${ppl[k].x},${ppl[k].y}) scale(${ppl[k].s})">${person("p" + k, ppl[k].o)}</g>`;
    let h = `<g id="tCam">${BG}`;
    h += `<g id="gQ" fill="#1e3a8a" font-family="Inter,sans-serif" font-weight="800" font-size="64">${[0, 1, 2].map((i) => `<text id="tQ${i}" x="0" y="0" text-anchor="middle" opacity="0">?</text>`).join("")}</g>`;
    h += people("A") + CHAIR + people("B") + DESK;
    h += `<g id="tPapers">${PAPERS.map((p, i) => `<rect id="tPap${i}" x="-22" y="-28" width="44" height="56" rx="3" fill="${i % 3 ? "#ffffff" : "#eef3fb"}" stroke="#c4d0e2" stroke-width="2"/>`).join("")}</g>`;
    h += people("C") + people("D");
    h += `<g id="tBubbles"></g>`;
    h += `</g><rect width="1920" height="1080" fill="url(#tVig)"/><g id="tChips"></g>`;
    svg.innerHTML = h;
    host.appendChild(svg);

    // bubbles (measured with the real font so the text always fits)
    const bg = svg.querySelector("#tBubbles");
    BUBBLES.forEach((b, i) => {
      const g = document.createElementNS(NS, "g");
      g.id = "tB" + i;
      const probe = document.createElementNS(NS, "text");
      probe.setAttribute("font-size", "36");
      probe.setAttribute("font-weight", "600");
      probe.setAttribute("font-family", "Inter,sans-serif");
      bg.appendChild(probe);
      let w = 0;
      b.lines.forEach((l) => {
        probe.textContent = l;
        w = Math.max(w, probe.getComputedTextLength());
      });
      bg.removeChild(probe);
      const p = ppl[b.who];
      const headTop = p.y - 376 * p.s - 62 * p.s - (b.who === "C" ? 30 : 0);
      const bw = w + 64, bh = b.lines.length * 46 + 38;
      // the second employee stands between two people, so that bubble opens to the left and sits a little higher
      const bx = b.who === "D" ? p.x - bw + 80 : cl(p.x - bw / 2, 40, 1880 - bw);
      const by = headTop - (b.who === "D" ? 56 : 40) - bh;
      b.box = { x: bx, y: by, w: bw, h: bh, tx: cl(p.x, bx + 40, bx + bw - 40), px: p.x };
      g.innerHTML = `<g transform="translate(${bx},${by})"><rect x="3" y="6" width="${bw}" height="${bh}" rx="26" fill="rgba(10,20,40,.22)"/><rect width="${bw}" height="${bh}" rx="26" fill="#fff" stroke="#c8d6ec" stroke-width="2"/>` +
        `<path d="M${b.box.tx - bx - 20},${bh - 2} L${b.box.tx - bx},${bh + 30} L${b.box.tx - bx + 22},${bh - 2}Z" fill="#fff" stroke="#c8d6ec" stroke-width="2"/><rect x="${b.box.tx - bx - 18}" y="${bh - 6}" width="38" height="6" fill="#fff"/>` +
        b.lines.map((_, li) => `<text id="tB${i}_${li}" x="32" y="${50 + li * 46}" font-size="36" font-weight="600" fill="#0f2347" font-family="Inter,sans-serif"></text>`).join("") + `</g>`;
      bg.appendChild(g);
    });

    // problem chips along the top
    const cg = svg.querySelector("#tChips");
    const meas = document.createElementNS(NS, "text");
    meas.setAttribute("font-size", "28");
    meas.setAttribute("font-weight", "700");
    meas.setAttribute("font-family", "Inter,sans-serif");
    cg.appendChild(meas);
    CHIPS.forEach((c) => {
      meas.textContent = c.text;
      c.w = meas.getComputedTextLength() + 88;
    });
    cg.removeChild(meas);
    const gap = 26;
    const total = CHIPS.reduce((a, c) => a + c.w, 0) + gap * (CHIPS.length - 1);
    let x0 = 960 - total / 2;
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

  /* ---------- per-frame ---------- */
  function face(k, c, speaking, mood, look, blink) {
    const m = speaking ? 0.5 + 0.5 * Math.sin(c * 17 + k.charCodeAt(0)) : 0;
    const talk = $$("p" + k + "_talk"), smile = $$("p" + k + "_smile"), frown = $$("p" + k + "_frown");
    setA(talk, "opacity", speaking ? 1 : 0);
    setA(talk, "ry", (2 + m * 7).toFixed(1));
    setA(smile, "opacity", !speaking && mood < 0.5 ? 1 : 0);
    setA(frown, "opacity", !speaking && mood >= 0.5 ? 1 : 0);
    const by = mood * 3;
    setA($$("p" + k + "_bl"), "transform", `rotate(${mood * -9} -18 -19) translate(0 ${-by})`);
    setA($$("p" + k + "_br"), "transform", `rotate(${mood * 9} 18 -19) translate(0 ${-by})`);
    setA($$("p" + k + "_pl"), "cx", (-17 + look * 3.2).toFixed(1));
    setA($$("p" + k + "_pr"), "cx", (17 + look * 3.2).toFixed(1));
    setA($$("p" + k + "_eyes"), "transform", `translate(0 -3) scale(1 ${(1 - 0.92 * blink).toFixed(2)}) translate(0 3)`);
  }
  const blinkAt = (c, k) => {
    const period = 3.1 + k * 0.37, ph = ((c + k * 0.9) % period);
    return ph < 0.14 ? Math.sin((ph / 0.14) * Math.PI) : 0;
  };
  const speaker = (c) => {
    for (const b of BUBBLES) if (c >= b.t0 + 0.15 && c < b.t1 - 0.3) return b.who;
    return null;
  };
  const setArm = (k, side, a) => setA($$("p" + k + "_a" + (side < 0 ? "L" : "R")), "transform", `translate(${side * 72},-298) rotate(${a.toFixed(1)})`);

  function apply(c) {
    const who = speaker(c);
    const sp = (k) => who === k;
    const bob = (k, a = 3) => Math.sin(c * 2.2 + k.charCodeAt(0)) * a;
    // Employee A: asks, points toward the manager
    {
      const act = pr(c, 0.3, 0.8) * (1 - pr(c, 3.0, 3.5));
      setArm("A", 1, -8 - act * (62 + Math.sin(c * 4.2) * 10));
      setArm("A", -1, 6);
      face("A", c, sp("A"), c > 3.3 ? 0.7 : 0.2, c < 3 ? 0.6 : 0.2, blinkAt(c, 1));
      // A steps aside when the second employee walks in
      const ax = lerp(330, 200, sm(pr(c, D_ENTER[0], D_ENTER[1] + 0.2)));
      setA($$("gA"), "transform", `translate(${ax.toFixed(1)},${930 + bob("A", 2)}) scale(1)`);
      setA($$("pA_head"), "transform", `translate(${Math.sin(c * 1.4) * 2},-376) rotate(${sp("A") ? Math.sin(c * 5) * 2.5 : -2} 0 46)`);
    }
    // Asset Manager B: searching, hands up, papers flying
    {
      const search = pr(c, 2.4, 3.0) * (1 - pr(c, 6.4, 7.0));
      const panic = Math.sin(c * 6.2) * 14 * search;
      setArm("B", 1, -8 - search * (150 + panic) + (1 - search) * 0);
      setArm("B", -1, 8 + search * (140 - panic));
      face("B", c, sp("B"), search > 0.5 ? 1 : c > 0.3 ? 0.4 : 0, c < 2.4 ? -0.8 : 0, blinkAt(c, 2));
      setA($$("gB"), "transform", `translate(790,${842 + bob("B", 2)}) scale(1)`);
      setA($$("pB_head"), "transform", `translate(${search * Math.sin(c * 4) * 5},-376) rotate(${search * Math.sin(c * 5.3) * 6} 0 46)`);
    }
    // Operations Manager C
    {
      setArm("C", 1, -10 - pr(c, 3.9, 4.4) * (1 - pr(c, 6.6, 7.0)) * (40 + Math.sin(c * 4.6) * 8));
      setArm("C", -1, 7);
      face("C", c, sp("C"), c > 6.6 ? 0.8 : 0.1, c < 3.9 ? -0.7 : -0.4, blinkAt(c, 3));
      setA($$("gC"), "transform", `translate(1580,${940 + bob("C", 2)}) scale(1)`);
      setA($$("pC_head"), "transform", `translate(0,-376) rotate(${sp("C") ? Math.sin(c * 4.4) * 2.5 : 0} 0 46)`);
    }
    // Employee D walks in with the damaged laptop
    {
      const u = sm(pr(c, D_ENTER[0], D_ENTER[1]));
      const x = lerp(-180, 560, u);
      const step = c > D_ENTER[0] && c < D_ENTER[1] ? Math.abs(Math.sin(c * 11)) * 10 : 0;
      setA($$("gD"), "transform", `translate(${x.toFixed(1)},${(1012 + bob("D", 2) - step).toFixed(1)}) scale(1.1)`);
      setArm("D", 1, 38);
      setArm("D", -1, -38);
      face("D", c, sp("D"), 0.9, 0.4, blinkAt(c, 4));
      setA($$("pD_head"), "transform", `translate(0,-376) rotate(${sp("D") ? Math.sin(c * 5) * 2.5 : 0} 0 46)`);
      setA($$("gD"), "opacity", u > 0 ? 1 : 0);
      const legs = $$("pD_legs");
      setA(legs, "transform", `translate(0,${(c > D_ENTER[0] && c < D_ENTER[1] ? Math.sin(c * 11) * 3 : 0).toFixed(1)})`);
    }
    // spreadsheet cells blink, clock ticks
    ["tCell1", "tCell2", "tCell4"].forEach((id, i) => setA($$(id), "opacity", c < 2.4 ? 0 : (0.55 + 0.45 * Math.sin(c * 7 + i * 1.7)).toFixed(2)));
    setA($$("tCell3"), "opacity", c < 2.4 ? 0 : 0.9);
    setA($$("tClockM"), "transform", `rotate(${(c * 30 + 40).toFixed(1)})`);
    setA($$("tDrawerPapers"), "transform", `translate(0,${(Math.sin(c * 3) * 1.5).toFixed(1)})`);

    // paperwork: rests on the desk, then flies while the manager searches
    PAPERS.forEach((p, i) => {
      const e = $$("tPap" + i);
      const flying = c >= FLY[0] && c < FLY[1] + 1.2;
      let x = p.x, y = p.y, r = p.r, op = 1, sy = 0.3;
      if (flying) {
        const ph = ((c - FLY[0]) * (0.55 + hs(i, 5) * 0.35) + hs(i, 6)) % 1;
        const fade = pr(c, FLY[1], FLY[1] + 1.2);
        const k = Math.sin(Math.PI * ph) * (1 - fade);
        x = p.x + (hs(i, 7) - 0.5) * 360 * k;
        y = p.y - (140 + hs(i, 8) * 170) * k;
        r = p.r + (hs(i, 9) - 0.5) * 520 * ph;
        sy = 0.3 + 0.6 * cl(k * 4);
      }
      setA(e, "transform", `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(.9 ${(0.9 * sy / 0.9).toFixed(2)})`);
      setA(e, "opacity", op);
    });
    // question marks over the manager
    [0, 1, 2].forEach((i) => {
      const e = $$("tQ" + i);
      const on = (c > 1.3 && c < 2.9) || (c > 5.2 && c < 8.0);
      const ph = ((c * 0.6 + i / 3) % 1);
      const a = on ? Math.sin(Math.PI * ph) : 0;
      setA(e, "opacity", a.toFixed(2));
      setA(e, "transform", `translate(${690 + i * 100 + Math.sin(c * 3 + i) * 10},${405 - ph * 90}) scale(${0.7 + a * 0.5})`);
    });

    // speech bubbles
    BUBBLES.forEach((b, i) => {
      const g = $$("tB" + i);
      const inU = back(pr(c, b.t0, b.t0 + 0.34));
      const out = sm(pr(c, b.t1 - 0.25, b.t1));
      const op = cl(pr(c, b.t0, b.t0 + 0.18)) * (1 - out);
      setA(g, "opacity", op.toFixed(3));
      const s = 0.55 + 0.45 * inU;
      setA(g, "transform", `translate(${(b.box.tx * (1 - s)).toFixed(1)},${((b.box.y + b.box.h + 30) * (1 - s)).toFixed(1)}) scale(${s.toFixed(3)})`);
      let n = Math.floor((c - b.t0 - 0.12) * 34);
      b.lines.forEach((l, li) => {
        const k = cl(n, 0, l.length);
        n -= l.length;
        const t = $$("tB" + i + "_" + li);
        if (t.textContent !== l.slice(0, k)) t.textContent = l.slice(0, k);
      });
    });
    // chips
    CHIPS.forEach((ch, i) => {
      const g = $$("tC" + i);
      const u = back(pr(c, ch.t, ch.t + 0.45));
      const op = pr(c, ch.t, ch.t + 0.2) * (1 - sm(pr(c, 9.2, 9.6)));
      setA(g, "opacity", op.toFixed(3));
      setA(g, "transform", `translate(0,${((1 - u) * -26).toFixed(1)})`);
    });

    // camera
    const [s, fx, fy] = camAt(c);
    setA($$("tCam"), "transform", `translate(960 540) scale(${s.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  }
  window.Toon = { build, apply, times, bubbles: BUBBLES, chips: CHIPS };
})();
