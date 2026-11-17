/* Synax ERP overview: two birds explore the platform. Every frame is a pure function of time: window.__apply(t).
   Timeline: lines.json (who says what) + words.json (word timings) -> each line's start; every visual cue is anchored to a
   spoken word with W(line, word). Module and menu names follow the portal's sidebar (route JSON, 17 Nov 2026).
   All people, companies, numbers and documents are fictional sample data. */
(() => {
  try {
    /* ---------- helpers ---------- */
    const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const pr = (t, a, b) => cl((t - a) / (b - a));
    const sm = (u) => {
      u = cl(u);
      return u * u * u * (u * (u * 6 - 15) + 10);
    };
    const back = (u) => {
      u = cl(u);
      return 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2);
    };
    const lerp = (a, b, u) => a + (b - a) * u;
    const $ = (id) => document.getElementById(id);
    const I = (n) => `<svg class="i" viewBox="0 0 24 24">${ICONS[n] || ""}</svg>`;
    const mk = (parent, html) => {
      const d = document.createElement("div");
      d.innerHTML = html.trim();
      const el = d.firstElementChild;
      parent.appendChild(el);
      return el;
    };
    const av = (ini, color, size = 44) => `<div class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.36)}px;background:${color}">${ini}</div>`;
    const tick = (on = true, o = "") => `<div class="tick ${on ? o : "off"}">${I("Check")}</div>`;
    const hsx = (k, s) => {
      const x = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const eur = (n) => "€ " + Math.round(n).toLocaleString("en-US");

    // appear / disappear with a little overshoot; returns visibility 0..1
    function show(el, t, tin, tout, o = {}) {
      const d = o.d ?? 0.5;
      const u = tin == null ? 1 : pr(t, tin, tin + d);
      const v = tout == null ? 1 : 1 - pr(t, tout, tout + (o.od ?? 0.4));
      const a = Math.min(sm(u), sm(v));
      if (a <= 0.001) {
        el.style.visibility = "hidden";
        el.style.opacity = 0;
        return 0;
      }
      const b = back(u);
      const dy = o.dy ?? 24;
      const dx = o.dx ?? 0;
      const sc = o.sc ?? 0.94;
      el.style.visibility = "visible";
      el.style.opacity = a.toFixed(3);
      el.style.transform = `translate(${((1 - b) * dx).toFixed(1)}px,${((1 - b) * dy - (1 - sm(v)) * 14).toFixed(1)}px) scale(${lerp(sc, 1, b).toFixed(4)})` + (o.extra || "");
      return a;
    }
    const cls = (el, c, on) => el.classList.toggle(c, !!on);
    function typed(el, full, t, t0, cps = 26, caret = true) {
      const n = Math.max(0, Math.min(full.length, Math.floor((t - t0) * cps)));
      const done = n >= full.length;
      el.innerHTML = full.slice(0, n) + (caret && t >= t0 && !done ? '<span class="caret"></span>' : "");
      return n;
    }

    /* ---------- timeline ---------- */
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const L = {};
    const SC = {};
    const LEAD = { hook: 1.9, reveal: 0.4, projects: 0.9, staffing: 0.9, hrms: 0.9, mfg: 1.5, fin: 0.9, ai: 1.2, close: 0.8 };
    const HOLD = { b1: 0.3, b3: 0.2, c2: 0.2, c4: 0.6, d2: 0.3, d4: 0.5, e2: 0.2, e4: 0.3, f2: 0.3, f4: 0.2, f6: 0.2, f8: 0.2, f10: 0.3, f14: 0.4, f16: 0.4, g2: 0.2, g6: 0.3, h2: 0.3, h4: 0.3, i2: 0.1 };
    let t = 0;
    let prev = null;
    for (const l of LINES) {
      if (l.scene) {
        SC[l.scene] = { t0: t };
        if (prev) SC[prev].t1 = t;
        prev = l.scene;
        t += LEAD[l.scene];
      }
      const w = WORDS[l.id];
      if (!w || !w.length) throw new Error("no words for " + l.id);
      const sp = w[w.length - 1].t + w[w.length - 1].d;
      L[l.id] = { ...l, start: t, end: t + sp, words: w };
      t += sp + (l.gap != null ? Math.min(l.gap, 0.45) : 0.13) + (HOLD[l.id] || 0);
    }
    const TOTAL = L.i4.end + 4.0;
    SC[prev].t1 = TOTAL;
    function W(id, word, nth = 0, off = 0) {
      const l = L[id];
      if (!l) throw new Error("no line " + id);
      const key = norm(word);
      let k = 0;
      for (const w of l.words) {
        if (norm(w.w) === key) {
          if (k === nth) return l.start + w.t + off;
          k++;
        }
      }
      throw new Error(`word "${word}"#${nth} not in ${id}: ${l.words.map((w) => w.w).join(" ")}`);
    }
    const S = (id, off = 0) => L[id].start + off;
    const E = (id, off = 0) => L[id].end + off;
    const SFX = [];
    const sfx = (time, name, g = 1) => SFX.push([+time.toFixed(3), name, g]);
    Object.values(SC).forEach((s, i) => i && sfx(s.t0 + 0.1, "swish", 0.5));

    /* ---------- stage ---------- */
    const scenesEl = $("scenes");
    const SCENES = [];
    function addScene(name, vis0, vis1, build) {
      const root = mk(scenesEl, `<div class="scene" id="sc_${name}"></div>`);
      const s = { name, root, vis0, vis1, apply: () => {} };
      build(root, s);
      SCENES.push(s);
      return s;
    }
    function title(root, tag, icon, h1, p, dark = false) {
      const el = mk(root, `<div class="stitle"><div class="tag">${I(icon)}${tag}</div><h1 ${dark ? 'style="color:#fff"' : ""}>${h1}</h1><p ${dark ? 'style="color:#bcd0f0"' : ""}>${p}</p></div>`);
      return (time, t0) => {
        show(el.children[0], time, t0, null, { dy: 14 });
        show(el.children[1], time, t0 + 0.15, null, { dy: 20 });
        show(el.children[2], time, t0 + 0.3, null, { dy: 14 });
      };
    }
    /* app window with the portal's sidebar. groups: [{k, l, ic, kids?: [{k, l, ic}]}] */
    function makeWin(root, header, groups, opt = {}) {
      const w = mk(root, `<div class="win"><div class="wtop"><img src="assets/synax-pro.webp" alt=""><div class="crumb"></div><div class="wsearch">${I("Search")}Search</div><div class="wav">AN</div></div><div class="side"><div class="sh">${header}</div></div><div class="main"></div></div>`);
      const side = w.querySelector(".side");
      const crumb = w.querySelector(".crumb");
      const items = {};
      for (const g of groups) {
        const gi = mk(side, `<div class="mi ${g.kids ? "grp" : ""} ${opt.cmp ? "cmp" : ""}">${I(g.ic)}<span>${g.l}</span>${g.kids ? `<span style="margin-left:auto;display:flex;color:#a7b6cf">${I("ChevronRight")}</span>` : ""}</div>`);
        if (opt.cmp) (gi.style.height = "34px"), (gi.style.fontSize = "16.5px");
        if (opt.small) gi.style.fontSize = "16.5px";
        items[g.k] = { el: gi, path: [header.replace(/^./, (c) => c) , g.l], grp: null };
        if (g.kids)
          for (const c of g.kids) {
            const ci = mk(side, `<div class="mi sub">${c.l}</div>`);
            ci.style.display = "none";
            items[c.k] = { el: ci, path: [g.l, c.l], grp: g.k };
          }
      }
      let last = null;
      const keys = [];
      return {
        el: w,
        main: w.querySelector(".main"),
        key(time, k) {
          keys.push([time, k]);
          sfx(time, "tick", 0.5);
        },
        apply(time) {
          let k = null;
          for (const [kt, kk] of keys) if (kt <= time) k = kk;
          if (k === last) return;
          last = k;
          const act = items[k];
          for (const [ik, it] of Object.entries(items)) {
            cls(it.el, "on", ik === k);
            if (it.grp) it.el.style.display = act && (act.grp === it.grp || k === it.grp) ? "flex" : "none";
            else cls(it.el, "gon", act && act.grp === ik);
          }
          if (act) crumb.innerHTML = act.path.map((p, i) => (i === act.path.length - 1 ? `<b>${p}</b>` : `${p}${I("ChevronRight")}`)).join("");
        },
      };
    }
    // a card inside a parent at x,y with size
    const card = (parent, x, y, w, h, inner, extra = "") => mk(parent, `<div class="cd ${extra}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${inner}</div>`);
    const head = (icon, text, small = "", icls = "") => `<div class="ch"><div class="ic ${icls}">${I(icon)}</div>${text}${small ? `<small>${small}</small>` : ""}</div>`;

    // camera (whole world): [t, scale, cx, cy]
    const CAM = [];
    const cam = (time, s, cx = 960, cy = 540) => CAM.push([time, s, cx, cy]);
    cam(0, 1.0);

    /* ---------- birds ---------- */
    const birdHost = $("birds");
    const SAGE = Birds.make(birdHost, "S");
    const PIP = Birds.make(birdHost, "P");
    SAGE.other = PIP;
    PIP.other = SAGE;
    for (const l of LINES) (l.who === "P" ? PIP : SAGE).say(L[l.id].words, L[l.id].start);
    const BASE = { sx: 200, px: 420, y: 1014, ss: 0.84, ps: 0.82 };
    const both = (time, target) => {
      SAGE.look(time, target);
      PIP.look(time, target);
    };
    // conversation default: when a line starts, both look at each other
    for (const l of LINES) both(S(l.id, -0.1), "other");
    // in the UI scenes Pip turns to Sage to ask, and back to the screen while Sage explains
    function convo(ids) {
      for (const id of ids) {
        if (L[id].who === "P") PIP.face(S(id, -0.25), -1);
        else PIP.face(S(id, 0.35), 1);
      }
    }

    /* =====================================================================================
       1. HOOK: a busy company, every team on its own island
       ===================================================================================== */
    const DEPTS = [
      { k: "proj", n: "Projects", ic: "FolderKanban", x: 150, y: 150, q: "Are we over budget?", at: () => W("a1", "Projects"), qa: () => W("a2", "own", 0) },
      { k: "hr", n: "HR", ic: "Users", x: 795, y: 104, q: "Who's on leave today?", at: () => W("a1", "people"), qa: () => W("a2", "sheet") },
      { k: "shop", n: "Shop floor", ic: "Factory", x: 1440, y: 150, q: "Is machine 4 running?", at: () => W("a1", "machines"), qa: () => W("a2", "sheet", 0, 0.35) },
      { k: "buy", n: "Purchase", ic: "Truck", x: 110, y: 520, q: "Where's the material?", at: () => 0.9, qa: () => W("a2", "own", 0, 0.35) },
      { k: "fin", n: "Finance", ic: "Wallet", x: 1480, y: 520, q: "Can we invoice yet?", at: () => W("a1", "finance"), qa: () => W("a2", "version") },
      { k: "mgmt", n: "Management", ic: "ChartColumn", x: 795, y: 446, q: "What's the real status?", at: () => 1.2, qa: () => W("a2", "truth") },
    ];
    const HUB = { x: 1060, y: 520 };
    addScene("hook", -1, W("b1", "platform", 0, 1.0), (root, s) => {
      const svg = mk(root, `<svg style="position:absolute;inset:0;width:1920px;height:1080px"></svg>`);
      const links = [["proj", "hr"], ["hr", "shop"], ["proj", "buy"], ["shop", "fin"], ["buy", "mgmt"], ["mgmt", "fin"], ["hr", "mgmt"]];
      const D = {};
      DEPTS.forEach((d) => (D[d.k] = d));
      const ctr = (d) => [d.x + 165, d.y + 98];
      const linkEls = links.map(([a, b]) => {
        const [x1, y1] = ctr(D[a]);
        const [x2, y2] = ctr(D[b]);
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${mx - 22}" y2="${my}" stroke="#c3d1e6" stroke-width="4" stroke-dasharray="10 12" stroke-linecap="round"/><line x1="${mx + 22}" y1="${my}" x2="${x2}" y2="${y2}" stroke="#c3d1e6" stroke-width="4" stroke-dasharray="10 12" stroke-linecap="round"/><g transform="translate(${mx},${my})"><circle r="17" fill="#fff" stroke="#fdba74" stroke-width="3"/><path d="M-6,-6 L6,6 M6,-6 L-6,6" stroke="#f97316" stroke-width="3.5" stroke-linecap="round"/></g>`;
        svg.appendChild(g);
        return g;
      });
      for (const d of DEPTS) {
        d.el = mk(root, `<div class="dept" style="left:${d.x}px;top:${d.y}px"><div class="dn"><div class="ic">${I(d.ic)}</div>${d.n}</div><div class="ln" style="width:86%"></div><div class="ln" style="width:64%"></div><div class="ln" style="width:74%"></div><div class="sheet">${I("FileSpreadsheet")}own sheet</div><div class="ph">${I("Phone")}</div></div>`);
        d.ph = d.el.querySelector(".ph");
        d.ping = mk(root, `<div class="ping" style="left:${d.x + 14}px;top:${d.y - 72}px">${I("CircleHelp")}${d.q}</div>`);
        sfx(d.at(), "pop", 0.5);
        sfx(d.qa(), "alert", 0.32);
      }
      const tCall = W("a3", "calling");
      sfx(tCall, "ring", 0.4);
      sfx(tCall + 0.5, "ring", 0.3);
      const tIn = W("b1", "picture");
      const tHub = W("b1", "platform", 0, 0.2);
      sfx(tIn + 0.2, "whoosh", 0.6);
      s.apply = (time) => {
        linkEls.forEach((g, i) => {
          const la = Math.max(D[links[i][0]].at(), D[links[i][1]].at()) + 0.35;
          const a = pr(time, la, la + 0.5) * (1 - pr(time, tIn, tIn + 0.5));
          g.style.opacity = a;
          const flash = time > tCall && time < tCall + 1.6 ? 0.5 + 0.5 * Math.sin((time - tCall) * 14) : 0;
          g.querySelector("circle").setAttribute("stroke-width", 3 + flash * 3);
        });
        DEPTS.forEach((d, i) => {
          const fly = sm(pr(time, tIn + i * 0.07, tHub + i * 0.05));
          const bob = 5 * Math.sin(time * 1.3 + i * 1.7);
          const a = show(d.el, time, d.at() - 0.1, null, { dy: 30 });
          if (a > 0) {
            const [cx, cy] = ctr(d);
            const tx = (HUB.x - cx) * fly;
            const ty = (HUB.y - cy) * fly;
            d.el.style.opacity = (a * (1 - pr(fly, 0.7, 1))).toFixed(3);
            d.el.style.transform += ` translate(${tx.toFixed(1)}px,${(ty + bob * (1 - fly)).toFixed(1)}px) scale(${lerp(1, 0.25, fly).toFixed(3)})`;
          }
          d.el.style.boxShadow = time > d.at() && time < d.at() + 1.2 ? "0 0 0 4px #93c5fd,0 20px 50px rgba(15,35,71,.12)" : "";
          show(d.ping, time, d.qa(), tIn - 0.2, { dy: 16, sc: 0.8 });
          const ring = time > tCall && time < tCall + 1.7 ? Math.sin((time - tCall) * 40) * 14 : 0;
          d.ph.style.transform = `rotate(${ring.toFixed(1)}deg)`;
          d.ph.style.opacity = time > tCall - 0.3 ? 1 : 0.35;
        });
      };
      // birds: Pip flies in, Sage walks in
      PIP.place(-1, 2150, 260, 0.95, -1).move(0.35, 1.9, 1110, 1012, 0.95, -1, "fly", 160);
      SAGE.place(-1, -240, 1012, 1.0, 1).move(1.0, 3.6, 830, 1012, 1.0, 1, "walk");
      sfx(0.35, "whoosh", 0.45);
      sfx(1.9, "chirp", 0.35);
      PIP.emo(1.9, E("a1"), "curious");
      DEPTS.forEach((d) => {
        if (d.at() > 1.5) PIP.look(d.at() - 0.15, { x: d.x + 165, y: d.y + 98 });
      });
      PIP.gest(W("a1", "busy", 0, -0.3), E("a1", 0.5), "raise");
      SAGE.gest(W("a2", "Not"), W("a2", "Every"), "shrug");
      SAGE.look(W("a2", "own"), { x: 300, y: 250 });
      SAGE.look(W("a2", "version"), { x: 1600, y: 600 });
      PIP.emo(S("a3"), E("a3", 0.4), "surprised");
      PIP.gest(W("a3", "calling", 0, -0.2), E("a3", 0.3), "flapjoy");
    });

    /* =====================================================================================
       2. REVEAL: one platform, every team in its own workspace
       ===================================================================================== */
    const MODS = [
      { n: "Projects", ic: "FolderKanban", w: () => W("b3", "Projects") },
      { n: "Staffing", ic: "Briefcase", w: () => W("b3", "staffing") },
      { n: "HRMS", ic: "Users", w: () => W("b3", "HR") },
      { n: "Manufacturing", ic: "Factory", w: () => W("b3", "manufacturing") },
      { n: "Quality", ic: "ShieldCheck", w: () => W("b3", "quality") },
      { n: "Finance", ic: "Wallet", w: () => W("b3", "finance") },
      { n: "Assets", ic: "Laptop", w: () => W("b3", "Each", 0, 0.0) },
      { n: "Access Control", ic: "KeyRound", w: () => W("b3", "Each", 0, 0.18) },
      { n: "Chat & Calendar", ic: "MessageSquare", w: () => W("b3", "Each", 0, 0.36) },
      { n: "Synax AI", ic: "Sparkles", w: () => W("b3", "Each", 0, 0.54) },
    ];
    function grid(root, cx, cy) {
      const svg = mk(root, `<svg style="position:absolute;inset:0;width:1920px;height:1080px"></svg>`);
      return MODS.map((m, i) => {
        const x = 960 + ((i % 5) - 2) * 335;
        const y = Math.floor(i / 5) ? 330 : 170;
        const el = mk(root, `<div class="mt" style="left:${x - 140}px;top:${y - 42}px;width:280px"><div class="ic">${I(m.ic)}</div>${m.n}</div>`);
        const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
        [["x1", cx], ["y1", cy], ["x2", x], ["y2", y + 42], ["stroke", "#93c5fd"], ["stroke-width", "4"], ["stroke-dasharray", "4 14"], ["stroke-linecap", "round"]].forEach(([k, v]) => ln.setAttribute(k, v));
        svg.appendChild(ln);
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("r", "7");
        dot.setAttribute("fill", "#f97316");
        svg.appendChild(dot);
        return { el, ln, dot, x, y: y + 42, m };
      });
    }
    function ring(root, cx, cy, rx, ry, a0, a1, tw = 280) {
      const svg = mk(root, `<svg style="position:absolute;inset:0;width:1920px;height:1080px"></svg>`);
      return MODS.map((m, i) => {
        const ang = ((a0 + ((a1 - a0) * i) / (MODS.length - (a1 - a0 >= 359 ? 0 : 1))) * Math.PI) / 180;
        const x = cx + rx * Math.cos(ang);
        const y = cy + ry * Math.sin(ang);
        const el = mk(root, `<div class="mt" style="left:${(x - tw / 2).toFixed(0)}px;top:${(y - 42).toFixed(0)}px;width:${tw}px"><div class="ic">${I(m.ic)}</div>${m.n}</div>`);
        const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
        ln.setAttribute("x1", cx);
        ln.setAttribute("y1", cy);
        ln.setAttribute("x2", x.toFixed(0));
        ln.setAttribute("y2", y.toFixed(0));
        ln.setAttribute("stroke", "#93c5fd");
        ln.setAttribute("stroke-width", "4");
        ln.setAttribute("stroke-dasharray", "4 14");
        ln.setAttribute("stroke-linecap", "round");
        svg.appendChild(ln);
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("r", "7");
        dot.setAttribute("fill", "#f97316");
        svg.appendChild(dot);
        return { el, ln, dot, x, y, m };
      });
    }
    addScene("reveal", SC.reveal.t0, SC.projects.t0 + 0.4, (root, s) => {
      const tl = mk(root, `<div class="bigtitle" style="top:52px">One platform. <b>Connected business.</b></div>`);
      const R = ring(root, HUB.x, HUB.y, 620, 334, -90, 270);
      const hub = mk(root, `<div class="hub" style="left:${HUB.x - 165}px;top:${HUB.y - 165}px"><img src="assets/synax-pro.webp" alt=""><span>ERP</span></div>`);
      const tHub = W("b1", "Meet", 0, -0.1);
      const tHubIn = Math.min(tHub, W("b1", "platform", 0, -0.3));
      const tTitle = W("b1", "ERP", 0, 0.2);
      const tShared = W("b3", "shared", 0, -0.1);
      sfx(tHub - 0.4, "sub", 0.7);
      sfx(tHub - 0.5, "sweep", 0.5);
      sfx(tHub + 0.05, "chime", 0.55);
      R.forEach((r) => sfx(r.m.w(), "pop", 0.4));
      sfx(tShared, "ping", 0.4);
      cam(SC.reveal.t0, 1.0);
      cam(tHub, 1.05, HUB.x, HUB.y);
      cam(W("b3", "Projects", 0, -0.3), 1.0);
      s.apply = (time) => {
        show(hub, time, tHubIn, null, { sc: 0.4, dy: 0, d: 0.7 });
        const lg = sm(pr(time, tHub, tHub + 0.45));
        hub.querySelector("img").style.opacity = lg;
        hub.querySelector("img").style.transform = `scale(${lerp(0.7, 1, back(pr(time, tHub, tHub + 0.6))).toFixed(3)})`;
        hub.querySelector("span").style.opacity = lg;
        show(tl, time, tTitle, null, { dy: 18 });
        R.forEach((r, i) => {
          const tin = r.m.w();
          show(r.el, time, tin, null, { sc: 0.6, dx: (HUB.x - r.x) * 0.5, dy: (HUB.y - r.y) * 0.5, d: 0.6 });
          cls(r.el, "lit", time > tin && time < tin + 1.2);
          const la = pr(time, tin, tin + 0.5);
          r.ln.style.opacity = la;
          r.ln.setAttribute("stroke-dashoffset", (-(time * 40) % 18).toFixed(1));
          const flow = pr(time, tShared, tShared + 0.6);
          const u = ((time * 0.45 + i * 0.13) % 1 + 1) % 1;
          r.dot.setAttribute("cx", lerp(HUB.x, r.x, u).toFixed(1));
          r.dot.setAttribute("cy", lerp(HUB.y, r.y, u).toFixed(1));
          r.dot.style.opacity = flow * la * Math.sin(Math.PI * u);
        });
      };
      // birds walk/fly to the lower left and watch the ring
      const t0 = SC.reveal.t0;
      SAGE.move(t0 + 0.1, t0 + 1.4, BASE.sx, BASE.y, BASE.ss, 1, "glide", 70);
      PIP.move(t0 + 0.3, t0 + 1.5, BASE.px, BASE.y, BASE.ps, 1, "fly", 90);
      sfx(t0 + 0.2, "whoosh", 0.35);
      both(t0 + 0.2, HUB);
      PIP.emo(tHub - 0.2, tHub + 2.2, "surprised");
      PIP.gest(tHub, tHub + 1.6, "flapjoy");
      PIP.face(S("b2", -0.2), -1);
      PIP.emo(S("b2"), E("b2"), "curious");
      SAGE.gest(W("b3", "Projects", 0, -0.2), W("b3", "Each"), "point");
      both(W("b3", "Projects", 0, 0.1), { x: 1060, y: 190 });
      both(W("b3", "manufacturing"), { x: 1650, y: 622 });
      both(W("b3", "finance"), { x: 1060, y: 850 });
      both(W("b3", "shared"), HUB);
      PIP.face(S("b3", 0.3), 1);
      PIP.face(S("b4", -0.25), -1);
      PIP.emo(S("b4"), E("b4", 0.3), "happy");
      PIP.gest(W("b4", "Show", 0, -0.1), E("b4", 0.4), "flapjoy");
    });

    /* =====================================================================================
       3. PROJECTS
       ===================================================================================== */
    addScene("projects", SC.projects.t0, SC.staffing.t0 + 0.3, (root, s) => {
      const T0 = SC.projects.t0;
      const tt = title(root, "Projects", "FolderKanban", "Is this project <b>making money?</b>", "Work Tracker, Cost Mapper, Billing and Project Analytics.");
      const win = makeWin(root, "Projects", [
        { k: "wt", l: "Work Tracker", ic: "Clock" },
        { k: "an", l: "Analytics", ic: "ChartColumn" },
        { k: "list", l: "List", ic: "ListChecks" },
        { k: "add", l: "Add", ic: "Plus" },
        { k: "id", l: "ID", ic: "ScanLine" },
        { k: "cm", l: "Cost Mapper", ic: "Calculator" },
        { k: "bill", l: "Billing", ic: "Receipt" },
        { k: "dcr", l: "Dev Cost Review", ic: "FileCheck" },
        { k: "leads", l: "Leads", ic: "Target" },
        { k: "meet", l: "Meetings", ic: "CalendarDays" },
      ]);
      const M = win.main;
      const hdr = card(M, 28, 22, 958, 128, `<div class="row" style="gap:18px"><div class="ch"><div class="ic n" style="width:62px;height:62px;font-size:30px;border-radius:16px">${I("FolderKanban")}</div></div><div><div class="row" style="font-size:26px;font-weight:800">Atlas Portal Revamp <span class="pill">PRJ-0142</span></div><div class="mut" style="font-size:19px;margin-top:6px">Client: Northwind Tech · Project manager: Ana Silva</div></div><div style="margin-left:auto;text-align:right"><span class="pill">In progress</span><div class="row" style="margin-top:12px;font-size:17px;font-weight:700;color:#6b80a3">Progress<div class="bar" style="width:160px"><i id="pj_prog" style="width:0"></i></div><b id="pj_pt" style="color:#0f2347">0%</b></div></div></div>`);
      const PEOPLE = [["AS", "Ana Silva", "#7c3aed", 38], ["LR", "Leo Rossi", "#0891b2", 36], ["MC", "Mia Chen", "#db2777", 32], ["TW", "Tom Weber", "#059669", 40]];
      const wt = card(M, 28, 172, 466, 336, head("Clock", "Work Tracker", "THIS WEEK") + PEOPLE.map((p, i) => `<div class="row" style="margin-top:${i ? 14 : 20}px;font-size:19px;font-weight:700">${av(p[0], p[2], 40)}<span style="width:130px">${p[1]}</span><div class="bar" style="flex:1"><i id="pj_h${i}" style="width:0"></i></div><b id="pj_hv${i}" style="width:52px;text-align:right">0 h</b></div>`).join("") + `<div class="row" style="margin-top:16px;justify-content:space-between;font-size:19px"><span class="mut">Logged hours</span><b id="pj_tot" style="font-size:24px">0 h</b></div>`);
      const COST = [["Team hours", 52600], ["Tools & licences", 8900], ["Infrastructure", 6500], ["Travel", 3400]];
      const cm = card(M, 520, 172, 466, 336, head("Calculator", "Cost Mapper", "PRJ-0142") + `<div style="margin-top:10px">${COST.map((c, i) => `<div class="kv" id="pj_c${i}"><span class="k">${c[0]}</span><span class="v">${eur(c[1])}</span></div>`).join("")}</div><div class="row" style="margin-top:8px;justify-content:space-between;height:52px;border-radius:14px;background:#eaf2ff;padding:0 16px"><b style="font-size:19px;color:#1d4ed8">Cost to date</b><b id="pj_ctot" class="big" style="font-size:28px">€ 0</b></div>`);
      const MS = [["M1 · Discovery", 24000, "Billed", ""], ["M2 · Build", 34000, "Billed", ""], ["M3 · Launch", 32000, "Ready to bill", "o"]];
      const bl = card(M, 28, 530, 466, 322, head("Receipt", "Billing", "MILESTONES") + `<div style="margin-top:8px">${MS.map((m, i) => `<div class="kv" id="pj_m${i}"><span class="k">${m[0]}</span><span class="row"><span class="v">${eur(m[1])}</span><span class="pill ${m[3]}">${m[2]}</span></span></div>`).join("")}</div>`);
      const dcr = mk(M, `<div class="chip" style="left:52px;top:772px">${I("FileCheck")}Dev Cost Review<span class="pill" style="margin-left:6px">Reviewed</span></div>`);
      const MON = [["Jul", 9, 0], ["Aug", 15, 24], ["Sep", 17, 0], ["Oct", 16, 34], ["Nov", 14, 0]];
      const an = card(M, 520, 530, 466, 322, head("ChartColumn", "Project Analytics") + `<div class="row" style="margin-top:14px;gap:10px">${[["Contract", "€ 90,000"], ["Cost", "€ 71,400"], ["Margin", "18%"]].map((k, i) => `<div id="pj_k${i}" style="flex:1;height:76px;border-radius:14px;background:#f5f8fd;padding:10px 14px"><div class="mut" style="font-size:15px">${k[0]}</div><div style="font-size:24px;font-weight:800;margin-top:2px">${k[1]}</div></div>`).join("")}</div><div style="position:absolute;left:24px;right:24px;bottom:40px;height:118px;display:flex;align-items:flex-end;gap:18px">${MON.map((m, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%"><div style="display:flex;gap:5px;align-items:flex-end;height:96px"><div id="pj_bc${i}" style="width:22px;border-radius:6px 6px 2px 2px;background:#93c5fd;height:0"></div><div id="pj_bb${i}" style="width:22px;border-radius:6px 6px 2px 2px;background:#fb923c;height:0"></div></div><div class="mut" style="font-size:14px;margin-top:4px">${m[0]}</div></div>`).join("")}</div><div class="sample">Sample data</div>`);
      const tCards = { wt: W("c2", "hours", 0, -0.2), cm: W("c2", "Cost", 0, -0.15), bl: W("c3", "billing", 0, -0.2), dcr: W("c4", "dev", 0, -0.1), an: W("c4", "analytics", 0, -0.2), whole: W("c4", "whole") };
      win.key(T0 + 0.6, "list");
      win.key(W("c1", "project"), "id");
      win.key(tCards.wt, "wt");
      win.key(tCards.cm, "cm");
      win.key(tCards.bl, "bill");
      win.key(tCards.dcr, "dcr");
      win.key(tCards.an, "an");
      [tCards.wt, tCards.cm, tCards.bl, tCards.an].forEach((x) => sfx(x, "pop", 0.45));
      sfx(tCards.dcr, "ping", 0.35);
      cam(SC.projects.t0, 1.0);
      cam(tCards.an, 1.0);
      cam(tCards.an + 1.0, 1.05, 1250, 700);
      cam(SC.staffing.t0 - 0.2, 1.0);
      s.apply = (time) => {
        tt(time, T0 + 0.1);
        show(win.el, time, T0 + 0.2, null, { dy: 40, sc: 0.97, d: 0.7 });
        win.apply(time);
        show(hdr, time, T0 + 0.7, null);
        const pp = sm(pr(time, T0 + 1.0, T0 + 2.2)) * 64;
        $("pj_prog").style.width = pp + "%";
        $("pj_pt").textContent = Math.round(pp) + "%";
        show(wt, time, tCards.wt, null);
        let tot = 0;
        PEOPLE.forEach((p, i) => {
          const u = sm(pr(time, tCards.wt + 0.3 + i * 0.25, tCards.wt + 1.4 + i * 0.25));
          $("pj_h" + i).style.width = (u * p[3] * 2.3).toFixed(1) + "%";
          $("pj_hv" + i).textContent = Math.round(u * p[3]) + " h";
          tot += Math.round(u * p[3]);
        });
        $("pj_tot").textContent = tot + " h";
        show(cm, time, tCards.cm, null);
        let ct = 0;
        COST.forEach((c, i) => {
          const a = show($("pj_c" + i), time, tCards.cm + 0.3 + i * 0.25, null, { dy: 8, sc: 1 });
          if (a > 0.5) ct += c[1] * sm(pr(time, tCards.cm + 0.3 + i * 0.25, tCards.cm + 0.9 + i * 0.25));
        });
        $("pj_ctot").textContent = eur(ct);
        show(bl, time, tCards.bl, null);
        MS.forEach((m, i) => show($("pj_m" + i), time, tCards.bl + 0.3 + i * 0.3, null, { dy: 8, sc: 1 }));
        show(dcr, time, tCards.dcr, null, { sc: 0.8 });
        show(an, time, tCards.an, null);
        MON.forEach((m, i) => {
          const u = sm(pr(time, tCards.an + 0.3 + i * 0.12, tCards.an + 1.0 + i * 0.12));
          $("pj_bc" + i).style.height = (m[1] * 5 * u).toFixed(1) + "px";
          $("pj_bb" + i).style.height = (m[2] * 2.6 * u).toFixed(1) + "px";
        });
        cls(an, "hot", time > tCards.whole - 0.3);
        $("pj_k2").style.boxShadow = time > tCards.whole ? "0 0 0 3px #fdba74" : "";
        cls(wt, "hot", time > tCards.wt && time < tCards.cm);
        cls(cm, "hot", time > tCards.cm && time < tCards.bl);
        cls(bl, "hot", time > tCards.bl && time < tCards.an);
      };
      convo(["c1", "c2", "c3", "c4"]);
      PIP.emo(S("c1"), E("c1"), "curious");
      SAGE.gest(W("c2", "Work", 0, -0.2), W("c2", "together"), "point");
      both(W("c2", "hours"), { x: 1100, y: 330 });
      both(W("c2", "Cost", 0, 0.1), { x: 1600, y: 330 });
      both(W("c3", "billing", 0, 0.3), { x: 1100, y: 700 });
      SAGE.gest(W("c4", "analytics", 0, -0.2), E("c4"), "point");
      both(W("c4", "Billing", 0, 0.3), { x: 1100, y: 700 });
      both(W("c4", "analytics"), { x: 1600, y: 760 });
      PIP.emo(W("c4", "whole"), E("c4", 0.9), "happy");
    });

    /* =====================================================================================
       4. STAFFING
       ===================================================================================== */
    addScene("staffing", SC.staffing.t0, SC.hrms.t0 + 0.3, (root, s) => {
      const T0 = SC.staffing.t0;
      const tt = title(root, "Staffing", "Briefcase", "Three developers <b>by Monday</b>", "From a client's requirement to the payment.");
      const MENU = [["dash", "Dashboard", "LayoutDashboard"], ["seq", "Master Sequence", "Workflow"], ["mast", "Masters", "Layers"], ["cust", "Customers", "Building2"], ["req", "Requirements", "ClipboardList"], ["sow", "SOW", "FileText"], ["cand", "Candidates", "Users"], ["int", "Interviews", "UserRoundSearch"], ["off", "Offers", "Send"], ["onb", "Onboarding", "UserPlus"], ["dep", "Deployments", "Network"], ["wl", "Work Logs", "Clock"], ["ts", "Timesheets", "CalendarDays"], ["inv", "Invoices", "Receipt"], ["pay", "Payments", "Wallet"], ["perf", "Performance & Risk", "Gauge"], ["rep", "Replacements", "Repeat"], ["appr", "Approvals", "BadgeCheck"], ["rpt", "Reports", "ChartColumn"], ["aud", "Audit Trail", "History"]];
      const win = makeWin(root, "Staffing", MENU.map(([k, l, ic]) => ({ k, l, ic })), { cmp: true });
      const M = win.main;
      const req = card(M, 28, 22, 470, 150, head("ClipboardList", "Requirement", "REQ-2207") + `<div style="font-size:27px;font-weight:800;margin-top:14px">Java Developer × 3</div><div class="mut" style="font-size:18px;margin-top:4px">Client: Northwind Tech · Start: Monday</div>`);
      const sow = card(M, 518, 22, 468, 150, head("FileText", "Statement of work", "SOW-104") + `<div class="row" style="margin-top:16px;gap:10px"><span class="pill">6 months</span><span class="pill">Rate card agreed</span><span class="pill g">Approved</span></div>`);
      const COLS = [["Candidates", "cand"], ["Interviews", "int"], ["Offers", "off"], ["Onboarding", "onb"], ["Deployed", "dep"]];
      const colEls = COLS.map((c, i) => mk(M, `<div class="cd flat" style="left:${28 + i * 194}px;top:196px;width:178px;height:318px;background:#f6f9fe;padding:16px"><div class="row" style="justify-content:space-between;font-size:16.5px;font-weight:800;gap:6px">${c[0]}<span class="pill" id="st_n${i}" style="padding:0 10px">0</span></div></div>`));
      const CAND = [["JB", "#7c3aed"], ["KL", "#0891b2"], ["RS", "#db2777"], ["DP", "#059669"], ["AM", "#4f46e5"], ["TN", "#ea580c"]];
      const reach = [4, 3, 4, 4, 0, 1]; // furthest column each candidate reaches (3 are deployed)
      const tok = CAND.map((c) => mk(M, `<div style="position:absolute;left:0;top:0">${av(c[0], c[1], 50)}</div>`));
      const tCol = [W("d2", "candidates", 0, -0.1), W("d2", "interviews", 0, -0.1), W("d2", "offers", 0, -0.1), W("d2", "onboarding", 0, -0.1), W("d2", "deployment", 0, -0.1)];
      const CH = [["wl", "Work Logs", "Clock", "Logged today", "24 h"], ["ts", "Timesheets", "CalendarDays", "Week 48", "Approved"], ["inv", "Invoices", "Receipt", "INV-S-311", "€ 18,600"], ["pay", "Payments", "Wallet", "Received", "Paid"]];
      const tCh = [W("d4", "Work"), W("d4", "timesheets"), W("d4", "invoices"), W("d4", "payments")];
      const chEls = CH.map((c, i) => card(M, 28 + i * 246, 538, 220, 200, `<div class="ch" style="font-size:20px"><div class="ic">${I(c[2])}</div>${c[1]}</div><div class="mut" style="font-size:17px;margin-top:22px">${c[3]}</div><div style="font-size:30px;font-weight:800;margin-top:4px">${c[4]}</div>`));
      const arrows = [0, 1, 2].map((i) => mk(M, `<div class="arrow" style="left:${28 + i * 246 + 222}px;top:620px">${I("ChevronRight")}</div>`));
      const FOOT = [["Performance & Risk", "Gauge", W("d4", "replacements", 0, -0.35)], ["Replacements", "Repeat", W("d4", "replacements")], ["Approvals", "BadgeCheck", W("d4", "audit", 0, -0.3)], ["Audit Trail", "History", W("d4", "audit")]];
      let fx = 28;
      const footEls = FOOT.map((f) => {
        const el = mk(M, `<div class="chip" style="left:${fx}px;top:768px">${I(f[1])}${f[0]}</div>`);
        fx += f[0].length * 10.5 + 92;
        return el;
      });
      win.key(T0 + 0.6, "dash");
      win.key(W("d1", "client"), "cust");
      win.key(W("d2", "requirement"), "req");
      win.key(W("d2", "statement"), "sow");
      COLS.forEach((c, i) => win.key(tCol[i], c[1]));
      CH.forEach((c, i) => win.key(tCh[i], c[0]));
      win.key(FOOT[0][2], "perf");
      win.key(FOOT[1][2], "rep");
      win.key(FOOT[3][2], "aud");
      sfx(W("d1", "Java"), "pop", 0.5);
      sfx(W("d2", "statement"), "pop", 0.4);
      tCol.forEach((x) => sfx(x + 0.15, "snap", 0.4));
      tCh.forEach((x) => sfx(x, "pop", 0.4));
      s.apply = (time) => {
        tt(time, T0 + 0.1);
        show(win.el, time, T0 + 0.2, null, { dy: 40, sc: 0.97, d: 0.7 });
        win.apply(time);
        show(req, time, W("d1", "Java", 0, -0.2), null);
        cls(req, "warm", time > W("d1", "Monday") && time < W("d2", "statement"));
        show(sow, time, W("d2", "statement", 0, -0.1), null);
        colEls.forEach((c, i) => show(c, time, W("d2", "Then", 0, -0.3) + i * 0.08, null, { dy: 12 }));
        const counts = [0, 0, 0, 0, 0];
        CAND.forEach((c, j) => {
          let col = -1;
          let from = -1;
          let u = 1;
          for (let k = 0; k <= reach[j]; k++)
            if (time >= tCol[k] + j * 0.05) {
              from = col;
              col = k;
              u = sm(pr(time, tCol[k] + j * 0.05, tCol[k] + j * 0.05 + 0.6));
            }
          const el = tok[j];
          if (col < 0) {
            el.style.opacity = 0;
            return;
          }
          const slot = (k) => {
            const order = CAND.map((_, jj) => jj).filter((jj) => reach[jj] >= k);
            const idx = order.indexOf(j);
            return [28 + k * 194 + 14 + (idx % 3) * 54, 196 + 62 + Math.floor(idx / 3) * 62];
          };
          const [x1, y1] = slot(col);
          const [x0, y0] = from >= 0 ? slot(from) : [x1, y1 + 30];
          el.style.opacity = (from >= 0 ? 1 : u) * (reach[j] < 4 && time > tCol[reach[j] + 1] + 0.3 ? 0.35 : 1);
          el.style.transform = `translate(${lerp(x0, x1, u).toFixed(1)}px,${(lerp(y0, y1, u) - Math.sin(Math.PI * u) * (from >= 0 ? 30 : 0)).toFixed(1)}px)`;
          for (let k = 0; k <= col; k++) if (k < col || u > 0.5) counts[k]++;
        });
        counts.forEach((n, i) => ($("st_n" + i).textContent = n));
        chEls.forEach((c, i) => {
          show(c, time, tCh[i], null);
          cls(c, "hot", time > tCh[i] && time < (tCh[i + 1] || tCh[i] + 1.5));
        });
        arrows.forEach((a, i) => show(a, time, tCh[i + 1] - 0.2, null, { sc: 0.5, dy: 0 }));
        footEls.forEach((f, i) => show(f, time, FOOT[i][2], null, { sc: 0.8 }));
      };
      convo(["d1", "d2", "d3", "d4"]);
      PIP.gest(W("d1", "client", 0, -0.2), E("d1", 0.2), "raise");
      PIP.emo(S("d1"), E("d1"), "surprised");
      SAGE.gest(W("d2", "requirement", 0, -0.2), W("d2", "Then"), "point");
      both(W("d2", "requirement"), { x: 1100, y: 230 });
      both(W("d2", "candidates"), { x: 1150, y: 450 });
      both(W("d2", "deployment"), { x: 1700, y: 450 });
      PIP.emo(S("d3"), E("d3", 0.2), "curious");
      SAGE.gest(W("d4", "Work", 0, -0.2), W("d4", "with"), "point");
      both(W("d4", "Work"), { x: 1000, y: 770 });
      both(W("d4", "payments"), { x: 1700, y: 770 });
      both(W("d4", "replacements"), { x: 1250, y: 925 });
    });

    /* =====================================================================================
       5. HRMS: Maya's journey
       ===================================================================================== */
    addScene("hrms", SC.hrms.t0, SC.mfg.t0 + 0.3, (root, s) => {
      const T0 = SC.hrms.t0;
      const tt = title(root, "HRMS", "Users", "From hello <b>to goodbye</b>", "One connected employee journey.");
      const win = makeWin(root, "HRMS", [
        { k: "portal", l: "Employee Portal", ic: "LayoutDashboard" },
        { k: "self", l: "Self Service", ic: "UserCheck", kids: [{ k: "att", l: "My Profile" }, { k: "hol", l: "Holiday Calendar" }, { k: "req", l: "My Requests" }, { k: "doc", l: "My Documents" }] },
        { k: "setup", l: "Setup", ic: "Settings" },
        { k: "emp", l: "Employees", ic: "Users" },
        { k: "rec", l: "Recruitment", ic: "UserRoundSearch", kids: [{ k: "jp", l: "Job Positions" }, { k: "mr", l: "Manpower Requests" }, { k: "int", l: "Interviews" }, { k: "ce", l: "Candidate Evaluations" }, { k: "om", l: "Offer Management" }, { k: "pjv", l: "Pre-Joining Verification" }] },
        { k: "ta", l: "Time & Attendance", ic: "Clock" },
        { k: "wm", l: "Work Management", ic: "ListChecks" },
        { k: "lv", l: "Leave & Absence", ic: "CalendarDays" },
        { k: "pc", l: "Performance & Compliance", ic: "Star" },
        { k: "ob", l: "Offboarding", ic: "DoorOpen", kids: [{ k: "obr", l: "Offboarding Requests" }, { k: "obc", l: "Offboarding Clearance" }, { k: "fnf", l: "Offboarding FNF" }, { k: "exit", l: "Exit Interview" }] },
      ], { small: true });
      const M = win.main;
      const STOPS = [["Request", "ClipboardList"], ["Interview", "UserRoundSearch"], ["Offer", "FileText"], ["Pre-joining", "ShieldCheck"], ["Portal", "LayoutDashboard"], ["Review", "Star"], ["Exit", "DoorOpen"]];
      const trk = card(M, 28, 22, 958, 156, `<div style="position:absolute;left:70px;right:70px;top:52px;height:8px;border-radius:4px;background:#e8eef8"><i id="hr_fill" style="display:block;height:100%;width:0;border-radius:4px;background:linear-gradient(90deg,#60a5fa,#2563eb)"></i></div>` + STOPS.map((st, i) => `<div id="hr_s${i}" style="position:absolute;left:${70 + (i * 818) / 6 - 40}px;top:20px;width:80px;display:flex;flex-direction:column;align-items:center"><div style="width:64px;height:64px;border-radius:50%;background:#fff;border:3px solid #dbe6f7;color:#93a3bf;display:flex;align-items:center;justify-content:center;font-size:28px">${I(st[1])}</div><div style="margin-top:10px;font-size:16.5px;font-weight:800;color:#6b80a3;white-space:nowrap">${st[0]}</div></div>`).join(""));
      const maya = mk(M, `<div style="position:absolute;left:0;top:0;z-index:5"><div style="position:relative">${av("MF", "#f97316", 52)}<div style="position:absolute;left:50%;top:-34px;transform:translateX(-50%);height:28px;padding:0 10px;border-radius:14px;background:#0f2347;color:#fff;font-size:14px;font-weight:800;line-height:28px;white-space:nowrap">Maya</div></div></div>`);
      const P = (inner) => mk(M, `<div style="position:absolute;left:28px;top:202px;width:958px;height:650px">${inner}</div>`);
      const panels = [
        P(`<div class="cd" style="left:0;top:0;width:466px;height:330px">${head("ClipboardList", "Manpower Request", "MR-0318")}<div style="margin-top:12px"><div class="kv"><span class="k">Department</span><span class="v">Engineering</span></div><div class="kv"><span class="k">Position</span><span class="v">Frontend Developer</span></div><div class="kv"><span class="k">Headcount</span><span class="v">1</span></div><div class="kv"><span class="k">Status</span><span class="pill">Approved</span></div></div></div><div class="cd" style="left:492px;top:0;width:466px;height:330px">${head("Briefcase", "Job Position")}<div style="font-size:28px;font-weight:800;margin-top:24px">Frontend Developer</div><div class="mut" style="font-size:19px;margin-top:6px">Berlin office · Full time</div><div class="row" style="margin-top:22px"><span class="pill">Open</span><span class="pill g">12 applicants</span></div></div>`),
        P(`<div class="cd" style="left:0;top:0;width:958px;height:330px">${head("UserRoundSearch", "Interviews · Maya Fischer")}<div class="row" style="margin-top:20px;gap:20px">${[["Technical round", "4.5 / 5"], ["HR round", "Cleared"], ["Candidate evaluation", "Recommended"]].map((r) => `<div style="flex:1;height:150px;border-radius:18px;background:#f5f8fd;padding:20px"><div class="mut" style="font-size:17px">${r[0]}</div><div class="row" style="margin-top:16px;font-size:26px;font-weight:800">${tick(true)}${r[1]}</div></div>`).join("")}</div></div>`),
        P(`<div class="cd" style="left:0;top:0;width:620px;height:360px">${head("FileText", "Offer Management", "OFR-0091")}<div style="margin-top:18px">${[92, 78, 86, 60].map((w) => `<div style="height:12px;border-radius:6px;background:#eef2f8;margin-top:14px;width:${w}%"></div>`).join("")}</div><div class="kv" style="margin-top:20px"><span class="k">Joining date</span><span class="v">2 Dec 2026</span></div><div class="stamp" id="hr_stamp" style="right:30px;top:120px">Accepted</div></div>`),
        P(`<div class="cd" style="left:0;top:0;width:620px;height:380px">${head("ShieldCheck", "Pre-Joining Verification")}${["ID proof verified", "Education documents", "NDA accepted digitally", "Joining checklist"].map((r, i) => `<div class="row" id="hr_pj${i}" style="margin-top:18px;height:52px;border-radius:14px;background:#f5f8fd;padding:0 16px;font-size:20px;font-weight:700"><span id="hr_pjt${i}">${tick(false)}</span>${r}</div>`).join("")}</div>`),
        P(`<div class="cd" style="left:0;top:0;width:958px;height:640px;padding:26px 28px">${head("LayoutDashboard", "Employee Portal · Maya Fischer")}<div style="position:relative;height:540px;margin-top:18px">${[["att", "My Attendance", "Clock", "Checked in", "09:02"], ["lv", "My Leaves", "CalendarDays", "Balance", "12 days"], ["hol", "Holiday Calendar", "CalendarCheck", "Next", "25 Dec"], ["doc", "My Documents", "FileText", "Files", "4"], ["bp", "Break Pass", "Coffee", "Today", "1 break"], ["req", "My Requests", "Inbox", "Open", "1"]].map((c, i) => `<div class="cd" id="hr_t${c[0]}" style="left:${(i % 3) * 306}px;top:${Math.floor(i / 3) * 262}px;width:286px;height:240px">${head(c[2], `<span style="font-size:19px">${c[1]}</span>`)}<div class="mut" style="font-size:17px;margin-top:38px">${c[3]}</div><div class="big" style="font-size:40px;margin-top:4px">${c[4]}</div></div>`).join("")}</div></div>`),
        P(`<div class="cd" style="left:0;top:0;width:620px;height:330px">${head("Star", "Performance Review", "H2 2026")}<div class="row" style="margin-top:26px;font-size:42px;color:#e2e8f0;gap:6px">${[0, 1, 2, 3, 4].map((i) => `<span id="hr_star${i}" style="display:flex">${I("Star")}</span>`).join("")}<b style="font-size:30px;color:#0f2347;margin-left:14px">4 / 5</b></div><div style="margin-top:24px;height:84px;border-radius:14px;background:#f5f8fd;padding:14px 18px;font-size:19px;font-weight:600;color:#3d5479;line-height:28px">“Strong delivery on the portal release. Next goal: lead the design review.”</div></div>`),
        P(`<div class="cd" style="left:0;top:0;width:466px;height:400px">${head("DoorOpen", "Offboarding Clearance")}${["IT assets returned", "Finance clearance", "Manager sign-off"].map((r, i) => `<div class="row" style="margin-top:18px;height:56px;border-radius:14px;background:#f5f8fd;padding:0 16px;font-size:20px;font-weight:700"><span id="hr_oc${i}">${tick(false)}</span>${r}</div>`).join("")}</div><div class="cd" id="hr_fnf" style="left:492px;top:0;width:466px;height:188px">${head("Wallet", "Full & Final Settlement")}<div class="row" style="margin-top:28px;font-size:24px;font-weight:800">Settled <span class="pill">FNF-0052</span></div></div><div class="cd" id="hr_exit" style="left:492px;top:212px;width:466px;height:188px">${head("ClipboardCheck", "Exit Interview")}<div class="row" style="margin-top:28px;font-size:24px;font-weight:800">Completed <span class="pill g">Feedback saved</span></div></div>`),
      ];
      const tStop = [W("e2", "manpower", 0, -0.1), W("e2", "interviewed", 0, -0.1), W("e2", "offer", 0, -0.1), W("e2", "prejoining", 0, -0.1), W("e4", "portal", 0, -0.2), W("e4", "performance", 0, -0.1), W("e4", "clearance", 0, -0.1)];
      const tEnd = SC.mfg.t0 + 1;
      tStop.forEach((x) => sfx(x, "pop", 0.4));
      win.key(T0 + 0.6, "portal");
      win.key(tStop[0], "mr");
      win.key(W("e2", "job", 0), "jp");
      win.key(tStop[1], "int");
      win.key(W("e2", "gets"), "ce");
      win.key(tStop[2], "om");
      win.key(tStop[3], "pjv");
      win.key(tStop[4], "portal");
      win.key(W("e4", "holiday"), "hol");
      win.key(W("e4", "documents"), "doc");
      win.key(tStop[5], "pc");
      win.key(tStop[6], "obc");
      win.key(W("e4", "settlement"), "fnf");
      win.key(W("e4", "exit"), "exit");
      const tTiles = { att: W("e4", "attendance"), lv: W("e4", "leave"), hol: W("e4", "holiday"), doc: W("e4", "documents"), bp: W("e4", "documents", 0, 0.25), req: W("e4", "documents", 0, 0.45) };
      Object.values(tTiles).forEach((x) => sfx(x, "tick", 0.5));
      s.apply = (time) => {
        tt(time, T0 + 0.1);
        show(win.el, time, T0 + 0.2, null, { dy: 40, sc: 0.97, d: 0.7 });
        win.apply(time);
        show(trk, time, T0 + 0.7, null);
        let k = -1;
        let u = 1;
        tStop.forEach((x, i) => {
          if (time >= x) (k = i), (u = sm(pr(time, x, x + 0.7)));
        });
        const sx = (i) => 28 + 70 + (i * 818) / 6;
        const mx = k < 0 ? sx(0) - 60 : lerp(k > 0 ? sx(k - 1) : sx(0) - 60, sx(k), u);
        maya.style.transform = `translate(${(mx - 26).toFixed(1)}px,${(22 + 20 + 6 - Math.abs(Math.sin(Math.PI * u)) * 18).toFixed(1)}px)`;
        maya.style.opacity = pr(time, T0 + 1.0, T0 + 1.4);
        $("hr_fill").style.width = (Math.max(0, mx - 28 - 70) / 818) * 100 + "%";
        STOPS.forEach((st, i) => {
          const el = $("hr_s" + i).children[0];
          const on = i <= k;
          el.style.borderColor = on ? "#2563eb" : "#dbe6f7";
          el.style.color = on ? "#fff" : "#93a3bf";
          el.style.background = on ? (i === k ? "#2563eb" : "#93c5fd") : "#fff";
        });
        panels.forEach((p, i) => show(p, time, tStop[i] + 0.15, i < 6 ? tStop[i + 1] - 0.05 : tEnd, { dy: 18, sc: 0.98 }));
        $("hr_stamp").style.opacity = sm(pr(time, tStop[2] + 0.8, tStop[2] + 1.0));
        $("hr_stamp").style.transform = `rotate(-8deg) scale(${lerp(1.6, 1, back(pr(time, tStop[2] + 0.8, tStop[2] + 1.2)))})`;
        [0, 1, 2, 3].forEach((i) => ($("hr_pjt" + i).innerHTML = tick(time > tStop[3] + 0.4 + i * 0.25)));
        Object.entries(tTiles).forEach(([kk, x]) => {
          const el = $("hr_t" + kk);
          show(el, time, x - 0.1, null, { dy: 14 });
          cls(el, "hot", time > x && time < x + 0.9);
        });
        [0, 1, 2, 3, 4].forEach((i) => {
          const on = time > tStop[5] + 0.4 + i * 0.12 && i < 4;
          const st = $("hr_star" + i);
          st.style.color = on ? "#f59e0b" : "#e2e8f0";
          st.firstChild.style.fill = on ? "#f59e0b" : "none";
        });
        const tC = [W("e4", "clearance"), W("e4", "clearance", 0, 0.3), W("e4", "final", 0, -0.1)];
        [0, 1, 2].forEach((i) => ($("hr_oc" + i).innerHTML = tick(time > tC[i] + 0.3)));
        show($("hr_fnf"), time, W("e4", "settlement", 0, -0.2), null, { dy: 12 });
        show($("hr_exit"), time, W("e4", "exit", 0, -0.2), null, { dy: 12 });
      };
      convo(["e1", "e2", "e3", "e4", "e5"]);
      PIP.emo(S("e1"), E("e1"), "curious");
      PIP.gest(W("e1", "chaos", 0, -0.3), E("e1", 0.3), "shrug");
      SAGE.gest(W("e2", "Follow", 0, -0.2), W("e2", "manpower", 0, 0.4), "point");
      both(W("e2", "Maya"), { x: 900, y: 200 });
      both(W("e2", "offer"), { x: 1250, y: 200 });
      PIP.emo(S("e3"), E("e3"), "curious");
      both(W("e4", "portal", 0, 0.2), { x: 1350, y: 600 });
      SAGE.gest(W("e4", "portal", 0, -0.2), W("e4", "documents"), "point");
      both(W("e4", "clearance"), { x: 1600, y: 200 });
      PIP.emo(S("e5"), E("e5", 0.4), "happy");
      PIP.gest(W("e5", "goodbye", 0, -0.3), E("e5", 0.4), "wave");
    });

    /* =====================================================================================
       6. MANUFACTURING: follow one order
       ===================================================================================== */
    addScene("mfg", SC.mfg.t0, SC.fin.t0 + 0.3, (root, s) => {
      const T0 = SC.mfg.t0;
      // factory hall (intro)
      const hall = mk(root, `<div style="position:absolute;inset:0"><svg width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect x="0" y="0" width="1920" height="1080" fill="#e3edfa"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${120 + i * 290}" y="70" width="230" height="300" rx="10" fill="#f4f8ff" stroke="#c9d8ee" stroke-width="6"/><line x1="${235 + i * 290}" y1="70" x2="${235 + i * 290}" y2="370" stroke="#c9d8ee" stroke-width="5"/><line x1="${120 + i * 290}" y1="220" x2="${350 + i * 290}" y2="220" stroke="#c9d8ee" stroke-width="5"/>`).join("")}
  <rect x="0" y="400" width="1920" height="26" fill="#9fb4d6"/>
  <rect x="0" y="426" width="1920" height="10" fill="#8aa1c8"/>
  <rect x="1260" y="436" width="90" height="40" rx="6" fill="#f97316"/><line x1="1305" y1="476" x2="1305" y2="560" stroke="#64748b" stroke-width="4"/><rect x="1285" y="556" width="40" height="20" rx="4" fill="#64748b"/>
  <rect x="0" y="880" width="1920" height="200" fill="#cfdcf0"/>
  <rect x="0" y="872" width="1920" height="12" fill="#b9cae6"/>
  ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${80 + i * 370},560)"><rect width="300" height="320" rx="18" fill="#5d82bf"/><rect x="18" y="20" width="170" height="210" rx="10" fill="#7d9dd0"/><rect x="34" y="40" width="138" height="170" rx="6" fill="#9cc3f5" opacity=".55"/><rect x="206" y="24" width="78" height="56" rx="8" fill="#0f2347"/><rect x="214" y="32" width="62" height="40" rx="4" fill="#60a5fa" id="mf_scr${i}"/><circle cx="226" cy="104" r="9" fill="#fdba74"/><circle cx="254" cy="104" r="9" fill="#93c5fd"/><rect x="0" y="250" width="300" height="70" rx="0" fill="#4a6ea9"/><rect x="40" y="268" width="220" height="10" rx="5" fill="#7d9dd0"/></g>`).join("")}
 </svg></div>`);
      const order = mk(root, `<div class="cd" style="left:640px;top:200px;width:640px;height:250px;z-index:3;border-color:#fdba74;box-shadow:0 0 0 5px rgba(253,186,116,.4),0 30px 70px rgba(15,35,71,.25)">${head("Receipt", "New customer order", "PO-4471", "o")}<div style="font-size:34px;font-weight:800;margin-top:20px">Flange housing FH-220 × 500</div><div class="mut" style="font-size:21px;margin-top:8px">Orion Aero · Due 12 Dec 2026</div></div>`);
      const tt = title(root, "Manufacturing", "Factory", "Follow <b>one order</b>", "From the customer's PO to the truck.");
      const win = makeWin(root, "Manufacturing", [
        { k: "ov", l: "Overview", ic: "LayoutDashboard", kids: [{ k: "of", l: "Order Fulfilment" }, { k: "mdash", l: "Dashboard" }, { k: "rh", l: "Reports Hub" }] },
        { k: "mast", l: "Masters", ic: "Layers" },
        { k: "sp", l: "Sales & Procurement", ic: "Receipt", kids: [{ k: "msp", l: "Monthly Sales Planning" }, { k: "mrp", l: "MRP Run" }, { k: "rfq", l: "RFQ Register" }, { k: "cpo", l: "Customer PO" }, { k: "cr", l: "Contract Review" }, { k: "pr", l: "Purchase Requisition" }, { k: "vpo", l: "Vendor PO" }] },
        { k: "sl", l: "Stores & Logistics", ic: "Warehouse", kids: [{ k: "gate", l: "Gate Control" }, { k: "grn", l: "GRN Register" }, { k: "ml", l: "Material Ledger" }, { k: "cmat", l: "Customer Material" }, { k: "jwt", l: "Job Work Traceability" }, { k: "dc", l: "Delivery Challan" }, { k: "dge", l: "Dispatch Gate Exit" }] },
        { k: "fin", l: "Finance", ic: "Wallet" },
        { k: "prod", l: "Production", ic: "Cog", kids: [{ k: "rcg", l: "Route Card Generation" }, { k: "ojc", l: "Operator Job Card" }, { k: "sched", l: "All Schedules" }] },
        { k: "sf", l: "Shop Floor", ic: "Route", kids: [{ k: "rci", l: "RC Issue" }, { k: "fic", l: "Final Inspection & COC" }, { k: "pd", l: "Packing & Dispatch" }, { k: "rcinv", l: "Route Cards to Invoice" }] },
        { k: "mc", l: "Machines", ic: "Cpu", kids: [{ k: "load", l: "Load Chart" }, { k: "live", l: "Live Monitoring" }, { k: "dta", l: "Downtime & Alarms" }, { k: "mnt", l: "Maintenance" }, { k: "nc", l: "NC Programs" }] },
        { k: "q", l: "Quality", ic: "ShieldCheck", kids: [{ k: "ncr", l: "NCR" }, { k: "capa", l: "CAPA" }, { k: "fair", l: "FAIR" }, { k: "cal", l: "Calibration" }, { k: "ppap", l: "PPAP" }, { k: "gen", l: "Quality Genealogy" }] },
        { k: "tools", l: "Tools", ic: "Wrench" },
      ]);
      const M = win.main;
      const STEPS = [["Order", "Receipt"], ["Plan", "ChartColumn"], ["Purchase", "Send"], ["Receive", "Truck"], ["Produce", "Cog"], ["Monitor", "Activity"], ["Quality", "ShieldCheck"], ["Dispatch", "PackageCheck"]];
      const flow = mk(M, `<div class="flow">${STEPS.map((st, i) => `<div class="fs" id="mf_f${i}">${I(st[1])}${st[0]}</div>`).join("")}</div>`);
      const P = (inner) => mk(M, `<div style="position:absolute;left:28px;top:142px;width:958px;height:712px">${inner}</div>`);
      // 1 order
      const p1 = P(`<div class="cd" style="left:0;top:0;width:466px;height:392px">${head("Receipt", "Customer PO", "PO-4471")}<div style="margin-top:10px"><div class="kv"><span class="k">Customer</span><span class="v">Orion Aero</span></div><div class="kv"><span class="k">Part</span><span class="v">FH-220 Flange housing</span></div><div class="kv"><span class="k">Quantity</span><span class="v">500 pcs</span></div><div class="kv"><span class="k">Due date</span><span class="v">12 Dec 2026</span></div></div><div class="row" style="margin-top:16px"><span class="pill">From RFQ-118</span><span class="pill g">Recorded</span></div></div>
 <div class="cd" id="mf_cr" style="left:492px;top:0;width:466px;height:392px">${head("ClipboardCheck", "Contract Review")}${["Drawing revision C", "Quantity and due date", "Material Al 6061-T6", "FAIR required"].map((r, i) => `<div class="row" style="margin-top:16px;height:52px;border-radius:14px;background:#f5f8fd;padding:0 16px;font-size:19.5px;font-weight:700"><span id="mf_crt${i}">${tick(false)}</span>${r}</div>`).join("")}<div class="stamp" id="mf_crs" style="right:24px;top:18px;font-size:22px">Accepted</div></div>
 <div class="cd" style="left:0;top:416px;width:958px;height:290px">${head("LayoutDashboard", "Order Fulfilment")}<table class="tb" style="margin-top:12px"><tr><th>Order</th><th>Customer</th><th>Part</th><th>Qty</th><th>Stage</th></tr><tr class="hl"><td>PO-4471</td><td class="m">Orion Aero</td><td class="m">FH-220</td><td>500</td><td><span class="pill o">Planning</span></td></tr><tr><td>PO-4466</td><td class="m">Kestrel Motors</td><td class="m">BR-114</td><td>1,200</td><td><span class="pill">In production</span></td></tr><tr><td>PO-4459</td><td class="m">Nordline Rail</td><td class="m">SP-031</td><td>350</td><td><span class="pill g">Dispatch</span></td></tr></table></div>`);
      // 2 plan
      const SPL = [["Oct", 420], ["Nov", 610], ["Dec", 500], ["Jan", 560]];
      const p2 = P(`<div class="cd" style="left:0;top:0;width:376px;height:392px">${head("ChartColumn", "Monthly Sales Planning")}<div style="position:absolute;left:28px;right:28px;bottom:26px;height:250px;display:flex;align-items:flex-end;gap:22px">${SPL.map((m, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%"><b style="font-size:16px" id="mf_sv${i}">0</b><div id="mf_sb${i}" style="width:100%;border-radius:8px 8px 3px 3px;background:${i === 2 ? "linear-gradient(180deg,#fdba74,#f97316)" : "linear-gradient(180deg,#93c5fd,#2563eb)"};height:0;margin-top:6px"></div><div class="mut" style="font-size:15px;margin-top:6px">${m[0]}</div></div>`).join("")}</div></div>
 <div class="cd" style="left:400px;top:0;width:558px;height:392px">${head("Workflow", "MRP Run", "FH-220 × 500")}<table class="tb" style="margin-top:14px"><tr><th>Material</th><th>Need</th><th>Stock</th><th>Short</th></tr><tr id="mf_r0"><td>Al 6061 bar Ø80</td><td>520 kg</td><td class="m">300 kg</td><td><span class="pill o">220 kg</span></td></tr><tr id="mf_r1"><td>Fasteners M8</td><td>2,000</td><td class="m">5,400</td><td class="m">—</td></tr><tr id="mf_r2"><td>Packing boxes</td><td>50</td><td class="m">120</td><td class="m">—</td></tr></table></div>
 <div class="cd" id="mf_pr" style="left:0;top:416px;width:440px;height:200px">${head("ClipboardList", "Purchase Requisition", "PR-0932")}<div style="font-size:24px;font-weight:800;margin-top:22px">Al 6061 bar Ø80 · 220 kg</div><div class="row" style="margin-top:12px"><span class="pill">Approved</span></div></div>
 <div class="arrow" id="mf_pa" style="left:452px;top:494px;font-size:40px">${I("ArrowRight")}</div>
 <div class="cd" id="mf_vpo" style="left:518px;top:416px;width:440px;height:200px">${head("Send", "Vendor PO", "VPO-2210")}<div style="font-size:24px;font-weight:800;margin-top:22px">Apex Metals · 220 kg</div><div class="row" style="margin-top:12px"><span class="pill">${I("Mail")}Sent to supplier</span></div></div>`);
      // 3 receive
      const p3 = P(`<div class="cd" id="mf_gate" style="left:0;top:0;width:300px;height:330px">${head("Truck", "Gate Control")}<div class="mut" style="font-size:17px;margin-top:26px">Vehicle in</div><div class="big" style="font-size:40px">10:42</div><div style="font-size:20px;font-weight:800;margin-top:10px">Apex Metals</div><div class="mut" style="font-size:17px">Against VPO-2210</div></div>
 <div class="cd" id="mf_grn" style="left:324px;top:0;width:634px;height:330px">${head("Inbox", "GRN Register")}<table class="tb" style="margin-top:14px"><tr><th>GRN</th><th>Against</th><th>Received</th><th>Tolerance</th></tr><tr class="hl"><td>GRN-5521</td><td class="m">VPO-2210</td><td>222 kg</td><td><span class="pill">Within ±2%</span></td></tr><tr><td>GRN-5518</td><td class="m">VPO-2197</td><td>1,000 pcs</td><td><span class="pill">Within ±1%</span></td></tr></table></div>
 <div class="cd" id="mf_ml" style="left:0;top:354px;width:466px;height:352px">${head("BookOpen", "Material Ledger", "AL 6061 Ø80")}<div style="margin-top:14px"><div class="kv"><span class="k">Opening stock</span><span class="v">300 kg</span></div><div class="kv"><span class="k">GRN-5521</span><span class="v" style="color:#1d4ed8">+ 222 kg</span></div><div class="kv"><span class="k">Balance</span><span class="v big" style="font-size:30px" id="mf_bal">300 kg</span></div></div></div>
 <div class="cd" id="mf_cm" style="left:492px;top:354px;width:466px;height:352px">${head("Package", "Customer Material", "JOB WORK", "o")}<div style="font-size:24px;font-weight:800;margin-top:22px">Orion Aero · owned by customer</div><div class="mut" style="font-size:19px;margin-top:8px">Housings for machining · 1,200 pcs</div><div class="row" style="margin-top:24px"><span class="pill o">Tracked separately</span><span class="pill">${I("GitBranch")}Job Work Traceability</span></div></div>`);
      // 4 produce
      const OPS = [["OP10", "Turning", "CNC-03"], ["OP20", "VMC milling", "VMC-01"], ["OP30", "Deburring", "Bench 2"], ["OP40", "Final inspection", "Quality"]];
      const LOAD = [["VMC-01", 82], ["VMC-02", 64], ["CNC-03", 91], ["CNC-04", 40], ["HMC-06", 70]];
      const p4 = P(`<div class="cd" style="left:0;top:0;width:520px;height:470px">${head("Route", "Route Card", "RC-0917")}<div class="mut" style="font-size:18px;margin-top:10px">FH-220 · 500 pcs · generated from BOM rev C</div>${OPS.map((o, i) => `<div class="row" id="mf_op${i}" style="margin-top:12px;height:54px;border-radius:14px;background:#f5f8fd;padding:0 16px;font-size:19.5px;font-weight:700"><span class="pill n">${o[0]}</span>${o[1]}<span class="mut" style="margin-left:auto">${o[2]}</span></div>`).join("")}<div class="row" style="margin-top:16px" id="mf_iss"><span class="pill">${I("Check")}Material issued · 522 kg</span></div></div>
 <div class="cd" id="mf_load" style="left:544px;top:0;width:414px;height:470px">${head("Gauge", "Load Chart", "THIS WEEK")}${LOAD.map((m, i) => `<div style="margin-top:${i ? 16 : 26}px"><div class="row" style="justify-content:space-between;font-size:18px;font-weight:800">${m[0]}<span class="mut" id="mf_lv${i}">0%</span></div><div class="bar" style="margin-top:8px;height:14px"><i id="mf_lb${i}" class="${m[1] > 85 ? "o" : ""}" style="width:0"></i></div></div>`).join("")}</div>
 <div class="cd" id="mf_sch" style="left:0;top:494px;width:958px;height:212px">${head("CalendarDays", "All Schedules")}<div style="position:relative;margin-top:16px;height:110px">${["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => `<div class="mut" style="position:absolute;left:${120 + i * 160}px;top:0;font-size:15px">${d}</div>`).join("")}${[["CNC-03", 0, 1.6, "RC-0917 · OP10"], ["VMC-01", 1.3, 2.6, "RC-0917 · OP20"]].map((r, i) => `<div class="mut" style="position:absolute;left:0;top:${30 + i * 42}px;font-size:16px;font-weight:800;color:#0f2347">${r[0]}</div><div id="mf_job${i}" style="position:absolute;left:${120 + r[1] * 160}px;top:${26 + i * 42}px;width:${r[2] * 160}px;height:32px;border-radius:9px;background:${i ? "#2563eb" : "#1e3a6e"};color:#fff;font-size:14.5px;font-weight:800;line-height:32px;padding-left:12px;white-space:nowrap">${r[3]}</div>`).join("")}</div></div>`);
      // 5 monitor
      const MACH = [["VMC-01", "run", "Running", "RC-0917 · OP20"], ["VMC-02", "run", "Running", "RC-0899 · OP30"], ["CNC-03", "run", "Running", "RC-0917 · OP10"], ["CNC-04", "idle", "Idle", "Waiting for material"], ["VMC-05", "alarm", "Alarm", "Spindle load"], ["HMC-06", "setup", "Setup", "RC-0921 · OP10"]];
      const p5 = P(MACH.map((m, i) => `<div class="mach ${m[1] === "alarm" ? "alarm" : ""}" id="mf_m${i}" style="left:${(i % 3) * 329}px;top:${Math.floor(i / 3) * 214}px"><div class="mn">${m[0]}</div><div class="ms ${m[1]}" id="mf_ms${i}"><i></i>${m[2]}</div><div class="mut" style="font-size:16px;margin-top:8px">${m[3]}</div><div class="cnt" id="mf_c${i}"></div></div>`).join("") + `<div class="cd" id="mf_dta" style="left:0;top:440px;width:958px;height:266px">${head("TriangleAlert", "Downtime & Alarms", "TODAY", "o")}<table class="tb" style="margin-top:10px"><tr><th>Machine</th><th>Time</th><th>Event</th><th>Reason</th><th>Duration</th></tr><tr class="hl" id="mf_ev0"><td>VMC-05</td><td class="m">11:20</td><td>Alarm 1024 · Spindle load</td><td class="m">Tool change</td><td id="mf_dur">0 min</td></tr><tr><td>CNC-04</td><td class="m">10:05</td><td>Idle</td><td class="m">Waiting for material</td><td>22 min</td></tr></table></div>`);
      // 6 quality
      const QCH = [["FAIR", "Award"], ["Calibration", "Gauge"], ["PPAP", "FileCheck"], ["QMS Registers", "BookOpen"], ["Supplier Quality", "Truck"]];
      const GEN = [["Part FH-220 #0417", "Package"], ["RC-0917", "Route"], ["VMC-01 · D. Novak", "Cpu"], ["GRN-5521 · lot L-2291", "Inbox"], ["VPO-2210", "Send"]];
      const p6 = P(`<div class="cd" id="mf_fi" style="left:0;top:0;width:466px;height:330px">${head("ShieldCheck", "Final Inspection & COC")}<div class="row" style="margin-top:22px;gap:12px">${[["Inspected", "500", ""], ["Accepted", "498", ""], ["Rejected", "2", "o"]].map((k) => `<div style="flex:1;height:110px;border-radius:16px;background:${k[2] ? "#fff1e6" : "#f5f8fd"};padding:14px 16px"><div class="mut" style="font-size:15.5px">${k[0]}</div><div class="big" style="font-size:36px;margin-top:4px;${k[2] ? "color:#c2560f" : ""}">${k[1]}</div></div>`).join("")}</div><div class="row" style="margin-top:22px"><span class="pill">${I("BadgeCheck")}COC issued</span></div></div>
 <div class="cd" id="mf_ncr" style="left:492px;top:0;width:466px;height:330px">${head("TriangleAlert", "NCR → CAPA", "", "o")}<div class="row" style="margin-top:20px;height:62px;border-radius:14px;background:#fff1e6;padding:0 16px;font-size:19px;font-weight:800">NCR-031<span class="mut" style="font-weight:600">2 pcs · bore oversize</span></div><div style="text-align:center;color:#93a3bf;font-size:26px;display:flex;justify-content:center;margin:6px 0">${I("ChevronDown")}</div><div class="row" id="mf_capa" style="height:62px;border-radius:14px;background:#eaf2ff;padding:0 16px;font-size:19px;font-weight:800">CAPA-014<span class="mut" style="font-weight:600">Tool life limit added</span></div></div>
 ${QCH.map((c, i) => `<div class="chip" id="mf_q${i}" style="left:${[0, 124, 318, 450, 680][i]}px;top:350px">${I(c[1])}${c[0]}</div>`).join("")}
 <div class="cd" id="mf_gen" style="left:0;top:424px;width:958px;height:282px">${head("GitBranch", "Quality Genealogy", "TRACE BACK")}<div style="position:relative;margin-top:30px;height:150px">${GEN.map((g, i) => `<div id="mf_g${i}" style="position:absolute;left:${i * 184}px;top:${i % 2 ? 60 : 0}px;width:170px;height:82px;border-radius:16px;background:${i ? "#f5f8fd" : "#1e3a6e"};color:${i ? "#0f2347" : "#fff"};padding:12px 14px;font-size:15.5px;font-weight:800;line-height:22px"><div style="font-size:22px;display:flex;color:${i ? "#2563eb" : "#93c5fd"}">${I(g[1])}</div>${g[0]}</div>`).join("")}</div></div>`);
      // 7 dispatch
      const p7 = P(`<div class="cd" id="mf_pk" style="left:0;top:0;width:466px;height:340px">${head("PackageCheck", "Packing & Dispatch")}<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:22px;width:300px">${[...Array(10)].map((_, i) => `<div id="mf_bx${i}" style="width:48px;height:48px;border-radius:9px;background:#fdba74;border:3px solid #f97316;opacity:.15"></div>`).join("")}</div><div style="font-size:22px;font-weight:800;margin-top:24px" id="mf_pkt">0 pcs packed</div></div>
 <div class="cd" id="mf_dc" style="left:492px;top:0;width:466px;height:340px">${head("Truck", "Delivery Challan", "DC-7781")}<div style="margin-top:12px"><div class="kv"><span class="k">Customer</span><span class="v">Orion Aero</span></div><div class="kv"><span class="k">E-way bill</span><span class="pill" id="mf_ewb">Generated</span></div><div class="kv"><span class="k">Dispatch gate exit</span><span class="v" id="mf_exit">16:05</span></div></div></div>
 <div class="cd" id="mf_inv" style="left:0;top:364px;width:958px;height:342px">${head("Receipt", "Route Cards to Invoice")}<div class="row" style="margin-top:34px;gap:26px"><div style="width:250px;height:150px;border-radius:18px;background:#f5f8fd;padding:18px"><div class="pill n">RC-0917</div><div style="font-size:21px;font-weight:800;margin-top:14px">498 pcs · closed</div></div><div style="font-size:40px;color:#93a3bf;display:flex">${I("ArrowRight")}</div><div id="mf_ci" style="width:420px;height:150px;border-radius:18px;background:#eaf2ff;padding:18px"><div class="ch" style="font-size:20px"><div class="ic n">${I("Receipt")}</div>Customer Invoice</div><div style="font-size:21px;font-weight:800;margin-top:14px">INV-2026-0418 · FH-220 × 498</div></div></div><div id="mf_truck" style="position:absolute;left:0;bottom:22px;font-size:46px;color:#1e3a6e;display:flex">${I("Truck")}</div></div>`);
      const panels = [p1, p2, p3, p4, p5, p6, p7];
      const tWin = W("f2", "customer", 0, -0.5);
      const tP = [tWin + 0.2, S("f3", -0.1), S("f5", -0.1), S("f7", -0.1), S("f9", -0.1), W("f13", "part", 0, -0.2), S("f15", -0.1)];
      const tStep = [tWin + 0.4, W("f4", "Sales"), W("f4", "purchase"), S("f5", 0.2), S("f7", 0.2), S("f9", 0.2), W("f13", "part"), S("f15", 0.2)];
      tP.forEach((x) => sfx(x, "swish", 0.35));
      tStep.forEach((x) => sfx(x, "tick", 0.5));
      win.key(tWin, "cpo");
      win.key(W("f2", "contract"), "cr");
      win.key(W("f4", "Sales"), "msp");
      win.key(W("f4", "run"), "mrp");
      win.key(W("f4", "requisition"), "pr");
      win.key(W("f4", "vendor"), "vpo");
      win.key(W("f6", "Gate"), "gate");
      win.key(W("f6", "register"), "grn");
      win.key(W("f6", "ledger"), "ml");
      win.key(W("f6", "customerowned"), "cmat");
      win.key(W("f6", "job"), "jwt");
      win.key(W("f8", "route"), "rcg");
      win.key(W("f8", "issued"), "rci");
      win.key(W("f8", "scheduled"), "sched");
      win.key(W("f8", "load"), "load");
      win.key(W("f10", "Live"), "live");
      win.key(W("f10", "downtime"), "dta");
      win.key(W("f14", "final"), "fic");
      win.key(W("f14", "FAIR"), "fair");
      win.key(W("f14", "CAPA"), "capa");
      win.key(W("f14", "calibration"), "cal");
      win.key(W("f14", "Genealogy"), "gen");
      win.key(W("f16", "Packing"), "pd");
      win.key(W("f16", "delivery"), "dc");
      win.key(W("f16", "route"), "rcinv");
      const tOrder = W("f2", "order", 0, -0.3);
      sfx(tOrder, "pop", 0.6);
      sfx(tWin, "whoosh", 0.5);
      const tAlarm = W("f9", "stops", 0, -0.2);
      sfx(tAlarm, "alert", 0.45);
      sfx(tAlarm + 0.6, "alert", 0.35);
      sfx(W("f2", "deliver", 0, 0.2), "stamp", 0.5);
      sfx(W("f16", "invoice", 0, 0.1), "whoosh", 0.4);
      cam(SC.mfg.t0, 1.0);
      cam(SC.mfg.t0 + 0.2, 1.0);
      cam(tOrder, 1.04, 960, 420);
      cam(tWin + 0.3, 1.0);
      cam(S("f9", 0.2), 1.0);
      cam(S("f9", 1.2), 1.05, 1200, 560);
      cam(E("f10", 0.3), 1.0);
      s.apply = (time) => {
        const hallA = 1 - sm(pr(time, tWin, tWin + 0.8));
        hall.style.opacity = hallA;
        hall.style.display = hallA <= 0.001 ? "none" : "block";
        hall.style.filter = `blur(${((1 - hallA) * 6).toFixed(1)}px)`;
        for (let i = 0; i < 5; i++) {
          const sc = root.querySelector("#mf_scr" + i);
          if (sc) sc.setAttribute("fill", (Math.floor(time * 2 + i * 1.3) % 3) === 0 ? "#fdba74" : "#60a5fa");
        }
        show(order, time, tOrder, tWin + 0.1, { sc: 0.7, dy: 30, od: 0.5 });
        if (time > tWin) order.style.transform += ` translate(${(-(time - tWin) * 260).toFixed(1)}px,${(-(time - tWin) * 190).toFixed(1)}px) scale(${lerp(1, 0.5, pr(time, tWin, tWin + 0.5))})`;
        tt(time, tWin + 0.1);
        const wa = show(win.el, time, tWin, null, { dy: 260, sc: 0.98, d: 0.8 });
        if (wa > 0) win.apply(time);
        STEPS.forEach((st, i) => {
          const el = $("mf_f" + i);
          let k = -1;
          tStep.forEach((x, j) => time >= x && (k = j));
          cls(el, "on", i === k);
          cls(el, "done", i < k);
        });
        panels.forEach((p, i) => show(p, time, tP[i], i < 6 ? tP[i + 1] - 0.05 : SC.fin.t0 + 1, { dy: 18, sc: 0.985 }));
        // 1
        const tCR = W("f2", "contract");
        [0, 1, 2, 3].forEach((i) => ($("mf_crt" + i).innerHTML = tick(time > tCR + 0.2 + i * 0.25)));
        cls($("mf_cr"), "hot", time > tCR && time < tP[1]);
        const tS = W("f2", "deliver", 0, 0.1);
        $("mf_crs").style.opacity = sm(pr(time, tS, tS + 0.15));
        $("mf_crs").style.transform = `rotate(-8deg) scale(${lerp(1.7, 1, back(pr(time, tS, tS + 0.35)))})`;
        // 2
        SPL.forEach((m, i) => {
          const u = sm(pr(time, W("f4", "Sales") + i * 0.12, W("f4", "Sales") + 0.8 + i * 0.12));
          $("mf_sb" + i).style.height = ((m[1] / 610) * 190 * u).toFixed(1) + "px";
          $("mf_sv" + i).textContent = Math.round(m[1] * u);
        });
        [0, 1, 2].forEach((i) => show($("mf_r" + i), time, W("f4", "run") + i * 0.2, null, { dy: 6, sc: 1 }));
        show($("mf_pr"), time, W("f4", "requisition", 0, -0.2), null);
        show($("mf_pa"), time, W("f4", "vendor", 0, -0.3), null, { sc: 0.5, dy: 0 });
        show($("mf_vpo"), time, W("f4", "vendor", 0, -0.15), null);
        // 3
        show($("mf_gate"), time, W("f6", "Gate", 0, -0.2), null);
        show($("mf_grn"), time, W("f6", "register", 0, -0.3), null);
        show($("mf_ml"), time, W("f6", "ledger", 0, -0.3), null);
        const ub = sm(pr(time, W("f6", "ledger", 0, 0.3), W("f6", "ledger", 0, 1.3)));
        $("mf_bal").textContent = Math.round(300 + 222 * ub) + " kg";
        show($("mf_cm"), time, W("f6", "customerowned", 0, -0.2), null);
        cls($("mf_cm"), "warm", time > W("f6", "customerowned") && time < tP[3]);
        // 4
        OPS.forEach((o, i) => show($("mf_op" + i), time, W("f8", "route") + 0.2 + i * 0.2, null, { dy: 8, sc: 1 }));
        show($("mf_iss"), time, W("f8", "issued", 0, -0.1), null, { sc: 0.8 });
        show($("mf_sch"), time, W("f8", "scheduled", 0, -0.2), null);
        [0, 1].forEach((i) => {
          const u = sm(pr(time, W("f8", "scheduled") + i * 0.3, W("f8", "scheduled") + 0.8 + i * 0.3));
          $("mf_job" + i).style.clipPath = `inset(0 ${((1 - u) * 100).toFixed(1)}% 0 0 round 9px)`;
        });
        show($("mf_load"), time, W("f8", "load", 0, -0.3), null);
        LOAD.forEach((m, i) => {
          const u = sm(pr(time, W("f8", "load") + i * 0.1, W("f8", "load") + 0.9 + i * 0.1));
          $("mf_lb" + i).style.width = m[1] * u + "%";
          $("mf_lv" + i).textContent = Math.round(m[1] * u) + "%";
        });
        // 5
        MACH.forEach((m, i) => {
          const el = $("mf_m" + i);
          show(el, time, tP[4] + 0.1 + i * 0.1, null, { dy: 14 });
          const alarmOn = i === 4 && time > tAlarm;
          const ms = $("mf_ms" + i);
          if (i === 4) {
            ms.className = "ms " + (alarmOn ? "alarm" : "run");
            ms.innerHTML = `<i></i>${alarmOn ? "Alarm" : "Running"}`;
            cls(el, "alarm", alarmOn);
            el.style.boxShadow = alarmOn ? `0 0 0 ${(4 + 4 * Math.abs(Math.sin(time * 4))).toFixed(1)}px rgba(253,186,116,.55)` : "";
            el.querySelector(".mut").textContent = alarmOn ? "Spindle load · 11:20" : "RC-0913 · OP20";
          }
          if (m[1] === "run" || (i === 4 && !alarmOn)) {
            const base = [312, 188, 405, 0, 96, 0][i];
            const n = base + Math.floor(Math.max(0, time - tP[4]) * 1.4);
            $("mf_c" + i).innerHTML = `${n}<small> / 500</small>`;
          } else $("mf_c" + i).innerHTML = i === 4 ? `96<small> / 500</small>` : "";
        });
        show($("mf_dta"), time, W("f10", "downtime", 0, -0.2), null);
        $("mf_dur").textContent = Math.min(14, Math.max(0, Math.floor((time - tAlarm) * 2))) + " min";
        // 6
        show($("mf_fi"), time, W("f14", "final", 0, -0.2), null);
        show($("mf_ncr"), time, W("f14", "N", 0, -0.2), null);
        show($("mf_capa"), time, W("f14", "CAPA", 0, -0.1), null, { dy: 10 });
        const tq = [W("f14", "FAIR"), W("f14", "calibration"), W("f14", "calibration", 0, 0.25), W("f14", "calibration", 0, 0.45), W("f14", "calibration", 0, 0.65)];
        QCH.forEach((c, i) => show($("mf_q" + i), time, tq[i] - 0.1, null, { sc: 0.8 }));
        show($("mf_gen"), time, W("f14", "Genealogy", 0, -0.2), null);
        GEN.forEach((g, i) => show($("mf_g" + i), time, W("f14", "traces") + i * 0.28, null, { dx: 30, dy: 0 }));
        // 7
        show($("mf_pk"), time, W("f16", "Packing", 0, -0.2), null);
        const np = Math.floor(sm(pr(time, W("f16", "Packing"), W("f16", "delivery", 0, 0.4))) * 10);
        for (let i = 0; i < 10; i++) $("mf_bx" + i).style.opacity = i < np ? 1 : 0.15;
        $("mf_pkt").textContent = (np >= 10 ? 498 : np * 50) + " pcs packed";
        show($("mf_dc"), time, W("f16", "delivery", 0, -0.2), null);
        show($("mf_ewb"), time, W("f16", "eway", 0, -0.1), null, { sc: 0.7, dy: 0 });
        show($("mf_inv"), time, W("f16", "route", 0, -0.2), null);
        show($("mf_ci"), time, W("f16", "invoice", 0, -0.2), null, { dx: -30, dy: 0 });
        const tr = pr(time, W("f16", "invoice", 0, 0.2), W("f16", "invoice", 0, 2.6));
        $("mf_truck").style.transform = `translateX(${(30 + sm(tr) * 840).toFixed(1)}px)`;
        $("mf_truck").style.opacity = tr > 0 && tr < 1 ? 1 : 0;
      };
      // birds: fly into the hall, then back to their corner when the screen comes up
      SAGE.move(T0 + 0.1, T0 + 1.5, 800, 1012, 0.95, 1, "fly", 140);
      PIP.move(T0 + 0.25, T0 + 1.6, 1060, 1012, 0.92, -1, "fly", 170);
      sfx(T0 + 0.2, "whoosh", 0.5);
      both(T0 + 0.4, { x: 960, y: 700 });
      PIP.emo(S("f1"), E("f1"), "curious");
      PIP.gest(W("f1", "phoning", 0, -0.3), E("f1", 0.3), "shrug");
      SAGE.gest(W("f2", "order", 0, -0.3), W("f2", "customer"), "point");
      both(W("f2", "order", 0, -0.1), { x: 960, y: 330 });
      SAGE.move(tWin - 0.1, tWin + 1.0, BASE.sx, BASE.y, BASE.ss, 1, "glide", 80);
      PIP.move(tWin, tWin + 1.1, BASE.px, BASE.y, BASE.ps, 1, "fly", 110);
      sfx(tWin, "whoosh", 0.3);
      convo(["f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f13", "f14", "f15", "f16", "f17"]);
      both(W("f2", "contract", 0, 0.2), { x: 1400, y: 470 });
      PIP.emo(S("f3"), E("f3"), "curious");
      SAGE.gest(W("f4", "Sales", 0, -0.2), W("f4", "short"), "point");
      both(W("f4", "Sales", 0, 0.2), { x: 1100, y: 470 });
      both(W("f4", "requisition"), { x: 1300, y: 760 });
      SAGE.gest(W("f6", "Gate", 0, -0.2), W("f6", "stock"), "point");
      both(W("f6", "Gate", 0, 0.2), { x: 1000, y: 430 });
      both(W("f6", "ledger"), { x: 1100, y: 800 });
      both(W("f6", "customerowned"), { x: 1600, y: 800 });
      PIP.emo(S("f7"), E("f7"), "happy");
      both(W("f8", "route", 0, 0.2), { x: 1150, y: 500 });
      both(W("f8", "load"), { x: 1650, y: 500 });
      SAGE.gest(W("f8", "route", 0, -0.2), W("f8", "scheduled"), "point");
      // Pip flies over to the alarm, peeks, then comes back
      PIP.emo(S("f9"), E("f10"), "surprised");
      PIP.face(S("f9", -0.25), -1);
      PIP.move(W("f9", "machine", 0, -0.2), W("f9", "halfway", 0, 0.5), 1600, 690, 0.66, -1, "fly", 90);
      PIP.hover(W("f9", "halfway", 0, 0.5), E("f10", 0.2));
      PIP.look(W("f9", "machine"), { x: 1350, y: 580 });
      PIP.look(S("f10", 0.4), { x: 1350, y: 580 });
      PIP.move(E("f10", 0.2), E("f10", 1.3), BASE.px, BASE.y, BASE.ps, 1, "fly", 60);
      sfx(W("f9", "machine", 0, -0.2), "whoosh", 0.35);
      sfx(E("f10", 0.2), "whoosh", 0.3);
      both(W("f10", "downtime"), { x: 1300, y: 860 });
      SAGE.look(S("f10", 0.4), { x: 1350, y: 580 });
      // a joke
      PIP.face(S("f11", -0.2), -1);
      PIP.emo(S("f11"), E("f11"), "happy");
      PIP.gest(S("f11", 0.1), E("f11"), "raise");
      SAGE.emo(S("f12"), E("f12", 0.6), "smug");
      PIP.emo(S("f12", 0.2), E("f12", 0.4), "surprised");
      sfx(E("f11", 0.05), "chirp", 0.3);
      PIP.emo(S("f13"), W("f13", "What"), "happy");
      PIP.gest(S("f13"), W("f13", "What"), "flapjoy");
      PIP.emo(W("f13", "What"), E("f13"), "curious");
      SAGE.gest(W("f14", "final", 0, -0.2), W("f14", "calibration"), "point");
      both(W("f14", "final", 0, 0.2), { x: 1100, y: 420 });
      both(W("f14", "Genealogy"), { x: 1400, y: 760 });
      SAGE.gest(W("f16", "Packing", 0, -0.2), W("f16", "invoice"), "point");
      both(W("f16", "Packing", 0, 0.2), { x: 1100, y: 420 });
      both(W("f16", "route"), { x: 1400, y: 780 });
      PIP.emo(S("f17"), E("f17", 0.8), "tired");
      PIP.gest(W("f17", "need", 0, -0.2), E("f17", 0.8), "facepalm");
      SAGE.emo(W("f17", "need"), E("f17", 0.8), "happy");
    });

    /* =====================================================================================
       7. FINANCE, ASSETS, ADMIN
       ===================================================================================== */
    addScene("fin", SC.fin.t0, SC.ai.t0 + 0.4, (root, s) => {
      const T0 = SC.fin.t0;
      const tt = title(root, "Finance · Assets · Admin", "Wallet", "Beyond <b>the work itself</b>", "Invoices, assets and who can see what.");
      const X = [560, 1004, 1448];
      const fin = card(root, X[0], 130, 412, 820, head("Receipt", "Customer Invoice") + `<div style="margin-top:20px;border-radius:18px;background:#f5f8fd;padding:20px"><div class="row" style="justify-content:space-between"><b style="font-size:21px">INV-2026-0418</b><span class="pill">Approved</span></div><div class="mut" style="font-size:17px;margin-top:8px">Bill to Orion Aero</div>${[["FH-220 × 498", "€ 46,812"], ["Packing", "€ 640"]].map((r) => `<div class="kv" style="height:44px;font-size:17.5px"><span class="k">${r[0]}</span><span class="v">${r[1]}</span></div>`).join("")}<div class="row" style="justify-content:space-between;margin-top:8px"><span class="mut" style="font-size:17px">Total</span><b style="font-size:26px">€ 47,452</b></div></div><div class="mut" style="font-size:16px;margin-top:16px;font-weight:700;letter-spacing:1px">ALSO HERE</div>` + [["Invoice Templates", "FileText"], ["Debit Notes", "Receipt"], ["Credit Notes", "Receipt"], ["Project Billing", "FolderKanban"], ["Staffing Invoices", "Briefcase"]].map((c, i) => `<div class="row" id="fn_c${i}" style="margin-top:12px;height:54px;border-radius:14px;border:1.5px solid #e3eaf5;padding:0 16px;font-size:19px;font-weight:800"><span style="display:flex;color:#2563eb;font-size:21px">${I(c[1])}</span>${c[0]}</div>`).join("") + `<div class="sample">Sample data</div>`);
      const AS = [["LAP-0231", "Laptop 14\"", "Laptop", "MF", "#f97316", "Maya Fischer"], ["MON-0118", "Monitor 27\"", "Monitor", "LR", "#0891b2", "Leo Rossi"], ["TAB-0042", "Tablet", "Tablet", "SF", "#64748b", "Shop floor"], ["LAP-0207", "Laptop 15\"", "Laptop", "TW", "#059669", "Tom Weber"]];
      const ast = card(root, X[1], 130, 412, 820, head("Laptop", "Assets", "LIST") + AS.map((a, i) => `<div id="fn_a${i}" style="margin-top:16px;border-radius:16px;background:#f5f8fd;padding:16px 18px;border:2px solid transparent"><div class="row" style="justify-content:space-between"><b style="font-size:20px">${a[1]}</b><span class="pill g">${a[0]}</span></div><div class="row" style="margin-top:12px;font-size:17px;font-weight:700;color:#3d5479">${av(a[3], a[4], 34)}Assigned to ${a[5]}</div></div>`).join("") + `<div class="row" style="margin-top:22px;gap:10px"><span class="pill">${I("Plus")}Add</span><span class="pill">${I("UserCheck")}Assign</span></div>`);
      const ROLES = ["Admin", "Plant manager", "Quality inspector", "Accountant"];
      const MODC = ["Prod", "QA", "Fin", "HR"];
      const GRID = [[1, 1, 1, 1], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]];
      const adm = card(root, X[2], 130, 412, 820, head("KeyRound", "Access Control") + `<div class="mut" style="font-size:16px;margin-top:18px;font-weight:700;letter-spacing:1px">ROLES × PAGES</div><table class="tb" style="margin-top:8px;font-size:16px"><tr><th></th>${MODC.map((m) => `<th style="text-align:center;padding:0 2px 8px;width:52px">${m}</th>`).join("")}</tr>${ROLES.map((r, i) => `<tr><td style="font-size:16.5px">${r}</td>${GRID[i].map((g, j) => `<td style="text-align:center;padding:0"><div id="fn_g${i}_${j}" style="display:inline-flex">${tick(false)}</div></td>`).join("")}</tr>`).join("")}</table>` + [["Users", "Users"], ["User Requests", "Inbox"], ["Page Permissions", "ShieldCheck"], ["Feature Permissions", "Settings"], ["Integration Center", "Plug"]].map((c, i) => `<div class="row" id="fn_d${i}" style="margin-top:12px;height:52px;border-radius:14px;border:1.5px solid #e3eaf5;padding:0 16px;font-size:18.5px;font-weight:800"><span style="display:flex;color:#2563eb;font-size:20px">${I(c[1])}</span>${c[0]}</div>`).join(""));
      const tFin = T0 + 0.5;
      const tFc = [W("g2", "templates"), W("g2", "debit"), W("g2", "credit"), W("g2", "project"), W("g2", "staffing")];
      const tAst = S("g3", 0.2);
      const tAdm = S("g5", 0.1);
      const tAsg = W("g4", "assigned", 0, -0.1);
      const tDc = [W("g6", "users"), W("g6", "users", 0, 0.25), W("g6", "page"), W("g6", "feature"), W("g6", "permissions", 0, 0.3)];
      [tFin, tAst, tAdm].forEach((x) => sfx(x, "pop", 0.5));
      tFc.forEach((x) => sfx(x, "tick", 0.45));
      sfx(tAsg, "ping", 0.4);
      tDc.forEach((x) => sfx(x, "tick", 0.45));
      s.apply = (time) => {
        tt(time, T0 + 0.1);
        const focus = time < tAst ? 0 : time < tAdm ? 1 : 2;
        [fin, ast, adm].forEach((c, i) => {
          const a = show(c, time, [tFin, tAst, tAdm][i], null, { dy: 50 });
          if (a > 0 && time > tAst) {
            c.style.transform += i === focus ? "" : " scale(.96)";
            c.style.opacity = (a * (i === focus ? 1 : 0.6)).toFixed(3);
          }
          cls(c, "hot", i === focus && time > tFin + 0.6);
        });
        tFc.forEach((x, i) => {
          const el = $("fn_c" + i);
          show(el, time, x - 0.1, null, { dy: 10, sc: 0.96 });
          el.style.borderColor = time > x && time < x + 0.7 ? "#93c5fd" : "#e3eaf5";
        });
        AS.forEach((a, i) => {
          const el = $("fn_a" + i);
          show(el, time, tAst + 0.2 + i * 0.12, null, { dy: 10, sc: 1 });
          el.style.borderColor = i === 0 && time > tAsg ? "#fdba74" : "transparent";
          el.style.background = i === 0 && time > tAsg ? "#fff7ef" : "#f5f8fd";
        });
        ROLES.forEach((r, i) => GRID[i].forEach((g, j) => ($(`fn_g${i}_${j}`).innerHTML = tick(g && time > W("g6", "roles") + (i * 4 + j) * 0.06))));
        tDc.forEach((x, i) => {
          const el = $("fn_d" + i);
          show(el, time, x - 0.1, null, { dy: 10, sc: 0.96 });
          el.style.borderColor = time > x && time < x + 0.7 ? "#93c5fd" : "#e3eaf5";
        });
      };
      convo(["g1", "g2", "g3", "g4", "g5", "g6"]);
      PIP.emo(S("g1"), E("g1"), "curious");
      SAGE.gest(S("g2", 0.2), W("g2", "project"), "point");
      both(S("g2", 0.3), { x: 770, y: 400 });
      both(W("g2", "debit"), { x: 770, y: 720 });
      PIP.emo(S("g3"), E("g3"), "curious");
      both(S("g4", 0.3), { x: 1210, y: 280 });
      SAGE.gest(S("g4", 0.1), E("g4"), "point");
      PIP.emo(S("g5"), E("g5"), "curious");
      both(S("g6", 0.3), { x: 1650, y: 330 });
      SAGE.gest(W("g6", "roles", 0, -0.2), E("g6"), "point");
    });

    /* =====================================================================================
       8. SYNAX AI + AGENTS (the one dark moment)
       ===================================================================================== */
    const darkIn = SC.ai.t0 - 0.2;
    const darkOut = SC.close.t0 + 0.2;
    addScene("ai", SC.ai.t0, SC.close.t0 + 0.4, (root, s) => {
      const T0 = SC.ai.t0;
      const tt = title(root, "Synax AI & Agents", "Sparkles", "Who spots <b>the problems?</b>", "AI proposes. You approve.", true);
      const chat = mk(root, `<div class="chat" style="left:560px;top:84px;width:900px;height:430px"><div class="row" style="height:72px;padding:0 26px;background:linear-gradient(90deg,#1e3a6e,#2563eb);color:#fff;font-size:24px;font-weight:800">${I("Sparkles")}Synax AI<span style="margin-left:auto;font-size:16px;font-weight:700;color:#bfdbfe">Ask anything about your ERP data</span></div><div class="bub me" id="ai_q" style="top:104px"></div><div class="bub ai" id="ai_a" style="top:200px"></div></div>`);
      const agent = mk(root, `<div class="chat" style="left:1000px;top:470px;width:860px;height:430px;padding:30px 34px"><div class="ch">${`<div class="ic n">${I("Bot")}</div>`}Synax Agent · Challan reconciliation<small>PROPOSAL</small></div><div style="font-size:26px;font-weight:800;margin-top:22px;line-height:36px">Send return reminders for 3 overdue challans</div><div class="mut" style="font-size:18px;margin-top:8px">Nothing is sent until an approver says yes.</div><div class="row" style="margin-top:26px;gap:14px"><div class="btn p" id="ai_ok">${I("Check")}Approve</div><div class="btn s">Reject</div><span class="pill g" id="ai_st" style="margin-left:10px">Waiting for: Stores manager</span></div><div class="row" id="ai_hist" style="margin-top:22px;height:52px;border-radius:14px;background:#f3f6fb;padding:0 16px;font-size:17.5px;font-weight:700;color:#3d5479">${I("History")}Approved by A. Novak (Stores manager) · 14:32 · recorded</div></div>`);
      const chatM = mk(root, `<div class="chat" style="left:560px;top:560px;width:410px;height:170px;padding:22px 24px"><div class="ch" style="font-size:20px"><div class="ic">${I("MessageSquare")}</div>Chat · Dispatch team</div><div class="bub ai" style="position:relative;left:0;margin-top:14px;font-size:18px;padding:10px 16px;line-height:26px">Reminders approved, thanks!</div></div>`);
      const meet = mk(root, `<div class="chat" style="left:560px;top:756px;width:410px;height:170px;padding:22px 24px"><div class="ch" style="font-size:20px"><div class="ic">${I("CalendarDays")}</div>Meeting · Dispatch review</div><div class="row" style="margin-top:18px;font-size:19px;font-weight:700;color:#3d5479">${I("Clock")}Today, 15:30 · 4 people</div></div>`);
      const stars = $("stars");
      for (let i = 0; i < 70; i++) {
        const st = mk(stars, `<div class="star" style="left:${(hsx(i, 1) * 1920).toFixed(0)}px;top:${(hsx(i, 2) * 1080).toFixed(0)}px;transform:scale(${(0.5 + hsx(i, 3) * 1.2).toFixed(2)})"></div>`);
        st.dataset.k = i;
      }
      const Q = "Which delivery challans are past their return date?";
      const A = "Three challans are overdue for return: DC-7702 (12 days), DC-7715 (9 days) and DC-7731 (6 days).";
      const tQ = S("h2", 0.1);
      const tA = W("h2", "answers", 0, 0.5);
      const tAg = W("h2", "agents", 0, -0.2);
      const tOk = W("h4", "approves", 0, -0.1);
      const tCh = W("h4", "chat", 0, -0.2);
      const tMe = W("h4", "meetings", 0, -0.2);
      for (let k = 0; k < Q.length; k += 3) sfx(tQ + k / 34, "tick", 0.25);
      for (let k = 0; k < A.length; k += 4) sfx(tA + k / 40, "tick", 0.18);
      sfx(T0 + 0.3, "sweep", 0.35);
      sfx(T0 + 0.6, "chime", 0.35);
      sfx(tAg, "ping", 0.45);
      sfx(tOk, "click", 0.6);
      sfx(tOk + 0.15, "success", 0.5);
      sfx(tCh, "pop", 0.4);
      sfx(tMe, "pop", 0.4);
      s.apply = (time) => {
        tt(time, T0 + 0.2);
        show(chat, time, T0 + 0.4, null, { dy: 40 });
        const q = $("ai_q");
        q.style.opacity = time > tQ - 0.1 ? 1 : 0;
        typed(q, Q, time, tQ, 34);
        const a = $("ai_a");
        a.style.opacity = time > tA - 0.1 ? 1 : 0;
        if (time < tA + 0.6 && time > tA - 0.1) a.innerHTML = '<span style="letter-spacing:4px;color:#93a3bf">•••</span>';
        else typed(a, A, time, tA + 0.6, 40);
        show(agent, time, tAg, null, { dy: 50 });
        agent.style.boxShadow = time > tAg && time < tOk ? `0 0 0 ${(3 + 3 * Math.abs(Math.sin(time * 3))).toFixed(1)}px rgba(253,186,116,.6),0 40px 100px rgba(0,0,0,.35)` : "";
        const ok = $("ai_ok");
        const press = time > tOk && time < tOk + 0.2;
        ok.style.transform = press ? "scale(.94)" : "";
        ok.style.background = time > tOk ? "#1e3a6e" : "";
        $("ai_st").textContent = time > tOk ? "Approved" : "Waiting for: Stores manager";
        $("ai_st").className = "pill " + (time > tOk ? "" : "g");
        show($("ai_hist"), time, tOk + 0.25, null, { dy: 10 });
        show(chatM, time, tCh, null, { dy: 24 });
        show(meet, time, tMe, null, { dy: 24 });
      };
      convo(["h1", "h2", "h3", "h4"]);
      PIP.emo(S("h1"), E("h1"), "curious");
      SAGE.gest(S("h2", 0.2), W("h2", "data"), "point");
      both(S("h2", 0.3), { x: 1000, y: 260 });
      both(W("h2", "agents"), { x: 1400, y: 700 });
      PIP.emo(S("h3"), E("h3", 0.3), "surprised");
      PIP.gest(S("h3"), E("h3"), "raise");
      SAGE.gest(S("h4"), W("h4", "until"), "shake");
      both(W("h4", "approves", 0, -0.4), { x: 1150, y: 790 });
      both(W("h4", "chat"), { x: 760, y: 720 });
    });

    /* =====================================================================================
       9. CLOSE + brand
       ===================================================================================== */
    const tEnd = S("i4", -0.3);
    addScene("close", SC.close.t0, TOTAL + 1, (root, s) => {
      const T0 = SC.close.t0;
      const R = grid(root, 960, 760);
      const words = ["Less juggling.", "More visibility.", "Better control."].map((w, i) => mk(root, `<div class="pill ${i === 2 ? "o" : ""}" style="position:absolute;top:${560}px;left:${560 + i * 300}px;height:62px;padding:0 28px;font-size:26px;border-radius:31px">${w}</div>`));
      const tW = [W("i2", "Less"), W("i2", "More"), W("i2", "Better")];
      const tR = [W("i1", "Projects"), W("i1", "people"), W("i1", "manufacturing"), W("i1", "finance")];
      tW.forEach((x) => sfx(x, "pop", 0.45));
      sfx(W("i1", "connected"), "ping", 0.4);
      sfx(tEnd, "endchime", 0.6);
      s.apply = (time) => {
        R.forEach((r, i) => {
          const tin = i < 4 ? tR[i] : W("i1", "connected", 0, -0.2) + (i - 4) * 0.08;
          show(r.el, time, tin, tEnd, { sc: 0.6, dy: 30 });
          r.ln.style.opacity = pr(time, W("i1", "connected"), W("i1", "connected", 0, 0.5)) * (1 - pr(time, tEnd, tEnd + 0.4));
          r.ln.setAttribute("stroke-dashoffset", (-(time * 40) % 18).toFixed(1));
          const u = ((time * 0.45 + i * 0.13) % 1 + 1) % 1;
          r.dot.setAttribute("cx", lerp(960, r.x, u).toFixed(1));
          r.dot.setAttribute("cy", lerp(760, r.y, u).toFixed(1));
          r.dot.style.opacity = r.ln.style.opacity * Math.sin(Math.PI * u);
          cls(r.el, "lit", time > tin && time < tin + 1.0);
        });
        words.forEach((w, i) => show(w, time, tW[i], tEnd, { sc: 0.7 }));
        const e = $("end");
        const ea = sm(pr(time, tEnd, tEnd + 0.8));
        e.style.opacity = ea;
        e.style.transform = `translateY(${((1 - ea) * 30).toFixed(1)}px)`;
        e.children[1].style.transform = `scale(${lerp(0.94, 1, back(pr(time, tEnd + 0.2, tEnd + 1.0)))})`;
      };
      SAGE.move(T0 + 0.1, T0 + 1.4, 820, 1012, 1.0, 1, "glide", 100);
      PIP.move(T0 + 0.2, T0 + 1.5, 1100, 1012, 0.96, -1, "fly", 140);
      sfx(T0 + 0.2, "whoosh", 0.35);
      both(T0 + 1.2, "other");
      PIP.emo(S("i1"), E("i1"), "curious");
      both(W("i1", "Projects"), { x: 960, y: 420 });
      both(S("i2", -0.1), "other");
      SAGE.emo(S("i2"), E("i2"), "happy");
      PIP.emo(S("i3"), E("i3", 0.3), "happy");
      PIP.gest(S("i3"), E("i3", 0.2), "flapjoy");
      sfx(E("i3", -0.2), "chirp", 0.3);
      // brand: they step aside and face the audience
      SAGE.move(tEnd, tEnd + 1.2, 330, 1012, 1.0, 1, "glide", 80);
      PIP.move(tEnd + 0.1, tEnd + 1.3, 1590, 1012, 0.96, -1, "fly", 110);
      both(tEnd + 0.4, "front");
      SAGE.emo(tEnd + 1.3, TOTAL + 1, "happy");
      PIP.emo(tEnd + 1.3, TOTAL + 1, "happy");
      PIP.gest(L.i4.end + 0.3, TOTAL + 1, "wave");
      SAGE.gest(L.i4.end + 0.6, TOTAL + 1, "wave");
    });

    /* ---------- camera keys ---------- */
    cam(SC.ai.t0, 1.0);
    cam(SC.close.t0, 1.0);
    CAM.sort((a, b) => a[0] - b[0]);
    function camAt(time) {
      let a = CAM[0];
      let b = null;
      for (const k of CAM) {
        if (k[0] <= time) a = k;
        else {
          b = k;
          break;
        }
      }
      if (!b) return a;
      const u = sm(pr(time, a[0], b[0]));
      return [time, lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)];
    }

    Birds.all.forEach((b) => b.finalize());
    const fade = $("fade");
    const world = $("world");
    const dark = $("dark");

    window.__apply = (time) => {
      const [, s, cx, cy] = camAt(time);
      world.style.transform = s === 1 ? "" : `translate(${((960 - cx) * (s - 1)).toFixed(1)}px,${((540 - cy) * (s - 1)).toFixed(1)}px) scale(${s.toFixed(4)})`;
      fade.style.opacity = 1 - sm(pr(time, 0, 0.7));
      const da = Math.min(sm(pr(time, darkIn, darkIn + 0.8)), 1 - sm(pr(time, darkOut, darkOut + 0.8)));
      dark.style.opacity = da;
      $("stars").style.opacity = da;
      if (da > 0)
        [...$("stars").children].forEach((st) => {
          const k = +st.dataset.k;
          st.style.opacity = (0.35 + 0.65 * Math.abs(Math.sin(time * (0.6 + hsx(k, 4)) + k))).toFixed(2);
        });
      for (const sc of SCENES) {
        const a = Math.min(sm(pr(time, sc.vis0 - 0.15, sc.vis0 + 0.35)), 1 - sm(pr(time, sc.vis1 - 0.2, sc.vis1 + 0.3)));
        if (a <= 0.001) {
          sc.root.style.display = "none";
          continue;
        }
        sc.root.style.display = "block";
        sc.root.style.opacity = a.toFixed(3);
        sc.apply(time);
      }
      SAGE.apply(time);
      PIP.apply(time);
      const glow = da > 0 ? `drop-shadow(0 0 ${(16 * da).toFixed(1)}px rgba(147,197,253,${(0.65 * da).toFixed(2)}))` : "";
      SAGE.el.style.filter = glow;
      PIP.el.style.filter = glow;
    };
    window.__total = TOTAL;
    window.__meta = {
      total: TOTAL,
      scenes: Object.fromEntries(Object.entries(SC).map(([k, v]) => [k, [v.t0, v.t1]])),
      lines: LINES.map((l) => ({ id: l.id, who: l.who, start: L[l.id].start, end: L[l.id].end })),
      sfx: SFX.sort((a, b) => a[0] - b[0]),
      dark: [darkIn, darkOut],
      mfg: [SC.mfg.t0, SC.fin.t0],
      poster: W("b3", "shared", 0, 1.2),
      endcard: tEnd,
    };
    window.__apply(0);
    window.__ready = true;
  } catch (e) {
    window.__err = (e && e.stack) || String(e);
  }
})();
