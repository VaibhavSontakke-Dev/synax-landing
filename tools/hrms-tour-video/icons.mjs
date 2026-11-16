// Extracts the lucide icons used by the tour into icons.json (the page cannot import React). Run from the work folder.
import { createRequire } from "module";
import fs from "fs";
const req = createRequire("C:/Projects/synax-landing/package.json");
const React = req("react");
const { renderToStaticMarkup } = req("react-dom/server");
const L = req("lucide-react");
// name -> fallbacks, in case this lucide version renamed it
const want = {
  House: [], Timer: [], Briefcase: [], LayoutGrid: [], BriefcaseBusiness: [], Users: [], Gauge: [], Hammer: [], Box: [], MessageCircle: [], CalendarDays: [], Video: [], CircleHelp: [],
  ChevronDown: [], ChevronUp: [], ChevronLeft: [], ChevronRight: [], ContactRound: ["Contact"], UserRoundPlus: ["UserPlus"], PanelTop: ["Table"], SquarePen: ["PenSquare"],
  ClipboardCheck: [], Hourglass: [], SquareKanban: ["KanbanSquare"], SquarePlus: ["PlusSquare"], IdCard: ["ContactRound"], CalendarRange: ["CalendarDays"], SquareCheck: ["CheckSquare"],
  FileChartColumn: ["FileBarChart", "FileText"], ChartNoAxesGantt: ["GanttChart", "ListTree"], LogOut: [], Banknote: ["Wallet"], EllipsisVertical: ["MoreVertical"], Check: [], X: [],
  ArrowLeft: [], Bell: [], Search: [], ArrowDownUp: [], Plus: [], CirclePlus: ["PlusCircle"], FileSpreadsheet: [], Bookmark: [], LayoutDashboard: [], FileText: [], ChartLine: ["LineChart", "TrendingUp"],
  UserRoundSearch: ["UserSearch"], Coffee: [], UserRoundCog: ["UserCog"], File: [], ListChecks: [], CircleCheck: ["CheckCircle"], Calendar: [], User: [], Clock: [], Inbox: [], Paperclip: [],
  MessageSquareText: ["MessageSquare"], CircleAlert: ["AlertCircle"], Star: [], List: [], Info: [], Eye: [], RotateCw: [], SlidersHorizontal: [],
};
const out = {};
for (const [n, alts] of Object.entries(want)) {
  const name = [n, ...alts].find((x) => L[x]);
  if (!name) { console.log("MISSING", n); out[n] = ""; continue; }
  if (name !== n) console.log("alias", n, "->", name);
  const html = renderToStaticMarkup(React.createElement(L[name], { size: 24, strokeWidth: 2 }));
  out[n] = html.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
}
fs.writeFileSync("icons.json", JSON.stringify(out));
console.log(Object.keys(out).length, "icons");
