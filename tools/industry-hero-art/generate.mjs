/*
 * Original hero illustrations for two solution pages (no photos, no third-party art):
 *   public/images/industry-oil-gas.webp     Oil, Gas & Energy: a refinery at dusk (columns, spheres, a flare, a
 *                                            pipe rack), wind turbines and a pylon on the horizon, and a flanged
 *                                            pipeline with a gate valve in the foreground.
 *   public/images/industry-machinery.webp   Industrial Machinery & Equipment: a blueprint (grid, two meshing gears,
 *                                            a centrifugal pump, a shaft on bearings) with an orange routing path.
 * Theme colours (navy, sky, orange). The main subject sits on the right because the Poster hero puts the copy on
 * the left under a navy gradient. Drawn as SVG and rasterised with sharp at 1920 x 1080.
 *
 *   node tools/industry-hero-art/generate.mjs      (from the project root)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const W = 1920;
const H = 1080;
const OUT = path.join(__dirname, "..", "..", "public", "images");

/** Small seeded random, so the stars and lights land in the same place every run. */
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const f = (n) => n.toFixed(1);

/* ----------------------------------------------------------------------------------------- Oil, Gas & Energy */
function oilGas() {
  const r = rng(7);
  const parts = [];
  // stars
  for (let i = 0; i < 90; i++) {
    parts.push(`<circle cx="${f(r() * W)}" cy="${f(r() * 520)}" r="${f(0.8 + r() * 1.4)}" fill="#e0f2fe" opacity="${f(0.15 + r() * 0.45)}"/>`);
  }
  // distant hills
  parts.push(`<path d="M0 800 C 220 735 420 770 640 742 C 860 714 1040 760 1260 735 C 1480 712 1700 748 1920 726 L1920 1080 L0 1080 Z" fill="#0c2252"/>`);
  // wind turbines
  const turbine = (x, base, h, rot, op) => {
    const hub = base - h;
    const blade = (a) =>
      `<path d="M0 0 L ${f(h * 0.04)} ${f(-h * 0.06)} L 0 ${f(-h * 0.52)} L ${f(-h * 0.03)} ${f(-h * 0.06)} Z" transform="rotate(${a})" fill="#5b8bd6"/>`;
    return `<g opacity="${op}"><path d="M ${f(x - h * 0.022)} ${base} L ${f(x - h * 0.008)} ${hub} L ${f(x + h * 0.008)} ${hub} L ${f(x + h * 0.022)} ${base} Z" fill="#3f6fbf"/>
      <g transform="translate(${x} ${hub})">${[rot, rot + 120, rot + 240].map(blade).join("")}<circle r="${f(h * 0.025)}" fill="#7aa5e8"/></g></g>`;
  };
  parts.push(turbine(170, 790, 300, 12, 0.55), turbine(390, 772, 240, 47, 0.45), turbine(590, 760, 200, 80, 0.38));
  // pylon
  const px = 860, pb = 800, pt = 470;
  parts.push(`<g stroke="#4a7ccc" stroke-width="3" fill="none" opacity="0.5">
    <path d="M ${px - 55} ${pb} L ${px - 10} ${pt} L ${px + 10} ${pt} L ${px + 55} ${pb}"/>
    <path d="M ${px - 48} ${pb - 60} L ${px + 40} ${pb - 160} M ${px + 48} ${pb - 60} L ${px - 40} ${pb - 160} M ${px - 36} ${pb - 160} L ${px + 28} ${pb - 260} M ${px + 36} ${pb - 160} L ${px - 28} ${pb - 260}"/>
    <path d="M ${px - 110} ${pt + 60} L ${px + 110} ${pt + 60} M ${px - 80} ${pt + 130} L ${px + 80} ${pt + 130}"/>
    <path d="M ${px - 110} ${pt + 60} C ${px - 400} ${pt + 140} ${px - 700} ${pt + 150} ${px - 1000} ${pt + 120}" stroke-width="1.5"/>
    <path d="M ${px + 110} ${pt + 60} C ${px + 260} ${pt + 110} ${px + 300} ${pt + 120} ${px + 360} ${pt + 150}" stroke-width="1.5"/>
  </g>`);
  // ground
  parts.push(`<rect x="0" y="790" width="${W}" height="${H - 790}" fill="url(#ground)"/>`);

  // refinery
  const sil = "#0a1d47";
  const edge = `stroke="#3b82f6" stroke-opacity="0.35" stroke-width="2"`;
  const column = (x, top, w) => {
    const base = 800;
    const rings = [];
    for (let y = top + 70; y < base - 20; y += 72) rings.push(`<path d="M ${x - 14} ${y} L ${x + w + 14} ${y}" stroke="#2f62b8" stroke-width="3" opacity="0.6"/>`);
    const ladder = `<path d="M ${x + w + 6} ${top + 40} L ${x + w + 6} ${base} M ${x + w + 18} ${top + 40} L ${x + w + 18} ${base}" stroke="#2f62b8" stroke-width="2" opacity="0.5"/>`;
    return `<rect x="${x}" y="${top}" width="${w}" height="${base - top}" rx="${w / 2}" fill="${sil}" ${edge}/>${rings.join("")}${ladder}`;
  };
  parts.push(column(1180, 380, 70), column(1290, 300, 90), column(1428, 450, 62), column(1700, 410, 82));
  // flare stack and flame
  parts.push(`<rect x="1096" y="250" width="16" height="550" fill="${sil}" ${edge}/>
    <path d="M 1086 250 L 1122 250" stroke="#2f62b8" stroke-width="5"/>
    <circle cx="1104" cy="200" r="90" fill="url(#flareGlow)"/>
    <path d="M 1104 248 C 1072 222 1082 186 1100 150 C 1104 176 1124 182 1120 206 C 1134 196 1136 182 1132 170 C 1150 200 1138 238 1104 248 Z" fill="url(#flame)"/>`);
  // spheres on legs
  const sphere = (cx, cy, rr) =>
    `<path d="M ${cx - rr * 0.7} ${cy + rr * 0.6} L ${cx - rr * 0.8} 800 M ${cx + rr * 0.7} ${cy + rr * 0.6} L ${cx + rr * 0.8} 800 M ${cx} ${cy + rr} L ${cx} 800" stroke="#2f62b8" stroke-width="5"/>
     <circle cx="${cx}" cy="${cy}" r="${rr}" fill="url(#sphere)" ${edge}/>
     <path d="M ${cx - rr} ${cy} A ${rr} ${rr * 0.28} 0 0 0 ${cx + rr} ${cy}" fill="none" stroke="#2f62b8" stroke-width="2" opacity="0.6"/>`;
  parts.push(sphere(1575, 700, 72), sphere(1842, 722, 56));
  // pipe rack
  parts.push(`<g stroke-linecap="round">
    <path d="M 1000 748 L 1920 748" stroke="#1c4791" stroke-width="10"/>
    <path d="M 1000 768 L 1920 768" stroke="#163b7d" stroke-width="8"/>
    <path d="M 1000 786 L 1920 786" stroke="#1c4791" stroke-width="6"/>
    ${[1040, 1240, 1480, 1660, 1880].map((x) => `<path d="M ${x} 740 L ${x} 800" stroke="#2f62b8" stroke-width="5"/>`).join("")}
  </g>`);
  // lights
  for (let i = 0; i < 38; i++) {
    const x = 1170 + r() * 720;
    const y = 300 + r() * 470;
    parts.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(2 + r() * 2.2)}" fill="${r() > 0.35 ? "#fdba74" : "#e0f2fe"}" opacity="${f(0.55 + r() * 0.4)}"/>`);
  }

  // foreground pipeline with flanges and a gate valve
  const py = 965;
  const fl = [];
  for (let x = 120; x < W; x += 380) {
    const bolts = [-34, -12, 12, 34].map((d) => `<circle cx="${x + 13}" cy="${py + d}" r="4" fill="#0b1f4b"/>`).join("");
    fl.push(`<rect x="${x}" y="${py - 58}" width="26" height="116" rx="5" fill="url(#flange)" stroke="#60a5fa" stroke-opacity="0.45" stroke-width="2"/>${bolts}`);
  }
  parts.push(`<rect x="-20" y="${py - 42}" width="${W + 40}" height="84" fill="url(#pipe)"/>
    <path d="M -20 ${py - 30} L ${W + 20} ${py - 30}" stroke="#93c5fd" stroke-opacity="0.35" stroke-width="4"/>
    ${fl.join("")}`);
  const vx = 1470;
  parts.push(`<g>
    <path d="M ${vx - 95} ${py - 48} L ${vx + 95} ${py - 48} L ${vx + 95} ${py + 48} L ${vx - 95} ${py + 48} Z" fill="url(#flange)" stroke="#60a5fa" stroke-opacity="0.5" stroke-width="2"/>
    <path d="M ${vx - 60} ${py - 48} C ${vx - 60} ${py - 120} ${vx + 60} ${py - 120} ${vx + 60} ${py - 48} Z" fill="#1d4a94" stroke="#60a5fa" stroke-opacity="0.5" stroke-width="2"/>
    <rect x="${vx - 10}" y="${py - 205}" width="20" height="95" fill="#2b5fb0"/>
    <circle cx="${vx}" cy="${py - 212}" r="64" fill="none" stroke="#fb923c" stroke-width="9"/>
    <path d="M ${vx - 64} ${py - 212} L ${vx + 64} ${py - 212} M ${vx} ${py - 276} L ${vx} ${py - 148}" stroke="#fb923c" stroke-width="6"/>
    <circle cx="${vx}" cy="${py - 212}" r="13" fill="#fdba74"/>
  </g>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#06132f"/><stop offset="0.5" stop-color="#0e295c"/><stop offset="0.74" stop-color="#1f4c8f"/><stop offset="1" stop-color="#0b1f4b"/>
    </linearGradient>
    <radialGradient id="dusk" cx="0.68" cy="0.72" r="0.5">
      <stop offset="0" stop-color="#fb923c" stop-opacity="0.75"/><stop offset="0.45" stop-color="#f97316" stop-opacity="0.22"/><stop offset="1" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1c45"/><stop offset="1" stop-color="#050f28"/></linearGradient>
    <radialGradient id="flareGlow"><stop offset="0" stop-color="#fdba74" stop-opacity="0.7"/><stop offset="1" stop-color="#f97316" stop-opacity="0"/></radialGradient>
    <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f97316"/><stop offset="0.6" stop-color="#fb923c"/><stop offset="1" stop-color="#fde68a"/></linearGradient>
    <radialGradient id="sphere" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#2a5cae"/><stop offset="1" stop-color="#0a1d47"/></radialGradient>
    <linearGradient id="pipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b5fb0"/><stop offset="0.45" stop-color="#173f85"/><stop offset="1" stop-color="#081a40"/></linearGradient>
    <linearGradient id="flange" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3569bd"/><stop offset="1" stop-color="#0d2556"/></linearGradient>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#94a3b8" opacity="0.12"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#dusk)"/>
  ${parts.join("\n  ")}
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
</svg>`;
}

/* ----------------------------------------------------------------------------------------- Industrial Machinery */
function gearPath(cx, cy, rOut, teeth, depth, phase = 0) {
  const rIn = rOut - depth;
  const step = (Math.PI * 2) / teeth;
  const pts = [];
  for (let i = 0; i < teeth; i++) {
    const a = phase + i * step;
    const at = (frac, rad) => [cx + rad * Math.cos(a + frac * step), cy + rad * Math.sin(a + frac * step)];
    pts.push(at(0, rIn), at(0.12, rOut), at(0.42, rOut), at(0.54, rIn));
  }
  return "M " + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L ") + " Z";
}

function gear(cx, cy, rOut, teeth, depth, phase, stroke, holes) {
  const hub = rOut * 0.26;
  const ring = rOut - depth - rOut * 0.12;
  const holeR = (ring - hub) * 0.32;
  const holesSvg = [];
  for (let i = 0; i < holes; i++) {
    const a = phase + (i * Math.PI * 2) / holes;
    const d = (ring + hub) / 2;
    holesSvg.push(`<circle cx="${f(cx + d * Math.cos(a))}" cy="${f(cy + d * Math.sin(a))}" r="${f(holeR)}" fill="#0b2152" stroke="${stroke}" stroke-width="2.5"/>`);
  }
  return `<path d="${gearPath(cx, cy, rOut, teeth, depth, phase)}" fill="rgba(56,189,248,0.07)" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="${cx}" cy="${cy}" r="${f(ring)}" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.55"/>
    ${holesSvg.join("")}
    <circle cx="${cx}" cy="${cy}" r="${f(hub)}" fill="#0b2152" stroke="${stroke}" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${f(hub * 0.42)}" fill="none" stroke="${stroke}" stroke-width="2.5"/>
    <rect x="${f(cx - hub * 0.12)}" y="${f(cy - hub * 0.62)}" width="${f(hub * 0.24)}" height="${f(hub * 0.22)}" fill="${stroke}"/>
    <path d="M ${f(cx - rOut - 30)} ${cy} L ${f(cx + rOut + 30)} ${cy} M ${cx} ${f(cy - rOut - 30)} L ${cx} ${f(cy + rOut + 30)}" stroke="${stroke}" stroke-width="1" stroke-dasharray="14 6 3 6" opacity="0.45"/>`;
}

function dim(x1, y1, x2, y2, off) {
  // a dimension line with ticks, offset perpendicular to the measured edge
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  const nx = (-dy / len) * off, ny = (dx / len) * off;
  const a = [x1 + nx, y1 + ny], b = [x2 + nx, y2 + ny];
  const t = 9;
  const tick = (p) => `M ${f(p[0] - (dx / len) * t + (-dy / len) * t)} ${f(p[1] - (dy / len) * t + (dx / len) * t)} L ${f(p[0] + (dx / len) * t - (-dy / len) * t)} ${f(p[1] + (dy / len) * t - (dx / len) * t)}`;
  return `<path d="M ${f(x1)} ${f(y1)} L ${f(a[0])} ${f(a[1])} M ${f(x2)} ${f(y2)} L ${f(b[0])} ${f(b[1])} M ${f(a[0])} ${f(a[1])} L ${f(b[0])} ${f(b[1])} ${tick(a)} ${tick(b)}" stroke="#7dd3fc" stroke-width="1.5" opacity="0.55" fill="none"/>`;
}

function machinery() {
  const sky = "#7dd3fc";
  const orange = "#fb923c";
  const parts = [];
  // big gear and its mate (pitch radii roughly meshing)
  const A = { x: 1430, y: 540, r: 250, n: 26 };
  const B = { x: A.x + 250 + 150 - 22, y: 0, r: 150, n: 16 };
  B.y = A.y - 250;
  B.x = A.x + Math.sqrt((A.r + B.r - 22) ** 2 - 250 ** 2);
  parts.push(`<circle cx="${A.x}" cy="${A.y}" r="420" fill="url(#halo)"/>`);
  parts.push(gear(A.x, A.y, A.r, A.n, 26, 0.05, sky, 6));
  parts.push(gear(B.x, B.y, B.r, B.n, 24, 0.31, orange, 5));
  parts.push(dim(A.x - A.r, A.y + A.r + 40, A.x + A.r, A.y + A.r + 40, 0));

  // centrifugal pump (volute) on the left of the gears
  const P = { x: 860, y: 640 };
  parts.push(`<g fill="none" stroke="${sky}" stroke-width="3" stroke-linejoin="round">
    <path d="M ${P.x} ${P.y - 150} C ${P.x + 110} ${P.y - 150} ${P.x + 160} ${P.y - 60} ${P.x + 160} ${P.y + 10} C ${P.x + 160} ${P.y + 110} ${P.x + 80} ${P.y + 170} ${P.x - 10} ${P.y + 170} C ${P.x - 110} ${P.y + 170} ${P.x - 170} ${P.y + 90} ${P.x - 170} ${P.y} C ${P.x - 170} ${P.y - 80} ${P.x - 120} ${P.y - 130} ${P.x - 60} ${P.y - 146} L ${P.x - 60} ${P.y - 250} L ${P.x + 40} ${P.y - 250} L ${P.x + 40} ${P.y - 150}" fill="rgba(56,189,248,0.06)"/>
    <rect x="${P.x - 80}" y="${P.y - 272}" width="140" height="22" rx="4"/>
    <circle cx="${P.x - 5}" cy="${P.y + 8}" r="86" stroke-dasharray="8 6" opacity="0.7"/>
    <circle cx="${P.x - 5}" cy="${P.y + 8}" r="26"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i * Math.PI) / 3;
      return `<path d="M ${f(P.x - 5 + 28 * Math.cos(a))} ${f(P.y + 8 + 28 * Math.sin(a))} Q ${f(P.x - 5 + 70 * Math.cos(a + 0.35))} ${f(P.y + 8 + 70 * Math.sin(a + 0.35))} ${f(P.x - 5 + 84 * Math.cos(a + 0.75))} ${f(P.y + 8 + 84 * Math.sin(a + 0.75))}"/>`;
    }).join("")}
    <path d="M ${P.x - 150} ${P.y + 170} L ${P.x + 150} ${P.y + 170} L ${P.x + 170} ${P.y + 215} L ${P.x - 170} ${P.y + 215} Z"/>
  </g>`);
  // shaft from the pump to the big gear, with two bearings
  parts.push(`<g fill="none" stroke="${sky}" stroke-width="3">
    <path d="M ${P.x + 160} ${P.y + 2} L ${A.x - 70} ${P.y + 2} M ${P.x + 160} ${P.y + 22} L ${A.x - 70} ${P.y + 22}" opacity="0.8"/>
    ${[1040, 1150].map((x) => `<rect x="${x}" y="${P.y - 34}" width="46" height="92" rx="6" fill="rgba(56,189,248,0.08)"/><path d="M ${x + 8} ${P.y + 66} L ${x + 38} ${P.y + 66} L ${x + 50} ${P.y + 96} L ${x - 4} ${P.y + 96} Z"/>`).join("")}
  </g>`);
  parts.push(dim(P.x - 170, P.y + 250, P.x + 170, P.y + 250, 0));

  // routing path: operations as nodes along a dashed orange line
  const nodes = [[560, 975], [760, 935], [980, 975], [1200, 930], [1420, 975], [1640, 935], [1840, 975]];
  parts.push(`<path d="M ${nodes.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="${orange}" stroke-width="3" stroke-dasharray="10 8" opacity="0.85"/>`);
  nodes.forEach((p, i) => {
    parts.push(`<circle cx="${p[0]}" cy="${p[1]}" r="${i === 4 ? 15 : 11}" fill="${i <= 4 ? orange : "#0b2152"}" stroke="${orange}" stroke-width="3"/>`);
    if (i === 4) parts.push(`<circle cx="${p[0]}" cy="${p[1]}" r="28" fill="none" stroke="${orange}" stroke-width="2" opacity="0.5"/>`);
  });

  // title-block corner (blueprint frame), bottom right
  parts.push(`<g fill="none" stroke="${sky}" stroke-width="2" opacity="0.4">
    <rect x="36" y="36" width="${W - 72}" height="${H - 72}"/>
    <path d="M ${W - 420} ${H - 36} L ${W - 420} ${H - 130} L ${W - 36} ${H - 130} M ${W - 420} ${H - 83} L ${W - 36} ${H - 83} M ${W - 230} ${H - 130} L ${W - 230} ${H - 36}"/>
  </g>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#081a40"/><stop offset="0.6" stop-color="#0d2a62"/><stop offset="1" stop-color="#0a2153"/></linearGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#38bdf8" stop-opacity="0.22"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></radialGradient>
    <pattern id="minor" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#7dd3fc" stroke-width="0.6" opacity="0.10"/></pattern>
    <pattern id="major" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M 120 0 L 0 0 0 120" fill="none" stroke="#7dd3fc" stroke-width="1" opacity="0.18"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#minor)"/>
  <rect width="${W}" height="${H}" fill="url(#major)"/>
  ${parts.join("\n  ")}
</svg>`;
}

(async () => {
  for (const [name, svg] of [["industry-oil-gas", oilGas()], ["industry-machinery", machinery()]]) {
    const file = path.join(OUT, `${name}.webp`);
    await sharp(Buffer.from(svg)).resize(W, H).webp({ quality: 80 }).toFile(file);
    console.log(file, fs.statSync(file).size, "bytes");
  }
})();
