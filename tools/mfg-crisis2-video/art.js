/* Art for the second manufacturing crisis film (dialogue version): the four characters (one rig, consistent outfits) and the sets, as SVG strings.
   Every set is a 1920x1080 world split into depth layers (bg, mid, fg) so the camera can move them with parallax.
   Exposes window.ART = { person, CAST, sets: { factory, qc, office, plant }, ... }. */
(() => {
  const hs = (k, s = 1) => {
    const x = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const ico = (n, x, y, s, color, sw = 2) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ""}</svg>`;

  /* ---------- characters ---------- */
  // o: skin, skinD, hair, style (short|pony|none), shirt, sleeve, pants, hat (colour), safety (glasses), glasses (regular),
  //    vest, coat, badge, gloves, tie, front (prop drawn in front of the body)
  function person(id, o) {
    const hairC = o.hair;
    const hair = {
      short: `<path d="M-49,-4 Q-56,-54 0,-60 Q56,-54 49,-4 Q46,-30 24,-35 Q0,-27 -24,-35 Q-46,-30 -49,-4Z" fill="${hairC}"/>`,
      pony: `<path d="M-49,-4 Q-56,-54 0,-60 Q56,-54 49,-4 Q46,-30 24,-35 Q0,-27 -24,-35 Q-46,-30 -49,-4Z" fill="${hairC}"/><path d="M44,-24 Q86,-14 70,40 Q62,10 46,0Z" fill="${hairC}"/>`,
      bun: `<path d="M-49,-4 Q-56,-54 0,-60 Q56,-54 49,-4 Q46,-30 24,-35 Q0,-27 -24,-35 Q-46,-30 -49,-4Z" fill="${hairC}"/><circle cx="0" cy="-62" r="20" fill="${hairC}"/>`,
      none: "",
    }[o.style || "short"];
    const hat = o.hat
      ? `<path d="M-55,-16 Q-57,-74 0,-78 Q57,-74 55,-16Z" fill="${o.hat}"/><path d="M-55,-16 Q-57,-74 0,-78 L0,-16Z" fill="#fff" opacity=".12"/><rect x="-66" y="-22" width="132" height="13" rx="6.5" fill="${o.hat}"/><rect x="-66" y="-22" width="132" height="5" rx="2.5" fill="rgba(0,0,0,.12)"/><rect x="-7" y="-77" width="14" height="56" rx="5" fill="rgba(0,0,0,.08)"/>`
      : "";
    const glasses = o.safety
      ? `<path d="M-38,-14 Q0,-20 38,-14 L36,8 Q18,14 4,6 L-4,6 Q-18,14 -36,8Z" fill="rgba(186,230,253,.35)" stroke="#94a3b8" stroke-width="3"/>`
      : o.glasses
        ? `<g fill="none" stroke="#1e293b" stroke-width="3.5"><rect x="-32" y="-15" width="28" height="22" rx="7"/><rect x="4" y="-15" width="28" height="22" rx="7"/><path d="M-4,-6 L4,-6"/></g>`
        : "";
    const collar = o.tie
      ? `<path d="M-8,-318 L8,-318 L11,-232 L0,-214 L-11,-232Z" fill="${o.tie}"/><path d="M-22,-330 L0,-304 L22,-330 L8,-336 L0,-326 L-8,-336Z" fill="#f8fafc"/>`
      : `<path d="M-20,-330 Q0,-300 20,-330 Q0,-338 -20,-330Z" fill="${o.skinD}"/><path d="M-26,-332 L-4,-306 L-14,-336Z M26,-332 L4,-306 L14,-336Z" fill="${o.collar || o.shirt}" opacity=".9"/>`;
    const vest = o.vest
      ? `<path d="M-66,-312 Q-74,-300 -72,-282 L-68,-168 Q-68,-160 -60,-160 L-14,-160 L-14,-300 Q-30,-312 -40,-326Z M66,-312 Q74,-300 72,-282 L68,-168 Q68,-160 60,-160 L14,-160 L14,-300 Q30,-312 40,-326Z" fill="${o.vest}"/>
         <rect x="-70" y="-232" width="56" height="10" fill="#e2e8f0" opacity=".85"/><rect x="14" y="-232" width="56" height="10" fill="#e2e8f0" opacity=".85"/><rect x="-70" y="-200" width="56" height="10" fill="#e2e8f0" opacity=".85"/><rect x="14" y="-200" width="56" height="10" fill="#e2e8f0" opacity=".85"/>`
      : "";
    const coatLegs = o.coat ? `<path d="M-70,-200 L-74,-96 Q-74,-88 -66,-88 L66,-88 Q74,-88 74,-96 L70,-200Z" fill="${o.coat}"/><path d="M0,-200 L0,-88" stroke="#cbd5e1" stroke-width="3"/>` : "";
    const coatBody = o.coat ? `<path d="M-64,-318 Q-72,-318 -72,-298 L-68,-168 Q-68,-158 -58,-158 L-6,-158 L-6,-300 Q-20,-318 -34,-330Z M64,-318 Q72,-318 72,-298 L68,-168 Q68,-158 58,-158 L6,-158 L6,-300 Q20,-318 34,-330Z" fill="${o.coat}"/><rect x="-56" y="-226" width="34" height="22" rx="3" fill="none" stroke="#cbd5e1" stroke-width="3"/>` : "";
    const badge = o.badge ? `<rect x="24" y="-292" width="26" height="34" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><rect x="28" y="-286" width="18" height="10" rx="2" fill="#3b82f6"/>` : "";
    const stripes = o.stripes ? `<rect x="-70" y="-214" width="140" height="10" fill="#cbd5e1" opacity=".75"/><rect x="-43" y="-110" width="37" height="9" fill="#cbd5e1" opacity=".75"/><rect x="6" y="-110" width="37" height="9" fill="#cbd5e1" opacity=".75"/>` : "";
    const hand = o.gloves || o.skin;
    return `<g id="${id}">
 <ellipse cx="0" cy="4" rx="86" ry="15" fill="rgba(5,10,25,.35)"/>
 <g id="${id}_legs">
  <rect x="-43" y="-184" width="37" height="172" rx="11" fill="${o.pants}"/><rect x="6" y="-184" width="37" height="172" rx="11" fill="${o.pants}"/>
  <rect x="-43" y="-184" width="10" height="172" rx="5" fill="#fff" opacity=".06"/>
  <path d="M-56,-12 Q-56,-27 -37,-27 L-6,-27 L-6,-5 Q-6,4 -17,4 L-49,4 Q-56,4 -56,-5Z" fill="#0f172a"/><path d="M56,-12 Q56,-27 37,-27 L6,-27 L6,-5 Q6,4 17,4 L49,4 Q56,4 56,-5Z" fill="#0f172a"/>
  ${stripes}
 </g>
 ${coatLegs}
 <g id="${id}_body">
  <path d="M-64,-318 Q-72,-318 -72,-298 L-68,-168 Q-68,-158 -58,-158 L58,-158 Q68,-158 68,-168 L72,-298 Q72,-318 64,-318 Q32,-332 0,-332 Q-32,-332 -64,-318Z" fill="${o.shirt}"/>
  <path d="M-64,-318 Q-72,-318 -72,-298 L-68,-168 Q-68,-158 -58,-158 L-40,-158 L-44,-318Z" fill="#fff" opacity=".07"/>
  <path d="M40,-318 L44,-158 L58,-158 Q68,-158 68,-168 L72,-298 Q72,-318 64,-318Z" fill="#000" opacity=".08"/>
  ${collar}${vest}${coatBody}${badge}
  <g id="${id}_aL" transform="translate(-72,-298)"><rect x="-16" y="-8" width="32" height="136" rx="16" fill="${o.sleeve}"/><circle cy="138" r="16" fill="${hand}"/></g>
  <g id="${id}_aR" transform="translate(72,-298)"><rect x="-16" y="-8" width="32" height="136" rx="16" fill="${o.sleeve}"/><circle cy="138" r="16" fill="${hand}"/></g>
  <g id="${id}_front">${o.front || ""}</g>
  <rect x="-15" y="-352" width="30" height="30" rx="8" fill="${o.skinD}"/>
  <g id="${id}_head" transform="translate(0,-376)">
   <circle cx="-47" cy="2" r="10" fill="${o.skin}"/><circle cx="47" cy="2" r="10" fill="${o.skin}"/>
   <circle r="47" fill="${o.skin}"/>
   <path d="M22,-40 Q50,-20 42,22 Q30,44 4,47 Q36,30 34,0 Q34,-24 22,-40Z" fill="${o.skinD}" opacity=".45"/>
   <ellipse cx="-24" cy="16" rx="9" ry="5" fill="#e11d48" opacity=".08"/><ellipse cx="24" cy="16" rx="9" ry="5" fill="#e11d48" opacity=".08"/>
   <g id="${id}_eyes"><ellipse id="${id}_ewl" cx="-17" cy="-3" rx="8.5" ry="9.5" fill="#fff"/><ellipse id="${id}_ewr" cx="17" cy="-3" rx="8.5" ry="9.5" fill="#fff"/><circle id="${id}_pl" cx="-17" cy="-2" r="4.8" fill="#1e293b"/><circle id="${id}_pr" cx="17" cy="-2" r="4.8" fill="#1e293b"/></g>
   <path id="${id}_bl" d="M-28,-19 L-8,-19" stroke="${o.brow || "#2b2b2b"}" stroke-width="4.5" stroke-linecap="round"/><path id="${id}_br" d="M8,-19 L28,-19" stroke="${o.brow || "#2b2b2b"}" stroke-width="4.5" stroke-linecap="round"/>
   <path d="M0,4 Q6,14 0,16" fill="none" stroke="${o.skinD}" stroke-width="3" stroke-linecap="round"/>
   <path id="${id}_smile" d="M-13,22 Q0,36 13,22" fill="none" stroke="#7a2f2f" stroke-width="4" stroke-linecap="round"/>
   <path id="${id}_frown" d="M-12,32 Q0,20 12,32" fill="none" stroke="#7a2f2f" stroke-width="4" stroke-linecap="round" opacity="0"/>
   <path id="${id}_flat" d="M-11,28 L11,28" fill="none" stroke="#7a2f2f" stroke-width="4" stroke-linecap="round" opacity="0"/>
   <ellipse id="${id}_talk" cx="0" cy="27" rx="10" ry="2" fill="#5b1f1f" opacity="0"/>
   ${hair}${hat}${glasses}
  </g>
 </g>
</g>`;
  }
  // props held in front of the body (in body coordinates)
  const FRONT = {
    tablet: `<g transform="translate(0,-218) rotate(-4)"><rect x="-70" y="-48" width="140" height="96" rx="10" fill="#1e293b"/><rect x="-62" y="-40" width="124" height="80" rx="5" fill="#1d4ed8"/><g id="TABLETSCREEN"><rect x="-54" y="-30" width="50" height="8" rx="3" fill="#bfdbfe"/><rect x="-54" y="-16" width="108" height="6" rx="3" fill="#93c5fd"/><rect x="-54" y="-4" width="84" height="6" rx="3" fill="#93c5fd"/><rect x="-54" y="8" width="96" height="6" rx="3" fill="#93c5fd"/><circle cx="40" cy="-26" r="8" fill="#22c55e"/></g></g>`,
    report: `<g transform="translate(-20,-226) rotate(-6)"><rect x="-58" y="-74" width="116" height="150" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/><rect x="-46" y="-60" width="70" height="10" rx="3" fill="#ef4444"/><path d="M-46,-34 L46,-34 M-46,-18 L40,-18 M-46,-2 L46,-2 M-46,14 L30,14 M-46,30 L42,30" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/></g>`,
    binder: `<g transform="translate(0,-226)"><rect x="-80" y="-60" width="160" height="116" rx="8" fill="#1e3a8a"/><rect x="-74" y="-54" width="148" height="104" rx="5" fill="#f1f5f9"/><path d="M-60,-34 L60,-34 M-60,-16 L52,-16 M-60,2 L60,2 M-60,20 L40,20" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/><circle cx="-80" cy="-30" r="6" fill="#64748b"/><circle cx="-80" cy="26" r="6" fill="#64748b"/></g>`,
    clipboard: `<g transform="translate(-92,-196) rotate(-10)"><rect x="-38" y="-48" width="76" height="98" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><rect x="-16" y="-56" width="32" height="14" rx="5" fill="#64748b"/><path d="M-24,-22 L24,-22 M-24,-4 L24,-4 M-24,14 L10,14" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/></g>`,
    parts: `<g transform="translate(0,-214)"><rect x="-96" y="-18" width="192" height="36" rx="8" fill="#334155"/>${[0, 1, 2].map((i) => `<rect x="${-84 + i * 58}" y="-38" width="52" height="22" rx="9" fill="url(#fSteel)"/><rect x="${-64 + i * 58}" y="-44" width="14" height="12" rx="2" fill="#ef4444"/>`).join("")}</g>`,
    phone: `<g transform="translate(66,-300)"><rect x="-16" y="-28" width="32" height="58" rx="7" fill="#1e293b"/><rect x="-12" y="-22" width="24" height="44" rx="3" fill="#60a5fa"/></g>`,
  };
  const CAST = {
    // Production Manager: the main character
    pm: { skin: "#c58c5c", skinD: "#ad7548", hair: "#1f1a17", style: "none", brow: "#1f1a17", shirt: "#93c5fd", sleeve: "#93c5fd", collar: "#bfdbfe", pants: "#1e293b", hat: "#f8fafc", vest: "#1e3a8a", badge: 1 },
    // Production Supervisor
    sup: { skin: "#e8b48a", skinD: "#d39b70", hair: "#3f2a1d", style: "none", brow: "#3f2a1d", shirt: "#f1f5f9", sleeve: "#f1f5f9", collar: "#ffffff", pants: "#334155", hat: "#cbd5e1", vest: "#475569", badge: 1 },
    // Machine Operator
    op: { skin: "#f1c9a5", skinD: "#dcae88", hair: "#3f2a1d", style: "pony", brow: "#3f2a1d", shirt: "#1e3a5f", sleeve: "#1e3a5f", pants: "#1e3a5f", hat: "#2563eb", safety: 1, gloves: "#334155", stripes: 1 },
    // Quality Inspector
    qi: { skin: "#8d5a3b", skinD: "#774a30", hair: "#16110f", style: "bun", brow: "#16110f", shirt: "#334155", sleeve: "#f8fafc", pants: "#334155", coat: "#f8fafc", safety: 1, gloves: "#60a5fa", badge: 1 },
    // Inventory Employee
    inv: { skin: "#d9a073", skinD: "#c48a5c", hair: "#2a1d18", style: "pony", brow: "#2a1d18", shirt: "#475569", sleeve: "#475569", collar: "#64748b", pants: "#1e293b", badge: 1 },
    // Production Planner
    pl: { skin: "#b9764a", skinD: "#a3643c", hair: "#111111", style: "bun", brow: "#111111", shirt: "#f8fafc", sleeve: "#1e3a8a", collar: "#ffffff", pants: "#1e293b", coat: "#1e3a8a", glasses: 1, badge: 1 },
    // the clerk who copies the order onto the job card (flashback)
    pe: { skin: "#d9a073", skinD: "#c48a5c", hair: "#1c1917", style: "short", brow: "#1c1917", shirt: "#e2e8f0", sleeve: "#e2e8f0", collar: "#f8fafc", pants: "#334155", glasses: 1, badge: 1 },
    // background workers
    w1: { skin: "#b9764a", skinD: "#a3643c", hair: "#111", style: "none", shirt: "#475569", sleeve: "#475569", pants: "#475569", hat: "#f8fafc", safety: 1, gloves: "#334155", stripes: 1 },
    w2: { skin: "#e8b48a", skinD: "#d39b70", hair: "#111", style: "none", shirt: "#475569", sleeve: "#475569", pants: "#475569", hat: "#3b82f6", safety: 1, gloves: "#334155", stripes: 1 },
  };
  const castO = (k, front) => ({ ...CAST[k], front: front ? FRONT[front] : "" });

  /* ---------- the factory floor (machines 1-3, conveyor, hero machine 4) ---------- */
  const lamp = (x, y) => `<g transform="translate(${x},${y})"><line x1="0" y1="-60" x2="0" y2="0" stroke="#475569" stroke-width="3"/><path d="M-34,26 Q-30,0 0,0 Q30,0 34,26Z" fill="#334155"/><ellipse cx="0" cy="26" rx="30" ry="6" fill="#fef9c3"/><ellipse class="lampglow" cx="0" cy="40" rx="110" ry="40" fill="url(#fLampG)"/></g>`;
  const smallMachine = (k, x) => `<g transform="translate(${x},470)">
    <rect x="0" y="40" width="280" height="250" rx="14" fill="url(#fMach)"/><rect x="0" y="260" width="280" height="30" rx="6" fill="#1e3a5f"/>
    <rect x="36" y="80" width="150" height="120" rx="8" fill="#0b1220"/><rect x="36" y="80" width="150" height="120" rx="8" fill="url(#fGlass)" opacity=".5"/>
    <rect x="200" y="86" width="56" height="70" rx="6" fill="#1e293b"/><rect x="206" y="92" width="44" height="30" rx="3" fill="#1d4ed8"/>
    <rect x="248" y="-10" width="12" height="50" fill="#64748b"/><circle id="fM${k}L" cx="254" cy="-16" r="11" fill="#22c55e"/>
    <text x="16" y="242" font-size="18" font-weight="800" fill="#1e3a5f" font-family="Inter,sans-serif">M0${[1, 3, 4][k - 1]}</text></g>`;
  const FACTORY = {
    defs: `<defs>
     <linearGradient id="fWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#162338"/><stop offset="1" stop-color="#2a3c58"/></linearGradient>
     <linearGradient id="fFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4b63"/><stop offset="1" stop-color="#1c2738"/></linearGradient>
     <linearGradient id="fWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa3d4"/><stop offset="1" stop-color="#b8cfec"/></linearGradient>
     <linearGradient id="fShaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
     <radialGradient id="fLampG"><stop offset="0" stop-color="#fef9c3" stop-opacity=".35"/><stop offset="1" stop-color="#fef9c3" stop-opacity="0"/></radialGradient>
     <linearGradient id="fMach" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6ecf3"/><stop offset="1" stop-color="#b9c6d6"/></linearGradient>
     <linearGradient id="fGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#93c5fd" stop-opacity=".45"/><stop offset=".5" stop-color="#93c5fd" stop-opacity="0"/></linearGradient>
     <linearGradient id="fSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset=".45" stop-color="#94a3b8"/><stop offset=".55" stop-color="#cbd5e1"/><stop offset="1" stop-color="#64748b"/></linearGradient>
     <linearGradient id="fDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#475569"/><stop offset="1" stop-color="#1e293b"/></linearGradient>
     <radialGradient id="fInLight" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="#e0f2fe" stop-opacity=".5"/><stop offset="1" stop-color="#e0f2fe" stop-opacity="0"/></radialGradient>
     <clipPath id="fWinClip"><rect x="1290" y="380" width="320" height="320" rx="14"/></clipPath>
    </defs>`,
    bg: () => `${FACTORY.defs}
     <rect x="-400" y="-200" width="2720" height="920" fill="url(#fWall)"/>
     ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<g transform="translate(${-60 + i * 310},60)"><rect width="190" height="280" rx="6" fill="url(#fWin)"/><path d="M95,0 L95,280 M0,140 L190,140" stroke="#1e2d45" stroke-width="8"/><polygon points="0,280 190,280 330,720 120,720" fill="url(#fShaft)"/></g>`).join("")}
     ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${-120 + i * 310}" y="-200" width="28" height="920" fill="#33445f"/><rect x="${-120 + i * 310}" y="-200" width="8" height="920" fill="#4a5d7c"/>`).join("")}
     <rect x="-400" y="370" width="2720" height="30" fill="#33445f"/><rect x="-400" y="370" width="2720" height="8" fill="#52668a"/>
     <g transform="translate(860,400)"><rect x="-30" y="0" width="60" height="40" rx="6" fill="#475569"/><line x1="0" y1="40" x2="0" y2="170" stroke="#64748b" stroke-width="3"/><path d="M-10,170 Q-12,196 4,196 Q16,196 14,182" fill="none" stroke="#94a3b8" stroke-width="6"/></g>
     ${[220, 640, 1060, 1480].map((x) => lamp(x, 440)).join("")}
     ${[[60, 560, 180, 160], [300, 590, 140, 130], [1400, 560, 220, 160], [1660, 600, 160, 120]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#2b3b55"/><rect x="${x + 20}" y="${y + 20}" width="${w * 0.45}" height="${h * 0.4}" rx="4" fill="#1a2538"/>`).join("")}
     <rect x="-400" y="700" width="2720" height="600" fill="url(#fFloor)"/>
     ${[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<line x1="${960 + (i - 2) * 90}" y1="702" x2="${960 + (i - 2) * 420}" y2="1300" stroke="rgba(255,255,255,.05)" stroke-width="2"/>`).join("")}
     <rect x="-400" y="890" width="2720" height="10" fill="#eab308" opacity=".55"/>`,
    mid: () => `${[1, 2, 3].map((k) => smallMachine(k, 120 + (k - 1) * 330)).join("")}
     <g id="fConv"><rect x="-100" y="790" width="1240" height="30" rx="8" fill="#1e293b"/><rect x="-100" y="790" width="1240" height="6" fill="#475569"/>
      ${Array.from({ length: 22 }, (_, i) => `<circle cx="${-80 + i * 56}" cy="828" r="9" fill="#334155" stroke="#64748b" stroke-width="2"/>`).join("")}
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${-60 + i * 120}" y="820" width="12" height="80" fill="#334155"/>`).join("")}
      <g id="fParts">${Array.from({ length: 12 }, (_, i) => `<rect id="fP${i}" x="-26" y="-12" width="52" height="16" rx="7" fill="url(#fSteel)"/>`).join("")}</g></g>
     <g transform="translate(1040,760)"><rect x="0" y="40" width="130" height="110" rx="8" fill="#334155"/><rect x="0" y="40" width="130" height="14" fill="#475569"/><g id="fPile">${Array.from({ length: 16 }, (_, i) => `<rect id="fPl${i}" x="-26" y="-8" width="52" height="16" rx="7" fill="url(#fSteel)" opacity="0"/>`).join("")}</g></g>`,
    // the hero machine: a turning centre with a window onto the chuck, the shaft and the tool
    fg: () => `<g id="fM4"><g id="fM4body">
      <rect x="1180" y="250" width="680" height="690" rx="22" fill="url(#fMach)"/><rect x="1180" y="880" width="680" height="60" rx="10" fill="#1e3a5f"/>
      <rect x="1180" y="250" width="680" height="54" rx="22" fill="#1e3a5f"/><text x="1210" y="287" font-size="24" font-weight="800" fill="#e2e8f0" font-family="Inter,sans-serif" letter-spacing="2">M02 · CNC TURNING</text>
      <rect x="1270" y="360" width="360" height="360" rx="20" fill="#94a3b8"/>
      <g clip-path="url(#fWinClip)">
       <rect x="1290" y="380" width="320" height="320" fill="#0b1220"/><rect x="1290" y="380" width="320" height="320" fill="url(#fInLight)"/>
       <rect x="1290" y="640" width="320" height="60" fill="#111827"/>
       <g id="fChuck"><rect x="1304" y="450" width="60" height="180" rx="8" fill="url(#fDark)"/><rect id="fJ0" x="1356" y="460" width="18" height="34" rx="3" fill="#94a3b8"/><rect id="fJ1" x="1356" y="523" width="18" height="34" rx="3" fill="#94a3b8"/><rect id="fJ2" x="1356" y="586" width="18" height="34" rx="3" fill="#94a3b8"/></g>
       <g id="fShaftG"><rect x="1372" y="525" width="200" height="30" rx="4" fill="url(#fSteel)"/><g id="fShaftMarks">${[0, 1, 2, 3, 4, 5].map((i) => `<rect id="fSm${i}" x="${1380 + i * 32}" y="525" width="4" height="30" fill="#475569" opacity=".5"/>`).join("")}</g></g>
       <rect x="1568" y="515" width="40" height="50" rx="6" fill="url(#fDark)"/><path d="M1568,540 L1552,540" stroke="#94a3b8" stroke-width="8"/>
       <g id="fTool"><rect x="1446" y="388" width="70" height="90" rx="8" fill="url(#fDark)"/><rect x="1466" y="476" width="22" height="34" fill="#64748b"/><path d="M1468,510 L1486,510 L1477,524Z" fill="#fde047"/></g>
       <g id="fCool"><path d="M1530,420 Q1520,470 1492,512" fill="none" stroke="#7dd3fc" stroke-width="6" opacity=".55" stroke-dasharray="10 8"/></g>
       <rect x="1290" y="380" width="320" height="320" fill="url(#fGlass)" opacity=".45"/>
      </g>
      <rect x="1640" y="380" width="180" height="300" rx="14" fill="#cbd5e1"/><rect x="1660" y="400" width="140" height="18" rx="5" fill="#94a3b8"/><rect x="1660" y="430" width="140" height="18" rx="5" fill="#94a3b8"/>
      <rect x="1820" y="110" width="14" height="140" fill="#64748b"/>
      <g id="fTower"><rect x="1806" y="40" width="42" height="34" rx="6" fill="#7f1d1d"/><rect id="fTR" x="1806" y="40" width="42" height="34" rx="6" fill="#ef4444" opacity="0"/><rect x="1806" y="76" width="42" height="34" rx="6" fill="#713f12"/><rect id="fTA" x="1806" y="76" width="42" height="34" rx="6" fill="#facc15" opacity="0"/><rect x="1806" y="112" width="42" height="34" rx="6" fill="#14532d"/><rect id="fTG" x="1806" y="112" width="42" height="34" rx="6" fill="#22c55e"/></g>
      <circle id="fTRglow" cx="1827" cy="57" r="140" fill="url(#fRedG)" opacity="0"/>
     </g>
     <g id="fPanel"><rect x="1186" y="460" width="14" height="70" fill="#64748b"/><rect x="1030" y="420" width="166" height="230" rx="14" fill="#334155"/><rect x="1030" y="420" width="166" height="230" rx="14" fill="none" stroke="#475569" stroke-width="4"/>
      <rect x="1044" y="434" width="138" height="92" rx="6" fill="#0b1220"/><g id="fScreen"></g>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${1046 + (i % 3) * 46}" y="${540 + Math.floor(i / 3) * 30}" width="38" height="22" rx="4" fill="#64748b"/>`).join("")}
      <circle cx="1150" cy="620" r="20" fill="#7f1d1d"/><circle id="fEstop" cx="1150" cy="616" r="18" fill="#dc2626"/><circle cx="1144" cy="610" r="6" fill="#fff" opacity=".3"/>
      <rect x="1050" y="606" width="60" height="22" rx="4" fill="#facc15"/><text x="1080" y="622" text-anchor="middle" font-size="12" font-weight="800" fill="#1e293b" font-family="Inter,sans-serif">E-STOP</text></g>
     <g id="fClip"><rect x="1210" y="740" width="70" height="90" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/><rect x="1230" y="732" width="30" height="12" rx="4" fill="#64748b"/><path d="M1222,764 L1268,764 M1222,780 L1262,780 M1222,796 L1250,796" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/></g>
     <defs><radialGradient id="fRedG"><stop offset="0" stop-color="#ef4444" stop-opacity=".6"/><stop offset="1" stop-color="#ef4444" stop-opacity="0"/></radialGradient></defs>
     <g id="fSparks">${Array.from({ length: 36 }, (_, i) => `<line id="fSk${i}" x1="0" y1="0" x2="0" y2="0" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" opacity="0"/>`).join("")}</g>
     <g id="fSmoke">${Array.from({ length: 8 }, (_, i) => `<circle id="fSmk${i}" r="20" fill="#94a3b8" opacity="0"/>`).join("")}</g>`,
  };

  /* ---------- the QC bench ---------- */
  const QC = {
    bg: () => `<defs><linearGradient id="qWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22324d"/><stop offset="1" stop-color="#34496a"/></linearGradient>
       <radialGradient id="qLamp" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#f8fafc" stop-opacity=".45"/><stop offset="1" stop-color="#f8fafc" stop-opacity="0"/></radialGradient>
       <linearGradient id="qSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset=".45" stop-color="#94a3b8"/><stop offset=".55" stop-color="#cbd5e1"/><stop offset="1" stop-color="#64748b"/></linearGradient></defs>
      <rect x="-400" y="-200" width="2720" height="1500" fill="url(#qWall)"/>
      <rect x="140" y="120" width="560" height="300" rx="10" fill="#1b2940"/><path d="M160,200 L680,200 M160,290 L680,290" stroke="#2b3d5c" stroke-width="10"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${180 + i * 100}" y="${140 + (i % 2) * 6}" width="60" height="54" rx="4" fill="#334a6e"/><rect x="${180 + i * 100}" y="230" width="70" height="54" rx="4" fill="#2c4163"/>`).join("")}
      <rect x="1240" y="110" width="520" height="320" rx="12" fill="#1b2940"/><text x="1500" y="290" text-anchor="middle" font-size="64" font-weight="800" fill="#2b3d5c" font-family="Inter,sans-serif" letter-spacing="8">QUALITY</text>
      <g transform="translate(960,40)"><rect x="-6" y="0" width="12" height="120" fill="#475569"/><path d="M-120,170 Q-110,120 0,120 Q110,120 120,170Z" fill="#334155"/><ellipse cx="0" cy="170" rx="110" ry="14" fill="#f8fafc"/><polygon points="-110,170 110,170 520,700 -520,700" fill="url(#qLamp)"/></g>`,
    mid: () => "",
    fg: () => `<g id="qTable"><rect x="200" y="640" width="1520" height="40" rx="10" fill="#cbd5e1"/><rect x="200" y="640" width="1520" height="10" fill="#e2e8f0"/><rect x="230" y="680" width="1460" height="320" fill="#475569"/><rect x="230" y="680" width="1460" height="16" fill="rgba(0,0,0,.2)"/></g>
      <g id="qBinOK" transform="translate(300,560)"><path d="M0,0 L170,0 L156,84 L14,84Z" fill="#16a34a"/><rect x="-6" y="-8" width="182" height="14" rx="4" fill="#15803d"/><text x="85" y="56" text-anchor="middle" font-size="24" font-weight="800" fill="#fff" font-family="Inter,sans-serif">OK</text></g>
      <g id="qBinNG" transform="translate(520,560)"><path d="M0,0 L170,0 L156,84 L14,84Z" fill="#dc2626"/><rect x="-6" y="-8" width="182" height="14" rx="4" fill="#b91c1c"/><text x="85" y="56" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" font-family="Inter,sans-serif">REJECT</text></g>
      <g id="qTray"><rect x="1080" y="612" width="330" height="30" rx="6" fill="#334155"/>${Array.from({ length: 6 }, (_, i) => `<rect id="qS${i}" x="${1094 + (i % 3) * 104}" y="${590 - Math.floor(i / 3) * 18}" width="96" height="20" rx="9" fill="url(#qSteel)"/>`).join("")}</g>
      <g id="qTag" transform="translate(1450,560)"><rect width="240" height="80" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/><text x="18" y="30" font-size="18" font-weight="700" fill="#64748b" font-family="Inter,sans-serif">DRIVE SHAFT DS-120</text><text x="18" y="64" font-size="27" font-weight="800" fill="#0f2347" font-family="Inter,sans-serif">Ø 25.40 ± 0.02</text></g>
      <g id="qCal"><rect x="820" y="582" width="420" height="22" rx="4" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>${Array.from({ length: 30 }, (_, i) => `<line x1="${830 + i * 13}" y1="582" x2="${830 + i * 13}" y2="${i % 5 ? 590 : 596}" stroke="#475569" stroke-width="1.5"/>`).join("")}
       <path d="M830,604 L830,660 L852,660 L852,604Z" fill="#94a3b8"/><g id="qJaw"><path d="M904,604 L904,660 L926,660 L926,604Z" fill="#94a3b8"/><rect x="890" y="540" width="170" height="70" rx="10" fill="#1e293b"/><rect x="902" y="550" width="120" height="44" rx="5" fill="#a7c4b5"/><text id="qLCD" x="1016" y="584" text-anchor="end" font-size="32" font-weight="800" fill="#0f2347" font-family="Inter,sans-serif">0.00</text><text x="1036" y="584" font-size="14" font-weight="800" fill="#cbd5e1" font-family="Inter,sans-serif">mm</text></g>
       <rect id="qPart" x="852" y="612" width="52" height="40" rx="6" fill="url(#qSteel)"/></g>`,
  };

  /* ---------- the office (flashback) and the plant office (investigation) ---------- */
  const OFFICE = {
    bg: () => `<defs><linearGradient id="oWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd8e6"/><stop offset="1" stop-color="#b7c4d8"/></linearGradient></defs>
      <rect x="-400" y="-200" width="2720" height="900" fill="url(#oWall)"/><rect x="-400" y="700" width="2720" height="600" fill="#8394ad"/>
      <rect x="160" y="120" width="460" height="300" rx="10" fill="#d6b98c"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${190 + (i % 3) * 140}" y="${145 + Math.floor(i / 3) * 90}" width="110" height="70" rx="3" fill="#f8fafc" transform="rotate(${(hs(i, 3) - 0.5) * 10} ${245 + (i % 3) * 140} ${180 + Math.floor(i / 3) * 90})"/>`).join("")}
      <rect x="1260" y="150" width="520" height="40" rx="4" fill="#8e9db8"/><rect x="1260" y="330" width="520" height="40" rx="4" fill="#8e9db8"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${1280 + i * 40}" y="${190 - 120 + (i % 3) * 6}" width="34" height="${120 - (i % 3) * 6}" rx="3" fill="${["#1e3a8a", "#475569", "#64748b"][i % 3]}"/>`).join("")}
      ${Array.from({ length: 10 }, (_, i) => `<rect x="${1290 + i * 48}" y="${370 - 130 + (i % 2) * 8}" width="40" height="${130 - (i % 2) * 8}" rx="3" fill="${["#334155", "#1e3a8a"][i % 2]}"/>`).join("")}
      <g transform="translate(960,190)"><circle r="56" fill="#f8fafc" stroke="#64748b" stroke-width="7"/><line id="oClockM" x1="0" y1="0" x2="0" y2="-40" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/><line x1="0" y1="0" x2="26" y2="0" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/></g>`,
    mid: () => `<rect x="712" y="452" width="158" height="250" rx="34" fill="#334155"/><rect x="734" y="474" width="114" height="206" rx="24" fill="#475569"/>`,
    fg: () => `<rect x="300" y="640" width="1320" height="36" rx="8" fill="#a57c52"/><rect x="320" y="676" width="1280" height="330" fill="#7c5a3a"/><rect x="320" y="676" width="1280" height="16" fill="rgba(0,0,0,.18)"/>
      <g transform="translate(980,600) rotate(-4)"><rect width="200" height="44" rx="4" fill="#f8fafc"/><rect x="10" y="10" width="120" height="8" rx="3" fill="#94a3b8"/><rect x="10" y="26" width="160" height="6" rx="3" fill="#cbd5e1"/></g>
      <g transform="translate(1180,610) rotate(5)"><rect width="170" height="36" rx="4" fill="#fef3c7"/><rect x="10" y="10" width="100" height="7" rx="3" fill="#d6b98c"/></g>
      <g transform="translate(420,606) rotate(-2)"><rect width="230" height="40" rx="4" fill="#f1f5f9"/><rect x="10" y="10" width="150" height="8" rx="3" fill="#94a3b8"/></g>
      <g id="oTray" transform="translate(1400,580)"><rect width="190" height="60" rx="6" fill="#475569"/><rect x="8" y="8" width="174" height="10" rx="3" fill="#64748b"/><text x="95" y="48" text-anchor="middle" font-size="17" font-weight="800" fill="#e2e8f0" font-family="Inter,sans-serif">TO SHOP FLOOR</text></g>
      <g id="oCard"><rect x="-60" y="-40" width="120" height="80" rx="5" fill="#fef9c3" stroke="#d6b98c" stroke-width="2"/><rect x="-48" y="-28" width="60" height="8" rx="3" fill="#a3a3a3"/><text x="-48" y="18" font-size="22" font-weight="700" fill="#1e3a8a" font-family="Inter,sans-serif" font-style="italic">24.50</text></g>`,
  };
  const PLANT = {
    bg: () => `<defs><linearGradient id="pWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2e48"/><stop offset="1" stop-color="#31476a"/></linearGradient></defs>
      <rect x="-400" y="-200" width="2720" height="900" fill="url(#pWall)"/><rect x="-400" y="700" width="2720" height="600" fill="#26344b"/>
      <g transform="translate(1340,190)"><circle r="54" fill="#f8fafc" stroke="#64748b" stroke-width="7"/><line id="pClockM" x1="0" y1="0" x2="0" y2="-38" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/><line id="pClockH" x1="0" y1="0" x2="24" y2="0" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/></g>
      <g id="pBoard"><rect x="700" y="110" width="560" height="300" rx="10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="6"/>
       <text x="730" y="156" font-size="26" font-weight="800" fill="#0f2347" font-family="Inter,sans-serif">PRODUCTION SCHEDULE</text>
       ${[0, 1, 2, 3].map((r) => `<rect x="730" y="${180 + r * 52}" width="500" height="40" rx="5" fill="#e2e8f0"/><rect x="740" y="${190 + r * 52}" width="${120 + hs(r, 5) * 200}" height="20" rx="4" fill="${r === 1 ? "#ef4444" : "#93c5fd"}"/>`).join("")}
       <path d="M1150,240 L1210,300 M1210,240 L1150,300" stroke="#dc2626" stroke-width="8" stroke-linecap="round"/></g>
      <g transform="translate(90,520)"><rect width="170" height="380" rx="8" fill="#64748b"/>${[0, 1, 2, 3].map((i) => `<rect x="12" y="${14 + i * 92}" width="146" height="80" rx="5" fill="#94a3b8"/><rect x="66" y="${46 + i * 92}" width="38" height="10" rx="4" fill="#334155"/>`).join("")}</g>
      <g id="pCards">${Array.from({ length: 6 }, (_, i) => `<rect id="pCd${i}" x="-34" y="-24" width="68" height="48" rx="4" fill="#fef9c3" stroke="#d6b98c" stroke-width="2" opacity="0"/>`).join("")}</g>
      <g transform="translate(1440,470)"><rect width="300" height="430" rx="6" fill="#475569"/><rect y="140" width="300" height="12" fill="#64748b"/><rect y="290" width="300" height="12" fill="#64748b"/>
       ${[[20, 60, 120, 80], [160, 76, 110, 64], [20, 214, 90, 76], [130, 200, 150, 90], [30, 350, 140, 80], [190, 362, 90, 68]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#d6b98c"/><rect x="${x}" y="${y + h * 0.42}" width="${w}" height="${h * 0.14}" fill="rgba(30,58,138,.2)"/>`).join("")}</g>`,
    mid: () => "",
    fg: () => `<g id="pPapers">${Array.from({ length: 10 }, (_, i) => `<rect id="pPp${i}" x="-24" y="-32" width="48" height="64" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" opacity="0"/>`).join("")}</g>`,
  };

  window.ART = { person, CAST, FRONT, castO, sets: { factory: FACTORY, qc: QC, office: OFFICE, plant: PLANT }, ico };
})();
