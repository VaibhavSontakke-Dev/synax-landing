/* Manufacturing ERP "Watch overview": the problem first (a normal day at a machine shop), then the Synax solution
   (one part, one passport), then the Synax agents (an AI bot that proposes; people approve). Pip and Sage carry the
   conversation. Every frame is a pure function of time (window.__apply). Every cue is anchored to a spoken word.
   Product statements follow the Manufacturing ERP page and app/erp/_data/live.ts; menu names follow the portal sidebar.
   People, companies, documents and numbers are fictional sample data. */
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
    const hsx = (k, s) => {
      const x = Math.sin(k * 12.9898 + s * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const $ = (id) => document.getElementById(id);
    const I = (n) => `<svg class="i" viewBox="0 0 24 24">${ICONS[n] || ""}</svg>`;
    const mk = (parent, html) => {
      const d = document.createElement("div");
      d.innerHTML = html.trim();
      const el = d.firstElementChild;
      parent.appendChild(el);
      return el;
    };
    const tick = (on = true, o = "") => `<div class="tick ${on ? o : "off"}">${I("Check")}</div>`;
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
    function typed(el, full, t, t0, cps = 26) {
      const n = Math.max(0, Math.min(full.length, Math.floor((t - t0) * cps)));
      el.innerHTML = full.slice(0, n) + (t >= t0 && n < full.length ? '<span class="caret"></span>' : "");
    }

    /* ---------- timeline ---------- */
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const L = {};
    const SC = {};
    const LEAD = { prob: 1.6, reveal: 0.5, sol: 1.0, ai: 1.3, end: 0.6 };
    const HOLD = { p3: 0.5, p5: 0.6, p7: 0.5, p8: 0.5, q1: 0.4, r1: 0.4, r3: 0.5, r5: 0.4, r7: 0.6, r9: 0.6, r11: 0.6, s2: 0.6, s4: 0.6 };
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
      const sp = w[w.length - 1].t + w[w.length - 1].d;
      L[l.id] = { ...l, start: t, end: t + sp, words: w };
      t += sp + (l.gap != null ? Math.min(l.gap, 0.6) : 0.18) + (HOLD[l.id] || 0);
    }
    const TOTAL = L.t1.end + 3.6;
    SC[prev].t1 = TOTAL;
    function W(id, word, nth = 0, off = 0) {
      const l = L[id];
      const key = norm(word);
      let k = 0;
      for (const w of l.words)
        if (norm(w.w) === key) {
          if (k === nth) return l.start + w.t + off;
          k++;
        }
      throw new Error(`word "${word}"#${nth} not in ${id}: ${l.words.map((w) => w.w).join(" ")}`);
    }
    const S = (id, off = 0) => L[id].start + off;
    const E = (id, off = 0) => L[id].end + off;
    const SFX = [];
    const sfx = (time, name, g = 1) => SFX.push([+time.toFixed(3), name, g]);
    Object.values(SC).forEach((s, i) => i && sfx(s.t0 + 0.1, "swish", 0.5));

    const scenesEl = $("scenes");
    const SCENES = [];
    function addScene(name, vis0, vis1, build) {
      const root = mk(scenesEl, `<div class="scene" id="sc_${name}"></div>`);
      const s = { name, root, vis0, vis1, apply: () => {} };
      build(root, s);
      SCENES.push(s);
    }
    function title(root, tag, icon, h1, p, o = {}) {
      const el = mk(root, `<div class="stitle"><div class="tag" ${o.warm ? 'style="color:#c2560f"' : ""}>${I(icon)}${tag}</div><h1 ${o.dark ? 'style="color:#fff"' : ""}>${h1}</h1><p ${o.dark ? 'style="color:#bcd0f0"' : ""}>${p}</p></div>`);
      return (time, t0, t1) => {
        show(el.children[0], time, t0, t1, { dy: 14 });
        show(el.children[1], time, t0 + 0.15, t1, { dy: 20 });
        show(el.children[2], time, t0 + 0.3, t1, { dy: 14 });
      };
    }
    function makeWin(root, header, groups) {
      const w = mk(root, `<div class="win"><div class="wtop"><img src="assets/synax-pro.webp" alt=""><div class="crumb"></div><div class="wsearch">${I("Search")}Search</div><div class="wav">AN</div></div><div class="side"><div class="sh">${header}</div></div><div class="main"></div></div>`);
      const side = w.querySelector(".side");
      const crumb = w.querySelector(".crumb");
      const items = {};
      for (const g of groups) {
        const gi = mk(side, `<div class="mi ${g.kids ? "grp" : ""}">${I(g.ic)}<span>${g.l}</span>${g.kids ? `<span style="margin-left:auto;display:flex;color:#a7b6cf">${I("ChevronRight")}</span>` : ""}</div>`);
        items[g.k] = { el: gi, path: [header, g.l], grp: null };
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
          sfx(time, "tick", 0.45);
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
    const card = (parent, x, y, w, h, inner, extra = "") => mk(parent, `<div class="cd ${extra}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${inner}</div>`);
    const head = (icon, text, small = "", icls = "") => `<div class="ch"><div class="ic ${icls}">${I(icon)}</div>${text}${small ? `<small>${small}</small>` : ""}</div>`;
    const CAM = [[0, 1, 960, 540]];
    const cam = (time, s, cx = 960, cy = 540) => CAM.push([time, s, cx, cy]);

    /* ---------- birds ---------- */
    const SAGE = Birds.make($("birds"), "S");
    const PIP = Birds.make($("birds"), "P");
    SAGE.other = PIP;
    PIP.other = SAGE;
    for (const l of LINES) (l.who === "P" ? PIP : SAGE).say(L[l.id].words, L[l.id].start);
    const BASE = { sx: 200, px: 420, y: 1014, ss: 0.84, ps: 0.82 };
    const both = (time, target) => {
      SAGE.look(time, target);
      PIP.look(time, target);
    };
    for (const l of LINES) both(S(l.id, -0.1), "other");
    function convo(ids) {
      for (const id of ids) {
        if (L[id].who === "P") PIP.face(S(id, -0.25), -1);
        else PIP.face(S(id, 0.35), 1);
      }
    }

    /* ---------- the machine-shop hall (problem scene backdrop) ---------- */
    const HALL = `<svg width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#e3edfa"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${120 + i * 290}" y="60" width="230" height="280" rx="10" fill="#f4f8ff" stroke="#c9d8ee" stroke-width="6"/><line x1="${235 + i * 290}" y1="60" x2="${235 + i * 290}" y2="340" stroke="#c9d8ee" stroke-width="5"/>`).join("")}
  <rect x="0" y="380" width="1920" height="22" fill="#a9bddc"/>
  <rect x="0" y="880" width="1920" height="200" fill="#cfdcf0"/><rect x="0" y="872" width="1920" height="12" fill="#b9cae6"/>
  ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${80 + i * 370},560)" opacity=".9"><rect width="300" height="320" rx="18" fill="#7d9dd0"/><rect x="18" y="20" width="170" height="210" rx="10" fill="#9db7e0"/><rect x="206" y="24" width="78" height="56" rx="8" fill="#4a6ea9"/><rect x="214" y="32" width="62" height="40" rx="4" fill="#bfdbfe"/><rect x="0" y="250" width="300" height="70" fill="#6a8cc4"/></g>`).join("")}
 </svg>`;

    /* =====================================================================================
       1. THE PROBLEM: a normal day at a machine shop
       ===================================================================================== */
    const CHIPS = [
      ["Material in a sheet", "Material to the piece"],
      ["Route cards on paper", "Counts from the machine"],
      ["Records by hand", "Evidence from the work"],
      ["Typed three times", "One flow to Tally"],
    ];
    const chipEls = [];
    addScene("prob", -1, SC.sol.t0 + 0.2, (root, s) => {
      const hall = mk(root, `<div style="position:absolute;inset:0">${HALL}</div>`);
      const tt = title(root, "The problem", "TriangleAlert", "A normal day at <b>a machine shop</b>", "Busy, but nothing is connected.", { warm: true });
      // P1 customer material
      const c1 = mk(root, `<div class="prob"><div class="ptag">${I("TriangleAlert")}Problem 1</div><h3>Whose material is on which rack?</h3>
  <svg style="position:absolute;left:36px;top:170px" width="420" height="420" viewBox="0 0 420 420">
   <rect x="10" y="20" width="16" height="390" fill="#7d9dd0"/><rect x="394" y="20" width="16" height="390" fill="#7d9dd0"/>
   ${[0, 1, 2].map((r) => `<rect x="10" y="${110 + r * 130}" width="400" height="12" fill="#5d82bf"/>${[0, 1, 2, 3, 4, 5, 6].map((b) => `<circle cx="${60 + b * 50}" cy="${86 + r * 130}" r="20" fill="${["#cbd5e1", "#94a3b8", "#fdba74", "#cbd5e1", "#93c5fd", "#94a3b8", "#cbd5e1"][(b + r) % 7]}" stroke="#64748b" stroke-width="3"/>`).join("")}<g transform="translate(${300 - r * 120},${40 + r * 130})"><rect width="54" height="36" rx="8" fill="#fff" stroke="#f97316" stroke-width="3"/><text x="27" y="27" text-anchor="middle" font-size="24" font-weight="800" fill="#f97316" font-family="Inter">?</text></g>`).join("")}
  </svg>
  <div style="position:absolute;left:500px;top:190px"><div class="mut" style="font-size:17px;margin-bottom:10px;display:flex;align-items:center;gap:8px">${I("FileSpreadsheet")}customer-material-FINAL-v7.xlsx</div><table class="sheet"><tr><th>Customer</th><th>Rack</th><th>Qty</th><th>Material ID</th></tr><tr id="pb_r0"><td>Orion Aero</td><td>B2</td><td>500</td><td>4410–?</td></tr><tr id="pb_r1"><td>Kestrel Motors</td><td class="err">?</td><td class="err">#N/A</td><td class="err">#N/A</td></tr><tr id="pb_r2"><td class="err">?</td><td>C1</td><td>120</td><td class="err">#REF!</td></tr><tr id="pb_r3"><td>Nordline Rail</td><td>A4</td><td class="err">?</td><td>—</td></tr></table><div class="paper" id="pb_note" style="position:relative;margin-top:22px;width:300px;transform:rotate(-3deg);font-size:20px">Last updated by…? 🤔</div></div></div>`);
      // P2 paper and walking
      const c2 = mk(root, `<div class="prob"><div class="ptag">${I("TriangleAlert")}Problem 2</div><h3>The machine knows. The office doesn't.</h3>
  <div class="paper" style="left:40px;top:180px;width:430px;height:400px;transform:rotate(-4deg)"><div style="font-size:24px;font-weight:800;font-style:normal">Route card RC-0917</div>${["OP10 Turning", "OP20 Milling", "OP30 Deburr", "OP40 Inspect"].map((o, i) => `<div style="margin-top:20px;display:flex;align-items:center;gap:16px;font-size:21px"><span style="width:170px">${o}</span><svg width="150" height="30"><g stroke="#5b4a2e" stroke-width="3" stroke-linecap="round">${[...Array([5, 4, 2, 0][i] + (i < 2 ? 3 : 0))].map((_, k) => (k % 5 === 4 ? `<line x1="${k * 12 - 50}" y1="24" x2="${k * 12 - 2}" y2="6"/>` : `<line x1="${6 + k * 12}" y1="4" x2="${6 + k * 12}" y2="26"/>`)).join("")}</g></svg></div>`).join("")}<div style="margin-top:22px;font-size:19px;color:#a16207">coffee stain · page 2 missing</div></div>
  <svg style="position:absolute;left:560px;top:190px" width="600" height="400" viewBox="0 0 600 400">
   <g transform="translate(360,30)"><rect width="220" height="300" rx="18" fill="#5d82bf"/><rect x="16" y="18" width="120" height="180" rx="10" fill="#9db7e0"/><rect x="148" y="22" width="60" height="44" rx="6" fill="#0f2347"/><text x="178" y="52" text-anchor="middle" font-family="Inter" font-size="20" font-weight="800" fill="#93c5fd" id="pb_cnt">312</text><text x="110" y="330" text-anchor="middle" font-family="Inter" font-size="22" font-weight="800" fill="#0f2347">VMC-05</text></g>
   <g transform="translate(20,40)"><rect width="190" height="120" rx="14" fill="#eaf2ff"/><text x="95" y="72" text-anchor="middle" font-family="Inter" font-size="22" font-weight="800" fill="#2563eb">Office</text><text x="160" y="40" font-family="Inter" font-size="40" font-weight="800" fill="#f97316">?</text></g>
   <g id="pb_walker"><circle cx="0" cy="-118" r="20" fill="#f2c9a5"/><rect x="-22" y="-96" width="44" height="64" rx="16" fill="#1e3a6e"/><line x1="-10" y1="-34" x2="-14" y2="0" stroke="#334155" stroke-width="10" stroke-linecap="round" id="pb_leg1"/><line x1="10" y1="-34" x2="14" y2="0" stroke="#334155" stroke-width="10" stroke-linecap="round" id="pb_leg2"/></g>
  </svg>
  <div class="ping" id="pb_ask" style="left:660px;top:205px">${I("CircleHelp")}Is VMC-05 running?</div></div>`);
      // P3 evidence by hand
      const c3 = mk(root, `<div class="prob"><div class="ptag">${I("TriangleAlert")}Problem 3</div><h3>Records put together by hand</h3>
  ${["Inspection report", "FAIR", "Certificate of conformance"].map((d, i) => `<div class="paper" id="pb_doc${i}" style="left:${60 + i * 190}px;top:${190 + i * 40}px;width:400px;height:330px;font-style:normal;color:#0f2347;transform:rotate(${[-5, 2, -2][i]}deg)"><div style="font-size:22px;font-weight:800">${d}</div>${[0, 1, 2, 3, 4].map((k) => `<div style="display:flex;gap:12px;align-items:center;margin-top:18px"><div style="width:120px;height:10px;border-radius:5px;background:#e9dcc0"></div><div style="flex:1;height:2px;background:#d6c4a0;position:relative"><i class="pb_ink" data-k="${i * 5 + k}" style="position:absolute;left:0;bottom:2px;height:3px;width:0;background:#1e3a8a;border-radius:2px"></i></div></div>`).join("")}</div>`).join("")}
  <div class="chip" id="pb_clock" style="left:820px;top:520px;border-color:#fdba74">${I("Clock")}17:40 · truck leaves at 18:00</div></div>`);
      // P4 typed three times
      const c4 = mk(root, `<div class="prob"><div class="ptag">${I("TriangleAlert")}Problem 4</div><h3>Typed again. And again.</h3>
  ${["Invoice", "E-way bill", "Tally"].map((d, i) => `<div class="scr" style="left:${36 + i * 390}px;top:190px"><div class="ch" style="font-size:21px"><div class="ic ${i === 2 ? "n" : ""}">${I(["Receipt", "Truck", "BookOpen"][i])}</div>${d}</div><div class="mut" style="font-size:16px;margin-top:22px">Item</div><div style="font-size:22px;font-weight:800;margin-top:4px;height:30px" id="pb_ty${i}"></div><div class="mut" style="font-size:16px;margin-top:16px">Amount</div><div style="font-size:22px;font-weight:800;margin-top:4px;height:30px" id="pb_am${i}"></div><div style="position:absolute;left:22px;bottom:20px" class="pill o" id="pb_re${i}">${I("Repeat")}Typed again</div></div>`).join("")}
  ${[0, 1].map((i) => `<div class="arrow" style="left:${376 + i * 390}px;top:320px;font-size:38px;color:#f97316">${I("ArrowRight")}</div>`).join("")}</div>`);
      CHIPS.forEach((c, i) => chipEls.push(mk(root, `<div class="pchip" style="left:${640 + i * 308}px"><div class="pi">${I("X")}</div><span>${c[0]}</span></div>`)));
      const cards = [c1, c2, c3, c4];
      const tIn = [W("p3", "customer", 0, -0.3), W("p5", "floor", 0, -0.4), W("p7", "before", 0, -0.3), S("p8", -0.1)];
      const tOut = [tIn[1] - 0.2, tIn[2] - 0.2, tIn[3] - 0.2, W("p9", "three", 0, 0.3)];
      tIn.forEach((x) => sfx(x, "pop", 0.5));
      tOut.forEach((x) => sfx(x + 0.2, "snap", 0.35));
      sfx(W("p3", "Maybe", 0, 0), "alert", 0.3);
      sfx(S("p4"), "chirp", 0.3);
      const tAsk = W("p5", "walks", 0, -0.4);
      sfx(tAsk + 0.6, "alert", 0.25);
      const ty0 = [W("p8", "invoice"), W("p8", "eway"), W("p8", "Tally")];
      ty0.forEach((x) => {
        for (let k = 0; k < 16; k += 2) sfx(x + k / 30, "tick", 0.22);
      });
      cam(0, 1.0);
      cam(1.0, 1.03, 960, 520);
      cam(tIn[0], 1.0);
      s.apply = (time) => {
        tt(time, 1.2, SC.reveal.t0 - 0.3);
        hall.style.opacity = 1 - sm(pr(time, SC.reveal.t0, SC.reveal.t0 + 0.8));
        cards.forEach((c, i) => {
          const a = show(c, time, tIn[i], null, { dx: 120, dy: 0, sc: 0.96 });
          if (a > 0 && time > tOut[i]) {
            // shrink into its chip at the bottom
            const u = sm(pr(time, tOut[i], tOut[i] + 0.55));
            const ch = chipEls[i];
            const tx = 640 + i * 308 + 145 - (640 + 610);
            const ty = 800 + 32 - (120 + 320);
            c.style.transform = `translate(${(tx * u).toFixed(1)}px,${(ty * u).toFixed(1)}px) scale(${lerp(1, 0.2, u).toFixed(3)})`;
            c.style.opacity = (1 - pr(u, 0.6, 1)).toFixed(3);
            c.style.visibility = u >= 1 ? "hidden" : "visible";
          }
        });
        chipEls.forEach((ch, i) => {
          show(ch, time, tOut[i] + 0.45, SC.sol.t0 - 0.3, { sc: 0.7, dy: 10 });
          const fixed = time > W("q1", "Synax") + i * 0.35;
          cls(ch, "ok", fixed);
          ch.querySelector(".pi").innerHTML = fixed ? I("Check") : I("X");
          ch.querySelector("span").textContent = fixed ? CHIPS[i][1] : CHIPS[i][0];
          ch.style.boxShadow = !fixed && time > W("p9", "same") && time < E("p9", 0.6) ? "0 0 0 5px rgba(253,186,116,.5)" : "";
        });
        // P1 detail
        [0, 1, 2, 3].forEach((i) => show($("pb_r" + i), time, tIn[0] + 0.5 + i * 0.25, null, { dy: 6, sc: 1 }));
        show($("pb_note"), time, W("p3", "Maybe", 0, -0.2), null, { sc: 0.7, extra: " rotate(-3deg)" });
        // P2 walker crosses from the office to the machine
        const wu = pr(time, tAsk, tAsk + 2.4);
        const wx = 230 + 160 * sm(wu);
        const step = Math.sin(wu * 26);
        const wk = $("pb_walker");
        wk.setAttribute("transform", `translate(${wx.toFixed(1)},${(330 - Math.abs(step) * 6).toFixed(1)})`);
        $("pb_leg1").setAttribute("x2", (-14 + step * 12).toFixed(1));
        $("pb_leg2").setAttribute("x2", (14 - step * 12).toFixed(1));
        $("pb_cnt").textContent = 312 + Math.floor(Math.max(0, time - tIn[1]) * 1.5);
        show($("pb_ask"), time, tAsk + 0.5, null, { sc: 0.8 });
        // P3 ink filling in slowly, the clock
        root.querySelectorAll(".pb_ink").forEach((el) => {
          const k = +el.dataset.k;
          el.style.width = (sm(pr(time, tIn[2] + 0.4 + k * 0.28, tIn[2] + 0.9 + k * 0.28)) * 100).toFixed(1) + "%";
        });
        show($("pb_clock"), time, W("p7", "hand", 0, -0.1), null, { sc: 0.8 });
        // P4 same line typed three times
        ty0.forEach((x, i) => {
          typed($("pb_ty" + i), "FH-220 × 498", time, x, 18);
          typed($("pb_am" + i), "€ 46,812", time, x + 0.75, 18);
          show($("pb_re" + i), time, x + 1.2, null, { sc: 0.7, dy: 0 });
        });
      };
      // birds on the shop floor
      PIP.place(-1, 2100, 300, 0.9, -1).move(0.3, 1.8, 600, 1012, 0.9, -1, "fly", 160);
      SAGE.place(-1, -220, 1012, 0.94, 1).move(0.6, 2.8, 330, 1012, 0.94, 1, "walk");
      sfx(0.3, "whoosh", 0.4);
      sfx(1.8, "chirp", 0.3);
      PIP.emo(S("p1"), E("p1"), "curious");
      PIP.look(S("p1", 0.4), { x: 900, y: 600 });
      PIP.look(W("p1", "Why"), "other");
      SAGE.gest(W("p2", "show", 0, -0.2), E("p2"), "point");
      both(W("p2", "normal"), { x: 1250, y: 420 });
      both(W("p3", "rack"), { x: 860, y: 500 });
      both(W("p3", "spreadsheet"), { x: 1400, y: 380 });
      PIP.emo(S("p4", -0.1), E("p4", 0.6), "surprised");
      PIP.gest(S("p4", -0.1), E("p4", 0.5), "flapjoy");
      PIP.look(S("p4"), "other");
      both(W("p5", "route"), { x: 900, y: 500 });
      both(W("p5", "machine"), { x: 1500, y: 450 });
      PIP.emo(S("p6"), E("p6"), "curious");
      SAGE.gest(W("p7", "Exactly", 0, -0.1), W("p7", "dispatch"), "point");
      both(W("p7", "inspection"), { x: 1100, y: 450 });
      SAGE.gest(W("p8", "typed", 0, -0.2), E("p8"), "shrug");
      both(W("p8", "invoice"), { x: 850, y: 420 });
      both(W("p8", "Tally"), { x: 1630, y: 420 });
      PIP.face(S("p9", -0.25), -1);
      PIP.emo(S("p9"), E("p9", 0.4), "surprised");
      PIP.gest(S("p9"), E("p9", 0.3), "raise");
    });

    /* =====================================================================================
       2. REVEAL: Synax Manufacturing ERP, one part one passport
       ===================================================================================== */
    const PASS = [["Customer PO line", "Receipt", "Quote and revision"], ["Material lot", "PackageCheck", "Material ID range"], ["Route card", "Layers", "Released against the BOM"], ["Machine and operator", "Wrench", "Cycle count, buy-off"], ["COC", "FileCheck", "Carries the machining record"], ["Invoice", "Receipt", "IRN and e-way bill"]];
    addScene("reveal", SC.reveal.t0, SC.sol.t0 + 0.4, (root, s) => {
      const T0 = SC.reveal.t0;
      const logo = mk(root, `<div style="position:absolute;left:0;right:0;top:110px;display:flex;justify-content:center"><img src="assets/synax-pro.webp" style="height:76px" alt=""></div>`);
      const tl = mk(root, `<div class="bigtitle" style="top:206px">Synax <b>Manufacturing ERP</b></div>`);
      const sub = mk(root, `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-size:28px;font-weight:600;color:#4a5f82">From the machine spindle to the GST invoice, in one workspace.</div>`);
      const strip = mk(root, `<div class="cd" style="left:300px;top:390px;width:1320px;height:250px;padding:26px 30px"><div class="row" style="justify-content:space-between;font-size:20px;font-weight:800">Part passport: one part, one record<span class="mut" style="font-size:17px">Traced back to its PO, material lot, machine and operator</span></div><div style="position:relative;margin-top:28px;height:150px"><div style="position:absolute;left:100px;right:100px;top:30px;height:4px;background:#dbe6f7;border-radius:2px"><i id="rv_line" style="display:block;height:100%;width:0;background:#1e3a6e;border-radius:2px"></i></div>${PASS.map((p, i) => `<div id="rv_p${i}" style="position:absolute;left:${i * 210}px;top:0;width:210px;text-align:center"><div style="margin:0 auto;width:64px;height:64px;border-radius:50%;border:3px solid ${i === 5 ? "#fdba74" : "#1e3a6e"};background:#fff;color:#1e3a6e;display:flex;align-items:center;justify-content:center;font-size:28px">${I(p[1])}</div><div style="margin-top:12px;font-size:19px;font-weight:800">${p[0]}</div><div class="mut" style="font-size:15.5px;margin-top:2px">${p[2]}</div></div>`).join("")}</div></div>`);
      const tLogo = W("q1", "Synax", 0, -0.25);
      sfx(tLogo - 0.4, "sweep", 0.45);
      sfx(tLogo - 0.3, "sub", 0.6);
      sfx(tLogo, "chime", 0.5);
      const tStrip = W("q1", "From", 0, -0.2);
      PASS.forEach((_, i) => sfx(tStrip + 0.3 + i * 0.22, "pop", 0.3));
      cam(T0, 1.0);
      cam(tLogo, 1.04, 960, 420);
      cam(E("q2", 0.3), 1.0);
      s.apply = (time) => {
        show(logo, time, tLogo, null, { sc: 0.6, dy: 0, d: 0.6 });
        show(tl, time, tLogo + 0.25, null, { dy: 20 });
        show(sub, time, tStrip, null, { dy: 14 });
        show(strip, time, tStrip + 0.1, null, { dy: 40 });
        $("rv_line").style.width = sm(pr(time, tStrip + 0.3, tStrip + 1.7)) * 100 + "%";
        PASS.forEach((_, i) => show($("rv_p" + i), time, tStrip + 0.3 + i * 0.22, null, { dy: 12, sc: 0.8 }));
      };
      SAGE.move(T0 + 0.1, T0 + 1.3, BASE.sx, BASE.y, BASE.ss, 1, "glide", 70);
      PIP.move(T0 + 0.2, T0 + 1.4, BASE.px, BASE.y, BASE.ps, 1, "fly", 90);
      both(T0 + 0.3, { x: 960, y: 250 });
      PIP.emo(tLogo, tLogo + 2, "surprised");
      PIP.gest(tLogo, tLogo + 1.5, "flapjoy");
      SAGE.gest(W("q1", "From", 0, -0.2), E("q1"), "point");
      both(W("q1", "From"), { x: 960, y: 500 });
      PIP.face(S("q2", -0.25), -1);
      PIP.emo(S("q2"), E("q2", 0.3), "happy");
    });

    /* =====================================================================================
       3. SOLUTION: follow one part
       ===================================================================================== */
    addScene("sol", SC.sol.t0, SC.ai.t0 + 0.3, (root, s) => {
      const T0 = SC.sol.t0;
      const tt = title(root, "The solution", "Factory", "One part, <b>one passport</b>", "Each document carries the one before it.");
      const win = makeWin(root, "Manufacturing", [
        { k: "ov", l: "Overview", ic: "LayoutDashboard" },
        { k: "mast", l: "Masters", ic: "Layers", kids: [{ k: "bom", l: "BOM" }, { k: "part", l: "Part Master" }] },
        { k: "sp", l: "Sales & Procurement", ic: "Receipt", kids: [{ k: "rfq", l: "RFQ Register" }, { k: "cpo", l: "Customer PO" }, { k: "cpod", l: "Customer PO Details" }, { k: "cr", l: "Contract Review" }] },
        { k: "sl", l: "Stores & Logistics", ic: "Warehouse", kids: [{ k: "gate", l: "Gate Control" }, { k: "grn", l: "GRN Register" }, { k: "cmat", l: "Customer Material" }, { k: "jwt", l: "Job Work Traceability" }, { k: "ml", l: "Material Ledger" }, { k: "dc", l: "Delivery Challan" }] },
        { k: "fin", l: "Finance", ic: "Wallet", kids: [{ k: "ci", l: "Customer Invoice" }] },
        { k: "prod", l: "Production", ic: "Cog", kids: [{ k: "ojc", l: "Operator Job Card" }, { k: "rcg", l: "Route Card Generation" }, { k: "sched", l: "All Schedules" }] },
        { k: "sf", l: "Shop Floor", ic: "Route", kids: [{ k: "rci", l: "RC Issue" }, { k: "rcp", l: "RC Production Entry" }, { k: "mj", l: "Machine Jobs" }, { k: "fic", l: "Final Inspection & COC" }, { k: "pd", l: "Packing & Dispatch" }, { k: "rcinv", l: "Route Cards to Invoice" }] },
        { k: "mc", l: "Machines", ic: "Cpu", kids: [{ k: "live", l: "Live Monitoring" }, { k: "olog", l: "Operator Login" }] },
        { k: "q", l: "Quality", ic: "ShieldCheck", kids: [{ k: "fair", l: "FAIR" }, { k: "gen", l: "Quality Genealogy" }] },
        { k: "tools", l: "Tools", ic: "Wrench" },
      ]);
      const M = win.main;
      const strip = mk(M, `<div class="flow">${PASS.map((p, i) => `<div class="fs" id="so_f${i}">${I(p[1])}${p[0].replace("Machine and operator", "Machine & operator")}</div>`).join("")}</div>`);
      const P = (inner) => mk(M, `<div style="position:absolute;left:28px;top:142px;width:958px;height:712px">${inner}</div>`);
      const LINES_PO = [["10", "FH-220", "C", 500, 0], ["20", "FH-221", "B", 300, 120], ["30", "FH-230", "A", 150, 150]];
      const p1 = P(`<div class="cd" style="left:0;top:0;width:958px;height:420px">${head("Receipt", "Customer PO · Orion Aero", "PO-4471")}<table class="tb" style="margin-top:14px"><tr><th>Line</th><th>Part</th><th>Rev</th><th>Ordered</th><th>Shipped</th><th>Open quantity</th></tr>${LINES_PO.map((l, i) => `<tr id="so_l${i}" ${i === 0 ? 'class="hl"' : ""}><td>${l[0]}</td><td>${l[1]}</td><td><span class="pill g">${l[2]}</span></td><td>${l[3]}</td><td class="m">${l[4]}</td><td><div class="row" style="gap:10px"><div class="bar" style="width:200px"><i id="so_ob${i}" style="width:0"></i></div><b id="so_ov${i}" style="width:48px">0</b></div></td></tr>`).join("")}</table></div>
 <div class="cd" id="so_q" style="left:0;top:444px;width:520px;height:262px">${head("FileText", "Quotation", "QT-118")}<div class="row" style="margin-top:26px;gap:12px">${["rev 1", "rev 2", "rev 3"].map((r, i) => `<span class="pill ${i === 2 ? "n" : "g"}" id="so_rev${i}" style="height:44px;font-size:19px;padding:0 18px">${r}${i === 2 ? " · current" : ""}</span>`).join("")}</div><div class="mut" style="font-size:18px;margin-top:22px">Every line quoted, every revision kept</div></div>
 <div class="cd" id="so_open" style="left:544px;top:444px;width:414px;height:262px">${head("Package", "Still to ship")}<div class="big" style="font-size:64px;margin-top:22px" id="so_left">0</div><div class="mut" style="font-size:18px">pcs across 2 open lines</div></div>`);
      const LED = [["Inward challan", "500", "BookOpen"], ["Issued", "500", "Settings"], ["Consumed 1:1", "498", "Check"], ["Returned", "0", "Repeat"], ["Scrap", "2", "X"]];
      const p2 = P(`<div class="cd" id="so_gate" style="left:0;top:0;width:466px;height:300px">${head("Truck", "Gate entry · challan", "CH-3381")}<div style="margin-top:12px"><div class="kv"><span class="k">Customer</span><span class="v">Orion Aero</span></div><div class="kv"><span class="k">Forged blanks</span><span class="v">500 pcs</span></div><div class="kv"><span class="k">Material ID range</span><span class="v">4410 – 4909</span></div><div class="kv"><span class="k">PO line</span><span class="v">PO-4471 · 10</span></div></div></div>
 <div class="cd" id="so_grn" style="left:492px;top:0;width:466px;height:300px">${head("Inbox", "GRN Register", "GRN-5530")}<div style="margin-top:12px"><div class="kv"><span class="k">Received</span><span class="v">500 pcs</span></div><div class="kv"><span class="k">Receipt tolerance</span><span class="pill">Within limits</span></div><div class="kv"><span class="k">Inspection</span><span class="pill">Recorded</span></div><div class="kv"><span class="k">Owner</span><span class="pill o">Customer material</span></div></div></div>
 <div class="cd" id="so_led" style="left:0;top:324px;width:958px;height:382px">${head("PackageCheck", "Customer Material · Orion Aero", "JOB WORK")}<div style="position:relative;margin-top:30px;height:190px">${LED.map((l, i) => `<div id="so_n${i}" style="position:absolute;left:${i * 182}px;top:0;width:164px;height:172px;border-radius:18px;background:${i === 2 ? "#eaf2ff" : "#f5f8fd"};padding:16px;text-align:center"><div style="margin:0 auto;width:48px;height:48px;border-radius:14px;background:#fff;color:#2563eb;display:flex;align-items:center;justify-content:center;font-size:24px">${I(l[2])}</div><div style="font-size:16.5px;font-weight:800;margin-top:12px;white-space:nowrap">${l[0]}</div><div class="big" style="font-size:34px;margin-top:4px">${l[1]}</div></div>`).join("")}</div><div class="row" style="gap:12px"><span class="pill" id="so_bal">${I("Check")}Balance 0 · every piece accounted for</span><span class="pill g" id="so_itc">ITC-04 data pack</span></div></div>`);
      const OPS = [["OP10", "Turning", "CNC-03"], ["OP20", "VMC milling", "VMC-01"], ["OP30", "Deburring", "Bench 2"], ["OP40", "Final inspection", "Quality"]];
      const p3 = P(`<div class="cd" style="left:0;top:0;width:560px;height:520px">${head("Layers", "Route card", "RC-0917")}<div class="mut" style="font-size:18px;margin-top:10px">FH-220 · 500 pcs · released against BOM rev C</div>${OPS.map((o, i) => `<div class="row" id="so_op${i}" style="margin-top:14px;height:58px;border-radius:14px;background:#f5f8fd;padding:0 16px;font-size:20px;font-weight:700"><span class="pill n">${o[0]}</span>${o[1]}<span class="mut" style="margin-left:auto">${o[2]}</span></div>`).join("")}<div class="row" style="margin-top:18px" id="so_res"><span class="pill" style="height:40px;font-size:17px">${I("Lock")}Material reserved · IDs 4410 – 4909</span></div></div>
 <div class="cd" id="so_twice" style="left:584px;top:0;width:374px;height:520px">${head("ShieldCheck", "Stock check")}<div style="margin-top:24px;border-radius:16px;background:#eaf2ff;padding:16px 18px"><div style="font-size:19px;font-weight:800">RC-0917</div><div class="mut" style="font-size:16.5px;margin-top:4px">Reserved 500 pcs</div></div><div id="so_blk" style="margin-top:16px;border-radius:16px;background:#fff1e6;padding:16px 18px;border:2px solid #fdba74"><div style="font-size:19px;font-weight:800">RC-0921</div><div style="font-size:16.5px;font-weight:700;color:#c2560f;margin-top:4px">Same material already reserved</div></div><div class="mut" style="font-size:17px;margin-top:22px;line-height:25px">The same stock is never promised to two jobs.</div></div>
 <div class="cd" style="left:0;top:544px;width:958px;height:162px" id="so_bom">${head("GitBranch", "BOM · FH-220 rev C")}<div class="row" style="margin-top:20px;gap:12px"><span class="pill g">Forged blank · 1</span><span class="pill g">Operation routing · 4 ops</span><span class="pill g">Fasteners M8 · 4</span></div></div>`);
      const p4 = P(`<div class="cd" id="so_scan" style="left:0;top:0;width:300px;height:430px">${head("ScanLine", "Scan to start")}<div style="position:relative;margin:30px auto 0;width:220px;height:130px;border-radius:12px;background:#fff;border:1.5px solid #e3eaf5;display:flex;align-items:center;justify-content:center;gap:4px">${[...Array(22)].map((_, i) => `<i style="display:block;width:${[3, 5, 2, 4, 2, 6, 3][i % 7]}px;height:90px;background:#0f2347"></i>`).join("")}<i id="so_laser" style="position:absolute;left:8px;right:8px;top:20px;height:3px;background:#f97316;box-shadow:0 0 12px #f97316"></i></div><div style="font-size:20px;font-weight:800;margin-top:18px;text-align:center">RC-0917 · OP20</div><div class="mut" style="font-size:16.5px;text-align:center;margin-top:4px">Operator D. Novak</div><div style="text-align:center;margin-top:16px"><span class="pill" id="so_started">${I("Check")}Job started</span></div></div>
 <div class="cd" id="so_mc" style="left:324px;top:0;width:300px;height:430px">${head("Cpu", "VMC-01")}<div class="ms run" style="margin-top:14px"><i></i>Running</div><div class="mut" style="font-size:17px;margin-top:30px">Cycle count from the machine</div><div class="big" style="font-size:64px" id="so_cc">0</div><div class="mut" style="font-size:16px">proposed for RC-0917 · OP20</div></div>
 <div class="cd" id="so_conf" style="left:648px;top:0;width:310px;height:430px">${head("UserCheck", "Operator confirms")}<div class="kv" style="margin-top:14px"><span class="k">Proposed</span><span class="v">500</span></div><div class="kv"><span class="k">Confirmed</span><span class="v" id="so_cf">—</span></div><div id="so_var" style="margin-top:12px;border-radius:14px;background:#fff1e6;padding:12px 14px;font-size:16.5px;font-weight:700;color:#9a3e0c;line-height:23px">Variance reason: 2 rejected, bore oversize</div><div class="btn p" id="so_btn" style="margin-top:16px;width:100%">${I("Check")}Confirm</div></div>
 <div class="cd" id="so_buy" style="left:0;top:454px;width:958px;height:252px">${head("BadgeCheck", "Buy-offs per stage")}<div class="row" style="margin-top:26px;gap:16px">${OPS.map((o, i) => `<div id="so_b${i}" style="flex:1;height:110px;border-radius:16px;background:#f5f8fd;padding:14px 16px"><div class="row" style="justify-content:space-between;font-size:19px;font-weight:800">${o[0]}<span id="so_bt${i}">${tick(false)}</span></div><div class="mut" style="font-size:16px;margin-top:8px">${o[1]}</div></div>`).join("")}</div></div>`);
      const FLOWI = [["Packing", "PackageCheck"], ["GST invoice", "Receipt"], ["IRN", "BadgeCheck"], ["E-way bill", "Truck"]];
      const p5 = P(`<div class="cd" id="so_coc" style="left:0;top:0;width:466px;height:440px">${head("FileCheck", "Inspection, FAIR & COC")}${[["Final inspection", "498 accepted"], ["FAIR", "Approved"], ["Certificate of conformance", "Issued"]].map((r, i) => `<div class="row" id="so_c${i}" style="margin-top:16px;height:56px;border-radius:14px;background:#f5f8fd;padding:0 16px;font-size:19px;font-weight:700">${tick(true)}${r[0]}<span class="mut" style="margin-left:auto;font-size:16.5px">${r[1]}</span></div>`).join("")}<div id="so_rec" style="margin-top:16px;border-radius:14px;background:#eaf2ff;padding:14px 16px;font-size:17px;font-weight:700;color:#1d4ed8;line-height:25px">Machining record on the COC: VMC-01 · OEE 82% (sample)</div></div>
 <div class="cd" id="so_inv" style="left:492px;top:0;width:466px;height:440px">${head("Receipt", "Dispatch & invoice", "INV-0418")}${FLOWI.map((f, i) => `<div class="row" id="so_i${i}" style="margin-top:16px;height:56px;border-radius:14px;background:#f5f8fd;padding:0 16px;font-size:19px;font-weight:700"><span style="display:flex;color:#2563eb;font-size:22px">${I(f[1])}</span>${f[0]}<span style="margin-left:auto" id="so_it${i}">${tick(false)}</span></div>`).join("")}<div class="mut" style="font-size:16.5px;margin-top:16px">One flow, nothing typed twice</div></div>
 <div class="cd" id="so_tally" style="left:0;top:464px;width:958px;height:242px">${head("BookOpen", "Accounts stay in Tally")}<div class="row" style="margin-top:28px;gap:24px;justify-content:center"><div style="width:250px;height:100px;border-radius:18px;background:#1e3a6e;color:#fff;display:flex;align-items:center;justify-content:center;gap:12px;font-size:22px;font-weight:800">${I("Factory")}Synax</div><div style="position:relative;width:250px;height:8px;border-radius:4px;background:#e8eef8;overflow:hidden"><i id="so_vch" style="position:absolute;top:0;height:100%;width:60px;border-radius:4px;background:#f97316"></i></div><div style="width:250px;height:100px;border-radius:18px;background:#fff1e6;color:#9a3e0c;display:flex;align-items:center;justify-content:center;gap:12px;font-size:22px;font-weight:800">${I("BookOpen")}Tally</div></div><div class="mut" style="font-size:16.5px;text-align:center;margin-top:14px">Vouchers go across through the Tally bridge</div></div>`);
      const GEN = [["Part FH-220 #0417", "Package"], ["Route card RC-0917", "Layers"], ["VMC-01 · D. Novak", "Cpu"], ["Material lot 4410 – 4909", "PackageCheck"], ["PO-4471 · line 10", "Receipt"]];
      const p6 = P(`<div class="cd" style="left:0;top:0;width:958px;height:706px">${head("GitBranch", "Quality Genealogy", "TRACE BACK")}<div style="position:relative;margin-top:36px;height:560px">${GEN.map((g, i) => `<div id="so_g${i}" style="position:absolute;left:${30 + i * 112}px;top:${i * 104}px;width:410px;height:86px;border-radius:18px;background:${i ? "#f5f8fd" : "#1e3a6e"};color:${i ? "#0f2347" : "#fff"};display:flex;align-items:center;gap:16px;padding:0 22px;font-size:22px;font-weight:800;white-space:nowrap"><span style="display:flex;font-size:28px;color:${i ? "#2563eb" : "#93c5fd"}">${I(g[1])}</span>${g[0]}</div>`).join("")}<svg style="position:absolute;left:0;top:0" width="900" height="560">${[0, 1, 2, 3].map((i) => `<path id="so_gl${i}" d="M ${70 + i * 112} ${86 + i * 104} L ${70 + i * 112} ${104 + i * 104 + 43} L ${30 + (i + 1) * 112} ${104 + i * 104 + 43}" stroke="#93c5fd" stroke-width="4" fill="none" stroke-dasharray="6 8"/>`).join("")}</svg></div></div>`);
      const panels = [p1, p2, p3, p4, p5, p6];
      const tP = [T0 + 0.6, S("r2", -0.1), S("r4", -0.1), S("r6", -0.1), W("r9", "Inspection", 0, -0.3), S("r10", -0.1)];
      const tStep = [T0 + 0.6, W("r3", "booked"), W("r5", "route"), W("r7", "scans"), W("r9", "certificate"), W("r9", "GST")];
      tP.forEach((x) => sfx(x, "swish", 0.35));
      win.key(T0 + 0.6, "cpo");
      win.key(W("r1", "quoted"), "rfq");
      win.key(W("r1", "open"), "cpod");
      win.key(W("r3", "gate"), "gate");
      win.key(W("r3", "material"), "cmat");
      win.key(W("r3", "tracked"), "jwt");
      win.key(W("r5", "route"), "rcg");
      win.key(W("r5", "reserved"), "rci");
      win.key(W("r7", "scans"), "olog");
      win.key(W("r7", "machine"), "rcp");
      win.key(W("r9", "Inspection"), "fic");
      win.key(W("r9", "FAIR"), "fair");
      win.key(W("r9", "packing"), "pd");
      win.key(W("r9", "GST"), "ci");
      win.key(W("r9", "eway"), "dc");
      win.key(W("r11", "traces"), "gen");
      s.apply = (time) => {
        tt(time, T0 + 0.1);
        show(win.el, time, T0 + 0.2, null, { dy: 40, sc: 0.97, d: 0.7 });
        win.apply(time);
        let k = -1;
        tStep.forEach((x, j) => time >= x && (k = j));
        const allDone = time > W("r11", "traces");
        PASS.forEach((_, i) => {
          const el = $("so_f" + i);
          cls(el, "on", !allDone && i === k);
          cls(el, "done", allDone || i < k);
        });
        panels.forEach((p, i) => show(p, time, tP[i], i < 5 ? tP[i + 1] - 0.05 : SC.ai.t0 + 1, { dy: 18, sc: 0.985 }));
        // 1 PO
        let left = 0;
        LINES_PO.forEach((l, i) => {
          const u = sm(pr(time, W("r1", "open") + i * 0.2, W("r1", "open") + 0.9 + i * 0.2));
          const open = (l[3] - l[4]) * u;
          $("so_ob" + i).style.width = ((open / 500) * 100).toFixed(1) + "%";
          $("so_ov" + i).textContent = Math.round(open);
          left += open;
          show($("so_l" + i), time, tP[0] + 0.4 + i * 0.2, null, { dy: 8, sc: 1 });
        });
        $("so_left").textContent = Math.round(left);
        show($("so_q"), time, W("r1", "quoted", 0, -0.2), null);
        [0, 1, 2].forEach((i) => show($("so_rev" + i), time, W("r1", "revision", 0, -0.2) + i * 0.2, null, { sc: 0.7, dy: 0 }));
        show($("so_open"), time, W("r1", "open", 0, -0.2), null);
        // 2 material
        show($("so_gate"), time, W("r3", "gate", 0, -0.3), null);
        show($("so_grn"), time, W("r3", "challan", 0, -0.1), null);
        show($("so_led"), time, W("r3", "tracked", 0, -0.3), null);
        const tl = [W("r3", "booked"), W("r3", "issue"), W("r3", "consumption"), W("r3", "returns"), W("r3", "scrap")];
        LED.forEach((_, i) => {
          show($("so_n" + i), time, tl[i], null, { dy: 14, sc: 0.85 });
          $("so_n" + i).style.boxShadow = time > tl[i] && time < tl[i] + 0.8 ? "0 0 0 3px #93c5fd" : "";
        });
        show($("so_bal"), time, W("r3", "invoiced", 0, -0.1), null, { sc: 0.8 });
        show($("so_itc"), time, W("r3", "invoiced", 0, 0.3), null, { sc: 0.8 });
        // 3 route card
        OPS.forEach((o, i) => show($("so_op" + i), time, W("r5", "route") + 0.2 + i * 0.2, null, { dy: 8, sc: 1 }));
        show($("so_bom"), time, W("r5", "bill", 0, -0.2), null);
        show($("so_res"), time, W("r5", "reserved", 0, -0.1), null, { sc: 0.8 });
        show($("so_twice"), time, W("r5", "never", 0, -0.6), null);
        show($("so_blk"), time, W("r5", "promised", 0, -0.1), null, { dx: 20, dy: 0 });
        // 4 machine-confirmed
        show($("so_scan"), time, W("r7", "operator", 0, -0.2), null);
        $("so_laser").style.top = (20 + 90 * (0.5 + 0.5 * Math.sin(time * 6))).toFixed(1) + "px";
        $("so_laser").style.opacity = time > W("r7", "scans") && time < W("r7", "start", 0, 0.4) ? 1 : 0;
        show($("so_started"), time, W("r7", "start", 0, 0.1), null, { sc: 0.7 });
        show($("so_mc"), time, W("r7", "machine", 0, -0.3), null);
        $("so_cc").textContent = Math.round(500 * sm(pr(time, W("r7", "machine"), W("r7", "count", 0, 0.4))));
        show($("so_conf"), time, W("r7", "operator", 1, -0.3), null);
        const tCf = W("r7", "confirms");
        $("so_cf").textContent = time > tCf ? "498" : "—";
        show($("so_var"), time, W("r7", "reason", 0, -0.2), null, { dy: 8 });
        $("so_btn").style.background = time > tCf ? "#1e3a6e" : "";
        $("so_btn").style.transform = time > tCf && time < tCf + 0.18 ? "scale(.95)" : "";
        show($("so_buy"), time, E("r7", -0.6), null);
        OPS.forEach((o, i) => ($("so_bt" + i).innerHTML = tick(time > E("r7", -0.3) + i * 0.3 && i < 2)));
        // 5 COC + invoice + Tally
        show($("so_coc"), time, W("r9", "Inspection", 0, -0.2), null);
        [0, 1, 2].forEach((i) => show($("so_c" + i), time, [W("r9", "Inspection"), W("r9", "FAIR"), W("r9", "certificate")][i], null, { dy: 8, sc: 1 }));
        show($("so_rec"), time, W("r9", "machining", 0, -0.2), null, { dy: 8 });
        show($("so_inv"), time, W("r9", "packing", 0, -0.3), null);
        const ti = [W("r9", "packing"), W("r9", "GST"), W("r9", "I"), W("r9", "eway")];
        ti.forEach((x, i) => {
          show($("so_i" + i), time, x - 0.15, null, { dy: 8, sc: 1 });
          $("so_it" + i).innerHTML = tick(time > x + 0.3);
        });
        show($("so_tally"), time, W("r9", "vouchers", 0, -0.3), null);
        const vu = ((time - W("r9", "vouchers")) * 0.7) % 1;
        $("so_vch").style.left = (vu * 250 - 60).toFixed(1) + "px";
        $("so_vch").style.opacity = time > W("r9", "vouchers") ? 1 : 0;
        // 6 trace back
        const tg = [W("r11", "part"), W("r11", "P", 0, -0.3), W("r11", "machine"), W("r11", "lot"), W("r11", "P")];
        const order = [0, 1, 2, 3, 4];
        GEN.forEach((g, i) => {
          const x = [W("r11", "traces", 0, -0.2), W("r11", "back"), W("r11", "P", 0, -0.1), W("r11", "lot", 0, -0.2), W("r11", "machine", 0, -0.1)][order[i]];
          show($("so_g" + i), time, x, null, { dx: -30, dy: 0 });
          const gl = $("so_gl" + (i - 1));
          if (gl) gl.style.opacity = pr(time, x, x + 0.4);
        });
      };
      convo(["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10", "r11"]);
      SAGE.gest(W("r1", "customer", 0, -0.2), W("r1", "kept"), "point");
      both(W("r1", "customer"), { x: 1300, y: 330 });
      both(W("r1", "open", 0, 0.2), { x: 1600, y: 760 });
      PIP.emo(S("r2"), E("r2"), "curious");
      SAGE.gest(W("r3", "gate", 0, -0.2), W("r3", "Then"), "point");
      both(W("r3", "gate", 0, 0.2), { x: 1100, y: 420 });
      both(W("r3", "tracked"), { x: 1350, y: 780 });
      PIP.emo(S("r4"), E("r4"), "curious");
      SAGE.gest(W("r5", "route", 0, -0.2), W("r5", "reserved"), "point");
      both(W("r5", "route", 0, 0.2), { x: 1150, y: 500 });
      both(W("r5", "never"), { x: 1700, y: 520 });
      PIP.emo(S("r6"), E("r6"), "curious");
      both(W("r7", "scans"), { x: 1030, y: 450 });
      both(W("r7", "machine"), { x: 1330, y: 450 });
      both(W("r7", "confirms"), { x: 1650, y: 450 });
      PIP.emo(S("r8"), E("r8", 0.5), "happy");
      PIP.gest(S("r8"), E("r8", 0.4), "flapjoy");
      sfx(E("r8", -0.2), "chirp", 0.3);
      SAGE.gest(W("r9", "Inspection", 0, -0.2), W("r9", "vouchers"), "point");
      both(W("r9", "Inspection", 0, 0.2), { x: 1100, y: 450 });
      both(W("r9", "packing"), { x: 1600, y: 450 });
      both(W("r9", "vouchers"), { x: 1350, y: 830 });
      PIP.emo(S("r10"), E("r10"), "curious");
      SAGE.gest(W("r11", "Yes", 0, -0.1), E("r11"), "point");
      both(W("r11", "traces"), { x: 1300, y: 600 });
    });

    /* =====================================================================================
       4. THE AI BOT: Synax agents watch, propose, and people approve
       ===================================================================================== */
    const darkIn = SC.ai.t0 - 0.2;
    const darkOut = SC.end.t0 + 0.1;
    const bot = mk($("birds"), `<div class="bot"><svg viewBox="-150 -200 300 300">
  <ellipse cx="0" cy="88" rx="70" ry="12" fill="rgba(147,197,253,.35)" id="bt_sh"/>
  <g id="bt_all">
   <line x1="0" y1="-128" x2="0" y2="-160" stroke="#cbd5e1" stroke-width="6"/><circle id="bt_ant" cx="0" cy="-166" r="11" fill="#fb923c"/>
   <g id="bt_armL"><rect x="-108" y="-8" width="26" height="62" rx="13" fill="#dbe6f7"/></g>
   <g id="bt_armR"><rect x="82" y="-8" width="26" height="62" rx="13" fill="#dbe6f7"/></g>
   <rect x="-70" y="-20" width="140" height="96" rx="34" fill="#eef4ff" stroke="#c7d6ee" stroke-width="3"/>
   <circle cx="0" cy="26" r="16" fill="#2563eb" id="bt_core"/><circle cx="0" cy="26" r="7" fill="#bfdbfe"/>
   <rect x="-92" y="-132" width="184" height="124" rx="44" fill="#fff" stroke="#c7d6ee" stroke-width="3"/>
   <rect x="-72" y="-114" width="144" height="84" rx="30" fill="#0f2347"/>
   <g id="bt_eyes"><rect id="bt_e1" x="-44" y="-90" width="26" height="34" rx="13" fill="#7dd3fc"/><rect id="bt_e2" x="18" y="-90" width="26" height="34" rx="13" fill="#7dd3fc"/></g>
   <path id="bt_mouth" d="M-18,-46 Q0,-36 18,-46" stroke="#7dd3fc" stroke-width="5" stroke-linecap="round" fill="none"/>
   <circle cx="-100" cy="-70" r="12" fill="#dbe6f7"/><circle cx="100" cy="-70" r="12" fill="#dbe6f7"/>
  </g></svg></div>`);
    addScene("ai", SC.ai.t0, SC.end.t0 + 0.3, (root, s) => {
      const T0 = SC.ai.t0;
      const tt = title(root, "Synax agents", "Bot", "AI that <b>keeps watch</b>", "It proposes. You approve.", { dark: true });
      const beam = mk(root, `<svg style="position:absolute;inset:0" width="1920" height="1080"><polygon id="ai_beam" points="0,0 0,0 0,0" fill="rgba(125,211,252,.18)"/></svg>`);
      const WATCH = [["Challans past their return date", "3 challans · Orion Aero, Kestrel Motors", "Repeat", "o"], ["Ready to dispatch", "PO-4471 · 498 pcs · COC issued", "Truck", ""], ["Quality compliance", "Calibration due · gauge G-12", "ShieldCheck", "o"]];
      const wEls = WATCH.map((w, i) => mk(root, `<div class="chat" style="left:1040px;top:${90 + i * 150}px;width:820px;height:128px;padding:22px 26px"><div class="row" style="gap:18px"><div class="ic" style="width:60px;height:60px;border-radius:16px;background:${w[3] ? "#fff1e6" : "#eaf2ff"};color:${w[3] ? "#c2560f" : "#2563eb"};display:flex;align-items:center;justify-content:center;font-size:30px">${I(w[2])}</div><div><div style="font-size:24px;font-weight:800">${w[0]}</div><div class="mut" style="font-size:18px;margin-top:4px">${w[1]}</div></div><span class="pill ${w[3] ? "o" : ""}" style="margin-left:auto">${w[3] ? "Needs action" : "Ready"}</span></div></div>`));
      const prop = mk(root, `<div class="chat" style="left:1040px;top:560px;width:820px;height:420px;padding:28px 32px"><div class="ch"><div class="ic n">${I("Bot")}</div>Synax Agent · Challan reconciliation<small>PROPOSAL</small></div><div style="font-size:28px;font-weight:800;margin-top:20px;line-height:38px">Send return reminders for 3 overdue challans</div><div class="row" style="margin-top:24px;gap:14px"><div class="btn p" id="ai_ok">${I("Check")}Approve</div><div class="btn s">Reject</div><span class="pill g" id="ai_st" style="margin-left:8px">Waiting for: Stores manager</span></div><div id="ai_hist" style="margin-top:22px;border-radius:14px;background:#f3f6fb;padding:14px 18px;font-size:17px;font-weight:700;color:#3d5479;line-height:28px"><div class="row" style="gap:10px">${I("History")}14:20 · proposed by Synax Agent</div><div class="row" style="gap:10px">${I("UserCheck")}14:32 · approved by A. Novak (Stores manager)</div><div class="row" style="gap:10px">${I("Send")}14:32 · reminders sent · recorded</div></div></div>`);
      const stars = $("stars");
      for (let i = 0; i < 70; i++) mk(stars, `<div class="star" data-k="${i}" style="left:${(hsx(i, 1) * 1920).toFixed(0)}px;top:${(hsx(i, 2) * 1080).toFixed(0)}px;transform:scale(${(0.5 + hsx(i, 3) * 1.2).toFixed(2)})"></div>`);
      const tBot = W("s2", "Meet", 0, -0.2);
      const tW = [W("s2", "challans", 0, -0.1), W("s2", "orders", 0, -0.1), W("s2", "quality", 0, -0.1)];
      const tProp = W("s2", "propose", 0, -0.2);
      const tOk = W("s4", "yes", 0, -0.05);
      sfx(T0 + 0.3, "sweep", 0.35);
      sfx(tBot, "chime", 0.5);
      sfx(tBot + 0.1, "chirp", 0.15);
      tW.forEach((x) => sfx(x, "ping", 0.35));
      sfx(tProp, "pop", 0.5);
      sfx(tOk, "click", 0.6);
      sfx(tOk + 0.15, "success", 0.5);
      s.apply = (time) => {
        tt(time, T0 + 0.2);
        wEls.forEach((w, i) => {
          show(w, time, tW[i], null, { dx: 60, dy: 0 });
          w.style.boxShadow = time > tW[i] && time < tW[i] + 1.4 ? "0 0 0 4px rgba(125,211,252,.6),0 40px 100px rgba(0,0,0,.35)" : "";
        });
        show(prop, time, tProp, null, { dy: 50 });
        const ok = $("ai_ok");
        ok.style.background = time > tOk ? "#1e3a6e" : "";
        ok.style.transform = time > tOk && time < tOk + 0.2 ? "scale(.94)" : "";
        $("ai_st").textContent = time > tOk ? "Approved" : "Waiting for: Stores manager";
        $("ai_st").className = "pill " + (time > tOk ? "" : "g");
        [...$("ai_hist").children].forEach((r, i) => (r.style.opacity = i === 0 ? (time > tProp + 0.4 ? 1 : 0) : time > tOk + 0.2 + (i - 1) * 0.3 ? 1 : 0));
        // scanning beam from the bot's eyes to the card it is watching
        let tgt = null;
        tW.forEach((x, i) => time > x && time < (tW[i + 1] || tProp) && (tgt = 90 + i * 150 + 64));
        if (time > tProp && time < tOk) tgt = 700;
        const bx = botPos(time);
        const pg = $("ai_beam");
        if (tgt != null && bx) {
          pg.setAttribute("points", `${bx[0] + 30},${bx[1] - 80} 1040,${tgt - 60} 1040,${tgt + 60}`);
          pg.style.opacity = 0.6 + 0.4 * Math.sin(time * 8);
        } else pg.style.opacity = 0;
      };
      convo(["s1", "s2", "s3", "s4", "s5"]);
      PIP.emo(S("s1"), E("s1"), "curious");
      PIP.emo(tBot, tBot + 2.0, "surprised");
      both(tBot + 0.1, { x: 760, y: 470 });
      SAGE.gest(tBot, W("s2", "watch"), "point");
      both(tW[0], { x: 1300, y: 160 });
      both(tProp, { x: 1300, y: 700 });
      PIP.emo(S("s3"), E("s3", 0.3), "surprised");
      PIP.look(S("s3"), { x: 760, y: 470 });
      SAGE.gest(S("s4"), W("s4", "changes"), "shake");
      both(W("s4", "yes"), { x: 1150, y: 640 });
      PIP.emo(S("s5"), E("s5", 0.5), "happy");
      PIP.gest(W("s5", "like", 0, -0.3), E("s5", 0.5), "flapjoy");
    });
    // the bot: floats in at "Meet", watches, nods on approval, waves at the end
    function botPos(time) {
      const tIn = W("s2", "Meet", 0, -0.4);
      if (time < tIn) return null;
      const u = sm(pr(time, tIn, tIn + 1.0));
      const end = SC.end.t0;
      const e = sm(pr(time, end + 0.2, end + 1.4));
      const x = lerp(lerp(2050, 770, u), 1670, e);
      const y = lerp(lerp(300, 560, u), 640, e) + 10 * Math.sin(time * 2.2);
      return [x, y, lerp(1, 0.62, e)];
    }

    /* =====================================================================================
       5. END CARD
       ===================================================================================== */
    const tEnd = SC.end.t0 + 0.2;
    addScene("end", SC.end.t0, TOTAL + 1, (root, s) => {
      sfx(tEnd, "endchime", 0.6);
      s.apply = (time) => {
        const e = $("end");
        const ea = sm(pr(time, tEnd, tEnd + 0.8));
        e.style.opacity = ea;
        e.style.transform = `translateY(${((1 - ea) * 30).toFixed(1)}px)`;
      };
      SAGE.move(tEnd, tEnd + 1.2, 330, 1012, 1.0, 1, "glide", 80);
      PIP.move(tEnd + 0.1, tEnd + 1.3, 1450, 1012, 0.96, -1, "fly", 110);
      both(tEnd + 0.5, "front");
      SAGE.emo(tEnd + 1.3, TOTAL + 1, "happy");
      PIP.emo(tEnd + 1.3, TOTAL + 1, "happy");
      PIP.gest(L.t1.end + 0.2, TOTAL + 1, "wave");
      SAGE.gest(L.t1.end + 0.5, TOTAL + 1, "wave");
    });

    /* ---------- camera ---------- */
    cam(SC.sol.t0, 1.0);
    cam(SC.ai.t0, 1.0);
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
    const world = $("world");
    const dark = $("dark");
    const fade = $("fade");
    window.__apply = (time) => {
      const [, s, cx, cy] = camAt(time);
      world.style.transform = s === 1 ? "" : `translate(${((960 - cx) * (s - 1)).toFixed(1)}px,${((540 - cy) * (s - 1)).toFixed(1)}px) scale(${s.toFixed(4)})`;
      fade.style.opacity = 1 - sm(pr(time, 0, 0.7));
      const da = Math.min(sm(pr(time, darkIn, darkIn + 0.8)), 1 - sm(pr(time, darkOut, darkOut + 0.8)));
      dark.style.opacity = da;
      $("stars").style.opacity = da;
      if (da > 0) [...$("stars").children].forEach((st) => (st.style.opacity = (0.35 + 0.65 * Math.abs(Math.sin(time * (0.6 + hsx(+st.dataset.k, 4)) + +st.dataset.k))).toFixed(2)));
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
      // bot
      const bp = botPos(time);
      if (!bp) bot.style.display = "none";
      else {
        bot.style.display = "block";
        bot.style.transform = `translate(${bp[0].toFixed(1)}px,${bp[1].toFixed(1)}px) scale(${bp[2].toFixed(3)})`;
        const bi = Math.floor(time / 2.7);
        const bt = time - bi * 2.7 - 1.3;
        const blink = bt > 0 && bt < 0.15 ? 0.15 : 1;
        $("bt_eyes").setAttribute("transform", `translate(0,-73) scale(1,${blink}) translate(0,73)`);
        const approved = time > W("s4", "yes");
        $("bt_mouth").setAttribute("d", approved ? "M-20,-48 Q0,-30 20,-48" : "M-18,-46 Q0,-38 18,-46");
        $("bt_ant").setAttribute("fill", Math.floor(time * 2) % 2 ? "#fb923c" : "#fdba74");
        $("bt_core").setAttribute("fill", approved ? "#1e3a6e" : "#2563eb");
        const wave = time > L.t1.end + 0.3 ? -40 + 30 * Math.sin(time * 9) : time > W("s2", "Meet") && time < W("s2", "Meet", 0, 1.4) ? -50 + 30 * Math.sin(time * 9) : 0;
        $("bt_armR").setAttribute("transform", `rotate(${wave.toFixed(1)},95,0)`);
        const nod = approved && time < W("s4", "yes", 0, 1.2) ? 8 * Math.sin((time - W("s4", "yes")) * 12) : 0;
        $("bt_all").setAttribute("transform", `rotate(${(nod + 3 * Math.sin(time * 1.3)).toFixed(2)},0,-40)`);
        $("bt_sh").setAttribute("opacity", da > 0.5 ? 1 : 0.4);
      }
    };
    window.__total = TOTAL;
    window.__meta = {
      total: TOTAL,
      scenes: Object.fromEntries(Object.entries(SC).map(([k, v]) => [k, [v.t0, v.t1]])),
      lines: LINES.map((l) => ({ id: l.id, who: l.who, start: L[l.id].start, end: L[l.id].end })),
      sfx: SFX.sort((a, b) => a[0] - b[0]),
      dark: [darkIn, darkOut],
      mfg: [0.5, SC.reveal.t0],
      poster: E("q1", -1.0),
      endcard: tEnd,
    };
    window.__apply(0);
    window.__ready = true;
  } catch (e) {
    window.__err = (e && e.stack) || String(e);
  }
})();
