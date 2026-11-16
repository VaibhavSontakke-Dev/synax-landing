/* The tour, scene by scene. Each beat is one narration clip (narration.js) plus the actions that happen while it is spoken.
   Times come from the voice: b.w("word") is the moment that word is spoken. Actions chain with the end time they return, and
   the cursor always arrives on time. All people, dates and values are fictional demo data used consistently across screens. */
const ROLES = ["Full Stack Developer", "DevOps Engineer", "QA Engineer", "UI/UX Designer", "Business Analyst"];
const INTERVIEWERS = ["Mia Johansson", "Paul Evans", "Peter Lindberg"];
const DEPTS = ["Engineering", "Human Resources", "Quality Assurance", "Design", "Sales & Marketing", "Finance & Legal"];
const PROJECTS = ["Customer Portal", "Payroll Suite", "Mobile App", "Analytics Hub"];
const PEOPLE = ["Oliver Bennett", "Julia Meyer", "Laura Schmidt", "Felix Wagner", "Victor Hale", "Lucas Moreau"];
const late = (...a) => Math.max(...a);

const SCENES = [
  /* ===== Home: open HRMS ===== */
  {
    id: "home",
    beats: [
      (b) => {
        b.shot("home.banner", 1.25, b.s - 0.1, { ease: 1.2, dy: 120 });
        b.hover("home.banner", b.w("Synax", 0.0), { fx: 0.55, fy: 0.9 });
        b.shot(["home.m:Projects", "home.m:People & HR", "home.m:Assets"], 1.2, b.w("Recruit", -0.4), { ease: 1.0, dy: -20 });
        b.ring("home.m:People & HR", b.w("Recruit", -0.1), b.w("workspace", 0.9), { r: 18, pad: 4 });
        b.hover("home.m:People & HR", b.w("onboard", 0.0), { fx: 0.4, fy: 0.3 });
        b.shot("nav:HRMS", 1.3, b.w("Let's", -0.2), { ease: 1.1 });
        b.ring("nav:HRMS", b.w("open", -0.3), b.w("sidebar", 1.0), { r: 20, pad: 3 });
        b.expand(b.w("sidebar", 0.05));
      },
    ],
  },

  /* ===== 1. Employee management ===== */
  {
    id: "emp-list", chapter: "Employee Management", chapterSub: "People, profiles and records", page: "emplist", nav: "sub:Employee List",
    beats: [
      (b) => {
        b.shot("el.tabs", 1.2, b.w("header", -0.4), { dy: 150 });
        b.ring("el.chip", b.w("total", -0.1), b.w("records", 0.8), { pad: 5, r: 13 });
        b.hover("el.tab0", b.w("live", 0.1), { fx: 0.3 });
        b.hover("el.tab1", b.w("developers", 0.05), { fx: 0.3 });
        b.hover("el.tab2", b.w("staff", 0.0), { fx: 0.3 });
        b.hover("el.tab3", b.w("left", 0.0), { fx: 0.3 });
        b.hover("el.tab4", b.w("extra", 0.0), { fx: 0.3 });
        b.hover("el.tab5", b.w("extra", 0.85), { fx: 0.3 });
        b.hover("el.tab6", b.w("bench", 0.0), { fx: 0.3 });
        b.ring("el.tabs", b.w("tabs", -0.1), b.w("bench", 1.0), { pad: 4, r: 14 });
      },
      (b) => {
        b.shot(["el.search", "el.sortf", "el.sortd", "el.company"], 1.25, b.w("Need", -0.3), { dy: 230 });
        b.fill("el.search", "Julia", b.w("Search", 0.15), { cps: 5.2, seed: 2 });
        const lt = b.lastType;
        const hideAt = lt.t0 + lt.kt[2] + 0.05;
        const others = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        others.forEach((i) => b.hide("el.row" + i, hideAt));
        const te = b.w("also", -0.25);
        const ee = b.erase("el.search", "Julia", te, { cps: 14 });
        others.forEach((i) => b.show("el.row" + i, ee - 0.05, false));
        b.ring(["el.sortf", "el.sortd"], b.w("sort", -0.1), b.w("sort", 1.7), { pad: 5, r: 12 });
        b.hover("el.sortf", b.w("sort", 0.05), { fx: 0.5 });
        b.ring("el.company", b.w("company", -0.1, 2), b.w("company", 1.5, 2), { pad: 5, r: 12 });
        b.hover("el.company", b.w("company", 0.05, 2), { fx: 0.5 });
      },
      (b) => {
        b.shot(["el.row0", "el.row1", "el.row2"], 1.15, b.w("Each", -0.3), { dy: 10 });
        b.ring("el.row0", b.w("department", -0.2), b.w("project", 0.9), { pad: 3, r: 6 });
        b.hover("el.edit0", b.w("Edit", 0.0), {});
        b.hover("el.del0", b.w("Delete", 0.0), {});
        b.shot(["el.add", "el.export"], 1.55, b.w("Export", -0.9), { ease: 1.0 });
        b.ring("el.export", b.w("Export", -0.1), b.w("Excel", 1.1), { pad: 5, r: 11 });
        b.hover("el.export", b.w("Excel", 0.0), {});
        b.ring("el.add", b.w("Add", -0.2), b.w("employee", 0.9), { pad: 5, r: 11 });
        b.hover("el.add", b.w("Add", 0.05), {});
      },
    ],
  },
  {
    id: "emp-add", page: "empadd", nav: "sub:Employee Add", chapter: "Employee Management",
    beats: [
      (b) => {
        b.shot("ea.tabs", 1.22, b.w("profile", -0.2), { dy: 190 });
        const tabs = [["Personal", 0], ["Employment", 1], ["Contact", 2], ["Identification", 3], ["Bank", 4], ["Education", 5], ["Legal", 6], ["KYC", 7], ["Projects", 8]];
        tabs.forEach(([w, i]) => b.hover("ea.tab" + i, b.w(w, 0.05), { fx: 0.3 }));
        b.ring("ea.tabs", b.w("tabs", -0.1), b.w("Projects", 1.0), { pad: 4, r: 14 });
        b.ring("ea.badge0", b.w("first", -0.1), b.w("completion", 0.9), { pad: 6, r: 10 });
      },
      (b) => {
        b.shot(["ea.name", "ea.dob"], 1.3, b.w("Start", -0.2), { dy: 120 });
        let t = b.fill("ea.name", "Sophie Laurent", b.w("full", -0.05), { cps: 10, seed: 4 });
        b.fill("ea.dob", "14-08-1997", late(t, b.w("date", -0.05)), { fx: 0.3 });
      },
      (b) => {
        b.shot(["ea.gender", "ea.father", "ea.marital"], 1.2, b.w("Choose", -0.3), { dy: 160 });
        let t = b.pick("ea.gender", "Female", b.w("gender", -0.1), { options: ["Male", "Female", "Other"] });
        t = b.fill("ea.father", "Henri Laurent", late(t, b.w("fathers", -0.1)), { cps: 10, seed: 5 });
        b.pick("ea.marital", "Single", late(t, b.w("marital", -0.1)), { options: ["Single", "Married", "Divorced", "Widowed"] });
      },
      (b) => {
        b.shot(["ea.nation", "ea.blood", "ea.submit"], 1.2, b.w("Nationality", -0.3), { dy: 80 });
        b.ring("ea.nation", b.w("Nationality", -0.1), b.w("Indian", 0.9), { pad: 5, r: 12 });
        let t = b.pick("ea.blood", "B+", late(b.w("blood", -0.15), 0), { options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], w: 320 });
        const tc = b.click("ea.submit", late(t, b.w("Submit", -0.1)), {});
        b.html("ea.submit", "Submitting…", tc + 0.12);
        b.html("ea.submit", "Submit", tc + 1.1);
        b.sound("success", tc + 1.0, 0.8);
      },
    ],
  },

  /* ===== 2. Recruitment and interviews ===== */
  {
    id: "int-list", chapter: "Recruitment & Interviews", chapterSub: "Hire the right people, faster", page: "intlist", nav: "sub:Interview List",
    beats: [
      (b) => {
        b.shot(["il.th", "il.row2"], 1.12, b.w("Interview", -0.3), { dy: 60 });
        b.ring("il.chip", b.w("tracks", -0.1), b.w("pipeline", 0.5), { pad: 5, r: 13 });
        b.ring("il.th", b.w("candidate", -0.1), b.w("role", 1.0), { pad: 3, r: 6 });
        b.hover("il.row1", b.w("rating", 0.0), { fx: 0.55 });
      },
      (b) => {
        b.shot(["il.role", "il.interviewer", "il.row0", "il.row2"], 1.12, b.w("Use", -0.3), { dy: 60 });
        let t = b.pick("il.role", "Full Stack Developer", b.w("role", -0.15), { options: ROLES, w: 523 });
        [1, 3, 4, 5].forEach((i) => b.hide("il.row" + i, t));
        t = b.pick("il.interviewer", "Paul Evans", late(t + 0.1, b.w("interviewer", -0.15)), { options: INTERVIEWERS, w: 523 });
        b.hide("il.row0", t);
      },
    ],
  },
  {
    id: "int-add", page: "intadd", nav: "sub:Interview Add", chapter: "Recruitment & Interviews",
    beats: [
      (b) => {
        b.shot(["ia.resume", "ia.name", "ia.texp"], "fit", b.w("Upload", -0.8), { max: 1.2 });
        const tc = b.click("ia.resume", b.w("Upload", 0.05), { fx: 0.04 });
        b.set("ia.resume", "Noah_Becker_Resume.pdf", tc + 0.5);
        const ta = b.w("extracts", 0.0);
        b.set("ia.name", "Noah Becker", ta + 0.25);
        b.set("ia.email", "noah.becker@example.com", ta + 0.55);
        b.set("ia.mobile", "7700543210", ta + 0.85);
        b.set("ia.tech", "React, Node.js, TypeScript", ta + 1.15);
        b.set("ia.texp", "4.5", ta + 1.45);
        b.ring(["ia.name", "ia.email", "ia.mobile"], ta + 0.15, ta + 2.9, { pad: 5, r: 12 });
        b.ring(["ia.tech", "ia.texp"], ta + 1.05, ta + 2.9, { pad: 5, r: 12 });
        b.until(ta + 2.2);
      },
      (b) => {
        b.shot(["ia.date", "ia.stage", "ia.dept"], 1.25, b.w("Review", -0.2), { dy: 40 });
        let t = b.fill("ia.date", "17-11-2026", b.w("date", -0.1), { fx: 0.3 });
        t = b.pick("ia.stage", "Technical Round", late(t, b.w("stage", -0.3)), { options: ["Screening", "Technical Round", "HR Round", "Offered", "Rejected"] });
        b.pick("ia.dept", "Engineering", late(t, b.w("department", -0.25)), { options: DEPTS });
      },
      (b) => {
        b.shot(["ia.rexp", "ia.ctc", "ia.octc"], 1.25, b.w("Add", -0.3), { dy: 20 });
        let t = b.fill("ia.rexp", "3.5", b.w("relevant", -0.1), { cps: 6 });
        t = b.fill("ia.ctc", "€ 9,000,000", late(t, b.w("current", -0.1)), { cps: 9 });
        b.fill("ia.octc", "€ 12,000,000", late(t, b.w("offered", -0.1)), { cps: 9 });
      },
      (b) => {
        b.shot(["ia.type", "ia.interviewer", "ia.in", "ia.out", "ia.cloc", "ia.oloc"], 1.12, b.w("Choose", -0.3), { dy: 30 });
        let t = b.pick("ia.type", "Video Call", b.w("type", -0.15), { options: ["Face to Face", "Video Call", "Telephonic"] });
        t = b.fill("ia.interviewer", "Mia Johansson", late(t, b.w("interviewer", -0.1)), { cps: 10 });
        t = b.fill("ia.in", "11:00", late(t, b.w("in", -0.1)), { fx: 0.3 });
        t = b.fill("ia.out", "12:00", late(t, b.w("out", -0.1)), { fx: 0.3 });
        t = b.fill("ia.cloc", "Berlin", late(t, b.w("candidate", -0.1)), { cps: 9 });
        b.fill("ia.oloc", "London", late(t, b.w("office", -0.1)), { cps: 9 });
      },
      (b) => {
        b.shot(["ia.fb", "ia.offer", "ia.addremark", "ia.save"], 1.12, b.w("Attach", -0.4), { dy: 40 });
        b.ring("ia.fb", b.w("feedback", -0.15), b.w("remark", -0.4), { pad: 5, r: 14 });
        let tc = b.click("ia.fbbtn", b.w("feedback", 0.1), { fx: 0.5 });
        b.set("ia.fbfile", "Feedback_Noah_Becker.pdf", tc + 0.5);
        tc = b.click("ia.addremark", b.w("add", -0.1), {});
        b.show("ia.remarkrow", tc + 0.15, "fade");
        let t = b.fill("ia.remark", "Strong in React and system design. Clear communicator.", tc + 0.7, { cps: 17, seed: 6, fx: 0.3 });
        b.ring("ia.offer", b.w("offer", -0.15), b.w("required", 1.0), { pad: 5, r: 14 });
        b.ring("ia.rating", b.w("rate", -0.1), b.w("candidate", 1.1), { pad: 8, r: 10 });
        b.hover("ia.rating", late(t, b.w("rate", 0.0)), { fx: 0.7 });
        tc = b.click("ia.save", late(t + 0.3, b.w("Save", -0.1)), {});
        b.html("ia.save", "Saving…", tc + 0.12);
        b.html("ia.save", "Save Interview", tc + 1.1);
        b.sound("success", tc + 1.0, 0.8);
      },
    ],
  },

  /* ===== 3. Attendance and breaks (menu tour: these pages are described from the sidebar) ===== */
  {
    id: "att", chapter: "Attendance & Breaks", chapterSub: "Time, overtime and break management",
    beats: [
      (b) => {
        b.spotOn = true;
        b.shot(["sub:Attendance Log", "sub:Break Pass"], 1.6, b.s - 0.3, { ease: 1.0 });
        b.ring("sub:Attendance Log", b.w("Attendance", -0.1), b.s + b.dur, { r: 18, pad: 3 });
        b.hover("sub:Attendance Log", b.w("Attendance", 0.05), { fx: 0.4 });
      },
      (b) => {
        b.spotOn = true;
        b.ring("sub:Attendance OT Approval", b.w("Attendance", -0.1), b.s + b.dur, { r: 18, pad: 3 });
        b.hover("sub:Attendance OT Approval", b.w("Attendance", 0.05), { fx: 0.4 });
      },
      (b) => {
        b.spotOn = true;
        b.ring("sub:Break Pass", b.w("Break", -0.1), b.s + b.dur, { r: 18, pad: 3 });
        b.hover("sub:Break Pass", b.w("Break", 0.05), { fx: 0.4 });
      },
    ],
  },

  /* ===== 4. Daily Work Management ===== */
  {
    id: "dwm-list", chapter: "Daily Work Management", chapterSub: "Plan, assign and track every task", page: "dwmlist", nav: "sub:DWM List",
    beats: [
      (b) => {
        b.shot(["dl.col0", "dl.col3"], 1.1, b.w("DWM", 0.1, 2), { dy: -90 });
        [["To Do", 0], ["In Progress", 1], ["Verification", 2], ["Done", 3]].forEach(([w, i]) => {
          const t = b.w(w, -0.05);
          b.ring("dl.col" + i, t, t + 1.5, { pad: 4, r: 16 });
          b.hover("dl.col" + i, t + 0.1, { fx: 0.5, fy: 0.12 });
        });
      },
      (b) => {
        b.shot(["dl.from", "dl.users", "dl.create"], 1.5, b.w("Filter", -0.4), { dx: -160, ease: 1.0 });
        b.ring(["dl.from", "dl.to"], b.w("date", -0.1), b.w("date", 1.4), { pad: 5, r: 12 });
        b.hover("dl.from", b.w("date", 0.0), { fx: 0.5 });
        b.ring("dl.users", b.w("user", -0.1), b.w("project", 0.8), { pad: 5, r: 12 });
        b.hover("dl.users", b.w("user", 0.05), { fx: 0.5 });
        b.shot(["dl.visible", "dl.done"], 1.9, b.w("visible", -0.8), { dx: -120, dy: 0, ease: 0.9 });
        [["visible", "dl.visible"], ["today", "dl.due"], ["overdue", "dl.over"], ["done", "dl.done"]].forEach(([w, k]) => {
          const t = b.w(w, -0.05);
          b.ring(K(k).parentElement, t, t + 1.1, { pad: 4, r: 12 });
          b.hover(K(k).parentElement, t + 0.1, { fx: 0.5 });
        });
        b.shot(["dl.col0", "dl.col1", "dl.col2"], 1.15, b.w("drag", -1.0), { dy: -100, ease: 0.9 });
        const t0 = b.w("drag", 0.1);
        const td = b.drag("dl.card0", "dl.cb1", t0, { dur: 1.0, fx: 0.5, fy: 0.55 });
        b.hide("dl.card0", td);
        b.show("dl.card0b", td, false);
        b.html("dl.cn0", "2", td);
        b.html("dl.cn1", "2", td);
        b.sound("success", td + 0.05, 0.6);
      },
    ],
  },
  {
    id: "dwm-add", page: "dwmadd", nav: "sub:DWM Add", chapter: "Daily Work Management",
    beats: [
      (b) => {
        b.shot(["dt.title", "dt.desc"], 1.2, b.w("Give", -0.3), { dy: 60 });
        let t = b.fill("dt.title", "Design onboarding screens", b.w("Give", 0.0), { cps: 12, seed: 7 });
        b.cls("dt.create", "dis", false, t + 0.2);
        b.fill("dt.desc", "Welcome, profile and permission screens in Figma.", late(t, b.w("detailed", -0.2)), { cps: 18, seed: 8 });
      },
      (b) => {
        b.shot(["dt.project", "dt.est", "dt.end", "dt.s.est"], 1.12, b.w("Pick", -0.3), { dy: 60 });
        let t = b.pick("dt.project", "Mobile App", b.w("project", -0.15), { options: PROJECTS });
        t = b.pick("dt.dept", "Design", late(t, b.w("department", -0.15)), { options: DEPTS });
        t = b.fill("dt.est", "120", late(t, b.w("estimated", -0.1)), { cps: 6, fx: 0.3 });
        b.html("dt.s.est", "120 mins", t + 0.05);
        t = b.fill("dt.end", "20-11-2026", late(t, b.w("end", -0.1)), { fx: 0.3 });
        b.html("dt.s.due", "Due in 4 days", t + 0.05);
        const tw = b.w("snapshot", -0.1);
        b.ring(K("dt.s.status").parentElement.parentElement, tw, tw + 3.2, { pad: 6, r: 14 });
      },
      (b) => {
        b.shot(["dt.assign", "dt.alist", "dt.create"], 1.12, b.w("Then", -0.3), { dy: 40 });
        let tc = b.click("dt.assign", b.w("assignees", -0.2), { fx: 0.5 });
        const li = `<div style="display:flex;gap:10px"><span class="pchip">Laura Schmidt</span><span class="pchip">Oliver Bennett</span></div>`;
        b.html("dt.alist", li, tc + 0.5);
        b.html("dt.ahead", "Assignees (2)", tc + 0.5);
        b.html("dt.s.ass", "2", tc + 0.5);
        tc = b.click("dt.create", late(tc + 0.9, b.w("create", -0.1)), {});
        b.sound("success", tc + 0.2, 0.8);
        b.ring("dt.create", tc - 0.4, tc + 0.8, { pad: 5, r: 11 });
      },
    ],
  },
  {
    id: "dwm-assign", chapter: "Daily Work Management",
    beats: [
      (b) => {
        b.spotOn = true;
        b.shot("sub:DWM Assign User", 1.6, b.s - 0.3, { ease: 1.0 });
        b.ring("sub:DWM Assign User", b.w("DWM", -0.1), b.s + b.dur, { r: 18, pad: 3 });
        b.hover("sub:DWM Assign User", b.w("DWM", 0.05), { fx: 0.4 });
      },
    ],
  },
  {
    id: "dwm-proj", page: "dwmproj", nav: "sub:DWM Create Project", chapter: "Daily Work Management",
    beats: [
      (b) => {
        b.shot(["dp.name", "dp.desc"], 1.2, b.w("Enter", -0.3), { dy: 40 });
        let t = b.fill("dp.name", "Mobile App 2.0", b.w("Enter", -0.1), { cps: 11, seed: 9 });
        b.fill("dp.desc", "Redesign of the employee mobile app.", t + 0.1, { cps: 16, seed: 10 });
      },
      (b) => {
        b.shot(["dp.users", "dp.create"], 1.2, b.w("Then", -0.3), { dy: 130 });
        let t = b.multi("dp.users", ["Laura Schmidt", "Oliver Bennett", "Felix Wagner"], b.w("users", -0.1), { options: PEOPLE });
        const tc = b.click("dp.create", late(t, b.w("Create", -0.1)), {});
        b.sound("success", tc + 0.2, 0.8);
        b.html("dp.create", "Creating…", tc + 0.12);
        b.html("dp.create", "Create Project", tc + 1.1);
      },
    ],
  },

  /* ===== 5. Referrals ===== */
  {
    id: "ref-add", chapter: "Referral Management", chapterSub: "Turn your team into recruiters", page: "refadd", nav: "sub:Referral List",
    beats: [
      (b) => {
        b.shot(["ra.resume", "ra.first", "ra.exp"], "fit", b.w("Upload", -0.9), { max: 1.2 });
        b.ring("ra.resume", b.w("Upload", -0.1), b.w("Upload", 1.8), { pad: 6, r: 12 });
        const tc = b.click("ra.resume", b.w("Upload", 0.1), { fx: 0.04 });
        b.set("ra.resume", "Chloe_Martin_CV.pdf", tc + 0.5);
        const ta = b.w("assists", -0.2);
        b.set("ra.first", "Chloe", ta + 0.3);
        b.set("ra.last", "Martin", ta + 0.55);
        b.set("ra.email", "chloe.martin@example.com", ta + 0.8);
        b.set("ra.mobile", "7700601234", ta + 1.05);
        b.set("ra.loc", "Berlin", ta + 1.3);
        b.set("ra.exp", "4 yrs", ta + 1.55);
        b.ring(["ra.first", "ra.last", "ra.email", "ra.mobile"], ta + 0.2, ta + 2.6, { pad: 5, r: 12 });
        b.until(ta + 2.0);
      },
      (b) => {
        b.shot(["ra.first", "ra.pos", "ra.remark"], 1.15, b.w("Check", -0.3), { dy: 50 });
        let t = b.pick("ra.pos", "React Developer", b.w("position", -0.15), { options: ["React Developer", ".NET Angular", "QA Engineer", "DevOps Engineer", "UI/UX Designer", "Business Analyst"] });
        b.ring(["ra.loc", "ra.exp"], b.w("location", -0.1), b.w("experience", 1.0), { pad: 5, r: 12 });
        b.hover("ra.loc", b.w("location", 0.0), { fx: 0.5 });
        b.hover("ra.exp", b.w("experience", 0.0), { fx: 0.5 });
        b.fill("ra.remark", "Strong React profile, known personally.", late(t, b.w("optional", 0.0)), { cps: 15, seed: 11 });
      },
      (b) => {
        b.shot(["ra.status", "ra.addupd", "ra.save"], 1.15, b.w("Each", -0.3), { dy: 120 });
        let t = b.pick("ra.status", "Applied", b.w("status", -0.15, 2), { options: ["Applied", "Shortlisted", "Selected", "Joined", "Declined", "Rejected"] });
        t = b.fill("ra.comment", "Strong React profile, referred by the team lead.", late(t, b.w("comment", -0.15)), { cps: 16, seed: 12 });
        let tc = b.click("ra.addupd", late(t, b.w("Add", -0.1, 2)), {});
        b.show("ra.updrow", tc + 0.15, true);
        tc = b.click("ra.save", late(tc + 0.5, b.w("Save", -0.1)), {});
        b.sound("success", tc + 0.2, 0.8);
        b.html("ra.save", "Saving…", tc + 0.12);
        b.html("ra.save", "Save Referral", tc + 1.1);
      },
    ],
  },
  {
    id: "ref-dash", page: "refdash", nav: "sub:Referral Dashboard", chapter: "Referral Management",
    beats: [
      (b) => {
        b.shot(["rd.t0", "rd.t5"], 1.2, b.w("Referral", -0.1), { dy: 120 });
        [["applied", 0], ["shortlisted", 1], ["selected", 2], ["joined", 3], ["declined", 4], ["rejected", 5]].forEach(([w, i]) => {
          const t = b.w(w, -0.05);
          b.ring("rd.t" + i, t, t + 0.95, { pad: 4, r: 14 });
          b.hover("rd.t" + i, t + 0.05, { fx: 0.5 });
        });
        const tc = b.click("rd.t1", b.w("Click", 0.0), {});
        [0, 2, 3, 4, 5].forEach((i) => b.hide("rd.row" + i, tc + 0.1));
        b.ring("rd.row1", tc + 0.3, tc + 2.2, { pad: 3, r: 6 });
      },
      (b) => {
        b.shot(["rd.row0", "rd.row3"], 1.12, b.w("table", -0.4), { dy: 40 });
        const tc = b.click("rd.t0", b.w("table", 0.0), {});
        [0, 2, 3, 4, 5].forEach((i) => b.show("rd.row" + i, tc + 0.1, false));
        b.ring("rd.tbl", b.w("position", -0.1), b.w("outcome", 0.8), { pad: 4, r: 10 });
        b.hover("rd.row2", b.w("status", 0.0), { fx: 0.62 });
      },
    ],
  },

  /* ===== 6. Leave and absence ===== */
  {
    id: "leave", chapter: "Leave & Absence", chapterSub: "Every kind of time away", page: "leave", nav: "sub:Leave & Absence",
    beats: [
      (b) => {
        b.shot(["lv.new", "lv.row0"], 1.15, b.w("Leave", -0.2), { dy: 130 });
        b.ring("lv.new", b.w("Click", -0.1), b.w("request", 1.0), { pad: 5, r: 11 });
        const tc = b.click("lv.new", b.w("request", 0.0), {});
        b.show("lv.panel", tc + 0.15, "fade");
      },
      (b) => {
        b.shot(["lv.search", "lv.r4", "lv.d1"], 1.1, b.w("Search", -0.3), { dy: 30 });
        let t = b.fill("lv.search", "Julia", b.w("Search", 0.15), { cps: 6 });
        t = b.pick("lv.emp", "Julia Meyer (EMP035)", t + 0.1, { options: ["Julia Meyer (EMP035)", "Julia Ward (EMP018)"], gap: 0.1 });
        t = b.fill("lv.from", "12-11-2026", late(t, b.w("dates", -0.2)), { fx: 0.3 });
        t = b.fill("lv.to", "13-11-2026", t, { fx: 0.3 });
        const types = [["paid", 0], ["unpaid", 1], ["absent", 2], ["work", 3], ["client", 4]];
        types.forEach(([w, i]) => b.hover("lv.r" + i, late(b.w(w, 0.0), t), { fx: 0.5 }));
        t = b.radio("lv.r0", ["lv.r1", "lv.r2", "lv.r3", "lv.r4"], late(t, b.w("full", -0.1)));
        b.hover("lv.d1", b.w("half", 0.0), { fx: 0.5 });
        b.radio("lv.d0", "lv.d1", b.w("half", 0.7));
      },
      (b) => {
        b.shot(["lv.remark", "lv.submit"], 1.15, b.w("Add", -0.3), { dy: 40 });
        let t = b.fill("lv.remark", "Fever, doctor advised rest", b.w("remark", -0.1), { cps: 12, seed: 13 });
        const tc = b.click("lv.submit", late(t + 0.2, b.w("submit", -0.1)), {});
        b.html("lv.submit", "Submitting…", tc + 0.12);
        b.html("lv.submit", "Submit for approval", tc + 1.0);
        b.sound("success", tc + 0.9, 0.8);
        [3, 4].forEach((i, n) => b.show("lv.row" + i, tc + 1.0 + n * 0.35, true));
        b.shot(["lv.row0", "lv.row4"], 1.15, tc + 0.6, { dy: 60 });
        b.until(tc + 2.4);
      },
      (b) => {
        b.shot(["lv.row3", "lv.row4"], 1.35, b.w("Every", -0.3), { dy: 10 });
        b.ring(["lv.row3", "lv.row4"], b.w("status", -0.1), b.w("raised", 1.2), { pad: 4, r: 8 });
        b.hover("lv.row3", b.w("status", 0.05), { fx: 0.55 });
        b.hover("lv.ap3", b.w("approver", 0.0), {});
      },
    ],
  },
  {
    id: "leave-pol", page: "leavepol", nav: "sub:Leave Policies", chapter: "Leave & Absence",
    beats: [
      (b) => {
        b.shot(["lp.k0", "lp.k3"], 1.1, b.w("Leave", -0.2), { dy: 150 });
        [["policy", "lp.k0", 1], ["holidays", "lp.k1", 2], ["carry", "lp.k2", 1], ["encashable", "lp.k3", 1]].forEach(([w, k, n]) => {
          const t = b.w(w, -0.1, n);
          b.ring(K(k).parentElement, t, t + 1.4, { pad: 4, r: 15 });
          b.hover(K(k).parentElement, t + 0.1, { fx: 0.5 });
        });
      },
      (b) => {
        b.shot(["lp.id", "lp.cf", "lp.save"], 1.25, b.w("create", -0.3), { dy: 120 });
        let t = b.fill("lp.id", "earned-leave", b.w("ID", -0.1), { cps: 11, seed: 14 });
        t = b.fill("lp.name", "Earned Leave", late(t, b.w("name", -0.1)), { cps: 11, seed: 15 });
        t = b.fill("lp.limit", "15", late(t, b.w("limit", -0.2)), { cps: 6 });
        t = b.check("lp.cf", late(t, b.w("Carry", -0.1)));
        t = b.check("lp.en", late(t, b.w("Encashable", -0.1)));
        const tc = b.click("lp.save", late(t, b.w("Save", -0.1)), {});
        b.sound("success", tc + 0.3, 0.8);
        b.shot(["lp.tbl", "lp.k0"], 1.1, tc + 0.3, { dy: 120 });
        b.show("lp.row3", tc + 0.4, true);
        b.html("lp.k0", "4", tc + 0.4);
        b.html("lp.k2", "1", tc + 0.4);
        b.html("lp.k3", "1", tc + 0.4);
        b.ring("lp.row3", tc + 0.6, tc + 2.6, { pad: 3, r: 6 });
        b.until(tc + 2.2);
      },
      (b) => {
        b.shot(["lp.hdate", "lp.hname", "lp.hlist"], 1.15, b.w("Add", -0.3), { dy: 150 });
        let t = b.fill("lp.hdate", "25-12-2026", b.w("date", -0.1), { fx: 0.3 });
        b.ring("lp.happ", b.w("companies", -0.2), b.w("companies", 1.0), { pad: 5, r: 12 });
        b.hover("lp.happ", b.w("companies", 0.0), { fx: 0.5 });
        t = b.fill("lp.hname", "Christmas Day", late(t, b.w("name", -0.1)), { cps: 11, seed: 16 });
        const tc = b.click("lp.hadd", late(t, b.w("request", 0.0)), {});
        b.show("lp.h2", tc + 0.2, true);
        b.html("lp.k1", "3", tc + 0.2);
        b.ring("lp.h2", tc + 0.4, tc + 2.4, { pad: 3, r: 6 });
        b.until(tc + 2.0);
      },
    ],
  },

  /* ===== 7. Compliance and performance ===== */
  {
    id: "comp", chapter: "Compliance & Performance", chapterSub: "Stay compliant, reward growth",
    beats: [
      (b) => {
        b.spotOn = true;
        b.shot("sub:HRMS Compliance", 1.6, b.s - 0.3, { ease: 1.0 });
        b.ring("sub:HRMS Compliance", b.w("HRMS", -0.1), b.s + b.dur, { r: 18, pad: 3 });
        b.hover("sub:HRMS Compliance", b.w("HRMS", 0.05), { fx: 0.4 });
      },
    ],
  },
  {
    id: "perf", page: "perf", nav: "sub:Performance Reviews", chapter: "Compliance & Performance",
    beats: [
      (b) => {
        b.shot(["pr.cname", "pr.period", "pr.save"], 1.2, b.w("Performance", -0.2), { dy: 100, dx: 150 });
        let t = b.fill("pr.cname", "Q3 2026", b.w("name", -0.2), { cps: 8, seed: 17 });
        t = b.fill("pr.period", "Jul 2026 - Sep 2026", late(t, b.w("period", -0.3)), { cps: 12, seed: 18 });
        const tc = b.click("pr.save", late(t, b.w("save", -0.1)), {});
        b.sound("success", tc + 0.2, 0.6);
        b.html("pr.save", "Saved", tc + 0.12);
        b.html("pr.save", "Save Cycle", tc + 1.2);
      },
      (b) => {
        b.shot(["pr.cycle", "pr.score", "pr.submit"], 1.2, b.w("Then", -0.3), { dy: 130, dx: -120 });
        let t = b.pick("pr.cycle", "Q3 2026", b.w("cycle", -0.15), { options: ["Q3 2026", "Q2 2026"] });
        t = b.pick("pr.emp", "Julia Meyer", late(t, b.w("employee", -0.15, 2)), { options: ["Oliver Bennett", "Julia Meyer", "Laura Schmidt", "Felix Wagner"] });
        t = b.fill("pr.score", "4", late(t, b.w("score", -0.1)), { cps: 5 });
        t = b.fill("pr.notes", "Delivered the payroll module ahead of schedule.", late(t, b.w("notes", -0.2)), { cps: 22, seed: 19 });
        t = b.fill("pr.vp", "12", late(t, b.w("variable", -0.15)), { cps: 6 });
        const tc = b.click("pr.submit", late(t + 0.2, b.w("percentage", 0.5)), {});
        b.sound("success", tc + 0.3, 0.8);
        b.shot(["pr.row0", "pr.row2"], 1.2, tc + 0.3, { dy: 40 });
        b.show("pr.row2", tc + 0.4, true);
        b.html("pr.chip", "3 Records", tc + 0.4);
        b.ring("pr.row2", tc + 0.6, tc + 2.6, { pad: 3, r: 6 });
        b.until(tc + 2.2);
      },
    ],
  },

  /* ===== 8. Offboarding ===== */
  {
    id: "off-req", chapter: "Employee Offboarding", chapterSub: "From resignation to settlement", page: "offreq", nav: "sub:Offboarding Requests",
    beats: [
      (b) => {
        b.shot(["or.rdate", "or.ldate", "or.reason", "or.submit"], 1.1, b.w("Offboarding", -0.2), { dy: 40 });
        let t = b.fill("or.rdate", "16-11-2026", b.w("resignation", -0.1), { fx: 0.3 });
        t = b.fill("or.ldate", "15-01-2027", late(t, b.w("last", -0.1)), { fx: 0.3 });
        t = b.fill("or.reason", "Relocating to Berlin for a larger role", late(t, b.w("reason", -0.2)), { cps: 20, seed: 20 });
        const tc = b.click("or.submit", late(t + 0.1, b.w("submit", -0.1)), {});
        b.sound("success", tc + 0.3, 0.8);
        b.html("or.submit", "Submitting…", tc + 0.12);
        b.html("or.submit", "Submit", tc + 1.0);
        b.show("or.row1", tc + 0.9, true);
        b.html("or.chip", "2 Records", tc + 0.9);
        b.until(tc + 1.8);
      },
      (b) => {
        b.shot(["or.row0", "or.row1"], 1.3, b.w("request", -0.4), { dy: 20 });
        b.ring("or.row1", b.w("joins", 0.0), b.w("settlement", 1.0), { pad: 4, r: 8 });
        b.hover("or.row1", b.w("status", 0.0), { fx: 0.62 });
      },
    ],
  },
  {
    id: "off-clr", page: "offclr", nav: "sub:Offboarding Clearance", chapter: "Employee Offboarding",
    beats: [
      (b) => {
        b.shot(["oc.row0", "oc.row1"], 1.3, b.w("Offboarding", -0.2), { dy: 10 });
        const sign = (k, w, nth, st) => {
          const t = b.w(w, 0.0, nth);
          b.hover(k, t, { fx: 0.5 });
          b.html(k, "Cleared", t + 0.25);
          b.cls(k, "green", true, t + 0.25);
          b.cls(k, "amber", false, t + 0.25);
          b.sound("tick", t + 0.25, 0.7);
          b.ring(k, t - 0.1, t + 1.1, { pad: 5, r: 14 });
        };
        sign("oc.hr", "HR", 1);
        sign("oc.it", "IT", 1);
        sign("oc.ad", "administration", 1);
        sign("oc.fi", "finance", 1);
        const tf = b.w("finance", 1.2);
        b.html("oc.st", `<span class="stc green">Cleared</span>`, tf);
        b.sound("success", tf, 0.6);
        b.ring("oc.st", tf - 0.1, tf + 1.4, { pad: 5, r: 14 });
        b.until(tf + 1.2);
      },
    ],
  },
  {
    id: "off-fnf", page: "offfnf", nav: "sub:Offboarding FNF", chapter: "Employee Offboarding",
    beats: [
      (b) => {
        b.shot(["of.row0", "of.row1"], 1.3, b.w("Offboarding", -0.2), { dy: 10 });
        b.ring("of.st", b.w("status", -0.1), b.w("status", 1.0), { pad: 5, r: 14 });
        b.ring("of.cur", b.w("current", -0.1), b.w("stage", 1.0), { pad: 5, r: 10 });
        b.ring(K("of.cur").parentElement.nextElementSibling, b.w("amount", -0.1), b.w("payable", 1.0), { pad: 5, r: 10 });
        b.hover("of.cur", b.w("current", 0.1), { fx: 0.5 });
        b.hover(K("of.cur").parentElement.nextElementSibling, b.w("amount", 0.1), { fx: 0.3 });
      },
      (b) => {
        b.shot(["of.row1"], 1.45, b.w("Once", -0.3), { dy: 0 });
        const tc = b.click("of.btn", b.w("process", -0.1), {});
        b.html("of.st", `<span class="stc green">Completed</span>`, tc + 0.25);
        b.html("of.cur", "Settled", tc + 0.25);
        b.html("of.btn", "Paid", tc + 0.25);
        b.cls("of.btn", "ok", true, tc + 0.25);
        b.sound("success", tc + 0.3, 0.8);
        b.ring("of.row1", tc + 0.2, tc + 2.2, { pad: 3, r: 6 });
        b.until(tc + 1.8);
      },
    ],
  },
  {
    id: "exit", page: "exit", nav: "sub:Exit Interview", chapter: "Employee Offboarding",
    beats: [
      (b) => {
        b.shot(["ex.case", "ex.exp", "ex.reason"], 1.2, b.w("Finally", -0.2), { dy: 50 });
        let t = b.pick("ex.case", "Lucas Moreau", b.w("case", -0.2), { options: ["Lucas Moreau"], gap: 0.2 });
        t = b.pick("ex.exp", "Positive", late(t, b.w("experience", -0.2)), { options: ["Positive", "Neutral", "Negative"] });
        b.ring("ex.reason", late(t, b.w("reason", -0.1)), late(t, b.w("reason", -0.1)) + 2.2, { pad: 5, r: 12 });
        b.hover("ex.reason", late(t, b.w("category", 0.0)), { fx: 0.4 });
      },
      (b) => {
        b.shot(["ex.rehire", "ex.fb", "ex.save"], 1.15, b.w("Mark", -0.3), { dy: 90 });
        b.ring("ex.rehire", b.w("rehire", -0.3), b.w("rehire", 0.9), { pad: 6, r: 8 });
        b.hover("ex.rehire", b.w("rehire", -0.1), { fx: 0.4 });
        b.ring("ex.risk", b.w("risk", -0.2), b.w("risk", 1.0), { pad: 6, r: 8 });
        b.hover("ex.risk", b.w("risk", 0.0), { fx: 0.5 });
        let t = b.fill("ex.fb", "Great team. Leaving for a larger role in Berlin.", late(b.w("risk", 1.0), b.w("feedback", -0.2)), { cps: 19, seed: 21 });
        const tc = b.click("ex.save", late(t + 0.1, b.w("save", -0.1)), {});
        b.sound("success", tc + 0.3, 0.8);
        b.html("ex.save", "Saving…", tc + 0.12);
        b.html("ex.save", "Save Interview", tc + 1.0);
        b.show("ex.row1", tc + 0.9, true);
        b.html("ex.chip", "2 Records", tc + 0.9);
        b.until(tc + 1.8);
      },
    ],
  },

  /* ===== 9. Department performance + close ===== */
  {
    id: "dept", chapter: "Department Performance", chapterSub: "A leadership view across the business",
    beats: [
      (b) => {
        b.spotOn = true;
        b.shot("nav:Department Performance", 1.6, b.s - 0.3, { ease: 1.0 });
        b.ring("nav:Department Performance", b.w("Department", -0.1), b.s + b.dur, { r: 20, pad: 3 });
        b.hover("nav:Department Performance", b.w("Department", 0.05), { fx: 0.4 });
      },
    ],
  },
  { id: "closing", endcard: true, beats: [() => {}] },
];
