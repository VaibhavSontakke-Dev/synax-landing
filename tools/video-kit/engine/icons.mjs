// Extracts the Lucide icons used by the video (from the site's own lucide-react) into icons.json.
// Run by make.mjs. Extra icons for one video: video.json "icons": ["Name", ...].
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const REPO = process.env.REPO || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const req = createRequire(REPO + "/package.json");
const React = req("react");
const { renderToStaticMarkup } = req("react-dom/server");
const L = req("lucide-react");
const names = [
  "FolderKanban", "Clock", "Calculator", "Receipt", "ChartColumn", "Users", "UserRoundSearch", "Briefcase", "FileText", "CalendarDays",
  "Wallet", "Factory", "Truck", "Package", "Boxes", "Cog", "Activity", "TriangleAlert", "ShieldCheck", "ClipboardCheck", "Wrench",
  "Laptop", "KeyRound", "Lock", "Settings", "Sparkles", "Bot", "MessageSquare", "Video", "Check", "CircleCheck", "ArrowRight",
  "Search", "Bell", "Phone", "FileSpreadsheet", "Building2", "Plug", "LogIn", "LogOut", "Coffee", "Star", "DoorOpen", "ScanLine",
  "GitBranch", "Route", "Gauge", "Layers", "Send", "UserCheck", "Handshake", "TrendingUp", "ListChecks", "Warehouse", "ClipboardList",
  "BadgeCheck", "Timer", "LayoutDashboard", "Monitor", "Award", "UserPlus", "FileCheck", "Network", "CircleHelp", "X", "Plus",
  "ChevronRight", "ChevronDown", "Euro", "Hourglass", "Cpu", "Scale", "Inbox", "Stamp", "History", "Workflow", "PackageCheck",
  "BookOpen", "Mail", "CalendarCheck", "Megaphone", "Target", "PieChart", "Repeat", "Shield",
];
const video = fs.existsSync("video.json") ? JSON.parse(fs.readFileSync("video.json", "utf8")) : {};
for (const n of video.icons || []) if (!names.includes(n)) names.push(n);
const out = {};
for (const n of names) {
  if (!L[n]) {
    console.log("missing", n);
    continue;
  }
  const html = renderToStaticMarkup(React.createElement(L[n], { size: 24, strokeWidth: 2 }));
  out[n] = html.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
}
fs.writeFileSync("icons.json", JSON.stringify(out));
console.log(Object.keys(out).length, "icons");
