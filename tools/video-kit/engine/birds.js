/* The two Synax birds, drawn as rigged SVG puppets and posed as a pure function of time.
   Pip (P): curious explorer, sky blue with an orange crest. Sage (S): calm guide, navy with round glasses.
   API (all times absolute, seconds; positions in stage pixels, y = where the feet are):
     b.place(t, x, y, s, f)                    instant position (f = 1 faces right, -1 faces left)
     b.move(t0, t1, x, y, s, f, mode, arc)     travel; mode "fly" | "walk" | "glide"
     b.hover(t0, t1)                           flap in place (while airborne)
     b.face(t, f)                              turn around
     b.gest(t0, t1, type)                      point | raise | wave | shrug | facepalm | flapjoy | shake | tap | hold
     b.emo(t0, t1, type)                       curious | surprised | happy | tired | smug
     b.look(t, target)                         {x, y} | "other" (default) | "front"
     b.say(lineId, absStart)                   beak and head follow that line's word timings
   window.Birds = { make(host, who), all } */
(() => {
  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const sm = (u) => {
    u = cl(u);
    return u * u * u * (u * (u * 6 - 15) + 10);
  };
  const lerp = (a, b, u) => a + (b - a) * u;
  const hs = (k, s = 1) => {
    const x = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const STYLE = {
    P: { main: "#4f9cf5", dark: "#2f6fd0", belly: "#eaf4ff", wing: "#3b82f6", wingD: "#2563eb", beak: "#fb923c", beakD: "#e2701f", feet: "#f59e0b", crest: "#fb923c", cheek: "#fdba74", glasses: false, k: 0.92, phase: 0.3 },
    S: { main: "#1e3a6e", dark: "#13284f", belly: "#dbe6f7", wing: "#2a4d8c", wingD: "#183061", beak: "#f59e0b", beakD: "#d97706", feet: "#f59e0b", crest: "#2a4d8c", cheek: "#7f9fd3", glasses: true, k: 1.0, phase: 1.7 },
  };
  const WING = "M0,0 C30,4 44,58 22,108 C12,112 4,104 0,96 C-12,72 -22,40 -16,16 C-12,6 -6,0 0,0 Z";
  const WING_LINES = "M2,40 C8,62 10,80 6,98 M-6,30 C-6,52 -4,72 -2,90";

  function svgFor(id, st) {
    const crest = st.glasses
      ? `<path d="M2,-270 C-10,-300 18,-312 30,-296 C20,-298 14,-290 20,-276 Z" fill="${st.crest}"/>`
      : `<g fill="${st.crest}"><path d="M8,-268 C-4,-300 6,-318 16,-322 C18,-304 20,-286 18,-268 Z"/><path d="M18,-270 C22,-300 40,-312 52,-310 C44,-296 36,-282 28,-266 Z"/><path d="M-2,-262 C-22,-284 -20,-300 -12,-306 C-6,-292 2,-278 8,-264 Z"/></g>`;
    const glasses = st.glasses
      ? `<g fill="rgba(255,255,255,.10)" stroke="#d6e4fa" stroke-width="4.5"><circle cx="40" cy="-222" r="25"/><circle cx="80" cy="-218" r="20"/><path d="M65,-221 L60,-221" /><path d="M15,-224 L-6,-230" fill="none"/></g>`
      : "";
    return `<svg viewBox="-200 -360 400 400" xmlns="http://www.w3.org/2000/svg">
 <ellipse id="${id}_sh" cx="0" cy="0" rx="76" ry="12" fill="rgba(15,35,71,.16)"/>
 <g id="${id}_air">
  <g id="${id}_legs" stroke="${st.feet}" stroke-width="8" stroke-linecap="round" fill="none">
   <g id="${id}_l1"><path d="M-16,-46 L-18,-6"/><path d="M-34,-4 L-4,-4"/></g>
   <g id="${id}_l2"><path d="M16,-46 L18,-6"/><path d="M4,-4 L34,-4"/></g>
  </g>
  <g id="${id}_body">
   <path d="M-62,-96 C-108,-104 -138,-80 -148,-56 C-124,-66 -106,-64 -92,-60 C-112,-46 -120,-30 -118,-14 C-96,-32 -78,-46 -54,-58 Z" fill="${st.dark}"/>
   <g id="${id}_wb"><path d="${WING}" fill="${st.wingD}"/></g>
   <ellipse cx="0" cy="-118" rx="80" ry="80" fill="${st.main}"/>
   <ellipse cx="16" cy="-98" rx="54" ry="56" fill="${st.belly}"/>
   <g id="${id}_head">
    <circle cx="16" cy="-214" r="60" fill="${st.main}"/>
    ${crest}
    <ellipse id="${id}_cheek" cx="60" cy="-188" rx="13" ry="8" fill="${st.cheek}" opacity=".55"/>
    <g id="${id}_e1"><circle r="19" fill="#fff"/><g id="${id}_p1"><circle r="9.5" fill="#0b1b3d"/><circle cx="-3" cy="-3.5" r="3.6" fill="#fff"/></g></g>
    <g id="${id}_e2"><circle r="14.5" fill="#fff"/><g id="${id}_p2"><circle r="7.5" fill="#0b1b3d"/><circle cx="-2.5" cy="-3" r="2.8" fill="#fff"/></g></g>
    <path id="${id}_b1" d="M-13,0 Q0,-6 13,0" stroke="${st.dark}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path id="${id}_b2" d="M-9,0 Q0,-5 9,0" stroke="${st.dark}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    ${glasses}
    <g id="${id}_lo"><path d="M88,-192 Q112,-191 122,-188 Q106,-176 90,-180 Z" fill="${st.beakD}"/></g>
    <path d="M84,-210 Q122,-204 134,-190 Q112,-186 86,-190 Z" fill="${st.beak}"/>
   </g>
   <g id="${id}_wf"><path d="${WING}" fill="${st.wing}"/><path d="${WING_LINES}" stroke="${st.dark}" stroke-width="3" stroke-linecap="round" fill="none" opacity=".35"/></g>
  </g>
 </g>
</svg>`;
  }

  const EMO = {
    neutral: { eye: 1, squint: 1, tilt: 0, brow: 0, browR: 0, cheek: 0.55, open: 0 },
    curious: { eye: 1.06, squint: 1, tilt: 9, brow: -7, browR: -10, cheek: 0.55, open: 0 },
    surprised: { eye: 1.2, squint: 1.05, tilt: -3, brow: -11, browR: -4, cheek: 0.6, open: 0.35 },
    happy: { eye: 1, squint: 0.72, tilt: 4, brow: -4, browR: 0, cheek: 0.9, open: 0.1 },
    tired: { eye: 1, squint: 0.42, tilt: -8, brow: 3, browR: 12, cheek: 0.4, open: 0 },
    smug: { eye: 1, squint: 0.62, tilt: -5, brow: -2, browR: -8, cheek: 0.6, open: 0 },
  };

  class Bird {
    constructor(host, who) {
      this.who = who;
      this.st = STYLE[who];
      this.id = "bd" + who;
      this.el = document.createElement("div");
      this.el.className = "bird";
      this.el.innerHTML = svgFor(this.id, this.st);
      host.appendChild(this.el);
      const g = (n) => document.getElementById(this.id + "_" + n);
      this.n = { sh: g("sh"), air: g("air"), l1: g("l1"), l2: g("l2"), legs: g("legs"), body: g("body"), wb: g("wb"), wf: g("wf"), head: g("head"), e1: g("e1"), e2: g("e2"), p1: g("p1"), p2: g("p2"), b1: g("b1"), b2: g("b2"), lo: g("lo"), cheek: g("cheek") };
      this.wps = [];
      this.faces = [];
      this.hovers = [];
      this.gests = [];
      this.emos = [];
      this.looks = [];
      this.words = [];
      this.other = null;
    }
    place(t, x, y, s = 1, f = 1) {
      this.wps.push({ start: t, t, x, y, s, f, mode: "place" });
      return this;
    }
    move(t0, t1, x, y, s, f, mode = "fly", arc) {
      this.wps.push({ start: t0, t: t1, x, y, s, f, mode, arc });
      return this;
    }
    hover(t0, t1) {
      this.hovers.push([t0, t1]);
      return this;
    }
    face(t, f) {
      this.faces.push([t, f]);
      return this;
    }
    gest(t0, t1, type) {
      this.gests.push([t0, t1, type]);
      return this;
    }
    emo(t0, t1, type) {
      this.emos.push([t0, t1, type]);
      return this;
    }
    look(t, target) {
      this.looks.push([t, target]);
      return this;
    }
    say(words, start) {
      for (const w of words) this.words.push([start + w.t, Math.max(0.12, w.d), w.w]);
      return this;
    }
    finalize() {
      this.wps.sort((a, b) => a.start - b.start);
      this.faces.sort((a, b) => a[0] - b[0]);
      this.looks.sort((a, b) => a[0] - b[0]);
      this.words.sort((a, b) => a[0] - b[0]);
    }
    // position, scale, facing and current mode at time t
    pose(t) {
      let cur = null;
      let res = null;
      for (const w of this.wps) {
        if (!cur) {
          cur = { x: w.x, y: w.y, s: w.s, f: w.f, ft: w.t };
          if (t < w.t) break;
          continue;
        }
        if (t >= w.t) {
          cur = { x: w.x, y: w.y, s: w.s, f: w.f, ft: w.t, arrived: w.mode, at: w.t };
          continue;
        }
        if (t >= w.start) {
          const u = (t - w.start) / Math.max(0.01, w.t - w.start);
          const e = w.mode === "walk" ? u : sm(u);
          const arc = w.arc != null ? w.arc : w.mode === "fly" ? 120 : 0;
          const dx = w.x - cur.x;
          res = {
            x: lerp(cur.x, w.x, e),
            y: lerp(cur.y, w.y, e) - arc * Math.sin(Math.PI * e),
            s: lerp(cur.s, w.s, e),
            f: Math.abs(dx) > 4 ? Math.sign(dx) : w.f,
            mode: w.mode,
            u,
            dist: Math.hypot(dx, w.y - cur.y),
            from: cur,
          };
        }
        break;
      }
      if (!res) res = { x: cur.x, y: cur.y, s: cur.s, f: cur.f, mode: "stand", landed: cur.arrived === "fly" || cur.arrived === "glide" ? t - cur.at : 99 };
      // explicit turns (latest one after the last arrival)
      let ff = res.f;
      let flipT = -99;
      if (res.mode === "stand") {
        for (const [ft, f] of this.faces) if (ft <= t && ft >= (cur.ft ?? -99)) (ff = f), (flipT = ft);
      }
      res.f = ff;
      res.flip = t - flipT;
      return res;
    }
    weight(list, t, ramp = 0.3) {
      let best = null;
      let w = 0;
      for (const [a, b, type] of list) {
        const k = Math.min(sm((t - a) / ramp), sm((b - t) / ramp));
        if (k > w) (w = k), (best = type);
      }
      return [best, w];
    }
    target(t) {
      let tg = "other";
      for (const [lt, target] of this.looks) if (lt <= t) tg = target;
      return tg;
    }
    mouth(t) {
      let o = 0;
      for (const [wt, wd, w] of this.words) {
        if (wt > t) break;
        if (t < wt + wd) {
          const u = (t - wt) / wd;
          o = Math.max(o, Math.pow(Math.sin(Math.PI * u), 0.7) * (0.7 + 0.3 * hs(wt * 10, 3)));
        }
      }
      return o;
    }
    talking(t) {
      for (const [wt, wd] of this.words) if (wt - 0.15 <= t && t <= wt + wd + 0.25) return true;
      return false;
    }
    apply(t, vis = 1) {
      const n = this.n;
      const st = this.st;
      const p = this.pose(t);
      this.cur = p;
      this.el.style.opacity = vis;
      this.el.style.display = vis <= 0.001 ? "none" : "block";
      if (vis <= 0.001) return;
      const k = st.k * p.s;
      // turning: squash scaleX through zero
      let fx = p.f;
      if (p.flip < 0.22) fx = p.f * lerp(-1, 1, sm(p.flip / 0.22));
      const hovering = this.hovers.some(([a, b]) => t >= a && t <= b);
      const flying = p.mode === "fly" || p.mode === "glide" || hovering;
      const walking = p.mode === "walk";
      let lift = 0;
      let lean = 0;
      let squash = 1;
      const breath = Math.sin((t / 2.6) * Math.PI * 2 + st.phase);
      let wf = 16 + 3 * breath;
      let wb = 8 + 2 * breath;
      let l1 = 0;
      let l2 = 0;
      if (flying) {
        const fq = hovering && p.mode === "stand" ? 5.2 : 6.4;
        const ph = Math.sin(t * fq * Math.PI * 2);
        wf = -48 + 66 * ph;
        wb = -38 + 62 * Math.sin(t * fq * Math.PI * 2 + 0.5);
        lean = p.mode === "stand" ? 4 : 13;
        if (hovering && p.mode === "stand") lift = 6 * Math.sin(t * 2.6 * Math.PI * 2);
      } else if (walking) {
        const steps = p.u * Math.max(1, p.dist / 34);
        lift = -15 * Math.abs(Math.sin(Math.PI * steps));
        l1 = 16 * Math.sin(Math.PI * steps);
        l2 = -l1;
        lean = 6;
      } else if (p.landed < 0.35) {
        squash = 1 - 0.1 * Math.sin((p.landed / 0.35) * Math.PI);
      }
      // gestures
      const [g, gw] = this.weight(this.gests, t, 0.28);
      let headShake = 0;
      if (g && gw > 0) {
        let gf = wf;
        let gb = wb;
        let gl = lean;
        if (g === "point") (gf = -100 + 4 * Math.sin(t * 3)), (gl = 6);
        else if (g === "raise") gf = -150;
        else if (g === "wave") gf = -84 + 22 * Math.sin(t * 2.4 * Math.PI * 2);
        else if (g === "shrug") (gf = -62), (gb = -74), (gl = -4);
        else if (g === "facepalm") (gf = -168), (gl = -6);
        else if (g === "hold") gf = -64;
        else if (g === "tap") (gf = -96 + 14 * Math.sin(t * 3 * Math.PI * 2)), (gl = 10);
        else if (g === "flapjoy") (gf = -70 + 46 * Math.sin(t * 3.4 * Math.PI * 2)), (gb = -60 + 44 * Math.sin(t * 3.4 * Math.PI * 2 + 0.6)), (lift += -10 * Math.abs(Math.sin(t * 3.4 * Math.PI))) ;
        else if (g === "shake") headShake = 9 * Math.sin(t * 3.2 * Math.PI * 2);
        if (!flying) {
          wf = lerp(wf, gf, gw);
          wb = lerp(wb, gb, gw);
          lean = lerp(lean, gl, gw);
        }
        headShake *= gw;
      }
      // emotion (blend from neutral)
      const [e, ew] = this.weight(this.emos, t, 0.25);
      const E0 = EMO.neutral;
      const E1 = EMO[e] || E0;
      const E = {};
      for (const key in E0) E[key] = lerp(E0[key], E1[key], ew);
      // talking
      const m = this.mouth(t);
      const talk = this.talking(t);
      const bob = talk ? 2.2 * Math.sin(t * 9.5) : 0;
      // blink
      const bi = Math.floor((t + st.phase * 3) / 3.4);
      const bt = (t + st.phase * 3) - bi * 3.4 - (0.6 + 2.2 * hs(bi, this.who === "P" ? 1 : 2));
      const blink = bt > 0 && bt < 0.16 ? 1 - Math.sin((bt / 0.16) * Math.PI) * 0.92 : 1;
      // gaze
      const tg = this.target(t);
      let lx = 0;
      let ly = 0;
      let headTurn = 0;
      if (tg === "front") (lx = 1), (ly = 2);
      else {
        let tx;
        let ty;
        if (tg === "other" && this.other && this.other.cur) {
          tx = this.other.cur.x;
          ty = this.other.cur.y - 200 * this.other.st.k * this.other.cur.s;
        } else if (tg && tg.x != null) (tx = tg.x), (ty = tg.y);
        if (tx != null) {
          const ex = p.x + fx * k * 40;
          const ey = p.y - k * 222;
          const dx = (tx - ex) * Math.sign(fx || 1);
          const dy = ty - ey;
          const d = Math.hypot(dx, dy) || 1;
          const r = Math.min(1, d / 160);
          lx = (dx / d) * 7.5 * r;
          ly = (dy / d) * 6.5 * r;
          headTurn = cl(dy / 40, -7, 9) * (dx > 0 ? 1 : -1);
        }
      }
      // write transforms
      this.el.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) scale(${(fx * k).toFixed(4)},${(k * squash).toFixed(4)})`;
      n.sh.setAttribute("opacity", flying ? 0 : 1);
      n.air.setAttribute("transform", `translate(0,${(lift + (flying && p.mode !== "stand" ? -10 : 0)).toFixed(1)})`);
      n.legs.setAttribute("transform", flying ? "translate(0,-26) scale(1,.45)" : "");
      n.l1.setAttribute("transform", `rotate(${l1.toFixed(1)},-16,-46)`);
      n.l2.setAttribute("transform", `rotate(${l2.toFixed(1)},16,-46)`);
      n.body.setAttribute("transform", `translate(0,${(1.6 * breath).toFixed(1)}) rotate(${lean.toFixed(1)},0,-60)`);
      n.wf.setAttribute("transform", `translate(-6,-150) rotate(${wf.toFixed(1)})`);
      n.wb.setAttribute("transform", `translate(18,-154) rotate(${wb.toFixed(1)})`);
      const tilt = E.tilt + headTurn + headShake + bob + (this.who === "P" ? 1.5 * Math.sin(t * 0.9) : 0.8 * Math.sin(t * 0.7 + 1));
      n.head.setAttribute("transform", `rotate(${tilt.toFixed(2)},16,-176)`);
      const es = E.eye;
      const sy = Math.max(0.06, E.squint * blink);
      n.e1.setAttribute("transform", `translate(40,-222) scale(${es},${(es * sy).toFixed(3)})`);
      n.e2.setAttribute("transform", `translate(80,-218) scale(${es},${(es * sy).toFixed(3)})`);
      n.p1.setAttribute("transform", `translate(${lx.toFixed(2)},${ly.toFixed(2)})`);
      n.p2.setAttribute("transform", `translate(${(lx * 0.8).toFixed(2)},${(ly * 0.8).toFixed(2)})`);
      n.b1.setAttribute("transform", `translate(40,${(-252 + E.brow).toFixed(1)}) rotate(${E.browR.toFixed(1)})`);
      n.b2.setAttribute("transform", `translate(80,${(-243 + E.brow * 0.8).toFixed(1)}) rotate(${(-E.browR * 0.6).toFixed(1)})`);
      n.lo.setAttribute("transform", `rotate(${(Math.max(m, E.open) * 24).toFixed(1)},90,-190)`);
      n.cheek.setAttribute("opacity", E.cheek.toFixed(2));
    }
  }
  window.Birds = {
    all: [],
    make(host, who) {
      const b = new Bird(host, who);
      this.all.push(b);
      return b;
    },
  };
})();
