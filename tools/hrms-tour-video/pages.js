/* Page builders. Every label, column and control is taken from the Synax HRMS screenshots; all people, dates and values are
   fictional demo data, kept consistent across screens. Elements that the script drives carry data-k="<page>.<name>". */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[n] || ""}</svg>`;
const TODAY = new Date(2026, 10, 16); // Monday, 16 November 2026 (matches the portal's date in the screenshots)
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dmy = (d, m, y) => `${String(d).padStart(2, "0")}-${MON[m - 1]}-${y}`;
const tenure = (d, m, y) => {
  const mo = (2026 - y) * 12 + (11 - m) - (16 < d ? 1 : 0);
  return `${Math.floor(mo / 12)} yrs ${mo % 12} mo`;
};

/* ---- shared building blocks ---- */
function bell() { return `<div class="bell hv">${ic("Bell")}</div>`; }
function hdr(k, o) {
  return `<div class="card hdr${o.sub ? " tall" : ""}">
    <div class="back hv" data-k="${k}.back">${ic("ArrowLeft")}Back</div>
    <div class="ttlbox"><div class="ttl">${o.title}${o.chip != null ? `<span class="chip" data-k="${k}.chip">${o.chip}</span>` : ""}</div>${o.sub ? `<div class="subt">${o.sub}</div>` : ""}</div>
    ${o.search ? `<div class="hsearch" data-k="${k}.hs" data-ph="${esc(o.search)}" data-kind="text">${ic("Search")}<span class="txt"></span></div>` : `<div class="sp"></div>`}
    ${o.right || bell()}
  </div>`;
}
function fld(k, label, o = {}) {
  const cls = "inp" + (o.ta ? " ta" : "") + (o.cls ? " " + o.cls : "");
  const ico = o.cal ? `<span class="ico">${ic("Calendar")}</span>` : o.clock ? `<span class="ico">${ic("Clock")}</span>` : o.chev ? `<span class="ico">${ic("ChevronDown")}</span>` : "";
  return `<div class="fld"${o.style ? ` style="${o.style}"` : ""}><label>${label}${o.req ? "<i>*</i>" : ""}</label>${o.help ? `<div class="help">${o.help}</div>` : ""}<div class="${cls}" data-k="${k}" data-ph="${esc(o.ph || "")}" data-kind="${o.kind || "text"}"${o.val != null ? ` data-init="${esc(o.val)}"` : ""}${o.ta ? ` style="height:${o.ta}px"` : ""}><span class="txt"></span>${ico}</div></div>`;
}
function cb(k, label, on) { return `<span style="display:inline-flex;align-items:center;gap:10px;font-size:15px;color:#e8e8e8"><span class="cb hv${on ? " on" : ""}" data-k="${k}">${ic("Check")}</span>${label}</span>`; }
function rad(k, label, on) { return `<span class="rad hv${on ? " on" : ""}" data-k="${k}"><span class="dot"></span>${label}</span>`; }
const grid = (cols, rows) => `display:grid;grid-template-columns:${cols};gap:${rows}`;
function table(k, cols, head, rows, o = {}) {
  const gt = `grid-template-columns:${cols}`;
  const th = `<div class="th" data-k="${k}.th" style="${gt}">${head.map((h) => `<div class="c">${h}</div>`).join("")}</div>`;
  const body = rows.map((r, i) => `<div class="tr hv" data-k="${k}.row${i}" style="${gt}${o.rowH ? `;min-height:${o.rowH}px` : ""}">${r.map((c) => `<div class="c" style="display:flex;align-items:center">${c}</div>`).join("")}</div>`).join("");
  return `<div class="tbl" data-k="${k}.tbl"${o.h ? ` style="height:${o.h}px"` : ""}>${th}${body}${o.empty ? `<div class="empty" data-k="${k}.empty">${o.empty}</div>` : ""}${o.foot || ""}</div>`;
}
const sortIc = ic("ArrowDownUp");
const H = (s, sort = true) => `${s}${sort ? sortIc : ""}`;
const stc = (t, c) => `<span class="stc ${c}">${t}</span>`;
const stars = (n) => `<span style="letter-spacing:2px;font-size:15px">${[1, 2, 3, 4, 5].map((i) => `<span class="${i <= n ? "star" : "starm"}">★</span>`).join("")}</span>`;

/* ---------- Home ---------- */
function pgHome() {
  const mod = (x, y, w, h, title, icon, bg, fg, tiles) =>
    `<div class="mcard hv" data-k="home.m:${title}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><h3><span class="mico" style="background:${bg};color:${fg}">${ic(icon)}</span>${title}</h3>${tiles
      .map(([n, i, ghost], j) => `<div class="mtile hv${ghost ? " ghost" : ""}" style="left:${14 + (j % 2) * 192}px;top:${57 + Math.floor(j / 2) * 47}px;width:${ghost ? 184 : 184}px"><span class="mico" style="background:${bg};color:${fg}">${ic(i)}</span>${n}</div>`)
      .join("")}</div>`;
  return `<div class="stars"></div>
  <div class="hbanner" data-k="home.banner"><img class="plane" src="assets/plane.png" alt=""><h1>Good morning, Demo</h1><div class="meta"><span>Demo IT</span><span style="color:#6c7390">|</span><span>Monday, 16 November 2026</span></div><div class="bell bellb">${ic("Bell")}</div></div>
  <div class="sech" style="left:298px;top:165px">${ic("Bookmark")}My shortcuts</div>
  <div class="pin"><span class="pl">${ic("Plus")}</span>Pin your first …</div>
  <div class="sech" style="left:298px;top:256px">${ic("LayoutGrid")}Your modules</div>
  ${mod(295, 283, 405, 157, "Projects", "LayoutDashboard", "#0f3d3a", "#2dd4bf", [["Projects", "LayoutDashboard"], ["Billing", "FileText"], ["Analytics", "ChartLine"], ["Leads", "Users"]])}
  ${mod(711, 283, 406, 157, "People &amp; HR", "Users", "#2a2352", "#a78bfa", [["Leave &amp; absence", "CalendarDays"], ["Employees", "IdCard"], ["Interviews", "UserRoundSearch"], ["Break pass", "Coffee"]])}
  ${mod(1128, 283, 405, 157, "Assets", "Box", "#3d2c10", "#fbbf24", [["Assets", "Box"], ["Asset assignment", "UserRoundCog"], ["New IT Assets", "Plus", 1]])}
  ${mod(295, 452, 405, 157, "More pages", "LayoutGrid", "#0f3d3a", "#2dd4bf", [["Interviews", "File"], ["Schedule", "File"], ["Finance", "File"], ["Salary", "File"]])}
  <div class="wcard" style="top:165px;height:140px"><svg class="i h" viewBox="0 0 24 24">${ICONS.ListChecks}</svg><div class="t">My Work</div><div style="position:absolute;left:18px;top:55px;font-size:14px;color:#cdd1dc;display:flex;gap:9px;align-items:center"><span style="color:#34d399;font-size:16px">${ic("CircleCheck")}</span>Nothing needs you right now.</div><div style="position:absolute;left:0;right:0;top:92px;border-top:1px solid #272a36"></div><div style="position:absolute;left:20px;top:99px;font-size:15px;font-weight:600;color:#f0f0f0;display:flex;gap:14px;align-items:center;width:310px"><span style="color:#9aa3b8;font-size:17px">${ic("SquareCheck")}</span>My tasks<span style="margin-left:auto;color:#9aa3b8">${ic("ChevronRight")}</span></div></div>
  <div class="wcard" style="top:319px;height:96px"><svg class="i h" viewBox="0 0 24 24">${ICONS.Calendar}</svg><div class="t">Today</div><div style="position:absolute;right:18px;top:16px;font-size:14.5px;font-weight:600;color:#60a5fa">Open Calendar →</div><div style="position:absolute;left:18px;top:60px;font-size:14px;color:#cdd1dc">No meetings today.</div></div>`;
}

/* ---------- Employee List ---------- */
const EMP_COLS = "38px 80px 74px 112px 112px 156px 126px 170px 190px 108px 100px 82px 100px 1fr";
const CO = { di: "DI - Demo IT Inc", ds: "DS - Demo Systems Ltd." };
const EMPS = [
  ["EMP036", "Oliver Bennett", "7700145633", CO.di, "Engineering", "Senior Software Engineer", "React, Node.js, TypeScript", [5, 10, 2026], "€ 14,500,000", "Customer Portal"],
  ["EMP035", "Julia Meyer", "7700271845", CO.di, "Engineering", "Software Developer", "Angular, Java, SQL Server", [14, 9, 2026], "€ 9,800,000", "Payroll Suite"],
  ["EMP034", "Felix Wagner", "7700402188", CO.ds, "Quality Assurance", "QA Engineer", "Selenium, Postman", [3, 8, 2026], "€ 7,200,000", "Customer Portal"],
  ["EMP033", "Victor Hale", "7700112390", CO.di, "Engineering", "Junior Software Developer", "JavaScript, React", [21, 7, 2026], "€ 5,400,000", "Mobile App"],
  ["EMP032", "Laura Schmidt", "7700006741", CO.di, "Design", "UI/UX Designer", "Figma, Adobe XD", [10, 6, 2026], "€ 8,600,000", "Mobile App"],
  ["EMP031", "Lucas Moreau", "7700218830", CO.di, "Engineering", "Software Developer", "Node.js, MongoDB", [18, 3, 2026], "€ 10,200,000", "Payroll Suite"],
  ["EMP030", "Anna Kowalski", "7700123456", CO.ds, "Human Resources", "HR Executive", "HRMS, Recruitment", [2, 2, 2026], "€ 5,600,000", "-"],
  ["EMP029", "Peter Lindberg", "7700907654", CO.di, "Sales &amp; Marketing", "Business Analyst", "SQL, Power BI", [12, 1, 2026], "€ 8,800,000", "Analytics Hub"],
  ["EMP012", "Mia Johansson", "7700984410", CO.di, "Human Resources", "HR Manager", "HRMS, Compliance", [20, 6, 2024], "€ 12,500,000", "-"],
  ["EMP009", "Paul Evans", "7700077812", CO.di, "Engineering", "Tech Lead", "Java, Spring Boot, AWS", [15, 1, 2024], "€ 24,000,000", "Payroll Suite"],
  ["EMP006", "Hannah Fischer", "7700345567", CO.ds, "Finance &amp; Legal", "Finance Manager", "Tally, Excel", [1, 8, 2023], "€ 16,500,000", "-"],
  ["EMP002", "Ryan Cooper", "7700231456", CO.di, "Management", "Operations Head", "Operations, Planning", [3, 4, 2022], "€ 32,000,000", "-"],
];
function pgEmpList() {
  const tabs = [["Live Employees", 29], ["Live Developers", 21], ["Live Staff", 8], ["Left Employees", 5], ["Extra Resources", 2], ["NPD(IT)", 0], ["Bench", 0], ["All Employees", 36]];
  const head = ["#", "Status" + sortIc, "Code" + sortIc, "Name" + sortIc, "Contact" + sortIc, "Company" + sortIc, "Department" + sortIc, "Designation" + sortIc, "Technologies" + sortIc, "Joining Date" + sortIc, "Experience" + sortIc, "CTC" + sortIc, "Project" + sortIc, "Actions"];
  const rows = EMPS.map((e, i) => [
    i + 1, "Live", e[0], `<span class="nm">${e[1]}</span>`, e[2], e[3], e[4], e[5], `<span style="font-size:12px">${e[6]}</span>`, dmy(...e[7]), tenure(...e[7]), e[8], e[9],
    `<span style="display:flex;gap:8px"><span class="sbtn del hv" data-k="el.del${i}">Delete</span><span class="sbtn edit hv" data-k="el.edit${i}">Edit</span></span>`,
  ]);
  return `<div class="pg">
    ${hdr("el", { title: "Employee List", chip: "36 Records", sub: "Manage employees, staffing status, company, and project assignments.", right: `${bell()}<div class="abtn hv" data-k="el.add">${ic("CirclePlus")}Add New</div><div class="abtn green hv" data-k="el.export">${ic("FileSpreadsheet")}Export Excel</div>` })}
    <div class="card" style="flex:1;padding:22px 19px 0">
      <div class="tabs" data-k="el.tabs">${tabs.map(([n, c], i) => `<div class="tab hv${i === 0 ? " on" : ""}" data-k="el.tab${i}">${n}<span class="n" data-k="el.tabn${i}">${c}</span></div>`).join("")}</div>
      <div style="display:grid;grid-template-columns:1fr 396px 330px 392px;gap:12px;margin-top:26px">
        ${fld("el.search", "Search Name, Code, Company, Project…", { ph: "" })}
        ${fld("el.sortf", "Sort Field", { val: "Latest Added" })}
        ${fld("el.sortd", "Sort Direction", { val: "Descending" })}
        ${fld("el.company", "Select company", { ph: "Select company", chev: 1 })}
      </div>
      <div style="margin-top:24px">${table("el", EMP_COLS, head, rows, { rowH: 56 })}</div>
    </div></div>`;
}

/* ---------- Employee Add (Update Employee) ---------- */
function pgEmpAdd() {
  const tabs = [["Personal Info", "yel", "14%"], ["Employment"], ["Contact"], ["Identification"], ["Bank &amp; Statutory"], ["Education &amp; Certification"], ["Legal Document"], ["KYC"], ["Projects"]];
  return `<div class="pg" style="gap:0">
    ${hdr("ea", { title: "Update Employee" })}
    <div style="height:20px"></div>
    <div data-k="ea.tabs" style="display:flex;height:50px;overflow:hidden;width:1618px;position:relative">${tabs
      .map(([n, c, v], i) => `<div class="tab hv${i === 0 ? " on" : ""}" data-k="ea.tab${i}" style="padding:0 20px;font-size:16px;gap:12px">${n}<span class="badge ${c || "red"}" data-k="ea.badge${i}">${v || "!"}</span></div>`)
      .join("")}</div>
    <div style="height:6px;margin:6px 14px 0 4px;border-radius:3px;background:#262626;width:1560px"></div>
    <div style="margin-top:42px;font-size:25px;font-weight:600;color:#f4f4f4;display:flex;align-items:center;gap:16px;padding-left:28px"><span style="font-size:24px;color:#cfcfcf">${ic("User")}</span>Personal Information</div>
    <div style="padding:0 28px;margin-top:26px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px 28px">
        ${fld("ea.name", "Full Name (as per Aadhar/PAN)", { ph: "" })}
        ${fld("ea.dob", "Date of Birth", { kind: "date", ph: "dd-mm-yyyy", cal: 1 })}
        ${fld("ea.gender", "Gender", { ph: "Select Gender" })}
        ${fld("ea.father", "Father's/Husband's Name", { ph: "" })}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px 28px;margin-top:22px">
        ${fld("ea.marital", "Marital Status", { ph: "Select Marital Status" })}
        ${fld("ea.nation", "Nationality", { val: "Indian" })}
        ${fld("ea.blood", "Blood Group (Recommended)", { val: "-- Optional --" })}
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:22px"><div class="abtn pill hv" data-k="ea.submit">Submit</div></div>
    </div></div>`;
}

/* ---------- Interview List ---------- */
const INTERVIEWS = [
  ["Nora Hansen", "nora.hansen@example.com", "7700501234", "Mia Johansson", "16-Nov-2026", ["Screening", "blue"], 3, "Full Stack Developer"],
  ["Leo Rossi", "leo.rossi@example.com", "7700512345", "Paul Evans", "14-Nov-2026", ["HR Round", "violet"], 4, "DevOps Engineer"],
  ["Isabel Garcia", "isabel.garcia@example.com", "7700523456", "Paul Evans", "13-Nov-2026", ["Technical Round", "amber"], 4, "Full Stack Developer"],
  ["Adam Novak", "adam.novak@example.com", "7700534567", "Mia Johansson", "12-Nov-2026", ["Rejected", "red"], 2, "QA Engineer"],
  ["Elena Costa", "elena.costa@example.com", "7700545678", "Mia Johansson", "10-Nov-2026", ["Offered", "green"], 5, "UI/UX Designer"],
  ["Marco Bianchi", "marco.bianchi@example.com", "7700556789", "Peter Lindberg", "09-Nov-2026", ["Screening", "blue"], 3, "Business Analyst"],
];
function pgIntList() {
  const cols = "40px 190px 270px 140px 190px 150px 170px 140px 220px 1fr";
  const head = ["#", H("Candidate Name"), H("Email"), H("Mobile"), H("Interviewer Name"), H("Interview Date"), H("Status"), H("Rating"), H("Role"), "Actions"];
  const rows = INTERVIEWS.map((r, i) => [i + 1, `<span style="font-weight:600">${r[0]}</span>`, r[1], r[2], r[3], r[4], stc(...r[5]), stars(r[6]), r[7], `<span class="sbtn edit hv">Edit</span>`]);
  return `<div class="pg">
    ${hdr("il", { title: "Interview List", chip: "6 Records", sub: "Manage candidates, interview stages, ratings, and lead interviews.", right: `${bell()}<div class="abtn hv" data-k="il.add">${ic("CirclePlus")}Add New</div>` })}
    <div class="card" style="flex:1;padding:30px 17px 0">
      <div style="font-size:17px;color:#cfcfcf;padding-left:16px;font-weight:500">Pipeline Projects</div>
      <div style="display:grid;grid-template-columns:523px 523px;gap:24px;margin:28px 0 24px 0">
        <div class="inp" data-k="il.role" data-ph="Select Role" data-kind="text" style="height:40px"><span class="txt"></span></div>
        <div class="inp" data-k="il.interviewer" data-ph="Select Interviewer" data-kind="text" style="height:40px"><span class="txt"></span></div>
      </div>
      ${table("il", cols, head, rows, { rowH: 58 })}
    </div></div>`;
}

/* ---------- Interview Add ---------- */
function pgIntAdd() {
  return `<div class="pg" style="gap:10px">
    ${hdr("ia", { title: "Add Interview", right: `${bell()}<div data-k="ia.rating" style="display:flex;align-items:center;gap:10px;font-size:17px;color:#f0f0f0;font-weight:500">Rating: <span style="font-size:27px;letter-spacing:6px;color:#dcdcdc">★★★★★</span></div>` })}
    <div class="card" style="border:1.5px dashed #2b5fa8;border-radius:12px;padding:18px 17px 14px;flex:none;background:#181b22">
      <div class="inp file" data-k="ia.resume" data-ph="No file chosen" data-kind="file" style="height:44px"><span class="fb">Choose File</span><span class="fn txt"></span></div>
      <div style="font-size:14.5px;color:#a9b4c6;margin-top:10px">AI will auto-extract candidate details.</div>
    </div>
    <div class="card" style="padding:20px 22px 20px;flex:none">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px 24px">
        ${fld("ia.name", "Candidate Name", { req: 1, ph: "" })}
        ${fld("ia.email", "Candidate Email", { req: 1, ph: "Candidate Email" })}
        <div class="fld"><label>Mobile Number<i>*</i></label><div class="inp" data-k="ia.mobile" data-ph="Enter mobile number *" data-kind="text"><span style="color:#f0f0f0;font-weight:600;margin-right:14px">+44</span><span class="txt"></span></div></div>
        ${fld("ia.date", "Interview Date", { req: 1, kind: "date", val: "16-11-2026", cal: 1 })}
        ${fld("ia.stage", "Interview Stage", { req: 1, ph: "" })}
        ${fld("ia.dept", "Department", { req: 1, ph: "Select Department" })}
        ${fld("ia.tech", "Technology", { ph: "" })}
        ${fld("ia.texp", "Total Exp (yrs)", { ph: "" })}
        ${fld("ia.rexp", "Relevant Exp (yrs)", { ph: "" })}
        ${fld("ia.ctc", "Current CTC", { ph: "" })}
        ${fld("ia.octc", "Offered CTC", { ph: "" })}
        ${fld("ia.type", "Interview Type", { req: 1, ph: "Select Type" })}
        ${fld("ia.interviewer", "Interviewer Name", { ph: "" })}
        ${fld("ia.in", "In Time", { req: 1, kind: "time", ph: "--:--", clock: 1 })}
        ${fld("ia.out", "Out Time", { kind: "time", ph: "--:--", clock: 1 })}
        ${fld("ia.cloc", "Candidate Location", { req: 1, ph: "" })}
        ${fld("ia.oloc", "Office Location", { req: 1, ph: "" })}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:none">
      <div class="card" data-k="ia.offer" style="border-style:dashed;height:78px;padding:14px 20px;opacity:.9"><div style="font-size:15px;color:#bdbdbd;font-weight:600">Offer Letter <i style="color:#ef4444;font-style:normal">*</i></div><div style="font-size:13px;color:#a0a0a0;margin-top:5px">PDF file required when the stage is Offered.</div><div style="position:absolute;right:20px;top:24px;height:32px;padding:0 14px;border-radius:7px;background:#3b5f8f;color:#cfe0f7;font-size:13px;display:flex;align-items:center">Choose file</div></div>
      <div class="card" data-k="ia.fb" style="border-style:dashed;height:78px;padding:14px 20px"><div style="font-size:15px;color:#bdbdbd;font-weight:600">Interview Feedback <i style="color:#ef4444;font-style:normal">*</i></div><div style="font-size:13px;color:#a0a0a0;margin-top:5px" data-k="ia.fbtxt"><span class="txt" data-ph="Up to 2 images or 1 PDF; maximum 5 MB per file." data-kind="text" data-k="ia.fbfile"></span></div><div class="hv" data-k="ia.fbbtn" style="position:absolute;right:20px;top:24px;height:32px;padding:0 14px;border-radius:7px;background:#3b5f8f;color:#cfe0f7;font-size:13px;display:flex;align-items:center">Choose files</div></div>
    </div>
    <div class="card" style="flex:none;padding:16px 20px 16px;min-height:72px">
      <div style="display:flex;align-items:center"><div style="font-size:21px;font-weight:700;color:#f3f3f3">Remarks</div><div class="sp"></div><div class="abtn hv" data-k="ia.addremark" style="height:36px;font-size:14px;color:#60a5fa;padding:0 16px">+ Add Remark</div></div>
      <div data-k="ia.remarkrow" style="margin-top:12px"><div class="inp" data-k="ia.remark" data-ph="Add a remark" data-kind="text"><span class="txt"></span></div></div>
    </div>
    <div style="display:flex;justify-content:flex-end;flex:none"><div class="abtn hv" data-k="ia.save" style="height:46px;padding:0 24px;color:#bcd8ff;font-weight:600">Save Interview</div></div>
  </div>`;
}

/* ---------- DWM Add (Create Task) ---------- */
function pgDwmAdd() {
  const snap = (k, l, v) => `<div class="kpi" style="padding:14px 16px;height:66px"><div style="font-size:11.5px;letter-spacing:.6px;color:#cfcfcf;font-weight:600">${l}</div><div data-k="${k}" style="font-size:16px;font-weight:700;color:#fff;margin-top:5px">${v}</div></div>`;
  return `<div class="pg" style="gap:12px">
    ${hdr("dt", { title: "Create Task", right: `${bell()}<div class="abtn hv dis" data-k="dt.create">Create Task</div>` })}
    <div style="display:grid;grid-template-columns:1fr 596px;gap:22px;align-items:start">
      <div style="display:flex;flex-direction:column;gap:22px">
        <div class="card" style="padding:22px 23px 20px">
          <div style="font-size:11.5px;letter-spacing:1px;color:#7aa7f0;font-weight:700">CORE TASK DETAILS</div>
          <div style="font-size:14px;color:#c4c4c4;margin:12px 0 20px">Capture the outcome clearly so the assignee can act without extra back-and-forth.</div>
          ${fld("dt.title", "Task Title", { req: 1, ph: "What needs to be done?" })}
          <div class="help" style="margin-top:8px;font-size:12.5px;color:#a0a0a0;height:auto">Use a short, action-first title so it is easy to scan on the board.</div>
          <div style="margin-top:18px">${fld("dt.desc", "Detailed Description", { ta: 70, ph: "Add more details about this task..." })}</div>
          <div style="margin-top:8px;font-size:12.5px;color:#a0a0a0">Include deliverable, context, and anything the assignee should check before marking it done.</div>
        </div>
        <div class="card" style="padding:0 0 18px"><div style="padding:18px 22px;border-bottom:1px solid #272727;font-size:15px;font-weight:700;color:#f0f0f0;display:flex;gap:10px;align-items:center"><span style="color:#60a5fa">${ic("Paperclip")}</span>Attachments</div>
          <div style="padding:16px 16px 0"><div class="inp file" style="height:40px"><span class="fb" style="background:#1a1a1a;border:0">Choose Files</span><span class="fn" style="color:#d8d8d8">No file chosen</span></div></div>
          <div style="padding:16px 18px 0;font-size:15px;color:#d8d8d8;display:flex;align-items:center;gap:10px"><span style="font-size:17px">${ic("Inbox")}</span>No attachments added yet.</div></div>
        <div class="card" style="padding:22px;border-style:dashed;display:flex;gap:18px;align-items:center"><span style="width:48px;height:48px;border-radius:50%;background:#1b2a3e;color:#60a5fa;display:flex;align-items:center;justify-content:center;font-size:21px;flex:none">${ic("MessageSquareText")}</span><div><div style="font-size:16px;font-weight:700;color:#f0f0f0">Collaboration unlocks after the first save</div><div style="font-size:14px;color:#bdbdbd;margin-top:6px">Save the task once to start comments, replies, mentions, and activity tracking.</div></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:22px">
        <div class="card" style="padding:20px 18px 18px"><div style="font-size:11.5px;letter-spacing:1px;color:#7aa7f0;font-weight:700">TASK SNAPSHOT</div><div style="font-size:14px;color:#c4c4c4;margin:12px 0 14px">Keep the essential planning details visible while you edit.</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${snap("dt.s.status", "STATUS", "ToDo")}${snap("dt.s.est", "ESTIMATE", "No estimate")}${snap("dt.s.ass", "ASSIGNEES", "0")}${snap("dt.s.due", "DUE STATE", "No due date selected")}</div></div>
        <div class="card" style="padding:20px 18px 18px"><div style="font-size:11.5px;letter-spacing:1px;color:#7aa7f0;font-weight:700">PLANNING</div><div style="font-size:14px;color:#c4c4c4;margin:12px 0 14px">Assign ownership, timing, and urgency before the work starts moving.</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 16px">
            ${fld("dt.status", "Status", { req: 1, val: "ToDo" })}${fld("dt.prio", "Priority", { val: "Medium" })}
            ${fld("dt.project", "Project", { req: 1, ph: "Select..." })}${fld("dt.dept", "Department", { ph: "" })}
          </div>
          <div style="border-top:1px solid #2a2a2a;margin:16px 0 14px"></div>
          ${fld("dt.est", "Estimated Time (Mins)", { req: 1, val: "0" })}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 16px;margin-top:14px">${fld("dt.start", "Start Date", { kind: "date", val: "16-11-2026", cal: 1 })}${fld("dt.end", "End Date", { req: 1, kind: "date", ph: "dd-mm-yyyy", cal: 1 })}</div></div>
        <div class="card" style="padding:0"><div style="display:flex;align-items:center;padding:16px 18px;border-bottom:1px solid #272727"><div style="font-size:16px;font-weight:700;color:#f3f3f3" data-k="dt.ahead">Assignees (0)</div><div class="sp"></div><div class="abtn hv" data-k="dt.assign" style="height:42px;font-size:14px;color:#9fc7ff;padding:0 18px">${ic("Users")}Select assignees</div></div>
          <div data-k="dt.alist" style="padding:16px 18px;font-size:15px;color:#d8d8d8;min-height:58px">No assignees selected yet.</div></div>
      </div>
    </div></div>`;
}

/* ---------- DWM List ---------- */
const TASKS = [
  ["Design onboarding screens", "Mobile App", "Laura Schmidt", "High", "18 Nov"],
  ["Fix payslip rounding issue", "Payroll Suite", "Julia Meyer", "High", "16 Nov"],
  ["API contract for login", "Customer Portal", "Oliver Bennett", "Medium", "20 Nov"],
  ["Build leave balance report", "Payroll Suite", "Lucas Moreau", "Medium", "21 Nov"],
  ["Regression test, release 4.2", "Customer Portal", "Felix Wagner", "Medium", "14 Nov"],
  ["Review referral flow", "Analytics Hub", "Peter Lindberg", "Low", "19 Nov"],
  ["Set up CI pipeline", "Customer Portal", "Paul Evans", "High", "12 Nov"],
  ["Update employee import", "Payroll Suite", "Victor Hale", "Low", "14 Nov"],
  ["Publish test plan", "Customer Portal", "Felix Wagner", "Medium", "13 Nov"],
  ["Sign off the dashboard UI", "Mobile App", "Laura Schmidt", "Medium", "10 Nov"],
];
const TASKCOL = { 0: [0, 1, 2], 1: [3, "0b"], 2: [4, 5], 3: [6, 7, 8, 9] }; // column -> task index ("0b" = the first task once dragged to In Progress)
function pgDwmList() {
  const col = (i, name, color) => `<div data-k="dl.col${i}" style="border-top:4px solid ${color};border-radius:16px 16px 0 0;background:#171717;padding-top:14px"><div style="text-align:center;font-size:14.5px;font-weight:700;color:#f0f0f0">${name} <span data-k="dl.cn${i}" style="margin-left:6px;font-size:12px;color:#d8d8d8;font-weight:600">${(TASKCOL[i] || []).filter((x) => !String(x).endsWith("b")).length}</span></div><div data-k="dl.cb${i}" style="padding:14px 12px;min-height:300px;display:flex;flex-direction:column;gap:10px">${(TASKCOL[i] || []).map((ti) => card(ti)).join("")}</div></div>`;
  const pc = { High: "red", Medium: "amber", Low: "blue" };
  const card = (ti) => {
    const key = String(ti), t = TASKS[parseInt(key)];
    return `<div class="hv" data-k="dl.card${key}" style="border:1px solid #2c2c2c;border-radius:12px;background:#202020;padding:12px 13px"><div style="font-size:14px;font-weight:600;color:#f1f1f1;line-height:1.3">${t[0]}</div><div style="font-size:12px;color:#9a9a9a;margin-top:4px">${t[1]}</div><div style="display:flex;align-items:center;gap:8px;margin-top:10px"><span class="stc ${pc[t[3]]}" style="height:22px;font-size:11px">${t[3]}</span><span style="font-size:11.5px;color:#a9a9a9">${ic("Calendar")} ${t[4]}</span><span style="margin-left:auto;width:26px;height:26px;border-radius:50%;background:#1d3250;color:#9fc7ff;font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center">${t[2].split(" ").map((w) => w[0]).join("")}</span></div></div>`;
  };
  const tile = (k, l, bg, bd, v, c) => `<div class="kpi" style="background:${bg};border-color:${bd};padding:13px 14px;height:66px"><div style="font-size:11px;letter-spacing:.6px;color:#cfcfcf">${l}</div><div data-k="${k}" style="font-size:19px;font-weight:700;color:${c};margin-top:3px">${v}</div></div>`;
  return `<div style="position:absolute;left:268px;top:17px;width:62px;height:778px;border-radius:31px;background:#10304f;border:1px solid #1b3f66;display:flex;flex-direction:column;align-items:center;padding-top:20px;gap:0;font-size:22px;color:#e8f1ff">
      <div style="width:40px;height:40px;border-radius:50%;background:#173f69;display:flex;align-items:center;justify-content:center">${ic("ChevronRight")}</div>
      ${["SquareKanban", "CalendarDays", "CircleAlert", "Star", "ContactRound"].map((n) => `<div style="height:56px;display:flex;align-items:center;margin-top:${n === "SquareKanban" ? 36 : 0}px">${ic(n)}</div>`).join("")}</div>
    <div style="position:absolute;left:354px;top:17px;width:1550px;height:1050px">
      <div style="display:flex;gap:10px;align-items:center;height:50px">
        <div class="hsearch" style="margin:0;flex:1;width:auto">${ic("Search")}Search task title...</div>
        <div class="inp" data-k="dl.from" data-kind="date" data-init="01-11-2026" data-ph="" style="width:156px;height:42px;background:#232323"><span class="txt"></span><span class="ico" style="color:#60a5fa">${ic("Calendar")}</span></div><span style="color:#cfcfcf">to</span>
        <div class="inp" data-k="dl.to" data-kind="date" data-init="30-11-2026" data-ph="" style="width:156px;height:42px;background:#232323"><span class="txt"></span><span class="ico" style="color:#60a5fa">${ic("Calendar")}</span></div>
        <div class="abtn hv" data-k="dl.users" style="height:42px;font-size:13.5px;color:#9a9a9a;padding:0 16px">${ic("User")}Select Users</div>
        <div style="width:26px;height:26px;border-radius:50%;background:#16603f;color:#8cf0c0;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #25a86c">All</div>
        <div class="abtn hv" data-k="dl.create" style="height:42px;font-size:14px;color:#9fc7ff;padding:0 18px">+ Create Task</div>
        <div class="bell" style="color:#cfcfcf;width:42px;height:42px">${ic("LayoutGrid")}</div><div class="bell" style="color:#cfcfcf;width:42px;height:42px">${ic("List")}</div>
      </div>
      <div style="display:flex;align-items:center;margin-top:12px;height:70px">
        <div style="width:700px"><div style="font-size:10.5px;letter-spacing:.9px;color:#7aa7f0;font-weight:700">DAILY WORKSPACE</div><div style="font-size:17px;font-weight:700;color:#f5f5f5;margin-top:4px">Focus on what needs movement today</div><div style="font-size:13px;color:#a9a9a9;margin-top:4px">Use the board for flow updates and the list for detailed follow-up.</div></div>
        <div style="display:flex;gap:10px;margin-left:auto;margin-right:20px">
          ${["No projects selected|Briefcase", "All assignees|Users", "1 Nov - 30 Nov|Calendar"].map((s) => `<span style="height:34px;padding:0 14px;border-radius:17px;border:1px solid #2c2c2c;background:#1c1c1c;font-size:12.5px;color:#e6e6e6;display:flex;align-items:center;gap:8px;font-weight:600">${ic(s.split("|")[1])}${s.split("|")[0]}</span>`).join("")}</div>
        <div style="display:grid;grid-template-columns:repeat(4,126px);gap:10px">${tile("dl.visible", "VISIBLE", "#171717", "#2a2a2a", "0", "#fff")}${tile("dl.due", "DUE TODAY", "#2a2412", "#4a3f14", "0", "#fff")}${tile("dl.over", "OVERDUE", "#2c1517", "#552024", "0", "#fff")}${tile("dl.done", "DONE", "#10291c", "#17492f", "0", "#fff")}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px;border-radius:18px;background:#171717;padding:0;border:1px solid #232323">
        ${col(0, "To Do", "#f5b82e")}${col(1, "In Progress", "#38bdf8")}${col(2, "Verification", "#a855f7")}${col(3, "Done", "#22c55e")}</div>
      <div data-k="dl.nonebar" style="display:none;margin-top:20px;height:52px;border:1px dashed #2a2a2a;border-radius:12px;display:flex;align-items:center;gap:12px;padding-left:20px;font-size:14.5px;color:#cfcfcf;background:#181818">${ic("Inbox")}No tasks found for the selected filters.</div>
    </div>`;
}

/* ---------- DWM Create Project ---------- */
function pgDwmProj() {
  return `<div class="pg">
    ${hdr("dp", { title: "Create Project" })}
    <div class="card" style="padding:40px 46px;flex:none">
      ${fld("dp.name", "Project Name", { ph: "" })}
      <div style="margin-top:34px">${fld("dp.desc", "Description", { ta: 110, ph: "" })}</div>
      <div style="margin-top:34px">${fld("dp.users", "Assign Users", { ph: "Select users", chev: 1 })}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:30px"><div class="abtn pill hv" data-k="dp.create" style="height:54px;padding:0 36px;font-size:17px">Create Project</div></div>
    </div></div>`;
}

/* ---------- Referral Add ---------- */
function pgRefAdd() {
  return `<div class="pg" style="gap:12px">
    ${hdr("ra", { title: "Add Referral" })}
    <div class="card" style="padding:18px 22px 18px;flex:none">
      <div style="font-size:16px;font-weight:700;color:#f3f3f3;display:flex;align-items:center;gap:10px">Resume (Required) <span style="background:#14803c;color:#d9ffe6;font-size:10.5px;font-weight:700;padding:3px 8px;border-radius:5px">AI Assisted</span></div>
      <div style="margin-top:12px;border:1.5px dashed #2b5fa8;border-radius:12px;padding:14px 14px 12px;background:#181b22"><div class="inp file" data-k="ra.resume" data-ph="No file chosen" data-kind="file" style="height:44px"><span class="fb">Choose File</span><span class="fn txt"></span></div><div style="font-size:14.5px;color:#a9b4c6;margin-top:10px">AI will auto-extract candidate details from the uploaded CV.</div></div>
    </div>
    <div class="card" style="padding:26px 22px 24px;flex:none">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:22px 24px">
        ${fld("ra.first", "First Name", { ph: "" })}${fld("ra.last", "Last Name", { ph: "" })}${fld("ra.email", "Email", { ph: "" })}
        <div class="fld"><label>+44</label><div class="inp" data-k="ra.mobile" data-ph="" data-kind="text"><span class="txt"></span></div></div>
        ${fld("ra.pos", "Position", { ph: "Select Position" })}${fld("ra.loc", "Location", { ph: "" })}${fld("ra.exp", "Experience", { ph: "" })}
        <div class="fld"><label style="opacity:0">.</label><div class="inp ta" data-k="ra.remark" data-ph="Remark (Optional)" data-kind="text" style="height:64px;background:#2b2b2b;border-color:#3a3a3a"><span class="txt"></span></div></div>
      </div>
      <div class="card" style="width:560px;margin-top:22px;padding:22px 22px 20px;border-radius:12px;background:#1b1b1b">
        <div style="font-size:26px;font-weight:600;color:#f3f3f3">Referral Status Updates</div>
        <div style="font-size:21px;font-weight:600;color:#f3f3f3;margin-top:18px">Add New Update</div>
        <div style="margin-top:10px">${fld("ra.status", "Status", { ph: "Select Status", style: "" })}</div>
        <div class="inp ta" data-k="ra.comment" data-ph="Add Comments" data-kind="text" style="height:78px;margin-top:8px;background:#2b2b2b;border-color:#3a3a3a"><span class="txt"></span></div>
        <div class="abtn hv" data-k="ra.addupd" style="margin-top:14px;height:42px;width:112px;padding:0;font-size:15px;color:#9fc7ff">Add Update</div>
        <div data-k="ra.updrow" style="margin-top:14px;border-top:1px solid #2b2b2b;padding-top:12px;font-size:14px;color:#e4e4e4"><div style="display:flex;align-items:center;gap:10px"><span class="stc blue">Applied</span><span style="color:#8d8d8d;font-size:12.5px">16-Nov-2026</span></div><div style="margin-top:6px;color:#cfcfcf" data-k="ra.updtxt">Strong React profile, referred by the team lead.</div></div>
      </div>
    </div>
    <div><div class="abtn hv" data-k="ra.save" style="width:118px;height:42px;padding:0;color:#9fc7ff;font-weight:600;font-size:14px">Save Referral</div></div>
  </div>`;
}

/* ---------- Referral Dashboard ---------- */
const REFS = [
  ["Chloe Martin", "Not matched", "chloe.martin@example.com", "7700601234", "React Developer", "4 yrs", "Berlin", ["New", "gray"], "Demo User", "Nov 16, 2026"],
  ["Ethan Brooks", "Not matched", "ethan.brooks@example.com", "7700602345", ".NET Angular", "3 yrs", "Madrid", ["Shortlisted", "blue"], "Mia Johansson", "Nov 14, 2026"],
  ["Grace Turner", "Not matched", "grace.turner@example.com", "7700603456", "QA Engineer", "2 yrs", "London", ["Applied", "gray"], "Oliver Bennett", "Nov 11, 2026"],
  ["Thomas Wright", "Not matched", "thomas.wright@example.com", "7700604567", "DevOps Engineer", "5 yrs", "Amsterdam", ["Selected", "green"], "Paul Evans", "Nov 05, 2026"],
  ["Clara Jensen", "Not matched", "clara.jensen@example.com", "7700605678", "UI/UX Designer", "3 yrs", "Lisbon", ["Rejected", "red"], "Laura Schmidt", "Oct 29, 2026"],
  ["Daniel Weber", "Not matched", "daniel.weber@example.com", "7700606789", "Business Analyst", "6 yrs", "Paris", ["Joined", "green"], "Peter Lindberg", "Oct 14, 2026"],
];
function pgRefDash() {
  const cols = "40px 150px 110px 250px 120px 150px 100px 120px 90px 120px 130px 120px 1fr";
  const head = ["#", H("Candidate"), H("Matched"), H("Email"), H("Mobile"), H("Position"), H("Experience"), H("Location"), H("Resume"), H("Status"), H("Referred By"), H("Date"), "Actions"];
  const rows = REFS.map((r, i) => [REFS.length - i, `<b>${r[0]}</b>`, r[1], r[2], r[3], r[4], r[5], r[6], `<span style="color:#7fb0f0;text-decoration:underline">${ic("File")} View</span>`, stc(...r[7]), r[8], r[9], `<span class="bell" style="width:30px;height:30px;font-size:14px;background:#122033;border-color:#1c3552">${ic("Eye")}</span>`]);
  const tl = (k, l, v) => `<div class="kpi hv" data-k="${k}" style="height:64px;display:flex;align-items:center;gap:14px;padding:0 16px"><span style="width:42px;height:42px;border-radius:10px;background:#60a5fa;color:#0b2a52;font-size:21px;display:flex;align-items:center;justify-content:center">${ic("IdCard")}</span><div><div style="font-size:12.5px;letter-spacing:.6px;color:#d0d0d0">${l}</div><div data-k="${k}.n" style="font-size:25px;font-weight:700;color:#fff;margin-top:1px">${v}</div></div></div>`;
  return `<div class="pg">
    ${hdr("rd", { title: "All Referrals", chip: "6 Records", sub: "Review referral performance, candidates, and outcomes.", search: "Search referrals" })}
    <div class="card" style="flex:1;padding:16px 17px 0">
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:16px">${tl("rd.t0", "APPLIED", 6)}${tl("rd.t1", "SHORTLISTED", 1)}${tl("rd.t2", "SELECTED", 1)}${tl("rd.t3", "JOINED", 1)}${tl("rd.t4", "DECLINED", 0)}${tl("rd.t5", "REJECTED", 1)}</div>
      <div style="margin:16px 0 12px;font-size:14.5px;color:#d8d8d8;display:flex;align-items:center;gap:9px">${ic("Info")}Click a tile to filter the list</div>
      <div class="tabs" style="height:46px"><div class="tab on hv" data-k="rd.tabList" style="height:46px;padding:0 22px">List</div><div class="tab hv" data-k="rd.tabAn" style="height:46px;padding:0 22px">Analytics</div></div>
      <div style="margin-top:16px">${table("rd", cols, head, rows, { rowH: 50, foot: `<div style="height:56px;border-top:1px solid #272727;position:relative;font-size:13px;color:#a8a8a8"><div style="position:absolute;left:14px;top:19px">Rows per page</div><div class="inp" style="position:absolute;left:112px;top:8px;width:74px;height:38px;line-height:36px;font-weight:700">20</div><div style="position:absolute;right:22px;top:19px;color:#d6d6d6">Page 1 of 1</div></div>` })}</div>
    </div></div>`;
}

/* ---------- Leave & Absence ---------- */
function pgLeave() {
  const cols = "220px 150px 220px 160px 1fr 150px 190px";
  const head = ["Employee", "Leave date", "Type", "Status", "Remark", "Raised by", "Action"];
  let mi = 0;
  const mk = (e, d, t, s, c, r, rm) => { const n = mi++; return [`<b>${e}</b>`, d, t, stc(s, c), rm, r, `<span style="display:flex;gap:8px"><span class="sbtn ok hv" data-k="lv.ap${n}">Approve</span><span class="sbtn no hv" data-k="lv.rj${n}">Reject</span></span>`]; };
  const old = [
    mk("Felix Wagner", "10-Nov-2026, Tue", "Paid Leave", "Approved", "green", "Felix Wagner", "Family function"),
    mk("Laura Schmidt", "11-Nov-2026, Wed", "Work From Home (WFH)", "Approved", "green", "Laura Schmidt", "Internet installation at home"),
    mk("Peter Lindberg", "09-Nov-2026, Mon", "Client / Project Holiday", "Pending", "amber", "Mia Johansson", "Client site closed"),
  ];
  const nw = [
    mk("Julia Meyer", "12-Nov-2026, Thu", "Paid Leave", "Pending", "amber", "Demo User", "Fever, doctor advised rest"),
    mk("Julia Meyer", "13-Nov-2026, Fri", "Paid Leave", "Pending", "amber", "Demo User", "Fever, doctor advised rest"),
  ];
  const rows = [...old, ...nw];
  const row = (r, i) => r;
  return `<div class="pg">
    ${hdr("lv", { title: "Leave &amp; Absence", chip: "All requests", right: `<div class="abtn hv" data-k="lv.new" style="border-color:#2a5aa0;background:#13233a">${ic("CirclePlus")}New request</div>${bell()}<div class="bell hv" style="color:#cfcfcf">${ic("RotateCw")}</div><div class="bell hv" style="color:#cfcfcf">${ic("SlidersHorizontal")}</div>` })}
    <div class="card" data-k="lv.panel" style="padding:22px 14px 20px 14px;flex:none">
      <div style="display:flex;align-items:center"><div style="font-size:16px;font-weight:700;color:#7fb7ff;padding-left:2px">New leave / absence / client holiday</div><div class="sp"></div><span class="bell" style="width:34px;height:34px;color:#cfcfcf">${ic("X")}</span></div>
      <div style="display:grid;grid-template-columns:446px 222px 222px 1fr 330px;gap:14px;margin-top:14px;align-items:start">
        <div><div class="lbl" style="font-size:13px;margin-bottom:6px">Employee</div><div class="inp" data-k="lv.search" data-ph="Search name or code" data-kind="text"><span class="txt"></span></div><div class="inp" data-k="lv.emp" data-ph="Select employee" data-kind="text" style="margin-top:8px"><span class="txt"></span></div></div>
        ${fld("lv.from", "From", { kind: "date", val: "16-11-2026", cal: 1 })}${fld("lv.to", "To", { kind: "date", val: "16-11-2026", cal: 1 })}
        <div><div class="lbl" style="font-size:13px;margin-bottom:6px">Type</div><div style="display:flex;gap:8px;flex-wrap:wrap">${rad("lv.r0", "Paid Leave", 1)}${rad("lv.r1", "Unpaid Leave (LOP)")}${rad("lv.r2", "Absent (unauthorised)")}${rad("lv.r3", "Work From Home (WFH)")}${rad("lv.r4", "Client / Project Holiday")}</div></div>
        <div><div class="lbl" style="font-size:13px;margin-bottom:6px">Duration</div><div style="display:flex;gap:8px">${rad("lv.d0", "Full day", 1)}${rad("lv.d1", "Half day")}</div></div>
      </div>
      <div style="margin-top:14px"><div class="lbl" style="font-size:13px;margin-bottom:6px">Remark</div><div class="inp" data-k="lv.remark" data-ph="Reason (min 3 characters)" data-kind="text"><span class="txt"></span></div></div>
      <div style="display:flex;align-items:center;margin-top:14px"><div style="font-size:12.5px;color:#a9a9a9">One request per working day, week-offs and office holidays skipped. Dates must be today or earlier, and every day is raised or none.</div><div class="sp"></div><div class="abtn hv" data-k="lv.cancel" style="height:42px;padding:0 20px;color:#cfd8e6">Cancel</div><div class="abtn hv" data-k="lv.submit" style="height:42px;padding:0 22px;margin-left:10px;color:#e6e6e6;border-color:#3a3a3a">Submit for approval</div></div>
    </div>
    <div class="card" style="flex:none;overflow:hidden">${table("lv", cols, head, rows, { rowH: 48 })}</div></div>`;
}

/* ---------- Leave Policies ---------- */
function pgLeavePol() {
  const kp = (k, l, v) => `<div class="card" style="height:118px;padding:28px 38px"><div style="font-size:14px;color:#cfcfcf">${l}</div><div data-k="${k}" style="font-size:25px;font-weight:700;color:#fff;margin-top:10px">${v}</div></div>`;
  const pol = [["01", "Paid-sick-leave", 7, 22], ["02", "Paid-casual-leave", 7, 28], ["03", "Paid-privilege-leave", 12, 48], ["04", "Earned-leave", 15, 0]];
  const pcols = "40px 60px 1fr 160px 150px 150px 190px";
  const prow = pol.map((p, i) => [i + 1, `<span style="color:#d946ef;font-size:11px">${p[0]}</span>`, p[1], p[2] + "", p[3] === 0 && i === 3 ? "Yes" : "No", i === 3 ? "Yes" : "No", `<span style="display:block;width:108px;height:6px;border-radius:3px;background:#262626"><span style="display:block;height:6px;border-radius:3px;background:#2563eb;width:${p[3]}%"></span></span>`]);
  const hol = [["01-Jan-2026, Thu", "New Year's Day"], ["01-May-2026, Fri", "Labour Day"], ["25-Dec-2026, Fri", "Christmas Day"]];
  return `<div class="pg" style="gap:14px">
    <div style="height:56px;display:flex;align-items:center;gap:12px;font-size:25px;font-weight:600;color:#f3f3f3;padding-left:8px"><span style="color:#60a5fa;font-size:23px">${ic("House")}</span><span style="color:#8d8d8d">/</span>Leave Policies &amp; Holidays</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${kp("lp.k0", "Policy Count", 3)}${kp("lp.k1", "Holidays in 2026", 2)}${kp("lp.k2", "Carry Forward Policies", 0)}${kp("lp.k3", "Encashable Policies", 0)}</div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 668px;gap:16px;align-items:start">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card" style="padding:28px 38px 26px"><div style="font-size:18px;font-weight:700;color:#f3f3f3">Manage Leave Policy</div>
          <div style="display:grid;grid-template-columns:218px 218px 136px 120px 130px;gap:10px;margin-top:20px;align-items:end">
            ${fld("lp.id", "Policy Id", { ph: "" })}${fld("lp.name", "Policy Name", { ph: "" })}${fld("lp.limit", "Annual Limit", { ph: "" })}
            <div style="height:42px;display:flex;align-items:center">${cb("lp.cf", "Carry Fwd")}</div><div style="height:42px;display:flex;align-items:center">${cb("lp.en", "Encashable")}</div></div>
          <div class="abtn solid hv" data-k="lp.save" style="margin-top:14px;width:139px;height:46px;padding:0;font-size:17px">Save Policy</div></div>
        <div class="card" style="padding:32px 38px 28px"><div style="display:flex;align-items:center"><div style="font-size:18px;font-weight:700;color:#f3f3f3">Leave Policy Matrix</div><div class="sp"></div><div class="inp" data-k="lp.psearch" data-ph="Search policy id or name" data-kind="text" style="width:280px;height:38px;line-height:36px"><span class="txt"></span></div></div>
          <div style="margin-top:22px">${(() => {
            const g = pcols;
            const th = `<div class="th" style="grid-template-columns:${g};font-size:10.5px;letter-spacing:.5px;background:#1f1f1f;height:32px">${["#", "ID", "POLICY", "ANNUAL LIMIT", "CARRY FORWARD", "ENCASHABLE", "USAGE"].map((h) => `<div class="c" style="color:#8ab8f5;font-weight:700">${h}</div>`).join("")}</div>`;
            return `<div class="tbl" data-k="lp.tbl" style="border:0;background:transparent">${th}${prow.map((r, i) => `<div class="tr hv" data-k="lp.row${i}" style="grid-template-columns:${g};min-height:44px">${r.map((c) => `<div class="c" style="display:flex;align-items:center;font-size:13px">${c}</div>`).join("")}</div>`).join("")}</div>`;
          })()}</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card" style="padding:30px 38px 28px"><div style="font-size:18px;font-weight:700;color:#f3f3f3">Add Office Holiday</div><div style="font-size:13.5px;color:#b9b9b9;margin-top:8px;line-height:1.45">Paid for everyone in the selected companies, with no request needed. Anyone who works that day is counted as present. Client or project holidays are recorded per employee in User Attendance or Leave &amp; Absence.</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">${fld("lp.hdate", "Date", { kind: "date", ph: "dd-mm-yyyy", cal: 1 })}${fld("lp.happ", "Applies to", { val: "All companies" })}</div>
          <div style="display:grid;grid-template-columns:1fr 176px;gap:10px;margin-top:14px;align-items:end">${fld("lp.hname", "Name", { ph: "" })}<div class="abtn solid hv" data-k="lp.hadd" style="height:42px;padding:0;font-size:17px">Add</div></div></div>
        <div class="card" style="padding:30px 38px 26px"><div style="display:flex;align-items:center;gap:12px"><span class="bell" style="width:34px;height:34px;color:#cfcfcf">${ic("ChevronLeft")}</span><span style="font-size:18px;font-weight:700;color:#f3f3f3">Holiday Calendar 2026</span><span class="bell" style="width:34px;height:34px;color:#cfcfcf">${ic("ChevronRight")}</span><div class="sp"></div><div class="inp" style="width:232px;height:38px;line-height:36px;font-size:13.5px"><span class="ph">Search name, date or company</span></div></div>
          <div data-k="lp.hlist" style="margin-top:18px">${hol.map((h, i) => `<div data-k="lp.h${i}" style="height:62px;border-bottom:1px solid #2a2a2a;display:flex;align-items:center;padding-right:2px"><div><div style="font-size:17px;font-weight:700;color:#f3f3f3">${h[0]}</div><div style="font-size:14.5px;color:#cfcfcf;margin-top:2px">${h[1]} · All companies</div></div><div class="sp"></div><span class="sbtn del" style="height:36px;padding:0 17px;font-size:13px">Delete</span></div>`).join("")}</div></div>
      </div>
    </div></div>`;
}

/* ---------- Performance Reviews ---------- */
function pgPerf() {
  const cols = "40px 200px 280px 120px 160px 1fr";
  const head = ["#", H("Cycle"), H("Employee"), H("Score"), H("Variable Pay %"), H("Notes")];
  const rows = [
    [1, "Q2 2026", "Oliver Bennett", "4", "10", "Strong ownership of the portal release."],
    [2, "Q2 2026", "Laura Schmidt", "5", "15", "Led the mobile redesign end to end."],
    [3, "Q3 2026", "Julia Meyer", "4", "12", "Delivered the payroll module ahead of schedule."],
  ];
  return `<div class="pg">
    ${hdr("pr", { title: "Performance Review Cycle", chip: "2 Records", sub: "Create review cycles and record employee performance reviews.", search: "Search performance reviews" })}
    <div class="card" style="flex:1;padding:30px 22px 0">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px">
        <div><div style="font-size:19px;font-weight:700;color:#f3f3f3;padding-bottom:16px;border-bottom:1px solid #2c2c2c;padding-left:16px;margin-bottom:18px">Create/Update Cycle</div>
          <div style="padding-left:16px">${fld("pr.cname", "Cycle Name", { ph: "Q2 2026" })}<div style="margin-top:18px">${fld("pr.period", "Period", { ph: "Apr 2026 - Jun 2026" })}</div><div class="abtn hv" data-k="pr.save" style="margin-top:26px;width:104px;height:50px;padding:0;background:#6fa8f5;border-color:#6fa8f5;color:#fff;font-weight:600;font-size:16px">Save Cycle</div></div></div>
        <div><div style="font-size:19px;font-weight:700;color:#f3f3f3;padding-bottom:16px;border-bottom:1px solid #2c2c2c;padding-left:16px;margin-bottom:18px">Submit Employee Review</div>
          <div style="padding-left:16px"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">${fld("pr.cycle", "Cycle", { ph: "Select cycle" })}${fld("pr.emp", "Employee", { ph: "Select employee" })}${fld("pr.score", "Score (1-5)", { val: "3" })}</div>
            <div style="display:grid;grid-template-columns:2.0fr 1fr;gap:10px;margin-top:18px">${fld("pr.notes", "Manager Notes", { ph: "" })}${fld("pr.vp", "Variable Pay %", { val: "0" })}</div>
            <div class="abtn mint hv" data-k="pr.submit" style="margin-top:26px;width:130px;height:50px;padding:0;font-size:16px">Submit Review</div></div></div>
      </div>
      <div style="margin-top:42px">${table("pr", cols, head, rows, { rowH: 46 })}</div>
    </div></div>`;
}

/* ---------- Offboarding ---------- */
function pgOffReq() {
  const cols = "40px 240px 200px 200px 1fr 190px 150px";
  const head = ["#", H("Employee"), H("Resignation"), H("Last Working"), H("Reason"), H("Status"), H("FNF")];
  const rows = [
    [1, "<b>Anna Kowalski</b>", "20-Oct-2026", "19-Dec-2026", "Higher studies", stc("Approved", "green"), stc("Not started", "gray")],
    [2, "<b>Lucas Moreau</b>", "16-Nov-2026", "15-Jan-2027", "Relocating to Berlin for a larger role", stc("Pending", "amber"), stc("Not started", "gray")],
  ];
  return `<div class="pg">
    ${hdr("or", { title: "Offboarding Requests", chip: "1 Records", sub: "Submit and track employee offboarding requests.", search: "Search offboarding requests" })}
    <div class="card" style="flex:1;padding:50px 38px 0">
      <div style="display:grid;grid-template-columns:380px 380px 1fr 250px;gap:8px;align-items:end">
        ${fld("or.rdate", "Resignation Date", { kind: "date", ph: "dd-mm-yyyy", cal: 1 })}${fld("or.ldate", "Last Working Date", { kind: "date", ph: "dd-mm-yyyy", cal: 1 })}${fld("or.reason", "Reason", { ph: "" })}
        <div class="abtn soft hv" data-k="or.submit" style="height:42px;padding:0 26px;margin-left:8px;font-size:15px">Submit</div></div>
      <div style="margin-top:42px">${table("or", cols, head, rows, { rowH: 48 })}</div>
    </div></div>`;
}
function pgOffClr() {
  const cols = "40px 280px 190px 1fr 1fr 1fr 1fr";
  const head = ["#", H("Employee"), H("Status"), H("HR"), H("IT"), H("Admin"), H("Finance")];
  const cell = (k, pending) => `<span data-k="${k}" class="stc ${pending ? "amber" : "green"}">${pending ? "Pending" : "Cleared"}</span>`;
  const rows = [
    [1, "<b>Anna Kowalski</b>", stc("In progress", "blue"), stc("Cleared", "green"), stc("Cleared", "green"), stc("Pending", "amber"), stc("Pending", "amber")],
    [2, "<b>Lucas Moreau</b>", `<span data-k="oc.st">${stc("In progress", "blue")}</span>`, cell("oc.hr", 1), cell("oc.it", 1), cell("oc.ad", 1), cell("oc.fi", 1)],
  ];
  return `<div class="pg">
    ${hdr("oc", { title: "Offboarding Clearance", chip: "2 Records", sub: "Track HR, IT, administration, and finance clearance.", search: "Search clearance records" })}
    <div class="card" style="flex:1;padding:20px 17px 0">${table("oc", cols, head, rows, { rowH: 56 })}</div></div>`;
}
function pgOffFnf() {
  const cols = "40px 280px 200px 260px 220px 1fr";
  const head = ["#", H("Employee"), H("Status"), H("Current FNF"), H("Amount"), "Actions"];
  const rows = [
    [1, "<b>Anna Kowalski</b>", stc("Completed", "green"), "Settled", "€ 1,124,000", `<span class="stc green">Paid</span>`],
    [2, "<b>Lucas Moreau</b>", `<span data-k="of.st">${stc("In progress", "blue")}</span>`, `<span data-k="of.cur">Awaiting clearance</span>`, "€ 1,865,000", `<span class="sbtn ok hv" data-k="of.btn">Complete</span>`],
  ];
  return `<div class="pg">
    ${hdr("of", { title: "Offboarding FNF", chip: "2 Records", sub: "Process and complete employee full-and-final settlements.", search: "Search FNF records" })}
    <div class="card" style="flex:1;padding:20px 17px 0">${table("of", cols, head, rows, { rowH: 56 })}</div></div>`;
}
function pgExit() {
  const cols = "40px 260px 140px 200px 330px 120px 1fr";
  const head = ["#", H("Employee"), H("Rehire"), H("Experience"), H("Reason"), H("Risk"), H("Feedback")];
  const rows = [[1, "<b>Anna Kowalski</b>", "Yes", "Neutral", "Compensation / Role / Manager", "No", "Supportive manager and a good learning culture."], [2, "<b>Lucas Moreau</b>", "Yes", "Positive", "Compensation / Role / Manager", "No", "Great team. Leaving for a larger role in Berlin."]];
  return `<div class="pg">
    ${hdr("ex", { title: "Offboarding Exit Interview", chip: "1 Records", sub: "Record and review completed employee exit interviews.", search: "Search exit interviews" })}
    <div class="card" style="flex:1;padding:38px 38px 0">
      <div style="display:grid;grid-template-columns:380px 250px 380px 190px 1fr;gap:8px;align-items:end">
        ${fld("ex.case", "Completed Case", { ph: "Select case" })}${fld("ex.exp", "Experience", { val: "Neutral" })}${fld("ex.reason", "Reason Category", { val: "Compensation / Role / Manager" })}
        <div style="height:42px;display:flex;align-items:center;margin-left:8px">${cb("ex.rehire", "Rehire Eligible", 1)}</div><div style="height:42px;display:flex;align-items:center;margin-left:24px">${cb("ex.risk", "Risk Flag")}</div></div>
      <div style="display:grid;grid-template-columns:1fr 250px;gap:10px;margin-top:18px;align-items:end">${fld("ex.fb", "Feedback", { ta: 44, ph: "" })}<div class="abtn soft hv" data-k="ex.save" style="height:44px;padding:0;font-size:15px">Save Interview</div></div>
      <div style="margin-top:44px">${table("ex", cols, head, rows, { rowH: 50 })}</div>
    </div></div>`;
}

const PAGES = {
  home: pgHome, emplist: pgEmpList, empadd: pgEmpAdd, intlist: pgIntList, intadd: pgIntAdd, dwmlist: pgDwmList, dwmadd: pgDwmAdd, dwmproj: pgDwmProj,
  refadd: pgRefAdd, refdash: pgRefDash, leave: pgLeave, leavepol: pgLeavePol, perf: pgPerf, offreq: pgOffReq, offclr: pgOffClr, offfnf: pgOffFnf, exit: pgExit,
};
